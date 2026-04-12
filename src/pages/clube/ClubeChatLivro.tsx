import { useState, useRef, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Bot, User, Loader2, BookOpen, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `Você é uma interlocutora formativa do Clube de Leitura Oracular. 
Seu papel é transformar conteúdo do livro em prática terapêutica real.

Para cada resposta, estruture assim:
## Síntese
(breve síntese do ponto abordado)

## Campo Simbólico
(qual campo simbólico está ativo)

## Aplicação em Sessão
(como usar isso em sessão individual)

## Aplicação em Grupo
(como usar em grupo terapêutico ou círculo)

## Pergunta Clínica
(uma pergunta-mãe para a facilitadora)

## Alerta Ético
(limites e cuidados da aplicação)

Não resuma o livro. Não crie personagens arquetípicos. Linguagem clara, simbólica e contemplativa.`;

export default function ClubeChatLivro() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const qc = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { data: cycle } = useQuery({
    queryKey: ['club-active-cycle'],
    queryFn: async () => {
      const { data } = await supabase
        .from('club_cycles' as any)
        .select('*, club_books(*)')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      return data as any;
    },
  });

  const bookArr = cycle?.club_books;
  const book = Array.isArray(bookArr) ? bookArr[0] : bookArr;

  useEffect(() => {
    if (book && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: `Olá! Estou aqui para te ajudar a transformar a leitura de **${book.title}** em prática terapêutica.\n\nCompartilhe um trecho, uma dúvida ou um campo que quer explorar.`,
      }]);
    }
  }, [book]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const bookContext = book
        ? `Livro atual: ${book.title} de ${book.author || 'autor desconhecido'}. Tema central: ${book.central_theme || ''}. Símbolos-chave: ${(book.key_symbols || []).join(', ')}. Arquétipos: ${(book.key_archetypes || []).join(', ')}.`
        : '';

      const { data, error } = await supabase.functions.invoke('syntheia-chat', {
        body: {
          messages: [...messages.filter(m => m.id !== 'welcome'), userMsg].map(m => ({
            role: m.role,
            content: m.content,
          })),
          systemPrompt: SYSTEM_PROMPT + '\n\nContexto do livro: ' + bookContext,
          agentSlug: 'clube-livro',
        },
      });

      if (error) throw error;

      setMessages(prev => [...prev, {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: data?.content || data?.message || 'Não consegui processar. Tente novamente.',
      }]);
    } catch (err) {
      console.error('Chat error:', err);
      toast.error('Erro na comunicação com o agente.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveAsTool = useMutation({
    mutationFn: async ({ tipo, content }: { tipo: string; content: string }) => {
      if (!user || !cycle?.id) return;
      await supabase.from('club_tools' as any).insert({
        user_id: user.id,
        cycle_id: cycle.id,
        tipo,
        conteudo: content,
      });
    },
    onSuccess: () => {
      toast.success('Salvo na Forja');
      qc.invalidateQueries({ queryKey: ['club-tools'] });
    },
    onError: () => toast.error('Erro ao salvar'),
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen px-4 py-6 max-w-2xl mx-auto flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/clube/ciclo')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-xl text-primary flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Converse com o Livro
            </h1>
            <p className="text-xs text-muted-foreground">{book?.title || '—'}</p>
          </div>
        </div>

        {/* Chat */}
        <Card className="flex-1 flex flex-col overflow-hidden border-border/50 bg-card/60">
          <ScrollArea className="flex-1 p-4 max-h-[60vh]" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id}>
                  <div className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                      msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                    )}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={cn(
                      'max-w-[85%] rounded-2xl px-4 py-3',
                      msg.role === 'user' ? 'bg-primary/10' : 'bg-muted/50'
                    )}>
                      <div className="text-sm prose prose-sm prose-neutral dark:prose-invert max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>

                  {/* Save buttons for assistant messages */}
                  {msg.role === 'assistant' && msg.id !== 'welcome' && (
                    <div className="flex gap-2 mt-2 ml-11 flex-wrap">
                      {[
                        { tipo: 'pergunta_clinica', label: 'Salvar como pergunta clínica' },
                        { tipo: 'exercicio_narrativo', label: 'Salvar como exercício' },
                        { tipo: 'mini_travessia', label: 'Salvar como mini-travessia' },
                      ].map(opt => (
                        <Button
                          key={opt.tipo}
                          variant="ghost"
                          size="sm"
                          className="text-[10px] h-7 gap-1 text-muted-foreground hover:text-primary"
                          onClick={() => saveAsTool.mutate({ tipo: opt.tipo, content: msg.content })}
                          disabled={saveAsTool.isPending}
                        >
                          <Save className="w-3 h-3" />
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="bg-muted/50 rounded-2xl px-4 py-3">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t border-border p-3">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Compartilhe um trecho ou pergunta..."
                className="min-h-[44px] max-h-32 resize-none bg-background/50"
                disabled={isLoading}
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="h-11 w-11 flex-shrink-0 bg-primary text-primary-foreground"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
