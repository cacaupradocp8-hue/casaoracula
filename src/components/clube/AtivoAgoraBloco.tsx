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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl hover:bg-white/[0.05] transition-colors group"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <card.icon className="w-6 h-6 text-gold/80" />
          </div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/40 font-bold mb-2">{card.title}</p>
          <p className="font-display text-lg text-white/90 leading-tight">{card.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
