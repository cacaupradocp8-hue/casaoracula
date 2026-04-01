import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Leaf, BookOpen, Headphones, Sparkles, MapPin, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import type { JardimEntry, Pratica } from '@/hooks/useClienteJardimCompleto';
import type { Orientacao } from '@/hooks/useOrientacoes';
import { OrientacaoCard } from '@/components/jardim/OrientacaoCard';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const CTA_MAP: Record<string, { label: string; icon: any }> = {
  pratica: { label: 'Fazer prática', icon: BookOpen },
  escuta: { label: 'Ouvir escuta', icon: Headphones },
  reflexao: { label: 'Abrir reflexão', icon: Sparkles },
  territorio: { label: 'Ver território', icon: MapPin },
  foco_semana: { label: 'Ver foco', icon: Target },
};

interface Props {
  orientacoesPendentes: Orientacao[];
  entriesTerapeuta: JardimEntry[];
  praticasPendentes: Pratica[];
  onVerTudo: () => void;
  onCompletarOrientacao: (id: string, resposta?: string) => Promise<boolean>;
  onResponderOrientacao: (id: string, resposta: string) => Promise<boolean>;
  onMarcarVistaOrientacao: (id: string) => void;
}

export function TerapeutaDeixouBloco({
  orientacoesPendentes,
  entriesTerapeuta,
  praticasPendentes,
  onVerTudo,
  onCompletarOrientacao,
  onResponderOrientacao,
  onMarcarVistaOrientacao,
}: Props) {
  const total = orientacoesPendentes.length + entriesTerapeuta.length + praticasPendentes.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="space-y-3"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-1">
        <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center">
          <Leaf className="w-3.5 h-3.5 text-primary/70" />
        </div>
        <span className="text-sm font-display text-foreground/80">
          O que sua terapeuta deixou para você
        </span>
      </div>

      {/* Empty state */}
      {total === 0 && (
        <Card className="border-primary/10 bg-primary/5">
          <CardContent className="py-8 text-center space-y-2">
            <Leaf className="w-6 h-6 text-primary/30 mx-auto" />
            <p className="text-sm text-foreground/60">
              Sua terapeuta ainda não deixou uma nova orientação aqui.
            </p>
            <p className="text-xs text-muted-foreground/50">
              Enquanto isso, você pode cuidar do seu Jardim com uma escuta ou um registro.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      {total > 0 && (
        <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <CardContent className="p-4 space-y-3 relative">
            {/* Orientações */}
            {orientacoesPendentes.slice(0, 3).map((o) => (
              <OrientacaoCard
                key={o.id}
                orientacao={o}
                onComplete={onCompletarOrientacao}
                onRespond={onResponderOrientacao}
                onView={onMarcarVistaOrientacao}
              />
            ))}

            {/* Entries da terapeuta */}
            {entriesTerapeuta.slice(0, 2).map((e) => (
              <div key={e.id} className="rounded-xl p-4 bg-card/60 border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-[10px] border-primary/20 text-primary/70">
                    <Leaf className="w-3 h-3 mr-1" />
                    Mensagem
                  </Badge>
                  <span className="text-[10px] text-muted-foreground/50">
                    {format(new Date(e.created_at), "dd 'de' MMMM", { locale: ptBR })}
                  </span>
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed">{e.content}</p>
              </div>
            ))}

            {/* Práticas pendentes */}
            {praticasPendentes.slice(0, 2).map((p) => {
              const cta = CTA_MAP.pratica;
              return (
                <div key={p.id} className="rounded-xl p-4 bg-card/60 border border-border/15">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                      <BookOpen className="w-4 h-4 text-accent/70" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <p className="text-xs text-primary/50 font-medium">Sugerida para você</p>
                      <p className="text-sm font-medium text-foreground/80">{p.titulo}</p>
                      {p.descricao && (
                        <p className="text-xs text-muted-foreground/60 leading-relaxed">
                          {p.descricao.slice(0, 120)}
                        </p>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 text-xs h-8 border-primary/20 text-primary/80 hover:bg-primary/10 gap-1.5"
                      >
                        <cta.icon className="w-3 h-3" />
                        {cta.label}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {total > 5 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-primary/60 hover:text-primary/80 gap-1"
                onClick={onVerTudo}
              >
                Ver tudo
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
