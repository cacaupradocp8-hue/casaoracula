// ============================================
// THERABOT WIDGET
// Floating contextual AI assistant powered by SINTHEYA
// ============================================

import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Send, Bot, User, Loader2, Sparkles, X, Minimize2,
  Heart, Flower, Eye, BookOpen, Target, ListChecks,
  Compass, FileText, Lightbulb, Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSyntheiaChat } from '@/hooks/useSyntheiaChat';
import { useAuth } from '@/contexts/AuthContext';
import { buildTherabotContext, getTherabotConfig, QuickAction } from '@/services/syntheiaContextAdapter';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

const ICON_MAP: Record<string, React.ElementType> = {
  sparkles: Sparkles, home: Home, compass: Compass, heart: Heart,
  flower: Flower, eye: Eye, book: BookOpen, target: Target,
  list: ListChecks, 'file-text': FileText, lightbulb: Lightbulb,
};

function QuickActionButton({ action, onClick }: { action: QuickAction; onClick: () => void }) {
  const Icon = ICON_MAP[action.icon] || Sparkles;
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card/60 hover:bg-card hover:border-gold/40 transition-all text-xs text-muted-foreground hover:text-foreground text-left"
    >
      <Icon className="w-3.5 h-3.5 text-gold flex-shrink-0" />
      <span>{action.label}</span>
    </button>
  );
}

export function TherabotWidget() {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevPathnameRef = useRef(location.pathname);

  // Build context from current route + user
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

  // Reset conversation when route changes significantly
  useEffect(() => {
    const prevArea = prevPathnameRef.current.split('/')[1];
    const currArea = location.pathname.split('/')[1];
    if (prevArea !== currArea && isOpen) {
      clearConversation();
    }
    prevPathnameRef.current = location.pathname;
  }, [location.pathname, isOpen, clearConversation]);

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

  const handleQuickAction = async (action: QuickAction) => {
    await sendMessage(action.prompt);
  };

  const showQuickActions = messages.length <= 1 && !isLoading;

  return (
    <>
      {/* FAB Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              variant="gold"
              size="icon"
              className="h-14 w-14 rounded-full shadow-glow"
              aria-label="Abrir Therabot"
            >
              <Bot className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-6rem)] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{config.title}</h3>
                  <p className="text-[10px] text-muted-foreground capitalize">{context.tipoUsuario} • {context.area}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { clearConversation(); setIsOpen(false); }}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-3" ref={scrollRef}>
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2",
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                      message.role === 'user'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-gold/20 text-gold'
                    )}>
                      {message.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                    </div>
                    <div className={cn(
                      "max-w-[80%] rounded-2xl px-3 py-2",
                      message.role === 'user'
                        ? 'bg-primary/10 text-foreground'
                        : 'bg-muted text-foreground'
                    )}>
                      <div className="text-xs leading-relaxed prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center">
                      <Bot className="w-3 h-3 text-gold" />
                    </div>
                    <div className="bg-muted rounded-2xl px-3 py-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}

                {error && (
                  <p className="text-xs text-destructive text-center py-1">{error}</p>
                )}
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            {showQuickActions && (
              <div className="px-3 pb-2 flex flex-col gap-1.5">
                {config.quickActions.map((action) => (
                  <QuickActionButton
                    key={action.label}
                    action={action}
                    onClick={() => handleQuickAction(action)}
                  />
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-border p-3">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Digite sua mensagem..."
                  className="min-h-[36px] max-h-24 resize-none text-xs bg-background/50"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  variant="gold"
                  disabled={!input.trim() || isLoading}
                  className="h-9 w-9 flex-shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
