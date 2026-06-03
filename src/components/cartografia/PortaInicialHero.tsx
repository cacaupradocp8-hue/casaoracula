import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, DoorOpen, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTodasRotas } from '@/hooks/useTodasRotas';

interface PortaInicialHeroProps {
  portaNome?: string;
  portaSlug?: string; // This is the recommended route slug (e.g., 'rota-do-aterramento')
}

export const PortaInicialHero: React.FC<PortaInicialHeroProps> = ({ portaNome, portaSlug }) => {
  const navigate = useNavigate();
  const { data: estacoes, isLoading } = useTodasRotas();

  if (!portaNome) return null;

  const handleNavigate = () => {
    if (!portaSlug) {
      navigate('/clube');
      return;
    }

    // Normalização básica do slug para evitar caminhos quebrados
    const cleanSlug = portaSlug.replace(/^\/+/, '').split('?')[0];

    // Se o slug já contiver 'rota/', removemos para reconstruir
    const normalizedSlug = cleanSlug.startsWith('clube/rota/') 
      ? cleanSlug.replace('clube/rota/', '')
      : cleanSlug.startsWith('rota/') 
        ? cleanSlug.replace('rota/', '')
        : cleanSlug;

    // Check if the recommended route actually exists in our stations list
    const exists = estacoes?.some(e => e.primeiro_slug === normalizedSlug && e.status !== 'locked');
    
    if (exists) {
      navigate(`/clube/rota/${normalizedSlug}`);
    } else {
      console.warn(`[PortaInicial] Rota ${normalizedSlug} não disponível ou bloqueada. Redirecionando para /clube.`);
      navigate('/clube');
    }
  };

  const getSymbolicName = (nameOrSlug?: string) => {
    if (!nameOrSlug) return "";
    const clean = nameOrSlug.toLowerCase();
    
    // Mapeamento de slugs/termos genéricos para nomes simbólicos completos
    if (clean.includes('chegada') || clean.includes('portao')) return "Portão da Chegada";
    if (clean.includes('torres')) return "Torres";
    if (clean.includes('conselho')) return "Conselho Interior";
    if (clean.includes('vinculos') || clean.includes('espelho')) return "Espelho dos Vínculos";
    if (clean.includes('arquetipos') || clean.includes('bosque') || clean.includes('jardim')) return "Bosque dos Arquétipos";
    if (clean.includes('forja')) return "Forja";
    if (clean.includes('integracao') || clean.includes('praca_integracao')) return "Praça da Integração";
    if (clean.includes('abalo') || clean.includes('praca_abalo')) return "Praça do Abalo";
    if (clean.includes('labirinto')) return "Labirinto";
    if (clean.includes('sonhos') || clean.includes('casa_sonhos')) return "Casa dos Sonhos";
    if (clean.includes('renascimento') || clean.includes('portal')) return "Portal de Renascimento";
    
    // Se for 'portas' ou 'porta_do_possivel' ou algo genérico, tenta derivar do slug ou mantém o nome passado se for válido
    if (clean === 'portas' || clean === 'porta_do_possivel') return "Portão da Chegada"; // Fallback seguro
    
    return portaNome;
  };

  const symbolicName = getSymbolicName(portaNome || portaSlug);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-2xl mx-auto p-8 rounded-3xl border border-gold/20 bg-gold/5 text-center space-y-6"
    >

      <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <DoorOpen className="w-8 h-8 text-gold" />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm uppercase tracking-[0.2em] text-gold/60">Porta Inicial</h3>
        <h2 className="text-3xl font-display text-gold">{symbolicName}</h2>
        <p className="text-muted-foreground/80 max-w-md mx-auto pt-2">
          Sua CidadELA convida para começar por aqui. O primeiro portal para sua jornada atual.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 pt-4">
        <Button 
          variant="gold" 
          size="lg" 
          onClick={handleNavigate}
          disabled={isLoading}
          className="group px-12 h-14 text-base shadow-premium-glow"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Atravessar
          {!isLoading && <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />}
        </Button>
        <button 
          onClick={() => navigate('/clube/rotas')}
          className="text-xs text-muted-foreground/50 hover:text-gold/60 underline underline-offset-4 transition-colors"
        >
          Explorar as Rotas da Casa
        </button>
      </div>
    </motion.div>
  );
};
