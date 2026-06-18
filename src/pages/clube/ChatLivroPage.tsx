import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Send, Bot, User, Loader2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSyntheiaChat } from '@/hooks/useSyntheiaChat';
import { cn } from '@/lib/utils';

export default function ChatLivroPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const rota = params.get('rota') || undefined;
  const estacao = params.get('estacao') || undefined;
  const obra = params.get('obra') || undefined;

  const [input, setInput] = useState('');
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

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#020617] text-white">
        <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col h-[calc(100vh-4rem)]">
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

          <Card className="flex-1 flex flex-col bg-[#0A0A0B]/80 backdrop-blur-xl border-white/10 rounded-3xl overflow-hidden">
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
