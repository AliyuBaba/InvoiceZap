import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Invoice } from '@shared/schema';

interface ClientInfoFormProps {
  invoice: Invoice;
  onUpdate: (updates: Partial<Invoice>) => void;
}

export function ClientInfoForm({ invoice, onUpdate }: ClientInfoFormProps) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <i className="fas fa-user mr-2 text-primary"></i>
        Bill To
      </h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="client-name" className="block text-sm font-medium text-foreground mb-2">
            Client Name *
          </label>
          <Input
            id="client-name"
            type="text"
            value={invoice.clientName}
            onChange={(e) => onUpdate({ clientName: e.target.value })}
            placeholder="Client company name"
            data-testid="input-client-name"
          />
        </div>
        <div>
          <label htmlFor="client-email" className="block text-sm font-medium text-foreground mb-2">
            Client Email
          </label>
          <Input
            id="client-email"
            type="email"
            value={invoice.clientEmail || ''}
            onChange={(e) => onUpdate({ clientEmail: e.target.value })}
            placeholder="client@example.com"
            data-testid="input-client-email"
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="client-address" className="block text-sm font-medium text-foreground mb-2">
          Client Address
        </label>
        <Textarea
          id="client-address"
          value={invoice.clientAddress || ''}
          onChange={(e) => onUpdate({ clientAddress: e.target.value })}
          placeholder="Client address"
          rows={3}
          className="resize-none"
          data-testid="input-client-address"
        />
      </div>
    </div>
  );
}
