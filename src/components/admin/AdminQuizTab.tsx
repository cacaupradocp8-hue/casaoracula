import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Pencil, Trash2, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "./ImageUpload"; // Quiz cover and result media

interface Quiz {
  id: string;
  titulo: string;
  descricao: string;
  ativo: boolean;
  sala_id: string | null;
  capa_url: string | null;
}

interface Pergunta {
  id: string;
  quiz_id: string;
  texto: string;
  ordem: number;
  ativo: boolean;
}

interface Opcao {
  id: string;
  pergunta_id: string;
  texto: string;
  valor_pontuacao: number;
  categoria: string | null;
  ordem: number;
}

interface Resultado {
  id: string;
  quiz_id: string;
  titulo_simbolico: string;
  texto_interpretativo: string;
  pontuacao_minima: number | null;
  pontuacao_maxima: number | null;
  categoria: string | null;
  ordem: number;
  imagem_url: string | null;
  audio_url: string | null;
  video_url: string | null;
}

interface Sala {
  id: string;
  nome_exibicao: string;
}

export function AdminQuizTab() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  
  // Quiz dialog
  const [showQuizDialog, setShowQuizDialog] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [quizForm, setQuizForm] = useState({ titulo: "", descricao: "", ativo: true, sala_id: "", capa_url: "" });

  // Perguntas
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [showPerguntaDialog, setShowPerguntaDialog] = useState(false);
  const [editingPergunta, setEditingPergunta] = useState<Pergunta | null>(null);
  const [perguntaForm, setPerguntaForm] = useState({ texto: "", ativo: true });

  // Opções
  const [opcoes, setOpcoes] = useState<Record<string, Opcao[]>>({});
  const [expandedPergunta, setExpandedPergunta] = useState<string | null>(null);
  const [showOpcaoDialog, setShowOpcaoDialog] = useState(false);
  const [editingOpcao, setEditingOpcao] = useState<Opcao | null>(null);
  const [opcaoForm, setOpcaoForm] = useState({ texto: "", valor_pontuacao: 0, categoria: "" });
  const [currentPerguntaId, setCurrentPerguntaId] = useState<string | null>(null);

  // Resultados
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [showResultadoDialog, setShowResultadoDialog] = useState(false);
  const [editingResultado, setEditingResultado] = useState<Resultado | null>(null);
  const [resultadoForm, setResultadoForm] = useState({
    titulo_simbolico: "",
    texto_interpretativo: "",
    pontuacao_minima: "",
    pontuacao_maxima: "",
    categoria: "",
    imagem_url: "",
    audio_url: "",
    video_url: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedQuiz) {
      fetchPerguntas(selectedQuiz.id);
      fetchResultados(selectedQuiz.id);
    }
  }, [selectedQuiz]);

  const fetchData = async () => {
    try {
      const [quizzesRes, salasRes] = await Promise.all([
        supabase.from("quizzes").select("*").order("created_at", { ascending: false }),
        supabase.from("salas").select("id, nome_exibicao").order("ordem"),
      ]);

      if (quizzesRes.data) setQuizzes(quizzesRes.data as unknown as Quiz[]);
      if (salasRes.data) setSalas(salasRes.data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const fetchPerguntas = async (quizId: string) => {
    const { data } = await supabase
      .from("quiz_perguntas")
      .select("*")
      .eq("quiz_id", quizId)
      .order("ordem");
    if (data) setPerguntas(data);
  };

  const fetchOpcoes = async (perguntaId: string) => {
    const { data } = await supabase
      .from("quiz_opcoes")
      .select("*")
      .eq("pergunta_id", perguntaId)
      .order("ordem");
    if (data) setOpcoes((prev) => ({ ...prev, [perguntaId]: data }));
  };

  const fetchResultados = async (quizId: string) => {
    const { data } = await supabase
      .from("quiz_resultados")
      .select("*")
      .eq("quiz_id", quizId)
      .order("ordem");
    if (data) setResultados(data as Resultado[]);
  };

  // Quiz CRUD
  const handleSaveQuiz = async () => {
    try {
      const payload = {
        titulo: quizForm.titulo,
        descricao: quizForm.descricao,
        ativo: quizForm.ativo,
        sala_id: quizForm.sala_id || null,
        capa_url: quizForm.capa_url || null,
      };

      if (editingQuiz) {
        const { error } = await supabase.from("quizzes").update(payload).eq("id", editingQuiz.id);
        if (error) throw error;
        toast.success("Quiz atualizado");
      } else {
        const { error } = await supabase.from("quizzes").insert(payload);
        if (error) throw error;
        toast.success("Quiz criado");
      }

      setShowQuizDialog(false);
      setEditingQuiz(null);
      setQuizForm({ titulo: "", descricao: "", ativo: true, sala_id: "", capa_url: "" });
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar quiz");
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    if (!confirm("Excluir quiz e todas as perguntas?")) return;
    const { error } = await supabase.from("quizzes").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir");
    } else {
      toast.success("Quiz excluído");
      if (selectedQuiz?.id === id) setSelectedQuiz(null);
      fetchData();
    }
  };

  // Pergunta CRUD
  const handleSavePergunta = async () => {
    if (!selectedQuiz) return;
    try {
      const payload = {
        quiz_id: selectedQuiz.id,
        texto: perguntaForm.texto,
        ativo: perguntaForm.ativo,
        ordem: editingPergunta?.ordem ?? perguntas.length,
      };

      if (editingPergunta) {
        const { error } = await supabase.from("quiz_perguntas").update(payload).eq("id", editingPergunta.id);
        if (error) throw error;
        toast.success("Pergunta atualizada");
      } else {
        const { error } = await supabase.from("quiz_perguntas").insert(payload);
        if (error) throw error;
        toast.success("Pergunta criada");
      }

      setShowPerguntaDialog(false);
      setEditingPergunta(null);
      setPerguntaForm({ texto: "", ativo: true });
      fetchPerguntas(selectedQuiz.id);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar pergunta");
    }
  };

  const handleDeletePergunta = async (id: string) => {
    if (!confirm("Excluir pergunta e opções?")) return;
    const { error } = await supabase.from("quiz_perguntas").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir");
    } else {
      toast.success("Pergunta excluída");
      if (selectedQuiz) fetchPerguntas(selectedQuiz.id);
    }
  };

  // Opção CRUD
  const handleSaveOpcao = async () => {
    if (!currentPerguntaId) return;
    try {
      const currentOpcoes = opcoes[currentPerguntaId] || [];
      const payload = {
        pergunta_id: currentPerguntaId,
        texto: opcaoForm.texto,
        valor_pontuacao: opcaoForm.valor_pontuacao,
        categoria: opcaoForm.categoria || null,
        ordem: editingOpcao?.ordem ?? currentOpcoes.length,
      };

      if (editingOpcao) {
        const { error } = await supabase.from("quiz_opcoes").update(payload).eq("id", editingOpcao.id);
        if (error) throw error;
        toast.success("Opção atualizada");
      } else {
        const { error } = await supabase.from("quiz_opcoes").insert(payload);
        if (error) throw error;
        toast.success("Opção criada");
      }

      setShowOpcaoDialog(false);
      setEditingOpcao(null);
      setOpcaoForm({ texto: "", valor_pontuacao: 0, categoria: "" });
      fetchOpcoes(currentPerguntaId);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar opção");
    }
  };

  const handleDeleteOpcao = async (id: string, perguntaId: string) => {
    if (!confirm("Excluir opção?")) return;
    const { error } = await supabase.from("quiz_opcoes").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir");
    } else {
      toast.success("Opção excluída");
      fetchOpcoes(perguntaId);
    }
  };

  // Resultado CRUD
  const handleSaveResultado = async () => {
    if (!selectedQuiz) return;
    try {
      const payload = {
        quiz_id: selectedQuiz.id,
        titulo_simbolico: resultadoForm.titulo_simbolico,
        texto_interpretativo: resultadoForm.texto_interpretativo,
        pontuacao_minima: resultadoForm.pontuacao_minima ? parseInt(resultadoForm.pontuacao_minima) : null,
        pontuacao_maxima: resultadoForm.pontuacao_maxima ? parseInt(resultadoForm.pontuacao_maxima) : null,
        categoria: resultadoForm.categoria || null,
        ordem: editingResultado?.ordem ?? resultados.length,
        imagem_url: resultadoForm.imagem_url || null,
        audio_url: resultadoForm.audio_url || null,
        video_url: resultadoForm.video_url || null,
      };

      if (editingResultado) {
        const { error } = await supabase.from("quiz_resultados").update(payload).eq("id", editingResultado.id);
        if (error) throw error;
        toast.success("Resultado atualizado");
      } else {
        const { error } = await supabase.from("quiz_resultados").insert(payload);
        if (error) throw error;
        toast.success("Resultado criado");
      }

      setShowResultadoDialog(false);
      setEditingResultado(null);
      setResultadoForm({ titulo_simbolico: "", texto_interpretativo: "", pontuacao_minima: "", pontuacao_maxima: "", categoria: "", imagem_url: "", audio_url: "", video_url: "" });
      fetchResultados(selectedQuiz.id);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar resultado");
    }
  };

  const handleDeleteResultado = async (id: string) => {
    if (!confirm("Excluir resultado?")) return;
    const { error } = await supabase.from("quiz_resultados").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir");
    } else {
      toast.success("Resultado excluído");
      if (selectedQuiz) fetchResultados(selectedQuiz.id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lista de Quizzes */}
      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Quizzes</CardTitle>
          <Button
            size="sm"
            onClick={() => {
              setEditingQuiz(null);
              setQuizForm({ titulo: "", descricao: "", ativo: true, sala_id: "", capa_url: "" });
              setShowQuizDialog(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Quiz
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Sala</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quizzes.map((quiz) => (
                <TableRow
                  key={quiz.id}
                  className={`cursor-pointer ${selectedQuiz?.id === quiz.id ? "bg-gold/10" : ""}`}
                  onClick={() => setSelectedQuiz(quiz)}
                >
                  <TableCell className="font-medium">{quiz.titulo}</TableCell>
                  <TableCell>{salas.find((s) => s.id === quiz.sala_id)?.nome_exibicao || "-"}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${quiz.ativo ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
                      {quiz.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditingQuiz(quiz);
                          setQuizForm({
                            titulo: quiz.titulo,
                            descricao: quiz.descricao,
                            ativo: quiz.ativo,
                            sala_id: quiz.sala_id || "",
                            capa_url: quiz.capa_url || "",
                          });
                          setShowQuizDialog(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDeleteQuiz(quiz.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {quizzes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Nenhum quiz cadastrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detalhes do Quiz Selecionado */}
      {selectedQuiz && (
        <Card className="glass">
          <CardHeader>
            <CardTitle>Editando: {selectedQuiz.titulo}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="perguntas">
              <TabsList>
                <TabsTrigger value="perguntas">Perguntas</TabsTrigger>
                <TabsTrigger value="resultados">Resultados</TabsTrigger>
              </TabsList>

              <TabsContent value="perguntas" className="space-y-4 mt-4">
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingPergunta(null);
                      setPerguntaForm({ texto: "", ativo: true });
                      setShowPerguntaDialog(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Pergunta
                  </Button>
                </div>

                <div className="space-y-2">
                  {perguntas.map((pergunta, idx) => (
                    <div key={pergunta.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-gold font-bold">{idx + 1}.</span>
                          <span>{pergunta.texto}</span>
                          {!pergunta.ativo && (
                            <span className="text-xs text-muted-foreground">(inativa)</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              if (expandedPergunta === pergunta.id) {
                                setExpandedPergunta(null);
                              } else {
                                setExpandedPergunta(pergunta.id);
                                if (!opcoes[pergunta.id]) {
                                  fetchOpcoes(pergunta.id);
                                }
                              }
                            }}
                          >
                            {expandedPergunta === pergunta.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditingPergunta(pergunta);
                              setPerguntaForm({ texto: pergunta.texto, ativo: pergunta.ativo });
                              setShowPerguntaDialog(true);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDeletePergunta(pergunta.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>

                      {/* Opções expandidas */}
                      {expandedPergunta === pergunta.id && (
                        <div className="mt-4 ml-6 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Opções de resposta:</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setCurrentPerguntaId(pergunta.id);
                                setEditingOpcao(null);
                                setOpcaoForm({ texto: "", valor_pontuacao: 0, categoria: "" });
                                setShowOpcaoDialog(true);
                              }}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Opção
                            </Button>
                          </div>
                          {(opcoes[pergunta.id] || []).map((opcao) => (
                            <div key={opcao.id} className="flex items-center justify-between bg-muted/50 rounded p-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{opcao.texto}</span>
                                <span className="text-xs text-gold">({opcao.valor_pontuacao} pts)</span>
                                {opcao.categoria && (
                                  <span className="text-xs text-primary bg-primary/10 px-1 rounded">{opcao.categoria}</span>
                                )}
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6"
                                  onClick={() => {
                                    setCurrentPerguntaId(pergunta.id);
                                    setEditingOpcao(opcao);
                                    setOpcaoForm({
                                      texto: opcao.texto,
                                      valor_pontuacao: opcao.valor_pontuacao,
                                      categoria: opcao.categoria || "",
                                    });
                                    setShowOpcaoDialog(true);
                                  }}
                                >
                                  <Pencil className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6"
                                  onClick={() => handleDeleteOpcao(opcao.id, pergunta.id)}
                                >
                                  <Trash2 className="w-3 h-3 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          {(opcoes[pergunta.id] || []).length === 0 && (
                            <p className="text-sm text-muted-foreground">Nenhuma opção cadastrada</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {perguntas.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">Nenhuma pergunta cadastrada</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="resultados" className="space-y-4 mt-4">
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingResultado(null);
                      setResultadoForm({
                        titulo_simbolico: "",
                        texto_interpretativo: "",
                        pontuacao_minima: "",
                        pontuacao_maxima: "",
                        categoria: "",
                        imagem_url: "",
                        audio_url: "",
                        video_url: "",
                      });
                      setShowResultadoDialog(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Resultado
                  </Button>
                </div>

                <div className="space-y-2">
                  {resultados.map((resultado) => (
                    <div key={resultado.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gold">{resultado.titulo_simbolico}</h4>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {resultado.texto_interpretativo}
                          </p>
                          <div className="flex gap-2 mt-2">
                            {resultado.pontuacao_minima !== null && resultado.pontuacao_maxima !== null && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                {resultado.pontuacao_minima} - {resultado.pontuacao_maxima} pts
                              </span>
                            )}
                            {resultado.categoria && (
                              <span className="text-xs bg-gold/10 text-gold px-2 py-1 rounded">
                                {resultado.categoria}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditingResultado(resultado);
                              setResultadoForm({
                                titulo_simbolico: resultado.titulo_simbolico,
                                texto_interpretativo: resultado.texto_interpretativo,
                                pontuacao_minima: resultado.pontuacao_minima?.toString() || "",
                                pontuacao_maxima: resultado.pontuacao_maxima?.toString() || "",
                                categoria: resultado.categoria || "",
                                imagem_url: resultado.imagem_url || "",
                                audio_url: resultado.audio_url || "",
                                video_url: resultado.video_url || "",
                              });
                              setShowResultadoDialog(true);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDeleteResultado(resultado.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {resultados.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">Nenhum resultado cadastrado</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Dialog Quiz */}
      <Dialog open={showQuizDialog} onOpenChange={setShowQuizDialog}>
        <DialogContent className="max-w-lg max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{editingQuiz ? "Editar Quiz" : "Novo Quiz"}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-4 p-1">
              <div>
                <Label>Título</Label>
                <Input
                  value={quizForm.titulo}
                  onChange={(e) => setQuizForm({ ...quizForm, titulo: e.target.value })}
                  placeholder="Nome do quiz"
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea
                  value={quizForm.descricao}
                  onChange={(e) => setQuizForm({ ...quizForm, descricao: e.target.value })}
                  placeholder="Descrição do quiz"
                />
              </div>
              <ImageUpload
                value={quizForm.capa_url}
                onChange={(url) => setQuizForm({ ...quizForm, capa_url: url })}
                folder="quiz"
                label="Capa do Quiz"
                aspectRatio="video"
                showGallery={true}
              />
              <div>
                <Label>Sala</Label>
                <select
                  className="w-full p-2 rounded border bg-background"
                  value={quizForm.sala_id}
                  onChange={(e) => setQuizForm({ ...quizForm, sala_id: e.target.value })}
                >
                  <option value="">Nenhuma</option>
                  {salas.map((sala) => (
                    <option key={sala.id} value={sala.id}>
                      {sala.nome_exibicao}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={quizForm.ativo}
                  onCheckedChange={(checked) => setQuizForm({ ...quizForm, ativo: checked })}
                />
                <Label>Ativo</Label>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQuizDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveQuiz}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Pergunta */}
      <Dialog open={showPerguntaDialog} onOpenChange={setShowPerguntaDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPergunta ? "Editar Pergunta" : "Nova Pergunta"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Texto da Pergunta</Label>
              <Textarea
                value={perguntaForm.texto}
                onChange={(e) => setPerguntaForm({ ...perguntaForm, texto: e.target.value })}
                placeholder="Digite a pergunta"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={perguntaForm.ativo}
                onCheckedChange={(checked) => setPerguntaForm({ ...perguntaForm, ativo: checked })}
              />
              <Label>Ativa</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPerguntaDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePergunta}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Opção */}
      <Dialog open={showOpcaoDialog} onOpenChange={setShowOpcaoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingOpcao ? "Editar Opção" : "Nova Opção"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Texto da Opção</Label>
              <Input
                value={opcaoForm.texto}
                onChange={(e) => setOpcaoForm({ ...opcaoForm, texto: e.target.value })}
                placeholder="Texto da resposta"
              />
            </div>
            <div>
              <Label>Pontuação</Label>
              <Input
                type="number"
                value={opcaoForm.valor_pontuacao}
                onChange={(e) => setOpcaoForm({ ...opcaoForm, valor_pontuacao: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>Categoria (opcional)</Label>
              <Input
                value={opcaoForm.categoria}
                onChange={(e) => setOpcaoForm({ ...opcaoForm, categoria: e.target.value })}
                placeholder="Ex: introvertido, extrovertido"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOpcaoDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveOpcao}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showResultadoDialog} onOpenChange={setShowResultadoDialog}>
        <DialogContent className="max-w-lg max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{editingResultado ? "Editar Resultado" : "Novo Resultado"}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-4 p-1">
              <div>
                <Label>Título Simbólico</Label>
                <Input
                  value={resultadoForm.titulo_simbolico}
                  onChange={(e) => setResultadoForm({ ...resultadoForm, titulo_simbolico: e.target.value })}
                  placeholder="Ex: A Guardiã Interior"
                />
              </div>
              <div>
                <Label>Texto Interpretativo</Label>
                <Textarea
                  value={resultadoForm.texto_interpretativo}
                  onChange={(e) => setResultadoForm({ ...resultadoForm, texto_interpretativo: e.target.value })}
                  placeholder="Descrição do resultado"
                  rows={4}
                />
              </div>
              <ImageUpload
                value={resultadoForm.imagem_url}
                onChange={(url) => setResultadoForm({ ...resultadoForm, imagem_url: url })}
                folder="quiz-resultados"
                label="Imagem do Resultado"
                aspectRatio="video"
                showGallery={true}
              />
              <div>
                <Label>URL do Vídeo (opcional)</Label>
                <Input
                  value={resultadoForm.video_url}
                  onChange={(e) => setResultadoForm({ ...resultadoForm, video_url: e.target.value })}
                  placeholder="https://youtube.com/..."
                />
              </div>
              <div>
                <Label>URL do Áudio (opcional)</Label>
                <Input
                  value={resultadoForm.audio_url}
                  onChange={(e) => setResultadoForm({ ...resultadoForm, audio_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Pontuação Mínima</Label>
                  <Input
                    type="number"
                    value={resultadoForm.pontuacao_minima}
                    onChange={(e) => setResultadoForm({ ...resultadoForm, pontuacao_minima: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Pontuação Máxima</Label>
                  <Input
                    type="number"
                    value={resultadoForm.pontuacao_maxima}
                    onChange={(e) => setResultadoForm({ ...resultadoForm, pontuacao_maxima: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Categoria (alternativa a pontuação)</Label>
                <Input
                  value={resultadoForm.categoria}
                  onChange={(e) => setResultadoForm({ ...resultadoForm, categoria: e.target.value })}
                  placeholder="Ex: introvertido"
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResultadoDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveResultado}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
