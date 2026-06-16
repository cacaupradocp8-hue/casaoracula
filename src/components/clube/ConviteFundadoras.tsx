import React from 'react';
import { motion } from 'framer-motion';
import { Moon, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useFounderAccess } from '@/hooks/useFounderAccess';
import {
  useConviteFundadoraConfig,
  useRegisterConviteClick,
} from '@/hooks/useColheitaRastros';

interface Props {
  estacaoId: string;
  rotaId?: string | null;
  onContinue?: () => void;
}

export function ConviteFundadoras({ estacaoId, rotaId, onContinue }: Props) {
  const { isActive: isFundadora } = useFounderAccess();
  const { data: config } = useConviteFundadoraConfig(estacaoId);
  const registerClick = useRegisterConviteClick();

  if (!isFundadora || !config?.ativo) return null;

  const handleClick = () => {
    registerClick.mutate({ estacaoId, rotaId });
    if (config.link_whatsapp) {
      window.open(config.link_whatsapp, '_blank', 'noopener,noreferrer');
    }
  };

  const dataFormatada = config.data_aula_ao_vivo
    ? new Date(config.data_aula_ao_vivo).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full"
      >
        <Card className="bg-gradient-to-b from-[#1a1208]/80 to-[#020617]/90 border-gold/30 p-10 rounded-[32px] space-y-6 shadow-[0_0_60px_-10px_rgba(212,175,55,0.25)]">
          <div className="text-center space-y-3">
            <div className="mx-auto w-14 h-14 rounded-full border border-gold/40 bg-gold/5 flex items-center justify-center">
              <Moon className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-xl md:text-2xl font-serif text-white">
              {config.titulo}
            </h3>
          </div>

          <p className="text-white/70 font-serif italic whitespace-pre-line leading-relaxed text-sm text-center">
            {config.texto}
          </p>

          {(dataFormatada || config.descricao_aula) && (
            <div className="border-t border-gold/10 pt-4 space-y-2 text-center">
              {dataFormatada && (
                <div className="flex items-center justify-center gap-2 text-gold/80 text-xs uppercase tracking-widest">
                  <Calendar className="w-3.5 h-3.5" />
                  {dataFormatada}
                </div>
              )}
              {config.descricao_aula && (
                <p className="text-white/50 text-xs font-serif italic">
                  {config.descricao_aula}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <Button
              variant="gold"
              size="lg"
              onClick={handleClick}
              className="uppercase tracking-[0.2em] text-xs font-black"
            >
              {config.texto_botao}
            </Button>
            {onContinue && (
              <Button
                variant="ghost"
                onClick={onContinue}
                className="text-white/40 hover:text-white/70 text-xs"
              >
                Seguir sem entrar agora
                <ArrowRight className="ml-2 w-3 h-3" />
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
