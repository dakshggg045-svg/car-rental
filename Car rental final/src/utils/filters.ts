import { Vehicle, FilterState, Reservation } from '@/types';
import { checkAvailability } from './availability';

/**
 * Filters the fleet based on category, price range, availability, and other criteria.
 */
export function filterVehicles(
  vehicles: Vehicle[],
  filters: FilterState,
  reservations: Reservation[]
): Vehicle[] {
  return vehicles.filter((vehicle) => {
    // Status filter - only show available vehicles to customers
    if (vehicle.status !== 'available') return false;

    // Category filter
    if (filters.category !== 'All' && vehicle.category !== filters.category) return false;

    // Price range filter
    if (vehicle.daily_rate < filters.priceRange[0] || vehicle.daily_rate > filters.priceRange[1]) return false;

    // Transmission filter
    if (filters.transmission !== 'All' && vehicle.specs.transmission !== filters.transmission) return false;

    // Fuel filter
    if (filters.fuel !== 'All' && vehicle.specs.fuel !== filters.fuel) return false;

    // Seats filter
    if (filters.seats !== null && vehicle.specs.seats < filters.seats) return false;

    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchStr = `${vehicle.make} ${vehicle.model} ${vehicle.year} ${vehicle.category} ${vehicle.color}`.toLowerCase();
      if (!searchStr.includes(query)) return false;
    }

    // Availability filter (date range)
    if (filters.pickupDate && filters.returnDate) {
      const { available } = checkAvailability(
        vehicle.id,
        filters.pickupDate,
        filters.returnDate,
        reservations
      );
      if (!available) return false;
    }

    return true;
  });
}
