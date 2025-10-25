import { useState, useEffect, useCallback, useRef } from 'react';
import { Invoice, InvoiceItem, CompanyProfile } from '@shared/schema';
import { InvoiceCalculations } from '@/utils/calculations';
import { StorageService } from '@/utils/storage';
import { useSessionStorage } from './use-local-storage';

const createDefaultCompanyProfile = (): CompanyProfile => ({
  id: crypto.randomUUID(),
  name: '',
  email: '',
  phone: '',
  website: '',
  address: '',
  logo: '',
});

const createDefaultInvoice = (): Invoice => ({
  id: crypto.randomUUID(),
  number: StorageService.getNextInvoiceNumber(),
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  currency: 'USD',
  clientName: '',
  clientEmail: '',
  clientAddress: '',
  items: [],
  subtotal: 0,
  discount: 0,
  discountAmount: 0,
  taxRate: 0,
  taxAmount: 0,
  total: 0,
  notes: '',
  companyProfile: createDefaultCompanyProfile(),
});

export function useInvoiceData() {
  const [invoice, setInvoice] = useSessionStorage<Invoice>('zapinvoice_draft_invoice', createDefaultInvoice());
  const [isCalculating, setIsCalculating] = useState(false);

  // Optimize for fast page refresh by minimizing initial calculations
  useEffect(() => {
    // Only calculate totals if there are items to avoid unnecessary computations on refresh
    if (invoice.items.length > 0) {
      setTimeout(calculateTotals, 0);
    }
  }, []); // Empty dependency array to run only on mount

  // Manual calculate function that can be called when needed
  const calculateTotals = useCallback(() => {
    setInvoice(currentInvoice => {
      // Recalculate item amounts first
      const updatedItems = currentInvoice.items.map(item => ({
        ...item,
        amount: InvoiceCalculations.calculateItemAmount(item.quantity, item.rate)
      }));

      const totals = InvoiceCalculations.calculateAllTotals(
        updatedItems,
        currentInvoice.discount,
        currentInvoice.taxRate
      );

      return {
        ...currentInvoice,
        items: updatedItems,
        ...totals
      };
    });
  }, []);

  // Add new invoice item
  const addItem = useCallback(() => {
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    };

    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
    setTimeout(calculateTotals, 0);
  }, [calculateTotals]);

  // Remove invoice item
  const removeItem = useCallback((itemId: string) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
    setTimeout(calculateTotals, 0);
  }, [calculateTotals]);

  // Update invoice item
  const updateItem = useCallback((itemId: string, updates: Partial<InvoiceItem>) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    }));
    setTimeout(calculateTotals, 0);
  }, [calculateTotals]);

  // Update company profile
  const updateCompanyProfile = useCallback((updates: Partial<CompanyProfile>) => {
    setInvoice(prev => ({
      ...prev,
      companyProfile: { ...prev.companyProfile, ...updates }
    }));
  }, [setInvoice]);

  // Update invoice fields
  const updateInvoice = useCallback((updates: Partial<Invoice>) => {
    setInvoice(prev => ({ ...prev, ...updates }));
    // If discount or tax rate changed, recalculate
    if ('discount' in updates || 'taxRate' in updates) {
      setTimeout(calculateTotals, 0);
    }
  }, [calculateTotals]);

  // Save company profile to localStorage
  const saveCompanyProfile = useCallback(() => {
    StorageService.saveCompanyProfile(invoice.companyProfile);
  }, [invoice.companyProfile]);

  // Load company profile from localStorage
  const loadCompanyProfile = useCallback((profileId: string) => {
    const profiles = StorageService.getCompanyProfiles();
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      updateCompanyProfile(profile);
    }
  }, [updateCompanyProfile]);

  // Save current invoice
  const saveInvoice = useCallback(() => {
    StorageService.saveCurrentInvoice(invoice);
  }, [invoice]);

  // Create new invoice
  const createNewInvoice = useCallback(() => {
    const newInvoice = createDefaultInvoice();
    // Keep the company profile if it exists
    if (invoice.companyProfile.name) {
      newInvoice.companyProfile = invoice.companyProfile;
    }
    setInvoice(newInvoice);
  }, [invoice.companyProfile, setInvoice]);

  // Load saved invoice
  const loadSavedInvoice = useCallback(() => {
    const savedInvoice = StorageService.getCurrentInvoice();
    if (savedInvoice) {
      setInvoice(savedInvoice);
    }
  }, [setInvoice]);

  // Validation
  const validateInvoice = useCallback((): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!invoice.companyProfile.name) errors.push('Company name is required');
    if (!invoice.companyProfile.email) errors.push('Company email is required');
    if (!invoice.clientName) errors.push('Client name is required');
    if (!invoice.number) errors.push('Invoice number is required');
    if (!invoice.date) errors.push('Invoice date is required');
    if (!invoice.dueDate) errors.push('Due date is required');
    if (invoice.items.length === 0) errors.push('At least one item is required');
    
    invoice.items.forEach((item, index) => {
      if (!item.description) errors.push(`Item ${index + 1}: Description is required`);
      if (item.quantity <= 0) errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
      if (item.rate < 0) errors.push(`Item ${index + 1}: Rate cannot be negative`);
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [invoice]);

  return {
    invoice,
    isCalculating,
    addItem,
    removeItem,
    updateItem,
    updateCompanyProfile,
    updateInvoice,
    saveCompanyProfile,
    loadCompanyProfile,
    saveInvoice,
    createNewInvoice,
    loadSavedInvoice,
    validateInvoice,
    calculateTotals,
  };
}
