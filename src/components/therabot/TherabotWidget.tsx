// ============================================
// THERABOT WIDGET
// Floating contextual AI assistant powered by SINTHEYA
// ============================================

import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useSyntheiaChat } from '@/hooks/useSyntheiaChat';
import { useAuth } from '@/contexts/AuthContext';
import { buildTherabotContext, getTherabotConfig } from '@/services/syntheiaContextAdapter';
import { motion, AnimatePresence } from 'framer-motion';
import { TherabotHeader } from './TherabotHeader';
import { TherabotMessage } from './TherabotMessage';
import { TherabotQuickActions } from './TherabotQuickActions';
import { TherabotNavSuggestions } from './TherabotNavSuggestions';
import { TherabotFAB } from './TherabotFAB';
import {
  Send, Loader2,
} from 'lucide-react';

export function TherabotWidget() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevPathnameRef = useRef(location.pathname);
  const prevAreaRef = useRef('');

  const context = buildTherabotContext(location.pathname, user?.portal);
  const config = getTherabotConfig(context);

  const {
    messages, isLoading, error, sendMessage, addWelcomeMessage, clearConversation,
  } = useSyntheiaChat({
    mode: config.mode,
    context: {
      voicePrompt: config.voicePrompt,
      categoria: context.area,
    },
  });

  // Transition message on area change (session memory)
  useEffect(() => {
    const prevArea = prevPathnameRef.current.split('/')[1];
    const currArea = location.pathname.split('/')[1];
    if (prevArea !== currArea && isOpen && messages.length > 1) {
      const prevConfig = getTherabotConfig(buildTherabotContext(prevPathnameRef.current, user?.portal));
      const prevLabel = prevConfig.areaLabel;
      clearConversation();
      // Add transition message after clearing
      setTimeout(() => {
        addWelcomeMessage(
          `🌀 Percebi que você saiu de **${prevLabel}** e entrou em **${config.areaLabel}**. Estou aqui se quiser continuar por outro caminho.\n\n${config.welcomeMessage}`
        );
      }, 50);
    } else if (prevArea !== currArea && isOpen && messages.length <= 1) {
      clearConversation();
    }
    prevPathnameRef.current = location.pathname;
    prevAreaRef.current = currArea;
  }, [location.pathname]);

  // Welcome message when opening
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addWelcomeMessage(config.welcomeMessage);
    }
  }, [isOpen, messages.length, addWelcomeMessage, config.welcomeMessage]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const msg = input.trim();
    setInput('');
    await sendMessage(msg);
  }, [input, isLoading, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleQuickAction = async (prompt: string) => {
    await sendMessage(prompt);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const showQuickActions = messages.length <= 1 && !isLoading;

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!isOpen && (
          <TherabotFAB onClick={() => setIsOpen(true)} />
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-6rem)] flex flex-col rounded-2xl border border-gold/20 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <TherabotHeader
              title={config.title}
              areaLabel={config.areaLabel}
              userType={context.tipoUsuario}
              onClose={() => { clearConversation(); setIsOpen(false); }}
            />

            {/* Messages */}
            <ScrollArea className="flex-1 px-4 py-3" ref={scrollRef}>
              <div className="space-y-3">
                {messages.map((message) => (
                  <TherabotMessage key={message.id} message={message} />
                ))}

                {isLoading && (
                  <div className="flex gap-2.5 items-start">
                    <div className="w-7 h-7 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-gold/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-gold/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-gold/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <p className="text-xs text-destructive text-center py-1">{error}</p>
                )}
              </div>
            </ScrollArea>

            {/* Quick Actions + Nav Suggestions */}
            {showQuickActions && (
              <div className="px-4 pb-2 space-y-2">
                <TherabotQuickActions
                  actions={config.quickActions}
                  onAction={handleQuickAction}
                />
                <TherabotNavSuggestions
                  suggestions={config.navigationSuggestions}
                  onNavigate={handleNavigate}
                />
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-border/50 p-3 bg-background/30">
              <div className="flex gap-2 items-end">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Digite sua mensagem..."
                  className="min-h-[38px] max-h-24 resize-none text-xs bg-background/60 border-border/40 focus:border-gold/40 rounded-xl"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  variant="gold"
                  disabled={!input.trim() || isLoading}
                  className="h-9 w-9 flex-shrink-0 rounded-xl"
                >
                  {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
