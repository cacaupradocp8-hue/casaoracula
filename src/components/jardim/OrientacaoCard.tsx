import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Leaf, CheckCircle, BookOpen, Headphones, Sparkles, MapPin, Target, 
  MessageCircle, Loader2 
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { Orientacao } from '@/hooks/useOrientacoes';

const TIPO_CONFIG: Record<string, { icon: any; label: string; color: string }> = {
  pratica: { icon: BookOpen, label: 'Prática', color: 'text-blue-400 border-blue-500/30' },
  escuta: { icon: Headphones, label: 'Escuta', color: 'text-purple-400 border-purple-500/30' },
  reflexao: { icon: Sparkles, label: 'Reflexão', color: 'text-amber-400 border-amber-500/30' },
  territorio: { icon: MapPin, label: 'Território', color: 'text-rose-400 border-rose-500/30' },
  foco_semana: { icon: Target, label: 'Foco da Semana', color: 'text-emerald-400 border-emerald-500/30' },
};

interface Props {
  orientacao: Orientacao;
  onComplete: (id: string, resposta?: string) => Promise<boolean>;
  onRespond: (id: string, resposta: string) => Promise<boolean>;
  onView: (id: string) => void;
}

export function OrientacaoCard({ orientacao, onComplete, onRespond, onView }: Props) {
  const [resposta, setResposta] = useState(orientacao.resposta_cliente || '');
  const [showRespondForm, setShowRespondForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const config = TIPO_CONFIG[orientacao.tipo] || TIPO_CONFIG.reflexao;
  const Icon = config.icon;

  const handleComplete = async () => {
    setSaving(true);
    await onComplete(orientacao.id, resposta.trim() || undefined);
    setSaving(false);
  };

  const handleRespond = async () => {
    if (!resposta.trim()) return;
    setSaving(true);
    const ok = await onRespond(orientacao.id, resposta.trim());
    if (ok) setShowRespondForm(false);
    setSaving(false);
  };

  // Auto-mark as viewed
  if (orientacao.status === 'pending') {
    onView(orientacao.id);
  }

  return (
    <Card className={cn(
      "border-emerald-500/20 bg-emerald-950/10 backdrop-blur-sm transition-all",
      orientacao.status === 'completed' && "opacity-70"
    )}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center border",
              config.color.split(' ')[0].replace('text-', 'bg-').replace('400', '500/10'),
              config.color
            )}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div>
              <Badge variant="outline" className={cn("text-[10px]", config.color)}>
                {config.label}
              </Badge>
              {orientacao.titulo && (
                <p className="text-xs font-medium text-foreground/80 mt-0.5">{orientacao.titulo}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {orientacao.status === 'completed' && (
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            )}
            <span className="text-[10px] text-muted-foreground">
              {format(new Date(orientacao.created_at), "dd MMM", { locale: ptBR })}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Leaf className="w-3.5 h-3.5 text-emerald-500/50 mt-0.5 shrink-0" />
          <p className="text-sm text-foreground/70 leading-relaxed whitespace-pre-wrap">
            {orientacao.mensagem}
          </p>
        </div>

        {orientacao.resposta_cliente && !showRespondForm && (
          <div className="ml-5 p-3 rounded-lg bg-card/50 border border-border/20">
            <p className="text-[10px] text-muted-foreground mb-1">Minha reflexão</p>
            <p className="text-xs text-foreground/60 whitespace-pre-wrap">{orientacao.resposta_cliente}</p>
          </div>
        )}

        {orientacao.status !== 'completed' && (
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs h-8 border-border/20 gap-1.5"
              onClick={() => setShowRespondForm(!showRespondForm)}
            >
              <MessageCircle className="w-3 h-3" />
              {showRespondForm ? 'Fechar' : 'Registrar reflexão'}
            </Button>
            <Button
              size="sm"
              className="flex-1 text-xs h-8 bg-emerald-600 hover:bg-emerald-700 gap-1.5"
              onClick={handleComplete}
              disabled={saving}
            >
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
              Concluída
            </Button>
          </div>
        )}

        {showRespondForm && orientacao.status !== 'completed' && (
          <div className="space-y-2 pt-1">
            <Textarea
              value={resposta}
              onChange={e => setResposta(e.target.value)}
              placeholder="O que surgiu para mim ao realizar esta prática..."
              className="min-h-[80px] resize-none text-xs bg-background/50"
              maxLength={500}
            />
            <Button
              size="sm"
              onClick={handleRespond}
              disabled={saving || !resposta.trim()}
              className="w-full text-xs h-8 bg-primary/80 hover:bg-primary gap-1"
            >
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Salvar reflexão'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
