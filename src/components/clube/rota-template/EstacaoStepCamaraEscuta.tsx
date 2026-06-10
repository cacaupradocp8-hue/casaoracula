import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Headphones, Sparkles, BookOpen, Music, CheckCircle2, ChevronRight, Info, Heart, ArrowLeft, History, X, MapPin, Loader2, Save } from 'lucide-react';
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
  onNext: () => void;
}

const CONTEUDO_ESPECIFICO: Record<string, any> = {
  "FERA FERIDA": {
    oQueEscutar: [
      "Não escute a letra.",
      "Escute a identidade.",
      "Observe como a ferida aparece quase como uma companheira inseparável.",
      "Pergunte-se: A ferida está sendo cuidada? Ou está sendo habitada?"
    ],
    oQueEvitar: [
      "Não transformar a música numa análise psicológica.",
      "Não procurar diagnósticos.",
      "Não procurar culpados.",
      "Apenas observe a relação da personagem com a própria dor."
    ],
    perguntaPsique: "O que em mim ainda canta, mesmo depois de ter sido ferido?",
    perguntaOficio: "Que sinais de vitalidade soterrada eu consigo reconhecer nas mulheres que acompanho?",
    rastroSimbolo: "🩸 A Ferida Habitável",
    territorioImpactado: "Praça do Abalo"
  },
  "NOTURNO": {
    oQueEscutar: [
      "Escute o vazio.",
      "Escute a ausência.",
      "Escute aquilo que não está sendo dito.",
      "Esta música não fala apenas de amor. Fala daquilo que continua presente mesmo quando desapareceu."
    ],
    oQueEvitar: [
      "Não interpretar literalmente.",
      "A ausência nem sempre é uma pessoa.",
      "Pode ser: um sonho, uma identidade, uma fase da vida ou uma potência esquecida."
    ],
    perguntaPsique: "O que continua vivendo dentro de mim mesmo depois de ter partido?",
    perguntaOficio: "Como reconhecer quando a cliente está vivendo uma perda que ainda não conseguiu nomear?",
    rastroSimbolo: "🌑 O Lugar Vazio",
    territorioImpactado: "Casa dos Sonhos"
  },
  "REVELAÇÃO": {
    oQueEscutar: [
      "Escute o instante da percepção.",
      "O momento em que algo que sempre esteve presente finalmente se torna visível.",
      "Essa música trabalha um fenômeno fundamental da leitura simbólica: não descobrir algo novo, mas perceber algo que sempre esteve ali."
    ],
    oQueEvitar: [
      "Não procurar grandes epifanias.",
      "Às vezes a revelação é pequena. Mas muda tudo."
    ],
    perguntaPsique: "O que eu já sabia antes mesmo de conseguir explicar?",
    perguntaOficio: "Como reconhecer quando a percepção da cliente chegou antes da linguagem?",
    rastroSimbolo: "🔑 A Verdade Reconhecida",
    territorioImpactado: "Portas"
  },
  "MARIA MARIA": {
    oQueEscutar: [
      "Escute a força. Mas não a força heroica.",
      "Escute a força cotidiana.",
      "Aquela que continua caminhando mesmo quando está cansada."
    ],
    oQueEvitar: [
      "Não romantizar sofrimento.",
      "A força desta música não está em suportar tudo. Está em continuar viva."
    ],
    perguntaPsique: "Qual parte de mim permaneceu viva mesmo durante os períodos mais difíceis?",
    perguntaOficio: "Como ajudar uma mulher a reconhecer recursos internos que ela já possui?",
    rastroSimbolo: "🌻 A Mulher que Continua",
    territorioImpactado: "A Forja"
  }
};

