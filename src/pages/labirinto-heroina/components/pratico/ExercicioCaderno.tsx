// ============================================
// EXERCÍCIO DO CADERNO DA JORNADA DA HEROÍNA
// Bloco estruturado: Título → Instrução → 3 Perguntas → Corpo → Profissional
// ============================================

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Check, ChevronDown, ChevronUp, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import type { LabirintoModo } from "../ModoSelector";

interface ExercicioData {
  titulo: string;
  instrucao: string;
  perguntas: [string, string, string];
}

interface ExercicioCadernoProps {
  faseName: string;
  modo: LabirintoModo;
  respostas: Record<string, string>;
  onChangeResposta: (key: string, value: string) => void;
  camposClinicos?: {
    crencaCentral: string;
    emocaoDominante: string;
    padraoDefensivo: string;
    direcionamento: string;
  };
  onChangeCampoClinico?: (key: string, value: string) => void;
  exercicioRealizado: boolean;
  onMarcarRealizado: () => void;
}

// Exercícios por fase — baseados no Caderno da Heroína
const EXERCICIOS: Record<string, ExercicioData> = {
  "O Chamado": {
    titulo: "Ouvir o Chamado",
    instrucao: "Sente-se em silêncio por 5 minutos. Permita que o incômodo fale sem julgamento.",
    perguntas: [
      "O que em mim pede atenção e ainda não foi nomeado?",
      "Que sussurro tenho ignorado repetidamente?",
      "Se esse chamado tivesse uma voz, o que ele diria?",
    ],
  },
  "A Ruptura": {
    titulo: "Nomear a Quebra",
    instrucao: "Identifique o momento exato em que o conhecido deixou de funcionar.",
    perguntas: [
      "O que se partiu em mim recentemente?",
      "Que certeza se tornou insustentável?",
      "O que estou deixando para trás ao aceitar essa ruptura?",
    ],
  },
  "A Descida": {
    titulo: "O Primeiro Passo Para Dentro",
    instrucao: "Desenhe ou descreva simbolicamente o que encontra ao descer para dentro de si.",
    perguntas: [
      "O que habita a parte de mim que evito?",
      "Que emoção surge quando paro de fugir?",
      "Se a sombra tivesse um rosto, como seria?",
    ],
  },
  "O Labirinto": {
    titulo: "Mapear a Repetição",
    instrucao: "Observe os padrões que se repetem na sua vida como caminhos circulares.",
    perguntas: [
      "Qual situação continua retornando com rostos diferentes?",
      "O que eu faço sempre da mesma forma esperando um resultado diferente?",
      "Onde está a saída que eu finjo não ver?",
    ],
  },
  "O Osso": {
    titulo: "Tocar a Essência",
    instrucao: "Tire todas as camadas de proteção e identifique o que resta quando não há mais disfarce.",
    perguntas: [
      "Quem sou eu quando não estou performando?",
      "Que verdade eu conheço mas tenho medo de viver?",
      "O que é irredutível em mim?",
    ],
  },
  "A Memória": {
    titulo: "Escutar os Ancestrais",
    instrucao: "Conecte-se com a história que veio antes de você. Que herança emocional você carrega?",
    perguntas: [
      "Que história da minha linhagem ressoa na minha vida?",
      "Que dor foi silenciada na minha família?",
      "O que herdei que não é meu, mas carrego como se fosse?",
    ],
  },
  "A Ferida": {
    titulo: "Nomear a Dor Central",
    instrucao: "Localize no corpo e na história a ferida que organiza suas defesas.",
    perguntas: [
      "Qual é a dor que está por trás de todas as outras?",
      "Quando foi a primeira vez que senti isso?",
      "Se eu pudesse falar com essa ferida, o que ela pediria?",
    ],
  },
  "A Defesa": {
    titulo: "Reconhecer a Armadura",
    instrucao: "Identifique os mecanismos que você criou para sobreviver — e que agora aprisionam.",
    perguntas: [
      "Que proteção era necessária antes, mas hoje me limita?",
      "Qual máscara uso com mais frequência?",
      "O que aconteceria se eu baixasse essa guarda agora?",
    ],
  },
  "O Espelho": {
    titulo: "Ver-se Sem Filtro",
    instrucao: "Olhe para si mesma como se fosse a primeira vez. Sem crítica. Sem elogio. Apenas presença.",
    perguntas: [
      "O que vejo quando me olho sem julgamento?",
      "Que parte de mim tenho dificuldade de aceitar?",
      "O que os outros veem em mim que eu não reconheço?",
    ],
  },
  "A Escolha": {
    titulo: "O Passo Sem Garantias",
    instrucao: "Reconheça que toda transformação exige uma decisão sem rede de segurança.",
    perguntas: [
      "Qual decisão estou adiando por medo do desconhecido?",
      "O que preciso abandonar para seguir adiante?",
      "Que compromisso estou pronta para assumir comigo mesma?",
    ],
  },
  "A Integração": {
    titulo: "Reunir os Fragmentos",
    instrucao: "Traga de volta as partes que foram separadas. A luz e a sombra pertencem ao mesmo corpo.",
    perguntas: [
      "Que parte rejeitada de mim está pedindo para retornar?",
      "Como posso honrar tanto minha força quanto minha fragilidade?",
      "O que surge quando permito que opostos coexistam?",
    ],
  },
  "A Voz": {
    titulo: "Falar a Verdade",
    instrucao: "Encontre as palavras que nunca foram ditas. Dê voz ao que foi silenciado.",
    perguntas: [
      "O que eu preciso dizer que nunca disse?",
      "Para quem essa voz se dirige?",
      "Que verdade minha voz carrega quando para de se desculpar?",
    ],
  },
  "O Retorno": {
    titulo: "A Nova Mulher no Mundo",
    instrucao: "Você atravessou. Agora, como retorna ao mundo com o que aprendeu?",
    perguntas: [
      "O que trago de volta desta travessia?",
      "Como vou viver de forma diferente a partir de agora?",
      "Que dom esta jornada me revelou?",
    ],
  },
  "A Guardiã": {
    titulo: "Incorporar a Sabedoria",
    instrucao: "Você não é mais a mesma. Nomeie a guardiã que nasceu em você.",
    perguntas: [
      "Que sabedoria agora guia meus passos?",
      "O que protejo com consciência, não com medo?",
      "Se eu pudesse dar um conselho à mulher que começou esta jornada, qual seria?",
    ],
  },
};

