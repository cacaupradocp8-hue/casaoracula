import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ChevronRight, BookOpen, Scroll } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { MandalaFinal, TERRITORIOS } from './MandalaFinal';
import { WolfPawStepsLoop } from './WolfPawSteps';

interface MapaInstintoSoterradoProps {
  estacaoId: string;
  rotaId: string;
  onNext: () => void;
}

type Estado = 'Aceso' | 'Oscilante' | 'Soterrado' | 'Exausto';

interface Caminho {
  label: string;
  estado: Estado;
  score: number;
}

interface Territorio {
  id: string;
  titulo: string;
  intro: string;
  pergunta: string;
  caminhos: Caminho[];
  rastro: string;
}

const TRAVESSIA_ETAPAS: Territorio[] = [
  {
    id: 'corpo',
    titulo: 'Jardim do Corpo',
    intro: 'O corpo costuma falar antes da mente. Nem sempre através da dor. Às vezes através do cansaço, da irritação, da falta de entusiasmo. Ou daquela sensação persistente de que algo pede atenção.',
    pergunta: 'Quando estes sinais aparecem, o que costuma acontecer?',
    rastro: 'O território do Corpo respondeu.',
    caminhos: [
      { label: 'Continuo. Mais tarde cuido disso.', estado: 'Soterrado', score: 1 },
      { label: 'Percebo os sinais, mas sigo em frente.', estado: 'Oscilante', score: 2 },
      { label: 'Procuro compreender o que está acontecendo.', estado: 'Aceso', score: 3 },
      { label: 'Só paro quando o corpo já não consegue continuar.', estado: 'Exausto', score: 0 }
    ]
  },
  {
    id: 'intuicao',
    titulo: 'Clareira da Escuta',
    intro: 'Existem percepções que chegam antes do pensamento. Uma certeza curta. Um aviso silencioso. Algo que sabe, mesmo sem explicação.',
    pergunta: 'Quando estas percepções aparecem, o que costuma acontecer?',
    rastro: 'Um sinal tornou-se visível.',
    caminhos: [
      { label: 'Confio e sigo o que percebi.', estado: 'Aceso', score: 3 },
      { label: 'Percebo, mas peço uma confirmação antes de agir.', estado: 'Oscilante', score: 2 },
      { label: 'Acho que é exagero meu e descarto.', estado: 'Soterrado', score: 1 },
      { label: 'Deixo a razão decidir, mesmo quando algo dentro protesta.', estado: 'Exausto', score: 0 }
    ]
  },
  {
    id: 'desejo',
    titulo: 'Fogueira do Desejo',
    intro: 'Existem desejos que pedem passagem. Nem todos chegam como grandes sonhos. Alguns chegam apenas como um incómodo silencioso. Uma vontade recorrente. Uma pergunta que continua voltando.',
    pergunta: 'Quando um desejo insiste em aparecer, o que costuma acontecer?',
    rastro: 'Uma brasa voltou a acender-se no território do Desejo.',
    caminhos: [
      { label: 'Dou espaço a ele e observo onde leva.', estado: 'Aceso', score: 3 },
      { label: 'Sinto o calor, mas adio o movimento.', estado: 'Oscilante', score: 2 },
      { label: 'Acho que não é o momento e cubro com outras tarefas.', estado: 'Soterrado', score: 1 },
      { label: 'Digo a mim mesma que já não é hora disso.', estado: 'Exausto', score: 0 }
    ]
  },
  {
    id: 'limites',
    titulo: 'Vale dos Limites',
    intro: 'Há lugares onde termina o seu espaço e começa o ruído alheio. Pedidos, expectativas, urgências de outros costumam atravessar essa fronteira sem aviso.',
    pergunta: 'Quando esta fronteira é atravessada, o que costuma acontecer?',
    rastro: 'Os rastros permanecem difíceis de encontrar junto aos Limites.',
    caminhos: [
      { label: 'Reconheço o meu lugar e nomeio o limite.', estado: 'Aceso', score: 3 },
      { label: 'Hesito, mas tento marcar baixinho.', estado: 'Oscilante', score: 2 },
      { label: 'Recuo para não desagradar.', estado: 'Soterrado', score: 1 },
      { label: 'Sigo o ritmo dos outros, mesmo sentindo o desgaste.', estado: 'Exausto', score: 0 }
    ]
  },
  {
    id: 'criatividade',
    titulo: 'Trilha da Criatividade',
    intro: 'Há ideias, gestos, pequenas formas que pedem para existir. Nem todas têm utilidade imediata. Algumas chegam só como um convite para brincar com o que está à mão.',
    pergunta: 'Quando este convite aparece, o que costuma acontecer?',
    rastro: 'Algo continua tentando ganhar forma.',
    caminhos: [
      { label: 'Aceito o convite e começo a experimentar.', estado: 'Aceso', score: 3 },
      { label: 'Anoto a ideia para um momento mais livre.', estado: 'Oscilante', score: 2 },
      { label: 'Acho que não é hora de me dispersar.', estado: 'Soterrado', score: 1 },
      { label: 'Sinto culpa por pensar nisso diante do que precisa ser resolvido.', estado: 'Exausto', score: 0 }
    ]
  },
  {
    id: 'vitalidade',
    titulo: 'Montanha da Vitalidade',
    intro: 'Há um fôlego que sustenta os dias. Ele se renova com descanso, água, ritmo próprio. Quando é ignorado por muito tempo, começa a pedir atenção de outras formas.',
    pergunta: 'Quando o fôlego começa a faltar, o que costuma acontecer?',
    rastro: 'O território começou a falar.',
    caminhos: [
      { label: 'Reduzo o passo, bebo água, escuto o ritmo.', estado: 'Aceso', score: 3 },
      { label: 'Percebo, mas só descanso quando termino o que falta.', estado: 'Oscilante', score: 2 },
      { label: 'Sigo adiante dizendo que paro mais tarde.', estado: 'Soterrado', score: 1 },
      { label: 'Continuo contando apenas os passos que faltam.', estado: 'Exausto', score: 0 }
    ]
  }
];

