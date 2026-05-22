import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useApp } from '@/store/AppContext';

export default function Notification() {
  const { state, dispatch } = useApp();
  useEffect(() => { if (state.notification) { const t = setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 4000); return () => clearTimeout(t); } }, [state.notification, dispatch]);
  if (!state.notification) return null;
  const { type, message } = state.notification;
  const c = { success: 'border-emerald-800 bg-emerald-950/80 text-emerald-300', error: 'border-red-800 bg-red-950/80 text-red-300', info: 'border-[#d4af37]/30 bg-[#1a1500] text-[#d4af37]' }[type];
  const i = { success: <CheckCircle className="w-4 h-4" />, error: <XCircle className="w-4 h-4" />, info: <Info className="w-4 h-4" /> }[type];
  return (
    <div className="fixed top-20 right-6 z-[100] animate-slide-in">
      <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border backdrop-blur-sm text-[13px] ${c}`}>
        {i}<span>{message}</span>
        <button onClick={() => dispatch({ type: 'CLEAR_NOTIFICATION' })} className="ml-1 opacity-50 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );
}
