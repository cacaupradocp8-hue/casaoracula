import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Compass, Sparkles, Loader2, ArrowRight, Wand2 } from 'lucide-react';

// Fase 1 — Cartografia
// Inputs estruturados + observações livres + botão "Gerar análise"
// Sugestões da obra vêm do config (season_labs).

interface Props {
  progresso: any;
  config: any;
  onSave: (patch: any) => void;
  onRunIa: (inputs: Record<string, unknown>) => void;
  iaLoading: boolean;
  onNext: () => void;
}

export function CartografiaPhase({ progresso, config, onSave, onRunIa, iaLoading, onNext }: Props) {
  const [form, setForm] = useState({
    cart_torre: '',
    cart_porta: '',
    cart_labirinto: '',
    cart_distrito: '',
    cart_arquetipos: '',
    cart_observacoes: '',
  });
  const [modoGuiado, setModoGuiado] = useState(false);

  useEffect(() => {
    if (progresso) {
      setForm({
        cart_torre: progresso.cart_torre || '',
        cart_porta: progresso.cart_porta || '',
        cart_labirinto: progresso.cart_labirinto || '',
        cart_distrito: progresso.cart_distrito || '',
        cart_arquetipos: (progresso.cart_arquetipos || []).join(', '),
        cart_observacoes: progresso.cart_observacoes || '',
      });
    }
  }, [progresso?.id]);

  const upd = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));
  const arquetipos = form.cart_arquetipos.split(',').map(x => x.trim()).filter(Boolean);

  const aplicarSugestoes = () => {
    if (!config) return;
    setForm(prev => ({
      ...prev,
      cart_torre: prev.cart_torre || config.cart_torre_sugerida || '',
      cart_porta: prev.cart_porta || config.cart_porta_sugerida || '',
      cart_labirinto: prev.cart_labirinto || config.cart_labirinto_sugerido || '',
      cart_distrito: prev.cart_distrito || config.cart_distrito_sugerido || '',
      cart_arquetipos: prev.cart_arquetipos || (config.cart_arquetipos_sugeridos || []).join(', '),
    }));
  };

  const handleSave = () => onSave({ ...form, cart_arquetipos: arquetipos });
  const handleIa = () => {
    handleSave();
    onRunIa({ ...form, cart_arquetipos: arquetipos });
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-2">
          <Compass className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h2 className="text-sm font-display text-foreground">Cartografia</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Leia a obra como cliente simbólica. Marque o que se move no campo.
            </p>
          </div>
          {config && (
            <Button variant="ghost" size="sm" onClick={aplicarSugestoes} className="text-xs gap-1 h-7">
              <Wand2 className="w-3 h-3" /> Modo guiado
            </Button>
          )}
        </div>
      </Card>

      <Card className="p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Torre predominante (o que protege)">
            <Input value={form.cart_torre} onChange={e => upd('cart_torre', e.target.value)} placeholder="Ex.: Torre da Performance" />
          </Field>
          <Field label="Porta ativa (o que pede travessia)">
            <Input value={form.cart_porta} onChange={e => upd('cart_porta', e.target.value)} placeholder="Ex.: Porta da Vulnerabilidade" />
          </Field>
          <Field label="Labirinto recorrente">
            <Input value={form.cart_labirinto} onChange={e => upd('cart_labirinto', e.target.value)} placeholder="Padrão que se repete" />
          </Field>
          <Field label="Distrito predominante">
            <Input value={form.cart_distrito} onChange={e => upd('cart_distrito', e.target.value)} placeholder="Território psíquico" />
          </Field>
        </div>
        <Field label="Arquétipos ativos (separe por vírgula)">
          <Input value={form.cart_arquetipos} onChange={e => upd('cart_arquetipos', e.target.value)} placeholder="Mãe, Heroína, Sombra..." />
          {arquetipos.length > 0 && (
            <div className="flex gap-1 flex-wrap mt-2">
              {arquetipos.map(a => <Badge key={a} variant="outline" className="text-[10px]">{a}</Badge>)}
            </div>
          )}
        </Field>
        <Field label="Observações livres">
          <Textarea rows={3} value={form.cart_observacoes} onChange={e => upd('cart_observacoes', e.target.value)} placeholder="O que mais se move no campo desta leitura..." />
        </Field>
      </Card>

      <Button onClick={handleIa} disabled={iaLoading} className="w-full gap-2">
        {iaLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        Gerar análise simbólica
      </Button>

      {progresso?.cart_analise_ia && <AnaliseCard analise={progresso.cart_analise_ia} />}

      {progresso?.cart_analise_ia && (
        <Button onClick={onNext} variant="outline" className="w-full gap-2">
          Ir para Espelho Clínico <ArrowRight className="w-4 h-4" />
        </Button>
      )}
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

function AnaliseCard({ analise }: { analise: any }) {
  return (
    <Card className="p-4 bg-primary/5 border-primary/20">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-display text-foreground">Leitura simbólica</h3>
      </div>
      <div className="space-y-2.5 text-sm">
        {analise.padrao_psiquico && <Section title="Padrão psíquico" body={analise.padrao_psiquico} />}
        {analise.hipotese_protecao && <Section title="O que protege (Torre)" body={analise.hipotese_protecao} />}
        {analise.hipotese_movimento && <Section title="O que pede travessia (Porta)" body={analise.hipotese_movimento} />}
        {analise.tensao_central && <Section title="Tensão central" body={analise.tensao_central} />}
        {analise.imagem_organizadora && <Section title="Imagem organizadora" body={analise.imagem_organizadora} />}
        {analise.proximo_passo && <Section title="Próximo passo" body={analise.proximo_passo} />}
      </div>
    </Card>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-primary uppercase tracking-wider mb-0.5">{title}</p>
      <p className="text-sm text-foreground/90 leading-relaxed">{body}</p>
    </div>
  );
}
