
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, ChevronDown, ChevronUp, ArrowLeft, PenLine } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type View = 'overview' | 'escrita' | 'history';

const PROMPTS = [
  { value: 'nunca_disse', label: 'O que eu nunca disse para...' },
  { value: 'sem_medo', label: 'Se eu não tivesse medo...' },
  { value: 'verdade_crua', label: 'A verdade que eu evito é...' },
  { value: 'raiva', label: 'Eu tenho raiva de...' },
  { value: 'vergonha', label: 'Eu tenho vergonha de...' },
  { value: 'desejo_proibido', label: 'O que eu desejo mas não me permito...' },
  { value: 'corpo_fala', label: 'Se meu corpo pudesse falar, diria...' },
  { value: 'carta_nunca_enviada', label: 'Carta que nunca enviei para...' },
  { value: 'livre', label: 'Escrita livre (sem prompt)' },
];

export default function EscritaNaoCensuradaPage() {
  const { clienteId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [view, setView] = useState<View>('overview');

  const [conteudo, setConteudo] = useState('');
  const [prompt, setPrompt] = useState('');

  const [historico, setHistorico] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const wordCount = conteudo.trim() ? conteudo.trim().split(/\s+/).length : 0;
  const pageCount = Math.max(1, Math.ceil(wordCount / 250));

  const loadHistory = async () => {
    if (!clienteId) return;
    setLoadingHistory(true);
    const { data } = await (supabase
      .from('escrita_nao_censurada' as any)
      .select('*')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false }) as any);
    setHistorico(data || []);
    setLoadingHistory(false);
  };

  useEffect(() => { if (view === 'history') loadHistory(); }, [view]);

  const handleSave = async () => {
    if (!clienteId || !user || !conteudo.trim()) {
      toast.error('Escreva algo antes de salvar.');
      return;
    }
    setSaving(true);
    const { error } = await (supabase.from('escrita_nao_censurada' as any).insert({
      cliente_id: clienteId,
      therapist_id: user.id,
      conteudo_escrita: conteudo,
      prompt_utilizado: prompt && prompt !== 'livre' ? PROMPTS.find(p => p.value === prompt)?.label || prompt : null,
    }) as any);
    setSaving(false);
    if (error) { toast.error('Erro ao salvar escrita.'); return; }
    toast.success('Escrita salva com sucesso.');
    setConteudo(''); setPrompt('');
    setView('overview');
  };

  // --- OVERVIEW ---
  if (view === 'overview') {
    return (
      <CasaMaquinasLayout title="Escrita Não-Censurada">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 text-[#F5F1E8]/50 hover:text-[#F5F1E8]">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Button>
        <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60 mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#C9A24A]/20 flex items-center justify-center">
                <PenLine className="w-5 h-5 text-[#C9A24A]" />
              </div>
              <CardTitle className="text-[#F5F1E8] text-lg">Escrita Não-Censurada</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[#F5F1E8]/70 leading-relaxed">
              Espaço protegido para escrita livre, sem edição, sem censura interna. A cliente escreve tudo 
              o que emerge — pensamentos, emoções, impulsos — sem se preocupar com forma, coerência ou julgamento.
              O objetivo é dar passagem ao material inconsciente através da palavra escrita.
            </p>
            <p className="text-xs text-[#F5F1E8]/40">
              Prompts opcionais estão disponíveis para direcionar a escrita quando necessário.
            </p>
            <div className="flex gap-3 pt-2">
              <Button onClick={() => setView('escrita')} variant="gold">Iniciar Escrita</Button>
              <Button onClick={() => setView('history')} variant="outline" className="border-[#C9A24A]/20 text-[#C9A24A]">Ver Histórico</Button>
            </div>
          </CardContent>
        </Card>
      </CasaMaquinasLayout>
    );
  }

  // --- ESCRITA LIVRE ---
  if (view === 'escrita') {
    return (
      <CasaMaquinasLayout title="Escrita Livre">
        <Button variant="ghost" size="sm" onClick={() => setView('overview')} className="mb-4 text-[#F5F1E8]/50 hover:text-[#F5F1E8]">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Button>
        <div className="space-y-6">
          <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
            <CardHeader>
              <CardTitle className="text-[#F5F1E8] text-base">Prompts Sugeridos</CardTitle>
              <p className="text-xs text-[#F5F1E8]/40">Opcional — escolha um ponto de partida ou escreva livremente.</p>
            </CardHeader>
            <CardContent>
              <Select value={prompt} onValueChange={setPrompt}>
                <SelectTrigger className="bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8]">
                  <SelectValue placeholder="Escolha um prompt (opcional)..." />
                </SelectTrigger>
                <SelectContent>
                  {PROMPTS.map(p => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#F5F1E8] text-base">Escreva</CardTitle>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-[9px] border-[#C9A24A]/20 text-[#C9A24A]">
                    {wordCount} {wordCount === 1 ? 'palavra' : 'palavras'}
                  </Badge>
                  <Badge variant="outline" className="text-[9px] border-[#556B57]/30 text-[#556B57]">
                    ~{pageCount} {pageCount === 1 ? 'página' : 'páginas'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={conteudo}
                onChange={e => setConteudo(e.target.value)}
                placeholder="Escreva sem censurar. Sem editar. Sem julgar. Deixe fluir..."
                className="min-h-[350px] bg-[#0B1B2B] border-[#C9A24A]/10 text-[#F5F1E8] placeholder:text-[#F5F1E8]/30 text-sm leading-relaxed"
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} variant="gold" disabled={saving || !conteudo.trim()}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Salvar Escrita
            </Button>
          </div>
        </div>
      </CasaMaquinasLayout>
    );
  }

  // --- HISTORY ---
  return (
    <CasaMaquinasLayout title="Histórico de Escritas">
      <Button variant="ghost" size="sm" onClick={() => setView('overview')} className="mb-4 text-[#F5F1E8]/50 hover:text-[#F5F1E8]">
        <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
      </Button>

      {loadingHistory ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" /></div>
      ) : historico.length === 0 ? (
        <p className="text-sm text-[#F5F1E8]/40 text-center py-10">Nenhuma escrita registrada.</p>
      ) : (
        <div className="space-y-3">
          {historico.map((h: any) => {
            const expanded = expandedId === h.id;
            const trecho = (h.conteudo_escrita || '').substring(0, 120);
            return (
              <Card key={h.id} className="border-[#C9A24A]/10 bg-[#0B1B2B]/60 cursor-pointer"
                onClick={() => setExpandedId(expanded ? null : h.id)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <PenLine className="w-4 h-4 text-[#C9A24A]" />
                      <span className="text-sm text-[#F5F1E8]">
                        {format(new Date(h.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </span>
                      {h.prompt_utilizado && (
                        <Badge variant="outline" className="text-[9px] border-[#C9A24A]/20 text-[#C9A24A]">
                          {h.prompt_utilizado}
                        </Badge>
                      )}
                    </div>
                    {expanded ? <ChevronUp className="w-4 h-4 text-[#F5F1E8]/40" /> : <ChevronDown className="w-4 h-4 text-[#F5F1E8]/40" />}
                  </div>
                  {!expanded && trecho && (
                    <p className="text-xs text-[#F5F1E8]/40 mt-1 line-clamp-2">{trecho}...</p>
                  )}
                  {expanded && (
                    <div className="mt-4 border-t border-[#C9A24A]/10 pt-4">
                      <p className="text-sm text-[#F5F1E8]/70 whitespace-pre-wrap leading-relaxed">{h.conteudo_escrita}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </CasaMaquinasLayout>
  );
}
