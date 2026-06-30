import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Headphones, Play, Pause, ChevronRight, Sparkles, Footprints, ArrowRight, Loader2, RotateCcw, RotateCw, Gauge, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { TextCarousel } from '@/components/clube/TextCarousel';
import { EscutaPremium } from '@/components/clube/EscutaPremium';
import { trackLearningEvent } from '@/services/studentTrackingService';
import { cn } from '@/lib/utils';

interface FechamentoStepProps {
  estacaoId: string;
  rotaId: string;
  titulo: string;
  subtitulo: string;
  texto: string;
  audioUrl?: string;
  proximaEstacaoNome?: string;
  backgroundImage?: string;
  onFinish: () => void;
}

export const EstacaoStepFechamento: React.FC<FechamentoStepProps> = ({
  estacaoId,
  rotaId,
  titulo,
  subtitulo,
  texto,
  audioUrl,
  proximaEstacaoNome,
  backgroundImage,
  onFinish
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();


  const conclusionMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      
      const { error } = await supabase
        .from('clube_conclusao_estacoes')
        .upsert({
          user_id: user.id,
          rota_id: rotaId,
          estacao_id: estacaoId,
          fechamento_concluido: true,
          proxima_estacao_liberada: proximaEstacaoNome,
          data_conclusao: new Date().toISOString()
        }, {
          onConflict: 'user_id,estacao_id'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Estação concluída com sucesso!');
      onFinish();
    },
    onError: (err: any) => {
      toast.error('Erro ao concluir estação: ' + err.message);
    }
  });


  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32 px-4">
      <div className="text-center space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-black">Essência 80/20</span>
          <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-black text-white tracking-[0.04em] sm:tracking-[0.08em] leading-[1.1] uppercase px-2 break-words">
            <span className="bg-gradient-to-b from-white via-white to-gold/70 bg-clip-text text-transparent">
              {titulo}
            </span>
          </h2>

          <p className="text-gold/60 text-base sm:text-lg md:text-2xl font-serif italic max-w-2xl mx-auto leading-relaxed px-4 break-words">
            “{subtitulo}”
          </p>

        </motion.div>
      </div>

      <Card className="bg-[#0A0A0B]/80 backdrop-blur-3xl border border-white/10 p-6 md:p-12 rounded-[32px] md:rounded-[48px] space-y-10 relative overflow-hidden shadow-2xl shadow-black/50">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          {/* Sparkles removed as per user request */}
        </div>

        <div className="relative z-10 space-y-8">
          <div className="max-w-3xl mx-auto py-8">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white font-serif italic text-lg md:text-2xl leading-relaxed"
            >
              {texto}
            </motion.p>
          </div>

          {audioUrl && (
            <div className="pt-8 border-t border-white/5 mt-8">
              <EscutaPremium 
                audioUrl={audioUrl} 
                titulo="Sussurro de Fechamento"
                imagemEscuta="/__l5e/assets-v1/6890f537-199d-46e1-9f3c-0c52f74c483f/disco-vinil-premium.png"
                className="py-0"
              />
            </div>
          )}
        </div>
      </Card>




      <div className="flex flex-col items-center gap-8 pt-8">

        <div className="flex justify-center w-full max-w-2xl">
          <button
            onClick={() => conclusionMutation.mutate()}
            disabled={conclusionMutation.isPending}
            className="group relative px-10 py-5 rounded-full border border-gold/40 bg-gold/[0.04] backdrop-blur-sm overflow-hidden transition-all duration-500 active:scale-[0.98] hover:border-gold/70 hover:shadow-[0_0_30px_-8px_rgba(212,175,55,0.45)] disabled:opacity-50"
          >
            <span className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative inline-flex items-center justify-center gap-3 text-[11px] font-bold tracking-[0.25em] uppercase text-gold">
              {conclusionMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {conclusionMutation.isPending
                ? 'Finalizando…'
                : proximaEstacaoNome
                  ? 'Concluir e Entrar na Próxima Travessia'
                  : 'Concluir Estação'}
              {!conclusionMutation.isPending && (
                <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1.5 transition-transform duration-500" />
              )}
            </span>
          </button>
        </div>

        {proximaEstacaoNome && (
          <div className="flex items-center gap-3 text-white/30">
            <Footprints className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold italic">
              Rumo à {proximaEstacaoNome}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
