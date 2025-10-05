import { CompanyProfile, Invoice, InvoiceTemplate } from "@shared/schema";

// Local Storage Keys
const STORAGE_KEYS = {
  COMPANY_PROFILES: 'zapinvoice_company_profiles',
  INVOICE_TEMPLATES: 'zapinvoice_invoice_templates',
  CURRENT_INVOICE: 'zapinvoice_current_invoice',
  APP_SETTINGS: 'zapinvoice_app_settings',
} as const;

// Session Storage Keys
const SESSION_KEYS = {
  DRAFT_INVOICE: 'zapinvoice_draft_invoice',
} as const;

export class StorageService {
  // Company Profiles
  static getCompanyProfiles(): CompanyProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPANY_PROFILES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveCompanyProfile(profile: CompanyProfile): void {
    const profiles = this.getCompanyProfiles();
    const existingIndex = profiles.findIndex(p => p.id === profile.id);
    
    if (existingIndex >= 0) {
      profiles[existingIndex] = profile;
    } else {
      profile.id = profile.id || crypto.randomUUID();
      profiles.push(profile);
    }
    
    localStorage.setItem(STORAGE_KEYS.COMPANY_PROFILES, JSON.stringify(profiles));
  }

  static deleteCompanyProfile(id: string): void {
    const profiles = this.getCompanyProfiles().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.COMPANY_PROFILES, JSON.stringify(profiles));
  }

  // Invoice Templates
  static getInvoiceTemplates(): InvoiceTemplate[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INVOICE_TEMPLATES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveInvoiceTemplate(template: InvoiceTemplate): void {
    const templates = this.getInvoiceTemplates();
    const existingIndex = templates.findIndex(t => t.id === template.id);
    
    if (existingIndex >= 0) {
      templates[existingIndex] = template;
    } else {
      templates.push(template);
    }
    
    localStorage.setItem(STORAGE_KEYS.INVOICE_TEMPLATES, JSON.stringify(templates));
  }

  static deleteInvoiceTemplate(id: string): void {
    const templates = this.getInvoiceTemplates().filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.INVOICE_TEMPLATES, JSON.stringify(templates));
  }

  // Current Invoice (persistent)
  static getCurrentInvoice(): Invoice | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_INVOICE);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static saveCurrentInvoice(invoice: Invoice): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_INVOICE, JSON.stringify(invoice));
  }

  static clearCurrentInvoice(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_INVOICE);
  }

  // Draft Invoice (session only)
  static getDraftInvoice(): Partial<Invoice> | null {
    try {
      const data = sessionStorage.getItem(SESSION_KEYS.DRAFT_INVOICE);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static saveDraftInvoice(invoice: Partial<Invoice>): void {
    sessionStorage.setItem(SESSION_KEYS.DRAFT_INVOICE, JSON.stringify(invoice));
  }

  static clearDraftInvoice(): void {
    sessionStorage.removeItem(SESSION_KEYS.DRAFT_INVOICE);
  }

  // Image handling
  static async convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  static validateImageFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Please upload a valid image file (PNG, JPG, GIF, WebP)' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'Image size must be less than 2MB' };
    }

    return { valid: true };
  }
}
