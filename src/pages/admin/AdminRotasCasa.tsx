import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Plus, Sparkles, BookOpen, ArrowRight, Search,
  Loader2, AlertCircle, Route as RouteIcon, Layers, Compass
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
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

function cleanTechnicalTitle(title: string) {
  if (!title) return '';
  return title.replace('SISTEMA_ROTAS:', '').replace('ROTAS:', '').trim();
}


/**
 * AdminRotasCasa — Gerenciamento de Rotas da Casa
 * 
 * Regras de Persistência:
 * 1. Rota: Criada como uma estação técnica em clube_estacoes (SISTEMA_ROTAS) e um item em clube_rota_itens (rota_marker).
 * 2. Obra-base: Criada APENAS como um item em clube_rota_itens (obra_marker), vinculada à estação técnica da Rota.
 *    NUNCA cria linha em clube_estacoes para Obra-base.
 * 3. Estação: Criada em clube_estacoes vinculada ao livro_titulo da Obra-base.
 */

interface ObraResumo {
  livro_titulo: string;
  livro_autor: string | null;
  estacoes: number;
  publicadas: number;
  livro_capa_url?: string | null;
}

interface RotaAgrupada {
  id: string;            // nome da rota (rota_custom)
  nome: string;
  descricao?: string;
  obras: ObraResumo[];
  totalEstacoes: number;
  algumaPublicada: boolean;
  isMarker?: boolean;
}

