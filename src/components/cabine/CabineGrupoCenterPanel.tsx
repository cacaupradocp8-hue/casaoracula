import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, AlertTriangle, Loader2, Waves, Shield, Lightbulb, Pause } from 'lucide-react';
import { useTherapeuticGroups, type GroupParticipant } from '@/hooks/useTherapeuticGroups';
import { supabase } from '@/lib/dal/dbClient';
import { calcularLeituraCampoColetivo, type LeituraCampoColetivo, type RegistroInput } from '@/lib/cabine/motorLeituraColetiva';
import { avaliarCondutaColetiva, type DecisaoCampoColetivo } from '@/lib/cabine/decisaoCampoColetivo';
import { useFieldSnapshot } from '@/hooks/useFieldSnapshot';
import { BlocoDecisaoCampo } from './BlocoDecisaoCampo';
import type { ClimaMovimento } from '@/types/jardim-grupo';
import { cn } from '@/lib/utils';

interface Props {
  groupId: string | null;
  groupName: string;
}

const RISCO_STYLES: Record<string, { bg: string; text: string; icon: string }> = {
  baixo: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: '🟢' },
  moderado: { bg: 'bg-amber-500/10', text: 'text-amber-400', icon: '🟡' },
  elevado: { bg: 'bg-red-500/10', text: 'text-red-400', icon: '🔴' },
};

const TENSAO_LABELS: Record<string, string> = {
  pertencimento_vs_autonomia: 'Pertencimento × Autonomia',
  seguranca_vs_profundidade: 'Segurança × Profundidade',
  expressao_vs_protecao: 'Expressão × Proteção',
  vinculo_vs_individuacao: 'Vínculo × Individuação',
  permanencia_vs_mudanca: 'Permanência × Mudança',
};

