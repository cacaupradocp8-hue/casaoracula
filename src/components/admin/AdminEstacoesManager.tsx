// ============================================
// ADMIN — Gerenciamento de Estações Simbólicas
// ============================================

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Pencil, ChevronDown, ChevronUp, Lightbulb, GraduationCap, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Estacao } from '@/hooks/useEstacoes';

export function AdminEstacoesManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<Record<string, any>>({});

  const { data: estacoes, isLoading } = useQuery({
    queryKey: ['admin-estacoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_estacoes')
        .select('*')
        .order('ordem');
      if (error) throw error;
      return data as Estacao[];
    },
  });

  const saveEstacao = useMutation({
    mutationFn: async ({ id, fields }: { id: string; fields: Record<string, any> }) => {
      const { error } = await supabase.from('clube_estacoes').update(fields).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-estacoes'] });
      queryClient.invalidateQueries({ queryKey: ['clube-estacoes'] });
      setExpandedId(null);
      setEditFields({});
      toast({ title: 'Estação atualizada ✓' });
    },
    onError: () => {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    },
  });

  if (isLoading) return <div className="text-sm text-muted-foreground animate-pulse">Carregando estações…</div>;

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        8 Estações Simbólicas do Ano Oracular. Edite os conteúdos do Laboratório 80/20 que a aluna verá.
      </p>

      {estacoes?.map((est) => {
        const isExpanded = expandedId === est.id;
        const hasContent = est.essencia_nucleo || est.traducao_aula || est.aplicacao_reflexao;

        return (
          <Card key={est.id} className={cn('border-l-4', est.ativa ? 'border-l-primary' : 'border-l-border')}>
            <CardContent className="p-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xl select-none">{est.fase_lunar || '◯'}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{est.titulo}</p>
                      {est.ativa && <Badge variant="outline" className="text-[10px] border-primary text-primary">ATIVA</Badge>}
                      {est.publicada && <Badge variant="secondary" className="text-[10px]">Publicada</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{est.subtitulo}</p>
                    <p className="text-xs text-foreground mt-0.5">{est.livro_titulo} — {est.livro_autor || '—'}</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (isExpanded) {
                        setExpandedId(null);
                        setEditFields({});
                      } else {
                        setExpandedId(est.id);
                        setEditFields({
                          ativa: est.ativa,
                          publicada: est.publicada,
                          livro_titulo: est.livro_titulo,
                          livro_autor: est.livro_autor || '',
                          livro_capa_url: est.livro_capa_url || '',
                          essencia_nucleo: est.essencia_nucleo || '',
                          essencia_tensao: est.essencia_tensao || '',
                          essencia_transformacao: est.essencia_transformacao || '',
                          traducao_aula: est.traducao_aula || '',
                          traducao_sessao: est.traducao_sessao || '',
                          traducao_circulo: est.traducao_circulo || '',
                          aplicacao_reflexao: est.aplicacao_reflexao || '',
                          aplicacao_acao: est.aplicacao_acao || '',
                        });
                      }
                    }}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <Pencil className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </div>

              {/* Status preview */}
              {!isExpanded && !hasContent && (
                <p className="text-[10px] text-destructive/70 mt-1">⚠ Lab 80/20 vazio — a aluna verá "Conteúdo em construção"</p>
              )}

              {/* Editor */}
              {isExpanded && (
                <div className="mt-4 space-y-4 border-t border-border pt-4">
                  {/* Toggles */}
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={editFields.ativa}
                        onCheckedChange={(v) => setEditFields(prev => ({ ...prev, ativa: v }))}
                      />
                      <Label className="text-xs">Ativa</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={editFields.publicada}
                        onCheckedChange={(v) => setEditFields(prev => ({ ...prev, publicada: v }))}
                      />
                      <Label className="text-xs">Publicada</Label>
                    </div>
                  </div>

                  {/* Livro */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Livro-eixo</Label>
                      <Input value={editFields.livro_titulo} onChange={e => setEditFields(prev => ({ ...prev, livro_titulo: e.target.value }))} />
                    </div>
                    <div>
                      <Label className="text-xs">Autor</Label>
                      <Input value={editFields.livro_autor} onChange={e => setEditFields(prev => ({ ...prev, livro_autor: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">URL da Capa</Label>
                    <Input value={editFields.livro_capa_url} onChange={e => setEditFields(prev => ({ ...prev, livro_capa_url: e.target.value }))} />
                  </div>

                  {/* Bloco 1: Essência */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-muted-foreground flex items-center gap-1"><Lightbulb className="w-3 h-3" /> Bloco 1 — Essência 80/20</p>
                    <div>
                      <Label className="text-xs">Núcleo Vivo</Label>
                      <Textarea value={editFields.essencia_nucleo} onChange={e => setEditFields(prev => ({ ...prev, essencia_nucleo: e.target.value }))} rows={3} />
                    </div>
                    <div>
                      <Label className="text-xs">Tensão Central</Label>
                      <Textarea value={editFields.essencia_tensao} onChange={e => setEditFields(prev => ({ ...prev, essencia_tensao: e.target.value }))} rows={2} />
                    </div>
                    <div>
                      <Label className="text-xs">Transformação Exigida</Label>
                      <Textarea value={editFields.essencia_transformacao} onChange={e => setEditFields(prev => ({ ...prev, essencia_transformacao: e.target.value }))} rows={2} />
                    </div>
                  </div>

                  {/* Bloco 2: Tradução */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-muted-foreground flex items-center gap-1"><GraduationCap className="w-3 h-3" /> Bloco 2 — Tradução Profissional</p>
                    <div>
                      <Label className="text-xs">Aula</Label>
                      <Textarea value={editFields.traducao_aula} onChange={e => setEditFields(prev => ({ ...prev, traducao_aula: e.target.value }))} rows={3} />
                    </div>
                    <div>
                      <Label className="text-xs">Sessão</Label>
                      <Textarea value={editFields.traducao_sessao} onChange={e => setEditFields(prev => ({ ...prev, traducao_sessao: e.target.value }))} rows={3} />
                    </div>
                    <div>
                      <Label className="text-xs">Círculo / Palestra</Label>
                      <Textarea value={editFields.traducao_circulo} onChange={e => setEditFields(prev => ({ ...prev, traducao_circulo: e.target.value }))} rows={3} />
                    </div>
                  </div>

                  {/* Bloco 3: Aplicação */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-muted-foreground flex items-center gap-1"><User className="w-3 h-3" /> Bloco 3 — Aplicação Pessoal</p>
                    <div>
                      <Label className="text-xs">Reflexão Pessoal</Label>
                      <Textarea value={editFields.aplicacao_reflexao} onChange={e => setEditFields(prev => ({ ...prev, aplicacao_reflexao: e.target.value }))} rows={3} />
                    </div>
                    <div>
                      <Label className="text-xs">Ação Concreta</Label>
                      <Textarea value={editFields.aplicacao_acao} onChange={e => setEditFields(prev => ({ ...prev, aplicacao_acao: e.target.value }))} rows={2} />
                    </div>
                  </div>

                  {/* Save */}
                  <div className="flex gap-2 justify-end pt-2">
                    <Button variant="outline" size="sm" onClick={() => { setExpandedId(null); setEditFields({}); }}>
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      disabled={saveEstacao.isPending}
                      onClick={() => saveEstacao.mutate({
                        id: est.id,
                        fields: {
                          ativa: editFields.ativa,
                          publicada: editFields.publicada,
                          livro_titulo: editFields.livro_titulo?.trim(),
                          livro_autor: editFields.livro_autor?.trim() || null,
                          livro_capa_url: editFields.livro_capa_url?.trim() || null,
                          essencia_nucleo: editFields.essencia_nucleo?.trim() || null,
                          essencia_tensao: editFields.essencia_tensao?.trim() || null,
                          essencia_transformacao: editFields.essencia_transformacao?.trim() || null,
                          traducao_aula: editFields.traducao_aula?.trim() || null,
                          traducao_sessao: editFields.traducao_sessao?.trim() || null,
                          traducao_circulo: editFields.traducao_circulo?.trim() || null,
                          aplicacao_reflexao: editFields.aplicacao_reflexao?.trim() || null,
                          aplicacao_acao: editFields.aplicacao_acao?.trim() || null,
                        },
                      })}
                    >
                      {saveEstacao.isPending ? 'Salvando…' : 'Salvar'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
