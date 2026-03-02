import { useState, useRef, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSettings } from '@/hooks/useAppSettings';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import {
  MessageCircle,
  Send,
  Loader2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Headphones,
} from 'lucide-react';

const AGENT_ID = 'a0000000-0000-0000-0000-000000000001';

const SUGGESTIONS = [
  'Como começar?',
  'Onde vejo meu plano?',
  'Como acessar o Portal Atual?',
  'Como funciona o Laboratório?',
  'Preciso de ajuda com pagamento',
];

const PAYMENT_KEYWORDS = [
  'pagamento', 'assinatura', 'cartão', 'renovação', 'reembolso',
  'erro de acesso', 'cobran', 'cancelar', 'cancelamento', 'plano',
  'fatura', 'boleto', 'pix',
];

const FAQ_ITEMS = [
  {
    q: 'Como começo a usar o app?',
    a: 'Acesse "Comece por Aqui" no menu. Lá você encontra a jornada inicial: Quiz → Big5 → Travessia de 7 dias → Aula Habitar a Casa.',
  },
  {
    q: 'Onde vejo meu plano atual?',
    a: 'Acesse "Minha Conta" no menu. Lá você vê seu status (Gratuito ou Assinante), plano ativo e opções de upgrade.',
  },
  {
    q: 'Como acesso o Portal Atual?',
    a: 'Se você é assinante, o "Portal Atual" aparece no menu principal. É o seu ponto de partida para a travessia do mês.',
  },
  {
    q: 'Posso cancelar minha assinatura?',
    a: 'Sim. Acesse "Minha Conta" → "Gerenciar Assinatura". Se precisar de ajuda, fale conosco pelo WhatsApp.',
  },
  {
    q: 'O que é o Laboratório 80/20?',
    a: 'É uma ferramenta que extrai a essência de cada Portal e transforma em aplicação prática para sessão, aula, círculo ou palestra.',
  },
  {
    q: 'Meu acesso não está funcionando, o que faço?',
    a: 'Tente sair e entrar novamente. Se o problema persistir, fale diretamente com o suporte via WhatsApp para resolvermos juntas.',
  },
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Suporte() {
  const { user } = useAuth();
  const { getSetting } = useAppSettings();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showWhatsappCta, setShowWhatsappCta] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const whatsappUrl = getSetting('support_whatsapp_url', '');

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const detectPaymentTopic = (text: string): boolean => {
    const lower = text.toLowerCase();
    return PAYMENT_KEYWORDS.some(kw => lower.includes(kw));
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    // Check for payment keywords
    if (detectPaymentTopic(text)) {
      setShowWhatsappCta(true);
    }

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: newMessages,
          context: {
            agentId: AGENT_ID,
            userId: user?.id,
            contextType: 'suporte',
          },
        },
      });

      if (error) throw error;

      const assistantContent = data?.content || 'Desculpe, não consegui processar sua pergunta. Tente novamente.';

      // Check AI response for payment routing too
      if (detectPaymentTopic(assistantContent)) {
        setShowWhatsappCta(true);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: assistantContent }]);
    } catch (err) {
      console.error('Support chat error:', err);
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
            <Headphones className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold">Central de Suporte</h1>
          <p className="text-sm text-muted-foreground">Tire suas dúvidas ou fale com o suporte.</p>
        </div>

        {/* ─── BLOCO 1: Chat IA ─── */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-lg font-display font-semibold flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Resolver agora com a Guardiã
            </h2>

            {/* Suggestions */}
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-border bg-secondary/50 hover:bg-secondary text-foreground transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Messages */}
            {messages.length > 0 && (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-secondary text-foreground rounded-bl-md'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:m-0 [&>ul]:mt-1 [&>ol]:mt-1">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-2.5">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}

            {/* WhatsApp CTA inline */}
            {showWhatsappCta && whatsappUrl && (
              <div className="bg-accent/30 border border-accent/50 rounded-lg p-3 flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-accent-foreground shrink-0" />
                <div className="flex-1 text-sm">
                  Para questões de pagamento ou acesso, fale diretamente pelo WhatsApp.
                </div>
                <Button size="sm" variant="default" onClick={() => window.open(whatsappUrl, '_blank')}>
                  Abrir
                </Button>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Digite sua dúvida…"
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* ─── BLOCO 2: WhatsApp ─── */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <h2 className="text-lg font-display font-semibold">Falar no WhatsApp</h2>
            <p className="text-sm text-muted-foreground">
              Para dúvidas de acesso, pagamento e suporte técnico.
            </p>
            <Button
              className="w-full"
              size="lg"
              onClick={() => window.open(whatsappUrl || 'https://wa.me/5511999999999', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir WhatsApp
            </Button>
          </CardContent>
        </Card>

        {/* ─── BLOCO 3: FAQ ─── */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <h2 className="text-lg font-display font-semibold flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              Problemas comuns
            </h2>
            <div className="divide-y divide-border">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between py-3 text-sm font-medium text-left hover:text-primary transition-colors"
                  >
                    {item.q}
                    {openFaq === i ? (
                      <ChevronUp className="w-4 h-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                  {openFaq === i && (
                    <p className="text-sm text-muted-foreground pb-3 pl-1">
                      {item.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
