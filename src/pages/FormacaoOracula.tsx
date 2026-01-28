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

/**
 * FORMAÇÃO ORÁCULA — Arquitetura Viva
 * 
 * Ultra-minimalist, contemplative sales page designed as a 
 * Living Architecture experience, not a traditional landing page.
 * 
 * Three symbolic principles organize the experience:
 * 🜂 PORTAS — Where the psyche is (thresholds, internal moments)
 * 🌑 LABIRINTOS — How the psyche moves (process, intelligent complexity)
 * 🜁 TORRES — Why the form exists (structure, sustenance, dignity)
 */
export default function FormacaoOracula() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* 
        PORTAL — Entry point
        Fundo escuro. Movimento mínimo. Respiração.
      */}
      <SectionPortal />

      <ArchitectureDivider type="labirinto" />

      {/* 
        SILÊNCIO — Breathing space
        "Algumas travessias só começam quando ninguém está tentando convencer você."
      */}
      <SectionSilencio />

      <ArchitectureDivider type="porta" />

      {/* 
        ORIGEM — The birth of this formation
        Responsibility, not improvisation.
      */}
      <SectionOrigem />

      <ArchitectureDivider type="labirinto" />

      {/* 
        ESPELHO — Recognition
        You feel before you speak. You perceive when something opens.
      */}
      <SectionEspelho />

      <ArchitectureDivider type="porta" />

      {/* 
        A VIRADA — The turn
        What exhausts is not depth. It's sustaining it without territory.
      */}
      <SectionVirada />

      <ArchitectureDivider type="torre" />

      {/* 
        O MÉTODO — Architecture
        PORTAS, LABIRINTOS, TORRES
      */}
      <SectionMetodo />

      <ArchitectureDivider type="porta" />

      {/* 
        POSTURA — The center is not the tool
        Knowing when to speak. When to silence. When to sustain.
      */}
      <SectionPostura />

      <ArchitectureDivider type="labirinto" />

      {/* 
        NARROTERAPIA — Narrative with rigor
        Here, narrative doesn't inspire. It structures.
      */}
      <SectionNarroterapia />

      <ArchitectureDivider type="porta" />

      {/* 
        FUNDAMENTAÇÃO — Foundations
        Analytical Psychology, Narrative Psychology, Myth & Symbolic Cognition
      */}
      <SectionFundamentacao />

      <ArchitectureDivider type="labirinto" />

      {/* 
        APLICABILIDADE — What you learn
        Lead sessions, use narratives as structure, sustain depth with ethics
      */}
      <SectionAplicabilidade />

      <ArchitectureDivider type="porta" />

      {/* 
        OS CAMINHOS — The paths
        FORMAÇÃO, ASSINATURA, PORTAL ESSENCIAL
      */}
      <SectionCaminhos />

      <ArchitectureDivider type="labirinto" />

      {/* 
        FECHAMENTO — Closing
        The value is not in access. It's in the responsibility of who crosses.
      */}
      <SectionFechamento />

      {/* 
        Ethical Footer
        Required disclaimer
      */}
      <EthicalFooter />
    </div>
  );
}
