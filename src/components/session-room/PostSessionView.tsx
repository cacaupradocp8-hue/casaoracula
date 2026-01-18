import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Eye, ShieldOff, Save, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SessionData } from './types';

interface PostSessionViewProps {
  sessionData: Partial<SessionData>;
  onUpdateData: (updates: Partial<SessionData>) => void;
  onSave: () => void;
  onBack: () => void;
  saving: boolean;
  saved: boolean;
}

const FIELDS = [
  {
    id: 'whatMoved',
    title: 'O que se moveu?',
    icon: Heart,
    color: 'text-rose-400',
    bgColor: 'from-rose-500/10 to-rose-600/5',
    borderColor: 'border-rose-500/20',
    placeholder: 'O que mudou, abriu ou se deslocou durante a sessão?',
  },
  {
    id: 'whatRemainsOpen',
    title: 'O que permanece aberto?',
    icon: Eye,
    color: 'text-blue-400',
    bgColor: 'from-blue-500/10 to-blue-600/5',
    borderColor: 'border-blue-500/20',
    placeholder: 'O que ainda não tem forma ou precisa de tempo?',
  },
  {
    id: 'whatNotToTouch',
    title: 'O que não deve ser tocado agora?',
    icon: ShieldOff,
    color: 'text-amber-400',
    bgColor: 'from-amber-500/10 to-amber-600/5',
    borderColor: 'border-amber-500/20',
    placeholder: 'O que precisa de proteção ou silêncio neste momento?',
  },
];

export function PostSessionView({
  sessionData,
  onUpdateData,
  onSave,
  onBack,
  saving,
  saved,
}: PostSessionViewProps) {
  const handleFieldChange = (fieldId: string, value: string) => {
    onUpdateData({ [fieldId]: value });
  };

  const canSave = 
    sessionData.whatMoved?.trim() ||
    sessionData.whatRemainsOpen?.trim() ||
    sessionData.whatNotToTouch?.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl text-foreground mb-2">
          Fechamento do Campo
        </h2>
        <p className="text-sm text-muted-foreground">
          Registros pós-sessão — honre o que foi atravessado
        </p>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        {FIELDS.map((field, index) => {
          const Icon = field.icon;
          const value = sessionData[field.id as keyof SessionData] as string || '';

          return (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-gradient-to-br ${field.bgColor} ${field.borderColor} border`}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Icon className={`h-4 w-4 ${field.color}`} />
                    {field.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={value}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="min-h-[80px] bg-background/50 border-border/50 resize-none"
                  />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Ethical Reminder */}
      <div className="p-4 rounded-lg bg-muted/30 border border-border/50 space-y-2">
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">Lembrete:</strong> Este registro é seu. 
          Ele sustenta sua prática sem pressa de conclusão.
        </p>
        <p className="text-xs text-muted-foreground">
          O que foi nomeado continua trabalhando. Confie no processo.
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Roteiro
        </Button>

        <Button
          onClick={onSave}
          disabled={!canSave || saving || saved}
          className="gap-2"
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" />
              Salvo
            </>
          ) : saving ? (
            'Salvando...'
          ) : (
            <>
              <Save className="h-4 w-4" />
              Salvar Sessão
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
