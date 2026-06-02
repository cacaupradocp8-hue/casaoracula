import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play,
  Compass,
  Headphones,
  Flower2,
  MapPin,
  DoorOpen,
  Layers,
  Layout,
  ShieldAlert,
  Sparkles,
  Check,
  Sword,
  Eye,
  Radar,
  Target,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRotaOracular } from '@/hooks/useRotaOracular';
import { cn } from '@/lib/utils';
import { AudioRitualPlayer } from '@/components/clube/AudioRitualPlayer';
import { FerramentaOracularPlayer } from '@/components/clube/FerramentaOracularPlayer';

/**
 * ClubeRotaPremium — Travessia oficial (Etapa 2.6)
 * Ordem oficial: Hero → Mapa Simbólico → Áudios → Caso → Desafio →
 * Revelação → Ferramenta → Jardim Psique → Jardim Ofício → Missão → Fechamento.
 */
export default function ClubeRotaPremium() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { pontos, estacaoAtual, isLoading, marcarEmAndamento, concluirPonto } = useRotaOracular();

  const ponto = useMemo(() => pontos.find(p => p.slug === slug), [pontos, slug]);

  useEffect(() => {
    if (ponto && ponto.estado === 'available') {
      marcarEmAndamento.mutate(ponto.id);
    }
  }, [ponto?.id, ponto?.estado, marcarEmAndamento]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-midnight flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}>
          <Compass className="w-12 h-12 text-gold/40" />
        </motion.div>
      </div>
    );
  }

  if (!ponto) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <h2 className="font-display text-2xl text-foreground mb-4">Rota não encontrada</h2>
          <Button onClick={() => navigate('/clube')} variant="outline">Voltar às Rotas</Button>
        </div>
      </AppLayout>
    );
  }

  const audios = Array.isArray(ponto.metadata?.audios)
    ? ponto.metadata.audios
        .map((a: any) => ({ ...a, url: a.audio_url || a.url }))
        .filter((a: any) => a.url && typeof a.url === 'string' && a.url.startsWith('http'))
    : [];

  const renderContent = (content: any) => {
    if (!content) return null;
    if (typeof content === 'string') return content;
    if (typeof content === 'object') {
      return content.text || content.content || content.value || content.relato || content.pergunta_principal || content.palavra || '';
    }
    return String(content);
  };

  const cartografia = [
    { label: 'Onde você está', value: estacaoAtual?.titulo, icon: MapPin },
    { label: 'A Porta', value: ponto.porta, icon: DoorOpen },
    { label: 'O Campo', value: ponto.campo, icon: Layers },
    { label: 'A Torre', value: ponto.torre, icon: Layout },
    { label: 'O Labirinto', value: ponto.labirinto, icon: ShieldAlert },
  ].filter(c => c.value && typeof c.value === 'string' && c.value.trim());

  const psiquePergunta = ponto.metadata?.jardim_psique?.pergunta;
  const oficioPergunta = ponto.metadata?.jardim_oficio?.pergunta;
  const missaoCampo = ponto.metadata?.missao_campo;
  const temMissao = Boolean(
    missaoCampo && (missaoCampo.titulo || missaoCampo.descricao || missaoCampo.sinais || missaoCampo.pergunta)
  );

  return (
    <AppLayout>
      <div className="relative bg-midnight text-foreground overflow-x-hidden min-h-screen">
        {/* Background */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(206_60%_18%/0.6),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(206_70%_8%/0.9),transparent_70%)]" />
        </div>

        {/* 1. HERO */}
        <section className="relative min-h-[70vh] flex items-center justify-center px-4 sm:px-6 z-10 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            {ponto.image_url ? (
              <img src={ponto.image_url} alt="" className="w-full h-full object-cover opacity-30 mix-blend-luminosity" />
            ) : estacaoAtual?.banner_url ? (
              <img src={estacaoAtual.banner_url} alt="" className="w-full h-full object-cover opacity-20" />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-b from-midnight/20 via-midnight/60 to-midnight" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            className="relative z-10 text-center w-full max-w-4xl mx-auto space-y-6"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-3">
                <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-gold/40" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-gold/60 font-medium">
                  {estacaoAtual?.livro_titulo || 'Estação Oracular'}
                </span>
                <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-gold/40" />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="font-display font-light leading-tight tracking-tighter text-4xl md:text-6xl lg:text-7xl">
                <span className="bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent">
                  {ponto.metadata?.hero?.titulo || ponto.nome}
                </span>
              </h1>
              {(ponto.metadata?.hero?.subtitulo || ponto.subtitulo) && (
                <p className="font-serif italic text-lg md:text-2xl text-white/40 max-w-2xl mx-auto">
                  "{ponto.metadata?.hero?.subtitulo || ponto.subtitulo}"
                </p>
              )}
              {ponto.metadata?.hero?.texto && (
                <p className="font-serif text-white/60 text-lg md:text-xl max-w-3xl mx-auto mt-4 leading-relaxed">
                  {ponto.metadata.hero.texto}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10">
              <Button
                size="lg"
                variant="gold"
                className="rounded-full px-12 h-16 shadow-glow"
                onClick={() => document.getElementById('mapa-simbolico')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Play className="w-4 h-4 fill-current mr-2" /> Iniciar Travessia
              </Button>
            </div>
          </motion.div>
        </section>

        {/* CONTENT */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-12 space-y-24 pb-24 pt-12">

          {/* 2. MAPA SIMBÓLICO */}
          <Section id="mapa-simbolico" icon={Compass} kicker="O Olhar Interior" titulo="Mapa Simbólico">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5 grid gap-4">
                {cartografia.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
                    <div className="w-10 h-10 rounded-xl bg-gold/5 flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-gold/60" />
                    </div>
                    <div>
                      <p className="text-[8px] tracking-[0.3em] uppercase text-white/30 font-bold">{item.label}</p>
                      <p className="font-display text-lg text-white/90">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="lg:col-span-7 pl-6 border-l border-gold/10">
                {pontos.map((item) => (
                  <div key={item.id} className={cn('flex items-center gap-4 py-3', item.id === ponto.id ? 'text-white' : 'text-white/30')}>
                    <div className={cn('w-2 h-2 rounded-full', item.id === ponto.id ? 'bg-gold shadow-glow' : 'bg-white/10')} />
                    <span className="text-sm font-display">{item.nome}</span>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* 3. ÁUDIOS */}
          {audios.length > 0 && (
            <Section id="audios" icon={Headphones} kicker="Escuta" titulo="Áudios da Estação">
              <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {audios.map((audio: any, i: number) => (
                  <AudioRitualPlayer
                    key={i}
                    audioUrl={audio.url}
                    titulo={audio.titulo}
                    tipo={audio.tipo}
                    funcao={audio.funcao}
                    duracao={audio.duracao}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* 4. CASO SIMBÓLICO */}
          {(() => {
            const relato = renderContent(ponto.metadata?.caso_simbolico?.relato || ponto.metadata?.caso_espelho);
            if (!relato) return null;
            return (
              <Section id="caso-simbolico" icon={Eye} kicker="Reflexo" titulo={ponto.metadata?.caso_simbolico?.titulo || 'Caso Simbólico'}>
                <div className="max-w-3xl mx-auto bg-foreground/[0.03] border-l-4 border-gold/40 p-8 rounded-r-2xl whitespace-pre-wrap font-serif text-lg leading-relaxed italic text-white/80">
                  {relato}
                </div>
              </Section>
            );
          })()}

          {/* 5. DESAFIO DE ESCUTA */}
          {(() => {
            const desafio = renderContent(ponto.metadata?.desafio_terapeuta?.pergunta || ponto.metadata?.desafio_terapeuta);
            if (!desafio) return null;
            return (
              <Section id="desafio-escuta" icon={Sword} kicker="Ação" titulo="Desafio de Escuta">
                <div className="max-w-3xl mx-auto border border-gold/20 bg-gold/5 p-10 rounded-3xl text-center">
                  <p className="font-serif text-2xl text-gold leading-relaxed">{desafio}</p>
                </div>
              </Section>
            );
          })()}

          {/* 6. REVELAÇÃO */}
          {(() => {
            const rev = ponto.metadata?.revelacao_estacao;
            if (!rev || (!rev.porta && !rev.campo_psiquico && !rev.torre && !rev.labirinto)) return null;
            return (
              <Section id="revelacao" icon={Sparkles} kicker="Sabedoria" titulo="Revelação da Estação">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                  {[
                    { key: 'porta', label: 'A Porta', icon: DoorOpen },
                    { key: 'campo_psiquico', label: 'Campo', icon: Layers },
                    { key: 'torre', label: 'A Torre', icon: Layout },
                    { key: 'labirinto', label: 'Labirinto', icon: ShieldAlert },
                  ].map(item => rev[item.key] && (
                    <div key={item.key} className="space-y-1">
                      <div className="flex items-center gap-2 text-white/30 uppercase text-[9px] font-bold">
                        <item.icon className="w-3 h-3 text-gold/40" /> {item.label}
                      </div>
                      <p className="text-white/80 font-serif italic text-lg">{rev[item.key]}</p>
                    </div>
                  ))}
                </div>
              </Section>
            );
          })()}

          {/* 7. FERRAMENTA ORACULAR */}
          {ponto.metadata?.ferramenta_oracular?.enabled && (
            <Section id="ferramenta-oracular" icon={Radar} kicker="Camada do Método" titulo="Ferramenta Oracular">
              <FerramentaOracularPlayer
                data={{
                  ...ponto.metadata.ferramenta_oracular,
                  questoes:
                    ponto.metadata.ferramenta_oracular.questoes ||
                    ponto.metadata.ferramenta_oracular.indicadores?.map((ind: any) => ({
                      id: ind.id,
                      texto: ind.label,
                      tipo_resposta:
                        ind.tipo_resposta ||
                        (ponto.metadata.ferramenta_oracular.tipo_resultado === 'intensidade' ? 'escala_1_5' : 'sim_nao'),
                    })) ||
                    [],
                }}
                onComplete={(respostas) => {
                  console.log('[Camada 2] Respostas rastreamento:', respostas);
                }}
              />
            </Section>
          )}

          {/* 8. JARDIM DA PSIQUE */}
          {psiquePergunta && (
            <Section id="jardim-psique" icon={Flower2} kicker="Sementeira" titulo="Jardim da Psique">
              <div className="max-w-3xl mx-auto p-8 rounded-[2.5rem] bg-gradient-to-br from-gold/10 to-midnight border border-gold/10">
                <p className="text-white/70 font-serif italic text-lg leading-relaxed">{psiquePergunta}</p>
              </div>
            </Section>
          )}

          {/* 9. JARDIM DO OFÍCIO */}
          {oficioPergunta && (
            <Section id="jardim-oficio" icon={Flower2} kicker="Sementeira" titulo="Jardim do Ofício">
              <div className="max-w-3xl mx-auto p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-900/10 to-midnight border border-emerald-900/10">
                <p className="text-white/70 font-serif italic text-lg leading-relaxed">{oficioPergunta}</p>
              </div>
            </Section>
          )}

          {/* 10. MISSÃO DE CAMPO */}
          {temMissao && (
            <Section id="missao-campo" icon={Target} kicker="Travessia Encarnada" titulo={missaoCampo.titulo || 'Missão de Campo'}>
              <div className="max-w-3xl mx-auto space-y-6 p-10 rounded-[2.5rem] border border-gold/15 bg-white/[0.02]">
                {missaoCampo.descricao && (
                  <p className="text-white/80 font-serif italic text-lg leading-relaxed whitespace-pre-wrap">
                    {missaoCampo.descricao}
                  </p>
                )}
                {missaoCampo.sinais && (
                  <div className="border-l-2 border-gold/30 pl-5">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gold/60 font-bold mb-2">Sinais a observar</p>
                    <p className="text-white/70 font-serif whitespace-pre-wrap">{missaoCampo.sinais}</p>
                  </div>
                )}
                {missaoCampo.pergunta && (
                  <div className="bg-gold/5 border border-gold/15 p-6 rounded-2xl">
                    <p className="text-gold font-serif italic text-lg text-center">{missaoCampo.pergunta}</p>
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* 11. FECHAMENTO */}
          {(() => {
            const textoRaw = renderContent(ponto.metadata?.fechamento?.texto || ponto.metadata?.fechamento);
            return (
              <Section id="fechamento" icon={Check} kicker="Fim" titulo="Travessia Concluída">
                <div className="max-w-2xl mx-auto text-center space-y-8">
                  {textoRaw && (
                    <p className="text-xl md:text-2xl text-white/70 font-serif italic leading-relaxed">{textoRaw}</p>
                  )}
                  <div className="flex flex-col items-center gap-6">
                    {ponto.estado !== 'completed' ? (
                      <Button
                        variant="gold"
                        className="rounded-full h-16 px-12 text-lg font-bold shadow-glow"
                        onClick={() => concluirPonto.mutate(ponto.id)}
                        disabled={concluirPonto.isPending}
                      >
                        {concluirPonto.isPending ? 'Registrando...' : 'Selo de Conclusão'}
                      </Button>
                    ) : (
                      <Badge variant="outline" className="border-gold/40 text-gold bg-gold/5 py-2 px-4 rounded-full">
                        Estação Concluída
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      className="rounded-full h-14 px-10 text-sm uppercase tracking-wider"
                      onClick={() => navigate('/clube')}
                    >
                      Voltar ao Mapa das Rotas
                    </Button>
                  </div>
                </div>
              </Section>
            );
          })()}
        </div>
      </div>
    </AppLayout>
  );
}

function Section({ id, icon: Icon, kicker, titulo, children }: any) {
  return (
    <section id={id} className="scroll-mt-24 space-y-8">
      {(kicker || titulo) && (
        <div className="space-y-2">
          {kicker && (
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-gold/60">
              {Icon && <Icon className="w-3 h-3" />} {kicker}
            </div>
          )}
          {titulo && <h2 className="text-2xl md:text-4xl font-display text-white">{titulo}</h2>}
        </div>
      )}
      {children}
    </section>
  );
}
