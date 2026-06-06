import React from 'react';
import { motion } from 'framer-motion';
import { DoorOpen, Layout, ShieldAlert, Layers } from 'lucide-react';

export function AtivoAgoraBloco() {
  const cards = [
    {
      title: 'Porta ativa',
      value: 'Retorno à Referência Interna',
      icon: DoorOpen,
      color: 'gold'
    },
    {
      title: 'Torre observada',
      value: 'Sobrevivência Funcional',
      icon: Layout,
      color: 'blue'
    },
    {
      title: 'Labirinto recorrente',
      value: 'funcionar → desconectar → esvaziar → continuar funcionando',
      icon: ShieldAlert,
      color: 'red'
    },
    {
      title: 'Campo de leitura',
      value: 'Vitalidade soterrada',
      icon: Layers,
      color: 'emerald'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
          whileHover={{ y: -5 }}
          className="relative group h-full"
        >
          {/* Background Glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-br from-gold/20 via-transparent to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
          
          <div className="relative h-full bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] backdrop-blur-sm group-hover:bg-white/[0.05] group-hover:border-white/20 transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <card.icon className="w-7 h-7 text-gold/80" />
            </div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/30 font-bold mb-3">{card.title}</p>
            <p className="font-display text-xl text-white/90 leading-snug tracking-tight">{card.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
