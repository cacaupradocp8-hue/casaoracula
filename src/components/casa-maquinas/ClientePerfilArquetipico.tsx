import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, RefreshCw, Sparkles, Moon, Compass, MessageCircle, Eye } from 'lucide-react';
import { generateArchetypalProfile, type ArchetypalProfile } from '@/lib/archetypal-profile';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  clienteId: string;
}

export function ClientePerfilArquetipico({ clienteId }: Props) {
  const [profile, setProfile] = useState<ArchetypalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    loadExisting();
  }, [clienteId]);

  const loadExisting = async () => {
    const { data } = await supabase
      .from('clientes')
      .select('archetypal_profile_json')
      .eq('id', clienteId)
      .single();

    if (data?.archetypal_profile_json) {
      setProfile(data.archetypal_profile_json as unknown as ArchetypalProfile);
      setLoading(false);
    } else {
      // Auto-generate on first load
      await regenerate();
    }
  };

  const regenerate = async () => {
    setRegenerating(true);
    try {
      const p = await generateArchetypalProfile(clienteId);
      setProfile(p);
    } catch (e) {
      console.error(e);
    }
    setRegenerating(false);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-5 h-5 animate-spin text-[#C9A24A]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-[#F5F1E8]/30 mb-4">Perfil não disponível — dados insuficientes.</p>
        <Button variant="outline" size="sm" onClick={regenerate} className="border-[#C9A24A]/20 text-[#C9A24A]">
          Gerar Perfil
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C9A24A]" />
          <span className="text-xs uppercase tracking-wider text-[#C9A24A]/70 font-semibold">Perfil Arquetípico</span>
        </div>
        <Button variant="ghost" size="sm" onClick={regenerate} disabled={regenerating}
          className="text-[#F5F1E8]/30 hover:text-[#C9A24A] h-7 px-2">
          <RefreshCw className={`w-3 h-3 ${regenerating ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-[#F5F1E8]/25 italic leading-relaxed">
        Síntese narrativa simbólica — não constitui diagnóstico clínico. Atualizado em{' '}
        {new Date(profile.gerado_em).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}.
      </p>

      {/* Predominante */}
      <Card className="border-[#C9A24A]/15 bg-gradient-to-br from-[#0B1B2B] to-[#1a2d3d] overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-[#C9A24A]/0 via-[#C9A24A]/60 to-[#C9A24A]/0" />
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C9A24A]/10 border border-[#C9A24A]/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#C9A24A]" />
            </div>
            <div>
              <span className="text-[9px] text-[#C9A24A]/50 uppercase">Arquétipo Predominante</span>
              <h3 className="text-base font-semibold text-[#F5F1E8] mt-0.5">{profile.arquetipo_predominante.nome}</h3>
              <p className="text-xs text-[#F5F1E8]/50 mt-1 leading-relaxed">{profile.arquetipo_predominante.descricao}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sombra */}
      <Card className="border-[#F5F1E8]/5 bg-[#0B1B2B]/60">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F5F1E8]/[0.03] border border-[#F5F1E8]/10 flex items-center justify-center shrink-0">
              <Moon className="w-5 h-5 text-[#F5F1E8]/30" />
            </div>
            <div>
              <span className="text-[9px] text-[#F5F1E8]/30 uppercase">Arquétipo em Sombra</span>
              <h3 className="text-sm font-medium text-[#F5F1E8]/70 mt-0.5">{profile.arquetipo_sombra.nome}</h3>
              <p className="text-xs text-[#F5F1E8]/40 mt-1 leading-relaxed">{profile.arquetipo_sombra.descricao}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Movimento + Chamado */}
      <div className="grid grid-cols-1 gap-3">
        <Card className="border-[#556B57]/15 bg-[#0B1B2B]/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Compass className="w-3.5 h-3.5 text-[#556B57]" />
              <span className="text-[9px] text-[#556B57]/70 uppercase font-semibold">Movimento Psíquico Atual</span>
            </div>
            <p className="text-xs text-[#F5F1E8]/60 leading-relaxed">{profile.movimento_psiquico}</p>
          </CardContent>
        </Card>

        <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-3.5 h-3.5 text-[#C9A24A]/60" />
              <span className="text-[9px] text-[#C9A24A]/50 uppercase font-semibold">Chamado Evolutivo</span>
            </div>
            <p className="text-sm text-[#F5F1E8]/70 italic">"{profile.chamado_evolutivo}"</p>
          </CardContent>
        </Card>
      </div>

      {/* Pergunta clínica */}
      <Card className="border-[#C9A24A]/10 bg-[#F5F1E8]/[0.03]">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <MessageCircle className="w-4 h-4 text-[#C9A24A]/50 mt-0.5 shrink-0" />
            <div>
              <span className="text-[9px] text-[#C9A24A]/40 uppercase block mb-1">Pergunta Clínica Sugerida</span>
              <p className="text-sm text-[#F5F1E8]/60 italic leading-relaxed">"{profile.pergunta_clinica}"</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fontes */}
      <div className="flex flex-wrap gap-1.5">
        {profile.fontes.map(f => (
          <Badge key={f} variant="outline" className="text-[8px] border-[#F5F1E8]/10 text-[#F5F1E8]/25">{f}</Badge>
        ))}
      </div>
    </div>
  );
}
