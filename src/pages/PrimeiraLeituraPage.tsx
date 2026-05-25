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
    else if (currentStep === 'case') setCurrentStep('q1');
    else if (currentStep === 'q1') setCurrentStep('q2');
    else if (currentStep === 'q2') setCurrentStep('result');
    else if (currentStep === 'result') setCurrentStep('paths');
  };

  const handleResponse = (questionId: 'q1' | 'q2', value: string) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
    handleNextStep();
  };

  // Lógica de resultado simbólico (frontend-only) baseada no planejamento
  const getResultType = (): 'visao' | 'raiz' | 'teia' | 'sombras' => {
    const val = responses.q1 || '';
    if (val === 'action') return 'visao';
    if (val === 'observation') return 'raiz';
    if (val === 'thought') return 'teia';
    return 'sombras';
  };

  return (
    <AppLayout>
      <div className="min-h-[calc(100vh-4rem)] bg-background flex flex-col items-center justify-center py-10">
        <AnimatePresence mode="wait">
          {currentStep === 'intro' && (
            <LimiarIntro key="intro" onNext={handleNextStep} />
          )}

          {currentStep === 'case' && (
            <CasePresentation key="case" onNext={handleNextStep} />
          )}

          {currentStep === 'q1' && (
            <QuestionStep
              key="q1"
              currentIndex={1}
              totalSteps={2}
              question="Ao observar o redemoinho dentro da bússola, qual seu primeiro impulso?"
              description="A reação instintiva é a porta da intuição."
              options={[
                { label: "Quero entender como funciona", value: "thought", description: "O mecanismo por trás do brilho." },
                { label: "Sinto vontade de segurá-la firme", value: "observation", description: "Sentir o peso e a textura." },
                { label: "Espero que ela me aponte uma direção logo", value: "action", description: "O movimento em direção ao futuro." },
                { label: "Deixo-me hipnotizar pela luz", value: "feeling", description: "O mergulho na experiência pura." }
              ]}
              onSelect={(val) => handleResponse('q1', val)}
            />
          )}

          {currentStep === 'q2' && (
            <QuestionStep
              key="q2"
              currentIndex={2}
              totalSteps={2}
              question="Se a bússola pudesse falar agora, qual voz ela teria?"
              description="O símbolo ressoa em diferentes frequências."
              options={[
                { label: "Uma voz antiga e rouca", value: "ancestral", description: "Como o som de pedras rolando." },
                { label: "Um sussurro cristalino", value: "clear", description: "Como o vento em uma caverna de gelo." },
                { label: "Um som rítmico, como batida de coração", value: "vital", description: "Uma presença pulsante e quente." },
                { label: "O silêncio absoluto", value: "void", description: "Uma voz que se ouve com a pele." }
              ]}
              onSelect={(val) => handleResponse('q2', val)}
            />
          )}

          {currentStep === 'result' && (
            <div key="result-wrapper" className="flex flex-col items-center space-y-8 w-full">
              <ResultCard type={getResultType()} />
              <div className="animate-bounce mt-8">
                <button 
                  onClick={handleNextStep}
                  className="text-amber-500 font-medium flex flex-col items-center gap-2"
                >
                  <span className="text-sm uppercase tracking-widest">Cruzar o Limiar</span>
                  <div className="w-px h-12 bg-gradient-to-b from-amber-500 to-transparent" />
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
