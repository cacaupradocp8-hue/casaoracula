// ============================================
// CLUBE DO LIVRO ORACULAR - Tela de Apresentação
// ============================================

import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useClubeLivro } from '@/hooks/useClubeLivro';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessFeature } from '@/types/portal';
import { useAccessExpiration } from '@/hooks/useAccessExpiration';
import { LockedForVisitor } from '@/components/shared/LockedForVisitor';
import { BookOpen, ChevronRight, Home, Sparkles, Book } from 'lucide-react';

export default function ClubeLivroApresentacao() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isExpired } = useAccessExpiration();
  const { cicloAtual, loadingCiclos } = useClubeLivro();

  // Check access - must be aluna+ and not expired
  const hasAccess = user && canAccessFeature(user.portal, 'aluna') && !isExpired;

  if (!hasAccess) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
          <SectionHeader
            title="Clube do Livro Oracular"
            subtitle="Este espaço é exclusivo para alunas e assinantes."
            icon={<BookOpen className="w-5 h-5" />}
          />
          <LockedForVisitor />
        </div>
      </AppLayout>
    );
  }

  const handleEnter = () => {
    if (cicloAtual) {
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
          <span className="text-foreground">Clube do Livro Oracular</span>
        </nav>

        <SectionHeader
          title="Clube do Livro Oracular"
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

        {/* CTA */}
        {loadingCiclos ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse text-muted-foreground">Carregando...</div>
          </div>
        ) : cicloAtual ? (
          <div className="flex flex-col items-center gap-4">
            <Button
              size="lg"
              onClick={handleEnter}
              className="bg-gold hover:bg-gold/90 text-primary-foreground font-display text-lg px-8 py-6"
            >
              <Book className="w-5 h-5 mr-2" />
              Entrar no Círculo de Leitura
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Livro atual: <span className="text-foreground">{cicloAtual.titulo}</span>
              {cicloAtual.autor_livro && (
                <span className="text-muted-foreground"> — {cicloAtual.autor_livro}</span>
              )}
            </p>
          </div>
        ) : (
          <Card className="bg-muted/30 border-dashed">
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
      </div>
    </AppLayout>
  );
}
