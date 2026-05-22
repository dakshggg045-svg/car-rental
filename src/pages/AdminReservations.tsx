import { useState } from 'react';
import { ArrowLeft, Search, XCircle, CheckCircle, Calendar } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { formatCurrency } from '@/utils/pricing';
import { PaymentStatus, ReservationStatus } from '@/types';

export default function AdminReservations() {
  const { state, dispatch, navigate } = useApp();
  const [search,setSearch]=useState('');const [sF,setSF]=useState<ReservationStatus|'All'>('All');const [pF,setPF]=useState<PaymentStatus|'All'>('All');
  const filtered = state.reservations.filter(r => { if(sF!=='All'&&r.reservation_status!==sF)return false; if(pF!=='All'&&r.payment_status!==pF)return false; if(search){const q=search.toLowerCase();const v=state.vehicles.find(x=>x.id===r.vehicle_id);return `${r.user_name} ${r.user_email} ${r.id} ${v?v.make+' '+v.model:''}`.toLowerCase().includes(q);} return true; }).sort((a,b)=>new Date(b.created_at).getTime()-new Date(a.created_at).getTime());
  const sBadge:Record<string,string> = {pending:'text-amber-400',confirmed:'text-emerald-400',active:'text-cyan-400',completed:'text-neutral-500',cancelled:'text-red-400'};
  const pBadge:Record<string,string> = {unpaid:'text-amber-400',paid:'text-emerald-400',cancelled:'text-red-400',refunded:'text-violet-400'};
  const inp = "px-3 py-2 bg-[#111] border border-white/[0.08] rounded-lg text-white text-[13px] focus:border-[#d4af37]/50 focus:outline-none";

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-16">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
        <div className="flex items-center gap-3 mb-6"><button onClick={()=>navigate('admin')} className="text-neutral-500 hover:text-white transition-colors"><ArrowLeft className="w-4 h-4" /></button><h1 className="font-display text-[22px] text-white">Reservations <span className="text-neutral-600 font-normal text-[16px]">({state.reservations.length})</span></h1></div>
        <div className="flex flex-col sm:flex-row gap-2 mb-5">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-600" /><input type="text" placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)} className={`w-full pl-9 pr-3 ${inp}`} /></div>
          <select value={sF} onChange={e=>setSF(e.target.value as any)} className={inp}><option value="All">All status</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="active">Active</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select>
          <select value={pF} onChange={e=>setPF(e.target.value as any)} className={inp}><option value="All">All payments</option><option value="unpaid">Unpaid</option><option value="paid">Paid</option><option value="cancelled">Cancelled</option><option value="refunded">Refunded</option></select>
        </div>
        <div className="space-y-2">{filtered.map(r => { const v=state.vehicles.find(x=>x.id===r.vehicle_id); return (
          <div key={r.id} className="border border-white/[0.06] rounded-xl bg-[#111] p-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                {v && <img src={v.image_urls[0]} alt="" className="w-14 h-10 rounded-lg object-cover bg-neutral-800 shrink-0" />}
                <div><div className="text-[13px] text-white">{r.user_name} <span className="text-neutral-600">({r.user_email})</span></div><div className="text-[11px] text-neutral-600 mt-0.5 flex items-center gap-1"><Calendar className="w-3 h-3" />{v?`${v.make} ${v.model}`:'—'} · {r.pickup_date} → {r.return_date}</div></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right"><div className="text-[14px] font-medium text-white">{formatCurrency(r.total_price)}</div><div className="text-[10px] space-x-2 uppercase tracking-wider"><span className={sBadge[r.reservation_status]}>{r.reservation_status}</span><span className={pBadge[r.payment_status]}>{r.payment_status}</span></div></div>
                <div className="flex gap-0.5">
                  {r.payment_status==='unpaid'&&r.reservation_status==='pending' && <button onClick={()=>{dispatch({type:'UPDATE_RESERVATION',payload:{id:r.id,payment_status:'paid',reservation_status:'confirmed'}});dispatch({type:'SET_NOTIFICATION',payload:{type:'success',message:'Confirmed'}});}} className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded-lg"><CheckCircle className="w-4 h-4" /></button>}
                  {r.reservation_status==='confirmed' && <button onClick={()=>dispatch({type:'UPDATE_RESERVATION',payload:{id:r.id,reservation_status:'completed'}})} className="p-1.5 text-cyan-400 hover:bg-cyan-500/10 rounded-lg"><CheckCircle className="w-4 h-4" /></button>}
                  {!['cancelled','completed'].includes(r.reservation_status) && <button onClick={()=>{dispatch({type:'CANCEL_RESERVATION',payload:r.id});dispatch({type:'SET_NOTIFICATION',payload:{type:'info',message:'Cancelled'}});}} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg"><XCircle className="w-4 h-4" /></button>}
                </div>
              </div>
            </div>
          </div>
        );})}{filtered.length===0 && <div className="text-center py-12 text-neutral-600 text-[13px]">No reservations found</div>}</div>
      </div>
    </div>
  );
}
