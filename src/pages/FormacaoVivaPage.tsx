import { motion } from "framer-motion";
import {
  SectionPortal,
  SectionSilencio,
  SectionOrigem,
  SectionEspelho,
  SectionVirada,
  SectionMetodo,
  SectionPostura,
  SectionNarroterapia,
  SectionFundamentacao,
  SectionAplicabilidade,
  SectionCaminhos,
  SectionFechamento,
  ArchitectureDivider,
  EthicalFooter
} from "@/components/formacao-viva";
import { SectionVerdadeFinal } from "@/components/formacao-viva/SectionVerdadeFinal";

/**
 * FORMAÇÃO ORÁCULA — Arquitetura Viva
 * 
 * Sales page designed as Living Architecture experience.
 * Three symbolic principles organize the experience:
 * 🜂 PORTAS — Where the psyche is (thresholds)
 * 🌑 LABIRINTOS — How the psyche moves (process)
 * 🜁 TORRES — Why the form exists (structure)
 */
export default function FormacaoVivaPage() {
  return (
    <div className="min-h-screen bg-[hsl(220,20%,6%)] text-foreground overflow-x-hidden selection:bg-gold/20">
      {/* PORTAL — Entry */}
      <SectionPortal />

      <ArchitectureDivider type="labirinto" />

      {/* SILÊNCIO — Breathing space */}
      <SectionSilencio />

      <ArchitectureDivider type="porta" />

      {/* ORIGEM — Birth of formation */}
      <SectionOrigem />

      <ArchitectureDivider type="labirinto" />

      {/* ESPELHO — Recognition */}
      <SectionEspelho />

      <ArchitectureDivider type="porta" />

      {/* A VIRADA — The turn */}
      <SectionVirada />

      <ArchitectureDivider type="torre" />

      {/* O MÉTODO — Architecture */}
      <SectionMetodo />

      <ArchitectureDivider type="porta" />

      {/* POSTURA — Center is not the tool */}
      <SectionPostura />

      <ArchitectureDivider type="labirinto" />

      {/* NARROTERAPIA — Narrative with rigor */}
      <SectionNarroterapia />

      <ArchitectureDivider type="porta" />

      {/* FUNDAMENTAÇÃO — Foundations */}
      <SectionFundamentacao />

      <ArchitectureDivider type="labirinto" />

      {/* APLICABILIDADE — What you learn */}
      <SectionAplicabilidade />

      <ArchitectureDivider type="porta" />

      {/* OS CAMINHOS — The paths */}
      <SectionCaminhos />

      <ArchitectureDivider type="labirinto" />

      {/* FECHAMENTO — Closing */}
      <SectionFechamento />

      <ArchitectureDivider type="torre" />

      {/* VERDADE FINAL — Final truth */}
      <SectionVerdadeFinal />

      {/* Ethical Footer */}
      <EthicalFooter />
    </div>
  );
}
