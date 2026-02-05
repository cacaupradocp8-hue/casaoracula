// ============================================
// ETAPA 4: SÍNTESE NARRATIVA
// ============================================

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, RefreshCw, Copy, Check, Edit3 } from 'lucide-react';
import { CAMADAS_EGO, RespostaCamada } from './types';
import { cn } from '@/lib/utils';

interface EtapaSinteseProps {
  respostas: Record<string, RespostaCamada>;
  sinteseNarrativa?: string;
  onSinteseChange: (sintese: string) => void;
}

export function EtapaSintese({ respostas, sinteseNarrativa, onSinteseChange }: EtapaSinteseProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [localSintese, setLocalSintese] = useState(sinteseNarrativa || '');

  // Gerar síntese automática baseada nas respostas
  const sinteseGerada = useMemo(() => {
    const camadasPreenchidas = CAMADAS_EGO.filter((camada) => {
      const resp = respostas[camada.id];
      return resp && resp.respostas.some((r) => r.trim().length > 10);
    });

    if (camadasPreenchidas.length === 0) {
      return 'Neste momento, o mapa permanece em silêncio — um convite para retornar às camadas e escutar o que habita em você.';
    }

    // Identificar camada dominante
    const camadaDominante = camadasPreenchidas.reduce((max, camada) => {
      const resp = respostas[camada.id];
      const totalChars = resp?.respostas.reduce((sum, r) => sum + r.trim().length, 0) || 0;
      const maxChars = respostas[max.id]?.respostas.reduce((sum, r) => sum + r.trim().length, 0) || 0;
      return totalChars > maxChars ? camada : max;
    }, camadasPreenchidas[0]);

    // Templates de síntese por camada dominante
    const templates: Record<string, string> = {
      fisico: `Neste momento, seu corpo físico parece pedir atenção. A morada sensível fala — há algo que precisa ser sentido, acolhido ou cuidado no plano mais concreto da sua existência. O corpo não mente: ele guarda memórias e pede presença.`,
      eterico: `Sua energia vital está em evidência. O campo etérico pulsa, sinalizando questões de vitalidade, ritmo e nutrição. Observe o que drena e o que sustenta — a força vital é a base de todo movimento interior.`,
      astral: `O oceano emocional se move. As emoções estão presentes, pedindo reconhecimento. Há sentimentos atravessando você que merecem ser nomeados e acolhidos, sem julgamento. Sentir é a primeira forma de compreender.`,
      mental: `A mente busca clareza. O Eu Mental quer organizar, nomear, compreender. Observe se há excesso de pensamentos ou uma necessidade de estrutura. A clareza vem do silêncio tanto quanto da reflexão.`,
      espiritual: `A dimensão do sentido se manifesta. Há um chamado para conexão com algo maior — propósito, transcendência, vida interior. Este é um momento de escuta profunda do que realmente importa.`,
    };

    const textoBase = templates[camadaDominante.id] || templates.mental;

    // Adicionar menção a outras camadas ativas
    const outrasAtivas = camadasPreenchidas.filter((c) => c.id !== camadaDominante.id);
    if (outrasAtivas.length > 0) {
      const nomes = outrasAtivas.map((c) => c.nome.toLowerCase()).join(' e ');
      return `${textoBase}\n\nAlém disso, ressonâncias aparecem em ${nomes} — indicando que a travessia toca múltiplas dimensões do seu ser.`;
    }

    return textoBase;
  }, [respostas]);

  useEffect(() => {
    if (!sinteseNarrativa && sinteseGerada) {
      setLocalSintese(sinteseGerada);
      onSinteseChange(sinteseGerada);
    }
  }, [sinteseGerada, sinteseNarrativa, onSinteseChange]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(localSintese);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    onSinteseChange(localSintese);
    setIsEditing(false);
  };

  const handleRegenerate = () => {
    setLocalSintese(sinteseGerada);
    onSinteseChange(sinteseGerada);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-900/10 via-card/50 to-gold/5 border-purple-500/20">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-300">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Leitura Simbólica</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRegenerate}
                className="h-8 px-2"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 px-2"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className={cn('h-8 px-2', isEditing && 'text-gold')}
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={localSintese}
                onChange={(e) => setLocalSintese(e.target.value)}
                className="min-h-[160px] bg-background/50"
              />
              <div className="flex justify-end">
                <Button size="sm" onClick={handleSaveEdit} className="bg-gold hover:bg-gold/90">
                  Salvar edição
                </Button>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm prose-invert max-w-none">
              <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
                {localSintese}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nota sobre a síntese */}
      <p className="text-xs text-muted-foreground text-center">
        Esta leitura é um espelhamento simbólico, não uma interpretação definitiva.
        <br />
        Você pode editá-la livremente antes de seguir.
      </p>
    </div>
  );
}
