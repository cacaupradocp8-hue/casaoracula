import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AnimatePresence } from 'framer-motion';
import { LimiarIntro } from '@/components/primeira-leitura/LimiarIntro';
import { CasePresentation } from '@/components/primeira-leitura/CasePresentation';
import { QuestionStep } from '@/components/primeira-leitura/QuestionStep';
import { ResultCard } from '@/components/primeira-leitura/ResultCard';
import { PathSelector } from '@/components/primeira-leitura/PathSelector';

type Step = 'intro' | 'case' | 'q1' | 'q2' | 'result' | 'paths';

const PrimeiraLeituraPage = () => {
  const [currentStep, setCurrentStep] = useState<Step>('intro');
  const [responses, setResponses] = useState<{ q1?: string; q2?: string }>({});

  const handleNextStep = () => {
    if (currentStep === 'intro') setCurrentStep('case');
    else if (currentStep === 'case') setCurrentStep('result');
    else if (currentStep === 'result') setCurrentStep('paths');
  };


  // Fluxo simplificado sem Quiz


  // Lógica de resultado simbólico (frontend-only) baseada no planejamento
  const getResultType = (): 'visao' => 'visao';


  return (
    <AppLayout>
      <div className="min-h-[calc(100vh-4rem)] bg-background flex flex-col items-center justify-center py-10 pb-32 md:pb-16">

        <AnimatePresence mode="wait">
          {currentStep === 'intro' && (
            <LimiarIntro key="intro" onNext={handleNextStep} />
          )}

          {currentStep === 'case' && (
            <CasePresentation key="case" onNext={handleNextStep} />
          )}


          {currentStep === 'result' && (
            <div key="result-wrapper" className="flex flex-col items-center space-y-8 w-full">
              <ResultCard type={getResultType()} />
              <div className="animate-bounce mt-8">
                <button 
                  onClick={handleNextStep}
                  className="text-primary font-medium flex flex-col items-center gap-2"
                >
                  <span className="text-sm uppercase tracking-widest">Cruzar o Limiar</span>
                  <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 'paths' && (
            <PathSelector key="paths" />
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default PrimeiraLeituraPage;
