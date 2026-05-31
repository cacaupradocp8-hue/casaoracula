import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Plus, Sparkles, BookOpen, ArrowRight, Search,
  Loader2, AlertCircle, Route as RouteIcon, Layers, Compass
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

/**
 * AdminRotasCasa — Etapa 277
 * Separação estrita entre:
 *   1) Rota da Casa (agrupador simbólico)
 *   2) Obra-base (livro vinculado à rota)
 *   3) Estação (passo concreto da travessia)
 *
 * Persistência: APENAS clube_estacoes. Rotas vazias (sem obra) ficam em
 * localStorage até receberem a primeira Obra — quando se materializam como
 * grupo de estações em clube_estacoes (agrupadas por livro_titulo).
 *
 * Nada nasce publicado ou ativo.
 */

const LS_KEY = 'admin:rotas-da-casa:draft-rotas';

interface RotaDraft {
  id: string;       // local id
  nome: string;
  descricao?: string;
  createdAt: string;
}

interface ObraResumo {
  livro_titulo: string;
  livro_autor: string | null;
  estacoes: number;
  publicadas: number;
}

interface RotaAgrupada {
  id: string;            // rota nome
  nome: string;
  origem: 'draft' | 'db';
  descricao?: string;
  obras: ObraResumo[];
  totalEstacoes: number;
  algumaPublicada: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers de persistência local para Rotas ainda sem Obra
// ─────────────────────────────────────────────────────────────────────────────
function loadDraftRotas(): RotaDraft[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveDraftRotas(rotas: RotaDraft[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(rotas));
  } catch {
    /* noop */
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Mapeamento Obra → Rota.
// Como não temos coluna `rota` em clube_estacoes, usamos uma convenção local:
// quando o admin vincula uma Obra a uma Rota, registramos esse vínculo em
// localStorage (chave separada). A grade de leitura usa esse mapa para
// agrupar Obras por Rota. Obras sem mapeamento aparecem em "Outras Obras".
// ─────────────────────────────────────────────────────────────────────────────
const LS_MAP_KEY = 'admin:rotas-da-casa:obra-rota-map';

function loadObraRotaMap(): Record<string, string> {
  try {
    const raw = localStorage.getItem(LS_MAP_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveObraRotaMap(map: Record<string, string>) {
  try {
    localStorage.setItem(LS_MAP_KEY, JSON.stringify(map));
  } catch { /* noop */ }
}

// Convenção: a "Rota dos Lobos" sempre cobre a obra "Mulheres que Correm com os Lobos".
function defaultRotaFor(obra: string): string {
  const norm = obra.toLowerCase();
  if (norm.includes('mulheres que correm com os lobos')) return 'Rota dos Lobos';
  return '';
}

export default function AdminRotasCasa() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const [draftRotas, setDraftRotas] = useState<RotaDraft[]>(() => loadDraftRotas());
  const [obraRotaMap, setObraRotaMap] = useState<Record<string, string>>(() => loadObraRotaMap());

  useEffect(() => saveDraftRotas(draftRotas), [draftRotas]);
  useEffect(() => saveObraRotaMap(obraRotaMap), [obraRotaMap]);

  // Dialogs
  const [openRotaDialog, setOpenRotaDialog] = useState(false);
  const [openObraDialog, setOpenObraDialog] = useState(false);
  const [openEstacaoDialog, setOpenEstacaoDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [novaRota, setNovaRota] = useState({ nome: '', descricao: '' });
  const [novaObra, setNovaObra] = useState({
    rotaNome: '', livro_titulo: '', livro_autor: '', livro_capa_url: '',
  });
  const [novaEstacao, setNovaEstacao] = useState({
    livro_titulo: '', titulo: '', subtitulo: '',
  });

  const { data: estacoes, isLoading, refetch } = useQuery({
    queryKey: ['admin-rotas-casa-estacoes-v2'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_estacoes')
        .select('id, numero, titulo, subtitulo, livro_titulo, livro_autor, ativa, publicada, updated_at')
        .order('numero', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  // Agregação Rotas → Obras → Estações
  const rotasAgrupadas: RotaAgrupada[] = useMemo(() => {
    const map = new Map<string, RotaAgrupada>();

    // 1) Rotas draft (em memória local)
    for (const d of draftRotas) {
      map.set(d.nome, {
        id: d.nome,
        nome: d.nome,
        origem: 'draft',
        descricao: d.descricao,
        obras: [],
        totalEstacoes: 0,
        algumaPublicada: false,
      });
    }

    // 2) Obras agrupadas a partir das estações reais
    const obrasMap = new Map<string, ObraResumo>();
    for (const e of estacoes || []) {
      const obra = e.livro_titulo || 'Sem Obra';
      if (!obrasMap.has(obra)) {
        obrasMap.set(obra, {
          livro_titulo: obra,
          livro_autor: e.livro_autor || null,
          estacoes: 0,
          publicadas: 0,
        });
      }
      const o = obrasMap.get(obra)!;
      o.estacoes += 1;
      if (e.publicada) o.publicadas += 1;
    }

    // 3) Vincular obras a rotas (mapa local + default)
    for (const obra of obrasMap.values()) {
      const rotaNome =
        obraRotaMap[obra.livro_titulo] ||
        defaultRotaFor(obra.livro_titulo) ||
        `Rota: ${obra.livro_titulo}`;

      if (!map.has(rotaNome)) {
        map.set(rotaNome, {
          id: rotaNome,
          nome: rotaNome,
          origem: 'db',
          obras: [],
          totalEstacoes: 0,
          algumaPublicada: false,
        });
      }
      const r = map.get(rotaNome)!;
      r.obras.push(obra);
      r.totalEstacoes += obra.estacoes;
      r.algumaPublicada = r.algumaPublicada || obra.publicadas > 0;
    }

    return Array.from(map.values());
  }, [estacoes, draftRotas, obraRotaMap]);

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    if (!q) return rotasAgrupadas;
    return rotasAgrupadas.filter(r =>
      r.nome.toLowerCase().includes(q) ||
      r.obras.some(o => o.livro_titulo.toLowerCase().includes(q))
    );
  }, [rotasAgrupadas, searchTerm]);

  // ───── Actions ─────
  const handleCriarRota = () => {
    if (!novaRota.nome.trim()) {
      toast.error('Informe o nome da Rota.');
      return;
    }
    if (draftRotas.some(d => d.nome === novaRota.nome.trim()) ||
        rotasAgrupadas.some(r => r.nome === novaRota.nome.trim())) {
      toast.error('Já existe uma Rota com esse nome.');
      return;
    }
    const draft: RotaDraft = {
      id: crypto.randomUUID(),
      nome: novaRota.nome.trim(),
      descricao: novaRota.descricao.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    setDraftRotas(prev => [...prev, draft]);
    setNovaRota({ nome: '', descricao: '' });
    setOpenRotaDialog(false);
    toast.success('Rota criada como rascunho. Adicione uma Obra-base para ativá-la.');
  };

  const handleAdicionarObra = async () => {
    if (!novaObra.rotaNome || !novaObra.livro_titulo.trim()) {
      toast.error('Selecione a Rota e informe a Obra-base.');
      return;
    }
    setSubmitting(true);
    try {
      // Próximo número global (mantemos numeração simples; admin pode reordenar depois)
      const maxNumero = (estacoes || []).reduce((m, e) => Math.max(m, e.numero || 0), 0);

      const { error } = await supabase
        .from('clube_estacoes')
        .insert({
          numero: maxNumero + 1,
          titulo: novaObra.livro_titulo.trim(),
          subtitulo: '',
          livro_titulo: novaObra.livro_titulo.trim(),
          livro_autor: novaObra.livro_autor.trim() || null,
          livro_capa_url: novaObra.livro_capa_url.trim() || null,
          ativa: false,
          publicada: false,
          ordem: maxNumero + 1,
        });
      if (error) throw error;

      // Registra vínculo Obra → Rota (localStorage)
      setObraRotaMap(prev => ({ ...prev, [novaObra.livro_titulo.trim()]: novaObra.rotaNome }));

      // Se a rota era draft, agora se materializa via DB — pode permanecer no draft
      // (não atrapalha) ou removemos para limpar:
      setDraftRotas(prev => prev.filter(d => d.nome !== novaObra.rotaNome));

      toast.success('Obra-base vinculada à Rota. Primeira estação criada como rascunho.');
      setOpenObraDialog(false);
      setNovaObra({ rotaNome: '', livro_titulo: '', livro_autor: '', livro_capa_url: '' });
      refetch();
    } catch (err: any) {
      toast.error('Erro ao adicionar obra: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdicionarEstacao = async () => {
    if (!novaEstacao.livro_titulo || !novaEstacao.titulo.trim()) {
      toast.error('Selecione a Obra e informe o título da Estação.');
      return;
    }
    setSubmitting(true);
    try {
      const maxNumero = (estacoes || []).reduce((m, e) => Math.max(m, e.numero || 0), 0);
      const { error } = await supabase
        .from('clube_estacoes')
        .insert({
          numero: maxNumero + 1,
          titulo: novaEstacao.titulo.trim(),
          subtitulo: novaEstacao.subtitulo.trim() || '',
          livro_titulo: novaEstacao.livro_titulo,
          ativa: false,
          publicada: false,
          ordem: maxNumero + 1,
        });
      if (error) throw error;
      toast.success('Estação criada como rascunho.');
      setOpenEstacaoDialog(false);
      setNovaEstacao({ livro_titulo: '', titulo: '', subtitulo: '' });
      refetch();
    } catch (err: any) {
      toast.error('Erro ao criar estação: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const obrasDisponiveis = useMemo(() => {
    const set = new Map<string, ObraResumo>();
    rotasAgrupadas.forEach(r => r.obras.forEach(o => set.set(o.livro_titulo, o)));
    return Array.from(set.values());
  }, [rotasAgrupadas]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-medium">
          <span className="hover:text-gold cursor-pointer" onClick={() => navigate('/admin')}>Central</span>
          <span>/</span>
          <span className="text-gold">Rotas da Casa</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-serif text-foreground">Rotas da Casa</h1>
            <p className="text-muted-foreground max-w-2xl font-light">
              Rota → Obra-base → Estação. Cada nível é criado separadamente e nasce como rascunho.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              className="border-gold/30 text-gold hover:bg-gold/10 gap-2"
              onClick={() => setOpenRotaDialog(true)}
            >
              <RouteIcon className="w-4 h-4" />
              Nova Rota
            </Button>
            <Button
              variant="outline"
              className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 gap-2"
              onClick={() => setOpenObraDialog(true)}
            >
              <BookOpen className="w-4 h-4" />
              Nova Obra-base
            </Button>
            <Button
              variant="outline"
              className="border-primary/20 hover:bg-primary/5 gap-2"
              onClick={() => setOpenEstacaoDialog(true)}
            >
              <Layers className="w-4 h-4" />
              Nova Estação
            </Button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          className="pl-10 bg-card/40 border-primary/10"
          placeholder="Buscar rotas ou obras..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card/20 rounded-2xl border border-dashed border-primary/10">
          <AlertCircle className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-serif text-muted-foreground">Nenhuma rota encontrada</h3>
          <p className="text-sm text-muted-foreground/60 mt-2">
            Comece criando uma Rota; depois adicione uma Obra-base; por fim, suas Estações.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((rota) => (
            <Card key={rota.id} className="bg-card/60 border-primary/10 backdrop-blur-xl">
              <CardContent className="p-6 space-y-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gold/10 text-gold">
                      <Compass className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-2xl font-serif text-foreground">{rota.nome}</h2>
                        {rota.algumaPublicada ? (
                          <Badge className="bg-gold text-black">Ativa</Badge>
                        ) : (
                          <Badge variant="secondary">Rascunho</Badge>
                        )}
                        {rota.origem === 'draft' && (
                          <Badge variant="outline" className="border-dashed">sem obra</Badge>
                        )}
                      </div>
                      {rota.descricao && (
                        <p className="text-sm text-muted-foreground/80 mt-1">{rota.descricao}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {rota.obras.length} obra(s) · {rota.totalEstacoes} estação(ões)
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      setNovaObra(s => ({ ...s, rotaNome: rota.nome }));
                      setOpenObraDialog(true);
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" /> Obra
                  </Button>
                </div>

                {rota.obras.length === 0 ? (
                  <div className="p-4 rounded-lg border border-dashed border-primary/10 text-sm text-muted-foreground">
                    Esta rota ainda não possui Obra-base. Adicione uma para criar a primeira estação.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {rota.obras.map(obra => {
                      const estacoesDaObra = (estacoes || []).filter(e => e.livro_titulo === obra.livro_titulo);
                      return (
                        <div key={obra.livro_titulo} className="rounded-xl border border-primary/10 bg-background/40">
                          <div className="flex items-center justify-between p-4 border-b border-primary/5">
                            <div className="flex items-center gap-3">
                              <BookOpen className="w-4 h-4 text-emerald-400" />
                              <div>
                                <p className="font-medium text-foreground">{obra.livro_titulo}</p>
                                {obra.livro_autor && (
                                  <p className="text-xs text-muted-foreground italic">{obra.livro_autor}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {obra.publicadas}/{obra.estacoes} publicada(s)
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1 text-xs"
                                onClick={() => {
                                  setNovaEstacao(s => ({ ...s, livro_titulo: obra.livro_titulo }));
                                  setOpenEstacaoDialog(true);
                                }}
                              >
                                <Plus className="w-3 h-3" /> Estação
                              </Button>
                            </div>
                          </div>
                          <ul className="divide-y divide-primary/5">
                            {estacoesDaObra.map(est => (
                              <li
                                key={est.id}
                                className="flex items-center justify-between px-4 py-2.5 hover:bg-primary/5 cursor-pointer"
                                onClick={() => navigate(`/admin/clube/central/${est.id}`)}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className="w-7 h-7 rounded-lg bg-gold/15 text-gold text-[10px] font-bold flex items-center justify-center shrink-0">
                                    {est.numero}
                                  </span>
                                  <span className="text-sm text-foreground/90 truncate">{est.titulo}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {est.publicada ? (
                                    <Badge className="bg-gold/20 text-gold text-[10px]">Publicada</Badge>
                                  ) : (
                                    <Badge variant="secondary" className="text-[10px]">Rascunho</Badge>
                                  )}
                                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="p-5 rounded-xl bg-gold/5 border border-gold/10 text-sm text-muted-foreground leading-relaxed">
        <strong className="text-gold">Fluxo:</strong> crie a Rota (agrupador simbólico); depois adicione uma Obra-base
        (que cria a 1ª estação como rascunho); depois adicione mais Estações conforme necessário. Nada nasce ativo ou publicado.
      </div>

      {/* ─── Dialog: Nova Rota ─── */}
      <Dialog open={openRotaDialog} onOpenChange={setOpenRotaDialog}>
        <DialogContent className="bg-card border-primary/20 sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif text-gold flex items-center gap-2">
              <RouteIcon className="w-5 h-5" /> Nova Rota da Casa
            </DialogTitle>
            <DialogDescription>
              Cria apenas o agrupador simbólico. Nenhuma estação é criada agora.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Nome da Rota</label>
              <Input
                placeholder="Ex: Rota da Heroína"
                value={novaRota.nome}
                onChange={(e) => setNovaRota({ ...novaRota, nome: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Descrição (opcional)</label>
              <Textarea
                placeholder="Sobre o que é essa travessia?"
                value={novaRota.descricao}
                onChange={(e) => setNovaRota({ ...novaRota, descricao: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenRotaDialog(false)}>Cancelar</Button>
            <Button className="bg-gold hover:bg-gold/80 text-black font-bold" onClick={handleCriarRota}>
              Criar Rota
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Dialog: Nova Obra-base ─── */}
      <Dialog open={openObraDialog} onOpenChange={setOpenObraDialog}>
        <DialogContent className="bg-card border-primary/20 sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif text-emerald-400 flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> Vincular Obra-base a uma Rota
            </DialogTitle>
            <DialogDescription>
              Cria uma estação inicial (rascunho) ancorada na obra. Nada é publicado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Rota</label>
              <Select
                value={novaObra.rotaNome}
                onValueChange={(v) => setNovaObra({ ...novaObra, rotaNome: v })}
              >
                <SelectTrigger><SelectValue placeholder="Selecione a Rota" /></SelectTrigger>
                <SelectContent>
                  {rotasAgrupadas.map(r => (
                    <SelectItem key={r.nome} value={r.nome}>{r.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {rotasAgrupadas.length === 0 && (
                <p className="text-[11px] text-muted-foreground">
                  Crie uma Rota antes de vincular uma Obra.
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Título da Obra</label>
                <Input
                  placeholder="Ex: A Jornada da Heroína"
                  value={novaObra.livro_titulo}
                  onChange={(e) => setNovaObra({ ...novaObra, livro_titulo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Autor (opcional)</label>
                <Input
                  value={novaObra.livro_autor}
                  onChange={(e) => setNovaObra({ ...novaObra, livro_autor: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Capa URL (opcional)</label>
                <Input
                  value={novaObra.livro_capa_url}
                  onChange={(e) => setNovaObra({ ...novaObra, livro_capa_url: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenObraDialog(false)}>Cancelar</Button>
            <Button
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold"
              onClick={handleAdicionarObra}
              disabled={submitting}
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Vincular Obra'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Dialog: Nova Estação ─── */}
      <Dialog open={openEstacaoDialog} onOpenChange={setOpenEstacaoDialog}>
        <DialogContent className="bg-card border-primary/20 sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif text-foreground flex items-center gap-2">
              <Layers className="w-5 h-5" /> Nova Estação
            </DialogTitle>
            <DialogDescription>
              Adiciona uma estação a uma Obra existente. Nasce como rascunho.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Obra</label>
              <Select
                value={novaEstacao.livro_titulo}
                onValueChange={(v) => setNovaEstacao({ ...novaEstacao, livro_titulo: v })}
              >
                <SelectTrigger><SelectValue placeholder="Selecione a Obra" /></SelectTrigger>
                <SelectContent>
                  {obrasDisponiveis.map(o => (
                    <SelectItem key={o.livro_titulo} value={o.livro_titulo}>
                      {o.livro_titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {obrasDisponiveis.length === 0 && (
                <p className="text-[11px] text-muted-foreground">
                  Nenhuma Obra disponível. Vincule uma Obra-base a uma Rota antes.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Título da Estação</label>
              <Input
                placeholder="Ex: A descoberta do instinto"
                value={novaEstacao.titulo}
                onChange={(e) => setNovaEstacao({ ...novaEstacao, titulo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Subtítulo (opcional)</label>
              <Input
                value={novaEstacao.subtitulo}
                onChange={(e) => setNovaEstacao({ ...novaEstacao, subtitulo: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenEstacaoDialog(false)}>Cancelar</Button>
            <Button
              className="bg-gold hover:bg-gold/80 text-black font-bold"
              onClick={handleAdicionarEstacao}
              disabled={submitting}
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar Estação'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
