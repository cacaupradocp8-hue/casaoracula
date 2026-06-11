import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles, Send, CheckCircle2, ChevronRight, Info, Target, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { MandalaFinal, TERRITORIOS } from './MandalaFinal';

interface MapaInstintoSoterradoProps {
  estacaoId: string;
  rotaId: string;
  onNext: () => void;
}

type Estado = 'Aceso' | 'Oscilante' | 'Soterrado' | 'Exausto';

const PERGUNTAS = [
  {
    id: 'corpo',
    pergunta: 'Quando meu corpo demonstra desconforto, eu costumo…',
    opcoes: [
      { label: 'Escutar e ajustar rapidamente', valor: 'Aceso' as Estado },
      { label: 'Perceber depois de algum tempo', valor: 'Oscilante' as Estado },
      { label: 'Ignorar para seguir funcionando', valor: 'Soterrado' as Estado },
      { label: 'Só perceber quando já estou no limite', valor: 'Exausto' as Estado }
    ]
  },
  {
    id: 'intuicao',
    pergunta: 'Quando tenho um pressentimento, eu costumo…',
    opcoes: [
      { label: 'Escutar e investigar com respeito', valor: 'Aceso' as Estado },
      { label: 'Considerar, mas buscar confirmação', valor: 'Oscilante' as Estado },
      { label: 'Duvidar até perder a clareza', valor: 'Soterrado' as Estado },
      { label: 'Ignorar porque ‘não tenho provas’', valor: 'Exausto' as Estado }
    ]
  },
  {
    id: 'desejo',
    pergunta: 'Quando algo me atrai profundamente, eu costumo…',
    opcoes: [
      { label: 'Me aproximar com presença', valor: 'Aceso' as Estado },
      { label: 'Observar antes de agir', valor: 'Oscilante' as Estado },
      { label: 'Adiar até esfriar', valor: 'Soterrado' as Estado },
      { label: 'Convencer-me de que não importa', valor: 'Exausto' as Estado }
    ]
  },
  {
    id: 'limites',
    pergunta: 'Quando algo ultrapassa meus limites, eu costumo…',
    opcoes: [
      { label: 'Nomear com clareza', valor: 'Aceso' as Estado },
      { label: 'Tentar ajustar discretamente', valor: 'Oscilante' as Estado },
      { label: 'Tolerar por muito tempo', valor: 'Soterrado' as Estado },
      { label: 'Só perceber depois do desgaste', valor: 'Exausto' as Estado }
    ]
  },
  {
    id: 'criatividade',
    pergunta: 'Quando uma ideia aparece, eu costumo…',
    opcoes: [
      { label: 'Dar algum espaço real', valor: 'Aceso' as Estado },
      { label: 'Registrar para voltar depois', valor: 'Oscilante' as Estado },
      { label: 'Adiar repetidamente', valor: 'Soterrado' as Estado },
      { label: 'Abandonar antes de começar', valor: 'Exausto' as Estado }
    ]
  },
  {
    id: 'vitalidade',
    pergunta: 'Nos últimos meses, eu percebo…',
    opcoes: [
      { label: 'Momentos frequentes de entusiasmo verdadeiro', valor: 'Aceso' as Estado },
      { label: 'Alguns momentos vivos, mas instáveis', valor: 'Oscilante' as Estado },
      { label: 'Poucos momentos de presença viva', valor: 'Soterrado' as Estado },
      { label: 'Distância do que me anima', valor: 'Exausto' as Estado }
    ]
  }
];

