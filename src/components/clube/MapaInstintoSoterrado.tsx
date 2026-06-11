import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ChevronRight, BookOpen, Scroll } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { TERRITORIOS } from './MandalaFinal';
import { WolfPawStepsLoop } from './WolfPawSteps';

interface MapaInstintoSoterradoProps {
  estacaoId: string;
  rotaId: string;
  onNext: () => void;
}

type Estado = 'Aceso' | 'Oscilante' | 'Soterrado' | 'Exausto';

const TRAVESSIA_ETAPAS = [
  { 
    id: 'corpo', 
    titulo: '❤️ O Corpo que Chama', 
    intro: 'A primeira casa da alma manifesta-se em ritmos, pesos e temperaturas. Escutar o corpo não é um ato técnico, é um retorno ao templo que nunca mente.',
    icon: '❤️',
    caminhos: [
      { label: '❤️ Costumo escutar esse sinal.', score: 3, estado: 'Aceso' as Estado },
      { label: '🌙 Percebo o sinal, mas nem sempre sigo sua direção.', score: 2, estado: 'Oscilante' as Estado },
      { label: '🍂 Frequentemente minimizo esse chamado.', score: 1, estado: 'Soterrado' as Estado },
      { label: '🪨 Costumo continuar mesmo quando ele insiste.', score: 0, estado: 'Exausto' as Estado }
    ]
  },
  { 
    id: 'intuicao', 
    titulo: '🌙 A Voz que Pressente', 
    intro: 'Há uma percepção que surge antes da lógica, um sussurro que conhece os atalhos da floresta psíquica. O pressentimento é a bússola da natureza selvagem.',
    icon: '🌙',
    caminhos: [
      { label: '❤️ Costumo escutar esse sinal.', score: 3, estado: 'Aceso' as Estado },
      { label: '🌙 Percebo o sinal, mas nem sempre sigo sua direção.', score: 2, estado: 'Oscilante' as Estado },
      { label: '🍂 Frequentemente minimizo esse chamado.', score: 1, estado: 'Soterrado' as Estado },
      { label: '🪨 Costumo continuar mesmo quando ele insiste.', score: 0, estado: 'Exausto' as Estado }
    ]
  },
  { 
    id: 'desejo', 
    titulo: '🔥 O Fogo que Deseja', 
    intro: 'O desejo autêntico é o combustível da vida. Ele não é capricho, é a faísca que indica para onde sua vitalidade quer se expandir agora.',
    icon: '🔥',
    caminhos: [
      { label: '❤️ Costumo escutar esse sinal.', score: 3, estado: 'Aceso' as Estado },
      { label: '🌙 Percebo o sinal, mas nem sempre sigo sua direção.', score: 2, estado: 'Oscilante' as Estado },
      { label: '🍂 Frequentemente minimizo esse chamado.', score: 1, estado: 'Soterrado' as Estado },
      { label: '🪨 Costumo continuar mesmo quando ele insiste.', score: 0, estado: 'Exausto' as Estado }
    ]
  },
  { 
    id: 'limites', 
    titulo: '🛡 O Território que Protege', 
    intro: 'Saber onde você termina e o outro começa é a base da integridade. O limite não é um muro, é a pele que protege sua essência.',
    icon: '🛡',
    caminhos: [
      { label: '❤️ Costumo escutar esse sinal.', score: 3, estado: 'Aceso' as Estado },
      { label: '🌙 Percebo o sinal, mas nem sempre sigo sua direção.', score: 2, estado: 'Oscilante' as Estado },
      { label: '🍂 Frequentemente minimizo esse chamado.', score: 1, estado: 'Soterrado' as Estado },
      { label: '🪨 Costumo continuar mesmo quando ele insiste.', score: 0, estado: 'Exausto' as Estado }
    ]
  },
  { 
    id: 'criatividade', 
    titulo: '🌿 A Semente que Cria', 
    intro: 'O gesto criativo é o nascimento de algo novo através de você. É o jogo livre da psique que encontra soluções onde antes só havia cansaço.',
    icon: '🌿',
    caminhos: [
      { label: '❤️ Costumo escutar ese sinal.', score: 3, estado: 'Aceso' as Estado },
      { label: '🌙 Percebo o sinal, mas nem sempre sigo sua direção.', score: 2, estado: 'Oscilante' as Estado },
      { label: '🍂 Frequentemente minimizo esse chamado.', score: 1, estado: 'Soterrado' as Estado },
      { label: '🪨 Costumo continuar mesmo quando ele insiste.', score: 0, estado: 'Exausto' as Estado }
    ]
  },
  { 
    id: 'vitalidade', 
    titulo: '🐺 A Força que Sustenta', 
    intro: 'A vitalidade é o sangue pulsando com entusiasmo. É a energia que permite atravessar as invernias e celebrar as colheitas com a mesma presença.',
    icon: '🐺',
    caminhos: [
      { label: '❤️ Costumo escutar esse sinal.', score: 3, estado: 'Aceso' as Estado },
      { label: '🌙 Percebo o sinal, mas nem sempre sigo sua direção.', score: 2, estado: 'Oscilante' as Estado },
      { label: '🍂 Frequentemente minimizo esse chamado.', score: 1, estado: 'Soterrado' as Estado },
      { label: '🪨 Costumo continuar mesmo quando ele insiste.', score: 0, estado: 'Exausto' as Estado }
    ]
  }
];

