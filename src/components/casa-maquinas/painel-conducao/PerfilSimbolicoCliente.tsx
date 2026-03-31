import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save, ChevronDown, ChevronUp, Shield, Zap, TrendingUp } from 'lucide-react';
import { useClientProfile, type PerfilEstrutural, type PerfilDinamico, type PerfilEvolutivo } from '@/hooks/useClientProfile';
import { toast } from 'sonner';

interface Props {
  clienteId: string;
  compact?: boolean;
  onDinamicoChange?: (d: PerfilDinamico) => void;
}

const ESTRUTURAL_FIELDS: { key: keyof PerfilEstrutural; label: string; placeholder: string }[] = [
  { key: 'arquitetura_psiquica', label: 'Arquitetura psíquica', placeholder: 'Como a psique desta cliente se organiza...' },
  { key: 'padroes_defesa', label: 'Padrões de defesa', placeholder: 'Mecanismos de proteção recorrentes...' },
  { key: 'padrao_relacional', label: 'Padrão relacional', placeholder: 'Como se posiciona nos vínculos...' },
  { key: 'arquetipos_predominantes', label: 'Arquétipos predominantes', placeholder: 'Forças simbólicas mais presentes...' },
  { key: 'complexos_ativos', label: 'Complexos ativos', placeholder: 'Complexos constelados atualmente...' },
  { key: 'narrativa_dominante', label: 'Narrativa dominante', placeholder: 'A história que a cliente conta de si...' },
];

const DINAMICO_FIELDS: { key: keyof PerfilDinamico; label: string; placeholder: string }[] = [
  { key: 'distrito_atual', label: 'Distrito atual', placeholder: 'Em qual distrito a cliente se encontra...' },
  { key: 'porta_campo_atual', label: 'Porta / campo atual', placeholder: 'Porta ou campo identificado...' },
  { key: 'sensacao_central', label: 'Sensação central', placeholder: 'O que a cliente sente agora...' },
  { key: 'estado_sistema', label: 'Estado do sistema', placeholder: 'Contraída, presente, fragmentada...' },
  { key: 'movimento_atual', label: 'Movimento atual', placeholder: 'Para onde a energia se direciona...' },
  { key: 'nivel_consciencia', label: 'Nível de consciência', placeholder: 'Grau de presença e auto-observação...' },
];

const EVOLUTIVO_FIELDS: { key: keyof PerfilEvolutivo; label: string; placeholder: string }[] = [
  { key: 'vetor_crescimento', label: 'Vetor de crescimento', placeholder: 'A direção natural de expansão...' },
  { key: 'travessia_ativa', label: 'Travessia ativa', placeholder: 'Qual travessia está em curso...' },
  { key: 'potencia_emergente', label: 'Potência emergente', placeholder: 'O que começa a se manifestar...' },
  { key: 'risco_atual', label: 'Risco atual', placeholder: 'Pontos de atenção clínica...' },
  { key: 'proximo_passo_simbolico', label: 'Próximo passo simbólico', placeholder: 'O que o campo pede agora...' },
];

