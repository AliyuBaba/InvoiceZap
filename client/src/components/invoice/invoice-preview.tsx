import { Invoice } from '@shared/schema';
import { InvoiceCalculations } from '@/utils/calculations';
import { Button } from '@/components/ui/button';

interface InvoicePreviewProps {
  invoice: Invoice;
  onPrint?: () => void;
  onFullscreen?: () => void;
}

export function InvoicePreview({ invoice, onPrint, onFullscreen }: InvoicePreviewProps) {
  return (
    <div className="lg:sticky lg:top-24">
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="bg-muted px-4 py-3 border-b border-border flex items-center justify-between">
          <h3 className="font-medium text-foreground">Invoice Preview</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onPrint}
              className="p-1 h-auto"
              title="Print"
              data-testid="button-print"
            >
              <i className="fas fa-print text-sm"></i>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onFullscreen}
              className="p-1 h-auto"
              title="Fullscreen"
              data-testid="button-fullscreen"
            >
              <i className="fas fa-expand text-sm"></i>
            </Button>
          </div>
        </div>
        
        <div className="p-8 bg-white text-gray-900" id="invoice-preview" data-testid="invoice-preview">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                {invoice.companyProfile.logo ? (
                  <img
                    src={invoice.companyProfile.logo}
                    alt="Company Logo"
                    className="w-full h-full object-contain"
                    data-testid="company-logo"
                    onError={(e) => {
                      console.error('Logo failed to load:', invoice.companyProfile.logo);
                      e.currentTarget.style.display = 'none';
                    }}
                    onLoad={() => {
                      console.log('Logo loaded successfully');
                    }}
                  />
                ) : (
                  <i className="fas fa-building text-blue-600 text-xl" data-testid="logo-placeholder"></i>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900" data-testid="text-company-name">
                  {invoice.companyProfile.name || 'Your Company Name'}
                </h1>
                <p className="text-gray-600" data-testid="text-company-email">
                  {invoice.companyProfile.email || 'your@email.com'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold text-blue-600">INVOICE</h2>
              <p className="text-gray-600" data-testid="text-invoice-number">
                # {invoice.number || 'INV-XXXX-XXX'}
              </p>
            </div>
          </div>

          {/* Company and Client Info */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">From:</h3>
              <div className="text-gray-600 space-y-1">
                <p data-testid="text-from-company">{invoice.companyProfile.name || 'Your Company Name'}</p>
                {invoice.companyProfile.address && (
                  <p className="whitespace-pre-line" data-testid="text-from-address">
                    {invoice.companyProfile.address}
                  </p>
                )}
                {invoice.companyProfile.phone && (
                  <p data-testid="text-from-phone">{invoice.companyProfile.phone}</p>
                )}
                {invoice.companyProfile.website && (
                  <p data-testid="text-from-website">{invoice.companyProfile.website}</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
              <div className="text-gray-600 space-y-1">
                <p data-testid="text-to-client">{invoice.clientName || 'Client Name'}</p>
                {invoice.clientAddress && (
                  <p className="whitespace-pre-line" data-testid="text-to-address">
                    {invoice.clientAddress}
                  </p>
                )}
                {invoice.clientEmail && (
                  <p data-testid="text-to-email">{invoice.clientEmail}</p>
                )}
              </div>
            </div>
          </div>

          {/* Invoice Dates */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="flex justify-between">
              <span className="text-gray-600">Invoice Date:</span>
              <span className="font-medium" data-testid="text-invoice-date">
                {invoice.date ? InvoiceCalculations.formatDate(invoice.date) : 'Date'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Due Date:</span>
              <span className="font-medium" data-testid="text-due-date">
                {invoice.dueDate ? InvoiceCalculations.formatDate(invoice.dueDate) : 'Due Date'}
              </span>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 text-gray-900 font-semibold">Description</th>
                  <th className="text-center py-3 text-gray-900 font-semibold w-16">Qty</th>
                  <th className="text-right py-3 text-gray-900 font-semibold w-24">Rate</th>
                  <th className="text-right py-3 text-gray-900 font-semibold w-24">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500 italic">
                      No items added yet
                    </td>
                  </tr>
                ) : (
                  invoice.items.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="py-3 text-gray-700" data-testid={`text-preview-item-description-${index}`}>
                        {item.description || 'Item description'}
                      </td>
                      <td className="py-3 text-center text-gray-700" data-testid={`text-preview-item-quantity-${index}`}>
                        {item.quantity}
                      </td>
                      <td className="py-3 text-right text-gray-700" data-testid={`text-preview-item-rate-${index}`}>
                        {InvoiceCalculations.formatCurrency(item.rate, invoice.currency)}
                      </td>
                      <td className="py-3 text-right font-medium text-gray-900" data-testid={`text-preview-item-amount-${index}`}>
                        {InvoiceCalculations.formatCurrency(item.amount, invoice.currency)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end">
            <div className="w-80">
              <div className="space-y-2">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium" data-testid="text-subtotal">
                    {InvoiceCalculations.formatCurrency(invoice.subtotal, invoice.currency)}
                  </span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Discount ({invoice.discount}%):</span>
                    <span className="font-medium text-green-600" data-testid="text-discount">
                      -{InvoiceCalculations.formatCurrency(invoice.discountAmount, invoice.currency)}
                    </span>
                  </div>
                )}
                {invoice.taxRate > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Tax ({invoice.taxRate}%):</span>
                    <span className="font-medium" data-testid="text-tax">
                      {InvoiceCalculations.formatCurrency(invoice.taxAmount, invoice.currency)}
                    </span>
                  </div>
                )}
                <div className="border-t-2 border-gray-300 pt-2">
                  <div className="flex justify-between py-2">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-blue-600" data-testid="text-total">
                      {InvoiceCalculations.formatCurrency(invoice.total, invoice.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {invoice.notes && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Notes:</h4>
              <p className="text-gray-600 whitespace-pre-line" data-testid="text-notes">
                {invoice.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
