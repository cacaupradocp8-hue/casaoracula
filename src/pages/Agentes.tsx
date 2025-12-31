import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, MessageSquare, Send, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Agente {
  id: string;
  nome: string;
  descricao: string;
  instrucoes_base: string;
  icone: string;
}

interface Mensagem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface Conversa {
  id: string;
  titulo: string;
  agente_id: string;
}

export default function Agentes() {
  const [agentes, setAgentes] = useState<Agente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAgente, setSelectedAgente] = useState<Agente | null>(null);
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [selectedConversa, setSelectedConversa] = useState<Conversa | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchAgentes();
  }, []);

  const fetchAgentes = async () => {
    const { data, error } = await supabase
      .from('agentes')
      .select('*')
      .order('nome');

    if (error) {
      toast({ title: 'Erro ao carregar agentes', variant: 'destructive' });
    } else {
      setAgentes(data || []);
    }
    setIsLoading(false);
  };

  const openAgente = async (agente: Agente) => {
    setSelectedAgente(agente);
    
    // Buscar conversas existentes
    const { data: conversasData } = await supabase
      .from('agente_conversas')
      .select('*')
      .eq('agente_id', agente.id)
      .order('updated_at', { ascending: false });

    setConversas((conversasData || []) as Conversa[]);
    
    // Se não tem conversa, criar uma nova
    if (!conversasData || conversasData.length === 0) {
      await startNewConversa(agente.id);
    } else {
      await loadConversa(conversasData[0] as Conversa);
    }
  };

  const startNewConversa = async (agenteId: string) => {
    const { data, error } = await supabase
      .from('agente_conversas')
      .insert({ agente_id: agenteId, user_id: user?.id, titulo: 'Nova conversa' })
      .select()
      .single();

    if (data) {
      setSelectedConversa(data as Conversa);
      setMensagens([]);
      setConversas(prev => [data as Conversa, ...prev]);
    }
  };

  const loadConversa = async (conversa: Conversa) => {
    setSelectedConversa(conversa);
    
    const { data } = await supabase
      .from('agente_mensagens')
      .select('*')
      .eq('conversa_id', conversa.id)
      .order('created_at');

    setMensagens((data || []) as Mensagem[]);
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedConversa || !selectedAgente) return;

    const userMessage = input.trim();
    setInput('');
    setSending(true);

    // Adicionar mensagem do usuário
    const { data: userMsgData } = await supabase
      .from('agente_mensagens')
      .insert({
        conversa_id: selectedConversa.id,
        role: 'user',
        content: userMessage,
      })
      .select()
      .single();

    if (userMsgData) {
      setMensagens(prev => [...prev, userMsgData as Mensagem]);
    }

    // Simular resposta do agente (MVP - mock)
    setTimeout(async () => {
      const mockResponses = [
        `Obrigado por compartilhar isso comigo. ${selectedAgente.nome} está aqui para te ajudar a refletir sobre esse ponto.`,
        `Essa é uma questão importante. Vamos explorar juntas o que isso significa para você e sua prática.`,
        `Interessante perspectiva. Como você se sente ao olhar para isso de um novo ângulo?`,
        `Agradeço sua confiança. Lembre-se: não há respostas erradas, apenas caminhos a serem explorados.`,
      ];
      
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

      const { data: assistantMsgData } = await supabase
        .from('agente_mensagens')
        .insert({
          conversa_id: selectedConversa.id,
          role: 'assistant',
          content: randomResponse,
        })
        .select()
        .single();

      if (assistantMsgData) {
        setMensagens(prev => [...prev, assistantMsgData as Mensagem]);
      }
      setSending(false);
    }, 1500);
  };

  const goBack = () => {
    setSelectedAgente(null);
    setSelectedConversa(null);
    setMensagens([]);
  };

  if (selectedAgente) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 pb-20">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={goBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-display text-gold">{selectedAgente.nome}</h1>
              <p className="text-sm text-muted-foreground">{selectedAgente.descricao}</p>
            </div>
          </div>

          <Card className="glass h-[60vh] flex flex-col">
            <ScrollArea className="flex-1 p-4">
              {mensagens.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <p>Inicie uma conversa com {selectedAgente.nome}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mensagens.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          msg.role === 'user'
                            ? 'bg-gold/20 text-foreground'
                            : 'bg-secondary text-foreground'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {sending && (
                    <div className="flex justify-start">
                      <div className="bg-secondary rounded-lg px-4 py-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="min-h-[44px] max-h-32"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <Button onClick={sendMessage} disabled={sending || !input.trim()} variant="gold">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <SectionHeader
          title="Agentes da Casa (IA)"
          subtitle="Assistentes inteligentes para apoiar sua jornada"
          icon={<Bot className="w-5 h-5" />}
          className="mb-8"
        />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : agentes.length === 0 ? (
          <Card className="glass p-8 text-center">
            <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Nenhum agente disponível no momento.</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {agentes.map(agente => (
              <Card key={agente.id} className="glass hover:border-gold/50 transition-colors cursor-pointer" onClick={() => openAgente(agente)}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center mb-2">
                    <Bot className="w-6 h-6 text-gold" />
                  </div>
                  <CardTitle className="text-lg">{agente.nome}</CardTitle>
                  <CardDescription>{agente.descricao}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full gap-2">
                    <MessageSquare className="w-4 h-4" /> Abrir Chat
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
