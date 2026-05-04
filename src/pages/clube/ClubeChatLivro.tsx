import { useState, useRef, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Send, Bot, User, Loader2, BookOpen,
  Save, Hammer, MessageSquareQuote, Footprints, GraduationCap, Sparkles, FlaskConical
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
import { Database } from '@/integrations/supabase/types';
import { Laboratorio8020Modal } from '@/components/clube/Laboratorio8020Modal';

type ClubCycle = any; // Simplificando para evitar erros de tipos no momento da refatoração de DB


interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const PLACEHOLDERS = [
  'Que Porta este trecho abre?',
  'Como isso vira pergunta de sessão?',
  'Qual Torre aparece nesse conto?',
  'Que cuidado ético esse tema exige?',
];

const SYSTEM_PROMPT = `Você é uma interlocutora formativa do Clube de Leitura Oracular, integrada ao Método Orácula.
Seu papel é transformar conteúdo do livro em prática terapêutica simbólica, reflexão e aplicação.

Cada obra funciona como simulador de voo terapêutico. Ajude a aluna a identificar Porta, Campo, Torre e Labirinto.

Toda resposta deve seguir este formato:

## Síntese Simbólica
(Resumo breve do tema trazido pela aluna)

## Campo em Jogo
(Qual clima psíquico ou simbólico pode estar presente. Use linguagem de hipótese como "pode indicar", "pode sugerir")

## Cartografia Possível
- Porta: (hipótese)
- Campo: (hipótese)
- Torre: (hipótese)
- Labirinto: (hipótese)

## Aplicação Prática
- **Uso Pessoal:** ...
- **Uso em Sessão:** ...
- **Uso em Grupo/Círculo:** ...

## Pergunta Terapêutica
(Gere 1 a 3 perguntas terapêuticas)

## Limite Ético
(Indicar quando NÃO usar ou quando ter cautela. Não diagnostique, não dê respostas fechadas)

Importante: Não substitua supervisão clínica. Não reproduza trechos longos.`;

import { useRotaOracular } from '@/hooks/useRotaOracular';
import { useEssencia8020 } from '@/hooks/useEssencia8020';
import { useAllBooks } from '@/hooks/useBooks';

export default function ClubeChatLivro() {
  const { estacaoAtual, pontoAtual } = useRotaOracular();
  const navigate = useNavigate();
  const { user } = useAuth();
  const qc = useQueryClient();
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: allBooksData = [] } = useAllBooks();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [placeholder] = useState(() => PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]);

  // Builder panel state
  const [builderOpen, setBuilderOpen] = useState(false);
  const [builderTipo, setBuilderTipo] = useState('');
  const [builderContent, setBuilderContent] = useState('');

  const { data: cycle } = useQuery({
    queryKey: ['club-active-cycle-chat'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_v2_ciclos' as any)
        .select('*, chat_prompt, chat_knowledge_base, clube_v2_obras(*)')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  const book = (cycle as any)?.clube_v2_obras?.[0];
  const matchedBook = allBooksData.find(b => b.title === book?.titulo);
  const { data: essencia } = useEssencia8020(matchedBook?.id);

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

  const { data: limitData } = useQuery({
    queryKey: ['chat-limit', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('clube_daily_interaction_limits' as any)
        .select('*')
        .eq('user_id', user.id)
        .eq('date', new Date().toISOString().split('T')[0])
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    // Check limit
    if (limitData && (limitData as any).interactions_used >= (limitData as any).interactions_limit) {
      toast.error('Limite diário alcançado. A leitura também precisa de silêncio.');
      return;
    }

    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const bookContext = book
        ? `Livro atual: ${book.title} de ${book.author || 'autor desconhecido'}. Descrição: ${book.description || ''}.`
        : '';
      
      const cycleContext = cycle 
        ? `Conhecimento específico do ciclo: ${(cycle as any).chat_knowledge_base || ''}`
        : '';

      const essenciaContext = essencia ? `
Laboratório 80/20 da Obra:
- 1. Núcleo Vivo: ${essencia.nucleo_vivo}
- 2. Tensão Central: ${essencia.tensao_central}
- 3. Imagem Organizadora: ${essencia.imagem_organizadora}
- 4. Aplicação Terapêutica: ${essencia.aplicacao_terapeutica}
- 5. Distorção Comum: ${essencia.distorcao_comum}
- 6. Perguntas Clínicas: ${essencia.perguntas_clinicas?.join(', ')}
- 7. Exercício Integrativo: ${essencia.exercicio}
- Resumo Premium: ${essencia.resumo_premium}
` : '';

      const { data, error } = await supabase.functions.invoke('syntheia-chat', {
        body: {
          messages: [...messages.filter(m => m.id !== 'welcome'), userMsg].map(m => ({
            role: m.role,
            content: m.content,
          })),
          systemPrompt: ((cycle as any).chat_prompt || SYSTEM_PROMPT) + '\n\n' + cycleContext + '\n\n' + essenciaContext + '\n\nContexto do livro: ' + bookContext,
          agentSlug: 'clube-livro',
        },
      });

      if (error) throw error;

      const responseContent = data?.content || data?.message || 'Não consegui processar. Tente novamente.';

      // Log interaction and update limit
      await supabase.from('clube_livro_chat_interactions').insert({
        user_id: user?.id,
        book_id: book?.id,
        cycle_id: (cycle as any)?.id,
        message: userMsg.content,
        response: responseContent,
      } as any);

      // Upsert limit
      const today = new Date().toISOString().split('T')[0];
      await supabase.from('clube_daily_interaction_limits').upsert({
        user_id: user?.id,
        date: today,
        interactions_used: ((limitData as any)?.interactions_used || 0) + 1,
        interactions_limit: (limitData as any)?.interactions_limit || 10,
        plan_type: user?.portal === 'admin' ? 'admin' : 'basico',
      } as any, { onConflict: 'user_id, date' });

      qc.invalidateQueries({ queryKey: ['chat-limit'] });

      setMessages(prev => [...prev, {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: responseContent,
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

  const saveAction = useMutation({
    mutationFn: async (tool: any) => {
      if (!user) return;
      
      const payload = {
        user_id: user.id,
        book_id: book?.id,
        cycle_id: (cycle as any)?.id,
        interaction_type: builderTipo,
        message: messages[messages.length - 2]?.content || '',
        response: builderContent,
        metadata: { ...tool, plan: (limitData as any)?.plan_type }
      };

      if (builderTipo === 'registro_jardim') {
        const { error } = await supabase.from('clube_livro_chat_interactions').update({
          saved_to_jardim: true
        } as any).eq('user_id', user.id).order('created_at', { ascending: false }).limit(1);
        if (error) throw error;
      } else if (builderTipo === 'ferramenta_forja') {
        const { error } = await supabase.from('clube_v2_ferramentas').insert({
          user_id: user.id,
          obra_id: book?.id,
          tipo: tool.tipo,
          config: tool
        } as any);
        if (error) throw error;
      }
      
      // Atualiza a interação original
      await supabase.from('clube_livro_chat_interactions').update({
        [builderTipo === 'registro_jardim' ? 'saved_to_jardim' : 'sent_to_forja']: true
      } as any).match({ user_id: user.id }).order('created_at', { ascending: false }).limit(1);
    },

    onSuccess: () => {
      toast.success('Ação realizada com sucesso!');
      setBuilderOpen(false);
    },
    onError: () => toast.error('Erro ao processar ação'),
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const ACTION_BUTTONS = [
    { tipo: 'registro_jardim', label: 'Salvar no Jardim', icon: Save },
    { tipo: 'ferramenta_forja', label: 'Enviar para Forja', icon: Hammer },
    { tipo: 'pratica_ciclo', label: 'Criar prática', icon: Footprints },
    { tipo: 'treinamento', label: 'Usar em treinamento', icon: GraduationCap },
  ];

  // Builder panel content (shared between drawer and side panel)
  const builderPanelContent = builderOpen ? (
    <ToolBuilderPanel
      tipo={builderTipo}
      content={builderContent}
      onSave={(tool) => saveAction.mutate(tool)}
      onSaveDraft={(tool) => {
        saveAction.mutate(tool);
      }}
      onClose={() => setBuilderOpen(false)}
      isSaving={saveAction.isPending}
    />
  ) : null;

  return (
    <AppLayout>
      <div className="min-h-screen flex flex-col bg-background">
        {/* ── HEADER ── */}
        <div className="sticky top-0 z-20 border-b border-[#2A2340] bg-background/95 backdrop-blur-sm">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/clube/ciclo')} className="h-10 w-10 shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-4">
                {(estacaoAtual?.livro_capa_url || book?.cover_url) ? (
                  <img src={estacaoAtual?.livro_capa_url || book?.cover_url} alt={estacaoAtual?.livro_titulo || book?.title} className="w-12 h-16 object-cover rounded shadow-lg border border-white/10" />
                ) : (
                  <div className="w-12 h-16 bg-muted/50 rounded flex items-center justify-center border border-white/5">
                    <BookOpen className="w-6 h-6 text-muted-foreground opacity-20" />
                  </div>
                )}
                <div>
                  <h1 className="text-lg font-serif text-foreground leading-tight flex items-center gap-2">
                    {estacaoAtual?.livro_titulo || book?.title || 'Converse com o Livro'}
                  </h1>
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-gold font-medium uppercase tracking-wider">
                      {estacaoAtual?.livro_autor || book?.author}
                    </p>
                    {matchedBook && (
                      <Laboratorio8020Modal 
                        bookId={matchedBook.id} 
                        bookTitle={matchedBook.title}
                        trigger={
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 px-2 text-[10px] gap-1 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 rounded-full"
                          >
                            <FlaskConical className="w-3 h-3" />
                            Laboratório 80/20
                          </Button>
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-widest font-semibold text-muted-foreground bg-[#13101C]/50 px-4 py-2 rounded-full border border-white/5">
              <div className="flex items-center gap-1.5">
                <span className="text-gold opacity-50">Estação:</span> {estacaoAtual?.titulo || '...'}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-gold opacity-50">Rota:</span> {pontoAtual?.nome || '...'}
              </div>
              {limitData && (
                <div className={cn(
                  "flex items-center gap-1.5",
                  (limitData as any).interactions_used >= (limitData as any).interactions_limit - 3 ? "text-amber-500" : "text-emerald-500"
                )}>
                  <Sparkles className="w-3 h-3" />
                  {(limitData as any).interactions_used}/{(limitData as any).interactions_limit} DIÁRIOS
                </div>
              )}
            </div>
          </div>
          
          {/* Cartografia Bar */}
          {pontoAtual && (
            <div className="bg-gold/5 border-t border-gold/10 py-1.5">
              <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-6 overflow-x-auto no-scrollbar">
                {[
                  { label: 'Porta', value: pontoAtual.porta || '...' },
                  { label: 'Campo', value: pontoAtual.campo || '...' },
                  { label: 'Torre', value: pontoAtual.torre || '...' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2 shrink-0">
                    <span className="text-[8px] font-bold text-gold/40 uppercase tracking-tighter">{item.label}</span>
                    <span className="text-[10px] text-foreground/80 font-serif italic">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── MAIN ── */}
        <div className="flex-1 flex max-w-[1440px] mx-auto w-full overflow-hidden">
          {/* ── SUGGESTIONS COLUMN (desktop) ── */}
          {!isMobile && (
            <div className="w-64 border-r border-[#2A2340] p-6 space-y-8 overflow-y-auto hidden lg:block">
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gold/60">Cartografia</h4>
                <div className="flex flex-col gap-2">
                  {["Que Porta este trecho abre?", "Qual Torre aparece nesse conto?", "Que Labirinto essa personagem repete?"].map(q => (
                    <Button key={q} variant="ghost" className="justify-start text-left text-xs h-auto py-2 px-3 bg-white/5 hover:bg-gold/10 hover:text-gold" onClick={() => setInput(q)}>
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-500/60">Prática</h4>
                <div className="flex flex-col gap-2">
                  {["Como isso vira pergunta de sessão?", "Como aplicar isso em um grupo?", "Que prática simples posso propor?"].map(q => (
                    <Button key={q} variant="ghost" className="justify-start text-left text-xs h-auto py-2 px-3 bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-500" onClick={() => setInput(q)}>
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-red-500/60">Ética</h4>
                <div className="flex flex-col gap-2">
                  {["Qual cuidado ético esse tema exige?", "Como evitar interpretação invasiva?"].map(q => (
                    <Button key={q} variant="ghost" className="justify-start text-left text-xs h-auto py-2 px-3 bg-white/5 hover:bg-red-500/10 hover:text-red-500" onClick={() => setInput(q)}>
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── CHAT COLUMN ── */}
          <div className={cn(
            'flex flex-col flex-1 min-w-0 bg-[#0F0D15]',
            !isMobile && builderOpen ? 'lg:max-w-[40%] xl:max-w-[50%]' : 'max-w-full'
          )}>
            {/* Messages */}
            <ScrollArea className="flex-1 px-4 sm:px-6 py-6" ref={scrollRef}>
              <div className="space-y-8 max-w-3xl mx-auto">
                {messages.map((msg) => (
                  <div key={msg.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {/* User message */}
                    {msg.role === 'user' && (
                      <div className="flex justify-end">
                        <div className="flex items-start gap-3 flex-row-reverse max-w-[85%]">
                          <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center flex-shrink-0 mt-1 shadow-inner border border-gold/10">
                            <User className="w-4 h-4" />
                          </div>
                          <div className="bg-gold/10 border border-gold/20 rounded-2xl rounded-tr-sm px-5 py-4 shadow-xl">
                            <p className="text-sm text-foreground leading-relaxed selection:bg-gold/30">{msg.content}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Assistant message — structured blocks */}
                    {msg.role === 'assistant' && (
                      <div className="flex items-start gap-3 max-w-[95%]">
                        <div className="w-8 h-8 rounded-full bg-[#1A1625] text-gold flex items-center justify-center flex-shrink-0 mt-1 shadow-lg border border-gold/20">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-4">
                          <ChatMessageBlocks content={msg.content} />

                          {/* Action buttons */}
                          {msg.id !== 'welcome' && (
                            <div className="flex flex-wrap gap-2 pt-2">
                              {ACTION_BUTTONS.map(btn => {
                                const Icon = btn.icon;
                                return (
                                  <Button
                                    key={btn.tipo}
                                    variant="outline"
                                    size="sm"
                                    className="h-9 text-[11px] bg-[#1A1625]/50 border-white/5 text-muted-foreground hover:text-gold hover:border-gold/30 hover:bg-gold/5 rounded-full transition-all duration-300"
                                    onClick={() => openBuilder(btn.tipo, msg.content)}
                                  >
                                    <Icon className="w-3.5 h-3.5 mr-2" />
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
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1A1625] text-gold flex items-center justify-center flex-shrink-0 border border-gold/20">
                      <Bot className="w-4 h-4 animate-pulse" />
                    </div>
                    <div className="bg-[#1A1625]/50 border border-white/5 rounded-2xl rounded-tl-sm px-6 py-4">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-gold/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-gold/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Mobile Suggestions Carousel */}
            {isMobile && (
              <div className="px-4 py-2 border-t border-[#2A2340] bg-background/50 overflow-x-auto">
                <div className="flex gap-2 min-w-max pb-1">
                  {["Que Porta este trecho abre?", "Como isso vira pergunta de sessão?", "Qual cuidado ético esse tema exige?"].map(q => (
                    <Button key={q} variant="outline" size="sm" className="h-8 text-[10px] rounded-full bg-white/5 border-white/10" onClick={() => setInput(q)}>
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-[#2A2340] px-4 sm:px-8 py-6 bg-background/95 backdrop-blur-md">
              <div className="max-w-3xl mx-auto flex gap-3 items-end">
                <div className="flex-1 relative">
                  <Textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="min-h-[56px] max-h-48 pt-4 pb-4 px-5 resize-none bg-[#13101C] border-[#2A2340] text-sm placeholder:text-muted-foreground/40 rounded-2xl focus:ring-gold/20 transition-all shadow-inner"
                    disabled={isLoading}
                  />
                  {limitData && (limitData as any).interactions_used >= (limitData as any).interactions_limit - 3 && (
                    <div className="absolute top-[-24px] right-2 text-[10px] text-amber-500 font-bold uppercase tracking-tighter animate-pulse">
                      Atenção: resta(m) {(limitData as any).interactions_limit - (limitData as any).interactions_used} uso(s) hoje
                    </div>
                  )}
                </div>
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="h-14 w-14 flex-shrink-0 bg-gold text-black hover:bg-gold/80 rounded-2xl shadow-lg transition-transform active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
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
