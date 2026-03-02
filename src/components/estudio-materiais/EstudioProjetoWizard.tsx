import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft, ArrowRight, BookOpen, Upload, Loader2, Sparkles,
  FileText, Image, Check, Download,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EstudioEstruturaView from './EstudioEstruturaView';
import EstudioPlaybookPreview from './EstudioPlaybookPreview';
import EstudioInfografico from './EstudioInfografico';

interface Props {
  projectId: string | null;
  onClose: () => void;
}

type Step = 'source' | 'config' | 'generate' | 'results';

export default function EstudioProjetoWizard({ projectId, onClose }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>(projectId ? 'results' : 'source');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(projectId);

  // Source
  const [modo, setModo] = useState<'casa' | 'externo'>('externo');
  const [bookId, setBookId] = useState<string | null>(null);
  const [livroNome, setLivroNome] = useState('');
  const [livroAutor, setLivroAutor] = useState('');
  const [livroTexto, setLivroTexto] = useState('');
  const [livros, setLivros] = useState<{ id: string; title: string; author: string | null }[]>([]);

  // Config
  const [titulo, setTitulo] = useState('');
  const [publicoAlvo, setPublicoAlvo] = useState('grupo terapêutico');
  const [jornada, setJornada] = useState('Individuação');
  const [estacao, setEstacao] = useState('Primavera');
  const [numEncontros, setNumEncontros] = useState(4);

  // Personalization
  const [nomeMentora, setNomeMentora] = useState('');
  const [nomeGrupo, setNomeGrupo] = useState('');

  // Results
  const [estrutura, setEstrutura] = useState<any>(null);

  useEffect(() => {
    loadBooks();
    if (projectId) loadProject(projectId);
  }, [projectId]);

  const loadBooks = async () => {
    const { data } = await supabase.from('books').select('id, title, author').order('title');
    if (data) setLivros(data);
  };

  const loadProject = async (id: string) => {
    setLoading(true);
    const { data } = await supabase.from('estudio_projetos').select('*').eq('id', id).single();
    if (data) {
      const d = data as any;
      setModo(d.modo);
      setBookId(d.book_id);
      setLivroNome(d.livro_externo_nome || '');
      setLivroAutor(d.livro_externo_autor || '');
      setLivroTexto(d.livro_externo_texto || '');
      setTitulo(d.titulo);
      setPublicoAlvo(d.publico_alvo || 'grupo terapêutico');
      setJornada(d.jornada || 'Individuação');
      setEstacao(d.estacao_simbolica || 'Primavera');
      setNumEncontros(d.num_encontros || 4);
      setNomeMentora(d.nome_mentora || '');
      setNomeGrupo(d.nome_grupo || '');
      setEstrutura(d.estrutura_gerada);
      setStep(d.estrutura_gerada ? 'results' : 'source');
    }
    setLoading(false);
  };

  const saveProject = async (): Promise<string | null> => {
    const livroTitle = modo === 'casa'
      ? livros.find(l => l.id === bookId)?.title || 'Projeto'
      : livroNome;

    const payload = {
      owner_id: user!.id,
      titulo: titulo || livroTitle,
      modo,
      book_id: modo === 'casa' ? bookId : null,
      livro_externo_nome: modo === 'externo' ? livroNome : null,
      livro_externo_autor: modo === 'externo' ? livroAutor : null,
      livro_externo_texto: modo === 'externo' ? livroTexto : null,
      publico_alvo: publicoAlvo,
      jornada,
      estacao_simbolica: estacao,
      num_encontros: numEncontros,
      nome_mentora: nomeMentora,
      nome_grupo: nomeGrupo,
      estrutura_gerada: estrutura,
      status: estrutura ? 'completo' : 'rascunho',
    };

    if (currentProjectId) {
      const { error } = await supabase
        .from('estudio_projetos')
        .update(payload as any)
        .eq('id', currentProjectId);
      if (error) { toast({ title: 'Erro ao salvar', variant: 'destructive' }); return null; }
      return currentProjectId;
    } else {
      const { data, error } = await supabase
        .from('estudio_projetos')
        .insert(payload as any)
        .select('id')
        .single();
      if (error || !data) { toast({ title: 'Erro ao criar projeto', variant: 'destructive' }); return null; }
      setCurrentProjectId(data.id);
      return data.id;
    }
  };

  const gerarEstrutura = async () => {
    setGenerating(true);
    const savedId = await saveProject();
    if (!savedId) { setGenerating(false); return; }

    const livroTitle = modo === 'casa'
      ? livros.find(l => l.id === bookId)?.title || ''
      : livroNome;
    const livroAuthorName = modo === 'casa'
      ? livros.find(l => l.id === bookId)?.author || ''
      : livroAutor;

    try {
      const { data, error } = await supabase.functions.invoke('estudio-gerar-estrutura', {
        body: {
          livro_titulo: livroTitle,
          livro_autor: livroAuthorName,
          livro_texto: livroTexto || undefined,
          publico_alvo: publicoAlvo,
          jornada,
          estacao_simbolica: estacao,
          num_encontros: numEncontros,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setEstrutura(data.estrutura);
      // Save structure
      await supabase
        .from('estudio_projetos')
        .update({ estrutura_gerada: data.estrutura, status: 'completo' } as any)
        .eq('id', savedId);

      setStep('results');
      toast({ title: 'Estrutura gerada com sucesso!' });
    } catch (err: any) {
      toast({ title: 'Erro ao gerar', description: err.message, variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  const JORNADAS = ['Individuação', 'Descida', 'Retorno', 'Travessia', 'Integração'];
  const ESTACOES = ['Primavera', 'Verão', 'Outono', 'Inverno'];
  const PUBLICOS = ['grupo terapêutico', 'mentoria individual', 'formação profissional', 'círculo de mulheres'];

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 pb-20 max-w-4xl">
        {/* Top bar */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
          <span className="text-sm text-muted-foreground">
            {step === 'source' && 'Etapa 1 · Escolher Livro'}
            {step === 'config' && 'Etapa 2 · Configurar'}
            {step === 'generate' && 'Etapa 3 · Gerar Estrutura'}
            {step === 'results' && 'Materiais Gerados'}
          </span>
        </div>

        {/* Step: Source */}
        {step === 'source' && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Escolher Livro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={modo === 'casa' ? 'default' : 'outline'}
                  className="h-20 flex-col gap-1"
                  onClick={() => setModo('casa')}
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="text-xs">Livro da Casa</span>
                </Button>
                <Button
                  variant={modo === 'externo' ? 'default' : 'outline'}
                  className="h-20 flex-col gap-1"
                  onClick={() => setModo('externo')}
                >
                  <Upload className="w-5 h-5" />
                  <span className="text-xs">Livro Externo</span>
                </Button>
              </div>

              {modo === 'casa' && (
                <div className="space-y-2">
                  <Label>Selecionar Livro</Label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={bookId || ''}
                    onChange={e => setBookId(e.target.value || null)}
                  >
                    <option value="">Escolha um livro...</option>
                    {livros.map(l => (
                      <option key={l.id} value={l.id}>
                        {l.title} {l.author ? `— ${l.author}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {modo === 'externo' && (
                <div className="space-y-4">
                  <div>
                    <Label>Nome do livro</Label>
                    <Input value={livroNome} onChange={e => setLivroNome(e.target.value)} placeholder="Ex: O Herói de Mil Faces" />
                  </div>
                  <div>
                    <Label>Autor</Label>
                    <Input value={livroAutor} onChange={e => setLivroAutor(e.target.value)} placeholder="Ex: Joseph Campbell" />
                  </div>
                  <div>
                    <Label>Texto ou resumo do livro (opcional)</Label>
                    <Textarea
                      value={livroTexto}
                      onChange={e => setLivroTexto(e.target.value)}
                      placeholder="Cole aqui trechos ou resumo do livro para enriquecer a geração..."
                      rows={6}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={() => setStep('config')}
                  disabled={(modo === 'casa' && !bookId) || (modo === 'externo' && !livroNome)}
                  className="gap-2"
                >
                  Próximo <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step: Config */}
        {step === 'config' && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Configurar Aplicação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Título do projeto</Label>
                <Input
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  placeholder={modo === 'casa' ? livros.find(l => l.id === bookId)?.title : livroNome}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Público-alvo</Label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={publicoAlvo}
                    onChange={e => setPublicoAlvo(e.target.value)}
                  >
                    {PUBLICOS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Jornada predominante</Label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={jornada}
                    onChange={e => setJornada(e.target.value)}
                  >
                    {JORNADAS.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Estação simbólica</Label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={estacao}
                    onChange={e => setEstacao(e.target.value)}
                  >
                    {ESTACOES.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Número de encontros</Label>
                  <Input
                    type="number"
                    min={2}
                    max={12}
                    value={numEncontros}
                    onChange={e => setNumEncontros(parseInt(e.target.value) || 4)}
                  />
                </div>
              </div>

              <div className="border-t border-border pt-4 mt-4">
                <p className="text-sm font-medium mb-3 text-foreground">Personalização (para o Playbook)</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nome da mentora</Label>
                    <Input value={nomeMentora} onChange={e => setNomeMentora(e.target.value)} placeholder="Seu nome" />
                  </div>
                  <div>
                    <Label>Nome do grupo</Label>
                    <Input value={nomeGrupo} onChange={e => setNomeGrupo(e.target.value)} placeholder="Nome do grupo" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep('source')}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
                </Button>
                <Button onClick={() => setStep('generate')} className="gap-2">
                  Próximo <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step: Generate */}
        {step === 'generate' && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Gerar Estrutura Pedagógica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                <p><strong>Livro:</strong> {modo === 'casa' ? livros.find(l => l.id === bookId)?.title : livroNome}</p>
                <p><strong>Público:</strong> {publicoAlvo}</p>
                <p><strong>Jornada:</strong> {jornada} · <strong>Estação:</strong> {estacao}</p>
                <p><strong>Encontros:</strong> {numEncontros}</p>
              </div>

              <p className="text-sm text-muted-foreground">
                A IA irá gerar a estrutura completa do programa de leitura com base no Método de Leitura Oracular. 
                Você poderá editar tudo antes de exportar.
              </p>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep('config')}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
                </Button>
                <Button onClick={gerarEstrutura} disabled={generating} className="gap-2">
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Gerar Estrutura
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step: Results */}
        {step === 'results' && estrutura && (
          <div className="space-y-6">
            <Tabs defaultValue="estrutura" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="estrutura" className="gap-1 text-xs sm:text-sm">
                  <Check className="w-3.5 h-3.5" /> Estrutura
                </TabsTrigger>
                <TabsTrigger value="playbook" className="gap-1 text-xs sm:text-sm">
                  <FileText className="w-3.5 h-3.5" /> Playbook
                </TabsTrigger>
                <TabsTrigger value="infografico" className="gap-1 text-xs sm:text-sm">
                  <Image className="w-3.5 h-3.5" /> Infográfico
                </TabsTrigger>
              </TabsList>

              <TabsContent value="estrutura">
                <EstudioEstruturaView
                  estrutura={estrutura}
                  onUpdate={(updated) => {
                    setEstrutura(updated);
                    if (currentProjectId) {
                      supabase.from('estudio_projetos')
                        .update({ estrutura_gerada: updated } as any)
                        .eq('id', currentProjectId)
                        .then();
                    }
                  }}
                />
              </TabsContent>

              <TabsContent value="playbook">
                <EstudioPlaybookPreview
                  estrutura={estrutura}
                  nomeMentora={nomeMentora}
                  nomeGrupo={nomeGrupo}
                  livroTitulo={modo === 'casa' ? livros.find(l => l.id === bookId)?.title || '' : livroNome}
                />
              </TabsContent>




              <TabsContent value="infografico">
                <EstudioInfografico
                  estrutura={estrutura}
                  livroTitulo={modo === 'casa' ? livros.find(l => l.id === bookId)?.title || '' : livroNome}
                  projectId={currentProjectId}
                  onImageGenerated={(url) => {
                    if (currentProjectId) {
                      supabase.from('estudio_projetos')
                        .update({ infografico_url: url } as any)
                        .eq('id', currentProjectId)
                        .then();
                    }
                  }}
                />
              </TabsContent>
            </Tabs>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('generate')}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Regenerar
              </Button>
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
