import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, Sparkles, ArrowRight, Map, BookOpen, Leaf, Headphones } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { Button } from '@/components/ui/button';
import { useBussolaOracular } from '@/hooks/useBussolaOracular';
import { useAuth } from '@/contexts/AuthContext';
import { MiniMapaCidadela } from '@/components/bussola-home';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffectivePortal } from '@/hooks/useEffectivePortal';

export default function ClubeRotasPortal() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const bussola = useBussolaOracular();
  const { effectivePortal } = useEffectivePortal();

  const isTerapeuta = effectivePortal === 'oracula' || effectivePortal === 'admin';
  const isAssinante = effectivePortal === 'assinante';
  const hasCidadela = bussola.temCartografia;

  return (
    <AppLayout>
      <div className="relative bg-[#010816] text-white selection:bg-gold/20 min-h-screen overflow-x-hidden">
        {/* Cinematic Background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#020D24] via-[#010816] to-[#010610]" />
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-soft-light" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,hsl(206_70%_25%/0.15),transparent_70%)]" />
        </div>

        <main className="relative z-10 pb-32">
          {/* 1. HERO - CHEGADA À CASA */}
          <section className="relative pt-12 md:pt-20 pb-16 px-6">
            <ResponsiveContainer size="wide" className="text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold/40" />
                  <span className="text-[10px] tracking-[0.4em] uppercase text-gold/60 font-medium">Portal das Rotas</span>
                  <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold/40" />
                </div>
                <h1 className="text-5xl md:text-7xl font-serif leading-tight tracking-tight">
                  Rotas da <span className="text-gold italic">Casa</span>
                </h1>
                <p className="text-lg md:text-xl text-white/60 font-serif italic max-w-2xl mx-auto">
                  Travessias simbólicas para mulheres que desejam voltar a escutar a própria verdade.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.5 }}
                className="max-w-3xl mx-auto p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-md"
              >
                <div className="space-y-6 text-white/70 leading-relaxed font-light">
                  <p>Você não chegou a uma plataforma de cursos.</p>
                  <p className="text-xl text-white/90 font-serif">Você chegou a uma Casa.</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
                    {[
                      { label: 'rota', item: 'travessia', icon: Compass },
                      { label: 'estação', item: 'território', icon: Map },
                      { label: 'ferramenta', item: 'espelho', icon: Sparkles },
                      { label: 'jardim', item: 'rastro', icon: Leaf },
                    ].map((item, i) => (
                      <div key={i} className="space-y-1">
                        <item.icon className="w-4 h-4 mx-auto text-gold/40" />
                        <p className="text-[10px] uppercase tracking-widest text-white/30">Cada {item.label}</p>
                        <p className="text-xs text-gold/60 font-serif italic">é um {item.item}</p>
                      </div>
                    ))}
                  </div>
                  <p className="italic">
                    Antes de escolher um caminho, a Casa convida você a revelar sua CidadELA.<br/>
                    Porque nenhuma travessia começa fora. Toda travessia começa quando algo dentro começa a chamar.
                  </p>
                </div>
              </motion.div>
            </ResponsiveContainer>
          </section>

          {/* 2. BLOCO CIDADELA */}
          <section className="px-6 py-12">
            <ResponsiveContainer size="wide">
              <div className="max-w-4xl mx-auto">
                {!hasCidadela ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="p-10 rounded-[3rem] border border-gold/20 bg-gold/5 text-center space-y-8 shadow-premium-glow"
                  >
                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto border border-gold/20">
                      <Compass className="w-8 h-8 text-gold animate-pulse" />
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-3xl font-serif text-gold">Revele sua CidadELA</h2>
                      <p className="text-white/60 max-w-lg mx-auto">
                        A CidadELA é o mapa vivo da sua travessia na Casa Orácula. 
                        Ela revela os territórios internos que estão ativos agora: 
                        portas, torres, labirinto, vínculos, sonhos, abismos, renascimentos.
                      </p>
                      <p className="text-xs text-gold/40 italic uppercase tracking-widest">
                        Ao revelar sua CidadELA, a Casa começa a compreender por onde sua travessia deseja começar.
                      </p>
                    </div>
                    <Button 
                      variant="gold" 
                      size="xl" 
                      className="rounded-full px-12 h-16 text-lg font-bold shadow-glow"
                      onClick={() => navigate('/ferramenta/cartografia-psiquica-oracula')}
                    >
                      Revelar minha CidadELA
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                      <div className="space-y-1 text-center md:text-left">
                        <h2 className="text-3xl font-serif text-white">Minha CidadELA</h2>
                        <p className="text-white/40 text-sm italic">Seu mapa ativo agora.</p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="rounded-full border-gold/30 text-gold hover:bg-gold/5"
                        onClick={() => navigate('/cidadela/revelacao')}
                      >
                        Ver mapa completo
                      </Button>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 md:p-12 overflow-hidden">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1 space-y-6">
                           <div className="space-y-4">
                              <p className="text-lg text-white/80 font-serif leading-relaxed italic">
                                {bussola.leituraSimbolica || "Sua cartografia está ativa e guia seus passos pela Casa."}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {bussola.distritosAtivos.map(d => (
                                  <Badge key={d.key} variant="outline" className="bg-gold/10 border-gold/20 text-gold/80 px-3 py-1">
                                    {d.nome}
                                  </Badge>
                                ))}
                              </div>
                           </div>
                           
                           {isTerapeuta && (
                             <div className="pt-6 border-t border-white/5 space-y-4">
                                <p className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold">Acesso Terapeuta</p>
                                <div className="grid grid-cols-2 gap-4">
                                  <Button variant="ghost" className="justify-start gap-2 h-12 bg-white/5 hover:bg-white/10" onClick={() => navigate('/clube/treinamento')}>
                                    <Headphones className="w-4 h-4 text-emerald-500" />
                                    Câmara do Sussurro
                                  </Button>
                                  <Button variant="ghost" className="justify-start gap-2 h-12 bg-white/5 hover:bg-white/10" onClick={() => navigate('/sala-de-treinamento')}>
                                    <Leaf className="w-4 h-4 text-emerald-500" />
                                    Jardim do Ofício
                                  </Button>
                                </div>
                             </div>
                           )}

                           <div className="pt-4">
                              <Button 
                                variant="gold" 
                                size="lg" 
                                className="rounded-full px-10 h-14 font-bold"
                                onClick={() => navigate(bussola.acaoPrincipal.rota)}
                              >
                                {bussola.acaoPrincipal.texto || 'Continuar nas Rotas'}
                                <ArrowRight className="ml-2 w-4 h-4" />
                              </Button>
                           </div>
                        </div>
                        <div className="order-1 lg:order-2 flex justify-center">
                          <div className="w-full max-w-[400px]">
                            <MiniMapaCidadela 
                              temCartografia={true}
                              distritoDominante={bussola.distritoDominante}
                              distritosAtivos={bussola.distritosAtivos}
                              distritoTensao={bussola.distritoTensao}
                              corHex={bussola.corHex}
                              distritosRaw={bussola.distritosRaw}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ResponsiveContainer>
          </section>

          {/* 3. LISTA DE ROTAS */}
          <section className="px-6 py-20 bg-gradient-to-b from-transparent to-black/20">
            <ResponsiveContainer size="wide" className="space-y-12">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold/60" />
                  <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-white/40">Travessias da Casa</h2>
                </div>
                <h3 className="text-4xl md:text-5xl font-serif text-white">Escolha sua Rota</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* ROTA DOS LOBOS */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="group relative"
                >
                  <Card className="bg-midnight border-gold/20 overflow-hidden h-full hover:border-gold/40 transition-all duration-500 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 z-10" />
                    <div className="absolute inset-0 opacity-40 grayscale group-hover:opacity-60 transition-opacity duration-700">
                      <img src="https://images.unsplash.com/photo-1550853024-fae8cd4be47f?auto=format&fit=crop&q=80" alt="Rota dos Lobos" className="w-full h-full object-cover" />
                    </div>
                    
                    <CardContent className="relative z-20 p-8 h-full flex flex-col justify-end min-h-[400px] space-y-6">
                      <div className="space-y-2">
                        <Badge className="bg-gold/20 border-gold/30 text-gold text-[9px] tracking-widest uppercase">Obra Matriz</Badge>
                        <h4 className="text-3xl md:text-4xl font-serif text-white group-hover:text-gold transition-colors">Rota dos Lobos</h4>
                        <p className="text-gold/60 font-serif italic">Uma jornada de recuperação da natureza instintiva.</p>
                      </div>
                      
                      <p className="text-white/60 text-sm leading-relaxed line-clamp-3">
                        Uma travessia pela obra Mulheres que Correm com os Lobos para reconhecer onde a mulher se afastou de sua natureza instintiva, onde foi domesticada, onde silenciou o que já sabia e como começa a retornar para si.
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {['Portão da Chegada', 'Coração da CidadELA', 'Torres', 'Espelho dos Vínculos'].map(t => (
                          <span key={t} className="text-[8px] uppercase tracking-wider text-white/30 border border-white/10 px-2 py-0.5 rounded-full">{t}</span>
                        ))}
                      </div>

                      <div className="pt-6">
                        <Button 
                          variant="gold" 
                          className="rounded-full px-8 h-12 font-bold w-full sm:w-auto"
                          onClick={() => navigate('/clube/rotas/rota-dos-lobos')}
                        >
                          Entrar na Rota dos Lobos
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* PRÓXIMAS ROTAS (Convite) */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="p-8 rounded-3xl border border-white/5 bg-white/[0.01] flex flex-col justify-center items-center text-center space-y-6"
                >
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white/20" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-serif text-white/40">Novas Travessias</h4>
                    <p className="text-sm text-white/20 italic max-w-xs mx-auto">
                      A Casa está tecendo as próximas rotas do acervo. Cada estação é preparada com o cuidado do tempo.
                    </p>
                  </div>
                  <Button variant="ghost" className="text-xs uppercase tracking-widest text-white/30 hover:text-white" onClick={() => navigate('/clube/acervo')}>
                    Explorar Acervo <BookOpen className="ml-2 w-3 h-3" />
                  </Button>
                </motion.div>
              </div>
            </ResponsiveContainer>
          </section>
        </main>
      </div>
    </AppLayout>
  );
}
