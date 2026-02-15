import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface BlocoProps {
  titulo: string;
  children: React.ReactNode;
  ctaTexto: string;
  onCtaClick: () => void;
}

function Bloco({ titulo, children, ctaTexto, onCtaClick }: BlocoProps) {
  return (
    <section className="max-w-2xl mx-auto px-6 py-16 md:py-24 text-center space-y-6">
      <h2 className="font-display text-xl md:text-2xl text-[hsl(40,10%,18%)] tracking-wide font-medium">
        {titulo}
      </h2>
      <div className="text-[hsl(40,10%,38%)] text-sm md:text-base leading-[2] max-w-lg mx-auto">
        {children}
      </div>
      <div className="pt-2">
        <Button
          variant="outline"
          onClick={onCtaClick}
          className="border-[hsl(40,15%,70%)] text-[hsl(40,10%,30%)] hover:bg-[hsl(40,20%,92%)] hover:border-[hsl(40,15%,55%)] font-medium tracking-wide gap-2 text-sm"
        >
          {ctaTexto}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </section>
  );
}

function Divisor() {
  return <div className="max-w-[60px] mx-auto h-px bg-[hsl(40,15%,80%)]" />;
}

interface VitrineBlocosProps {
  onNavigate: (path: string) => void;
}

export function VitrineBlocos({ onNavigate }: VitrineBlocosProps) {
  return (
    <div className="bg-[hsl(40,25%,97%)]">
      {/* Sobre */}
      <Bloco
        titulo="A Formação Oracular"
        ctaTexto="Conhecer a Estrutura"
        onCtaClick={() => onNavigate("/formacao-oracula")}
      >
        <p>Aprender a ler o campo.</p>
        <p>Organizar narrativas.</p>
        <p>Sustentar travessias.</p>
        <p>Aplicar o símbolo com estrutura.</p>
      </Bloco>

      <Divisor />

      {/* Diferencial */}
      <Bloco
        titulo="O Diferencial da Casa Orácula"
        ctaTexto="Entender o Método"
        onCtaClick={() => onNavigate("/formacao-oracula")}
      >
        <p>Aqui não aceleramos processos.</p>
        <p>Não prometemos transformação instantânea.</p>
        <p>Não romantizamos sofrimento.</p>
        <p className="mt-4 text-[hsl(40,10%,28%)] font-medium">
          Formamos facilitadoras com leitura ética e organização narrativa.
        </p>
      </Bloco>

      <Divisor />

      {/* Para quem é */}
      <Bloco
        titulo="Para quem é esta Formação?"
        ctaTexto="Ver se é para mim"
        onCtaClick={() => onNavigate("/formacao-oracula")}
      >
        <div className="space-y-1.5">
          <p>Psicólogas</p>
          <p>Terapeutas</p>
          <p>Facilitadoras de mulheres</p>
          <p>Mentoras que desejam estrutura simbólica real</p>
        </div>
      </Bloco>
    </div>
  );
}
