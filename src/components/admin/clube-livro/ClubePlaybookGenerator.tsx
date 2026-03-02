import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2, FileText, ArrowLeft, Save, CheckCircle } from 'lucide-react';
import EstudioPlaybookPreview from '@/components/estudio-materiais/EstudioPlaybookPreview';

interface Props {
  cicloId: string;
}

const JORNADAS = ['Individuação', 'Descida', 'Retorno', 'Travessia', 'Integração'];
const PUBLICOS = ['grupo terapêutico', 'mentoria individual', 'formação profissional', 'círculo de mulheres'];

export function ClubePlaybookGenerator({ cicloId }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [generating, setGenerating] = useState(false);
  const [estrutura, setEstrutura] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data: ciclo } = useQuery({
    queryKey: ['clube-ciclo-playbook', cicloId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_ciclos')
        .select('*')
        .eq('id', cicloId)
        .single();
      if (error) throw error;
      return data as any;
    },
  });

  const { data: fases } = useQuery({
    queryKey: ['clube-fases-playbook', cicloId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_fases')
        .select('*')
        .eq('ciclo_id', cicloId)
        .eq('ativo', true)
        .order('ordem');
      if (error) throw error;
      return data;
    },
  });

  // Check if already saved
  const { data: existingMaterial } = useQuery({
    queryKey: ['clube-material-resumo', cicloId],
    queryFn: async () => {
      const { data } = await supabase
        .from('clube_livro_escutas')
        .select('id')
        .eq('ciclo_id', cicloId)
        .eq('tipo', 'resumo')
        .maybeSingle();
      return data;
    },
  });

  const [livroNome, setLivroNome] = useState('');
  const [livroAutor, setLivroAutor] = useState('');
  const [livroTexto, setLivroTexto] = useState('');
  const [publicoAlvo, setPublicoAlvo] = useState('grupo terapêutico');
  const [jornada, setJornada] = useState('Individuação');
  const [numEncontros, setNumEncontros] = useState(4);

  const initForm = () => {
    if (ciclo) {
      setLivroNome(ciclo.titulo || '');
      setLivroAutor(ciclo.autor_livro || '');
      setLivroTexto(
        [ciclo.por_que_este_livro, ciclo.manifesto, ciclo.como_ler]
          .filter(Boolean)
          .join('\n\n')
      );
      setNumEncontros(fases?.length || 4);
    }
    setShowForm(true);
    setSaved(false);
  };

  const gerarPlaybook = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('estudio-gerar-estrutura', {
        body: {
          livro_titulo: livroNome,
          livro_autor: livroAutor,
          livro_texto: livroTexto || undefined,
          publico_alvo: publicoAlvo,
          jornada,
          estacao_simbolica: 'Primavera',
          num_encontros: numEncontros,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setEstrutura(data.estrutura);
      setSaved(false);
      toast({ title: 'Resumo gerado com sucesso!' });
    } catch (err: any) {
      toast({ title: 'Erro ao gerar', description: err.message, variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };

  const salvarMaterial = useMutation({
    mutationFn: async () => {
      // Build plain text summary from estrutura
      const textoResumo = buildResumoTexto(estrutura, livroNome);

      if (existingMaterial?.id) {
        // Update existing
        const { error } = await supabase
          .from('clube_livro_escutas')
          .update({
            titulo: `Resumo — ${livroNome}`,
            descricao: estrutura.essencia_8020 || 'Resumo gerado pelo sistema',
            texto_conteudo: textoResumo,
          })
          .eq('id', existingMaterial.id);
        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('clube_livro_escutas')
          .insert({
            ciclo_id: cicloId,
            titulo: `Resumo — ${livroNome}`,
            descricao: estrutura.essencia_8020 || 'Resumo gerado pelo sistema',
            tipo: 'resumo',
            texto_conteudo: textoResumo,
            ativo: true,
            ordem: 99,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ['clube-material-resumo', cicloId] });
      toast({ title: 'Material salvo!', description: 'O resumo ficará disponível para as alunas na aba Materiais.' });
    },
    onError: (err: any) => {
      toast({ title: 'Erro ao salvar', description: err.message, variant: 'destructive' });
    },
  });

  // Show playbook result
  if (estrutura) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setEstrutura(null)} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Button>
          <Button
            size="sm"
            onClick={() => salvarMaterial.mutate()}
            disabled={salvarMaterial.isPending || saved}
            className="gap-2"
          >
            {saved ? (
              <>
                <CheckCircle className="w-4 h-4" /> Salvo para alunas
              </>
            ) : salvarMaterial.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Salvar como Material
              </>
            )}
          </Button>
        </div>
        <EstudioPlaybookPreview
          estrutura={estrutura}
          nomeMentora=""
          nomeGrupo=""
          livroTitulo={livroNome}
        />
      </div>
    );
  }

  // Show form
  if (showForm) {
    return (
      <Card className="border-primary/10">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-gold" />
              Gerar Resumo do Ciclo
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Título do Livro</Label>
              <Input value={livroNome} onChange={e => setLivroNome(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Autor</Label>
              <Input value={livroAutor} onChange={e => setLivroAutor(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Público-alvo</Label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={publicoAlvo}
                onChange={e => setPublicoAlvo(e.target.value)}
              >
                {PUBLICOS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-xs">Jornada</Label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={jornada}
                onChange={e => setJornada(e.target.value)}
              >
                {JORNADAS.map(j => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-xs">Nº de Encontros</Label>
              <Input
                type="number"
                min={2}
                max={12}
                value={numEncontros}
                onChange={e => setNumEncontros(parseInt(e.target.value) || 4)}
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Contexto do livro (pré-preenchido)</Label>
            <Textarea
              value={livroTexto}
              onChange={e => setLivroTexto(e.target.value)}
              rows={4}
              placeholder="Manifesto, orientações, trechos..."
            />
          </div>

          <Button onClick={gerarPlaybook} disabled={generating || !livroNome} className="w-full gap-2">
            {generating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Gerando Resumo...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Gerar Resumo</>
            )}
          </Button>

          {existingMaterial && (
            <p className="text-xs text-muted-foreground text-center">
              ✓ Já existe um resumo salvo para este ciclo. Gerar um novo irá substituí-lo.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed border-2 border-border">
      <CardContent className="py-8 text-center">
        <FileText className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground mb-4">
          Gere um resumo do ciclo para as alunas baixarem em PDF.
        </p>
        <Button onClick={initForm} variant="outline" className="gap-2">
          <Sparkles className="w-4 h-4" />
          Configurar e Gerar Resumo
        </Button>
        {existingMaterial && (
          <p className="text-xs text-emerald-500 mt-3">✓ Resumo já publicado para as alunas</p>
        )}
      </CardContent>
    </Card>
  );
}

/** Builds a clean plain-text summary from the generated structure */
function buildResumoTexto(estrutura: any, livroTitulo: string): string {
  const lines: string[] = [];
  
  lines.push(`RESUMO — ${estrutura.titulo_pedagogico || livroTitulo}`);
  lines.push(`Jornada: ${estrutura.jornada_predominante || 'Individuação'}`);
  lines.push('');
  
  if (estrutura.essencia_8020) {
    lines.push('ESSÊNCIA 80/20');
    lines.push(estrutura.essencia_8020);
    lines.push('');
  }

  if (estrutura.mapa_simbolico) {
    lines.push('PAISAGEM INTERIOR');
    lines.push(estrutura.mapa_simbolico);
    lines.push('');
  }

  if (estrutura.tensoes_centrais?.length > 0) {
    lines.push('TENSÕES CENTRAIS');
    estrutura.tensoes_centrais.forEach((t: string) => lines.push(`• ${t}`));
    lines.push('');
  }

  estrutura.encontros?.forEach((enc: any) => {
    lines.push(`───────────────────────────`);
    lines.push(`ENCONTRO ${enc.numero} — ${enc.titulo} (${enc.fase})`);
    if (enc.tema_central) lines.push(enc.tema_central);
    lines.push('');
    
    if (enc.abertura_ritual) {
      lines.push('Abertura do Campo:');
      lines.push(enc.abertura_ritual);
      lines.push('');
    }
    
    if (enc.perguntas_guiadas?.length > 0) {
      lines.push('Perguntas de Travessia:');
      enc.perguntas_guiadas.forEach((p: string, j: number) => lines.push(`${j + 1}. ${p}`));
      lines.push('');
    }

    if (enc.aplicacao_profissional) {
      lines.push('Aplicação Profissional:');
      lines.push(enc.aplicacao_profissional);
      lines.push('');
    }

    if (enc.o_que_nao_fazer) {
      lines.push('⚠ O que não fazer:');
      lines.push(enc.o_que_nao_fazer);
      lines.push('');
    }

    if (enc.encerramento_ritual) {
      lines.push('Fechamento do Campo:');
      lines.push(enc.encerramento_ritual);
      lines.push('');
    }
  });

  if (estrutura.convites_jardim_psique?.length > 0) {
    lines.push('🌿 JARDIM DA PSIQUE');
    estrutura.convites_jardim_psique.forEach((c: string) => lines.push(`"${c}"`));
    lines.push('');
  }

  if (estrutura.convites_jardim_oficio?.length > 0) {
    lines.push('⚒ JARDIM DO OFÍCIO');
    estrutura.convites_jardim_oficio.forEach((c: string) => lines.push(`"${c}"`));
    lines.push('');
  }

  if (estrutura.observacao_clinica) {
    lines.push('OBSERVAÇÃO CLÍNICA');
    lines.push(estrutura.observacao_clinica);
    lines.push('');
  }

  lines.push('───────────────────────────');
  lines.push('Método de Leitura Oracular — Casa Orácula');
  lines.push('Círculo de Leitura Simbólica · Material de Uso Formativo');

  return lines.join('\n');
}
