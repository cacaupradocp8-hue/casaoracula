import { Badge } from '@/components/ui/badge';
import { type SessionStage, type SessionStageResult, STAGE_COLORS, STAGE_BG } from '@/lib/cabine/motorSessao';

interface Props {
  stageResult: SessionStageResult;
}

const STAGE_ORDER: SessionStage[] = ['abertura', 'leitura', 'exploracao', 'integracao', 'sintese'];

export function CabineStageIndicator({ stageResult }: Props) {
  const currentIdx = STAGE_ORDER.indexOf(stageResult.stage);

  return (
    <div className={`rounded-lg border p-3 space-y-2.5 ${STAGE_BG[stageResult.stage]}`}>
      {/* Stage progress dots */}
      <div className="flex items-center gap-1.5">
        {STAGE_ORDER.map((s, i) => (
          <div key={s} className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full transition-all ${
                i <= currentIdx
                  ? i === currentIdx
                    ? 'bg-current scale-125 ring-2 ring-current/20'
                    : 'bg-current/50'
                  : 'bg-muted/20'
              }`}
            />
            {i < STAGE_ORDER.length - 1 && (
              <div className={`w-4 h-px ${i < currentIdx ? 'bg-current/30' : 'bg-muted/10'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Stage label + orientation */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className={`text-[9px] px-2 ${STAGE_COLORS[stageResult.stage]}`}>
          {stageResult.label}
        </Badge>
        {stageResult.sussurro_ativo && stageResult.sussurro_motivo && (
          <span className="text-[8px] text-amber-400/60 italic">{stageResult.sussurro_motivo}</span>
        )}
      </div>

      <p className="text-[11px] text-foreground/70 leading-relaxed">{stageResult.orientacao}</p>
    </div>
  );
}
