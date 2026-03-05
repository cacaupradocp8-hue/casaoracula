import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Loader2, RefreshCw, Sparkles, Moon, Compass, MessageCircle, Eye,
  Save, History, AlertTriangle
} from 'lucide-react';
import {
  generateArchetypalProfile, saveProfileSnapshot, type ArchetypalProfile
} from '@/lib/archetypal-profile-engine';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Props {
  clienteId: string;
}

export function ClientePerfilArquetipico({ clienteId }: Props) {
  const [profile, setProfile] = useState<ArchetypalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const loadSnapshots = useCallback(async () => {
    const { data } = await supabase
      .from('archetypal_profile_snapshots')
      .select('*')
      .eq('client_id', clienteId)
      .order('generated_at', { ascending: false })
      .limit(10);
    setSnapshots(data || []);
  }, [clienteId]);

  useEffect(() => {
    regenerate();
    loadSnapshots();
  }, [clienteId]);

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

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await saveProfileSnapshot(clienteId, profile);
      toast.success('Perfil salvo no histórico');
      loadSnapshots();
    } catch { toast.error('Erro ao salvar'); }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-5 h-5 animate-spin text-[#C9A24A]" />
      </div>
    );
  }

  const hasData = profile && (profile.dominantArchetype || profile.psychicMovement);

  if (!hasData) {
    return (
      <div className="text-center py-16">
        <Compass className="w-10 h-10 text-[#C9A24A]/20 mx-auto mb-3" />
        <p className="text-sm text-[#F5F1E8]/30 mb-4">Dados insuficientes para gerar o perfil.</p>
        <p className="text-xs text-[#F5F1E8]/20 mb-4">Registre sessões, arquétipos ou cartografias para ativar.</p>
        <Button variant="outline" size="sm" onClick={regenerate} className="border-[#C9A24A]/20 text-[#C9A24A]">
          <RefreshCw className="w-3 h-3 mr-1" /> Tentar Gerar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-lg">
      {/* Ethical warning */}
      <Alert className="border-[#C9A24A]/20 bg-[#C9A24A]/5">
        <AlertTriangle className="w-4 h-4 text-[#C9A24A]" />
        <AlertDescription className="text-xs text-[#F5F1E8]/60">
          <strong>Leitura simbólica do campo psíquico.</strong> Não substitui julgamento clínico.
        </AlertDescription>
      </Alert>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C9A24A]" />
          <span className="text-xs uppercase tracking-wider text-[#C9A24A]/70 font-semibold">
            Perfil Arquetípico da Jornada
          </span>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={regenerate} disabled={regenerating}
            className="text-[#F5F1E8]/30 hover:text-[#C9A24A] h-7 px-2">
            <RefreshCw className={`w-3 h-3 ${regenerating ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSave} disabled={saving}
            className="text-[#F5F1E8]/30 hover:text-[#556B57] h-7 px-2">
            <Save className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowHistory(!showHistory)}
            className="text-[#F5F1E8]/30 hover:text-[#F5F1E8]/60 h-7 px-2">
            <History className="w-3 h-3" />
          </Button>
        </div>
      </div>

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
              <div className="flex items-center gap-2 mt-0.5">
                <h3 className="text-base font-semibold text-[#F5F1E8]">
                  {profile!.dominantArchetype?.name || '—'}
                </h3>
                {profile!.dominantArchetype && (
                  <Badge variant="outline" className="text-[8px] border-[#C9A24A]/20 text-[#C9A24A]/60">
                    {profile!.dominantArchetype.count}x
                  </Badge>
                )}
              </div>
              <p className="text-xs text-[#F5F1E8]/50 mt-1 leading-relaxed">
                {profile!.dominantArchetype?.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sombra */}
      {profile!.shadowArchetype && (
        <Card className="border-[#F5F1E8]/5 bg-[#0B1B2B]/60">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F5F1E8]/[0.03] border border-[#F5F1E8]/10 flex items-center justify-center shrink-0">
                <Moon className="w-5 h-5 text-[#F5F1E8]/30" />
              </div>
              <div>
                <span className="text-[9px] text-[#F5F1E8]/30 uppercase">Arquétipo em Sombra</span>
                <h3 className="text-sm font-medium text-[#F5F1E8]/70 mt-0.5">
                  {profile!.shadowArchetype.name}
                </h3>
                <p className="text-xs text-[#F5F1E8]/40 mt-1 leading-relaxed">
                  {profile!.shadowArchetype.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Movimento + Chamado */}
      <div className="grid grid-cols-1 gap-3">
        {profile!.psychicMovement && (
          <Card className="border-[#556B57]/15 bg-[#0B1B2B]/60">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Compass className="w-3.5 h-3.5 text-[#556B57]" />
                <span className="text-[9px] text-[#556B57]/70 uppercase font-semibold">Movimento Psíquico Atual</span>
              </div>
              <p className="text-xs text-[#F5F1E8]/60 leading-relaxed">{profile!.psychicMovement}</p>
            </CardContent>
          </Card>
        )}

        {profile!.evolutionCall && (
          <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-3.5 h-3.5 text-[#C9A24A]/60" />
                <span className="text-[9px] text-[#C9A24A]/50 uppercase font-semibold">Chamado Evolutivo</span>
              </div>
              <p className="text-sm text-[#F5F1E8]/70 italic">"{profile!.evolutionCall}"</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pergunta clínica */}
      {profile!.clinicalQuestion && (
        <Card className="border-[#C9A24A]/10 bg-[#F5F1E8]/[0.03]">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <MessageCircle className="w-4 h-4 text-[#C9A24A]/50 mt-0.5 shrink-0" />
              <div>
                <span className="text-[9px] text-[#C9A24A]/40 uppercase block mb-1">Pergunta Clínica Sugerida</span>
                <p className="text-sm text-[#F5F1E8]/60 italic leading-relaxed">"{profile!.clinicalQuestion}"</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Source data */}
      <div className="flex flex-wrap gap-1.5">
        {profile!.sourceData.totalSessions > 0 && (
          <Badge variant="outline" className="text-[8px] border-[#F5F1E8]/10 text-[#F5F1E8]/25">
            {profile!.sourceData.totalSessions} sessões
          </Badge>
        )}
        {Object.keys(profile!.sourceData.archetypeCounts).length > 0 && (
          <Badge variant="outline" className="text-[8px] border-[#F5F1E8]/10 text-[#F5F1E8]/25">
            {Object.keys(profile!.sourceData.archetypeCounts).length} arquétipos
          </Badge>
        )}
        {profile!.sourceData.activeDistricts.length > 0 && (
          <Badge variant="outline" className="text-[8px] border-[#F5F1E8]/10 text-[#F5F1E8]/25">
            {profile!.sourceData.activeDistricts.length} distritos ativos
          </Badge>
        )}
      </div>

      {/* History */}
      {showHistory && (
        <>
          <Separator className="bg-[#C9A24A]/10" />
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#F5F1E8]/30">Histórico de Perfis</h4>
            {snapshots.length === 0 ? (
              <p className="text-xs text-[#F5F1E8]/25">Nenhum perfil salvo ainda.</p>
            ) : (
              snapshots.map(s => (
                <div key={s.id} className="bg-[#0B1B2B]/40 border border-[#C9A24A]/8 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#C9A24A]/60">
                      {new Date(s.generated_at).toLocaleDateString('pt-BR')}
                    </span>
                    {s.dominant_archetype && (
                      <Badge variant="outline" className="text-[8px] border-[#C9A24A]/20 text-[#C9A24A]/60">
                        {s.dominant_archetype}
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px] text-[#F5F1E8]/40">
                    <span>Sombra: {s.shadow_archetype || '—'}</span>
                    <span>Chamado: {s.evolution_call || '—'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
