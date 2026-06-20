import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, Send, Bot, User, Loader2, BookOpen,
  Sparkles, Heart, Users, Compass, Feather, Shuffle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSyntheiaChat } from '@/hooks/useSyntheiaChat';
import { cn } from '@/lib/utils';

type Categoria = {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  perguntas: string[];
};

// Perguntas específicas para "Mulheres que Correm com os Lobos" (Clarissa Pinkola Estés)
const CATEGORIAS_LOBOS: Categoria[] = [
  {
    key: 'mulher-selvagem',
    label: 'A Mulher Selvagem',
    icon: Feather,
    perguntas: [
      'O que a Mulher Selvagem, em mim, está pedindo para ser escutado neste momento?',
      'Em que partes da minha vida eu domestiquei o instinto que Clarissa nomeia como sagrado?',
      'Como reconheço o cheiro da Loba interior quando ela se aproxima?',
    ],
  },
  {
    key: 'contos',
    label: 'Contos & Símbolos',
    icon: BookOpen,
    perguntas: [
      'Que conto desta obra ressoou como um espelho da minha travessia atual?',
      'Em "Barba Azul", que chave eu insisto em não usar — e o que ela protege?',
      'O que "A Loba" (La Loba) me ensina sobre juntar meus próprios ossos?',
      'Que rio seco em mim está pedindo as águas de "Sealskin, Soulskin"?',
    ],
  },
  {
    key: 'instinto',
    label: 'Instinto Ferido',
    icon: Heart,
    perguntas: [
      'Onde meu instinto foi capturado, e que armadilha o prendeu?',
      'Que sinais o meu corpo emite quando eu desobedeço a Loba?',
      'O que precisa morrer em mim para que o ciclo Vida/Morte/Vida se restaure?',
    ],
  },
  {
    key: 'sombra',
    label: 'Sombra & Predador',
    icon: Compass,
    perguntas: [
      'Quem é o Predador Natural dentro da minha psique hoje?',
      'Que voz interna me convence a entregar a chave do meu mistério?',
      'Como diferenciar o Predador da própria Mulher Selvagem em mim?',
    ],
  },
  {
    key: 'clinica',
    label: 'Aplicação Clínica',
    icon: Sparkles,
    perguntas: [
      'Como trazer a imagem da Loba para uma sessão sem cair em interpretação literal?',
      'Que pergunta-mãe deste livro eu poderia oferecer a uma cliente em luto criativo?',
      'Quais riscos éticos preciso cuidar ao usar os contos de Clarissa com mulheres em crise?',
      'Como escutar, na fala da cliente, os ossos esquecidos pedindo canto?',
    ],
  },
  {
    key: 'circulos',
    label: 'Círculos & Mentoria',
    icon: Users,
    perguntas: [
      'Que ritual de abertura "La Loba" inspira para um círculo de mulheres?',
      'Como conduzir uma roda a partir do ciclo Vida/Morte/Vida sem dramatização?',
      'Que prática simbólica posso oferecer para mulheres reaprendendo a uivar?',
    ],
  },
];

