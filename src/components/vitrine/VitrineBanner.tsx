import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface VitrineBannerProps {
  onCtaClick: () => void;
}

export function VitrineBanner({ onCtaClick }: VitrineBannerProps) {
  return (
    <section className="relative w-full bg-[hsl(40,30%,96%)] overflow-hidden">
      {/* Watermark symbol */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
        <span className="font-display text-[20rem] leading-none text-[hsl(40,20%,30%)] select-none">☽</span>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-28 md:py-36 text-center space-y-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[hsl(40,15%,45%)] font-medium">
          Casa Orácula
        </p>
        <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-[hsl(40,10%,18%)] leading-relaxed tracking-wide font-medium">
          Formação em Leitura Simbólica e Narrôterapia Aplicada
        </h1>
        <p className="text-[hsl(40,10%,40%)] text-sm md:text-base leading-relaxed max-w-lg mx-auto">
          Um método estruturado para ler campos psíquicos e organizar narrativas femininas com ética.
        </p>
        <div className="pt-4">
          <Button
            onClick={onCtaClick}
            className="bg-[hsl(40,20%,25%)] text-[hsl(40,30%,92%)] hover:bg-[hsl(40,20%,18%)] font-medium tracking-wide gap-2 px-8 py-3 text-sm"
          >
            Atravessar a Formação
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
