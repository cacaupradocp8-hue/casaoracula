import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Activity, AlertTriangle, Link, HelpCircle, ShieldAlert, CheckCircle2, Send, Quote, Map, DoorOpen, TowerControl, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { TextCarousel } from '@/components/clube/TextCarousel';
import { SombraDaTorre } from './SombraDaTorre';
import { CasaDosNaosNuncaDitos } from './CasaDosNaosNuncaDitos';

interface CasoSimbolicoProps {
  estacaoId: string;
  rotaId: string;
  estacaoSlug?: string;
  casoData: {
    nomeFicticio: string;
    idade: string;
    contexto: string;
    fraseCentral: string;
    fraseDestaque?: string;
    campoSuperficie: string;
    campoSimbolico: string;
    campoNaoConcluir: string;
    relacaoConto: string;
    perguntaConducao: string;
    cautelaEtica: string;
    traducaoTerritorio?: string;
    traducaoPorta?: string;
    traducaoTorre?: string;
    traducaoLabirinto?: string;
  };
  onNext: () => void;
}

export const EstacaoStepCasoSimbolico: React.FC<CasoSimbolicoProps> = ({
  estacaoId,
  rotaId,
  estacaoSlug,
  casoData,
  onNext
}) => {
  const { user } = useAuth();
  const [view, setView] = useState<'intro' | 'analise' | 'integracao' | 'concluido'>('intro');

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      
      const { error } = await supabase
        .from('clube_caso_simbolico_registros')
        .insert({
          user_id: user.id,
          rota_id: rotaId,
          estacao_id: estacaoId,
          caso_titulo: `${casoData.nomeFicticio}, ${casoData.idade}`,
          status: 'concluido'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      setView('concluido');
      toast.success('Caso simbólico concluído!');
    },
    onError: (err: any) => {
      toast.error('Erro ao salvar registro: ' + err.message);
    }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 px-4">
      {view !== 'intro' && view !== 'concluido' && (
        <button 
          onClick={() => {
            if (view === 'analise') setView('intro');
            if (view === 'integracao') setView('analise');
          }}
          className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-widest font-bold hover:text-white transition-colors"
        >
          <User className="w-3 h-3 rotate-180" />
          Voltar no Caso
        </button>
      )}
      <AnimatePresence mode="wait">

        {view === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-8 py-10"
          >
            <div className="space-y-4">
              <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-gold" />
              </div>
              <h2 className="text-2xl xs:text-3xl sm:text-5xl md:text-7xl font-display font-black text-white tracking-[0.1em] leading-tight uppercase px-4 break-words">
                <span className="bg-gradient-to-b from-white via-white to-gold/70 bg-clip-text text-transparent">
                  Caso <br className="xs:hidden" /> Simbólico
                </span>
              </h2>

              <p className="text-gold/60 text-xl max-w-2xl mx-auto font-serif italic leading-relaxed">
                “Onde o conto encontra a vida real.”
              </p>
            </div>

            <Card className="bg-white/[0.02] border-white/5 p-10 rounded-[32px] space-y-6 max-w-3xl mx-auto text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Quote className="w-24 h-24 text-gold" />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center border border-gold/30">
                    <span className="text-gold font-serif text-xl">{casoData.nomeFicticio.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-serif text-white italic">{casoData.nomeFicticio}, {casoData.idade}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-gold/60 font-black">Identificação Narrativa</p>
                  </div>
                </div>
                
                <TextCarousel 
                  text={casoData.contexto} 
                  className="text-white/80 text-lg leading-relaxed font-serif italic border-l-2 border-gold/30 pl-6"
                />

                <div className="bg-gold/5 border border-gold/10 p-4 md:p-6 rounded-2xl italic text-gold text-lg md:text-xl font-serif text-center break-words">
                  "{casoData.fraseCentral}"
                </div>

                {casoData.fraseDestaque && (
                  <div className="pt-2">
                    <p className="text-gold/90 text-2xl md:text-3xl font-serif italic leading-snug text-center px-2 md:px-6">
                      "{casoData.fraseDestaque}"
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-center pt-4">
                <Button 
                  onClick={() => setView('analise')}
                  className="bg-gold hover:bg-gold/80 text-midnight font-bold px-12 py-7 rounded-full text-xs uppercase tracking-widest transition-all shadow-2xl shadow-gold/20 hover:scale-105"
                >
                  Observar Campo
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {view === 'analise' && (
          <motion.div
            key="analise"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            <div className="text-center space-y-2">
              <h3 className="text-sm uppercase tracking-[0.4em] text-gold font-bold">Campo Observado</h3>
              <p className="text-white/40 font-serif italic text-lg">Prontuário Narrativo Simbólico</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white/[0.03] border-white/10 p-8 rounded-[32px] space-y-4">
                <div className="flex items-center gap-3 text-gold/80 mb-2">
                  <Activity className="w-5 h-5" />
                  <span className="text-[10px] uppercase tracking-widest font-black">Na Superfície</span>
                </div>
                <p className="text-white/70 font-serif italic text-lg leading-relaxed">
                  {casoData.campoSuperficie}
                </p>
              </Card>

              <Card className="bg-white/[0.03] border-white/10 p-8 rounded-[32px] space-y-4">
                <div className="flex items-center gap-3 text-emerald-400/80 mb-2">
                  <Activity className="w-5 h-5" />
                  <span className="text-[10px] uppercase tracking-widest font-black">Simbolicamente</span>
                </div>
                <p className="text-white/70 font-serif italic text-lg leading-relaxed">
                  {casoData.campoSimbolico}
                </p>
              </Card>
            </div>

            <Card className="bg-red-500/5 border-red-500/10 p-8 rounded-[32px] flex items-start gap-6">
              <AlertTriangle className="w-8 h-8 text-red-400/60 shrink-0 mt-1" />
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-red-400/60 font-black">O que NÃO concluir rapidamente</span>
                <p className="text-white/60 font-serif italic text-lg leading-relaxed italic">
                  {casoData.campoNaoConcluir}
                </p>
              </div>
            </Card>

            <Card className="bg-white/[0.03] border-white/10 p-10 rounded-[40px] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Link className="w-24 h-24 text-gold" />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3 text-gold/80">
                  <Link className="w-6 h-6" />
                  <h4 className="text-xl font-serif italic tracking-wide">Relação com o Conto</h4>
                </div>
                <p className="text-white/90 font-serif italic text-2xl leading-relaxed">
                  {casoData.relacaoConto}
                </p>
              </div>
            </Card>

            <div className="flex justify-center pt-8">
              <Button 
                onClick={() => setView('integracao')}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-12 py-7 rounded-full text-xs uppercase tracking-widest"
              >
                Ver Cartografia Relacionada
              </Button>
            </div>
          </motion.div>
        )}

        {view === 'integracao' && (
          <motion.div
            key="integracao"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="text-center space-y-2">
              <h3 className="text-sm uppercase tracking-[0.4em] text-gold font-bold">Integração e Cautela</h3>
              <p className="text-white/40 font-serif italic text-lg">Mapeamento do Ofício</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl space-y-2 text-center">
                <Map className="w-5 h-5 text-gold/30 mx-auto" />
                <span className="text-[8px] uppercase tracking-widest text-white/30 font-bold block">Território</span>
                <p className="text-white/80 font-serif italic text-sm">{casoData.traducaoTerritorio || 'Bosque dos Arquétipos'}</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl space-y-2 text-center">
                <DoorOpen className="w-5 h-5 text-gold/30 mx-auto" />
                <span className="text-[8px] uppercase tracking-widest text-white/30 font-bold block">Porta</span>
                <p className="text-white/80 font-serif italic text-sm">{casoData.traducaoPorta || 'Porta do Chamado'}</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl space-y-2 text-center">
                <TowerControl className="w-5 h-5 text-gold/30 mx-auto" />
                <span className="text-[8px] uppercase tracking-widest text-white/30 font-bold block">Torre</span>
                <p className="text-white/80 font-serif italic text-sm">{casoData.traducaoTorre || 'Torre da Sobrevivência'}</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl space-y-2 text-center">
                <GitBranch className="w-5 h-5 text-gold/30 mx-auto" />
                <span className="text-[8px] uppercase tracking-widest text-white/30 font-bold block">Labirinto</span>
                <p className="text-white/80 font-serif italic text-sm">{casoData.traducaoLabirinto || 'Adaptar → Esquecer'}</p>
              </div>
            </div>

            <Card className="bg-gold/5 border border-gold/10 p-10 rounded-[40px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <HelpCircle className="w-24 h-24 text-gold" />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3 text-gold/80">
                  <HelpCircle className="w-6 h-6" />
                  <h4 className="text-xl font-serif italic tracking-wide">Pergunta de Condução</h4>
                </div>
                <p className="text-white font-serif italic text-3xl leading-relaxed">
                  {casoData.perguntaConducao}
                </p>
                <p className="text-gold/40 text-[10px] uppercase tracking-widest font-black">Perguntar com suavidade e escuta atenta</p>
              </div>
            </Card>

            <div className="bg-blue-500/5 border border-blue-500/10 p-8 rounded-[32px] space-y-4">
              <div className="flex items-center gap-3 text-blue-400/80">
                <ShieldAlert className="w-6 h-6" />
                <h4 className="text-lg font-serif italic tracking-wide">Cautela Ética</h4>
              </div>
              <p className="text-white/60 font-serif italic text-lg leading-relaxed italic">
                {casoData.cautelaEtica}
              </p>
            </div>

            <div className="flex justify-center pt-8">
              <Button 
                disabled={saveMutation.isPending}
                onClick={() => saveMutation.mutate()}
                className="bg-gold hover:bg-gold/80 text-midnight font-bold px-16 h-20 rounded-full text-xs uppercase tracking-widest shadow-2xl shadow-gold/20 transition-all hover:scale-105"
              >
                {saveMutation.isPending ? (
                  <span className="flex items-center gap-3">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                      <Activity className="w-5 h-5" />
                    </motion.div>
                    Processando Registro...
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-3" />
                    Concluir Caso Simbólico
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {view === 'concluido' && (
          <motion.div
            key="concluido"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-12 py-20"
          >
            <div className="w-28 h-24 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-gold border border-gold/20 shadow-2xl shadow-gold/10">
              <CheckCircle2 className="w-14 h-14" />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif text-white italic">Caso Simbólico Integrado</h2>
              <p className="text-white/40 text-lg max-w-md mx-auto font-serif italic">
                A observação do caso foi registrada. Agora você está pronta para os próximos passos desta clareira.
              </p>
            </div>
            <Button 
              onClick={onNext}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-16 h-16 rounded-full text-[10px] uppercase tracking-[0.3em]"
            >
              Continuar Travessia
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};