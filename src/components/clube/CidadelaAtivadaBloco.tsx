import React from 'react';
import { motion } from 'framer-motion';
import { Compass, MapPin, Layers, Layout, ShieldAlert, DoorOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Props {
  porta?: string;
  campo?: string;
  torre?: string;
  labirinto?: string;
  territoriosAtivados?: string[];
  estacaoTitulo?: string;
}

export function CidadelaAtivadaBloco({ porta, campo, torre, labirinto, territoriosAtivados, estacaoTitulo }: Props) {
  const items = [
    { label: 'Onde você está', value: estacaoTitulo, icon: MapPin },
    { label: 'A Porta', value: porta, icon: DoorOpen },
    { label: 'Campo de Leitura', value: campo, icon: Layers },
    { label: 'A Torre', value: torre, icon: Layout },
    { label: 'O Labirinto', value: labirinto, icon: ShieldAlert },
  ].filter(c => c.value && typeof c.value === 'string' && c.value.trim());

  if (items.length === 0 && (!territoriosAtivados || territoriosAtivados.length === 0)) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
          <Compass className="w-4 h-4 text-gold" />
        </div>
        <h3 className="font-display text-xl text-white">Territórios ativados nesta travessia</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold/5 flex items-center justify-center shrink-0 border border-gold/10">
                  <item.icon className="w-4 h-4 text-gold/60" />
                </div>
                <div>
                  <p className="text-[8px] tracking-[0.3em] uppercase text-white/30 font-bold">{item.label}</p>
                  <p className="font-display text-base text-white/90">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {territoriosAtivados?.map((t, i) => (
          <motion.div
            key={`t-${i}`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: (items.length + i) * 0.1 }}
          >
            <Card className="border-gold/20 bg-gold/5 hover:bg-gold/10 transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0 border border-gold/20">
                  <Compass className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <p className="text-[8px] tracking-[0.3em] uppercase text-gold/60 font-bold">Território Ativo</p>
                  <p className="font-display text-base text-gold">{t}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
