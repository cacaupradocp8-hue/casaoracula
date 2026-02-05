// ============================================
// JORNADA — Espelho de Jornada Simbólica
// ============================================
// Este espaço não mede valor. Ele escuta o campo.
// "O que está pedindo cuidado agora?"

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Moon,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { supabase } from '@/integrations/supabase/client';
import { VisitorHomePage } from '@/components/visitor/VisitorHomePage';
import { useJornadaData } from '@/hooks/useJornadaData';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// ════════════════════════════════════════════════════════════════════════════
// TIPOS
// ════════════════════════════════════════════════════════════════════════════

type JornadaLevel = 'visitante' | 'iniciada' | 'terapeuta' | 'guardia';

type GrauAtual = 'iniciacao' | 'profundizacao' | 'integracao';

interface PortalInfo {
  nome: string;
  subtitulo: string;
}

interface ProximoGesto {
  texto: string;
  rota: string;
}

// ════════════════════════════════════════════════════════════════════════════
// MAPEAMENTOS
// ════════════════════════════════════════════════════════════════════════════

const PORTAIS_INFO: Record<string, PortalInfo> = {
  visitante: { nome: 'Portal Zero', subtitulo: 'O Limiar' },
  aluna: { nome: 'Portal I', subtitulo: 'Mapa da Psique' },
  assinante: { nome: 'Portal II', subtitulo: 'Campo Simbólico' },
  oracula: { nome: 'Portal III', subtitulo: 'A Prática Viva' },
  admin: { nome: 'Portal da Guardiã', subtitulo: 'Transmissão' },
};

const GRAUS_LABEL: Record<GrauAtual, string> = {
  iniciacao: 'Iniciação',
  profundizacao: 'Profundização',
  integracao: 'Integração',
};

// Frases-oráculo contextuais por grau
const FRASES_POR_GRAU: Record<GrauAtual, string[]> = {
  iniciacao: [
    "A jornada começa quando você escolhe olhar para dentro.",
    "Cada ferramenta que você toca abre uma porta em si mesma.",
    "Permita-se não saber. O mistério é o convite."
  ],
  profundizacao: [
    "Você está aprendendo a habitar o que antes apenas visitava.",
    "A prática revela o que a teoria apenas nomeia.",
    "O campo se aprofunda quando você retorna com presença."
  ],
  integracao: [
    "O que foi fragmento agora busca reunião.",
    "Integrar é trazer para o corpo o que a mente compreendeu.",
    "Você não está terminando. Está completando um ciclo."
  ]
};

// Gestos possíveis por contexto
const GESTOS_POSSIVEIS = {
  sem_jardim: { texto: "Escrever no Jardim da Psiquê", rota: "/jardim-psique" },
  sem_travessia: { texto: "Iniciar uma travessia", rota: "/formacao" },
  sem_ferramenta: { texto: "Explorar uma ferramenta", rota: "/ferramentas" },
  continuar_curso: { texto: "Continuar sua formação", rota: "/formacao" },
  praticar: { texto: "Praticar com uma cliente", rota: "/clientes" },
  default: { texto: "Retornar ao centro", rota: "/dashboard" }
};

// ════════════════════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════════════════════

function getFraseOraculo(grau: GrauAtual): string {
  const frases = FRASES_POR_GRAU[grau];
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return frases[weekNumber % frases.length];
}

function getPortalInfo(portal: string): PortalInfo {
  return PORTAIS_INFO[portal] || PORTAIS_INFO.visitante;
}

// ════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ════════════════════════════════════════════════════════════════════════════

