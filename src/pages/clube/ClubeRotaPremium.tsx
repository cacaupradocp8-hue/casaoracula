import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AppLayout } from '@/components/layout/AppLayout';
import { useEstacaoConteudo } from '@/hooks/useClubeTemplate';
import { EstacaoProgressHeader } from '@/components/clube/rota-template/EstacaoProgressHeader';
import { EstacaoStepEntrada } from '@/components/clube/rota-template/EstacaoStepEntrada';
import { EstacaoStepEscuta } from '@/components/clube/rota-template/EstacaoStepEscuta';
import { EstacaoStepCamaraEscuta } from '@/components/clube/rota-template/EstacaoStepCamaraEscuta';
import { EstacaoStepTraducaoOracular } from '@/components/clube/rota-template/EstacaoStepTraducaoOracular';
import { EstacaoStepSussurrosConto } from '@/components/clube/rota-template/EstacaoStepSussurrosConto';
import { EstacaoStepCasoSimbolico } from '@/components/clube/rota-template/EstacaoStepCasoSimbolico';
import { EstacaoStepDesafioEscuta } from '@/components/clube/rota-template/EstacaoStepDesafioEscuta';
import { EstacaoStepFerramentaOracular } from '@/components/clube/rota-template/EstacaoStepFerramentaOracular';
import { MapaInstintoSoterrado } from '@/components/clube/MapaInstintoSoterrado';
import { EstacaoStepJardim } from '@/components/clube/rota-template/EstacaoStepJardim';
import { EstacaoStepMissaoCampo } from '@/components/clube/rota-template/EstacaoStepMissaoCampo';
import { EstacaoStepOraculo } from '@/components/clube/rota-template/EstacaoStepOraculo';
import { EstacaoStepCartografiaLoba } from '@/components/clube/rota-template/EstacaoStepCartografiaLoba';
import { EstacaoStepFechamento } from '@/components/clube/rota-template/EstacaoStepFechamento';
import { MapaEstacaoClareira } from '@/components/clube/rota-template/MapaEstacaoClareira';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EscutaPremium } from '@/components/clube/EscutaPremium';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useFounderAccess } from '@/hooks/useFounderAccess';
import { FounderTransitionPortal } from '@/components/clube/FounderTransitionPortal';
import { ColheitaRastrosExperience } from '@/components/clube/ColheitaRastrosExperience';
import { toast } from 'sonner';