function getObraFromItem(item: any) {
  const metadata = (item?.metadata || {}) as Record<string, unknown>;
  const livro_titulo = typeof metadata.livro_titulo === 'string' ? metadata.livro_titulo.replace('SISTEMA_ROTAS:', '').replace('ROTAS:', '').trim() : '';
  if (!livro_titulo) return null;

  return {
    livro_titulo,
    livro_autor: typeof metadata.livro_autor === 'string' ? metadata.livro_autor : null,
    livro_capa_url: typeof metadata.livro_capa_url === 'string' ? metadata.livro_capa_url : null,
  };
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const ROTA_LOBOS = 'Rota dos Lobos';
const OBRA_LOBOS = 'Mulheres que Correm com os Lobos';

export default function AdminRotasCasa() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

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

  const { data: dbData, isLoading, refetch } = useQuery({
    queryKey: ['admin-rotas-casa-v4'],
    queryFn: async () => {
      const { data: estacoes, error: errEst } = await supabase
        .from('clube_estacoes')
        .select('id, numero, titulo, subtitulo, livro_titulo, livro_autor, ativa, publicada, updated_at, descricao')
        .order('numero', { ascending: true });
      if (errEst) throw errEst;

      const { data: items, error: errItems } = await supabase
        .from('clube_rota_itens')
        .select('estacao_id, rota_custom, tipo, titulo, metadata')
        .not('rota_custom', 'is', null);
      if (errItems) throw errItems;

      return { estacoes: estacoes || [], items: items || [] };
    },
  });

  const { estacoes, items } = dbData || { estacoes: [], items: [] };

  const rotasAgrupadas: RotaAgrupada[] = useMemo(() => {
    const map = new Map<string, RotaAgrupada>();
    const obraToRota = new Map<string, string>();
    const obraMetadata = new Map<string, ObraResumo>();
    const estacaoToRota = new Map<string, string>();

    // 1) Identificar Rotas e Obras-base pelos itens técnicos
    for (const item of items) {
      if (!item.rota_custom) continue;

      if (item.tipo === 'rota_marker') {
        if (!map.has(item.rota_custom)) {
          map.set(item.rota_custom, {
            id: item.rota_custom,
            nome: item.rota_custom,
            obras: [],
            totalEstacoes: 0,
            algumaPublicada: false,
            isMarker: true
          });
        }
        // Tentamos pegar a descrição da estação técnica
        const st = estacoes.find(e => e.id === item.estacao_id);
        if (st && st.descricao) {
          map.get(item.rota_custom)!.descricao = st.descricao;
        }
      }

      if (item.tipo === 'obra_marker') {
        const info = getObraFromItem(item);
        if (info) {
          obraToRota.set(info.livro_titulo, item.rota_custom);
          obraMetadata.set(info.livro_titulo, {
            ...info,
            estacoes: 0,
            publicadas: 0,
          });
        }
      }
      
      // Mapeamento geral para qualquer item que tenha rota_custom
      if (item.estacao_id) {
        estacaoToRota.set(item.estacao_id, item.rota_custom);
      }
    }

    // 2) Mapear legado e vincular Estações Reais às Obras
    const finalObras = new Map<string, ObraResumo>(obraMetadata);
    
    for (const e of estacoes) {
      const obraNome = e.livro_titulo || 'Sem Obra';
      const isSystem = obraNome.startsWith('ROTAS:') || obraNome.startsWith('SISTEMA_ROTAS:');
      const isMarker = e.subtitulo === 'MARCADOR_OBRA' || e.numero === 0;

      if (isSystem || isMarker) continue;

      // Se a obra não foi mapeada por um item obra_marker, verificamos se alguma estação dela está em uma rota
      const rotaDaEstacao = estacaoToRota.get(e.id);
      if (rotaDaEstacao && !obraToRota.has(obraNome)) {
        obraToRota.set(obraNome, rotaDaEstacao);
      }

      const rotaFinal = obraToRota.get(obraNome) || (obraNome.includes(OBRA_LOBOS) ? ROTA_LOBOS : null);
      if (!rotaFinal) continue;

      if (!finalObras.has(obraNome)) {
        finalObras.set(obraNome, {
          livro_titulo: obraNome,
          livro_autor: e.livro_autor || null,
          estacoes: 0,
          publicadas: 0,
        });
      }

      const o = finalObras.get(obraNome)!;
      o.estacoes += 1;
      if (e.publicada) o.publicadas += 1;

      // Garantir que a rota existe no map
      if (!map.has(rotaFinal)) {
        map.set(rotaFinal, {
          id: rotaFinal,
          nome: rotaFinal,
          obras: [],
          totalEstacoes: 0,
          algumaPublicada: false,
        });
      }
      const r = map.get(rotaFinal)!;
      r.isMarker = false;
      if (!r.obras.some(ob => ob.livro_titulo === obraNome)) {
        r.obras.push(o);
      }
    }

    // 3) Adicionar Obras vazias que foram mapeadas mas não têm estações
    for (const [obraNome, rotaFinal] of obraToRota) {
      if (!map.has(rotaFinal)) {
        map.set(rotaFinal, {
          id: rotaFinal,
          nome: rotaFinal,
          obras: [],
          totalEstacoes: 0,
          algumaPublicada: false,
        });
      }
      const r = map.get(rotaFinal)!;
      if (!r.obras.some(ob => ob.livro_titulo === obraNome)) {
        const o = finalObras.get(obraNome);
        if (o) r.obras.push(o);
      }
    }

    // Recalcular totais
    for (const r of map.values()) {
      r.totalEstacoes = r.obras.reduce((sum, o) => sum + o.estacoes, 0);
      r.algumaPublicada = r.obras.some(o => o.publicadas > 0);
    }

    return Array.from(map.values());
  }, [estacoes, items]);

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    if (!q) return rotasAgrupadas;
    return rotasAgrupadas.filter(r =>
      r.nome.toLowerCase().includes(q) ||
      r.obras.some(o => o.livro_titulo.toLowerCase().includes(q))
    );
  }, [rotasAgrupadas, searchTerm]);

  const handleCriarRota = async () => {
    if (!novaRota.nome.trim()) {
      toast.error('Informe o nome da Rota.');
      return;
    }
    setSubmitting(true);
    try {
      const nome = novaRota.nome.trim();
      
      // 1) Estação técnica (Anchor)
      const { data: estacao, error: errEst } = await supabase
        .from('clube_estacoes')
        .insert({
          numero: 0,
          titulo: `Módulo: ${nome}`,
          subtitulo: 'Âncora',
          livro_titulo: `ROTAS: ${nome}`,
          descricao: novaRota.descricao.trim(),
          ativa: false,
          publicada: false,
        })
        .select()
        .single();
      if (errEst) throw errEst;

      // 2) Item de Rota
      const { error: errItem } = await supabase
        .from('clube_rota_itens')
        .insert({
          estacao_id: estacao.id,
          rota_custom: nome,
          tipo: 'rota_marker',
          titulo: 'Configuração da Rota',
          slug: `rota-def-${slugify(nome)}`,
          ordem: 0,
          publicado: false
        });
      if (errItem) throw errItem;

      setNovaRota({ nome: '', descricao: '' });
      setOpenRotaDialog(false);
      toast.success('Rota criada com sucesso.');
      refetch();
    } catch (err: any) {
      toast.error('Erro ao criar rota: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdicionarObra = async () => {
    if (!novaObra.rotaNome || !novaObra.livro_titulo.trim()) {
      toast.error('Informe a Rota e o Título da Obra.');
      return;
    }
    
    // Busca a estação técnica da rota para usar como estacao_id (FK obrigatória)
    const rotaAnchor = items.find(i => i.rota_custom === novaObra.rotaNome && i.tipo === 'rota_marker');
    if (!rotaAnchor?.estacao_id) {
      toast.error('Erro técnico: Rota sem estação âncora.');
      return;
    }

    setSubmitting(true);
    try {
      const tituloObra = novaObra.livro_titulo.trim();
      
      // AQUI: Salva APENAS em clube_rota_itens. Metadata contém a definição da Obra.
      // NENHUMA linha é criada em clube_estacoes aqui.
      const { error } = await supabase
        .from('clube_rota_itens')
        .insert({
          estacao_id: rotaAnchor.estacao_id,
          rota_custom: novaObra.rotaNome,
          tipo: 'obra_marker',
          titulo: `Obra-base: ${tituloObra}`,
          slug: `obra-base-${slugify(novaObra.rotaNome)}-${slugify(tituloObra)}`,
          ordem: 0,
          publicado: false,
          metadata: {
            tipo: 'obra_base', // Identificador solicitado
            livro_titulo: tituloObra,
            livro_autor: novaObra.livro_autor.trim() || null,
            livro_capa_url: novaObra.livro_capa_url.trim() || null,
          }
        });
      if (error) throw error;

      toast.success('Obra-base vinculada. Nenhuma estação real foi criada ainda.');
      setOpenObraDialog(false);
      setNovaObra({ rotaNome: '', livro_titulo: '', livro_autor: '', livro_capa_url: '' });
      refetch();
    } catch (err: any) {
      toast.error('Erro: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdicionarEstacao = async () => {
    if (!novaEstacao.livro_titulo || !novaEstacao.titulo.trim()) {
      toast.error('Selecione a Obra e informe o título.');
      return;
    }
    setSubmitting(true);
    try {
      const maxNum = (estacoes || []).reduce((m, e) => Math.max(m, e.numero || 0), 0);
      const { error } = await supabase
        .from('clube_estacoes')
        .insert({
          numero: maxNum + 1,
          titulo: novaEstacao.titulo.trim(),
          subtitulo: novaEstacao.subtitulo.trim(),
          livro_titulo: novaEstacao.livro_titulo,
          ativa: false,
          publicada: false, // Inicia como rascunho
          ordem: maxNum + 1,
          slug: slugify(novaEstacao.titulo.trim())
        });
      if (error) throw error;

      toast.success('Estação criada como rascunho.');
      setOpenEstacaoDialog(false);
      setNovaEstacao({ livro_titulo: '', titulo: '', subtitulo: '' });
      refetch();
    } catch (err: any) {
      toast.error('Erro: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const obrasDisponiveis = useMemo(() => {
    const list: ObraResumo[] = [];
    rotasAgrupadas.forEach(r => r.obras.forEach(o => {
      if (!list.some(x => x.livro_titulo === o.livro_titulo)) list.push(o);
    }));
    return list;
  }, [rotasAgrupadas]);

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gold" /></div>;

  return (
    <div className="space-y-8 p-4 md:p-8 animate-in fade-in duration-700">
      {/* Header e Search (omitidos para brevidade se não mudaram, mas aqui incluímos o essencial) */}
      <div className="flex justify-between items-end gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif text-foreground">Rotas da Casa</h1>
          <p className="text-muted-foreground font-light">Gerencie as travessias e obras-base da Cidadela.</p>
        </div>
        <div className="flex gap-2">
          <div className="group relative">
            <Button variant="outline" disabled className="border-gold/30 text-gold/50 cursor-not-allowed gap-2 opacity-50">
              <RouteIcon className="w-4 h-4" /> Nova Rota
            </Button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-[10px] rounded border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              Criação de novas rotas congelada. Use a Rota dos Lobos.
            </div>
          </div>
          
          <div className="group relative">
            <Button variant="outline" disabled className="border-emerald-500/30 text-emerald-400/50 cursor-not-allowed gap-2 opacity-50">
              <BookOpen className="w-4 h-4" /> Nova Obra-base
            </Button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-[10px] rounded border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              Novas obras-base congeladas nesta etapa.
            </div>
          </div>

          <div className="group relative">
            <Button variant="outline" disabled className="gap-2 opacity-50 cursor-not-allowed">
              <Layers className="w-4 h-4" /> Nova Estação
            </Button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-[10px] rounded border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              Criação de novas estações congelada.
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          className="pl-10 bg-card/40" 
          placeholder="Buscar..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="bg-card/20 border-dashed border-primary/10 p-20 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhuma rota encontrada.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {filtered.map(rota => (
            <Card key={rota.id} className="bg-card/60 border-primary/10 overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="p-3 rounded-xl bg-gold/10 text-gold"><Compass className="w-6 h-6" /></div>
                    <div>
                      <h2 className="text-2xl font-serif text-foreground">{cleanTechnicalTitle(rota.nome)}</h2>
                      <p className="text-xs text-muted-foreground mt-1">{rota.obras.length} obras · {rota.totalEstacoes} estações</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {rota.obras.map(obra => {
                    const ests = (estacoes || []).filter(e => e.livro_titulo === obra.livro_titulo && e.numero > 0);
                    return (
                      <div key={obra.livro_titulo} className="p-4 rounded-xl border border-primary/5 bg-background/20 space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <BookOpen className="w-4 h-4 text-emerald-400" />
                            <span className="font-medium">{cleanTechnicalTitle(obra.livro_titulo)}</span>
                          </div>
                          <Button variant="ghost" size="sm" disabled className="text-xs h-8 gap-1 opacity-50 cursor-not-allowed">
                            <Plus className="w-3 h-3" /> Estação
                          </Button>
                        </div>
                        <ul className="space-y-1 pl-7">
                          {ests.map(est => (
                            <li key={est.id} className="text-sm text-muted-foreground flex justify-between items-center group cursor-pointer hover:text-foreground" onClick={() => navigate(`/admin/clube/central/${est.id}`)}>
                              <span>{est.numero}. {est.titulo}</span>
                              <Badge variant="outline" className="text-[9px] opacity-0 group-hover:opacity-100 transition-opacity">
                                {est.publicada ? 'Publicada' : 'Rascunho'}
                              </Badge>
                            </li>
                          ))}
                          {ests.length === 0 && <li className="text-xs text-muted-foreground italic">Nenhuma estação criada.</li>}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialogs: Nova Rota, Nova Obra, Nova Estação */}
      {/* (Estes mantêm a estrutura básica, focando na chamada correta das handles) */}
      <Dialog open={openRotaDialog} onOpenChange={setOpenRotaDialog}>
        <DialogContent className="bg-card">
          <DialogHeader><DialogTitle>Nova Rota</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <Input placeholder="Nome da Rota" value={novaRota.nome} onChange={e => setNovaRota({...novaRota, nome: e.target.value})} />
            <Textarea placeholder="Descrição" value={novaRota.descricao} onChange={e => setNovaRota({...novaRota, descricao: e.target.value})} />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenRotaDialog(false)}>Cancelar</Button>
            <Button className="bg-gold text-black font-bold" onClick={handleCriarRota} disabled={submitting}>Criar Rota</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openObraDialog} onOpenChange={setOpenObraDialog}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Vincular Obra-base</DialogTitle>
            <DialogDescription>Apenas vínculo simbólico. Nenhuma estação será criada.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Select value={novaObra.rotaNome} onValueChange={v => setNovaObra({...novaObra, rotaNome: v})}>
              <SelectTrigger><SelectValue placeholder="Selecione a Rota" /></SelectTrigger>
              <SelectContent>{rotasAgrupadas.map(r => <SelectItem key={r.nome} value={r.nome}>{r.nome}</SelectItem>)}</SelectContent>
            </Select>
            <Input placeholder="Título da Obra" value={novaObra.livro_titulo} onChange={e => setNovaObra({...novaObra, livro_titulo: e.target.value})} />
            <Input placeholder="Autor (opcional)" value={novaObra.livro_autor} onChange={e => setNovaObra({...novaObra, livro_autor: e.target.value})} />
            <Input placeholder="Capa URL (opcional)" value={novaObra.livro_capa_url} onChange={e => setNovaObra({...novaObra, livro_capa_url: e.target.value})} />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenObraDialog(false)}>Cancelar</Button>
            <Button className="bg-emerald-500 text-black font-bold" onClick={handleAdicionarObra} disabled={submitting}>Vincular Obra</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openEstacaoDialog} onOpenChange={setOpenEstacaoDialog}>
        <DialogContent className="bg-card">
          <DialogHeader><DialogTitle>Nova Estação</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <Select value={novaEstacao.livro_titulo} onValueChange={v => setNovaEstacao({...novaEstacao, livro_titulo: v})}>
              <SelectTrigger><SelectValue placeholder="Selecione a Obra" /></SelectTrigger>
              <SelectContent>{obrasDisponiveis.map(o => <SelectItem key={o.livro_titulo} value={o.livro_titulo}>{o.livro_titulo}</SelectItem>)}</SelectContent>
            </Select>
            <Input placeholder="Título da Estação" value={novaEstacao.titulo} onChange={e => setNovaEstacao({...novaEstacao, titulo: e.target.value})} />
            <Input placeholder="Subtítulo" value={novaEstacao.subtitulo} onChange={e => setNovaEstacao({...novaEstacao, subtitulo: e.target.value})} />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenEstacaoDialog(false)}>Cancelar</Button>
            <Button className="bg-gold text-black font-bold" onClick={handleAdicionarEstacao} disabled={submitting}>Criar Estação</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
