import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, Brain, Compass, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ferramentas = [
  {
    id: 'big5',
    title: 'Big Five (OCEAN)',
    description: 'Avalie as cinco grandes dimensões da personalidade: Abertura, Conscienciosidade, Extroversão, Amabilidade e Neuroticismo.',
    icon: Brain,
    path: '/salas/big5',
    color: 'from-purple-500/20 to-purple-600/10',
  },
  {
    id: 'eneagrama',
    title: 'Eneagrama',
    description: 'Explore os 9 tipos de personalidade, asas e instintos. Compreenda padrões de defesa e virtudes a cultivar.',
    icon: Compass,
    path: '/salas/eneagrama',
    color: 'from-blue-500/20 to-blue-600/10',
  },
  {
    id: 'oraculo',
    title: 'Oráculo das Perguntas Desafiadoras',
    description: 'Acesse um banco de perguntas poderosas para usar em sessões. Sorteie, favorite e registre aplicações.',
    icon: HelpCircle,
    path: '/salas/oraculo-perguntas',
    color: 'from-gold/20 to-amber-600/10',
  },
];

export default function Salas() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <SectionHeader
          title="Salas & Ferramentas"
          subtitle="Recursos práticos para enriquecer sua atuação clínica"
          icon={<Wrench className="w-5 h-5" />}
          className="mb-8"
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ferramentas.map(tool => {
            const Icon = tool.icon;
            return (
              <Card
                key={tool.id}
                className={`glass hover:border-gold/50 transition-all bg-gradient-to-br ${tool.color}`}
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-background/50 flex items-center justify-center mb-3">
                    <Icon className="w-7 h-7 text-gold" />
                  </div>
                  <CardTitle className="text-xl">{tool.title}</CardTitle>
                  <CardDescription className="text-sm">{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={tool.path}>
                    <Button variant="gold" className="w-full">
                      Acessar Ferramenta
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