const CATEGORIAS_PADRAO: Categoria[] = [
  {
    key: 'personagens',
    label: 'Personagens & Símbolos',
    icon: Feather,
    perguntas: [
      'Qual personagem desta obra espelha algo que ainda não nomeei em mim?',
      'Que símbolo deste livro pede para ser escutado com mais atenção?',
      'Que sombra atravessa a protagonista e como ela me convoca?',
    ],
  },
  {
    key: 'autor',
    label: 'Mensagem do Autor',
    icon: BookOpen,
    perguntas: [
      'Que mensagem subjacente o autor parece sussurrar nas entrelinhas?',
      'O que esta obra tenta proteger e o que tenta revelar?',
      'Qual é a pergunta secreta que move este livro?',
    ],
  },
  {
    key: 'pessoal',
    label: 'Impacto Pessoal',
    icon: Heart,
    perguntas: [
      'Que trecho desta leitura ficou pulsando em mim depois que fechei o livro?',
      'O que esta obra desfez em mim e o que começou a costurar?',
      'Onde, na minha vida, este livro abriu uma fresta de luz?',
    ],
  },
  {
    key: 'conexoes',
    label: 'Conexões & Continuações',
    icon: Compass,
    perguntas: [
      'Com que outra obra ou mito esta leitura dialoga em mim?',
      'Se eu pudesse escrever um desfecho alternativo, que travessia ele abriria?',
      'Que ponte esta obra constrói entre a vida cotidiana e o simbólico?',
    ],
  },
  {
    key: 'pratica',
    label: 'Aplicação Clínica',
    icon: Sparkles,
    perguntas: [
      'Como posso usar este eixo simbólico em sessão individual sem cair na interpretação literal?',
      'Que pergunta-mãe desta obra eu poderia oferecer a uma cliente em travessia?',
      'Quais riscos clínicos preciso evitar ao trazer este livro para a escuta?',
    ],
  },
  {
    key: 'circulos',
    label: 'Círculos & Mentoria',
    icon: Users,
    perguntas: [
      'Como conduzir um círculo feminino a partir do campo simbólico deste livro?',
      'Que ritual de abertura esta obra inspira para um grupo terapêutico?',
      'Como usar esta leitura em uma mentoria sem transformá-la em conteúdo?',
    ],
  },
];

function escolherCategorias(obra?: string, rota?: string): Categoria[] {
  const alvo = `${obra || ''} ${rota || ''}`.toLowerCase();
  if (alvo.includes('lobo') || alvo.includes('mulheres que correm')) {
    return CATEGORIAS_LOBOS;
  }
  return CATEGORIAS_PADRAO;
}

