import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCamaraCases } from '@/components/treinamento/simulador/useCamaraCases';
import { TrainingCase } from '@/components/treinamento/simulador/types';
import { SimuladorClube } from '@/components/treinamento/simulador/SimuladorClube';
import { VestibuloCamara } from '@/components/clube/camara-sussurro/VestibuloCamara';
import { PaginaSussurro } from '@/components/clube/camara-sussurro/PaginaSussurro';

export default function CamaraDoSussurroPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeCase, setActiveCase] = useState<TrainingCase | null>(null);

  const { data: allCases = [] } = useCamaraCases();

  const rotaParam = searchParams.get('rota');
  const estacaoParam = searchParams.get('estacao');
  const modoParam = searchParams.get('modo');

  // Modo Experiência Simbólica: rota-dos-lobos + clareira-do-chamado
  const experienciaClareira =
    rotaParam === 'rota-dos-lobos' && estacaoParam === 'clareira-do-chamado';

  const sussurros = useMemo(() => {
    const base = allCases.filter(c => c.nivel_produto === 'clube');
    if (!experienciaClareira) return base;
    return base.filter(c => {
      const raw: any = (c as any).rawCamara || {};
      const haystack = [
        raw.categoria, raw.rota_slug, raw.estacao_slug, raw.modo,
        raw.tag, raw.tags, c.tema, c.title,
      ].filter(Boolean).join(' ').toLowerCase();
      return (
        haystack.includes('clareira-do-chamado') ||
        haystack.includes('clareira do chamado') ||
        modoParam === 'aprofundamento'
      );
    });
  }, [allCases, experienciaClareira, modoParam]);

  // Modo legado (simulador) — preserva rota antiga
  if (activeCase && !experienciaClareira) {
    return (
      <div className="min-h-screen bg-background">
        <SimuladorClube caso={activeCase} onExit={() => setActiveCase(null)} />
      </div>
    );
  }

  // Experiência simbólica imersiva
  if (activeCase) {
    return <PaginaSussurro caso={activeCase} onBack={() => setActiveCase(null)} />;
  }

  return (
    <VestibuloCamara
      sussurros={sussurros}
      onSelect={setActiveCase}
      onBack={() => navigate(-1)}
    />
  );
}
