import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, Sparkles, ArrowRight, BookOpen, Map, MessageSquare } from 'lucide-react';
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,hsl(206_70%_25%/0.15),transparent_70%)]" />
        </div>

        <main className="relative z-10 pb-32">
          {/* 1. HERO - CHEGADA À CASA */}
          <section className="relative pt-20 md:pt-32 pb-24 px-6">
            <ResponsiveContainer size="wide" className="text-center space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="space-y-6 max-w-4xl mx-auto"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold/40" />
                  <span className="text-[10px] tracking-[0.4em] uppercase text-gold/60 font-medium">Portal das Rotas</span>
                  <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold/40" />
                </div>
                
                <h1 className="text-5xl md:text-8xl font-serif leading-tight tracking-tight">
                  Bem-vinda à <span className="text-gold italic">Casa Orácula</span>
                </h1>
                
                <div className="space-y-4 text-lg md:text-xl text-white/70 font-serif italic max-w-2xl mx-auto leading-relaxed">
                  <p>Toda mulher chega carregando perguntas.</p>
                  <p>Algumas chegam buscando respostas.</p>
                  <p>Outras chegam porque algo dentro delas começou a chamar.</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.5 }}
                className="max-w-2xl mx-auto space-y-8"
              >
                <div className="space-y-6 text-white/60 leading-relaxed font-light text-lg">
                  <p>A Casa não oferece caminhos prontos. A Casa oferece mapas.</p>
                  <p>E cada mapa revela uma parte da travessia que já está acontecendo dentro de você.</p>
                  <p>Talvez você ainda não saiba exatamente o que procura. Talvez exista apenas uma sensação difícil de nomear.</p>
                  <p>Um chamado. Uma inquietação. Uma pergunta que continua voltando.</p>
                  <p>Antes de escolher uma rota, permita-se entrar.</p>
                  <p className="text-gold/80 font-serif italic text-xl">Sua travessia já começou.</p>
                </div>

                <div className="pt-4">
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
              </motion.div>
            </ResponsiveContainer>
          </section>

          {/* 2. BLOCO CIDADELA */}
          <section className="px-6 py-20 border-t border-white/5">
            <ResponsiveContainer size="wide">
              <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-5 space-y-8 text-center lg:text-left">
                    <div className="space-y-4">
                      <h2 className="text-4xl md:text-5xl font-serif text-white">Seu mapa vivo</h2>
                      <div className="space-y-4 text-white/60 leading-relaxed text-lg">
                        <p>A CidadELA não é um lugar.</p>
                        <p>É o retrato simbólico do momento que você está vivendo.</p>
                        <p>Cada território guarda perguntas. Cada território revela padrões. Cada território convida uma parte sua a despertar.</p>
                      </div>
                    </div>

                    {!hasCidadela && (
                      <div className="space-y-6">
                        <p className="text-xs text-gold/40 italic uppercase tracking-widest">
                          A Casa aguarda seu rastro para começar a leitura.
                        </p>
                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="rounded-full border-gold/30 text-gold hover:bg-gold/5"
                          onClick={() => navigate('/ferramenta/cartografia-psiquica-oracula')}
                        >
                          Revelar territórios agora
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-7">
                    {hasCidadela ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 md:p-12 shadow-premium-glow relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                          <div className="space-y-6 order-2 md:order-1">
                            <div className="space-y-4">
                              <p className="text-xl text-white/90 font-serif leading-relaxed italic">
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
                            <Button 
                              variant="mystical" 
                              size="default" 
                              className="rounded-full"
                              onClick={() => navigate('/cidadela/revelacao')}
                            >
                              Ver mapa completo
                            </Button>
                          </div>
                          <div className="order-1 md:order-2 flex justify-center">
                            <div className="w-full max-w-[320px]">
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
                      </motion.div>
                    ) : (
                      <div className="bg-white/[0.01] border border-dashed border-white/10 rounded-[3rem] aspect-square md:aspect-video flex items-center justify-center p-12 text-center">
                        <div className="space-y-4 opacity-30">
                          <Map className="w-12 h-12 mx-auto text-gold" />
                          <p className="font-serif italic text-xl">Territórios aguardando revelação...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ResponsiveContainer>
          </section>

          {/* 3. BLOCO ATLAS */}
          <section className="px-6 py-20 bg-gradient-to-b from-transparent to-black/10">
            <ResponsiveContainer size="wide">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-center space-y-12"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-gold/60">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-[10px] tracking-[0.3em] uppercase font-bold">O Sussurro de Atlas</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif text-white">Alguns sinais aparecem como sonhos.</h2>
                    <div className="max-w-2xl mx-auto space-y-4 text-lg text-white/60 leading-relaxed">
                      <p>Outros como repetições. Outros como perguntas que insistem em permanecer.</p>
                      <p>Atlas observa os rastros da travessia e ajuda a tornar visíveis os territórios que estão pedindo atenção agora.</p>
                    </div>
                  </div>

                  {/* Atlas Suggestions Logic */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
                    {hasCidadela && bussola.distritosAtivos.length > 0 ? (
                      bussola.distritosAtivos.slice(0, 4).map((d) => {
                        let label = "";
                        if (d.key === 'torres') label = "Quando sua voz pede espaço.";
                        else if (d.key === 'espelho_vinculos') label = "Quando os relacionamentos começam a revelar padrões.";
                        else if (d.key === 'praca_abismo') label = "Quando algo dentro de você está mudando.";
                        else if (d.key === 'bosque_arquetipos') label = "Quando uma nova história deseja emergir.";
                        else label = `Território de ${d.nome} em evidência.`;

                        return (
                          <div key={d.key} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-left space-y-3">
                            <Badge variant="outline" className="text-[8px] uppercase tracking-tighter text-gold/40 border-gold/20">{d.nome}</Badge>
                            <p className="text-sm text-white/80 font-serif italic leading-tight">{label}</p>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-full py-12 px-8 rounded-3xl bg-white/[0.01] border border-dashed border-white/5">
                        <p className="text-white/40 italic font-serif text-lg">
                          Ainda não há rastros suficientes para uma leitura simbólica mais precisa.
                          <br />
                          <span className="text-sm">Continue atravessando a Casa. Atlas observa sem pressa.</span>
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </ResponsiveContainer>
          </section>

          {/* 4. SECÇÃO DAS ROTAS */}
          <section className="px-6 py-32">
            <ResponsiveContainer size="wide" className="space-y-16">
              <div className="text-center space-y-6 max-w-3xl mx-auto">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-6xl font-serif text-white">Travessias da Casa</h2>
                  <div className="space-y-4 text-lg text-white/60 leading-relaxed italic">
                    <p>Não escolha pela curiosidade. Escolha pelo chamado.</p>
                    <p>As rotas não foram criadas para ensinar conceitos. Foram criadas para acompanhar momentos da vida que pedem transformação.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
                {/* 5. CARD DA ROTA DOS LOBOS */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="lg:col-span-7 group relative"
                >
                  <Card className="bg-midnight border-gold/20 overflow-hidden h-full hover:border-gold/40 transition-all duration-700 shadow-2xl rounded-[2.5rem]">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#010816] via-[#010816]/60 to-transparent z-10" />
                    <div className="absolute inset-0 opacity-40 grayscale group-hover:opacity-60 transition-opacity duration-1000 scale-105 group-hover:scale-100">
                      <img src="https://images.unsplash.com/photo-1550853024-fae8cd4be47f?auto=format&fit=crop&q=80" alt="Rota dos Lobos" className="w-full h-full object-cover" />
                    </div>
                    
                    <CardContent className="relative z-20 p-10 h-full flex flex-col justify-end min-h-[550px] space-y-8">
                      <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                          <h4 className="text-4xl md:text-5xl font-serif text-white group-hover:text-gold transition-colors">Rota dos Lobos</h4>
                          <p className="text-gold/60 font-serif italic text-lg">O retorno da mulher que sabe.</p>
                        </div>
                        
                        <div className="space-y-4 text-white/70 leading-relaxed text-sm">
                          <p className="italic">Inspirada na obra Mulheres que Correm com os Lobos.</p>
                          <p>Uma travessia para reconhecer:</p>
                          <ul className="list-disc list-inside space-y-1 text-white/50 pl-2">
                            <li>onde sua voz foi silenciada</li>
                            <li>onde seu instinto foi desacreditado</li>
                            <li>onde a adaptação substituiu a verdade</li>
                          </ul>
                          <p>e como voltar a confiar no conhecimento que já vive dentro de você.</p>
                        </div>

                        <div className="pt-4 space-y-4">
                          <p className="text-[10px] uppercase tracking-widest text-gold/40 font-bold">Você encontrará:</p>
                          <div className="flex flex-wrap gap-2">
                            {['Rastreamento simbólico', 'Contos-Espelho', 'Leituras simbólicas', 'Rituais', 'Territórios'].map(t => (
                              <span key={t} className="text-[9px] uppercase tracking-wider text-white/40 border border-white/10 bg-white/5 px-3 py-1 rounded-full">{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-8 border-t border-white/5 space-y-6">
                        <p className="text-white/80 font-serif italic">Quando a mulher volta a escutar a própria natureza, a travessia muda.</p>
                        <Button 
                          variant="gold" 
                          size="lg"
                          className="rounded-full px-10 h-14 font-bold w-full sm:w-auto shadow-glow"
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
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="lg:col-span-5 flex flex-col space-y-8"
                >
                  <div className="p-10 rounded-[2.5rem] border border-white/5 bg-white/[0.02] flex flex-col justify-between h-full space-y-12">
                    <div className="space-y-8">
                      <div className="w-16 h-16 bg-gold/5 rounded-2xl flex items-center justify-center border border-gold/10">
                        <BookOpen className="w-8 h-8 text-gold/40" />
                      </div>
                      <div className="space-y-6">
                        <h4 className="text-3xl font-serif text-white">O Acervo Vivo da Casa</h4>
                        <div className="space-y-4 text-white/50 italic leading-relaxed">
                          <p>Algumas rotas já abriram seus portões. Outras ainda estão sendo tecidas.</p>
                          <p>Na Casa Orácula, cada travessia amadurece antes de ser compartilhada.</p>
                          <p>Porque há caminhos que não podem ser apressados.</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4 pt-4">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gold/40 font-bold">Próximas aberturas</p>
                        <ul className="space-y-3">
                          {['Rota dos Sonhos', 'Rota da Sombra', 'Rota da Voz', 'Rota das Linhagens', 'Rota das Heroínas'].map(r => (
                            <li key={r} className="flex items-center gap-3 text-white/30 text-sm group/item">
                              <span className="w-1.5 h-1.5 rounded-full bg-gold/20 group-hover/item:bg-gold/40 transition-colors" />
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-between h-14 px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                        onClick={() => navigate('/clube/acervo')}
                      >
                        Explorar Acervo
                        <ArrowRight className="w-5 h-5 opacity-40" />
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

