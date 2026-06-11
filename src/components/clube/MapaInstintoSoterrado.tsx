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

const EIXOS = [
  { id: 'comportamento', label: 'Comportamento' },
  { id: 'percepcao', label: 'Percepção' },
  { id: 'consequencia', label: 'Consequência' }
];

const PERGUNTAS = [
  { id: 'corpo', label: 'Corpo', perguntas: [
    'Diante de um desconforto físico ou cansaço, minha primeira reação é...',
    'Consigo identificar as mensagens sutis do meu corpo enquanto elas ainda são pequenas?',
    'Com que frequência sinto que meu corpo gritou por não ter sido ouvido antes?'
  ]},
  { id: 'intuicao', label: 'Intuição', perguntas: [
    'Quando tenho um pressentimento ou frio na barriga sobre algo, eu costumo...',
    'O quanto confio na minha voz interna sem precisar de uma explicação lógica imediata?',
    'Olhando para trás, quantas vezes ignorei um sinal intuitivo e me arrependi?'
  ]},
  { id: 'desejo', label: 'Desejo', perguntas: [
    'Quando algo desperta meu interesse genuíno, eu me permito...',
    'Consigo diferenciar o que eu realmente quero do que esperam que eu queira?',
    'Como me sinto após adiar ou ignorar um desejo autêntico por muito tempo?'
  ]},
  { id: 'limites', label: 'Limites', perguntas: [
    'Ao perceber que algo está invadindo meu espaço ou energia, eu...',
    'Consigo sentir o momento exato em que meu sim deveria ser um não?',
    'Qual o nível de desgaste emocional que sinto por carregar pesos que não são meus?'
  ]},
  { id: 'criatividade', label: 'Criatividade', perguntas: [
    'Quando uma ideia nova aparece, meu movimento natural é...',
    'Sinto que tenho um espaço interno seguro para criar sem me julgar?',
    'Como percebo o fluxo de novas soluções e cores na minha rotina?'
  ]},
  { id: 'vitalidade', label: 'Vitalidade', perguntas: [
    'Ao iniciar minha semana, meu nível de engajamento com a vida é...',
    'Consigo identificar o que me nutre e o que me drena de forma clara?',
    'Nos últimos meses, quanto da minha energia foi investido em coisas que me fazem sentir viva?'
  ]}
];

const OPCOES = [
  { label: 'Escutar / Investigar / Aproximar / Nomear / Espaço / Entusiasmo', score: 3, estado: 'Aceso' as Estado },
  { label: 'Perceber depois / Buscar confirmação / Observar / Ajustar / Registrar / Instável', score: 2, estado: 'Oscilante' as Estado },
  { label: 'Ignorar / Duvidar / Adiar / Tolerar / Adiar / Pouca presença', score: 1, estado: 'Soterrado' as Estado },
  { label: 'Limite / Ignorar / Convencer / Desgaste / Abandonar / Distante', score: 0, estado: 'Exausto' as Estado }
];

const DEVOLUTIVAS: Record<string, Record<string, string>> = {
  corpo: {
    Aceso: "Seu corpo é um aliado claro e você escuta seus limites com respeito.",
    Oscilante: "Você percebe os sinais físicos, mas às vezes hesita em agir sobre eles.",
    Soterrado: "Seu corpo parece emitir sinais, mas eles só são reconhecidos quando o desgaste já está avançado.",
    Exausto: "A conexão física está silenciada; o corpo apenas cumpre funções sem ser sentido."
  },
  intuicao: {
    Aceso: "Sua voz interna é seu guia principal e você confia no que ela sopra.",
    Oscilante: "Sua percepção aparece, mas ainda encontra dúvida antes de virar confiança.",
    Soterrado: "A intuição está enterrada sob camadas de lógica e necessidade de explicação.",
    Exausto: "O silêncio intuitivo é profundo; a voz interna foi trocada por barulho externo."
  },
  desejo: {
    Aceso: "Seu fogo interno arde com clareza e você sabe o que quer.",
    Oscilante: "O desejo pulsa, mas muitas vezes é filtrado pelo que é 'possível'.",
    Soterrado: "O que você quer ficou esquecido atrás do que você 'precisa' fazer.",
    Exausto: "O desejo parece ter sido colocado em segundo plano por tempo demais."
  },
  limites: {
    Aceso: "Seus contornos são firmes e você protege seu território com naturalidade.",
    Oscilante: "Seus limites oscilam conforme a pessoa ou a situação, gerando instabilidade.",
    Soterrado: "O 'não' é uma palavra difícil e o seu espaço é frequentemente invadido.",
    Exausto: "A barreira de proteção caiu; você está absorvendo pesos que não são seus."
  },
  criatividade: {
    Aceso: "O fluxo de criação é livre e você se permite brincar com a realidade.",
    Oscilante: "Existem lampejos de ideias, mas o julgamento as trava antes de nascerem.",
    Soterrado: "A criatividade está presa em um ciclo de utilitarismo e produtividade.",
    Exausto: "A fonte parece seca; não há espaço para o novo ou para o lúdico."
  },
  vitalidade: {
    Aceso: "Sua energia flui com presença e você se sente engajada com a vida.",
    Oscilante: "Existem picos de energia seguidos de vales de desânimo sem causa aparente.",
    Soterrado: "A vida parece um conjunto de tarefas a cumprir, com pouca alegria real.",
    Exausto: "O cansaço é crônico e a sensação de 'vazio' tomou o lugar do entusiasmo."
  }
};

