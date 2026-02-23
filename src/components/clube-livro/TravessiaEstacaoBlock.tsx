import { PortalProgress, STATUS_CONFIG, deriveStationStatus } from '@/hooks/useProgress';
import { ProgressIndicator } from './ProgressIndicator';
import { ClubeJornada, ClubePortal } from '@/hooks/useClubeLivro';
import { cn } from '@/lib/utils';

interface TravessiaEstacaoBlockProps {
  jornadas: ClubeJornada[];
  portais: ClubePortal[];
  portalProgress: PortalProgress[];
}

export function TravessiaEstacaoBlock({ jornadas, portais, portalProgress }: TravessiaEstacaoBlockProps) {
  const totalPortals = portais.length;
  const stationStatus = deriveStationStatus(portalProgress, totalPortals);

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Travessia da Estação
        </h2>
        <ProgressIndicator status={stationStatus} size="md" />
      </div>

      <div className="space-y-3">
        {jornadas.map((jornada) => {
          const jornadaPortais = portais.filter(p => p.jornada_id === jornada.id);
          const jornadaProgress = portalProgress.filter(pp =>
            jornadaPortais.some(jp => jp.id === pp.portal_id)
          );
          const integrados = jornadaProgress.filter(p => p.state === 'integrado').length;

          return (
            <div key={jornada.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/50">
              <div className="flex items-center gap-2.5">
                <span className="text-base leading-none">{jornada.icone}</span>
                <div>
                  <p className="text-sm font-medium text-foreground">{jornada.nome}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {integrados} de {jornadaPortais.length} portais integrados
                  </p>
                </div>
              </div>
              <div className="flex gap-1.5">
                {jornadaPortais.map((portal) => {
                  const pp = jornadaProgress.find(p => p.portal_id === portal.id);
                  const state = pp?.state || 'nao_iniciado';
                  const cfg = STATUS_CONFIG[state as keyof typeof STATUS_CONFIG];
                  return (
                    <span
                      key={portal.id}
                      title={`${portal.nome}: ${cfg.label}`}
                      className={cn('text-base leading-none select-none', cfg.className)}
                    >
                      {cfg.icon}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
