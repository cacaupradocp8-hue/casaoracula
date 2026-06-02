/**
 * IMPORTADOR SEGURO DE ESTAÇÕES — ETAPA 2.7
 *
 * Mecanismo determinístico de importação de conteúdo de estação.
 * NÃO gera, NÃO resume, NÃO reescreve, NÃO interpreta.
 * Apenas: Recebe → Mapeia → Persiste → Valida.
 *
 * Formato suportado: texto estruturado com cabeçalhos `## BLOCO` e linhas `chave: valor`.
 * Multi-linha: tudo após `chave:` até o próximo `chave:` ou `## BLOCO` é o valor.
 */

import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CheckCircle2, XCircle, Upload, AlertTriangle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// ───────── Tipos
type ParsedBlocks = Record<string, Record<string, string>> & {
  __audios?: Array<Record<string, string>>;
};

type BlockStatus = { key: string; label: string; found: boolean; details?: string };

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estacao: any;            // clube_estacoes row
  passo: any;              // clube_rota_itens row (target)
}

// ───────── Normalização determinística de cabeçalhos
function normHeader(raw: string): string {
  return raw
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Mapeia o título do bloco (após `## `) para uma chave canônica.
const HEADER_MAP: Array<{ test: (h: string) => boolean; key: string }> = [
  { test: h => h === 'hero', key: 'hero' },
  { test: h => h.startsWith('mapa'), key: 'mapa_simbolico' },
  { test: h => /^audio(s)?\b/.test(h), key: 'audio' }, // pode ter número
  { test: h => h.startsWith('caso'), key: 'caso_simbolico' },
  { test: h => h.startsWith('desafio'), key: 'desafio_escuta' },
  { test: h => h.startsWith('revelac'), key: 'revelacao_estacao' },
  { test: h => h.startsWith('ferramenta'), key: 'ferramenta_oracular' },
  { test: h => h.startsWith('jardim da psique') || h === 'jardim psique', key: 'jardim_psique' },
  { test: h => h.startsWith('jardim do oficio') || h === 'jardim oficio', key: 'jardim_oficio' },
  { test: h => h.startsWith('missao'), key: 'missao_campo' },
  { test: h => h.startsWith('fechamento'), key: 'fechamento' },
];

function resolveHeader(raw: string): { key: string; index?: number } | null {
  const h = normHeader(raw);
  for (const m of HEADER_MAP) {
    if (m.test(h)) {
      if (m.key === 'audio') {
        const num = parseInt(h.replace(/\D+/g, ''), 10);
        return { key: 'audio', index: isNaN(num) ? 1 : num };
      }
      return { key: m.key };
    }
  }
  return null;
}

// ───────── Parser determinístico
function parseImport(text: string): { blocks: ParsedBlocks; unknownHeaders: string[] } {
  const blocks: ParsedBlocks = {};
  const unknownHeaders: string[] = [];
  const audios: Record<number, Record<string, string>> = {};

  const lines = text.replace(/\r\n/g, '\n').split('\n');
  let currentBlockKey: string | null = null;
  let currentAudioIdx: number | null = null;
  let currentField: string | null = null;
  let buffer: string[] = [];

  const flushField = () => {
    if (currentBlockKey && currentField) {
      const value = buffer.join('\n').replace(/\s+$/g, '').replace(/^\s*\n/, '');
      const target = currentBlockKey === 'audio' && currentAudioIdx != null
        ? (audios[currentAudioIdx] ||= {})
        : (blocks[currentBlockKey] ||= {});
      target[currentField] = value.trim();
    }
    buffer = [];
    currentField = null;
  };

  for (const rawLine of lines) {
    const line = rawLine;

    // Cabeçalho de bloco
    const headerMatch = line.match(/^\s*##\s+(.+?)\s*$/);
    if (headerMatch) {
      flushField();
      const resolved = resolveHeader(headerMatch[1]);
      if (!resolved) {
        unknownHeaders.push(headerMatch[1].trim());
        currentBlockKey = null;
        currentAudioIdx = null;
      } else {
        currentBlockKey = resolved.key;
        currentAudioIdx = resolved.index ?? null;
        if (currentBlockKey !== 'audio') {
          blocks[currentBlockKey] ||= {};
        } else if (currentAudioIdx != null) {
          audios[currentAudioIdx] ||= {};
        }
      }
      continue;
    }

    // Linha chave: valor (chave = letras/_/dígitos)
    const kv = line.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*(.*)$/);
    if (kv && currentBlockKey) {
      flushField();
      currentField = kv[1].toLowerCase();
      buffer = [kv[2]];
      continue;
    }

    // Continuação de valor multi-linha
    if (currentField) buffer.push(line);
  }
  flushField();

  const audioIdxs = Object.keys(audios).map(Number).sort((a, b) => a - b);
  if (audioIdxs.length > 0) {
    blocks.__audios = audioIdxs.map(i => audios[i]);
  }

  return { blocks, unknownHeaders };
}

// ───────── Mapeamento para o schema do metadata existente
function mapToMetadata(blocks: ParsedBlocks, baseMeta: any, mode: 'replace' | 'merge') {
  const meta = mode === 'replace' ? { ...baseMeta } : structuredClone(baseMeta || {});
  const report: string[] = [];
  const splitList = (v?: string) => (v || '').split(/\n|\||;/).map(s => s.trim()).filter(Boolean);

  const setBlock = (key: string, partial: any, label: string) => {
    const prev = (typeof meta[key] === 'object' && meta[key] !== null) ? meta[key] : {};
    meta[key] = mode === 'replace' ? { ...partial } : { ...prev, ...partial };
    report.push(`${label} atualizado`);
  };

  if (blocks.hero) {
    setBlock('hero', {
      titulo: blocks.hero.titulo ?? meta.hero?.titulo ?? '',
      texto: blocks.hero.texto ?? meta.hero?.texto ?? '',
      cta: blocks.hero.cta ?? meta.hero?.cta ?? '',
    }, 'Hero');
  }
  if (blocks.mapa_simbolico) {
    setBlock('mapa_simbolico', {
      titulo: blocks.mapa_simbolico.titulo ?? meta.mapa_simbolico?.titulo ?? '',
      descricao: blocks.mapa_simbolico.descricao ?? meta.mapa_simbolico?.descricao ?? '',
      imagem_url: blocks.mapa_simbolico.imagem_url ?? meta.mapa_simbolico?.imagem_url ?? '',
    }, 'Mapa Simbólico');
  }
  if (blocks.__audios && blocks.__audios.length > 0) {
    const existing: any[] = Array.isArray(meta.audios) ? meta.audios : [];
    const merged = blocks.__audios.map((a, i) => ({
      titulo: a.titulo ?? existing[i]?.titulo ?? '',
      tipo: a.tipo ?? existing[i]?.tipo ?? '',
      funcao: a.funcao ?? existing[i]?.funcao ?? '',
      pergunta_central: a.pergunta_central ?? existing[i]?.pergunta_central ?? '',
      duracao: a.duracao ?? existing[i]?.duracao ?? '',
      url: a.url ?? existing[i]?.url ?? '',
      roteiro: a.roteiro ?? existing[i]?.roteiro ?? '',
      transcricao: a.transcricao ?? existing[i]?.transcricao ?? '',
    }));
    meta.audios = mode === 'replace' ? merged : [...merged, ...existing.slice(merged.length)];
    report.push(`${merged.length} áudio(s) atualizado(s)`);
  }
  if (blocks.caso_simbolico) {
    setBlock('caso_simbolico', {
      titulo: blocks.caso_simbolico.titulo ?? meta.caso_simbolico?.titulo ?? '',
      aviso: blocks.caso_simbolico.aviso ?? meta.caso_simbolico?.aviso ?? '',
      relato: blocks.caso_simbolico.relato ?? meta.caso_simbolico?.relato ?? '',
    }, 'Caso Simbólico');
  }
  if (blocks.desafio_escuta) {
    const escolhas = blocks.desafio_escuta.escolhas
      ? splitList(blocks.desafio_escuta.escolhas)
      : (meta.desafio_escuta?.escolhas || []);
    setBlock('desafio_escuta', {
      pergunta: blocks.desafio_escuta.pergunta ?? meta.desafio_escuta?.pergunta ?? '',
      escolhas,
      campo_aberto_label: blocks.desafio_escuta.campo_aberto_label ?? meta.desafio_escuta?.campo_aberto_label ?? '',
    }, 'Desafio de Escuta');
  }
  if (blocks.revelacao_estacao) {
    setBlock('revelacao_estacao', {
      porta: blocks.revelacao_estacao.porta ?? meta.revelacao_estacao?.porta ?? '',
      campo_psiquico: blocks.revelacao_estacao.campo_psiquico ?? meta.revelacao_estacao?.campo_psiquico ?? '',
      torre: blocks.revelacao_estacao.torre ?? meta.revelacao_estacao?.torre ?? '',
      labirinto: blocks.revelacao_estacao.labirinto ?? meta.revelacao_estacao?.labirinto ?? '',
      pergunta_narrativa: blocks.revelacao_estacao.pergunta_narrativa ?? meta.revelacao_estacao?.pergunta_narrativa ?? '',
    }, 'Revelação');
  }
  if (blocks.ferramenta_oracular) {
    const prev = meta.ferramenta_oracular || {};
    meta.ferramenta_oracular = {
      ...prev,
      nome_publico: blocks.ferramenta_oracular.nome_publico ?? prev.nome_publico ?? '',
      simbolo: blocks.ferramenta_oracular.simbolo ?? prev.simbolo ?? '',
      pergunta_mae: blocks.ferramenta_oracular.pergunta_mae ?? prev.pergunta_mae ?? '',
      funcao: blocks.ferramenta_oracular.funcao ?? prev.funcao ?? '',
      observacoes: blocks.ferramenta_oracular.observacoes ?? prev.observacoes ?? '',
    };
    report.push('Ferramenta Oracular atualizada');
  }
  if (blocks.jardim_psique) {
    setBlock('jardim_psique', {
      ...(meta.jardim_psique || {}),
      chamada: blocks.jardim_psique.chamada ?? meta.jardim_psique?.chamada ?? '',
      pergunta: blocks.jardim_psique.pergunta ?? meta.jardim_psique?.pergunta ?? '',
      botao: blocks.jardim_psique.botao ?? meta.jardim_psique?.botao ?? '',
      confirmacao: blocks.jardim_psique.confirmacao ?? meta.jardim_psique?.confirmacao ?? '',
    }, 'Jardim da Psique');
  }
  if (blocks.jardim_oficio) {
    setBlock('jardim_oficio', {
      ...(meta.jardim_oficio || {}),
      chamada: blocks.jardim_oficio.chamada ?? meta.jardim_oficio?.chamada ?? '',
      pergunta: blocks.jardim_oficio.pergunta ?? meta.jardim_oficio?.pergunta ?? '',
      aviso_etico: blocks.jardim_oficio.aviso_etico ?? meta.jardim_oficio?.aviso_etico ?? '',
      botao: blocks.jardim_oficio.botao ?? meta.jardim_oficio?.botao ?? '',
      confirmacao: blocks.jardim_oficio.confirmacao ?? meta.jardim_oficio?.confirmacao ?? '',
    }, 'Jardim do Ofício');
  }
  if (blocks.missao_campo) {
    setBlock('missao_campo', {
      titulo: blocks.missao_campo.titulo ?? meta.missao_campo?.titulo ?? '',
      descricao: blocks.missao_campo.descricao ?? meta.missao_campo?.descricao ?? '',
      sinais: blocks.missao_campo.sinais ?? meta.missao_campo?.sinais ?? '',
      pergunta: blocks.missao_campo.pergunta ?? meta.missao_campo?.pergunta ?? '',
      botao: blocks.missao_campo.botao ?? meta.missao_campo?.botao ?? '',
    }, 'Missão de Campo');
  }
  if (blocks.fechamento) {
    setBlock('fechamento', {
      texto: blocks.fechamento.texto ?? meta.fechamento?.texto ?? '',
      pergunta: blocks.fechamento.pergunta ?? meta.fechamento?.pergunta ?? '',
      botao: blocks.fechamento.botao ?? meta.fechamento?.botao ?? '',
      confirmacao: blocks.fechamento.confirmacao ?? meta.fechamento?.confirmacao ?? '',
    }, 'Fechamento');
  }

  return { meta, report };
}

// ───────── Componente principal
const BLOCOS_OFICIAIS: Array<{ key: string; label: string }> = [
  { key: 'hero', label: 'Hero' },
  { key: 'mapa_simbolico', label: 'Mapa Simbólico' },
  { key: '__audios', label: 'Áudios' },
  { key: 'caso_simbolico', label: 'Caso Simbólico' },
  { key: 'desafio_escuta', label: 'Desafio de Escuta' },
  { key: 'revelacao_estacao', label: 'Revelação' },
  { key: 'ferramenta_oracular', label: 'Ferramenta Oracular' },
  { key: 'jardim_psique', label: 'Jardim da Psique' },
  { key: 'jardim_oficio', label: 'Jardim do Ofício' },
  { key: 'missao_campo', label: 'Missão de Campo' },
  { key: 'fechamento', label: 'Fechamento' },
];

const EXEMPLO = `## HERO
titulo: Título do Hero
texto: Texto introdutório.
cta: Atravessar

## MAPA SIMBOLICO
titulo: ...
descricao: ...
imagem_url: https://...

## AUDIO 1
titulo: Abertura
tipo: introducao
funcao: ...
duracao: 03:00
url: https://...
roteiro: |
Linha 1
Linha 2

## CASO SIMBOLICO
titulo: ...
relato: |
Relato multi-linha.

## DESAFIO
pergunta: ...
escolhas: Porta | Torre | Labirinto | Campo psíquico
campo_aberto_label: Sua escuta

## REVELACAO
porta: ...
campo_psiquico: ...
torre: ...
labirinto: ...
pergunta_narrativa: ...

## FERRAMENTA
nome_publico: ...
simbolo: ...
pergunta_mae: ...
funcao: ...

## JARDIM PSIQUE
chamada: ...
pergunta: ...
botao: Registrar
confirmacao: ...

## JARDIM OFICIO
chamada: ...
aviso_etico: ...
pergunta: ...
botao: Registrar
confirmacao: ...

## MISSAO
titulo: ...
descricao: ...
sinais: ...
pergunta: ...
botao: ...

## FECHAMENTO
texto: ...
pergunta: ...
botao: ...
confirmacao: ...
`;

export default function ImportadorEstacao({ open, onOpenChange, estacao, passo }: Props) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [raw, setRaw] = useState('');
  const [substituir, setSubstituir] = useState(false);
  const [savedReport, setSavedReport] = useState<string[] | null>(null);

  const parsed = useMemo(() => (raw.trim() ? parseImport(raw) : null), [raw]);

  const status: BlockStatus[] = useMemo(() => {
    if (!parsed) return [];
    return BLOCOS_OFICIAIS.map(b => {
      if (b.key === '__audios') {
        const n = parsed.blocks.__audios?.length || 0;
        return { key: b.key, label: b.label, found: n > 0, details: n > 0 ? `${n} áudio(s)` : 'Não encontrado' };
      }
      const found = !!parsed.blocks[b.key] && Object.keys(parsed.blocks[b.key]).length > 0;
      return { key: b.key, label: b.label, found, details: found ? `${Object.keys(parsed.blocks[b.key]).length} campo(s)` : 'Não encontrado' };
    });
  }, [parsed]);

  const persistMutation = useMutation({
    mutationFn: async () => {
      if (!passo || !parsed) throw new Error('Sem passo destino ou conteúdo válido.');
      const { meta, report } = mapToMetadata(
        parsed.blocks,
        passo.metadata || {},
        substituir ? 'replace' : 'merge',
      );

      const updates: any = { metadata: meta };

      // Hero.titulo também atualiza o título do passo (mantém consistência)
      if (parsed.blocks.hero?.titulo) {
        updates.titulo = parsed.blocks.hero.titulo;
      }

      const { error } = await supabase
        .from('clube_rota_itens')
        .update(updates)
        .eq('id', passo.id);
      if (error) throw error;
      return report;
    },
    onSuccess: (report) => {
      setSavedReport(report);
      qc.invalidateQueries({ queryKey: ['admin-rota-passos', estacao?.id] });
      toast({ title: 'Importação concluída', description: `${report.length} bloco(s) atualizado(s).` });
    },
    onError: (err: any) => {
      toast({ title: 'Erro ao importar', description: err.message, variant: 'destructive' });
    },
  });

  const handleClose = () => {
    if (persistMutation.isPending) return;
    setRaw('');
    setSavedReport(null);
    setSubstituir(false);
    onOpenChange(false);
  };

  const canPersist = !!parsed && status.some(s => s.found) && !!passo;

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(true) : handleClose())}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-gold" />
            Importar Conteúdo da Estação
          </DialogTitle>
          <DialogDescription>
            Cole o conteúdo estruturado da estação. O importador apenas mapeia e persiste — nunca gera, resume ou reescreve.
          </DialogDescription>
        </DialogHeader>

        {/* Validação de contexto */}
        <div className="rounded-lg border border-primary/10 bg-muted/30 p-3 text-xs space-y-1">
          <div><span className="text-muted-foreground">Estação:</span> <span className="font-medium">{estacao?.numero} — {estacao?.titulo}</span></div>
          <div><span className="text-muted-foreground">Obra:</span> {estacao?.livro_titulo || '—'}</div>
          <div><span className="text-muted-foreground">Passo destino:</span> {passo ? `${passo.slug || passo.id}` : <span className="text-destructive">nenhum passo selecionado</span>}</div>
        </div>

        {savedReport ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-500">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="font-medium">Relatório de importação</h3>
            </div>
            <ul className="text-sm space-y-1 pl-2">
              {savedReport.map((r, i) => (
                <li key={i} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />{r}</li>
              ))}
              {status.filter(s => !s.found).map(s => (
                <li key={s.key} className="flex items-center gap-2 text-muted-foreground"><XCircle className="w-3.5 h-3.5" />{s.label} — não encontrado</li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Texto estruturado</Label>
                <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => setRaw(EXEMPLO)}>
                  <FileText className="w-3 h-3" /> Inserir exemplo
                </Button>
              </div>
              <Textarea
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                placeholder="Cole aqui o conteúdo da estação no formato ## BLOCO + chave: valor"
                className="font-mono text-xs min-h-[260px]"
              />
            </div>

            {parsed && (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Pré-visualização</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {status.map(s => (
                      <div key={s.key} className="flex items-center justify-between text-xs px-3 py-1.5 rounded border border-primary/10 bg-card">
                        <span>{s.label}</span>
                        {s.found ? (
                          <Badge variant="default" className="bg-emerald-500/10 text-emerald-500 text-[10px]">{s.details}</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">Não encontrado</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {parsed.unknownHeaders.length > 0 && (
                  <div className="flex gap-2 text-xs text-amber-500 bg-amber-500/5 p-2 rounded border border-amber-500/20">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium">Cabeçalhos ignorados (não mapeáveis):</div>
                      <div className="text-amber-500/80">{parsed.unknownHeaders.join(', ')}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between rounded-lg border border-primary/10 p-3 bg-muted/30">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Substituir conteúdo existente?</Label>
                    <p className="text-xs text-muted-foreground">
                      {substituir ? 'SIM — sobrescreve os blocos identificados.' : 'NÃO — merge seguro, preserva campos não fornecidos.'}
                    </p>
                  </div>
                  <Switch checked={substituir} onCheckedChange={setSubstituir} />
                </div>
              </div>
            )}
          </>
        )}

        <DialogFooter>
          {savedReport ? (
            <Button onClick={handleClose}>Fechar</Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleClose} disabled={persistMutation.isPending}>Cancelar</Button>
              <Button
                onClick={() => persistMutation.mutate()}
                disabled={!canPersist || persistMutation.isPending}
                className="bg-gold hover:bg-gold/90 text-black font-bold"
              >
                {persistMutation.isPending ? 'Salvando…' : substituir ? 'Substituir e salvar' : 'Mesclar e salvar'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
