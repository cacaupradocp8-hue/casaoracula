import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Info, 
  ShieldCheck, 
  User, 
  Search, 
  Lightbulb, 
  AlertTriangle, 
  Compass, 
  Zap, 
  History,
  BookOpen,
  Layers,
  Brain,
  MessageSquare,
  Wrench,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function CasoDemonstrativoPage() {
  const navigate = useNavigate();

  const cycleSteps = [
    {
      id: 'entender',
      title: '1. Entender o Caso',
      icon: <Search className="w-5 h-5 text-primary" />,
      content: 'Tema aparente: dificuldade de limites e sobrecarga relacional.',
      route: '/casa-das-maquinas/atlas/entender-caso'
    },
    {
      id: 'hipoteses',
      title: '2. Levantar Hipóteses',
      icon: <Lightbulb className="w-5 h-5 text-primary" />,
      content: 'Hipóteses provisórias: crença de responsabilidade excessiva, padrão relacional repetitivo, dificuldade de reconhecer limites internos.',
      route: '/casa-das-maquinas/atlas/levantar-hipoteses'
    },
    {
      id: 'cautela',
      title: '3. Observar Sinais de Cautela',
      icon: <AlertTriangle className="w-5 h-5 text-accent" />,
      content: 'Cautela moderada: observar intensidade, rede de apoio e necessidade de supervisão se houver agravamento.',
      route: '/casa-das-maquinas/atlas/observar-cautela'
    },
    {
      id: 'direcao',
      title: '4. Definir Direção',
      icon: <Compass className="w-5 h-5 text-primary" />,
      content: 'Direção provisória: fortalecer limites, organizar narrativa e investigar crenças de responsabilidade.',
      route: '/casa-das-maquinas/atlas/definir-direcao'
    },
    {
      id: 'intervencao',
      title: '5. Escolher Intervenção',
      icon: <Zap className="w-5 h-5 text-primary" />,
      content: 'Possibilidades: pergunta terapêutica, escrita reflexiva, mapa de padrões e prática simples de limite.',
      route: '/casa-das-maquinas/atlas/escolher-intervencao'
    },
    {
      id: 'evolucao',
      title: '6. Acompanhar Evolução',
      icon: <History className="w-5 h-5 text-primary" />,
      content: 'Observar se há mais clareza, redução de sobrecarga e capacidade de reconhecer padrões antes de avançar.',
      route: '/casa-das-maquinas/atlas/acompanhar-evolucao'
    }
  ];

  const suggestedModules = [
    { title: 'R.O.T.A.I / Crenças', desc: 'Para investigar as crenças de responsabilidade excessiva identificadas nas hipóteses.' },
    { title: 'Labirinto', desc: 'Para mapear os caminhos repetitivos que Marina percorre em seus relacionamentos.' },
    { title: 'Torre Viva', desc: 'Para observar a estrutura de sustentação psíquica e os limites atuais.' },
    { title: '7 Vozes', desc: 'Para identificar quais vozes internas (ex: a "Voz da Cuidadora") estão gerando sobrecarga.' },
    { title: 'Mapa Vivo', desc: 'Para visualizar a cartografia atual do caso e as áreas de tensão.' },
    { title: 'Biblioteca de Intervenções', desc: 'Para buscar práticas específicas de regulação e estabelecimento de limites.' }
  ];

  return (
    <CasaMaquinasLayout 
      title="Caso Demonstrativo — Marina"
      subtitle="Exemplo prático de como o Atlas Orácula organiza o raciocínio clínico-simbólico."
    >
      <div className="max-w-5xl mx-auto space-y-10 pb-20">
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/casa-das-maquinas/atlas')} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Atlas
          </Button>
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
            Modo Demonstrativo
          </Badge>
        </div>

        {/* Secção 1 — Apresentação do caso */}
        <motion.section {...fadeInUp} className="space-y-6">
          <Card className="border-primary/20 bg-primary/5 overflow-hidden">
            <div className="h-2 bg-primary/20 w-full" />
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-display">Marina (Caso Fictício)</CardTitle>
                  <CardDescription>Perfil pedagógico para demonstração do Atlas</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                    <Info className="w-4 h-4" /> Contexto do Caso
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Marina é uma cliente fictícia criada apenas para demonstração. Ela relata dificuldade em manter limites, sensação de sobrecarga e repetição de padrões relacionais. 
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                    <Activity className="w-4 h-4" /> Objetivo Pedagógico
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Demonstrar como o Atlas organiza sinais, hipóteses, cautelas, direção, intervenção e evolução de forma ética e prudente.
                  </p>
                </div>
              </div>
              
              <Alert className="bg-background/50 border-primary/10">
                <Brain className="h-4 w-4 text-primary" />
                <AlertTitle className="text-xs uppercase tracking-wider font-bold text-primary">Tema Central</AlertTitle>
                <AlertDescription className="text-sm">
                  Dificuldade de limites e sobrecarga relacional.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </motion.section>

        {/* Secção 2 — Como o Atlas leria este caso */}
        <motion.section {...fadeInUp} className="space-y-6">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-display text-foreground flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" /> Como o Atlas leria este caso
            </h3>
            <p className="text-sm text-muted-foreground italic">O ciclo completo de formulação aberta e provisória.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cycleSteps.map((step, index) => (
              <Card key={step.id} className="border-border/40 bg-card/40 hover:border-primary/20 transition-all">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center gap-2">
                    {step.icon}
                    <CardTitle className="text-sm font-display">{step.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  <p className="text-xs text-muted-foreground leading-relaxed italic">
                    "{step.content}"
                  </p>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="h-auto p-0 text-[11px] text-primary"
                    onClick={() => navigate(step.route)}
                  >
                    Ver ferramenta de fluxo <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Secção 3 — Módulos envolvidos */}
        <motion.section {...fadeInUp} className="space-y-6">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-display text-foreground flex items-center gap-2">
              <Wrench className="w-5 h-5 text-primary" /> Módulos envolvidos
            </h3>
            <p className="text-sm text-muted-foreground">Ferramentas que poderiam alimentar este caso específico.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestedModules.map((module, idx) => (
              <Card key={idx} className="bg-card/20 border-border/40 p-4 space-y-2">
                <h4 className="text-sm font-semibold text-primary">{module.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {module.desc}
                </p>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Secção 4 — Aviso ético */}
        <motion.section {...fadeInUp}>
          <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
            <ShieldCheck className="h-5 w-5" />
            <AlertTitle className="font-display">Compromisso Ético e Técnico</AlertTitle>
            <AlertDescription className="text-sm leading-relaxed opacity-90">
              Este caso é fictício e serve apenas para demonstração. O Atlas Orácula não gera diagnóstico, não substitui supervisão e não decide pela profissional. As leituras apresentadas são exemplos de **formulação aberta** e **síntese provisória**. Nenhuma IA foi consultada e nenhum dado foi persistido no banco de dados.
            </AlertDescription>
          </Alert>
        </motion.section>

        {/* Secção 5 — Navegação Final */}
        <motion.section {...fadeInUp} className="pt-6 border-t border-border/40 flex flex-wrap justify-center gap-4">
          <Button variant="outline" onClick={() => navigate('/casa-das-maquinas/atlas')} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Painel do Atlas
          </Button>
          <Button onClick={() => navigate('/casa-das-maquinas/atlas/entender-caso')} className="gap-2">
            Praticar Fluxo Real <Zap className="w-4 h-4" />
          </Button>
        </motion.section>

      </div>
    </CasaMaquinasLayout>
  );
}
