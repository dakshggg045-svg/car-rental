import { ArrowRight, ArrowUpRight, Shield, Clock, CreditCard } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import VehicleCard from '@/components/VehicleCard';
import { formatCurrency } from '@/utils/pricing';

export default function HomePage() {
  const { state, navigate, dispatch } = useApp();
  const available = state.vehicles.filter(v => v.status === 'available');
  const popular = available.slice(0, 6);
  const cheapest = [...available].sort((a, b) => a.daily_rate - b.daily_rate)[0];
  const cats = ['Economy','Compact','Sedan','SUV','Luxury','Sports','Electric','Van'] as const;

  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-end">
        <div className="absolute inset-0">
          <img src="/images/hero-bg.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-transparent to-transparent pointer-events-none" />
        </div>
        <div className="relative w-full pb-20 pt-32">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            <div className="max-w-xl animate-fade-up">
              <p className="text-[#d4af37] text-[11px] font-semibold tracking-[0.2em] uppercase mb-5">Premium Car Rental</p>
              <h1 className="font-display text-[44px] sm:text-[56px] lg:text-[64px] font-medium text-white leading-[1.05] tracking-tight mb-6">
                Experience the<br />road in style
              </h1>
              <p className="text-neutral-400 text-[15px] leading-relaxed mb-10 max-w-md" style={{ fontFamily: 'Inter, sans-serif' }}>
                {available.length} curated vehicles. Rates from {cheapest ? formatCurrency(cheapest.daily_rate) : '₹2,500'}/day.
                Transparent pricing, instant availability, secure checkout.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => navigate('fleet')}
                  className="px-7 py-3.5 bg-[#d4af37] hover:bg-[#e5c54a] text-black text-[13px] font-semibold uppercase tracking-wide rounded-lg transition-colors flex items-center gap-2">
                  Explore Fleet <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => navigate('fleet')}
                  className="px-7 py-3.5 text-white text-[13px] font-medium uppercase tracking-wide rounded-lg border border-white/15 hover:border-white/30 hover:bg-white/5 transition-all"
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  View Pricing
                </button>
              </div>
            </div>

            {/* Horizontal category scroll */}
            <div className="mt-16 animate-fade-up delay-300">
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {cats.map(c => {
                  const count = available.filter(v => v.category === c).length;
                  const min = Math.min(...available.filter(v => v.category === c).map(v => v.daily_rate));
                  return (
                    <button key={c} onClick={() => { dispatch({ type:'SET_FILTERS', payload:{ category: c as any } }); navigate('fleet'); }}
                      className="shrink-0 min-w-[150px] px-5 py-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-[#d4af37]/30 transition-all group text-left backdrop-blur-sm">
                      <div className="text-white text-[13px] font-medium group-hover:text-[#d4af37] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>{c}</div>
                      <div className="text-neutral-600 text-[11px] mt-1">{count} vehicles · from ₹{isFinite(min) ? min : '—'}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ POPULAR PICKS ═══ */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[#d4af37] text-[11px] font-semibold tracking-[0.2em] uppercase mb-3">Curated Selection</p>
              <h2 className="font-display text-[32px] text-white">Popular Picks</h2>
            </div>
            <button onClick={() => navigate('fleet')} className="hidden sm:flex items-center gap-1.5 text-[12px] uppercase tracking-wide text-neutral-400 hover:text-[#d4af37] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
              View entire fleet <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {popular.map(v => <VehicleCard key={v.id} vehicle={v} />)}
          </div>
          <div className="mt-10 text-center sm:hidden">
            <button onClick={() => navigate('fleet')} className="text-[12px] uppercase tracking-wide text-[#d4af37]">View all vehicles →</button>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-24 bg-[#080808] border-y border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <p className="text-[#d4af37] text-[11px] font-semibold tracking-[0.2em] uppercase mb-3">The Process</p>
          <h2 className="font-display text-[32px] text-white mb-14">Three Steps to the Road</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n:'01', t:'Search & Select', d:'Browse our curated fleet, filter by category, price, or fuel type. Select your dates — unavailable days are automatically blocked.', i:<Clock className="w-5 h-5" /> },
              { n:'02', t:'Secure Payment', d:'Pay via card or UPI through Stripe. Your reservation is held pending until payment confirms via webhook — no double bookings.', i:<CreditCard className="w-5 h-5" /> },
              { n:'03', t:'Drive Away', d:'Pick up at any location. Longer rentals unlock automatic discounts — up to 20% off for monthly bookings.', i:<Shield className="w-5 h-5" /> },
            ].map(s => (
              <div key={s.n} className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#d4af37]/10 text-[#d4af37] flex items-center justify-center group-hover:bg-[#d4af37]/20 transition-colors">{s.i}</div>
                  <span className="text-[11px] font-mono text-neutral-700 tracking-widest">STEP {s.n}</span>
                </div>
                <h3 className="font-display text-[18px] text-white mb-2">{s.t}</h3>
                <p className="text-neutral-500 text-[13px] leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING GRID ═══ */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <p className="text-[#d4af37] text-[11px] font-semibold tracking-[0.2em] uppercase mb-3">Transparent Rates</p>
          <h2 className="font-display text-[32px] text-white mb-12">Pricing by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {cats.map(c => {
              const vs = available.filter(v => v.category === c);
              const mn = vs.length ? Math.min(...vs.map(v => v.daily_rate)) : 0;
              const mx = vs.length ? Math.max(...vs.map(v => v.daily_rate)) : 0;
              return (
                <button key={c} onClick={() => { dispatch({ type:'SET_FILTERS', payload:{ category: c as any } }); navigate('fleet'); }}
                  className="p-5 rounded-xl border border-white/[0.05] hover:border-[#d4af37]/25 bg-white/[0.02] hover:bg-[#d4af37]/[0.03] transition-all text-left group">
                  <span className="text-white font-display text-[15px] group-hover:text-[#d4af37] transition-colors">{c}</span>
                  <div className="text-neutral-600 text-[11px] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>{vs.length} vehicles</div>
                  <div className="text-white text-[20px] font-semibold mt-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                    ₹{mn}{mx !== mn && <span className="text-neutral-600 text-[13px] font-normal">–₹{mx}</span>}
                    <span className="text-neutral-600 text-[11px] font-normal">/day</span>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-6 px-5 py-3.5 rounded-lg bg-[#d4af37]/[0.04] border border-[#d4af37]/10 text-[13px] text-neutral-400" style={{ fontFamily: 'Inter, sans-serif' }}>
            <span className="text-[#d4af37] font-medium">Multi-day discounts:</span> 3+ days (5%) · 7+ days (10%) · 14+ days (15%) · 30+ days (20%)
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-24 bg-[#080808] border-t border-white/[0.04]">
        <div className="max-w-2xl mx-auto px-6 sm:px-8 lg:px-10 text-center">
          <h2 className="font-display text-[36px] text-white mb-4">Ready to Drive?</h2>
          <p className="text-neutral-500 text-[14px] mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>Browse the fleet, choose your dates, and reserve in under two minutes.</p>
          <button onClick={() => navigate('fleet')}
            className="px-8 py-3.5 bg-[#d4af37] hover:bg-[#e5c54a] text-black text-[13px] font-semibold uppercase tracking-wide rounded-lg transition-colors inline-flex items-center gap-2">
            Browse Fleet <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
