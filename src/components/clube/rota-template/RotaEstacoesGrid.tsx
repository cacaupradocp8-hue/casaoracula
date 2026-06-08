import React from 'react';
import { motion } from 'framer-motion';
import { Lock, TreePine } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EstacaoGridProps {
  estacoes: {
    id: string;
    nome: string;
    status: 'locked' | 'unlocked' | 'completed';
    numero: number;
    slug: string;
  }[];
  onSelect: (slug: string) => void;
}

export const RotaEstacoesGrid: React.FC<EstacaoGridProps> = ({ estacoes, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-32">
      {estacoes.map((estacao, idx) => (
        <motion.div
          key={estacao.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          onClick={() => estacao.status !== 'locked' && onSelect(estacao.slug)}
          className={cn(
            "relative group aspect-square md:aspect-[4/5] rounded-[32px] border transition-all duration-500 cursor-pointer overflow-hidden",
            estacao.status === 'locked' 
              ? "bg-white/[0.02] border-white/5 grayscale pointer-events-none" 
              : "bg-midnight/40 border-gold/10 hover:border-gold/30 hover:shadow-[0_20px_50px_rgba(212,175,55,0.1)]"
          )}
        >
          <div className="absolute inset-0 p-8 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold tracking-widest text-gold/40 uppercase">Estação {estacao.numero}</span>
              {estacao.status === 'locked' && <Lock className="w-4 h-4 text-white/20" />}
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-serif text-white group-hover:text-gold transition-colors">{estacao.nome}</h3>
              <div className="flex items-center gap-2 mt-4 text-[10px] uppercase tracking-widest font-bold text-gold/60">
                <TreePine className="w-3 h-3" />
                <span>{estacao.status === 'locked' ? 'Bloqueado' : 'Entrar na Estação'}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
