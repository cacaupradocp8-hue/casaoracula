import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Compass,
  Target,
  Brain,
  Briefcase,
  Heart,
  Zap,
  Shield,
  Video,
  Save,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  MetodoFormativoTemplate,
  criarTemplateVazio,
  BLOCO_LABELS,
} from '@/types/metodo-formativo';

interface MetodoFormativoEditorProps {
  moduleId: string;
  onSave?: () => void;
  onClose?: () => void;
}

const BLOCO_ICON_MAP = {
  metadados: FileText,
  sentido_jornada: Compass,
  essencia_80_20: Target,
  raiz_psiquica: Brain,
  aplicacao_profissional: Briefcase,
  aplicacao_pessoal: Heart,
  autoeficacia: Zap,
  registro_etico: Shield,
  roteiro_aula: Video,
} as const;

export function MetodoFormativoEditor({ moduleId, onSave, onClose }: MetodoFormativoEditorProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<MetodoFormativoTemplate>(criarTemplateVazio());
  const [roteiro, setRoteiro] = useState('');

  useEffect(() => {
    fetchModule();
  }, [moduleId]);

  const fetchModule = async () => {
    setIsLoading(true);
    try {
      const { data: mod, error } = await supabase
        .from('course_modules')
        .select('metodo_formativo, roteiro_aula, titulo')
        .eq('id', moduleId)
        .single();

      if (error) throw error;

      if (mod) {
        const mf = (mod as any).metodo_formativo;
        if (mf && typeof mf === 'object') {
          setData({ ...criarTemplateVazio(), ...mf });
        }
        setRoteiro((mod as any).roteiro_aula || '');
      }
    } catch (error) {
      console.error('Error fetching module:', error);
      toast({ title: 'Erro ao carregar módulo', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('course_modules')
        .update({
          metodo_formativo: JSON.parse(JSON.stringify(data)),
          roteiro_aula: roteiro || null,
        } as any)
        .eq('id', moduleId);

      if (error) throw error;
      toast({ title: 'Método Formativo salvo!' });
      onSave?.();
    } catch (error) {
      console.error('Error saving:', error);
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to update nested fields
  const updateField = (path: string, value: string) => {
    setData(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const getField = (path: string): string => {
    const keys = path.split('.');
    let obj: any = data;
    for (const key of keys) {
      obj = obj?.[key];
    }
    return obj || '';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const IconComp = (key: keyof typeof BLOCO_ICON_MAP) => {
    const Icon = BLOCO_ICON_MAP[key];
    return <Icon className="w-4 h-4 text-primary" />;
  };

  return (
    <ScrollArea className="h-[80vh]">
      <div className="space-y-6 p-1">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Target className="w-5 h-5" />
          Método Formativo — Editor Estruturado
        </h2>

        {/* BLOCO 1 — METADADOS */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              {IconComp('metadados')}
              {BLOCO_LABELS.metadados}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Jornada</Label>
              <Input value={getField('metadados.jornada')} onChange={e => updateField('metadados.jornada', e.target.value)} placeholder="Ex: Jornada da Heroína" />
            </div>
            <div>
              <Label>Nome do Portal/Aula</Label>
              <Input value={getField('metadados.nome_portal_aula')} onChange={e => updateField('metadados.nome_portal_aula', e.target.value)} placeholder="Ex: Portal do Corpo" />
            </div>
            <div>
              <Label>Habilidade Desenvolvida</Label>
              <Input value={getField('metadados.habilidade_desenvolvida')} onChange={e => updateField('metadados.habilidade_desenvolvida', e.target.value)} placeholder="Ex: Escuta somática" />
            </div>
            <div>
              <Label>Competência Profissional</Label>
              <Input value={getField('metadados.competencia_profissional')} onChange={e => updateField('metadados.competencia_profissional', e.target.value)} placeholder="Ex: Condução de vivências corporais" />
            </div>
          </CardContent>
        </Card>

        {/* BLOCO 2 — SENTIDO DA JORNADA */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              {IconComp('sentido_jornada')}
              {BLOCO_LABELS.sentido_jornada}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Contextualização simbólica (máx. 6-8 linhas)</Label>
            <Textarea value={getField('sentido_jornada.texto')} onChange={e => updateField('sentido_jornada.texto', e.target.value)} rows={5} placeholder="Onde esta aula se insere na jornada? Que tipo de maturidade psíquica é convocada?" />
          </CardContent>
        </Card>

        {/* BLOCO 3 — ESSÊNCIA 80/20 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              {IconComp('essencia_80_20')}
              {BLOCO_LABELS.essencia_80_20}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Núcleo Vivo</Label>
              <Textarea value={getField('essencia_80_20.nucleo_vivo')} onChange={e => updateField('essencia_80_20.nucleo_vivo', e.target.value)} rows={2} placeholder="Qual o núcleo essencial deste tema?" />
            </div>
            <div>
              <Label>Tensão Central</Label>
              <Textarea value={getField('essencia_80_20.tensao_central')} onChange={e => updateField('essencia_80_20.tensao_central', e.target.value)} rows={2} placeholder="Qual a tensão psíquica que organiza este conteúdo?" />
            </div>
            <div>
              <Label>3 Verdades Práticas</Label>
              {[0, 1, 2].map(i => (
                <Input
                  key={i}
                  className="mt-2"
                  value={data.essencia_80_20.verdades_praticas[i] || ''}
                  onChange={e => {
                    const updated = [...data.essencia_80_20.verdades_praticas] as [string, string, string];
                    updated[i] = e.target.value;
                    setData(prev => ({
                      ...prev,
                      essencia_80_20: { ...prev.essencia_80_20, verdades_praticas: updated },
                    }));
                  }}
                  placeholder={`Verdade prática ${i + 1}`}
                />
              ))}
            </div>
            <div>
              <Label>Frase-Guia</Label>
              <Input value={getField('essencia_80_20.frase_guia')} onChange={e => updateField('essencia_80_20.frase_guia', e.target.value)} placeholder="Frase forte e memorável" />
            </div>
          </CardContent>
        </Card>

        {/* BLOCO 4 — RAIZ PSÍQUICA */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              {IconComp('raiz_psiquica')}
              {BLOCO_LABELS.raiz_psiquica}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Arquétipo Ativado</Label>
              <Input value={getField('raiz_psiquica.arquetipo_ativado')} onChange={e => updateField('raiz_psiquica.arquetipo_ativado', e.target.value)} placeholder="Ex: A Curandeira Ferida" />
            </div>
            <div>
              <Label>Movimento Psíquico</Label>
              <Input value={getField('raiz_psiquica.movimento_psiquico')} onChange={e => updateField('raiz_psiquica.movimento_psiquico', e.target.value)} placeholder="Ex: Descida ao corpo como território de verdade" />
            </div>
            <div>
              <Label>Imagem Organizadora</Label>
              <Input value={getField('raiz_psiquica.imagem_organizadora')} onChange={e => updateField('raiz_psiquica.imagem_organizadora', e.target.value)} placeholder="Ex: Uma árvore cujas raízes..." />
            </div>
          </CardContent>
        </Card>

        {/* BLOCO 5 — APLICAÇÃO PROFISSIONAL */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              {IconComp('aplicacao_profissional')}
              {BLOCO_LABELS.aplicacao_profissional}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* AULA */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Aula</h4>
              <div>
                <Label>Conceito</Label>
                <Textarea value={getField('aplicacao_profissional.aula.conceito')} onChange={e => updateField('aplicacao_profissional.aula.conceito', e.target.value)} rows={2} placeholder="Conceito-matriz da aula" />
              </div>
              <div>
                <Label>Exercício Prático</Label>
                <Textarea value={getField('aplicacao_profissional.aula.exercicio_pratico')} onChange={e => updateField('aplicacao_profissional.aula.exercicio_pratico', e.target.value)} rows={2} placeholder="Vivência prática estruturada" />
              </div>
              <div>
                <Label>Pergunta Final</Label>
                <Input value={getField('aplicacao_profissional.aula.pergunta_final')} onChange={e => updateField('aplicacao_profissional.aula.pergunta_final', e.target.value)} placeholder="Pergunta de fechamento" />
              </div>
            </div>

            <Separator />

            {/* SESSÃO */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Sessão</h4>
              <div>
                <Label>Tema Recorrente</Label>
                <Input value={getField('aplicacao_profissional.sessao.tema_recorrente')} onChange={e => updateField('aplicacao_profissional.sessao.tema_recorrente', e.target.value)} placeholder="Tema que pode emergir na sessão" />
              </div>
              <div>
                <Label>Pergunta de Acesso</Label>
                <Input value={getField('aplicacao_profissional.sessao.pergunta_acesso')} onChange={e => updateField('aplicacao_profissional.sessao.pergunta_acesso', e.target.value)} placeholder="Como acessar este tema na sessão" />
              </div>
              <div>
                <Label>Cuidado Ético</Label>
                <Input value={getField('aplicacao_profissional.sessao.cuidado_etico')} onChange={e => updateField('aplicacao_profissional.sessao.cuidado_etico', e.target.value)} placeholder="Orientação ética explícita" />
              </div>
            </div>

            <Separator />

            {/* CÍRCULO */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Círculo / Palestra</h4>
              <div>
                <Label>Imagem de Abertura</Label>
                <Input value={getField('aplicacao_profissional.circulo.imagem_abertura')} onChange={e => updateField('aplicacao_profissional.circulo.imagem_abertura', e.target.value)} placeholder="Símbolo ou imagem de abertura" />
              </div>
              <div>
                <Label>Convite à Ação</Label>
                <Input value={getField('aplicacao_profissional.circulo.convite_acao')} onChange={e => updateField('aplicacao_profissional.circulo.convite_acao', e.target.value)} placeholder="Encerramento e convite à prática" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BLOCO 6 — APLICAÇÃO PESSOAL */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              {IconComp('aplicacao_pessoal')}
              {BLOCO_LABELS.aplicacao_pessoal}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Pergunta de Auto-observação</Label>
              <Input value={getField('aplicacao_pessoal.pergunta_auto_observacao')} onChange={e => updateField('aplicacao_pessoal.pergunta_auto_observacao', e.target.value)} placeholder="Onde isso pode atuar na sua vida?" />
            </div>
            <div>
              <Label>Padrão a Observar</Label>
              <Input value={getField('aplicacao_pessoal.padrao_a_observar')} onChange={e => updateField('aplicacao_pessoal.padrao_a_observar', e.target.value)} placeholder="Que padrão comportamental observar?" />
            </div>
            <div>
              <Label>Gesto Concreto da Semana</Label>
              <Input value={getField('aplicacao_pessoal.gesto_concreto_semana')} onChange={e => updateField('aplicacao_pessoal.gesto_concreto_semana', e.target.value)} placeholder="Ação possível e concreta" />
            </div>
          </CardContent>
        </Card>

        {/* BLOCO 7 — AUTOEFICÁCIA */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              {IconComp('autoeficacia')}
              {BLOCO_LABELS.autoeficacia}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Nome da Prática</Label>
              <Input value={getField('autoeficacia.nome_pratica')} onChange={e => updateField('autoeficacia.nome_pratica', e.target.value)} placeholder="Ex: Ritual de Escuta Somática" />
            </div>
            <div>
              <Label>3 Passos Numerados</Label>
              {[0, 1, 2].map(i => (
                <Input
                  key={i}
                  className="mt-2"
                  value={data.autoeficacia.passos[i] || ''}
                  onChange={e => {
                    const updated = [...data.autoeficacia.passos] as [string, string, string];
                    updated[i] = e.target.value;
                    setData(prev => ({
                      ...prev,
                      autoeficacia: { ...prev.autoeficacia, passos: updated },
                    }));
                  }}
                  placeholder={`Passo ${i + 1}`}
                />
              ))}
            </div>
            <div>
              <Label>Indicador de Eficácia</Label>
              <Input value={getField('autoeficacia.indicador_eficacia')} onChange={e => updateField('autoeficacia.indicador_eficacia', e.target.value)} placeholder="Como a aluna saberá que funcionou?" />
            </div>
          </CardContent>
        </Card>

        {/* BLOCO 8 — REGISTRO ÉTICO */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              {IconComp('registro_etico')}
              {BLOCO_LABELS.registro_etico}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Orientação — Jardim da Psique (campo pessoal)</Label>
              <Textarea value={getField('registro_etico.orientacao_jardim_psique')} onChange={e => updateField('registro_etico.orientacao_jardim_psique', e.target.value)} rows={3} placeholder="Orientação para o registro pessoal..." />
            </div>
            <div>
              <Label>Orientação — Jardim do Ofício (campo profissional)</Label>
              <Textarea value={getField('registro_etico.orientacao_jardim_oficio')} onChange={e => updateField('registro_etico.orientacao_jardim_oficio', e.target.value)} rows={3} placeholder="Orientação para o registro profissional..." />
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* CAMPO SEPARADO — ROTEIRO DE AULA */}
        <Card className="border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              {IconComp('roteiro_aula')}
              {BLOCO_LABELS.roteiro_aula}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3 italic">
              Campo narrativo independente. Não misturar com os blocos estruturais acima.
            </p>
            <Textarea
              value={roteiro}
              onChange={e => setRoteiro(e.target.value)}
              rows={10}
              placeholder="Roteiro narrativo para gravação de vídeo ou áudio..."
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          )}
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="w-4 h-4" />
            {isSaving ? 'Salvando...' : 'Salvar Método Formativo'}
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
