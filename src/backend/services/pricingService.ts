/**
 * @layer Service
 * @description Handles advanced enterprise pricing logic including volume-based B2B discounts.
 */
export class PricingService {
  /**
   * Calculates the discounted price based on order volume.
   * Logic: 
   * 1-5 units: 0% discount
   * 6-20 units: 8% discount
   * 21-50 units: 15% discount
   * 50+ units: 22% enterprise discount
   */
  public calculateB2BVolumePrice(basePrice: number, quantity: number): number {
    let discount = 0;
    
    if (quantity > 50) discount = 0.22;
    else if (quantity > 20) discount = 0.15;
    else if (quantity > 5) discount = 0.08;

    const finalPrice = basePrice * (1 - discount);
    return Math.round(finalPrice);
  }

  /**
   * Estimates net profitability for an order after estimated logistics and packaging overhead.
   */
  public estimateNetProfit(grossRevenue: number): number {
    const overheadCoefficient = 0.12; // 12% for shipping, packaging, and fulfillment
    const procurementCost = grossRevenue * 0.70; // Assuming 70% COGS for refurbished lots
    return Math.round(grossRevenue - procurementCost - (grossRevenue * overheadCoefficient));
  }
}
