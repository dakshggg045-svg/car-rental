import { useApp } from '@/store/AppContext';

export default function Footer() {
  const { navigate } = useApp();
  return (
    <footer className="border-t border-white/[0.04] bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8">
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-lg text-white">Drive<span className="gold-text">Luxe</span></span>
            <p className="text-neutral-600 text-[13px] leading-relaxed mt-3 max-w-[260px]">
              Premium car rental. 30+ vehicles, transparent pricing, secure booking.
            </p>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.15em] mb-4">Navigate</h4>
            <ul className="space-y-2.5 text-[13px]">
              {([['Home','home'],['Fleet','fleet'],['Admin','admin']] as const).map(([l,p]) => (
                <li key={p}><button onClick={() => navigate(p)} className="text-neutral-500 hover:text-[#d4af37] transition-colors">{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.15em] mb-4">Fleet</h4>
            <ul className="space-y-2.5 text-[13px] text-neutral-600">
              <li>Sedans &amp; SUVs</li><li>Luxury &amp; Sports</li><li>Electric Vehicles</li><li>Economy Class</li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.15em] mb-4">Contact</h4>
            <ul className="space-y-2.5 text-[13px] text-neutral-600">
              <li>+1 (555) 123-4567</li><li>hello@driveluxe.com</li><li>New York, NY</li>
            </ul>
          </div>
        </div>
        <div className="mt-14 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-700">
          <span>© 2025 DriveLuxe Inc. All rights reserved.</span>
          <div className="flex gap-6"><span className="hover:text-neutral-400 cursor-pointer transition-colors">Privacy Policy</span><span className="hover:text-neutral-400 cursor-pointer transition-colors">Terms of Service</span></div>
        </div>
      </div>
    </footer>
  );
}
