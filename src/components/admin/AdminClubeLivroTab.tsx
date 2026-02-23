// ============================================
// ADMIN TAB - CLUBE DO LIVRO ORACULAR (Reset v2026)
// Estação → Jornada → Portal → 8 Blocos
// ============================================

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  BookOpen, ChevronDown, ChevronUp, Lightbulb, Brain, User,
  Briefcase, Flower2, Sword, FlaskConical, Save
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ESTACAO_PILOTO, JORNADAS, PORTAIS, getPortaisByJornada,
  type Portal, type PortalConteudo
} from '@/data/clubeLivroData';

const BLOCOS_META: { key: keyof PortalConteudo; label: string; icon: React.ElementType }[] = [
  { key: 'textoSimbolico', label: 'Texto Simbólico', icon: Lightbulb },
  { key: 'essencia8020', label: 'Essência 80/20', icon: FlaskConical },
  { key: 'raizPsiquica', label: 'Raiz Psíquica', icon: Brain },
  { key: 'aplicacaoPessoal', label: 'Aplicação Pessoal', icon: User },
  { key: 'aplicacaoProfissional', label: 'Aplicação Profissional', icon: Briefcase },
  { key: 'jardimPsique', label: 'Jardim da Psique', icon: Flower2 },
  { key: 'jardimHeroina', label: 'Jardim da Heroína', icon: Sword },
  { key: 'laboratorio8020', label: 'Laboratório 80/20', icon: FlaskConical },
];

function PortalEditor({ portal }: { portal: Portal }) {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border-l-4 border-l-primary/30">
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg">{portal.icone}</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{portal.nome}</p>
              <p className="text-xs text-muted-foreground">{portal.subtitulo}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>

        {expanded && (
          <div className="mt-4 space-y-4 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground italic">
              ⚠ Os conteúdos estão no arquivo de dados estáticos (frontend).
              Quando a camada de banco for ativada, esses campos serão editáveis aqui.
            </p>

            {BLOCOS_META.map(({ key, label, icon: Icon }) => (
              <div key={key}>
                <Label className="text-xs flex items-center gap-1 mb-1">
                  <Icon className="w-3 h-3" />
                  {label}
                </Label>
                <div className="p-3 rounded-md bg-muted/50 border border-border">
                  <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {portal.conteudo[key]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function AdminClubeLivroTab() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Clube do Livro Oracular
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Reset v2026 — Estação Piloto com estrutura linear.
        </p>
      </div>

      {/* Estação */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="text-lg">{ESTACAO_PILOTO.faseLunar}</span>
            {ESTACAO_PILOTO.nome}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span>{ESTACAO_PILOTO.livroTitulo} — {ESTACAO_PILOTO.livroAutor}</span>
          </div>
          <p className="text-xs text-muted-foreground">{ESTACAO_PILOTO.descricao}</p>
        </CardContent>
      </Card>

      {/* Jornadas → Portais */}
      {JORNADAS.map((jornada) => {
        const portais = getPortaisByJornada(jornada.slug);
        return (
          <div key={jornada.slug} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{jornada.icone}</span>
              <div>
                <h3 className="text-sm font-bold text-foreground">{jornada.nome}</h3>
                <p className="text-xs text-muted-foreground">{jornada.subtitulo}</p>
              </div>
            </div>

            <div className="space-y-2 ml-4 border-l-2 border-border pl-4">
              {portais.map((portal) => (
                <PortalEditor key={portal.slug} portal={portal} />
              ))}
            </div>
          </div>
        );
      })}

      <Separator />
      <p className="text-xs text-muted-foreground text-center">
        Próximo passo: migrar conteúdo para banco de dados e ativar edição inline com editor rico.
      </p>
    </div>
  );
}
