import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Vehicle, Reservation, FilterState, AdminStats } from '@/types';
import { initialVehicles } from '@/data/vehicles';
import { initialReservations } from '@/data/reservations';

type Page = 'home' | 'fleet' | 'vehicle-detail' | 'booking' | 'booking-confirm' | 'admin' | 'admin-vehicles' | 'admin-reservations' | 'admin-vehicle-edit' | 'admin-vehicle-add';

interface AppState {
  vehicles: Vehicle[];
  reservations: Reservation[];
  currentPage: Page;
  selectedVehicleId: string | null;
  selectedReservationId: string | null;
  filters: FilterState;
  isAdminAuthenticated: boolean;
  notification: { type: 'success' | 'error' | 'info'; message: string } | null;
}

type Action =
  | { type: 'SET_PAGE'; payload: Page }
  | { type: 'SELECT_VEHICLE'; payload: string | null }
  | { type: 'SELECT_RESERVATION'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: Partial<FilterState> }
  | { type: 'RESET_FILTERS' }
  | { type: 'ADD_VEHICLE'; payload: Vehicle }
  | { type: 'UPDATE_VEHICLE'; payload: Vehicle }
  | { type: 'DELETE_VEHICLE'; payload: string }
  | { type: 'ADD_RESERVATION'; payload: Reservation }
  | { type: 'UPDATE_RESERVATION'; payload: Partial<Reservation> & { id: string } }
  | { type: 'CANCEL_RESERVATION'; payload: string }
  | { type: 'ADMIN_LOGIN' }
  | { type: 'ADMIN_LOGOUT' }
  | { type: 'SET_NOTIFICATION'; payload: AppState['notification'] }
  | { type: 'CLEAR_NOTIFICATION' };

const defaultFilters: FilterState = {
  category: 'All',
  priceRange: [0, 25000],
  transmission: 'All',
  fuel: 'All',
  seats: null,
  pickupDate: '',
  returnDate: '',
  searchQuery: '',
};

const initialState: AppState = {
  vehicles: initialVehicles,
  reservations: initialReservations,
  currentPage: 'home',
  selectedVehicleId: null,
  selectedReservationId: null,
  filters: defaultFilters,
  isAdminAuthenticated: false,
  notification: null,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };

    case 'SELECT_VEHICLE':
      return { ...state, selectedVehicleId: action.payload };

    case 'SELECT_RESERVATION':
      return { ...state, selectedReservationId: action.payload };

    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case 'RESET_FILTERS':
      return { ...state, filters: defaultFilters };

    case 'ADD_VEHICLE':
      return { ...state, vehicles: [...state.vehicles, action.payload] };

    case 'UPDATE_VEHICLE':
      return {
        ...state,
        vehicles: state.vehicles.map((v) =>
          v.id === action.payload.id ? action.payload : v
        ),
      };

    case 'DELETE_VEHICLE':
      return {
        ...state,
        vehicles: state.vehicles.filter((v) => v.id !== action.payload),
      };

    case 'ADD_RESERVATION':
      return { ...state, reservations: [...state.reservations, action.payload] };

    case 'UPDATE_RESERVATION':
      return {
        ...state,
        reservations: state.reservations.map((r) =>
          r.id === action.payload.id ? { ...r, ...action.payload } : r
        ),
      };

    case 'CANCEL_RESERVATION':
      return {
        ...state,
        reservations: state.reservations.map((r) =>
          r.id === action.payload
            ? { ...r, payment_status: 'cancelled' as const, reservation_status: 'cancelled' as const }
            : r
        ),
      };

    case 'ADMIN_LOGIN':
      return { ...state, isAdminAuthenticated: true };

    case 'ADMIN_LOGOUT':
      return { ...state, isAdminAuthenticated: false };

    case 'SET_NOTIFICATION':
      return { ...state, notification: action.payload };

    case 'CLEAR_NOTIFICATION':
      return { ...state, notification: null };

    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  getVehicle: (id: string) => Vehicle | undefined;
  getReservation: (id: string) => Reservation | undefined;
  getAdminStats: () => AdminStats;
  navigate: (page: Page, vehicleId?: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const getVehicle = (id: string) => state.vehicles.find((v) => v.id === id);
  const getReservation = (id: string) => state.reservations.find((r) => r.id === id);

  const getAdminStats = (): AdminStats => {
    const totalVehicles = state.vehicles.length;
    const availableVehicles = state.vehicles.filter((v) => v.status === 'available').length;
    const activeReservations = state.reservations.filter(
      (r) => r.reservation_status === 'confirmed' || r.reservation_status === 'active'
    ).length;
    const totalRevenue = state.reservations
      .filter((r) => r.payment_status === 'paid')
      .reduce((sum, r) => sum + r.total_price, 0);
    const pendingPayments = state.reservations.filter(
      (r) => r.payment_status === 'unpaid'
    ).length;
    const occupancyRate = totalVehicles > 0 ? (activeReservations / availableVehicles) * 100 : 0;

    return { totalVehicles, availableVehicles, activeReservations, totalRevenue, pendingPayments, occupancyRate };
  };

  const navigate = (page: Page, vehicleId?: string) => {
    if (vehicleId) dispatch({ type: 'SELECT_VEHICLE', payload: vehicleId });
    dispatch({ type: 'SET_PAGE', payload: page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, getVehicle, getReservation, getAdminStats, navigate }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
