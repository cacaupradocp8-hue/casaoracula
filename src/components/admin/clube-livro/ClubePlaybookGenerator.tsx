import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2, FileText, ArrowLeft } from 'lucide-react';
import EstudioPlaybookPreview from '@/components/estudio-materiais/EstudioPlaybookPreview';

interface Props {
  cicloId: string;
}

const JORNADAS = ['Individuação', 'Descida', 'Retorno', 'Travessia', 'Integração'];
const PUBLICOS = ['grupo terapêutico', 'mentoria individual', 'formação profissional', 'círculo de mulheres'];

export function ClubePlaybookGenerator({ cicloId }: Props) {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [estrutura, setEstrutura] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  // Pre-fill from ciclo data
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

  // Fetch fases for additional context
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

  // Editable fields pre-filled from ciclo
  const [livroNome, setLivroNome] = useState('');
  const [livroAutor, setLivroAutor] = useState('');
  const [livroTexto, setLivroTexto] = useState('');
  const [publicoAlvo, setPublicoAlvo] = useState('grupo terapêutico');
  const [jornada, setJornada] = useState('Individuação');
  const [numEncontros, setNumEncontros] = useState(4);

  // Sync from ciclo when data loads
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
      toast({ title: 'Playbook gerado com sucesso!' });
    } catch (err: any) {
      toast({ title: 'Erro ao gerar', description: err.message, variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };

  // Show playbook result
  if (estrutura) {
    return (
      <div className="space-y-4">
        <Button variant="outline" size="sm" onClick={() => setEstrutura(null)} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Voltar ao formulário
        </Button>
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
              Gerar Playbook do Ciclo
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
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Gerando Playbook...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Gerar Playbook
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Initial state - button to start
  return (
    <Card className="border-dashed border-2 border-border">
      <CardContent className="py-8 text-center">
        <FileText className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground mb-4">
          Gere um Playbook completo para este ciclo com base no Método de Leitura Oracular.
        </p>
        <Button onClick={initForm} variant="outline" className="gap-2">
          <Sparkles className="w-4 h-4" />
          Configurar e Gerar Playbook
        </Button>
      </CardContent>
    </Card>
  );
}
