import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PenLine, Eye, Lock, Loader2, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useStudentTracking } from '@/hooks/useStudentTracking';

interface Props {
  saving: boolean;
  onCriar: (content: string, type: string, shared: boolean) => Promise<boolean>;
}

export function RegistroHojeBloco({ saving, onCriar }: Props) {
  const [content, setContent] = useState('');
  const [shared, setShared] = useState(false);
  const { track } = useStudentTracking();

  const handleSubmit = async () => {
    if (!content.trim()) return;
    const ok = await onCriar(content.trim(), 'reflexao', shared);
    if (ok) {
      track('jardim-da-psique', 'saved_reflection', 'registro_jardim');
      toast.success('🌿 Registro guardado no seu Jardim');
      setContent('');
      setShared(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="space-y-2"
    >
      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 px-1">
        Seu registro de hoje
      </p>
      <Card className="border-border/15 bg-card/60">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <PenLine className="w-4 h-4 text-primary/50" />
            <span className="text-xs font-medium text-foreground/70">
              Escreva o que tocou você hoje
            </span>
          </div>

          <Textarea
            placeholder="Escreva o que tocou você hoje..."
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, 500))}
            className="min-h-[100px] resize-none bg-background/50 text-sm border-border/15 focus:border-primary/30"
            maxLength={500}
          />

          <div className="flex items-center justify-between text-xs text-muted-foreground/40">
            <span>{content.length}/500</span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-muted/15 p-3">
            <div className="flex items-center gap-2">
              {shared
                ? <Eye className="w-4 h-4 text-primary/60" />
                : <Lock className="w-4 h-4 text-muted-foreground/40" />
              }
              <Label className="text-xs text-foreground/50 cursor-pointer">
                {shared ? 'Terapeuta poderá ver' : 'Só eu vejo'}
              </Label>
            </div>
            <Switch checked={shared} onCheckedChange={setShared} />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={saving || !content.trim()}
            className="w-full bg-primary/15 hover:bg-primary/25 text-primary border border-primary/20 gap-2 text-sm h-11"
            variant="ghost"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Salvar no meu Jardim
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
