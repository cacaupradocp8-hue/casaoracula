import { useState } from 'react';
import { Wand2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function GerarCasoIA() {
  const [open, setOpen] = useState(false);
  const [tema, setTema] = useState('');
  const [tipo, setTipo] = useState('grupo');
  const [nivel, setNivel] = useState('1');
  const [loading, setLoading] = useState(false);
  const qc = useQueryClient();

  const handleGenerate = async () => {
    if (!tema.trim()) {
      toast.error('Informe um tema para o caso');
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Você precisa estar autenticada');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-training-case`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ tema, tipo, nivel: Number(nivel) }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao gerar caso');
      }

      toast.success(`Caso "${result.titulo}" criado com sucesso!`);
      qc.invalidateQueries({ queryKey: ['sim-cases'] });
      setTema('');
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Erro ao gerar caso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <Wand2 className="w-3.5 h-3.5" />
          Gerar com IA
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">Gerar Caso com IA</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Tema do caso</Label>
            <Input
              placeholder="Ex: silêncio feminino, medo de abandono, rigidez materna..."
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              className="text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Tipo</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="grupo">Grupo</SelectItem>
                  <SelectItem value="misto">Misto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Nível</Label>
              <Select value={nivel} onValueChange={setNivel}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Nível 1</SelectItem>
                  <SelectItem value="2">Nível 2</SelectItem>
                  <SelectItem value="3">Nível 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={loading} className="w-full gap-2">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Gerando caso...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Gerar caso
              </>
            )}
          </Button>

          {loading && (
            <p className="text-[10px] text-muted-foreground/60 text-center">
              A IA está criando o cenário, steps e opções. Pode levar alguns segundos...
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
