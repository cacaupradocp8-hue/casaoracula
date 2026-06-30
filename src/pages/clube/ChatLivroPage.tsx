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

const LIMITE_SEMANAL = 3;
const INTERACTION_TYPE = 'mesa_da_obra';

type Porta = {
  key: string;
  emoji: string;
  label: string;
  fallback: string;
};

// 7 Portas de Investigação — ordem editorial
const PORTAS: Porta[] = [
  { key: 'sobre_voce',     emoji: '🌿', label: 'Sobre você',              fallback: 'O que continua tentando permanecer vivo em mim?' },
  { key: 'sobre_cliente',  emoji: '🐺', label: 'Sobre uma cliente',        fallback: 'Que parte dessa mulher ainda não encontrou linguagem?' },
  { key: 'sobre_capitulo', emoji: '📖', label: 'Sobre o capítulo',         fallback: 'Por que Clarissa escolheu contar esta história?' },
  { key: 'sobre_simbolo',  emoji: '🦴', label: 'Sobre um símbolo',         fallback: 'O que os ossos preservam?' },
  { key: 'sobre_pratica',  emoji: '🌙', label: 'Sobre a prática clínica', fallback: 'Como esta narrativa muda minha forma de escutar?' },
  { key: 'sobre_oficio',   emoji: '🌿', label: 'Sobre o ofício',           fallback: 'O que esta obra me pede como facilitadora?' },
  { key: 'pergunta_semana',emoji: '⭐', label: 'Pergunta da semana',       fallback: 'Que pergunta esta obra está fazendo a você nesta semana?' },
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

            <header className="text-center mb-10">
              <img src={capa} alt={obra} className="w-32 h-auto mx-auto rounded-sm shadow-2xl mb-8" />
              <h1 className="font-serif text-4xl md:text-5xl text-foreground tracking-wide mb-2">Mesa da Obra</h1>
              <p className="font-serif italic text-muted-foreground text-lg">{obra}</p>
              <div className="w-16 h-px bg-gold/40 mx-auto my-8" />
              <div className="font-serif text-foreground/85 text-base md:text-lg leading-relaxed max-w-xl mx-auto space-y-4">
                <p className="italic">Algumas perguntas não pedem respostas rápidas. Pedem companhia na leitura.</p>
                <p>
                  Nesta Mesa da Obra, cada diálogo é construído exclusivamente a partir de
                  <em> {obra}</em>. O objetivo não é resumir capítulos — é desenvolver um modo de
                  observar, escutar e aplicar a leitura simbólica na vida e na prática clínica.
                </p>
              </div>
            </header>

            {/* A obra abre portas — narrativa viva */}
            <div className="text-center mb-10">
              <p className="font-serif italic text-gold/90 text-base md:text-lg">
                {restantes > 0
                  ? `Hoje a obra abre sete portas. Esta semana você poderá atravessar ${restantes === LIMITE_SEMANAL ? 'até três delas' : (restantes === 1 ? 'apenas mais uma' : `mais ${restantes}`)}.`
                  : 'Esta semana a obra já lhe ofereceu três travessias. Volte na próxima.'}
              </p>
              {!carregandoLimite && (
                <div className="mt-3 tracking-widest text-gold/80 text-sm">
                  {'●'.repeat(restantes)}{'○'.repeat(LIMITE_SEMANAL - restantes)}
                </div>
              )}
            </div>

            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl md:text-3xl text-foreground/90 tracking-wide">
                Portas de Investigação
              </h2>
              <div className="w-12 h-px bg-gold/30 mx-auto mt-4" />
            </div>

            {/* Lista editorial — sem cards chamativos */}
            <div className="divide-y divide-border/40">
              {portasDoDia.map(porta => (
                <article key={porta.key} className="py-7 group">
                  <div className="flex items-start gap-4">
                    <span className="text-xl mt-1 select-none" aria-hidden>{porta.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                        {porta.label}
                      </div>
                      <p className="font-serif text-lg md:text-xl text-foreground/90 leading-relaxed mb-3">
                        {porta.pergunta}
                      </p>
                      <button
                        onClick={() => abrirEstudo(porta)}
                        disabled={restantes <= 0}
                        className={cn(
                          'text-sm tracking-wide text-gold/80 hover:text-gold transition-colors border-b border-gold/30 hover:border-gold pb-0.5',
                          restantes <= 0 && 'opacity-40 cursor-not-allowed hover:text-gold/80 hover:border-gold/30',
                        )}
                      >
                        Abrir investigação →
                      </button>
                    </div>
                  </div>
                </article>
              ))}
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
              <div className="w-16 h-px bg-gold/30 mx-auto my-10" />
              <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4 text-center">
                Continue observando
              </div>
              <section className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-3 py-6 border-gold/30 hover:border-gold hover:bg-gold/5" onClick={() => registrarJardim('psique')}>
                  <Leaf className="w-4 h-4 text-gold" /> Registrar no Jardim da Psique
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 py-6 border-gold/30 hover:border-gold hover:bg-gold/5" onClick={() => registrarJardim('oficio')}>
                  <Flame className="w-4 h-4 text-gold" /> Registrar no Jardim do Ofício
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 py-6 text-muted-foreground hover:text-foreground" onClick={voltarIndice}>
                  <RefreshCw className="w-4 h-4" /> Abrir outra Porta de Investigação
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
