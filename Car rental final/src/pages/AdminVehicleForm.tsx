import { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, Plus } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { Vehicle, VehicleCategory, VehicleStatus, VehicleSpecs } from '@/types';
import { VEHICLE_IMAGES } from '@/data/vehicles';

export default function AdminVehicleForm({ mode }: { mode: 'add'|'edit' }) {
  const { state, dispatch, navigate, getVehicle } = useApp();
  const existing = mode==='edit' ? getVehicle(state.selectedVehicleId||'') : null;
  const [make,setMake]=useState('');const [model,setModel]=useState('');const [year,setYear]=useState(2024);
  const [rate,setRate]=useState(3000);const [cat,setCat]=useState<VehicleCategory>('Sedan');const [status,setStatus]=useState<VehicleStatus>('available');
  const [color,setColor]=useState('');const [plate,setPlate]=useState('');const [miles,setMiles]=useState(0);
  const [fuel,setFuel]=useState<VehicleSpecs['fuel']>('Gasoline');const [trans,setTrans]=useState<VehicleSpecs['transmission']>('Automatic');
  const [seats,setSeats]=useState(5);const [doors,setDoors]=useState(4);const [lug,setLug]=useState(3);
  const [ac,setAc]=useState(true);const [gps,setGps]=useState(true);
  const [imgs,setImgs]=useState<string[]>([]);const [newUrl,setNewUrl]=useState('');

  useEffect(()=>{if(existing){setMake(existing.make);setModel(existing.model);setYear(existing.year);setRate(existing.daily_rate);setCat(existing.category);setStatus(existing.status);setColor(existing.color);setPlate(existing.plate);setMiles(existing.mileage);setFuel(existing.specs.fuel);setTrans(existing.specs.transmission);setSeats(existing.specs.seats);setDoors(existing.specs.doors);setLug(existing.specs.luggage);setAc(existing.specs.ac);setGps(existing.specs.gps);setImgs(existing.image_urls);}},[existing]);

  const submit = () => {
    if(!make||!model||!plate||!color){dispatch({type:'SET_NOTIFICATION',payload:{type:'error',message:'Fill required fields'}});return;}
    const i = imgs.length>0?imgs:(VEHICLE_IMAGES[cat.toLowerCase()]||VEHICLE_IMAGES['sedan']);
    const v:Vehicle = {id:existing?.id||`v${Date.now()}`,make,model,year,daily_rate:rate,category:cat,status,color,plate,mileage:miles,specs:{fuel,transmission:trans,seats,doors,luggage:lug,ac,gps},image_urls:i};
    dispatch({type:mode==='edit'?'UPDATE_VEHICLE':'ADD_VEHICLE',payload:v});dispatch({type:'SET_NOTIFICATION',payload:{type:'success',message:`${make} ${model} ${mode==='edit'?'updated':'added'}`}});navigate('admin-vehicles');
  };
  const f = "w-full px-3 py-2.5 bg-[#0a0a0a] border border-white/[0.08] rounded-lg text-white text-[13px] focus:border-[#d4af37]/50 focus:outline-none";
  const lb = "block text-[10px] text-neutral-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-16">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
        <div className="flex items-center gap-3 mb-6"><button onClick={()=>navigate('admin-vehicles')} className="text-neutral-500 hover:text-white transition-colors"><ArrowLeft className="w-4 h-4" /></button><h1 className="font-display text-[22px] text-white">{mode==='edit'?'Edit Vehicle':'Add Vehicle'}</h1></div>
        <div className="space-y-5">
          <div className="border border-white/[0.06] rounded-xl p-5 bg-[#111]"><h2 className="text-[11px] text-neutral-500 uppercase tracking-widest font-semibold mb-4">Details</h2><div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <div><label className={lb}>Make *</label><input type="text" value={make} onChange={e=>setMake(e.target.value)} placeholder="Toyota" className={f} /></div>
            <div><label className={lb}>Model *</label><input type="text" value={model} onChange={e=>setModel(e.target.value)} placeholder="Camry" className={f} /></div>
            <div><label className={lb}>Year</label><input type="number" value={year} onChange={e=>setYear(+e.target.value)} className={f} /></div>
            <div><label className={lb}>Color *</label><input type="text" value={color} onChange={e=>setColor(e.target.value)} placeholder="Black" className={f} /></div>
            <div><label className={lb}>Plate *</label><input type="text" value={plate} onChange={e=>setPlate(e.target.value)} placeholder="ABC-1234" className={f} /></div>
            <div><label className={lb}>Mileage</label><input type="number" value={miles} onChange={e=>setMiles(+e.target.value)} className={f} /></div>
          </div></div>
          <div className="border border-white/[0.06] rounded-xl p-5 bg-[#111]"><h2 className="text-[11px] text-neutral-500 uppercase tracking-widest font-semibold mb-4">Pricing</h2><div className="grid grid-cols-3 gap-3">
            <div><label className={lb}>₹/day</label><input type="number" value={rate} onChange={e=>setRate(+e.target.value)} className={f} /></div>
            <div><label className={lb}>Category</label><select value={cat} onChange={e=>setCat(e.target.value as any)} className={f}>{['Economy','Compact','Sedan','SUV','Luxury','Van','Sports','Electric'].map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label className={lb}>Status</label><select value={status} onChange={e=>setStatus(e.target.value as any)} className={f}><option value="available">Available</option><option value="maintenance">Maintenance</option><option value="retired">Retired</option></select></div>
          </div></div>
          <div className="border border-white/[0.06] rounded-xl p-5 bg-[#111]"><h2 className="text-[11px] text-neutral-500 uppercase tracking-widest font-semibold mb-4">Specs</h2><div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div><label className={lb}>Fuel</label><select value={fuel} onChange={e=>setFuel(e.target.value as any)} className={f}><option>Gasoline</option><option>Diesel</option><option>Electric</option><option>Hybrid</option></select></div>
            <div><label className={lb}>Transmission</label><select value={trans} onChange={e=>setTrans(e.target.value as any)} className={f}><option>Automatic</option><option>Manual</option></select></div>
            <div><label className={lb}>Seats</label><input type="number" value={seats} onChange={e=>setSeats(+e.target.value)} className={f} /></div>
            <div><label className={lb}>Doors</label><input type="number" value={doors} onChange={e=>setDoors(+e.target.value)} className={f} /></div>
            <div><label className={lb}>Luggage</label><input type="number" value={lug} onChange={e=>setLug(+e.target.value)} className={f} /></div>
            <div className="flex items-end gap-4 pb-1">
              <label className="flex items-center gap-1.5 text-[13px] text-neutral-400 cursor-pointer"><input type="checkbox" checked={ac} onChange={e=>setAc(e.target.checked)} className="accent-[#d4af37]" />A/C</label>
              <label className="flex items-center gap-1.5 text-[13px] text-neutral-400 cursor-pointer"><input type="checkbox" checked={gps} onChange={e=>setGps(e.target.checked)} className="accent-[#d4af37]" />GPS</label>
            </div>
          </div></div>
          <div className="border border-white/[0.06] rounded-xl p-5 bg-[#111]">
            <div className="flex items-center justify-between mb-4"><h2 className="text-[11px] text-neutral-500 uppercase tracking-widest font-semibold">Images</h2><button onClick={()=>setImgs(VEHICLE_IMAGES[cat.toLowerCase()]||VEHICLE_IMAGES['sedan'])} className="text-[11px] text-[#d4af37]">Use defaults</button></div>
            {imgs.length>0 && <div className="flex flex-wrap gap-2 mb-3">{imgs.map((u,i)=><div key={i} className="relative w-20 h-14 rounded-lg overflow-hidden bg-neutral-800 group"><img src={u} alt="" className="w-full h-full object-cover" /><button onClick={()=>setImgs(imgs.filter((_,j)=>j!==i))} className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-2.5 h-2.5 text-white" /></button></div>)}</div>}
            <div className="flex gap-2"><input type="url" value={newUrl} onChange={e=>setNewUrl(e.target.value)} placeholder="https://…" className={`flex-1 ${f}`} onKeyDown={e=>{if(e.key==='Enter'&&newUrl.trim()){setImgs([...imgs,newUrl.trim()]);setNewUrl('');}}} /><button onClick={()=>{if(newUrl.trim()){setImgs([...imgs,newUrl.trim()]);setNewUrl('');}}} className="px-3 py-2 bg-neutral-800 text-neutral-400 rounded-lg hover:text-white"><Plus className="w-3.5 h-3.5" /></button></div>
          </div>
          <div className="flex gap-3"><button onClick={()=>navigate('admin-vehicles')} className="px-5 py-3 border border-white/[0.08] text-neutral-400 text-[13px] rounded-lg hover:text-white transition-colors">Cancel</button><button onClick={submit} className="flex-1 py-3 bg-[#d4af37] hover:bg-[#e5c54a] text-black text-[13px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"><Save className="w-4 h-4" />{mode==='edit'?'Update':'Add Vehicle'}</button></div>
        </div>
      </div>
    </div>
  );
}
