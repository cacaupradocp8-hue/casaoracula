import { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Briefcase, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useJardimPsique } from '@/hooks/useJardimPsique';
import { useCidadelaMap } from '@/hooks/useCidadelaMap';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { TrainingCase } from '@/components/treinamento/simulador/types';

interface Props {
  caso: TrainingCase;
  onDone: () => void;
}

export function RegistrarRastro({ caso, onDone }: Props) {
  const raw: any = (caso as any).rawCamara || {};
  const perguntaPsique: string = raw.pergunta_psique || 'O que esse sussurro tocou em você?';
  const perguntaOficio: string = raw.pergunta_oficio || 'Como esse sinal aparece nas mulheres que você escuta?';
  const territorio: string = raw.territorio || 'Clareira do Chamado';
  const distrito: string = raw.distrito || raw.distrito_dominante || 'Floresta';

  const [respPsique, setRespPsique] = useState('');
  const [respOficio, setRespOficio] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { salvarRegistro } = useJardimPsique();
  const { updateFromSession } = useCidadelaMap();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSalvar = async () => {
    if (!respPsique.trim() && !respOficio.trim()) {
      toast({ title: 'Deixe ao menos um rastro', description: 'Responda uma das perguntas.' });
      return;
    }
    setSaving(true);
    try {
      if (respPsique.trim()) {
        await salvarRegistro({
          ferramenta_nome: `Câmara do Sussurro — ${caso.title}`,
          ferramenta_chave: 'camara_sussurro',
          conteudo: { sussurro_id: caso.id, pergunta: perguntaPsique, resposta: respPsique },
          resultado_simbolico: { territorio, distrito },
          reflexao_pessoal: respPsique,
          tipo_registro: 'reflexao',
        });
      }

      if (respOficio.trim() && user) {
        await supabase.from('jardim_do_oficio' as any).insert({
          user_id: user.id,
          titulo: `Sussurro — ${caso.title}`,
          conteudo: respOficio,
          tipo: 'rastro_camara_sussurro',
          tags: ['camara-sussurro', 'rota-dos-lobos', 'clareira-do-chamado'],
        } as any);
      }

      if (user) {
        await updateFromSession(user.id, {
          distrito,
          ferramenta: 'camara_sussurro',
          insight: caso.title,
        });
      }

      setSaved(true);
      toast({ title: 'Rastro registrado', description: 'Sua escuta foi guardada nos Jardins.' });
      setTimeout(onDone, 1400);
    } catch (e) {
      console.error(e);
      toast({ title: 'Não foi possível registrar', description: 'Tente novamente.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="text-center py-16 space-y-4"
      >
        <Check className="w-12 h-12 mx-auto text-amber-300/80" />
        <p className="font-display italic text-amber-100/80 text-xl">Rastro guardado.</p>
        <p className="text-xs text-foreground/40 tracking-widest uppercase">A Loba viu.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-10 max-w-2xl mx-auto"
    >
      <div className="text-center space-y-2">
        <p className="text-[10px] tracking-[0.5em] uppercase text-amber-200/40">Registrar Rastro</p>
        <h3 className="font-display text-2xl text-amber-100/80 italic">Deixe a escuta em dois Jardins</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-amber-200/70">
          <Leaf className="w-4 h-4" />
          <p className="text-xs tracking-widest uppercase">Jardim da Psique</p>
        </div>
        <p className="font-display italic text-foreground/80 text-lg">{perguntaPsique}</p>
        <Textarea
          value={respPsique}
          onChange={(e) => setRespPsique(e.target.value)}
          placeholder="Escute sem pressa..."
          className="min-h-[100px] bg-background/40 border-amber-200/10 focus:border-amber-200/40 resize-none"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-amber-200/70">
          <Briefcase className="w-4 h-4" />
          <p className="text-xs tracking-widest uppercase">Jardim do Ofício</p>
        </div>
        <p className="font-display italic text-foreground/80 text-lg">{perguntaOficio}</p>
        <Textarea
          value={respOficio}
          onChange={(e) => setRespOficio(e.target.value)}
          placeholder="O que esse sinal mostra na sua escuta clínica..."
          className="min-h-[100px] bg-background/40 border-amber-200/10 focus:border-amber-200/40 resize-none"
        />
      </div>

      <div className="pt-4">
        <Button
          onClick={handleSalvar}
          disabled={saving}
          className="w-full bg-amber-700/80 hover:bg-amber-600 text-background font-display tracking-widest py-7 rounded-none border border-amber-300/20"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Selar o Rastro'}
        </Button>
      </div>
    </motion.div>
  );
}
