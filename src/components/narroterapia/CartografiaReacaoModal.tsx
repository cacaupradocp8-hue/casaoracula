import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { User, Users, Sparkles, Shield, Loader2 } from 'lucide-react';

type TipoUso = 'individual' | 'grupo' | 'ritualistico';

interface CartografiaReacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  contoClinicoId?: string;
  audioId?: string;
  contoTitulo?: string;
}

export function CartografiaReacaoModal({ 
  isOpen, 
  onClose, 
  contoClinicoId, 
  audioId,
  contoTitulo 
}: CartografiaReacaoModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [tipoUso, setTipoUso] = useState<TipoUso | undefined>();
  const [observacoes, setObservacoes] = useState('');

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Usuário não autenticado');
      
      // Using any to bypass type checking for new table
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client = supabase as any;
      
      const { error } = await client
        .from('narroterapia_reacoes_simbolicas')
        .insert({
          user_id: user.id,
          conto_clinico_id: contoClinicoId || null,
          audio_id: audioId || null,
          tipo_uso: tipoUso,
          observacoes: observacoes.trim() || null,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Registro salvo com sucesso' });
      queryClient.invalidateQueries({ queryKey: ['narroterapia-reacoes'] });
      handleClose();
    },
    onError: (error) => {
      toast({ 
        title: 'Erro ao salvar registro', 
        description: String(error), 
        variant: 'destructive' 
      });
    },
  });

  const handleClose = () => {
    setTipoUso(undefined);
    setObservacoes('');
    onClose();
  };

  const handleSave = () => {
    saveMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">
            Cartografia da Reação Simbólica™
          </DialogTitle>
          <DialogDescription>
            {contoTitulo 
              ? `Registro após uso do conto: ${contoTitulo}`
              : 'Registro privado da facilitadora após uso clínico.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Private Notice */}
          <Alert className="border-gold/50 bg-gold/5">
            <Shield className="w-4 h-4 text-gold" />
            <AlertDescription className="text-gold-light text-xs">
              Este registro é privado. Nunca será exibido para a cliente.
            </AlertDescription>
          </Alert>

          {/* Tipo de Uso */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tipo de uso</Label>
            <RadioGroup 
              value={tipoUso} 
              onValueChange={(v) => setTipoUso(v as TipoUso)}
              className="grid grid-cols-3 gap-2"
            >
              <div className="flex items-center">
                <RadioGroupItem value="individual" id="individual" className="sr-only" />
                <Label 
                  htmlFor="individual" 
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all w-full ${
                    tipoUso === 'individual' 
                      ? 'border-gold bg-gold/10 text-gold' 
                      : 'border-border hover:border-gold/50'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="text-xs">Individual</span>
                </Label>
              </div>
              
              <div className="flex items-center">
                <RadioGroupItem value="grupo" id="grupo" className="sr-only" />
                <Label 
                  htmlFor="grupo" 
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all w-full ${
                    tipoUso === 'grupo' 
                      ? 'border-gold bg-gold/10 text-gold' 
                      : 'border-border hover:border-gold/50'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span className="text-xs">Grupo</span>
                </Label>
              </div>
              
              <div className="flex items-center">
                <RadioGroupItem value="ritualistico" id="ritualistico" className="sr-only" />
                <Label 
                  htmlFor="ritualistico" 
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all w-full ${
                    tipoUso === 'ritualistico' 
                      ? 'border-gold bg-gold/10 text-gold' 
                      : 'border-border hover:border-gold/50'
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xs">Ritualístico</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes" className="text-sm font-medium">
              Observações (opcional)
            </Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Registre aqui suas percepções sobre a reação da cliente, movimentos observados, resistências, aberturas..."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Este campo é para anotações clínicas privadas.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Salvar Registro
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
