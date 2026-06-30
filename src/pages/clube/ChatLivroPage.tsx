import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Loader2, BookOpen, Sparkles, Heart, Users, Compass, Feather, Leaf, Flame, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AppLayout } from '@/components/layout/AppLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { sendMessageToSyntheia } from '@/services/syntheiaChat';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const LIMITE_SEMANAL = 3;
const INTERACTION_TYPE = 'mesa_da_obra';

type Categoria = {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  perguntas: string[];
};

const CATEGORIAS: Categoria[] = [
  {
    key: 'sobre_mim',
    label: 'Sobre mim',
    icon: Feather,
    perguntas: [
      'Há um trecho desta obra que continua ecoando em mim. O que ele pode estar pedindo para ser visto?',
      'Uma imagem do livro tocou algo que ainda não tem nome em mim. Como me aproximar?',
    ],
  },
  {
    key: 'sobre_cliente',
    label: 'Sobre uma cliente',
    icon: Users,
    perguntas: [
      'Lembrei de uma cena clínica enquanto lia. Como observá-la pelo eixo simbólico desta obra, sem interpretar a cliente?',
      'Há uma escuta em curso que dialoga com este livro. Que pergunta-mãe a obra me oferece?',
    ],
  },
  {
    key: 'sobre_simbolo',
    label: 'Sobre um símbolo',
    icon: Sparkles,
    perguntas: [
      'Um símbolo desta obra continua aparecendo. Como amplio a escuta dele sem traduzir cedo demais?',
      'Quero observar uma imagem do livro sem reduzi-la a conceito. Por onde começo?',
    ],
  },
  {
    key: 'sobre_pratica',
    label: 'Sobre a prática clínica',
    icon: Compass,
    perguntas: [
      'Como esse eixo simbólico se aplica em sessão individual, sem virar interpretação?',
      'Como essa obra pode sustentar uma escuta em grupo terapêutico ou círculo?',
    ],
  },
  {
    key: 'sobre_capitulo',
    label: 'Sobre este capítulo',
    icon: BookOpen,
    perguntas: [
      'Um capítulo desta obra ficou habitando em mim. Que campo ele abre para a leitura simbólica?',
      'Há uma passagem que me parou. Como olhar essa pausa como pista clínica?',
    ],
  },
];

type Estado = 'indice' | 'estudo';

