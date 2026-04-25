// ============================================
// ADMIN TAB - CLUBE DO LIVRO ORACULAR
// ============================================

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription 
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, Plus, Pencil, Trash2, ChevronDown, ChevronUp,
  Sparkles, Headphones, Video, FileText, Calendar, Loader2, GraduationCap, DoorOpen, Target, EyeOff,
  Users, CreditCard, Map as MapIcon
} from 'lucide-react';
import { FaseEditorExpandido } from './clube-livro';
import { ClubePlaybookGenerator } from './clube-livro/ClubePlaybookGenerator';
import { PortasManager } from './clube-livro/PortasManager';
import { LabConfigManager } from './clube-livro/LabConfigManager';
import { RotaDoLivroEditor } from './clube-livro/RotaDoLivroEditor';
import { AulaBlocosEditor, type AulaBloco } from './clube-livro/AulaBlocosEditor';
import { AudioUpload } from './AudioUpload';
import { CALENDARIO_ANUAL, SEMANAS_PADRAO } from '@/constants/clubeLivroCalendario';




interface Ciclo {
  id: string;
  titulo: string;
  subtitulo?: string;
  autor_livro?: string;
  capa_url?: string;
  por_que_este_livro?: string;
  como_ler?: string;
  manifesto?: string;
  ordem: number;
  ativo: boolean;
  publicado: boolean;
  portal_minimo: string;
  // New clinical fields
  tema_simbolico?: string;
  orientacao_clinica_uso?: string;
  orientacao_clinica_evitar?: string;
  orientacao_clinica_riscos?: string;
  orientacao_clinica_indicado?: string;
  orientacao_clinica_contraindicado?: string;
  ritual_aceite_obrigatorio?: boolean;
  portal_minimo_clinico?: string;
  campo_simbolico?: string;
  mensagem_campo_url?: string;
  mensagem_campo_texto?: string;
  por_que_slides?: any[];
  por_que_audio_url?: string;
  como_ler_slides?: any[];
  como_ler_audio_url?: string;
}

interface Fase {
  id: string;
  ciclo_id: string;
  titulo: string;
  descricao?: string;
  icone?: string;
  ordem: number;
  ativo: boolean;
  tipo_fase?: string;
  orientacao_curta?: string;
  // New week-based structure fields
  numero_semana?: number;
  leitura_orientada?: string;
  alerta_clinico?: string;
  observacao_clinica?: string;
  lista_uso_inadequado?: string[];
  ponte_sala_id?: string;
  ponte_sala_texto?: string;
  texto_fechamento?: string;
}

interface Pergunta {
  id: string;
  fase_id: string;
  texto_pergunta: string;
  ordem: number;
  ativo: boolean;
}

interface Escuta {
  id: string;
  ciclo_id: string;
  fase_id?: string;
  titulo: string;
  descricao?: string;
  tipo: 'audio' | 'texto';
  audio_url?: string;
  texto_conteudo?: string;
  duracao_segundos?: number;
  ordem: number;
  ativo: boolean;
}

interface Encontro {
  id: string;
  ciclo_id: string;
  titulo: string;
  descricao?: string;
  orientacao_encontro?: string;
  data_encontro?: string;
  link_ao_vivo?: string;
  replay_url?: string;
  ativo: boolean;
}

