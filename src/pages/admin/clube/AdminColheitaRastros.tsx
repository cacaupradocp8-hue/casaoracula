import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2, Plus, Trash2, Save, Leaf, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Estacao { id: string; titulo: string; slug: string; rota_id: string | null; ordem: number; }
interface Pergunta { id: string; ordem: number; texto: string; obrigatoria?: boolean; }

const PERGUNTAS_PADRAO: Pergunta[] = [
  { id: 'p1', ordem: 1, texto: 'Qual imagem, frase ou símbolo continua com você após esta estação?' },
  { id: 'p2', ordem: 2, texto: 'O que esta travessia ajudou você a perceber que antes estava menos visível?' },
  { id: 'p3', ordem: 3, texto: 'Que pergunta continua ecoando dentro de você?' },
  { id: 'p4', ordem: 4, texto: 'O que desta estação você conseguiria utilizar na sua prática?' },
  { id: 'p5', ordem: 5, texto: 'Se a Casa permanecesse mais tempo aqui, o que aprofundaria?' },
  { id: 'p6', ordem: 6, texto: 'Em uma palavra, como nomearia esta experiência?' },
];

export default function AdminColheitaRastros() {
  const client = supabase as any;
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Colheita state
  const [colTitulo, setColTitulo] = useState('Colheita dos Rastros');
  const [colAbertura, setColAbertura] = useState('');
  const [colPerguntas, setColPerguntas] = useState<Pergunta[]>(PERGUNTAS_PADRAO);
  const [colAtivo, setColAtivo] = useState(true);
  const [colSalvarJardim, setColSalvarJardim] = useState(true);

  // Fundadora state
  const [funAtivo, setFunAtivo] = useState(false);
  const [funTitulo, setFunTitulo] = useState('Convite Especial — Fundadoras');
  const [funTexto, setFunTexto] = useState('');
  const [funLink, setFunLink] = useState('');
  const [funBotao, setFunBotao] = useState('Entrar no grupo WhatsApp');
  const [funData, setFunData] = useState('');
  const [funDescricao, setFunDescricao] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await client.from('clube_estacoes').select('id,titulo,slug,rota_id,ordem').order('ordem');
      setEstacoes(data || []);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    (async () => {
      setLoading(true);
      const [col, fun] = await Promise.all([
        client.from('clube_colheita_rastros_config').select('*').eq('estacao_id', selectedId).maybeSingle(),
        client.from('clube_fundadoras_convite_config').select('*').eq('estacao_id', selectedId).maybeSingle(),
      ]);
      const c = col.data;
      setColTitulo(c?.titulo || 'Colheita dos Rastros');
      setColAbertura(c?.texto_abertura || '');
      setColPerguntas(Array.isArray(c?.perguntas) && c.perguntas.length ? c.perguntas : PERGUNTAS_PADRAO);
      setColAtivo(c?.ativo ?? true);
      setColSalvarJardim(c?.salvar_jardim_oficio ?? true);

      const f = fun.data;
      setFunAtivo(f?.ativo ?? false);
      setFunTitulo(f?.titulo || 'Convite Especial — Fundadoras');
      setFunTexto(f?.texto || '');
      setFunLink(f?.link_whatsapp || '');
      setFunBotao(f?.texto_botao || 'Entrar no grupo WhatsApp');
      setFunData(f?.data_aula_ao_vivo ? new Date(f.data_aula_ao_vivo).toISOString().slice(0, 16) : '');
      setFunDescricao(f?.descricao_aula || '');
      setLoading(false);
    })();
  }, [selectedId]);

  const estacao = estacoes.find((e) => e.id === selectedId);

  const salvar = async () => {
    if (!selectedId || !estacao) return;
    setSaving(true);
    try {
      const colPayload = {
        estacao_id: selectedId,
        rota_id: estacao.rota_id,
        titulo: colTitulo,
        texto_abertura: colAbertura,
        perguntas: colPerguntas,
        ativo: colAtivo,
        salvar_jardim_oficio: colSalvarJardim,
      };
      const funPayload = {
        estacao_id: selectedId,
        rota_id: estacao.rota_id,
        ativo: funAtivo,
        titulo: funTitulo,
        texto: funTexto,
        link_whatsapp: funLink || null,
        texto_botao: funBotao,
        data_aula_ao_vivo: funData ? new Date(funData).toISOString() : null,
        descricao_aula: funDescricao || null,
      };
      const [r1, r2] = await Promise.all([
        client.from('clube_colheita_rastros_config').upsert(colPayload, { onConflict: 'estacao_id' }),
        client.from('clube_fundadoras_convite_config').upsert(funPayload, { onConflict: 'estacao_id' }),
      ]);
      if (r1.error) throw r1.error;
      if (r2.error) throw r2.error;
      toast.success('Configurações salvas.');
    } catch (e: any) {
      toast.error(e.message || 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  const addPergunta = () => {
    const nextOrdem = Math.max(0, ...colPerguntas.map((p) => p.ordem)) + 1;
    setColPerguntas([...colPerguntas, { id: `p${Date.now()}`, ordem: nextOrdem, texto: '' }]);
  };
  const updatePergunta = (i: number, texto: string) => {
    const next = [...colPerguntas];
    next[i] = { ...next[i], texto };
    setColPerguntas(next);
  };
  const removePergunta = (i: number) => setColPerguntas(colPerguntas.filter((_, idx) => idx !== i));

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-serif text-gold flex items-center gap-2">
          <Leaf className="w-5 h-5" /> Colheita dos Rastros & Convite Fundadoras
        </h1>
        <p className="text-sm text-white/60">
          Configure por estação as perguntas finais e o convite exclusivo para fundadoras.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Estação</Label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full bg-background border border-border/60 rounded-md h-12 px-4"
        >
          <option value="">— Selecione uma estação —</option>
          {estacoes.map((e) => (
            <option key={e.id} value={e.id}>{e.ordem}. {e.titulo}</option>
          ))}
        </select>
      </div>

      {loading && selectedId && (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>
      )}

      {selectedId && !loading && (
        <>
          {/* COLHEITA */}
          <Card className="p-6 space-y-4 border-gold/20">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif text-gold flex items-center gap-2">
                <Leaf className="w-4 h-4" /> Colheita dos Rastros
              </h2>
              <div className="flex items-center gap-2">
                <Label className="text-xs">Ativo</Label>
                <Switch checked={colAtivo} onCheckedChange={setColAtivo} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={colTitulo} onChange={(e) => setColTitulo(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Texto de abertura</Label>
              <Textarea rows={4} value={colAbertura} onChange={(e) => setColAbertura(e.target.value)} />
            </div>

            <div className="flex items-center gap-2">
              <Switch checked={colSalvarJardim} onCheckedChange={setColSalvarJardim} />
              <Label className="text-xs">Salvar síntese no Jardim do Ofício</Label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Perguntas</Label>
                <Button size="sm" variant="ghost" onClick={addPergunta}>
                  <Plus className="w-3 h-3 mr-1" /> Adicionar
                </Button>
              </div>
              {colPerguntas.map((p, i) => (
                <div key={p.id} className="flex gap-2 items-start">
                  <span className="text-xs text-gold/60 pt-3 w-6">{p.ordem}.</span>
                  <Textarea
                    value={p.texto}
                    onChange={(e) => updatePergunta(i, e.target.value)}
                    rows={2}
                    className="flex-1"
                  />
                  <Button size="icon" variant="ghost" onClick={() => removePergunta(i)}>
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* FUNDADORAS */}
          <Card className="p-6 space-y-4 border-gold/20">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif text-gold flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> Convite Fundadoras (WhatsApp)
              </h2>
              <div className="flex items-center gap-2">
                <Label className="text-xs">Ativo</Label>
                <Switch checked={funAtivo} onCheckedChange={setFunAtivo} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={funTitulo} onChange={(e) => setFunTitulo(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Texto</Label>
              <Textarea rows={4} value={funTexto} onChange={(e) => setFunTexto(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Link WhatsApp</Label>
                <Input value={funLink} onChange={(e) => setFunLink(e.target.value)} placeholder="https://chat.whatsapp.com/..." />
              </div>
              <div className="space-y-2">
                <Label>Texto do botão</Label>
                <Input value={funBotao} onChange={(e) => setFunBotao(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Data da aula ao vivo</Label>
                <Input type="datetime-local" value={funData} onChange={(e) => setFunData(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Descrição da aula</Label>
                <Input value={funDescricao} onChange={(e) => setFunDescricao(e.target.value)} />
              </div>
            </div>
          </Card>

          <div className="flex justify-end sticky bottom-4">
            <Button variant="gold" size="lg" onClick={salvar} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Salvar configurações
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
