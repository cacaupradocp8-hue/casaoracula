import React from 'react';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CIDADELA_TERRITORIOS } from '@/types/cidadela-territorios';

interface Props {
  territoriosAtivados?: string[];
}

export function CidadelaAtivadaBloco({ territoriosAtivados }: Props) {
  if (!territoriosAtivados || territoriosAtivados.length === 0) return null;

  // Resolve territórios oficiais para evitar dados inventados
  const territorios = territoriosAtivados
    .map(idOrName => CIDADELA_TERRITORIOS.find(
      t => t.id === idOrName || t.nome.toLowerCase() === idOrName.toLowerCase()
    ))
    .filter((t): t is typeof CIDADELA_TERRITORIOS[number] => !!t);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {territorios.map((t, i) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="border-gold/20 bg-gold/5 hover:bg-gold/10 transition-all duration-500 group overflow-hidden">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center shrink-0 border border-gold/20 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6 text-gold" />
              </div>
              <div className="space-y-1">
                <p className="text-[9px] tracking-[0.3em] uppercase text-gold/60 font-bold">Território Ativo</p>
                <h4 className="font-display text-lg text-gold">{t.nome}</h4>
                {'descricao_curta' in t && (
                  <p className="text-xs text-white/50 leading-relaxed font-serif italic">
                    {t.descricao_curta}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

