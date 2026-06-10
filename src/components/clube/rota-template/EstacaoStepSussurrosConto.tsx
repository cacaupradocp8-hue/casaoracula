import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Headphones, Sparkles, MessageSquare, ChevronRight, Save, Loader2, Music, AlertTriangle, ScrollText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { EscutaPremium } from '@/components/clube/EscutaPremium';
import { cn } from '@/lib/utils';

interface SussurrosContoProps {
  estacaoId: string;
  rotaId: string;
  contoData: {
    titulo: string;
    sintese: string;
    texto?: string;
    audioUrl?: string;
    imagemUrl?: string;
    erroComum: string;
    sussurroGuardia: string;
  };
  onNext: () => void;
}

type Step = 'conto' | 'escuta_conto' | 'escuta_personagem' | 'aplicacao' | 'conclusao';

export const EstacaoStepSussurrosConto: React.FC<SussurrosContoProps> = ({
  estacaoId,
  rotaId,
  contoData,
  onNext
}) => {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState<Step>('conto');
  const [isSaving, setIsSaving] = useState(false);
  
  // Respostas State
  const [respostas, setRespostas] = useState({
    revelacao: '',
    soterrado: '',
    imagemInsiste: '',
    movimentoEvita: '',
    chamado: '',
    ferida: '',
    protege: '',
    ameaca: '',
    recurso: '',
    transformacao: '',
    aplicacaoProfissional: ''
  });

  const handleInputChange = (field: keyof typeof respostas, value: string) => {
    setRespostas(prev => ({ ...prev, [field]: value }));
  };

  const handleFinalize = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('clube_sussurros_registros')
        .insert({
          user_id: user.id,
          rota_id: rotaId,
          estacao_id: estacaoId,
          conto_titulo: contoData.titulo,
          respostas: respostas,
          concluido: true
        });

      if (error) throw error;
      
      toast.success('Sussurros registrados com sucesso.');
      onNext();
    } catch (err: any) {
      console.error('Erro ao salvar sussurros:', err);
      toast.error('Erro ao salvar: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 'conto':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <span className="text-[10px] text-gold uppercase tracking-[0.4em] font-bold">Conto Central</span>
              <h2 className="text-4xl md:text-5xl font-serif text-white italic">{contoData.titulo}</h2>
            </div>

            {contoData.imagemUrl && (
              <div className="aspect-video rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                <img src={contoData.imagemUrl} alt={contoData.titulo} className="w-full h-full object-cover" />
              </div>
            )}

            <Card className="bg-white/[0.03] border-white/10 p-8 rounded-[2rem] space-y-6">
              <p className="text-xl font-serif italic text-white/90 leading-relaxed text-center">
                "{contoData.sintese}"
              </p>
            </Card>

            {contoData.audioUrl && (
              <div className="py-4">
                <EscutaPremium 
                  audioUrl={contoData.audioUrl} 
                  titulo={`${contoData.titulo} — Narração`}
                  imagemEscuta="/clareira-disco.png"
                />
              </div>
            )}

            {contoData.texto && (
              <div className="max-w-xl mx-auto prose prose-invert prose-p:font-serif prose-p:italic prose-p:text-lg prose-p:text-white/70">
                <div className="whitespace-pre-line">{contoData.texto}</div>
              </div>
            )}

            <div className="flex justify-center pt-8">
              <Button 
                onClick={() => setActiveStep('escuta_conto')}
                className="bg-gold hover:bg-gold/80 text-midnight font-bold px-12 h-16 rounded-full uppercase tracking-widest text-xs transition-all group"
              >
                Ouvir os Sussurros
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        );

      case 'escuta_conto':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <div className="text-center space-y-4">
              <span className="text-[10px] text-gold uppercase tracking-[0.4em] font-bold">Escuta do Conto</span>
              <h3 className="text-3xl font-serif text-white italic">O que o conto revela?</h3>
            </div>

            <div className="space-y-12">
              {[
                { id: 'revelacao', q: "O que este conto está tentando revelar?" },
                { id: 'soterrado', q: "O que foi perdido, soterrado ou esquecido?" },
                { id: 'imagemInsiste', q: "Que imagem insiste?" },
                { id: 'movimentoEvita', q: "Que movimento a personagem evita?" },
                { id: 'chamado', q: "O que começa a chamar?" }
              ].map((item) => (
                <div key={item.id} className="space-y-4">
                  <label className="text-xl text-white font-serif italic block">{item.q}</label>
                  <Textarea 
                    value={respostas[item.id as keyof typeof respostas]}
                    onChange={(e) => handleInputChange(item.id as keyof typeof respostas, e.target.value)}
                    placeholder="Sua percepção..."
                    className="bg-white/[0.03] border-white/10 min-h-[100px] rounded-2xl p-6 font-serif italic text-lg"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-8">
              <Button 
                onClick={() => setActiveStep('escuta_personagem')}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-12 h-16 rounded-full uppercase tracking-widest text-xs"
              >
                Observar as Personagens
              </Button>
            </div>
          </motion.div>
        );

      case 'escuta_personagem':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <div className="text-center space-y-4">
              <span className="text-[10px] text-gold uppercase tracking-[0.4em] font-bold">Escuta da Personagem</span>
              <h3 className="text-3xl font-serif text-white italic">Quem habita este cenário?</h3>
            </div>

            <div className="space-y-12">
              {[
                { id: 'ferida', q: "Quem carrega a ferida central?", icon: "🩸" },
                { id: 'protege', q: "Quem protege?", icon: "🛡️" },
                { id: 'ameaca', q: "Quem ameaça?", icon: "🌑" },
                { id: 'recurso', q: "Quem guarda o recurso?", icon: "🔑" },
                { id: 'transformacao', q: "Quem atravessa a transformação?", icon: "🦋" }
              ].map((item) => (
                <div key={item.id} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <label className="text-xl text-white font-serif italic block">{item.q}</label>
                  </div>
                  <Textarea 
                    value={respostas[item.id as keyof typeof respostas]}
                    onChange={(e) => handleInputChange(item.id as keyof typeof respostas, e.target.value)}
                    placeholder="Identifique no conto..."
                    className="bg-white/[0.03] border-white/10 min-h-[100px] rounded-2xl p-6 font-serif italic text-lg"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-8">
              <Button 
                onClick={() => setActiveStep('aplicacao')}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-12 h-16 rounded-full uppercase tracking-widest text-xs"
              >
                Aplicação no Ofício
              </Button>
            </div>
          </motion.div>
        );

      case 'aplicacao':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <div className="text-center space-y-4">
              <span className="text-[10px] text-gold uppercase tracking-[0.4em] font-bold">Aplicação Profissional</span>
              <h3 className="text-3xl font-serif text-white italic">O Espelho no Outro</h3>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-xl text-white font-serif italic block">
                  Onde esse padrão aparece nas mulheres que acompanho?
                </label>
                <Textarea 
                  value={respostas.aplicacaoProfissional}
                  onChange={(e) => handleInputChange('aplicacaoProfissional', e.target.value)}
                  placeholder="Relacione o conto com sua prática..."
                  className="bg-white/[0.03] border-white/10 min-h-[150px] rounded-2xl p-6 font-serif italic text-lg"
                />
              </div>

              <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-[2rem] space-y-4">
                <div className="flex items-center gap-3 text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  <h4 className="text-[10px] uppercase tracking-widest font-black">Erro comum de leitura</h4>
                </div>
                <p className="text-white/80 font-serif italic text-lg leading-relaxed">
                  {contoData.erroComum}
                </p>
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <Button 
                onClick={() => setActiveStep('conclusao')}
                className="bg-gold hover:bg-gold/80 text-midnight font-bold px-12 h-16 rounded-full uppercase tracking-widest text-xs"
              >
                Ouvir a Guardiã
              </Button>
            </div>
          </motion.div>
        );

      case 'conclusao':
        return (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-12 py-10"
          >
            <div className="space-y-6">
              <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-8">
                <ScrollText className="w-10 h-10 text-gold" />
              </div>
              <span className="text-[10px] text-gold uppercase tracking-[0.4em] font-bold">Sussurro da Guardiã</span>
              <h2 className="text-3xl md:text-5xl font-serif text-white italic leading-tight max-w-2xl mx-auto">
                "{contoData.sussurroGuardia}"
              </h2>
            </div>

            <div className="flex justify-center pt-8">
              <Button 
                onClick={handleFinalize}
                disabled={isSaving}
                className="bg-gold hover:bg-gold/80 text-midnight font-bold px-16 h-20 rounded-full uppercase tracking-[0.2em] text-xs transition-all shadow-2xl shadow-gold/20 hover:scale-105"
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-3" />
                ) : (
                  <Save className="w-5 h-5 mr-3" />
                )}
                Concluir Sussurros
              </Button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 space-y-12">
      {activeStep !== 'conto' && (
        <button 
          onClick={() => {
            const steps: Step[] = ['conto', 'escuta_conto', 'escuta_personagem', 'aplicacao', 'conclusao'];
            const idx = steps.indexOf(activeStep);
            if (idx > 0) setActiveStep(steps[idx - 1]);
          }}
          className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-widest font-bold hover:text-white transition-colors"
        >
          <ChevronRight className="w-3 h-3 rotate-180" />
          Voltar na Escuta
        </button>
      )}
      {renderStepContent()}
    </div>
  );
};

