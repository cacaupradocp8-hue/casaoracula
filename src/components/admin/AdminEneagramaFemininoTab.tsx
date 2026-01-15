// ============================================
// ADMIN TAB — FEMININE ENNEAGRAM MANAGEMENT
// Includes Professional Edition layers
// ============================================

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Pencil, Plus, Trash2, Flower2, MessageCircle, Eye, Users, AlertTriangle } from 'lucide-react';

interface Arquetipo {
  id: string;
  numero: number;
  chave: string;
  nome: string;
  nome_en: string | null;
  essencia_simbolica: string;
  ferida_central: string | null;
  dom_central: string | null;
  expressao_sombra: string | null;
  caminho_expansao: string | null;
  pergunta_reflexiva: string | null;
  pratica_simbolica: string | null;
  icone: string | null;
  cor_primaria: string | null;
  ordem: number;
  ativo: boolean;
  // Professional fields
  notas_leitura: string | null;
  transferencias_comuns: string | null;
  resistencias_tipicas: string | null;
  linguagem_evitar: string | null;
  linguagem_que_abre: string | null;
  cautelas_eticas: string | null;
}

interface Afirmacao {
  id: string;
  arquetipo_id: string;
  texto_afirmacao: string;
  peso: number;
  ordem: number;
  ativo: boolean;
}

interface Orientacao {
  id: string;
  arquetipo_id: string;
  tipo: string;
  titulo: string | null;
  texto: string;
  ordem: number;
  ativo: boolean;
}

