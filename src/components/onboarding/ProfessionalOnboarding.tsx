import { useState } from 'react';
import { useProfessionalStatus } from '@/hooks/useProfessionalStatus';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Shield, Heart, Sparkles, AlertTriangle } from 'lucide-react';

interface ProfessionalOnboardingProps {
  onComplete: () => void;
  onWaitingList: () => void;
}

const TIPOS_ATUACAO = [
  'Terapeuta',
  'Psicóloga',
  'Psicanalista',
  'Mentora',
  'Facilitadora',
  'Coach',
  'Consteladora',
  'Outra área relacionada',
];

export function ProfessionalOnboarding({ onComplete, onWaitingList }: ProfessionalOnboardingProps) {
  const { confirmProfessional, joinWaitingList } = useProfessionalStatus();
  const { toast } = useToast();
  const [step, setStep] = useState<'intro' | 'form' | 'not-professional'>('intro');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    tipo_atuacao: '',
    area_formacao: '',
    anos_experiencia: '',
    aceita_codigo_etico: false,
  });

  const handleProfessionalConfirm = async () => {
    if (!formData.tipo_atuacao) {
      toast({ title: 'Selecione seu tipo de atuação', variant: 'destructive' });
      return;
    }
    if (!formData.aceita_codigo_etico) {
      toast({ title: 'Aceite o código de ética para continuar', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    const result = await confirmProfessional({
      tipo_atuacao: formData.tipo_atuacao,
      area_formacao: formData.area_formacao || undefined,
      anos_experiencia: formData.anos_experiencia ? parseInt(formData.anos_experiencia) : undefined,
    });

    if (result.success) {
      toast({ title: 'Confirmação realizada!', description: 'Bem-vinda à Casa ORÁCULA.' });
      onComplete();
    } else {
      toast({ title: 'Erro ao confirmar', description: result.error, variant: 'destructive' });
    }
    setIsSubmitting(false);
  };

  const handleJoinWaitingList = async () => {
    setIsSubmitting(true);
    const result = await joinWaitingList('Interesse no conteúdo iniciático');
    
    if (result.success) {
      toast({ title: 'Você entrou na lista de espera!', description: 'Entraremos em contato em breve.' });
      onWaitingList();
    } else {
      toast({ title: 'Erro', description: result.error, variant: 'destructive' });
    }
    setIsSubmitting(false);
  };

  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-lg w-full bg-card border-gold/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-gold" />
            </div>
            <CardTitle className="font-display text-2xl">Portal de Entrada</CardTitle>
            <CardDescription className="text-base">
              A Casa ORÁCULA é um ambiente iniciático digital para profissionais.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-secondary/30 rounded-lg text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-2">Este espaço é dedicado a:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Terapeutas e psicólogas</li>
                <li>Mentoras e facilitadoras</li>
                <li>Profissionais de áreas afins</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={() => setStep('form')} className="gap-2">
                <Heart className="w-4 h-4" />
                Sou profissional da área
              </Button>
              <Button variant="outline" onClick={() => setStep('not-professional')}>
                Ainda não sou profissional
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'not-professional') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-lg w-full bg-card border-border">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-muted-foreground" />
            </div>
            <CardTitle className="font-display text-2xl">Lista de Espera</CardTitle>
            <CardDescription className="text-base">
              As ferramentas profissionais estão disponíveis apenas para profissionais confirmadas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Conteúdo restrito</p>
                  <p className="text-muted-foreground mt-1">
                    A Sala de Sessão, Mapas e ferramentas clínicas são exclusivas para profissionais.
                    Entre na lista de espera para ser notificada sobre conteúdos abertos.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={handleJoinWaitingList} disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Entrar na Lista de Espera'}
              </Button>
              <Button variant="ghost" onClick={() => setStep('intro')}>
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-lg w-full bg-card border-gold/20">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Confirmação Profissional</CardTitle>
          <CardDescription>
            Confirme sua atuação para acessar as ferramentas da Casa ORÁCULA.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de atuação *</Label>
              <Select 
                value={formData.tipo_atuacao} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, tipo_atuacao: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione sua área" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_ATUACAO.map(tipo => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Área de formação (opcional)</Label>
              <Input
                value={formData.area_formacao}
                onChange={(e) => setFormData(prev => ({ ...prev, area_formacao: e.target.value }))}
                placeholder="Ex: Psicologia, Terapia Sistêmica..."
              />
            </div>

            <div className="space-y-2">
              <Label>Anos de experiência (opcional)</Label>
              <Input
                type="number"
                min="0"
                value={formData.anos_experiencia}
                onChange={(e) => setFormData(prev => ({ ...prev, anos_experiencia: e.target.value }))}
                placeholder="Ex: 5"
              />
            </div>
          </div>

          <div className="p-4 bg-secondary/30 rounded-lg space-y-3">
            <p className="text-sm font-medium text-foreground">Código de Ética da Casa ORÁCULA</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Não faço diagnósticos clínicos automáticos</li>
              <li>• Respeito os limites éticos da minha formação</li>
              <li>• Uso linguagem simbólica como ferramenta, não como misticismo</li>
              <li>• Mantenho confidencialidade dos casos</li>
              <li>• Não ofereço previsões ou promessas de cura</li>
            </ul>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="aceita_codigo"
              checked={formData.aceita_codigo_etico}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, aceita_codigo_etico: checked === true }))
              }
            />
            <Label htmlFor="aceita_codigo" className="text-sm leading-relaxed">
              Li e aceito o Código de Ética da Casa ORÁCULA e confirmo que atuo profissionalmente na área.
            </Label>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleProfessionalConfirm} 
              disabled={isSubmitting || !formData.aceita_codigo_etico}
            >
              {isSubmitting ? 'Confirmando...' : 'Confirmar e Entrar'}
            </Button>
            <Button variant="ghost" onClick={() => setStep('intro')}>
              Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
