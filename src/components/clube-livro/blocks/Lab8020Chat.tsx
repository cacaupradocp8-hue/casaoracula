import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Send, Bot, User, Loader2, Sparkles, ChevronDown, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AGENT_ID = 'a1f91dd7-d93c-495a-bc3a-e02d2632ce02';

interface Lab8020ChatProps {
  livroTitulo: string;
  labConfig?: Record<string, any> | null;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  {
    label: 'Destilar o princípio 80/20',
    prompt: `A partir do conteúdo simbólico apresentado neste portal, ajude-me a destilar o princípio 80/20:\n- Qual arquétipo central está em jogo?\n- Qual tensão psíquica sustenta a maior parte do impacto desse conteúdo?\n- Qual transformação essencial ele propõe?`,
  },
  {
    label: 'Traduzir profissionalmente',
    prompt: `Ajude-me a traduzir profissionalmente o conteúdo simbólico deste portal:\n- Como isso pode virar uma aula?\n- Como pode ser aplicado em uma sessão terapêutica ou mentoria?\n- Como pode ser usado em um círculo feminino ou palestra?`,
  },
  {
    label: 'Aplicar pessoalmente',
    prompt: `Ajude-me a aplicar pessoalmente o conteúdo deste portal:\n- Onde esse arquétipo aparece na minha vida hoje?\n- Qual comportamento pede consciência?\n- Qual gesto concreto posso realizar esta semana?`,
  },
  {
    label: 'Jardim da Psique',
    prompt: `A partir do conteúdo simbólico deste portal, ajude-me a explorar o Campo Pessoal – Jardim da Psique:\n- Onde esse arquétipo ou tema atua em mim?\n- Que emoções, resistências ou imagens surgem?\n- Que aspecto meu pede cuidado ou transformação?\n\nResponda de forma clara, ética, não diagnóstica e aplicável. Nunca trate percepções como verdades absolutas.`,
  },
  {
    label: 'Jardim da Heroína',
    prompt: `A partir do conteúdo simbólico deste portal, ajude-me a explorar o Campo Profissional – Jardim da Heroína:\n- Que tipo de movimento esse tema costuma ativar em clientes?\n- Que imagens simbólicas podem emergir em sessão?\n- Que perguntas éticas podem sustentar a escuta?\n- Que cuidado clínico deve ser observado?\n\nResponda de forma clara, ética, não diagnóstica e aplicável. Nunca trate percepções como verdades absolutas.`,
  },
  {
    label: 'Tradução Aplicável',
    prompt: `A partir do conteúdo simbólico deste portal, ajude-me com a Tradução Aplicável:\n- Como esse conteúdo pode virar uma aula?\n- Como pode ser trabalhado em sessão ou círculo?\n- Como pode ser apresentado em palestra ou vivência?\n\nResponda de forma clara, ética, não diagnóstica e aplicável. Nunca trate percepções como verdades absolutas.`,
  },
];

export function Lab8020Chat({ livroTitulo, labConfig }: Lab8020ChatProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const buildContextPrompt = () => {
    const parts = [`Livro: "${livroTitulo}"`];
    if (labConfig) {
      if (labConfig.arquetipo_central) parts.push(`Arquétipo Central: ${labConfig.arquetipo_central}`);
      if (labConfig.nucleo_vivo) parts.push(`Núcleo Vivo: ${labConfig.nucleo_vivo}`);
      if (labConfig.tensao_central) parts.push(`Tensão Psíquica: ${labConfig.tensao_central}`);
      if (labConfig.imagem_organizadora) parts.push(`Imagem Organizadora: ${labConfig.imagem_organizadora}`);
      if (labConfig.essencia_transformadora) parts.push(`Essência Transformadora: ${labConfig.essencia_transformadora}`);
      if (labConfig.transformacao_exigida) parts.push(`Transformação Exigida: ${labConfig.transformacao_exigida}`);
    }
    return parts.join('\n');
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [{ role: 'user', content: userMessage.content }],
          context: {
            userId: user?.id,
            agentId: AGENT_ID,
            contextType: 'clube_livro',
            contextPrompt: buildContextPrompt(),
          },
        },
      });

      if (error) throw error;

      setMessages(prev => [...prev, {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.content || 'Não foi possível processar sua pergunta.',
      }]);
    } catch (err: any) {
      console.error('Lab8020Chat error:', err);
      toast({
        title: 'Erro na comunicação',
        description: 'Não foi possível conectar à Guardiã. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestionClick = (prompt: string) => {
    if (!isOpen) setIsOpen(true);
    sendMessage(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageCircle className="w-4 h-4 text-gold" />
              Guardiã da Integração 80/20
              <ChevronDown className={cn(
                "w-4 h-4 text-muted-foreground ml-auto transition-transform",
                isOpen && "rotate-180"
              )} />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>

        {/* Suggestion chips — always visible */}
        {messages.length === 0 && (
          <CardContent className="pt-0 pb-4">
            <p className="text-xs text-muted-foreground mb-3">Pergunte à Guardiã ou escolha uma sugestão:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <Button
                  key={s.label}
                  variant="outline"
                  size="sm"
                  className="text-xs border-gold/30 hover:bg-gold/10 hover:border-gold/50 h-auto py-1.5 px-3"
                  onClick={() => handleSuggestionClick(s.prompt)}
                  disabled={isLoading}
                >
                  <Sparkles className="w-3 h-3 mr-1.5 text-gold" />
                  {s.label}
                </Button>
              ))}
            </div>
          </CardContent>
        )}

        <CollapsibleContent>
          {/* Messages */}
          {messages.length > 0 && (
            <ScrollArea className="h-80 px-4 pb-2" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-3',
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                      message.role === 'user'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-gold/20 text-gold'
                    )}>
                      {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-2',
                      message.role === 'user'
                        ? 'bg-primary/10 text-foreground'
                        : 'bg-muted text-foreground'
                    )}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-gold" />
                    </div>
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-border p-3">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Faça sua pergunta à Guardiã..."
                className="min-h-[44px] max-h-32 resize-none bg-background/50"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                variant="gold"
                disabled={!input.trim() || isLoading}
                className="h-11 w-11 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
