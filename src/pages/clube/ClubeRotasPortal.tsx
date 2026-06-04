import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowRight, BookOpen, MessageSquare, Map as MapIcon } from 'lucide-react';
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
  const hasCidadela = bussola.temCartografia;

  return (
    <AppLayout>
      <div className="relative bg-[#010816] text-white selection:bg-gold/20 min-h-screen overflow-x-hidden">
        {/* Cinematic Background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#020D24] via-[#010816] to-[#010610]" />
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-soft-light" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_20%,hsl(206_70%_25%/0.15),transparent_60%)]" />
        </div>

        <main className="relative z-10 pb-32">
          {/* 1. HERO - CHEGADA À CASA */}
          <section className="relative pt-24 md:pt-40 pb-32 px-6">
            <ResponsiveContainer size="wide">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="space-y-12 max-w-2xl text-left"
                >
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="h-px w-8 bg-gold/40" />
                      <span className="text-[10px] tracking-[0.4em] uppercase text-gold/60 font-medium">Portal das Rotas</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-8xl font-serif leading-[1.1] tracking-tight">
                      Bem-vinda à <br />
                      <span className="text-gold italic">Casa Orácula</span>
                    </h1>
                    
                    <div className="space-y-4 text-xl md:text-2xl text-white/80 font-serif italic leading-relaxed border-l-2 border-gold/20 pl-6 py-2 max-w-xl">
                      <p>Toda mulher chega carregando perguntas.</p>
                      <p>Algumas chegam buscando respostas.</p>
                      <p>Outras chegam porque algo dentro delas começou a chamar.</p>
                    </div>
                  </div>

                  <div className="space-y-8 max-w-xl">
                    <div className="space-y-6 text-white/60 leading-relaxed font-light text-lg md:text-xl">
                      <p>A Casa não oferece caminhos prontos. A Casa oferece mapas.</p>
                      <p>E cada mapa revela uma parte da travessia que já está acontecendo dentro de você.</p>
                      
                      <div className="py-4 opacity-40">
                        <div className="h-px w-16 bg-gold/50" />
                      </div>

                      <p>Talvez você ainda não saiba exatamente o que procura. Talvez exista apenas uma sensação difícil de nomear.</p>
                      <p>Um chamado. Uma inquietação. Uma pergunta que continua voltando.</p>
                      <p className="text-gold/80 font-serif italic text-2xl pt-4">Sua travessia já começou.</p>
                    </div>

                    <div className="pt-6">
                      <Button 
                        variant="gold" 
                        size="xl" 
                        className="rounded-full px-12 h-16 text-lg font-bold shadow-glow group"
                        onClick={() => {
                          if (hasCidadela) {
                            navigate('/cidadela/revelacao');
                          } else {
                            navigate('/ferramenta/cartografia-psiquica-oracula');
                          }
                        }}
                      >
                        Entrar na Minha CidadELA
                        <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                  className="hidden lg:flex justify-center relative"
                >
                  <div className="absolute inset-0 bg-gold/5 blur-[120px] rounded-full animate-pulse" />
                  <div className="relative z-10 w-full max-w-md aspect-square opacity-40 grayscale hover:grayscale-0 transition-all duration-1000">
                    <img 
                      src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80" 
                      alt="Mandala Simbólica" 
                      className="w-full h-full object-cover rounded-full border border-gold/10 p-4"
                    />
                  </div>
                </motion.div>
              </div>
            </ResponsiveContainer>
          </section>

          {/* 2. BLOCO CIDADELA */}
          <section className="px-6 py-32 border-t border-white/5 bg-black/20">
            <ResponsiveContainer size="wide">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                  <div className="lg:col-span-4 space-y-10">
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 text-gold/60">
                        <MapIcon className="w-4 h-4" />
                        <span className="text-[10px] tracking-[0.3em] uppercase font-bold">Cartografia Interior</span>
                      </div>
                      <h2 className="text-5xl md:text-6xl font-serif text-white leading-tight">Seu mapa <span className="italic text-gold/80">vivo</span></h2>
                      <div className="space-y-6 text-white/60 leading-relaxed text-xl font-light">
                        <p>A CidadELA não é um lugar. É o retrato simbólico do momento que você está vivendo.</p>
                        <p className="border-l border-gold/20 pl-6 italic">Cada território guarda perguntas. Cada território revela padrões. Cada território convida uma parte sua a despertar.</p>
                      </div>
                    </div>

                    {!hasCidadela && (
                      <div className="pt-6 space-y-6">
                        <p className="text-xs text-gold/40 italic uppercase tracking-widest">
                          A Casa aguarda seu rastro para começar a leitura.
                        </p>
                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="rounded-full border-gold/30 text-gold hover:bg-gold/5 px-8"
                          onClick={() => navigate('/ferramenta/cartografia-psiquica-oracula')}
                        >
                          Revelar territórios agora
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-8">
                    {hasCidadela ? (
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/[0.01] border border-white/5 rounded-[4rem] p-8 md:p-16 relative overflow-hidden group shadow-2xl"
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05),transparent_70%)]" />
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                          <div className="order-2 md:order-1 flex justify-center">
                            <div className="w-full max-w-[380px] drop-shadow-[0_0_30px_rgba(212,175,55,0.1)]">
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
                          
                          <div className="space-y-8 order-1 md:order-2">
                            <div className="space-y-6">
                              <p className="text-2xl text-white/90 font-serif leading-relaxed italic border-b border-white/5 pb-8">
                                {bussola.leituraSimbolica || "Sua cartografia está ativa e guia seus passos pela Casa."}
                              </p>
                              <div className="space-y-3">
                                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Territórios em evidência</p>
                                <div className="flex flex-wrap gap-2">
                                  {bussola.distritosAtivos.map(d => (
                                    <Badge key={d.key} variant="outline" className="bg-gold/5 border-gold/10 text-gold/70 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-wider">
                                      {d.nome}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <Button 
                              variant="mystical" 
                              size="lg" 
                              className="rounded-full px-10 border-gold/20 text-gold/80 hover:bg-gold/5"
                              onClick={() => navigate('/cidadela/revelacao')}
                            >
                              Ver mapa completo
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="bg-white/[0.01] border border-dashed border-white/10 rounded-[4rem] aspect-square md:aspect-video flex items-center justify-center p-12 text-center">
                        <div className="space-y-6 opacity-20">
                          <Compass className="w-16 h-16 mx-auto text-gold animate-pulse" />
                          <p className="font-serif italic text-2xl tracking-wide">Territórios aguardando revelação...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ResponsiveContainer>
          </section>

          {/* 3. BLOCO SYNTHEIA */}
          <section className="px-6 py-32 bg-gradient-to-b from-transparent to-black/30">
            <ResponsiveContainer size="wide">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-16"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
                    <div className="md:col-span-8 space-y-6">
                      <div className="flex items-center gap-3 text-gold/50">
                        <MessageSquare className="w-5 h-5" />
                        <span className="text-[11px] tracking-[0.4em] uppercase font-bold">Syntheia Sussurra</span>
                      </div>
                      <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">Alguns sinais aparecem como <span className="text-gold/70 italic">sonhos</span>.</h2>
                    </div>
                    <div className="md:col-span-4 pb-2">
                      <div className="h-px w-full bg-gradient-to-r from-gold/30 to-transparent" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="max-w-xl space-y-4 text-lg text-white/60 leading-relaxed font-light">
                      <p>Outros como repetições. Outros como perguntas que insistem em permanecer.</p>
                      <p className="text-white/40 italic text-lg">Atlas observa os rastros da travessia e ajuda a tornar visíveis os territórios que estão pedindo atenção agora.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {hasCidadela && bussola.distritosAtivos.length > 0 ? (
                        bussola.distritosAtivos.slice(0, 4).map((d) => {
                          let label = "";
                          if (d.key === 'torres') label = "Quando sua voz pede espaço.";
                          else if (d.key === 'espelho_vinculos') label = "Quando os relacionamentos revelam padrões.";
                          else if (d.key === 'praca_abismo') label = "Quando algo dentro está mudando.";
                          else if (d.key === 'bosque_arquetipos') label = "Quando uma nova história emerge.";
                          else label = `Território de ${d.nome} em evidência.`;

                          return (
                            <div key={d.key} className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-gold/20 transition-colors space-y-3">
                              <span className="text-[9px] uppercase tracking-widest text-gold/40 font-bold">{d.nome}</span>
                              <p className="text-sm text-white/70 font-serif italic leading-snug">{label}</p>
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-span-2 py-10 px-8 rounded-[2.5rem] bg-white/[0.01] border border-dashed border-white/5 flex items-center justify-center text-center">
                          <p className="text-white/30 italic font-serif text-lg">
                            Ainda não há rastros suficientes para uma leitura simbólica precisa.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </ResponsiveContainer>
          </section>

          {/* 4. SECÇÃO DAS ROTAS */}
          <section className="px-6 py-40">
            <ResponsiveContainer size="wide" className="space-y-24">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
                <div className="lg:col-span-5 space-y-8">
                  <div className="space-y-6">
                    <h2 className="text-5xl md:text-7xl font-serif text-white leading-[1.1]">Travessias da <span className="text-gold italic">Casa</span></h2>
                    <div className="space-y-6 text-xl text-white/60 leading-relaxed font-light italic border-l border-gold/20 pl-8 py-2">
                      <p>Não escolha pela curiosidade. <br />Escolha pelo chamado.</p>
                      <p className="text-lg opacity-70">As rotas não foram criadas para ensinar conceitos. Foram criadas para acompanhar momentos da vida que pedem transformação.</p>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-7 flex justify-end">
                   <div className="h-px w-32 bg-gradient-to-l from-gold/30 to-transparent hidden lg:block" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 max-w-6xl mx-auto items-stretch">
                {/* 5. CARD DA ROTA DOS LOBOS */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="lg:col-span-7 group relative"
                >
                  <Card className="bg-[#020D24] border-white/5 overflow-hidden h-full hover:border-gold/30 transition-all duration-700 shadow-3xl rounded-[3.5rem] flex flex-col">
                    <div className="relative h-[300px] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#020D24] via-transparent to-transparent z-10" />
                      <img 
                        src="https://images.unsplash.com/photo-1550853024-fae8cd4be47f?auto=format&fit=crop&q=80" 
                        alt="Rota dos Lobos" 
                        className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s]" 
                      />
                      <div className="absolute top-8 left-8 z-20">
                         <Badge className="bg-gold/20 text-gold border-gold/20 px-4 py-1.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-bold">Travessia Principal</Badge>
                      </div>
                    </div>
                    
                    <CardContent className="relative z-20 p-12 flex-grow flex flex-col justify-between space-y-12">
                      <div className="space-y-8">
                        <div className="space-y-3">
                          <h4 className="text-5xl md:text-6xl font-serif text-white group-hover:text-gold transition-colors duration-500">Rota dos Lobos</h4>
                          <p className="text-gold/60 font-serif italic text-2xl">O retorno da mulher que sabe.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                          <div className="space-y-6 text-white/70 leading-relaxed text-lg font-light">
                            <p className="italic font-serif opacity-80 border-l border-gold/20 pl-4">Inspirada na obra Mulheres que Correm com os Lobos.</p>
                            <p>Uma travessia para reconhecer onde sua voz foi silenciada e como voltar a confiar no conhecimento que já vive dentro de você.</p>
                          </div>
                          
                          <div className="space-y-6">
                            <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Territórios de Investigação</p>
                            <div className="flex flex-wrap gap-2">
                              {['Rastreamento simbólico', 'Contos-Espelho', 'Rituais'].map(t => (
                                <span key={t} className="text-[10px] uppercase tracking-wider text-white/50 border border-white/5 bg-white/[0.03] px-4 py-1.5 rounded-full">{t}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8">
                        <p className="text-white/50 font-serif italic text-lg max-w-sm text-center sm:text-left">Quando a mulher volta a escutar a própria natureza, a travessia muda.</p>
                        <Button 
                          variant="gold" 
                          size="xl"
                          className="rounded-full px-12 h-16 font-bold shadow-glow-gold hover:scale-105 transition-transform"
                          onClick={() => navigate('/clube/rotas/rota-dos-lobos')}
                        >
                          Iniciar Travessia
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* 6. SECÇÃO “NOVAS ROTAS” */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="lg:col-span-5 flex flex-col h-full"
                >
                  <div className="p-12 md:p-16 rounded-[3.5rem] border border-white/5 bg-white/[0.01] flex flex-col justify-between h-full space-y-16 hover:border-white/10 transition-colors">
                    <div className="space-y-12">
                      <div className="w-20 h-20 bg-gold/5 rounded-3xl flex items-center justify-center border border-gold/10">
                        <BookOpen className="w-10 h-10 text-gold/40" />
                      </div>
                      <div className="space-y-8">
                        <h4 className="text-4xl font-serif text-white">O Acervo Vivo da Casa</h4>
                        <div className="space-y-6 text-white/50 italic leading-relaxed text-xl font-light max-w-sm">
                          <p>Algumas rotas já abriram seus portões. Outras ainda estão sendo tecidas.</p>
                          <p className="text-gold/40">Na Casa Orácula, cada travessia amadurece antes de ser compartilhada.</p>
                          <p>Há caminhos que não podem ser apressados.</p>
                        </div>
                      </div>
                      
                      <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-4">
                          <p className="text-[11px] uppercase tracking-[0.3em] text-white/30 font-bold">Próximas aberturas</p>
                          <div className="h-px flex-grow bg-white/5" />
                        </div>
                        <ul className="grid grid-cols-1 gap-4">
                          {['Rota dos Sonhos', 'Rota da Sombra', 'Rota da Voz', 'Rota das Linhagens'].map(r => (
                            <li key={r} className="flex items-center gap-4 text-white/40 text-lg group/item hover:text-white/70 transition-colors cursor-default">
                              <span className="w-1.5 h-1.5 rounded-full bg-gold/30 group-hover/item:bg-gold/60 transition-colors" />
                              <span className="font-light">{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-10">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-between h-16 px-10 rounded-full bg-white/[0.03] hover:bg-white/[0.06] text-white/40 hover:text-white transition-all border border-white/5"
                        onClick={() => navigate('/clube/acervo')}
                      >
                        <span className="text-lg font-light tracking-wide">Explorar Acervo</span>
                        <ArrowRight className="w-6 h-6 opacity-40 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </ResponsiveContainer>
          </section>
        </main>
      </div>
    </AppLayout>
  );
}


