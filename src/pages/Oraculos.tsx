import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOracles } from '@/hooks/useOracles';
import { OracleDeck } from '@/types/oracle';

export default function Oraculos() {
  const navigate = useNavigate();
  const { oracles, isLoading, hasAccess } = useOracles();

  const publishedOracles = oracles.filter(o => o.status === 'published' || hasAccess(o));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      {/* Hero Section */}
      <section className="relative py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Centro de Oráculos</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Consulte os Oráculos
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ferramentas simbólicas de autoconhecimento e orientação interior. 
            Cada oráculo é uma porta para a sabedoria que habita em você.
          </p>
        </div>
      </section>

      {/* Oracles Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        {publishedOracles.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhum oráculo disponível</h3>
            <p className="text-muted-foreground">
              Os oráculos estão sendo preparados com carinho. Volte em breve.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedOracles.map((oracle) => (
              <OracleCard 
                key={oracle.id} 
                oracle={oracle} 
                hasAccess={hasAccess(oracle)} 
                onNavigate={() => navigate(`/oraculos/${oracle.slug}`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

interface OracleCardProps {
  oracle: OracleDeck;
  hasAccess: boolean;
  onNavigate: () => void;
}

function OracleCard({ oracle, hasAccess, onNavigate }: OracleCardProps) {
  const navigate = useNavigate();
  const theme = oracle.theme_json;

  return (
    <div 
      className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-500"
      style={{ 
        background: hasAccess 
          ? `linear-gradient(135deg, ${theme.backgroundColor}22 0%, transparent 50%)`
          : undefined 
      }}
    >
      {/* Cover Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {oracle.cover_image_url ? (
          <img 
            src={oracle.cover_image_url} 
            alt={oracle.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: theme.backgroundColor || '#1a1625' }}
          >
            <Sparkles className="w-16 h-16 text-primary/30" />
          </div>
        )}
        
        {/* Locked Overlay */}
        {!hasAccess && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center p-4">
              <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium text-muted-foreground">
                {oracle.lock_message_title}
              </p>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {!hasAccess ? (
            <Badge variant="secondary" className="bg-background/80 backdrop-blur">
              <Lock className="w-3 h-3 mr-1" />
              Bloqueado
            </Badge>
          ) : oracle.status === 'draft' ? (
            <Badge variant="outline">Rascunho</Badge>
          ) : null}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-serif font-semibold text-foreground mb-1">
          {oracle.name}
        </h3>
        
        {oracle.subtitle && (
          <p className="text-sm text-muted-foreground mb-3">
            {oracle.subtitle}
          </p>
        )}

        {oracle.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {oracle.description}
          </p>
        )}

        {hasAccess ? (
          <Button 
            onClick={onNavigate}
            className="w-full group/btn"
            style={{ backgroundColor: theme.primaryColor }}
          >
            Entrar
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        ) : (
          <Button 
            variant="outline"
            onClick={() => navigate(oracle.upgrade_cta_route)}
            className="w-full"
          >
            {oracle.upgrade_cta_text}
          </Button>
        )}
      </div>
    </div>
  );
}