const GESTOS: Record<string, string> = {
  corpo: "Pausar por 5 minutos antes de responder a qualquer demanda externa.",
  intuicao: "Anotar a sua primeira percepção sobre um problema antes de pedir a opinião de alguém.",
  desejo: "Nomear um pequeno desejo pessoal hoje, sem precisar justificar por que o quer.",
  limites: "Dizer um 'não' pequeno e gentil para algo que não te nutre.",
  criatividade: "Registrar uma ideia nova no papel sem se preocupar com utilidade ou cobrança.",
  vitalidade: "Buscar uma ação física que te devolva a sensação de estar presente no seu próprio corpo."
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
      const distritoImpactado = TERRITORIOS.find(t => t.id === territorioMaisSoterrado)?.distrito || 'Coração da CidadELA';

      await supabase.from('clube_mapa_instinto_registros').insert({
        user_id: user.id,
        rota_id: rotaId,
        estacao_id: estacaoId,
        ...finalEstados,
        territorio_mais_aceso: territorioMaisAceso,
        territorio_mais_soterrado: territorioMaisSoterrado,
        distrito_cidadela_impactado: distritoImpactado
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
        // Add the current selection because state hasn't updated yet for the last one
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

  const groupedTerritorios = {
    sinais: TERRITORIOS.filter(t => estados[t.id] === 'Aceso' || estados[t.id] === 'Oscilante'),
    retorno: TERRITORIOS.filter(t => estados[t.id] === 'Soterrado'),
    cuidado: TERRITORIOS.filter(t => estados[t.id] === 'Exausto')
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 px-4">
      {view === 'intro' && (
        <div className="text-center space-y-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-4xl md:text-6xl font-serif text-white italic">Mapa do Instinto Soterrado™</h2>
            <p className="text-white/60 font-serif italic max-w-xl mx-auto">Uma cartografia simbólica para identificar quais territórios da sua natureza instintiva pedem seu retorno.</p>
          </motion.div>
          <Button onClick={() => setView('perguntas')} className="bg-gold text-midnight px-12 py-7 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform">
            Iniciar Cartografia
          </Button>
        </div>
      )}

      {view === 'perguntas' && (
        <Card className="bg-midnight/40 p-6 md:p-12 rounded-[40px] space-y-10 border-white/5 backdrop-blur-md">
          <div className="flex justify-between items-center">
            <div className="text-gold uppercase tracking-[0.3em] font-black text-[10px]">{currentT.label} — {currentE.label}</div>
            <div className="text-white/20 text-[10px] font-black">{currentTerritorioIdx + 1}/{PERGUNTAS.length}</div>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentTerritorioIdx}-${currentEixoIdx}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h4 className="text-2xl md:text-3xl font-serif text-white italic text-center leading-relaxed">
                {currentT.perguntas[currentEixoIdx]}
              </h4>
              
              <div className="grid grid-cols-1 gap-4">
                {OPCOES.map((opt, i) => (
                  <Button 
                    key={i} 
                    variant="ghost" 
                    onClick={() => handleSelect(opt.score)} 
                    className="h-auto py-6 px-8 text-center md:text-left font-serif italic text-lg border border-white/5 bg-white/5 hover:border-gold/50 hover:bg-white/10 transition-all rounded-2xl"
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
        <div className="space-y-16 animate-in fade-in duration-1000">
          <MandalaFinal estados={estados} />
          
          <div className="text-center space-y-4">
            <h3 className="text-2xl md:text-3xl font-serif italic text-white/90 px-4 leading-relaxed">
              {(() => {
                const acesoCount = Object.values(estados).filter(e => e === 'Aceso').length;
                const soterradoCount = Object.values(estados).filter(e => e === 'Soterrado' || e === 'Exausto').length;
                const maisAcesoId = Object.entries(estados).find(([_, e]) => e === 'Aceso')?.[0];
                const maisSoterradoId = Object.entries(estados).find(([_, e]) => e === 'Soterrado' || e === 'Exausto')?.[0];
                
                const maisAcesoNome = TERRITORIOS.find(t => t.id === maisAcesoId)?.nome.toLowerCase() || 'intuição';
                const maisSoterradoNome = TERRITORIOS.find(t => t.id === maisSoterradoId)?.nome.toLowerCase() || 'corpo';

                if (acesoCount >= 4) return "Seu instinto está vibrante e pronto para novos caminhos.";
                if (soterradoCount >= 4) return "Há sinais vivos, mas a adaptação ainda cobre territórios essenciais.";
                if (maisAcesoId && maisSoterradoId) return `Sua loba ainda canta pela ${maisAcesoNome}, mas o ${maisSoterradoNome} pede retorno.`;
                return "Seu instinto não desapareceu; ele está fragmentado entre sinais vivos e áreas exaustas.";
              })()}
            </h3>
          </div>

          <div className="space-y-12">
            {groupedTerritorios.sinais.length > 0 && (
              <div className="space-y-6">
                <h4 className="text-gold/60 uppercase tracking-[0.2em] font-black text-[10px] px-4">Territórios que ainda enviam sinais</h4>
                <div className="grid gap-4 px-4 md:px-0">
                  {groupedTerritorios.sinais.map(t => (
                    <div key={t.id} className="bg-white/5 p-8 rounded-[32px] border border-white/5 space-y-2 backdrop-blur-sm">
                      <span className="text-gold font-bold uppercase text-[10px] tracking-[0.2em]">{t.nome} — {estados[t.id]}</span>
                      <p className="text-white/80 font-serif italic text-lg leading-relaxed">{DEVOLUTIVAS[t.id][estados[t.id]]}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {groupedTerritorios.retorno.length > 0 && (
              <div className="space-y-6">
                <h4 className="text-gold/60 uppercase tracking-[0.2em] font-black text-[10px] px-4">Territórios que pedem retorno</h4>
                <div className="grid gap-4 px-4 md:px-0">
                  {groupedTerritorios.retorno.map(t => (
                    <div key={t.id} className="bg-white/5 p-8 rounded-[32px] border border-white/10 space-y-2 backdrop-blur-sm">
                      <span className="text-gold font-bold uppercase text-[10px] tracking-[0.2em]">{t.nome} — {estados[t.id]}</span>
                      <p className="text-white/80 font-serif italic text-lg leading-relaxed">{DEVOLUTIVAS[t.id][estados[t.id]]}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {groupedTerritorios.cuidado.length > 0 && (
              <div className="space-y-6">
                <h4 className="text-gold/60 uppercase tracking-[0.2em] font-black text-[10px] px-4">Territórios que precisam de cuidado antes de ação</h4>
                <div className="grid gap-4 px-4 md:px-0">
                  {groupedTerritorios.cuidado.map(t => (
                    <div key={t.id} className="bg-white/5 p-8 rounded-[32px] border border-white/5 space-y-2 backdrop-blur-sm">
                      <span className="text-gold font-bold uppercase text-[10px] tracking-[0.2em]">{t.nome} — {estados[t.id]}</span>
                      <p className="text-white/80 font-serif italic text-lg leading-relaxed">{DEVOLUTIVAS[t.id][estados[t.id]]}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-gold/5 p-8 rounded-[32px] border border-gold/20 space-y-6 mx-4 md:mx-0">
            <h4 className="text-gold font-serif text-2xl italic">Primeiro gesto possível</h4>
            <p className="text-white/80 text-lg leading-relaxed">
              {(() => {
                const maisSoterradoId = Object.entries(estados).find(([_, e]) => e === 'Soterrado' || e === 'Exausto')?.[0] || 'vitalidade';
                return GESTOS[maisSoterradoId];
              })()}
            </p>
            <div className="pt-6 border-t border-gold/10">
              <span className="text-gold/60 text-[10px] uppercase tracking-[0.2em] font-bold">
                Distrito impactado na CidadELA Interior: {TERRITORIOS.find(t => t.id === (Object.entries(estados).find(([_, e]) => e === 'Soterrado' || e === 'Exausto')?.[0] || 'vitalidade'))?.distrito}
              </span>
            </div>
          </div>

          <div className="px-4 md:px-0">
            <Button onClick={onNext} className="w-full h-16 bg-gradient-to-r from-gold via-gold/90 to-[#c5a059] text-midnight font-black uppercase tracking-widest text-[11px] rounded-full hover:opacity-90 shadow-[0_10px_30px_rgba(212,175,55,0.2)] transition-all active:scale-95 border-none">
              Guardar Rastro e Continuar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
