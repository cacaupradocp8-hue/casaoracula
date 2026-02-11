import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ExercicioPorta } from "../data/exercicios-portas";

interface ExercicioCadernoBlockProps {
  exercicio: ExercicioPorta;
  isProfessional: boolean;
  onDataChange?: (data: ExercicioData) => void;
}

export interface ExercicioData {
  respostas: [string, string, string];
  registroCorpo: string;
  // Professional fields
  crencaCentral?: string;
  emocaoDominante?: string;
  padraoDefensivo?: string;
  direcionamentoTerapeutico?: string;
}

export function ExercicioCadernoBlock({ 
  exercicio, 
  isProfessional,
  onDataChange 
}: ExercicioCadernoBlockProps) {
  const [respostas, setRespostas] = useState<[string, string, string]>(["", "", ""]);
  const [registroCorpo, setRegistroCorpo] = useState("");
  const [crencaCentral, setCrencaCentral] = useState("");
  const [emocaoDominante, setEmocaoDominante] = useState("");
  const [padraoDefensivo, setPadraoDefensivo] = useState("");
  const [direcionamento, setDirecionamento] = useState("");

  const emitChange = (updates: Partial<ExercicioData>) => {
    const data: ExercicioData = {
      respostas,
      registroCorpo,
      ...(isProfessional && {
        crencaCentral,
        emocaoDominante,
        padraoDefensivo,
        direcionamentoTerapeutico: direcionamento,
      }),
      ...updates,
    };
    onDataChange?.(data);
  };

  const updateResposta = (index: number, value: string) => {
    const newRespostas = [...respostas] as [string, string, string];
    newRespostas[index] = value;
    setRespostas(newRespostas);
    emitChange({ respostas: newRespostas });
  };

  return (
    <div className="space-y-5 border border-gold/20 rounded-lg p-4 bg-card/40">
      {/* Header */}
      <div className="border-b border-gold/10 pb-3">
        <p className="text-[10px] uppercase tracking-widest text-gold/60 mb-1">
          📘 Exercício do Caderno da Jornada da Heroína
        </p>
        <h4 className="font-display text-base text-gold">
          {exercicio.titulo}
        </h4>
      </div>

      {/* Instrução */}
      <p className="text-sm text-foreground/80 leading-relaxed">
        {exercicio.instrucao}
      </p>

      {/* 3 Perguntas de Aprofundamento */}
      <div className="space-y-4">
        <p className="text-[10px] uppercase tracking-widest text-gold/60">
          Perguntas de Aprofundamento
        </p>
        {exercicio.perguntas.map((pergunta, i) => (
          <div key={i} className="space-y-1.5">
            <Label className="text-sm text-foreground/70 italic">
              {i + 1}. {pergunta}
            </Label>
            <Textarea
              value={respostas[i]}
              onChange={(e) => updateResposta(i, e.target.value)}
              placeholder="Sua reflexão..."
              rows={2}
              maxLength={300}
              className="bg-card/50 border-gold/15 text-sm resize-none"
            />
          </div>
        ))}
      </div>

      {/* Campo Corporal */}
      <div className="space-y-1.5">
        <Label className="text-[10px] uppercase tracking-widest text-gold/60">
          Registro Corporal (opcional)
        </Label>
        <Textarea
          value={registroCorpo}
          onChange={(e) => {
            setRegistroCorpo(e.target.value);
            emitChange({ registroCorpo: e.target.value });
          }}
          placeholder="Como seu corpo está agora? Tensões, sensações, temperatura..."
          rows={2}
          maxLength={200}
          className="bg-card/50 border-gold/15 text-sm resize-none"
        />
      </div>

      {/* Professional Mode Fields */}
      {isProfessional && (
        <div className="space-y-4 border-t border-purple-500/20 pt-4 mt-4">
          <p className="text-[10px] uppercase tracking-widest text-purple-400/70">
            Observação Clínica
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-purple-400/80">Crença Central Identificada</Label>
              <Input
                value={crencaCentral}
                onChange={(e) => {
                  setCrencaCentral(e.target.value);
                  emitChange({ crencaCentral: e.target.value });
                }}
                placeholder="Ex: 'Eu não mereço ser vista'"
                className="bg-card/50 border-purple-500/20 text-sm"
                maxLength={150}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-purple-400/80">Emoção Dominante</Label>
              <Input
                value={emocaoDominante}
                onChange={(e) => {
                  setEmocaoDominante(e.target.value);
                  emitChange({ emocaoDominante: e.target.value });
                }}
                placeholder="Ex: Vergonha, medo, raiva contida"
                className="bg-card/50 border-purple-500/20 text-sm"
                maxLength={100}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-purple-400/80">Padrão Defensivo</Label>
              <Input
                value={padraoDefensivo}
                onChange={(e) => {
                  setPadraoDefensivo(e.target.value);
                  emitChange({ padraoDefensivo: e.target.value });
                }}
                placeholder="Ex: Racionalização, evitação"
                className="bg-card/50 border-purple-500/20 text-sm"
                maxLength={150}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-purple-400/80">Direcionamento Terapêutico</Label>
              <Input
                value={direcionamento}
                onChange={(e) => {
                  setDirecionamento(e.target.value);
                  emitChange({ direcionamentoTerapeutico: e.target.value });
                }}
                placeholder="Ex: Trabalhar corpo, aprofundar vínculo"
                className="bg-card/50 border-purple-500/20 text-sm"
                maxLength={200}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
