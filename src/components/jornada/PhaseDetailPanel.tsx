// ============================================
// PHASE DETAIL PANEL — Reflection and input for each phase
// ============================================

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Save, Loader2, Sparkles, BookOpen, Leaf } from 'lucide-react';

interface Fase {
  id: string;
  numero: number;
  chave: string;
  nome: string;
  subtitulo: string;
  descricao: string;
  pergunta_central: string;
  perguntas_reflexao: string[];
  arquetipos_sugeridos: string[];
  praticas_simbolicas: string[];
  linguagem_contencao: string;
  microcopy: string;
  icone: string;
  cor_primaria: string;
}

interface FaseResposta {
  respostas_reflexao: Record<number, string>;
  arquetipo_escolhido: string | null;
  tom_emocional: string | null;
  simbolo_pessoal: string | null;
  notas_pessoais: string | null;
}

interface EmotionalTone {
  value: string;
  label: string;
}

interface PhaseDetailPanelProps {
  fase: Fase;
  resposta: FaseResposta | undefined;
  emotionalTones: EmotionalTone[];
  onSave: (data: Partial<FaseResposta>) => Promise<void>;
  saving: boolean;
  mode: 'pessoal' | 'conducao';
}

export function PhaseDetailPanel({
  fase,
  resposta,
  emotionalTones,
  onSave,
  saving,
  mode,
}: PhaseDetailPanelProps) {
  const [localResponses, setLocalResponses] = useState<Record<number, string>>(
    resposta?.respostas_reflexao || {}
  );
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(
    resposta?.arquetipo_escolhido || null
  );
  const [selectedTone, setSelectedTone] = useState<string | null>(
    resposta?.tom_emocional || null
  );
  const [simboloPessoal, setSimboloPessoal] = useState(resposta?.simbolo_pessoal || '');
  const [notasPessoais, setNotasPessoais] = useState(resposta?.notas_pessoais || '');

  // Reset when phase changes
  useEffect(() => {
    setLocalResponses(resposta?.respostas_reflexao || {});
    setSelectedArchetype(resposta?.arquetipo_escolhido || null);
    setSelectedTone(resposta?.tom_emocional || null);
    setSimboloPessoal(resposta?.simbolo_pessoal || '');
    setNotasPessoais(resposta?.notas_pessoais || '');
  }, [fase.numero, resposta]);

  const handleSave = async () => {
    await onSave({
      respostas_reflexao: localResponses,
      arquetipo_escolhido: selectedArchetype,
      tom_emocional: selectedTone,
      simbolo_pessoal: simboloPessoal || null,
      notas_pessoais: notasPessoais || null,
    });
  };

  return (
    <div className="space-y-6">
      {/* Phase Header */}
      <Card className="glass overflow-hidden">
        <div 
          className="h-2" 
          style={{ backgroundColor: fase.cor_primaria }}
        />
        <CardHeader>
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${fase.cor_primaria}20` }}
            >
              <span 
                className="text-lg font-bold"
                style={{ color: fase.cor_primaria }}
              >
                {fase.numero}
              </span>
            </div>
            <div>
              <CardTitle className="text-xl">{fase.nome}</CardTitle>
              <CardDescription>{fase.subtitulo}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {fase.descricao}
          </p>
          
          <div 
            className="p-4 rounded-lg border-l-4"
            style={{ 
              borderColor: fase.cor_primaria,
              backgroundColor: `${fase.cor_primaria}10` 
            }}
          >
            <p className="text-sm italic">"{fase.microcopy}"</p>
          </div>
        </CardContent>
      </Card>

      {/* Central Question */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Pergunta Central
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p 
            className="text-lg font-display"
            style={{ color: fase.cor_primaria }}
          >
            {fase.pergunta_central}
          </p>
        </CardContent>
      </Card>

      {/* Reflection Questions */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Perguntas de Reflexão
          </CardTitle>
          <CardDescription>
            Responda no seu tempo — não há pressa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {fase.perguntas_reflexao.map((pergunta, idx) => (
            <div key={idx}>
              <Label className="text-sm font-medium">{pergunta}</Label>
              <Textarea
                value={localResponses[idx] || ''}
                onChange={(e) => setLocalResponses(prev => ({
                  ...prev,
                  [idx]: e.target.value
                }))}
                placeholder="Sua reflexão..."
                className="mt-2 min-h-[100px]"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Archetype Selection */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg">Arquétipo que Ressoa</CardTitle>
          <CardDescription>
            Qual figura simbólica te acompanha nesta fase?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {fase.arquetipos_sugeridos.map((arq) => (
              <Badge
                key={arq}
                variant={selectedArchetype === arq ? "default" : "outline"}
                className="cursor-pointer transition-all"
                onClick={() => setSelectedArchetype(selectedArchetype === arq ? null : arq)}
              >
                {arq}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emotional Tone */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg">Tom Emocional</CardTitle>
          <CardDescription>
            Como você se sente atravessando esta fase?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {emotionalTones.map((tone) => (
              <Badge
                key={tone.value}
                variant={selectedTone === tone.value ? "default" : "outline"}
                className="cursor-pointer transition-all"
                onClick={() => setSelectedTone(selectedTone === tone.value ? null : tone.value)}
              >
                {tone.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personal Symbol */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg">Símbolo Pessoal</CardTitle>
          <CardDescription>
            Há algum símbolo, imagem ou objeto que representa esta fase para você?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <input
            type="text"
            value={simboloPessoal}
            onChange={(e) => setSimboloPessoal(e.target.value)}
            placeholder="Ex: Uma vela acesa, uma lua minguante..."
            className="w-full p-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none"
          />
        </CardContent>
      </Card>

      {/* Suggested Practices */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" />
            Práticas Sugeridas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {fase.praticas_simbolicas.map((pratica, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span 
                  className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: fase.cor_primaria }}
                />
                {pratica}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Personal Notes */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg">Notas Pessoais</CardTitle>
          <CardDescription>
            Qualquer anotação adicional sobre esta fase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notasPessoais}
            onChange={(e) => setNotasPessoais(e.target.value)}
            placeholder="Suas anotações..."
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Containment Language */}
      <Card 
        className="border-l-4"
        style={{ borderLeftColor: fase.cor_primaria }}
      >
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground italic">
            {fase.linguagem_contencao}
          </p>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Salvar Respostas
        </Button>
      </div>
    </div>
  );
}