const RASTROS_VARIANTES = [
  'Uma marca apareceu na trilha.',
  'O território começou a falar.',
  'Algo continua tentando ganhar forma.',
  'Um sinal tornou-se visível.'
];

export function MapaInstintoSoterrado({ estacaoId, rotaId, onNext }: MapaInstintoSoterradoProps) {
  const { user } = useAuth();
  const [view, setView] = useState<'intro' | 'travessia' | 'resultado'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, number>>({});
  const [estados, setEstados] = useState<Record<string, Estado>>({});
  const [rastroAtual, setRastroAtual] = useState<string | null>(null);

  const mandalaEstados = TERRITORIOS.reduce<Record<string, Estado>>((acc, territorio) => {
    acc[territorio.id] = estados[territorio.id] || (territorio.id === TRAVESSIA_ETAPAS[currentIdx]?.id ? 'Oscilante' : 'Soterrado');
    return acc;
  }, {});

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

  const handleSelectCaminho = (caminho: Caminho) => {
    const etapa = TRAVESSIA_ETAPAS[currentIdx];
    const id = etapa.id;
    const novasRespostas = { ...respostas, [id]: caminho.score };
    const novosEstados = { ...estados, [id]: caminho.estado };

    setRespostas(novasRespostas);
    setEstados(novosEstados);
    setRastroAtual(etapa.rastro);

    window.setTimeout(() => {
      setRastroAtual(null);
      if (currentIdx < TRAVESSIA_ETAPAS.length - 1) {
        setCurrentIdx(prev => prev + 1);
      } else {
        saveMutation.mutate(novosEstados);
        setView('resultado');
      }
    }, 2200);
  };

  const acesosOscilantes = TERRITORIOS.filter(t => estados[t.id] === 'Aceso' || estados[t.id] === 'Oscilante');
  const soterradoTerritorios = TERRITORIOS.filter(t => estados[t.id] === 'Soterrado' || estados[t.id] === 'Exausto');
  const maisSoterrado = soterradoTerritorios[0] || TERRITORIOS.find(t => t.id === 'vitalidade');

  const textoLugarResponde = (id: string) => {
    switch (id) {
      case 'intuicao': return 'Há sinais que continuam tentando chegar até você.';
      case 'criatividade': return 'Algo procura uma forma de ganhar expressão.';
      case 'corpo': return 'O corpo segue sinalizando, mesmo quando a agenda pede silêncio.';
      case 'desejo': return 'Ainda existe uma brasa viva, e ela continua pulsando.';
      case 'limites': return 'A sua fronteira está sendo reconhecida com mais clareza.';
      case 'vitalidade': return 'O fôlego que sustenta encontra ritmo próprio.';
      default: return 'Este território continua falando.';
    }
  };

  const textoLugarPedeEscuta = (id: string) => {
    switch (id) {
      case 'corpo': return 'Este território envia sinais que costumam ser adiados.';
      case 'desejo': return 'Ainda existe uma brasa viva, mas ela raramente recebe atenção.';
      case 'limites': return 'A fronteira tem sido atravessada sem aviso e raramente reparada.';
      case 'intuicao': return 'Uma percepção fina chega, e quase sempre é descartada antes de ser escutada.';
      case 'criatividade': return 'Um convite aparece e costuma ser adiado por falta de licença interna.';
      case 'vitalidade': return 'O fôlego pede pausa, e a pausa costuma ser empurrada para depois.';
      default: return 'Este território pede um retorno cuidadoso.';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen pb-20 pt-6 px-6 relative bg-transparent font-serif selection:bg-gold/20">
      <AnimatePresence mode="wait">
        {view === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[68vh] flex items-center justify-center py-8 lg:py-12"
          >
            <div className="space-y-7 text-center max-w-3xl mx-auto">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center bg-gold/5">
                  <BookOpen className="w-8 h-8 text-gold/60" />
                </div>
              </div>
              <h1 className="text-3xl xs:text-5xl md:text-6xl text-white italic tracking-tight leading-tight px-4 max-w-[14ch] mx-auto">
                Mapa do Instinto Soterrado™
              </h1>
              <p className="text-gold/70 italic text-base md:text-lg max-w-xl mx-auto">
                Uma cartografia dos rastros de vida que continuam tentando aparecer.
              </p>
              <div className="h-px w-24 bg-gold/30 mx-auto my-8" />
              <div className="space-y-4 text-white/70 italic text-lg xl:text-xl max-w-2xl mx-auto leading-relaxed">
                <p>Esta não é uma avaliação.</p>
                <p>Esta não é uma definição sobre quem você é.</p>
                <p>É apenas uma observação dos lugares onde a vida continua tentando falar.</p>
              </div>
              <button 
                onClick={() => setView('travessia')}
                className="group relative px-10 md:px-14 py-5 text-gold border border-gold/20 hover:border-gold/50 transition-all rounded-full overflow-hidden mt-4"
              >
                <div className="absolute inset-0 bg-gold/5 group-hover:bg-gold/10 transition-colors" />
                <span className="relative z-10 tracking-[0.3em] uppercase text-xs font-bold">Iniciar Travessia</span>
              </button>
            </div>
          </motion.div>
        )}

        {view === 'travessia' && (
          <motion.div 
            key="travessia"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="py-10 lg:py-14"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,0.78fr)_minmax(0,1.22fr)] gap-10 lg:gap-14 items-start w-full max-w-6xl mx-auto">
              <aside className="lg:sticky lg:top-28 space-y-8 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-4 text-gold/50">
                  <Scroll className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Território {currentIdx + 1} de {TRAVESSIA_ETAPAS.length}</span>
                </div>
                <div className="flex gap-2 w-full justify-center lg:justify-start">
                  {TRAVESSIA_ETAPAS.map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "h-0.5 transition-all duration-700 rounded-full",
                        i === currentIdx ? "w-12 bg-gold shadow-[0_0_8px_hsl(var(--gold)/0.4)]" : i < currentIdx ? "w-4 bg-gold/30" : "w-4 bg-white/10"
                      )} 
                    />
                  ))}
                </div>
                <div className="space-y-6">
                  <h2 className="text-3xl xs:text-4xl md:text-5xl text-white italic leading-tight px-4 lg:px-0 break-words">
                    {TRAVESSIA_ETAPAS[currentIdx].titulo}
                  </h2>
                  <p className="text-white/65 text-lg md:text-xl italic leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                    {TRAVESSIA_ETAPAS[currentIdx].intro}
                  </p>
                </div>
              </aside>

              <section className="w-full space-y-5 lg:border-l lg:border-gold/10 lg:pl-10">
                <p className="text-white/80 italic text-lg md:text-xl mb-4 text-center lg:text-left">
                  {TRAVESSIA_ETAPAS[currentIdx].pergunta}
                </p>
                {rastroAtual ? (
                  <motion.div
                    key={rastroAtual}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-10 border border-gold/15 bg-background/40 backdrop-blur-xl rounded-[1.5rem] text-center"
                  >
                    <p className="text-white/75 italic text-lg md:text-xl leading-relaxed">{rastroAtual}</p>
                  </motion.div>
                ) : (
                  TRAVESSIA_ETAPAS[currentIdx].caminhos.map((caminho, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectCaminho(caminho)}
                      className="group relative w-full text-left p-7 md:p-8 border border-white/10 hover:border-gold/40 bg-background/35 hover:bg-gold/[0.04] backdrop-blur-xl transition-all duration-500 rounded-[1.5rem] overflow-hidden"
                    >
                      <div className="absolute inset-y-0 left-0 w-1 bg-gold/0 group-hover:bg-gold/50 transition-all" />
                      <div className="relative z-10 flex items-center justify-between gap-6">
                        <span className="text-white/80 group-hover:text-white italic text-lg md:text-xl transition-colors">
                          {caminho.label}
                        </span>
                        <ChevronRight className="w-5 h-5 text-gold/20 group-hover:text-gold/70 transition-all transform -translate-x-2 group-hover:translate-x-0 shrink-0" />
                      </div>
                    </button>
                  ))
                )}
              </section>
            </div>
          </motion.div>
        )}

        {view === 'resultado' && (
          <motion.div 
            key="resultado"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl mx-auto py-14 md:py-20 space-y-20 md:space-y-24 relative"
          >
            <WolfPawStepsLoop />

            <header className="text-center space-y-6">
              <div className="flex justify-center mb-2">
                <Compass className="w-10 h-10 text-gold/20 animate-pulse" />
              </div>
              <h1 className="text-3xl xs:text-5xl md:text-7xl text-white italic tracking-tight px-4 break-words">
                Cartografia da Clareira
              </h1>
              <p className="text-gold/60 italic text-lg md:text-xl max-w-2xl mx-auto">
                Uma observação dos lugares onde a sua vida continua tentando falar.
              </p>
              <div className="h-px w-32 bg-gold/20 mx-auto" />
            </header>

            <section className="w-full max-w-4xl mx-auto">
              <MandalaFinal estados={mandalaEstados} />
            </section>

            {/* Lugares que Responderam */}
            <section className="space-y-8">
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-2xl md:text-3xl text-white/90 italic tracking-wide">Lugares que Responderam</h2>
                <div className="h-[1px] w-12 bg-gold/20" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {acesosOscilantes.length > 0 ? (
                  acesosOscilantes.slice(0, 4).map(t => (
                    <div key={t.id} className="text-left p-10 rounded-[2.5rem] border border-white/10 bg-white/[0.03] shadow-2xl backdrop-blur-md">
                      <span className="text-gold italic text-2xl md:text-3xl block mb-4">{t.nome}</span>
                      <p className="text-white/65 italic text-base leading-relaxed">
                        {textoLugarResponde(t.id)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="col-span-2 text-center text-white/30 italic py-10">Os territórios ainda estão em silêncio.</p>
                )}
              </div>
            </section>

            {/* Lugares que Pedem Escuta */}
            <section className="space-y-8">
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-2xl md:text-3xl text-white/90 italic tracking-wide">Lugares que Pedem Escuta</h2>
                <div className="h-[1px] w-12 bg-white/10" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {soterradoTerritorios.length > 0 ? (
                  soterradoTerritorios.slice(0, 4).map(t => (
                    <div key={t.id} className="text-left p-10 rounded-[2.5rem] border border-white/10 bg-white/[0.02]">
                      <span className="text-white/70 italic text-2xl md:text-3xl block mb-4">{t.nome}</span>
                      <p className="text-white/55 italic text-base leading-relaxed">
                        {textoLugarPedeEscuta(t.id)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="col-span-2 text-center text-white/30 italic py-10">Nenhum território pede retorno agora.</p>
                )}
              </div>
            </section>

            {/* Próxima Trilha */}
            <section className="text-center space-y-8 py-20 border-y border-white/5 relative">
              <div className="absolute inset-0 bg-gold/[0.02] -z-10" />
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-gold/10 flex items-center justify-center">
                  <Compass className="w-6 h-6 text-gold/40" />
                </div>
                <h2 className="text-2xl md:text-3xl text-white/90 italic tracking-wide">Próxima Trilha</h2>
              </div>
              <p className="text-xl md:text-2xl text-white/80 italic max-w-2xl mx-auto leading-relaxed font-light">
                O convite desta travessia não é agir mais.
                <br />
                É aprender a reconhecer os sinais antes de descartá-los.
              </p>
            </section>

            {/* Síntese da Loba */}
            <section className="text-center space-y-8 max-w-3xl mx-auto">
              <h3 className="text-gold/50 italic text-[10px] tracking-[0.4em] uppercase font-black">Síntese da Loba</h3>
              <p className="text-2xl md:text-3xl text-white italic leading-relaxed font-light px-4">
                Você não parece distante da vida.
                <br />
                Parece distante de alguns lugares onde a sua própria vida continua tentando florescer
                {maisSoterrado ? `, em especial no território de ${maisSoterrado.nome}.` : '.'}
              </p>
            </section>

            <section className="text-center">
              <button 
                onClick={onNext}
                className="group relative px-16 py-6 text-gold border border-gold/20 hover:border-gold/50 transition-all rounded-full overflow-hidden shadow-2xl shadow-gold/10"
              >
                <div className="absolute inset-0 bg-gold/5 group-hover:bg-gold/10 transition-colors" />
                <span className="relative z-10 tracking-[0.3em] uppercase text-xs font-bold">Guardar Rastros e Continuar</span>
              </button>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
