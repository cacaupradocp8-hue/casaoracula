// ============================================
// ADMIN TAB - CLUBE DO LIVRO ORACULAR
// Estação → Jornada → Portal → Editor Rico
// ============================================

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import {
  BookOpen, ChevronDown, ChevronUp, Lightbulb, Brain, User,
  Briefcase, Flower2, Sword, FlaskConical, Save, Loader2
} from 'lucide-react';
import { useEstacoes } from '@/hooks/useEstacoes';
import { useAllPortais, useUpdatePortal, type ClubePortal } from '@/hooks/useClubeLivro';

const BLOCOS_META: { key: keyof Pick<ClubePortal, 'texto_simbolico' | 'essencia_8020' | 'raiz_psiquica' | 'aplicacao_pessoal' | 'aplicacao_profissional' | 'jardim_psique' | 'jardim_heroina' | 'laboratorio_8020'>; label: string; icon: React.ElementType }[] = [
  { key: 'texto_simbolico', label: 'Texto Simbólico', icon: Lightbulb },
  { key: 'essencia_8020', label: 'Essência 80/20', icon: FlaskConical },
  { key: 'raiz_psiquica', label: 'Raiz Psíquica', icon: Brain },
  { key: 'aplicacao_pessoal', label: 'Aplicação Pessoal', icon: User },
  { key: 'aplicacao_profissional', label: 'Aplicação Profissional', icon: Briefcase },
  { key: 'jardim_psique', label: 'Jardim da Psique', icon: Flower2 },
  { key: 'jardim_heroina', label: 'Jardim da Heroína', icon: Sword },
  { key: 'laboratorio_8020', label: 'Laboratório 80/20', icon: FlaskConical },
];

function PortalEditor({ portal }: { portal: ClubePortal }) {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState<Partial<ClubePortal>>({});
  const updatePortal = useUpdatePortal();

  const getValue = (key: string) => {
    return (draft as any)[key] ?? (portal as any)[key] ?? '';
  };

  const handleChange = (key: string, value: string) => {
    setDraft(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (Object.keys(draft).length === 0) return;
    try {
      await updatePortal.mutateAsync({ id: portal.id, ...draft });
      setDraft({});
      toast({ title: 'Salvo', description: `Portal "${portal.nome}" atualizado.` });
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    }
  };

  const hasDraft = Object.keys(draft).length > 0;

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
          <div className="flex items-center gap-1">
            {hasDraft && (
              <Button size="sm" onClick={handleSave} disabled={updatePortal.isPending} className="gap-1">
                {updatePortal.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                Salvar
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 space-y-4 border-t border-border pt-4">
            {BLOCOS_META.map(({ key, label, icon: Icon }) => (
              <div key={key}>
                <Label className="text-xs flex items-center gap-1 mb-1">
                  <Icon className="w-3 h-3" />
                  {label}
                </Label>
                <RichTextEditor
                  content={getValue(key)}
                  onChange={(html) => handleChange(key, html)}
                  placeholder={`${label}...`}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function AdminClubeLivroTab() {
  const { data: estacoes, isLoading: loadingEstacoes } = useEstacoes();
  const estacaoI = estacoes?.find(e => e.numero === 1);
  const { data: allData, isLoading: loadingPortais } = useAllPortais(estacaoI?.id);

  if (loadingEstacoes || loadingPortais) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!estacaoI || !allData) {
    return <p className="text-sm text-muted-foreground py-8 text-center">Nenhuma estação encontrada.</p>;
  }

  const { jornadas, portais } = allData;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Clube do Livro Oracular
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Edição de conteúdo — Estação I
        </p>
      </div>

      {/* Estação */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="text-lg">{estacaoI.fase_lunar}</span>
            {estacaoI.titulo}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span>{estacaoI.livro_titulo} — {estacaoI.livro_autor}</span>
          </div>
        </CardContent>
      </Card>

      {/* Jornadas → Portais */}
      {jornadas.map((jornada) => {
        const jornadaPortais = portais.filter(p => p.jornada_id === jornada.id);
        return (
          <div key={jornada.id} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{jornada.icone}</span>
              <div>
                <h3 className="text-sm font-bold text-foreground">{jornada.nome}</h3>
                <p className="text-xs text-muted-foreground">{jornada.subtitulo}</p>
              </div>
            </div>
            <div className="space-y-2 ml-4 border-l-2 border-border pl-4">
              {jornadaPortais.map((portal) => (
                <PortalEditor key={portal.id} portal={portal} />
              ))}
            </div>
          </div>
        );
      })}

      <Separator />
      <p className="text-xs text-muted-foreground text-center">
        Use o editor rico para formatar os conteúdos de cada portal.
      </p>
    </div>
  );
}
