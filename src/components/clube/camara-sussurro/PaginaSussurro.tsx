import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RegistrarRastro } from './RegistrarRastro';
import type { TrainingCase } from '@/components/treinamento/simulador/types';

interface Props {
  caso: TrainingCase;
  onBack: () => void;
}

export function PaginaSussurro({ caso, onBack }: Props) {
  const raw: any = (caso as any).rawCamara || {};
  const contexto = raw.contexto || caso.tema;
  const falaInicial = raw.fala_inicial;
  const perguntaEscuta = raw.pergunta_escuta || raw.pergunta_ideal;
  const campoSimbolico = raw.campo_simbolico || raw.leitura_simbolica || caso.hipotese_esperada;
  const erroComum = raw.erro_comum || caso.erro_comum;
  const chaveClareira = raw.chave_clareira || raw.resposta_correta || caso.hipotese_esperada;
  const explicacao = raw.explicacao_leve || raw.explicacao_simples;

  const [revelarChave, setRevelarChave] = useState(false);
  const [registrar, setRegistrar] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0807] text-foreground relative overflow-hidden">
      {/* Camada papel/atlas */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(180,130,60,0.08),transparent_60%)] pointer-events-none" />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(251,191,36,0.04),transparent_70%)] pointer-events-none"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative max-w-2xl mx-auto px-6 py-10 space-y-16">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-amber-200/60 hover:text-amber-100 hover:bg-transparent -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar à Câmara
        </Button>

        {!registrar ? (
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-14"
          >
            {/* Título */}
            <header className="text-center space-y-3">
              <p className="text-[10px] tracking-[0.5em] uppercase text-amber-200/40">Sussurro</p>
              <h1 className="font-display text-4xl md:text-5xl italic text-amber-100/90 leading-tight">
                {caso.title}
              </h1>
            </header>

            {/* Contexto */}
            {contexto && (
              <section className="text-foreground/70 font-body leading-relaxed text-base text-center max-w-xl mx-auto">
                {contexto}
              </section>
            )}

            {/* Fala Inicial */}
            {falaInicial && (
              <motion.blockquote
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1.2 }}
                className="text-center px-4 py-10 border-y border-amber-200/10"
              >
                <p className="font-display italic text-2xl md:text-3xl text-amber-100/80 leading-relaxed">
                  "{falaInicial}"
                </p>
              </motion.blockquote>
            )}

            {/* Pergunta de Escuta — centro da experiência */}
            {perguntaEscuta && (
              <motion.section
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="py-20 text-center"
              >
                <p className="text-[10px] tracking-[0.5em] uppercase text-amber-200/40 mb-6">Pergunta de Escuta</p>
                <p className="font-display text-3xl md:text-4xl text-amber-200/90 italic leading-snug">
                  {perguntaEscuta}
                </p>
              </motion.section>
            )}

            {/* Campo Simbólico */}
            {campoSimbolico && (
              <section className="space-y-3">
                <p className="text-[10px] tracking-[0.5em] uppercase text-amber-200/40">Campo Simbólico</p>
                <p className="text-foreground/75 leading-relaxed font-body">{campoSimbolico}</p>
              </section>
            )}

            {/* Erro Comum */}
            {erroComum && (
              <section className="space-y-3 border-l-2 border-amber-700/30 pl-6">
                <div className="flex items-center gap-2 text-amber-200/50">
                  <Eye className="w-3.5 h-3.5" />
                  <p className="text-[10px] tracking-[0.5em] uppercase">O que costuma passar despercebido</p>
                </div>
                <p className="text-foreground/60 italic leading-relaxed font-body">{erroComum}</p>
              </section>
            )}

            {/* Chave da Clareira — gesto */}
            {chaveClareira && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-amber-200/60">
                  <KeyRound className="w-3.5 h-3.5" />
                  <p className="text-[10px] tracking-[0.5em] uppercase">Chave da Clareira</p>
                </div>
                <AnimatePresence mode="wait">
                  {!revelarChave ? (
                    <motion.button
                      key="locked"
                      exit={{ opacity: 0 }}
                      onClick={() => setRevelarChave(true)}
                      className="w-full py-10 border border-dashed border-amber-200/20 hover:border-amber-200/50 hover:bg-amber-200/[0.02] transition-all italic text-amber-200/40 hover:text-amber-100"
                    >
                      Tocar para revelar
                    </motion.button>
                  ) : (
                    <motion.div
                      key="revealed"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1 }}
                      className="space-y-4"
                    >
                      <p className="font-display text-xl italic text-amber-100/90 leading-relaxed">
                        {chaveClareira}
                      </p>
                      {explicacao && (
                        <p className="text-sm text-foreground/55 font-body leading-relaxed">
                          {explicacao}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            )}

            {/* Registrar Rastro */}
            <div className="pt-10 text-center">
              <Button
                onClick={() => setRegistrar(true)}
                className="bg-transparent border border-amber-300/40 hover:bg-amber-200/5 text-amber-100/90 font-display tracking-[0.3em] uppercase text-xs px-10 py-7 rounded-none"
              >
                Registrar Rastro
              </Button>
            </div>
          </motion.article>
        ) : (
          <RegistrarRastro caso={caso} onDone={onBack} />
        )}
      </div>
    </div>
  );
}
