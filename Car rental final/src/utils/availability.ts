import { Reservation } from '@/types';
import { parseISO, isWithinInterval, areIntervalsOverlapping } from 'date-fns';

/**
 * Checks if a vehicle is available for a given date range.
 * Prevents double-booking by ensuring no overlapping reservations exist.
 */
export function checkAvailability(
  vehicleId: string,
  pickupDate: string,
  returnDate: string,
  reservations: Reservation[],
  excludeReservationId?: string
): { available: boolean; conflicts: Reservation[] } {
  const requestedStart = parseISO(pickupDate);
  const requestedEnd = parseISO(returnDate);

  const vehicleReservations = reservations.filter(
    (r) =>
      r.vehicle_id === vehicleId &&
      r.reservation_status !== 'cancelled' &&
      r.payment_status !== 'cancelled' &&
      (excludeReservationId ? r.id !== excludeReservationId : true)
  );

  const conflicts = vehicleReservations.filter((r) => {
    const existingStart = parseISO(r.pickup_date);
    const existingEnd = parseISO(r.return_date);

    return areIntervalsOverlapping(
      { start: requestedStart, end: requestedEnd },
      { start: existingStart, end: existingEnd }
    );
  });

  return {
    available: conflicts.length === 0,
    conflicts,
  };
}

/**
 * Gets all blocked dates for a specific vehicle.
 */
export function getBlockedDates(
  vehicleId: string,
  reservations: Reservation[]
): Array<{ start: string; end: string; reservationId: string }> {
  return reservations
    .filter(
      (r) =>
        r.vehicle_id === vehicleId &&
        r.reservation_status !== 'cancelled' &&
        r.payment_status !== 'cancelled'
    )
    .map((r) => ({
      start: r.pickup_date,
      end: r.return_date,
      reservationId: r.id,
    }));
}

/**
 * Checks if a specific date falls within any reservation for a vehicle.
 */
export function isDateBlocked(
  vehicleId: string,
  date: Date,
  reservations: Reservation[]
): boolean {
  return reservations.some((r) => {
    if (
      r.vehicle_id !== vehicleId ||
      r.reservation_status === 'cancelled' ||
      r.payment_status === 'cancelled'
    )
      return false;

    const start = parseISO(r.pickup_date);
    const end = parseISO(r.return_date);
    return isWithinInterval(date, { start, end });
  });
}
