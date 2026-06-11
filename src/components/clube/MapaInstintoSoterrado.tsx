import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles, Send, CheckCircle2, ChevronRight, Info, Target, Map, BookOpen, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { MandalaFinal, TERRITORIOS } from './MandalaFinal';
import { JardimInput } from './JardimInput';

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
  { id: 'corpo', label: 'Corpo', nome: 'Corpo', icon: '❤️', perguntas: [
    'Quando o cansaço atravessa sua jornada, de que forma seu corpo costuma sinalizar que o passo precisa mudar?',
    'Ao fechar os olhos por um instante, você consegue distinguir onde termina a sua energia e onde começa a expectativa do mundo sobre seus movimentos?',
    'Nas últimas travessias, com que frequência você percebeu que seu corpo só foi ouvido quando a dor precisou gritar?'
  ]},
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

const PROMPTS_JARDIM: Record<string, { psique: string, oficio: string }> = {
  corpo: {
    psique: "Reflita sobre como o seu corpo tem pedido retorno. O que ele sussurra quando você pausa?",
    oficio: "Como o ritmo do seu trabalho respeita ou ignora os sinais de vitalidade do seu corpo físico?"
  },
  intuicao: {
    psique: "Qual foi o último sinal intuitivo que você minimizou? Como seria dar um lugar de honra a ele hoje?",
    oficio: "De que forma a sua percepção imediata poderia guiar uma decisão profissional que parece puramente lógica?"
  },
  desejo: {
    psique: "Resgate um desejo que ficou soterrado. O que ele revela sobre a sua natureza mais autêntica?",
    oficio: "Como o seu trabalho pode se tornar um solo mais fértil para aquilo que você genuinamente deseja criar?"
  },
  limites: {
    psique: "Onde seus contornos estão mais diluídos? Qual 'não' gentil você precisa plantar hoje?",
    oficio: "Mapeie as invasões de tempo e energia no seu ofício. Como reconstruir as torres de proteção?"
  },
  criatividade: {
    psique: "Pense em uma ideia 'inútil' que você teve recentemente. O que ela diz sobre o seu direito de brincar com a vida?",
    oficio: "Onde a produtividade está matando a inovação no seu trabalho? Como abrir espaço para o lúdico?"
  },
  vitalidade: {
    psique: "O que devolve a sua sensação de estar viva agora? Como cultivar essa presença mais vezes?",
    oficio: "Quais projetos profissionais drenam seu rastro e quais devolvem entusiasmo? O que precisa ser podado?"
  }
};

const TRILHAS_FINAIS: Record<string, string> = {
  corpo: "Nesta estação, a Clareira do Chamado convida você a observar os sinais físicos que costuma minimizar antes mesmo de escutá-los.",
  intuicao: "O rastro agora pede que você silencie as explicações externas para voltar a escutar o que o seu primeiro sentir já sabe.",
  desejo: "A trilha aponta para o resgate do que é autêntico, separando o fogo sagrado do seu querer do ruído das expectativas alheias.",
  limites: "É tempo de fortalecer os seus contornos, reconhecendo que a sua energia é um território sagrado que exige proteção.",
  criatividade: "A próxima etapa convida a sua loba a brincar novamente com as possibilidades, sem o peso da utilidade imediata.",
  vitalidade: "O caminho agora foca na recuperação da sua força vital, podando o que drena para que o entusiasmo possa voltar a brotar."
};

