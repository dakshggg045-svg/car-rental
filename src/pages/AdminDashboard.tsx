import { useState } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { formatCurrency } from '@/utils/pricing';

export default function AdminDashboard() {
  const { state, dispatch, navigate, getAdminStats } = useApp();
  const [pw, setPw] = useState(''); const [show, setShow] = useState(false); const [err, setErr] = useState('');

  if (!state.isAdminAuthenticated) return (
    <div className="min-h-screen bg-[#0a0a0a] pt-16 flex items-center justify-center">
      <div className="w-full max-w-sm mx-auto px-6">
        <div className="border border-white/[0.06] rounded-xl p-6 bg-[#111]">
          <h1 className="font-display text-[20px] text-white mb-1">Admin Portal</h1>
          <p className="text-neutral-600 text-[13px] mb-6">Fleet management system</p>
          <div className="space-y-3">
            <div><label className="block text-[11px] text-neutral-500 uppercase tracking-wider mb-1.5">Email</label><input type="email" defaultValue="admin@driveluxe.com" readOnly className="w-full px-3 py-2.5 bg-[#0a0a0a] border border-white/[0.06] rounded-lg text-neutral-500 text-[13px]" /></div>
            <div><label className="block text-[11px] text-neutral-500 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative"><input type={show?'text':'password'} value={pw} onChange={e=>{setPw(e.target.value);setErr('');}} placeholder="Password" onKeyDown={e=>{if(e.key==='Enter'){pw==='admin123'?dispatch({type:'ADMIN_LOGIN'}):setErr('Wrong password. Use: admin123');}}}
                className="w-full px-3 py-2.5 bg-[#0a0a0a] border border-white/[0.08] rounded-lg text-white text-[13px] placeholder:text-neutral-700 focus:border-[#d4af37]/50 focus:outline-none pr-9" />
                <button onClick={()=>setShow(!show)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-600">{show?<EyeOff className="w-3.5 h-3.5" />:<Eye className="w-3.5 h-3.5" />}</button></div></div>
            {err && <p className="flex items-center gap-1.5 text-red-400 text-[12px]"><AlertCircle className="w-3 h-3" />{err}</p>}
            <button onClick={()=>pw==='admin123'?dispatch({type:'ADMIN_LOGIN'}):setErr('Wrong password. Use: admin123')} className="w-full py-2.5 bg-[#d4af37] hover:bg-[#e5c54a] text-black text-[13px] font-semibold rounded-lg transition-colors">Sign In</button>
            <p className="text-center text-[11px] text-neutral-700">Demo: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );

  const s = getAdminStats();
  const recent = [...state.reservations].sort((a,b) => new Date(b.created_at).getTime()-new Date(a.created_at).getTime()).slice(0,5);
  const badge: Record<string,string> = { pending:'text-amber-400', confirmed:'text-emerald-400', active:'text-cyan-400', completed:'text-neutral-500', cancelled:'text-red-400' };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-16">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-[22px] text-white">Dashboard</h1>
          <div className="flex gap-2"><button onClick={()=>navigate('admin-vehicles')} className="px-3.5 py-2 text-[12px] uppercase tracking-wide text-neutral-400 hover:text-white bg-[#111] border border-white/[0.06] rounded-lg transition-colors">Vehicles</button><button onClick={()=>navigate('admin-reservations')} className="px-3.5 py-2 text-[12px] uppercase tracking-wide text-neutral-400 hover:text-white bg-[#111] border border-white/[0.06] rounded-lg transition-colors">Reservations</button></div>
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {[{l:'Fleet',v:s.totalVehicles},{l:'Available',v:s.availableVehicles},{l:'Active',v:s.activeReservations},{l:'Revenue',v:formatCurrency(s.totalRevenue)},{l:'Pending',v:s.pendingPayments},{l:'Occupancy',v:`${Math.round(s.occupancyRate)}%`}].map(x => (
            <div key={x.l} className="border border-white/[0.06] rounded-xl p-4 bg-[#111]">
              <div className="text-[18px] font-bold text-white" style={{fontFamily:'Inter, sans-serif'}}>{x.v}</div>
              <div className="text-[11px] text-neutral-600 uppercase tracking-wider mt-0.5">{x.l}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="border border-white/[0.06] rounded-xl bg-[#111]">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.04]"><h2 className="text-[13px] font-medium text-white uppercase tracking-wider">Recent Bookings</h2><button onClick={()=>navigate('admin-reservations')} className="text-[11px] text-[#d4af37]">View all →</button></div>
            <div className="divide-y divide-white/[0.04]">{recent.map(r => { const v = state.vehicles.find(x=>x.id===r.vehicle_id); return (
              <div key={r.id} className="flex items-center justify-between px-5 py-3"><div><div className="text-[13px] text-white">{r.user_name}</div><div className="text-[11px] text-neutral-600">{v?`${v.make} ${v.model}`:'—'} · {r.pickup_date}</div></div><div className="text-right"><div className="text-[13px] text-white">{formatCurrency(r.total_price)}</div><div className={`text-[10px] uppercase tracking-wider ${badge[r.reservation_status]}`}>{r.reservation_status}</div></div></div>
            );})}</div>
          </div>

          <div className="border border-white/[0.06] rounded-xl bg-[#111]">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.04]"><h2 className="text-[13px] font-medium text-white uppercase tracking-wider">Fleet Status</h2><button onClick={()=>navigate('admin-vehicles')} className="text-[11px] text-[#d4af37]">Manage →</button></div>
            <div className="p-5 space-y-3">{['Economy','Compact','Sedan','SUV','Luxury','Van','Sports','Electric'].map(cat => {
              const cnt = state.vehicles.filter(v=>v.category===cat).length; const avl = state.vehicles.filter(v=>v.category===cat&&v.status==='available').length;
              return <div key={cat} className="flex items-center gap-3 text-[13px]"><span className="w-16 text-neutral-500 shrink-0">{cat}</span><div className="flex-1 h-1.5 bg-neutral-800 rounded-full"><div className="h-full bg-[#d4af37] rounded-full" style={{width:cnt>0?`${(avl/cnt)*100}%`:'0%'}} /></div><span className="text-[11px] text-neutral-600 w-10 text-right">{avl}/{cnt}</span></div>;
            })}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
