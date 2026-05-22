import { useState } from 'react';
import { Lock, CheckCircle, AlertCircle, Loader2, Smartphone, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@/utils/pricing';

interface Props { amount: number; customerEmail: string; onSuccess: (pi: string) => void; onCancel: () => void; }
type Step = 'input'|'processing'|'upi-waiting'|'success'|'error';
type Method = 'card'|'upi';
const TC = { ok:'4242424242424242', decline:'4000000000000002', insuf:'4000000000009995' };
const TU = { ok:'success@upi', decline:'decline@upi', timeout:'timeout@upi' };

export default function StripePaymentForm({ amount, customerEmail, onSuccess, onCancel }: Props) {
  const [method,setMethod]=useState<Method>('card');const [step,setStep]=useState<Step>('input');const [error,setError]=useState('');
  const [cardNum,setCardNum]=useState('');const [expiry,setExpiry]=useState('');const [cvc,setCvc]=useState('');const [cardName,setCardName]=useState('');
  const [upiId,setUpiId]=useState('');const [upiApp,setUpiApp]=useState<string|null>(null);const [timer,setTimer]=useState(0);

  const fmtCard=(v:string)=>{const c=v.replace(/\D/g,'').slice(0,16);const g=c.match(/.{1,4}/g);return g?g.join(' '):c;};
  const fmtExp=(v:string)=>{const c=v.replace(/\D/g,'').slice(0,4);return c.length>=2?c.slice(0,2)+'/'+c.slice(2):c;};
  const okCard=(n:string)=>n.replace(/\s/g,'').length===16;
  const okExp=(e:string)=>{const m=e.match(/^(\d{2})\/(\d{2})$/);return m?+m[1]>=1&&+m[1]<=12&&new Date(2000+ +m[2],+m[1])>new Date():false;};
  const okCvc=(c:string)=>/^\d{3,4}$/.test(c);
  const okUpi=(id:string)=>/^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/.test(id.trim());
  const cardType=(()=>{const c=cardNum.replace(/\s/g,'');if(/^4/.test(c))return 'VISA';if(/^5[1-5]/.test(c))return 'MC';if(/^3[47]/.test(c))return 'AMEX';return '';})();
  const inp="w-full px-3 py-2.5 bg-[#0a0a0a] border border-white/[0.08] rounded-lg text-white text-[13px] placeholder:text-neutral-700 focus:border-[#d4af37]/50 focus:outline-none";

  const submitCard=async(e:React.FormEvent)=>{e.preventDefault();setError('');if(!cardName.trim()){setError('Name required');return;}if(!okCard(cardNum)){setError('Invalid card number');return;}if(!okExp(expiry)){setError('Invalid expiry');return;}if(!okCvc(cvc)){setError('Invalid CVC');return;}setStep('processing');await new Promise(r=>setTimeout(r,2000));const cn=cardNum.replace(/\s/g,'');if(cn===TC.decline){setStep('error');setError('Card declined.');return;}if(cn===TC.insuf){setStep('error');setError('Insufficient funds.');return;}setStep('success');setTimeout(()=>onSuccess(`pi_card_${Date.now()}`),1500);};
  const submitUpi=async(e:React.FormEvent)=>{e.preventDefault();setError('');if(!okUpi(upiId)){setError('Invalid UPI ID (e.g. name@upi)');return;}setStep('upi-waiting');setTimer(30);const iv=setInterval(()=>setTimer(p=>{if(p<=1){clearInterval(iv);return 0;}return p-1;}),1000);await new Promise(r=>setTimeout(r,upiId.trim()===TU.timeout?30000:3000));clearInterval(iv);if(upiId.trim()===TU.decline){setStep('error');setError('UPI payment declined.');return;}if(upiId.trim()===TU.timeout){setStep('error');setError('Request timed out.');return;}setStep('success');setTimeout(()=>onSuccess(`pi_upi_${Date.now()}`),1500);};
  const apps=[{id:'gpay',name:'Google Pay'},{id:'phonepe',name:'PhonePe'},{id:'paytm',name:'Paytm'},{id:'bhim',name:'BHIM'}];

  if(step==='processing') return <div className="border border-white/[0.06] rounded-xl p-10 bg-[#111] text-center"><Loader2 className="w-6 h-6 text-[#d4af37] animate-spin mx-auto mb-3" /><p className="text-white text-[14px]">Processing payment…</p><p className="text-neutral-600 text-[12px] mt-1">Do not close this page.</p></div>;
  if(step==='upi-waiting') return <div className="border border-white/[0.06] rounded-xl p-10 bg-[#111] text-center"><Smartphone className="w-6 h-6 text-[#d4af37] mx-auto mb-3" /><p className="text-white text-[14px] mb-1">Approve on your phone</p><p className="text-neutral-600 text-[12px] mb-4">Request sent to <span className="text-white font-mono">{upiId}</span></p><div className="w-full h-1 bg-neutral-800 rounded-full mt-3 mb-2"><div className="h-full bg-[#d4af37] rounded-full transition-all duration-1000" style={{width:`${(timer/30)*100}%`}} /></div><p className="text-[11px] text-neutral-600">{timer}s</p><button onClick={()=>{setStep('input');setError('');}} className="mt-4 text-[12px] text-neutral-500 hover:text-white">Cancel</button></div>;
  if(step==='success') return <div className="border border-emerald-900/50 rounded-xl p-10 bg-[#111] text-center"><CheckCircle className="w-7 h-7 text-emerald-400 mx-auto mb-3" /><p className="text-white text-[14px]">Payment received — {formatCurrency(amount)}</p><p className="text-emerald-400 text-[12px] mt-1">Confirming reservation…</p></div>;

  return (
    <div className="border border-white/[0.06] rounded-xl bg-[#111] overflow-hidden">
      <div className="bg-[#1a1a1a] px-5 py-4 flex items-center justify-between border-b border-white/[0.04]">
        <div className="flex items-center gap-2.5"><Lock className="w-4 h-4 text-neutral-500" /><span className="text-white text-[14px] font-medium">Secure Checkout</span><span className="text-neutral-600 text-[12px]">· Stripe</span></div>
        <span className="text-white font-semibold text-[15px]">{formatCurrency(amount)}</span>
      </div>
      <div className="flex border-b border-white/[0.04]">
        <button onClick={()=>{setMethod('card');setError('');}} className={`flex-1 py-3 text-[13px] text-center font-medium transition-colors ${method==='card'?'text-[#d4af37] border-b-2 border-[#d4af37]':'text-neutral-500 hover:text-neutral-300'}`}>Card</button>
        <button onClick={()=>{setMethod('upi');setError('');}} className={`flex-1 py-3 text-[13px] text-center font-medium transition-colors ${method==='upi'?'text-[#d4af37] border-b-2 border-[#d4af37]':'text-neutral-500 hover:text-neutral-300'}`}>UPI</button>
      </div>

      {method==='card' && (
        <form onSubmit={submitCard} className="p-5 space-y-4">
          <div><label className="block text-[11px] text-neutral-500 uppercase tracking-wider mb-1.5">Email</label><input type="email" value={customerEmail} readOnly className={`${inp} text-neutral-600`} /></div>
          <div><label className="block text-[11px] text-neutral-500 uppercase tracking-wider mb-1.5">Card Number</label><div className="relative"><input type="text" value={cardNum} onChange={e=>setCardNum(fmtCard(e.target.value))} placeholder="1234 1234 1234 1234" className={`${inp} pr-14`} />{cardType && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded">{cardType}</span>}</div></div>
          <div className="grid grid-cols-2 gap-3"><div><label className="block text-[11px] text-neutral-500 uppercase tracking-wider mb-1.5">Expiry</label><input type="text" value={expiry} onChange={e=>setExpiry(fmtExp(e.target.value))} placeholder="MM/YY" className={inp} /></div><div><label className="block text-[11px] text-neutral-500 uppercase tracking-wider mb-1.5">CVC</label><input type="text" value={cvc} onChange={e=>setCvc(e.target.value.replace(/\D/g,'').slice(0,4))} placeholder="123" className={inp} /></div></div>
          <div><label className="block text-[11px] text-neutral-500 uppercase tracking-wider mb-1.5">Name on Card</label><input type="text" value={cardName} onChange={e=>setCardName(e.target.value)} placeholder="J. Smith" className={inp} /></div>
          {error && <p className="flex items-center gap-1.5 text-red-400 text-[13px]"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
          <details className="text-[11px] text-neutral-700"><summary className="cursor-pointer text-neutral-500 hover:text-neutral-400">Test cards</summary><div className="mt-1.5 space-y-0.5 pl-2 text-neutral-600"><div>Success: <code>4242 4242 4242 4242</code></div><div>Declined: <code>4000 0000 0000 0002</code></div><div>No funds: <code>4000 0000 0000 9995</code></div></div></details>
          <div className="flex gap-3 pt-2"><button type="button" onClick={onCancel} className="px-5 py-2.5 border border-white/[0.08] text-neutral-400 text-[13px] rounded-lg hover:text-white transition-colors">Cancel</button><button type="submit" className="flex-1 py-2.5 bg-[#d4af37] hover:bg-[#e5c54a] text-black text-[13px] font-semibold rounded-lg transition-colors">Pay {formatCurrency(amount)}</button></div>
          <div className="flex items-center justify-center gap-3 pt-1 text-[10px] text-neutral-700"><ShieldCheck className="w-3 h-3" /><span>SSL Encrypted</span><span>·</span><span>PCI Compliant</span><span>·</span><span>Powered by Stripe</span></div>
        </form>
      )}

      {method==='upi' && (
        <form onSubmit={submitUpi} className="p-5 space-y-4">
          <div><label className="block text-[11px] text-neutral-500 uppercase tracking-wider mb-2">Quick Pay</label><div className="grid grid-cols-4 gap-2">{apps.map(a => <button type="button" key={a.id} onClick={()=>setUpiApp(upiApp===a.id?null:a.id)} className={`py-2.5 rounded-lg border text-[11px] font-medium transition-colors ${upiApp===a.id?'border-[#d4af37]/40 text-[#d4af37] bg-[#d4af37]/5':'border-white/[0.06] text-neutral-500 hover:text-white hover:border-white/[0.12]'}`}>{a.name}</button>)}</div></div>
          <div className="flex items-center gap-3 text-[11px] text-neutral-700"><div className="flex-1 h-px bg-white/[0.04]" />or enter UPI ID<div className="flex-1 h-px bg-white/[0.04]" /></div>
          <div><label className="block text-[11px] text-neutral-500 uppercase tracking-wider mb-1.5">UPI ID</label><div className="relative"><input type="text" value={upiId} onChange={e=>{setUpiId(e.target.value);setError('');}} placeholder="name@upi" className={`${inp} pr-8`} />{okUpi(upiId) && <CheckCircle className="w-4 h-4 text-emerald-400 absolute right-3 top-1/2 -translate-y-1/2" />}</div><p className="text-[10px] text-neutral-700 mt-1">e.g. name@okaxis, name@ybl</p></div>
          {error && <p className="flex items-center gap-1.5 text-red-400 text-[13px]"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
          <details className="text-[11px] text-neutral-700"><summary className="cursor-pointer text-neutral-500 hover:text-neutral-400">Test UPI IDs</summary><div className="mt-1.5 space-y-0.5 pl-2 text-neutral-600"><div>Success: <code>success@upi</code></div><div>Declined: <code>decline@upi</code></div><div>Timeout: <code>timeout@upi</code></div></div></details>
          <div className="flex gap-3 pt-2"><button type="button" onClick={onCancel} className="px-5 py-2.5 border border-white/[0.08] text-neutral-400 text-[13px] rounded-lg hover:text-white transition-colors">Cancel</button><button type="submit" className="flex-1 py-2.5 bg-[#d4af37] hover:bg-[#e5c54a] text-black text-[13px] font-semibold rounded-lg transition-colors">Pay {formatCurrency(amount)}</button></div>
          <div className="flex items-center justify-center gap-3 pt-1 text-[10px] text-neutral-700"><ShieldCheck className="w-3 h-3" /><span>UPI Secured</span><span>·</span><span>Instant Transfer</span><span>·</span><span>RBI Regulated</span></div>
        </form>
      )}
    </div>
  );
}
