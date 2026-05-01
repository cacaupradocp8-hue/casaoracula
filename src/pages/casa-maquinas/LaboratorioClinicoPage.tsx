import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  FlaskConical, Plus, FileText, ClipboardList, Users, 
  Sparkles, ArrowLeft, Loader2, AlertTriangle, Compass,
  MessageCircle, Wrench, Eye, Trash2, Save
} from 'lucide-react';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type ModoEntrada = 'texto_livre' | 'formulario' | 'cliente_vinculado';

interface CasoLaboratorio {
  id: string;
  titulo: string;
  modo_entrada: ModoEntrada;
  caso_texto: string | null;
  fala_cliente: string | null;
  duvida_terapeuta: string | null;
  ja_tentou: string | null;
  cliente_id: string | null;
  analise_simbolica: string | null;
  perguntas_sugeridas: string[];
  riscos_eticos: string | null;
  simulacao_cliente: string | null;
  ferramenta_sugerida: string | null;
  status: 'rascunho' | 'analisado' | 'arquivado';
  created_at: string;
}

export default function LaboratorioClinicoPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data: casos = [], isLoading } = useQuery({
    queryKey: ['laboratorio-casos', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('co_laboratorio_casos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as CasoLaboratorio[];
    },
    enabled: !!user,
  });

  const activeCase = casos.find(c => c.id === activeCaseId);

  if (isCreating) {
    return (
      <CasaMaquinasLayout 
        title="Novo Caso — Laboratório Clínico"
        subtitle="Traga um caso real para supervisão simbólica com a Mentora IA."
      >
        <NovoCasoForm 
          onCancel={() => setIsCreating(false)}
          onCreated={(id) => {
            setIsCreating(false);
            setActiveCaseId(id);
            queryClient.invalidateQueries({ queryKey: ['laboratorio-casos'] });
          }}
        />
      </CasaMaquinasLayout>
    );
  }

  if (activeCase) {
    return (
      <CasaMaquinasLayout title={activeCase.titulo} subtitle="Supervisão da Mentora IA">
        <CasoDetalhe 
          caso={activeCase} 
          onBack={() => setActiveCaseId(null)} 
          onUpdate={() => queryClient.invalidateQueries({ queryKey: ['laboratorio-casos'] })}
        />
      </CasaMaquinasLayout>
    );
  }

  return (
    <CasaMaquinasLayout 
      title="Laboratório Clínico"
      subtitle="Traga seus casos reais. A Mentora IA oferece supervisão simbólica."
    >
      <div className="space-y-6">
        {/* Header de boas-vindas */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <FlaskConical className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-semibold text-foreground">Supervisão simbólica de casos reais</h2>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                  Diferente da Câmara do Sussurro (Clube) e da Sala de Treinamento (Formação), 
                  aqui você traz <span className="text-primary">seus próprios casos clínicos</span> e 
                  recebe leitura simbólica, perguntas, riscos éticos e simulação de campo.
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setIsCreating(true)} 
              className="gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" /> Novo Caso
            </Button>
          </CardContent>
        </Card>

        {/* Lista de casos */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Seus Casos</h3>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : casos.length === 0 ? (
            <Card className="border-dashed border-border/40">
              <CardContent className="p-12 text-center space-y-3">
                <FlaskConical className="w-10 h-10 mx-auto text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  Você ainda não trouxe nenhum caso ao Laboratório.
                </p>
                <Button variant="outline" size="sm" onClick={() => setIsCreating(true)}>
                  Trazer primeiro caso
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {casos.map(caso => (
                <CasoCard 
                  key={caso.id} 
                  caso={caso} 
                  onClick={() => setActiveCaseId(caso.id)} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </CasaMaquinasLayout>
  );
}

function CasoCard({ caso, onClick }: { caso: CasoLaboratorio; onClick: () => void }) {
  const statusConfig = {
    rascunho: { label: 'Rascunho', color: 'bg-muted/50 text-muted-foreground' },
    analisado: { label: 'Analisado', color: 'bg-emerald-500/15 text-emerald-400' },
    arquivado: { label: 'Arquivado', color: 'bg-amber-500/10 text-amber-500/60' },
  };
  const config = statusConfig[caso.status];
  const data = new Date(caso.created_at).toLocaleDateString('pt-BR');

  return (
    <Card 
      onClick={onClick}
      className="cursor-pointer hover:border-primary/40 transition-colors group"
    >
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {caso.titulo}
          </h4>
          <Badge className={cn("text-[9px] uppercase tracking-wider shrink-0 border-none", config.color)}>
            {config.label}
          </Badge>
        </div>
        {caso.caso_texto && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {caso.caso_texto}
          </p>
        )}
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground/60">
          <span>{data}</span>
          {caso.analise_simbolica && (
            <span className="flex items-center gap-1 text-primary/60">
              <Sparkles className="w-3 h-3" /> Mentora analisou
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function NovoCasoForm({ onCancel, onCreated }: { onCancel: () => void; onCreated: (id: string) => void }) {
  const { user } = useAuth();
  const [modo, setModo] = useState<ModoEntrada>('texto_livre');
  const [titulo, setTitulo] = useState('');
  const [casoTexto, setCasoTexto] = useState('');
  const [falaCliente, setFalaCliente] = useState('');
  const [duvida, setDuvida] = useState('');
  const [jaTentou, setJaTentou] = useState('');
  const [clienteId, setClienteId] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  // Buscar clientes para modo vinculado
  const { data: clientes = [] } = useQuery({
    queryKey: ['terapeuta-clientes-lab', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('clientes')
        .select('id, nome, email')
        .eq('terapeuta_id', user.id);
      return (data || []) as Array<{ id: string; nome: string; email: string | null }>;
    },
    enabled: !!user && modo === 'cliente_vinculado',
  });

  const handleSubmit = async () => {
    if (!user || !titulo.trim()) {
      toast.error('Dê um título ao caso.');
      return;
    }

    setSalvando(true);
    const { data, error } = await supabase
      .from('co_laboratorio_casos')
      .insert({
        user_id: user.id,
        titulo: titulo.trim(),
        modo_entrada: modo,
        caso_texto: casoTexto || null,
        fala_cliente: falaCliente || null,
        duvida_terapeuta: duvida || null,
        ja_tentou: jaTentou || null,
        cliente_id: clienteId,
        status: 'rascunho',
      })
      .select()
      .single();

    setSalvando(false);

    if (error) {
      console.error(error);
      toast.error('Erro ao salvar caso.');
      return;
    }

    toast.success('Caso criado. Agora solicite a análise da Mentora.');
    onCreated(data.id);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" onClick={onCancel} className="gap-1">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Button>

      <Tabs value={modo} onValueChange={(v) => setModo(v as ModoEntrada)}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="texto_livre" className="gap-2 text-xs">
            <FileText className="w-3 h-3" /> Texto Livre
          </TabsTrigger>
          <TabsTrigger value="formulario" className="gap-2 text-xs">
            <ClipboardList className="w-3 h-3" /> Formulário
          </TabsTrigger>
          <TabsTrigger value="cliente_vinculado" className="gap-2 text-xs">
            <Users className="w-3 h-3" /> Cliente Real
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título do caso</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Cliente que repete padrão de fuga"
            />
          </div>

          <TabsContent value="texto_livre" className="space-y-4 m-0">
            <div className="space-y-2">
              <Label>Descreva o caso narrativamente</Label>
              <Textarea
                value={casoTexto}
                onChange={(e) => setCasoTexto(e.target.value)}
                placeholder="Conte como achar melhor: o contexto do cliente, o que vem aparecendo, o que te chama atenção, sua dúvida..."
                className="min-h-[200px]"
              />
            </div>
          </TabsContent>

          <TabsContent value="formulario" className="space-y-4 m-0">
            <div className="space-y-2">
              <Label>Contexto do caso</Label>
              <Textarea
                value={casoTexto}
                onChange={(e) => setCasoTexto(e.target.value)}
                placeholder="Quem é o cliente, há quanto tempo, queixa principal..."
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Fala do cliente</Label>
              <Textarea
                value={falaCliente}
                onChange={(e) => setFalaCliente(e.target.value)}
                placeholder="Uma frase ou trecho que ficou ressoando..."
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Sua dúvida ou dificuldade</Label>
              <Textarea
                value={duvida}
                onChange={(e) => setDuvida(e.target.value)}
                placeholder="O que você está tentando entender? Onde sente que travou?"
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label>O que você já tentou</Label>
              <Textarea
                value={jaTentou}
                onChange={(e) => setJaTentou(e.target.value)}
                placeholder="Intervenções, ferramentas, perguntas que já experimentou..."
                className="min-h-[80px]"
              />
            </div>
          </TabsContent>

          <TabsContent value="cliente_vinculado" className="space-y-4 m-0">
            <div className="space-y-2">
              <Label>Selecione um cliente vinculado</Label>
              {clientes.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="p-6 text-center text-sm text-muted-foreground">
                    Você ainda não tem clientes vinculados.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-2 max-h-64 overflow-y-auto">
                  {clientes.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setClienteId(c.id)}
                      className={cn(
                        "p-3 rounded-lg border text-left transition-all",
                        clienteId === c.id
                          ? "border-primary bg-primary/10"
                          : "border-border/40 hover:border-primary/30"
                      )}
                    >
                      <div className="font-medium text-sm">{c.nome}</div>
                      {c.email && <div className="text-xs text-muted-foreground">{c.email}</div>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Sua dúvida sobre este cliente</Label>
              <Textarea
                value={duvida}
                onChange={(e) => setDuvida(e.target.value)}
                placeholder="O que você está tentando entender no campo deste cliente?"
                className="min-h-[100px]"
              />
            </div>
          </TabsContent>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={salvando} className="flex-1 gap-2">
              {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Salvar Caso
            </Button>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

function CasoDetalhe({ caso, onBack, onUpdate }: { caso: CasoLaboratorio; onBack: () => void; onUpdate: () => void }) {
  const [analisando, setAnalisando] = useState(false);

  const handleAnalisar = async () => {
    setAnalisando(true);
    try {
      const { data, error } = await supabase.functions.invoke('mentora-clinica', {
        body: { caso },
      });

      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        return;
      }

      // Atualizar caso com análise
      await supabase
        .from('co_laboratorio_casos')
        .update({
          analise_simbolica: data.analise_simbolica,
          perguntas_sugeridas: data.perguntas_sugeridas,
          riscos_eticos: data.riscos_eticos,
          simulacao_cliente: data.simulacao_cliente,
          ferramenta_sugerida: data.ferramenta_sugerida,
          status: 'analisado',
        })
        .eq('id', caso.id);

      toast.success('Mentora concluiu a supervisão.');
      onUpdate();
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'Erro ao consultar Mentora IA.');
    } finally {
      setAnalisando(false);
    }
  };

  const handleArquivar = async () => {
    await supabase
      .from('co_laboratorio_casos')
      .update({ status: 'arquivado' })
      .eq('id', caso.id);
    toast.success('Caso arquivado.');
    onUpdate();
    onBack();
  };

  const handleApagar = async () => {
    if (!confirm('Apagar este caso permanentemente?')) return;
    await supabase
      .from('co_laboratorio_casos')
      .delete()
      .eq('id', caso.id);
    toast.success('Caso apagado.');
    onUpdate();
    onBack();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
          <ArrowLeft className="w-4 h-4" /> Voltar aos casos
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleArquivar} className="text-muted-foreground">
            Arquivar
          </Button>
          <Button variant="ghost" size="sm" onClick={handleApagar} className="text-destructive gap-1">
            <Trash2 className="w-3 h-3" /> Apagar
          </Button>
        </div>
      </div>

      {/* Conteúdo do caso */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <FileText className="w-3 h-3" /> Caso trazido por você
          </div>
          {caso.caso_texto && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Contexto</p>
              <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">{caso.caso_texto}</p>
            </div>
          )}
          {caso.fala_cliente && (
            <div className="border-l-2 border-primary/30 pl-4">
              <p className="text-xs text-muted-foreground mb-1">Fala do cliente</p>
              <p className="text-sm italic text-foreground/80">"{caso.fala_cliente}"</p>
            </div>
          )}
          {caso.duvida_terapeuta && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Sua dúvida</p>
              <p className="text-sm text-foreground/80">{caso.duvida_terapeuta}</p>
            </div>
          )}
          {caso.ja_tentou && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">O que já tentou</p>
              <p className="text-sm text-foreground/80">{caso.ja_tentou}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Análise da Mentora */}
      {!caso.analise_simbolica ? (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Solicitar supervisão da Mentora IA</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                A Mentora vai oferecer leitura simbólica, perguntas-chave, riscos éticos e simulação do campo.
              </p>
            </div>
            <Button onClick={handleAnalisar} disabled={analisando} className="gap-2">
              {analisando ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Mentora analisando...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Solicitar análise</>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
            <Sparkles className="w-3 h-3" /> Supervisão da Mentora
          </div>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary/70">
                <Compass className="w-3 h-3" /> Análise Simbólica
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed">{caso.analise_simbolica}</p>
            </CardContent>
          </Card>

          {caso.perguntas_sugeridas && caso.perguntas_sugeridas.length > 0 && (
            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  <MessageCircle className="w-3 h-3" /> Perguntas para a próxima sessão
                </div>
                <ul className="space-y-2">
                  {caso.perguntas_sugeridas.map((p, i) => (
                    <li key={i} className="flex gap-3 text-sm text-foreground/85">
                      <span className="text-emerald-400 font-bold shrink-0">{i + 1}.</span>
                      <span className="italic">"{p}"</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {caso.riscos_eticos && (
            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardContent className="p-6 space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-400">
                  <AlertTriangle className="w-3 h-3" /> Riscos Éticos / Contratransferência
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed">{caso.riscos_eticos}</p>
              </CardContent>
            </Card>
          )}

          {caso.simulacao_cliente && (
            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardContent className="p-6 space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-400">
                  <Eye className="w-3 h-3" /> Simulação do Campo
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line">{caso.simulacao_cliente}</p>
              </CardContent>
            </Card>
          )}

          {caso.ferramenta_sugerida && (
            <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
              <CardContent className="p-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Wrench className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Ferramenta Sugerida</p>
                    <p className="text-base font-medium text-foreground">{caso.ferramenta_sugerida}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button variant="outline" onClick={handleAnalisar} disabled={analisando} className="w-full gap-2">
            {analisando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Solicitar nova leitura
          </Button>
        </div>
      )}
    </div>
  );
}
