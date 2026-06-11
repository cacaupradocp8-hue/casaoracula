import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles, Send, CheckCircle2, ChevronRight, Info, Target, Map, BookOpen, PenTool, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { MandalaFinal, TERRITORIOS } from './MandalaFinal';

interface MapaInstintoSoterradoProps {
  estacaoId: string;
  rotaId: string;
  onNext: () => void;
}

type Estado = 'Aceso' | 'Oscilante' | 'Soterrado' | 'Exausto';

const EIXOS = [
  { id: 'comportamento', label: 'Observação' },
  { id: 'percepcao', label: 'Sentido' },
  { id: 'consequencia', label: 'Rastro' }
];

const PERGUNTAS = [
  { id: 'intuicao', label: 'Intuição', nome: 'Intuição', icon: '🌙', perguntas: [
    'Quando uma percepção surge antes de qualquer explicação lógica, que destino você costuma dar a esse sinal?',
    'No silêncio das suas decisões, quanto espaço existe para a sua voz interna sem que ela precise de provas para ser real?',
    'Ao revisitar rastros antigos, quantos deles revelam que a sua primeira percepção já sabia o caminho, mesmo antes de você aceitá-lo?'
  ]},
  { id: 'desejo', label: 'Desejo', nome: 'Desejo', icon: '🔥', perguntas: [
    'Quando um interesse genuíno acende uma faísca em você, qual o movimento natural que essa chama costuma seguir?',
    'Você consegue identificar quando um querer nasce da sua própria natureza ou quando ele é apenas um eco do que os outros esperam?',
    'Como fica a paisagem interna quando um desejo autêntico é deixado para trás em nome de uma necessidade que não é sua?'
  ]},
  { id: 'limites', label: 'Limites', nome: 'Limites', icon: '🛡', perguntas: [
    'Ao perceber que um espaço ou energia sua está sendo ocupada por algo externo, como seus contornos costumam reagir?',
    'Existe um sensor interno que aponta o momento exato em que um "sim" começa a corroer a sua própria integridade?',
    'Quanto do peso que você carrega hoje pertence ao seu próprio caminho e quanto foi absorvido de trilhas alheias?'
  ]},
  { id: 'corpo', label: 'Corpo', nome: 'Corpo', icon: '❤️', perguntas: [
    'Quando o cansaço atravessa sua jornada, de que forma seu corpo costuma sinalizar que o passo precisa mudar?',
    'Ao fechar os olhos por um instante, você consegue distinguir onde termina a sua energia e onde começa a expectativa do mundo sobre seus movimentos?',
    'Nas últimas travessias, com que frequência você percebeu que seu corpo só foi ouvido quando a dor precisou gritar?'
  ]},
  { id: 'criatividade', label: 'Criatividade', nome: 'Criatividade', icon: '🌿', perguntas: [
    'Quando uma nova possibilidade se apresenta à sua mente, qual o primeiro gesto que você costuma oferecer a ela?',
    'Há uma clareira em sua rotina onde as ideias podem brincar e ser inúteis, sem a cobrança de gerar um resultado imediato?',
    'Como as cores e soluções novas têm chegado até você: como um fluxo livre ou como algo que precisa ser arrancado da exaustão?'
  ]},
  { id: 'vitalidade', label: 'Vitalidade', nome: 'Vitalidade', icon: '🐺', perguntas: [
    'Ao despertar para um novo ciclo, com que intensidade a loba em você sente que a vida vale o esforço de ser vivida?',
    'Você consegue mapear com clareza quais encontros e tarefas devolvem a sua presença e quais apenas drenam o seu rastro?',
    'Quanto da sua energia vital tem sido investida naquilo que realmente faz o seu sangue pulsar com entusiasmo?'
  ]}
];

const OPCOES = [
  { label: 'O sinal é acolhido e integrado ao movimento.', score: 3, estado: 'Aceso' as Estado },
  { label: 'O sinal é percebido, mas ainda hesita antes de se tornar ação.', score: 2, estado: 'Oscilante' as Estado },
  { label: 'O sinal é sentido apenas como um ruído que costumo minimizar.', score: 1, estado: 'Soterrado' as Estado },
  { label: 'O sinal parece silenciado sob camadas de cansaço ou distância.', score: 0, estado: 'Exausto' as Estado }
];

