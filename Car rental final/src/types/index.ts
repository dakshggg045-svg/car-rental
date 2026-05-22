export interface VehicleSpecs {
  fuel: 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid';
  transmission: 'Automatic' | 'Manual';
  seats: number;
  doors: number;
  luggage: number;
  ac: boolean;
  gps: boolean;
}

export type VehicleCategory = 'Economy' | 'Compact' | 'Sedan' | 'SUV' | 'Luxury' | 'Van' | 'Sports' | 'Electric';

export type VehicleStatus = 'available' | 'maintenance' | 'retired';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  daily_rate: number;
  category: VehicleCategory;
  specs: VehicleSpecs;
  image_urls: string[];
  status: VehicleStatus;
  color: string;
  plate: string;
  mileage: number;
}

export type PaymentStatus = 'unpaid' | 'paid' | 'cancelled' | 'refunded';
export type ReservationStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';

export interface Reservation {
  id: string;
  vehicle_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  pickup_date: string;
  return_date: string;
  pickup_location: string;
  return_location: string;
  total_price: number;
  payment_status: PaymentStatus;
  reservation_status: ReservationStatus;
  created_at: string;
  stripe_session_id?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  license_number: string;
}

export interface FilterState {
  category: VehicleCategory | 'All';
  priceRange: [number, number];
  transmission: 'All' | 'Automatic' | 'Manual';
  fuel: 'All' | 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid';
  seats: number | null;
  pickupDate: string;
  returnDate: string;
  searchQuery: string;
}

export interface AdminStats {
  totalVehicles: number;
  availableVehicles: number;
  activeReservations: number;
  totalRevenue: number;
  pendingPayments: number;
  occupancyRate: number;
}
