import { AppProvider, useApp } from '@/store/AppContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Notification from '@/components/Notification';
import HomePage from '@/pages/HomePage';
import FleetPage from '@/pages/FleetPage';
import VehicleDetailPage from '@/pages/VehicleDetailPage';
import BookingPage from '@/pages/BookingPage';
import BookingConfirmPage from '@/pages/BookingConfirmPage';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminVehicles from '@/pages/AdminVehicles';
import AdminReservations from '@/pages/AdminReservations';
import AdminVehicleForm from '@/pages/AdminVehicleForm';

function AppRouter() {
  const { state } = useApp();
  const page = (() => {
    switch (state.currentPage) {
      case 'home': return <HomePage />;
      case 'fleet': return <FleetPage />;
      case 'vehicle-detail': return <VehicleDetailPage />;
      case 'booking': return <BookingPage />;
      case 'booking-confirm': return <BookingConfirmPage />;
      case 'admin': return <AdminDashboard />;
      case 'admin-vehicles': return <AdminVehicles />;
      case 'admin-reservations': return <AdminReservations />;
      case 'admin-vehicle-edit': return <AdminVehicleForm mode="edit" />;
      case 'admin-vehicle-add': return <AdminVehicleForm mode="add" />;
      default: return <HomePage />;
    }
  })();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100">
      <Header />
      <Notification />
      <main>{page}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return <AppProvider><AppRouter /></AppProvider>;
}
