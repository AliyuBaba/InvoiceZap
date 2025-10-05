import { InvoiceItem } from "@shared/schema";

export class InvoiceCalculations {
  static calculateItemAmount(quantity: number, rate: number): number {
    return Math.round((quantity * rate) * 100) / 100;
  }

  static calculateSubtotal(items: InvoiceItem[]): number {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    return Math.round(subtotal * 100) / 100;
  }

  static calculateDiscountAmount(subtotal: number, discountPercentage: number): number {
    const discount = (subtotal * discountPercentage) / 100;
    return Math.round(discount * 100) / 100;
  }

  static calculateTaxAmount(subtotalAfterDiscount: number, taxRate: number): number {
    const tax = (subtotalAfterDiscount * taxRate) / 100;
    return Math.round(tax * 100) / 100;
  }

  static calculateTotal(subtotal: number, discountAmount: number, taxAmount: number): number {
    const total = subtotal - discountAmount + taxAmount;
    return Math.round(total * 100) / 100;
  }

  static calculateAllTotals(items: InvoiceItem[], discountPercentage: number, taxRate: number) {
    const subtotal = this.calculateSubtotal(items);
    const discountAmount = this.calculateDiscountAmount(subtotal, discountPercentage);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const taxAmount = this.calculateTaxAmount(subtotalAfterDiscount, taxRate);
    const total = this.calculateTotal(subtotal, discountAmount, taxAmount);

    return {
      subtotal,
      discountAmount,
      taxAmount,
      total
    };
  }

  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  static formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }
}
