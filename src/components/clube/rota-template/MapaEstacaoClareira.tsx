import React from 'react';
import { motion } from 'framer-motion';
import { DoorOpen, Building2, Compass, BookOpen, Sparkles } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

/**
 * Mapa simbólico da Estação 1 — Clareira do Chamado.
 * Renderizado SOMENTE no slug `clareira-do-chamado`, ABAIXO de EstacaoStepEntrada.
 * Não substitui nenhum conteúdo já validado.
 */
export const MapaEstacaoClareira: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="max-w-3xl mx-auto px-4 pb-12 md:pb-20"
      aria-labelledby="mapa-clareira"
    >
      {/* Primeiro plano: Pergunta-mãe + Conto */}
      <div className="border border-gold/20 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent p-6 md:p-10 space-y-8 md:space-y-10">
        <div className="text-center space-y-2">
          <p
            id="mapa-clareira"
            className="text-[10px] md:text-xs text-gold uppercase tracking-[0.4em] font-bold"
          >
            Mapa da Estação
          </p>
          <p className="text-white/60 font-cormorant italic text-base md:text-lg">
            A vida que ainda chama por baixo do funcionamento.
          </p>
        </div>

        {/* Pergunta-mãe — destaque central */}
        <div className="text-center space-y-3 py-4 md:py-6">
          <Sparkles className="w-5 h-5 text-gold/60 mx-auto" aria-hidden="true" />
          <p className="text-[10px] text-gold/70 uppercase tracking-[0.3em] font-bold">
            Pergunta-mãe
          </p>
          <p className="text-white font-display text-2xl md:text-4xl leading-tight px-2">
            "O que em mim ainda dá sinal de vida?"
          </p>
        </div>

        {/* Conto Central */}
        <div className="flex items-center justify-center gap-3 text-white/80">
          <BookOpen className="w-4 h-4 text-gold/70 shrink-0" aria-hidden="true" />
          <p className="text-sm md:text-base">
            <span className="text-gold/70 uppercase tracking-[0.25em] text-[10px] md:text-xs font-bold mr-2">
              Conto Central
            </span>
            <span className="font-cormorant italic text-lg md:text-xl">La Loba</span>
          </p>
        </div>
      </div>

      {/* Segundo plano: detalhes em accordion */}
      <div className="mt-6 md:mt-8">
        <Accordion type="single" collapsible className="space-y-3">
          <AccordionItem
            value="elementos"
            className="border border-white/10 rounded-xl px-4 md:px-6 bg-white/[0.02]"
          >
            <AccordionTrigger className="text-white/85 hover:no-underline text-sm md:text-base font-bold uppercase tracking-[0.2em]">
              Elementos Estruturais
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="flex gap-3 items-start">
                <DoorOpen className="w-4 h-4 text-gold mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[10px] text-gold/70 uppercase tracking-[0.3em] font-bold">Porta</p>
                  <p className="text-white/80 font-cormorant text-base md:text-lg">
                    Retorno à Referência Interna
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <Building2 className="w-4 h-4 text-gold mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[10px] text-gold/70 uppercase tracking-[0.3em] font-bold">Torre</p>
                  <p className="text-white/80 font-cormorant text-base md:text-lg">
                    Sobrevivência Funcional
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <Compass className="w-4 h-4 text-gold mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[10px] text-gold/70 uppercase tracking-[0.3em] font-bold">Labirinto</p>
                  <p className="text-white/80 font-cormorant text-base md:text-lg leading-relaxed">
                    funcionar → desconectar → esvaziar → continuar funcionando
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="campo"
            className="border border-white/10 rounded-xl px-4 md:px-6 bg-white/[0.02]"
          >
            <AccordionTrigger className="text-white/85 hover:no-underline text-sm md:text-base font-bold uppercase tracking-[0.2em]">
              Campo de Leitura
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-white/80 font-cormorant italic text-base md:text-lg pt-2">
                Vitalidade soterrada.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </motion.section>
  );
};

export default MapaEstacaoClareira;
