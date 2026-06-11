import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ChevronRight } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { TERRITORIOS } from './MandalaFinal';

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
    setRespostas(prev => ({ ...prev, [tId]: { ...prev[tId], [eId]: score } }));

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

  const acesoTerritorios = TERRITORIOS.filter(t => estados[t.id] === 'Aceso');
  const soterradoTerritorios = TERRITORIOS.filter(t => estados[t.id] === 'Soterrado' || estados[t.id] === 'Exausto');
  const maisSoterrado = soterradoTerritorios[0] || TERRITORIOS.find(t => t.id === 'vitalidade');

  return (
    <div className="w-full max-w-4xl mx-auto min-h-screen pb-20 pt-10 px-6 relative bg-transparent font-serif selection:bg-gold/20">
      <AnimatePresence mode="wait">
        {view === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center space-y-12"
          >
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl text-white italic tracking-tight">Mapa do Instinto Soterrado™</h1>
              <p className="text-gold/60 italic text-xl max-w-2xl mx-auto leading-relaxed">
                Uma cartografia mística para identificar quais territórios da sua natureza pedem seu retorno nesta estação. Entre no silêncio do seu rastro.
              </p>
            </div>
            <button 
              onClick={() => setView('perguntas')}
              className="group relative px-14 py-5 text-gold border border-gold/20 hover:border-gold/50 transition-all rounded-full overflow-hidden"
            >
              <div className="absolute inset-0 bg-gold/5 group-hover:bg-gold/10 transition-colors" />
              <span className="relative z-10 tracking-[0.3em] uppercase text-xs font-bold">Entrar no Mapa</span>
            </button>
          </motion.div>
        )}

        {view === 'perguntas' && (
          <motion.div 
            key="perguntas"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center py-12 space-y-20"
          >
            <div className="flex flex-col items-center gap-8">
              <div className="flex items-center gap-6 text-gold/30">
                <div className="h-[0.5px] w-16 bg-current" />
                <span className="italic text-lg tracking-[0.4em] uppercase">{PERGUNTAS[currentTerritorioIdx].nome}</span>
                <div className="h-[0.5px] w-16 bg-current" />
              </div>
              <div className="flex gap-3">
                {PERGUNTAS.map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-1 h-1 rounded-full transition-all duration-1000",
                      i === currentTerritorioIdx ? "bg-gold scale-[2] shadow-[0_0_10px_gold]" : i < currentTerritorioIdx ? "bg-gold/40" : "bg-white/10"
                    )} 
                  />
                ))}
              </div>
            </div>

            <div className="max-w-2xl w-full space-y-20">
              <h2 className="text-3xl md:text-5xl text-white italic text-center leading-tight">
                {PERGUNTAS[currentTerritorioIdx].perguntas[currentEixoIdx]}
              </h2>
              <div className="grid grid-cols-1 gap-6">
                {OPCOES.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(opt.score)}
                    className="group relative w-full text-left p-10 border border-white/5 hover:border-gold/20 bg-white/[0.01] backdrop-blur-sm transition-all duration-700 rounded-2xl"
                  >
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-white/60 group-hover:text-white italic text-xl md:text-2xl transition-colors pr-12">
                        {opt.label}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gold/0 group-hover:text-gold/40 transition-all transform -translate-x-4 group-hover:translate-x-0" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => {
                if (currentEixoIdx > 0) setCurrentEixoIdx(prev => prev - 1);
                else if (currentTerritorioIdx > 0) {
                  setCurrentTerritorioIdx(prev => prev - 1);
                  setCurrentEixoIdx(EIXOS.length - 1);
                }
              }}
              disabled={currentTerritorioIdx === 0 && currentEixoIdx === 0}
              className="text-white/10 hover:text-white/30 italic text-[10px] tracking-[0.4em] uppercase transition-colors disabled:opacity-0"
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
            className="max-w-3xl mx-auto py-20 space-y-24"
          >
            {/* Header Editorial */}
            <header className="text-center space-y-6">
              <div className="space-y-2">
                <h1 className="text-5xl md:text-7xl text-white italic tracking-tight">Sua Cartografia Instintiva</h1>
                <p className="text-gold/60 italic text-xl">A loba continua deixando sinais.</p>
              </div>
              <div className="h-[0.5px] w-24 bg-gold/20 mx-auto" />
            </header>

            {/* Seção 1: Pegadas Encontradas */}
            <section className="space-y-8">
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-2xl md:text-3xl text-white/90 italic tracking-wide">Pegadas Encontradas</h2>
                <div className="h-[1px] w-12 bg-gold/20" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {acesoTerritorios.length > 0 ? (
                  acesoTerritorios.slice(0, 2).map(t => (
                    <div key={t.id} className="text-center p-8 rounded-3xl border border-white/5 bg-white/[0.02]">
                      <span className="text-gold italic text-2xl md:text-3xl block mb-2">{t.nome}</span>
                      <p className="text-white/40 italic text-sm leading-relaxed">
                        São os lugares onde sua natureza instintiva continua encontrando caminhos para se expressar.
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="col-span-2 text-center text-white/20 italic">Aguardando novos despertares...</p>
                )}
              </div>
            </section>

            {/* Seção 2: Pegadas Quase Apagadas */}
            <section className="space-y-8">
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-2xl md:text-3xl text-white/90 italic tracking-wide">Pegadas Quase Apagadas</h2>
                <div className="h-[1px] w-12 bg-white/10" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {soterradoTerritorios.length > 0 ? (
                  soterradoTerritorios.slice(0, 2).map(t => (
                    <div key={t.id} className="text-center p-8 rounded-3xl border border-white/5 bg-white/[0.01]">
                      <span className="text-white/50 italic text-2xl md:text-3xl block mb-2">{t.nome}</span>
                      <p className="text-white/30 italic text-sm leading-relaxed">
                        Os rastros continuam presentes, mas estão mais difíceis de perceber no meio do ruído e dos automatismos.
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="col-span-2 text-center text-white/20 italic">Os caminhos estão limpos.</p>
                )}
              </div>
            </section>

            {/* Seção 3: A Próxima Trilha */}
            <section className="text-center space-y-8 py-16 border-y border-white/5">
              <div className="flex flex-col items-center gap-3">
                <Compass className="w-6 h-6 text-gold/20" />
                <h2 className="text-2xl md:text-3xl text-white/90 italic tracking-wide">A Próxima Trilha</h2>
              </div>
              <p className="text-xl md:text-2xl text-gold/70 italic max-w-2xl mx-auto leading-relaxed">
                "Nesta estação, o convite não é agir mais. É observar melhor os sinais que costumam ser descartados antes mesmo de serem escutados."
              </p>
            </section>

            {/* Seção 4: Primeiro Gesto */}
            <section className="text-center space-y-10">
              <div className="space-y-4">
                <h3 className="text-gold/40 italic text-sm tracking-[0.4em] uppercase">Primeiro Gesto</h3>
                <p className="text-2xl md:text-4xl text-white italic leading-tight max-w-xl mx-auto">
                  "{maisSoterrado ? `Qual necessidade do seu ${maisSoterrado.nome.toLowerCase()} você vem traduzindo como obrigação?` : 'Qual sinal você tem ignorado por medo de ser livre?'}"
                </p>
              </div>
              
              <button 
                onClick={onNext}
                className="group relative px-14 py-5 text-gold border border-gold/10 hover:border-gold/30 transition-all rounded-full overflow-hidden"
              >
                <div className="absolute inset-0 bg-gold/5 group-hover:bg-gold/10 transition-colors" />
                <span className="relative z-10 tracking-[0.3em] uppercase text-xs font-bold">Continuar Travessia</span>
              </button>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
