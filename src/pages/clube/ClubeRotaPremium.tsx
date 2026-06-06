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
  const { pontos, estacaoAtual, isLoading, marcarEmAndamento, concluirPonto } = useRotaOracular(slug);

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
          <h2 className="font-display text-2xl text-foreground mb-4">Rota não encontrada</h2>
          <Button onClick={() => navigate('/clube')} variant="outline" className="rounded-full border-gold/30 text-gold/80 hover:bg-gold/10">
            Voltar às Rotas
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
          backgroundImage={ponto.metadata?.hero?.imagem_desktop || estacaoAtual?.banner_url}
          estacaoNome={estacaoAtual?.titulo || 'Rota dos Lobos'}
        />

        {/* CONTENT CONTAINER */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-12 space-y-24 md:space-y-48 pb-40 pt-12">
          
          {/* 2. O QUE ESTÁ ATIVO AGORA */}
          <section id="ativo-agora" className="space-y-12">
            <h2 className="text-xl md:text-3xl font-display text-white text-center">O que está ativo agora</h2>
            <AtivoAgoraBloco />
          </section>

          {/* 3. TERRITÓRIOS ATIVADOS */}
          {ponto.impacto_cidadela && ponto.impacto_cidadela.length > 0 && (
            <Section id="territorios-cidadela" kicker="Expansão da CidadELA" titulo="Territórios ativados">
              <MiniMandalaTerritorios 
                territoriosAtivados={ponto.impacto_cidadela.map((i: any) => i.distrito || i.id || i)}
              />
            </Section>
          )}

          {/* 4. CAMINHO DA ESTAÇÃO */}
          <Section kicker="Travessia" titulo="Caminho da Estação">
            <EstacaoCaminhoTrail />
          </Section>

          {/* FRASE TRAVESSIA 1 (Opcional, mantida se houver no metadado) */}
          {ponto.metadata?.frases_travessia?.[0] && (
            <FraseTravessia texto={ponto.metadata.frases_travessia[0]} />
          )}

          {/* 5. ÁUDIOS */}
          {audios.length > 0 && (
            <Section id="audios" icon={Headphones} kicker="Escuta" titulo="Áudios da Estação">
              <div className="space-y-24">
                <EscutaPremium 
                  audioUrl={audios[0].url}
                  titulo={audios[0].titulo}
                  tipo={audios[0].tipo}
                  funcao={audios[0].funcao}
                  duracao={audios[0].duracao}
                  imagemEscuta={ponto.metadata?.escuta?.imagem_escuta}
                />

                {audios.length > 1 && (
                  <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    {audios.slice(1).map((audio: any, i: number) => (
                      <AudioRitualPlayer
                        key={i + 1}
                        audioUrl={audio.url}
                        titulo={audio.titulo}
                        tipo={audio.tipo}
                        funcao={audio.funcao}
                        duracao={audio.duracao}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* 6. CASO SIMBÓLICO */}
          {(() => {
            const relato = renderContent(ponto.metadata?.caso_simbolico?.relato || ponto.metadata?.caso_espelho);
            if (!relato) return null;
            return (
              <Section id="caso-simbolico" icon={Eye} kicker="Visão do Espelho" titulo={ponto.metadata?.caso_simbolico?.titulo || 'Caso Simbólico'}>
                <div className="max-w-3xl mx-auto bg-foreground/[0.03] border-l-4 border-gold/40 p-8 rounded-r-2xl whitespace-pre-wrap font-serif text-lg leading-relaxed italic text-white/80">
                  {relato}
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
                <div className="max-w-3xl mx-auto border border-gold/20 bg-gold/5 p-10 rounded-3xl text-center">
                  <p className="font-serif text-2xl text-gold leading-relaxed">{desafio}</p>
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

          {/* 10. JARDIM DA PSIQUE */}
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

          {/* 11. JARDIM DO OFÍCIO */}
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
                <div className="mt-6 pt-4 border-t border-emerald-500/10">
                   <p className="text-[10px] text-emerald-500/50 uppercase tracking-widest font-bold mb-1">Aviso Ético</p>
                   <p className="text-[10px] text-white/30 italic">Registre apenas padrões gerais e percepções simbólicas. Não inclua nome, dados identificáveis ou informações sensíveis de mulheres acompanhadas.</p>
                </div>
              </div>
            </Section>
          )}

          {/* 12. MISSÃO DE CAMPO */}
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

          {/* 13. FECHAMENTO */}
          {(() => {
            const textoRaw = renderContent(ponto.metadata?.fechamento?.texto || ponto.metadata?.fechamento);
            return (
              <Section id="fechamento" icon={Check} kicker="O Portal Se Fecha" titulo="Travessia Concluída">
                {ponto.metadata?.fechamento?.imagem_fechamento && (
                  <div className="max-w-4xl mx-auto mb-12 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
                    <img src={ponto.metadata.fechamento.imagem_fechamento} alt="" className="w-full h-64 md:h-96 object-cover opacity-60 mix-blend-luminosity hover:opacity-100 transition-opacity duration-1000" />
                  </div>
                )}
                <div className="max-w-2xl mx-auto text-center space-y-8">
                  {textoRaw && (
                    <p className="text-xl md:text-2xl text-white/70 font-serif italic leading-relaxed">{textoRaw}</p>
                  )}
                  <div className="flex flex-col items-center gap-6">
                    {ponto.estado !== 'completed' ? (
                      <Button
                        variant="gold"
                        className="rounded-full h-16 px-12 text-lg font-bold shadow-glow text-midnight"
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
                      className="rounded-full h-14 px-10 text-sm uppercase tracking-wider border-white/10 text-white/60 hover:text-white"
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
        <div className="space-y-3 text-center md:text-left">
          {kicker && (
            <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] uppercase tracking-[0.4em] text-gold/60 font-bold">
              {Icon && <Icon className="w-3 h-3" />} {kicker}
            </div>
          )}
          {titulo && <h2 className="text-2xl md:text-5xl font-display text-white tracking-tight leading-tight">{titulo}</h2>}
        </div>
      )}
      {children}
    </section>
  );
}
