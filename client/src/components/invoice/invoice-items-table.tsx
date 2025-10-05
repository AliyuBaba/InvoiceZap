import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InvoiceItem } from '@shared/schema';
import { InvoiceCalculations } from '@/utils/calculations';

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
  currency: string;
  onAddItem: () => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateItem: (itemId: string, updates: Partial<InvoiceItem>) => void;
}

export function InvoiceItemsTable({
  items,
  currency,
  onAddItem,
  onRemoveItem,
  onUpdateItem
}: InvoiceItemsTableProps) {
  
  const handleItemChange = (itemId: string, field: keyof InvoiceItem, value: string | number) => {
    const updates: Partial<InvoiceItem> = { [field]: value };
    
    // If quantity or rate changes, recalculate amount
    if (field === 'quantity' || field === 'rate') {
      const item = items.find(i => i.id === itemId);
      if (item) {
        const quantity = field === 'quantity' ? Number(value) : item.quantity;
        const rate = field === 'rate' ? Number(value) : item.rate;
        updates.amount = InvoiceCalculations.calculateItemAmount(quantity, rate);
      }
    }
    
    onUpdateItem(itemId, updates);
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <i className="fas fa-list mr-2 text-primary"></i>
          Invoice Items
        </h2>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onAddItem}
          data-testid="button-add-item"
        >
          <i className="fas fa-plus mr-1"></i>
          Add Item
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 text-sm font-medium text-muted-foreground">
                Description
              </th>
              <th className="text-center py-3 text-sm font-medium text-muted-foreground w-20">
                Qty
              </th>
              <th className="text-right py-3 text-sm font-medium text-muted-foreground w-24">
                Rate
              </th>
              <th className="text-right py-3 text-sm font-medium text-muted-foreground w-24">
                Amount
              </th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                  No items added yet. Click "Add Item" to get started.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={item.id} className="border-b border-border/50">
                  <td className="py-3">
                    <Input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      placeholder="Item description"
                      className="border-0 p-0 bg-transparent focus-visible:ring-1"
                      data-testid={`input-item-description-${index}`}
                    />
                  </td>
                  <td className="py-3 text-center">
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                      min="1"
                      className="border-0 p-0 bg-transparent text-center focus-visible:ring-1"
                      data-testid={`input-item-quantity-${index}`}
                    />
                  </td>
                  <td className="py-3">
                    <Input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(item.id, 'rate', Number(e.target.value))}
                      step="0.01"
                      min="0"
                      className="border-0 p-0 bg-transparent text-right focus-visible:ring-1"
                      data-testid={`input-item-rate-${index}`}
                    />
                  </td>
                  <td className="py-3 text-right font-medium" data-testid={`text-item-amount-${index}`}>
                    {InvoiceCalculations.formatCurrency(item.amount, currency)}
                  </td>
                  <td className="py-3 text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-destructive hover:text-destructive/80 p-1 h-auto"
                      data-testid={`button-remove-item-${index}`}
                    >
                      <i className="fas fa-trash text-xs"></i>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
