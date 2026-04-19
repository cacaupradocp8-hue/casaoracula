import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Eye, Sparkles, Loader2, ArrowRight, ArrowLeft, AlertTriangle } from 'lucide-react';

interface Props {
  progresso: any;
  config: any;
  onSave: (patch: any) => void;
  onRunIa: (inputs: Record<string, unknown>) => void;
  iaLoading: boolean;
  onNext: () => void;
  onBack: () => void;
}

export function EspelhoPhase({ progresso, config, onSave, onRunIa, iaLoading, onNext, onBack }: Props) {
  const [form, setForm] = useState({
    esp_onde_ve: '',
    esp_manifestacao: '',
    esp_risco: '',
    esp_nao_fazer: '',
    esp_categorias_selecionadas: [] as string[],
  });

  useEffect(() => {
    if (progresso) {
      setForm({
        esp_onde_ve: progresso.esp_onde_ve || '',
        esp_manifestacao: progresso.esp_manifestacao || '',
        esp_risco: progresso.esp_risco || '',
        esp_nao_fazer: progresso.esp_nao_fazer || '',
        esp_categorias_selecionadas: progresso.esp_categorias_selecionadas || [],
      });
    }
  }, [progresso?.id]);

  const upd = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  const categoriasDisp: string[] = config?.esp_categorias_padrao || [];
  const toggleCat = (c: string) => {
    setForm(prev => ({
      ...prev,
      esp_categorias_selecionadas: prev.esp_categorias_selecionadas.includes(c)
        ? prev.esp_categorias_selecionadas.filter(x => x !== c)
        : [...prev.esp_categorias_selecionadas, c],
    }));
  };

  const handleIa = () => {
    onSave(form);
    onRunIa(form);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-teal-500/5 border-teal-500/20">
        <div className="flex items-start gap-2">
          <Eye className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
          <div>
            <h2 className="text-sm font-display text-foreground">Espelho Clínico</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Conecte o simbólico ao que aparece nas suas clientes reais.
            </p>
          </div>
        </div>
      </Card>

      {/* Exemplos autorais (se existirem) */}
      {config?.esp_exemplos_manifestacao && (
        <Card className="p-3 bg-muted/30 border-border/40">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Exemplos da obra</p>
          <p className="text-xs text-foreground/80 leading-relaxed">{config.esp_exemplos_manifestacao}</p>
        </Card>
      )}

      <Card className="p-4 space-y-3">
        {categoriasDisp.length > 0 && (
          <div>
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Categorias de padrão (toque para selecionar)</label>
            <div className="flex gap-1.5 flex-wrap mt-2">
              {categoriasDisp.map(c => {
                const active = form.esp_categorias_selecionadas.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() => toggleCat(c)}
                    className={`px-2.5 py-1 rounded-full text-xs border transition ${
                      active
                        ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                        : 'border-border text-muted-foreground hover:border-teal-500/30'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <Field label="Onde você vê esse padrão nas suas clientes?">
          <Textarea rows={3} value={form.esp_onde_ve} onChange={e => upd('esp_onde_ve', e.target.value)} placeholder="Cenas concretas..." />
        </Field>
        <Field label="Como esse padrão se manifesta na fala?">
          <Textarea rows={3} value={form.esp_manifestacao} onChange={e => upd('esp_manifestacao', e.target.value)} placeholder="Frases típicas, evasivas, contradições..." />
        </Field>
        <Field label="Qual risco clínico existe?">
          <Textarea rows={2} value={form.esp_risco} onChange={e => upd('esp_risco', e.target.value)} placeholder="O que se quebra se for tocado errado..." />
        </Field>
        <Field label="O que NÃO deve ser feito nessa condução?">
          <Textarea rows={2} value={form.esp_nao_fazer} onChange={e => upd('esp_nao_fazer', e.target.value)} placeholder="Limites éticos..." />
        </Field>
      </Card>

      <Button onClick={handleIa} disabled={iaLoading} className="w-full gap-2">
        {iaLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        Analisar padrão clínico
      </Button>

      {progresso?.esp_analise_ia && <EspelhoAnalise analise={progresso.esp_analise_ia} />}

      <div className="flex gap-2">
        <Button onClick={onBack} variant="ghost" className="gap-2"><ArrowLeft className="w-4 h-4" /> Cartografia</Button>
        {progresso?.esp_analise_ia && (
          <Button onClick={onNext} variant="outline" className="flex-1 gap-2">
            Ir para Forja <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function EspelhoAnalise({ analise }: { analise: any }) {
  return (
    <Card className="p-4 bg-teal-500/5 border-teal-500/20">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-teal-500" />
        <h3 className="text-sm font-display text-foreground">Tradução clínica</h3>
      </div>
      <div className="space-y-3 text-sm">
        {analise.tipo_cliente_correspondente && (
          <div>
            <p className="text-[11px] font-medium text-teal-400 uppercase tracking-wider mb-0.5">Tipo de cliente correspondente</p>
            <p className="text-sm text-foreground/90">{analise.tipo_cliente_correspondente}</p>
          </div>
        )}
        {analise.padroes_comportamentais?.length > 0 && (
          <List title="Padrões comportamentais" items={analise.padroes_comportamentais} />
        )}
        {analise.alertas_eticos?.length > 0 && (
          <List title="Alertas éticos" items={analise.alertas_eticos} icon={<AlertTriangle className="w-3 h-3 text-amber-500" />} />
        )}
        {analise.o_que_nao_fazer?.length > 0 && (
          <List title="O que NÃO fazer" items={analise.o_que_nao_fazer} />
        )}
        {analise.observacao_clinica && (
          <div>
            <p className="text-[11px] font-medium text-teal-400 uppercase tracking-wider mb-0.5">Observação clínica</p>
            <p className="text-sm text-foreground/90 leading-relaxed">{analise.observacao_clinica}</p>
          </div>
        )}
      </div>
    </Card>
  );
}

function List({ title, items, icon }: { title: string; items: string[]; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-teal-400 uppercase tracking-wider mb-1">{title}</p>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i} className="text-sm text-foreground/90 flex items-start gap-1.5">
            {icon || <span className="text-teal-500 mt-1">•</span>}
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
