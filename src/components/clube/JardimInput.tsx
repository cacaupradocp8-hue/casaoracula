import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Save, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface JardimInputProps {
  type: 'psique' | 'oficio';
  pergunta: string;
  estacaoId?: string;
  pontoId?: string;
  sourceTitle?: string;
}

export function JardimInput({ type, pergunta, estacaoId, pontoId, sourceTitle }: JardimInputProps) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [recordId, setRecordId] = useState<string | null>(null);

  const tableName = type === 'psique' ? 'jardim_psique_registros' : 'jardim_do_oficio';

  useEffect(() => {
    fetchLatest();
  }, [type, pontoId]);

  const fetchLatest = async () => {
    if (!pontoId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = (supabase as any)
        .from(tableName)
        .select('*')
        .eq('user_id', user.id);

      if (type === 'psique') {
        query = query.eq('ferramenta_chave', pontoId);
      } else {
        query = query.eq('contexto_origem', `ponto:${pontoId}`);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(1) as { data: any[] | null, error: any };

      if (!error && data && data.length > 0) {
        const entry = data[0];
        const value = type === 'psique' ? entry.reflexao_pessoal : entry.reflexao_profissional;
        if (value) {
          setText(value);
          setRecordId(entry.id);
          setLastSaved(new Date(entry.updated_at || entry.created_at));
        }
      } else {
        setText('');
        setRecordId(null);
        setLastSaved(null);
      }
    } catch (err) {
      console.error('Erro ao buscar último registro:', err);
    }
  };

  const handleSave = async () => {
    if (!text.trim()) {
      toast.error('O registro está vazio');
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Você precisa estar logado para salvar');
        return;
      }

      const payload: any = {
        user_id: user.id,
      };

      if (type === 'psique') {
        payload.reflexao_pessoal = text;
        payload.titulo = sourceTitle || 'Registro de Estação';
        payload.tipo_registro = 'estacao_rota';
        payload.ferramenta_chave = pontoId;
        payload.ferramenta_nome = sourceTitle;
        payload.data_aplicacao = new Date().toISOString();
      } else {
        payload.reflexao_profissional = text;
        payload.contexto_origem = `ponto:${pontoId}`;
      }

      let error;
      if (recordId) {
        const { error: updateError } = await (supabase as any)
          .from(tableName)
          .update(payload)
          .eq('id', recordId);
        error = updateError;
      } else {
        const { data, error: insertError } = await (supabase as any)
          .from(tableName)
          .insert(payload)
          .select('id')
          .single();
        
        if (!insertError && data) {
          setRecordId(data.id);
        }
        error = insertError;
      }

      if (error) throw error;

      setLastSaved(new Date());
      toast.success(`Rastro guardado no Jardim ${type === 'psique' ? 'da Psique' : 'do Ofício'}.`);
    } catch (err: any) {
      console.error('Erro ao salvar no jardim:', err);
      toast.error('Falha ao salvar: ' + (err.message || 'Erro desconhecido'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full group">
      <div className="relative group/field">
        {/* Focus Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 via-gold/5 to-emerald-500/20 rounded-2xl blur-lg opacity-0 group-focus-within/field:opacity-100 transition duration-700 pointer-events-none" />
        
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Registre aqui sua percepção simbólica..."
          className="relative bg-[#0A0A0B]/80 backdrop-blur-xl border-white/5 min-h-[180px] text-white/90 placeholder:text-white/20 focus:border-gold/20 focus:ring-0 transition-all duration-500 rounded-2xl p-8 leading-relaxed text-lg font-serif italic shadow-2xl resize-none"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-2">
        <div className="flex flex-wrap items-center gap-4">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            variant={type === 'psique' ? 'gold' : 'outline'}
            className={cn(
              "rounded-full px-10 h-14 transition-all duration-500 group shadow-lg",
              type === 'oficio' ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/60" : "text-midnight font-bold hover:shadow-gold/20"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-3" />
            ) : (
              <Save className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
            )}
            {lastSaved ? 'Atualizar Jardim' : `Guardar no Jardim ${type === 'psique' ? 'da Psique' : 'do Ofício'}`}
          </Button>

          <Button
            variant="ghost"
            onClick={() => toast.info('Rascunho temporário mantido no navegador.')}
            className="text-[10px] uppercase tracking-widest text-white/30 hover:text-white"
          >
            Salvar e continuar depois
          </Button>
          
          {lastSaved && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2.5 text-[11px] text-white/40 uppercase tracking-[0.2em] font-medium"
            >
              <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              </div>
              <span>Plantado em {format(lastSaved, "dd/MM 'às' HH:mm", { locale: ptBR })}</span>
            </motion.div>
          )}
        </div>
      </div>

    </div>
  );
}
