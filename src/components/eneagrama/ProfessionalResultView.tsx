// ============================================
// PROFESSIONAL RESULT VIEW
// Extended result page for practitioners
// ============================================

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { SessionGuidancePanel } from './SessionGuidancePanel';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import { 
  Flower2, Save, Loader2, Users, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Arquetipo {
  id: string;
  numero: number;
  nome: string;
  nome_en: string | null;
  essencia_simbolica: string;
  ferida_central: string | null;
  dom_central: string | null;
  expressao_sombra: string | null;
  caminho_expansao: string | null;
  notas_leitura: string | null;
  transferencias_comuns: string | null;
  resistencias_tipicas: string | null;
  linguagem_evitar: string | null;
  linguagem_que_abre: string | null;
  cautelas_eticas: string | null;
  icone: string | null;
  cor_primaria: string | null;
}

interface ProfessionalResultViewProps {
  primaryArq: Arquetipo;
  secondaryArq: Arquetipo | null;
  shadowArq: Arquetipo | null;
  onSaveNotes: (notes: { 
    campoTensao: string; 
    vetorIntegracao: string; 
    notasProfissionais: string 
  }) => Promise<void>;
  saving: boolean;
}

export function ProfessionalResultView({
  primaryArq,
  secondaryArq,
  shadowArq,
  onSaveNotes,
  saving
}: ProfessionalResultViewProps) {
  const [campoTensao, setCampoTensao] = useState('');
  const [vetorIntegracao, setVetorIntegracao] = useState('');
  const [notasProfissionais, setNotasProfissionais] = useState('');

  const handleSave = () => {
    onSaveNotes({ campoTensao, vetorIntegracao, notasProfissionais });
  };

  return (
    <div className="space-y-6">
      {/* Professional Mode Badge */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="border-purple-500/50 text-purple-400">
          <Users className="w-3 h-3 mr-1" />
          Modo Profissional
        </Badge>
        <p className="text-xs text-muted-foreground">
          Conteúdo visível apenas para facilitadoras
        </p>
      </div>

      {/* Disclaimer */}
      <Card className="bg-amber-500/5 border-amber-500/20">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-amber-500 mb-1">Uso Profissional</p>
            <p className="text-muted-foreground">
              Este conteúdo é um suporte à reflexão simbólica, não um diagnóstico. 
              Não substitui supervisão clínica ou formação especializada.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Primary Archetype Guidance */}
      <div>
        <h3 className="text-sm font-medium text-gold mb-3">
          Arquétipo Dominante: {primaryArq.nome}
        </h3>
        <SessionGuidancePanel arquetipo={primaryArq} />
      </div>

      {/* Secondary Archetype Guidance */}
      {secondaryArq && (
        <div>
          <h3 className="text-sm font-medium text-purple-400 mb-3">
            Arquétipo de Suporte: {secondaryArq.nome}
          </h3>
          <SessionGuidancePanel arquetipo={secondaryArq} />
        </div>
      )}

      {/* Shadow Archetype Guidance */}
      {shadowArq && (
        <div>
          <h3 className="text-sm font-medium text-orange-400 mb-3">
            Arquétipo Sombra: {shadowArq.nome}
          </h3>
          <SessionGuidancePanel arquetipo={shadowArq} />
        </div>
      )}

      {/* Tension Field */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Campo de Tensão</CardTitle>
          <CardDescription>
            Descreva a tensão simbólica observada (não diagnóstico)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={campoTensao}
            onChange={(e) => setCampoTensao(e.target.value)}
            placeholder="Ex: Tensão entre o desejo de cuidar e a dificuldade em receber..."
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Integration Vector */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Vetor de Integração</CardTitle>
          <CardDescription>
            Direção de movimento possível (não prescrição)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={vetorIntegracao}
            onChange={(e) => setVetorIntegracao(e.target.value)}
            placeholder="Ex: Movimento em direção a receber sem culpa..."
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Professional Notes */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Notas da Sessão</CardTitle>
          <CardDescription>
            Anotações privadas (visíveis apenas para você)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={notasProfissionais}
            onChange={(e) => setNotasProfissionais(e.target.value)}
            placeholder="Observações sobre a sessão, próximos passos, pontos de atenção..."
            rows={4}
          />
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Notas da Sessão
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <EthicalNotice toolName="Eneagrama Feminino Profissional" />
    </div>
  );
}
