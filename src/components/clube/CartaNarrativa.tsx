import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface CartaNarrativaProps {
  titulo: string;
  texto: string;
  assinatura: string;
  imagemFundo?: string;
  className?: string;
}

export const CartaNarrativa: React.FC<CartaNarrativaProps> = ({
  titulo,
  texto,
  assinatura,
  imagemFundo = "https://images.unsplash.com/photo-1586075010633-2442dc3d8c5f?auto=format&fit=crop&q=80",
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2 }}
      className={`relative max-w-3xl mx-auto ${className}`}
    >
      {/* Visual da Carta */}
      <div className="relative p-12 md:p-20 shadow-2xl rounded-sm overflow-hidden min-h-[500px] flex flex-col justify-center">
        {/* Textura de Papel */}
        <div className="absolute inset-0 z-0">
          <img 
            src={imagemFundo} 
            alt="Textura de Papel" 
            className="w-full h-full object-cover opacity-90 sepia-[0.2] brightness-105"
          />
          <div className="absolute inset-0 bg-white/10 mix-blend-overlay" />
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.1)]" />
        </div>

        {/* Bordas e Detalhes */}
        <div className="absolute inset-4 border border-black/5 pointer-events-none" />
        
        {/* Conteúdo */}
        <div className="relative z-10 space-y-12 text-black/80">
          <div className="space-y-4">
            <Quote className="w-10 h-10 text-black/10 -ml-2" />
            <h3 className="text-3xl md:text-4xl font-serif tracking-tight text-black/90">
              {titulo}
            </h3>
          </div>

          <div className="space-y-6 text-lg md:text-xl font-serif leading-relaxed italic">
            {texto.split('\n').map((paragrafo, idx) => (
              <p key={idx}>{paragrafo}</p>
            ))}
          </div>

          <div className="pt-8 border-t border-black/5 flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-black/30">Assinado,</p>
              <p className="text-2xl font-serif text-black/70 italic">{assinatura}</p>
            </div>
            
            {/* Selo da Casa */}
            <div className="w-16 h-16 rounded-full border-2 border-red-900/20 flex items-center justify-center opacity-40 rotate-12">
              <div className="text-[8px] font-bold text-red-900 uppercase text-center leading-tight tracking-tighter">
                Casa<br/>Orácula
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
