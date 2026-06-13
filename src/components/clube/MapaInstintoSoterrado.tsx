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

const TRAVESSIA_ETAPAS = [
  {
    id: 'corpo',
    titulo: 'Jardim do Corpo',
    intro: 'A Loba pisa devagar entre raízes úmidas. O ar é morno e cheira a terra recente. Em algum lugar do peito, um tambor lento insiste em ser ouvido. Ela se ajoelha junto a uma pegada fresca na lama.',
    caminhos: [
      { label: 'Aproximo-me da pegada e respiro fundo, escutando o tambor.', estado: 'Aceso' as Estado, score: 3, resposta: 'A Loba percebe um movimento claro no território do Corpo. A trilha brilha sob a lua.' },
      { label: 'Olho a pegada de longe, sem saber se devo seguir.', estado: 'Oscilante' as Estado, score: 2, resposta: 'A brasa do Corpo oscila, ainda viva, ainda escutável.' },
      { label: 'Cubro a pegada com folhas e sigo adiante.', estado: 'Soterrado' as Estado, score: 1, resposta: 'Os rastros do Corpo ficam difíceis de encontrar. A Loba registra o silêncio.' },
      { label: 'Continuo andando mesmo sentindo o tambor doer.', estado: 'Exausto' as Estado, score: 0, resposta: 'A Loba reconhece o cansaço antigo. Há uma fonte esquecida neste território.' }
    ]
  },
  {
    id: 'intuicao',
    titulo: 'Clareira da Escuta',
    intro: 'A floresta abre-se em uma clareira de luz pálida. Antes de qualquer pensamento, algo dentro da Loba já sabe por onde ir. Um vento curto cruza sua nuca, como um sussurro vindo de um lugar sem nome.',
    caminhos: [
      { label: 'Sigo o vento sem precisar entendê-lo.', estado: 'Aceso' as Estado, score: 3, resposta: 'A Voz que Pressente está acordada. A Loba caminha como quem já conhece o atalho.' },
      { label: 'Escuto o sussurro, mas peço uma segunda confirmação.', estado: 'Oscilante' as Estado, score: 2, resposta: 'A intuição vacila, espera ser legitimada. A clareira aguarda.' },
      { label: 'Penso que é só o vento e ignoro.', estado: 'Soterrado' as Estado, score: 1, resposta: 'O sussurro recua. A Loba anota: aqui a escuta foi adiada.' },
      { label: 'Forço a razão a decidir por mim, ainda que algo proteste.', estado: 'Exausto' as Estado, score: 0, resposta: 'A clareira fica em sombra. A intuição se retira sem ressentimento, mas em silêncio.' }
    ]
  },
  {
    id: 'desejo',
    titulo: 'Fogueira do Desejo',
    intro: 'No centro de uma rocha lisa, restos de uma fogueira ainda guardam calor. Uma única brasa pulsa sob as cinzas, teimosa. A Loba sente o cheiro doce de algo que um dia foi vivo e quer voltar a arder.',
    caminhos: [
      { label: 'Sopro a brasa devagar e deixo o fogo subir.', estado: 'Aceso' as Estado, score: 3, resposta: 'Uma brasa volta a acender-se no território do Desejo. A noite fica mais quente.' },
      { label: 'Aproximo as mãos, sinto o calor, mas não sopro ainda.', estado: 'Oscilante' as Estado, score: 2, resposta: 'O Desejo respira em ritmo curto. A Loba reconhece a hesitação antiga.' },
      { label: 'Cubro a brasa com cinzas para não me distrair.', estado: 'Soterrado' as Estado, score: 1, resposta: 'A fogueira esfria. O território do Desejo guarda silêncio sob as cinzas.' },
      { label: 'Apago a brasa com o pé e sigo, dizendo que não é hora.', estado: 'Exausto' as Estado, score: 0, resposta: 'A Loba sente um vazio quente onde o fogo morava. O Desejo ficou para depois mais uma vez.' }
    ]
  },
  {
    id: 'limites',
    titulo: 'Vale dos Limites',
    intro: 'O caminho estreita-se entre dois paredões de pedra. Pegadas de outros viajantes invadem a trilha em todas as direções. A Loba precisa decidir onde termina o seu território e onde começa o ruído alheio.',
    caminhos: [
      { label: 'Marco a pedra com a minha pata e sigo o meu ritmo.', estado: 'Aceso' as Estado, score: 3, resposta: 'A Loba reconhece a própria fronteira. O Vale dos Limites devolve eco firme.' },
      { label: 'Hesito, marco baixinho, deixo passagem para os outros.', estado: 'Oscilante' as Estado, score: 2, resposta: 'A fronteira está em rascunho. Ainda é possível redesenhar.' },
      { label: 'Apago a minha marca para não desagradar ninguém.', estado: 'Soterrado' as Estado, score: 1, resposta: 'Os Limites ficam invisíveis. A Loba registra uma trilha sem dono.' },
      { label: 'Sigo o trajeto dos outros mesmo sentindo as pedras ferirem as patas.', estado: 'Exausto' as Estado, score: 0, resposta: 'O Vale absorve o cansaço silencioso. Os Limites pedem reparo, sem pressa, mas pedem.' }
    ]
  },
  {
    id: 'criatividade',
    titulo: 'Trilha da Criatividade',
    intro: 'Uma trilha lateral aparece, coberta de musgo, sem placas. Não leva a lugar nenhum prometido. Ali, galhos, pedras e penas parecem esperar para serem reorganizados em algo que ainda não existe.',
    caminhos: [
      { label: 'Entro na trilha sem destino e começo a brincar com o que encontro.', estado: 'Aceso' as Estado, score: 3, resposta: 'A semente germina. A Trilha da Criatividade reconhece a Loba como sua.' },
      { label: 'Espio a trilha, mas volto para o caminho principal.', estado: 'Oscilante' as Estado, score: 2, resposta: 'A criação fica em suspenso, esperando uma noite mais livre.' },
      { label: 'Acho que não é hora de me dispersar e sigo direto.', estado: 'Soterrado' as Estado, score: 1, resposta: 'O musgo recobre o convite. O território da Criatividade adormece.' },
      { label: 'Olho a trilha com culpa, lembrando de tudo que ainda preciso resolver.', estado: 'Exausto' as Estado, score: 0, resposta: 'A Loba sente um peso seco. A Criatividade fica esperando do outro lado da urgência.' }
    ]
  },
  {
    id: 'vitalidade',
    titulo: 'Montanha da Vitalidade',
    intro: 'O caminho começa a subir. O ar fica mais fino, o coração mais alto. Ao longe, uma fonte de água viva escorre entre as pedras. A Loba mede o próprio fôlego antes de decidir como subir.',
    caminhos: [
      { label: 'Subo no meu ritmo, paro para beber, e continuo.', estado: 'Aceso' as Estado, score: 3, resposta: 'A Loba reconhece a força que sustenta. A montanha responde com vento limpo.' },
      { label: 'Subo rápido, mas começo a sentir o fôlego curto.', estado: 'Oscilante' as Estado, score: 2, resposta: 'A Vitalidade pisca como uma lanterna pedindo descanso.' },
      { label: 'Sigo subindo sem beber, dizendo que paro mais tarde.', estado: 'Soterrado' as Estado, score: 1, resposta: 'A fonte fica para trás. A Montanha guarda silêncio sobre o atraso.' },
      { label: 'Subo arrastando as patas, contando só os passos que faltam.', estado: 'Exausto' as Estado, score: 0, resposta: 'A Loba reconhece a exaustão antiga. A Vitalidade precisa de retorno, não de mais subida.' }
    ]
  }
];