export const EstacaoStepCamaraEscuta: React.FC<EstacaoStepCamaraEscutaProps> = ({
  estacaoId,
  onNext
}) => {
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

  useEffect(() => {
    if (activeObra) {
      setReflexaoPsique('');
      setReflexaoOficio('');
      setSimbolo('');
      setIntensidade('Moderada');
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
      const specific = CONTEUDO_ESPECIFICO[activeObra.titulo.toUpperCase()] || {};
      const puntoId = `escuta:${activeObra.id}`;
      
      // 1. Save to clube_camara_escuta_registros
      const { error: regError } = await (supabase as any)
        .from('clube_camara_escuta_registros')
        .insert({
          user_id: user.id,
          obra_id: activeObra.id,
          rota_id: activeObra.rota_id,
          estacao_id: activeObra.estacao_id,
          simbolo_observado: simbolo,
          intensidade_escuta: intensidade,
          territorio_impactado: specific.territorioImpactado || activeObra.territorio_principal,
          registro_psique: reflexaoPsique,
          registro_oficio: reflexaoOficio,
          data_escuta: new Date().toISOString()
        });

      if (regError) throw regError;

      // 2. Save to Jardim da Psique
      const { error: psiqueError } = await (supabase as any)
        .from('jardim_psique_registros')
        .insert({
          user_id: user.id,
          reflexao_pessoal: reflexaoPsique,
          titulo: `Escuta: ${activeObra.titulo}`,
          tipo_registro: 'estacao_rota',
          ferramenta_chave: puntoId,
          ferramenta_nome: `Câmara da Escuta: ${activeObra.titulo}`,
          data_aplicacao: new Date().toISOString()
        });

      if (psiqueError) throw psiqueError;

      // 3. Save to Jardim do Ofício
      const { error: oficioError } = await (supabase as any)
        .from('jardim_do_oficio')
        .insert({
          user_id: user.id,
          reflexao_profissional: reflexaoOficio,
          contexto_origem: `ponto:${puntoId}`
        });

      if (oficioError) throw oficioError;

      // 4. Update Cartografia (user_cidadela_estado)
      const territorio = specific.territorioImpactado || activeObra.territorio_principal;
      if (territorio) {
        try {
          const { data: estado } = await (supabase as any)
            .from('user_cidadela_estado')
            .select('distritos_ativados')
            .eq('user_id', user.id)
            .maybeSingle();
            
          const distritos = estado?.distritos_ativados || [];
          if (!distritos.includes(territorio)) {
            await (supabase as any)
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
    if (!user) return;
    
    setDevolutivaChoice(choice);
    setIsSaving(true);
    
    try {
      // Save final choice to cartografia
      await (supabase as any)
        .from('user_cidadela_estado')
        .upsert({
          user_id: user.id,
          voz: choice,
          ultimo_movimento: new Date().toISOString()
        });

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
        className="max-w-3xl mx-auto space-y-12 py-12 text-center"
      >
        <div className="space-y-6">
          <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-8">
            <History className="w-10 h-10 text-gold" />
          </div>
          <h2 className="text-4xl md:text-7xl font-display font-black text-white tracking-[0.1em] leading-tight uppercase relative inline-block">
            <span className="bg-gradient-to-b from-white via-[#e2c186] to-[#b89555] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] filter contrast-[1.1]">
              Clareira do<br />Chamado
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

        <div className="pt-8">
          <Button 
            onClick={onNext}
            className="bg-gold hover:bg-gold/80 text-midnight font-bold px-16 h-16 rounded-full uppercase tracking-widest text-xs shadow-2xl shadow-gold/20 transition-all hover:scale-105"
          >
            Continuar a Travessia
          </Button>
        </div>
      </motion.div>
    );
  }

  if (activeObra || inPlaylistMode) {
    const currentObra = activeObra || faixasObras[0];
    const specificFromCode = CONTEUDO_ESPECIFICO[currentObra?.titulo?.toUpperCase()] || {};
    
    const displayData = {
      oQueEscutar: (currentObra?.guia_escuta && currentObra.guia_escuta.length > 0) ? currentObra.guia_escuta : specificFromCode.oQueEscutar,
      oQueEvitar: (currentObra?.guia_evitar && currentObra.guia_evitar.length > 0) ? currentObra.guia_evitar : specificFromCode.oQueEvitar,
      rastroSimbolo: currentObra?.rastro_simbolo || specificFromCode.rastroSimbolo,
      perguntaPsique: currentObra?.pergunta_psique || specificFromCode.perguntaPsique,
      perguntaOficio: currentObra?.pergunta_oficio || specificFromCode.perguntaOficio,
      territorioImpactado: currentObra?.territorio_principal || specificFromCode.territorioImpactado
    };

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-12 max-w-6xl mx-auto pb-20"
      >
        <button 
          onClick={() => {
            setActiveObra(null);
            setInPlaylistMode(false);
          }}
          className="flex items-center gap-3 text-[10px] text-white/40 uppercase tracking-widest font-bold hover:text-gold transition-all group"
        >
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gold/30">
            <ArrowLeft className="w-3 h-3" />
          </div>
          Voltar à Câmara da Escuta Simbólica
        </button>

        {inPlaylistMode && playlistObra && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <span className="text-[10px] text-gold uppercase tracking-[0.4em] font-bold opacity-60">Imersão Sonora</span>
              <h3 className="text-4xl font-serif text-white italic leading-tight">Câmara da Escuta Simbólica</h3>
            </div>
            <SpotifyPlaylistEmbed url={playlistObra.url} />
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 space-y-8 sticky top-12">
            {inPlaylistMode ? (
              <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[32px] space-y-4">
                <span className="text-[9px] text-gold uppercase tracking-[0.3em] font-bold opacity-40 block">Obras da Sequência</span>
                <div className="space-y-2">
                  {faixasObras.map((f, i) => (
                    <button
                      key={f.id}
                      onClick={() => setActiveObra(f)}
                      className={cn(
                        "w-full text-left p-4 rounded-2xl transition-all border font-serif italic text-sm",
                        currentObra?.id === f.id
                          ? "bg-gold/10 border-gold/30 text-gold"
                          : "bg-transparent border-transparent text-white/40 hover:text-white/60"
                      )}
                    >
                      {i + 1}. {f.titulo}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <span className="text-[10px] text-gold uppercase tracking-[0.4em] font-bold opacity-60">Guia de Percepção</span>
                <h3 className="text-4xl font-serif text-white italic leading-tight">{currentObra?.titulo}</h3>
                <p className="text-gold/80 font-serif italic text-lg border-l-2 border-gold/20 pl-6 py-2">
                  {currentObra?.funcao_escuta}
                </p>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentObra?.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {displayData.oQueEscutar && displayData.oQueEscutar.length > 0 && (
                  <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-gold/60">
                        <Headphones className="w-4 h-4" />
                        <h4 className="text-[10px] uppercase tracking-widest font-bold">O que escutar</h4>
                      </div>
                      <ul className="space-y-3">
                        {displayData.oQueEscutar.map((item: string, i: number) => (
                          <li key={i} className="text-sm text-white/70 font-serif italic leading-relaxed">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {displayData.oQueEvitar && displayData.oQueEvitar.length > 0 && (
                      <div className="space-y-4 pt-6 border-t border-white/5">
                        <div className="flex items-center gap-3 text-red-400/60">
                          <X className="w-4 h-4" />
                          <h4 className="text-[10px] uppercase tracking-widest font-bold">O que evitar</h4>
                        </div>
                        <ul className="space-y-3">
                          {displayData.oQueEvitar.map((item: string, i: number) => (
                            <li key={i} className="text-sm text-white/50 font-serif italic leading-relaxed">
                              • {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-gold/5 border border-gold/10 p-8 rounded-[32px] space-y-4">
                  <div className="flex items-center gap-3 text-gold/60">
                    <MapPin className="w-4 h-4" />
                    <h4 className="text-[10px] uppercase tracking-widest font-bold">Impacto na Cartografia</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold block">Símbolo</span>
                      <p className="text-gold font-serif italic">{displayData.rastroSimbolo || "Observado no rastro"}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold block">Território</span>
                      <p className="text-white/80 font-serif italic">{displayData.territorioImpactado || currentObra?.territorio_principal}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="bg-[#050505]/40 backdrop-blur-md border border-white/5 p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentObra?.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10 space-y-12"
                >
                  {currentObra && !inPlaylistMode && (
                    <EscutaPremium 
                      audioUrl={currentObra.url}
                      titulo={currentObra.titulo}
                      imagemEscuta="/clareira-disco.png"
                    />
                  )}

                  <div className={cn("space-y-12", !inPlaylistMode && "pt-10 border-t border-white/10")}>
                    <div className="space-y-12">
                      {/* BLOCO 1 — JARDIM DA PSIQUE */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 text-gold/80">
                          <Heart className="w-5 h-5" />
                          <h4 className="text-sm uppercase tracking-widest font-bold font-serif">Jardim da Psique</h4>
                        </div>
                        <div className="space-y-4">
                          <Label className="text-xl text-white font-serif italic block">
                            {displayData.perguntaPsique || "O que esta obra revelou sobre você?"}
                          </Label>
                          <Textarea 
                            value={reflexaoPsique}
                            onChange={(e) => setReflexaoPsique(e.target.value)}
                            placeholder="Escreva livremente o que surgiu durante a escuta."
                            className="bg-white/[0.03] border-white/10 min-h-[150px] text-white/90 placeholder:text-white/20 focus:border-gold/30 focus:ring-0 rounded-2xl p-6 leading-relaxed font-serif italic text-lg shadow-inner resize-none transition-all"
                          />
                        </div>
                      </div>

                      {/* BLOCO 2 — JARDIM DO OFÍCIO */}
                      <div className="space-y-6 pt-8 border-t border-white/5">
                        <div className="flex items-center gap-3 text-emerald-400/80">
                          <BookOpen className="w-5 h-5" />
                          <h4 className="text-sm uppercase tracking-widest font-bold font-serif">Jardim do Ofício</h4>
                        </div>
                        <div className="space-y-4">
                          <Label className="text-xl text-white font-serif italic block">
                            {displayData.perguntaOficio || "O que esta obra revelou sobre sua escuta profissional?"}
                          </Label>
                          <Textarea 
                            value={reflexaoOficio}
                            onChange={(e) => setReflexaoOficio(e.target.value)}
                            placeholder="Que movimentos, padrões ou narrativas você reconhece nas mulheres que acompanha?"
                            className="bg-white/[0.03] border-white/10 min-h-[150px] text-white/90 placeholder:text-white/20 focus:border-emerald-500/30 focus:ring-0 rounded-2xl p-6 leading-relaxed font-serif italic text-lg shadow-inner resize-none transition-all"
                          />
                        </div>
                      </div>

                      {/* BLOCO 3 — SÍMBOLO OBSERVADO */}
                      <div className="space-y-6 pt-8 border-t border-white/5">
                        <div className="flex items-center gap-3 text-blue-400/80">
                          <Sparkles className="w-5 h-5" />
                          <h4 className="text-sm uppercase tracking-widest font-bold font-serif">Símbolo Observado</h4>
                        </div>
                        <div className="space-y-4">
                          <Label className="text-xl text-white font-serif italic block">
                            Qual símbolo permaneceu ecoando?
                          </Label>
                          <div className="space-y-4">
                            <Input 
                              value={simbolo}
                              onChange={(e) => setSimbolo(e.target.value)}
                              placeholder="Escreva o símbolo principal (ex: floresta, ponte, casa...)"
                              className="bg-white/[0.03] border-white/10 h-14 text-white placeholder:text-white/20 focus:border-blue-400/30 rounded-full px-8 text-lg font-serif italic"
                            />
                            <div className="flex flex-wrap gap-2 px-2">
                              {["floresta", "ponte", "casa", "ferida", "lobo", "mar", "porta", "espelho", "ossos"].map(s => (
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
                      </div>

                      {/* BLOCO 4 — INTENSIDADE DA ESCUTA */}
                      <div className="space-y-6 pt-8 border-t border-white/5">
                        <div className="flex items-center gap-3 text-purple-400/80">
                          <Music className="w-5 h-5" />
                          <h4 className="text-sm uppercase tracking-widest font-bold font-serif">Intensidade da Escuta</h4>
                        </div>
                        <div className="space-y-6">
                          <Label className="text-xl text-white font-serif italic block">
                            Como esta obra impactou sua percepção?
                          </Label>
                          <RadioGroup 
                            value={intensidade} 
                            onValueChange={setIntensidade}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4"
                          >
                            {["Leve", "Moderada", "Profunda", "Transformadora"].map((opt) => (
                              <div key={opt} className="relative">
                                <RadioGroupItem value={opt} id={opt} className="peer sr-only" />
                                <Label
                                  htmlFor={opt}
                                  className="flex flex-col items-center justify-center p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] peer-data-[state=checked]:border-gold/50 peer-data-[state=checked]:bg-gold/5 transition-all cursor-pointer text-center group"
                                >
                                  <span className="text-xs uppercase tracking-widest font-bold text-white/40 peer-data-[state=checked]:text-gold group-hover:text-white/60 transition-colors">
                                    {opt}
                                  </span>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center pt-8">
               <Button 
                onClick={handleConcluirObra}
                disabled={isSaving}
                className="bg-gold hover:bg-gold/80 text-midnight font-bold px-12 h-20 rounded-full uppercase tracking-[0.2em] text-xs transition-all shadow-2xl shadow-gold/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-3" />
                ) : (
                  <Save className="w-5 h-5 mr-3" />
                )}
                {faixasObras.indexOf(currentObra!) === faixasObras.length - 1 
                  ? "Finalizar Sequência de Escuta" 
                  : "Concluir Escuta e Próxima Obra"}
              </Button>
            </div>

          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-16 max-w-5xl mx-auto py-12">
      <div className="space-y-8 text-center max-w-3xl mx-auto">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-3 text-gold/60">
            <div className="h-px w-8 bg-gold/20" />
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Câmara da Escuta</span>
            <div className="h-px w-8 bg-gold/20" />
          </div>
          <h2 className="text-4xl md:text-6xl font-serif text-white italic leading-tight">Câmara da Escuta Simbólica</h2>
        </div>
        
        <div className="space-y-6 px-4">
          <p className="text-gold/80 text-xl font-serif italic leading-relaxed">
            “Uma sequência sonora para treinar sua escuta simbólica antes de registrar seus rastros.”
          </p>
          <p className="text-white/40 font-serif italic text-base max-w-2xl mx-auto leading-relaxed">
            “Ouça sem tentar interpretar rápido. Observe imagens, emoções, frases, memórias e incômodos que surgem. A escuta simbólica começa quando algo em nós percebe antes de explicar.”
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {/* Card Principal da Playlist */}
        {playlistObra && (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -10, scale: 1.02 }}
            onClick={() => {
              setInPlaylistMode(true);
              setActiveObra(faixasObras[0] || null);
            }}
            className="md:col-span-2 lg:col-span-3 group relative overflow-hidden border rounded-[48px] p-12 text-left transition-all flex flex-col md:flex-row items-center gap-12 shadow-3xl bg-gradient-to-br from-emerald-500/10 via-background to-gold/5 border-emerald-500/20 hover:border-emerald-500/40"
          >
            <div className="absolute inset-0 bg-[url('/clareira-disco.png')] opacity-5 bg-cover bg-center" />
            
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden flex-shrink-0 border-2 border-emerald-500/20 group-hover:border-emerald-500/40 transition-colors">
              <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />
              <img src="/clareira-disco.png" className="w-full h-full object-cover relative z-10 opacity-60 group-hover:opacity-100 transition-opacity" alt="Playlist" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
              </div>
            </div>

            <div className="relative flex-grow space-y-8 text-center md:text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Sequência Recomendada</span>
                </div>
                <h4 className="text-4xl md:text-6xl font-serif text-white italic leading-tight group-hover:text-emerald-400 transition-colors">
                  Câmara da Escuta Simbólica
                </h4>
                {playlistObra.funcao_escuta && (
                  <p className="text-xl text-white/50 font-serif italic leading-relaxed max-w-2xl">
                    {playlistObra.funcao_escuta}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 pt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Obras Integradas</span>
                  <span className="text-emerald-400 font-serif italic text-lg">{faixasObras.length} faixas individuais</span>
                </div>
                <Button className="bg-emerald-500 hover:bg-emerald-400 text-midnight font-bold px-10 h-16 rounded-full uppercase tracking-widest text-xs shadow-2xl shadow-emerald-500/20 transition-all group/btn">
                  Entrar na Câmara
                  <ChevronRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </motion.button>
        )}

        {/* Fallback ou Lista complementar (apenas se NÃO houver playlist) */}
        {!playlistObra && faixasObras.map((obra, index) => {
          return (
            <motion.button
              key={obra.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => setActiveObra(obra)}
              className="group relative overflow-hidden border rounded-[40px] p-10 text-left transition-all flex flex-col h-full shadow-2xl backdrop-blur-sm bg-white/[0.02] border-white/5 hover:bg-gold/[0.03] hover:border-gold/20"
            >
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                 <Music className="w-16 h-16 text-gold" />
              </div>

              <div className="flex-grow space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center text-gold text-[10px] font-bold">
                    {index + 1}
                  </span>
                  <span className="text-[9px] text-gold/40 uppercase tracking-[0.3em] font-black">
                    {obra.tipo}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-3xl font-serif text-white italic group-hover:text-gold transition-colors leading-tight">
                    {obra.titulo}
                  </h4>
                  <div className="flex items-center gap-2 text-gold/60">
                    <Info className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Função</span>
                  </div>
                  <p className="text-base text-white/50 font-serif italic leading-relaxed line-clamp-3">
                    {obra.funcao_escuta}
                  </p>
                </div>
              </div>

              <div className="pt-10 flex items-center justify-between border-t border-white/5">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-white/20 uppercase tracking-widest font-bold">Território</span>
                  <span className="text-[10px] text-gold/60 uppercase tracking-widest font-bold">
                    {obra.territorio_principal}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-midnight transition-all duration-500 shadow-lg">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </motion.button>
          );
        })}

        {(!obras || obras.length === 0) && (
          <div className="col-span-full py-32 text-white/10 border-2 border-dashed border-white/5 rounded-[40px] font-serif italic text-2xl flex flex-col items-center gap-4">
            <Sparkles className="w-8 h-8 opacity-20" />
            Aguardando o desabrochar das obras...
          </div>
        )}
      </div>

      <div className="pt-16 flex flex-col items-center gap-8">
        <div className="flex items-center gap-4 px-8 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
          <CheckCircle2 className="w-4 h-4 text-gold/40" />
          <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">Treinamento de Percepção Simbólica</span>
        </div>
      </div>
    </div>
  );
};