import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Save, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
      toast.success('Semente guardada com sucesso no Jardim!');
    } catch (err: any) {
      console.error('Erro ao salvar no jardim:', err);
      toast.error('Falha ao salvar: ' + (err.message || 'Erro desconhecido'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Registre aqui sua percepção simbólica..."
        className="bg-midnight/40 border-white/10 min-h-[120px] text-white/90 placeholder:text-white/20 focus:border-gold/30 transition-all rounded-xl"
      />
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            variant={type === 'psique' ? 'gold' : 'outline'}
            className={`rounded-full px-6 transition-all group ${
              type === 'oficio' ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10' : 'text-midnight font-bold'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            )}
            Guardar no Jardim {type === 'psique' ? 'da Psique' : 'do Ofício'}
          </Button>
          
          {lastSaved && (
            <div className="flex items-center gap-1.5 text-[10px] text-white/30 uppercase tracking-widest animate-in fade-in slide-in-from-left-2">
              <CheckCircle2 className="w-3 h-3 text-green-500/60" />
              <span>Salvo em {format(lastSaved, "dd/MM 'às' HH:mm", { locale: ptBR })}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
