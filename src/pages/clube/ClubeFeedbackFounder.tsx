import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AppLayout } from '@/components/layout/AppLayout';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Check, Loader2, Sparkles, MessageCircle } from 'lucide-react';

export default function ClubeFeedbackFounder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    clareza: '',
    confusao: '',
    aplicabilidade: '',
    travou: '',
    encantamento: '',
    remocao: '',
    pagaria: '',
    valor: '',
    sugestoes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('founder_feedback')
        .insert({
          user_id: user.id,
          ...form
        });

      if (error) throw error;
      setSent(true);
      toast.success('Parecer técnico enviado com sucesso! ✨');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao enviar feedback.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AppLayout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-8">
          <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center border border-gold/30">
            <Check className="w-10 h-10 text-gold" />
          </div>
          <div className="space-y-4 max-w-lg">
            <h1 className="text-3xl font-serif text-white italic">A Casa recebe seu olhar.</h1>
            <p className="text-white/60 leading-relaxed">
              Obrigada por fazer parte do Conselho Fundador. Suas percepções serão fundamentais para a lapidação da Casa Orácula 2.0.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard-membro')} className="rounded-full border-gold/20 hover:bg-gold/5">
            Voltar ao Dashboard
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ResponsiveContainer size="narrow" className="py-12 md:py-20 space-y-12">
        <header className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3 text-gold/40">
            <MessageCircle className="w-5 h-5" />
            <span className="text-[11px] tracking-[0.5em] uppercase font-bold">Conselho Fundador</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-white leading-tight italic">Seu Parecer Técnico</h1>
          <p className="text-lg text-white/50 italic max-w-xl mx-auto border-l-2 border-gold/20 pl-6 py-2">
            "Seu papel aqui não é elogiar. É observar com honestidade para que possamos lapidar a experiência."
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12 bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-[2.5rem]">
          <div className="space-y-10">
            <FeedbackField 
              label="O que ficou claro?" 
              placeholder="O que você entendeu de imediato?"
              value={form.clareza}
              onChange={v => setForm({...form, clareza: v})}
            />
            <FeedbackField 
              label="O que ficou confuso?" 
              placeholder="Onde a navegação ou a narrativa se perderam?"
              value={form.confusao}
              onChange={v => setForm({...form, confusao: v})}
            />
            <FeedbackField 
              label="O que pareceu aplicável aos seus atendimentos?" 
              placeholder="Ferramentas, Jardins, etc."
              value={form.aplicabilidade}
              onChange={v => setForm({...form, aplicabilidade: v})}
            />
            <FeedbackField 
              label="Onde você travou?" 
              placeholder="Erros, demora no carregamento ou botões que não faziam sentido."
              value={form.travou}
              onChange={v => setForm({...form, travou: v})}
            />
            <FeedbackField 
              label="O que mais encantou?" 
              placeholder="O ponto alto da experiência."
              value={form.encantamento}
              onChange={v => setForm({...form, encantamento: v})}
            />
            <FeedbackField 
              label="O que você removeria?" 
              placeholder="Excessos ou distrações."
              value={form.remocao}
              onChange={v => setForm({...form, remocao: v})}
            />
            <FeedbackField 
              label="Você pagaria por esta experiência?" 
              placeholder="Sim/Não e o motivo."
              value={form.pagaria}
              onChange={v => setForm({...form, pagaria: v})}
            />
            <FeedbackField 
              label="Quanto valeria (mensalidade)?" 
              placeholder="Sua percepção de valor de mercado."
              value={form.valor}
              onChange={v => setForm({...form, valor: v})}
            />
            <FeedbackField 
              label="Sugestões finais" 
              placeholder="Espaço livre para considerações."
              value={form.sugestoes}
              onChange={v => setForm({...form, sugestoes: v})}
            />
          </div>

          <div className="pt-10 flex flex-col items-center gap-6 border-t border-white/5">
            <Button 
              type="submit" 
              variant="gold" 
              disabled={loading}
              className="w-full md:w-auto px-16 h-16 rounded-full text-lg font-bold uppercase tracking-widest shadow-glow"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : 'Enviar Parecer Final'}
            </Button>
            <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">Gratidão pela sua contribuição</p>
          </div>
        </form>
      </ResponsiveContainer>
    </AppLayout>
  );
}

function FeedbackField({ label, placeholder, value, onChange }: { label: string, placeholder: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-4">
      <Label className="text-lg font-serif text-gold/80 italic">{label}</Label>
      <Textarea 
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="min-h-[120px] bg-white/[0.03] border-white/10 rounded-2xl focus:ring-gold/30 focus:border-gold/30 text-white placeholder:text-white/10"
      />
    </div>
  );
}
