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
  BookOpen, 
  Key, 
  FileText,
  Loader2,
  Plus,
  Trash2,
  Shield,
  Flame,
  Droplets,
  Sparkles,
  Circle,
  Layers,
  AlertTriangle,
  Volume2
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
import { PortaAudioPlayer } from "@/components/labirinto/PortaAudioPlayer";

// Mapeamento de tipos de campo para exibição
const TIPO_CAMPO_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  limiar: { label: "Limiar", icon: Sparkles, color: "text-purple-400" },
  retencao: { label: "Retenção", icon: Circle, color: "text-blue-400" },
  defesa: { label: "Defesa", icon: Shield, color: "text-orange-400" },
  dissolucao: { label: "Dissolução", icon: Droplets, color: "text-muted-foreground" },
  emergencia: { label: "Emergência", icon: Flame, color: "text-emerald-400" },
  reintegracao: { label: "Reintegração", icon: Layers, color: "text-gold" },
};

// Bloco fixo do Diálogo da Sombra Somática (idêntico para todos os casos)
const DIALOGO_SOMBRA_SOMATICA = {
  introducao: "O corpo não explica o campo. Ele registra o que a psique sustenta em silêncio.",
  perguntas: [
    "Onde o corpo reage primeiro ao campo desta Porta?",
    "A reação é de contração, peso, rigidez ou ausência?",
    "Há um impulso corporal interrompido?",
    "O corpo pede movimento ou contenção?"
  ],
  registro: "Registro somático objetivo, sem interpretação.",
  aviso: "O corpo não deve ser forçado a falar. Aqui, ele apenas é escutado."
};

// Tela de Contexto Obrigatória antes de mostrar conteúdo
function TelaContextoProtocolo({ onProsseguir }: { onProsseguir: () => void }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-6">
        <AlertTriangle className="w-12 h-12 text-gold mx-auto" />
        
        <h2 className="font-display text-2xl text-gold">
          Contexto da Porta
        </h2>
        
        <Card className="border-gold/30 bg-card/50">
          <CardContent className="p-6 space-y-4 text-left">
            <p className="text-foreground leading-relaxed">
              Esta Porta <strong>não oferece significado</strong>.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Ela apenas <strong>situa um campo psíquico</strong>.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Se você espera respostas, esta não é a ferramenta adequada.
            </p>
            <p className="text-foreground leading-relaxed font-medium">
              Avance apenas se estiver disposta a sustentar o processo sem concluir.
            </p>
          </CardContent>
        </Card>
        
        <Button
          onClick={onProsseguir}
          size="lg"
          className="bg-gold hover:bg-gold/90 text-background gap-2"
        >
          <Layers className="w-5 h-5" />
          Prosseguir com o Protocolo
        </Button>
      </div>
    </div>
  );
}