const TRILHAS_FINAIS: Record<string, string> = {
  corpo: "A Clareira do Chamado convida você a observar os sinais físicos que costuma minimizar antes mesmo de escutá-los.",
  intuicao: "O rastro pede que você silencie as explicações externas para voltar a escutar o que o seu primeiro sentir já sabe.",
  desejo: "A trilha aponta para o resgate do que é autêntico, separando o fogo sagrado do seu querer do ruído das expectativas.",
  limites: "É tempo de fortalecer os seus contornos, reconhecendo que a sua energia é um território sagrado.",
  criatividade: "A próxima etapa convida a sua loba a brincar novamente com as possibilidades, sem o peso da utilidade.",
  vitalidade: "O caminho foca na recuperação da sua força vital, podando o que drena para que o entusiasmo possa brotar."
};

export function MapaInstintoSoterrado({ estacaoId, rotaId, onNext }: MapaInstintoSoterradoProps) {
  const { user } = useAuth();
  const [view, setView] = useState<'intro' | 'perguntas' | 'resultado'>('intro');
  const [currentTerritorioIdx, setCurrentTerritorioIdx] = useState(0);
  const [currentEixoIdx, setCurrentEixoIdx] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, Record<string, number>>>({});
  const [estados, setEstados] = useState<Record<string, Estado>>({});

  const saveMutation = useMutation({
    mutationFn: async (finalEstados: Record<string, Estado>) => {
      if (!user) return;
      
      const territorioMaisAceso = Object.entries(finalEstados).find(([_, e]) => e === 'Aceso')?.[0] || 'Nenhum';
      const territorioMaisSoterrado = Object.entries(finalEstados).find(([_, e]) => e === 'Soterrado' || e === 'Exausto')?.[0] || 'vitalidade';

      await supabase.from('clube_mapa_instinto_registros').insert({
        user_id: user.id,
        rota_id: rotaId,
        estacao_id: estacaoId,
        ...finalEstados,
        territorio_mais_aceso: territorioMaisAceso,
        territorio_mais_soterrado: territorioMaisSoterrado
      });
    }
  });

  const handleSelect = (score: number) => {
    const tId = PERGUNTAS[currentTerritorioIdx].id;
    const eId = EIXOS[currentEixoIdx].id;
    
    setRespostas(prev => ({
      ...prev,
      [tId]: { ...prev[tId], [eId]: score }
    }));

    if (currentEixoIdx < EIXOS.length - 1) {
      setCurrentEixoIdx(prev => prev + 1);
    } else if (currentTerritorioIdx < PERGUNTAS.length - 1) {
      setCurrentTerritorioIdx(prev => prev + 1);
      setCurrentEixoIdx(0);
    } else {
      const finalEstados: Record<string, Estado> = {};
      PERGUNTAS.forEach(t => {
        const tResponses = (t.id === tId) ? { ...respostas[t.id], [eId]: score } : (respostas[t.id] || {});
        const currentSum = Object.values(tResponses).reduce((a, b) => a + b, 0);
        const avg = currentSum / 3;
        
        if (avg >= 2.5) finalEstados[t.id] = 'Aceso';
        else if (avg >= 1.5) finalEstados[t.id] = 'Oscilante';
        else if (avg >= 0.5) finalEstados[t.id] = 'Soterrado';
        else finalEstados[t.id] = 'Exausto';
      });
      setEstados(finalEstados);
      saveMutation.mutate(finalEstados);
      setView('resultado');
    }
  };

  const currentT = PERGUNTAS[currentTerritorioIdx];
  const acesoTerritorios = TERRITORIOS.filter(t => estados[t.id] === 'Aceso');
  const soterradoTerritorios = TERRITORIOS.filter(t => estados[t.id] === 'Soterrado' || estados[t.id] === 'Exausto');
  const maisSoterradoId = Object.entries(estados).find(([_, e]) => e === 'Soterrado' || e === 'Exausto')?.[0] || 'vitalidade';

  return (
    <div className="w-full max-w-5xl mx-auto min-h-screen pb-20 pt-10 px-4 relative">
      {/* Background Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

      <AnimatePresence mode="wait">
        {view === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center space-y-10"
          >
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-serif text-white italic tracking-tight">Mapa do Instinto Soterrado™</h1>
              <p className="text-gold/60 font-serif italic text-lg max-w-2xl mx-auto leading-relaxed">
                Uma cartografia mística para identificar quais territórios da sua natureza pedem seu retorno nesta estação. Entre no silêncio do seu rastro.
              </p>
            </div>
            
            <button 
              onClick={() => setView('perguntas')}
              className="group relative px-12 py-4 font-serif italic text-gold border border-gold/30 hover:border-gold/60 transition-all rounded-full overflow-hidden"
            >
              <div className="absolute inset-0 bg-gold/5 group-hover:bg-gold/10 transition-colors" />
              <span className="relative z-10 tracking-[0.2em] uppercase text-sm">Entrar no Mapa</span>
            </button>
          </motion.div>
        )}

        {view === 'perguntas' && (
          <motion.div 
            key="perguntas"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center py-10 space-y-16"
          >
            {/* Header Ritualístico */}
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-4 text-gold/40">
                <div className="h-[1px] w-12 bg-current" />
                <span className="text-2xl">{currentT.icon}</span>
                <span className="font-serif italic text-xl tracking-widest uppercase">{currentT.nome}</span>
                <div className="h-[1px] w-12 bg-current" />
              </div>
              
              <div className="flex gap-2">
                {PERGUNTAS.map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-1 h-1 rounded-full transition-all duration-700",
                      i === currentTerritorioIdx ? "bg-gold scale-[2] shadow-[0_0_8px_gold]" : i < currentTerritorioIdx ? "bg-gold/40" : "bg-white/10"
                    )} 
                  />
                ))}
              </div>
            </div>

            {/* Pergunta Narrativa */}
            <div className="max-w-3xl w-full space-y-16">
              <h2 className="text-3xl md:text-5xl font-serif text-white italic text-center leading-tight">
                {currentT.perguntas[currentEixoIdx]}
              </h2>

              <div className="grid grid-cols-1 gap-6">
                {OPCOES.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(opt.score)}
                    className="group relative w-full text-left p-8 border border-white/5 hover:border-gold/30 bg-black/20 backdrop-blur-sm transition-all duration-500 rounded-lg"
                  >
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-white/70 group-hover:text-white font-serif italic text-xl md:text-2xl transition-colors pr-8">
                        {opt.label}
                      </span>
                      <ChevronRight className="w-6 h-6 text-gold/0 group-hover:text-gold/50 transition-all transform translate-x-[-10px] group-hover:translate-x-0" />
                    </div>
                    {/* Hover Effect Light */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gold/0 to-gold/0 group-hover:from-gold/[0.02] group-hover:to-transparent transition-all" />
                  </button>
                ))}
              </div>
            </div>

            {/* Navegação Sutil */}
            <button 
              onClick={() => {
                if (currentEixoIdx > 0) setCurrentEixoIdx(prev => prev - 1);
                else if (currentTerritorioIdx > 0) {
                  setCurrentTerritorioIdx(prev => prev - 1);
                  setCurrentEixoIdx(EIXOS.length - 1);
                }
              }}
              disabled={currentTerritorioIdx === 0 && currentEixoIdx === 0}
              className="text-white/20 hover:text-white/40 font-serif italic text-sm tracking-widest uppercase transition-colors disabled:opacity-0"
            >
              Voltar ao rastro anterior
            </button>
          </motion.div>
        )}

        {view === 'resultado' && (
          <motion.div 
            key="resultado"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center pt-10"
          >
            <div className="text-center space-y-4 mb-10">
              <h3 className="text-gold uppercase tracking-[0.5em] font-serif text-[12px] opacity-60">Sua Cartografia Ritualística</h3>
              <h2 className="text-4xl md:text-6xl font-serif italic text-white leading-tight">A Mandala do Instinto</h2>
            </div>

            {/* Mandala Protagonista */}
            <div className="w-full flex justify-center py-10">
              <MandalaFinal estados={estados} />
            </div>

            {/* Legenda Narrativa Inferior */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mt-20 w-full max-w-4xl border-t border-white/5 pt-16">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_gold]" />
                  <h4 className="text-gold/80 font-serif italic uppercase tracking-[0.3em] text-[12px]">Pegadas Encontradas</h4>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  {acesoTerritorios.map(t => (
                    <span key={t.id} className="text-white/90 font-serif italic text-lg">{t.nome}</span>
                  ))}
                  {acesoTerritorios.length === 0 && <span className="text-white/20 italic">Rastros sutis...</span>}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <h4 className="text-white/40 font-serif italic uppercase tracking-[0.3em] text-[12px]">Pegadas Apagadas</h4>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  {soterradoTerritorios.map(t => (
                    <span key={t.id} className="text-white/40 font-serif italic text-lg">{t.nome}</span>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Compass className="w-4 h-4 text-gold/30" />
                  <h4 className="text-gold/50 font-serif italic uppercase tracking-[0.3em] text-[12px]">Próxima Trilha</h4>
                </div>
                <p className="text-white/80 text-xl font-serif italic leading-relaxed">
                  "{TRILHAS_FINAIS[maisSoterradoId]}"
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