export default function Jornada() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState<JornadaLevel>('visitante');
  const [grau, setGrau] = useState<GrauAtual>('iniciacao');
  const [proximoGesto, setProximoGesto] = useState<ProximoGesto>(GESTOS_POSSIVEIS.default);
  
  // Hook para dados dinâmicos do banco
  const jornadaNivel = level !== 'visitante' ? level : null;
  const { fraseSelo } = useJornadaData(jornadaNivel, user?.id);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      setLoading(true);
      
      try {
        // Determinar nível baseado no portal
        let userLevel: JornadaLevel = 'visitante';
        
        if (user.portal === 'admin' || user.portal === 'oracula') {
          // Verificar se tem clientes
          const { data: clientes } = await supabase
            .from('clientes')
            .select('id')
            .eq('terapeuta_id', user.id)
            .eq('status', 'ativo')
            .limit(1);
          
          userLevel = clientes && clientes.length > 0 ? 'terapeuta' : 'iniciada';
        } else if (user.portal === 'assinante' || user.portal === 'aluna') {
          userLevel = 'iniciada';
        }
        
        setLevel(userLevel);

        // Load Jardim status
        const { data: jardimRecords } = await supabase
          .from('jardim_psique_registros')
          .select('id')
          .eq('user_id', user.id)
          .limit(10);

        // Usar view de progresso
        const { data: formationProgress } = await supabase
          .from('v_formation_progress')
          .select('completed_travessias, completed_rituals')
          .eq('user_id', user.id)
          .limit(1);
        
        const jardimCount = jardimRecords?.length || 0;
        const travessiasCount = Number(formationProgress?.[0]?.completed_travessias) || 0;
        const rituaisCount = Number(formationProgress?.[0]?.completed_rituals) || 0;
        const progressTotal = travessiasCount + rituaisCount;
        
        // Lógica de grau
        if (progressTotal >= 10 && jardimCount >= 5) {
          setGrau('integracao');
        } else if (progressTotal >= 3 || jardimCount >= 3) {
          setGrau('profundizacao');
        } else {
          setGrau('iniciacao');
        }

        // Determinar próximo gesto
        if (jardimCount === 0) {
          setProximoGesto(GESTOS_POSSIVEIS.sem_jardim);
        } else if (progressTotal === 0) {
          setProximoGesto(GESTOS_POSSIVEIS.sem_travessia);
        } else if (userLevel === 'terapeuta') {
          setProximoGesto(GESTOS_POSSIVEIS.praticar);
        } else {
          setProximoGesto(GESTOS_POSSIVEIS.continuar_curso);
        }

      } catch (error) {
        console.error('Erro ao carregar dados da jornada:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Visitante → página específica
  if (!user || user.portal === 'visitante') {
    return <VisitorHomePage />;
  }

  const portalInfo = getPortalInfo(user.portal || 'visitante');
  const fraseOraculo = fraseSelo || getFraseOraculo(grau);

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-[80vh] flex items-center justify-center bg-background">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <Moon className="w-10 h-10 text-primary/30 mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground/50 text-sm">Escutando o campo...</p>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
        
        {/* Símbolo Central */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center">
            <Moon className="w-10 h-10 text-primary/60" />
          </div>
        </motion.div>

        {/* Onde Você Está Agora */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-10 max-w-md"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground/50 mb-3">
            Onde você está agora
          </p>
          
          {/* Portal Ativo */}
          <h1 className="text-2xl md:text-3xl font-display text-foreground mb-1">
            {portalInfo.nome}
          </h1>
          <p className="text-muted-foreground italic mb-6">
            {portalInfo.subtitulo}
          </p>

          {/* Grau Atual */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
            <Sparkles className="w-3.5 h-3.5 text-primary/50" />
            <span className="text-sm text-foreground/70">
              {GRAUS_LABEL[grau]}
            </span>
          </div>
        </motion.div>

        {/* Frase-Oráculo Contextual */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center mb-12 max-w-sm px-6"
        >
          <p className="text-foreground/60 italic leading-relaxed text-lg">
            "{fraseOraculo}"
          </p>
        </motion.div>

        {/* Próximo Gesto Possível */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-center"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground/40 mb-4">
            Próximo gesto possível
          </p>
          
          <Button
            variant="outline"
            onClick={() => navigate(proximoGesto.rota)}
            className="border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-foreground/80 gap-2 px-6 py-5"
          >
            {proximoGesto.texto}
            <ArrowRight className="w-4 h-4 text-primary/60" />
          </Button>
        </motion.div>

        {/* Footer Minimalista */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16"
        >
          <p className="text-xs text-muted-foreground/30 text-center">
            Este espaço escuta o campo.
          </p>
        </motion.div>
      </div>
    </AppLayout>
  );
}
