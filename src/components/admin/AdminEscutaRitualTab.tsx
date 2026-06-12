import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { AudioUpload } from '@/components/admin/AudioUpload';
import { toast } from 'sonner';
import { Loader2, Trash2, Download, Headphones, AlertCircle } from 'lucide-react';

interface Rota { id: string; title: string; }
interface Estacao { id: string; title: string; route_id: string | null; }
interface EscutaAudio {
  id: string;
  title: string;
  audio_url: string;
  station_id: string | null;
  display_order: number | null;
  status: string | null;
  destino: string | null;
  created_at: string;
}

const DESTINOS = [
  { value: 'escuta_ritual', label: 'Escuta Ritual (passo Escuta)' },
  { value: 'entrada', label: 'Entrada da Estação' },
  { value: 'camara_escuta', label: 'Câmara de Escuta' },
  { value: 'fechamento', label: 'Fechamento' },
];

export function AdminEscutaRitualTab() {
  const [rotas, setRotas] = useState<Rota[]>([]);
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [audios, setAudios] = useState<EscutaAudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [rotaId, setRotaId] = useState<string>('');
  const [estacaoId, setEstacaoId] = useState<string>('');
  const [destino, setDestino] = useState<string>('escuta_ritual');
  const [titulo, setTitulo] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [ordem, setOrdem] = useState<number>(1);

  const fetchAll = async () => {
    setLoading(true);
    const client = supabase as any;
    const [r, e, a] = await Promise.all([
      client.from('clube_rotas').select('id,titulo').order('ordem', { ascending: true }),
      client.from('clube_estacoes').select('id,titulo,rota_id').order('ordem', { ascending: true }),
      client.from('clube_v3_station_audios').select('*').order('created_at', { ascending: false }),
    ]);
    if (r.error) toast.error('Erro ao carregar rotas');
    if (e.error) toast.error('Erro ao carregar estações');
    if (a.error) toast.error('Erro ao carregar áudios');
    setRotas(((r.data ?? []) as any[]).map(x => ({ id: x.id, title: x.titulo })));
    setEstacoes(((e.data ?? []) as any[]).map(x => ({ id: x.id, title: x.titulo, route_id: x.rota_id })));
    setAudios((a.data ?? []) as EscutaAudio[]);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const estacoesFiltradas = useMemo(
    () => estacoes.filter(s => !rotaId || s.route_id === rotaId),
    [estacoes, rotaId]
  );

  const stationMap = useMemo(() => {
    const m = new Map<string, Estacao>();
    estacoes.forEach(s => m.set(s.id, s));
    return m;
  }, [estacoes]);

  const routeMap = useMemo(() => {
    const m = new Map<string, Rota>();
    rotas.forEach(r => m.set(r.id, r));
    return m;
  }, [rotas]);

  const handleSave = async () => {
    if (!rotaId) return toast.error('Selecione uma Rota');
    if (!estacaoId) return toast.error('Selecione uma Estação');
    if (!titulo.trim()) return toast.error('Informe o título');
    if (!audioUrl) return toast.error('Envie o arquivo de áudio');

    setSaving(true);
    const { error } = await (supabase as any).from('clube_v3_station_audios').insert({
      title: titulo.trim(),
      audio_url: audioUrl,
      station_id: estacaoId,
      display_order: ordem,
      destino,
      status: 'published',
    });
    setSaving(false);

    if (error) return toast.error('Erro ao salvar: ' + error.message);
    toast.success('Escuta Ritual cadastrada');
    setTitulo(''); setAudioUrl(''); setOrdem(1);
    fetchAll();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remover esta escuta?')) return;
    const { error } = await supabase.from('clube_v3_station_audios').delete().eq('id', id);
    if (error) return toast.error('Erro ao remover');
    toast.success('Removido');
    fetchAll();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif flex items-center gap-2">
          <Headphones className="w-6 h-6 text-gold" />
          Escuta Ritual da Estação
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Vincule áudios rituais a uma Rota e Estação existentes.
        </p>
      </div>

      {!loading && (rotas.length === 0 || estacoes.length === 0) && (
        <Card className="p-4 border-amber-500/40 bg-amber-500/5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
          <div className="text-sm">
            É necessário existir ao menos uma <strong>Rota</strong> e uma <strong>Estação</strong> antes de cadastrar áudios.
          </div>
        </Card>
      )}

      <Card className="p-6 space-y-4">
        <h3 className="font-medium">Nova Escuta</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Rota *</Label>
            <Select value={rotaId} onValueChange={(v) => { setRotaId(v); setEstacaoId(''); }}>
              <SelectTrigger><SelectValue placeholder="Selecione uma rota" /></SelectTrigger>
              <SelectContent>
                {rotas.map(r => <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Estação *</Label>
            <Select value={estacaoId} onValueChange={setEstacaoId} disabled={!rotaId}>
              <SelectTrigger>
                <SelectValue placeholder={rotaId ? 'Selecione uma estação' : 'Selecione a rota primeiro'} />
              </SelectTrigger>
              <SelectContent>
                {estacoesFiltradas.map(s => <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Destino (página/aba onde o áudio aparecerá) *</Label>
            <Select value={destino} onValueChange={setDestino}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {DESTINOS.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Título *</Label>
            <Input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ex.: Escuta de Abertura" />
          </div>

          <div className="space-y-2">
            <Label>Ordem</Label>
            <Input type="number" min={1} value={ordem} onChange={e => setOrdem(parseInt(e.target.value) || 1)} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <AudioUpload value={audioUrl} onChange={setAudioUrl} folder="escuta-ritual" label="Arquivo de áudio *" />
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving || !rotaId || !estacaoId || !titulo || !audioUrl}>
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Cadastrar Escuta
        </Button>
      </Card>

      <Card className="p-6">
        <h3 className="font-medium mb-4">Áudios cadastrados ({audios.length})</h3>
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : audios.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma escuta cadastrada.</p>
        ) : (
          <div className="space-y-3">
            {audios.map(a => {
              const est = a.station_id ? stationMap.get(a.station_id) : null;
              const rot = est?.route_id ? routeMap.get(est.route_id) : null;
              return (
                <div key={a.id} className="border border-border/40 rounded-lg p-3 flex flex-col md:flex-row md:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{a.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {rot?.title ?? '— sem rota'} › {est?.title ?? '— sem estação'} · destino <strong>{a.destino ?? 'escuta_ritual'}</strong> · ordem {a.display_order ?? '—'}
                    </div>
                    <audio src={a.audio_url} controls className="mt-2 w-full max-w-md" preload="none" />
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <a href={a.audio_url} target="_blank" rel="noreferrer" download>
                        <Download className="w-4 h-4" />
                      </a>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(a.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

export default AdminEscutaRitualTab;
