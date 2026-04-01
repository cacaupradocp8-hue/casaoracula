import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles, BookOpen, Headphones, MapPin, MessageCircle,
  Loader2, Check, X, Pencil, RefreshCw, ChevronDown, ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface SugestaoIA {
  pratica_sugerida: string;
  escuta_sugerida: string;
  territorio_foco: string;
  reflexao_sugerida: string;
  mensagem_final_sugerida: string;
  justificativa_clinica: string;
}

interface SugestaoCardProps {
  icon: any;
  label: string;
  value: string;
  tipo: string;
  accepted: boolean;
  edited: boolean;
  onAccept: (tipo: string, value: string) => void;
  onRemove: (tipo: string) => void;
  onEdit: (tipo: string, value: string) => void;
}

function SugestaoCard({ icon: Icon, label, value, tipo, accepted, edited, onAccept, onRemove, onEdit }: SugestaoCardProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSaveEdit = () => {
    onEdit(tipo, editValue);
    setEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl p-3 border transition-all",
        accepted
          ? "border-primary/30 bg-primary/5"
          : "border-border/20 bg-card/50"
      )}
    >
      <div className="flex items-start gap-2.5">
        <div className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
          accepted ? "bg-primary/15" : "bg-muted/30"
        )}>
          <Icon className={cn("w-3.5 h-3.5", accepted ? "text-primary" : "text-muted-foreground/60")} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50 font-medium">{label}</span>
            {accepted && <Badge variant="outline" className="text-[9px] border-primary/20 text-primary/70 h-4 px-1.5">Aceita</Badge>}
            {edited && <Badge variant="outline" className="text-[9px] border-amber-500/20 text-amber-400 h-4 px-1.5">Editada</Badge>}
          </div>
          {editing ? (
            <div className="space-y-2">
              <Textarea
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                className="min-h-[60px] resize-none text-xs bg-background/60"
                maxLength={500}
              />
              <div className="flex gap-1.5">
                <Button size="sm" onClick={handleSaveEdit} className="h-6 text-[10px] bg-primary/80 hover:bg-primary gap-1">
                  <Check className="w-3 h-3" /> Salvar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing(false)} className="h-6 text-[10px] gap-1">
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-foreground/70 leading-relaxed">{value}</p>
          )}
        </div>
      </div>
      {!editing && (
        <div className="flex gap-1 mt-2 ml-9">
          {!accepted && (
            <Button size="sm" variant="ghost" onClick={() => onAccept(tipo, value)} className="h-6 text-[10px] text-primary/70 hover:text-primary gap-1 px-2">
              <Check className="w-3 h-3" /> Aceitar
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => { setEditing(true); setEditValue(value); }} className="h-6 text-[10px] text-muted-foreground/50 hover:text-muted-foreground gap-1 px-2">
            <Pencil className="w-3 h-3" /> Editar
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onRemove(tipo)} className="h-6 text-[10px] text-muted-foreground/40 hover:text-destructive gap-1 px-2">
            <X className="w-3 h-3" /> Remover
          </Button>
        </div>
      )}
    </motion.div>
  );
}

interface Props {
  clienteId: string;
  distritoId?: string;
  ferramentaId?: string;
  checkinState?: string;
  insight?: string;
  notas?: string;
  onApplySugestao: (data: { tipo: string; titulo?: string; mensagem: string }) => void;
}

const CARDS_CONFIG = [
  { key: 'pratica_sugerida', label: 'Prática sugerida', icon: BookOpen, tipo: 'pratica' },
  { key: 'escuta_sugerida', label: 'Escuta sugerida', icon: Headphones, tipo: 'escuta' },
  { key: 'territorio_foco', label: 'Território em foco', icon: MapPin, tipo: 'territorio' },
  { key: 'reflexao_sugerida', label: 'Reflexão sugerida', icon: Sparkles, tipo: 'reflexao' },
  { key: 'mensagem_final_sugerida', label: 'Mensagem para a cliente', icon: MessageCircle, tipo: 'foco_semana' },
] as const;

