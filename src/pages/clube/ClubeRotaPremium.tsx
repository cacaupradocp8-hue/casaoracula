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
import { EstacaoStepSussurrosConto } from '@/components/clube/rota-template/EstacaoStepSussurrosConto';
import { EstacaoStepCasoSimbolico } from '@/components/clube/rota-template/EstacaoStepCasoSimbolico';
import { EstacaoStepDesafioEscuta } from '@/components/clube/rota-template/EstacaoStepDesafioEscuta';
import { EstacaoStepFerramentaOracular } from '@/components/clube/rota-template/EstacaoStepFerramentaOracular';
import { EstacaoStepJardim } from '@/components/clube/rota-template/EstacaoStepJardim';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EscutaPremium } from '@/components/clube/EscutaPremium';

export default function ClubeRotaPremium() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: estacao, isLoading, error } = useEstacaoConteudo(slug || '');
  const [currentStep, setCurrentStep] = useState(0);

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
    { id: 'proximos_passos', title: 'Próximos Passos' }
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
                    contoData={{
                      titulo: estacao.conto_titulo || 'Conto da Estação',
                      sintese: estacao.conto_sintese || 'Síntese do conto...',
                      texto: estacao.conto_texto || '',
                      audioUrl: estacao.conto_audio_url || '',
                      imagemUrl: estacao.conto_imagem_url || '',
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

                {currentStep === 7 && (
                  <EstacaoStepFerramentaOracular 
                    estacaoId={estacao.id}
                    rotaId={estacao.clube_rotas.id}
                    nome={estacao.ferramenta_nome || 'Mapa do Instinto Soterrado'}
                    descricao={estacao.ferramenta_descricao || ''}
                    eixos={estacao.ferramenta_eixos || []}
                    resultados={estacao.ferramenta_resultados || []}
                    onNext={handleNext}
                  />
                )}

                {currentStep === 8 && (
                  <div className="text-center space-y-8 max-w-2xl mx-auto py-20">
                    <div className="space-y-4">
                      <span className="text-[10px] text-gold uppercase tracking-[0.3em] font-bold">8. Próximos Passos</span>
                      <h2 className="text-4xl font-serif text-white italic">A Caminhada Continua</h2>
                    </div>
                    <Card className="bg-white/5 border-white/10 p-8 rounded-[2rem]">
                      <p className="text-lg font-serif italic text-white/60 leading-relaxed">
                        Você concluiu as camadas fundamentais desta estação. Os próximos jardins e missões estão sendo preparados para sua jornada.
                      </p>
                    </Card>
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