export function CabineGrupoCenterPanel({ groupId, groupName }: Props) {
  const { fetchGroupParticipants } = useTherapeuticGroups();
  const { salvarSnapshotGrupo } = useFieldSnapshot();
  const [participants, setParticipants] = useState<GroupParticipant[]>([]);
  const [loading, setLoading] = useState(false);
  const [leitura, setLeitura] = useState<LeituraCampoColetivo | null>(null);
  const [decisao, setDecisao] = useState<DecisaoCampoColetivo | null>(null);

  useEffect(() => {
    if (!groupId) return;
    setLoading(true);

    Promise.all([
      fetchGroupParticipants(groupId),
      supabase
        .from('jardim_grupo_registros')
        .select('*')
        .eq('group_id', groupId)
        .order('data_registro', { ascending: false })
        .limit(5)
        .then(r => r.data || []),
    ]).then(([p, registros]) => {
      setParticipants(p);

      const registrosFormatados: RegistroInput[] = registros.map((r: any) => ({
        clima_movimento: r.clima_movimento as ClimaMovimento | null,
        clima_descricao: r.clima_descricao,
        escuta_campo: r.escuta_campo,
        movimentos_repetidos: r.movimentos_repetidos,
        resistencias_grupais: r.resistencias_grupais,
        fase_jornada_grupo: r.fase_jornada_grupo,
        tema_simbolico: r.tema_simbolico,
        frase_semente_grupo: r.frase_semente_grupo,
        campo_fechado: r.campo_fechado ?? false,
        data_registro: r.data_registro,
      }));

      const resultado = calcularLeituraCampoColetivo(registrosFormatados, p.length);
      const dec = avaliarCondutaColetiva(resultado);
      setLeitura(resultado);
      setDecisao(dec);

      // Salvar snapshot automaticamente
      salvarSnapshotGrupo(groupId, resultado, dec);

      setLoading(false);
    });
  }, [groupId]);

  if (!groupId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <Users className="w-10 h-10 text-muted-foreground/20 mx-auto" />
          <p className="text-sm text-muted-foreground/50 italic">Selecione um grupo</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-primary/40" />
      </div>
    );
  }

  const riscoStyle = leitura ? RISCO_STYLES[leitura.risco_coletivo] : RISCO_STYLES.baixo;

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary/70 font-semibold mb-1">
                Inteligência do Campo Coletivo
              </p>
              <h3 className="text-base font-display font-semibold text-foreground">
                {groupName}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {participants.map(p => (
              <span
                key={p.id}
                className="text-[10px] px-2 py-0.5 rounded-full bg-background/30 border border-border/10 text-foreground/70"
              >
                {p.cliente?.nome || 'Participante'}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leitura do Campo Coletivo */}
      {leitura && (
        <>
          {/* Estado + Padrão + Direção + Risco */}
          <Card className="border-border/20 bg-card/40">
            <CardContent className="p-4 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 font-semibold">
                Leitura do Campo Coletivo
              </p>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-background/20 border border-border/10">
                  <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-0.5">Estado do campo</p>
                  <p className="text-xs text-foreground/80 font-medium capitalize">
                    {leitura.estado_campo_coletivo.replace(/_/g, ' ')}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-background/20 border border-border/10">
                  <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-0.5">Padrão predominante</p>
                  <p className="text-xs text-foreground/80 font-medium capitalize">
                    {leitura.padrao_predominante.replace(/_/g, ' ')}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-background/20 border border-border/10">
                  <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-0.5">Direção de condução</p>
                  <p className="text-xs text-foreground/80 font-medium capitalize">
                    {leitura.direcao_conducao.replace(/_/g, ' ')}
                  </p>
                </div>

                <div className={cn('p-2.5 rounded-lg border border-border/10', riscoStyle.bg)}>
                  <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-0.5">Risco coletivo</p>
                  <p className={cn('text-xs font-medium capitalize', riscoStyle.text)}>
                    {riscoStyle.icon} {leitura.risco_coletivo}
                  </p>
                </div>
              </div>

              {/* Mensagens */}
              <div className="p-3 rounded-lg bg-background/30 border border-primary/10">
                <div className="flex items-start gap-2">
                  <Waves className="w-4 h-4 text-primary/60 mt-0.5 shrink-0" />
                  <div className="space-y-1.5">
                    <p className="text-sm text-foreground/90">{leitura.mensagem_estado}</p>
                    <p className="text-xs text-muted-foreground/70 italic">{leitura.mensagem_direcao}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Decisão do Campo */}
          {decisao && <BlocoDecisaoCampo decisao={decisao} />}

          {/* Sugestão de Intervenção */}
          <Card className="border-border/20 bg-card/40">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400/70 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[9px] text-amber-400/50 uppercase tracking-wider mb-0.5 font-semibold">Sugestão de intervenção</p>
                  <p className="text-sm text-foreground/90">{leitura.sugestao_intervencao}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permanência */}
          {leitura.permanencia && (
            <Card className="border-primary/15 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <Pause className="w-4 h-4 text-primary/60 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[9px] text-primary/50 uppercase tracking-wider mb-0.5 font-semibold">Permanência</p>
                    <p className="text-sm text-foreground/90 italic">{leitura.permanencia}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Alerta de Risco */}
          {leitura.alerta_risco && (
            <Card className="border-red-500/20 bg-red-500/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[9px] text-red-400/70 uppercase tracking-wider mb-0.5 font-semibold">Alerta</p>
                    <p className="text-sm text-red-300/90">{leitura.alerta_risco}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tensão + Frase simbólica */}
          {(leitura.tensao_coletiva || leitura.frase_simbolica) && (
            <Card className="border-border/15 bg-card/30">
              <CardContent className="p-4 space-y-3">
                {leitura.tensao_coletiva && (
                  <div className="p-2.5 rounded-lg bg-background/20 border border-border/10">
                    <div className="flex items-start gap-2">
                      <Shield className="w-3.5 h-3.5 text-muted-foreground/50 mt-0.5" />
                      <div>
                        <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-0.5">Tensão coletiva</p>
                        <p className="text-xs text-foreground/80 font-medium">{TENSAO_LABELS[leitura.tensao_coletiva] || leitura.tensao_coletiva}</p>
                      </div>
                    </div>
                  </div>
                )}
                {leitura.frase_simbolica && (
                  <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-[9px] text-primary/50 uppercase tracking-wider mb-0.5">Frase-semente do grupo</p>
                    <p className="text-xs text-foreground/80 italic">"{leitura.frase_simbolica}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
