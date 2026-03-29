import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, BookOpen, Scroll, HelpCircle, Flower2, Headphones, Check, Eye, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface SemanaRecord {
  id: string;
  livro: string;
  capitulo_trecho: string;
  semana_numero: number;
  podcast_roteiro: string | null;
  podcast_audio_url: string | null;
  carta_semana: string | null;
  pergunta_contemplativa: string | null;
  pratica_terapeutica: string | null;
  status: string;
  publicado_em: string | null;
  created_at: string;
}

export default function AdminGeradorSemanal() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [livro, setLivro] = useState('');
  const [trecho, setTrecho] = useState('');
  const [semanaNumero, setSemanaNumero] = useState(1);
  const [preview, setPreview] = useState<SemanaRecord | null>(null);

  const { data: semanas = [], isLoading } = useQuery({
    queryKey: ['clube-livro-semana-admin'],
    queryFn: async () => {
      const { data } = await supabase
        .from('clube_livro_semana')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      return (data || []) as SemanaRecord[];
    },
  });

  const gerarMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('gerar-semana-clube', {
        body: { livro, capitulo_trecho: trecho, semana_numero: semanaNumero },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({ title: '✨ Conteúdos gerados!', description: 'A alquimia semanal está pronta.' });
      setPreview(data.record);
      queryClient.invalidateQueries({ queryKey: ['clube-livro-semana-admin'] });
      setLivro('');
      setTrecho('');
    },
    onError: (err: any) => {
      toast({ title: 'Erro na geração', description: err.message, variant: 'destructive' });
    },
  });

  const publicarMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clube_livro_semana')
        .update({ status: 'publicado', publicado_em: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Publicado!', description: 'Conteúdo disponível em /clube-livro/semana' });
      queryClient.invalidateQueries({ queryKey: ['clube-livro-semana-admin'] });
      setPreview(null);
    },
  });

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-card/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-primary" />
            Gerador Semanal — Alquimista de Conteúdo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Livro da semana</label>
                <Input
                  value={livro}
                  onChange={(e) => setLivro(e.target.value)}
                  placeholder="Ex: Mulheres que Correm com os Lobos"
                  className="bg-background/50"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Capítulo ou trecho da semana</label>
                <Textarea
                  value={trecho}
                  onChange={(e) => setTrecho(e.target.value)}
                  placeholder="Cole o trecho ou descreva o capítulo a ser trabalhado..."
                  className="bg-background/50 min-h-[120px]"
                />
              </div>
              <div className="w-32">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Semana nº</label>
                <Input
                  type="number"
                  min={1}
                  value={semanaNumero}
                  onChange={(e) => setSemanaNumero(Number(e.target.value))}
                  className="bg-background/50"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={() => gerarMutation.mutate()}
            disabled={!livro.trim() || !trecho.trim() || gerarMutation.isPending}
            className="w-full"
            variant="gold"
          >
            {gerarMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Alquimizando conteúdos...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Gerar conteúdos da semana
              </>
            )}
          </Button>

          {gerarMutation.isPending && (
            <p className="text-xs text-muted-foreground text-center animate-pulse">
              Extraindo símbolos · Traduzindo psicologicamente · Gerando áudio...
            </p>
          )}
        </CardContent>
      </Card>

      {/* Preview of generated content */}
      {preview && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="w-4 h-4" /> Prévia — Semana {preview.semana_numero}
              </CardTitle>
              <Button
                size="sm"
                variant="gold"
                onClick={() => publicarMutation.mutate(preview.id)}
                disabled={publicarMutation.isPending}
              >
                <Send className="w-3 h-3 mr-1" /> Publicar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <PreviewSection icon={<Headphones className="w-4 h-4" />} title="Podcast" content={preview.podcast_roteiro} audioUrl={preview.podcast_audio_url} />
            <PreviewSection icon={<Scroll className="w-4 h-4" />} title="Carta da Semana" content={preview.carta_semana} />
            <PreviewSection icon={<HelpCircle className="w-4 h-4" />} title="Pergunta Contemplativa" content={preview.pergunta_contemplativa} />
            <PreviewSection icon={<Flower2 className="w-4 h-4" />} title="Prática Terapêutica" content={preview.pratica_terapeutica} />
          </CardContent>
        </Card>
      )}

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Histórico de semanas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin" /></div>
          ) : semanas.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum conteúdo gerado ainda.</p>
          ) : (
            <div className="space-y-2">
              {semanas.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/20">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{s.livro}</p>
                    <p className="text-xs text-muted-foreground">Semana {s.semana_numero} · {new Date(s.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={s.status === 'publicado' ? 'default' : 'outline'} className="text-[10px]">
                      {s.status === 'publicado' ? <><Check className="w-3 h-3 mr-1" /> Publicado</> : 'Rascunho'}
                    </Badge>
                    {s.status !== 'publicado' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => { setPreview(s); }}
                      >
                        <Eye className="w-3 h-3 mr-1" /> Ver
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PreviewSection({ icon, title, content, audioUrl }: { icon: React.ReactNode; title: string; content: string | null; audioUrl?: string | null }) {
  if (!content) return null;
  return (
    <div className="space-y-1.5 p-3 rounded-lg bg-background/50 border border-border/20">
      <div className="flex items-center gap-2 text-xs font-semibold text-primary">
        {icon}
        {title}
      </div>
      {audioUrl && (
        <audio controls className="w-full h-8 mt-1" src={audioUrl}>
          Seu navegador não suporta áudio.
        </audio>
      )}
      <p className="text-sm text-foreground/80 whitespace-pre-wrap line-clamp-6">{content}</p>
    </div>
  );
}
