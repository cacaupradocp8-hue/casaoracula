/**
 * Painel de Leitura Clínica da Cartografia — visão da terapeuta na Cabine.
 * Lê o profile_json persistido e exibe apenas a camada profissional.
 */
import { useEffect } from 'react';
import { useCartografiaProfile } from '@/hooks/useCartografiaProfile';
import { Loader2, Shield, Compass, Activity, Flame, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Props {
  clienteId: string;
}

const RISCO_STYLES: Record<string, { label: string; cls: string }> = {
  alto: { label: 'Alto', cls: 'bg-destructive/15 text-destructive border-destructive/20' },
  moderado: { label: 'Moderado', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  baixo: { label: 'Baixo', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
};

const DISTRITO_STYLES: Record<string, string> = {
  alto: 'bg-emerald-500/20 text-emerald-300',
  medio: 'bg-amber-500/20 text-amber-300',
  baixo: 'bg-red-500/20 text-red-300',
};

export function CartografiaClinicaPanel({ clienteId }: Props) {
  const { loading, profile, fetchProfile } = useCartografiaProfile();

  useEffect(() => {
    fetchProfile(clienteId);
  }, [clienteId, fetchProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile?.profileJson) {
    return (
      <div className="text-center py-8">
        <p className="text-xs text-muted-foreground/50">
          Cartografia ainda não realizada para esta cliente.
        </p>
      </div>
    );
  }

  const { derivacao, leitura_clinica } = profile.profileJson;
  const risco = RISCO_STYLES[derivacao.risco_conducao] || RISCO_STYLES.baixo;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-foreground/70 uppercase tracking-wider">
          Leitura Clínica Inicial
        </h3>
        <Badge variant="outline" className={cn('text-[10px] border', risco.cls)}>
          <Shield className="w-3 h-3 mr-1" />
          Risco {risco.label}
        </Badge>
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-2 gap-3">
        <InfoCard
          icon={<Compass className="w-3.5 h-3.5" />}
          label="Eixo dominante"
          value={leitura_clinica.eixo_dominante}
        />
        <InfoCard
          icon={<Flame className="w-3.5 h-3.5" />}
          label="Tensão central"
          value={derivacao.tensao_central}
        />
        <InfoCard
          icon={<Activity className="w-3.5 h-3.5" />}
          label="Direção clínica"
          value={leitura_clinica.direcao_texto}
        />
        <InfoCard
          icon={<Activity className="w-3.5 h-3.5" />}
          label="Ritmo recomendado"
          value={derivacao.ritmo_recomendado}
        />
      </div>

      {/* Tensão + Estratégia */}
      <div className="rounded-lg bg-card/50 border border-border/10 p-3 space-y-2">
        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Leitura do campo</p>
        <p className="text-xs text-foreground/70">{leitura_clinica.tensao_central_texto}</p>
        <p className="text-[10px] text-muted-foreground/50">
          Estratégia predominante: <span className="text-foreground/60">{leitura_clinica.estrategia_predominante}</span>
        </p>
      </div>

      {/* CidaDELA */}
      <div className="rounded-lg bg-card/50 border border-border/10 p-3 space-y-2">
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-primary/50" />
          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">CidaDELA</p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-[10px]">
          <div>
            <span className="text-muted-foreground/50 block">Porta</span>
            <span className="text-foreground/70">{derivacao.porta_inicial_nome}</span>
          </div>
          <div>
            <span className="text-muted-foreground/50 block">Torre</span>
            <span className="text-foreground/70">{derivacao.torre_dominante}</span>
          </div>
          <div>
            <span className="text-muted-foreground/50 block">Clima</span>
            <span className="text-foreground/70">{derivacao.clima_cidadela}</span>
          </div>
        </div>
      </div>

      {/* Distritos */}
      <div className="rounded-lg bg-card/50 border border-border/10 p-3 space-y-2">
        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Distritos</p>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(derivacao.distritos).map(([key, nivel]) => (
            <Badge
              key={key}
              variant="outline"
              className={cn('text-[9px] border-0', DISTRITO_STYLES[nivel] || '')}
            >
              {key}: {nivel}
            </Badge>
          ))}
        </div>
      </div>

      {/* Evitar / Priorizar */}
      {(derivacao.evitar?.length > 0 || derivacao.priorizar?.length > 0) && (
        <div className="grid grid-cols-2 gap-3">
          {derivacao.evitar?.length > 0 && (
            <div className="rounded-lg bg-destructive/5 border border-destructive/10 p-3">
              <p className="text-[10px] text-destructive/70 uppercase tracking-wider mb-1.5">Evitar</p>
              {derivacao.evitar.map((item, i) => (
                <p key={i} className="text-[10px] text-foreground/50">• {item}</p>
              ))}
            </div>
          )}
          {derivacao.priorizar?.length > 0 && (
            <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3">
              <p className="text-[10px] text-emerald-400/70 uppercase tracking-wider mb-1.5">Priorizar</p>
              {derivacao.priorizar.map((item, i) => (
                <p key={i} className="text-[10px] text-foreground/50">• {item}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Observação ética */}
      <div className="rounded-lg bg-card/30 border border-border/5 p-3">
        <p className="text-[10px] text-muted-foreground/40 uppercase tracking-wider mb-1">Observação ética</p>
        <p className="text-[10px] text-foreground/50 italic">{leitura_clinica.observacao_etica}</p>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-card/50 border border-border/10 p-2.5">
      <div className="flex items-center gap-1.5 text-muted-foreground/50 mb-1">
        {icon}
        <span className="text-[9px] uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xs text-foreground/70 capitalize">{value}</p>
    </div>
  );
}
