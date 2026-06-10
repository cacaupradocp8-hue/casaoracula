import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, Send, Info, Quote, BookOpen } from 'lucide-react';
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
  onNext
}) => {
  const { user } = useAuth();
  const [view, setView] = useState<'carta' | 'revelacao' | 'concluido'>('carta');

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
    <div className="max-w-4xl mx-auto space-y-12 pb-20 px-4">
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
                {/* Card Back / Mystery Style */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-transparent to-emerald-500/10 opacity-30" />
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                  <div className="w-32 h-32 rounded-full border-2 border-gold/20 flex items-center justify-center p-4">
                    <div className="w-full h-full rounded-full border border-gold/40 flex items-center justify-center animate-pulse">
                       <Sparkles className="w-12 h-12 text-gold/40" />
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-black">Toque para Revelar</span>
                </div>
                
                {/* Image Overlay */}
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
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-12"
          >
            <div className="text-center space-y-4">
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold">O Selo Simbólico</span>
              <h3 className="text-4xl md:text-5xl font-serif text-white italic">{nomeCarta}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="aspect-[2/3] w-full bg-[#0A0A0B] rounded-[32px] overflow-hidden border-2 border-gold/30 shadow-2xl shadow-gold/5 relative">
                  <img src={imagemUrl} alt={nomeCarta} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-8 text-center">
                    <h4 className="text-2xl font-serif text-gold italic mb-2">{nomeCarta}</h4>
                    <div className="h-0.5 w-12 bg-gold/30 mx-auto rounded-full" />
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-10"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gold/60">
                    <Quote className="w-5 h-5" />
                    <span className="text-[10px] uppercase tracking-widest font-black">A Mensagem</span>
                  </div>
                  <p className="text-white text-2xl md:text-3xl font-serif italic leading-relaxed">
                    {mensagem.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}<br />
                      </React.Fragment>
                    ))}
                  </p>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3 text-emerald-400/60">
                    <BookOpen className="w-5 h-5" />
                    <span className="text-[10px] uppercase tracking-widest font-black">A Pergunta de Integração</span>
                  </div>
                  <p className="text-white/80 text-xl font-serif italic leading-relaxed">
                    {pergunta}
                  </p>
                </div>

                <div className="bg-gold/5 border border-gold/10 p-6 rounded-2xl">
                  <p className="text-gold/80 text-sm font-serif italic leading-relaxed">
                    {integracaoTexto}
                  </p>
                </div>

                <div className="pt-6">
                  <Button 
                    onClick={() => saveMutation.mutate()}
                    disabled={saveMutation.isPending}
                    className="w-full bg-gold hover:bg-gold/80 text-midnight font-bold h-16 rounded-full text-xs uppercase tracking-widest shadow-2xl transition-all hover:scale-105"
                  >
                    {saveMutation.isPending ? 'Registrando...' : 'Registrar este Oráculo'}
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
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-16 h-16 rounded-full text-[10px] uppercase tracking-[0.3em]"
            >
              Ver Cartografia da Loba
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