export default function AdminEneagramaFemininoTab() {
  const [arquetipos, setArquetipos] = useState<Arquetipo[]>([]);
  const [afirmacoes, setAfirmacoes] = useState<Afirmacao[]>([]);
  const [orientacoes, setOrientacoes] = useState<Orientacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArquetipo, setEditingArquetipo] = useState<Arquetipo | null>(null);
  const [editingAfirmacao, setEditingAfirmacao] = useState<Afirmacao | null>(null);
  const [editingOrientacao, setEditingOrientacao] = useState<Orientacao | null>(null);
  const [arquetipoDialogOpen, setArquetipoDialogOpen] = useState(false);
  const [afirmacaoDialogOpen, setAfirmacaoDialogOpen] = useState(false);
  const [orientacaoDialogOpen, setOrientacaoDialogOpen] = useState(false);
  const [professionalDialogOpen, setProfessionalDialogOpen] = useState(false);
  const [selectedArquetipoId, setSelectedArquetipoId] = useState<string | null>(null);
  const [activeMainTab, setActiveMainTab] = useState('arquetipos');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [arquetiposRes, afirmacoesRes, orientacoesRes] = await Promise.all([
      supabase.from('eneagrama_feminino_arquetipos').select('*').order('ordem'),
      supabase.from('eneagrama_feminino_afirmacoes').select('*').order('ordem'),
      supabase.from('eneagrama_feminino_orientacoes').select('*').order('ordem'),
    ]);

    if (arquetiposRes.data) setArquetipos(arquetiposRes.data);
    if (afirmacoesRes.data) setAfirmacoes(afirmacoesRes.data);
    if (orientacoesRes.data) setOrientacoes(orientacoesRes.data);
    setLoading(false);
  };

  const handleSaveArquetipo = async () => {
    if (!editingArquetipo) return;

    const { error } = await supabase
      .from('eneagrama_feminino_arquetipos')
      .update({
        nome: editingArquetipo.nome,
        nome_en: editingArquetipo.nome_en,
        essencia_simbolica: editingArquetipo.essencia_simbolica,
        ferida_central: editingArquetipo.ferida_central,
        dom_central: editingArquetipo.dom_central,
        expressao_sombra: editingArquetipo.expressao_sombra,
        caminho_expansao: editingArquetipo.caminho_expansao,
        pergunta_reflexiva: editingArquetipo.pergunta_reflexiva,
        pratica_simbolica: editingArquetipo.pratica_simbolica,
        icone: editingArquetipo.icone,
        cor_primaria: editingArquetipo.cor_primaria,
        ativo: editingArquetipo.ativo,
        // Professional fields
        notas_leitura: editingArquetipo.notas_leitura,
        transferencias_comuns: editingArquetipo.transferencias_comuns,
        resistencias_tipicas: editingArquetipo.resistencias_tipicas,
        linguagem_evitar: editingArquetipo.linguagem_evitar,
        linguagem_que_abre: editingArquetipo.linguagem_que_abre,
        cautelas_eticas: editingArquetipo.cautelas_eticas,
      })
      .eq('id', editingArquetipo.id);

    if (error) {
      toast.error('Erro ao salvar: ' + error.message);
    } else {
      toast.success('Arquétipo atualizado');
      fetchData();
      setArquetipoDialogOpen(false);
      setProfessionalDialogOpen(false);
      setEditingArquetipo(null);
    }
  };

  const handleSaveOrientacao = async () => {
    if (!editingOrientacao) return;

    const isNew = !editingOrientacao.id;

    if (isNew) {
      const { error } = await supabase
        .from('eneagrama_feminino_orientacoes')
        .insert({
          arquetipo_id: editingOrientacao.arquetipo_id,
          tipo: editingOrientacao.tipo,
          titulo: editingOrientacao.titulo,
          texto: editingOrientacao.texto,
          ordem: editingOrientacao.ordem,
          ativo: editingOrientacao.ativo,
        });

      if (error) {
        toast.error('Erro ao criar: ' + error.message);
      } else {
        toast.success('Orientação criada');
        fetchData();
        setOrientacaoDialogOpen(false);
        setEditingOrientacao(null);
      }
    } else {
      const { error } = await supabase
        .from('eneagrama_feminino_orientacoes')
        .update({
          tipo: editingOrientacao.tipo,
          titulo: editingOrientacao.titulo,
          texto: editingOrientacao.texto,
          ordem: editingOrientacao.ordem,
          ativo: editingOrientacao.ativo,
        })
        .eq('id', editingOrientacao.id);

      if (error) {
        toast.error('Erro ao salvar: ' + error.message);
      } else {
        toast.success('Orientação atualizada');
        fetchData();
        setOrientacaoDialogOpen(false);
        setEditingOrientacao(null);
      }
    }
  };

  const handleDeleteOrientacao = async (id: string) => {
    if (!confirm('Remover esta orientação?')) return;

    const { error } = await supabase
      .from('eneagrama_feminino_orientacoes')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao remover: ' + error.message);
    } else {
      toast.success('Orientação removida');
      fetchData();
    }
  };

  const getOrientacoesByArquetipo = (arquetipoId: string) => {
    return orientacoes.filter(o => o.arquetipo_id === arquetipoId);
  };

  const handleSaveAfirmacao = async () => {
    if (!editingAfirmacao) return;

    const isNew = !editingAfirmacao.id;

    if (isNew) {
      const { error } = await supabase
        .from('eneagrama_feminino_afirmacoes')
        .insert({
          arquetipo_id: editingAfirmacao.arquetipo_id,
          texto_afirmacao: editingAfirmacao.texto_afirmacao,
          peso: editingAfirmacao.peso,
          ordem: editingAfirmacao.ordem,
          ativo: editingAfirmacao.ativo,
        });

      if (error) {
        toast.error('Erro ao criar: ' + error.message);
      } else {
        toast.success('Afirmação criada');
        fetchData();
        setAfirmacaoDialogOpen(false);
        setEditingAfirmacao(null);
      }
    } else {
      const { error } = await supabase
        .from('eneagrama_feminino_afirmacoes')
        .update({
          texto_afirmacao: editingAfirmacao.texto_afirmacao,
          peso: editingAfirmacao.peso,
          ordem: editingAfirmacao.ordem,
          ativo: editingAfirmacao.ativo,
        })
        .eq('id', editingAfirmacao.id);

      if (error) {
        toast.error('Erro ao salvar: ' + error.message);
      } else {
        toast.success('Afirmação atualizada');
        fetchData();
        setAfirmacaoDialogOpen(false);
        setEditingAfirmacao(null);
      }
    }
  };

  const handleDeleteAfirmacao = async (id: string) => {
    if (!confirm('Remover esta afirmação?')) return;

    const { error } = await supabase
      .from('eneagrama_feminino_afirmacoes')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao remover: ' + error.message);
    } else {
      toast.success('Afirmação removida');
      fetchData();
    }
  };

  const getAfirmacoesByArquetipo = (arquetipoId: string) => {
    return afirmacoes.filter(a => a.arquetipo_id === arquetipoId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Flower2 className="w-6 h-6 text-gold" />
        <h2 className="text-xl font-display">Eneagrama Feminino</h2>
      </div>

      <Tabs value={activeMainTab} onValueChange={setActiveMainTab}>
        <TabsList>
          <TabsTrigger value="arquetipos">9 Arquétipos</TabsTrigger>
          <TabsTrigger value="afirmacoes">Afirmações</TabsTrigger>
          <TabsTrigger value="profissional" className="text-purple-400">
            <Users className="w-3 h-3 mr-1" />
            Profissional
          </TabsTrigger>
        </TabsList>

        {/* ARCHETYPES TAB */}
        <TabsContent value="arquetipos" className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">
            Configure os 9 arquétipos femininos — seus nomes, narrativas e práticas.
          </p>

          <div className="grid gap-4">
            {arquetipos.map(arq => (
              <Card key={arq.id} className={!arq.ativo ? 'opacity-50' : ''}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{ 
                            backgroundColor: `${arq.cor_primaria}20`,
                            color: arq.cor_primaria || 'inherit'
                          }}
                        >
                          {arq.numero}
                        </div>
                        <div>
                          <p className="font-medium">{arq.nome}</p>
                          <p className="text-xs text-muted-foreground">{arq.nome_en}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {arq.essencia_simbolica}
                      </p>
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Afirmações: {getAfirmacoesByArquetipo(arq.id).length}</span>
                        <span>•</span>
                        <span>Orientações: {getOrientacoesByArquetipo(arq.id).length}</span>
                        <span>•</span>
                        <span className={arq.ativo ? 'text-green-500' : 'text-red-500'}>
                          {arq.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingArquetipo(arq);
                          setArquetipoDialogOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-purple-400"
                        onClick={() => {
                          setEditingArquetipo(arq);
                          setProfessionalDialogOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* AFFIRMATIONS TAB */}
        <TabsContent value="afirmacoes" className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground mb-4">
            Gerencie as afirmações do quiz para cada arquétipo.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {arquetipos.map(arq => (
              <Button
                key={arq.id}
                variant={selectedArquetipoId === arq.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedArquetipoId(arq.id)}
              >
                {arq.numero}. {arq.nome}
              </Button>
            ))}
          </div>

          {selectedArquetipoId && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    Afirmações: {arquetipos.find(a => a.id === selectedArquetipoId)?.nome}
                  </CardTitle>
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingAfirmacao({
                        id: '',
                        arquetipo_id: selectedArquetipoId,
                        texto_afirmacao: '',
                        peso: 1,
                        ordem: getAfirmacoesByArquetipo(selectedArquetipoId).length + 1,
                        ativo: true,
                      });
                      setAfirmacaoDialogOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {getAfirmacoesByArquetipo(selectedArquetipoId).map((af, idx) => (
                  <div 
                    key={af.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border"
                  >
                    <span className="text-xs text-muted-foreground mt-1">{idx + 1}.</span>
                    <p className="flex-1 text-sm">{af.texto_afirmacao}</p>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditingAfirmacao(af);
                          setAfirmacaoDialogOpen(true);
                        }}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDeleteAfirmacao(af.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}

                {getAfirmacoesByArquetipo(selectedArquetipoId).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhuma afirmação cadastrada.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* PROFESSIONAL TAB */}
        <TabsContent value="profissional" className="space-y-4 mt-4">
          <Card className="bg-purple-500/5 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-purple-400">Conteúdo Profissional</p>
                  <p className="text-sm text-muted-foreground">
                    Gerencie o conteúdo exclusivo para facilitadoras: notas de leitura, 
                    orientações de condução e alertas éticos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2 mb-4">
            {arquetipos.map(arq => (
              <Button
                key={arq.id}
                variant={selectedArquetipoId === arq.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedArquetipoId(arq.id)}
              >
                {arq.numero}. {arq.nome}
              </Button>
            ))}
          </div>

          {selectedArquetipoId && (
            <div className="space-y-4">
              {/* Professional Notes Card */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">
                        Conteúdo Profissional: {arquetipos.find(a => a.id === selectedArquetipoId)?.nome}
                      </CardTitle>
                      <CardDescription>
                        Notas de leitura, transferências, linguagem e cautelas
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-purple-500/50 text-purple-400"
                      onClick={() => {
                        setEditingArquetipo(arquetipos.find(a => a.id === selectedArquetipoId) || null);
                        setProfessionalDialogOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(() => {
                    const arq = arquetipos.find(a => a.id === selectedArquetipoId);
                    if (!arq) return null;
                    return (
                      <>
                        {arq.notas_leitura && (
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-xs font-medium uppercase text-muted-foreground mb-1">Notas de Leitura</p>
                            <p className="text-sm">{arq.notas_leitura}</p>
                          </div>
                        )}
                        {arq.transferencias_comuns && (
                          <div className="p-3 bg-blue-500/5 rounded-lg">
                            <p className="text-xs font-medium uppercase text-blue-400 mb-1">Transferências Comuns</p>
                            <p className="text-sm">{arq.transferencias_comuns}</p>
                          </div>
                        )}
                        {arq.linguagem_evitar && (
                          <div className="p-3 bg-orange-500/5 rounded-lg">
                            <p className="text-xs font-medium uppercase text-orange-400 mb-1">Linguagem a Evitar</p>
                            <p className="text-sm whitespace-pre-line">{arq.linguagem_evitar}</p>
                          </div>
                        )}
                        {arq.linguagem_que_abre && (
                          <div className="p-3 bg-green-500/5 rounded-lg">
                            <p className="text-xs font-medium uppercase text-green-400 mb-1">Linguagem que Abre</p>
                            <p className="text-sm whitespace-pre-line">{arq.linguagem_que_abre}</p>
                          </div>
                        )}
                        {arq.cautelas_eticas && (
                          <div className="p-3 bg-red-500/5 rounded-lg">
                            <p className="text-xs font-medium uppercase text-red-400 mb-1">Cautelas Éticas</p>
                            <p className="text-sm">{arq.cautelas_eticas}</p>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Orientations Card */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">Orientações de Condução</CardTitle>
                      <CardDescription>
                        Perguntas de abertura, espelhos simbólicos e rituais de encerramento
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingOrientacao({
                          id: '',
                          arquetipo_id: selectedArquetipoId,
                          tipo: 'abertura',
                          titulo: '',
                          texto: '',
                          ordem: getOrientacoesByArquetipo(selectedArquetipoId).length + 1,
                          ativo: true,
                        });
                        setOrientacaoDialogOpen(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {['abertura', 'espelho', 'reenquadramento', 'integracao', 'encerramento'].map(tipo => {
                    const items = getOrientacoesByArquetipo(selectedArquetipoId).filter(o => o.tipo === tipo);
                    if (items.length === 0) return null;
                    return (
                      <div key={tipo}>
                        <p className="text-xs font-medium uppercase text-muted-foreground mb-2">
                          {tipo === 'abertura' && 'Perguntas de Abertura'}
                          {tipo === 'espelho' && 'Espelhos Simbólicos'}
                          {tipo === 'reenquadramento' && 'Prompts de Reenquadramento'}
                          {tipo === 'integracao' && 'Convites de Integração'}
                          {tipo === 'encerramento' && 'Rituais de Encerramento'}
                        </p>
                        {items.map(o => (
                          <div key={o.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border mb-2">
                            <p className="flex-1 text-sm italic">"{o.texto}"</p>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  setEditingOrientacao(o);
                                  setOrientacaoDialogOpen(true);
                                }}
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => handleDeleteOrientacao(o.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}

                  {getOrientacoesByArquetipo(selectedArquetipoId).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhuma orientação cadastrada.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ARCHETYPE EDIT DIALOG */}
      <Dialog open={arquetipoDialogOpen} onOpenChange={setArquetipoDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Arquétipo: {editingArquetipo?.nome}</DialogTitle>
          </DialogHeader>

          {editingArquetipo && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome (PT)</Label>
                  <Input
                    value={editingArquetipo.nome}
                    onChange={(e) => setEditingArquetipo({ ...editingArquetipo, nome: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Nome (EN)</Label>
                  <Input
                    value={editingArquetipo.nome_en || ''}
                    onChange={(e) => setEditingArquetipo({ ...editingArquetipo, nome_en: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Essência Simbólica</Label>
                <Textarea
                  value={editingArquetipo.essencia_simbolica}
                  onChange={(e) => setEditingArquetipo({ ...editingArquetipo, essencia_simbolica: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Dom Central</Label>
                  <Textarea
                    value={editingArquetipo.dom_central || ''}
                    onChange={(e) => setEditingArquetipo({ ...editingArquetipo, dom_central: e.target.value })}
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Ferida Central</Label>
                  <Textarea
                    value={editingArquetipo.ferida_central || ''}
                    onChange={(e) => setEditingArquetipo({ ...editingArquetipo, ferida_central: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>

              <div>
                <Label>Expressão Sombra</Label>
                <Textarea
                  value={editingArquetipo.expressao_sombra || ''}
                  onChange={(e) => setEditingArquetipo({ ...editingArquetipo, expressao_sombra: e.target.value })}
                  rows={2}
                />
              </div>

              <div>
                <Label>Caminho de Expansão</Label>
                <Textarea
                  value={editingArquetipo.caminho_expansao || ''}
                  onChange={(e) => setEditingArquetipo({ ...editingArquetipo, caminho_expansao: e.target.value })}
                  rows={2}
                />
              </div>

              <div>
                <Label>Pergunta Reflexiva</Label>
                <Input
                  value={editingArquetipo.pergunta_reflexiva || ''}
                  onChange={(e) => setEditingArquetipo({ ...editingArquetipo, pergunta_reflexiva: e.target.value })}
                />
              </div>

              <div>
                <Label>Prática Simbólica</Label>
                <Textarea
                  value={editingArquetipo.pratica_simbolica || ''}
                  onChange={(e) => setEditingArquetipo({ ...editingArquetipo, pratica_simbolica: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ícone (Lucide)</Label>
                  <Input
                    value={editingArquetipo.icone || ''}
                    onChange={(e) => setEditingArquetipo({ ...editingArquetipo, icone: e.target.value })}
                    placeholder="Heart, Crown, Star..."
                  />
                </div>
                <div>
                  <Label>Cor Primária (HEX)</Label>
                  <div className="flex gap-2">
                    <Input
                      value={editingArquetipo.cor_primaria || ''}
                      onChange={(e) => setEditingArquetipo({ ...editingArquetipo, cor_primaria: e.target.value })}
                      placeholder="#E8B4B8"
                    />
                    {editingArquetipo.cor_primaria && (
                      <div 
                        className="w-10 h-10 rounded border"
                        style={{ backgroundColor: editingArquetipo.cor_primaria }}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={editingArquetipo.ativo}
                  onCheckedChange={(checked) => setEditingArquetipo({ ...editingArquetipo, ativo: checked })}
                />
                <Label>Ativo</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setArquetipoDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveArquetipo}>
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* AFFIRMATION EDIT DIALOG */}
      <Dialog open={afirmacaoDialogOpen} onOpenChange={setAfirmacaoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAfirmacao?.id ? 'Editar Afirmação' : 'Nova Afirmação'}
            </DialogTitle>
          </DialogHeader>

          {editingAfirmacao && (
            <div className="space-y-4 py-4">
              <div>
                <Label>Texto da Afirmação</Label>
                <Textarea
                  value={editingAfirmacao.texto_afirmacao}
                  onChange={(e) => setEditingAfirmacao({ ...editingAfirmacao, texto_afirmacao: e.target.value })}
                  rows={3}
                  placeholder="Ex: Frequentemente me pego priorizando as necessidades dos outros..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Peso</Label>
                  <Input
                    type="number"
                    value={editingAfirmacao.peso}
                    onChange={(e) => setEditingAfirmacao({ ...editingAfirmacao, peso: parseInt(e.target.value) || 1 })}
                    min={1}
                    max={3}
                  />
                </div>
                <div>
                  <Label>Ordem</Label>
                  <Input
                    type="number"
                    value={editingAfirmacao.ordem}
                    onChange={(e) => setEditingAfirmacao({ ...editingAfirmacao, ordem: parseInt(e.target.value) || 1 })}
                    min={1}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={editingAfirmacao.ativo}
                  onCheckedChange={(checked) => setEditingAfirmacao({ ...editingAfirmacao, ativo: checked })}
                />
                <Label>Ativa</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setAfirmacaoDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveAfirmacao}>
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* PROFESSIONAL EDIT DIALOG */}
      <Dialog open={professionalDialogOpen} onOpenChange={setProfessionalDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-400" />
              Conteúdo Profissional: {editingArquetipo?.nome}
            </DialogTitle>
          </DialogHeader>

          {editingArquetipo && (
            <div className="space-y-4 py-4">
              <div>
                <Label>Notas de Leitura</Label>
                <Textarea
                  value={editingArquetipo.notas_leitura || ''}
                  onChange={(e) => setEditingArquetipo({ ...editingArquetipo, notas_leitura: e.target.value })}
                  rows={3}
                  placeholder="Orientações para a facilitadora ao ler este arquétipo..."
                />
              </div>

              <div>
                <Label>Transferências Comuns</Label>
                <Textarea
                  value={editingArquetipo.transferencias_comuns || ''}
                  onChange={(e) => setEditingArquetipo({ ...editingArquetipo, transferencias_comuns: e.target.value })}
                  rows={2}
                  placeholder="Padrões transferenciais típicos..."
                />
              </div>

              <div>
                <Label>Linguagem a Evitar</Label>
                <Textarea
                  value={editingArquetipo.linguagem_evitar || ''}
                  onChange={(e) => setEditingArquetipo({ ...editingArquetipo, linguagem_evitar: e.target.value })}
                  rows={3}
                  placeholder="Frases e abordagens a evitar..."
                />
              </div>

              <div>
                <Label>Linguagem que Abre</Label>
                <Textarea
                  value={editingArquetipo.linguagem_que_abre || ''}
                  onChange={(e) => setEditingArquetipo({ ...editingArquetipo, linguagem_que_abre: e.target.value })}
                  rows={3}
                  placeholder="Perguntas e frases que facilitam abertura..."
                />
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  Cautelas Éticas
                </Label>
                <Textarea
                  value={editingArquetipo.cautelas_eticas || ''}
                  onChange={(e) => setEditingArquetipo({ ...editingArquetipo, cautelas_eticas: e.target.value })}
                  rows={2}
                  placeholder="Alertas de risco e encaminhamentos..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setProfessionalDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveArquetipo}>
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ORIENTATION EDIT DIALOG */}
      <Dialog open={orientacaoDialogOpen} onOpenChange={setOrientacaoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingOrientacao?.id ? 'Editar Orientação' : 'Nova Orientação'}
            </DialogTitle>
          </DialogHeader>

          {editingOrientacao && (
            <div className="space-y-4 py-4">
              <div>
                <Label>Tipo</Label>
                <Select
                  value={editingOrientacao.tipo}
                  onValueChange={(val) => setEditingOrientacao({ ...editingOrientacao, tipo: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="abertura">Pergunta de Abertura</SelectItem>
                    <SelectItem value="espelho">Espelho Simbólico</SelectItem>
                    <SelectItem value="reenquadramento">Prompt de Reenquadramento</SelectItem>
                    <SelectItem value="integracao">Convite de Integração</SelectItem>
                    <SelectItem value="encerramento">Ritual de Encerramento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Texto</Label>
                <Textarea
                  value={editingOrientacao.texto}
                  onChange={(e) => setEditingOrientacao({ ...editingOrientacao, texto: e.target.value })}
                  rows={3}
                  placeholder="Texto da orientação..."
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={editingOrientacao.ativo}
                  onCheckedChange={(checked) => setEditingOrientacao({ ...editingOrientacao, ativo: checked })}
                />
                <Label>Ativa</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setOrientacaoDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveOrientacao}>
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