export function SugestaoIAJardim({ clienteId, distritoId, ferramentaId, checkinState, insight, notas, onApplySugestao }: Props) {
  const [loading, setLoading] = useState(false);
  const [sugestao, setSugestao] = useState<SugestaoIA | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [acceptedCards, setAcceptedCards] = useState<Record<string, string>>({});
  const [editedCards, setEditedCards] = useState<Set<string>>(new Set());
  const [removedCards, setRemovedCards] = useState<Set<string>>(new Set());
  const [showJustificativa, setShowJustificativa] = useState(false);

  const fetchSugestao = async () => {
    setLoading(true);
    setError(null);
    setSugestao(null);
    setAcceptedCards({});
    setEditedCards(new Set());
    setRemovedCards(new Set());

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error: fnError } = await supabase.functions.invoke('sugerir-encaminhamento-jardim', {
        body: { cliente_id: clienteId, distrito_id: distritoId, ferramenta_id: ferramentaId, checkin_state: checkinState, insight, notas },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      if (data?.sugestao) {
        setSugestao(data.sugestao);
      }
    } catch (err: any) {
      console.error('Erro ao buscar sugestão:', err);
      setError(err.message || 'Erro ao gerar sugestão');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = (tipo: string, value: string) => {
    setAcceptedCards(prev => ({ ...prev, [tipo]: value }));
  };

  const handleEdit = (tipo: string, value: string) => {
    setAcceptedCards(prev => ({ ...prev, [tipo]: value }));
    setEditedCards(prev => new Set(prev).add(tipo));
    // Also update sugestao for display
    if (sugestao) {
      const keyMap: Record<string, keyof SugestaoIA> = {
        pratica: 'pratica_sugerida',
        escuta: 'escuta_sugerida',
        territorio: 'territorio_foco',
        reflexao: 'reflexao_sugerida',
        foco_semana: 'mensagem_final_sugerida',
      };
      const sugestaoKey = keyMap[tipo];
      if (sugestaoKey) {
        setSugestao({ ...sugestao, [sugestaoKey]: value });
      }
    }
  };

  const handleRemove = (tipo: string) => {
    setRemovedCards(prev => new Set(prev).add(tipo));
    setAcceptedCards(prev => {
      const next = { ...prev };
      delete next[tipo];
      return next;
    });
  };

  const handleApplyAccepted = () => {
    // Apply the most meaningful accepted card as the orientation
    // Priority: reflexao > pratica > escuta > territorio > mensagem
    const priority = ['reflexao', 'pratica', 'escuta', 'territorio', 'foco_semana'];
    for (const tipo of priority) {
      if (acceptedCards[tipo]) {
        const label = CARDS_CONFIG.find(c => c.tipo === tipo)?.label;
        onApplySugestao({
          tipo,
          titulo: label,
          mensagem: acceptedCards[tipo],
        });
        return;
      }
    }
  };

  const acceptedCount = Object.keys(acceptedCards).length;
  const visibleCards = CARDS_CONFIG.filter(c => !removedCards.has(c.tipo));

  return (
    <div className="space-y-3">
      {/* Trigger button */}
      {!sugestao && !loading && (
        <Card className="border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer" onClick={fetchSugestao}>
          <CardContent className="py-4 text-center space-y-1.5">
            <Sparkles className="w-5 h-5 text-primary/50 mx-auto" />
            <p className="text-xs font-medium text-primary/70">Sugestão de encaminhamento</p>
            <p className="text-[10px] text-muted-foreground/50">
              A IA analisa o contexto da sessão e sugere orientações para o Jardim
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {loading && (
        <Card className="border-primary/15 bg-card/60">
          <CardContent className="py-6 text-center space-y-2">
            <Loader2 className="w-5 h-5 text-primary animate-spin mx-auto" />
            <p className="text-xs text-muted-foreground/60">Analisando contexto da sessão...</p>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="py-3 text-center space-y-2">
            <p className="text-xs text-destructive/70">{error}</p>
            <Button size="sm" variant="outline" onClick={fetchSugestao} className="text-xs h-7 gap-1">
              <RefreshCw className="w-3 h-3" /> Tentar novamente
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Sugestões */}
      <AnimatePresence>
        {sugestao && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between px-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary/50 font-medium">
                Sugestões da IA
              </p>
              <Button size="sm" variant="ghost" onClick={fetchSugestao} className="h-6 text-[10px] text-muted-foreground/40 gap-1 px-2">
                <RefreshCw className="w-3 h-3" /> Gerar novas
              </Button>
            </div>

            {visibleCards.map(({ key, label, icon, tipo }) => (
              <SugestaoCard
                key={key}
                icon={icon}
                label={label}
                value={(sugestao as any)[key] || ''}
                tipo={tipo}
                accepted={!!acceptedCards[tipo]}
                edited={editedCards.has(tipo)}
                onAccept={handleAccept}
                onRemove={handleRemove}
                onEdit={handleEdit}
              />
            ))}

            {/* Justificativa clínica */}
            {sugestao.justificativa_clinica && (
              <button
                onClick={() => setShowJustificativa(!showJustificativa)}
                className="flex items-center gap-1.5 text-[10px] text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors px-1 w-full"
              >
                {showJustificativa ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                Justificativa clínica
              </button>
            )}
            {showJustificativa && sugestao.justificativa_clinica && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="rounded-lg p-3 bg-muted/20 border border-border/10"
              >
                <p className="text-[10px] text-muted-foreground/60 leading-relaxed italic">
                  {sugestao.justificativa_clinica}
                </p>
              </motion.div>
            )}

            {/* Apply button */}
            {acceptedCount > 0 && (
              <Button
                onClick={handleApplyAccepted}
                className="w-full bg-primary hover:bg-primary/80 text-primary-foreground gap-2 text-xs"
              >
                <Check className="w-3.5 h-3.5" />
                Usar sugestão aceita como orientação
              </Button>
            )}

            <p className="text-[10px] text-muted-foreground/30 text-center italic px-4">
              Estas sugestões são orientativas. A decisão final é sempre sua.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
