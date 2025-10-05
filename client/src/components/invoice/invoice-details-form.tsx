import { Input } from '@/components/ui/input';
import { Invoice } from '@shared/schema';

interface InvoiceDetailsFormProps {
  invoice: Invoice;
  onUpdate: (updates: Partial<Invoice>) => void;
}

export function InvoiceDetailsForm({ invoice, onUpdate }: InvoiceDetailsFormProps) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <i className="fas fa-file-invoice mr-2 text-primary"></i>
        Invoice Details
      </h2>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="invoice-number" className="block text-sm font-medium text-foreground mb-2">
            Invoice Number *
          </label>
          <Input
            id="invoice-number"
            type="text"
            value={invoice.number}
            onChange={(e) => onUpdate({ number: e.target.value })}
            placeholder="INV-2024-001"
            data-testid="input-invoice-number"
          />
        </div>
        <div>
          <label htmlFor="invoice-date" className="block text-sm font-medium text-foreground mb-2">
            Invoice Date *
          </label>
          <Input
            id="invoice-date"
            type="date"
            value={invoice.date}
            onChange={(e) => onUpdate({ date: e.target.value })}
            data-testid="input-invoice-date"
          />
        </div>
        <div>
          <label htmlFor="due-date" className="block text-sm font-medium text-foreground mb-2">
            Due Date *
          </label>
          <Input
            id="due-date"
            type="date"
            value={invoice.dueDate}
            onChange={(e) => onUpdate({ dueDate: e.target.value })}
            data-testid="input-due-date"
          />
        </div>
      </div>
    </div>
  );
}