export function MapaInstintoSoterrado({ estacaoId, rotaId, onNext }: MapaInstintoSoterradoProps) {
  const { user } = useAuth();
  const [view, setView] = useState<'intro' | 'perguntas' | 'resultado'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [estados, setEstados] = useState<Record<string, Estado>>({});

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      
      const counts: Record<Estado, number> = { Aceso: 0, Oscilante: 0, Soterrado: 0, Exausto: 0 };
      Object.values(estados).forEach(e => counts[e]++);
      
      const territorioMaisAceso = Object.entries(estados).find(([_, e]) => e === 'Aceso')?.[0] || 'Nenhum';
      const territorioMaisSoterrado = Object.entries(estados).find(([_, e]) => e === 'Soterrado' || e === 'Exausto')?.[0] || 'Nenhum';
      const distritoImpactado = TERRITORIOS.find(t => t.id === territorioMaisSoterrado)?.distrito || 'CidadELA';

      const { error } = await supabase
        .from('clube_mapa_instinto_registros')
        .insert({
          user_id: user.id,
          rota_id: rotaId,
          estacao_id: estacaoId,
          ...estados,
          territorio_mais_aceso: territorioMaisAceso,
          territorio_mais_soterrado: territorioMaisSoterrado,
          distrito_cidadela_impactado: distritoImpactado
        });
      
      if (error) throw error;
      
      // Também registrar no clube_engajamento para rastro histórico
      await supabase.from('clube_engajamento').insert({
        user_id: user.id,
        rota_id: rotaId,
        estacao_id: estacaoId,
        tipo_evento: 'ferramenta_mapa_instinto_concluida',
        metadata: { estados, territorioMaisAceso, territorioMaisSoterrado }
      });
    },
    onSuccess: () => {
      setView('resultado');
      toast.success('Mapeamento concluído e guardado.');
    },
    onError: (err: any) => {
      toast.error('Erro ao salvar: ' + err.message);
    }
  });

  const handleSelect = (valor: Estado) => {
    const territoryId = PERGUNTAS[currentIdx].id;
    setEstados(prev => ({ ...prev, [territoryId]: valor }));
    
    if (currentIdx < PERGUNTAS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      saveMutation.mutate();
    }
  };

  const currentPergunta = PERGUNTAS[currentIdx];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 px-4">
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
                <Compass className="w-10 h-10 text-gold" />
              </div>
              <h2 className="text-4xl md:text-6xl font-serif text-white italic">Mapa do Instinto Soterrado™</h2>
              <p className="text-gold/60 text-xl max-w-2xl mx-auto font-serif italic leading-relaxed">
                “O instinto não desaparece. Ele deixa rastros.”
              </p>
            </div>

            <Card className="bg-white/[0.02] border-white/5 p-10 rounded-[32px] space-y-6 max-w-3xl mx-auto text-left relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3 text-gold/80">
                  <Info className="w-5 h-5" />
                  <span className="text-[10px] uppercase tracking-widest font-black">Onde sua loba ainda tenta falar?</span>
                </div>
                <p className="text-white/80 text-lg leading-relaxed font-serif italic">
                  Esta cartografia simbólica identifica quais territórios da sua natureza instintiva ainda enviam sinais e quais estão soterrados por adaptação, dúvida ou excesso de funcionamento.
                </p>
              </div>

              <div className="flex justify-center pt-4">
                <Button 
                  onClick={() => setView('perguntas')}
                  className="bg-gold hover:bg-gold/80 text-midnight font-bold px-12 py-7 rounded-full text-xs uppercase tracking-widest transition-all shadow-2xl shadow-gold/20"
                >
                  Iniciar Cartografia
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {view === 'perguntas' && (
          <motion.div
            key="perguntas"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-end mb-8">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold">Território {currentIdx + 1} de {PERGUNTAS.length}</span>
                <h3 className="text-white/40 font-serif italic text-lg uppercase">{currentPergunta.id}</h3>
              </div>
            </div>

            <div className="bg-white/5 h-1 w-full rounded-full overflow-hidden mb-12">
              <motion.div 
                className="bg-gold h-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIdx + 1) / PERGUNTAS.length) * 100}%` }}
              />
            </div>

            <Card className="bg-midnight/40 border border-white/10 p-10 rounded-[40px] space-y-8">
              <h4 className="text-2xl md:text-3xl font-serif text-white italic leading-relaxed text-center">
                {currentPergunta.pergunta}
              </h4>

              <div className="grid grid-cols-1 gap-4">
                {currentPergunta.opcoes.map((opt, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    onClick={() => handleSelect(opt.valor)}
                    className="h-auto py-6 px-8 rounded-2xl border bg-white/5 border-white/5 text-white/60 hover:bg-gold/5 hover:border-gold/40 hover:text-gold transition-all text-left justify-start font-serif italic text-lg"
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {view === 'resultado' && (
          <motion.div
            key="resultado"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-12"
          >
            <div className="text-center space-y-4">
              <h2 className="text-sm uppercase tracking-[0.4em] text-gold font-bold">Mapeamento Concluído</h2>
              <h3 className="text-4xl md:text-5xl font-serif text-white italic">Sua Mandala Instintiva</h3>
            </div>

            <Card className="bg-midnight/40 border-white/10 p-12 rounded-[48px] relative overflow-hidden group">
              <div className="relative z-10 space-y-12 text-center">
                <MandalaFinal estados={estados} />
                
                <div className="space-y-6 max-w-2xl mx-auto border-t border-white/5 pt-12">
                  <p className="text-white/90 font-serif italic text-2xl leading-relaxed">
                    “Sua natureza instintiva não desapareceu. Ela continua enviando sinais através dos territórios que ainda acendem na sua mandala.”
                  </p>
                  <p className="text-gold/60 font-serif italic text-lg">
                    O convite é voltar a reconhecer os sinais antes de traduzi-los em explicação. A loba não pede pressa. Pede escuta.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12">
                  {['Aceso', 'Oscilante', 'Soterrado', 'Exausto'].map(status => {
                    const tList = TERRITORIOS.filter(t => estados[t.id] === status);
                    if (tList.length === 0) return null;
                    return (
                      <div key={status} className="bg-white/5 p-6 rounded-3xl space-y-4 text-left">
                        <span className={cn(
                          "text-[10px] uppercase tracking-widest font-black",
                          status === 'Aceso' ? "text-gold" : "text-white/30"
                        )}>Territórios {status}s</span>
                        <div className="flex flex-wrap gap-2">
                          {tList.map(t => (
                            <span key={t.id} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-serif italic text-white/80">
                              {t.nome}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center pt-16 border-t border-white/5 mt-16">
                <Button
                  onClick={onNext}
                  className="bg-white text-midnight hover:bg-white/90 font-bold px-16 h-20 rounded-full text-xs uppercase tracking-widest shadow-2xl transition-all hover:scale-105"
                >
                  <Send className="w-4 h-4 mr-3" />
                  Continuar Travessia
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
