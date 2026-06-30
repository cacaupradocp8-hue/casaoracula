import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Loader2, RefreshCw, X, Leaf, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/AppLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { sendMessageToSyntheia } from '@/services/syntheiaChat';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { trackLearningEvent } from '@/services/studentTrackingService';

const LIMITE_SEMANAL = 3;
const INTERACTION_TYPE = 'mesa_da_obra';

type Porta = {
  key: string;
  emoji: string;
  label: string;
  fallback: string;
};

// 7 Portas de Investigação — Convite da Semana primeiro (destaque editorial)
const PORTAS: Porta[] = [
  { key: 'pergunta_semana',emoji: '🌙', label: 'O Convite da Semana',     fallback: 'Que pergunta esta obra está fazendo a você nesta semana?' },
  { key: 'sobre_voce',     emoji: '🌿', label: 'Sobre você',              fallback: 'O que continua tentando permanecer vivo em mim?' },
  { key: 'sobre_cliente',  emoji: '🐺', label: 'Sobre uma cliente',        fallback: 'Que parte dessa mulher ainda não encontrou linguagem?' },
  { key: 'sobre_capitulo', emoji: '📖', label: 'Sobre o capítulo',         fallback: 'Por que Clarissa escolheu contar esta história?' },
  { key: 'sobre_simbolo',  emoji: '🦴', label: 'Sobre um símbolo',         fallback: 'O que os ossos preservam?' },
  { key: 'sobre_pratica',  emoji: '🌙', label: 'Sobre a prática clínica', fallback: 'Como esta narrativa muda minha forma de escutar?' },
  { key: 'sobre_oficio',   emoji: '🌿', label: 'Sobre o ofício',           fallback: 'O que esta obra me pede como facilitadora?' },
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
  const [labelAtiva, setLabelAtiva] = useState<string>('');
  const [respostaObra, setRespostaObra] = useState<string>('');
  const [carregando, setCarregando] = useState(false);
  const [usadosSemana, setUsadosSemana] = useState<number>(0);
  const [carregandoLimite, setCarregandoLimite] = useState(true);
  const [sugestoesDB, setSugestoesDB] = useState<Record<string, string[]>>({});

  const restantes = Math.max(0, LIMITE_SEMANAL - usadosSemana);

  useEffect(() => {
    const carregarSugestoes = async () => {
      const { data } = await supabase
        .from('espelho_conto_sugestoes')
        .select('categoria, pergunta')
        .eq('ativa', true)
        .order('ordem', { ascending: true });
      if (data) {
        const map: Record<string, string[]> = {};
        for (const row of data as Array<{ categoria: string; pergunta: string }>) {
          if (!map[row.categoria]) map[row.categoria] = [];
          map[row.categoria].push(row.pergunta);
        }
        setSugestoesDB(map);
      }
    };
    carregarSugestoes();
  }, []);

  useEffect(() => {
    if (!user) { setCarregandoLimite(false); return; }
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

  // Para cada porta, escolher 1 pergunta — do DB se houver, senão fallback.
  // Rotação por dia da semana para a obra parecer "viva".
  const portasDoDia = useMemo(() => {
    const diaIdx = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    return PORTAS.map(p => {
      const lista = sugestoesDB[p.key];
      const pergunta = lista && lista.length > 0
        ? lista[diaIdx % lista.length]
        : p.fallback;
      return { ...p, pergunta };
    });
  }, [sugestoesDB]);

  const abrirEstudo = async (porta: typeof portasDoDia[number]) => {
    if (!user) {
      toast({ title: 'Acesso restrito', description: 'Entre para abrir a Mesa da Obra.', variant: 'destructive' });
      return;
    }
    if (restantes <= 0) {
      toast({ title: 'Limite semanal atingido', description: 'Esta semana você já atravessou 3 portas. Volte na próxima semana.', variant: 'destructive' });
      return;
    }

    setPerguntaAtiva(porta.pergunta);
    setLabelAtiva(`${porta.emoji} ${porta.label}`);
    setEstado('estudo');
    setRespostaObra('');
    setCarregando(true);

    try {
      const resp = await sendMessageToSyntheia(
        'converse_com_livro',
        [{ role: 'user', content: porta.pergunta }],
        { obra, rota, porta: porta.key },
      );
      setRespostaObra(resp.message.content);

      await supabase.from('clube_livro_chat_interactions').insert({
        user_id: user.id,
        message: porta.pergunta,
        response: resp.message.content,
        interaction_type: INTERACTION_TYPE,
        metadata: { obra, rota, porta: porta.key },
      });
      setUsadosSemana(prev => prev + 1);
    } catch (err) {
      console.error('[MesaDaObra]', err);
      toast({ title: 'A obra está em silêncio', description: 'Não foi possível abrir a investigação agora.', variant: 'destructive' });
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

  // ---------- ÍNDICE ----------
  if (estado === 'indice') {
    return (
      <AppLayout>
        <div className="min-h-screen bg-background">
          <div className="max-w-3xl mx-auto px-4 py-10">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6 text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" /> voltar
            </Button>

            <header className="text-center mb-16">
              <img src={capa} alt={obra} className="w-28 h-auto mx-auto rounded-sm shadow-2xl mb-10 opacity-90" />
              <h1 className="font-serif text-4xl md:text-5xl text-foreground tracking-wide mb-3">Mesa da Obra</h1>
              <p className="font-serif italic text-muted-foreground text-base">{obra}</p>
              <div className="w-12 h-px bg-gold/40 mx-auto my-10" />
              <div className="font-serif text-foreground/85 max-w-xl mx-auto">
                <p className="italic text-foreground/75 text-xl md:text-2xl leading-loose mb-12">
                  Algumas perguntas não pedem respostas rápidas.
                  <br />
                  <span className="text-foreground/60">Pedem companhia na leitura.</span>
                </p>

                <p className="text-lg md:text-xl leading-loose mb-10">
                  Hoje você volta a se sentar diante de
                  <br />
                  <em className="text-foreground">{obra}</em>.
                </p>

                <p className="text-lg md:text-xl leading-loose mb-12">
                  Não para encontrar respostas.
                  <br />
                  <span className="text-foreground/70">
                    Mas para aprender uma nova forma de observar.
                  </span>
                </p>

                <div className="w-8 h-px bg-gold/30 mx-auto mb-12" />

                <p className="text-base md:text-lg leading-loose text-foreground/70 italic">
                  A obra abre algumas portas.
                  <br />
                  Escolha apenas uma.
                  <br />
                  <span className="text-foreground/55">Ela será suficiente por hoje.</span>
                </p>
              </div>
            </header>

            {/* Selo discreto do limite semanal */}
            <div className="text-center mb-16">
              {!carregandoLimite && (
                <>
                  <div className="tracking-[0.5em] text-gold/70 text-sm mb-3" aria-hidden>
                    {'●'.repeat(restantes)}{'○'.repeat(LIMITE_SEMANAL - restantes)}
                  </div>
                  <p className="font-serif italic text-muted-foreground/80 text-sm">
                    {restantes > 0
                      ? (restantes === LIMITE_SEMANAL
                          ? 'Esta semana você pode atravessar até três portas.'
                          : restantes === 1
                            ? 'Resta-lhe apenas mais uma travessia esta semana.'
                            : `Restam-lhe mais ${restantes} travessias esta semana.`)
                      : 'Esta semana a obra já lhe ofereceu três travessias. Volte na próxima.'}
                  </p>
                </>
              )}
            </div>

            {/* Lista editorial das Portas — primeira em destaque tipográfico */}
            <div>
              {portasDoDia.map((porta, idx) => {
                const destaque = idx === 0;
                return (
                  <article
                    key={porta.key}
                    className={cn(
                      'group',
                      destaque ? 'pb-12 mb-10 border-b border-gold/20' : 'py-8 border-b border-border/30 last:border-b-0',
                    )}
                  >
                    <div className={cn('flex items-start', destaque ? 'gap-5' : 'gap-4')}>
                      <span className={cn('select-none', destaque ? 'text-2xl mt-1' : 'text-lg mt-1.5')} aria-hidden>
                        {porta.emoji}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div
                          className={cn(
                            'uppercase tracking-[0.3em] text-muted-foreground mb-3',
                            destaque ? 'text-[11px] text-gold/80' : 'text-[10px]',
                          )}
                        >
                          {porta.label}
                        </div>
                        <p
                          className={cn(
                            'font-serif text-foreground/90 leading-relaxed mb-4',
                            destaque ? 'text-2xl md:text-3xl tracking-wide' : 'text-lg md:text-xl',
                          )}
                        >
                          {porta.pergunta}
                        </p>
                        <button
                          onClick={() => abrirEstudo(porta)}
                          disabled={restantes <= 0}
                          className={cn(
                            'font-serif italic tracking-wide text-gold/85 hover:text-gold transition-colors border-b border-gold/30 hover:border-gold pb-0.5',
                            destaque ? 'text-base' : 'text-sm',
                            restantes <= 0 && 'opacity-40 cursor-not-allowed hover:text-gold/85 hover:border-gold/30',
                          )}
                        >
                          Sentar à Mesa →
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // ---------- PÁGINA DE ESTUDO ----------
  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <Button variant="ghost" size="sm" onClick={voltarIndice} className="mb-8 text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> voltar às portas
          </Button>

          <section className="mb-12">
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">
              {labelAtiva || 'A pergunta'}
            </div>
            <blockquote className="font-serif text-2xl md:text-3xl text-foreground leading-snug border-l-2 border-gold/50 pl-6">
              "{perguntaAtiva}"
            </blockquote>
          </section>

          <div className="w-16 h-px bg-gold/30 mx-auto my-10" />

          <section className="mb-12">
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">A Voz da Obra</div>
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

          {!carregando && respostaObra && (
            <>
              <div className="w-16 h-px bg-gold/30 mx-auto my-12" />

              {/* Fechamento narrativo */}
              <section className="text-center max-w-xl mx-auto mb-12">
                <h3 className="font-serif text-2xl md:text-3xl text-foreground tracking-wide mb-5">
                  A leitura continua.
                </h3>
                <p className="font-serif italic text-foreground/75 text-base md:text-lg leading-loose">
                  Talvez esta reflexão encontre novos sentidos quando você voltar ao livro,
                  observar uma cliente, ou registrar aquilo que permaneceu vivo em você.
                </p>
              </section>

              {/* Ponte com a Casa — sugestões discretas, sem cards */}
              <p className="text-center font-serif italic text-muted-foreground/80 text-sm mb-6">
                Esta reflexão pode continuar em outros lugares da Casa.
              </p>
              <section className="flex flex-col items-center gap-5">
                <button
                  onClick={() => registrarJardim('psique')}
                  className="font-serif text-foreground/85 hover:text-gold transition-colors inline-flex items-center gap-2 border-b border-gold/20 hover:border-gold pb-0.5"
                >
                  <Leaf className="w-4 h-4 text-gold/80" /> Registrar no Jardim da Psique
                </button>
                <button
                  onClick={() => registrarJardim('oficio')}
                  className="font-serif text-foreground/85 hover:text-gold transition-colors inline-flex items-center gap-2 border-b border-gold/20 hover:border-gold pb-0.5"
                >
                  <Flame className="w-4 h-4 text-gold/80" /> Registrar no Jardim do Ofício
                </button>
                <button
                  onClick={voltarIndice}
                  className="font-serif italic text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Abrir outra Porta
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="font-serif italic text-muted-foreground/70 hover:text-muted-foreground transition-colors text-sm mt-2"
                >
                  encerrar por hoje
                </button>
              </section>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
