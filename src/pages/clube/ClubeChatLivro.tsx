import { useState, useRef, useEffect, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Send, Bot, User, Loader2, BookOpen,
  Save, Hammer, MessageSquareQuote, Footprints,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChatMessageBlocks } from '@/components/clube/chat/ChatMessageBlocks';
import { ToolBuilderPanel } from '@/components/clube/chat/ToolBuilderPanel';
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const PLACEHOLDERS = [
  'Como isso vira prática em sessão?',
  'Como aplicar esse conteúdo em grupo?',
  'Que intervenção nasce desse trecho?',
];

const SYSTEM_PROMPT = `Você é uma interlocutora formativa do Clube de Leitura Oracular.
Seu papel é transformar conteúdo do livro em prática terapêutica real.

Para cada resposta, estruture assim:
## Síntese
(breve síntese do ponto abordado)

## Campo Simbólico
(qual campo simbólico está ativo)

## Aplicação em Sessão
(como usar isso em sessão individual — bullet points)

## Aplicação em Grupo
(como usar em grupo terapêutico ou círculo — bullet points)

## Pergunta Clínica
(uma pergunta-mãe para a facilitadora)

## Alerta Ético
(limites e cuidados da aplicação)

Não resuma o livro. Não crie personagens arquetípicos. Linguagem clara, simbólica e contemplativa.`;

export default function ClubeChatLivro() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const qc = useQueryClient();
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [placeholder] = useState(() => PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]);

  // Builder panel state
  const [builderOpen, setBuilderOpen] = useState(false);
  const [builderTipo, setBuilderTipo] = useState('');
  const [builderContent, setBuilderContent] = useState('');

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

  const openBuilder = (tipo: string, content: string) => {
    setBuilderTipo(tipo);
    setBuilderContent(content);
    setBuilderOpen(true);
  };

  const saveTool = useMutation({
    mutationFn: async (tool: { tipo: string; conteudo: string; contexto_uso: string; limite_etico: string }) => {
      if (!user || !cycle?.id) return;
      await supabase.from('club_tools' as any).insert({
        user_id: user.id,
        cycle_id: cycle.id,
        tipo: tool.tipo,
        conteudo: tool.conteudo,
        contexto_uso: tool.contexto_uso,
        limite_etico: tool.limite_etico,
      });
    },
    onSuccess: () => {
      toast.success('Ferramenta salva na Forja');
      qc.invalidateQueries({ queryKey: ['club-tools'] });
      setBuilderOpen(false);
    },
    onError: () => toast.error('Erro ao salvar'),
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const ACTION_BUTTONS = [
    { tipo: 'pergunta_clinica', label: 'Salvar como pergunta clínica', icon: MessageSquareQuote },
    { tipo: 'exercicio_narrativo', label: 'Criar exercício narrativo', icon: Hammer },
    { tipo: 'mini_travessia', label: 'Criar mini-travessia', icon: Footprints },
  ];

  // Builder panel content (shared between drawer and side panel)
  const builderPanelContent = builderOpen ? (
    <ToolBuilderPanel
      tipo={builderTipo}
      content={builderContent}
      onSave={(tool) => saveTool.mutate(tool)}
      onSaveDraft={(tool) => {
        saveTool.mutate(tool);
      }}
      onClose={() => setBuilderOpen(false)}
      isSaving={saveTool.isPending}
    />
  ) : null;

  return (
    <AppLayout>
      <div className="min-h-screen flex flex-col bg-background">
        {/* ── HEADER ── */}
        <div className="sticky top-0 z-20 border-b border-[#2A2340] bg-background/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/clube/ciclo')} className="h-8 w-8">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[hsl(var(--gold))]" />
                  Converse com o Livro
                </h1>
                <p className="text-[10px] text-muted-foreground">Transforme leitura em prática</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-right">
              <div>
                <p className="text-xs font-medium text-foreground">{book?.title || '—'}</p>
                <p className="text-[10px] text-muted-foreground">{cycle?.portal || 'Portal ativo'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN ── */}
        <div className="flex-1 flex max-w-7xl mx-auto w-full">
          {/* ── CHAT COLUMN ── */}
          <div className={cn(
            'flex flex-col flex-1 min-w-0',
            !isMobile && builderOpen ? 'max-w-[60%]' : 'max-w-full'
          )}>
            {/* Messages */}
            <ScrollArea className="flex-1 px-4 sm:px-6 py-4" ref={scrollRef}>
              <div className="space-y-6 max-w-2xl mx-auto">
                {messages.map((msg) => (
                  <div key={msg.id}>
                    {/* User message */}
                    {msg.role === 'user' && (
                      <div className="flex justify-end">
                        <div className="flex items-start gap-2.5 flex-row-reverse max-w-[85%]">
                          <div className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <div className="bg-primary/8 rounded-2xl rounded-tr-md px-4 py-3">
                            <p className="text-sm text-foreground leading-relaxed">{msg.content}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Assistant message — structured blocks */}
                    {msg.role === 'assistant' && (
                      <div className="flex items-start gap-2.5 max-w-[92%]">
                        <div className="w-7 h-7 rounded-full bg-[hsl(var(--gold)_/_0.15)] text-[hsl(var(--gold))] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <ChatMessageBlocks content={msg.content} />

                          {/* Action buttons */}
                          {msg.id !== 'welcome' && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {ACTION_BUTTONS.map(btn => {
                                const Icon = btn.icon;
                                return (
                                  <Button
                                    key={btn.tipo}
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 text-[11px] text-muted-foreground hover:text-[hsl(var(--gold))] hover:bg-[hsl(var(--gold)_/_0.08)] border border-transparent hover:border-[hsl(var(--gold)_/_0.2)] rounded-lg transition-all"
                                    onClick={() => openBuilder(btn.tipo, msg.content)}
                                  >
                                    <Icon className="w-3.5 h-3.5 mr-1.5" />
                                    {btn.label}
                                  </Button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[hsl(var(--gold)_/_0.15)] text-[hsl(var(--gold))] flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-muted/30 rounded-2xl rounded-tl-md px-4 py-3">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t border-[#2A2340] px-4 sm:px-6 py-3 bg-background/95 backdrop-blur-sm">
              <div className="max-w-2xl mx-auto flex gap-2">
                <Textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="min-h-[44px] max-h-32 resize-none bg-[#13101C] border-[#2A2340] text-sm placeholder:text-muted-foreground/50"
                  disabled={isLoading}
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="h-11 w-11 flex-shrink-0 bg-[hsl(var(--gold))] text-background hover:bg-[hsl(var(--gold))]/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* ── BUILDER PANEL (desktop) ── */}
          {!isMobile && (
            <AnimatePresence>
              {builderOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '40%', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="border-l border-[#2A2340] bg-background overflow-hidden"
                >
                  {builderPanelContent}
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* ── BUILDER DRAWER (mobile) ── */}
          {isMobile && (
            <Drawer open={builderOpen} onOpenChange={setBuilderOpen}>
              <DrawerContent className="max-h-[85vh] bg-background border-[#2A2340]">
                <DrawerHeader className="sr-only">
                  <DrawerTitle>Refinar ferramenta</DrawerTitle>
                  <DrawerDescription>Painel de criação de ferramenta terapêutica</DrawerDescription>
                </DrawerHeader>
                {builderPanelContent}
              </DrawerContent>
            </Drawer>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
