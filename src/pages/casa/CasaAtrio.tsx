import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Ear, BookOpen, Users, ArrowRight, Heart, Shield, AlertCircle } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';

const rooms = [
  {
    id: 'sustentacao',
    title: 'Sala da Sustentação',
    subtitle: 'Áudios curtos, encontros ao vivo, reflexões',
    description: 'Sobre limites, projeção, fadiga ética e a solidão de quem sustenta. Conteúdos vivos para pausar, respirar e lembrar.',
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
    subtitle: 'Estudos de caso e prática simbólica',
    description: 'Casos anonimizados, uso real das ferramentas em sessão, leituras oraculares comentadas.',
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
    description: 'Poucos tópicos. Regras claras. Não é terapia, não é desabafo. Troca entre pares que sustentam.',
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
            title="Casa das Tecelãs"
            subtitle="Espaço vivo de sustentação profissional"
            icon={<Heart className="w-5 h-5 text-purple-400" />}
            className="mb-8"
          />
        </motion.div>

        {/* Manifesto */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="glass p-6 rounded-2xl border border-purple-500/30 mb-8 max-w-3xl mx-auto"
        >
          <p className="text-foreground/90 leading-relaxed text-center italic">
            "Este não é um curso. Não é terapia. Não é bônus.
          </p>
          <p className="text-foreground/90 leading-relaxed text-center italic mt-3">
            É um espaço de sustentação para quem sustenta outros —
            terapeutas, facilitadoras, condutoras de processos simbólicos.
          </p>
          <p className="text-foreground/90 leading-relaxed text-center italic mt-3">
            Se você busca permanecer inteira enquanto sustenta, bem-vinda."
          </p>
        </motion.div>

        {/* Purpose Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto mb-10"
        >
          <div className="glass p-4 rounded-lg border border-muted/30 text-center">
            <Shield className="w-6 h-6 mx-auto mb-2 text-purple-400" />
            <p className="text-sm font-medium">Prevenção de Burnout</p>
            <p className="text-xs text-muted-foreground mt-1">Pausas, reflexões, escuta</p>
          </div>
          <div className="glass p-4 rounded-lg border border-muted/30 text-center">
            <Ear className="w-6 h-6 mx-auto mb-2 text-gold" />
            <p className="text-sm font-medium">Contenção Ética</p>
            <p className="text-xs text-muted-foreground mt-1">Limites, projeção, transferência</p>
          </div>
          <div className="glass p-4 rounded-lg border border-muted/30 text-center">
            <Heart className="w-6 h-6 mx-auto mb-2 text-rose-400" />
            <p className="text-sm font-medium">Comunidade Moderada</p>
            <p className="text-xs text-muted-foreground mt-1">Troca entre pares, regras claras</p>
          </div>
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
                transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
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

        {/* Ethical Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="glass p-4 rounded-lg border border-amber-500/30 max-w-2xl mx-auto mt-10 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-sm text-foreground/80">
            <p className="font-medium text-amber-400 mb-1">Nota sobre o espaço</p>
            <p>
              A Casa das Tecelãs é um espaço de sustentação profissional, não substitui supervisão clínica, 
              terapia pessoal ou formação continuada. É um complemento simbólico para quem já tem sua prática.
            </p>
          </div>
        </motion.div>

        {/* Access Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="text-sm text-muted-foreground text-center mt-6"
        >
          Acesso exclusivo para assinantes ativas.
        </motion.p>
      </div>
    </AppLayout>
  );
}
