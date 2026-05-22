import { useState } from 'react';
import { ArrowLeft, Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { formatCurrency } from '@/utils/pricing';
import { Vehicle, VehicleCategory, VehicleStatus } from '@/types';

export default function AdminVehicles() {
  const { state, dispatch, navigate } = useApp();
  const [search,setSearch]=useState('');const [catF,setCatF]=useState<VehicleCategory|'All'>('All');const [statF,setStatF]=useState<VehicleStatus|'All'>('All');const [delId,setDelId]=useState<string|null>(null);const [editRate,setEditRate]=useState<string|null>(null);const [newRate,setNewRate]=useState('');
  const filtered = state.vehicles.filter(v => { if(catF!=='All'&&v.category!==catF)return false; if(statF!=='All'&&v.status!==statF)return false; if(search)return `${v.make} ${v.model} ${v.plate} ${v.year}`.toLowerCase().includes(search.toLowerCase()); return true; });
  const doDelete = (id:string) => { if(state.reservations.some(r=>r.vehicle_id===id&&r.reservation_status!=='cancelled')){dispatch({type:'SET_NOTIFICATION',payload:{type:'error',message:'Has active reservations'}});return;} dispatch({type:'DELETE_VEHICLE',payload:id});dispatch({type:'SET_NOTIFICATION',payload:{type:'success',message:'Removed'}});setDelId(null); };
  const doRate = (v:Vehicle) => { const r=parseFloat(newRate); if(isNaN(r)||r<=0)return; dispatch({type:'UPDATE_VEHICLE',payload:{...v,daily_rate:r}});dispatch({type:'SET_NOTIFICATION',payload:{type:'success',message:'Rate updated'}});setEditRate(null); };
  const toggleStatus = (v:Vehicle) => { const next:Record<VehicleStatus,VehicleStatus>={available:'maintenance',maintenance:'available',retired:'available'}; dispatch({type:'UPDATE_VEHICLE',payload:{...v,status:next[v.status]}}); };
  const statusColor:Record<string,string> = {available:'text-emerald-400',maintenance:'text-amber-400',retired:'text-red-400'};
  const inp = "px-3 py-2 bg-[#111] border border-white/[0.08] rounded-lg text-white text-[13px] focus:border-[#d4af37]/50 focus:outline-none";

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-16">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3"><button onClick={()=>navigate('admin')} className="text-neutral-500 hover:text-white transition-colors"><ArrowLeft className="w-4 h-4" /></button><h1 className="font-display text-[22px] text-white">Fleet <span className="text-neutral-600 font-normal text-[16px]">({state.vehicles.length})</span></h1></div>
          <button onClick={()=>navigate('admin-vehicle-add')} className="px-4 py-2 bg-[#d4af37] hover:bg-[#e5c54a] text-black text-[12px] font-semibold uppercase tracking-wide rounded-lg transition-colors flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Add Vehicle</button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mb-5">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-600" /><input type="text" placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)} className={`w-full pl-9 pr-3 ${inp}`} /></div>
          <select value={catF} onChange={e=>setCatF(e.target.value as any)} className={inp}><option value="All">All categories</option>{['Economy','Compact','Sedan','SUV','Luxury','Van','Sports','Electric'].map(c=><option key={c}>{c}</option>)}</select>
          <select value={statF} onChange={e=>setStatF(e.target.value as any)} className={inp}><option value="All">All status</option><option value="available">Available</option><option value="maintenance">Maintenance</option><option value="retired">Retired</option></select>
        </div>
        <div className="border border-white/[0.06] rounded-xl bg-[#111] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead><tr className="border-b border-white/[0.04] text-[10px] text-neutral-600 uppercase tracking-wider"><th className="text-left px-5 py-3">Vehicle</th><th className="text-left px-5 py-3">Category</th><th className="text-left px-5 py-3">Rate</th><th className="text-left px-5 py-3">Status</th><th className="text-left px-5 py-3">Plate</th><th className="text-right px-5 py-3">Actions</th></tr></thead>
              <tbody className="divide-y divide-white/[0.03]">{filtered.map(v => (
                <tr key={v.id} className="hover:bg-white/[0.02]">
                  <td className="px-5 py-3"><div className="flex items-center gap-3"><img src={v.image_urls[0]} alt="" className="w-14 h-9 rounded-lg object-cover bg-neutral-800" /><div><div className="text-white">{v.make} {v.model}</div><div className="text-[11px] text-neutral-600">{v.year} · {v.color}</div></div></div></td>
                  <td className="px-5 py-3 text-neutral-400">{v.category}</td>
                  <td className="px-5 py-3">{editRate===v.id?(<div className="flex items-center gap-1"><input type="number" value={newRate} onChange={e=>setNewRate(e.target.value)} className="w-16 px-1.5 py-0.5 bg-[#0a0a0a] border border-[#d4af37] rounded text-white text-[13px] focus:outline-none" autoFocus onKeyDown={e=>{if(e.key==='Enter')doRate(v);if(e.key==='Escape')setEditRate(null);}} /><button onClick={()=>doRate(v)} className="text-emerald-400 text-[11px]">Save</button></div>):(<button onClick={()=>{setEditRate(v.id);setNewRate(String(v.daily_rate));}} className="text-white hover:text-[#d4af37] transition-colors">{formatCurrency(v.daily_rate)}</button>)}</td>
                  <td className="px-5 py-3"><button onClick={()=>toggleStatus(v)} className={`text-[11px] uppercase tracking-wider ${statusColor[v.status]}`}>{v.status}</button></td>
                  <td className="px-5 py-3 text-neutral-600 font-mono text-[11px]">{v.plate}</td>
                  <td className="px-5 py-3 text-right"><div className="flex items-center justify-end gap-0.5">
                    <button onClick={()=>navigate('vehicle-detail',v.id)} className="p-1.5 text-neutral-600 hover:text-white"><Eye className="w-3.5 h-3.5" /></button>
                    <button onClick={()=>{dispatch({type:'SELECT_VEHICLE',payload:v.id});navigate('admin-vehicle-edit');}} className="p-1.5 text-neutral-600 hover:text-white"><Edit className="w-3.5 h-3.5" /></button>
                    {delId===v.id?(<><button onClick={()=>doDelete(v.id)} className="px-2 py-0.5 text-red-400 text-[11px]">Delete</button><button onClick={()=>setDelId(null)} className="px-2 py-0.5 text-neutral-600 text-[11px]">No</button></>):(<button onClick={()=>setDelId(v.id)} className="p-1.5 text-neutral-600 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>)}
                  </div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          {filtered.length===0 && <div className="text-center py-12 text-neutral-600 text-[13px]">No vehicles found</div>}
        </div>
      </div>
    </div>
  );
}