export default function LabirintoPorta() {
  const { portaId } = useParams<{ portaId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "camadas";
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: porta, isLoading } = useLabirintoPorta(portaId);
  const { data: anotacoes } = useLabirintoAnotacoes(portaId);
  const createAnotacao = useCreateAnotacao();
  const deleteAnotacao = useDeleteAnotacao();
  
  const [newNote, setNewNote] = useState("");
  const [contextoAceito, setContextoAceito] = useState(false);

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

  // Formatar lista de itens (separados por vírgula ou quebra de linha)
  const formatList = (text: string | null) => {
    if (!text) return [];
    return text.split(/[,\n]/).map(item => item.trim()).filter(Boolean);
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

  // Mostrar tela de contexto obrigatória antes do conteúdo
  if (!contextoAceito) {
    return (
      <AppLayout>
        {/* Back button */}
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/labirinto")}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Labirinto
          </Button>
        </div>

        {/* Door Header minimal */}
        <div className="max-w-xl mx-auto px-4 pt-8 text-center">
          <span className="font-display text-5xl text-gold/80">
            {porta.numero}
          </span>
          <h1 className="font-display text-2xl text-foreground mt-2">
            {porta.nome}
          </h1>
        </div>

        <TelaContextoProtocolo onProsseguir={() => setContextoAceito(true)} />
      </AppLayout>
    );
  }

  const imageUrl = porta.ai_generated_image_url || porta.imagem_url;
  const tipoCampoConfig = porta.tipo_campo ? TIPO_CAMPO_CONFIG[porta.tipo_campo] : null;
  const TipoCampoIcon = tipoCampoConfig?.icon || DoorOpen;

  // Verificar se tem conteúdo do Método ORÁCULA
  const hasMetodoOracula = porta.tipo_campo || porta.forca_ativa || porta.campo_pede || porta.nao_fazer_aqui;
  // Verificar se tem conteúdo legado
  const hasLegacy = porta.cena_narrativa || porta.pergunta_chave;

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

        {/* Audio Player - Se tiver áudio */}
        {porta.audio_url && (
          <PortaAudioPlayer 
            audioUrl={porta.audio_url} 
            audioTitulo={porta.audio_titulo}
          />
        )}

        {/* Content Tabs - CAMADAS como foco principal */}
        <Tabs defaultValue={initialTab} className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-1 bg-muted/50">
            <TabsTrigger value="camadas" className="gap-2">
              <Layers className="w-4 h-4" />
              Camadas
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

          {/* Camadas Tab - Foco Principal (5 camadas do protocolo) */}
          <TabsContent value="camadas" className="space-y-6">
            {hasMetodoOracula ? (
              <>
                {/* Camada 1: Campo que esta Porta revela */}
                {porta.tipo_campo && (
                  <Card className="border-gold/30 bg-gradient-to-br from-gold/5 to-transparent">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-medium">
                          1
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                          Campo que esta Porta revela
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 ml-11">
                        <TipoCampoIcon className={cn("w-5 h-5", tipoCampoConfig?.color)} />
                        <p className="text-lg text-foreground">
                          Esta Porta revela um campo de{" "}
                          <span className={cn("font-semibold", tipoCampoConfig?.color)}>
                            {tipoCampoConfig?.label || porta.tipo_campo}
                          </span>.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Camada 2: O que está ativo nesse campo */}
                {porta.forca_ativa && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground font-medium">
                          2
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                          O que está ativo nesse campo
                        </h3>
                      </div>
                      <p className="text-foreground/90 leading-relaxed ml-11">
                        {porta.forca_ativa}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Camada 3: O que este campo pede */}
                {porta.campo_pede && (
                  <Card className="border-gold/20">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-medium">
                          3
                        </div>
                        <h3 className="text-sm font-medium text-gold uppercase tracking-wide">
                          O que este campo pede
                        </h3>
                      </div>
                      <ul className="space-y-1 ml-11">
                        {formatList(porta.campo_pede).map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-foreground/90">
                            <span className="text-gold">–</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Camada 4: O que NÃO deve ser feito aqui */}
                {porta.nao_fazer_aqui && (
                  <Card className="border-destructive/30 bg-destructive/5">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center text-destructive font-medium">
                          4
                        </div>
                        <h3 className="text-sm font-medium text-destructive/80 uppercase tracking-wide">
                          O que NÃO deve ser feito aqui
                        </h3>
                      </div>
                      <ul className="space-y-1 ml-11">
                        {formatList(porta.nao_fazer_aqui).map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-foreground/90">
                            <span className="text-destructive/60">–</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Camada 5: Contexto Narrativo (se existir) */}
                {hasLegacy && (
                  <Card className="border-muted bg-muted/20">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium">
                          5
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                          Contexto Narrativo
                        </h3>
                      </div>
                      <div className="ml-11 space-y-4">
                        {porta.cena_narrativa && (
                          <p className="text-foreground/80 italic leading-relaxed">
                            {porta.cena_narrativa}
                          </p>
                        )}
                        {porta.pergunta_chave && (
                          <div className="pt-3 border-t border-border/50">
                            <p className="text-sm text-muted-foreground mb-1">Pergunta-Chave:</p>
                            <p className="font-display text-lg text-gold">
                              {porta.pergunta_chave}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : hasLegacy ? (
              // Só tem conteúdo legado - mostrar como camadas 1-2
              <>
                {porta.cena_narrativa && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground font-medium">
                          1
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                          Cena Narrativa
                        </h3>
                      </div>
                      <p className="text-foreground/80 italic leading-relaxed ml-11">
                        {porta.cena_narrativa}
                      </p>
                    </CardContent>
                  </Card>
                )}
                {porta.pergunta_chave && (
                  <Card className="border-gold/20">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-medium">
                          2
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                          Pergunta-Chave
                        </h3>
                      </div>
                      <p className="font-display text-xl text-gold ml-11">
                        {porta.pergunta_chave}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              // Empty state
              <Card className="border-dashed">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <p>Esta porta ainda não foi configurada.</p>
                  <p className="text-sm mt-2">O conteúdo será adicionado em breve.</p>
                </CardContent>
              </Card>
            )}

            {/* Rodapé Método ORÁCULA */}
            <div className="text-center text-sm text-muted-foreground border-t pt-6 mt-8">
              <p>As Portas não revelam respostas.</p>
              <p>Revelam campos que exigem maturidade para serem sustentados.</p>
            </div>
          </TabsContent>

          {/* Caso Espelho Tab - Modelo Completo Método ORÁCULA */}
          <TabsContent value="caso" className="space-y-6">
            {/* Aviso formativo */}
            <Card className="border-gold/30 bg-gold/5">
              <CardContent className="p-4">
                <p className="text-sm text-gold text-center">
                  <strong>Uso exclusivo formativo.</strong> Este Caso-Espelho não é atendimento clínico nem exemplo interpretativo.
                </p>
              </CardContent>
            </Card>

            {porta.caso_espelho_titulo || porta.caso_espelho_situacao ? (
              <>
                {/* Título do Caso */}
                {porta.caso_espelho_titulo && (
                  <h2 className="font-display text-xl text-gold text-center">
                    {porta.caso_espelho_titulo}
                  </h2>
                )}

                {/* 1. Situação Simbólica */}
                {porta.caso_espelho_situacao && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-medium">1</div>
                        <h3 className="text-sm font-medium text-gold uppercase tracking-wide">Situação Simbólica</h3>
                      </div>
                      <p className="text-foreground/90 leading-relaxed ml-11">
                        {porta.caso_espelho_situacao}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* 2. Campo Revelado */}
                {porta.tipo_campo && (
                  <Card className="border-muted">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground font-medium">2</div>
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Campo Revelado</h3>
                      </div>
                      <div className="flex items-center gap-3 ml-11">
                        <TipoCampoIcon className={cn("w-5 h-5", tipoCampoConfig?.color)} />
                        <p className="text-foreground/90">
                          Esta situação revela um campo de{" "}
                          <span className={cn("font-semibold", tipoCampoConfig?.color)}>
                            {tipoCampoConfig?.label || porta.tipo_campo}
                          </span>.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 3. Risco comum de erro da facilitadora */}
                {porta.caso_espelho_erros_facilitadora && (
                  <Card className="border-orange-500/30 bg-orange-500/5">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-medium">3</div>
                        <h3 className="text-sm font-medium text-orange-500/80 uppercase tracking-wide">Risco comum de erro da facilitadora</h3>
                      </div>
                      <p className="text-sm text-muted-foreground ml-11 mb-2">
                        Diante deste campo, a facilitadora tende a errar quando tenta:
                      </p>
                      <ul className="space-y-1 ml-11">
                        {formatList(porta.caso_espelho_erros_facilitadora).map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-foreground/90">
                            <span className="text-orange-500/60 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* 4. Postura correta da facilitadora */}
                {porta.caso_espelho_postura_correta && (
                  <Card className="border-gold/30 bg-gold/5">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-medium">4</div>
                        <h3 className="text-sm font-medium text-gold uppercase tracking-wide">Postura correta da facilitadora</h3>
                      </div>
                      <p className="text-sm text-muted-foreground ml-11 mb-2">
                        A postura correta neste campo é:
                      </p>
                      <ul className="space-y-1 ml-11">
                        {formatList(porta.caso_espelho_postura_correta).map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-foreground/90">
                            <span className="text-gold mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* 5. Diálogo da Sombra Somática (Bloco Fixo) */}
                <Card className="border-muted bg-muted/30">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground font-medium">5</div>
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Diálogo da Sombra Somática</h3>
                    </div>
                    <div className="ml-11 space-y-4">
                      <p className="text-foreground/80 italic">
                        {DIALOGO_SOMBRA_SOMATICA.introducao}
                      </p>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Perguntas de observação:</p>
                        <ul className="space-y-1">
                          {DIALOGO_SOMBRA_SOMATICA.perguntas.map((pergunta, i) => (
                            <li key={i} className="flex items-start gap-2 text-foreground/80 text-sm">
                              <span className="text-muted-foreground mt-0.5">–</span>
                              <span>{pergunta}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="pt-3 border-t border-border/50">
                        <p className="text-sm text-muted-foreground mb-1">Registro permitido:</p>
                        <p className="text-foreground/80 text-sm">{DIALOGO_SOMBRA_SOMATICA.registro}</p>
                      </div>
                      
                      <div className="pt-3 border-t border-border/50 bg-muted/50 -mx-6 -mb-6 p-4 rounded-b-lg">
                        <p className="text-sm text-muted-foreground italic flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{DIALOGO_SOMBRA_SOMATICA.aviso}</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 6. Encerramento ético */}
                <Card className="border-gold/20">
                  <CardContent className="p-6 text-center space-y-3">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-medium">6</div>
                      <h3 className="text-sm font-medium text-gold uppercase tracking-wide">Encerramento Ético</h3>
                    </div>
                    <p className="text-foreground/80 leading-relaxed">
                      Este Caso-Espelho não pede intervenção.
                    </p>
                    <p className="text-foreground font-medium">
                      Ele pede consciência da postura da facilitadora.
                    </p>
                    <p className="text-muted-foreground text-sm pt-2 border-t border-border/50">
                      A leitura retorna ao campo simbólico.
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>Caso-Espelho ainda não configurado para esta Porta.</p>
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
