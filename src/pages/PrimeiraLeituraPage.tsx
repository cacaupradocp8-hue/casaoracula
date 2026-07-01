import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AnimatePresence } from 'framer-motion';
import { LimiarIntro } from '@/components/primeira-leitura/LimiarIntro';
import { CasePresentation } from '@/components/primeira-leitura/CasePresentation';
import { ResultCard } from '@/components/primeira-leitura/ResultCard';
import { PathSelector } from '@/components/primeira-leitura/PathSelector';
import { AprofundamentoStep } from '@/components/primeira-leitura/AprofundamentoStep';
import { FechamentoLentes } from '@/components/primeira-leitura/FechamentoLentes';
import { ElectricWaves } from '@/components/visitor/ElectricWaves';

type Step = 'intro' | 'case' | 'aprofundamento' | 'result' | 'fechamento' | 'paths';

const PrimeiraLeituraPage = () => {
  const [currentStep, setCurrentStep] = useState<Step>('intro');
  const [selectedEscuta, setSelectedEscuta] = useState<string | null>(null);

  const handleCaseChoice = (escutaId: string) => {
    setSelectedEscuta(escutaId);
    try { localStorage.setItem('primeira_leitura_result', escutaId); } catch {}
    setCurrentStep('aprofundamento');
  };

  const getResultType = () => selectedEscuta || 'padrao-relacional';

  return (
    <AppLayout>
      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-10 pb-32 md:pb-16 overflow-hidden" style={{ background: 'radial-gradient(ellipse at center, #0a1428 0%, #050a16 60%, #02050d 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <ElectricWaves />
        </div>
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(2,8,24,0.85)_100%)]" />
        <div className="relative z-10 w-full flex flex-col items-center">
        <AnimatePresence mode="wait">
          {currentStep === 'intro' && (
            <LimiarIntro key="intro" onNext={() => setCurrentStep('case')} />
          )}

          {currentStep === 'case' && (
            <CasePresentation key="case" onNext={handleCaseChoice} />
          )}

          {currentStep === 'aprofundamento' && (
            <AprofundamentoStep key="aprofundamento" onContinue={() => setCurrentStep('result')} />
          )}

          {currentStep === 'result' && (
            <div key="result-wrapper" className="flex flex-col items-center space-y-8 w-full">
              <ResultCard type={getResultType() as any} />
              <div className="animate-bounce mt-8">
                <button
                  onClick={() => setCurrentStep('fechamento')}
                  className="text-primary font-medium flex flex-col items-center gap-2 group"
                >
                  <span className="text-sm uppercase tracking-widest font-display group-hover:tracking-[0.2em] transition-all">Começar minha Travessia</span>
                  <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 'fechamento' && (
            <FechamentoLentes key="fechamento" onContinue={() => setCurrentStep('paths')} />
          )}

          {currentStep === 'paths' && (
            <PathSelector key="paths" />
          )}
        </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
};

export default PrimeiraLeituraPage;
