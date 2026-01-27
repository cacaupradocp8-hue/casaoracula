import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Send, Bot, User, Loader2, MessageCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GuardiaLeituraChatProps {
  contextPage: 'funcional' | 'funcional_resultado' | 'oracular' | 'oracular_resultado';
  welcomeMessage?: string;
  defaultOpen?: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  'Qual a diferença entre as duas leituras?',
  'O resultado pode mudar com o tempo?',
  'Posso confiar nesse mapa?',
];

const DEFAULT_WELCOME = 'Olá! Sou a Guardiã da Leitura. Posso explicar a diferença entre a Leitura Funcional e a Leitura Oracular do Big Five. Pergunte o que quiser — sem pressa.';

export function GuardiaLeituraChat({ 
  contextPage, 
  welcomeMessage,
  defaultOpen = false,
}: GuardiaLeituraChatProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch agent ID
  useEffect(() => {
    const fetchAgent = async () => {
      const { data, error } = await supabase
        .from('agentes')
        .select('id')
        .eq('nome', 'Guardiã da Leitura')
        .eq('status', 'ativo')
        .maybeSingle();
      
      if (data && !error) {
        setAgentId(data.id);
      }
    };
    fetchAgent();
  }, []);

  // Add welcome message on mount
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: welcomeMessage || DEFAULT_WELCOME,
        timestamp: new Date(),
      }]);
    }
  }, [welcomeMessage]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          context: {
            userId: user?.id,
            agentId: agentId,
            contextType: 'big5',
            contextId: contextPage,
            contextPrompt: `Contexto: A usuária está na página ${contextPage.replace('_', ' ')} do Big Five.`,
          },
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.content || 'Desculpe, não consegui processar sua mensagem.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Guardiã chat error:', error);
      toast({
        title: 'Erro na comunicação',
        description: 'Não foi possível se conectar à Guardiã. Tente novamente.',
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleSuggestionClick = (question: string) => {
    sendMessage(question);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <Card className="border-primary/20 overflow-hidden">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">Pergunte à Guardiã da Leitura</p>
                <p className="text-xs text-muted-foreground">
                  Tira dúvidas sobre as leituras do Big Five
                </p>
              </div>
            </div>
            <ChevronDown 
              className={cn(
                "w-5 h-5 text-muted-foreground transition-transform duration-200",
                isOpen && "rotate-180"
              )} 
            />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t border-border">
            {/* Messages area */}
            <ScrollArea className="h-64 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    )}
                  >
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
                      message.role === 'user' 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-gold/20 text-gold'
                    )}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2",
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
                    <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-gold" />
                    </div>
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Suggestions (only show before first user message) */}
            {messages.length === 1 && !isLoading && (
              <div className="px-4 pb-3 flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    onClick={() => handleSuggestionClick(question)}
                    className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {/* Input area */}
            <form onSubmit={handleSubmit} className="border-t border-border p-3">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Digite sua pergunta..."
                  className="min-h-[44px] max-h-24 resize-none bg-background/50 text-sm"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="h-11 w-11 flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
