import { useState } from 'react';
import { ArrowLeft, Fuel, Settings, Users, DoorOpen, Briefcase, Snowflake, Navigation, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { formatCurrency } from '@/utils/pricing';
import { getBlockedDates } from '@/utils/availability';

export default function VehicleDetailPage() {
  const { state, navigate, getVehicle } = useApp();
  const vehicle = getVehicle(state.selectedVehicleId || '');
  const [ci, setCi] = useState(0);

  if (!vehicle) return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 text-center">
      <p className="text-neutral-500">Vehicle not found.</p>
      <button onClick={() => navigate('fleet')} className="mt-3 text-[#d4af37] text-[13px]">← Back to fleet</button>
    </div>
  );

  const blocked = getBlockedDates(vehicle.id, state.reservations);
  const specs = [
    { icon: <Fuel className="w-4 h-4" />, l: 'Fuel', v: vehicle.specs.fuel },
    { icon: <Settings className="w-4 h-4" />, l: 'Transmission', v: vehicle.specs.transmission },
    { icon: <Users className="w-4 h-4" />, l: 'Seats', v: String(vehicle.specs.seats) },
    { icon: <DoorOpen className="w-4 h-4" />, l: 'Doors', v: String(vehicle.specs.doors) },
    { icon: <Briefcase className="w-4 h-4" />, l: 'Luggage', v: `${vehicle.specs.luggage} bags` },
    { icon: <Snowflake className="w-4 h-4" />, l: 'A/C', v: vehicle.specs.ac ? 'Included' : 'Not available' },
    { icon: <Navigation className="w-4 h-4" />, l: 'GPS', v: vehicle.specs.gps ? 'Included' : 'Add-on ₹400/day' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-16">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
        <button onClick={() => navigate('fleet')} className="flex items-center gap-1.5 text-neutral-500 hover:text-white text-[13px] mb-8 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to fleet
        </button>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Gallery — 3 cols */}
          <div className="lg:col-span-3">
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#111]">
              <img src={vehicle.image_urls[ci]} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-full object-cover" />
              {vehicle.image_urls.length > 1 && (<>
                <button onClick={() => setCi((ci - 1 + vehicle.image_urls.length) % vehicle.image_urls.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white/70 hover:text-white"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => setCi((ci + 1) % vehicle.image_urls.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white/70 hover:text-white"><ChevronRight className="w-4 h-4" /></button>
              </>)}
            </div>

            {/* Add-ons section */}
            <div className="mt-8">
              <h3 className="font-display text-[18px] text-white mb-4">Available Add-ons</h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { name: 'Full Insurance', price: '₹999/day', desc: 'Zero excess coverage' },
                  { name: 'GPS Navigator', price: '₹400/day', desc: 'Turn-by-turn navigation' },
                  { name: 'Child Seat', price: '₹600/day', desc: 'ISOFIX compatible' },
                ].map(a => (
                  <div key={a.name} className="p-4 rounded-xl border border-white/[0.06] bg-[#111] hover:border-[#d4af37]/20 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-[13px] font-medium">{a.name}</span>
                      <span className="text-[#d4af37] text-[12px] font-semibold">{a.price}</span>
                    </div>
                    <p className="text-neutral-600 text-[11px]">{a.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-neutral-600 text-[11px] mt-2 italic">Add-ons can be selected during checkout.</p>
            </div>
          </div>

          {/* Info — 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <p className="text-[#d4af37] text-[10px] font-semibold tracking-[0.2em] uppercase mb-1">{vehicle.category}</p>
              <h1 className="font-display text-[28px] text-white leading-tight">{vehicle.make} {vehicle.model}</h1>
              <p className="text-neutral-500 text-[13px] mt-1.5">{vehicle.year} · {vehicle.color} · {vehicle.mileage.toLocaleString()} mi</p>
            </div>

            {/* Price card */}
            <div className="rounded-xl border border-white/[0.06] bg-[#111] p-6">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[30px] font-bold text-white" style={{ fontFamily: 'Inter, sans-serif' }}>{formatCurrency(vehicle.daily_rate)}</span>
                <span className="text-neutral-600 text-[13px]">/ day</span>
              </div>
              <div className="mt-4 space-y-1.5 text-[12px]">
                {[[3,5],[7,10],[14,15],[30,20]].map(([d,p]) => (
                  <div key={d} className="flex justify-between text-neutral-500"><span>{d}+ days rental</span><span className="text-emerald-400">{p}% off</span></div>
                ))}
              </div>

              <button onClick={() => navigate('booking', vehicle.id)}
                className="w-full mt-5 py-3 bg-[#d4af37] hover:bg-[#e5c54a] text-black text-[13px] font-semibold uppercase tracking-wide rounded-lg transition-colors flex items-center justify-center gap-2">
                Reserve Now <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Specs */}
            <div className="rounded-xl border border-white/[0.06] bg-[#111] overflow-hidden divide-y divide-white/[0.04]">
              <div className="px-5 py-3 bg-white/[0.02]">
                <span className="text-[11px] uppercase tracking-widest text-neutral-500 font-semibold">Specifications</span>
              </div>
              {specs.map(s => (
                <div key={s.l} className="flex items-center justify-between px-5 py-3">
                  <span className="flex items-center gap-2.5 text-[13px] text-neutral-400">{s.icon}{s.l}</span>
                  <span className="text-[13px] text-white">{s.v}</span>
                </div>
              ))}
            </div>

            {blocked.length > 0 && (
              <div className="rounded-xl border border-red-500/10 bg-red-500/[0.03] p-4">
                <h4 className="text-[10px] text-red-400 uppercase tracking-widest font-semibold mb-2">Booked Dates</h4>
                {blocked.map(b => <p key={b.reservationId} className="text-[12px] text-neutral-500">{b.start} – {b.end}</p>)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ Floating mobile book button ═══ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#0a0a0a]/90 backdrop-blur-lg border-t border-white/[0.06] z-40">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <span className="text-white font-semibold text-[17px]" style={{ fontFamily: 'Inter, sans-serif' }}>{formatCurrency(vehicle.daily_rate)}</span>
            <span className="text-neutral-600 text-[12px] ml-1">/ day</span>
          </div>
          <button onClick={() => navigate('booking', vehicle.id)}
            className="px-6 py-2.5 bg-[#d4af37] hover:bg-[#e5c54a] text-black text-[13px] font-semibold uppercase tracking-wide rounded-lg transition-colors flex items-center gap-1.5">
            Reserve <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
