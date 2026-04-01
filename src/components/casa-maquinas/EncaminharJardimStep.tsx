import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Leaf, Send, Loader2, BookOpen, Headphones, Sparkles,
  MapPin, Target, CheckCircle, ChevronRight, SkipForward,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const TIPOS = [
  { key: 'pratica', label: 'Prática', icon: BookOpen, desc: 'Exercício ou prática sugerida' },
  { key: 'escuta', label: 'Escuta', icon: Headphones, desc: 'Áudio ou meditação' },
  { key: 'reflexao', label: 'Reflexão', icon: Sparkles, desc: 'Pergunta ou convite reflexivo' },
  { key: 'territorio', label: 'Território', icon: MapPin, desc: 'Território em foco' },
  { key: 'foco_semana', label: 'Foco da Semana', icon: Target, desc: 'Orientação semanal' },
] as const;

interface Props {
  clienteNome: string;
  saving: boolean;
  orientacaoEnviada: boolean;
  onEnviar: (data: { tipo: string; titulo?: string; mensagem: string }) => Promise<boolean>;
  onPular: () => void;
  onVoltar: () => void;
  onSalvarSessao: () => void;
  salvandoSessao: boolean;
}

export function EncaminharJardimStep({
  clienteNome,
  saving,
  orientacaoEnviada,
  onEnviar,
  onPular,
  onVoltar,
  onSalvarSessao,
  salvandoSessao,
}: Props) {
  const [tipo, setTipo] = useState('reflexao');
  const [titulo, setTitulo] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleEnviar = async () => {
    if (!mensagem.trim()) return;
    const ok = await onEnviar({ tipo, titulo: titulo.trim() || undefined, mensagem: mensagem.trim() });
    if (ok) {
      setTipo('reflexao');
      setTitulo('');
      setMensagem('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Header simbólico */}
      <div className="text-center space-y-2 py-2">
        <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
          <Leaf className="w-5 h-5 text-primary/70" />
        </div>
        <h3 className="text-sm font-display text-foreground/80">
          Encaminhar para o Jardim
        </h3>
        <p className="text-xs text-muted-foreground/60 max-w-xs mx-auto">
          Deixe algo para {clienteNome} cuidar entre sessões.
          Uma continuidade do cuidado.
        </p>
      </div>

      {/* Estado: já enviou */}
      {orientacaoEnviada && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-4 text-center space-y-2">
            <CheckCircle className="w-5 h-5 text-primary mx-auto" />
            <p className="text-xs text-foreground/70">
              Orientação enviada ao Jardim de {clienteNome}
            </p>
            <p className="text-[10px] text-muted-foreground/50">
              Ela verá isso assim que acessar o Jardim da Heroína.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Formulário inline */}
      {!orientacaoEnviada && (
        <Card className="border-primary/15 bg-card/60 overflow-hidden">
          <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <CardContent className="p-4 space-y-4">
            {/* Tipo */}
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground/50">
                Tipo de orientação
              </Label>
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {TIPOS.map(({ key, label, icon: Icon, desc }) => (
                  <button
                    key={key}
                    onClick={() => setTipo(key)}
                    className={cn(
                      "flex items-center gap-2 p-2.5 rounded-lg text-xs transition-all border text-left",
                      tipo === key
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-card/50 border-border/20 text-muted-foreground hover:border-border/40"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <div>
                      <span className="block font-medium">{label}</span>
                      <span className="text-[10px] text-muted-foreground/50 block leading-tight">{desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Título */}
            <div>
              <Label className="text-xs text-muted-foreground">Título (opcional)</Label>
              <Input
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                placeholder="Ex: Prática da semana, Escuta de integração..."
                className="mt-1 bg-background/60 border-border/30"
              />
            </div>

            {/* Mensagem */}
            <div>
              <Label className="text-xs text-muted-foreground">Mensagem para {clienteNome}</Label>
              <Textarea
                value={mensagem}
                onChange={e => setMensagem(e.target.value)}
                placeholder="O que você gostaria que ela observasse, praticasse ou refletisse entre sessões..."
                className="mt-1 min-h-[100px] resize-none bg-background/60 border-border/30"
                maxLength={1000}
              />
              <p className="text-[10px] text-muted-foreground/40 mt-1 text-right">{mensagem.length}/1000</p>
            </div>

            {/* Enviar */}
            <Button
              onClick={handleEnviar}
              disabled={saving || !mensagem.trim()}
              className="w-full bg-primary hover:bg-primary/80 text-primary-foreground gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Enviar ao Jardim
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Ações */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onVoltar}
          className="flex-1 border-border/30 text-muted-foreground"
        >
          Voltar
        </Button>
        {!orientacaoEnviada ? (
          <Button
            variant="ghost"
            onClick={onPular}
            className="flex-1 text-muted-foreground/50 hover:text-muted-foreground/70 gap-1"
          >
            <SkipForward className="w-3.5 h-3.5" />
            Pular e Salvar
          </Button>
        ) : (
          <Button
            onClick={onSalvarSessao}
            disabled={salvandoSessao}
            className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground gap-1"
          >
            {salvandoSessao ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            Finalizar Sessão
          </Button>
        )}
      </div>
    </motion.div>
  );
}
