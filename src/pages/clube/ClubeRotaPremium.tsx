import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass,
  Headphones,
  Flower2,
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
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRotaOracular } from '@/hooks/useRotaOracular';
import { AudioRitualPlayer } from '@/components/clube/AudioRitualPlayer';
import { EscutaPremium } from '@/components/clube/EscutaPremium';
import { FraseTravessia } from '@/components/clube/FraseTravessia';
import { FerramentaOracularPlayer } from '@/components/clube/FerramentaOracularPlayer';
import { MiniMandalaTerritorios } from '@/components/clube/MiniMandalaTerritorios';
import { EstacaoHero } from '@/components/clube/EstacaoHero';
import { AtivoAgoraBloco } from '@/components/clube/AtivoAgoraBloco';
import { EstacaoCaminhoTrail } from '@/components/clube/EstacaoCaminhoTrail';
import { JardimInput } from '@/components/clube/JardimInput';
import { Skeleton } from '@/components/ui/skeleton';

export default function ClubeRotaPremium() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { pontos, estacaoAtual, isLoading, marcarEmAndamento, concluirPonto, estacaoIncompleta } = useRotaOracular(slug);

  const ponto = useMemo(() => pontos.find(p => p.slug === slug), [pontos, slug]);

  useEffect(() => {
    if (ponto && ponto.estado === 'available') {
      marcarEmAndamento.mutate(ponto.id);
    }
  }, [ponto?.id, ponto?.estado, marcarEmAndamento]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="bg-midnight min-h-screen pt-24 px-6 space-y-12">
          <Skeleton className="h-[60vh] w-full rounded-[2.5rem] bg-white/5" />
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
            <Skeleton className="h-32 bg-white/5 rounded-2xl" />
            <Skeleton className="h-32 bg-white/5 rounded-2xl" />
            <Skeleton className="h-32 bg-white/5 rounded-2xl" />
            <Skeleton className="h-32 bg-white/5 rounded-2xl" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!ponto) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-midnight">
          {estacaoIncompleta ? (
            <div className="space-y-4">
              <h2 className="font-display text-2xl text-foreground mb-4">Esta estação ainda não possui conteúdos publicados.</h2>
              <p className="text-white/50 italic font-serif">Acesse o Admin para adicionar itens a esta estação.</p>
            </div>
          ) : (
            <h2 className="font-display text-2xl text-foreground mb-4">Rota não encontrada</h2>
          )}
          <Button onClick={() => navigate('/clube/rota-dos-lobos')} variant="outline" className="mt-6 rounded-full border-gold/30 text-gold/80 hover:bg-gold/10">
            Voltar à Rota dos Lobos
          </Button>
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

  const psiquePergunta = ponto.metadata?.jardim_psique?.pergunta;
  const oficioPergunta = ponto.metadata?.jardim_oficio?.pergunta;
  const missaoCampo = ponto.metadata?.missao_campo;
  const temMissao = Boolean(
    missaoCampo && (missaoCampo.titulo || missaoCampo.descricao || missaoCampo.sinais || missaoCampo.pergunta)
  );

  return (
    <AppLayout>
      <div className="relative bg-midnight text-foreground overflow-x-hidden min-h-screen">
        {/* Background Atmosphere */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(206_60%_18%/0.6),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(206_70%_8%/0.9),transparent_70%)]" />
        </div>

        {/* 1. HERO */}
        <EstacaoHero 
          estacaoNumero={estacaoAtual?.numero || 1}
          titulo={ponto.metadata?.hero?.titulo || ponto.nome}
          subtitulo={ponto.metadata?.hero?.subtitulo || ponto.subtitulo || ''}
          descricao={ponto.metadata?.hero?.texto || ponto.descricao}
          citacao={ponto.metadata?.revelacao_estacao?.porta}
          backgroundImage={ponto.metadata?.hero?.imagem_desktop || estacaoAtual?.banner_url}
          estacaoNome={estacaoAtual?.titulo || 'Rota dos Lobos'}
          kicker={ponto.metadata?.hero?.kicker}
        />


        {/* CONTENT CONTAINER */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-12 space-y-24 md:space-y-48 pb-40">
          
          {/* 1. ÁUDIOS - ESTAÇÃO DE ESCUTA (Prioridade Narrativa) */}
          {audios.length > 0 && (
            <Section id="audios" icon={Headphones} kicker="Escuta Ritual" titulo="Ritual de Entrada">
              <div className="space-y-24">
                {/* Áudio Principal em Destaque */}
                <EscutaPremium 
                  audioUrl={audios[0].url}
                  titulo={audios[0].titulo}
                  tipo={audios[0].tipo || 'Abertura da Estação'}
                  funcao={audios[0].funcao}
                  duracao={audios[0].duracao}
                  imagemEscuta={ponto.metadata?.escuta?.imagem_escuta}
                  className="bg-black/40 border border-white/5 shadow-2xl backdrop-blur-xl"
                />

                {/* Lista de Aprofundamento */}
                {audios.length > 1 && (
                  <div className="max-w-4xl mx-auto space-y-12">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-px flex-1 bg-white/10" />
                      <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">Aprofundamento</span>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {audios.slice(1).map((audio: any, i: number) => (
                        <AudioRitualPlayer
                          key={i}
                          audioUrl={audio.url}
                          titulo={audio.titulo}
                          tipo={audio.tipo || 'Aprofundamento'}
                          funcao={audio.funcao}
                          duracao={audio.duracao}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* 2. CONTEÚDO DINÂMICO DO ADMIN (clube_rota_itens) */}
          {ponto.conteudo_inline && (
            <Section id="conteudo-principal" kicker="O Caminho" titulo={ponto.nome}>
               <div className="max-w-4xl mx-auto prose prose-invert prose-gold">
                  <div className="bg-white/[0.02] border border-white/5 p-12 md:p-16 rounded-[2.5rem] backdrop-blur-sm">
                    {typeof ponto.conteudo_inline === 'string' ? (
                      <div className="text-white/80 font-serif text-xl leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: ponto.conteudo_inline }} />
                    ) : (
                      <div className="text-white/80 font-serif text-xl leading-relaxed whitespace-pre-wrap">
                        {renderContent(ponto.conteudo_inline)}
                      </div>
                    )}
                  </div>
               </div>
            </Section>
          )}

          {/* 3. FERRAMENTA ORACULAR */}
          {ponto.metadata?.ferramenta_oracular?.enabled && (
            <Section id="ferramenta-oracular" icon={Radar} kicker="Campo de Escuta" titulo={ponto.metadata.ferramenta_oracular.titulo || "Mapa do Instinto Soterrado"}>
              <FerramentaOracularPlayer
                data={{
                  ...ponto.metadata.ferramenta_oracular,
                  titulo: ponto.metadata.ferramenta_oracular.titulo || "Mapa do Instinto Soterrado",
                  kicker: "Campo de Escuta",
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
                onComplete={() => {}}
              />
            </Section>
          )}

          {/* 4. JARDIM DA PSIQUE */}
          {psiquePergunta && (
            <Section id="jardim-psique" icon={Flower2} kicker="Semeadura Psíquica" titulo="Jardim da Psique">
              <div className="max-w-3xl mx-auto p-8 rounded-[2.5rem] bg-gradient-to-br from-gold/10 to-midnight border border-gold/10 space-y-6">
                <p className="text-white/70 font-serif italic text-lg leading-relaxed">{psiquePergunta}</p>
                <JardimInput 
                  type="psique" 
                  pergunta={psiquePergunta} 
                  pontoId={ponto.id} 
                  sourceTitle={ponto.nome}
                />
              </div>
            </Section>
          )}

          {/* 5. JARDIM DO OFÍCIO */}
          {oficioPergunta && (
            <Section id="jardim-oficio" icon={Flower2} kicker="Semeadura do Ofício" titulo="Jardim do Ofício">
              <div className="max-w-3xl mx-auto p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-900/10 to-midnight border border-emerald-900/10 space-y-6">
                <p className="text-white/70 font-serif italic text-lg leading-relaxed">{oficioPergunta}</p>
                <JardimInput 
                  type="oficio" 
                  pergunta={oficioPergunta} 
                  pontoId={ponto.id} 
                  sourceTitle={ponto.nome}
                />
              </div>
            </Section>
          )}

          {/* 6. CAMINHO DA ESTAÇÃO (Footer Navigation) */}
          <Section id="caminho-estacao" kicker="Navegação" titulo="Seu Percurso">
            <EstacaoCaminhoTrail />
          </Section>

          {/* 7. O QUE ESTÁ ATIVO AGORA (Resumo de Cartografia) */}
          <section id="ativo-agora" className="space-y-12">
            <div className="flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] text-gold/40 font-bold mb-6">
              <span className="w-8 h-[1px] bg-gold/20" />
              Cartografia Ativa
              <span className="w-8 h-[1px] bg-gold/20" />
            </div>
            <AtivoAgoraBloco />
          </section>

          {/* 6. CASO SIMBÓLICO */}
          {(() => {
            const relato = renderContent(ponto.metadata?.caso_simbolico?.relato || ponto.metadata?.caso_espelho);
            if (!relato) return null;
            return (
              <Section id="caso-simbolico" icon={Eye} kicker="Visão do Espelho" titulo={ponto.metadata?.caso_simbolico?.titulo || 'Caso Simbólico'}>
                <div className="relative max-w-4xl mx-auto group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 via-white/5 to-gold/20 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000" />
                  <div className="relative bg-white/[0.02] border border-white/10 p-12 md:p-16 rounded-[2rem] backdrop-blur-xl shadow-2xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gold/40" />
                    <div className="font-serif text-xl md:text-2xl leading-relaxed italic text-white/90 whitespace-pre-wrap selection:bg-gold/30">
                      {relato}
                    </div>
                  </div>
                </div>
              </Section>
            );
          })()}

          {/* 7. DESAFIO DE ESCUTA */}
          {(() => {
            const desafio = renderContent(ponto.metadata?.desafio_terapeuta?.pergunta || ponto.metadata?.desafio_terapeuta);
            if (!desafio) return null;
            return (
              <Section id="desafio-escuta" icon={Sword} kicker="O Chamado do Agora" titulo="Desafio de Escuta">
                <div className="max-w-4xl mx-auto">
                   <div className="relative p-12 md:p-20 rounded-[3rem] border border-gold/20 bg-gradient-to-br from-gold/10 via-midnight to-black text-center overflow-hidden shadow-2xl">
                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(196,165,74,0.1),transparent_70%)]" />
                     <p className="relative font-serif text-2xl md:text-4xl text-gold leading-tight tracking-tight italic">
                       {desafio}
                     </p>
                   </div>
                </div>
              </Section>
            );
          })()}

          {/* 8. REVELAÇÃO */}
          {(() => {
            const rev = ponto.metadata?.revelacao_estacao;
            if (!rev || (!rev.porta && !rev.campo_psiquico && !rev.torre && !rev.labirinto)) return null;
            return (
              <Section id="revelacao" icon={Sparkles} kicker="Gnose da Estação" titulo="Revelação da Estação">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                  {[
                    { key: 'porta', label: 'A Porta', icon: DoorOpen },
                    { key: 'campo_psiquico', label: 'Campo', icon: Layers },
                    { key: 'torre', label: 'A Torre', icon: Layout },
                    { key: 'labirinto', label: 'Labirinto', icon: ShieldAlert },
                  ].map(item => rev[item.key] && (
                    <div key={item.key} className="space-y-1">
                      <div className="flex items-center gap-2 text-white/30 uppercase text-[9px] font-bold">
                        <item.icon className="w-3 h-3 text-gold/40" /> {item.label === 'Campo' ? 'Campo de Leitura' : item.label}
                      </div>
                      <p className="text-white/80 font-serif italic text-lg">{rev[item.key]}</p>
                    </div>
                  ))}
                </div>
              </Section>
            );
          })()}

          {/* 9. FERRAMENTA ORACULAR */}
          {ponto.metadata?.ferramenta_oracular?.enabled && (
            <Section id="ferramenta-oracular" icon={Radar} kicker="Campo de Escuta" titulo="Mapa do Instinto Soterrado">
              <FerramentaOracularPlayer
                data={{
                  ...ponto.metadata.ferramenta_oracular,
                  titulo: "Mapa do Instinto Soterrado",
                  kicker: "Campo de Escuta",
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
                onComplete={() => {}}
              />
            </Section>
          )}

          {/* 13. FECHAMENTO (Travessia Concluída) */}
          {(() => {
            const textoRaw = renderContent(ponto.metadata?.fechamento?.texto || ponto.metadata?.fechamento);
            return (
              <Section id="fechamento" icon={Check} kicker="O Portal Se Fecha" titulo="Travessia Concluída">
                <div className="max-w-5xl mx-auto space-y-16">
                  {ponto.metadata?.fechamento?.imagem_fechamento && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 1.05 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1.5 }}
                      className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent z-10" />
                      <img 
                        src={ponto.metadata.fechamento.imagem_fechamento} 
                        alt="" 
                        className="w-full h-[400px] md:h-[600px] object-cover opacity-60 mix-blend-luminosity group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" 
                      />
                    </motion.div>
                  )}
                  
                  <div className="max-w-3xl mx-auto text-center space-y-12">
                    {textoRaw && (
                      <p className="text-2xl md:text-4xl text-white/80 font-serif italic leading-snug tracking-tight">
                        {textoRaw}
                      </p>
                    )}
                    
                    <div className="flex flex-col items-center gap-8">
                      {ponto.estado !== 'completed' ? (
                        <Button
                          variant="gold"
                          className="rounded-full h-20 px-16 text-xl font-bold shadow-premium-glow text-midnight hover:scale-105 transition-transform"
                          onClick={() => concluirPonto.mutate(ponto.id)}
                          disabled={concluirPonto.isPending}
                        >
                          {concluirPonto.isPending ? (
                            <Loader2 className="w-6 h-6 animate-spin mr-3" />
                          ) : (
                            <Check className="w-6 h-6 mr-3" />
                          )}
                          {concluirPonto.isPending ? 'Registrando...' : 'Selo de Conclusão'}
                        </Button>
                      ) : (
                        <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full border border-gold/40 text-gold bg-gold/5 shadow-[0_0_30px_rgba(196,165,74,0.1)]">
                          <CheckCircle2 className="w-6 h-6" />
                          <span className="font-bold uppercase tracking-[0.2em] text-sm">Estação Concluída</span>
                        </div>
                      )}
                      
                      <Button
                        variant="ghost"
                        className="rounded-full h-14 px-10 text-[11px] uppercase tracking-[0.4em] text-white/30 hover:text-white hover:bg-white/5 transition-all"
                        onClick={() => navigate('/clube/rotas/rota-dos-lobos')}
                      >
                        Voltar à Rota dos Lobos
                      </Button>
                    </div>
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
    <motion.section 
      id={id} 
      className="scroll-mt-32 space-y-12"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.21, 1.02, 0.47, 0.98] }}
    >
      {(kicker || titulo) && (
        <div className="space-y-6 text-center">
          {kicker && (
            <div className="flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] text-gold/60 font-bold">
              <span className="w-8 h-[1px] bg-gold/20" />
              <div className="flex items-center gap-2">
                {Icon && <Icon className="w-3.5 h-3.5 text-gold/40" />} {kicker}
              </div>
              <span className="w-8 h-[1px] bg-gold/20" />
            </div>
          )}
          {titulo && (
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-display text-white tracking-tight leading-tight max-w-4xl mx-auto px-4">
              {titulo}
            </h2>
          )}
        </div>
      )}
      <div className="relative">
        {children}
      </div>
    </motion.section>
  );
}
