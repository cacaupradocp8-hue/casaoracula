import { useState, useEffect, useCallback } from 'react';
import { generateArchetypalProfile, saveProfileSnapshot, ArchetypalProfile } from '@/lib/archetypal-profile-engine';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Shield, Eye, Compass, Sparkles, MessageCircle,
  RefreshCw, Save, AlertTriangle, History
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  clienteId: string;
}

const CARD_ICONS = {
  dominant: Shield,
  shadow: Eye,
  movement: Compass,
  evolution: Sparkles,
};

export function PerfilArquetipicoPanel({ clienteId }: Props) {
  const [profile, setProfile] = useState<ArchetypalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const p = await generateArchetypalProfile(clienteId);
      setProfile(p);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [clienteId]);

  const loadSnapshots = useCallback(async () => {
    const { data } = await supabase
      .from('archetypal_profile_snapshots')
      .select('*')
      .eq('client_id', clienteId)
      .order('generated_at', { ascending: false })
      .limit(10);
    setSnapshots(data || []);
  }, [clienteId]);

  useEffect(() => { loadProfile(); loadSnapshots(); }, [loadProfile, loadSnapshots]);

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
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-40" />)}
        </div>
      </div>
    );
  }

  const hasData = profile && (profile.dominantArchetype || profile.psychicMovement);

  return (
    <div className="space-y-6">
      {/* Ethical warning */}
      <Alert className="border-[#C9A24A]/20 bg-[#C9A24A]/5">
        <AlertTriangle className="w-4 h-4 text-[#C9A24A]" />
        <AlertDescription className="text-xs text-[#F5F1E8]/60">
          <strong>Leitura simbólica do campo psíquico.</strong> Não substitui julgamento clínico.
        </AlertDescription>
      </Alert>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[#F5F1E8]">Perfil Arquetípico da Jornada</h3>
          <p className="text-xs text-[#F5F1E8]/40">Síntese simbólica baseada nos dados registrados</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={loadProfile}
            className="border-[#C9A24A]/20 text-[#C9A24A] hover:bg-[#C9A24A]/10">
            <RefreshCw className="w-3 h-3 mr-1" /> Atualizar
          </Button>
          {hasData && (
            <Button size="sm" variant="outline" onClick={handleSave} disabled={saving}
              className="border-[#556B57]/30 text-[#556B57] hover:bg-[#556B57]/10">
              <Save className="w-3 h-3 mr-1" /> Salvar
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => setShowHistory(!showHistory)}
            className="text-[#F5F1E8]/40 hover:text-[#F5F1E8]/70">
            <History className="w-3 h-3 mr-1" /> Histórico
          </Button>
        </div>
      </div>

      {!hasData ? (
        <div className="text-center py-16">
          <Compass className="w-10 h-10 text-[#C9A24A]/20 mx-auto mb-3" />
          <p className="text-sm text-[#F5F1E8]/40">Dados insuficientes para gerar o perfil.</p>
          <p className="text-xs text-[#F5F1E8]/25 mt-1">Registre sessões, arquétipos ou cartografias para ativar.</p>
        </div>
      ) : (
        <>
          {/* Four cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dominant */}
            <ProfileCard
              icon={CARD_ICONS.dominant}
              label="Arquétipo Predominante"
              title={profile!.dominantArchetype?.name || '—'}
              description={profile!.dominantArchetype?.description || ''}
              accent="#C9A24A"
              badge={profile!.dominantArchetype ? `${profile!.dominantArchetype.count}x` : undefined}
            />
            {/* Shadow */}
            <ProfileCard
              icon={CARD_ICONS.shadow}
              label="Arquétipo em Sombra"
              title={profile!.shadowArchetype?.name || '—'}
              description={profile!.shadowArchetype?.description || ''}
              accent="#8B5CF6"
            />
            {/* Movement */}
            <ProfileCard
              icon={CARD_ICONS.movement}
              label="Movimento Psíquico Atual"
              title=""
              description={profile!.psychicMovement || 'Sem dados de distrito ativo.'}
              accent="#556B57"
            />
            {/* Evolution */}
            <ProfileCard
              icon={CARD_ICONS.evolution}
              label="Chamado Evolutivo"
              title=""
              description={profile!.evolutionCall || '—'}
              accent="#DAA520"
            />
          </div>

          {/* Clinical question */}
          {profile!.clinicalQuestion && (
            <>
              <Separator className="bg-[#C9A24A]/10" />
              <div className="bg-[#0B1B2B]/60 border border-[#C9A24A]/10 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-4 h-4 text-[#C9A24A]/60" />
                  <span className="text-[10px] uppercase tracking-wider text-[#C9A24A]/50">
                    Pergunta Clínica Sugerida
                  </span>
                </div>
                <p className="text-sm text-[#F5F1E8]/70 italic leading-relaxed">
                  "{profile!.clinicalQuestion}"
                </p>
              </div>
            </>
          )}
        </>
      )}

      {/* History */}
      {showHistory && (
        <>
          <Separator className="bg-[#C9A24A]/10" />
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#F5F1E8]/30">
              Histórico de Perfis
            </h4>
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

function ProfileCard({ icon: Icon, label, title, description, accent, badge }: {
  icon: any; label: string; title: string; description: string; accent: string; badge?: string;
}) {
  return (
    <div className="bg-[#0B1B2B]/60 border rounded-xl p-4"
      style={{ borderColor: `${accent}20` }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${accent}15` }}>
          <Icon className="w-3.5 h-3.5" style={{ color: accent }} />
        </div>
        <span className="text-[10px] uppercase tracking-wider" style={{ color: `${accent}90` }}>
          {label}
        </span>
        {badge && (
          <Badge variant="outline" className="text-[8px] ml-auto"
            style={{ borderColor: `${accent}30`, color: accent }}>
            {badge}
          </Badge>
        )}
      </div>
      {title && <p className="text-sm font-medium text-[#F5F1E8] mb-1">{title}</p>}
      <p className="text-xs text-[#F5F1E8]/50 leading-relaxed">{description}</p>
    </div>
  );
}
