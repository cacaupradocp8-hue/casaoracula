// ============================================
// Editor de Blocos de Conteúdo para Aulas do Clube do Livro
// Permite ao admin adicionar/editar/reordenar blocos estruturados
// ============================================

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plus, Trash2, ChevronUp, ChevronDown,
  Sparkles, Brain, Briefcase, Compass, Sun, FileText, BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AulaBloco {
  tipo: string;
  titulo: string;
  conteudo: string;
  ordem: number;
}

const TIPOS_BLOCO = [
  { value: 'essencia', label: 'Essência', icon: Sparkles, cor: 'text-amber-400' },
  { value: 'raiz_psiquica', label: 'Raiz Psíquica', icon: Brain, cor: 'text-violet-400' },
  { value: 'traducao_profissional', label: 'Tradução Profissional', icon: Briefcase, cor: 'text-teal-400' },
  { value: 'atravessamento', label: 'Atravessamento', icon: Compass, cor: 'text-rose-400' },
  { value: 'integracao_oracular', label: 'Integração Oracular', icon: Sun, cor: 'text-gold' },
  { value: 'registro', label: 'Registro', icon: FileText, cor: 'text-sky-400' },
  { value: 'texto_livre', label: 'Texto Livre', icon: BookOpen, cor: 'text-muted-foreground' },
];

interface AulaBlocosEditorProps {
  blocos: AulaBloco[];
  onChange: (blocos: AulaBloco[]) => void;
}

export function AulaBlocosEditor({ blocos, onChange }: AulaBlocosEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const addBloco = () => {
    const newBloco: AulaBloco = {
      tipo: 'essencia',
      titulo: '',
      conteudo: '',
      ordem: blocos.length + 1,
    };
    onChange([...blocos, newBloco]);
    setExpandedIndex(blocos.length);
  };

  const updateBloco = (index: number, field: keyof AulaBloco, value: string | number) => {
    const updated = [...blocos];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeBloco = (index: number) => {
    const updated = blocos.filter((_, i) => i !== index).map((b, i) => ({ ...b, ordem: i + 1 }));
    onChange(updated);
    setExpandedIndex(null);
  };

  const moveBloco = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocos.length) return;
    const updated = [...blocos];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated.map((b, i) => ({ ...b, ordem: i + 1 })));
    setExpandedIndex(newIndex);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Blocos de Conteúdo</Label>
        <Button type="button" size="sm" variant="outline" onClick={addBloco} className="gap-1 text-xs h-7">
          <Plus className="w-3 h-3" />
          Bloco
        </Button>
      </div>

      {blocos.length === 0 ? (
        <div className="text-center py-4 border border-dashed rounded-lg">
          <p className="text-xs text-muted-foreground">Nenhum bloco adicionado.</p>
          <Button type="button" size="sm" variant="ghost" onClick={addBloco} className="mt-2 text-xs">
            <Plus className="w-3 h-3 mr-1" />
            Adicionar primeiro bloco
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {blocos.map((bloco, i) => {
            const tipoConfig = TIPOS_BLOCO.find(t => t.value === bloco.tipo) || TIPOS_BLOCO[6];
            const Icon = tipoConfig.icon;
            const isExpanded = expandedIndex === i;

            return (
              <Card key={i} className={cn('overflow-hidden', isExpanded && 'border-gold/40')}>
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : i)}
                  className="w-full flex items-center gap-2 p-3 text-left hover:bg-muted/10 transition-colors"
                >
                  <Icon className={cn('w-4 h-4 shrink-0', tipoConfig.cor)} />
                  <span className="text-xs font-medium flex-1 truncate">
                    {bloco.titulo || tipoConfig.label}
                  </span>
                  <Badge variant="outline" className="text-[9px] shrink-0">{tipoConfig.label}</Badge>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <Button type="button" size="sm" variant="ghost" className="h-5 w-5 p-0" onClick={(e) => { e.stopPropagation(); moveBloco(i, 'up'); }} disabled={i === 0}>
                      <ChevronUp className="w-3 h-3" />
                    </Button>
                    <Button type="button" size="sm" variant="ghost" className="h-5 w-5 p-0" onClick={(e) => { e.stopPropagation(); moveBloco(i, 'down'); }} disabled={i === blocos.length - 1}>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                    <Button type="button" size="sm" variant="ghost" className="h-5 w-5 p-0 text-destructive" onClick={(e) => { e.stopPropagation(); removeBloco(i); }}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </button>

                {isExpanded && (
                  <CardContent className="pt-0 pb-3 px-3 space-y-3 border-t">
                    <div className="grid grid-cols-2 gap-3 pt-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Tipo</Label>
                        <Select value={bloco.tipo} onValueChange={(v) => updateBloco(i, 'tipo', v)}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TIPOS_BLOCO.map(t => (
                              <SelectItem key={t.value} value={t.value}>
                                <span className="flex items-center gap-2">
                                  <t.icon className={cn('w-3 h-3', t.cor)} />
                                  {t.label}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Título</Label>
                        <Input
                          className="h-8 text-xs"
                          value={bloco.titulo}
                          onChange={(e) => updateBloco(i, 'titulo', e.target.value)}
                          placeholder={tipoConfig.label}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Conteúdo (suporta **negrito** e *itálico*)</Label>
                      <Textarea
                        className="min-h-[100px] text-xs"
                        value={bloco.conteudo}
                        onChange={(e) => updateBloco(i, 'conteudo', e.target.value)}
                        placeholder="Escreva o conteúdo deste bloco..."
                      />
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