export function AdminClubeLivroTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCiclo, setSelectedCiclo] = useState<string | null>(null);
  const [cicloDialogOpen, setCicloDialogOpen] = useState(false);
  const [editingCiclo, setEditingCiclo] = useState<Ciclo | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  // Fetch ciclos
  const { data: ciclos, isLoading } = useQuery({
    queryKey: ['admin-clube-ciclos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_ciclos')
        .select('*')
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as Ciclo[];
    },
  });

  // Create/Update ciclo
  const saveCiclo = useMutation({
    mutationFn: async (ciclo: Partial<Ciclo>) => {
      const payload = {
        titulo: ciclo.titulo,
        subtitulo: ciclo.subtitulo,
        autor_livro: ciclo.autor_livro,
        capa_url: ciclo.capa_url,
        infografico_url: (ciclo as any).infografico_url || null,
        por_que_este_livro: ciclo.por_que_este_livro,
        como_ler: ciclo.como_ler,
        manifesto: ciclo.manifesto,
        publicado: ciclo.publicado,
        is_multipolar: (ciclo as any).is_multipolar ?? false,
        campo_simbolico: (ciclo as any).campo_simbolico || null,
        mensagem_campo_url: (ciclo as any).mensagem_campo_url || null,
        mensagem_campo_texto: (ciclo as any).mensagem_campo_texto || null,
        por_que_slides: (ciclo as any).por_que_slides || [],
        por_que_audio_url: (ciclo as any).por_que_audio_url || null,
        como_ler_slides: (ciclo as any).como_ler_slides || [],
        como_ler_audio_url: (ciclo as any).como_ler_audio_url || null,
      };
      
      if (ciclo.id) {
        const { error } = await supabase
          .from('clube_livro_ciclos')
          .update(payload)
          .eq('id', ciclo.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('clube_livro_ciclos')
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-ciclos'] });
      setCicloDialogOpen(false);
      setEditingCiclo(null);
      toast({ title: 'Ciclo salvo com sucesso' });
    },
    onError: () => {
      toast({ title: 'Erro ao salvar ciclo', variant: 'destructive' });
    },
  });

  // Delete ciclo
  const deleteCiclo = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clube_livro_ciclos')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-ciclos'] });
      if (selectedCiclo) setSelectedCiclo(null);
      toast({ title: 'Ciclo removido' });
    },
  });

  const handleNewCiclo = () => {
    setEditingCiclo(null);
    setCicloDialogOpen(true);
  };

  const handleEditCiclo = (ciclo: Ciclo) => {
    setEditingCiclo(ciclo);
    setCicloDialogOpen(true);
  };

  // ============================================
  // Importação em Massa - 12 Ciclos do Calendário
  // ============================================
  const importarCalendario = useMutation({
    mutationFn: async () => {
      // 1. Buscar ciclos existentes para evitar duplicatas
      const { data: ciclosExistentes } = await supabase
        .from('clube_livro_ciclos')
        .select('titulo');
      
      const titulosExistentes = new Set(ciclosExistentes?.map(c => c.titulo) || []);
      
      // 2. Filtrar apenas ciclos que não existem
      const ciclosParaCriar = CALENDARIO_ANUAL.filter(
        c => !titulosExistentes.has(c.titulo)
      );
      
      if (ciclosParaCriar.length === 0) {
        throw new Error('Todos os 12 ciclos já estão cadastrados.');
      }
      
      // 3. Inserir os ciclos
      const ciclosPayload = ciclosParaCriar.map(c => ({
        titulo: c.titulo,
        autor_livro: c.autor,
        tema_simbolico: c.tema,
        ordem: c.ordem,
        publicado: false,
        ativo: c.ordem === 1, // Primeiro ciclo ativo
        orientacao_clinica_uso: c.orientacao_clinica_uso || null,
        orientacao_clinica_evitar: c.orientacao_clinica_evitar || null,
        orientacao_clinica_riscos: c.orientacao_clinica_riscos || null,
      }));
      
      const { data: novosCiclos, error: ciclosError } = await supabase
        .from('clube_livro_ciclos')
        .insert(ciclosPayload)
        .select('id, ordem');
      
      if (ciclosError) throw ciclosError;
      
      // 4. Para cada ciclo criado, gerar as 4 semanas padrão
      if (novosCiclos && novosCiclos.length > 0) {
        const fasesPayload = novosCiclos.flatMap(ciclo => 
          SEMANAS_PADRAO.map(semana => ({
            ciclo_id: ciclo.id,
            titulo: semana.titulo,
            tipo_fase: semana.tipo_fase,
            descricao: semana.descricao,
            numero_semana: semana.numero_semana,
            alerta_clinico: semana.alerta_clinico,
            ordem: semana.numero_semana,
            ativo: true,
          }))
        );
        
        const { error: fasesError } = await supabase
          .from('clube_livro_fases')
          .insert(fasesPayload);
        
        if (fasesError) throw fasesError;
      }
      
      return { ciclosCriados: novosCiclos?.length || 0 };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-ciclos'] });
      setImportDialogOpen(false);
      toast({ 
        title: 'Calendário importado com sucesso!',
        description: `${data.ciclosCriados} ciclos criados com 4 semanas cada.`,
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro na importação', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-display text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gold" />
            Círculos de Leitura Simbólica
          </h2>
          <p className="text-sm text-muted-foreground">
            Ciclos, portais e configurações do Clube.
          </p>
        </div>
      </div>

      {/* Abas simplificadas para Produção de Conteúdo */}
      <Tabs defaultValue="rota" className="w-full">
        <TabsList className="mb-4 flex-wrap h-auto gap-1 bg-muted/30 p-1 border border-primary/5">
          <TabsTrigger value="rota" className="gap-2 text-xs py-1.5 data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
            <Map className="w-4 h-4" />
            Rota do Livro
          </TabsTrigger>
          <TabsTrigger value="conteudo" className="gap-2 text-xs py-1.5 data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
            <Sparkles className="w-4 h-4" />
            Produzir Conteúdo
          </TabsTrigger>
          <TabsTrigger value="calendario" className="gap-2 text-xs py-1.5 data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
            <Calendar className="w-4 h-4" />
            Calendário & Ciclos
          </TabsTrigger>
          <TabsTrigger value="portais" className="gap-2 text-xs py-1.5 data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
            <DoorOpen className="w-4 h-4" />
            Portais
          </TabsTrigger>
        </TabsList>

        {/* ============================================ */}
        {/* ABA 1 — PRODUZIR CONTEÚDO (CONSOLIDADA)     */}
        {/* ============================================ */}
        <TabsContent value="conteudo" className="space-y-4 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="md:col-span-1 border-primary/10 bg-muted/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gold">Ciclo em Foco</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  value={selectedCiclo || ''}
                  onValueChange={(v) => setSelectedCiclo(v || null)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Escolha um ciclo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ciclos?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.titulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedCiclo && (
                  <div className="pt-4 space-y-2">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Ações Rápidas</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start gap-2 text-xs"
                      onClick={() => {
                        const c = ciclos?.find(x => x.id === selectedCiclo);
                        if (c) handleEditCiclo(c);
                      }}
                    >
                      <Pencil className="w-3 h-3" /> Editar Capa/Info
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start gap-2 text-xs"
                      onClick={() => {
                        const c = ciclos?.find(x => x.id === selectedCiclo);
                        if (c) {
                          const updated = { ...c, publicado: !c.publicado };
                          saveCiclo.mutate(updated);
                        }
                      }}
                    >
                      {ciclos?.find(x => x.id === selectedCiclo)?.publicado ? (
                        <><EyeOff className="w-3 h-3" /> Despublicar</>
                      ) : (
                        <><Sparkles className="w-3 h-3" /> Publicar Ciclo</>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="md:col-span-3">
              {selectedCiclo ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-gold/5 p-3 rounded-lg border border-gold/10">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-gold" />
                      <h3 className="text-lg font-display text-gold">Editor: {ciclos?.find(c => c.id === selectedCiclo)?.titulo}</h3>
                    </div>
                    <Badge variant="outline" className="text-[10px] border-gold/30 text-gold uppercase tracking-widest">
                      {ciclos?.find(c => c.id === selectedCiclo)?.publicado ? 'Público' : 'Rascunho'}
                    </Badge>
                  </div>
                  <CicloDetailTabs cicloId={selectedCiclo} />
                </div>
              ) : (
                <div className="space-y-6">
                  <Card className="bg-muted/30 border-dashed h-[200px] flex items-center justify-center">
                    <div className="text-center p-6">
                      <Sparkles className="w-10 h-10 text-gold/30 mx-auto mb-3" />
                      <p className="text-muted-foreground">Selecione um ciclo à esquerda para começar a criar.</p>
                    </div>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-primary/10 bg-card/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Users className="w-4 h-4 text-gold" />
                          Gestão de Alunas
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-xs text-muted-foreground mb-3">Gerencie matrículas e acesso à formação.</p>
                        <Button variant="outline" size="sm" className="w-full justify-start text-xs" onClick={() => (window as any).Admin_SetActiveTab?.('matriculas')}>
                          Ver Matrículas
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-primary/10 bg-card/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gold" />
                          Assinaturas
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-xs text-muted-foreground mb-3">Controle de pagamentos e planos ativos.</p>
                        <Button variant="outline" size="sm" className="w-full justify-start text-xs" onClick={() => (window as any).Admin_SetActiveTab?.('assinaturas')}>
                          Ver Assinaturas
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ============================================ */}
        {/* ABA — CALENDÁRIO & CICLOS (GERENCIAMENTO)   */}
        {/* ============================================ */}
        <TabsContent value="calendario" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm text-muted-foreground">
              {ciclos?.length || 0} ciclo(s) cadastrado(s)
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setImportDialogOpen(true)} 
                className="gap-2"
              >
                <Calendar className="w-4 h-4" />
                Importar Calendário Anual
              </Button>
              <Button onClick={handleNewCiclo} className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Ciclo
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-20 bg-muted rounded" />
              <div className="h-20 bg-muted rounded" />
            </div>
          ) : ciclos && ciclos.length > 0 ? (
            <div className="space-y-4">
              {ciclos.map((ciclo) => (
                <CicloCard
                  key={ciclo.id}
                  ciclo={ciclo}
                  isExpanded={selectedCiclo === ciclo.id}
                  onToggle={() => setSelectedCiclo(selectedCiclo === ciclo.id ? null : ciclo.id)}
                  onEdit={() => handleEditCiclo(ciclo)}
                  onDelete={() => deleteCiclo.mutate(ciclo.id)}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="py-8 text-center">
                <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Nenhum ciclo cadastrado.</p>
                <div className="flex justify-center gap-2 mt-4">
                  <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Importar 12 Ciclos
                  </Button>
                  <Button variant="ghost" onClick={handleNewCiclo}>
                    Criar manualmente
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ============================================ */}
        {/* ABA 3 — PORTAIS                             */}
        {/* ============================================ */}
        <TabsContent value="portais" className="space-y-4">
          <Card className="bg-muted/20 border-gold/20">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <DoorOpen className="w-4 h-4 text-gold" />
                <span className="text-xs uppercase tracking-widest text-gold font-medium">
                  Portais por Ciclo
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Selecione um ciclo abaixo para gerenciar seus portais. Todo portal deve estar vinculado a um ciclo e a uma jornada.
              </p>
            </CardContent>
          </Card>

          {/* Filtro por ciclo */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Filtrar por Ciclo</Label>
            <Select
              value={selectedCiclo || ''}
              onValueChange={(v) => setSelectedCiclo(v || null)}
            >
              <SelectTrigger className="w-full sm:w-80">
                <SelectValue placeholder="Selecione um ciclo..." />
              </SelectTrigger>
              <SelectContent>
                {ciclos?.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.titulo} {c.autor_livro ? `— ${c.autor_livro}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCiclo ? (
            <PortasManager cicloId={selectedCiclo} />
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <DoorOpen className="w-8 h-8 mx-auto mb-3 opacity-40" />
              Selecione um ciclo para ver e gerenciar os portais.
            </div>
          )}
        </TabsContent>

        {/* ============================================ */}
        {/* ABA — CONFIGURAÇÕES GERAIS                  */}
        {/* ============================================ */}
        <TabsContent value="config" className="space-y-4">
          <Card className="border-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-gold" />
                Regras de Progressão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>🌑 <strong>Portal</strong> — sempre aberto</p>
              <p>🌒 <strong>Travessia</strong> — aberta</p>
              <p>🌓 <strong>Escuta</strong> — desbloqueia após 30% da Travessia</p>
              <p>🌔 <strong>Laboratório</strong> — desbloqueia após 70% da Travessia</p>
              <p>🌕 <strong>Registro</strong> — desbloqueia após Laboratório concluído</p>
              <p>✨ <strong>Integração</strong> — desbloqueia após Registro salvo</p>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-gold" />
                Níveis de Acesso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>👁 <strong>Visitante</strong> — página institucional, Mapa do Ano, Mensagem do Campo</p>
              <p>📖 <strong>Assinante</strong> — travessia do livro ativo + Lab 80/20 da estação atual</p>
              <p>🎓 <strong>Aluna/Formação</strong> — acesso irrestrito a estações, laboratórios e ferramentas</p>
            </CardContent>
          </Card>

          <Card className="bg-muted/20 border-gold/20">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="text-xs uppercase tracking-widest text-gold font-medium">
                  Governança do Clube
                </span>
              </div>
              <p className="text-sm font-medium text-foreground mb-2">
                Este não é um calendário de leitura.
              </p>
              <p className="text-sm text-muted-foreground">
                É um mapa de travessia formativa. Cada livro existe para desenvolver uma habilidade simbólica,
                fortalecer a prática profissional e ampliar a capacidade de sustentar processos — em si e no outro.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para criar/editar ciclo */}
      <CicloDialog
        open={cicloDialogOpen}
        onOpenChange={setCicloDialogOpen}
        ciclo={editingCiclo}
        onSave={(data) => saveCiclo.mutate(data)}
        isLoading={saveCiclo.isPending}
      />

      {/* Dialog para importação em massa */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gold" />
              Importar Calendário Anual
            </DialogTitle>
            <DialogDescription>
              Esta ação irá criar os 12 ciclos do calendário oficial do Clube do Livro Oracular,
              cada um com 4 semanas estruturadas (Chamado, Ruptura, Reorganização, Integração).
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-muted/50 rounded-lg p-4 max-h-60 overflow-y-auto">
              <p className="text-xs text-muted-foreground mb-3">Ciclos que serão criados:</p>
              <div className="space-y-2">
                {CALENDARIO_ANUAL.map((c) => (
                  <div key={c.ordem} className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="text-xs shrink-0">
                      {c.ordem}
                    </Badge>
                    <span className="font-medium truncate">{c.titulo}</span>
                    <span className="text-muted-foreground text-xs truncate">— {c.autor}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <ul className="list-disc list-inside space-y-1">
                <li>Ciclos existentes serão mantidos (sem duplicatas)</li>
                <li>Todos serão criados como <strong>rascunho</strong></li>
                <li>O primeiro ciclo será marcado como <strong>ativo</strong></li>
                <li>Cada ciclo terá 4 semanas com alertas clínicos</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => importarCalendario.mutate()}
              disabled={importarCalendario.isPending}
              className="gap-2"
            >
              {importarCalendario.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Importando...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  Confirmar Importação
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

}


// ============================================
// CicloCard Component
// ============================================
function CicloCard({
  ciclo,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
}: {
  ciclo: Ciclo;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className={isExpanded ? 'border-gold/50' : ''}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            {ciclo.capa_url ? (
              <img src={ciclo.capa_url} alt="" className="w-12 h-16 object-cover rounded" />
            ) : (
              <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base truncate">{ciclo.titulo}</CardTitle>
                {ciclo.publicado ? (
                  <Badge className="bg-green-500/20 text-green-400">Publicado</Badge>
                ) : (
                  <Badge variant="outline">Rascunho</Badge>
                )}
              </div>
              {ciclo.autor_livro && (
                <CardDescription className="text-sm">{ciclo.autor_livro}</CardDescription>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button size="sm" variant="ghost" onClick={onEdit}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onDelete} className="text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onToggle}>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-4 border-t">
          <CicloDetailTabs cicloId={ciclo.id} />
        </CardContent>
      )}
    </Card>
  );
}

// ============================================
// CicloDetailTabs - Fases, Escutas, Encontros, Aulas
// ============================================
function CicloDetailTabs({ cicloId }: { cicloId: string }) {
  return (
    <Tabs defaultValue="fases" className="w-full">
      <TabsList className="grid w-full grid-cols-7">
        <TabsTrigger value="fases" className="gap-1 text-xs">
          <Sparkles className="w-3 h-3" />
          Fases
        </TabsTrigger>
        <TabsTrigger value="portas" className="gap-1 text-xs">
          <DoorOpen className="w-3 h-3" />
          Portas
        </TabsTrigger>
        <TabsTrigger value="aulas" className="gap-1 text-xs">
          <GraduationCap className="w-3 h-3" />
          Aulas
        </TabsTrigger>
        <TabsTrigger value="escutas" className="gap-1 text-xs">
          <Headphones className="w-3 h-3" />
          Escutas
        </TabsTrigger>
        <TabsTrigger value="encontros" className="gap-1 text-xs">
          <Video className="w-3 h-3" />
          Encontros
        </TabsTrigger>
        <TabsTrigger value="lab8020" className="gap-1 text-xs">
          <Target className="w-3 h-3" />
          Lab 80/20
        </TabsTrigger>
        <TabsTrigger value="playbook" className="gap-1 text-xs">
          <FileText className="w-3 h-3" />
          Playbook
        </TabsTrigger>
      </TabsList>
      <TabsContent value="fases" className="pt-4">
        <FasesManager cicloId={cicloId} />
      </TabsContent>
      <TabsContent value="portas" className="pt-4">
        <PortasManager cicloId={cicloId} />
      </TabsContent>
      <TabsContent value="aulas" className="pt-4">
        <AulasManager cicloId={cicloId} />
      </TabsContent>
      <TabsContent value="escutas" className="pt-4">
        <EscutasManager cicloId={cicloId} />
      </TabsContent>
      <TabsContent value="encontros" className="pt-4">
        <EncontrosManager cicloId={cicloId} />
      </TabsContent>
      <TabsContent value="lab8020" className="pt-4">
        <LabConfigManager cicloId={cicloId} />
      </TabsContent>
      <TabsContent value="playbook" className="pt-4">
        <ClubePlaybookGenerator cicloId={cicloId} />
      </TabsContent>
    </Tabs>
  );
}

// ============================================
// FasesManager
// ============================================
function FasesManager({ cicloId }: { cicloId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newFaseTitulo, setNewFaseTitulo] = useState('');
  const [expandedFase, setExpandedFase] = useState<string | null>(null);

  const { data: fases, isLoading } = useQuery({
    queryKey: ['admin-clube-fases', cicloId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_fases')
        .select('*')
        .eq('ciclo_id', cicloId)
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as Fase[];
    },
  });

  const addFase = useMutation({
    mutationFn: async () => {
      if (!newFaseTitulo.trim()) return;
      const ordem = (fases?.length || 0) + 1;
      const { error } = await supabase
        .from('clube_livro_fases')
        .insert({ ciclo_id: cicloId, titulo: newFaseTitulo, ordem });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-fases', cicloId] });
      setNewFaseTitulo('');
      toast({ title: 'Fase adicionada' });
    },
  });

  // Generate standard 4 weeks (semanas)
  const gerarFasesPadrao = useMutation({
    mutationFn: async () => {
      const fasesExistentes = fases?.length || 0;
      const fasesPadrao = [
        { 
          ciclo_id: cicloId, 
          titulo: 'O Arquétipo Não É a Cliente', 
          tipo_fase: 'chamado', 
          descricao: 'Início da jornada - diferença entre símbolo e identidade', 
          ordem: fasesExistentes + 1,
          numero_semana: 1,
        },
        { 
          ciclo_id: cicloId, 
          titulo: 'O Risco da Projeção da Facilitadora', 
          tipo_fase: 'ruptura', 
          descricao: 'Momento de crise ou desorganização interna', 
          ordem: fasesExistentes + 2,
          numero_semana: 2,
        },
        { 
          ciclo_id: cicloId, 
          titulo: 'Quando Não Usar um Conto', 
          tipo_fase: 'reorganizacao', 
          descricao: 'Uso inadequado e contraindicações', 
          ordem: fasesExistentes + 3,
          numero_semana: 3,
        },
        { 
          ciclo_id: cicloId, 
          titulo: 'Integração e Fechamento', 
          tipo_fase: 'integracao', 
          descricao: 'Consolidação e encerramento do ciclo', 
          ordem: fasesExistentes + 4,
          numero_semana: 4,
        },
      ];
      
      const { error } = await supabase
        .from('clube_livro_fases')
        .insert(fasesPadrao);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-fases', cicloId] });
      toast({ title: '4 semanas padrão criadas' });
    },
    onError: () => {
      toast({ title: 'Erro ao criar semanas', variant: 'destructive' });
    },
  });

  const deleteFase = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clube_livro_fases').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-fases', cicloId] });
      toast({ title: 'Fase removida' });
    },
  });



  return (
    <div className="space-y-4">
      {/* Generate standard weeks button */}
      <div className="flex gap-2 items-center">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => gerarFasesPadrao.mutate()}
          disabled={gerarFasesPadrao.isPending}
          className="text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          Gerar 4 Semanas Padrão
        </Button>
        <span className="text-xs text-muted-foreground">
          (Estrutura canônica do Clube)
        </span>
      </div>

      {/* Add fase manually */}
      <div className="flex gap-2">
        <Input
          placeholder="Nome da nova fase..."
          value={newFaseTitulo}
          onChange={(e) => setNewFaseTitulo(e.target.value)}
          className="flex-1"
        />
        <Button onClick={() => addFase.mutate()} disabled={addFase.isPending || !newFaseTitulo.trim()}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Lista de fases */}
      {isLoading ? (
        <div className="animate-pulse h-16 bg-muted rounded" />
      ) : fases && fases.length > 0 ? (
        <div className="space-y-2">
          {fases.map((fase, i) => (
            <div key={fase.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs">
                    {i + 1}
                  </span>
                  <span className="font-medium text-sm">{fase.titulo}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setExpandedFase(expandedFase === fase.id ? null : fase.id)}
                  >
                    {expandedFase === fase.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteFase.mutate(fase.id)} className="text-destructive">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              {expandedFase === fase.id && (
                <div className="mt-3 pt-3 border-t">
                  <FaseEditorExpandido faseId={fase.id} cicloId={cicloId} />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          Nenhuma fase cadastrada.
        </p>
      )}
    </div>
  );
}

// ============================================
// PerguntasManager
// ============================================
function PerguntasManager({ faseId }: { faseId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newPergunta, setNewPergunta] = useState('');

  const { data: perguntas, isLoading } = useQuery({
    queryKey: ['admin-clube-perguntas', faseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_perguntas')
        .select('*')
        .eq('fase_id', faseId)
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as Pergunta[];
    },
  });

  const addPergunta = useMutation({
    mutationFn: async () => {
      if (!newPergunta.trim()) return;
      const ordem = (perguntas?.length || 0) + 1;
      const { error } = await supabase
        .from('clube_livro_perguntas')
        .insert({ fase_id: faseId, texto_pergunta: newPergunta, ordem });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-perguntas', faseId] });
      setNewPergunta('');
      toast({ title: 'Pergunta adicionada' });
    },
  });

  const deletePergunta = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clube_livro_perguntas').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-perguntas', faseId] });
    },
  });

  return (
    <div className="space-y-3">
      <Label className="text-xs text-muted-foreground">Perguntas Oraculares</Label>

      {isLoading ? (
        <div className="animate-pulse h-8 bg-muted/50 rounded" />
      ) : perguntas && perguntas.length > 0 ? (
        <div className="space-y-2">
          {perguntas.map((p, i) => (
            <div key={p.id} className="flex items-start gap-2 text-sm bg-muted/30 p-2 rounded">
              <span className="text-xs text-muted-foreground pt-0.5">{i + 1}.</span>
              <span className="flex-1">{p.texto_pergunta}</span>
              <Button size="sm" variant="ghost" onClick={() => deletePergunta.mutate(p.id)} className="h-6 w-6 p-0 text-destructive">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex gap-2">
        <Textarea
          placeholder="Nova pergunta oracular..."
          value={newPergunta}
          onChange={(e) => setNewPergunta(e.target.value)}
          className="min-h-[60px] text-sm"
        />
        <Button size="sm" onClick={() => addPergunta.mutate()} disabled={addPergunta.isPending || !newPergunta.trim()}>
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

// ============================================
// EscutasManager
// ============================================
function EscutasManager({ cicloId }: { cicloId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: escutas, isLoading } = useQuery({
    queryKey: ['admin-clube-escutas', cicloId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_escutas')
        .select('*')
        .eq('ciclo_id', cicloId)
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as Escuta[];
    },
  });

  const deleteEscuta = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clube_livro_escutas').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-escutas', cicloId] });
      toast({ title: 'Escuta removida' });
    },
  });

  return (
    <div className="space-y-4">
      <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
        <Plus className="w-3 h-3 mr-1" />
        Adicionar Escuta
      </Button>

      {isLoading ? (
        <div className="animate-pulse h-16 bg-muted rounded" />
      ) : escutas && escutas.length > 0 ? (
        <div className="space-y-2">
          {escutas.map((e) => (
            <div key={e.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {e.tipo === 'audio' ? (
                  <Headphones className="w-4 h-4 text-gold" />
                ) : (
                  <FileText className="w-4 h-4 text-gold" />
                )}
                <div>
                  <p className="text-sm font-medium">{e.titulo}</p>
                  <p className="text-xs text-muted-foreground">{e.tipo === 'audio' ? 'Áudio' : 'Texto'}</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => deleteEscuta.mutate(e.id)} className="text-destructive">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          Nenhuma escuta cadastrada.
        </p>
      )}

      <EscutaDialog cicloId={cicloId} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

// ============================================
// EncontrosManager
// ============================================
function EncontrosManager({ cicloId }: { cicloId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: encontros, isLoading } = useQuery({
    queryKey: ['admin-clube-encontros', cicloId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_encontros')
        .select('*')
        .eq('ciclo_id', cicloId)
        .order('data_encontro', { ascending: true });

      if (error) throw error;
      return data as Encontro[];
    },
  });

  const deleteEncontro = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clube_livro_encontros').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-encontros', cicloId] });
      toast({ title: 'Encontro removido' });
    },
  });

  return (
    <div className="space-y-4">
      <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
        <Plus className="w-3 h-3 mr-1" />
        Adicionar Encontro
      </Button>

      {isLoading ? (
        <div className="animate-pulse h-16 bg-muted rounded" />
      ) : encontros && encontros.length > 0 ? (
        <div className="space-y-2">
          {encontros.map((e) => (
            <div key={e.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Video className="w-4 h-4 text-gold" />
                <div>
                  <p className="text-sm font-medium">{e.titulo}</p>
                  {e.data_encontro && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(e.data_encontro).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => deleteEncontro.mutate(e.id)} className="text-destructive">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          Nenhum encontro agendado.
        </p>
      )}

      <EncontroDialog cicloId={cicloId} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

// ============================================
// Dialogs
// ============================================
function CicloDialog({
  open,
  onOpenChange,
  ciclo,
  onSave,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ciclo: Ciclo | null;
  onSave: (data: Partial<Ciclo>) => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState({
    titulo: '',
    subtitulo: '',
    autor_livro: '',
    capa_url: '',
    infografico_url: '',
    por_que_este_livro: '',
    como_ler: '',
    manifesto: '',
    publicado: false,
    is_multipolar: false,
    campo_simbolico: '',
    mensagem_campo_url: '',
    mensagem_campo_texto: '',
    carga_horaria_base: 20,
    carga_horaria_ajuste: 0,
    por_que_slides_json: '[]',
    por_que_audio_url: '',
    como_ler_slides_json: '[]',
    como_ler_audio_url: '',
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open && ciclo) {
      setForm({
        titulo: ciclo.titulo || '',
        subtitulo: ciclo.subtitulo || '',
        autor_livro: ciclo.autor_livro || '',
        capa_url: ciclo.capa_url || '',
        infografico_url: (ciclo as any).infografico_url || '',
        por_que_este_livro: ciclo.por_que_este_livro || '',
        como_ler: ciclo.como_ler || '',
        manifesto: ciclo.manifesto || '',
        publicado: ciclo.publicado || false,
        is_multipolar: (ciclo as any).is_multipolar || false,
        campo_simbolico: (ciclo as any).campo_simbolico || '',
        mensagem_campo_url: (ciclo as any).mensagem_campo_url || '',
        mensagem_campo_texto: (ciclo as any).mensagem_campo_texto || '',
        carga_horaria_base: (ciclo as any).carga_horaria_base ?? 20,
        carga_horaria_ajuste: (ciclo as any).carga_horaria_ajuste ?? 0,
        por_que_slides_json: JSON.stringify(ciclo.por_que_slides || [], null, 2),
        por_que_audio_url: ciclo.por_que_audio_url || '',
        como_ler_slides_json: JSON.stringify(ciclo.como_ler_slides || [], null, 2),
        como_ler_audio_url: ciclo.como_ler_audio_url || '',
      });
    } else if (open) {
      setForm({
        titulo: '',
        subtitulo: '',
        autor_livro: '',
        capa_url: '',
        infografico_url: '',
        por_que_este_livro: '',
        como_ler: '',
        manifesto: '',
        publicado: false,
        is_multipolar: false,
        campo_simbolico: '',
        mensagem_campo_url: '',
        mensagem_campo_texto: '',
        carga_horaria_base: 20,
        carga_horaria_ajuste: 0,
        por_que_slides_json: '[]',
        por_que_audio_url: '',
        como_ler_slides_json: '[]',
        como_ler_audio_url: '',
      });
    }
  }, [open, ciclo]);

  const handleSubmit = () => {
    if (!form.titulo.trim()) return;
    let porQueSlides = [];
    let comoLerSlides = [];
    try { porQueSlides = JSON.parse(form.por_que_slides_json); } catch {}
    try { comoLerSlides = JSON.parse(form.como_ler_slides_json); } catch {}
    
    onSave({
      ...form,
      carga_horaria_base: form.carga_horaria_base,
      carga_horaria_ajuste: form.carga_horaria_ajuste,
      por_que_slides: porQueSlides,
      por_que_audio_url: form.por_que_audio_url || undefined,
      como_ler_slides: comoLerSlides,
      como_ler_audio_url: form.como_ler_audio_url || undefined,
      ...(ciclo?.id ? { id: ciclo.id } : {}),
    } as any);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{ciclo ? 'Editar Ciclo' : 'Novo Ciclo'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Título do Livro *</Label>
              <Input
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Ex: A Heroína de Mil Faces"
              />
            </div>
            <div className="space-y-2">
              <Label>Autor</Label>
              <Input
                value={form.autor_livro}
                onChange={(e) => setForm({ ...form, autor_livro: e.target.value })}
                placeholder="Ex: Maria Tatar"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Subtítulo</Label>
            <Input
              value={form.subtitulo}
              onChange={(e) => setForm({ ...form, subtitulo: e.target.value })}
              placeholder="Opcional"
            />
          </div>

          <div className="space-y-2">
            <Label>URL da Capa do Livro</Label>
            <Input
              value={form.capa_url}
              onChange={(e) => setForm({ ...form, capa_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label>URL do Infográfico</Label>
            <Input
              value={form.infografico_url}
              onChange={(e) => setForm({ ...form, infografico_url: e.target.value })}
              placeholder="https://... (imagem do infográfico do livro)"
            />
            {form.infografico_url && (
              <img src={form.infografico_url} alt="Preview infográfico" className="max-h-40 rounded border border-border mt-2" />
            )}
          </div>

          <div className="space-y-2">
            <Label>Por que este livro está aqui (texto fallback)</Label>
            <Textarea
              value={form.por_que_este_livro}
              onChange={(e) => setForm({ ...form, por_que_este_livro: e.target.value })}
              placeholder="Texto explicando a escolha do livro..."
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Slides — "Por que este livro" (JSON)</Label>
            <Textarea
              value={form.por_que_slides_json}
              onChange={(e) => setForm({ ...form, por_que_slides_json: e.target.value })}
              placeholder={'[\n  { "titulo": "...", "frase_simbolica": "...", "image_url": "https://..." }\n]'}
              className="min-h-[100px] font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">Array JSON de 6-8 slides. Campos: titulo, frase_simbolica, image_url (todos opcionais).</p>
          </div>

          <div className="space-y-2">
            <Label>Áudio — "Por que este livro" (URL)</Label>
            <Input
              value={form.por_que_audio_url}
              onChange={(e) => setForm({ ...form, por_que_audio_url: e.target.value })}
              placeholder="https://... (URL do áudio MP3)"
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Como ler este livro (texto fallback)</Label>
            <Textarea
              value={form.como_ler}
              onChange={(e) => setForm({ ...form, como_ler: e.target.value })}
              placeholder="Orientações sobre a leitura..."
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Slides — "Como ler este livro" (JSON)</Label>
            <Textarea
              value={form.como_ler_slides_json}
              onChange={(e) => setForm({ ...form, como_ler_slides_json: e.target.value })}
              placeholder={'[\n  { "titulo": "...", "frase_simbolica": "...", "image_url": "https://..." }\n]'}
              className="min-h-[100px] font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">Array JSON de 6-8 slides. Campos: titulo, frase_simbolica, image_url (todos opcionais).</p>
          </div>

          <div className="space-y-2">
            <Label>Áudio — "Como ler este livro" (URL)</Label>
            <Input
              value={form.como_ler_audio_url}
              onChange={(e) => setForm({ ...form, como_ler_audio_url: e.target.value })}
              placeholder="https://... (URL do áudio MP3)"
            />
          </div>

          <div className="space-y-2">
            <Label>Manifesto (texto da apresentação)</Label>
            <Textarea
              value={form.manifesto}
              onChange={(e) => setForm({ ...form, manifesto: e.target.value })}
              placeholder="Texto-manifesto sobre o que é o clube..."
              className="min-h-[120px]"
            />
          </div>

          <Separator />

          {/* Carga Horária */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-semibold">
              <GraduationCap className="w-4 h-4 text-gold" />
              Carga Horária
            </Label>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Base (h)</Label>
                <Input
                  type="number"
                  value={form.carga_horaria_base}
                  onChange={(e) => setForm({ ...form, carga_horaria_base: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Ajuste (h)</Label>
                <Input
                  type="number"
                  value={form.carga_horaria_ajuste}
                  onChange={(e) => setForm({ ...form, carga_horaria_ajuste: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Total</Label>
                <div className="h-9 flex items-center px-3 rounded-md bg-muted text-sm font-medium">
                  {(form.carga_horaria_base || 0) + (form.carga_horaria_ajuste || 0)}h
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Campo Simbólico (Sala de Escuta)
            </Label>
            <Textarea
              value={form.campo_simbolico}
              onChange={(e) => setForm({ ...form, campo_simbolico: e.target.value })}
              placeholder="Texto do campo simbólico que será injetado como contexto na Sala de Escuta Simbólica ao conversar sobre este livro..."
              className="min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground">
              Este texto será enviado como contexto ao agente de IA quando a aluna clicar em "Conversar com o Livro".
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-primary" />
              Mensagem do Campo (Áudio semanal)
            </Label>
            <Input
              value={form.mensagem_campo_url}
              onChange={(e) => setForm({ ...form, mensagem_campo_url: e.target.value })}
              placeholder="URL do áudio da mensagem do campo..."
            />
          </div>

          <div className="space-y-2">
            <Label>Descrição da Mensagem do Campo</Label>
            <Textarea
              value={form.mensagem_campo_texto}
              onChange={(e) => setForm({ ...form, mensagem_campo_texto: e.target.value })}
              placeholder="Breve descrição ou orientação sobre a mensagem do campo desta semana..."
              className="min-h-[80px]"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.publicado}
                  onCheckedChange={(checked) => setForm({ ...form, publicado: checked })}
                />
                <Label>Publicado</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.is_multipolar}
                  onCheckedChange={(checked) => setForm({ ...form, is_multipolar: checked })}
                />
                <Label>Multipolar</Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !form.titulo.trim()}>
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EscutaDialog({ cicloId, open, onOpenChange }: { cicloId: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    titulo: '',
    tipo: 'audio' as 'audio' | 'podcast' | 'texto',
    audio_url: '',
    texto_conteudo: '',
  });

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('clube_livro_escutas').insert({
        ciclo_id: cicloId,
        ...form,
        ordem: 0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-escutas', cicloId] });
      onOpenChange(false);
      setForm({ titulo: '', tipo: 'audio', audio_url: '', texto_conteudo: '' });
      toast({ title: form.tipo === 'podcast' ? 'Podcast adicionado' : 'Escuta adicionada' });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Escuta</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Título *</Label>
            <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v as 'audio' | 'podcast' | 'texto' })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="audio">Áudio</SelectItem>
                <SelectItem value="podcast">Podcast</SelectItem>
                <SelectItem value="texto">Texto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(form.tipo === 'audio' || form.tipo === 'podcast') && (
            <AudioUpload
              value={form.audio_url}
              onChange={(url) => setForm({ ...form, audio_url: url })}
              folder="clube-livro/escutas"
              label={form.tipo === 'podcast' ? 'Arquivo do Podcast' : 'Arquivo de Áudio'}
            />
          )}
          {form.tipo === 'texto' && (
            <div className="space-y-2">
              <Label>Conteúdo</Label>
              <Textarea value={form.texto_conteudo} onChange={(e) => setForm({ ...form, texto_conteudo: e.target.value })} className="min-h-[120px]" />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={() => save.mutate()} disabled={save.isPending || !form.titulo.trim()}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EncontroDialog({ cicloId, open, onOpenChange }: { cicloId: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    titulo: '',
    data_encontro: '',
    link_ao_vivo: '',
    replay_url: '',
    orientacao_encontro: '',
  });

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('clube_livro_encontros').insert({
        ciclo_id: cicloId,
        ...form,
        data_encontro: form.data_encontro ? new Date(form.data_encontro).toISOString() : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-encontros', cicloId] });
      onOpenChange(false);
      setForm({ titulo: '', data_encontro: '', link_ao_vivo: '', replay_url: '', orientacao_encontro: '' });
      toast({ title: 'Encontro adicionado' });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Encontro</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Título *</Label>
            <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Data e Hora</Label>
            <Input type="datetime-local" value={form.data_encontro} onChange={(e) => setForm({ ...form, data_encontro: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Link Ao Vivo</Label>
            <Input value={form.link_ao_vivo} onChange={(e) => setForm({ ...form, link_ao_vivo: e.target.value })} placeholder="Ex: https://zoom.us/..." />
          </div>
          <div className="space-y-2">
            <Label>URL do Replay</Label>
            <Input value={form.replay_url} onChange={(e) => setForm({ ...form, replay_url: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Orientação para o Encontro</Label>
            <Textarea value={form.orientacao_encontro} onChange={(e) => setForm({ ...form, orientacao_encontro: e.target.value })} className="min-h-[80px]" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={() => save.mutate()} disabled={save.isPending || !form.titulo.trim()}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// AulasManager - CRUD de aulas do ciclo
// ============================================
interface AulaAdmin {
  id: string;
  ciclo_id: string;
  titulo: string;
  subtitulo?: string;
  descricao?: string;
  duracao?: string;
  conteudo?: string;
  media_url?: string;
  media_type?: string;
  ordem: number;
  ativo: boolean;
  publicado: boolean;
}

function AulasManager({ cicloId }: { cicloId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AulaAdmin | null>(null);

  const { data: aulas, isLoading } = useQuery({
    queryKey: ['admin-clube-aulas', cicloId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_aulas')
        .select('*')
        .eq('ciclo_id', cicloId)
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data as AulaAdmin[];
    },
  });

  const deleteAula = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clube_livro_aulas').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-aulas', cicloId] });
      toast({ title: 'Aula removida' });
    },
  });

  const togglePublicado = useMutation({
    mutationFn: async ({ id, publicado }: { id: string; publicado: boolean }) => {
      const { error } = await supabase.from('clube_livro_aulas').update({ publicado }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-aulas', cicloId] });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {aulas?.length || 0} aula(s) cadastrada(s)
        </p>
        <Button size="sm" onClick={() => { setEditing(null); setDialogOpen(true); }} className="gap-1">
          <Plus className="w-3 h-3" />
          Nova Aula
        </Button>
      </div>

      {isLoading ? (
        <div className="animate-pulse h-16 bg-muted rounded" />
      ) : aulas && aulas.length > 0 ? (
        <div className="space-y-2">
          {aulas.map((aula) => (
            <div key={aula.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card/50">
              <div className="shrink-0 w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                <span className="text-xs font-mono text-gold font-semibold">{aula.ordem}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{aula.titulo}</p>
                {aula.subtitulo && <p className="text-xs text-muted-foreground truncate">{aula.subtitulo}</p>}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Switch
                  checked={aula.publicado}
                  onCheckedChange={(v) => togglePublicado.mutate({ id: aula.id, publicado: v })}
                />
                <Button size="sm" variant="ghost" onClick={() => { setEditing(aula); setDialogOpen(true); }}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteAula.mutate(aula.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-muted-foreground text-sm">
          Nenhuma aula cadastrada. Clique em "Nova Aula" para começar.
        </div>
      )}

      <AulaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        aula={editing}
        cicloId={cicloId}
        nextOrdem={(aulas?.length || 0) + 1}
      />
    </div>
  );
}

// ============================================
// AulaDialog - Criar/Editar aula com blocos de conteúdo
// ============================================
function AulaDialog({
  open,
  onOpenChange,
  aula,
  cicloId,
  nextOrdem,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  aula: AulaAdmin | null;
  cicloId: string;
  nextOrdem: number;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    titulo: '',
    subtitulo: '',
    descricao: '',
    duracao: '',
    media_url: '',
    media_type: 'texto',
    ordem: nextOrdem,
  });
  const [blocos, setBlocos] = useState<AulaBloco[]>([]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open && aula) {
      setForm({
        titulo: aula.titulo || '',
        subtitulo: aula.subtitulo || '',
        descricao: aula.descricao || '',
        duracao: aula.duracao || '',
        media_url: aula.media_url || '',
        media_type: aula.media_type || 'video',
        ordem: aula.ordem,
      });
      // Parse blocos from conteudo
      try {
        const parsed = aula.conteudo ? (typeof aula.conteudo === 'string' ? JSON.parse(aula.conteudo) : aula.conteudo) : [];
        setBlocos(Array.isArray(parsed) ? parsed : []);
      } catch {
        setBlocos([]);
      }
    } else if (open) {
      setForm({
        titulo: '',
        subtitulo: '',
        descricao: '',
        duracao: '',
        media_url: '',
        media_type: 'texto',
        ordem: nextOrdem,
      });
      setBlocos([]);
    }
  }, [open, aula, nextOrdem]);

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        ciclo_id: cicloId,
        titulo: form.titulo,
        subtitulo: form.subtitulo || null,
        descricao: form.descricao || null,
        duracao: form.duracao || null,
        media_url: form.media_url || null,
        media_type: form.media_type,
        ordem: form.ordem,
        conteudo: blocos.length > 0 ? JSON.stringify(blocos) : null,
      };

      if (aula?.id) {
        const { error } = await supabase.from('clube_livro_aulas').update(payload).eq('id', aula.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('clube_livro_aulas').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-aulas', cicloId] });
      onOpenChange(false);
      toast({ title: aula ? 'Aula atualizada' : 'Aula criada' });
    },
    onError: () => {
      toast({ title: 'Erro ao salvar aula', variant: 'destructive' });
    },
  });

  // Sync form when aula changes
  if (open && aula && form.titulo !== aula.titulo && form.titulo === '') {
    setForm({
      titulo: aula.titulo || '',
      subtitulo: aula.subtitulo || '',
      descricao: aula.descricao || '',
      duracao: aula.duracao || '',
      media_url: aula.media_url || '',
      media_type: aula.media_type || 'texto',
      ordem: aula.ordem,
    });
    try {
      const parsed = aula.conteudo ? (typeof aula.conteudo === 'string' ? JSON.parse(aula.conteudo) : aula.conteudo) : [];
      setBlocos(Array.isArray(parsed) ? parsed : []);
    } catch {
      setBlocos([]);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{aula ? 'Editar Aula' : 'Nova Aula'}</DialogTitle>
          <DialogDescription>
            {aula ? 'Atualize os dados e blocos de conteúdo.' : 'Crie uma aula com blocos estruturados.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Metadados */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3 space-y-2">
              <Label>Título *</Label>
              <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Ex: Aula 1 — O chamado selvagem" />
            </div>
            <div className="space-y-2">
              <Label>Ordem</Label>
              <Input type="number" value={form.ordem} onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Subtítulo</Label>
            <Input value={form.subtitulo} onChange={(e) => setForm({ ...form, subtitulo: e.target.value })} placeholder="Ex: O instinto como linguagem" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Duração</Label>
              <Input value={form.duracao} onChange={(e) => setForm({ ...form, duracao: e.target.value })} placeholder="Ex: 45min" />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Mídia</Label>
              <Select value={form.media_type} onValueChange={(v) => setForm({ ...form, media_type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="texto">Texto</SelectItem>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="audio">Áudio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>URL da Mídia</Label>
            <Input value={form.media_url} onChange={(e) => setForm({ ...form, media_url: e.target.value })} placeholder="Ex: https://..." />
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} className="min-h-[60px]" placeholder="Breve descrição da aula..." />
          </div>

          {/* Blocos de Conteúdo */}
          <Separator className="my-2" />
          <AulaBlocosEditor blocos={blocos} onChange={setBlocos} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={() => save.mutate()} disabled={save.isPending || !form.titulo.trim()}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AdminClubeLivroTab;
