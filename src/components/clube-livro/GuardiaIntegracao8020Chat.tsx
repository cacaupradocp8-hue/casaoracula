// ============================================
// CHAT: GUARDIÃ DA INTEGRAÇÃO 80/20
// Chat com streaming via edge function ai-chat
// ============================================

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Send, Loader2, Sparkles, User, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AGENTE_ID = 'a1f91dd7-d93c-495a-bc3a-e02d2632ce02';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const MENSAGEM_BOAS_VINDAS: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Sou a Guardiã da Integração 80/20. Estou aqui para ajudá-la a destilar o essencial de cada leitura e transformar em algo que vive no seu trabalho — não mais um resumo, mas uma prática real.\n\nMe traga o que ficou, o que tocou, o que confundiu. Vamos destilar juntas.',
};

interface Props {
  cicloTitulo?: string;
}

export function GuardiaIntegracao8020Chat({ cicloTitulo }: Props) {
  const { user } = useAuth();
  const [aberto, setAberto] = useState(false);
  const [messages, setMessages] = useState<Message[]>([MENSAGEM_BOAS_VINDAS]);
  const [input, setInput] = useState('');
  const [carregando, setCarregando] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current && aberto) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, aberto]);

  // Focus ao abrir
  useEffect(() => {
    if (aberto) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [aberto]);

  const enviar = async () => {
    const texto = input.trim();
    if (!texto || carregando) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: texto,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setCarregando(true);

    try {
      const todosParaEnviar = [...messages, userMsg];

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: todosParaEnviar.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          context: {
            userId: user?.id,
            agentId: AGENTE_ID,
            contextType: 'club',
            contextPrompt: cicloTitulo
              ? `A usuária está fazendo a Integração 80/20 do livro: "${cicloTitulo}". Contextualize suas respostas a esse conteúdo quando relevante.`
              : undefined,
          },
        },
      });

      if (error) throw error;

      const resposta: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data?.content || 'Não consegui processar. Tente novamente.',
      };

      setMessages((prev) => [...prev, resposta]);
    } catch (err: unknown) {
      console.error('Erro no chat 80/20:', err);
      const status = (err as { status?: number })?.status;
      if (status === 429) {
        toast.error('Muitas requisições. Aguarde um momento e tente novamente.');
      } else if (status === 402) {
        toast.error('Créditos de IA insuficientes. Contate a administração.');
      } else {
        toast.error('Não foi possível conectar à Guardiã. Tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  };

  return (
    <div className="border border-gold/20 rounded-xl overflow-hidden bg-card">
      {/* Header — toggle */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gold/5 transition-colors"
        onClick={() => setAberto((a) => !a)}
        aria-expanded={aberto}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">Guardiã da Integração 80/20</p>
            <p className="text-xs text-muted-foreground">
              Assistente para transformar leitura em prática
            </p>
          </div>
        </div>
        {aberto ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Corpo do chat */}
      {aberto && (
        <>
          <Separator className="opacity-20" />

          {/* Mensagens */}
          <ScrollArea className="h-72 px-4 py-3" ref={scrollRef as any}>
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex gap-2',
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                      msg.role === 'user' ? 'bg-muted' : 'bg-gold/10'
                    )}
                  >
                    {msg.role === 'user' ? (
                      <User className="w-3 h-3 text-muted-foreground" />
                    ) : (
                      <Sparkles className="w-3 h-3 text-gold" />
                    )}
                  </div>

                  {/* Balão */}
                  <div
                    className={cn(
                      'max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-muted text-foreground'
                        : 'bg-gold/5 text-foreground border border-gold/10'
                    )}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}

              {/* Indicador de carregamento */}
              {carregando && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3 h-3 text-gold" />
                  </div>
                  <div className="bg-gold/5 border border-gold/10 rounded-2xl px-3 py-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <Separator className="opacity-20" />

          {/* Input */}
          <div className="px-3 py-2.5 flex gap-2 items-end">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="O que ficou desta leitura? O que quer destilar?"
              rows={2}
              className="resize-none text-sm bg-background/50 border-border/40 focus:border-gold/40 leading-relaxed min-h-[52px] max-h-28"
              disabled={carregando}
            />
            <Button
              onClick={enviar}
              disabled={!input.trim() || carregando}
              size="icon"
              className="bg-gold hover:bg-gold/90 text-primary-foreground h-[52px] w-10 shrink-0"
              aria-label="Enviar mensagem"
            >
              {carregando ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground/60 pb-2">
            Enter para enviar · Shift+Enter para nova linha
          </p>
        </>
      )}
    </div>
  );
}
