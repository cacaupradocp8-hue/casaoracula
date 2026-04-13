import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, AlertTriangle, Sprout } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Insight {
  id: string;
  tipo: string;
  texto: string;
}

const ICONS: Record<string, { icon: typeof Lightbulb; label: string }> = {
  reflexao: { icon: Lightbulb, label: 'Reflexão' },
  alerta: { icon: AlertTriangle, label: 'Alerta' },
  movimento: { icon: Sprout, label: 'Movimento' },
};

function getDayIndex(total: number): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return dayOfYear % total;
}

export function InsightDoDia() {
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    (supabase.from('heroina_insights' as any) as any)
      .select('id, tipo, texto')
      .eq('ativo', true)
      .order('created_at')
      .then(({ data }: any) => {
        if (data) setInsights(data);
      });
  }, []);

  const insight = useMemo(() => {
    if (!insights.length) return null;
    return insights[getDayIndex(insights.length)];
  }, [insights]);

  if (!insight) return null;

  const meta = ICONS[insight.tipo] || ICONS.reflexao;
  const Icon = meta.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="rounded-xl border border-gold/10 bg-gold/[0.03] px-5 py-4"
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
            <Icon className="w-3.5 h-3.5 text-gold/60" />
          </div>
          <div className="space-y-1 min-w-0">
            <p className="text-[9px] uppercase tracking-[0.35em] text-gold/40 font-medium">
              {meta.label} do dia
            </p>
            <p className="text-sm text-foreground/70 font-display italic leading-relaxed">
              "{insight.texto}"
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
