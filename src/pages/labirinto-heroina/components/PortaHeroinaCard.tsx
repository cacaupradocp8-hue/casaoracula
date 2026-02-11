import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PortaData {
  id: string;
  numero: number;
  nome: string;
  subtitulo?: string | null;
  imagem_url?: string | null;
  campo_pede?: string | null;
  pergunta_chave?: string | null;
  cena_narrativa?: string | null;
  eixo_psiquico?: string | null;
  symbolic_focus?: string | null;
}

interface PortaHeroinaCardProps {
  porta: PortaData;
  onSaveToMap?: (portaId: string, resposta: string) => void;
  isSaving?: boolean;
}

// Placeholder image for portas without images
const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 600'%3E%3Crect fill='%231a1510' width='400' height='600'/%3E%3Ctext x='200' y='300' text-anchor='middle' fill='%23d4a574' font-size='40' font-family='serif'%3E✧%3C/text%3E%3C/svg%3E";

export function PortaHeroinaCard({ porta, onSaveToMap, isSaving }: PortaHeroinaCardProps) {
  const [resposta, setResposta] = useState("");
  const [expanded, setExpanded] = useState(false);

  const imageUrl = porta.imagem_url || PLACEHOLDER_IMG;

  const handleSave = () => {
    if (onSaveToMap && resposta.trim()) {
      onSaveToMap(porta.id, resposta);
    }
  };

  return (
    <Card
      className={cn(
        "overflow-hidden border-2 border-gold/20 transition-all duration-300",
        "hover:border-gold/50 hover:shadow-lg hover:shadow-gold/10",
        "bg-card/80 flex flex-col"
      )}
    >
      {/* Moldura Visual Padronizada */}
      <div className="relative">
        {/* Image Area — 2:3 ratio */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={porta.nome}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

          {/* Porta Number Badge */}
          <div className="absolute top-3 left-3">
            <span className="w-8 h-8 flex items-center justify-center bg-black/60 border border-gold/50 rounded-full text-gold text-sm font-bold">
              {porta.numero}
            </span>
          </div>

          {/* Name overlay at bottom */}
          <div className="absolute bottom-0 inset-x-0 p-4">
            <h3 className="font-display text-lg text-gold drop-shadow-lg leading-tight">
              {porta.nome}
            </h3>
            {porta.subtitulo && (
              <p className="text-xs text-gold/70 italic mt-1">{porta.subtitulo}</p>
            )}
          </div>
        </div>

        {/* Gold frame line */}
        <div className="absolute inset-0 border-2 border-gold/10 pointer-events-none" />
      </div>

      {/* Card Content */}
      <CardContent className="p-4 space-y-4 flex-1 flex flex-col">
        {/* Tema Central */}
        {porta.campo_pede && (
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gold/60 mb-1">
              Tema Central
            </p>
            <p className="text-sm text-foreground/90 leading-relaxed">
              {porta.campo_pede}
            </p>
          </div>
        )}

        {/* Pergunta Terapêutica-Chave */}
        {porta.pergunta_chave ? (
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gold/60 mb-1">
              Pergunta-Chave
            </p>
            <p className="text-sm text-foreground/80 italic leading-relaxed">
              {porta.pergunta_chave}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gold/60 mb-1">
              Pergunta-Chave
            </p>
            <p className="text-xs text-muted-foreground italic">
              Conteúdo em preparação
            </p>
          </div>
        )}

        {/* Expandable Details */}
        {!expanded ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(true)}
            className="text-gold/70 hover:text-gold text-xs w-full"
          >
            Abrir carta completa
          </Button>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Exercício */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gold/60 mb-1">
                Exercício
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {porta.cena_narrativa || "Exercício em preparação — será adicionado em breve."}
              </p>
            </div>

            {/* Ritual de Integração */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gold/60 mb-1">
                Ritual de Integração
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {porta.eixo_psiquico || "Ritual em preparação — será adicionado em breve."}
              </p>
            </div>

            {/* Campo de Resposta */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gold/60 mb-2">
                Minha Resposta
              </p>
              <Textarea
                value={resposta}
                onChange={(e) => setResposta(e.target.value)}
                placeholder="Escreva aqui sua reflexão sobre esta porta..."
                rows={4}
                maxLength={500}
                className="bg-card/50 border-gold/20 text-sm resize-none"
              />
              <p className="text-[10px] text-muted-foreground/50 text-right mt-1">
                {resposta.length}/500
              </p>
            </div>

            {/* Salvar no Mapa */}
            <Button
              onClick={handleSave}
              disabled={!resposta.trim() || isSaving}
              className="w-full bg-gold hover:bg-gold/90 text-gold-foreground gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar no Mapa"
              )}
            </Button>

            {/* Collapse */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(false)}
              className="text-muted-foreground/60 text-xs w-full"
            >
              Fechar carta
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
