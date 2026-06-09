import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { useEstacaoConteudo } from '@/hooks/useClubeTemplate';
import { EstacaoProgressHeader } from '@/components/clube/rota-template/EstacaoProgressHeader';
import { EstacaoStepEntrada } from '@/components/clube/rota-template/EstacaoStepEntrada';
import { EstacaoStepEscuta } from '@/components/clube/rota-template/EstacaoStepEscuta';
import { EstacaoStepCamaraEscuta } from '@/components/clube/rota-template/EstacaoStepCamaraEscuta';
import { EstacaoStepTraducaoOracular } from '@/components/clube/rota-template/EstacaoStepTraducaoOracular';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function ClubeRotaPremium() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: estacao, isLoading, error } = useEstacaoConteudo(slug || '');
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 'entrada', title: 'Entrada' },
    { id: 'escuta_ritual', title: 'Escuta Ritual' },
    { id: 'camara_escuta', title: 'Câmara da Escuta' },
    { id: 'conto_loba', title: 'Conto: La Loba' },
    { id: 'sussurros', title: 'Sussurros do Conto' },
    { id: 'traducao_oracular', title: 'Tradução Oracular' },
    { id: 'caso', title: 'Caso Simbólico' },
    { id: 'desafio', title: 'Desafio de Escuta' },
    { id: 'ferramenta', title: 'Ferramenta Oracular' },
    { id: 'jardim_psique', title: 'Jardim da Psique' },
    { id: 'jardim_oficio', title: 'Jardim do Ofício' },
    { id: 'missao', title: 'Missão de Campo' },
    { id: 'oraculo', title: 'Oráculo da Estação' },
    { id: 'conclusao', title: 'Cartografia da Loba' },
    { id: 'fechamento', title: 'Fechamento 80/20' }
  ];


  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-gold gap-4">
        <Loader2 className="w-12 h-12 animate-spin" />
        <span className="font-serif italic tracking-widest animate-pulse">Iniciando travessia...</span>
      </div>
    );
  }

  if (error || !estacao) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white font-serif">
        Estação não encontrada.
      </div>
    );
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(`/clube/rotas/${estacao.clube_rotas.slug}`);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(`/clube/rotas/${estacao.clube_rotas.slug}`);
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <AppLayout>
      <div className="bg-[#020617] min-h-screen text-white relative overflow-hidden">
        {/* Background Image Container */}
        <div className="fixed inset-0 z-0">
          <img 
            src={slug === 'clareira-do-chamado' ? "/clareira-chamado.png" : (estacao.banner_url || "https://pviznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/content-images/galeria/1781036067341-z7r4tq.jpg")} 
            alt="" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/50 via-[#020617]/20 to-[#020617]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 pt-12 pb-32 min-h-screen flex flex-col">
          <EstacaoProgressHeader 
            currentStep={currentStep}
            totalSteps={steps.length}
            progressPercentage={progressPercentage}
            onBack={handleBack}
          />

          <main className="flex-grow flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className="w-full"
              >
                {currentStep === 0 && (
                  <EstacaoStepEntrada 
                    titulo={estacao.titulo || estacao.nome}
                    fraseAbertura={estacao.frase_abertura}
                    fraseVozClareira={estacao.frase_voz_clareira}
                    onNext={handleNext}
                    onJumpToStep={setCurrentStep}
                    audioAberturaUrl={estacao.audio_abertura_url}
                    audioVozClareiraUrl={estacao.audio_voz_clareira_url}
                    audioFlorestaUrl={estacao.audio_floresta_url}
                    imagemEscuta={slug === 'clareira-do-chamado' ? "/clareira-chamado.png" : (estacao.banner_url || "https://pviznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/content-images/galeria/1781036067341-z7r4tq.jpg")}
                    obraRegente={estacao.clube_rotas.obra_regente}
                    infoContent={slug === 'clareira-do-chamado' ? {
                      distrito: "Bosque dos Arquétipos / Portão da Chegada",
                      tese: "A mulher não perdeu o instinto; ela o enterrou para sobreviver.",
                      detalhes: [
                        "Conto-base: La Loba",
                        "Competência formada: reconhecer vitalidade soterrada",
                        "Ferramenta: Mapa do Instinto Soterrado"
                      ]
                    } : {
                      distrito: estacao.distrito_cidadela,
                      tese: estacao.frase_voz_clareira,
                      detalhes: ["Conteúdo da estação carregado dinamicamente."]
                    }}
                  />
                )}

                {currentStep === 1 && (
                  <EstacaoStepEscuta 
                    estacaoId={estacao.id}
                    obraRegente={estacao.clube_rotas.obra_regente}
                    livroCapaUrl={estacao.clube_rotas.livro_capa_url}
                    livroBannerUrl={estacao.livro_imagem_banner_url}
                    audioVozClareiraUrl={estacao.audio_voz_clareira_url}
                    audioAberturaUrl={estacao.audio_abertura_url}
                    audioFlorestaUrl={estacao.audio_floresta_url}
                    spotifyPlaylistUrl={estacao.spotify_playlist_url}
                    spotifyPlaylists={estacao.spotify_playlists}
                    vozClareiraTexto={estacao.voz_clareira_texto}
                  />
                )}

                {currentStep === 2 && (
                  <EstacaoStepCamaraEscuta 
                    estacaoId={estacao.id}
                    onNext={handleNext}
                  />
                )}

                {currentStep === 3 && (
                  <div className="text-center space-y-8">
                    <div className="space-y-4">
                      <span className="text-[10px] text-gold uppercase tracking-[0.3em] font-bold">4. Conto / Voz da Loba</span>
                      <h2 className="text-4xl font-serif text-white italic">La Loba</h2>
                    </div>
                    <div className="max-w-2xl mx-auto">
                      <EscutaPremium 
                        audioUrl={estacao.audio_voz_clareira_url} 
                        titulo="La Loba — O Conto Narrado"
                        imagemEscuta={estacao.clube_rotas.livro_capa_url}
                      />
                    </div>
                    <Button onClick={handleNext} className="bg-gold text-midnight font-bold rounded-full px-12 py-6">Escutar os Sussurros</Button>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="text-center space-y-8 max-w-2xl mx-auto">
                    <div className="space-y-4">
                      <span className="text-[10px] text-gold uppercase tracking-[0.3em] font-bold">5. Sussurros do Conto</span>
                      <h2 className="text-4xl font-serif text-white">O que o conto revela?</h2>
                    </div>
                    <div className="grid gap-4 text-left">
                      {[
                        "O que este conto tenta revelar?",
                        "O que foi soterrado?",
                        "Que imagem insiste?",
                        "Quem recolhe os ossos?",
                        "O que ainda canta?"
                      ].map((q, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 italic font-serif text-lg text-white/80">
                          {q}
                        </div>
                      ))}
                    </div>
                    <Button onClick={handleNext} className="bg-gold text-midnight font-bold rounded-full px-12 py-6">Avançar para Tradução</Button>
                  </div>
                )}

                {currentStep === 5 && (
                  <EstacaoStepTraducaoOracular 
                    estacaoId={estacao.id}
                    onNext={handleNext}
                  />
                )}

                {currentStep === 6 && (
                  <div className="text-center space-y-8 max-w-2xl mx-auto">
                    <div className="space-y-4">
                      <span className="text-[10px] text-gold uppercase tracking-[0.3em] font-bold">7. Caso Simbólico</span>
                      <h2 className="text-4xl font-serif text-white italic">O Espelho do Atendimento</h2>
                    </div>
                    
                    <Card className="bg-white/5 border-white/10 p-8 rounded-[2rem] text-left space-y-6">
                      <div className="space-y-2">
                        <h4 className="text-gold font-serif text-2xl italic">{estacao.caso_simbolico?.titulo || 'Helena, 42 anos'}</h4>
                        <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Perfil: Terapeuta</p>
                      </div>
                      <p className="text-lg font-serif italic text-white/80 leading-relaxed whitespace-pre-line">
                        {estacao.caso_simbolico?.relato || "“Minha vida funciona, mas não me toca.”\n\nHelena sente que, apesar de toda a formação e sucesso aparente, há um vazio de direção que os livros não preenchem."}
                      </p>
                    </Card>

                    <Button onClick={handleNext} className="bg-gold text-midnight font-bold rounded-full px-12 py-6">Enfrentar o Desafio</Button>
                  </div>
                )}

                {currentStep === 7 && (
                  <div className="text-center space-y-8 max-w-2xl mx-auto">
                    <div className="space-y-4">
                      <span className="text-[10px] text-gold uppercase tracking-[0.3em] font-bold">8. Desafio de Escuta</span>
                      <h2 className="text-4xl font-serif text-white">O que você percebe primeiro?</h2>
                    </div>

                    <div className="grid gap-3">
                      {[
                        "Falta de motivação",
                        "Excesso de formação",
                        "Instinto soterrado",
                        "Necessidade de planejamento"
                      ].map((opt, i) => (
                        <button key={i} className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/50 hover:bg-gold/5 transition-all text-left text-white/70 font-serif text-lg">
                          {opt}
                        </button>
                      ))}
                    </div>

                    <Button onClick={handleNext} className="bg-white/10 text-white font-bold rounded-full px-12 py-6">Revelar Leitura-Modelo</Button>
                  </div>
                )}
                
                {currentStep > 7 && (
                  <div className="text-center space-y-6">
                    <h2 className="text-3xl font-serif">{steps[currentStep].title}</h2>
                    <p className="text-gold/60 italic">Conteúdo em implementação para o template dinâmico.</p>
                    <Button onClick={handleNext} className="bg-gold text-midnight font-bold rounded-full px-12 py-6">Continuar</Button>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
