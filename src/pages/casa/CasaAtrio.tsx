import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Ear, BookOpen, Users, ArrowRight, Heart, Shield, AlertCircle, Leaf } from 'lucide-react';

const rooms = [
  {
    id: 'jardim',
    title: 'Jardim da Psique',
    subtitle: 'Diário arquetípico privado',
    description: 'Sonhos, oráculos, frases que tocaram. Campo de memória simbólica que pode ser revisitado.',
    icon: Leaf,
    path: '/jardim-da-psique',
    accent: 'from-emerald-500/20 to-emerald-600/5',
    iconColor: 'text-emerald-400',
    borderHover: 'hover:border-emerald-500/40',
  },
  {
    id: 'sustentacao',
    title: 'Sala da Sustentação',
    subtitle: 'Áudios curtos, encontros ao vivo, reflexões',
    description: 'Sobre limites, projeção, fadiga ética e a solidão de quem sustenta.',
    icon: Ear,
    path: '/casa/sustentacao',
    accent: 'from-purple-500/20 to-purple-600/5',
    iconColor: 'text-purple-400',
    borderHover: 'hover:border-purple-500/40',
  },
  {
    id: 'leitura',
    title: 'Sala da Leitura',
    subtitle: 'Estudos de caso e prática simbólica',
    description: 'Casos anonimizados, uso real das ferramentas em sessão, leituras oraculares comentadas.',
    icon: BookOpen,
    path: '/casa/leitura',
    accent: 'from-primary/20 to-primary/5',
    iconColor: 'text-primary',
    borderHover: 'hover:border-primary/40',
  },
  {
    id: 'circulo',
    title: 'Sala do Círculo',
    subtitle: 'Fórum moderado para troca profissional',
    description: 'Poucos tópicos. Regras claras. Troca entre pares que sustentam.',
    icon: Users,
    path: '/casa/circulo',
    accent: 'from-blue-500/20 to-blue-600/5',
    iconColor: 'text-blue-400',
    borderHover: 'hover:border-blue-500/40',
  },
];

export default function CasaAtrio() {
  const navigate = useNavigate();
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  return (
    <AppLayout>
      <div className="relative">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                <Heart className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-300">Espaço de Sustentação</span>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 leading-tight">
                Casa das <span className="text-gold-gradient">Tecelãs</span>
              </h1>
              
              <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-10">
                Espaço vivo de sustentação profissional para quem sustenta outros
              </p>
            </motion.div>

            {/* Manifesto */}
            <motion.blockquote
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="max-w-2xl mx-auto mb-16"
            >
              <div className="relative px-8 py-6">
                <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500/40 to-transparent" />
                <p className="text-foreground/80 leading-relaxed italic text-lg font-display">
                  "Este não é um curso. Não é terapia. Não é bônus. É um espaço de sustentação para quem sustenta outros — terapeutas, facilitadoras, condutoras de processos simbólicos."
                </p>
              </div>
            </motion.blockquote>
          </div>
        </section>

        {/* Pilares */}
        <section className="container mx-auto px-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto"
          >
            {[
              { icon: Shield, label: 'Prevenção de Burnout', desc: 'Pausas, reflexões, escuta', color: 'text-purple-400' },
              { icon: Ear, label: 'Contenção Ética', desc: 'Limites, projeção, transferência', color: 'text-primary' },
              { icon: Heart, label: 'Comunidade Moderada', desc: 'Troca entre pares, regras claras', color: 'text-rose-400' },
            ].map((pilar, i) => (
              <Card key={i} className="glass border-border/20 hover:border-primary/20 transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center">
                    <pilar.icon className={`w-6 h-6 ${pilar.color}`} />
                  </div>
                  <p className="font-display text-base font-semibold text-foreground mb-1">{pilar.label}</p>
                  <p className="text-xs text-muted-foreground">{pilar.desc}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </section>

        {/* Room Cards */}
        <section className="container mx-auto px-4 pb-16">
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {rooms.map((room, index) => {
              const Icon = room.icon;
              const isHovered = hoveredRoom === room.id;
              
              return (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                  onMouseEnter={() => setHoveredRoom(room.id)}
                  onMouseLeave={() => setHoveredRoom(null)}
                >
                  <Card 
                    className={`relative overflow-hidden border-border/20 ${room.borderHover} transition-all duration-300 cursor-pointer group ${isHovered ? 'shadow-lg shadow-primary/5' : ''}`}
                    onClick={() => navigate(room.path)}
                  >
                    {/* Gradient accent */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${room.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <CardContent className="relative p-6 flex gap-5">
                      <div className={`w-14 h-14 shrink-0 rounded-xl bg-card border border-border/30 flex items-center justify-center group-hover:scale-105 transition-transform`}>
                        <Icon className={`w-7 h-7 ${room.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-lg font-semibold text-foreground mb-1">{room.title}</h3>
                        <p className={`text-sm ${room.iconColor} mb-2`}>{room.subtitle}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{room.description}</p>
                        <div className="flex items-center gap-1 mt-3 text-sm text-foreground/50 group-hover:text-foreground/80 transition-colors">
                          Entrar <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Ethical Note */}
        <section className="container mx-auto px-4 pb-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <div className="flex items-start gap-3 p-5 rounded-xl border border-amber-500/20 bg-amber-500/5">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-sm text-foreground/70">
                <p className="font-medium text-amber-400/90 mb-1">Nota sobre o espaço</p>
                <p className="leading-relaxed">
                  A Casa das Tecelãs é um espaço de sustentação profissional, não substitui supervisão clínica, 
                  terapia pessoal ou formação continuada. É um complemento simbólico para quem já tem sua prática.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <p className="text-center text-muted-foreground/30 text-xs py-8">Acesso exclusivo para assinantes ativas.</p>
      </div>
    </AppLayout>
  );
}
