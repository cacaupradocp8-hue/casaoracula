import React from 'react';
import { motion } from 'framer-motion';
import { Map, CheckCircle2, ChevronRight, Sparkles, Footprints, Target, Compass, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface CartografiaLobaProps {
  estacaoId: string;
  rotaId: string;
  estacaoNome: string;
  rastroNome: string;
  ferramentaDesbloqueada: string;
  distritoImpactado: string;
  distritoSecundario: string;
  competenciaDesenvolvida: string;
  proximaTravessia: string;
  mensagemConclusao: string;
  onNext: () => void;
}

export const EstacaoStepCartografiaLoba: React.FC<CartografiaLobaProps> = ({
  estacaoId,
  rotaId,
  estacaoNome,
  rastroNome,
  ferramentaDesbloqueada,
  distritoImpactado,
  distritoSecundario,
  competenciaDesenvolvida,
  proximaTravessia,
  mensagemConclusao,
  onNext
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      
      const { error } = await supabase
        .from('clube_cartografia_loba_registros')
        .insert({
          user_id: user.id,
          rota_id: rotaId,
          estacao_id: estacaoId,
          estacao_nome: estacaoNome,
          rastro_nome: rastroNome,
          ferramenta_desbloqueada: ferramentaDesbloqueada,
          distrito_impactado: distritoImpactado,
          distrito_secundario: distritoSecundario,
          competencia_desenvolvida: competenciaDesenvolvida,
          proxima_travessia: proximaTravessia,
          status: 'concluido'
        });
      
      if (error) throw error;
      
      // Simulação de integração com CidadELA se houver estrutura (aqui poderíamos chamar uma RPC de impacto)
    },
    onSuccess: () => {
      toast.success('Cartografia atualizada!');
    },
    onError: (err: any) => {
      toast.error('Erro ao salvar cartografia: ' + err.message);
    }
  });

  // Salvar automaticamente ao entrar no passo se ainda não registrado
  React.useEffect(() => {
    saveMutation.mutate();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 px-4">
      <div className="text-center space-y-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-6 relative"
        >
          <div className="absolute inset-0 bg-gold/20 rounded-full animate-ping opacity-20" />
          <Footprints className="w-10 h-10 text-gold" />
        </motion.div>
        
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.4em] text-gold/60 font-black">Cartografia da Loba</span>
          <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-8xl font-display font-black text-white tracking-[0.05em] sm:tracking-[0.1em] leading-tight uppercase relative inline-block px-4 break-words">
            <span className="bg-gradient-to-b from-white via-white to-gold/70 bg-clip-text text-transparent">
              Rastro <br className="xs:hidden" /> Registrado
            </span>
          </h2>


        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card className="bg-white/[0.02] border-white/10 p-6 sm:p-10 rounded-[2rem] sm:rounded-[48px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <Map className="w-32 h-32 text-gold" />
            </div>

            <div className="relative z-10 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gold">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-serif italic">{estacaoNome} — Concluída</span>
                </div>
                <p className="text-white/90 font-serif italic text-xl sm:text-2xl md:text-3xl leading-relaxed whitespace-pre-wrap">
                  {mensagemConclusao}
                </p>

              </div>

              <div className="pt-8 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gold/60">
                    <Compass className="w-4 h-4" />
                    <span className="text-[10px] uppercase tracking-widest font-black">Rastro Conquistado</span>
                  </div>
                  <p className="text-gold text-xl font-serif italic">{rastroNome}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400/60">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10px] uppercase tracking-widest font-black">Competência</span>
                  </div>
                  <p className="text-white/80 font-serif italic text-lg leading-snug">{competenciaDesenvolvida}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gold/5 border border-gold/10 p-6 md:p-8 rounded-[2rem] md:rounded-[32px] flex items-center justify-between group cursor-pointer hover:bg-gold/10 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-midnight border border-gold/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-gold" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gold/60 font-black">Próxima Travessia</span>
                <h4 className="text-white text-xl font-serif italic">{proximaTravessia}</h4>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-gold opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
          </Card>
        </div>

        <div className="space-y-6">
          <div className="bg-white/[0.03] border border-white/10 p-6 md:p-8 rounded-[2rem] md:rounded-[40px] space-y-8">
            <div className="text-center space-y-2">
              <Compass className="w-8 h-8 text-gold/40 mx-auto" />
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-black block">Impacto na CidadELA</span>
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[9px] uppercase text-white/30 font-bold block">Distrito Principal</span>
                <div className="px-4 py-2 rounded-lg bg-gold/10 border border-gold/20 text-gold text-sm font-serif italic text-center">
                  {distritoImpactado}
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="text-[9px] uppercase text-white/30 font-bold block">Distrito Secundário</span>
                <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm font-serif italic text-center">
                  {distritoSecundario}
                </div>
              </div>

              <div className="space-y-1 pt-4 border-t border-white/5">
                <span className="text-[9px] uppercase text-white/30 font-bold block">Ferramenta</span>
                <div className="px-4 py-3 rounded-xl bg-midnight border border-white/5 text-emerald-400 text-sm font-serif italic text-center shadow-inner">
                  {ferramentaDesbloqueada}
                </div>
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={() => navigate('/clube/cidadela')}
              className="w-full border-gold/20 text-gold hover:bg-gold/10 rounded-full h-12 text-[10px] uppercase tracking-widest font-black"
            >
              Ver Reflexo na CidadELA
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <Button
          onClick={onNext}
          className="bg-white text-midnight hover:bg-white/90 font-bold px-8 md:px-16 h-16 md:h-20 rounded-full text-[10px] md:text-xs uppercase tracking-widest shadow-2xl transition-all hover:scale-105 w-full md:w-auto"
        >
          Continuar para Fechamento 80/20
        </Button>
      </div>
    </div>
  );
};
