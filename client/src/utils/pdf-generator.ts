import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Invoice } from '@shared/schema';

export class PDFGenerator {
  static async generateInvoicePDF(invoice: Invoice, previewElement: HTMLElement): Promise<void> {
    try {
      // Create a clone of the preview element to avoid modifying the original
      const clonedElement = previewElement.cloneNode(true) as HTMLElement;
      
      // Temporarily add the cloned element to the document
      clonedElement.style.position = 'absolute';
      clonedElement.style.left = '-9999px';
      clonedElement.style.top = '0';
      clonedElement.style.width = '800px'; // Fixed width for consistent PDF output
      clonedElement.style.backgroundColor = 'white';
      clonedElement.style.padding = '40px';
      clonedElement.style.boxSizing = 'border-box';
      
      document.body.appendChild(clonedElement);

      // Wait for all images to load before generating canvas
      const images = clonedElement.querySelectorAll('img');
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          // Timeout after 5 seconds
          setTimeout(() => resolve(null), 5000);
        });
      }));

      // Generate canvas from the element
      const canvas = await html2canvas(clonedElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: clonedElement.scrollHeight + 80, // Add padding
        logging: false, // Disable logging for cleaner output
        imageTimeout: 0, // Disable timeout since we're handling it above
      });

      // Remove the cloned element
      document.body.removeChild(clonedElement);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Calculate dimensions to fit A4
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10; // 10mm top margin

      // Add the image to PDF
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight - 20; // Account for margins

      // Add new pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10; // 10mm margin
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight - 20;
      }

      // Generate filename
      const filename = `${invoice.number.replace(/[^a-zA-Z0-9]/g, '_')}_${invoice.clientName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

      // Download the PDF
      pdf.save(filename);

    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  static async generateAndPreviewPDF(invoice: Invoice, previewElement: HTMLElement): Promise<string> {
    try {
      const clonedElement = previewElement.cloneNode(true) as HTMLElement;
      
      clonedElement.style.position = 'absolute';
      clonedElement.style.left = '-9999px';
      clonedElement.style.top = '0';
      clonedElement.style.width = '800px';
      clonedElement.style.backgroundColor = 'white';
      clonedElement.style.padding = '40px';
      clonedElement.style.boxSizing = 'border-box';
      
      document.body.appendChild(clonedElement);

      // Wait for all images to load before generating canvas
      const images = clonedElement.querySelectorAll('img');
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          // Timeout after 5 seconds
          setTimeout(() => resolve(null), 5000);
        });
      }));

      const canvas = await html2canvas(clonedElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: clonedElement.scrollHeight + 80,
        logging: false,
        imageTimeout: 0,
      });

      document.body.removeChild(clonedElement);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

      // Return blob URL for preview
      const pdfBlob = pdf.output('blob');
      return URL.createObjectURL(pdfBlob);

    } catch (error) {
      console.error('Error generating PDF preview:', error);
      throw new Error('Failed to generate PDF preview. Please try again.');
    }
  }
}
