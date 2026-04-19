import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Compass, Sparkles, Loader2, ArrowRight, Wand2 } from 'lucide-react';
import { useCartografiaCatalogos } from '@/hooks/useCartografiaCatalogos';

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
  const { torres, portas, labirintos, arquetipos: arquetiposCat } = useCartografiaCatalogos();

  const [form, setForm] = useState({
    cart_torre: '',
    cart_torre_obs: '',
    cart_porta: '',
    cart_labirinto: '',
    cart_distrito: '',
    cart_arquetipos: [] as string[],
    cart_observacoes: '',
  });

  useEffect(() => {
    if (progresso) {
      setForm({
        cart_torre: progresso.cart_torre || '',
        cart_torre_obs: progresso.cart_torre_obs || '',
        cart_porta: progresso.cart_porta || '',
        cart_labirinto: progresso.cart_labirinto || '',
        cart_distrito: progresso.cart_distrito || '',
        cart_arquetipos: progresso.cart_arquetipos || [],
        cart_observacoes: progresso.cart_observacoes || '',
      });
    }
  }, [progresso?.id]);

  const upd = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }));
  const toggleArq = (a: string) => setForm(prev => ({
    ...prev,
    cart_arquetipos: prev.cart_arquetipos.includes(a)
      ? prev.cart_arquetipos.filter(x => x !== a)
      : [...prev.cart_arquetipos, a],
  }));

  const aplicarSugestoes = () => {
    if (!config) return;
    setForm(prev => ({
      ...prev,
      cart_torre: prev.cart_torre || config.cart_torre_sugerida || '',
      cart_porta: prev.cart_porta || config.cart_porta_sugerida || '',
      cart_labirinto: prev.cart_labirinto || config.cart_labirinto_sugerido || '',
      cart_distrito: prev.cart_distrito || config.cart_distrito_sugerido || '',
      cart_arquetipos: prev.cart_arquetipos.length ? prev.cart_arquetipos : (config.cart_arquetipos_sugeridos || []),
    }));
  };

  const handleSave = () => onSave(form);
  const handleIa = () => {
    handleSave();
    onRunIa(form);
  };

  // Garante que valor salvo apareça mesmo se não estiver na lista curada
  const torresOpts = Array.from(new Set([...(form.cart_torre ? [form.cart_torre] : []), ...torres]));
  const portasOpts = Array.from(new Set([...(form.cart_porta ? [form.cart_porta] : []), ...portas]));
  const labirintosOpts = Array.from(new Set([...(form.cart_labirinto ? [form.cart_labirinto] : []), ...labirintos]));

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

      <Card className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Torre predominante">
            <Select value={form.cart_torre} onValueChange={v => upd('cart_torre', v)}>
              <SelectTrigger><SelectValue placeholder="Selecione a torre..." /></SelectTrigger>
              <SelectContent>
                {torresOpts.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input
              value={form.cart_torre_obs}
              onChange={e => upd('cart_torre_obs', e.target.value)}
              placeholder="Nuance opcional..."
              className="mt-2 h-8 text-xs"
            />
          </Field>
          <Field label="Porta ativa">
            <Select value={form.cart_porta} onValueChange={v => upd('cart_porta', v)}>
              <SelectTrigger><SelectValue placeholder="Selecione a porta..." /></SelectTrigger>
              <SelectContent>
                {portasOpts.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Labirinto recorrente">
            <Select value={form.cart_labirinto} onValueChange={v => upd('cart_labirinto', v)}>
              <SelectTrigger><SelectValue placeholder="Padrão que se repete..." /></SelectTrigger>
              <SelectContent>
                {labirintosOpts.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Distrito predominante">
            <Input value={form.cart_distrito} onChange={e => upd('cart_distrito', e.target.value)} placeholder="Território psíquico" />
          </Field>
        </div>

        <Field label={`Arquétipos ativos${form.cart_arquetipos.length ? ` (${form.cart_arquetipos.length})` : ''}`}>
          <div className="flex gap-1.5 flex-wrap">
            {arquetiposCat.map(a => {
              const active = form.cart_arquetipos.includes(a);
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleArq(a)}
                  className={`px-2.5 py-1 rounded-full text-xs border transition ${
                    active
                      ? 'bg-primary/15 border-primary/40 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/30'
                  }`}
                >
                  {a}
                </button>
              );
            })}
          </div>
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
