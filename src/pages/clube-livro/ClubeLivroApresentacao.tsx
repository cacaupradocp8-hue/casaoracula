// ============================================
// CLUBE DO LIVRO ORACULAR - Tela de Apresentação
// ============================================

import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useClubeLivro, useRitualAceite } from '@/hooks/useClubeLivro';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessFeature } from '@/types/portal';
import { useAccessExpiration } from '@/hooks/useAccessExpiration';
import { LockedForVisitor } from '@/components/shared/LockedForVisitor';
import { CalendarioJornadas } from '@/components/clube-livro/CalendarioJornadas';
import { BookOpen, ChevronRight, Home, Sparkles, AlertTriangle } from 'lucide-react';

// Regras éticas fixas
const REGRAS_ETICAS = [
  'Sua escrita é sempre privada — nunca compartilhada.',
  'Não há obrigação de ritmo ou participação.',
  'Não fazemos interpretações automáticas do seu processo.',
  'Este é um espaço de escuta, não de debate.',
  'O livro trabalha você — não o contrário.',
];

// Manifesto default
const MANIFESTO_DEFAULT = `Este não é um clube de leitura comum.

Aqui, o livro não é estudado — é atravessado.

Não buscamos resumos, não fazemos fichamentos, não produzimos análises acadêmicas. 
Lemos como quem desce ao labirinto: devagar, em silêncio, deixando que as palavras trabalhem.

Cada ciclo traz um livro escolhido por sua força simbólica, por sua capacidade de mover algo interior. 
As perguntas que você encontrará não têm resposta certa. Elas existem para abrir, não para fechar.

Sua escrita é privada. Suas respostas ficam guardadas no Jardim da Psique, disponíveis apenas para você.

Não há obrigação de participar de encontros. Não há ritmo imposto. 
Você lê no seu tempo, escreve quando sente, atravessa como pode.

O que importa não é quanto você leu, mas o que se moveu.`;

export default function ClubeLivroApresentacao() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isExpired } = useAccessExpiration();
  const { ciclos, cicloAtual, loadingCiclos } = useClubeLivro();
  const { hasAccepted } = useRitualAceite(cicloAtual?.id);

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
    if (cicloAtual.ritual_aceite_obrigatorio !== false && !hasAccepted) {
      navigate(`/clube-livro/${cicloAtual.id}/ritual`);
    } else {
      navigate(`/clube-livro/${cicloAtual.id}`);
    }
  };

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
              {(cicloAtual?.manifesto || MANIFESTO_DEFAULT).split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ciclo atual — CTA de entrada rápida */}
        {!loadingCiclos && cicloAtual && (
          <Card className="mb-10 border-gold/40 bg-gradient-to-br from-gold/5 to-card">
            <CardContent className="p-5 flex flex-col sm:flex-row items-center gap-4">
              {cicloAtual.capa_url ? (
                <img
                  src={cicloAtual.capa_url}
                  alt={cicloAtual.titulo}
                  className="w-16 h-24 object-cover rounded shadow-md shrink-0"
                />
              ) : (
                <div className="w-16 h-24 bg-muted rounded flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 text-center sm:text-left">
                <p className="text-xs uppercase tracking-widest text-gold font-medium mb-1">
                  Ciclo em curso
                </p>
                <h3 className="font-display text-lg text-foreground leading-snug">
                  {cicloAtual.titulo}
                </h3>
                {cicloAtual.autor_livro && (
                  <p className="text-sm text-muted-foreground">{cicloAtual.autor_livro}</p>
                )}
              </div>
              <Button
                onClick={handleEnterCycle}
                className="bg-gold hover:bg-gold/90 text-primary-foreground shrink-0"
              >
                Entrar no Círculo
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Mapa de Travessia Formativa Anual */}
        {loadingCiclos ? (
          <div className="flex justify-center py-16">
            <div className="animate-pulse text-muted-foreground text-sm">
              Carregando mapa de jornadas…
            </div>
          </div>
        ) : (
          <CalendarioJornadas
            ciclos={ciclos || []}
            cicloAtualId={cicloAtual?.id}
          />
        )}

        {/* Regras Éticas */}
        <Card className="mt-10 bg-muted/20 border-border/50">
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