export function ExercicioCaderno({
  faseName,
  modo,
  respostas,
  onChangeResposta,
  camposClinicos,
  onChangeCampoClinico,
  exercicioRealizado,
  onMarcarRealizado,
}: ExercicioCadernoProps) {
  const [showCorpo, setShowCorpo] = useState(false);

  const exercicio = EXERCICIOS[faseName] || {
    titulo: "Reflexão da Travessia",
    instrucao: "Reflita sobre o que esta fase está pedindo de você.",
    perguntas: [
      "O que esta porta revela sobre mim?",
      "O que preciso soltar para atravessar?",
      "O que levo comigo desta passagem?",
    ],
  };

  return (
    <Card className="border-amber-500/30 bg-amber-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="w-5 h-5 text-amber-500" />
          📘 {exercicio.titulo}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Instrução objetiva */}
        <p className="text-foreground/80 leading-relaxed text-sm">
          {exercicio.instrucao}
        </p>

        {/* 3 Perguntas de aprofundamento */}
        <div className="space-y-4">
          {exercicio.perguntas.map((pergunta, i) => (
            <div key={i}>
              <label className="text-sm text-muted-foreground block mb-1.5">
                {i + 1}. {pergunta}
              </label>
              <Textarea
                value={respostas[`pergunta_${i}`] || ""}
                onChange={(e) => onChangeResposta(`pergunta_${i}`, e.target.value)}
                placeholder="Escreva sua resposta..."
                rows={2}
                className="bg-card/50"
              />
            </div>
          ))}
        </div>

        {/* Campo corporal opcional */}
        <div>
          <button
            type="button"
            onClick={() => setShowCorpo(!showCorpo)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {showCorpo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Registro corporal (opcional)
          </button>
          {showCorpo && (
            <Textarea
              value={respostas["corpo"] || ""}
              onChange={(e) => onChangeResposta("corpo", e.target.value)}
              placeholder="Onde no corpo você sentiu? Que sensação surgiu?"
              rows={2}
              className="bg-card/50 mt-2"
            />
          )}
        </div>

        {/* Campos Clínicos — Modo Profissional */}
        {modo === "profissional" && camposClinicos && onChangeCampoClinico && (
          <div className="pt-4 border-t border-amber-500/20 space-y-3">
            <h4 className="flex items-center gap-2 text-sm font-medium text-foreground/70">
              <Stethoscope className="w-4 h-4 text-gold" />
              Leitura Clínica
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Crença central identificada</label>
                <Input
                  value={camposClinicos.crencaCentral}
                  onChange={(e) => onChangeCampoClinico("crencaCentral", e.target.value)}
                  placeholder="Ex: 'Eu não sou suficiente'"
                  className="bg-card/50 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Emoção dominante</label>
                <Input
                  value={camposClinicos.emocaoDominante}
                  onChange={(e) => onChangeCampoClinico("emocaoDominante", e.target.value)}
                  placeholder="Ex: vergonha, raiva contida"
                  className="bg-card/50 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Padrão defensivo</label>
                <Input
                  value={camposClinicos.padraoDefensivo}
                  onChange={(e) => onChangeCampoClinico("padraoDefensivo", e.target.value)}
                  placeholder="Ex: evitação, racionalização"
                  className="bg-card/50 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Direcionamento terapêutico</label>
                <Input
                  value={camposClinicos.direcionamento}
                  onChange={(e) => onChangeCampoClinico("direcionamento", e.target.value)}
                  placeholder="Ex: trabalhar vínculo, ampliar..."
                  className="bg-card/50 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Marcar realizado */}
        {!exercicioRealizado ? (
          <Button
            onClick={onMarcarRealizado}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white gap-2"
          >
            <Check className="w-4 h-4" />
            Marcar exercício como realizado
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-2 py-2 text-emerald-500">
            <Check className="w-5 h-5" />
            <span className="font-medium">Exercício realizado</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
