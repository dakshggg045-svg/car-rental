import { CheckCircle, ArrowRight } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { formatCurrency } from '@/utils/pricing';

export default function BookingConfirmPage() {
  const { state, navigate, getVehicle, getReservation } = useApp();
  const res = getReservation(state.selectedReservationId || '');
  const vehicle = res ? getVehicle(res.vehicle_id) : null;
  if (!res || !vehicle) return <div className="min-h-screen bg-[#0a0a0a] pt-24 text-center"><p className="text-neutral-500">Booking not found.</p><button onClick={() => navigate('fleet')} className="mt-3 text-[#d4af37] text-[13px]">Browse fleet</button></div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-16">
      <div className="max-w-md mx-auto px-6 py-20">
        <div className="flex justify-center mb-8"><div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center"><CheckCircle className="w-8 h-8 text-emerald-400" /></div></div>
        <h1 className="font-display text-[26px] text-white text-center mb-1">Booking Confirmed</h1>
        <p className="text-neutral-500 text-[14px] text-center mb-10">You're all set. See details below.</p>

        <div className="rounded-xl border border-white/[0.06] bg-[#111] overflow-hidden">
          <div className="h-44 relative"><img src={vehicle.image_urls[0]} alt="" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent pointer-events-none" /><div className="absolute bottom-4 left-5"><span className="font-display text-[17px] text-white">{vehicle.make} {vehicle.model}</span><span className="text-neutral-500 text-[12px] ml-2">{vehicle.year}</span></div></div>
          <div className="p-6 space-y-5">
            <div className="bg-[#0a0a0a] rounded-lg px-4 py-3 text-center border border-white/[0.04]">
              <div className="text-[10px] text-neutral-600 uppercase tracking-[0.2em] mb-1">Confirmation</div>
              <div className="text-[20px] font-mono font-semibold text-[#d4af37]">{res.id.toUpperCase()}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-[13px]">
              <div><div className="text-neutral-600 text-[10px] uppercase tracking-wider mb-0.5">Pickup</div><div className="text-white">{res.pickup_date}</div></div>
              <div><div className="text-neutral-600 text-[10px] uppercase tracking-wider mb-0.5">Return</div><div className="text-white">{res.return_date}</div></div>
              <div><div className="text-neutral-600 text-[10px] uppercase tracking-wider mb-0.5">From</div><div className="text-neutral-300">{res.pickup_location}</div></div>
              <div><div className="text-neutral-600 text-[10px] uppercase tracking-wider mb-0.5">To</div><div className="text-neutral-300">{res.return_location}</div></div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
              <span className="text-emerald-400 text-[11px] font-semibold uppercase tracking-wider">{res.payment_status}</span>
              <span className="text-[24px] font-bold text-white" style={{ fontFamily: 'Inter, sans-serif' }}>{formatCurrency(res.total_price)}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-8">
          <button onClick={() => navigate('fleet')} className="flex-1 py-3 bg-[#d4af37] hover:bg-[#e5c54a] text-black text-[13px] font-semibold uppercase tracking-wide rounded-lg transition-colors flex items-center justify-center gap-1.5">Book Another <ArrowRight className="w-3.5 h-3.5" /></button>
          <button onClick={() => navigate('home')} className="flex-1 py-3 border border-white/[0.08] text-neutral-400 hover:text-white text-[13px] rounded-lg transition-colors">Home</button>
        </div>
      </div>
    </div>
  );
}
