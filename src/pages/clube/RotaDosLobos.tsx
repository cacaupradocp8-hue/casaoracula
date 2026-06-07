import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowRight, TreePine, Eye, Ghost, Star, Sparkles, Headphones } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { EscutaPremium } from '@/components/clube/EscutaPremium';
import { Button } from '@/components/ui/button';
import { useTodasRotas } from '@/hooks/useTodasRotas';
import { useAppSettings } from '@/hooks/useAppSettings';

export default function RotaDosLobos() {
  const navigate = useNavigate();
  const { data: estacoes } = useTodasRotas();
  const { getSetting } = useAppSettings();

  const estacoesAtivas = estacoes?.filter(e => e.ativa) || [];

  const irParaEstacao1 = () => {
    const firstSlug = estacoesAtivas[0]?.primeiro_slug;
    if (firstSlug) navigate(`/clube/rota/${firstSlug}`);
  };

  return (
    <AppLayout>
      <div className="relative bg-[#010816] text-white min-h-screen overflow-x-hidden font-sans">
        {/* HERO CURTO */}
        <section className="relative min-h-[55vh] flex flex-col justify-center pt-16 pb-10 z-10">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <img
              src={getSetting('rota_dos_lobos_hero_image', 'https://images.unsplash.com/photo-1550853024-fae8cd4be47f?auto=format&fit=crop&q=80')}
              className="w-full h-full object-cover grayscale opacity-30 mix-blend-luminosity"
              alt="Floresta"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#010816] via-transparent to-transparent" />
          </div>
          <ResponsiveContainer size="wide" className="px-6 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-serif tracking-tighter leading-tight"
            >
              Rota dos <span className="text-gold italic">Lobos</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-2xl text-gold/60 font-serif italic mt-6 max-w-xl mx-auto"
            >
              "Onde a voz silenciada volta a encontrar o corpo."
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-10"
            >
              <Button
                variant="gold"
                size="xl"
                className="rounded-full px-12 h-16 shadow-premium-glow"
                onClick={irParaEstacao1}
              >
                Entrar na Clareira do Chamado
                <ArrowRight className="ml-3 w-5 h-5" />
              </Button>
            </motion.div>
          </ResponsiveContainer>
        </section>

        {/* A VOZ DA FLORESTA */}
        <section className="py-12 px-6 border-y border-white/5 bg-white/[0.02]">
          <ResponsiveContainer size="wide" className="max-w-4xl text-center">
            <div className="space-y-6">
              <div className="inline-flex p-3 rounded-2xl bg-gold/10 border border-gold/20 text-gold mb-2">
                <Headphones className="w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-white">A Voz da Floresta</h2>
              <p className="text-lg text-white/60 font-serif italic max-w-2xl mx-auto">
                Antes de entrar na primeira estação, escute a abertura da travessia. Este áudio prepara o campo simbólico da Rota dos Lobos.
              </p>
              <div className="pt-4">
                <EscutaPremium 
                  audioUrl={getSetting('audio_acolhimento_rota_lobos', '1780702648962.mp3')}
                  titulo="Acolhimento: Rota dos Lobos"
                  tipo="Abertura da Travessia"
                  funcao="Preparação do Campo Simbólico"
                  className="bg-transparent shadow-none py-0 md:py-0"
                />
              </div>
            </div>
          </ResponsiveContainer>
        </section>

        {/* AS ESTAÇÕES DINÂMICAS */}
        <section id="estacoes" className="py-20 px-6">
          <ResponsiveContainer size="wide">
            <h2 className="text-3xl md:text-4xl font-serif text-center mb-12 text-white/70">As Estações</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {estacoesAtivas.map((estacao, i) => (
                <motion.button
                  key={estacao.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  onClick={() => estacao.status !== 'locked' && estacao.primeiro_slug && navigate(`/clube/rota/${estacao.primeiro_slug}`)}
                  disabled={estacao.status === 'locked'}
                  className="text-left p-6 rounded-3xl border border-white/10 bg-white/[0.02] flex flex-col gap-4 hover:border-gold/30 hover:bg-white/[0.04] transition-all group disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center text-gold/60 group-hover:scale-110 transition-transform">
                      {i % 6 === 0 && <TreePine className="w-5 h-5" />}
                      {i % 6 === 1 && <Eye className="w-5 h-5" />}
                      {i % 6 === 2 && <Ghost className="w-5 h-5" />}
                      {i % 6 === 3 && <Star className="w-5 h-5" />}
                      {i % 6 === 4 && <Sparkles className="w-5 h-5" />}
                      {i % 6 === 5 && <Compass className="w-5 h-5" />}
                      {i % 6 > 5 && <Sparkles className="w-5 h-5" />}
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-gold/40 font-bold">Estação {estacao.numero}</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-serif group-hover:text-gold transition-colors">{estacao.titulo}</h4>
                    <p className="text-sm text-white/50 italic font-serif leading-snug">"{estacao.subtitulo}"</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </ResponsiveContainer>
        </section>

        {/* Footer Minimal */}
        <footer className="py-10 border-t border-white/5 bg-black/40">
          <ResponsiveContainer size="wide" className="px-6 flex justify-between items-center text-[10px] uppercase tracking-widest text-white/20">
            <button className="hover:text-white transition-colors" onClick={() => navigate('/clube/rotas')}>Voltar ao Portal</button>
            <div>Casa Orácula © 2026</div>
          </ResponsiveContainer>
        </footer>
      </div>
    </AppLayout>
  );
}
