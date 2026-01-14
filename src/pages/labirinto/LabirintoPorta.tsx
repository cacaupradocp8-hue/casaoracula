import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  DoorOpen, 
  Eye, 
  BookOpen, 
  Key, 
  FileText,
  Loader2,
  Save,
  Plus,
  Trash2
} from "lucide-react";
import { 
  useLabirintoPorta, 
  useLabirintoAnotacoes, 
  useCreateAnotacao,
  useDeleteAnotacao
} from "@/hooks/useLabirinto";
import { useAuth } from "@/contexts/AuthContext";
import { canAccessFeature } from "@/types/portal";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function LabirintoPorta() {
  const { portaId } = useParams<{ portaId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "leitura";
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: porta, isLoading } = useLabirintoPorta(portaId);
  const { data: anotacoes } = useLabirintoAnotacoes(portaId);
  const createAnotacao = useCreateAnotacao();
  const deleteAnotacao = useDeleteAnotacao();
  
  const [newNote, setNewNote] = useState("");

  const userPortal = user?.portal || "visitante";
  const canAccessCasoEspelho = canAccessFeature(userPortal, porta?.portal_caso_espelho || "iniciada");
  const canAccessChave = canAccessFeature(userPortal, porta?.portal_chave_facilitadora || "iniciada");

  const handleSaveNote = async () => {
    if (!newNote.trim() || !portaId) return;
    
    try {
      await createAnotacao.mutateAsync({
        porta_id: portaId,
        anotacao: newNote.trim(),
      });
      setNewNote("");
      toast({ title: "Anotação salva" });
    } catch (error) {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm("Excluir esta anotação?")) return;
    try {
      await deleteAnotacao.mutateAsync(id);
      toast({ title: "Anotação excluída" });
    } catch (error) {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  if (!porta) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <DoorOpen className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <h1 className="font-display text-2xl text-muted-foreground">
            Porta não encontrada
          </h1>
          <Button onClick={() => navigate("/labirinto")} className="mt-4">
            Voltar ao Labirinto
          </Button>
        </div>
      </AppLayout>
    );
  }

  const imageUrl = porta.ai_generated_image_url || porta.imagem_url;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/labirinto")}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Labirinto
        </Button>

        {/* Door Header */}
        <div className="relative">
          {/* Image */}
          <div className="aspect-video md:aspect-[21/9] rounded-xl overflow-hidden bg-muted">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={porta.nome}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <DoorOpen className="w-24 h-24 text-muted-foreground/20" />
              </div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex items-end gap-4">
              <span className="font-display text-6xl md:text-7xl text-gold/80">
                {porta.numero}
              </span>
              <div>
                <h1 className="font-display text-2xl md:text-3xl text-foreground">
                  {porta.nome}
                </h1>
                {porta.subtitulo && (
                  <p className="text-muted-foreground">{porta.subtitulo}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue={initialTab} className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-1 bg-muted/50">
            <TabsTrigger value="leitura" className="gap-2">
              <Eye className="w-4 h-4" />
              Leitura
            </TabsTrigger>
            {canAccessCasoEspelho && (
              <TabsTrigger value="caso" className="gap-2">
                <BookOpen className="w-4 h-4" />
                Caso Espelho
              </TabsTrigger>
            )}
            {canAccessChave && (
              <TabsTrigger value="chave" className="gap-2">
                <Key className="w-4 h-4" />
                Chave
              </TabsTrigger>
            )}
            <TabsTrigger value="anotacoes" className="gap-2">
              <FileText className="w-4 h-4" />
              Anotações
            </TabsTrigger>
          </TabsList>

          {/* Leitura Tab */}
          <TabsContent value="leitura" className="space-y-6">
            {/* Cena Narrativa */}
            {porta.cena_narrativa && (
              <Card className="border-gold/20">
                <CardContent className="p-6">
                  <p className="text-lg leading-relaxed text-foreground/90 italic">
                    {porta.cena_narrativa}
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {/* Eixo Psíquico */}
              {porta.eixo_psiquico && (
                <Card>
                  <CardContent className="p-5">
                    <h3 className="text-sm font-medium text-gold mb-2">Eixo Psíquico</h3>
                    <p className="text-muted-foreground">{porta.eixo_psiquico}</p>
                  </CardContent>
                </Card>
              )}

              {/* Risco Clínico */}
              {porta.risco_clinico && (
                <Card className="border-destructive/30">
                  <CardContent className="p-5">
                    <h3 className="text-sm font-medium text-destructive/80 mb-2">
                      Atenção Clínica
                    </h3>
                    <p className="text-muted-foreground">{porta.risco_clinico}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Pergunta Chave */}
            {porta.pergunta_chave && (
              <Card className="bg-card/50">
                <CardContent className="p-6 text-center">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Pergunta-Chave
                  </h3>
                  <p className="font-display text-xl text-gold">
                    {porta.pergunta_chave}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Empty state */}
            {!porta.cena_narrativa && !porta.eixo_psiquico && !porta.pergunta_chave && (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <p>Esta porta ainda não foi configurada.</p>
                  <p className="text-sm mt-2">O conteúdo será adicionado em breve.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Caso Espelho Tab */}
          <TabsContent value="caso" className="space-y-6">
            {porta.caso_espelho_titulo || porta.caso_espelho_frase_chegada ? (
              <>
                {porta.caso_espelho_titulo && (
                  <h2 className="font-display text-xl text-gold">
                    {porta.caso_espelho_titulo}
                  </h2>
                )}

                {porta.caso_espelho_frase_chegada && (
                  <Card className="bg-muted/30">
                    <CardContent className="p-6">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Frase de Chegada
                      </h3>
                      <p className="text-lg italic">"{porta.caso_espelho_frase_chegada}"</p>
                    </CardContent>
                  </Card>
                )}

                {porta.caso_espelho_erro_comum && (
                  <Card className="border-orange-500/30">
                    <CardContent className="p-6">
                      <h3 className="text-sm font-medium text-orange-500/80 mb-2">
                        Erro Comum da Facilitadora
                      </h3>
                      <p className="text-muted-foreground">{porta.caso_espelho_erro_comum}</p>
                    </CardContent>
                  </Card>
                )}

                {porta.caso_espelho_como_sustentar && (
                  <Card className="border-gold/20">
                    <CardContent className="p-6">
                      <h3 className="text-sm font-medium text-gold mb-2">
                        Como Sustentar o Campo
                      </h3>
                      <p className="text-muted-foreground">{porta.caso_espelho_como_sustentar}</p>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>Caso espelho ainda não configurado.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Chave Tab */}
          <TabsContent value="chave" className="space-y-6">
            {porta.chave_frase_ancora || porta.chave_o_que_nao_fazer ? (
              <>
                {porta.chave_frase_ancora && (
                  <Card className="border-gold/30 bg-gold/5">
                    <CardContent className="p-6 text-center">
                      <h3 className="text-sm font-medium text-gold mb-3">Frase Âncora</h3>
                      <p className="font-display text-lg">{porta.chave_frase_ancora}</p>
                    </CardContent>
                  </Card>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  {porta.chave_o_que_nao_fazer && (
                    <Card className="border-destructive/30">
                      <CardContent className="p-5">
                        <h3 className="text-sm font-medium text-destructive/80 mb-2">
                          O que NÃO fazer
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {porta.chave_o_que_nao_fazer}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {porta.chave_quando_parar && (
                    <Card>
                      <CardContent className="p-5">
                        <h3 className="text-sm font-medium text-gold mb-2">
                          Quando Parar
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {porta.chave_quando_parar}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {porta.chave_sinal_maturidade && (
                  <Card className="bg-muted/30">
                    <CardContent className="p-6">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Sinal de Maturidade Clínica
                      </h3>
                      <p className="text-foreground/80">{porta.chave_sinal_maturidade}</p>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <Key className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>Chave da facilitadora ainda não configurada.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Anotações Tab */}
          <TabsContent value="anotacoes" className="space-y-6">
            {/* New note form */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Textarea
                  placeholder="Escreva uma anotação sobre esta porta..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveNote}
                    disabled={!newNote.trim() || createAnotacao.isPending}
                    className="gap-2"
                  >
                    {createAnotacao.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notes list */}
            {anotacoes && anotacoes.length > 0 ? (
              <div className="space-y-3">
                {anotacoes.map((nota) => (
                  <Card key={nota.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-foreground/90 whitespace-pre-wrap">
                            {nota.anotacao}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(nota.created_at).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteNote(nota.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>Nenhuma anotação para esta porta.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
