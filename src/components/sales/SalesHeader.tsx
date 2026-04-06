import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function SalesHeader() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0B0B0F]/90 backdrop-blur-md py-3 border-b border-white/[0.04]'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="text-[#F3EFE7]/80 font-display text-lg tracking-wide hover:text-[#C6A96B] transition-colors"
        >
          Casa Orácula
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'Método', id: 'metodo' },
            { label: 'Formação', id: 'formacao' },
            { label: 'App', id: 'app' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-[#F3EFE7]/40 text-[13px] tracking-wide hover:text-[#F3EFE7]/80 transition-colors"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => navigate('/login')}
            className="text-[#F3EFE7]/40 text-[13px] tracking-wide hover:text-[#F3EFE7]/80 transition-colors"
          >
            Entrar
          </button>
        </nav>

        <button
          onClick={() => scrollTo('oferta')}
          className="text-[#C6A96B] text-[11px] uppercase tracking-[0.25em] font-medium border border-[#C6A96B]/30 px-5 py-2 hover:bg-[#C6A96B]/10 transition-all duration-300"
        >
          Entrar na Formação
        </button>
      </div>
    </motion.header>
  );
}
