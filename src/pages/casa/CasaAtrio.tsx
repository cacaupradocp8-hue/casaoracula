import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Ear, BookOpen, Users, ArrowRight, Sparkles } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';

const rooms = [
  {
    id: 'sustentacao',
    title: 'Sala da Sustentação',
    subtitle: 'Conteúdos vivos, sem trilha, sem obrigatoriedade',
    description: 'Encontros ao vivo, áudios curtos e textos breves. Sobre limites, projeção, fadiga, ética e a solidão de quem sustenta.',
    icon: Ear,
    path: '/casa/sustentacao',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    hoverColor: 'hover:border-purple-500/50',
  },
  {
    id: 'leitura',
    title: 'Sala da Leitura',
    subtitle: 'Estudos de caso e uso prático das ferramentas',
    description: 'Estudos de caso anonimizados, uso prático das Ferramentas Oraculares em sessões reais, vídeos curtos e exemplos concretos.',
    icon: BookOpen,
    path: '/casa/leitura',
    color: 'text-gold',
    bgColor: 'bg-gold/10',
    borderColor: 'border-gold/30',
    hoverColor: 'hover:border-gold/50',
  },
  {
    id: 'circulo',
    title: 'Sala do Círculo',
    subtitle: 'Fórum moderado para troca profissional',
    description: 'Fórum moderado para troca profissional. Poucos tópicos ativos. Regras claras. Não é terapia, não é desabafo.',
    icon: Users,
    path: '/casa/circulo',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    hoverColor: 'hover:border-blue-500/50',
  },
];

export default function CasaAtrio() {
  const navigate = useNavigate();
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SectionHeader
            title="Casa Orácula"
            subtitle="Sustentação, refinamento e maturação profissional"
            icon={<Sparkles className="w-5 h-5" />}
            className="mb-8"
          />
        </motion.div>

        {/* Manifesto */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="glass p-6 rounded-2xl border border-gold/20 mb-10 max-w-3xl mx-auto text-center"
        >
          <p className="text-foreground/90 leading-relaxed italic">
            "Este não é um espaço de aprendizado técnico. É um espaço de sustentação, refinamento e maturação
            para mulheres que trabalham com o invisível."
          </p>
        </motion.div>

        {/* Room Cards */}
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {rooms.map((room, index) => {
            const Icon = room.icon;
            const isHovered = hoveredRoom === room.id;
            
            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                onMouseEnter={() => setHoveredRoom(room.id)}
                onMouseLeave={() => setHoveredRoom(null)}
              >
                <Card 
                  className={`glass h-full transition-all duration-300 cursor-pointer ${room.borderColor} ${room.hoverColor} ${isHovered ? 'scale-[1.02] shadow-lg' : ''}`}
                  onClick={() => navigate(room.path)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full ${room.bgColor} flex items-center justify-center mb-4 transition-transform ${isHovered ? 'scale-110' : ''}`}>
                      <Icon className={`w-8 h-8 ${room.color}`} />
                    </div>
                    <CardTitle className="text-lg">{room.title}</CardTitle>
                    <CardDescription className={room.color}>{room.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      {room.description}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`${room.color} gap-1`}
                    >
                      Entrar <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-sm text-muted-foreground text-center mt-10"
        >
          Este espaço permanece ativo antes, durante e após a Mentoria.
        </motion.p>
      </div>
    </AppLayout>
  );
}