export default function ChatLivroPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [params] = useSearchParams();
  const obra = params.get('obra') || 'Mulheres que Correm com os Lobos';
  const capa = params.get('capa') || '/capa-mulheres-lobos.webp';
  const rota = params.get('rota') || undefined;

  const [estado, setEstado] = useState<Estado>('indice');
  const [perguntaAtiva, setPerguntaAtiva] = useState<string | null>(null);
  const [respostaObra, setRespostaObra] = useState<string>('');
  const [carregando, setCarregando] = useState(false);
  const [usadosSemana, setUsadosSemana] = useState<number>(0);
  const [carregandoLimite, setCarregandoLimite] = useState(true);

  // Sortear 1 pergunta por categoria por visita
  const perguntasDestaque = useMemo(() => {
    return CATEGORIAS.map(c => ({
      ...c,
      pergunta: c.perguntas[Math.floor(Math.random() * c.perguntas.length)],
    }));
  }, []);

  const restantes = Math.max(0, LIMITE_SEMANAL - usadosSemana);

  useEffect(() => {
    if (!user) return;
    const carregar = async () => {
      const seteDiasAtras = new Date();
      seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
      const { count } = await supabase
        .from('clube_livro_chat_interactions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('interaction_type', INTERACTION_TYPE)
        .gte('created_at', seteDiasAtras.toISOString());
      setUsadosSemana(count || 0);
      setCarregandoLimite(false);
    };
    carregar();
  }, [user]);

  const abrirEstudo = async (pergunta: string) => {
    if (!user) {
      toast({ title: 'Acesso restrito', description: 'Entre para abrir a Mesa da Obra.', variant: 'destructive' });
      return;
    }
    if (restantes <= 0) {
      toast({ title: 'Limite semanal atingido', description: 'Esta semana você já abriu 3 diálogos. Volte na próxima semana.', variant: 'destructive' });
      return;
    }

    setPerguntaAtiva(pergunta);
    setEstado('estudo');
    setRespostaObra('');
    setCarregando(true);

    try {
      const resp = await sendMessageToSyntheia(
        'converse_com_livro',
        [{ role: 'user', content: pergunta }],
        { obra, rota },
      );
      setRespostaObra(resp.message.content);

      await supabase.from('clube_livro_chat_interactions').insert({
        user_id: user.id,
        message: pergunta,
        response: resp.message.content,
        interaction_type: INTERACTION_TYPE,
        metadata: { obra, rota },
      });
      setUsadosSemana(prev => prev + 1);
    } catch (err) {
      console.error('[MesaDaObra]', err);
      toast({ title: 'A obra está em silêncio', description: 'Não foi possível abrir a página de estudo agora.', variant: 'destructive' });
      setEstado('indice');
    } finally {
      setCarregando(false);
    }
  };

  const registrarJardim = async (tipo: 'psique' | 'oficio') => {
    if (!user || !perguntaAtiva) return;
    const corpo = `Pergunta: ${perguntaAtiva}\n\nA Voz da Obra:\n${respostaObra}`;
    const { error } = tipo === 'psique'
      ? await supabase.from('jardim_psique_registros').insert({
          user_id: user.id,
          titulo: `Mesa da Obra — ${obra}`,
          ferramenta_chave: 'mesa_da_obra',
          ferramenta_nome: 'Mesa da Obra',
          fonte: 'clube_livro',
          reflexao_pessoal: corpo,
          conteudo: { obra, pergunta: perguntaAtiva, resposta: respostaObra },
        })
      : await supabase.from('jardim_do_oficio').insert({
          user_id: user.id,
          contexto_origem: `Mesa da Obra — ${obra}`,
          reflexao_profissional: corpo,
        });
    if (error) {
      toast({ title: 'Não foi possível registrar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: tipo === 'psique' ? 'Registrado no Jardim da Psique' : 'Registrado no Jardim do Ofício' });
    }
  };

  const voltarIndice = () => {
    setEstado('indice');
    setPerguntaAtiva(null);
    setRespostaObra('');
  };

  // ---------- RENDER: ÍNDICE (Mesa da Obra) ----------
  if (estado === 'indice') {
    return (
      <AppLayout>
        <div className="min-h-screen bg-background">
          <div className="max-w-3xl mx-auto px-4 py-10">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6 text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" /> voltar
            </Button>

            {/* Cabeçalho editorial */}
            <header className="text-center mb-12">
              <img src={capa} alt={obra} className="w-32 h-auto mx-auto rounded-sm shadow-2xl mb-8" />
              <h1 className="font-serif text-4xl md:text-5xl text-foreground tracking-wide mb-2">Mesa da Obra</h1>
              <p className="font-serif italic text-muted-foreground text-lg mb-1">{obra}</p>
              <div className="w-16 h-px bg-gold/40 mx-auto my-8" />
              <div className="font-serif text-foreground/85 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
                <p className="italic">
                  Algumas perguntas pedem companhia na leitura.
                </p>
              </div>

            </header>

            {/* Limite semanal — discreto */}
            <div className="text-center mb-12 text-sm text-muted-foreground">
              {carregandoLimite ? (
                <span className="opacity-50">·</span>
              ) : (
                <>
                  Esta semana você pode abrir até {LIMITE_SEMANAL} diálogos. Restam:{' '}
                  <span className="tracking-widest text-gold ml-1">
                    {'●'.repeat(restantes)}{'○'.repeat(LIMITE_SEMANAL - restantes)}
                  </span>
                </>
              )}
            </div>

            {/* Perguntas em destaque — coluna editorial */}
            <div className="space-y-6">
              {perguntasDestaque.map(cat => {
                const Icon = cat.icon;
                return (
                  <Card
                    key={cat.key}
                    onClick={() => abrirEstudo(cat.pergunta)}
                    className={cn(
                      'p-6 md:p-8 cursor-pointer transition-all border-border/40 bg-card/40 hover:bg-card/70 hover:border-gold/40 group',
                      restantes <= 0 && 'opacity-50 cursor-not-allowed',
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <Icon className="w-5 h-5 text-gold/70 mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
                          {cat.label}
                        </div>
                        <p className="font-serif text-lg md:text-xl text-foreground/90 leading-relaxed group-hover:text-gold transition-colors">
                          "{cat.pergunta}"
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // ---------- RENDER: PÁGINA DE ESTUDO ----------
  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <Button variant="ghost" size="sm" onClick={voltarIndice} className="mb-8 text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> voltar ao índice
          </Button>

          {/* A pergunta */}
          <section className="mb-12">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">A pergunta</div>
            <blockquote className="font-serif text-2xl md:text-3xl text-foreground leading-snug border-l-2 border-gold/50 pl-6">
              "{perguntaAtiva}"
            </blockquote>
          </section>

          <div className="w-16 h-px bg-gold/30 mx-auto my-10" />

          {/* A obra responde */}
          <section className="mb-12">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">A Voz da Obra</div>
            {carregando ? (
              <div className="flex items-center gap-3 text-muted-foreground py-12">
                <Loader2 className="w-5 h-5 animate-spin text-gold" />
                <span className="font-serif italic">a obra está respondendo…</span>
              </div>
            ) : (
              <div className="font-serif text-foreground/90 text-lg leading-loose whitespace-pre-wrap">
                {respostaObra}
              </div>
            )}
          </section>

          {/* CTAs finais */}
          {!carregando && respostaObra && (
            <>
              <div className="w-16 h-px bg-gold/30 mx-auto my-10" />
              <section className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-3 py-6 border-gold/30 hover:border-gold hover:bg-gold/5" onClick={() => registrarJardim('psique')}>
                  <Leaf className="w-4 h-4 text-gold" /> Registrar no Jardim da Psique
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 py-6 border-gold/30 hover:border-gold hover:bg-gold/5" onClick={() => registrarJardim('oficio')}>
                  <Flame className="w-4 h-4 text-gold" /> Registrar no Jardim do Ofício
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 py-6 text-muted-foreground hover:text-foreground" onClick={voltarIndice}>
                  <RefreshCw className="w-4 h-4" /> Escolher outra pergunta
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 py-6 text-muted-foreground hover:text-foreground" onClick={() => navigate(-1)}>
                  <X className="w-4 h-4" /> Encerrar por hoje
                </Button>
              </section>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