export function PerfilSimbolicoCliente({ clienteId, compact = false, onDinamicoChange }: Props) {
  const { profile, isLoading, saving, upsertLayer, estrutural, dinamico, evolutivo } = useClientProfile(clienteId);
  const [expanded, setExpanded] = useState(!compact);
  const [editingLayer, setEditingLayer] = useState<'estrutural' | 'dinamico' | 'evolutivo' | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});

  const startEditing = (layer: 'estrutural' | 'dinamico' | 'evolutivo') => {
    const source = layer === 'estrutural' ? estrutural : layer === 'dinamico' ? dinamico : evolutivo;
    setDraft({ ...source } as Record<string, string>);
    setEditingLayer(layer);
  };

  const handleSave = async () => {
    if (!editingLayer) return;
    const ok = await upsertLayer(editingLayer, draft);
    if (ok) {
      toast.success('Perfil atualizado');
      if (editingLayer === 'dinamico' && onDinamicoChange) {
        onDinamicoChange(draft as unknown as PerfilDinamico);
      }
      setEditingLayer(null);
      setDraft({});
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="w-4 h-4 animate-spin text-primary/50" />
      </div>
    );
  }

  // Compact: resumo do perfil dinâmico
  const dynamicSummary = [
    dinamico.distrito_atual && `Distrito: ${dinamico.distrito_atual}`,
    dinamico.sensacao_central && `Sensação: ${dinamico.sensacao_central}`,
    dinamico.movimento_atual && `Movimento: ${dinamico.movimento_atual}`,
  ].filter(Boolean);

  return (
    <Card className="border-border/30 bg-card/70 mb-4">
      <CardContent className="p-3">
        {/* Header compacto com resumo dinâmico */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary/60" />
            <span className="text-xs font-semibold text-foreground">Perfil Simbólico</span>
            {dynamicSummary.length > 0 && !expanded && (
              <div className="flex gap-1 ml-2">
                {dynamicSummary.map((s, i) => (
                  <Badge key={i} variant="secondary" className="text-[9px]">{s}</Badge>
                ))}
              </div>
            )}
          </div>
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>

        {expanded && (
          <div className="mt-3">
            <p className="text-[9px] text-muted-foreground/60 italic mb-3">
              Leitura simbólica sugerida. A interpretação final pertence à terapeuta.
            </p>

            <Tabs defaultValue="dinamico" className="w-full">
              <TabsList className="bg-muted/30 border border-border/20 h-8 p-0.5 w-full">
                <TabsTrigger value="estrutural" className="text-[10px] flex-1 gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                  <Shield className="w-3 h-3" /> Estrutural
                </TabsTrigger>
                <TabsTrigger value="dinamico" className="text-[10px] flex-1 gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                  <Zap className="w-3 h-3" /> Dinâmico
                </TabsTrigger>
                <TabsTrigger value="evolutivo" className="text-[10px] flex-1 gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                  <TrendingUp className="w-3 h-3" /> Evolutivo
                </TabsTrigger>
              </TabsList>

              <TabsContent value="estrutural" className="mt-3">
                <ProfileLayerView
                  fields={ESTRUTURAL_FIELDS}
                  values={estrutural as Record<string, string>}
                  editing={editingLayer === 'estrutural'}
                  draft={draft}
                  onDraftChange={setDraft}
                  onEdit={() => startEditing('estrutural')}
                  onSave={handleSave}
                  onCancel={() => setEditingLayer(null)}
                  saving={saving}
                />
              </TabsContent>

              <TabsContent value="dinamico" className="mt-3">
                <ProfileLayerView
                  fields={DINAMICO_FIELDS}
                  values={dinamico as Record<string, string>}
                  editing={editingLayer === 'dinamico'}
                  draft={draft}
                  onDraftChange={setDraft}
                  onEdit={() => startEditing('dinamico')}
                  onSave={handleSave}
                  onCancel={() => setEditingLayer(null)}
                  saving={saving}
                />
              </TabsContent>

              <TabsContent value="evolutivo" className="mt-3">
                <ProfileLayerView
                  fields={EVOLUTIVO_FIELDS}
                  values={evolutivo as Record<string, string>}
                  editing={editingLayer === 'evolutivo'}
                  draft={draft}
                  onDraftChange={setDraft}
                  onEdit={() => startEditing('evolutivo')}
                  onSave={handleSave}
                  onCancel={() => setEditingLayer(null)}
                  saving={saving}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Sub-component for rendering a profile layer
function ProfileLayerView({
  fields,
  values,
  editing,
  draft,
  onDraftChange,
  onEdit,
  onSave,
  onCancel,
  saving,
}: {
  fields: { key: string; label: string; placeholder: string }[];
  values: Record<string, string>;
  editing: boolean;
  draft: Record<string, string>;
  onDraftChange: (d: Record<string, string>) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  if (editing) {
    return (
      <div className="space-y-3">
        {fields.map(f => (
          <div key={f.key} className="space-y-1">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{f.label}</label>
            <Textarea
              value={draft[f.key] || ''}
              onChange={e => onDraftChange({ ...draft, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              className="text-xs bg-background/60 border-border/30 min-h-[50px]"
            />
          </div>
        ))}
        <div className="flex gap-2 pt-1">
          <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={onCancel}>
            Cancelar
          </Button>
          <Button size="sm" className="flex-1 text-xs gap-1" onClick={onSave} disabled={saving}>
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            Salvar
          </Button>
        </div>
      </div>
    );
  }

  const hasData = fields.some(f => values[f.key]);

  return (
    <div className="space-y-2">
      {hasData ? (
        fields.map(f => {
          if (!values[f.key]) return null;
          return (
            <div key={f.key} className="space-y-0.5">
              <p className="text-[9px] font-medium text-muted-foreground/60 uppercase tracking-wider">{f.label}</p>
              <p className="text-xs text-foreground/80 leading-relaxed">{values[f.key]}</p>
            </div>
          );
        })
      ) : (
        <p className="text-xs text-muted-foreground/40 italic py-2 text-center">Nenhum dado registrado nesta camada</p>
      )}
      <Button variant="outline" size="sm" className="w-full text-xs mt-2" onClick={onEdit}>
        {hasData ? 'Editar' : 'Preencher'}
      </Button>
    </div>
  );
}
