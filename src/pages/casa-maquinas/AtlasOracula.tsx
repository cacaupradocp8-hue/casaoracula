import React from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, 
  Lightbulb, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  Zap,
  Search,
  History,
  Info,
  Layers,
  Brain,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { atlasModules } from '@/data/atlasModules';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const thoughtProcess = [
  { step: 1, title: 'Recolhe sinais', icon: <Search className="w-4 h-4" /> },
  { step: 2, title: 'Organiza camadas', icon: <Layers className="w-4 h-4" /> },
  { step: 3, title: 'Levanta hipóteses', icon: <Lightbulb className="w-4 h-4" /> },
  { step: 4, title: 'Observa riscos', icon: <AlertTriangle className="w-4 h-4" /> },
  { step: 5, title: 'Sugere direção', icon: <Compass className="w-4 h-4" /> },
  { step: 6, title: 'Conecta intervenções', icon: <Zap className="w-4 h-4" /> },
  { step: 7, title: 'Acompanha evolução', icon: <History className="w-4 h-4" /> },
];


export default function AtlasOracula() {
  return (
    <CasaMaquinasLayout 
      title="Atlas Orácula"
      subtitle="Copiloto de formulação clínico-simbólica para organizar casos, hipóteses, riscos, direção e intervenção."
    >
      <div className="space-y-12 pb-20">
        
        {/* Bloco de Ética */}
        <motion.div {...fadeInUp}>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="w-5 h-5" />
                <CardTitle className="text-lg font-display">Limites éticos do Atlas</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                O Atlas Orácula não realiza diagnóstico, não substitui avaliação profissional e não deve ser usado como decisão automática. 
                Ele serve para apoiar raciocínio, organizar hipóteses, sugerir perguntas e fortalecer a supervisão do caso.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Grade de Formulação */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AtlasCard 
            icon={<Search className="w-6 h-6 text-primary" />}
            title="1. Entender o caso"
            description="Reunir história, contexto, queixa, padrões e sinais relevantes antes de escolher qualquer intervenção."
          />
          <AtlasCard 
            icon={<Lightbulb className="w-6 h-6 text-primary" />}
            title="2. Levantar hipóteses"
            description="Organizar hipóteses possíveis sem transformar formulação em diagnóstico definitivo."
          />
          <AtlasCard 
            icon={<AlertTriangle className="w-6 h-6 text-accent" />}
            title="3. Observar riscos"
            description="Identificar sinais que exigem cautela, encaminhamento, supervisão ou pausa na exploração simbólica."
          />
          <AtlasCard 
            icon={<Compass className="w-6 h-6 text-primary" />}
            title="4. Definir direção"
            description="Escolher se o caso pede estabilização, regulação, investigação de crenças, trabalho simbólico, limites ou acompanhamento."
          />
          <AtlasCard 
            icon={<Zap className="w-6 h-6 text-primary" />}
            title="5. Escolher intervenção"
            description="Conectar a leitura do caso com práticas, protocolos, perguntas e recursos adequados."
          />
          <AtlasCard 
            icon={<History className="w-6 h-6 text-primary" />}
            title="6. Acompanhar evolução"
            description="Registrar mudanças, padrões recorrentes, respostas às intervenções e próximos passos."
          />
        </div>

        {/* Módulos que alimentarão o Atlas */}
        <motion.section {...fadeInUp} className="space-y-6">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-display text-foreground">Módulos que alimentarão o Atlas</h3>
            <p className="text-sm text-muted-foreground">O Atlas atua como o eixo integrador das camadas simbólicas da Casa Orácula.</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {modules.map((module) => (
              <Card key={module.name} className="bg-card/40 border-border/40 hover:border-primary/20 transition-all group">
                <CardContent className="p-4 flex flex-col justify-between h-full gap-2">
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{module.name}</span>
                  <Badge variant="secondary" className="w-fit text-[10px] uppercase tracking-wider py-0 px-2 font-normal opacity-60">
                    {module.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

      </div>
    </CasaMaquinasLayout>
  );
}

function AtlasCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div {...fadeInUp} whileHover={{ y: -4 }} className="h-full">
      <Card className="h-full border-border/40 bg-card/60 backdrop-blur-sm hover:border-primary/20 transition-all flex flex-col">
        <CardHeader>
          <div className="mb-4 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
          <CardTitle className="text-base font-display">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
