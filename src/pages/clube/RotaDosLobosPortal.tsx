import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Compass, ArrowRight, TreePine, Eye, Ghost, Star, Sparkles, Loader2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { Button } from '@/components/ui/button';
import { useTodasRotas } from '@/hooks/useTodasRotas';
import { EscutaPremium } from '@/components/clube/EscutaPremium';
import { useRotaV3 } from '@/hooks/useRotasV3';
import { CartaNarrativa } from '@/components/clube/CartaNarrativa';

export default function RotaDosLobosPortal() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const currentSlug = slug || 'rota-dos-lobos';
  
  const { data: rotaData, isLoading: loadingRota } = useRotaV3(currentSlug);
  const { data: todasEstacoes, isLoading: loadingEstacoes } = useTodasRotas();

  const estacoesDaRota = useMemo(() => {
    if (!todasEstacoes || !rotaData?.station_filter) return [];
    
    // Filtra as estações que pertencem a esta rota baseado no filtro cadastrado
    return todasEstacoes.filter(e => 
      e.livro_titulo === rotaData.station_filter || 
      e.livro_titulo?.includes(rotaData.station_filter)
    ).sort((a, b) => a.numero - b.numero);
  }, [todasEstacoes, rotaData]);

  if (loadingRota || loadingEstacoes) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-[#010816] flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-gold animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!rotaData) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-[#010816] flex flex-col items-center justify-center space-y-6">
          <h2 className="text-3xl font-serif text-white">Rota não encontrada</h2>
          <Button variant="gold" onClick={() => navigate('/clube/rotas')}>Voltar ao Portal</Button>
        </div>
      </AppLayout>
    );
  }

  const fadeIn = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.8 } };

  return (
    <AppLayout>
      <div className="relative bg-[#010816] text-white min-h-screen overflow-x-hidden font-sans">
        
        {/* 1. HERO - CINEMATOGRÁFICO */}
        <section className="relative min-h-[90vh] flex flex-col justify-center pt-20 pb-12 z-10">
          <div className="absolute inset-0 -z-10 overflow-hidden">
             <img 
              src={rotaData.banner_desktop_url || "https://images.unsplash.com/photo-1550853024-fae8cd4be47f?auto=format&fit=crop&q=80"} 
              className="w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 transition-all duration-1000" 
              alt={rotaData.title} 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#010816] via-[#010816]/40 to-transparent" />
          </div>
          <ResponsiveContainer size="wide" className="px-6 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="h-px w-12 bg-gold/40" />
                <span className="text-[10px] tracking-[0.5em] uppercase text-gold font-bold">Portal de Travessia</span>
              </div>
              <h1 className="text-7xl md:text-9xl font-serif tracking-tighter leading-[0.9] mb-8">
                {rotaData.title.split(' ').map((word, i) => (
                  <span key={i} className={i % 2 !== 0 ? "text-gold italic block" : "block"}>{word} </span>
                ))}
              </h1>
              <p className="text-xl md:text-2xl text-white/60 font-serif italic border-l-2 border-gold/30 pl-8 py-2 max-w-2xl leading-relaxed">
                {rotaData.description}
              </p>
            </motion.div>
          </ResponsiveContainer>
        </section>

        {/* 2. ÁUDIO DE ENTRADA - A VOZ DA FLORESTA */}
        {rotaData.audio_welcome_url && (
          <section className="py-32 bg-black/40 border-y border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/20 blur-[150px] rounded-full animate-pulse" />
            </div>
            <ResponsiveContainer size="wide">
              <div className="max-w-4xl mx-auto space-y-16">
                <div className="text-center space-y-4">
                  <h3 className="text-xs uppercase tracking-[0.4em] text-gold/60 font-bold">A Voz do Chamado</h3>
                  <h2 className="text-4xl md:text-5xl font-serif">{rotaData.audio_welcome_title || "A Voz da Travessia"}</h2>
                </div>
                <EscutaPremium 
                  audioUrl={rotaData.audio_welcome_url} 
                  titulo={rotaData.audio_welcome_title || "Boas-vindas"} 
                  imagemEscuta={rotaData.audio_welcome_image || rotaData.banner_desktop_url} 
                  tipo="Entrada" 
                  className="bg-transparent border border-white/5 shadow-2xl" 
                />
              </div>
            </ResponsiveContainer>
          </section>
        )}

        {/* 3. CARTA DE ENTRADA */}
        {rotaData.carta_titulo && (
          <section className="py-40 px-6 bg-[#010816]">
            <ResponsiveContainer size="wide">
              <CartaNarrativa 
                titulo={rotaData.carta_titulo}
                texto={rotaData.carta_texto || ""}
                assinatura={rotaData.carta_assinatura || "A Casa"}
                imagemFundo={rotaData.carta_imagem_url || undefined}
              />
            </ResponsiveContainer>
          </section>
        )}

        {/* 4. SYNTHEIA SUSSURRA - PAINEL VIVO */}
        {rotaData.sussurros && rotaData.sussurros.length > 0 && (
          <section className="py-32 bg-black/20 border-y border-white/5 relative">
            <ResponsiveContainer size="narrow" className="space-y-16">
              <div className="text-center space-y-4">
                <h3 className="text-xs uppercase tracking-[0.4em] text-gold font-bold">Syntheia Sussurra</h3>
                <div className="h-px w-20 bg-gold/30 mx-auto" />
              </div>
              
              <div className="grid grid-cols-1 gap-8">
                {rotaData.sussurros.slice(0, 5).map((sussurro, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 }}
                    className={`flex items-center gap-6 ${idx % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className="text-xl md:text-3xl font-serif italic text-white/80 max-w-xl text-center px-8 py-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-gold/20 transition-colors">
                      "{sussurro}"
                    </div>
                  </motion.div>
                ))}
              </div>
            </ResponsiveContainer>
          </section>
        )}

        {/* 5. ESTAÇÕES - DINÂMICO */}
        <section id="estacoes" className="py-40 px-6">
          <ResponsiveContainer size="wide">
            <div className="text-center space-y-6 mb-24">
              <h2 className="text-5xl md:text-7xl font-serif">As Estações</h2>
              <p className="text-gold/60 font-serif italic text-xl">Cada etapa é um portal para um novo território.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {estacoesDaRota.map((estacao, i) => {
                const isLocked = estacao.status === 'locked';
                const isCompleted = estacao.status === 'completed';
                
                // Determinando o ícone baseado no número ou título (apenas visual)
                let Icon = Compass;
                if (i === 0) Icon = TreePine;
                if (i === 1) Icon = Eye;
                if (i === 2) Icon = Ghost;
                if (i === 3) Icon = Star;
                if (i === 4) Icon = Sparkles;

                return (
                  <motion.div 
                    key={estacao.id} 
                    {...fadeIn} 
                    transition={{ delay: i * 0.1 }}
                    className={`p-10 rounded-[3.5rem] border transition-all duration-500 flex flex-col gap-8 group relative ${
                      isLocked ? 'border-white/5 bg-white/[0.01] opacity-60' : 'border-white/10 bg-white/[0.02] hover:border-gold/30 shadow-2xl'
                    }`}
                  >
                    {isCompleted && (
                      <div className="absolute top-8 right-8">
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/20 px-3 py-1 rounded-full text-[8px] uppercase tracking-widest font-bold">Concluída</Badge>
                      </div>
                    )}
                    
                    <div className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-500 ${
                      isLocked ? 'border-white/10 text-white/20' : 'border-gold/20 text-gold/60 group-hover:scale-110 group-hover:bg-gold/5'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-gold/40">ESTAÇÃO {String(estacao.numero).padStart(2, '0')}</span>
                      </div>
                      <h4 className={`text-3xl font-serif leading-tight ${!isLocked && 'group-hover:text-gold transition-colors'}`}>
                        {estacao.titulo}
                      </h4>
                      <p className="text-lg text-white/40 italic font-serif leading-snug line-clamp-2">
                        "{estacao.subtitulo || estacao.essencia_nucleo || 'Uma nova etapa da travessia.'}"
                      </p>
                    </div>

                    <div className="pt-6 mt-auto">
                      <Button 
                        variant={isLocked ? "ghost" : "gold"} 
                        className={`w-full rounded-full h-14 uppercase tracking-[0.2em] text-[10px] font-bold transition-all ${
                          !isLocked && 'group-hover:shadow-glow-gold'
                        }`} 
                        onClick={() => estacao.primeiro_slug && navigate(`/clube/rota/${estacao.primeiro_slug}`)} 
                        disabled={isLocked}
                      >
                        {isLocked ? "Território Bloqueado" : "Atravessar agora"}
                        {!isLocked && <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />}
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
              
              {!loadingEstacoes && estacoesDaRota.length === 0 && (
                <div className="col-span-full text-center py-20 border border-dashed border-white/5 rounded-[4rem] opacity-30 italic font-serif text-2xl">
                  As estações desta rota estão sendo tecidas.
                </div>
              )}
            </div>
          </ResponsiveContainer>
        </section>

        {/* 6. TERRITÓRIOS ATRAVESSADOS */}
        <section className="py-32 bg-black/40 border-y border-white/5 text-center px-6">
          <ResponsiveContainer size="narrow" className="space-y-12">
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-[0.4em] text-gold/60 font-bold">Cartografia Interior</h3>
              <h2 className="text-3xl md:text-4xl font-serif italic text-white/90">Territórios ativados nesta rota</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-white/40 font-serif italic">
              {['Portão da Chegada', 'Coração da CidadELA', 'Torres', 'Espelho dos Vínculos', 'Labirinto', 'Praça do Abismo', 'Conselho Interior', 'Bosque dos Arquétipos', 'Portal de Renascimento'].map(t => (
                <div key={t} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold/20" />
                  {t}
                </div>
              ))}
            </div>
          </ResponsiveContainer>
        </section>

        {/* 7. CTA FINAL - DINÂMICO */}
        <section className="py-40 text-center px-6 bg-gradient-to-b from-transparent to-black/60 relative">
          <div className="absolute inset-0 -z-10 overflow-hidden opacity-20">
             <img 
              src={rotaData.fechamento_imagem_url || rotaData.banner_desktop_url || ""} 
              className="w-full h-full object-cover" 
              alt="Fechamento" 
             />
          </div>
          <ResponsiveContainer size="narrow" className="space-y-12">
            <h2 className="text-5xl md:text-8xl font-serif text-white leading-tight tracking-tighter">
              A travessia já está <span className="text-gold italic">esperando</span>.
            </h2>
            <Button 
              variant="gold" 
              size="xl" 
              className="rounded-full px-16 h-20 text-lg font-bold uppercase tracking-[0.3em] shadow-premium-glow hover:scale-105 transition-transform" 
              onClick={() => { 
                const firstSlug = estacoesDaRota[0]?.primeiro_slug; 
                if (firstSlug) navigate(`/clube/rota/${firstSlug}`); 
              }}
              disabled={estacoesDaRota.length === 0}
            >
              Iniciar a Jornada
              <ArrowRight className="ml-4 w-6 h-6" />
            </Button>
          </ResponsiveContainer>
        </section>

        {/* Footer Minimal */}
        <footer className="py-20 border-t border-white/5 bg-black/60">
           <ResponsiveContainer size="wide" className="px-6 flex flex-col md:flex-row justify-between items-center gap-8">
              <button 
                className="text-[10px] uppercase tracking-[0.4em] text-white/40 hover:text-gold transition-colors flex items-center gap-2 group" 
                onClick={() => navigate('/clube/rotas')}
              >
                <ArrowRight className="w-3 h-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
                Voltar ao Portal das Rotas
              </button>
              <div className="text-[10px] uppercase tracking-[0.5em] text-white/20 italic">Casa Orácula © 2026</div>
           </ResponsiveContainer>
        </footer>
      </div>
    </AppLayout>
  );
}
