import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Invoice } from '@shared/schema';
import { PDFGenerator } from '@/utils/pdf-generator';
import { useToast } from '@/hooks/use-toast';

interface PDFExportButtonProps {
  invoice: Invoice;
  disabled?: boolean;
  className?: string;
}

export function PDFExportButton({ invoice, disabled = false, className = '' }: PDFExportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleExportPDF = async () => {
    const previewElement = document.getElementById('invoice-preview');
    if (!previewElement) {
      toast({
        title: "Export Failed",
        description: "Invoice preview not found. Please try again.",
        variant: "destructive"
      });
      return;
    }

    // Basic validation
    if (!invoice.companyProfile.name || !invoice.clientName || invoice.items.length === 0) {
      toast({
        title: "Incomplete Invoice",
        description: "Please fill in company name, client name, and add at least one item before exporting.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      await PDFGenerator.generateInvoicePDF(invoice, previewElement);
      toast({
        title: "PDF Generated",
        description: "Your invoice has been exported successfully."
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleExportPDF}
      disabled={disabled || isGenerating}
      className={className}
      data-testid="button-export-pdf"
    >
      {isGenerating ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
          Generating...
        </>
      ) : (
        <>
          <i className="fas fa-download mr-2"></i>
          Export PDF
        </>
      )}
    </Button>
  );
}
