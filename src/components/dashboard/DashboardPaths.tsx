import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass, GraduationCap, Cog, ArrowRight } from "lucide-react";

const anim = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

interface PathCard {
  icon: React.ElementType;
  title: string;
  description: string;
  links: { label: string; path: string }[];
  cta: string;
  ctaPath: string;
}

const paths: PathCard[] = [
  {
    icon: Compass,
    title: "Explorar a Si Mesma",
    description: "Ferramentas para autoconhecimento e exploração simbólica.",
    links: [
      { label: "Oráculos", path: "/oraculos" },
      { label: "Jardim da Psique", path: "/jardim-da-psique" },
      { label: "Quiz", path: "/quiz" },
      { label: "Mapa da Casa", path: "/mapa-casa" },
    ],
    cta: "Explorar a Casa",
    ctaPath: "/mapa-casa",
  },
  {
    icon: GraduationCap,
    title: "Estudar o Método",
    description: "Espaços de aprendizado e formação.",
    links: [
      { label: "Clube do Livro", path: "/clube-livro" },
      { label: "Cursos", path: "/cursos" },
      { label: "Narroterapia", path: "/narroterapia" },
      { label: "Portal Junguiano", path: "/portal-junguiano" },
    ],
    cta: "Entrar na Formação",
    ctaPath: "/cursos",
  },
  {
    icon: Cog,
    title: "Atuar como Terapeuta",
    description: "Ferramentas profissionais para condução de processos.",
    links: [
      { label: "Visão Geral", path: "/casa-das-maquinas" },
      { label: "Clientes", path: "/casa-das-maquinas/clientes" },
      { label: "Sessões", path: "/casa-das-maquinas/sessoes" },
      { label: "Painel Clínico", path: "/casa-das-maquinas/painel-clinico" },
    ],
    cta: "Abrir Casa das Máquinas",
    ctaPath: "/casa-das-maquinas",
  },
];

export function DashboardPaths() {
  const navigate = useNavigate();

  return (
    <div className="grid md:grid-cols-3 gap-5 mb-8">
      {paths.map((p, i) => {
        const Icon = p.icon;
        return (
          <motion.div key={p.title} {...anim(0.1 + i * 0.08)}>
            <Card className="glass border-primary/15 h-full flex flex-col">
              <CardContent className="pt-6 flex flex-col flex-1">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                  {p.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {p.links.map((link) => (
                    <button
                      key={link.path}
                      onClick={() => navigate(link.path)}
                      className="text-xs px-2.5 py-1 rounded-full bg-primary/5 text-primary/80 hover:bg-primary/10 hover:text-primary transition-colors border border-primary/10"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
                <div className="mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5 border-primary/20 text-primary hover:bg-primary/5"
                    onClick={() => navigate(p.ctaPath)}
                  >
                    {p.cta} <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