export default function ClubeRotaPremium() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isActive: isFounder } = useFounderAccess();
  const { data: estacao, isLoading, error } = useEstacaoConteudo(slug || '');
  const [currentStep, setCurrentStep] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const [showTransitionPortal, setShowTransitionPortal] = useState(false);
  const [showColheita, setShowColheita] = useState(false);

  const steps = [
    { id: 'entrada', title: 'Entrada' },
    { id: 'escuta_ritual', title: 'Escuta Ritual' },
    { id: 'camara_escuta', title: 'Câmara da Escuta' },
    { id: 'sussurros', title: 'Sussurros do Conto' },
    { id: 'traducao_oracular', title: 'Tradução Oracular' },
    { id: 'caso', title: 'Caso Simbólico' },
    { id: 'desafio_escuta', title: 'Desafio de Escuta' },
    { id: 'ferramenta_oracular', title: 'Ferramenta Oracular' },
    { id: 'jardim_psique', title: 'Jardim da Psique' },
    { id: 'jardim_oficio', title: 'Jardim do Ofício' },
    { id: 'missao_campo', title: 'Missão de Campo' },
    { id: 'oraculo', title: 'Oráculo da Estação' },
    { id: 'cartografia', title: 'Cartografia da Loba' },
    { id: 'proximos_passos', title: 'Fechamento 80/20' }
  ];

  // Carregar progresso inicial
  useEffect(() => {
    const loadProgress = async () => {
      if (!user || !estacao) return;
      
      try {
        const { data, error } = await supabase
          .from('clube_conclusao_estacoes')
          .select('ultimo_passo')
          .eq('user_id', user.id)
          .eq('estacao_id', estacao.id)
          .maybeSingle();
          
        if (data && data.ultimo_passo !== undefined) {
          setCurrentStep(data.ultimo_passo);
          if (data.ultimo_passo > 0) setShowResumeBanner(true);
        }
      } catch (err) {
        console.error('Erro ao carregar progresso:', err);
      } finally {
        setIsInitialLoading(false);
      }
    };
    
    if (estacao) {
      loadProgress();
    }
  }, [user, estacao]);

  // Persistir progresso ao mudar de passo
  const saveProgress = async (step: number) => {
    if (!user || !estacao) return;
    
    try {
      await supabase
        .from('clube_conclusao_estacoes')
        .upsert({
          user_id: user.id,
          rota_id: estacao.rota_id,
          estacao_id: estacao.id,
          ultimo_passo: step,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,estacao_id'
        });
    } catch (err) {
      console.error('Erro ao salvar progresso:', err);
    }
  };

  if (isLoading || isInitialLoading) {
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
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      saveProgress(nextStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (isFounder && slug === 'clareira-do-chamado') {
        setShowTransitionPortal(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate(`/clube/rotas/${estacao.clube_rotas.slug}`);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      saveProgress(prevStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(`/clube/rotas/${estacao.clube_rotas.slug}`);
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;
  const isMapaInstintoSoterrado = [
    slug,
    estacao.ferramenta_nome,
    estacao.ferramenta_descricao,
    estacao.cartografia_ferramenta_desbloqueada,
  ].some((value) => value?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes('instinto soterrado'));

  if (showTransitionPortal) {
    return (
      <FounderTransitionPortal 
        onContinue={() => {
          setShowTransitionPortal(false);
          setShowColheita(true);
        }} 
      />
    );
  }

  if (showColheita) {
    return (
      <ColheitaRastrosExperience 
        onComplete={() => {
          navigate('/sala-da-visitante');
        }} 
      />
    );
  }

  return (
    <AppLayout>
      <div className="bg-transparent min-h-screen text-white relative overflow-hidden">
        {/* Background Image Container */}
        <div className="fixed inset-0 z-0">
          <img 
            src={slug === 'clareira-do-chamado' 
              ? "/clareira-fundo-1600.webp"
              : (estacao.banner_url?.replace('pviznbfwtjqmpeiqqzk', 'pvjiznbfwtjqmpeiqqzk') || "/clareira-fundo-1600.webp")
            } 

            alt="" 
            className={cn(
              "w-full h-full object-cover transition-opacity duration-1000",
              slug === 'clareira-do-chamado' ? "opacity-60 grayscale-[0.1] brightness-[0.8]" : "opacity-80"
            )}

          />
          <div className="absolute inset-0 bg-[#020617]/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/30 via-transparent to-[#020617]/70" />


        </div>

        <div className={cn(
          "relative z-10 mx-auto px-4 pt-12 pb-32 min-h-screen flex flex-col",
          isMapaInstintoSoterrado && currentStep === 7 ? "max-w-7xl" : "max-w-4xl"
        )}>
          <EstacaoProgressHeader 
            currentStep={currentStep}
            totalSteps={steps.length}
            progressPercentage={progressPercentage}
            onBack={handleBack}
            steps={steps}
            onJumpToStep={(step) => {
              setCurrentStep(step);
              saveProgress(step);
            }}
          />

          <AnimatePresence>
            {showResumeBanner && currentStep > 0 && !(isMapaInstintoSoterrado && currentStep === 7) && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8 p-4 md:p-6 bg-gold/10 border border-gold/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-gold/60 uppercase tracking-widest font-black">Bem-vinda de volta</p>
                    <p className="text-sm font-serif italic text-white">Você parou em: <span className="text-gold">{steps[currentStep].title}</span></p>
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setCurrentStep(0);
                      saveProgress(0);
                      setShowResumeBanner(false);
                    }}
                    className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white flex-1 md:flex-none"
                  >
                    Recomeçar
                  </Button>
                  <Button 
                    onClick={() => setShowResumeBanner(false)}
                    className="bg-gold text-midnight text-[10px] uppercase tracking-widest font-bold h-10 rounded-full flex-1 md:flex-none"
                  >
                    Continuar
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
                    onJumpToStep={(step) => {
                      setCurrentStep(step);
                      saveProgress(step);
                    }}
                    audioAberturaUrl={estacao.audio_abertura_url}
                    audioVozClareiraUrl={estacao.audio_voz_clareira_url}
                    audioFlorestaUrl={estacao.audio_floresta_url}
                    imagemEscuta={estacao.banner_url || "https://pviznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/content-images/galeria/1781036067341-z7r4tq.jpg"}
                    obraRegente={estacao.clube_rotas.obra_regente}
                    estacaoSlug={slug}
                    rotaSlug={estacao.clube_rotas.slug}
                    infoContent={{
                      distrito: estacao.distrito_cidadela,
                      tese: estacao.frase_voz_clareira,
                      detalhes: [
                        `Conto-base: ${estacao.conto_titulo || 'Não definido'}`,
                        `Competência formada: ${estacao.cartografia_competencia || 'Não definida'}`,
                        `Ferramenta: ${estacao.ferramenta_nome || 'Não definida'}`
                      ]
                    }}
                  />
                )}

                {currentStep === 0 && slug === 'clareira-do-chamado' && (
                  <MapaEstacaoClareira />
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
                    onNext={handleNext}
                  />
                )}

                {currentStep === 2 && (
                  <EstacaoStepCamaraEscuta 
                    estacaoId={estacao.id}
                    estacaoSlug={slug}
                    onNext={handleNext}
                  />
                )}

                {currentStep === 3 && (
                  <EstacaoStepSussurrosConto 
                    estacaoId={estacao.id}
                    rotaId={estacao.clube_rotas.id}
                    livroCapaUrl={estacao.clube_rotas.livro_capa_url}
                    contoData={{
                      titulo: estacao.conto_titulo || 'Conto da Estação',
                      sintese: estacao.conto_sintese || 'Síntese do conto...',
                      texto: estacao.conto_texto || '',
                      audioUrl: (slug === 'clareira-do-chamado' && currentStep === 3) 
                        ? 'https://pvjiznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/audios/uploads/1781206510506.ogg' 
                        : (estacao.conto_audio_url || ''),
                      imagemUrl: (slug === 'clareira-do-chamado' && currentStep === 3)
                        ? 'https://pvjiznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/content-images/galeria/1781206890341.jpg'
                        : (estacao.conto_imagem_url || ''),
                      erroComum: estacao.conto_erro_comum || 'Erro comum de leitura...',
                      sussurroGuardia: estacao.conto_sussurro_guardia || 'Sussurro da Guardiã...'
                    }}
                    onNext={handleNext}
                  />
                )}


                {currentStep === 4 && (
                  <EstacaoStepTraducaoOracular 
                    estacaoId={estacao.id}
                    rotaId={estacao.clube_rotas.id}
                    contoOrigem={estacao.conto_titulo || 'Conto da Estação'}
                    traducaoData={{
                      territorioPrincipal: estacao.traducao_territorio_principal || 'Território Principal',
                      justificativaPrincipal: estacao.traducao_justificativa_principal || '',
                      territorioSecundario: estacao.traducao_territorio_secundario || 'Território Secundário',
                      justificativaSecundaria: estacao.traducao_justificativa_secundaria || '',
                      porta: estacao.traducao_porta || 'Porta',
                      torre: estacao.traducao_torre || 'Torre',
                      labirinto: estacao.traducao_labirinto || 'Labirinto',
                      ferramentaAssociada: estacao.traducao_ferramenta_associada || 'Ferramenta',
                      perguntaPessoal: estacao.traducao_pergunta_pessoal || 'Sua percepção pessoal?',
                      perguntaProfissional: estacao.traducao_pergunta_profissional || 'Sua observação profissional?'
                    }}
                    onNext={handleNext}
                  />
                )}

                {currentStep === 5 && (
                  <EstacaoStepCasoSimbolico 
                    estacaoId={estacao.id}
                    rotaId={estacao.clube_rotas.id}
                    casoData={{
                      nomeFicticio: estacao.caso_nome_ficticio || 'Helena',
                      idade: estacao.caso_idade || '42 anos',
                      contexto: estacao.caso_contexto || '',
                      fraseCentral: estacao.caso_frase_central || '',
                      campoSuperficie: estacao.caso_campo_superficie || '',
                      campoSimbolico: estacao.caso_campo_simbolico || '',
                      campoNaoConcluir: estacao.caso_campo_nao_concluir || '',
                      relacaoConto: estacao.caso_relacao_conto || '',
                      perguntaConducao: estacao.caso_pergunta_conducao || '',
                      cautelaEtica: estacao.caso_cautela_etica || '',
                      traducaoTerritorio: estacao.traducao_territorio_principal,
                      traducaoPorta: estacao.traducao_porta,
                      traducaoTorre: estacao.traducao_torre,
                      traducaoLabirinto: estacao.traducao_labirinto
                    }}
                    onNext={handleNext}
                  />
                )}

                {currentStep === 6 && (
                  <EstacaoStepDesafioEscuta 
                    estacaoId={estacao.id}
                    rotaId={estacao.clube_rotas.id}
                    pergunta={estacao.desafio_pergunta || 'O que você percebe primeiro?'}
                    alternativas={estacao.desafio_alternativas || []}
                    leituraModelo={estacao.desafio_leitura_modelo || ''}
                    cuidadoEtico={estacao.desafio_cuidado_etico || ''}
                    onNext={handleNext}
                  />
                )}

                {currentStep === 7 && (isMapaInstintoSoterrado ? (
                  <div className="w-full flex items-center justify-center">
                    <MapaInstintoSoterrado 
                      estacaoId={estacao.id}
                      rotaId={estacao.clube_rotas.id}
                      onNext={handleNext}
                    />
                  </div>
                ) : (
                  <EstacaoStepFerramentaOracular 
                    estacaoId={estacao.id}
                    rotaId={estacao.clube_rotas.id}
                    nome={estacao.ferramenta_nome || 'Ferramenta Oracular'}
                    descricao={estacao.ferramenta_descricao || ''}
                    eixos={estacao.ferramenta_eixos || []}
                    resultados={estacao.ferramenta_resultados || []}
                    onNext={handleNext}
                  />
                ))}

                {currentStep === 8 && (
                  <EstacaoStepJardim 
                    type="psique"
                    estacaoId={estacao.id}
                    rotaId={estacao.clube_rotas.id}
                    pergunta={estacao.jardim_psique_pergunta || 'Qual parte de mim continua tentando chamar minha atenção?'}
                    subperguntas={estacao.jardim_psique_subperguntas || []}
                    estacaoNome={estacao.nome}
                    onNext={handleNext}
                  />
                )}

                {currentStep === 9 && (
                  <EstacaoStepJardim 
                    type="oficio"
                    estacaoId={estacao.id}
                    rotaId={estacao.clube_rotas.id}
                    pergunta={estacao.jardim_oficio_pergunta || 'Onde percebo, nas mulheres que acompanho, sinais de vida soterrada?'}
                    subperguntas={estacao.jardim_oficio_subperguntas || []}
                    estacaoNome={estacao.nome}
                    onNext={handleNext}
                  />
                )}

                {currentStep === 10 && (
                  <EstacaoStepMissaoCampo 
                    estacaoId={estacao.id}
                    rotaId={estacao.clube_rotas.id}
                    titulo={estacao.missao_titulo || 'Observar o que ainda pulsa'}
                    texto={estacao.missao_texto || ''}
                    checklist={estacao.missao_checklist || []}
                    labelObservacao={estacao.missao_label_observacao || 'O que observei?'}
                    labelSinal={estacao.missao_label_sinal || 'Que sinal de vida soterrada apareceu?'}
                    labelPergunta={estacao.missao_label_pergunta || 'Que pergunta segura poderia ser feita?'}
                    onNext={handleNext}
                  />
                )}

                {currentStep === 11 && (
                  <EstacaoStepOraculo 
                    estacaoId={estacao.id}
                    rotaId={estacao.clube_rotas.id}
                    nomeCarta={estacao.oraculo_nome || 'O Osso que Canta'}
                    imagemUrl={estacao.oraculo_imagem_url || ''}
                    mensagem={estacao.oraculo_mensagem || ''}
                    pergunta={estacao.oraculo_pergunta || ''}
                    integracaoTexto={estacao.oraculo_integracao_texto || ''}
                    traducaoPorta={estacao.traducao_porta}
                    traducaoTorre={estacao.traducao_torre}
                    traducaoLabirinto={estacao.traducao_labirinto}
                    onNext={handleNext}
                  />
                )}

                {currentStep === 12 && (
                  <EstacaoStepCartografiaLoba 
                    estacaoId={estacao.id}
                    rotaId={estacao.clube_rotas.id}
                    estacaoNome={estacao.titulo || estacao.nome}
                    rastroNome={slug === 'clareira-do-chamado' ? "Instinto Reconhecido" : (estacao.cartografia_rastro_nome || 'O Chamado Foi Escutado')}
                    ferramentaDesbloqueada={estacao.ferramenta_nome || estacao.cartografia_ferramenta_desbloqueada || 'Mapa do Instinto Soterrado'}
                    distritoImpactado={slug === 'clareira-do-chamado' ? "Portal da Chegada" : (estacao.cartografia_distrito_impactado || 'Bosque dos Arquétipos')}
                    distritoSecundario={slug === 'clareira-do-chamado' ? "Jardim da Heroína" : (estacao.cartografia_distrito_secundario || 'Portão da Chegada')}
                    competenciaDesenvolvida={estacao.cartografia_competencia || 'Escuta Atenta'}
                    proximaTravessia={estacao.cartografia_proxima_travessia || 'Casa da Boa Menina'}
                    mensagemConclusao={slug === 'clareira-do-chamado' ? "Rastro guardado. O instinto não desapareceu — apenas pediu escuta." : (estacao.cartografia_mensagem_conclusao || 'A travessia desta estação foi concluída.')}
                    onNext={handleNext}
                  />
                )}

                {currentStep === 13 && (
                  <EstacaoStepFechamento 
                    estacaoId={estacao.id}
                    rotaId={estacao.clube_rotas.id}
                    titulo={estacao.fechamento_titulo || 'Essência 80/20'}
                    subtitulo={estacao.fechamento_subtitulo || ''}
                    texto={estacao.fechamento_texto || ''}
                    audioUrl={estacao.fechamento_audio_url}
                    proximaEstacaoNome={estacao.fechamento_botao_proxima}
                    backgroundImage={slug === 'clareira-do-chamado' ? '/clareira-fechamento-1600.webp' : undefined}
                    onFinish={handleNext}
                  />
                )}

              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
