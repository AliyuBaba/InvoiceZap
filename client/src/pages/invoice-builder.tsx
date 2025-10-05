import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useInvoiceData } from '@/hooks/use-invoice-data';
import { CompanyProfileForm } from '@/components/invoice/company-profile-form';
import { ClientInfoForm } from '@/components/invoice/client-info-form';
import { InvoiceDetailsForm } from '@/components/invoice/invoice-details-form';
import { InvoiceItemsTable } from '@/components/invoice/invoice-items-table';
import { CalculationsForm } from '@/components/invoice/calculations-form';
import { InvoicePreview } from '@/components/invoice/invoice-preview';
import { PDFExportButton } from '@/components/invoice/pdf-export-button';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

export default function InvoiceBuilder() {
  const {
    invoice,
    addItem,
    removeItem,
    updateItem,
    updateCompanyProfile,
    updateInvoice,
    saveInvoice,
    createNewInvoice,
    validateInvoice,
  } = useInvoiceData();

  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = useState<'input' | 'preview'>('input');

  const handleSaveTemplate = () => {
    const validation = validateInvoice();
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors[0],
        variant: "destructive"
      });
      return;
    }

    saveInvoice();
    toast({
      title: "Invoice Saved",
      description: "Your invoice has been saved successfully."
    });
  };

  const handleNewInvoice = () => {
    createNewInvoice();
    toast({
      title: "New Invoice",
      description: "Started a new invoice with your company profile."
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFullscreen = () => {
    const previewElement = document.getElementById('invoice-preview');
    if (previewElement) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        previewElement.requestFullscreen().catch(err => {
          console.error('Error attempting to enable fullscreen:', err);
        });
      }
    }
  };

  const handleGoToPreview = () => {
    const validation = validateInvoice();
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors[0],
        variant: "destructive"
      });
      return;
    }
    setCurrentStep('preview');
  };

  const handleBackToInput = () => {
    setCurrentStep('input');
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center cursor-pointer">
                  <i className="fas fa-bolt text-primary-foreground text-sm"></i>
                </div>
              </Link>
              <h1 className="text-xl font-bold text-foreground">ZapInvoice</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewInvoice}
                title="New Invoice"
                data-testid="button-new-invoice"
              >
                <i className="fas fa-plus"></i>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveTemplate}
                title="Save Invoice"
                data-testid="button-save-invoice"
              >
                <i className="fas fa-save"></i>
              </Button>
              {!isMobile && currentStep === 'preview' && (
                <PDFExportButton invoice={invoice} />
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {currentStep === 'input' ? (
          <div className="max-w-4xl mx-auto space-y-6">
            <CompanyProfileForm
              companyProfile={invoice.companyProfile}
              onUpdate={updateCompanyProfile}
            />
            <ClientInfoForm
              invoice={invoice}
              onUpdate={updateInvoice}
            />
            <InvoiceDetailsForm
              invoice={invoice}
              onUpdate={updateInvoice}
            />
            <InvoiceItemsTable
              items={invoice.items}
              currency={invoice.currency}
              onAddItem={addItem}
              onRemoveItem={removeItem}
              onUpdateItem={updateItem}
            />
            <CalculationsForm
              invoice={invoice}
              onUpdate={updateInvoice}
            />
            <div className="flex justify-end pt-4">
              <Button 
                size="lg" 
                onClick={handleGoToPreview}
                data-testid="button-preview-invoice"
              >
                Preview Invoice
                <i className="fas fa-arrow-right ml-2"></i>
              </Button>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <Button 
                variant="outline"
                onClick={handleBackToInput}
                data-testid="button-back-to-input"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Edit
              </Button>
              <PDFExportButton invoice={invoice} />
            </div>
            <InvoicePreview
              invoice={invoice}
              onPrint={handlePrint}
              onFullscreen={handleFullscreen}
            />
          </div>
        )}
      </div>

      {/* Mobile Navigation Bottom Bar */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 pb-safe">
          <div className="flex justify-around py-2">
            <Link href="/">
              <button className="flex flex-col items-center py-2 px-4 text-muted-foreground hover:text-primary" data-testid="button-mobile-home">
                <i className="fas fa-home text-lg"></i>
                <span className="text-xs mt-1">Home</span>
              </button>
            </Link>
            <button 
              className={`flex flex-col items-center py-2 px-4 ${currentStep === 'input' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              onClick={() => setCurrentStep('input')}
              data-testid="button-mobile-input"
            >
              <i className="fas fa-edit text-lg"></i>
              <span className="text-xs mt-1">Edit</span>
            </button>
            <button 
              className={`flex flex-col items-center py-2 px-4 ${currentStep === 'preview' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              onClick={handleGoToPreview}
              data-testid="button-mobile-preview"
            >
              <i className="fas fa-eye text-lg"></i>
              <span className="text-xs mt-1">Preview</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
