import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, AlertTriangle, Lightbulb, Shield, 
  Heart, Eye, Compass 
} from "lucide-react";

const GUIA_SECTIONS = [
  {
    icon: <Compass className="w-5 h-5 text-gold" />,
    title: "Propósito da Ferramenta",
    content:
      "O Labirinto da Heroína Interna® é uma ferramenta de aplicação prática que integra o Livro A Jornada da Heroína, o Caderno de Atividades e os Arquétipos Femininos. Não é um oráculo independente — é um ecossistema simbólico de apoio à individuação.",
  },
  {
    icon: <Eye className="w-5 h-5 text-gold" />,
    title: "Postura Clínica",
    content:
      "Mantenha a escuta simbólica ativa. Não interprete diretamente — facilite a elaboração da cliente. As cartas e camadas são espelhos, não diagnósticos. Seu papel é sustentar o campo para que a cliente construa sentido.",
  },
  {
    icon: <Heart className="w-5 h-5 text-gold" />,
    title: "Registro e Acompanhamento",
    content:
      "Utilize os campos de Observações Clínicas e Hipótese Terapêutica para documentar sua leitura profissional. Esses dados ficam protegidos e visíveis apenas para você. A ficha de acompanhamento em PDF pode ser gerada a qualquer momento.",
  },
  {
    icon: <Shield className="w-5 h-5 text-gold" />,
    title: "Limites Éticos",
    content:
      "Nunca compartilhe os registros clínicos com a cliente sem mediação. O Labirinto não substitui avaliação psicológica formal. Em caso de conteúdos de risco, aplique os protocolos clínicos habituais.",
  },
  {
    icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    title: "Contraindicações",
    content:
      "Evite uso em contextos de crise aguda, surtos psicóticos ou dissociação severa. A ferramenta pressupõe capacidade reflexiva mínima. Se a cliente apresentar conteúdo de risco, priorize acolhimento e encaminhamento.",
  },
  {
    icon: <Lightbulb className="w-5 h-5 text-gold" />,
    title: "Dicas de Condução",
    content:
      "Comece sempre pela escuta do momento presente da cliente. Permita que ela escolha a carta ou camada que mais ressoa. Use as reflexões registradas como pontes entre sessões. Finalize com um gesto simbólico de integração.",
  },
];

export function GuiaTerapeutaTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-6 h-6 text-gold" />
        <h2 className="font-display text-xl text-gold">
          Guia da Terapeuta
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {GUIA_SECTIONS.map((section) => (
          <Card key={section.title} className="border-gold/20 bg-card/60">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                {section.icon}
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {section.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
