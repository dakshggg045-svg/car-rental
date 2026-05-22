import { Fuel, Users, ArrowUpRight } from 'lucide-react';
import { Vehicle } from '@/types';
import { useApp } from '@/store/AppContext';
import { formatCurrency } from '@/utils/pricing';

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const { navigate } = useApp();

  return (
    <div className="group cursor-pointer" onClick={() => navigate('vehicle-detail', vehicle.id)}>
      {/* Image container */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#111] mb-4">
        <img
          src={vehicle.image_urls[0]}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        {/* Category pill */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-black/40 backdrop-blur-md text-white/80 border border-white/10">
            {vehicle.category}
          </span>
        </div>

        {/* Quick book button — appears on hover */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-auto z-10">
          <button
            onClick={(e) => { e.stopPropagation(); navigate('booking', vehicle.id); }}
            className="px-4 py-2 bg-[#d4af37] text-black text-[12px] font-semibold uppercase tracking-wide rounded-lg flex items-center gap-1.5 hover:bg-[#e5c54a] transition-colors"
          >
            Reserve <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-1">
        <div className="flex items-start justify-between mb-1.5">
          <div>
            <h3 className="text-white font-display text-[17px] leading-snug group-hover:text-[#d4af37] transition-colors">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-neutral-500 text-[12px] mt-0.5">{vehicle.year} · {vehicle.color}</p>
          </div>
          <div className="text-right">
            <span className="text-white font-semibold text-[17px]">{formatCurrency(vehicle.daily_rate)}</span>
            <span className="text-neutral-600 text-[11px] block">/day</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-neutral-500 mt-2">
          <span className="flex items-center gap-1"><Fuel className="w-3 h-3" />{vehicle.specs.fuel}</span>
          <span className="w-0.5 h-0.5 rounded-full bg-neutral-700" />
          <span>{vehicle.specs.transmission === 'Automatic' ? 'Auto' : 'Manual'}</span>
          <span className="w-0.5 h-0.5 rounded-full bg-neutral-700" />
          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{vehicle.specs.seats} seats</span>
        </div>
      </div>
    </div>
  );
}
