import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Headphones, Play, Pause, ChevronRight, Sparkles, Footprints, ArrowRight, Loader2, RotateCcw, RotateCw, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { TextCarousel } from '@/components/clube/TextCarousel';
import { EscutaPremium } from '@/components/clube/EscutaPremium';
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
          <h2 className="text-4xl md:text-6xl font-serif text-white italic">{titulo}</h2>
          <p className="text-gold/60 text-xl md:text-2xl font-serif italic max-w-2xl mx-auto leading-relaxed">
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
                imagemEscuta="/clareira-disco.png"
                className="py-0"
              />
            </div>
          )}
        </div>
      </Card>

      <div className="flex flex-col items-center gap-8 pt-8">
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl justify-center">
          <Button
            onClick={() => conclusionMutation.mutate()}
            disabled={conclusionMutation.isPending}
            className="flex-1 bg-white text-midnight hover:bg-white/90 font-bold h-20 rounded-full text-xs uppercase tracking-widest shadow-2xl transition-all hover:scale-105"
          >
            {conclusionMutation.isPending ? 'Finalizando...' : 'Concluir Estação'}
          </Button>
          
          {proximaEstacaoNome && (
            <Button
              variant="outline"
              disabled={conclusionMutation.isPending}
              onClick={() => conclusionMutation.mutate()}
              className="flex-1 border-gold/20 text-gold hover:bg-gold/5 font-bold h-20 rounded-full text-xs uppercase tracking-widest transition-all group"
            >
              Entrar na Próxima Travessia
              <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
          )}
        </div>
        
        {proximaEstacaoNome && (
          <div className="flex items-center gap-3 text-white/30">
            <Footprints className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-black italic">
              Rumo à {proximaEstacaoNome}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
