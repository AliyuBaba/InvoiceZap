import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Invoice } from '@shared/schema';

interface CalculationsFormProps {
  invoice: Invoice;
  onUpdate: (updates: Partial<Invoice>) => void;
}

export function CalculationsForm({ invoice, onUpdate }: CalculationsFormProps) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <i className="fas fa-calculator mr-2 text-primary"></i>
        Calculations
      </h2>
      
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-foreground mb-2">
            Discount (%)
          </label>
          <Input
            id="discount"
            type="number"
            value={invoice.discount === 0 ? '' : invoice.discount}
            onChange={(e) => {
              const val = e.target.value;
              onUpdate({ discount: val === '' ? 0 : Number(val) });
            }}
            min="0"
            max="100"
            step="0.1"
            data-testid="input-discount"
          />
        </div>
        <div>
          <label htmlFor="tax-rate" className="block text-sm font-medium text-foreground mb-2">
            Tax Rate (%)
          </label>
          <Input
            id="tax-rate"
            type="number"
            value={invoice.taxRate === 0 ? '' : invoice.taxRate}
            onChange={(e) => {
              const val = e.target.value;
              onUpdate({ taxRate: val === '' ? 0 : Number(val) });
            }}
            min="0"
            max="100"
            step="0.1"
            data-testid="input-tax-rate"
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-2">
          Notes
        </label>
        <Textarea
          id="notes"
          value={invoice.notes || ''}
          onChange={(e) => onUpdate({ notes: e.target.value })}
          placeholder="Payment terms, additional information..."
          rows={3}
          className="resize-none"
          data-testid="input-notes"
        />
      </div>
    </div>
  );
}
