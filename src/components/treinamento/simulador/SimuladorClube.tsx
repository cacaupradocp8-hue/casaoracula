import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MessageSquare, CheckCircle2,
  ArrowRight, Star, AlertCircle, Sparkles, BookOpen, HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TrainingCase } from './types';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface Props {
  caso: TrainingCase & { rawCamara?: any };
  onExit: () => void;
}

// Limpa rótulos vazados, aspas duplicadas e prefixos do banco
function clean(text: string | null | undefined): string {
  if (!text) return '';
  let t = text;
  // Remove prefixo "Fala do Cliente:" que possa estar misturado no contexto
  t = t.replace(/fala\s+do\s+cliente\s*:\s*/gi, '');
  // Aspas duplas duplicadas -> aspas tipográficas únicas
  t = t.replace(/""+/g, '"');
  // Trim
  t = t.replace(/^["“\s]+|["”\s]+$/g, '');
  return t.trim();
}

export function SimuladorClube({ caso, onExit }: Props) {
  const navigate = useNavigate();
  const [step, setStep] = useState<'pergunta' | 'feedback'>('pergunta');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const raw = caso.rawCamara || {};

  // Separa contexto e fala
  const contexto = useMemo(() => {
    const ctx = clean(raw.contexto);
    // Se contexto contém "Fala do Cliente", corta antes
    const idx = ctx.toLowerCase().indexOf('fala do cliente');
    return idx >= 0 ? ctx.slice(0, idx).trim() : ctx;
  }, [raw.contexto]);

  const falaInicial = useMemo(() => clean(raw.fala_inicial), [raw.fala_inicial]);

  // Opções reais (não usar fallback fake)
  const rawOptions = Array.isArray(caso.opcoes_leitura) ? caso.opcoes_leitura : [];
  const hasOptions = rawOptions.length > 0;
  const options = rawOptions;

  const handleConfirm = () => {
    if (hasOptions && selectedOption) {
      setStep('feedback');
    } else if (!hasOptions) {
      setRevealed(true);
      setStep('feedback');
    }
  };

  const correctOption = options.find(o => o.correta);
  const userOption = options.find(o => o.id === selectedOption);
  const acertou = hasOptions ? !!userOption?.correta : true;

  return (
    <div className="fixed inset-0 bg-[#0A0A0B] z-50 flex flex-col overflow-hidden font-sans">
      <nav className="px-6 py-4 flex items-center justify-between border-b border-white/[0.05] bg-black/40 backdrop-blur-xl">
        <button onClick={onExit} className="text-white/50 hover:text-white flex items-center gap-2 text-xs transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <Badge variant="outline" className="border-gold/20 text-gold/70 text-[9px] uppercase tracking-[0.2em] px-3 py-1 font-medium">
          Câmara do Sussurro • {caso.nivel === 'guiado' ? 'Iniciante' : caso.nivel === 'semi_guiado' ? 'Intermediário' : 'Avançado'}
        </Badge>
        <div className="w-16" />
      </nav>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl px-6 py-12 md:py-16">
          <AnimatePresence mode="wait">
            {step === 'pergunta' ? (
              <motion.div
                key="pergunta"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="space-y-8"
              >
                <header className="space-y-3 text-center">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold/60">{raw.tema_emocional || 'Treino Simbólico'}</p>
                  <h1 className="text-2xl md:text-[28px] font-serif text-white/95 leading-tight break-words">
                    {caso.title}
                  </h1>
                  <p className="text-sm text-white/50 italic">O que você percebe neste sussurro?</p>
                </header>

                {contexto && (
                  <Card className="bg-white/[0.02] border-white/[0.06] rounded-2xl overflow-hidden">
                    <CardContent className="p-6 md:p-7 space-y-3">
                      <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/40">
                        <BookOpen className="w-3 h-3" /> Contexto
                      </div>
                      <p className="text-[15px] md:text-base text-white/75 font-light leading-[1.75] break-words">
                        {contexto}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {falaInicial && (
                  <Card className="bg-gradient-to-br from-gold/[0.04] to-white/[0.02] border-gold/10 rounded-2xl overflow-hidden">
                    <CardContent className="p-6 md:p-7 space-y-3">
                      <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.25em] text-gold/60">
                        <MessageSquare className="w-3 h-3" /> Fala do Cliente
                      </div>
                      <p className="text-base md:text-lg text-white/85 font-serif italic leading-relaxed break-words">
                        “{falaInicial}”
                      </p>
                    </CardContent>
                  </Card>
                )}

                {hasOptions ? (
                  <div className="space-y-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-white/40 text-center">Qual leitura aparece primeiro?</p>
                    <div className="space-y-3">
                      {options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setSelectedOption(option.id)}
                          className={cn(
                            "w-full p-5 rounded-xl border text-left transition-all duration-300 flex items-start gap-4 group",
                            selectedOption === option.id
                              ? "bg-gold/10 border-gold/60 text-white"
                              : "bg-white/[0.02] border-white/5 text-white/60 hover:border-white/15 hover:bg-white/[0.04]"
                          )}
                        >
                          <div className={cn(
                            "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                            selectedOption === option.id ? "border-gold bg-gold" : "border-white/20"
                          )}>
                            {selectedOption === option.id && <div className="w-2 h-2 rounded-full bg-black" />}
                          </div>
                          <span className="text-sm md:text-[15px] leading-relaxed break-words">{option.texto}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Card className="bg-white/[0.02] border-dashed border-white/10 rounded-2xl">
                    <CardContent className="p-6 text-center space-y-2">
                      <Sparkles className="w-5 h-5 text-gold/60 mx-auto" />
                      <p className="text-sm text-white/60 leading-relaxed">
                        Respire. Deixe a fala ressoar. Quando estiver pronta, revele a leitura simbólica.
                      </p>
                    </CardContent>
                  </Card>
                )}

                <Button
                  onClick={handleConfirm}
                  disabled={hasOptions && !selectedOption}
                  className="w-full rounded-full h-14 text-sm md:text-base bg-gold hover:bg-gold/90 text-black font-semibold gap-2 shadow-[0_0_30px_rgba(201,169,110,0.15)] tracking-wide"
                >
                  {hasOptions ? 'Confirmar Percepção' : 'Revelar Leitura Simbólica'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="text-center space-y-3">
                  <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center mx-auto",
                    acertou ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                  )}>
                    {acertou ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif text-white/95">
                    {hasOptions
                      ? (acertou ? 'Sua percepção foi certeira.' : 'Um ponto de refinamento.')
                      : 'A leitura simbólica se revela.'}
                  </h3>
                </div>

                {(correctOption?.texto || raw.resposta_correta) && (
                  <Card className="bg-white/[0.03] border-white/[0.06] rounded-2xl">
                    <CardContent className="p-6 space-y-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold/60">Resposta Ideal</p>
                      <p className="text-[15px] text-white/85 font-serif italic leading-relaxed break-words">
                        {clean(correctOption?.texto || raw.resposta_correta)}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {raw.leitura_simbolica && (
                  <Card className="bg-white/[0.02] border-white/[0.05] rounded-2xl">
                    <CardContent className="p-6 space-y-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">Leitura Simbólica</p>
                      <p className="text-sm text-white/70 leading-[1.75] break-words">{clean(raw.leitura_simbolica)}</p>
                    </CardContent>
                  </Card>
                )}

                {raw.erro_comum && (
                  <Card className="bg-amber-500/[0.04] border-amber-500/10 rounded-2xl">
                    <CardContent className="p-6 space-y-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400/70">Erro Comum</p>
                      <p className="text-sm text-white/70 leading-[1.75] break-words">{clean(raw.erro_comum)}</p>
                    </CardContent>
                  </Card>
                )}

                {(raw.pergunta_ideal || caso.pergunta_ideal) && (
                  <Card className="bg-gradient-to-br from-gold/[0.06] to-transparent border-gold/15 rounded-2xl">
                    <CardContent className="p-6 space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold/70">
                        <HelpCircle className="w-3 h-3" /> Pergunta de Aprofundamento
                      </div>
                      <p className="text-base text-white/85 font-serif italic leading-relaxed break-words">
                        “{clean(raw.pergunta_ideal || caso.pergunta_ideal)}”
                      </p>
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-gradient-to-br from-gold/15 via-black/40 to-black/60 border border-gold/10 overflow-hidden mt-4">
                  <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center md:text-left">
                      <p className="text-[9px] font-bold text-gold uppercase tracking-[0.25em]">Próximo Nível</p>
                      <h4 className="text-sm font-medium text-white/90">Treinos avançados na <span className="text-gold">Formação ORÁCULA</span></h4>
                    </div>
                    <Button
                      variant="gold"
                      size="sm"
                      className="rounded-full gap-2 text-xs h-10 px-5 font-bold whitespace-nowrap"
                      onClick={() => navigate('/formacao')}
                    >
                      Conhecer <Star className="w-3 h-3 fill-current" />
                    </Button>
                  </CardContent>
                </Card>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-full border-white/10 text-white/60 hover:text-white"
                    onClick={() => { setStep('pergunta'); setSelectedOption(null); setRevealed(false); }}
                  >
                    Reler Caso
                  </Button>
                  <Button
                    className="flex-1 rounded-full bg-white text-black font-semibold hover:bg-white/90"
                    onClick={onExit}
                  >
                    Concluir
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
