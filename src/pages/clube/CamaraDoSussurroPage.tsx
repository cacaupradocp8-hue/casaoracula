import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Play, Clock, Trophy, Flame, 
  Sparkles, Compass, MessageCircle, BookOpen, FlaskConical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useCamaraCases } from '@/components/treinamento/simulador/useCamaraCases';
import { SimuladorClube } from '@/components/treinamento/simulador/SimuladorClube';
import { TrainingCase } from '@/components/treinamento/simulador/types';
import { cn } from '@/lib/utils';
import { ConversaoCTA } from '@/components/treinamento/simulador/ConversaoCTA';
import { useNavigate } from 'react-router-dom';
import { Essencia8020Modal } from '@/components/clube/Essencia8020Modal';
import { useAllBooks } from '@/hooks/useBooks';

export default function CamaraDoSussurroPage() {
  const [activeCase, setActiveCase] = useState<TrainingCase | null>(null);
  const { data: allCases = [] } = useCamaraCases();
  const { data: books = [] } = useAllBooks();

  const handleBack = () => {
    if (activeCase) {
      setActiveCase(null);
    } else {
      window.history.back();
    }
  };

  if (activeCase) {
    return (
      <div className="min-h-screen bg-background">
        <SimuladorClube 
          caso={activeCase} 
          onExit={handleBack}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pattern-geometric">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.history.back()}
              className="p-0 h-auto text-primary hover:text-primary-foreground hover:bg-primary/10 transition-colors -ml-1 mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Voltar ao Clube
            </Button>
            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl font-display tracking-wide text-foreground">
                Câmara do <span className="text-primary italic">Sussurro</span>
              </h1>
              <p className="text-muted-foreground text-sm tracking-widest uppercase font-medium">
                Pratique a escuta imersiva com as obras do Clube do Livro.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 bg-card border border-border rounded-2xl px-6 py-4 shadow-soft">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-primary">
                <Trophy className="w-4 h-4" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase font-body">CLUBE</span>
              </div>
              <Progress value={20} className="w-24 h-1.5 bg-muted" />
            </div>
          </div>
        </header>

        <section className="space-y-8 animate-fade-in">
          <div className="grid gap-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-primary/40 mb-2">Obras em Estudo</h2>
            
            {allCases.length === 0 ? (
              <div className="h-64 rounded-[2.5rem] bg-card/40 border border-dashed border-border flex items-center justify-center">
                <p className="text-sm text-muted-foreground italic font-body">Aguardando novos sussurros das obras...</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {allCases.filter(c => c.nivel_produto === 'clube').map((caso) => {
                  // Tentar encontrar o livro correspondente pelo título
                  const correspondingBook = books.find(b => b.title.toLowerCase().includes(caso.title.toLowerCase()) || caso.title.toLowerCase().includes(b.title.toLowerCase()));
                  
                  return (
                    <div 
                      key={caso.id}
                      className="group relative overflow-hidden rounded-[2.5rem] border border-border bg-card/60 backdrop-blur-sm transition-all duration-700 hover:border-primary/40 hover:shadow-glow p-8 flex flex-col md:flex-row items-center justify-between gap-6"
                    >
                      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[80px] -z-10 group-hover:bg-primary/10 transition-colors" />
                      
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-bold tracking-widest uppercase">OBRA DO CLUBE</Badge>
                          <span className="text-muted-foreground text-xs flex items-center gap-1.5 font-body">
                            <Clock className="w-3.5 h-3.5" /> 5-10 min
                          </span>
                        </div>
                        <h3 className="text-3xl font-display text-foreground group-hover:text-primary transition-colors duration-500">
                          {caso.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 font-body leading-relaxed max-w-2xl">
                          {caso.tema || 'Prática de escuta ativa baseada nos conceitos da obra atual.'}
                        </p>
                        
                        {correspondingBook && (
                          <div className="pt-2">
                            <Essencia8020Modal 
                              bookId={correspondingBook.id} 
                              bookTitle={correspondingBook.title} 
                            />
                          </div>
                        )}
                      </div>
                      <Button 
                        onClick={() => setActiveCase(caso)}
                        className="rounded-full px-10 py-7 bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-3 shadow-gold transition-all hover:scale-105 active:scale-95"
                      >
                        <Play className="w-4 h-4 fill-current" /> Iniciar Escuta
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card/50 border border-border rounded-2xl p-8 space-y-4 hover:border-primary/20 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h4 className="font-display text-lg text-foreground">Reflexões do Círculo</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-body">Discussões recentes sobre os sussurros das obras.</p>
              </div>
            </div>
            <div className="bg-card/50 border border-border rounded-2xl p-8 space-y-4 hover:border-primary/20 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h4 className="font-display text-lg text-foreground">Biblioteca de Apoio</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-body">Materiais complementares para aprofundar a escuta.</p>
              </div>
            </div>
            <div className="bg-card/50 border border-border rounded-2xl p-8 space-y-4 hover:border-primary/20 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h4 className="font-display text-lg text-foreground">Maestria da Escuta</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-body">Seu progresso no desenvolvimento da escuta clínica.</p>
              </div>
            </div>
          </div>

          <div className="pt-10">
            <ConversaoCTA type="concluido" />
          </div>
        </section>
      </div>
    </div>
  );
}
