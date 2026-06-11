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
      const territorioMaisSoterrado = Object.entries(finalEstados).find(([_, e]) => e === 'Soterrado' || e === 'Exausto')?.[0] || 'Nenhum';
      const distritoImpactado = TERRITORIOS.find(t => t.id === territorioMaisSoterrado)?.distrito || 'CidadELA';

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
      // Calculate results
      const finalEstados: Record<string, Estado> = {};
      PERGUNTAS.forEach(t => {
        const sum = Object.values(respostas[t.id] || {}).reduce((a, b) => a + b, 0) + score;
        const avg = sum / 3;
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

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 px-4">
      {view === 'intro' && (
        <div className="text-center space-y-8 py-10">
          <h2 className="text-4xl md:text-6xl font-serif text-white italic">Mapa do Instinto Soterrado™</h2>
          <Button onClick={() => setView('perguntas')} className="bg-gold text-midnight px-12 py-6 rounded-full font-bold">Iniciar Cartografia</Button>
        </div>
      )}

      {view === 'perguntas' && (
        <Card className="bg-midnight/40 p-10 rounded-[40px] space-y-8">
          <div className="text-gold uppercase tracking-[0.3em] font-black text-[10px]">{currentT.label} — {currentE.label}</div>
          <h4 className="text-2xl font-serif text-white italic text-center">{currentT.perguntas[currentEixoIdx]}</h4>
          <div className="grid grid-cols-1 gap-4">
            {OPCOES.map((opt, i) => (
              <Button key={i} variant="ghost" onClick={() => handleSelect(opt.score)} className="h-auto py-6 px-8 text-left font-serif italic text-lg border border-white/5 bg-white/5 hover:border-gold">
                {opt.label}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {view === 'resultado' && (
        <div className="space-y-12">
          <MandalaFinal estados={estados} />
          <div className="grid gap-6">
            {TERRITORIOS.map(t => (
              <div key={t.id} className="bg-white/5 p-6 rounded-2xl">
                <h5 className="text-gold font-bold">{t.nome} — {estados[t.id]}</h5>
                <p className="text-white/60 font-serif italic">{/* Logic for devolitiva */}</p>
              </div>
            ))}
          </div>
          <Button onClick={onNext} className="w-full">Continuar Travessia</Button>
        </div>
      )}
    </div>
  );
}
