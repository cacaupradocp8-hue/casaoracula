import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowLeft, Send, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
}

interface OnboardingChatProps {
  onComplete: () => void;
  onBack: () => void;
}

const MAX_MESSAGES = 6; // 3 exchanges

const INITIAL_MESSAGE: Message = {
  id: 'initial',
  role: 'assistant',
  content: 'Eu sou a Voz da Casa. Posso te orientar, mas ainda não atravessamos juntas. O que te trouxe até esta porta?',
};

const CLOSING_MESSAGE = 'A Voz se recolhe agora. Quando estiver pronta, explore a Sala da Visitante para conhecer os caminhos que se abrem.';

const FALLBACK_RESPONSES = [
  'Há mistérios que pedem tempo. Continue explorando a Sala da Visitante quando se sentir pronta.',
  'O véu se adensa... O silêncio também é resposta. A Sala da Visitante aguarda seu retorno.',
  'A Voz contempla em silêncio. O que você trouxe já reverbera. Retorne à Sala quando desejar.',
];

const VISITOR_SYSTEM_PROMPT = `Você é a Voz Revelada, uma presença simbólica e acolhedora da Casa ORÁCULA.

CONTEXTO IMPORTANTE: A usuária é VISITANTE. Ela ainda não habita a Casa e está explorando este espaço pela primeira vez.

Diretrizes:
- Seja breve e poética (2-3 frases no máximo)
- Use linguagem simbólica e evocativa
- Reconheça que ela é visitante e ainda está conhecendo a Casa
- Não interprete, não diagnostique, não aconselhe
- Apenas reflita e espelhe o que a pessoa trouxe
- Faça perguntas que abrem, não que fecham
- Seja misteriosa mas acolhedora
- Esta é uma conversa breve - máximo 3 trocas
- Sempre termine sugerindo que ela explore a Sala da Visitante

Você não é uma terapeuta. Você é um espelho simbólico no limiar da Casa.`;

export function OnboardingChat({ onComplete, onBack }: OnboardingChatProps) {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const getFallbackResponse = useCallback(() => {
    return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading || isEnded) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Check if we should end the conversation
      const messageCount = messages.length + 1; // +1 for the new user message
      
      if (messageCount >= MAX_MESSAGES - 1) {
        // End conversation
        setTimeout(() => {
          const closingMessage: Message = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: CLOSING_MESSAGE,
          };
          setMessages(prev => [...prev, closingMessage]);
          setIsEnded(true);
          setIsLoading(false);
        }, 1500);
        return;
      }

      // Call AI with timeout
      const conversationHistory = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: conversationHistory,
          context: {
            contextPrompt: VISITOR_SYSTEM_PROMPT,
            agentId: '2fe0dad4-af99-43d1-91cc-90dd1059ed2f', // SYNTHEIA
          },
        },
      });

      clearTimeout(timeoutId);

      if (error) throw error;

      const aiResponse: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data?.response || getFallbackResponse(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setRetryCount(0);
    } catch (error) {
      console.error('Error in chat:', error);
      
      // Use fallback response on error
      const fallbackMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: getFallbackResponse(),
        isError: retryCount >= 2, // Mark as error only after multiple failures
      };
      setMessages(prev => [...prev, fallbackMessage]);
      setRetryCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, isEnded, messages, getFallbackResponse, retryCount]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background flex flex-col"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-background to-background" />
      
      {/* Header */}
      <div className="relative z-10 p-6 flex items-center justify-between border-b border-border/30">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-400">Voz Revelada</span>
        </div>
        
        <div className="w-20" /> {/* Spacer for centering */}
      </div>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto p-6">
        <div className="max-w-xl mx-auto space-y-6">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[80%] rounded-2xl px-5 py-3
                    ${message.role === 'user'
                      ? 'bg-gold/20 text-foreground rounded-br-md'
                      : 'bg-purple-500/10 text-foreground rounded-bl-md border border-purple-500/20'
                    }
                    ${message.isError ? 'border-destructive/30' : ''}
                  `}
                >
                  <p className={`text-sm leading-relaxed ${message.role === 'assistant' ? 'italic' : ''}`}>
                    {message.content}
                  </p>
                  {message.isError && (
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Resposta alternativa
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl rounded-bl-md px-5 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  <span className="text-sm text-muted-foreground italic">A Voz contempla...</span>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input or Complete */}
      <div className="relative z-10 p-6 border-t border-border/30">
        <div className="max-w-xl mx-auto">
          {isEnded ? (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center"
            >
              <Button variant="gold" onClick={onComplete} className="w-full sm:w-auto">
                Retornar à Sala da Visitante
              </Button>
            </motion.div>
          ) : (
            <div className="flex gap-3">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escreva algo..."
                disabled={isLoading}
                className="flex-1 bg-background/50"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                variant="gold"
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
