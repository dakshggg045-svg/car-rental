import { useState } from 'react';
import { Menu, X, Shield, LogOut } from 'lucide-react';
import { useApp } from '@/store/AppContext';

export default function Header() {
  const { state, dispatch, navigate } = useApp();
  const [open, setOpen] = useState(false);
  const links = [{ label: 'Home', page: 'home' as const }, { label: 'Fleet', page: 'fleet' as const }];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/70 backdrop-blur-xl border-b border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => navigate('home')} className="flex items-center gap-3">
            <span className="font-display text-xl tracking-tight text-white">Drive<span className="gold-text">Luxe</span></span>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <button key={l.page} onClick={() => navigate(l.page)}
                className={`text-[13px] tracking-wide uppercase transition-colors ${
                  state.currentPage === l.page ? 'text-[#d4af37]' : 'text-neutral-400 hover:text-white'
                }`}>
                {l.label}
              </button>
            ))}
            <div className="w-px h-4 bg-white/10" />
            {state.isAdminAuthenticated ? (
              <div className="flex items-center gap-2">
                <button onClick={() => navigate('admin')}
                  className={`text-[13px] tracking-wide uppercase flex items-center gap-1.5 transition-colors ${
                    state.currentPage.startsWith('admin') ? 'text-[#d4af37]' : 'text-neutral-400 hover:text-white'
                  }`}>
                  <Shield className="w-3.5 h-3.5" /> Admin
                </button>
                <button onClick={() => dispatch({ type: 'ADMIN_LOGOUT' })} className="p-1 text-neutral-600 hover:text-red-400 transition-colors"><LogOut className="w-3.5 h-3.5" /></button>
              </div>
            ) : (
              <button onClick={() => navigate('admin')} className="text-[13px] tracking-wide uppercase text-neutral-500 hover:text-white flex items-center gap-1.5 transition-colors">
                <Shield className="w-3.5 h-3.5" /> Admin
              </button>
            )}
          </nav>

          <button onClick={() => setOpen(!open)} className="md:hidden p-1.5 text-neutral-400">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-[#111] border-t border-white/[0.04] py-4 px-6 space-y-2">
          {links.map(l => (
            <button key={l.page} onClick={() => { navigate(l.page); setOpen(false); }}
              className={`block w-full text-left py-2 text-sm uppercase tracking-wide ${state.currentPage === l.page ? 'text-[#d4af37]' : 'text-neutral-400'}`}>
              {l.label}
            </button>
          ))}
          <button onClick={() => { navigate('admin'); setOpen(false); }} className="flex items-center gap-2 py-2 text-sm uppercase tracking-wide text-neutral-400">
            <Shield className="w-3.5 h-3.5" /> Admin
          </button>
        </div>
      )}
    </header>
  );
}
