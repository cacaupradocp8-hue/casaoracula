// ============================================
// JORNADA — Espelho de Jornada Simbólica
// ============================================
// Este espaço não mede valor. Ele escuta o campo.
// "O que está pedindo cuidado agora?"

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Flower2, 
  Heart, 
  Moon,
  Sparkles,
  Feather,
  Eye,
  BookOpen,
  Users,
  Shield,
  Compass,
  CircleDot,
  Leaf
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { VisitorHomePage } from '@/components/visitor/VisitorHomePage';
import { useJornadaData } from '@/hooks/useJornadaData';

// ════════════════════════════════════════════════════════════════════════════
// TIPOS
// ════════════════════════════════════════════════════════════════════════════

type JornadaLevel = 'visitante' | 'iniciada' | 'terapeuta' | 'guardia';

interface JardimStatus {
  ritmoRegular: boolean;
  ultimoAcesso: string | null;
}

interface VivenciaStatus {
  travessiasAbertas: string[];
  rituaisConcluidos: string[];
}

interface SessaoStatus {
  clientesAtivos: string[];
  ultimaSessaoFechada: boolean;
  mapaVivoAtualizado: boolean;
  jardimHeroinaUsado: boolean;
  campoFechado: boolean;
}

interface CuidadoTerapeuta {
  jardimPosSessao: boolean;
  lembreteSupevisao: string;
}

interface GuardiaStatus {
  gruposAtivos: string[];
  mentoriasAndamento: string[];
  usoEticoJardim: boolean;
  limitesPreservados: boolean;
  aulasConduzidas: string[];
  acompanhamentoStatus: 'ativo' | 'pausado';
}

// ════════════════════════════════════════════════════════════════════════════
// COMPONENTES - Cards Simbólicos
// ════════════════════════════════════════════════════════════════════════════

function SymbolicCard({ 
  title, 
  icon: Icon, 
  children,
  delay = 0 
}: { 
  title: string; 
  icon: React.ElementType; 
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="glass border-border/30 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-base font-medium text-foreground/80">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="w-4 h-4 text-primary/70" />
            </div>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3 text-sm">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatusItem({ 
  label, 
  value, 
  variant = 'text' 
}: { 
  label: string; 
  value: string | boolean | null; 
  variant?: 'text' | 'boolean';
}) {
  if (variant === 'boolean') {
    const isActive = value === true;
    return (
      <div className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-0">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn(
          "text-xs px-2 py-0.5 rounded-full",
          isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-muted/30 text-muted-foreground"
        )}>
          {isActive ? 'sim' : 'não'}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground/80">{value || '—'}</span>
    </div>
  );
}

