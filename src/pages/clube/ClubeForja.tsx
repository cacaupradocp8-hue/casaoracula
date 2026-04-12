import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Hammer, MessageSquareQuote, Footprints, BookOpen,
  Filter, Eye, Pencil, X, AlertTriangle, Stethoscope,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

const TIPO_META: Record<string, { label: string; icon: React.ElementType; accent: string }> = {
  pergunta_clinica: { label: 'Pergunta Clínica', icon: MessageSquareQuote, accent: 'text-amber-400 border-amber-400/20' },
  exercicio_narrativo: { label: 'Exercício Narrativo', icon: Hammer, accent: 'text-emerald-400 border-emerald-400/20' },
  mini_travessia: { label: 'Mini Travessia', icon: Footprints, accent: 'text-purple-400 border-purple-400/20' },
};

function getBadgeColor(tipo: string) {
  return TIPO_META[tipo]?.accent || 'text-muted-foreground border-border';
}

export default function ClubeForja() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filterTipo, setFilterTipo] = useState<string>('all');
  const [selectedTool, setSelectedTool] = useState<any>(null);

  const { data: tools = [], isLoading } = useQuery({
    queryKey: ['club-tools', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from('club_tools' as any)
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      return (data || []) as any[];
    },
  });

  const filtered = filterTipo === 'all' ? tools : tools.filter((t: any) => t.tipo === filterTipo);

  return (
    <AppLayout>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <div className="sticky top-0 z-20 border-b border-[#2A2340] bg-background/95 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate('/clube/ciclo')} className="h-8 w-8">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Hammer className="w-5 h-5 text-[hsl(var(--gold))]" />
                    Forja Narrativa
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">O que você cria, você sustenta.</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/clube/chat-livro')}
                className="text-xs text-[hsl(var(--gold))] hover:bg-[hsl(var(--gold)_/_0.08)]"
              >
                <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                Converse com o Livro
              </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mt-4">
              <Select value={filterTipo} onValueChange={setFilterTipo}>
                <SelectTrigger className="w-48 h-9 bg-[#13101C] border-[#2A2340] text-xs">
                  <Filter className="w-3 h-3 mr-1.5 text-muted-foreground" />
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="pergunta_clinica">Pergunta Clínica</SelectItem>
                  <SelectItem value="exercicio_narrativo">Exercício Narrativo</SelectItem>
                  <SelectItem value="mini_travessia">Mini Travessia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-pulse text-muted-foreground text-sm">Carregando ferramentas…</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Hammer className="w-10 h-10 text-muted-foreground/30 mb-4" />
              <p className="text-sm text-muted-foreground">Nenhuma ferramenta ainda.</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Use o chat para criar suas primeiras ferramentas.</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/clube/chat-livro')}
                className="mt-4 text-[hsl(var(--gold))] hover:bg-[hsl(var(--gold)_/_0.08)]"
              >
                <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                Ir para o Chat
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((tool: any) => {
                const meta = TIPO_META[tool.tipo] || { label: tool.tipo, icon: Hammer, accent: '' };
                const Icon = meta.icon;
                return (
                  <Card
                    key={tool.id}
                    className="group bg-[#13101C] border-[#2A2340] hover:border-[hsl(var(--gold)_/_0.3)] transition-all cursor-pointer overflow-hidden"
                    onClick={() => setSelectedTool(tool)}
                  >
                    <div className="p-4 space-y-3">
                      {/* Badge */}
                      <div className={cn('inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider border rounded-full px-2.5 py-1', getBadgeColor(tool.tipo))}>
                        <Icon className="w-3 h-3" />
                        {meta.label}
                      </div>

                      {/* Content preview */}
                      <p className="text-sm text-foreground/90 line-clamp-3 leading-relaxed">
                        {tool.conteudo?.slice(0, 150) || '—'}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#2A2340]">
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(tool.created_at).toLocaleDateString('pt-BR')}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail Modal */}
        <Dialog open={!!selectedTool} onOpenChange={() => setSelectedTool(null)}>
          <DialogContent className="max-w-lg bg-background border-[#2A2340] p-0 gap-0">
            <DialogHeader className="px-5 pt-5 pb-3 border-b border-[#2A2340]">
              <div className="flex items-center gap-2">
                {selectedTool && (() => {
                  const meta = TIPO_META[selectedTool.tipo] || { label: selectedTool.tipo, icon: Hammer, accent: '' };
                  const Icon = meta.icon;
                  return (
                    <div className={cn('inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider border rounded-full px-2.5 py-1', getBadgeColor(selectedTool.tipo))}>
                      <Icon className="w-3 h-3" />
                      {meta.label}
                    </div>
                  );
                })()}
              </div>
              <DialogTitle className="text-sm font-semibold mt-2">Detalhes da Ferramenta</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Criada em {selectedTool && new Date(selectedTool.created_at).toLocaleDateString('pt-BR')}
              </DialogDescription>
            </DialogHeader>

            {selectedTool && (
              <div className="px-5 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Content */}
                <div>
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Conteúdo</h4>
                  <div className="prose prose-sm prose-invert max-w-none text-sm">
                    <ReactMarkdown>{selectedTool.conteudo || '—'}</ReactMarkdown>
                  </div>
                </div>

                {/* Contexto de uso */}
                {selectedTool.contexto_uso && (
                  <div className="border-t border-[#2A2340] pt-3">
                    <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                      <Stethoscope className="w-3 h-3" />
                      Contexto de uso
                    </h4>
                    <p className="text-sm text-foreground/80">{selectedTool.contexto_uso}</p>
                  </div>
                )}

                {/* Limite ético */}
                {selectedTool.limite_etico && (
                  <div className="border-t border-[#2A2340] pt-3">
                    <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                      Limite ético
                    </h4>
                    <p className="text-sm text-foreground/80">{selectedTool.limite_etico}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
