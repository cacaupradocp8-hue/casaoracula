import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DoorClosed, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

/**
 * Casa dos Nãos Nunca Ditos — V1: apenas experiência privada da estação.
 * Reutiliza `clube_estacao_registros` (tipo='casa_naos').
 * Mural coletivo NÃO implementado nesta versão (decisão das fundadoras).
 */

interface CasaDosNaosProps {
  estacaoId: string;
  textoOrientacao?: string;
}

export const CasaDosNaosNuncaDitos: React.FC<CasaDosNaosProps> = ({
  estacaoId,
  textoOrientacao = 'Há "nãos" que nunca foram pronunciados — e ainda assim, organizam a vida por dentro. Nomeie um deles aqui. Sem destinatário. Sem justificativa.',
}) => {
  const { user } = useAuth();
  const [frase, setFrase] = useState('');
  const [simbolo, setSimbolo] = useState('');
  const [reflexao, setReflexao] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('clube_estacao_registros')
        .select('texto')
        .eq('user_id', user.id)
        .eq('estacao_id', estacaoId)
        .eq('tipo', 'casa_naos')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data?.texto) {
        try {
          const parsed = JSON.parse(data.texto);
          setFrase(parsed.frase || '');
          setSimbolo(parsed.simbolo || '');
          setReflexao(parsed.reflexao || '');
          setSaved(true);
        } catch {
          /* noop */
        }
      }
    })();
  }, [user, estacaoId]);

  const handleSave = async () => {
    if (!user) return;
    if (!frase.trim()) {
      toast.error('Escreva ao menos a frase do não.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('clube_estacao_registros').insert({
      user_id: user.id,
      estacao_id: estacaoId,
      tipo: 'casa_naos',
      texto: JSON.stringify({ frase, simbolo, reflexao }),
    });
    setSaving(false);
    if (error) {
      toast.error('Erro ao salvar: ' + error.message);
      return;
    }
    setSaved(true);
    toast.success('Não registrado na Casa dos Nãos.');
  };

  return (
    <Card className="bg-white/[0.03] border border-gold/10 p-8 md:p-10 rounded-[32px] space-y-8">
      <div className="flex items-center gap-3 text-gold/80">
        <DoorClosed className="w-6 h-6" />
        <h4 className="text-xl font-serif italic tracking-wide">Casa dos Nãos Nunca Ditos</h4>
      </div>

      <p className="text-white/60 font-serif italic text-base md:text-lg leading-relaxed">
        {textoOrientacao}
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-gold/60 font-black">
            O não (frase curta)
          </label>
          <Input
            value={frase}
            onChange={(e) => {
              setFrase(e.target.value);
              setSaved(false);
            }}
            placeholder='Ex: "Não quero mais sustentar isso."'
            className="bg-white/[0.02] border-white/10 text-white/80 font-serif italic"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-gold/60 font-black">
            Símbolo (opcional)
          </label>
          <Input
            value={simbolo}
            onChange={(e) => {
              setSimbolo(e.target.value);
              setSaved(false);
            }}
            placeholder="Uma palavra, imagem ou gesto que carrega esse não."
            className="bg-white/[0.02] border-white/10 text-white/80 font-serif italic"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-gold/60 font-black">
            Reflexão (opcional)
          </label>
          <Textarea
            value={reflexao}
            onChange={(e) => {
              setReflexao(e.target.value);
              setSaved(false);
            }}
            placeholder="O que esse não sustenta dentro de você?"
            className="bg-white/[0.02] border-white/10 text-white/80 font-serif italic min-h-[100px]"
          />
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-white/5">
        <p className="text-[10px] uppercase tracking-widest text-white/30">
          Registro privado · não compartilhado
        </p>
        <Button
          onClick={handleSave}
          disabled={saving || saved}
          className="bg-gold hover:bg-gold/80 text-midnight font-bold px-8 py-5 rounded-full text-[10px] uppercase tracking-widest"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? 'Registrado' : 'Guardar Não'}
        </Button>
      </div>
    </Card>
  );
};
