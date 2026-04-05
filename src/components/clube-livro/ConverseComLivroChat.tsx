// ============================================
// CONVERSE COM O LIVRO — Chat Especializado
// Modo de estudo ancorado na obra do Clube
// ============================================

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useSyntheiaChat } from '@/hooks/useSyntheiaChat';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { TherabotMessage } from '@/components/therabot/TherabotMessage';
import {
  Send, Loader2, BookOpen, Sparkles, X,
  MessageCircle, ChevronDown, ChevronUp, Quote,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface BookContext {
  bookTitle: string;
  bookAuthor?: string;
  cycleTheme?: string;
  stationName?: string;
  chapterTitle?: string;
  excerptText?: string;
  optionalStudyNotes?: string;
}

interface QuickAction {
  label: string;
  prompt: string;
  icon: React.ElementType;
  requiresExcerpt?: boolean;
}

interface Props {
  bookContext: BookContext;
  className?: string;
  /** Inline embedded mode (no FAB) */
  embedded?: boolean;
}

// ============================================
// QUICK ACTIONS
// ============================================

const QUICK_ACTIONS_WITH_EXCERPT: QuickAction[] = [
  { label: 'Explicar este trecho', prompt: 'O que esse trecho quer dizer? Me ajuda a entender o sentido simbólico.', icon: BookOpen, requiresExcerpt: true },
  { label: 'Resumir a ideia central', prompt: 'Qual a ideia central deste trecho? Me ajuda a organizar.', icon: Sparkles },
  { label: 'O que observar nesta leitura', prompt: 'O que devo observar ao continuar lendo? Quais fios, tensões ou repetições prestar atenção?', icon: MessageCircle },
  { label: 'Conectar com a jornada simbólica', prompt: 'Como esse trecho ou livro se conecta com a jornada simbólica, travessias, portas ou arquétipos?', icon: Sparkles },
  { label: 'Gerar pergunta contemplativa', prompt: 'Crie uma pergunta contemplativa inspirada neste conteúdo.', icon: Quote },
  { label: 'Sugerir prática inspirada no livro', prompt: 'Sugira uma prática simbólica breve inspirada nesta leitura.', icon: Sparkles },
];

const QUICK_ACTIONS_NO_EXCERPT: QuickAction[] = [
  { label: 'Resumir a ideia central do livro', prompt: 'Qual a ideia central deste livro e por que ele está no Clube Oracular?', icon: BookOpen },
  { label: 'O que observar nesta leitura', prompt: 'O que devo observar ao ler este livro? Quais fios, tensões ou repetições prestar atenção?', icon: MessageCircle },
  { label: 'Conectar com a jornada simbólica', prompt: 'Como esse livro se conecta com a jornada simbólica, travessias, portas ou arquétipos?', icon: Sparkles },
  { label: 'Gerar pergunta contemplativa', prompt: 'Crie uma pergunta contemplativa inspirada neste livro para guiar minha leitura.', icon: Quote },
  { label: 'Sugerir prática inspirada no livro', prompt: 'Sugira uma prática simbólica breve inspirada neste livro.', icon: Sparkles },
];

// ============================================
// COMPONENT
// ============================================

export function ConverseComLivroChat({ bookContext, className, embedded = false }: Props) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(embedded);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const extraContext: Record<string, unknown> = {
    bookTitle: bookContext.bookTitle,
    bookAuthor: bookContext.bookAuthor,
    cycleTheme: bookContext.cycleTheme,
    stationName: bookContext.stationName,
    chapterTitle: bookContext.chapterTitle,
    excerptText: bookContext.excerptText,
    optionalStudyNotes: bookContext.optionalStudyNotes,
  };

  const welcomeMsg = bookContext.excerptText
    ? `📖 Estou aqui para conversar sobre **${bookContext.bookTitle}**${bookContext.bookAuthor ? ` de ${bookContext.bookAuthor}` : ''}.\n\nVejo que você trouxe um trecho. Posso explicá-lo, aprofundar o sentido simbólico, conectar com sua jornada ou sugerir uma reflexão. O que gostaria de explorar?`
    : `📖 Estou aqui para conversar sobre **${bookContext.bookTitle}**${bookContext.bookAuthor ? ` de ${bookContext.bookAuthor}` : ''}.\n\nPosso ajudá-la a entender ideias, conectar a obra com a jornada simbólica ou sugerir uma prática. Se quiser mais precisão, cole um trecho do livro. O que gostaria de explorar?`;

  const {
    messages, isLoading, error, sendMessage, addWelcomeMessage, clearConversation,
  } = useSyntheiaChat({
    mode: 'converse_com_livro',
    context: {
      ...extraContext,
      voicePrompt: `Você está no modo "Converse com o Livro" do Clube Oracular. Livro: "${bookContext.bookTitle}"${bookContext.bookAuthor ? ` de ${bookContext.bookAuthor}` : ''}. ${bookContext.cycleTheme ? `Ciclo: ${bookContext.cycleTheme}.` : ''} ${bookContext.stationName ? `Estação: ${bookContext.stationName}.` : ''} Responda como interlocutora de estudo, nunca como chat genérico.`,
    },
    routingContext: {
      tipoUsuario: 'aluna',
      area: 'clube',
      subArea: 'livro',
      module: 'clube',
      pageName: 'Converse com o Livro',
      intencao: 'conversa_material_fonte',
    },
  });

  // Welcome
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addWelcomeMessage(welcomeMsg);
    }
  }, [isOpen, messages.length, addWelcomeMessage, welcomeMsg]);

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

  const handleToggle = () => {
    if (isOpen) {
      clearConversation();
    }
    setIsOpen(!isOpen);
  };

  const quickActions = bookContext.excerptText
    ? QUICK_ACTIONS_WITH_EXCERPT
    : QUICK_ACTIONS_NO_EXCERPT;

  const showQuickActions = messages.length <= 1 && !isLoading;

  // ============================================
  // RENDER
  // ============================================

  if (embedded) {
    return (
      <div className={cn("flex flex-col rounded-2xl border border-gold/20 bg-card/95 overflow-hidden", className)}>
        <ChatContent
          bookContext={bookContext}
          messages={messages}
          isLoading={isLoading}
          error={error}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          handleKeyDown={handleKeyDown}
          handleQuickAction={handleQuickAction}
          quickActions={quickActions}
          showQuickActions={showQuickActions}
          scrollRef={scrollRef}
        />
      </div>
    );
  }

  return (
    <div className={cn("border border-gold/20 rounded-xl overflow-hidden bg-card", className)}>
      {/* Collapsible Header */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gold/5 transition-colors"
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/20 to-amber-500/10 flex items-center justify-center ring-1 ring-gold/20">
            <BookOpen className="w-4 h-4 text-gold" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">Converse com o Livro</p>
            <p className="text-xs text-muted-foreground truncate max-w-[250px]">
              {bookContext.bookTitle}
            </p>
          </div>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {/* Chat Body */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gold/10">
              <ChatContent
                bookContext={bookContext}
                messages={messages}
                isLoading={isLoading}
                error={error}
                input={input}
                setInput={setInput}
                handleSubmit={handleSubmit}
                handleKeyDown={handleKeyDown}
                handleQuickAction={handleQuickAction}
                quickActions={quickActions}
                showQuickActions={showQuickActions}
                scrollRef={scrollRef}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// CHAT CONTENT (shared between modes)
// ============================================

interface ChatContentProps {
  bookContext: BookContext;
  messages: Array<{ id: string; role: 'user' | 'assistant'; content: string }>;
  isLoading: boolean;
  error: string | null;
  input: string;
  setInput: (v: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleQuickAction: (prompt: string) => void;
  quickActions: QuickAction[];
  showQuickActions: boolean;
  scrollRef: React.RefObject<HTMLDivElement>;
}

function ChatContent({
  bookContext, messages, isLoading, error, input, setInput,
  handleSubmit, handleKeyDown, handleQuickAction,
  quickActions, showQuickActions, scrollRef,
}: ChatContentProps) {
  return (
    <>
      {/* Book Context Header */}
      <div className="px-4 py-2.5 bg-gold/5 border-b border-gold/10">
        <div className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-gold/70 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{bookContext.bookTitle}</p>
            <p className="text-[10px] text-muted-foreground truncate">
              {[bookContext.bookAuthor, bookContext.cycleTheme, bookContext.stationName].filter(Boolean).join(' • ')}
            </p>
          </div>
        </div>
        {bookContext.excerptText && (
          <div className="mt-2 p-2 rounded-lg bg-background/60 border border-border/30">
            <div className="flex items-start gap-1.5">
              <Quote className="w-3 h-3 text-gold/50 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3 italic">
                {bookContext.excerptText}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="h-72 px-4 py-3" ref={scrollRef as React.RefObject<HTMLDivElement>}>
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

      {/* Quick Actions */}
      {showQuickActions && (
        <div className="px-4 pb-2">
          <p className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider px-0.5 mb-1.5">
            {bookContext.excerptText ? 'Explorar o trecho' : 'Explorar o livro'}
          </p>
          <div className="flex flex-col gap-1">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.prompt)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-border/50 bg-card/40 hover:bg-card/80 hover:border-gold/30 transition-all text-xs text-muted-foreground hover:text-foreground text-left group"
                >
                  <Icon className="w-3.5 h-3.5 text-gold/60 group-hover:text-gold flex-shrink-0 transition-colors" />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-border/50 p-3 bg-background/30">
        <div className="flex gap-2 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte sobre o livro..."
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
        <p className="text-center text-[10px] text-muted-foreground/50 mt-1.5">
          Enter para enviar · Shift+Enter para nova linha
        </p>
      </form>
    </>
  );
}
