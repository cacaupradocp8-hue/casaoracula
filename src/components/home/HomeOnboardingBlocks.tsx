import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, Compass, BookOpen, GraduationCap, 
  ArrowRight, ShieldCheck, FileText, Layout, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { PortalType } from '@/types/portal';

export function HomeOnboardingBlocks() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const portal = user?.portal as PortalType;

  const isAdmin = portal === 'admin';
  const isVisitor = portal === 'visitante';
  const isSubscriber = portal === 'assinante' || portal === 'oracula';
  const isStudent = portal === 'aluna' || portal === 'oracula';

  return (
    <div className="space-y-8">
      {/* Bloco Comece por Aqui */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-display text-foreground">Comece por Aqui</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isVisitor && (
            <OnboardingCard
              title="Descubra sua Voz"
              description="Inicie sua jornada revelando seu mapa interior através do Quiz do Eixo."
              icon={<Compass className="w-6 h-6 text-primary" />}
              action={() => navigate('/quiz/descubra-seu-eixo')}
              label="Iniciar Quiz"
            />
          )}

          {isSubscriber && (
            <OnboardingCard
              title="Círculo de Leitura"
              description="Acesse o acervo premium e as estações do Clube Oracular."
              icon={<BookOpen className="w-6 h-6 text-gold" />}
              action={() => navigate('/clube')}
              label="Entrar no Clube"
            />
          )}

          {isStudent && (
            <OnboardingCard
              title="Academia de Formação"
              description="Seus cursos, aulas e materiais de estudo da Formação Orácula."
              icon={<GraduationCap className="w-6 h-6 text-primary" />}
              action={() => navigate('/sala-de-treinamento')}
              label="Ver Meus Cursos"
            />
          )}

          {isAdmin && (
            <OnboardingCard
              title="Painel da Guardiã"
              description="Gerencie a Casa, monitore vendas e acesse documentos oficiais."
              icon={<ShieldCheck className="w-6 h-6 text-primary" />}
              action={() => navigate('/admin')}
              label="Acessar Admin"
              highlight
            />
          )}
        </div>
      </motion.section>

      {/* Card Minha Jornada (Para quem já tem Cartografia) */}
      {(isSubscriber || isStudent) && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Layout className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-display text-foreground">Minha Jornada</h2>
          </div>
          
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Compass className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg font-medium text-foreground mb-1">Mapa da Jornada</h3>
                  <p className="text-sm text-muted-foreground">
                    Acompanhe seu progresso, próximas travessias e o desenvolvimento da sua voz oracular.
                  </p>
                </div>
                <Button onClick={() => navigate('/minha-jornada')} className="shrink-0">
                  Ver Mapa <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      )}

      {/* Bloco Administrativo Rápido (Somente Admin) */}
      {isAdmin && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-display text-foreground">Acesso Rápido Guardiã</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <OnboardingCard
              title="Guardiã Rockty"
              description="Monitoramento em tempo real de webhooks e vendas."
              icon={<Zap className="w-5 h-5 text-amber-500" />}
              action={() => navigate('/admin?tab=rockty-monitor')}
              label="Monitorar"
              variant="outline"
            />
            <OnboardingCard
              title="Documentos Oficiais"
              description="Manuais, protocolos e guias operacionais."
              icon={<FileText className="w-5 h-5 text-primary" />}
              action={() => navigate('/admin?tab=documentos')}
              label="Ver Documentos"
              variant="outline"
            />
          </div>
        </motion.section>
      )}
    </div>
  );
}

function OnboardingCard({ 
  title, 
  description, 
  icon, 
  action, 
  label, 
  highlight = false,
  variant = "default"
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  action: () => void; 
  label: string;
  highlight?: boolean;
  variant?: "default" | "outline";
}) {
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md border-primary/10 ${highlight ? 'ring-1 ring-primary/30 bg-primary/5' : ''}`}>
      <CardContent className="p-5 flex flex-col h-full">
        <div className="mb-4">{icon}</div>
        <h3 className="font-medium text-foreground mb-2">{title}</h3>
        <p className="text-xs text-muted-foreground mb-6 flex-1">{description}</p>
        <Button 
          variant={variant === "outline" ? "outline" : "gold"} 
          size="sm" 
          onClick={action}
          className="w-full group"
        >
          {label} <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