export default function ChatLivroPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const rota = params.get('rota') || undefined;
  const estacao = params.get('estacao') || undefined;
  const obra = params.get('obra') || undefined;
  const capa = params.get('capa') || undefined;

  const categorias = useMemo(() => escolherCategorias(obra, rota), [obra, rota]);

  const [input, setInput] = useState('');
  const [catAtiva, setCatAtiva] = useState<string>(categorias[0].key);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, isLoading, error, sendMessage, addWelcomeMessage } = useSyntheiaChat({
    mode: 'converse_com_livro',
    context: { rota, estacao, obra, arquetipo: obra },
  });

  useEffect(() => {
    if (messages.length === 0) {
      const intro = obra
        ? `Estamos diante de **${obra}**. O que pulsa em você nessa leitura? Posso percorrer com você um símbolo, um trecho, uma dúvida ou um eco da sua prática.`
        : 'Estamos diante do livro. O que pulsa em você nessa leitura? Posso percorrer com você um símbolo, um trecho, uma dúvida ou um eco da sua prática.';
      addWelcomeMessage(intro);
    }
    inputRef.current?.focus();
  }, [addWelcomeMessage, messages.length, obra]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const msg = input.trim();
    setInput('');
    await sendMessage(msg);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const categoriaAtiva = useMemo(
    () => categorias.find((c) => c.key === catAtiva) ?? categorias[0],
    [catAtiva],
  );

  const usarPergunta = (p: string) => {
    setInput(p);
    inputRef.current?.focus();
  };

  const surpreendaMe = () => {
    const todas = categorias.flatMap((c) => c.perguntas);
    const escolha = todas[Math.floor(Math.random() * todas.length)];
    usarPergunta(escolha);
  };

  const apenasBoasVindas = messages.length <= 1;

  return (
    <AppLayout>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(180,140,60,0.08),_transparent_60%),_#020617] text-white">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col h-[calc(100vh-4rem)]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-white/60 hover:text-gold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
            <div className="flex items-center gap-2 text-gold">
              <BookOpen className="w-4 h-4" />
              <span className="text-[11px] uppercase tracking-[0.3em] font-semibold">
                Converse com o Livro
              </span>
            </div>
            <div className="w-16" />
          </div>

          {/* Capa + Título poético */}
          {(obra || capa) && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-6">
              {capa && (
                <div className="relative shrink-0">
                  <div className="absolute -inset-2 rounded-lg bg-gold/20 blur-xl opacity-60" />
                  <img
                    src={capa}
                    alt={obra ? `Capa de ${obra}` : 'Capa do livro'}
                    className="relative w-24 sm:w-28 md:w-32 aspect-[2/3] object-cover rounded-md shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] border border-gold/20"
                    loading="lazy"
                  />
                </div>
              )}
              {obra && (
                <div className="text-center sm:text-left">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-1">Obra em escuta</p>
                  <h1 className="font-serif text-2xl md:text-3xl text-gold italic leading-tight">{obra}</h1>
                </div>
              )}
            </div>
          )}

          <Card className="flex-1 flex flex-col bg-[#0A0A0B]/80 backdrop-blur-xl border-white/10 rounded-3xl overflow-hidden shadow-[0_0_60px_-20px_rgba(180,140,60,0.25)]">
            <ScrollArea className="flex-1 p-6" ref={scrollRef}>
              <div className="space-y-5 max-w-3xl mx-auto">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      'flex gap-3',
                      m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    )}
                  >
                    <div
                      className={cn(
                        'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border',
                        m.role === 'user'
                          ? 'bg-primary/10 text-primary border-primary/30'
                          : 'bg-gold/10 text-gold border-gold/30'
                      )}
                    >
                      {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div
                      className={cn(
                        'max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap font-serif',
                        m.role === 'user'
                          ? 'bg-primary/10 text-white/90'
                          : 'bg-white/[0.04] text-white/85 border border-white/5'
                      )}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-gold" />
                    </div>
                    <div className="bg-white/[0.04] border border-white/5 rounded-2xl px-5 py-3.5">
                      <Loader2 className="w-4 h-4 animate-spin text-gold" />
                    </div>
                  </div>
                )}

                {error && (
                  <p className="text-center text-sm text-destructive py-2">{error}</p>
                )}

                {/* Sugestões de Perguntas */}
                {apenasBoasVindas && !isLoading && (
                  <div className="pt-6 mt-2 border-t border-white/5">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-gold" />
                        <p className="text-[11px] uppercase tracking-[0.3em] text-white/60 font-semibold">
                          Perguntas para abrir a travessia
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={surpreendaMe}
                        className="text-[11px] uppercase tracking-[0.2em] text-gold/80 hover:text-gold flex items-center gap-1.5 transition-colors"
                      >
                        <Shuffle className="w-3 h-3" /> Surpreenda-me
                      </button>
                    </div>

                    {/* Tabs de categorias */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {categorias.map((c) => {
                        const Icon = c.icon;
                        const ativa = c.key === catAtiva;
                        return (
                          <button
                            key={c.key}
                            type="button"
                            onClick={() => setCatAtiva(c.key)}
                            className={cn(
                              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all',
                              ativa
                                ? 'bg-gold/15 border-gold/40 text-gold'
                                : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white/90 hover:border-white/20'
                            )}
                          >
                            <Icon className="w-3 h-3" />
                            {c.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Lista de perguntas */}
                    <div className="grid gap-2 sm:grid-cols-2">
                      {categoriaAtiva.perguntas.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => usarPergunta(p)}
                          className="group text-left p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-gold/40 hover:bg-gold/[0.04] transition-all"
                        >
                          <p className="font-serif text-sm text-white/80 group-hover:text-white leading-relaxed italic">
                            "{p}"
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <form
              onSubmit={handleSubmit}
              className="border-t border-white/5 p-4 bg-black/30 flex-shrink-0"
            >
              <div className="flex gap-2 max-w-3xl mx-auto">
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Compartilhe um trecho, símbolo ou pergunta..."
                  className="min-h-[48px] max-h-32 resize-none bg-white/[0.03] border-white/10 text-white placeholder:text-white/30 font-serif"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="h-12 w-12 flex-shrink-0 bg-gold hover:bg-gold/90 text-black"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
