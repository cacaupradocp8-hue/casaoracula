import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, MessageSquare, CheckCircle2, 
  Sparkles, ArrowRight, Star, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TrainingCase } from './types';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface Props {
  caso: TrainingCase;
  onExit: () => void;
}

export function SimuladorClube({ caso, onExit }: Props) {
  const navigate = useNavigate();
  const [step, setStep] = useState<'pergunta' | 'feedback'>('pergunta');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const options = caso.opcoes_leitura || [
    { id: '1', texto: 'Uma leitura superficial baseada no ego.', correta: false, explicacao: 'Isso foca apenas no sintoma externo.' },
    { id: '2', texto: 'Uma escuta simbólica do arquétipo ferido.', correta: true, explicacao: 'Correto. Você percebeu a voz silenciada.' },
    { id: '3', texto: 'Uma análise puramente racional do contexto.', correta: false, explicacao: 'Falta a profundidade do inconsciente aqui.' }
  ];

  const handleConfirm = () => {
    if (selectedOption) {
      setStep('feedback');
    }
  };

  const correctOption = options.find(o => o.correta);
  const userOption = options.find(o => o.id === selectedOption);

  return (
    <div className="fixed inset-0 bg-[#0A0A0B] z-50 flex flex-col overflow-hidden font-sans">
      <nav className="p-4 flex items-center justify-between border-b border-white/[0.05] bg-black/40 backdrop-blur-xl">
        <button onClick={onExit} className="text-white/40 hover:text-white flex items-center gap-2 text-xs transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Clube
        </button>
        <Badge variant="outline" className="border-gold/20 text-gold/60 text-[9px] uppercase tracking-widest px-3 py-1">
          Câmara do Sussurro • Iniciante
        </Badge>
        <div className="w-10" /> {/* Spacer */}
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-2xl space-y-8">
          <AnimatePresence mode="wait">
            {step === 'pergunta' ? (
              <motion.div 
                key="pergunta"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <header className="space-y-4 text-center">
                  <h2 className="text-2xl md:text-3xl font-serif text-white/90">O que você ouve neste sussurro?</h2>
                  <Card className="bg-white/[0.03] border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gold/60 mb-4">
                        <MessageSquare className="w-4 h-4" /> Fala do Cliente
                      </div>
                      <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed italic">
                        "{caso.caso_texto}"
                      </p>
                    </CardContent>
                  </Card>
                </header>

                <div className="space-y-3">
                  {options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedOption(option.id)}
                      className={cn(
                        "w-full p-5 rounded-xl border text-left transition-all duration-300 flex items-center gap-4 group",
                        selectedOption === option.id 
                          ? "bg-gold/10 border-gold text-white" 
                          : "bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20 hover:bg-white/[0.04]"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                        selectedOption === option.id ? "border-gold bg-gold" : "border-white/20"
                      )}>
                        {selectedOption === option.id && <div className="w-2 h-2 rounded-full bg-black" />}
                      </div>
                      <span className="text-sm md:text-base">{option.texto}</span>
                    </button>
                  ))}
                </div>

                <Button 
                  onClick={handleConfirm}
                  disabled={!selectedOption}
                  className="w-full rounded-full py-7 text-lg bg-gold hover:bg-gold/90 text-black font-bold gap-2 shadow-[0_0_30px_rgba(201,169,110,0.2)]"
                >
                  Confirmar Percepção <ArrowRight className="w-5 h-5" />
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                key="feedback"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="text-center space-y-4">
                  <div className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4",
                    userOption?.correta ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                  )}>
                    {userOption?.correta ? <CheckCircle2 className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
                  </div>
                  <h3 className="text-2xl font-serif text-white">
                    {userOption?.correta ? 'Sua percepção foi certeira!' : 'Um ponto de refinamento...'}
                  </h3>
                </div>

                <Card className={cn(
                  "border-none",
                  userOption?.correta ? "bg-emerald-500/5" : "bg-amber-500/5"
                )}>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-white/40">Leitura Ideal</p>
                      <p className="text-white/80 italic font-serif leading-relaxed">
                        "{correctOption?.texto}"
                      </p>
                    </div>
                    <div className="pt-4 border-t border-white/5">
                      <p className="text-xs font-bold uppercase tracking-widest text-gold/60 mb-2">Por que?</p>
                      <p className="text-sm text-white/60 leading-relaxed">
                        {caso.explicacao_leve || userOption?.explicacao || 'Nesta obra, o silêncio comunica mais que a fala direta.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* CTA DISCRETO PARA FORMAÇÃO */}
                <Card className="bg-gradient-to-br from-gold/20 via-black/40 to-black/60 border border-gold/10 overflow-hidden mt-8">
                  <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center md:text-left">
                      <p className="text-[10px] font-bold text-gold uppercase tracking-[0.2em]">Próximo Nível</p>
                      <h4 className="text-lg font-medium text-white">Treinos avançados disponíveis na <span className="text-gold">Formação ORÁCULA</span></h4>
                    </div>
                    <Button 
                      variant="gold" 
                      size="sm" 
                      className="rounded-full gap-2 text-xs h-10 px-6 font-bold"
                      onClick={() => navigate('/formacao')}
                    >
                      Conhecer Formação <Star className="w-3 h-3 fill-current" />
                    </Button>
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 rounded-full border-white/10 text-white/40" onClick={() => { setStep('pergunta'); setSelectedOption(null); }}>
                    Tentar Novamente
                  </Button>
                  <Button className="flex-1 rounded-full bg-white text-black font-bold" onClick={onExit}>
                    Concluir Treino
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