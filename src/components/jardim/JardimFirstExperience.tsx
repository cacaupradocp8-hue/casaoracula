import { motion } from 'framer-motion';
import { Compass, Sparkles, Heart, Leaf, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

type ProfileTag = 'perfil_profissional_atuante' | 'perfil_terapeuta_integrativa' | 'perfil_buscadora';

interface JardimProfile {
  icon: React.ReactNode;
  ambiance: string;
  portals: Array<{ name: string; description: string; route: string }>;
}

const JARDIM_BY_TAG: Record<ProfileTag, JardimProfile> = {
  perfil_profissional_atuante: {
    icon: <Compass className="w-6 h-6" />,
    ambiance:
      'Este é o seu espaço de sustentação e refinamento. Aqui você não acumula — você decanta. O Jardim guarda o que precisa ser revisitado com presença.',
    portals: [
      {
        name: 'Espelho da Consciência',
        description: 'Onde a prática se encontra com a verdade interior',
        route: '/big5-simbolico',
      },
      {
        name: 'Radar do Eixo',
        description: 'Para medir a firmeza do chão que você sustenta',
        route: '/radiestesia',
      },
      {
        name: 'Mapa dos Territórios',
        description: 'Os cinco campos que organizam sua leitura do mundo',
        route: '/big5-funcional',
      },
    ],
  },
  perfil_terapeuta_integrativa: {
    icon: <Sparkles className="w-6 h-6" />,
    ambiance:
      'O Jardim é o lugar onde intuição e estrutura se encontram. O que você já sente pode ganhar forma aqui — sem perder a alma.',
    portals: [
      {
        name: 'Leitura em 5 Camadas',
        description: 'Para dar linguagem ao que você já percebe',
        route: '/radiestesia/leitura-5-camadas',
      },
      {
        name: 'Espelho da Consciência',
        description: 'Onde o sentir se traduz em clareza',
        route: '/big5-simbolico',
      },
      {
        name: 'Mapas Reflexivos',
        description: 'Para organizar a intuição sem sufocá-la',
        route: '/big5-funcional',
      },
    ],
  },
  perfil_buscadora: {
    icon: <Heart className="w-6 h-6" />,
    ambiance:
      'Você não precisa saber o que procura. O Jardim é um espaço seguro de chegada — sem pressa, sem comparação. Apenas escuta.',
    portals: [
      {
        name: 'Espelho da Consciência',
        description: 'Um primeiro encontro consigo mesma',
        route: '/big5-simbolico',
      },
      {
        name: 'Escuta Inicial',
        description: 'Uma porta suave para quem está começando',
        route: '/eneagrama-feminino',
      },
    ],
  },
};

const DEFAULT_PROFILE: JardimProfile = {
  icon: <Leaf className="w-6 h-6" />,
  ambiance:
    'O Jardim da Psique é o seu espaço privado. Aqui, cada experiência simbólica pode ser registrada, revisitada e integrada — no seu tempo.',
  portals: [
    {
      name: 'Espelho da Consciência',
      description: 'Um ponto de partida para sua jornada',
      route: '/big5-simbolico',
    },
  ],
};

interface JardimFirstExperienceProps {
  profileTag?: string | null;
  onNewEntry: () => void;
}

export function JardimFirstExperience({ profileTag, onNewEntry }: JardimFirstExperienceProps) {
  const navigate = useNavigate();
  const profile = (profileTag && JARDIM_BY_TAG[profileTag as ProfileTag]) || DEFAULT_PROFILE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Ambiance text */}
      <Card className="border-emerald-500/20 bg-emerald-500/5">
        <CardContent className="py-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto">
            {profile.icon}
          </div>
          <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
            {profile.ambiance}
          </p>
        </CardContent>
      </Card>

      {/* Suggested portals */}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground text-center">
          Por onde começar:
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {profile.portals.map((portal, i) => (
            <motion.div
              key={portal.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <Card
                className="cursor-pointer transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5 group h-full"
                onClick={() => navigate(portal.route)}
              >
                <CardContent className="py-5 space-y-2">
                  <h4 className="font-medium text-sm text-foreground group-hover:text-emerald-400 transition-colors">
                    {portal.name}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {portal.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explorar <ArrowRight className="w-3 h-3" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Or write directly */}
      <div className="text-center pt-2">
        <Button
          variant="outline"
          onClick={onNewEntry}
          className="gap-2 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
        >
          <Leaf className="w-4 h-4" />
          Ou comece registrando algo aqui
        </Button>
      </div>

      {/* Closing */}
      <p className="text-center text-xs text-muted-foreground/60 italic">
        O Jardim sempre se adapta ao momento — não ao rótulo.
      </p>
    </motion.div>
  );
}
