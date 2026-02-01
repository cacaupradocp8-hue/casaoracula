import { motion } from "framer-motion";

// Section Components
import { HeroFormacao } from "@/components/formacao-page/HeroFormacao";
import { AvisoHonestoSection } from "@/components/formacao-page/AvisoHonestoSection";
import { OQueESection } from "@/components/formacao-page/OQueESection";
import { ComoFuncionaSection } from "@/components/formacao-page/ComoFuncionaSection";
import { TravessiasSection } from "@/components/formacao-page/TravessiasSection";
import { NarroterapiaSection } from "@/components/formacao-page/NarroterapiaSection";
import { CirculoOracularSection } from "@/components/formacao-page/CirculoOracularSection";
import { FerramentasSection } from "@/components/formacao-page/FerramentasSection";
import { EticaSection } from "@/components/formacao-page/EticaSection";
import { ParaQuemSection } from "@/components/formacao-page/ParaQuemSection";
import { ChamadoFinalSection } from "@/components/formacao-page/ChamadoFinalSection";
import { FormacaoFooter } from "@/components/formacao-page/FormacaoFooter";
import { FormacaoDivider } from "@/components/formacao-page/FormacaoDivider";

/**
 * FORMAÇÃO ORÁCULA — Página de Apresentação High-Ticket
 * 
 * DNA Visual:
 * - Deep black background (0E1A24 base)
 * - Gold accents (C9A45C)
 * - Serif typography (Cormorant Garamond)
 * - Contemplative, ritualistic mood
 */
export default function FormacaoPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground overflow-x-hidden selection:bg-gold/20">
      {/* Hero Section */}
      <HeroFormacao />

      <FormacaoDivider symbol="☽" />

      {/* Aviso Honesto */}
      <AvisoHonestoSection />

      <FormacaoDivider symbol="🜂" />

      {/* O que é */}
      <OQueESection />

      <FormacaoDivider symbol="✦" />

      {/* Como Funciona */}
      <ComoFuncionaSection />

      <FormacaoDivider symbol="🜃" />

      {/* As Travessias */}
      <TravessiasSection />

      <FormacaoDivider symbol="🜁" />

      {/* Portal da Narroterapia */}
      <NarroterapiaSection />

      <FormacaoDivider symbol="🜄" />

      {/* Círculo Oracular */}
      <CirculoOracularSection />

      <FormacaoDivider symbol="✦" />

      {/* Ferramentas */}
      <FerramentasSection />

      <FormacaoDivider symbol="🛡️" />

      {/* Ética e Avaliação */}
      <EticaSection />

      <FormacaoDivider symbol="🜂" />

      {/* Para quem é / não é */}
      <ParaQuemSection />

      <FormacaoDivider symbol="🌑" />

      {/* Chamado Final */}
      <ChamadoFinalSection />

      {/* Footer */}
      <FormacaoFooter />
    </div>
  );
}