export function MapaInstintoSoterrado({ estacaoId, rotaId, onNext }: MapaInstintoSoterradoProps) {
  const { user } = useAuth();
  const [view, setView] = useState<'intro' | 'travessia' | 'resultado'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, number>>({});
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

  const handleSelectCaminho = (score: number, estado: Estado) => {
    const id = TRAVESSIA_ETAPAS[currentIdx].id;
    const novasRespostas = { ...respostas, [id]: score };
    const novosEstados = { ...estados, [id]: estado };
    
    setRespostas(novasRespostas);
    setEstados(novosEstados);

    if (currentIdx < TRAVESSIA_ETAPAS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      saveMutation.mutate(novosEstados);
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
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center bg-gold/5">
                  <BookOpen className="w-8 h-8 text-gold/60" />
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl text-white italic tracking-tight leading-tight">Mapa do Instinto Soterrado™</h1>
              <div className="h-px w-24 bg-gold/30 mx-auto my-8" />
              <p className="text-white/70 italic text-xl max-w-2xl mx-auto leading-relaxed">
                Esta não é uma avaliação. É uma travessia narrativa pelos territórios da sua natureza selvagem. <br/>
                Siga as pistas, observe os rastros e sinta qual caminho sua alma percorre hoje.
              </p>
            </div>
            <button 
              onClick={() => setView('travessia')}
              className="group relative px-14 py-5 text-gold border border-gold/20 hover:border-gold/50 transition-all rounded-full overflow-hidden"
            >
              <div className="absolute inset-0 bg-gold/5 group-hover:bg-gold/10 transition-colors" />
              <span className="relative z-10 tracking-[0.3em] uppercase text-xs font-bold">Iniciar Travessia</span>
            </button>
          </motion.div>
        )}

        {view === 'travessia' && (
          <motion.div 
            key="travessia"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center py-12 space-y-16"
          >
            {/* Atlas Progress Header */}
            <div className="w-full max-w-2xl flex flex-col items-center gap-6">
              <div className="flex items-center gap-4 text-gold/40">
                <Scroll className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Território {currentIdx + 1} de {TRAVESSIA_ETAPAS.length}</span>
              </div>
              <div className="flex gap-2 w-full justify-center">
                {TRAVESSIA_ETAPAS.map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "h-0.5 transition-all duration-700 rounded-full",
                      i === currentIdx ? "w-12 bg-gold shadow-[0_0_8px_rgba(212,175,55,0.4)]" : i < currentIdx ? "w-4 bg-gold/30" : "w-4 bg-white/5"
                    )} 
                  />
                ))}
              </div>
            </div>

            <div className="max-w-2xl w-full space-y-12">
              <div className="text-center space-y-6">
                <h2 className="text-4xl md:text-5xl text-white italic leading-tight">
                  {TRAVESSIA_ETAPAS[currentIdx].titulo}
                </h2>
                <p className="text-white/60 text-lg md:text-xl italic leading-relaxed max-w-xl mx-auto font-light">
                  {TRAVESSIA_ETAPAS[currentIdx].intro}
                </p>
              </div>

              <div className="h-px w-16 bg-white/10 mx-auto" />

              <div className="grid grid-cols-1 gap-4">
                <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] text-center mb-2 font-black">Qual destas experiências descreve o seu agora?</p>
                {TRAVESSIA_ETAPAS[currentIdx].caminhos.map((caminho, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectCaminho(caminho.score, caminho.estado)}
                    className="group relative w-full text-left p-8 border border-white/5 hover:border-gold/30 bg-white/[0.01] hover:bg-gold/[0.02] backdrop-blur-sm transition-all duration-500 rounded-3xl overflow-hidden"
                  >
                    <div className="absolute inset-y-0 left-0 w-1 bg-gold/0 group-hover:bg-gold/40 transition-all" />
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-white/70 group-hover:text-white italic text-lg md:text-xl transition-colors pr-8">
                        {caminho.label}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gold/0 group-hover:text-gold/40 transition-all transform -translate-x-4 group-hover:translate-x-0" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => {
                if (currentIdx > 0) setCurrentIdx(prev => prev - 1);
              }}
              disabled={currentIdx === 0}
              className="text-white/10 hover:text-white/30 italic text-[10px] tracking-[0.4em] uppercase transition-colors disabled:opacity-0"
            >
              Voltar ao território anterior
            </button>
          </motion.div>
        )}

        {view === 'resultado' && (
          <motion.div 
            key="resultado"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto py-20 space-y-24 relative"
          >
            <WolfPawStepsLoop />
            {/* Header Editorial */}
            <header className="text-center space-y-6">
              <div className="space-y-4">
                <div className="flex justify-center mb-2">
                  <Compass className="w-10 h-10 text-gold/20 animate-pulse" />
                </div>
                <h1 className="text-5xl md:text-7xl text-white italic tracking-tight">Sua Cartografia Instintiva</h1>
                <p className="text-gold/60 italic text-xl">A loba continua deixando sinais em sua trilha.</p>
              </div>
              <div className="h-px w-32 bg-gold/20 mx-auto" />
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
                    <div key={t.id} className="text-center p-10 rounded-[2.5rem] border border-white/10 bg-white/[0.03] shadow-2xl backdrop-blur-md">
                      <span className="text-gold italic text-2xl md:text-3xl block mb-4">{t.nome}</span>
                      <p className="text-white/50 italic text-sm leading-relaxed">
                        Territórios onde sua natureza selvagem flui com clareza. São fontes de força para o seu momento atual.
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="col-span-2 text-center text-white/20 italic py-10">Aguardando novos despertares...</p>
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
                    <div key={t.id} className="text-center p-10 rounded-[2.5rem] border border-white/5 bg-white/[0.01]">
                      <span className="text-white/40 italic text-2xl md:text-3xl block mb-4">{t.nome}</span>
                      <p className="text-white/30 italic text-sm leading-relaxed">
                        Caminhos que pedem retorno. A visibilidade está baixa, mas o convite para a escuta permanece.
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="col-span-2 text-center text-white/20 italic py-10">Os caminhos estão limpos e desobstruídos.</p>
                )}
              </div>
            </section>

            {/* Seção 3: A Próxima Trilha */}
            <section className="text-center space-y-8 py-20 border-y border-white/5 relative">
              <div className="absolute inset-0 bg-gold/[0.02] -z-10" />
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-gold/10 flex items-center justify-center">
                  <Compass className="w-6 h-6 text-gold/40" />
                </div>
                <h2 className="text-2xl md:text-3xl text-white/90 italic tracking-wide">O Convite da Estação</h2>
              </div>
              <p className="text-2xl md:text-3xl text-gold/80 italic max-w-2xl mx-auto leading-relaxed font-light">
                "Não se trata de agir mais. Trata-se de observar melhor os sinais que costumam ser descartados antes de serem escutados."
              </p>
            </section>

            {/* Seção 4: Primeiro Gesto */}
            <section className="text-center space-y-12">
              <div className="space-y-6">
                <h3 className="text-gold/40 italic text-[10px] tracking-[0.4em] uppercase font-black">Primeiro Gesto de Retorno</h3>
                <p className="text-3xl md:text-5xl text-white italic leading-tight max-w-2xl mx-auto font-light">
                  "{maisSoterrado ? `Qual necessidade do seu ${maisSoterrado.nome.toLowerCase()} você vem traduzindo apenas como uma obrigação?` : 'Qual sinal você tem ignorado por medo de ser livre?'}"
                </p>
              </div>
              
              <button 
                onClick={onNext}
                className="group relative px-16 py-6 text-gold border border-gold/20 hover:border-gold/50 transition-all rounded-full overflow-hidden shadow-2xl shadow-gold/10"
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
