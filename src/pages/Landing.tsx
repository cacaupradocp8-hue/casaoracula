import { HeroSection } from '@/components/landing/HeroSection';
import { RupturaSection } from '@/components/landing/RupturaSection';
import { CertificacaoSection } from '@/components/landing/CertificacaoSection';
import { EstruturaSection } from '@/components/landing/EstruturaSection';
import { MetodologiaSection } from '@/components/landing/MetodologiaSection';
import { FerramentasSection } from '@/components/landing/FerramentasSection';
import { CasaMaquinasSection } from '@/components/landing/CasaMaquinasSection';
import { ClubeLeituraSection } from '@/components/landing/ClubeLeituraSection';
import { ParaQuemSection } from '@/components/landing/ParaQuemSection';
import { InvestimentoSection } from '@/components/landing/InvestimentoSection';
import { ProcessoEntradaSection } from '@/components/landing/ProcessoEntradaSection';
import { CtaFinalSection } from '@/components/landing/CtaFinalSection';

export default function Landing() {
  return (
    <div className="bg-background">
      <HeroSection />
      <RupturaSection />
      <CertificacaoSection />
      <EstruturaSection />
      <MetodologiaSection />
      <FerramentasSection />
      <CasaMaquinasSection />
      <ClubeLeituraSection />
      <ParaQuemSection />
      <InvestimentoSection />
      <ProcessoEntradaSection />
      <CtaFinalSection />
    </div>
  );
}