function ListaSimbolica({ 
  items, 
  emptyText = "Nenhum registro" 
}: { 
  items: string[]; 
  emptyText?: string;
}) {
  if (!items || items.length === 0) {
    return <p className="text-muted-foreground/60 italic text-xs">{emptyText}</p>;
  }

  return (
    <ul className="space-y-1">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2 text-muted-foreground">
          <Leaf className="w-3 h-3 mt-1 text-primary/50 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ConviteCard({ texto, delay = 0.5 }: { texto: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-5 text-center">
          <Feather className="w-5 h-5 text-primary/60 mx-auto mb-3" />
          <p className="text-sm text-foreground/80 italic leading-relaxed">
            "{texto}"
          </p>
          <p className="text-xs text-muted-foreground mt-2">Convite da semana</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// NÍVEL 1 — INICIADA ORÁCULA
// ════════════════════════════════════════════════════════════════════════════

function JornadaIniciada({ 
  jardimStatus, 
  vivencias,
  fraseSelo,
  conviteDaSemana
}: { 
  jardimStatus: JardimStatus;
  vivencias: VivenciaStatus;
  fraseSelo: string;
  conviteDaSemana: string | null;
}) {
  return (
    <div className="space-y-5">
      {/* Onde Você Está */}
      <SymbolicCard title="Onde Você Está na Jornada" icon={Compass} delay={0.1}>
        <p className="text-foreground/80">Fase atual: <span className="text-primary">Em travessia</span></p>
        <p className="text-muted-foreground italic text-xs">"{fraseSelo}"</p>
      </SymbolicCard>

      {/* Ritmo do Jardim */}
      <SymbolicCard title="Ritmo do Jardim da Psiquê" icon={Flower2} delay={0.2}>
        <StatusItem 
          label="Ritmo" 
          value={jardimStatus.ritmoRegular ? 'Regular' : 'Irregular'} 
        />
        <StatusItem 
          label="Último acesso" 
          value={jardimStatus.ultimoAcesso || 'Ainda não acessado'} 
        />
      </SymbolicCard>

      {/* Vivências Ativas */}
      <SymbolicCard title="Vivências Ativas" icon={Moon} delay={0.3}>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Travessias abertas</p>
            <ListaSimbolica items={vivencias.travessiasAbertas} emptyText="Nenhuma travessia aberta" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Rituais concluídos</p>
            <ListaSimbolica items={vivencias.rituaisConcluidos} emptyText="Nenhum ritual concluído" />
          </div>
        </div>
      </SymbolicCard>

      {/* Convite */}
      {conviteDaSemana && <ConviteCard texto={conviteDaSemana} delay={0.4} />}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// NÍVEL 2 — TERAPEUTA ORÁCULA
// ════════════════════════════════════════════════════════════════════════════

function JornadaTerapeuta({ 
  sessaoStatus, 
  cuidado,
  conviteDaSemana
}: { 
  sessaoStatus: SessaoStatus;
  cuidado: CuidadoTerapeuta;
  conviteDaSemana: string | null;
}) {
  return (
    <div className="space-y-5">
      {/* Sala de Sessão Viva */}
      <SymbolicCard title="Sala de Sessão Viva" icon={Users} delay={0.1}>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Clientes em acompanhamento</p>
            <ListaSimbolica items={sessaoStatus.clientesAtivos} emptyText="Nenhum cliente ativo" />
          </div>
          <StatusItem 
            label="Última sessão fechada?" 
            value={sessaoStatus.ultimaSessaoFechada} 
            variant="boolean" 
          />
        </div>
      </SymbolicCard>

      {/* Fluxo Ético */}
      <SymbolicCard title="Fluxo Ético" icon={Eye} delay={0.2}>
        <StatusItem 
          label="Mapa Vivo atualizado?" 
          value={sessaoStatus.mapaVivoAtualizado} 
          variant="boolean" 
        />
        <StatusItem 
          label="Jardim da Heroína usado?" 
          value={sessaoStatus.jardimHeroinaUsado} 
          variant="boolean" 
        />
        <StatusItem 
          label="Campo fechado?" 
          value={sessaoStatus.campoFechado} 
          variant="boolean" 
        />
      </SymbolicCard>

      {/* Cuidado da Terapeuta */}
      <SymbolicCard title="Cuidado da Terapeuta" icon={Heart} delay={0.3}>
        <StatusItem 
          label="Jardim pós-sessão realizado?" 
          value={cuidado.jardimPosSessao} 
          variant="boolean" 
        />
        <p className="text-muted-foreground/70 text-xs italic pt-2">
          {cuidado.lembreteSupevisao || "Lembre-se: supervisão protege o campo."}
        </p>
      </SymbolicCard>

      {/* Convite */}
      {conviteDaSemana && <ConviteCard texto={conviteDaSemana} delay={0.4} />}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// NÍVEL 3 — GUARDIÃ / MENTORA
// ════════════════════════════════════════════════════════════════════════════

function JornadaGuardia({ status, conviteDaSemana }: { status: GuardiaStatus; conviteDaSemana: string | null }) {
  return (
    <div className="space-y-5">
      {/* Campos que Sustenta */}
      <SymbolicCard title="Campos que Você Sustenta" icon={Shield} delay={0.1}>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Grupos ativos</p>
            <ListaSimbolica items={status.gruposAtivos} emptyText="Nenhum grupo ativo" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Mentorias em andamento</p>
            <ListaSimbolica items={status.mentoriasAndamento} emptyText="Nenhuma mentoria ativa" />
          </div>
        </div>
      </SymbolicCard>

      {/* Qualidade de Campo */}
      <SymbolicCard title="Qualidade de Campo" icon={CircleDot} delay={0.2}>
        <StatusItem 
          label="Uso ético do Jardim?" 
          value={status.usoEticoJardim} 
          variant="boolean" 
        />
        <StatusItem 
          label="Limites preservados?" 
          value={status.limitesPreservados} 
          variant="boolean" 
        />
      </SymbolicCard>

      {/* Transmissão do Método */}
      <SymbolicCard title="Transmissão do Método" icon={BookOpen} delay={0.3}>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Aulas ou rituais conduzidos</p>
            <ListaSimbolica items={status.aulasConduzidas} emptyText="Nenhum registro" />
          </div>
          <StatusItem 
            label="Acompanhamento de iniciadas" 
            value={status.acompanhamentoStatus === 'ativo' ? 'Ativo' : 'Pausado'} 
          />
        </div>
      </SymbolicCard>

      {/* Convite */}
      {conviteDaSemana && <ConviteCard texto={conviteDaSemana} delay={0.4} />}
    </div>
  );
}

// FRASES-SELO fallback removido - agora vem do banco via useJornadaData

// ════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ════════════════════════════════════════════════════════════════════════════

export default function Jornada() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState<JornadaLevel>('visitante');
  
  // Hook para dados dinâmicos do banco
  const jornadaNivel = level !== 'visitante' ? level : null;
  const { conviteDaSemana, fraseSelo, isLoading: isLoadingJornada } = useJornadaData(jornadaNivel, user?.id);
  
  // States por nível
  const [jardimStatus, setJardimStatus] = useState<JardimStatus>({
    ritmoRegular: false,
    ultimoAcesso: null,
  });
  const [vivencias, setVivencias] = useState<VivenciaStatus>({
    travessiasAbertas: [],
    rituaisConcluidos: [],
  });
  const [sessaoStatus, setSessaoStatus] = useState<SessaoStatus>({
    clientesAtivos: [],
    ultimaSessaoFechada: true,
    mapaVivoAtualizado: false,
    jardimHeroinaUsado: false,
    campoFechado: true,
  });
  const [cuidado, setCuidado] = useState<CuidadoTerapeuta>({
    jardimPosSessao: false,
    lembreteSupevisao: "Supervisão protege o campo.",
  });
  const [guardiaStatus, setGuardiaStatus] = useState<GuardiaStatus>({
    gruposAtivos: [],
    mentoriasAndamento: [],
    usoEticoJardim: true,
    limitesPreservados: true,
    aulasConduzidas: [],
    acompanhamentoStatus: 'pausado',
  });

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      setLoading(true);
      
      try {
        // Determine level based on portal
        let userLevel: JornadaLevel = 'visitante';
        
        if (user.portal === 'admin' || user.portal === 'oracula') {
          // Check if has clients → terapeuta; if mentoring others → guardia
          const { data: clientes } = await supabase
            .from('clientes')
            .select('id, nome')
            .eq('terapeuta_id', user.id)
            .eq('status', 'ativo')
            .limit(5);
          
          if (clientes && clientes.length > 0) {
            userLevel = 'terapeuta';
            setSessaoStatus(prev => ({
              ...prev,
              clientesAtivos: clientes.map(c => c.nome),
            }));
          } else {
            userLevel = 'iniciada';
          }
          
          // Check for mentoring/teaching role
          const { data: mentoriasCount } = await supabase
            .from('matriculas')
            .select('id', { count: 'exact' })
            .eq('curso_id', 'mentoria')
            .eq('ativa', true);
          
          if (mentoriasCount && mentoriasCount.length > 0) {
            userLevel = 'guardia';
          }
        } else if (user.portal === 'assinante' || user.portal === 'aluna') {
          userLevel = 'iniciada';
        }
        
        setLevel(userLevel);

        // Load Jardim status
        const { data: jardimRecords } = await supabase
          .from('jardim_psique_registros')
          .select('created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (jardimRecords && jardimRecords.length > 0) {
          const lastDate = new Date(jardimRecords[0].created_at);
          const daysSince = Math.floor((Date.now() - lastDate.getTime()) / (24 * 60 * 60 * 1000));
          
          setJardimStatus({
            ritmoRegular: daysSince <= 7 && jardimRecords.length >= 2,
            ultimoAcesso: daysSince === 0 ? 'Hoje' : 
                         daysSince === 1 ? 'Ontem' : 
                         `${daysSince} dias atrás`,
          });
        }

        // Load active travessias
        const { data: travessias } = await supabase
          .from('conteudo_travessias')
          .select('titulo')
          .eq('publicado', true)
          .limit(3);
        
        if (travessias) {
          setVivencias(prev => ({
            ...prev,
            travessiasAbertas: travessias.map(t => t.titulo),
          }));
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

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <Sparkles className="w-8 h-8 text-primary/50 mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground text-sm">Escutando o campo...</p>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-lg">
        {/* Header Simbólico */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Compass className="w-6 h-6 text-primary/70" />
          </div>
          <h1 className="text-2xl font-display text-foreground mb-2">
            Espelho da Jornada
          </h1>
          <p className="text-muted-foreground text-sm italic">
            O que está pedindo cuidado agora?
          </p>
        </motion.div>

        {/* Conteúdo por nível */}
        {level === 'iniciada' && (
          <JornadaIniciada 
            jardimStatus={jardimStatus}
            vivencias={vivencias}
            fraseSelo={fraseSelo || "Cada passo é uma escolha de presença."}
            conviteDaSemana={conviteDaSemana}
          />
        )}

        {level === 'terapeuta' && (
          <JornadaTerapeuta 
            sessaoStatus={sessaoStatus}
            cuidado={cuidado}
            conviteDaSemana={conviteDaSemana}
          />
        )}

        {level === 'guardia' && (
          <JornadaGuardia status={guardiaStatus} conviteDaSemana={conviteDaSemana} />
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-10 pt-6 border-t border-border/20"
        >
          <p className="text-xs text-muted-foreground/50 italic">
            Este espaço não mede valor.<br/>
            Ele escuta o campo.
          </p>
        </motion.div>
      </div>
    </AppLayout>
  );
}
