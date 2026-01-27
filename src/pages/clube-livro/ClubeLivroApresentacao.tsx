// ============================================
// CLUBE DO LIVRO ORACULAR - Tela de Apresentação
// ============================================

import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useClubeLivro, useRitualAceite } from '@/hooks/useClubeLivro';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessFeature } from '@/types/portal';
import { useAccessExpiration } from '@/hooks/useAccessExpiration';
import { LockedForVisitor } from '@/components/shared/LockedForVisitor';
import { 
  BookOpen, ChevronRight, Home, Sparkles, Book, Lock, 
  Calendar, Archive, AlertTriangle, ChevronDown 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

// Regras éticas fixas
const REGRAS_ETICAS = [
  'Sua escrita é sempre privada — nunca compartilhada.',
  'Não há obrigação de ritmo ou participação.',
  'Não fazemos interpretações automáticas do seu processo.',
  'Este é um espaço de escuta, não de debate.',
  'O livro trabalha você — não o contrário.',
];

export default function ClubeLivroApresentacao() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isExpired } = useAccessExpiration();
  const { cicloAtual, ciclosProximos, ciclosAnteriores, loadingCiclos } = useClubeLivro();
  const { hasAccepted } = useRitualAceite(cicloAtual?.id);
  const [showAnteriores, setShowAnteriores] = useState(false);

  // Check access - must be aluna+ and not expired
  const hasAccess = user && canAccessFeature(user.portal, 'aluna') && !isExpired;

  if (!hasAccess) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
          <SectionHeader
            title="Círculo de Leitura Oracular"
            subtitle="Este espaço é exclusivo para alunas e assinantes."
            icon={<BookOpen className="w-5 h-5" />}
          />
          <LockedForVisitor />
        </div>
      </AppLayout>
    );
  }

  const handleEnterCycle = () => {
    if (!cicloAtual) return;
    
    // Check if ritual is required and not yet accepted
    if (cicloAtual.ritual_aceite_obrigatorio !== false && !hasAccepted) {
      navigate(`/clube-livro/${cicloAtual.id}/ritual`);
    } else {
      navigate(`/clube-livro/${cicloAtual.id}`);
    }
  };

  // Manifesto default
  const manifestoDefault = `Este não é um clube de leitura comum.

Aqui, o livro não é estudado — é atravessado.

Não buscamos resumos, não fazemos fichamentos, não produzimos análises acadêmicas. 
Lemos como quem desce ao labirinto: devagar, em silêncio, deixando que as palavras trabalhem.

Cada ciclo traz um livro escolhido por sua força simbólica, por sua capacidade de mover algo interior. 
As perguntas que você encontrará não têm resposta certa. Elas existem para abrir, não para fechar.

Sua escrita é privada. Suas respostas ficam guardadas no Jardim da Psique, disponíveis apenas para você.

Não há obrigação de participar de encontros. Não há ritmo imposto. 
Você lê no seu tempo, escreve quando sente, atravessa como pode.

O que importa não é quanto você leu, mas o que se moveu.`;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/biblioteca" className="hover:text-foreground transition-colors">
            Biblioteca
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Círculo de Leitura Oracular</span>
        </nav>

        <SectionHeader
          title="Círculo de Leitura Oracular"
          subtitle="Território de leitura viva e atravessamento simbólico."
          icon={<BookOpen className="w-5 h-5" />}
          className="mb-8"
        />

        {/* Manifesto */}
        <Card className="mb-8 bg-card/50 border-gold/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-gold" />
              <h3 className="text-sm uppercase tracking-widest text-gold font-medium">
                Manifesto
              </h3>
            </div>
            <div className="prose prose-invert prose-sm max-w-none">
              {(cicloAtual?.manifesto || manifestoDefault).split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ciclo Atual */}
        {loadingCiclos ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse text-muted-foreground">Carregando...</div>
          </div>
        ) : cicloAtual ? (
          <section className="mb-8">
            <h2 className="text-lg font-display text-foreground mb-4 flex items-center gap-2">
              <Book className="w-5 h-5 text-gold" />
              Ciclo Atual
            </h2>
            <Card className="border-gold/30 bg-gradient-to-br from-card to-gold/5">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {cicloAtual.capa_url ? (
                    <img
                      src={cicloAtual.capa_url}
                      alt={cicloAtual.titulo}
                      className="w-24 h-36 object-cover rounded-lg shadow-lg mx-auto md:mx-0"
                    />
                  ) : (
                    <div className="w-24 h-36 bg-muted rounded-lg flex items-center justify-center mx-auto md:mx-0">
                      <BookOpen className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 text-center md:text-left">
                    {cicloAtual.tema_simbolico && (
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {cicloAtual.tema_simbolico}
                      </Badge>
                    )}
                    <h3 className="text-xl font-display text-foreground mb-1">
                      {cicloAtual.titulo}
                    </h3>
                    {cicloAtual.autor_livro && (
                      <p className="text-sm text-gold mb-4">{cicloAtual.autor_livro}</p>
                    )}
                    <Button
                      onClick={handleEnterCycle}
                      className="bg-gold hover:bg-gold/90 text-primary-foreground"
                    >
                      Entrar no Círculo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        ) : (
          <Card className="bg-muted/30 border-dashed mb-8">
            <CardContent className="py-8 text-center">
              <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                Nenhum ciclo de leitura ativo no momento.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Um novo livro será anunciado em breve.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Próximos Ciclos */}
        {ciclosProximos.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-display text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              Próximos Ciclos
            </h2>
            <div className="space-y-3">
              {ciclosProximos.map((ciclo) => (
                <Card key={ciclo.id} className="bg-muted/20 border-dashed">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-muted-foreground">{ciclo.titulo}</p>
                      {ciclo.data_inicio && (
                        <p className="text-xs text-muted-foreground">
                          Início: {new Date(ciclo.data_inicio).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Ciclos Anteriores */}
        {ciclosAnteriores.length > 0 && (
          <section className="mb-8">
            <Collapsible open={showAnteriores} onOpenChange={setShowAnteriores}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between mb-4">
                  <span className="flex items-center gap-2">
                    <Archive className="w-4 h-4" />
                    Ciclos Anteriores ({ciclosAnteriores.length})
                  </span>
                  <ChevronDown className={cn('w-4 h-4 transition-transform', showAnteriores && 'rotate-180')} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-3">
                  {ciclosAnteriores.map((ciclo) => (
                    <Card 
                      key={ciclo.id} 
                      className="bg-card/30 hover:bg-card/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/clube-livro/${ciclo.id}`)}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        {ciclo.capa_url ? (
                          <img src={ciclo.capa_url} alt="" className="w-10 h-14 object-cover rounded" />
                        ) : (
                          <div className="w-10 h-14 bg-muted rounded flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{ciclo.titulo}</p>
                          {ciclo.autor_livro && (
                            <p className="text-xs text-muted-foreground">{ciclo.autor_livro}</p>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </section>
        )}

        {/* Regras Éticas */}
        <Card className="bg-muted/20 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Regras Éticas do Círculo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {REGRAS_ETICAS.map((regra, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  {regra}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
