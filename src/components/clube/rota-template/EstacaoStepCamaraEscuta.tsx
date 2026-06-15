import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Headphones, Sparkles, BookOpen, Music, CheckCircle2, ChevronRight, Info, Heart, ArrowLeft, ArrowRight, History, X, MapPin, Loader2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCamaraObras, CamaraObra } from '@/hooks/useClubeTemplate';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SpotifyPlaylistEmbed } from '@/components/clube/SpotifyPlaylistEmbed';
import { EscutaPremium } from '@/components/clube/EscutaPremium';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';


interface EstacaoStepCamaraEscutaProps {
  estacaoId: string;
  estacaoSlug?: string;
  onNext: () => void;
}


export const EstacaoStepCamaraEscuta: React.FC<EstacaoStepCamaraEscutaProps> = ({
  estacaoId,
  estacaoSlug,
  onNext
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: obras, isLoading } = useCamaraObras(estacaoId);
  const [activeObra, setActiveObra] = useState<CamaraObra | null>(null);
  const [inPlaylistMode, setInPlaylistMode] = useState(false);
  const [showRastro, setShowRastro] = useState(false);
  const [showDevolutiva, setShowDevolutiva] = useState(false);
  const [devolutivaChoice, setDevolutivaChoice] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [reflexaoPsique, setReflexaoPsique] = useState('');
  const [reflexaoOficio, setReflexaoOficio] = useState('');
  const [simbolo, setSimbolo] = useState('');
  const [intensidade, setIntensidade] = useState('Moderada');
  const [primeiraImpressaoTipo, setPrimeiraImpressaoTipo] = useState<string>('');
  const [primeiraImpressaoTexto, setPrimeiraImpressaoTexto] = useState('');
  const [ato, setAto] = useState<1 | 2 | 3 | 4 | 5>(1);


  useEffect(() => {
    const checkProgress = async () => {
      if (!user || !obras || obras.length === 0) return;
      
      const { data: records } = await supabase
        .from('clube_camara_escuta_registros')
        .select('obra_id')
        .eq('user_id', user.id)
        .eq('estacao_id', estacaoId);
        
      if (records && records.length > 0) {
        const completedIds = new Set(records.map(r => r.obra_id));
        const faixasObras = obras.filter(o => !o.url.includes('spotify.com'));
        
        if (completedIds.size >= faixasObras.length && faixasObras.length > 0) {
          // Se já concluiu todas, verifica se já escolheu a voz
          const { data: estado } = await supabase
            .from('user_cidadela_estado')
            .select('voz')
            .eq('user_id', user.id)
            .maybeSingle();

          if (estado?.voz) {
            setDevolutivaChoice(estado.voz);
            setShowRastro(true);
            setShowDevolutiva(false);
          } else {
            setShowDevolutiva(true);
            setShowRastro(false);
          }
        }
      }
    };
    
    checkProgress();
  }, [user, obras, estacaoId]);

  useEffect(() => {
    if (activeObra) {
      setReflexaoPsique('');
      setReflexaoOficio('');
      setSimbolo('');
      setIntensidade('Moderada');
      setPrimeiraImpressaoTipo('');
      setPrimeiraImpressaoTexto('');
      setAto(1);
    }
  }, [activeObra?.id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-gold">
        <Headphones className="w-8 h-8 animate-pulse" />
        <span className="font-serif italic text-sm">Abrindo a Câmara...</span>
      </div>
    );
  }

  const playlistObra = obras?.find(o => o.url.includes('spotify.com'));
  const faixasObras = obras?.filter(o => !o.url.includes('spotify.com')) || [];

  const handleConcluirObra = async () => {
    if (!obras || !activeObra || !user) return;

    // Se for Spotify, não exigimos preenchimento obrigatório para avançar (opcional)
    const isSpotify = activeObra.url.includes('spotify.com');
    
    if (!isSpotify && (!reflexaoPsique.trim() || !reflexaoOficio.trim() || !simbolo.trim())) {
      toast.error("Por favor, preencha todas as reflexões e o símbolo observado.");
      return;
    }

    setIsSaving(true);
    try {
      const specific = activeObra.metadata || {};
      const puntoId = `escuta:${activeObra.id}`;
      
      // 1. Save to clube_camara_escuta_registros
      const { error: regError } = await supabase
        .from('clube_camara_escuta_registros')
        .insert([{
          user_id: user.id,
          obra_id: activeObra.id,
          rota_id: activeObra.rota_id,
          estacao_id: activeObra.estacao_id,
          simbolo_observado: simbolo,
          emocao_predominante: '',
          intensidade_escuta: intensidade,
          territorio_impactado: specific.territorioImpactado || activeObra.territorio_principal || '',
          registro_psique: reflexaoPsique,
          registro_oficio: reflexaoOficio,
          primeira_impressao_tipo: primeiraImpressaoTipo || null,
          primeira_impressao_texto: primeiraImpressaoTexto || null,
          data_escuta: new Date().toISOString()
        } as any]);

      if (regError) throw regError;


      // 2. Save to Jardim da Psique
      const { error: psiqueError } = await supabase
        .from('jardim_psique_registros')
        .insert([{
          user_id: user.id,
          reflexao_pessoal: reflexaoPsique,
          titulo: `Escuta: ${activeObra.titulo}`,
          tipo_registro: 'ferramenta',
          ferramenta_chave: puntoId,
          ferramenta_nome: `Câmara da Escuta: ${activeObra.titulo}`,
          data_aplicacao: new Date().toISOString(),
          conteudo: {
            obra: activeObra.titulo,
            simbolo_observado: simbolo,
            intensidade_escuta: intensidade,
            reflexao_psique: reflexaoPsique,
            pergunta_origem: specific.perguntaPsique ?? activeObra.pergunta_psique ?? null,
            territorio_impactado: specific.territorioImpactado ?? activeObra.territorio_principal ?? null,
            rastro: specific.rastroSimbolo ?? activeObra.rastro_simbolo ?? null,
          }
        }]);

      if (psiqueError) throw psiqueError;



      // 3. Save to Jardim do Ofício
      const { error: oficioError } = await supabase
        .from('jardim_do_oficio')
        .insert([{
          user_id: user.id,
          reflexao_profissional: reflexaoOficio,
          contexto_origem: `ponto:${puntoId}`
        }]);

      if (oficioError) throw oficioError;


      // 4. Update Cartografia (user_cidadela_estado)
      const territorio = specific.territorioImpactado || activeObra.territorio_principal;
      if (territorio) {
        try {
          const { data: estado } = await supabase
            .from('user_cidadela_estado')
            .select('distritos_ativados')
            .eq('user_id', user.id)
            .maybeSingle();
            
          const distritos = estado?.distritos_ativados || [];
          if (!distritos.includes(territorio)) {
            await supabase
              .from('user_cidadela_estado')
              .upsert({
                user_id: user.id,
                distritos_ativados: [...distritos, territorio],
                ultimo_movimento: new Date().toISOString()
              });
          }
        } catch (e) {
          console.error("Erro ao atualizar território na cartografia:", e);
        }
      }

      toast.success("Registro concluído com sucesso.");

      const currentIndex = faixasObras.findIndex(o => o.id === activeObra.id);
      if (currentIndex === faixasObras.length - 1) {
        setShowDevolutiva(true);
        setActiveObra(null);
        setInPlaylistMode(false);
      } else {
        // Se estiver no modo playlist, avança para a próxima aba automaticamente
        if (inPlaylistMode) {
          setActiveObra(faixasObras[currentIndex + 1]);
        } else {
          setActiveObra(null);
        }
      }
    } catch (err: any) {
      console.error('Erro ao salvar registro de escuta:', err);
      toast.error("Erro ao salvar: " + (err.message || "Erro desconhecido"));
    } finally {
      setIsSaving(false);
    }
  };



  const handleDevolutivaFinal = async (choice: string) => {
    if (!user || !obras || obras.length === 0) return;
    
    setDevolutivaChoice(choice);
    setIsSaving(true);
    
    try {
      const activeRotaId = obras[0].rota_id;
      const obraExemplo = obras[0]; // Para pegar rota/estação se necessário no histórico
      
      // Save final choice to cartografia
      await supabase
        .from('user_cidadela_estado')
        .upsert({
          user_id: user.id,
          voz: choice,
          ultimo_movimento: new Date().toISOString()
        });

      // Registrar movimento histórico na Cidadela para Auditoria/Atlas
      // Usando clube_engajamento para persistir o rastro específico da estação
      await supabase
        .from('clube_engajamento')
        .insert([{
          user_id: user.id,
          rota_id: activeRotaId,
          tipo_evento: 'camara_escuta_finalizada',
          metadata: {
            voz_ecoante: choice,
            estacao_id: estacaoId,
            estacao_slug: estacaoSlug,
            timestamp: new Date().toISOString()
          }
        }]);

      setShowRastro(true);
      setShowDevolutiva(false);
      toast.success("Rastro permanente gerado na Cartografia.");
    } catch (err) {
      console.error("Erro ao salvar voz ecoante:", err);
      // Still show the next step even if this minor update fails
      setShowRastro(true);
      setShowDevolutiva(false);
    } finally {
      setIsSaving(false);
    }
  };



  if (showDevolutiva) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto py-20 px-6 space-y-12 text-center"
      >
        <div className="space-y-6">
          <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-8">
            <Sparkles className="w-10 h-10 text-gold" />
          </div>
          <h2 className="text-3xl md:text-5xl font-display text-white uppercase tracking-widest leading-tight">Você atravessou a Câmara da Escuta Simbólica.</h2>
          <div className="space-y-2 text-gold/60 font-serif italic text-xl">
            <p>Escutou a ferida.</p>
            <p>Escutou a ausência.</p>
            <p>Escutou a revelação.</p>
            <p>Escutou a força.</p>
          </div>
        </div>

        <div className="space-y-8 pt-10">
          <p className="text-white font-serif italic text-2xl">Agora observe: Qual dessas vozes ainda continua ecoando?</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {[
              { id: 'ferida', label: 'A Ferida', icon: '🩸' },
              { id: 'ausencia', label: 'A Ausência', icon: '🌑' },
              { id: 'revelacao', label: 'A Revelação', icon: '🔑' },
              { id: 'forca', label: 'A Força', icon: '🌻' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleDevolutivaFinal(item.label)}
                disabled={isSaving}
                className="p-8 rounded-[32px] bg-white/[0.03] border border-white/10 hover:border-gold/40 hover:bg-gold/5 transition-all group text-left flex items-center gap-6 disabled:opacity-50 disabled:cursor-not-allowed"

              >
                <span className="text-3xl">{item.icon}</span>
                <span className="text-xl font-serif text-white group-hover:text-gold transition-colors">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (showRastro) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto space-y-8 md:space-y-12 py-8 md:py-12 px-4 text-center"
      >
        <div className="space-y-6">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4 md:mb-8">
            <History className="w-8 h-8 md:w-10 md:h-10 text-gold" />
          </div>
          <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-8xl font-display font-black text-white tracking-[0.1em] leading-tight uppercase relative inline-block px-4 break-words">
            <span className="bg-gradient-to-b from-white via-white to-gold/70 bg-clip-text text-transparent drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
              Clareira <br className="xs:hidden" /> do Chamado
            </span>
          </h2>


          <p className="text-gold/80 font-serif italic text-lg max-w-xl mx-auto leading-relaxed">
            “Sua escuta deixou um rastro na Cartografia da Loba. Algo em você começou a reconhecer o que ainda canta por baixo da ferida.”
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-[40px] p-10 text-left space-y-8 backdrop-blur-sm">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <span className="text-[10px] text-gold/40 uppercase tracking-widest font-bold">Estação</span>
              <p className="text-white font-serif italic text-lg">Clareira do Chamado</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-gold/40 uppercase tracking-widest font-bold">Obra</span>
              <p className="text-white font-serif italic text-lg">Câmara da Escuta Simbólica</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-gold/40 uppercase tracking-widest font-bold">Voz Ecoante Selecionada</span>
              <p className="text-gold font-serif italic text-lg">{devolutivaChoice}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-gold/40 uppercase tracking-widest font-bold">Data do Registro</span>
              <p className="text-white font-serif italic text-lg">{format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col items-center justify-center gap-4">
          <Button 
            onClick={onNext}
            className="bg-gold hover:bg-gold/80 text-midnight font-bold px-16 h-16 rounded-full uppercase tracking-widest text-xs shadow-2xl shadow-gold/20 transition-all hover:scale-105 w-full sm:w-auto flex items-center gap-3"
          >
            <span>Próximo Passo: Conto</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          
          <Button 
            variant="ghost"
            onClick={onNext}
            className="text-white/40 hover:text-white/60 text-[10px] uppercase tracking-widest font-bold transition-all"
          >
            Concluir Experiência
          </Button>
        </div>
      </motion.div>
    );
  }

  if (activeObra || inPlaylistMode) {
    const currentObra = activeObra || faixasObras[0];
    const specificFromDb = currentObra?.metadata || {};
    const extra = (currentObra as any) || {};

    const displayData = {
      perguntaPsique: currentObra?.pergunta_psique || specificFromDb.perguntaPsique,
      perguntaOficio: currentObra?.pergunta_oficio || specificFromDb.perguntaOficio,
      territorioImpactado: currentObra?.territorio_principal || specificFromDb.territorioImpactado,
      rastroSimbolo: currentObra?.rastro_simbolo || specificFromDb.rastroSimbolo,
      textoAntes: extra.texto_antes_escuta as string | undefined,
      perguntaDurante: extra.pergunta_durante_escuta as string | undefined,
      textoLeitura: extra.texto_leitura_simbolica as string | undefined,
      mensagemConclusao: extra.mensagem_conclusao as string | undefined,
    };

    const isUltima = faixasObras.indexOf(currentObra!) === faixasObras.length - 1;
    const totalAtos = 5;

    const podeAvancar = (() => {
      if (ato === 3) return !!primeiraImpressaoTipo && !!primeiraImpressaoTexto.trim();
      if (ato === 4) return !!simbolo.trim();
      if (ato === 5) return !!reflexaoPsique.trim() && !!reflexaoOficio.trim();
      return true;
    })();

    const impressoes = [
      { id: 'imagem', label: 'Uma imagem' },
      { id: 'emocao', label: 'Uma emoção' },
      { id: 'memoria', label: 'Uma memória' },
      { id: 'frase', label: 'Uma frase' },
      { id: 'corpo', label: 'Uma sensação no corpo' },
    ];

    const tituloAto: Record<number, string> = {
      1: 'Antes da escuta',
      2: 'Durante a escuta',
      3: 'O que chegou primeiro?',
      4: 'Leitura simbólica',
      5: 'Integração',
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto pb-20 px-4"
      >
        {/* Header minimal */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => { setActiveObra(null); setInPlaylistMode(false); }}
            className="flex items-center gap-3 text-[10px] text-white/40 uppercase tracking-widest font-bold hover:text-gold transition-all group"
          >
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gold/30">
              <ArrowLeft className="w-3 h-3" />
            </div>
            Voltar
          </button>

          {/* Progress dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalAtos }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 rounded-full transition-all",
                  i + 1 === ato ? "bg-gold w-8" : i + 1 < ato ? "bg-gold/40 w-4" : "bg-white/10 w-4"
                )}
              />
            ))}
          </div>
        </div>

        {/* Obra title */}
        <div className="text-center space-y-2 mb-12">
          <span className="text-[10px] text-gold uppercase tracking-[0.4em] font-bold opacity-60">
            Câmara da Escuta · Ato {ato} de {totalAtos}
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-white italic leading-tight">
            {currentObra?.titulo}
          </h2>
          <p className="text-xs uppercase tracking-widest text-white/30 font-bold">
            {tituloAto[ato]}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`ato-${ato}-${currentObra?.id}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5 }}
            className="space-y-10"
          >
            {/* ATO 1 — ANTES DA ESCUTA */}
            {ato === 1 && (
              <div className="space-y-10 text-center">
                <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-10 md:p-14 space-y-6">
                  <Headphones className="w-8 h-8 text-gold/60 mx-auto" />
                  <div className="text-lg md:text-xl text-white/85 font-serif italic leading-relaxed whitespace-pre-line max-w-xl mx-auto">
                    {displayData.textoAntes ||
                      'Antes de ouvir, não procure a história literal da obra. Escute como a arte dá corpo a uma experiência humana. Permita que imagens, emoções, memórias e sensações cheguem antes de qualquer explicação.'}
                  </div>
                </div>
                <Button
                  onClick={() => setAto(2)}
                  className="bg-gold hover:bg-gold/90 text-midnight font-bold px-12 h-14 rounded-full uppercase tracking-[0.2em] text-xs"
                >
                  Começar Escuta
                </Button>
              </div>
            )}

            {/* ATO 2 — DURANTE A ESCUTA */}
            {ato === 2 && (
              <div className="space-y-10">
                {currentObra && (currentObra.url?.includes('spotify.com') || currentObra.url?.includes('spotify:')) ? (
                  <SpotifyPlaylistEmbed url={currentObra.url} territorio={currentObra.titulo} />
                ) : currentObra ? (
                  <EscutaPremium
                    audioUrl={currentObra.url}
                    titulo={currentObra.titulo}
                    imagemEscuta="/__l5e/assets-v1/6890f537-199d-46e1-9f3c-0c52f74c483f/disco-vinil-premium.png"
                  />
                ) : null}
                {playlistObra && currentObra?.id !== playlistObra.id && (
                  <SpotifyPlaylistEmbed url={playlistObra.url} territorio={playlistObra.titulo} />
                )}
                <div className="bg-gold/5 border border-gold/10 rounded-[32px] p-8 text-center">
                  <span className="text-[10px] text-gold/60 uppercase tracking-widest font-bold block mb-3">
                    Pergunta-guia
                  </span>
                  <p className="text-white/85 font-serif italic text-lg leading-relaxed max-w-xl mx-auto">
                    {displayData.perguntaDurante ||
                      'Enquanto escuta, observe: qual imagem, emoção ou sensação a obra acende em você?'}
                  </p>
                </div>
                <div className="flex justify-center pt-2">
                  <Button
                    onClick={() => setAto(3)}
                    variant="outline"
                    className="border-gold/40 text-gold hover:bg-gold/10 px-10 h-12 rounded-full uppercase tracking-[0.2em] text-[11px]"
                  >
                    Terminei a escuta
                  </Button>
                </div>
              </div>
            )}

            {/* ATO 3 — PRIMEIRA IMPRESSÃO */}
            {ato === 3 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <Label className="text-base text-white/70 font-serif italic block text-center">
                    O que chegou primeiro?
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {impressoes.map((i) => (
                      <button
                        key={i.id}
                        onClick={() => setPrimeiraImpressaoTipo(i.id)}
                        className={cn(
                          "px-3 py-3 rounded-2xl border text-xs font-serif italic transition-all text-center",
                          primeiraImpressaoTipo === i.id
                            ? "bg-gold/10 border-gold/50 text-gold"
                            : "bg-white/[0.02] border-white/10 text-white/50 hover:text-white/80 hover:border-white/20"
                        )}
                      >
                        {i.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Textarea
                    value={primeiraImpressaoTexto}
                    onChange={(e) => setPrimeiraImpressaoTexto(e.target.value)}
                    placeholder="Escreva sem explicar."
                    className="bg-white/[0.03] border-white/10 min-h-[120px] text-white/90 placeholder:text-white/20 focus:border-gold/30 focus:ring-0 rounded-2xl p-5 font-serif italic text-base resize-none"
                  />
                  <p className="text-[10px] uppercase tracking-widest text-white/30 text-center">
                    Capture a percepção antes da interpretação.
                  </p>
                </div>
              </div>
            )}

            {/* ATO 4 — LEITURA SIMBÓLICA */}
            {ato === 4 && (
              <div className="space-y-8">
                <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 md:p-10 space-y-4">
                  <div className="flex items-center gap-3 text-gold/60">
                    <Sparkles className="w-4 h-4" />
                    <h4 className="text-[10px] uppercase tracking-widest font-bold">Leitura Simbólica</h4>
                  </div>
                  <div className="text-base md:text-lg text-white/80 font-serif italic leading-relaxed whitespace-pre-line">
                    {displayData.textoLeitura ||
                      'A leitura simbólica não pergunta: sobre quem é essa obra?\n\nEla pergunta: que experiência humana esta obra tornou visível? Nesta obra, observe o símbolo central que permanece quando a história já passou.'}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base text-white/70 font-serif italic block">
                    Qual símbolo permaneceu?
                  </Label>
                  <Input
                    value={simbolo}
                    onChange={(e) => setSimbolo(e.target.value)}
                    placeholder="Ex: ferida, casa, ponte, abandono, estrada, lobo, mar, porta, ossos."
                    className="bg-white/[0.03] border-white/10 h-14 text-white placeholder:text-white/20 focus:border-gold/30 rounded-full px-6 text-base font-serif italic"
                  />
                  <div className="flex flex-wrap gap-2">
                    {["ferida", "casa", "ponte", "abandono", "estrada", "lobo", "mar", "porta", "ossos"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSimbolo(s)}
                        className="text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-gold hover:border-gold/30 transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ATO 5 — INTEGRAÇÃO */}
            {ato === 5 && (
              <div className="space-y-6">
                <Tabs defaultValue="psique" className="w-full">
                  <TabsList className="grid grid-cols-2 bg-white/[0.03] border border-white/5 rounded-full p-1 h-12">
                    <TabsTrigger value="psique" className="rounded-full text-xs uppercase tracking-widest font-bold data-[state=active]:bg-gold/10 data-[state=active]:text-gold">
                      <Heart className="w-3 h-3 mr-2" /> Eu · Psique
                    </TabsTrigger>
                    <TabsTrigger value="oficio" className="rounded-full text-xs uppercase tracking-widest font-bold data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400">
                      <BookOpen className="w-3 h-3 mr-2" /> Ofício
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="psique" className="mt-6 space-y-4">
                    <div className="bg-white/[0.02] border border-gold/10 rounded-[28px] p-8 space-y-4">
                      <span className="text-[10px] text-gold/60 uppercase tracking-widest font-bold block">
                        Jardim da Psique
                      </span>
                      <Label className="text-lg text-white font-serif italic block leading-relaxed">
                        {displayData.perguntaPsique || 'Onde minha dor deixou de ser experiência e passou a ser identidade?'}
                      </Label>
                      <Textarea
                        value={reflexaoPsique}
                        onChange={(e) => setReflexaoPsique(e.target.value)}
                        placeholder="Escreva livremente."
                        className="bg-white/[0.03] border-white/10 min-h-[140px] text-white/90 placeholder:text-white/20 focus:border-gold/30 focus:ring-0 rounded-2xl p-5 font-serif italic text-base resize-none"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="oficio" className="mt-6 space-y-4">
                    <div className="bg-white/[0.02] border border-emerald-500/10 rounded-[28px] p-8 space-y-4">
                      <span className="text-[10px] text-emerald-400/70 uppercase tracking-widest font-bold block">
                        Jardim do Ofício
                      </span>
                      <Label className="text-lg text-white font-serif italic block leading-relaxed">
                        {displayData.perguntaOficio || 'Como reconheço quando uma mulher organiza sua narrativa em torno da própria ferida?'}
                      </Label>
                      <Textarea
                        value={reflexaoOficio}
                        onChange={(e) => setReflexaoOficio(e.target.value)}
                        placeholder="Reflexão profissional."
                        className="bg-white/[0.03] border-white/10 min-h-[140px] text-white/90 placeholder:text-white/20 focus:border-emerald-500/30 focus:ring-0 rounded-2xl p-5 font-serif italic text-base resize-none"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Intensidade (compacto) */}
                <div className="bg-white/[0.02] border border-white/5 rounded-[24px] p-5 space-y-3">
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block">
                    Intensidade da escuta
                  </span>
                  <RadioGroup
                    value={intensidade}
                    onValueChange={setIntensidade}
                    className="grid grid-cols-4 gap-2"
                  >
                    {["Leve", "Moderada", "Profunda", "Transformadora"].map((opt) => (
                      <div key={opt} className="relative">
                        <RadioGroupItem value={opt} id={`int-${opt}`} className="peer sr-only" />
                        <Label
                          htmlFor={`int-${opt}`}
                          className="flex items-center justify-center p-2.5 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] peer-data-[state=checked]:border-gold/50 peer-data-[state=checked]:bg-gold/5 transition-all cursor-pointer text-[10px] uppercase tracking-widest font-bold text-white/40 peer-data-[state=checked]:text-gold"
                        >
                          {opt}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navegação inferior */}
        {ato !== 1 && (
          <div className="flex items-center justify-between gap-4 pt-12 mt-12 border-t border-white/5">
            <Button
              variant="ghost"
              onClick={() => setAto((ato - 1) as any)}
              className="text-white/40 hover:text-white text-[11px] uppercase tracking-widest font-bold"
            >
              <ArrowLeft className="w-3 h-3 mr-2" /> Voltar
            </Button>

            {ato < 5 ? (
              <Button
                onClick={() => podeAvancar && setAto((ato + 1) as any)}
                disabled={!podeAvancar}
                className="bg-gold hover:bg-gold/90 text-midnight font-bold px-10 h-12 rounded-full uppercase tracking-[0.2em] text-[11px] disabled:opacity-30"
              >
                Continuar <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleConcluirObra}
                disabled={isSaving || !podeAvancar}
                className="bg-gold hover:bg-gold/90 text-midnight font-bold px-10 h-12 rounded-full uppercase tracking-[0.2em] text-[11px] disabled:opacity-30"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isUltima ? 'Registrar Rastro da Escuta' : 'Registrar e próxima obra'}
              </Button>
            )}
          </div>
        )}
      </motion.div>
    );
  }


  return (
    <div className="space-y-12 max-w-5xl mx-auto py-12">
      {/* === Ressonâncias da Clareira — escuta leve + CTA Câmara do Sussurro === */}
      {playlistObra ? (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto px-4 sm:px-6"
        >
          <div className="rounded-[2rem] md:rounded-[2.5rem] bg-white/[0.025] border border-gold/15 backdrop-blur-md p-6 md:p-10 space-y-8 shadow-2xl">
            <header className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/20 bg-gold/5">
                <span className="w-1 h-1 rounded-full bg-gold animate-pulse" />
                <span className="text-[9px] uppercase tracking-[0.3em] font-black text-gold/80">Câmara da Escuta</span>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-light text-white tracking-wide">
                Ressonâncias da Clareira
              </h3>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-gold/60">
                Playlist de Escuta Simbólica
              </p>
            </header>

            <div className="text-sm md:text-base font-serif italic text-white/75 leading-relaxed space-y-3 text-center max-w-lg mx-auto">
              <p>Ouça sem tentar entender rápido.</p>
              <p>Deixe que a música revele imagens, emoções e memórias.</p>
              <p>A escuta simbólica começa quando algo em você percebe antes de explicar.</p>
              <p className="pt-2 text-white/60">
                Nesta estação, a música não é trilha de fundo.<br />
                Ela é uma porta de escuta.
              </p>
            </div>

            <SpotifyPlaylistEmbed url={playlistObra.url} territorio={playlistObra.territorio_principal} />

            <div className="flex justify-center pt-2">
              <Button
                asChild
                variant="outline"
                className="border-gold/40 text-gold hover:bg-gold/10 hover:text-gold rounded-full px-8 h-12 uppercase tracking-[0.2em] text-[10px] font-bold"
              >
                <a href="/clube/camara-do-sussurro?rota=rota-dos-lobos&estacao=clareira-do-chamado&modo=aprofundamento">
                  Ampliar escuta na Câmara do Sussurro
                  <ChevronRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </motion.section>
      ) : (
        <div className="max-w-2xl mx-auto py-20 text-center text-white/30 font-serif italic">
          Aguardando o desabrochar da playlist desta estação...
        </div>
      )}

      <div className="pt-4 flex flex-col items-center gap-6">
        <Button
          onClick={onNext}
          className="bg-gold hover:bg-gold/80 text-midnight font-bold px-12 h-14 rounded-full uppercase tracking-[0.2em] text-[10px] transition-all group"
        >
          Próximo Passo
          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};