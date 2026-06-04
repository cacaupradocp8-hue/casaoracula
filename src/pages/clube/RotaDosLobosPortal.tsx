import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowRight, TreePine, Eye, Ghost, Star, Sparkles, Quote } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { Button } from '@/components/ui/button';
import { useBussolaOracular } from '@/hooks/useBussolaOracular';
import { useTodasRotas } from '@/hooks/useTodasRotas';
import { useAppSettings } from '@/hooks/useAppSettings';
import { EscutaPremium } from '@/components/clube/EscutaPremium';

export default function RotaDosLobosPortal() {
  const navigate = useNavigate();
  const bussola = useBussolaOracular();
  const { data: estacoes } = useTodasRotas();
  const { getSetting } = useAppSettings();

  const audioUrl = getSetting('portal_rotas_welcome_audio_url');
  const audioTitle = "A Voz da Floresta";
  const audioImage = getSetting('portal_rotas_welcome_audio_image');

  const lobosEstacoesRaw = [
    { numero: 1, nome: 'Clareira do Chamado', frase: 'A vida que ainda chama por baixo do funcionamento.', icon: <TreePine className="w-5 h-5" /> },
    { numero: 2, nome: 'Casa da Boa Menina', frase: 'A mulher que aprendeu a desaparecer de forma aceitável.', icon: <Eye className="w-5 h-5" /> },
    { numero: 3, nome: 'Porta Proibida', frase: 'A mulher que negocia com o que já percebeu.', icon: <Ghost className="w-5 h-5" /> },
    { numero: 4, nome: 'Casa da Boneca Interior', frase: 'A mulher que volta a confiar no que percebe.', icon: <Star className="w-5 h-5" /> },
    { numero: 5, nome: 'Margem dos Ossos', frase: 'O amor depois da superfície.', icon: <Sparkles className="w-5 h-5" /> },
    { numero: 6, nome: 'Território da Loba', frase: 'A mulher que volta para a própria vida.', icon: <Compass className="w-5 h-5" /> },
  ];

  const lobosEstacoes = lobosEstacoesRaw.map(base => {
    const dbEst = estacoes?.find(e => e.numero === base.numero);
    return { ...base, dbData: dbEst, isLocked: dbEst ? dbEst.status === 'locked' : true, completed: dbEst ? dbEst.status === 'completed' : false, slug: dbEst?.primeiro_slug };
  });

  const fadeIn = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.8 } };

  return (
    <AppLayout>
      <div className="relative bg-[#010816] text-white min-h-screen overflow-x-hidden font-sans">
        {/* 1. HERO - CINEMATOGRÁFICO */}
        <section className="relative min-h-[80vh] flex flex-col justify-center pt-20 pb-12 z-10">
          <div className="absolute inset-0 -z-10 overflow-hidden">
             <img src="https://images.unsplash.com/photo-1550853024-fae8cd4be47f?auto=format&fit=crop&q=80" className="w-full h-full object-cover grayscale opacity-20" alt="Floresta" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#010816] via-transparent to-transparent" />
          </div>
          <ResponsiveContainer size="wide" className="px-6">
            <h1 className="text-6xl md:text-9xl font-serif tracking-tighter leading-[0.9]">Rota dos<br/><span className="text-gold italic">Lobos</span></h1>
            <h2 className="text-xl md:text-2xl text-gold/80 font-serif border-l-2 border-gold/30 pl-6 py-2 mt-8">Jornada de Recuperação da Natureza Instintiva</h2>
          </ResponsiveContainer>
        </section>

        {/* 2. ÁUDIO DE ENTRADA */}
        {audioUrl && (
          <section className="py-24 bg-black/40 border-y border-white/5">
            <ResponsiveContainer size="wide">
              <EscutaPremium audioUrl={audioUrl} titulo={audioTitle} imagemEscuta={audioImage} tipo="Entrada" className="bg-transparent" />
            </ResponsiveContainer>
          </section>
        )}

        {/* 3. CARTA DE ENTRADA */}
        <section className="py-32 px-6">
          <ResponsiveContainer size="narrow" className="space-y-8">
            <motion.h3 {...fadeIn} className="text-3xl font-serif">Antes de entrar na floresta</motion.h3>
            <motion.p {...fadeIn} className="text-lg text-white/70 leading-relaxed">Você está prestes a atravessar uma floresta simbólica. Não é uma jornada de curso. É um retorno ao que foi silenciado em você. Deixe a pressa na entrada.</motion.p>
          </ResponsiveContainer>
        </section>

        {/* 4. SYNTHEIA SUSSURRA */}
        <section className="py-24 bg-black/20 border-y border-white/5 text-center px-6">
          <ResponsiveContainer size="narrow" className="space-y-6">
            <h3 className="text-xs uppercase tracking-[0.3em] text-gold font-bold">Syntheia Sussurra</h3>
            <p className="text-2xl font-serif italic text-white/80">"O instinto raramente grita. Primeiro ele sussurra."</p>
          </ResponsiveContainer>
        </section>

        {/* 5. SEIS ESTAÇÕES */}
        <section id="estacoes" className="py-32 px-6">
          <ResponsiveContainer size="wide">
            <h2 className="text-5xl font-serif text-center mb-20">As Seis Estações</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {lobosEstacoes.map((estacao, i) => (
                <motion.div 
                  key={i} 
                  {...fadeIn} 
                  transition={{ delay: i * 0.1 }}
                  className="p-10 rounded-[2.5rem] border border-white/10 bg-white/[0.02] flex flex-col gap-8 hover:border-gold/30 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center text-gold/60 group-hover:scale-110 transition-transform">
                    {estacao.icon}
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-3xl font-serif group-hover:text-gold transition-colors">{estacao.nome}</h4>
                    <p className="text-lg text-white/50 italic font-serif leading-snug">"{estacao.frase}"</p>
                  </div>
                  <div className="pt-4 mt-auto">
                    <Button 
                      variant={estacao.isLocked ? "ghost" : "gold"} 
                      className="w-full rounded-full h-12 uppercase tracking-widest text-[10px] font-bold" 
                      onClick={() => estacao.slug && navigate(`/clube/rota/${estacao.slug}`)} 
                      disabled={estacao.isLocked}
                    >
                      {estacao.isLocked ? "Território Bloqueado" : "Atravessar agora"}
                      {!estacao.isLocked && <ArrowRight className="ml-2 w-3 h-3" />}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </ResponsiveContainer>
        </section>

        {/* 6. TERRITÓRIOS ATRAVESSADOS */}
        <section className="py-32 bg-black/40 border-y border-white/5 text-center px-6">
          <ResponsiveContainer size="narrow" className="space-y-12">
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-[0.3em] text-gold font-bold">Cartografia</h3>
              <h2 className="text-3xl font-serif">Territórios ativados nesta rota</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4 text-sm text-white/40 font-serif italic">
              {['Portão da Chegada', 'Coração da CidadELA', 'Torres', 'Espelho dos Vínculos', 'Labirinto', 'Praça do Abismo', 'Conselho Interior', 'Bosque dos Arquétipos', 'Portal de Renascimento'].map(t => (
                <div key={t} className="flex items-center gap-2 justify-center">
                  <div className="w-1 h-1 rounded-full bg-gold/40" />
                  {t}
                </div>
              ))}
            </div>
          </ResponsiveContainer>
        </section>

        {/* 7. CTA FINAL */}
        <section className="py-40 text-center px-6 bg-gradient-to-b from-transparent to-black/40">
          <ResponsiveContainer size="narrow" className="space-y-12">
            <h2 className="text-5xl md:text-7xl font-serif text-white leading-tight">A floresta já está esperando.</h2>
            <Button 
              variant="gold" 
              size="lg" 
              className="rounded-full px-16 h-16 text-base font-bold uppercase tracking-[0.2em] shadow-premium-glow" 
              onClick={() => { const firstSlug = lobosEstacoes[0]?.slug; if (firstSlug) navigate(`/clube/rota/${firstSlug}`); }}
            >
              Entrar na Clareira do Chamado
              <ArrowRight className="ml-3 w-5 h-5" />
            </Button>
          </ResponsiveContainer>
        </section>

        {/* Footer Minimal */}
        <footer className="py-12 border-t border-white/5 bg-black/40">
           <ResponsiveContainer size="wide" className="px-6 flex justify-between items-center text-[10px] uppercase tracking-widest text-white/20">
              <button className="hover:text-white transition-colors" onClick={() => navigate('/clube/rotas')}>Voltar ao Portal das Rotas</button>
              <div>Casa Orácula © 2026</div>
           </ResponsiveContainer>
        </footer>
      </div>
    </AppLayout>
  );
}
