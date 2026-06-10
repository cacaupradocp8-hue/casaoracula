import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, Quote, BookOpen, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface OraculoEstacaoProps {
  estacaoId: string;
  rotaId: string;
  nomeCarta: string;
  imagemUrl: string;
  mensagem: string;
  pergunta: string;
  integracaoTexto: string;
  traducaoPorta?: string;
  traducaoTorre?: string;
  traducaoLabirinto?: string;
  onNext: () => void;
}

export const EstacaoStepOraculo: React.FC<OraculoEstacaoProps> = ({
  estacaoId,
  rotaId,
  nomeCarta,
  imagemUrl,
  mensagem,
  pergunta,
  integracaoTexto,
  traducaoPorta,
  traducaoTorre,
  traducaoLabirinto,
  onNext
}) => {
  const { user } = useAuth();
  const [view, setView] = useState<'carta' | 'revelacao' | 'concluido'>('carta');
  const [isFlipped, setIsFlipped] = useState(false);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      
      const { error } = await supabase
        .from('clube_oraculo_estacao_registros')
        .insert({
          user_id: user.id,
          rota_id: rotaId,
          estacao_id: estacaoId,
          oraculo_nome: nomeCarta,
          pergunta_oraculo: pergunta,
          status: 'concluido'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      setView('concluido');
      toast.success('Oráculo integrado ao seu rastro!');
    },
    onError: (err: any) => {
      toast.error('Erro ao salvar registro: ' + err.message);
    }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 px-4">
      <AnimatePresence mode="wait">
        {view === 'carta' && (
          <motion.div
            key="carta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center space-y-12 py-10"
          >
            <div className="space-y-4">
              <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-gold" />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-white italic">Oráculo da Estação</h2>
              <p className="text-gold/60 text-xl max-w-2xl mx-auto font-serif italic leading-relaxed">
                “A imagem que sela a travessia.”
              </p>
            </div>

            <div className="relative group perspective-1000 mx-auto max-w-sm">
              <motion.div
                whileHover={{ scale: 1.02, rotateY: 5 }}
                className="relative aspect-[2/3] w-full bg-[#0A0A0B] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl shadow-black/50 cursor-pointer"
                onClick={() => setView('revelacao')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-transparent to-emerald-500/10 opacity-30" />
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                  <div className="w-32 h-32 rounded-full border-2 border-gold/20 flex items-center justify-center p-4">
                    <div className="w-full h-full rounded-full border border-gold/40 flex items-center justify-center animate-pulse">
                       <Sparkles className="w-12 h-12 text-gold/40" />
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-black">Toque para Revelar</span>
                </div>
                
                {imagemUrl && (
                  <img src={imagemUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-luminosity grayscale group-hover:opacity-20 transition-opacity duration-700" />
                )}
              </motion.div>
            </div>
          </motion.div>
        )}

        {view === 'revelacao' && (
          <motion.div
            key="revelacao"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-7xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 lg:gap-16 items-start">
              {/* Lado Esquerdo: A Carta Física com Efeito Frente e Verso */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative aspect-[2/3] w-full max-w-md mx-auto perspective-1000 group cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.8, type: "spring", stiffness: 260, damping: 20 }}
                  className="relative w-full h-full transition-all duration-500 preserve-3d"
                >
                  {/* FRENTE DA CARTA */}
                  <div className="absolute inset-0 backface-hidden">
                    <Card className="absolute inset-0 bg-[#0A0A0B] rounded-[38px] overflow-hidden border-[6px] border-[#0A0A0B] shadow-2xl">
                      <div className="relative h-full w-full">
                        {imagemUrl && (
                          <img 
                            src={imagemUrl} 
                            alt={nomeCarta} 
                            className="w-full h-full object-cover object-left" 
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                      </div>
                    </Card>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-1 rounded-full border border-gold/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[8px] text-gold tracking-widest uppercase">Toque para Ver o Verso</span>
                    </div>
                  </div>

                  {/* VERSO DA CARTA */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180">
                    <Card className="absolute inset-0 bg-[#0A0A0B] rounded-[38px] overflow-hidden border-[6px] border-[#0A0A0B] shadow-2xl">
                      <div className="relative h-full w-full">
                        {imagemUrl && (
                          <img 
                            src={imagemUrl} 
                            alt={`${nomeCarta} - Verso`} 
                            className="w-full h-full object-cover object-left opacity-90 grayscale-[0.2]" 
                          />
                        )}
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] pointer-events-none" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent">
                          <div className="w-24 h-24 rounded-full border border-gold/30 flex items-center justify-center p-2 mb-4 bg-black/40 backdrop-blur-md">
                             <Sparkles className="w-10 h-10 text-gold/40" />
                          </div>
                          <div className="space-y-2 text-center bg-black/60 backdrop-blur-md p-4 rounded-xl border border-gold/20">
                            <div className="text-[10px] tracking-[0.4em] text-gold/60 uppercase font-black">CASA ORÁCULA</div>
                            <div className="h-px w-8 bg-gold/30 mx-auto" />
                            <div className="text-[8px] tracking-[0.2em] text-gold/40 uppercase font-medium">Verso da Carta</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-1 rounded-full border border-gold/20 pointer-events-none">
                      <span className="text-[8px] text-gold tracking-widest uppercase">Toque para Ver a Frente</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Lado Direito: Informações Oraculares */}
              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-12 text-center lg:text-left pt-6 lg:pt-0"
              >
                <div className="space-y-2">
                  <div className="text-[11px] tracking-[0.5em] text-gold/50 uppercase font-black text-center">CARTA 01</div>
                  <h3 className="text-5xl md:text-7xl font-serif text-white tracking-tight flex items-center justify-center gap-6">
                    <span className="h-px w-8 bg-gold/20 hidden md:block" />
                    {nomeCarta}
                    <span className="h-px w-8 bg-gold/20 hidden md:block" />
                  </h3>
                  <div className="text-sm tracking-[0.3em] text-gold uppercase font-light text-center">A ARQUITETA DO CHAMADO</div>
                </div>

                {/* Palavras-Chave */}
                <div className="space-y-4 text-center">
                   <div className="text-[10px] tracking-[0.4em] text-gold/40 uppercase font-bold">Palavras-Chave</div>
                   <div className="text-white/80 font-serif italic text-xl">
                      {integracaoTexto.split('•').map((word, i, arr) => (
                        <span key={i}>
                          {word.trim()}
                          {i < arr.length - 1 && <span className="mx-3 text-gold/40">•</span>}
                        </span>
                      ))}
                   </div>
                   <div className="h-px w-full bg-white/5" />
                </div>

                {/* Mensagem da Estação */}
                <div className="space-y-6 text-center">
                  <div className="text-[10px] tracking-[0.4em] text-gold/40 uppercase font-bold">Mensagem da Estação</div>
                  <div className="relative max-w-2xl mx-auto">
                    <p className="text-white/90 text-xl md:text-2xl font-serif italic leading-relaxed">
                      {mensagem.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}<br />
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                  <div className="h-px w-full bg-white/5" />
                </div>

                {/* Grid de Trindade (Porta, Torre, Labirinto) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  {[
                    { title: 'A PORTA', subtitle: 'CLAREIRA DO CHAMADO', text: traducaoPorta || 'Você está diante do limiar entre a vida adaptada e o retorno à sua natureza.', icon: '⛩️' },
                    { title: 'A TORRE', subtitle: 'A ADAPTAÇÃO', text: traducaoTorre || 'Você aprendeu a ser aceita, mas se afastou daquilo que te torna verdadeiramente viva.', icon: '🏰' },
                    { title: 'O LABIRINTO', subtitle: 'O EXÍLIO DA PRÓPRIA NATUREZA', text: traducaoLabirinto || 'Você se perdeu de si para pertencer. Agora o caminho de volta começa aqui.', icon: '🌀' }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-center space-y-3 flex flex-col items-center">
                      <div className="text-2xl mb-2 grayscale opacity-60">{item.icon}</div>
                      <div className="space-y-1">
                        <div className="text-[10px] tracking-[0.2em] text-gold uppercase font-bold">{item.title}</div>
                        <div className="text-[8px] tracking-[0.1em] text-white/30 uppercase font-medium">{item.subtitle}</div>
                      </div>
                      <p className="text-xs text-white/60 font-serif italic leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Pergunta Oracular */}
                <div className="space-y-6 text-center pt-4">
                  <div className="text-[10px] tracking-[0.4em] text-gold uppercase font-bold">Pergunta Oracular</div>
                  <p className="text-white text-2xl md:text-3xl font-serif italic leading-tight max-w-2xl mx-auto">
                    “{pergunta}”
                  </p>
                  <div className="flex items-center justify-center gap-2 text-gold/40">
                    <span className="text-xs italic">Método Oracular Integrado</span>
                  </div>
                </div>

                <div className="pt-8 max-w-md mx-auto">
                  <Button 
                    onClick={() => saveMutation.mutate()}
                    disabled={saveMutation.isPending}
                    className="w-full bg-transparent hover:bg-gold/10 text-gold border border-gold/40 font-bold h-16 rounded-full text-xs uppercase tracking-widest shadow-2xl transition-all hover:scale-105"
                  >
                    {saveMutation.isPending ? 'Integrando...' : 'Integrar este Oráculo ao Rastro'}
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {view === 'concluido' && (
          <motion.div
            key="concluido"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-12 py-20"
          >
            <div className="w-28 h-28 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-gold border border-gold/20 shadow-2xl shadow-gold/10">
              <CheckCircle2 className="w-16 h-16" />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif text-white italic">Oráculo Selado</h2>
              <p className="text-white/40 text-lg max-w-md mx-auto font-serif italic">
                A síntese simbólica da Clareira foi integrada ao seu rastro. Agora, vamos consolidar esta etapa em sua cartografia.
              </p>
            </div>
            <Button 
              onClick={onNext}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-16 h-16 rounded-full text-[10px] uppercase tracking-[0.3em] flex items-center gap-2 mx-auto"
            >
              <span>Ver Cartografia da Loba</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
