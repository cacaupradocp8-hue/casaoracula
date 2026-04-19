import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Hammer, Sparkles, Loader2, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Props {
  progresso: any;
  config: any;
  onSave: (patch: any) => void;
  onRunIa: (inputs: Record<string, unknown>) => void;
  iaLoading: boolean;
  onConcluir: () => void;
  onBack: () => void;
}

export function ForjaPhase({ progresso, config, onSave, onRunIa, iaLoading, onConcluir, onBack }: Props) {
  const [form, setForm] = useState({
    forja_objetivo: '',
    forja_estrategia: '',
    forja_perguntas: '',
    forja_intervencao: '',
    forja_fechamento: '',
    forja_riscos: '',
    forja_respostas_cliente: '',
    forja_ajustes_rota: '',
  });

  useEffect(() => {
    if (progresso) {
      setForm({
        forja_objetivo: progresso.forja_objetivo || '',
        forja_estrategia: progresso.forja_estrategia || '',
        forja_perguntas: progresso.forja_perguntas || '',
        forja_intervencao: progresso.forja_intervencao || '',
        forja_fechamento: progresso.forja_fechamento || '',
        forja_riscos: progresso.forja_riscos || '',
        forja_respostas_cliente: progresso.forja_respostas_cliente || '',
        forja_ajustes_rota: progresso.forja_ajustes_rota || '',
      });
    }
  }, [progresso?.id]);

  const upd = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const aplicarTemplate = () => {
    if (!config) return;
    setForm(prev => ({
      ...prev,
      forja_objetivo: prev.forja_objetivo || config.forja_template_objetivo || '',
      forja_estrategia: prev.forja_estrategia || config.forja_template_estrategia || '',
      forja_perguntas: prev.forja_perguntas || (config.forja_perguntas_chave || []).join('\n'),
      forja_intervencao: prev.forja_intervencao || config.forja_intervencao_modelo || '',
      forja_fechamento: prev.forja_fechamento || config.forja_fechamento_sugerido || '',
    }));
  };

  const handleIa = () => {
    onSave(form);
    onRunIa({
      ...form,
      // Inclui a leitura prévia da Cartografia + Espelho como contexto
      contexto_cartografia: progresso?.cart_analise_ia,
      contexto_espelho: progresso?.esp_analise_ia,
    });
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-amber-500/5 border-amber-500/20">
        <div className="flex items-start gap-2">
          <Hammer className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h2 className="text-sm font-display text-foreground">Forja Narrativa</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Construa a condução. Pense em uma cliente real e desenhe a sessão.
            </p>
          </div>
          {config && (
            <Button variant="ghost" size="sm" onClick={aplicarTemplate} className="text-xs h-7">
              Usar template
            </Button>
          )}
        </div>
      </Card>

      <Card className="p-4 space-y-3">
        <Field label="Objetivo da sessão">
          <Textarea rows={2} value={form.forja_objetivo} onChange={e => upd('forja_objetivo', e.target.value)} placeholder="O que se busca tocar..." />
        </Field>
        <Field label="Estratégia de condução">
          <Textarea rows={3} value={form.forja_estrategia} onChange={e => upd('forja_estrategia', e.target.value)} placeholder="Sequência de movimento..." />
        </Field>
        <Field label="Perguntas-chave">
          <Textarea rows={3} value={form.forja_perguntas} onChange={e => upd('forja_perguntas', e.target.value)} placeholder="Uma por linha..." />
        </Field>
        <Field label="Intervenção simbólica">
          <Textarea rows={2} value={form.forja_intervencao} onChange={e => upd('forja_intervencao', e.target.value)} placeholder="Gesto, imagem, ritual..." />
        </Field>
        <Field label="Fechamento da sessão">
          <Textarea rows={2} value={form.forja_fechamento} onChange={e => upd('forja_fechamento', e.target.value)} placeholder="Como encerrar mantendo o campo aberto..." />
        </Field>

        {/* Bloco obrigatório: riscos / respostas / ajustes */}
        <div className="pt-3 mt-3 border-t border-amber-500/20 space-y-3">
          <p className="text-[11px] font-medium text-amber-500 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Bloco obrigatório
          </p>
          <Field label="Riscos da condução">
            <Textarea rows={2} value={form.forja_riscos} onChange={e => upd('forja_riscos', e.target.value)} placeholder="O que pode dar errado..." />
          </Field>
          <Field label="Possíveis respostas da cliente">
            <Textarea rows={2} value={form.forja_respostas_cliente} onChange={e => upd('forja_respostas_cliente', e.target.value)} placeholder="Defesas, evasões, choro, silêncio..." />
          </Field>
          <Field label="Ajustes de rota">
            <Textarea rows={2} value={form.forja_ajustes_rota} onChange={e => upd('forja_ajustes_rota', e.target.value)} placeholder="Como pivotar se a cliente fechar..." />
          </Field>
        </div>
      </Card>

      <Button onClick={handleIa} disabled={iaLoading} className="w-full gap-2">
        {iaLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        Gerar plano terapêutico
      </Button>

      {progresso?.forja_plano_ia && <PlanoCard plano={progresso.forja_plano_ia} />}

      <div className="flex gap-2">
        <Button onClick={onBack} variant="ghost" className="gap-2"><ArrowLeft className="w-4 h-4" /> Espelho</Button>
        {progresso?.forja_plano_ia && (
          <Button onClick={onConcluir} variant="default" className="flex-1 gap-2">
            <CheckCircle2 className="w-4 h-4" /> Concluir laboratório
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

function PlanoCard({ plano }: { plano: any }) {
  return (
    <Card className="p-4 bg-amber-500/5 border-amber-500/20">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <h3 className="text-sm font-display text-foreground">Plano terapêutico</h3>
      </div>
      <div className="space-y-3 text-sm">
        {plano.objetivo_refinado && <Sec title="Objetivo refinado" body={plano.objetivo_refinado} />}
        {plano.sequencia_conducao?.length > 0 && <ListSec title="Sequência" items={plano.sequencia_conducao} />}
        {plano.perguntas_chave?.length > 0 && <ListSec title="Perguntas-chave" items={plano.perguntas_chave} />}
        {plano.intervencao_simbolica && <Sec title="Intervenção simbólica" body={plano.intervencao_simbolica} />}
        {plano.fechamento && <Sec title="Fechamento" body={plano.fechamento} />}
        {plano.riscos?.length > 0 && <ListSec title="Riscos" items={plano.riscos} />}
        {plano.possiveis_respostas_cliente?.length > 0 && <ListSec title="Respostas possíveis da cliente" items={plano.possiveis_respostas_cliente} />}
        {plano.ajustes_de_rota?.length > 0 && <ListSec title="Ajustes de rota" items={plano.ajustes_de_rota} />}
      </div>
    </Card>
  );
}

function Sec({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-amber-500 uppercase tracking-wider mb-0.5">{title}</p>
      <p className="text-sm text-foreground/90 leading-relaxed">{body}</p>
    </div>
  );
}

function ListSec({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-amber-500 uppercase tracking-wider mb-1">{title}</p>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i} className="text-sm text-foreground/90 flex items-start gap-1.5">
            <span className="text-amber-500 mt-1">•</span><span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
