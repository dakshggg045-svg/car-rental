import { differenceInDays, parseISO } from 'date-fns';

/**
 * Calculates the total rental cost.
 * Formula: (return_date - pickup_date) * daily_rate
 */
export function calculateTotalPrice(
  pickupDate: string,
  returnDate: string,
  dailyRate: number
): number {
  const start = parseISO(pickupDate);
  const end = parseISO(returnDate);
  const days = differenceInDays(end, start);

  if (days <= 0) return 0;

  // Apply discount tiers
  let discount = 0;
  if (days >= 30) discount = 0.20; // 20% off for 30+ days
  else if (days >= 14) discount = 0.15; // 15% off for 14+ days
  else if (days >= 7) discount = 0.10; // 10% off for 7+ days
  else if (days >= 3) discount = 0.05; // 5% off for 3+ days

  const subtotal = days * dailyRate;
  const discountAmount = subtotal * discount;
  return Math.round((subtotal - discountAmount) * 100) / 100;
}

/**
 * Gets the number of rental days.
 */
export function getRentalDays(pickupDate: string, returnDate: string): number {
  const start = parseISO(pickupDate);
  const end = parseISO(returnDate);
  return Math.max(0, differenceInDays(end, start));
}

/**
 * Gets the applicable discount percentage.
 */
export function getDiscountPercentage(days: number): number {
  if (days >= 30) return 20;
  if (days >= 14) return 15;
  if (days >= 7) return 10;
  if (days >= 3) return 5;
  return 0;
}

/**
 * Formats currency value.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
