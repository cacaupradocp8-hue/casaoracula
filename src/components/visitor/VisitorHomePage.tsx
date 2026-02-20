import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Lock, Scroll } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCopy } from '@/hooks/useCopy';
import { cn } from '@/lib/utils';

// Portas da Casa (todas bloqueadas para visitante)
const PORTAS_CASA = [
  { id: 'mentoria', nome: 'Sala da Mentoria', locked: true },
  { id: 'formacao', nome: 'Sala de Treinamento', locked: true },
  { id: 'ferramentas', nome: 'Ferramentas do Método', locked: true },
  { id: 'sessao', nome: 'Sala de Sessão', locked: true },
  { id: 'oracula', nome: 'Círculo da Orácula', locked: true },
];

/**
 * VisitorHomePage - Tela inicial para visitantes
 * 
 * Contém APENAS:
 * 1. Logo Casa Orácula
 * 2. Frase-manifesto curta
 * 3. Botão único: "Entrar pela Porta Gratuita"
 * 4. Mapa visual da Casa (portas bloqueadas, não clicáveis)
 * 5. Documento Fundador (leitura livre)
 * 
 * Nada mais é clicável.
 */
export function VisitorHomePage() {
  const navigate = useNavigate();
  const { getCopyByKey } = useCopy();

  const handleEnterFreeGate = () => {
    // Vai DIRETAMENTE para a Sala de Visita (Sala da Visitante no banco)
    navigate('/sala-da-visitante');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Ambient background — seamless */}
      <div className="fixed inset-0 bg-gradient-to-b from-gold/5 via-background to-background pointer-events-none" />
      <div className="fixed inset-0 pattern-geometric pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col items-center px-4 py-8 max-w-2xl mx-auto w-full">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Logo size="lg" variant="vertical" />
        </motion.div>

        {/* Frase-manifesto */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center text-muted-foreground font-display italic text-lg mb-10 max-w-md"
        >
          {getCopyByKey('manifesto_visitante', 'Uma Casa não é um lugar. É um método de escuta.')}
        </motion.p>

        {/* Botão principal - ÚNICO elemento de ação */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mb-12"
        >
          <Button
            variant="gold"
            size="lg"
            onClick={handleEnterFreeGate}
            className="gap-3 text-lg px-8 py-6 rounded-full shadow-lg shadow-gold/20"
          >
            Entrar pela Porta Gratuita
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Mapa visual da Casa - Portas bloqueadas (não clicáveis) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="w-full mb-12"
        >
          <h2 className="text-center text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
            Mapa da Casa
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PORTAS_CASA.map((porta) => (
              <Card
                key={porta.id}
                className={cn(
                  "bg-muted/20 border-border/30 pointer-events-none",
                  "opacity-50"
                )}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 text-muted-foreground/50" />
                  </div>
                  <span className="text-sm text-muted-foreground truncate">
                    {porta.nome}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground/60 mt-3">
            Portas acessíveis após atravessar a Sala de Visita
          </p>
        </motion.div>

        {/* Documento Fundador - Leitura livre */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="w-full"
        >
          <Card className="bg-card/50 border-gold/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <Scroll className="w-5 h-5 text-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-foreground mb-2">
                    Documento Fundador
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {getCopyByKey('documento_fundador_resumo', 
                      'A Casa ORÁCULA é um espaço de formação simbólica para mulheres que atuam no cuidado de outras mulheres. Aqui, você não consome conteúdo — você atravessa processos com estrutura, linguagem e cuidado simbólico.'
                    )}
                  </p>
                  <blockquote className="mt-4 pl-4 border-l-2 border-gold/30 italic text-muted-foreground text-sm">
                    {getCopyByKey('documento_fundador_citacao',
                      '"Não é terapia. Não é coaching. É um método de escuta que sustenta quem sustenta."'
                    )}
                  </blockquote>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
