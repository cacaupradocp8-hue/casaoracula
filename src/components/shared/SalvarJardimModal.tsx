// ============================================
// MODAL: SALVAR NO JARDIM DA PSIQUE
// ============================================
// Aparece ao finalizar uma ferramenta aplicada em si mesma

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Leaf, X } from 'lucide-react';
import { useJardimPsique, NovoRegistroJardim } from '@/hooks/useJardimPsique';

interface SalvarJardimModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ferramenta_nome: string;
  ferramenta_chave: string;
  conteudo: Record<string, unknown>;
  resultado_simbolico?: Record<string, unknown>;
  onSaved?: (registroId: string) => void;
  onSkipped?: () => void;
}

export function SalvarJardimModal({
  open,
  onOpenChange,
  ferramenta_nome,
  ferramenta_chave,
  conteudo,
  resultado_simbolico,
  onSaved,
  onSkipped,
}: SalvarJardimModalProps) {
  const [reflexao, setReflexao] = useState('');
  const [saving, setSaving] = useState(false);
  const { salvarRegistro } = useJardimPsique();

  const handleSalvar = async () => {
    setSaving(true);
    try {
      const novoRegistro: NovoRegistroJardim = {
        ferramenta_nome,
        ferramenta_chave,
        conteudo,
        resultado_simbolico,
        reflexao_pessoal: reflexao || undefined,
      };

      const registroId = await salvarRegistro(novoRegistro);

      if (registroId) {
        onSaved?.(registroId);
        onOpenChange(false);
        setReflexao('');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    onSkipped?.();
    onOpenChange(false);
    setReflexao('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Leaf className="w-5 h-5 text-emerald-500" />
            Salvar no Jardim da Psique?
          </DialogTitle>
          <DialogDescription>
            Este é seu espaço privado de registros. Ninguém mais tem acesso.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-muted/30 p-3 text-sm">
            <p className="text-muted-foreground">
              Ferramenta: <span className="text-foreground font-medium">{ferramenta_nome}</span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reflexao" className="text-sm">
              Reflexões da Tecelã <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Textarea
              id="reflexao"
              placeholder="O que essa leitura despertou em você? Anote livremente..."
              value={reflexao}
              onChange={(e) => setReflexao(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="ghost"
            onClick={handleSkip}
            disabled={saving}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Não salvar
          </Button>
          <Button
            onClick={handleSalvar}
            disabled={saving}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            <Leaf className="w-4 h-4" />
            {saving ? 'Salvando...' : 'Salvar no Jardim'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
