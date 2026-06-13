import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ChevronRight, BookOpen, Scroll } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { TERRITORIOS } from './MandalaFinal';
import mandalaOficial from '@/assets/mandala-instinto-oficial.png.asset.json';

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
    const rastrosPool = [
      'A clareira guardou esse sinal.',
      'Uma marca permaneceu no caminho.',
      'O território registrou sua passagem.',
      'Um rastro tornou-se visível.',
      'A névoa se move entre as árvores.',
      'Outro território aguarda observação.',
    ];
    setRastroAtual(rastrosPool[Math.floor(Math.random() * rastrosPool.length)]);

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

              <section className="w-full space-y-2 lg:border-l lg:border-gold/10 lg:pl-10">
                <p className="text-white/70 italic text-base md:text-lg mb-8 text-center lg:text-left font-light">
                  Durante esta travessia, qual destas cenas parece mais familiar?
                </p>
                {rastroAtual ? (
                  <motion.div
                    key={rastroAtual}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="py-16 text-center space-y-6"
                  >
                    <p className="text-white/80 italic text-xl md:text-2xl leading-relaxed font-light">{rastroAtual}</p>
                    <div className="h-px w-16 bg-gold/30 mx-auto" />
                    <p className="text-gold/50 italic text-sm tracking-[0.25em] uppercase">A trilha continua</p>
                  </motion.div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {TRAVESSIA_ETAPAS[currentIdx].caminhos.map((caminho, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectCaminho(caminho)}
                        className="group w-full text-left py-7 md:py-9 px-2 hover:bg-gold/[0.02] transition-colors duration-700"
                      >
                        <p className="text-white/70 group-hover:text-white italic text-lg md:text-xl leading-relaxed font-light transition-colors max-w-xl">
                          {caminho.label}
                        </p>
                      </button>
                    ))}
                  </div>
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
            className="max-w-5xl mx-auto py-10 md:py-16 space-y-20 md:space-y-28 relative"
          >
            <p className="text-center text-gold/70 italic text-sm md:text-base tracking-[0.25em] uppercase">
              La Loba não procura respostas. Procura rastros.
            </p>

            {/* SEÇÃO 1 — HERO com mandala oficial */}
            <section className="relative w-full flex items-center justify-center px-2 sm:px-6">
              {/* glow dourado */}
              <div
                className="absolute inset-0 -z-10 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.06) 35%, transparent 70%)',
                  filter: 'blur(40px)',
                }}
              />
              {/* partículas discretas */}
              <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                {Array.from({ length: 18 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute w-[2px] h-[2px] rounded-full bg-gold/40"
                    style={{
                      top: `${(i * 53) % 100}%`,
                      left: `${(i * 37) % 100}%`,
                    }}
                    animate={{ opacity: [0.1, 0.6, 0.1] }}
                    transition={{ duration: 4 + (i % 5), repeat: Infinity, delay: i * 0.3 }}
                  />
                ))}
              </div>
              <motion.img
                src={mandalaOficial.url}
                alt="Mapa do Instinto Soterrado — A Loba e os seis territórios"
                className="w-full max-w-[820px] h-auto select-none"
                draggable={false}
                animate={{ scale: [1, 1.012, 1], opacity: [0.96, 1, 0.96] }}
                transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
                style={{ filter: 'drop-shadow(0 0 60px rgba(212,175,55,0.15))' }}
              />
            </section>

            {/* SEÇÃO 2 — Título */}
            <header className="text-center space-y-5 px-4">
              <h1 className="text-3xl xs:text-5xl md:text-7xl text-white italic tracking-tight break-words">
                Cartografia da Clareira
              </h1>
              <div className="h-px w-24 bg-gold/30 mx-auto" />
              <p className="text-white/75 italic text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
                Os rastros apareceram.
                <br />
                Agora é possível observar os lugares onde a vida continua tentando falar.
              </p>
            </header>

            {/* SEÇÃO 3 — Lugares que Responderam */}
            <section className="space-y-8">
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-2xl md:text-3xl text-white/90 italic tracking-wide">Rastros mais visíveis</h2>
                <div className="h-px w-12 bg-gold/30" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {acesosOscilantes.length > 0 ? (
                  acesosOscilantes.slice(0, 3).map(t => (
                    <div key={t.id} className="p-8 md:p-10 rounded-[2rem] border border-gold/20 bg-white/[0.03] backdrop-blur-md">
                      <span className="text-gold italic text-2xl md:text-3xl block mb-4">{t.nome}</span>
                      <p className="text-white/75 italic text-base md:text-lg leading-relaxed">
                        {textoLugarResponde(t.id)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="col-span-2 text-center text-white/40 italic py-10">Os territórios ainda estão em silêncio.</p>
                )}
              </div>
            </section>

            {/* SEÇÃO 4 — Lugares que Pedem Escuta */}
            <section className="space-y-8">
              <div className="flex flex-col items-center gap-3">
                <h2 className="text-2xl md:text-3xl text-white/90 italic tracking-wide">Lugares que Pedem Escuta</h2>
                <div className="h-px w-12 bg-white/15" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {soterradoTerritorios.length > 0 ? (
                  soterradoTerritorios.slice(0, 3).map(t => (
                    <div key={t.id} className="p-8 md:p-10 rounded-[2rem] border border-white/10 bg-white/[0.02]">
                      <span className="text-white/80 italic text-2xl md:text-3xl block mb-4">{t.nome}</span>
                      <p className="text-white/65 italic text-base md:text-lg leading-relaxed">
                        {textoLugarPedeEscuta(t.id)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="col-span-2 text-center text-white/40 italic py-10">Nenhum território pede retorno agora.</p>
                )}
              </div>
            </section>

            {/* SEÇÃO 5 — Síntese da Loba */}
            <section className="text-center space-y-6 max-w-3xl mx-auto px-4">
              <h3 className="text-gold/60 italic text-[10px] tracking-[0.4em] uppercase">Síntese da Loba</h3>
              <p className="text-2xl md:text-3xl text-white italic leading-relaxed font-light">
                Você não parece distante da vida.
                <br />
                Parece distante de alguns lugares
                <br />
                onde a própria vida continua tentando chamá-la
                {maisSoterrado ? `, sobretudo em ${maisSoterrado.nome}.` : '.'}
              </p>
            </section>

            {/* SEÇÃO 6 — Primeiro Gesto */}
            <section className="max-w-2xl mx-auto px-4 space-y-6 text-center">
              <h3 className="text-gold/60 italic text-[10px] tracking-[0.4em] uppercase">Primeiro Gesto</h3>
              <p className="text-xl md:text-2xl text-white/90 italic leading-relaxed font-light">
                O que você vem descartando antes mesmo de escutar?
              </p>
              <textarea
                placeholder="Registrar no Jardim da Psique (opcional)"
                className="w-full min-h-[120px] p-5 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-gold/40 focus:outline-none text-white/80 italic placeholder:text-white/30 resize-none transition-colors"
              />
            </section>

            {/* SEÇÃO 7 — Rastros na CidadELA */}
            <section className="text-center max-w-xl mx-auto px-4">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-gold/20 bg-gold/[0.04]">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                <p className="text-gold/80 italic text-sm md:text-base">
                  Uma nova marca apareceu na trilha da CidadELA.
                </p>
              </div>
            </section>

            {/* SEÇÃO 8 — Botão Final */}
            <section className="text-center pt-4">
              <button 
                onClick={onNext}
                className="group relative px-12 md:px-16 py-5 md:py-6 text-gold border border-gold/30 hover:border-gold/60 transition-all rounded-full overflow-hidden shadow-2xl shadow-gold/10"
              >
                <div className="absolute inset-0 bg-gold/5 group-hover:bg-gold/15 transition-colors" />
                <span className="relative z-10 tracking-[0.3em] uppercase text-xs font-bold">Guardar Rastro e Continuar</span>
              </button>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
