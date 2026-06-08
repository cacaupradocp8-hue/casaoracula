import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, ChevronLeft, TreePine, Headphones, 
  Sparkles, Check, Eye, ArrowRight, Play, Pause, 
  Scroll, Map, BookOpen, MessageSquare, Award,
  Compass, Ghost, Moon, Shield, DoorOpen
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useRotaOracular } from '@/hooks/useRotaOracular';
import { EscutaPremium } from '@/components/clube/EscutaPremium';
import { FerramentaOracularPlayer } from '@/components/clube/FerramentaOracularPlayer';
import { JardimInput } from '@/components/clube/JardimInput';
import { cn } from '@/lib/utils';
import rotaLobosBg from '@/assets/rota-dos-lobos-bg.png';

export default function ClubeRotaPremium() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { pontos, isLoading, concluirPonto } = useRotaOracular(slug);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 'entrada', title: 'Entrada na Clareira', ritual: true },
    { id: 'escuta', title: 'Escuta Ritual', ritual: true },
    { id: 'caso', title: 'Caso Simbólico', ritual: true },
    { id: 'revelacao', title: 'Revelação', ritual: true },
    { id: 'ferramenta', title: 'Ferramenta Oracular', ritual: true },
    { id: 'jardim_psique', title: 'Jardim da Psique', ritual: false },
    { id: 'jardim_oficio', title: 'Jardim do Ofício', ritual: false },
    { id: 'missao', title: 'Missão de Campo', ritual: true },
    { id: 'fechamento', title: 'Fechamento Ritual', ritual: true },
    { id: 'conclusao', title: 'Cartografia da Loba', ritual: true }
  ];

  const currentPonto = pontos.find(p => p.slug === slug) || pontos[0];

  if (isLoading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-gold gap-4">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full"
      />
      <span className="font-serif italic tracking-widest animate-pulse">Iniciando travessia...</span>
    </div>
  );

  if (!currentPonto) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white font-serif">
      Estação não encontrada ou indisponível no momento.
    </div>
  );

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      concluirPonto.mutate(currentPonto.id);
      navigate('/clube/rota-dos-lobos');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/clube/rota-dos-lobos');
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <AppLayout>
      <div className="bg-[#020617] min-h-screen text-white relative overflow-hidden selection:bg-gold/30 selection:text-white">
        
        {/* Ambient Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* Imagem de Fundo da Clareira */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/clareira-fundo.png" 
              alt="Clareira Ritual" 
              className="w-full h-full object-cover opacity-60 object-top md:object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/20 via-transparent to-[#020617]" />
          </div>

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05),transparent_70%)]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 pt-12 pb-32 min-h-screen flex flex-col">
          
          {/* Progress Header */}
          <div className="mb-12 space-y-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={handleBack}
                className="group flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold hover:text-gold transition-colors"
              >
                <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                <span>Voltar</span>
              </button>
              
              <div className="text-[10px] text-gold uppercase tracking-[0.3em] font-bold bg-gold/5 px-3 py-1 rounded-full border border-gold/10">
                Rastro {currentStep + 1} de {steps.length}
              </div>
            </div>
            
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner backdrop-blur-sm border border-white/[0.03]">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="h-full bg-gradient-to-r from-gold/40 via-gold to-gold/40 relative"
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:40px_40px] animate-[shimmer_2s_infinite_linear]" />
                <div className="absolute inset-0 shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
              </motion.div>
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-grow flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 1.02 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                
                {/* STEP 0: ENTRADA - PORTAL VIBE */}
                {currentStep === 0 && (
                  <div className="space-y-10 text-center max-w-2xl mx-auto">
                    <div className="space-y-6">
                      <h1 className="text-5xl md:text-6xl font-serif text-white leading-tight">Clareira do Chamado</h1>
                      <div className="w-24 h-px bg-gold/40 mx-auto" />
                      <p className="text-white/90 font-serif text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
                        Antes da mulher recuperar a própria voz, existe um instante quase invisível. Um chamado. Nem sempre ele chega como clareza. Às vezes chega como cansaço, inquietação ou a sensação de que algo importante ficou para trás.
                      </p>
                      <p className="text-gold/80 font-serif italic text-lg leading-relaxed max-w-xl mx-auto">
                        Nesta estação, você não precisa encontrar respostas. Apenas aprender a escutar o que continua chamando.
                      </p>
                    </div>

                    <Button 
                      className="rounded-full bg-gold text-[#020617] font-bold px-8 h-11 hover:bg-gold/90 shadow-[0_8px_30px_rgba(212,175,55,0.2)] active:scale-95 transition-all text-xs tracking-widest uppercase"
                      onClick={handleNext}
                    >
                      <TreePine className="w-4 h-4 mr-2" />
                      Entrar na Clareira
                    </Button>
                  </div>
                )}

                {/* STEP 1: ESCUTA RITUAL - AUDIO FOCUS */}
                {currentStep === 1 && (
                  <div className="space-y-8 text-center max-w-2xl mx-auto">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-serif">A Voz da Clareira</h2>
                    </div>
                    
                    <div className="bg-[#0A0A0B]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-4 md:p-8 shadow-2xl">
                      <EscutaPremium 
                        audioUrl="1780702648962.mp3" 
                        titulo="Abertura da Clareira"
                        tipo="Introdução"
                        funcao="Preparar a escuta para reconhecer o chamado interior."
                        duracao="03:00"
                        className="py-12 md:py-16 !bg-transparent !shadow-none"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        variant="outline"
                        className="rounded-full border-gold/30 text-gold hover:bg-gold/10 px-10 h-10 text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-gold/5"
                        onClick={handleNext}
                      >
                        Continuar a Escuta
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 2: CASO SIMBÓLICO - HELENA */}
                {currentStep === 2 && (
                  <div className="space-y-10 max-w-2xl mx-auto">
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl font-serif">Helena e a Escuta Esquecida</h2>
                    </div>

                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gold/5 blur-xl rounded-[2rem]" />
                      <div className="relative bg-[#0F0F11]/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl font-serif leading-relaxed text-white/90">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                          <Scroll className="w-12 h-12" />
                        </div>
                        <div className="space-y-4 text-lg">
                          <p>Helena tem 42 anos. É terapeuta. Possui muitas formações. Atende regularmente.</p>
                          <p>Mesmo assim, diante de decisões importantes, sente necessidade constante de pedir opinião.</p>
                          <p>Quando percebe algo em uma sessão, frequentemente procura validação antes de confiar na própria leitura.</p>
                          <p className="italic text-gold/80">Ela não sofre por falta de conhecimento. Ela sofre por ter se afastado da confiança naquilo que percebe.</p>
                        </div>
                      </div>
                    </div>

                    {!userHasRead ? (
                      <div className="flex justify-center pt-4">
                        <Button 
                          onClick={() => setUserHasRead(true)}
                          className="rounded-full bg-gold/10 border border-gold/30 text-gold font-bold px-12 h-12 uppercase tracking-widest text-xs hover:bg-gold/20 transition-all"
                        >
                          Fiz a leitura
                          <Check className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        <p className="text-center text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">O que mais chama sua atenção neste caso?</p>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { id: 'porta', label: 'Porta', icon: DoorOpen },
                            { id: 'torre', label: 'Torre', icon: Shield },
                            { id: 'labirinto', label: 'Labirinto', icon: Compass },
                            { id: 'campo', label: 'Campo Psíquico', icon: Moon }
                          ].map((opt) => (
                            <button
                              key={opt.id}
                              onClick={handleNext}
                              className="flex items-center gap-4 bg-[#0A0A0B]/60 border border-white/5 hover:border-gold/40 p-4 rounded-2xl transition-all group text-left"
                            >
                              <div className="w-10 h-10 rounded-xl bg-gold/5 border border-gold/10 flex items-center justify-center text-gold group-hover:bg-gold/20 transition-colors">
                                <opt.icon className="w-5 h-5" />
                              </div>
                              <span className="font-serif text-sm text-white/70 group-hover:text-gold transition-colors">{opt.label}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* STEP 3: REVELAÇÃO - CASO HELENA */}
                {currentStep === 3 && (
                  <div className="space-y-10 max-w-4xl mx-auto">
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl font-serif">Revelação: O Chamado Ignorado</h2>
                      <p className="text-white/40 text-xs uppercase tracking-widest italic">A escuta que Helena esqueceu de honrar.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div className="bg-[#0A0A0B]/60 border border-white/5 p-6 rounded-2xl space-y-4">
                          <div className="flex items-center gap-3 text-gold">
                            <Moon className="w-5 h-5" />
                            <h3 className="font-serif text-xl">Campo Psíquico</h3>
                          </div>
                          <p className="text-white/70 font-serif italic text-lg leading-relaxed">Afastamento gradual da percepção instintiva.</p>
                        </div>

                        <div className="bg-[#0A0A0B]/60 border border-white/5 p-6 rounded-2xl space-y-4">
                          <div className="flex items-center gap-3 text-gold">
                            <Shield className="w-5 h-5" />
                            <h3 className="font-serif text-xl">Torre da Validação</h3>
                          </div>
                          <p className="text-white/70 font-serif italic text-lg leading-relaxed">Torre da Validação Externa.</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-[#0A0A0B]/60 border border-white/5 p-6 rounded-2xl space-y-4">
                          <div className="flex items-center gap-3 text-gold">
                            <Compass className="w-5 h-5" />
                            <h3 className="font-serif text-xl">O Labirinto</h3>
                          </div>
                          <p className="text-white/70 font-serif italic text-lg leading-relaxed">Quanto mais busca confirmação, menos escuta a própria percepção.</p>
                        </div>

                        <div className="bg-gold/5 border border-gold/20 p-8 rounded-[2rem] space-y-4 shadow-2xl relative overflow-hidden">
                          <Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-gold/10 rotate-12" />
                          <h3 className="font-serif text-2xl text-gold italic">Uma pergunta para você...</h3>
                          <p className="text-white text-xl leading-relaxed font-serif">
                            Em quais áreas da sua vida você já sabe a resposta, mas continua procurando autorização?
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center pt-8">
                      <Button 
                        className="rounded-full bg-gold text-midnight font-bold px-12 h-12 uppercase tracking-widest text-xs hover:bg-gold/90 transition-all shadow-gold"
                        onClick={handleNext}
                      >
                        Continuar para a Prática
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 4: FERRAMENTA - ORACULAR CARD RITUAL */}
                {currentStep === 4 && (
                  <div className="space-y-10 text-center max-w-2xl mx-auto">
                    <div className="space-y-4">
                      <span className="text-[10px] text-gold font-bold tracking-[0.4em] uppercase">Momento IV</span>
                      <h2 className="text-3xl font-serif italic text-gold">Mapa do Instinto Soterrado</h2>
                    </div>

                    <div className="relative p-1">
                      <motion.div 
                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="absolute -inset-10 bg-gold/10 blur-[80px] rounded-full"
                      />
                      <div className="relative bg-[#080809] border border-gold/20 rounded-[3rem] p-8 md:p-12 shadow-[0_0_50px_rgba(212,175,55,0.1)] overflow-hidden">
                        <div className="absolute -top-10 -right-10 opacity-5">
                          <Map className="w-48 h-48" />
                        </div>
                        
                        <div className="space-y-8 relative z-10">
                          <div className="w-20 h-20 bg-gold/5 rounded-full border border-gold/10 flex items-center justify-center mx-auto">
                            <Compass className="w-8 h-8 text-gold animate-pulse" />
                          </div>
                          
                          <div className="space-y-3">
                            <h3 className="text-xl font-serif">Ferramenta Oracular Ativada</h3>
                            <p className="text-white/50 text-sm leading-relaxed max-w-sm mx-auto">
                              O mapa revela os territórios onde sua intuição foi enterrada sob o peso da adequação.
                            </p>
                          </div>

                          <Button 
                            className="rounded-full bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 px-12 h-12 text-xs font-bold uppercase tracking-widest shadow-inner group"
                            onClick={handleNext}
                          >
                            Abrir Ferramenta
                            <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5 & 6: JARDINS - ELEGANT WRITING SPACE */}
                {(currentStep === 5 || currentStep === 6) && (
                  <div className="space-y-10 max-w-3xl mx-auto">
                    <div className="text-center space-y-4">
                      <span className="text-[10px] text-gold font-bold tracking-[0.4em] uppercase">Momento V — Cultivo</span>
                      <h2 className="text-3xl font-serif">
                        {currentStep === 5 ? 'Jardim da Psique' : 'Jardim do Ofício'}
                      </h2>
                      <p className="text-white/50 text-sm italic font-serif leading-relaxed max-w-lg mx-auto">
                        {currentStep === 5 
                          ? '"Neste espaço, a semente da percepção encontra terra fértil. O que você sente ao olhar para sua loba interior?"'
                          : '"Como essa força selvagem pode se manifestar no seu trabalho, na sua expressão no mundo?"'}
                      </p>
                    </div>

                    <div className="bg-[#0A0A0B]/40 backdrop-blur-sm border border-white/5 rounded-[2.5rem] p-6 md:p-10">
                      <JardimInput 
                        type={currentStep === 5 ? 'psique' : 'oficio'} 
                        pergunta={currentStep === 5 ? "O que sua loba interior diz?" : "Como manifestar sua força no mundo?"} 
                        pontoId={currentPonto.id}
                        sourceTitle={currentPonto.nome}
                      />
                    </div>

                    <div className="flex justify-center">
                      <Button 
                        className="rounded-full bg-white/5 hover:bg-white/10 text-white/60 px-10 h-11 text-[11px] font-bold uppercase tracking-widest transition-all"
                        onClick={handleNext}
                      >
                        Guardar no Jardim
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* STEP 7: MISSÃO - MISSION CARD */}
                {currentStep === 7 && (
                  <div className="space-y-10 text-center max-w-2xl mx-auto">
                    <div className="space-y-4">
                      <span className="text-[10px] text-gold font-bold tracking-[0.4em] uppercase">Missão de Campo</span>
                      <h2 className="text-3xl font-serif">O Rastro da Loba</h2>
                    </div>

                    <div className="bg-[#121214] border-l-4 border-gold p-8 md:p-12 rounded-[2rem] shadow-2xl text-left space-y-6 relative overflow-hidden">
                      <div className="absolute bottom-0 right-0 p-8 opacity-5">
                        <Award className="w-32 h-32" />
                      </div>
                      
                      <div className="flex items-center gap-4 text-gold">
                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                          <Eye className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Instrução Ritual</span>
                      </div>

                      <p className="text-xl md:text-2xl font-serif italic leading-relaxed text-white/90">
                        "Durante as próximas 24 horas, observe um momento em que você silenciou sua verdade para ser 'boa'. Não julgue, apenas registre esse rastro."
                      </p>
                      
                      <div className="pt-4">
                        <Button 
                          className="rounded-full bg-gold text-[#020617] font-bold px-12 h-12 hover:bg-gold/90 text-xs tracking-widest uppercase shadow-[0_10px_40px_rgba(212,175,55,0.2)]"
                          onClick={handleNext}
                        >
                          Aceitar Missão
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 8: FECHAMENTO - RITUAL TONE */}
                {currentStep === 8 && (
                  <div className="space-y-12 text-center max-w-lg mx-auto py-12">
                    <motion.div 
                      animate={{ 
                        boxShadow: ['0 0 20px rgba(212,175,55,0)', '0 0 50px rgba(212,175,55,0.2)', '0 0 20px rgba(212,175,55,0)'],
                        y: [0, -5, 0]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto text-gold"
                    >
                      <Moon className="w-10 h-10" />
                    </motion.div>

                    <div className="space-y-6">
                      <h2 className="text-4xl font-serif">Fechamento</h2>
                      <p className="text-white/60 font-serif italic text-xl leading-relaxed">
                        "O que foi aberto na clareira agora se integra no corpo. O rastro está marcado."
                      </p>
                      <div className="w-12 h-px bg-gold/30 mx-auto" />
                    </div>

                    <Button 
                      variant="ghost"
                      className="text-gold hover:text-gold hover:bg-gold/5 text-[11px] font-bold uppercase tracking-[0.5em] animate-pulse rounded-full px-12"
                      onClick={handleNext}
                    >
                      Selar Travessia
                    </Button>
                  </div>
                )}

                {/* STEP 9: CONCLUSÃO - CARTOGRAFIA DA LOBA */}
                {currentStep === 9 && (
                  <div className="space-y-10 text-center max-w-2xl mx-auto py-8">
                    <div className="relative">
                      <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="w-32 h-32 bg-gradient-to-br from-gold/20 to-gold/5 rounded-full border border-gold/40 flex items-center justify-center mx-auto mb-8 shadow-3xl"
                      >
                        <Award className="w-14 h-14 text-gold" />
                      </motion.div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-[10px] text-gold font-bold tracking-[0.4em] uppercase">Estação I Completa</span>
                        <h2 className="text-4xl md:text-5xl font-serif">Cartografia da Loba</h2>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-6">
                        {[
                          { label: 'Ferramenta', val: 'Mapa do Instinto', icon: Map },
                          { label: 'Distrito', val: 'CidadELA Interior', icon: Moon },
                          { label: 'Movimento', val: 'Registrado', icon: Check }
                        ].map((info, idx) => (
                          <div key={idx} className="bg-[#0A0A0B] border border-white/5 p-4 rounded-2xl flex flex-col items-center gap-2">
                            <info.icon className="w-4 h-4 text-gold/60" />
                            <span className="text-[9px] uppercase tracking-widest text-white/40">{info.label}</span>
                            <span className="text-[10px] font-bold text-gold">{info.val}</span>
                          </div>
                        ))}
                      </div>

                      <p className="text-white/40 text-xs uppercase tracking-widest max-w-xs mx-auto">
                        Seu primeiro rastro foi registrado na cidadela.
                      </p>
                    </div>

                    <div className="pt-8 flex flex-col items-center gap-6">
                      <div className="space-y-2">
                        <span className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Próxima Estação Sugerida</span>
                        <Button 
                          className="rounded-full bg-gold text-[#020617] font-extrabold px-12 h-14 text-sm tracking-[0.1em] uppercase shadow-[0_15px_45px_rgba(212,175,55,0.3)] hover:scale-105 active:scale-95 transition-all group"
                          onClick={handleNext}
                        >
                          Entrar na Casa da Boa Menina
                          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                      
                      <button 
                        onClick={() => navigate('/clube/rota-dos-lobos')}
                        className="text-[10px] text-white/30 uppercase tracking-widest hover:text-white/60 transition-colors"
                      >
                        Voltar para o mapa
                      </button>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </main>

          {/* Footer Navigation Hints */}
          <div className="mt-auto pt-12 text-center">
            {currentStep < steps.length - 1 && (
               <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-[9px] text-white/20 uppercase tracking-[0.3em]"
              >
                Use o botão para seguir na travessia
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}