const GESTOS_SIMBOLICOS: Record<string, string> = {
  corpo: "Oferecer 5 minutos de silêncio ao corpo antes de aceitar qualquer nova demanda física.",
  intuicao: "Registrar uma percepção 'sem sentido' logo ao acordar, dando a ela um lugar no papel.",
  desejo: "Nomear um pequeno querer pessoal hoje, sem precisar explicar o motivo a ninguém.",
  limites: "Praticar um 'não' gentil para algo que sutilmente invade o seu tempo de descanso.",
  criatividade: "Brincar com um material ou ideia nova por 10 minutos, sem intenção de terminar ou mostrar.",
  vitalidade: "Identificar uma ação que te devolva presença e realizá-la com intenção total hoje."
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
        const tResponses = respostas[t.id] || {};
        const currentSum = Object.values(tResponses).reduce((a, b) => a + b, 0) + (t.id === tId ? score : 0);
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
  const currentE = EIXOS[currentEixoIdx];

  const acesoTerritorios = TERRITORIOS.filter(t => estados[t.id] === 'Aceso');
  const soterradoTerritorios = TERRITORIOS.filter(t => estados[t.id] === 'Soterrado' || estados[t.id] === 'Exausto');
  const maisSoterradoId = Object.entries(estados).find(([_, e]) => e === 'Soterrado' || e === 'Exausto')?.[0] || 'vitalidade';

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 px-4">
      {view === 'intro' && (
        <div className="text-center space-y-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-white italic">Mapa do Instinto Soterrado™</h2>
            <p className="text-white/60 font-serif italic max-w-xl mx-auto">Uma cartografia simbólica para identificar quais territórios da sua natureza pedem seu retorno nesta estação.</p>
          </motion.div>
          <Button onClick={() => setView('perguntas')} className="bg-gold text-midnight px-12 py-7 rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform">
            Iniciar Cartografia
          </Button>
        </div>
      )}

      {view === 'perguntas' && (
        <Card className="bg-midnight/40 p-6 md:p-12 rounded-[40px] space-y-10 border-white/5 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Compass className="w-32 h-32" />
          </div>
          
          <div className="flex flex-col items-center gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <span className="text-xl">{currentT.icon}</span>
              <div className="text-white font-serif italic text-lg">Território: {currentT.nome}</div>
            </div>
            {/* Progress Dots */}
            <div className="flex gap-2">
              {PERGUNTAS.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-500",
                    i === currentTerritorioIdx ? "bg-gold scale-125" : i < currentTerritorioIdx ? "bg-gold/40" : "bg-white/10"
                  )} 
                />
              ))}
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentTerritorioIdx}-${currentEixoIdx}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12 relative z-10"
            >
              <h4 className="text-2xl md:text-4xl font-serif text-white italic text-center leading-tight">
                {currentT.perguntas[currentEixoIdx]}
              </h4>
              
              <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
                {OPCOES.map((opt, i) => (
                  <Button 
                    key={i} 
                    variant="ghost" 
                    onClick={() => handleSelect(opt.score)} 
                    className="h-auto py-6 px-8 text-center font-serif italic text-lg border border-white/5 bg-white/5 hover:border-gold/30 hover:bg-white/10 transition-all rounded-2xl leading-relaxed"
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </Card>
      )}

      {view === 'resultado' && (
        <div className="space-y-20 animate-in fade-in duration-1000">
          <div className="text-center space-y-6">
            <h3 className="text-gold uppercase tracking-[0.4em] font-black text-[11px]">Cartografia Concluída</h3>
            <h2 className="text-3xl md:text-5xl font-serif italic text-white leading-tight">Os rastros da sua natureza</h2>
          </div>

          <MandalaFinal estados={estados} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-white/5 border-white/5 p-8 rounded-[32px] space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-gold" />
                </div>
                <h4 className="text-gold font-bold uppercase tracking-widest text-[10px]">Pegadas Encontradas</h4>
              </div>
              <p className="text-white/40 text-xs font-serif italic uppercase tracking-widest leading-relaxed">
                A loba continua deixando sinais em:
              </p>
              <div className="flex flex-wrap gap-2">
                {acesoTerritorios.map(t => (
                  <span key={t.id} className="bg-gold/10 text-gold px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-gold/10">
                    {t.nome}
                  </span>
                ))}
                {acesoTerritorios.length === 0 && <span className="text-white/20 italic">Buscando novos sinais...</span>}
              </div>
            </Card>

            <Card className="bg-white/5 border-white/5 p-8 rounded-[32px] space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Compass className="w-4 h-4 text-white/60" />
                </div>
                <h4 className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Pegadas Quase Apagadas</h4>
              </div>
              <p className="text-white/40 text-xs font-serif italic uppercase tracking-widest leading-relaxed">
                Os rastros estão mais difíceis de perceber em:
              </p>
              <div className="flex flex-wrap gap-2">
                {soterradoTerritorios.map(t => (
                  <span key={t.id} className="bg-white/10 text-white/60 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5">
                    {t.nome}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          <div className="bg-gold/5 p-12 rounded-[40px] border border-gold/10 space-y-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gold/5 blur-[80px] rounded-full" />
            <h4 className="text-gold font-bold uppercase tracking-[0.4em] text-[10px] relative z-10">Próxima Trilha</h4>
            <p className="text-2xl md:text-3xl font-serif italic text-white/90 leading-relaxed max-w-2xl mx-auto relative z-10">
              "{TRILHAS_FINAIS[maisSoterradoId]}"
            </p>
            <div className="pt-8 border-t border-gold/10 max-w-md mx-auto relative z-10">
              <p className="text-gold/60 text-[10px] uppercase tracking-[0.2em] font-black mb-4">Gesto de Retorno</p>
              <p className="text-white/80 font-serif italic text-lg">{GESTOS_SIMBOLICOS[maisSoterradoId]}</p>
            </div>
          </div>

          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h3 className="text-gold uppercase tracking-[0.3em] font-black text-[10px]">Cultivo nos Jardins</h3>
              <p className="text-white/60 font-serif italic">Use os rastros encontrados para nutrir seus espaços de reflexão.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3 px-4">
                  <BookOpen className="w-5 h-5 text-gold" />
                  <h4 className="text-white font-serif italic text-xl">Jardim da Psique</h4>
                </div>
                <JardimInput 
                  type="psique" 
                  pontoId={estacaoId} 
                  sourceTitle="Mapa do Instinto Soterrado"
                  pergunta={PROMPTS_JARDIM[maisSoterradoId].psique}
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 px-4">
                  <PenTool className="w-5 h-5 text-emerald-500" />
                  <h4 className="text-white font-serif italic text-xl">Jardim do Ofício</h4>
                </div>
                <JardimInput 
                  type="oficio" 
                  pontoId={estacaoId} 
                  sourceTitle="Mapa do Instinto Soterrado"
                  pergunta={PROMPTS_JARDIM[maisSoterradoId].oficio}
                />
              </div>
            </div>
          </div>

          <div className="pt-10">
            <Button onClick={onNext} className="w-full h-16 bg-gradient-to-r from-gold via-gold/90 to-[#c5a059] text-midnight font-black uppercase tracking-widest text-[11px] rounded-full hover:shadow-[0_10px_40px_rgba(212,175,55,0.3)] transition-all active:scale-95 border-none">
              Guardar Rastro e Continuar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

