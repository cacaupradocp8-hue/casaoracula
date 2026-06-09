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
    { id: 'traducao_oracular', title: 'Tradução Oracular' },
    { id: 'caso', title: 'Caso Simbólico' },
    { id: 'revelacao', title: 'Revelação' },
    { id: 'ferramenta', title: 'Ferramenta Oracular' },
    { id: 'jardim_psique', title: 'Jardim da Psique' },
    { id: 'jardim_oficio', title: 'Jardim do Ofício' },
    { id: 'missao', title: 'Missão de Campo' },
    { id: 'fechamento', title: 'Fechamento Ritual' },
    { id: 'conclusao', title: 'Cartografia' }
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
                  <EstacaoStepTraducaoOracular 
                    estacaoId={estacao.id}
                    onNext={handleNext}
                  />
                )}
                
                {/* Other steps will be implemented following the same pattern */}
                {currentStep > 3 && (
                  <div className="text-center space-y-6">
                    <h2 className="text-3xl font-serif">{steps[currentStep].title}</h2>
                    <p className="text-gold/60 italic">Conteúdo em implementação para o template dinâmico.</p>
                    <Button onClick={handleNext} className="bg-gold text-midnight font-bold">Continuar</Button>
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
