import React, { useState } from 'react';
import { Headphones, Sparkles, BookOpen, Music, CheckCircle2, ChevronRight, Info, Heart, ArrowLeft, History, X, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCamaraObras, CamaraObra } from '@/hooks/useClubeTemplate';
import { Button } from '@/components/ui/button';
import { EscutaPremium } from '@/components/clube/EscutaPremium';
import { JardimInput } from '@/components/clube/JardimInput';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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
    perguntaPsique: "Onde minha dor deixou de ser experiência e passou a ser identidade?",
    perguntaOficio: "Como percebo quando uma cliente organiza toda sua narrativa em torno da própria ferida?",
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
  const [showRastro, setShowRastro] = useState(false);
  const [showDevolutiva, setShowDevolutiva] = useState(false);
  const [devolutivaChoice, setDevolutivaChoice] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-gold">
        <Headphones className="w-8 h-8 animate-pulse" />
        <span className="font-serif italic text-sm">Abrindo a Câmara...</span>
      </div>
    );
  }

  const handleConcluirObra = () => {
    if (obras && activeObra) {
      const currentIndex = obras.findIndex(o => o.id === activeObra.id);
      if (currentIndex === obras.length - 1) {
        setShowDevolutiva(true);
        setActiveObra(null);
      } else {
        setActiveObra(null);
      }
    }
  };

  const handleDevolutivaFinal = async (choice: string) => {
    setDevolutivaChoice(choice);
    setShowRastro(true);
    setShowDevolutiva(false);
    toast.success("Rastro permanente gerado na Cartografia.");
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
          <h2 className="text-3xl md:text-5xl font-serif text-white italic leading-tight">Você atravessou a Sequência da Clareira.</h2>
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
                className="p-8 rounded-[32px] bg-white/[0.03] border border-white/10 hover:border-gold/40 hover:bg-gold/5 transition-all group text-left flex items-center gap-6"
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
          <h2 className="text-4xl font-serif text-white italic">Escuta da Clareira registrada</h2>
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
              <p className="text-white font-serif italic text-lg">Sequência de Escuta da Clareira</p>
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

  if (activeObra) {
    const specific = CONTEUDO_ESPECIFICO[activeObra.titulo.toUpperCase()] || {};

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-12 max-w-6xl mx-auto pb-20"
      >
        <button 
          onClick={() => setActiveObra(null)}
          className="flex items-center gap-3 text-[10px] text-white/40 uppercase tracking-widest font-bold hover:text-gold transition-all group"
        >
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gold/30">
            <ArrowLeft className="w-3 h-3" />
          </div>
          Voltar à Sequência de Escuta
        </button>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 space-y-8 sticky top-12">
            <div className="space-y-4">
              <span className="text-[10px] text-gold uppercase tracking-[0.4em] font-bold opacity-60">Guia de Percepção</span>
              <h3 className="text-4xl font-serif text-white italic leading-tight">{activeObra.titulo}</h3>
              <p className="text-gold/80 font-serif italic text-lg border-l-2 border-gold/20 pl-6 py-2">
                {activeObra.funcao_escuta}
              </p>
            </div>

            {specific.oQueEscutar && (
              <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gold/60">
                    <Headphones className="w-4 h-4" />
                    <h4 className="text-[10px] uppercase tracking-widest font-bold">O que escutar</h4>
                  </div>
                  <ul className="space-y-3">
                    {specific.oQueEscutar.map((item: string, i: number) => (
                      <li key={i} className="text-sm text-white/70 font-serif italic leading-relaxed">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3 text-red-400/60">
                    <X className="w-4 h-4" />
                    <h4 className="text-[10px] uppercase tracking-widest font-bold">O que evitar</h4>
                  </div>
                  <ul className="space-y-3">
                    {specific.oQueEvitar.map((item: string, i: number) => (
                      <li key={i} className="text-sm text-white/50 font-serif italic leading-relaxed">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
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
                  <p className="text-gold font-serif italic">{specific.rastroSimbolo || "Observado no rastro"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold block">Território</span>
                  <p className="text-white/80 font-serif italic">{specific.territorioImpactado || activeObra.territorio_principal}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="bg-[#050505]/40 backdrop-blur-md border border-white/5 p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
              <div className="relative z-10 space-y-12">
                <EscutaPremium 
                  audioUrl={activeObra.url}
                  titulo={activeObra.titulo}
                  imagemEscuta="/clareira-disco.png"
                />

                <div className="pt-10 border-t border-white/10 space-y-12">
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-gold/80">
                        <Heart className="w-4 h-4" />
                        <h4 className="text-xs uppercase tracking-widest font-bold font-serif">Pergunta da Psique</h4>
                      </div>
                      <p className="text-2xl text-white font-serif italic leading-relaxed">
                        “{specific.perguntaPsique || "O que em mim ainda canta, mesmo depois de ter sido ferido?"}”
                      </p>
                      <JardimInput 
                        type="psique"
                        pergunta={specific.perguntaPsique || "O que em mim ainda canta, mesmo depois de ter sido ferido?"}
                        estacaoId={estacaoId}
                        pontoId={`escuta:${activeObra.id}`}
                        sourceTitle={`Escuta: ${activeObra.titulo}`}
                      />
                    </div>

                    <div className="space-y-4 pt-8 border-t border-white/5">
                      <div className="flex items-center gap-3 text-gold/80">
                        <BookOpen className="w-4 h-4" />
                        <h4 className="text-xs uppercase tracking-widest font-bold font-serif">Pergunta do Ofício</h4>
                      </div>
                      <p className="text-2xl text-white font-serif italic leading-relaxed">
                        “{specific.perguntaOficio || "Que sinais de vitalidade soterrada eu consigo reconhecer nas mulheres que acompanho?"}”
                      </p>
                      <JardimInput 
                        type="oficio"
                        pergunta={specific.perguntaOficio || "Que sinais de vitalidade soterrada eu consigo reconhecer nas mulheres que acompanho?"}
                        estacaoId={estacaoId}
                        pontoId={`escuta:${activeObra.id}`}
                        sourceTitle={`Escuta: ${activeObra.titulo}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
               <Button 
                onClick={handleConcluirObra}
                className="bg-gold hover:bg-gold/80 text-midnight font-bold px-12 h-16 rounded-full uppercase tracking-widest text-xs transition-all shadow-xl shadow-gold/10"
              >
                Concluir Registro e Avançar na Sequência
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
          <h2 className="text-4xl md:text-6xl font-serif text-white italic leading-tight">Sequência de Escuta da Clareira</h2>
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

      <div className="grid md:grid-cols-2 gap-6 px-4">
        {obras?.map((obra, index) => (
          <motion.button
            key={obra.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => setActiveObra(obra)}
            className="group relative overflow-hidden bg-white/[0.02] border border-white/5 rounded-[40px] p-10 text-left transition-all hover:bg-gold/[0.03] hover:border-gold/20 flex flex-col h-full shadow-2xl backdrop-blur-sm"
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
        ))}

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