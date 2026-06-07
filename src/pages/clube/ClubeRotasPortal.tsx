import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, MessageSquare, Map as MapIcon } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { Button } from '@/components/ui/button';
import { useBussolaOracular } from '@/hooks/useBussolaOracular';
import { useAuth } from '@/contexts/AuthContext';
import { MiniMapaCidadela } from '@/components/bussola-home';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffectivePortal } from '@/hooks/useEffectivePortal';
import { useAppSettings } from '@/hooks/useAppSettings';
import { EscutaPremium } from '@/components/clube/EscutaPremium';
import rotaLobosBg from '@/assets/rota-dos-lobos-bg.png';

export default function ClubeRotasPortal() {
  const navigate = useNavigate();
  const bussola = useBussolaOracular();
  const { effectivePortal } = useEffectivePortal();
  const { getSetting } = useAppSettings();

  const audioUrl = getSetting('portal_rotas_welcome_audio_url');
  const audioTitle = getSetting('portal_rotas_welcome_audio_title', 'A Voz da Casa');
  const audioSubtitle = getSetting('portal_rotas_welcome_audio_subtitle', 'Antes de escolher uma rota, escute a chegada.');
  const audioDescription = getSetting('portal_rotas_welcome_audio_description', 'Esta escuta foi criada para desacelerar sua entrada e abrir o primeiro silêncio da travessia.');
  const audioImage = getSetting('portal_rotas_welcome_audio_image');

  const hasCidadela = bussola.temCartografia;

  return (
    <AppLayout>
      <div className="relative bg-background text-white selection:bg-gold/20 min-h-screen overflow-x-hidden">
        {/* Cinematic Background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <img 
            src="https://images.unsplash.com/photo-1550853024-fae8cd4be47f?auto=format&fit=crop&q=80" 
            className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale"
            alt="Fundo Cinematográfico"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020D24]/90 via-[#010816]/95 to-[#010610]" />
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-soft-light" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_20%,hsl(var(--gold)/0.05),transparent_60%)]" />
        </div>

        <main className="relative z-10">
          {/* 1. HERO - ABERTURA CONTEMPLATIVA - REDUZIDO PARA FLUXO DIRETO */}
          <section className="relative min-h-[60vh] flex items-center justify-center pt-24 pb-20 px-6">
            <ResponsiveContainer size="wide">
              <div className="max-w-4xl mx-auto text-center space-y-12">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="space-y-10"
                >
                  <div className="space-y-6">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 2 }}
                      className="flex items-center justify-center gap-4 text-gold/40"
                    >
                      <span className="h-px w-12 bg-current" />
                      <span className="text-[10px] tracking-[0.5em] uppercase font-medium">A Casa te recebe</span>
                      <span className="h-px w-12 bg-current" />
                    </motion.div>
                    
                    <h1 className="text-5xl md:text-8xl font-serif leading-[1.1] tracking-tight">
                      Clube <span className="text-gold italic">Rotas Oraculares</span>
                    </h1>
                    
                    <div className="pt-4">
                      <p className="text-xl md:text-2xl text-white/70 font-serif italic leading-relaxed max-w-2xl mx-auto">
                        Onde a leitura se transforma em percepção.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center gap-6 pt-4">
                    <Button 
                      variant="gold" 
                      size="xl" 
                      className="rounded-full px-16 h-16 shadow-premium-glow text-lg"
                      onClick={() => navigate('/clube/rotas/rota-dos-lobos')}
                    >
                      Iniciar Rota dos Lobos
                      <ArrowRight className="ml-3 w-5 h-5" />
                    </Button>
                    <button 
                      className="text-white/30 hover:text-gold/60 text-[10px] uppercase tracking-[0.3em] font-bold transition-colors"
                      onClick={() => navigate(hasCidadela ? '/cidadela/revelacao' : '/ferramenta/cartografia-psiquica-oracula')}
                    >
                      {hasCidadela ? 'Ver minha CidadELA' : 'Criar minha CidadELA'}
                    </button>
                  </div>
                </motion.div>
              </div>
            </ResponsiveContainer>

            {/* Visual element for hero */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
          </section>


          {/* 2. BLOCO INTRODUTÓRIO EDITORIAL - REDUZIDO */}
          <section id="intro-editorial" className="relative py-20 px-6 bg-black/40 border-y border-white/5">
            <ResponsiveContainer size="wide">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto text-center"
              >
                <p className="text-2xl md:text-4xl font-serif text-white/90 italic">
                  Sua jornada começa pelo mapa.
                </p>
              </motion.div>
            </ResponsiveContainer>
          </section>

          {/* ÁUDIO DE BOAS-VINDAS */}
          {audioUrl && (
            <section className="relative py-32 border-y border-white/5 bg-black/40 overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/20 blur-[120px] rounded-full animate-pulse" />
              </div>

              <ResponsiveContainer size="wide">
                <div className="max-w-4xl mx-auto space-y-16">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center space-y-6"
                  >
                    <div className="flex flex-col items-center gap-6">
                      <div className="flex items-center gap-3 text-gold/40">
                        <span className="h-px w-8 bg-current" />
                        <span className="text-[10px] tracking-[0.4em] uppercase font-bold">Antes de atravessar</span>
                        <span className="h-px w-8 bg-current" />
                      </div>
                      <h2 className="text-4xl md:text-6xl font-serif text-white tracking-tight italic">
                        Escute o chamado inicial
                      </h2>
                      <p className="text-white/50 text-lg md:text-xl font-serif italic max-w-2xl mx-auto">
                        Escute este áudio como quem entra pela primeira vez numa Casa. Ele não é uma aula. É uma orientação inicial.
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-gold/40 font-bold">
                        A Casa não começa pelas respostas. Começa pelo mapa.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  >
                    <EscutaPremium 
                      audioUrl={audioUrl}
                      titulo={audioTitle}
                      imagemEscuta={audioImage}
                      tipo="Boas-vindas I"
                      className="bg-transparent border border-white/5 shadow-2xl"
                    />
                    {getSetting('portal_rotas_welcome_audio_url_2') && (
                      <EscutaPremium 
                        audioUrl={getSetting('portal_rotas_welcome_audio_url_2')}
                        titulo={getSetting('portal_rotas_welcome_audio_title_2', 'A Voz da Casa II')}
                        imagemEscuta={getSetting('portal_rotas_welcome_audio_image_2', audioImage)}
                        tipo="Boas-vindas II"
                        className="bg-transparent border border-white/5 shadow-2xl"
                      />
                    )}
                  </motion.div>
                </div>
              </ResponsiveContainer>
            </section>
          )}

          {/* 3. BLOCO CIDADELA - FOCO NO MAPA */}
          <section className="px-6 py-48 bg-black/20">
            <ResponsiveContainer size="wide">
              <div className="max-w-5xl mx-auto space-y-24">
                <div className="text-center space-y-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="space-y-4"
                  >
                    <h2 className="text-5xl md:text-7xl font-serif text-white leading-tight">Sua <span className="italic text-gold">CidadELA</span></h2>
                    <p className="text-xl md:text-2xl text-white/50 font-serif italic uppercase tracking-widest">Seu mapa vivo.</p>
                  </motion.div>
                </div>

                <div className="flex justify-center">
                  {hasCidadela ? (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="w-full max-w-4xl bg-white/[0.01] border border-white/5 rounded-[4rem] p-8 md:p-20 relative overflow-hidden shadow-2xl group"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05),transparent_70%)] opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                      <div className="relative z-10 flex flex-col items-center gap-16">
                        <div className="w-full max-w-[500px] drop-shadow-[0_0_50px_rgba(212,175,55,0.15)] hover:scale-105 transition-transform duration-1000">
                          <MiniMapaCidadela 
                            temCartografia={true}
                            distritoDominante={bussola.distritoDominante}
                            distritosAtivos={bussola.distritosAtivos}
                            distritoTensao={bussola.distritoTensao}
                            corHex={bussola.corHex}
                            distritosRaw={bussola.distritosRaw}
                          />
                        </div>
                        
                        <Button 
                          variant="mystical" 
                          size="lg" 
                          className="rounded-full px-12 h-16 border-gold/20 text-gold/80 hover:bg-gold/5 text-lg"
                          onClick={() => navigate('/cidadela/revelacao')}
                        >
                          Ver mapa completo
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="bg-white/[0.01] border border-dashed border-white/10 rounded-[4rem] aspect-square w-full max-w-2xl flex items-center justify-center p-12 text-center group cursor-pointer hover:border-gold/20 transition-colors"
                         onClick={() => navigate('/ferramenta/cartografia-psiquica-oracula')}>
                      <div className="space-y-8 opacity-20 group-hover:opacity-40 transition-opacity">
                        <MapIcon className="w-20 h-20 mx-auto text-gold" />
                        <p className="font-serif italic text-3xl tracking-wide">Territórios aguardando revelação...</p>
                        <p className="text-xs uppercase tracking-[0.3em] font-bold">Toque para começar</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ResponsiveContainer>
          </section>

          {/* 4. BLOCO SYNTHEIA - MINIMALISTA */}
          <section className="px-6 py-48 bg-gradient-to-b from-transparent to-black/40">
            <ResponsiveContainer size="wide">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="space-y-24 text-center"
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-center gap-3 text-gold/40">
                      <MessageSquare className="w-5 h-5" />
                      <span className="text-[11px] tracking-[0.5em] uppercase font-bold">Syntheia Sussurra</span>
                    </div>
                  </div>

                  <div className="min-h-[200px] flex items-center justify-center">
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="text-3xl md:text-5xl font-serif text-white/90 leading-tight italic max-w-3xl"
                    >
                      "{getSetting('portal_rotas_syntheia_quote', 'Só porque você se acostumou, não significa que pertence.')}"
                    </motion.p>
                  </div>
                </motion.div>
              </div>
            </ResponsiveContainer>
          </section>

          {/* 5. SECÇÃO DAS TRAVESSIAS - GALERIA VISUAL */}
          <section className="px-6 py-48 border-t border-white/5">
            <ResponsiveContainer size="wide" className="space-y-32">
              <div className="max-w-4xl mx-auto text-center space-y-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-6"
                >
                  <h2 className="text-5xl md:text-8xl font-serif text-white leading-tight">Travessias da <span className="text-gold italic">Casa</span></h2>
                  <p className="text-2xl md:text-3xl text-white/60 font-serif italic leading-relaxed">
                    "Não escolha pela curiosidade. <br />
                    Escolha pelo chamado."
                  </p>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 max-w-7xl mx-auto items-stretch">
                {/* ROTA DOS LOBOS - CARD PROTAGONISTA */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="lg:col-span-12 group relative"
                >
                  <Card className="bg-[#020D24] border-white/5 overflow-hidden h-full hover:border-gold/30 transition-all duration-1000 shadow-3xl rounded-[4rem]">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                      <div className="relative h-[400px] lg:h-full overflow-hidden group-hover:grayscale-0 transition-all duration-1000">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#020D24]/80 z-10 hidden lg:block" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020D24] to-transparent z-10 lg:hidden" />
                        <img 
                          src={rotaLobosBg} 
                          alt="Rota dos Lobos" 
                          className="w-full h-full object-cover object-[center_20%] scale-110 group-hover:scale-100 transition-transform duration-[3s]" 
                        />
                      </div>
                      
                      <CardContent className="relative z-20 p-12 md:p-20 flex flex-col justify-center space-y-12">
                        <div className="space-y-8">
                          <div className="space-y-4">
                            <Badge className="bg-gold/10 text-gold border-gold/20 px-4 py-1.5 rounded-full text-[10px] tracking-[0.3em] uppercase font-bold">Travessia Ativa</Badge>
                            <h4 className="text-5xl md:text-7xl font-serif text-white group-hover:text-gold transition-colors duration-700">{getSetting('card_lobos_title', 'Rota dos Lobos')}</h4>
                            <p className="text-gold/60 font-serif italic text-2xl">{getSetting('card_lobos_subtitle', 'O retorno da mulher que sabe.')}</p>
                          </div>
                          
                          <p className="text-white/70 leading-relaxed text-xl font-light italic opacity-80 border-l-2 border-gold/20 pl-8 py-2">
                            {getSetting('card_lobos_description', 'Uma travessia para reconhecer onde sua voz foi silenciada e como voltar a confiar no conhecimento que já vive dentro de você.')}
                          </p>
                        </div>
                        
                        <div className="pt-10">
                          <Button 
                            variant="gold" 
                            size="xl"
                            className="rounded-full px-16 h-20 text-xl font-bold shadow-glow-gold hover:scale-105 transition-all duration-500"
                            onClick={() => navigate('/clube/rotas/rota-dos-lobos')}
                          >
                            Entrar na Rota
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </ResponsiveContainer>
          </section>

          {/* 6. ACERVO VIVO - DISCRETO E ELEGANTE */}
          <section className="px-6 py-48 bg-black/40 border-t border-white/5">
            <ResponsiveContainer size="wide">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto"
              >
                <div className="p-12 md:p-24 rounded-[4rem] border border-white/5 bg-white/[0.01] text-center space-y-16">
                  <div className="space-y-8">
                    <div className="w-20 h-20 bg-gold/5 rounded-full flex items-center justify-center border border-gold/10 mx-auto">
                      <BookOpen className="w-8 h-8 text-gold/40" />
                    </div>
                    <div className="space-y-6">
                      <h4 className="text-4xl md:text-5xl font-serif text-white">Acervo Vivo da Casa</h4>
                      <p className="text-xl text-white/50 italic leading-relaxed font-light max-w-2xl mx-auto">
                        "Algumas rotas já abriram seus portões. Outras ainda estão sendo tecidas."
                      </p>
                    </div>
                  </div>

                  <div className="pt-8">
                    <Button 
                      variant="ghost" 
                      className="h-16 px-12 rounded-full bg-white/[0.03] hover:bg-white/[0.06] text-white/60 hover:text-white transition-all border border-white/10 group"
                      onClick={() => navigate('/clube/acervo')}
                    >
                      <span className="text-lg font-light tracking-widest">Explorar Acervo Completo</span>
                      <ArrowRight className="ml-4 w-5 h-5 opacity-40 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </ResponsiveContainer>
          </section>
        </main>
      </div>
    </AppLayout>
  );
}



