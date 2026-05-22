import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameDay, isSameMonth, isBefore, isAfter, isWithinInterval, startOfDay } from 'date-fns';

interface Props { pickupDate: string; returnDate: string; onPickupChange: (d: string) => void; onReturnChange: (d: string) => void; blockedDates?: Array<{ start: string; end: string }>; minDate?: Date; }

export default function DateRangePicker({ pickupDate, returnDate, onPickupChange, onReturnChange, blockedDates = [], minDate = new Date() }: Props) {
  const [month, setMonth] = useState(startOfMonth(minDate));
  const [selecting, setSelecting] = useState<'pickup'|'return'>('pickup');
  const pickup = pickupDate ? new Date(pickupDate+'T00:00:00') : null;
  const returnD = returnDate ? new Date(returnDate+'T00:00:00') : null;
  const isBlocked = (d: Date) => blockedDates.some(b => isWithinInterval(d, { start: new Date(b.start+'T00:00:00'), end: new Date(b.end+'T00:00:00') }));
  const isDisabled = (d: Date) => isBefore(startOfDay(d), startOfDay(minDate)) || isBlocked(d);

  const handleClick = (date: Date) => {
    if (isDisabled(date)) return;
    const ds = format(date, 'yyyy-MM-dd');
    if (selecting === 'pickup') { onPickupChange(ds); if (!returnD || !isAfter(returnD, date)) onReturnChange(''); setSelecting('return'); }
    else { if (pickup && isAfter(date, pickup)) { const hasBlock = blockedDates.some(b => { const bs=new Date(b.start+'T00:00:00'); const be=new Date(b.end+'T00:00:00'); return (isAfter(bs,pickup)&&isBefore(bs,date))||(isAfter(be,pickup)&&isBefore(be,date)); }); if (hasBlock){onPickupChange(ds);onReturnChange('');setSelecting('return');}else{onReturnChange(ds);setSelecting('pickup');} } else { onPickupChange(ds); onReturnChange(''); setSelecting('return'); } }
  };

  const cls = (d: Date) => {
    const b = 'w-9 h-9 flex items-center justify-center text-[13px] rounded-lg ';
    if (isDisabled(d)) return b+'text-neutral-800 cursor-not-allowed';
    if (pickup && isSameDay(d,pickup)) return b+'bg-[#d4af37] text-black font-medium';
    if (returnD && isSameDay(d,returnD)) return b+'bg-[#d4af37] text-black font-medium';
    if (pickup && returnD && isAfter(d,pickup) && isBefore(d,returnD)) return b+'bg-[#d4af37]/15 text-[#d4af37]';
    if (!isSameMonth(d,month)) return b+'text-neutral-800 hover:bg-white/[0.04] cursor-pointer';
    return b+'text-neutral-300 hover:bg-white/[0.06] cursor-pointer';
  };

  const days = useMemo(() => { const s=startOfWeek(startOfMonth(month)); const e=endOfWeek(endOfMonth(month)); const a:Date[]=[]; let d=s; while(d<=e){a.push(d);d=addDays(d,1);} return a; }, [month]);

  return (
    <div className="border border-white/[0.06] rounded-xl p-5 bg-[#111]">
      <div className="flex gap-2 mb-5">
        {(['pickup','return'] as const).map(t => (
          <button key={t} onClick={() => setSelecting(t)}
            className={`flex-1 py-2.5 rounded-lg text-[13px] transition-colors ${selecting===t ? 'bg-[#1a1a1a] text-white border border-white/[0.08]' : 'text-neutral-500 hover:text-neutral-300'}`}>
            <div className="text-[10px] text-neutral-600 uppercase tracking-wider mb-0.5">{t==='pickup'?'Pickup':'Return'}</div>
            <div className="font-medium">{t==='pickup'?(pickup?format(pickup,'MMM d, yyyy'):'Select date'):(returnD?format(returnD,'MMM d, yyyy'):'Select date')}</div>
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setMonth(subMonths(month,1))} className="p-1.5 text-neutral-600 hover:text-white rounded-lg hover:bg-white/[0.04]"><ChevronLeft className="w-4 h-4" /></button>
        <span className="text-[14px] text-white font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>{format(month,'MMMM yyyy')}</span>
        <button onClick={() => setMonth(addMonths(month,1))} className="p-1.5 text-neutral-600 hover:text-white rounded-lg hover:bg-white/[0.04]"><ChevronRight className="w-4 h-4" /></button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">{['S','M','T','W','T','F','S'].map((d,i) => <div key={i} className="w-9 h-7 flex items-center justify-center text-[10px] text-neutral-700 uppercase">{d}</div>)}</div>
      <div className="grid grid-cols-7 gap-0.5">{days.map((d,i) => <button key={i} onClick={()=>handleClick(d)} disabled={isDisabled(d)} className={cls(d)}>{format(d,'d')}</button>)}</div>
    </div>
  );
}
