// ============================================
// MODAL: NOVA ENTRADA NO JARDIM DA PSIQUE
// ============================================
// Permite adicionar entradas manuais (sonhos, frases, fragmentos, reflexões)

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Leaf, Moon, Quote, FileText, Sparkles, PenLine } from 'lucide-react';
import { useJardimPsique, TipoRegistroJardim } from '@/hooks/useJardimPsique';

interface NovaEntradaJardimModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: (registroId: string) => void;
}

const TIPOS_ENTRADA: {
  value: TipoRegistroJardim;
  label: string;
  icon: React.ElementType;
  placeholder: string;
  ferramentaNome: string;
}[] = [
  {
    value: 'sonho',
    label: 'Sonho',
    icon: Moon,
    placeholder: 'Descreva seu sonho...',
    ferramentaNome: 'Registro de Sonho',
  },
  {
    value: 'frase',
    label: 'Frase que tocou',
    icon: Quote,
    placeholder: 'Uma frase, citação ou insight que marcou você...',
    ferramentaNome: 'Frase Guardada',
  },
  {
    value: 'fragmento',
    label: 'Fragmento de sessão',
    icon: FileText,
    placeholder: 'Um momento, insight ou percepção da sua própria terapia ou supervisão...',
    ferramentaNome: 'Fragmento de Sessão',
  },
  {
    value: 'reflexao',
    label: 'Reflexão livre',
    icon: PenLine,
    placeholder: 'Anote livremente seus pensamentos, insights ou descobertas...',
    ferramentaNome: 'Reflexão Pessoal',
  },
];

export function NovaEntradaJardimModal({
  open,
  onOpenChange,
  onSaved,
}: NovaEntradaJardimModalProps) {
  const [tipo, setTipo] = useState<TipoRegistroJardim>('reflexao');
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [fonte, setFonte] = useState('');
  const [emocao, setEmocao] = useState('');
  const [saving, setSaving] = useState(false);
  const { salvarRegistro } = useJardimPsique();

  const tipoSelecionado = TIPOS_ENTRADA.find((t) => t.value === tipo)!;
  const TipoIcon = tipoSelecionado.icon;

  const handleSalvar = async () => {
    if (!conteudo.trim()) return;

    setSaving(true);
    try {
      const registroId = await salvarRegistro({
        ferramenta_nome: tipoSelecionado.ferramentaNome,
        ferramenta_chave: tipo,
        conteudo: { texto: conteudo },
        tipo_registro: tipo,
        titulo: titulo || undefined,
        fonte: fonte || undefined,
        emocao_predominante: emocao || undefined,
      });

      if (registroId) {
        onSaved?.(registroId);
        onOpenChange(false);
        resetForm();
      }
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setTitulo('');
    setConteudo('');
    setFonte('');
    setEmocao('');
    setTipo('reflexao');
  };

  const handleClose = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Leaf className="w-5 h-5 text-emerald-500" />
            Nova Entrada no Jardim
          </DialogTitle>
          <DialogDescription>
            Registre sonhos, frases, insights ou reflexões pessoais.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Tipo de entrada */}
          <div className="space-y-2">
            <Label>Tipo de registro</Label>
            <Select value={tipo} onValueChange={(v) => setTipo(v as TipoRegistroJardim)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_ENTRADA.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    <div className="flex items-center gap-2">
                      <t.icon className="w-4 h-4" />
                      {t.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Título opcional */}
          <div className="space-y-2">
            <Label htmlFor="titulo">
              Título <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Input
              id="titulo"
              placeholder={tipo === 'sonho' ? 'Ex: O sonho da floresta' : 'Dê um nome a este registro'}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          {/* Conteúdo principal */}
          <div className="space-y-2">
            <Label htmlFor="conteudo" className="flex items-center gap-2">
              <TipoIcon className="w-4 h-4" />
              Conteúdo
            </Label>
            <Textarea
              id="conteudo"
              placeholder={tipoSelecionado.placeholder}
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              className="min-h-[150px] resize-none"
            />
          </div>

          {/* Fonte (para frases) */}
          {tipo === 'frase' && (
            <div className="space-y-2">
              <Label htmlFor="fonte">
                Fonte <span className="text-muted-foreground">(opcional)</span>
              </Label>
              <Input
                id="fonte"
                placeholder="Livro, autor, palestra..."
                value={fonte}
                onChange={(e) => setFonte(e.target.value)}
              />
            </div>
          )}

          {/* Emoção predominante */}
          <div className="space-y-2">
            <Label htmlFor="emocao" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Emoção predominante <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Input
              id="emocao"
              placeholder="Ex: esperança, inquietação, clareza..."
              value={emocao}
              onChange={(e) => setEmocao(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => handleClose(false)}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSalvar}
            disabled={saving || !conteudo.trim()}
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