export function MapaInstintoSoterrado({ estacaoId, rotaId, onNext }: MapaInstintoSoterradoProps) {
  const { user } = useAuth();
  const [view, setView] = useState<'intro' | 'travessia' | 'resultado'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, number>>({});
  const [estados, setEstados] = useState<Record<string, Estado>>({});
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
              <h1 className="text-3xl xs:text-5xl md:text-6xl text-white italic tracking-tight leading-tight px-4 max-w-[12ch] mx-auto">Mapa do Instinto Soterrado™</h1>
              <div className="h-px w-24 bg-gold/30 mx-auto my-8" />
              <p className="text-white/70 italic text-lg xl:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Esta não é uma avaliação. É uma travessia narrativa pelos territórios da sua natureza selvagem. <br/>
                Siga as pistas, observe os rastros e sinta qual caminho sua alma percorre hoje.
              </p>
              <button 
                onClick={() => setView('travessia')}
                className="group relative px-10 md:px-14 py-5 text-gold border border-gold/20 hover:border-gold/50 transition-all rounded-full overflow-hidden"
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
                <button 
                  onClick={() => {
                    if (currentIdx > 0) setCurrentIdx(prev => prev - 1);
                  }}
                  disabled={currentIdx === 0}
                  className="text-white/20 hover:text-white/45 italic text-[10px] tracking-[0.4em] uppercase transition-colors disabled:opacity-0"
                >
                  Voltar ao território anterior
                </button>
              </aside>

              <section className="w-full space-y-5 lg:border-l lg:border-gold/10 lg:pl-10">
                <p className="text-[9px] text-gold/45 uppercase tracking-[0.3em] text-center lg:text-left mb-2 font-black">Qual destas experiências descreve o seu agora?</p>
                {TRAVESSIA_ETAPAS[currentIdx].caminhos.map((caminho, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectCaminho(caminho.score, caminho.estado)}
                    className="group relative w-full text-left p-7 md:p-8 border border-white/10 hover:border-gold/40 bg-background/35 hover:bg-gold/[0.04] backdrop-blur-xl transition-all duration-500 rounded-[1.5rem] overflow-hidden"
                  >
                    <div className="absolute inset-y-0 left-0 w-1 bg-gold/0 group-hover:bg-gold/50 transition-all" />
                    <div className="relative z-10 flex items-center justify-between gap-6">
                      <span className="text-white/75 group-hover:text-white italic text-lg md:text-xl transition-colors">
                        {caminho.label}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gold/20 group-hover:text-gold/70 transition-all transform -translate-x-2 group-hover:translate-x-0 shrink-0" />
                    </div>
                  </button>
                ))}
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
            {/* Header Editorial */}
            <header className="text-center space-y-6">
              <div className="space-y-4">
                <div className="flex justify-center mb-2">
                  <Compass className="w-10 h-10 text-gold/20 animate-pulse" />
                </div>
                <h1 className="text-3xl xs:text-5xl md:text-7xl text-white italic tracking-tight px-4 break-words">Sua Cartografia Instintiva</h1>
                <p className="text-gold/60 italic text-xl">A loba continua deixando sinais em sua trilha.</p>
              </div>
              <div className="h-px w-32 bg-gold/20 mx-auto" />
            </header>

            <section className="w-full max-w-4xl mx-auto">
              <MandalaFinal estados={mandalaEstados} />
            </section>

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
                <h2 className="text-2xl md:text-3xl text-white/90 italic tracking-wide">Próxima Trilha</h2>
              </div>
              <p className="text-2xl md:text-3xl text-gold/80 italic max-w-2xl mx-auto leading-relaxed font-light">
                "Não se trata de agir mais. Trata-se de observar melhor os sinais que costumam ser descartados antes de serem escutados."
              </p>
            </section>

            <section className="space-y-8">
              <div className="flex flex-col items-center gap-3 text-center">
                <h2 className="text-2xl md:text-3xl text-white/90 italic tracking-wide">Jardins</h2>
                <div className="h-[1px] w-12 bg-gold/20" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 border border-gold/15 bg-background/45 backdrop-blur-xl rounded-[1.5rem]">
                  <h3 className="text-gold/80 italic text-2xl mb-3">Jardim da Psique</h3>
                  <p className="text-white/55 italic leading-relaxed">Guardar o rastro como pergunta íntima, sem transformar o símbolo em resposta fechada.</p>
                </div>
                <div className="p-8 border border-white/10 bg-background/35 backdrop-blur-xl rounded-[1.5rem]">
                  <h3 className="text-white/80 italic text-2xl mb-3">Jardim do Ofício</h3>
                  <p className="text-white/50 italic leading-relaxed">Observar como este território aparece na escuta profissional e nas conduções de campo.</p>
                </div>
              </div>
            </section>

            {/* Seção 4: Primeiro Gesto */}
            <section className="text-center space-y-12">
              <div className="space-y-6">
                <h3 className="text-gold/40 italic text-[10px] tracking-[0.4em] uppercase font-black">Primeiro Gesto de Retorno</h3>
                <p className="text-2xl xs:text-3xl md:text-5xl text-white italic leading-tight max-w-2xl mx-auto font-light px-4 break-words">
                  "{maisSoterrado ? `Qual necessidade do seu ${maisSoterrado.nome.toLowerCase()} você vem traduzindo apenas como uma obrigação?` : 'Qual sinal você tem ignorado por medo de ser livre?'}"
                </p>

              </div>
              
              <button 
                onClick={onNext}
                className="group relative px-16 py-6 text-gold border border-gold/20 hover:border-gold/50 transition-all rounded-full overflow-hidden shadow-2xl shadow-gold/10"
              >
                <div className="absolute inset-0 bg-gold/5 group-hover:bg-gold/10 transition-colors" />
                <span className="relative z-10 tracking-[0.3em] uppercase text-xs font-bold">Guardar Rastro e Continuar</span>
              </button>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
