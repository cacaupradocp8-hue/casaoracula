import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DoorOpen, BookOpen, History, FileText, Loader2, Compass } from "lucide-react";
import { useLabirintoPortas, useCreateLeitura, useLabirintoLeituras, type LabirintoPorta } from "@/hooks/useLabirinto";
import { useAuth } from "@/contexts/AuthContext";
import { canAccessFeature } from "@/types/portal";
import { cn } from "@/lib/utils";
import { useCopy } from "@/hooks/useCopy";

const LABIRINTO_INTRO_KEY = "labirinto-intro-seen";

// Introductory screen component - PROTOCOLO (não oráculo)
function LabirintoIntro({ onEnter }: { onEnter: () => void }) {
  return (
    <AppLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-xl text-center space-y-8">
          <Compass className="w-16 h-16 text-gold mx-auto" />
          
          <h1 className="font-display text-3xl md:text-4xl text-gold">
            Labirinto das 39 Portas
          </h1>
          
          <Card className="border-gold/30 bg-card/50">
            <CardContent className="p-6 space-y-4 text-left">
              <p className="text-foreground leading-relaxed">
                Este módulo é um <strong>protocolo de leitura simbólica em 5 camadas</strong>.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Ele não funciona por consulta, sorteio ou intuição.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                A Porta a ser trabalhada deve ser <strong>indicada pela formação</strong> ou 
                escolhida conscientemente pela facilitadora.
              </p>
            </CardContent>
          </Card>
          
          <Button
            onClick={onEnter}
            size="lg"
            className="bg-gold hover:bg-gold/90 text-background gap-2"
          >
            <Compass className="w-5 h-5" />
            Iniciar Procedimento
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

export default function LabirintoHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: portas, isLoading } = useLabirintoPortas();
  const { data: leituras, isLoading: leiturasLoading } = useLabirintoLeituras();
  const createLeitura = useCreateLeitura();
  const [showIntro, setShowIntro] = useState<boolean | null>(null);
  const { getCopyByKey } = useCopy();

  // Check if this is the user's first visit
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem(LABIRINTO_INTRO_KEY);
    
    if (hasSeenIntro === "true") {
      setShowIntro(false);
    } else if (leituras && leituras.length > 0) {
      // User already has readings, skip intro
      setShowIntro(false);
      localStorage.setItem(LABIRINTO_INTRO_KEY, "true");
    } else if (leituras !== undefined && !leiturasLoading) {
      // No readings and data is loaded - show intro
      setShowIntro(true);
    }
  }, [leituras, leiturasLoading]);

  const handleEnterLabirinto = () => {
    localStorage.setItem(LABIRINTO_INTRO_KEY, "true");
    setShowIntro(false);
  };

  const handlePortaClick = async (portaId: string) => {
    await createLeitura.mutateAsync({
      porta_id: portaId,
      metodo_ativacao: "manual",
    });
    navigate(`/labirinto/porta/${portaId}`);
  };

  const userPortal = user?.portal || "visitante";
  const canAccessProfessional = canAccessFeature(userPortal, "iniciada");

  // Loading state while determining if we should show intro
  if (showIntro === null || leiturasLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  // Show introductory screen on first visit
  if (showIntro) {
    return <LabirintoIntro onEnter={handleEnterLabirinto} />;
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <DoorOpen className="w-10 h-10 text-gold" />
            <h1 className="font-display text-3xl md:text-4xl text-gold">
              Labirinto das 39 Portas
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Protocolo de leitura simbólica em 5 camadas.
            Selecione a Porta indicada pela formação.
          </p>
        </div>

        {/* Aviso do Protocolo */}
        <Card className="border-gold/30 bg-card/50 backdrop-blur">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              A Porta deve ser <strong>escolhida conscientemente</strong> ou indicada pelo processo formativo.
              <br />
              Este módulo não funciona por consulta, sorteio ou intuição.
            </p>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="portas" className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-1 bg-muted/50">
            <TabsTrigger value="portas" className="gap-2">
              <DoorOpen className="w-4 h-4" />
              Portas
            </TabsTrigger>
            <TabsTrigger value="historico" className="gap-2">
              <History className="w-4 h-4" />
              Histórico
            </TabsTrigger>
            {canAccessProfessional && (
              <>
                <TabsTrigger value="casos" className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  Casos Espelho
                </TabsTrigger>
                <TabsTrigger value="manual" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Manual
                </TabsTrigger>
              </>
            )}
          </TabsList>

          {/* Portas Grid */}
          <TabsContent value="portas" className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
                {portas?.map((porta) => (
                  <button
                    key={porta.id}
                    onClick={() => handlePortaClick(porta.id)}
                    className={cn(
                      "group relative aspect-square rounded-lg overflow-hidden",
                      "border border-border/50 hover:border-gold/50 transition-all",
                      "bg-card/30 hover:bg-card/50"
                    )}
                  >
                    {(porta.ai_generated_image_url || porta.imagem_url) ? (
                      <img
                        src={porta.ai_generated_image_url || porta.imagem_url || ""}
                        alt={porta.nome}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <DoorOpen className="w-8 h-8 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                      <span className="font-display text-2xl text-gold/80 group-hover:text-gold transition-colors">
                        {porta.numero}
                      </span>
                      <span className="text-xs text-center text-muted-foreground/70 line-clamp-2 group-hover:text-foreground/80 transition-colors">
                        {porta.nome.replace("Porta ", "").replace("da ", "").replace("do ", "")}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Histórico */}
          <TabsContent value="historico">
            <LabirintoHistorico />
          </TabsContent>

          {/* Casos Espelho */}
          <TabsContent value="casos">
            <LabirintoCasosEspelho portas={portas || []} />
          </TabsContent>

          {/* Manual */}
          <TabsContent value="manual">
            <LabirintoManual />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

// Sub-components
function LabirintoHistorico() {
  const { data: leituras, isLoading } = useLabirintoLeituras();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!leituras || leituras.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center text-muted-foreground">
          <History className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Você ainda não acessou nenhuma porta.</p>
          <p className="text-sm mt-2">Suas sessões aparecerão aqui.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {leituras.map((leitura) => (
        <Card
          key={leitura.id}
          className="cursor-pointer hover:border-gold/30 transition-colors"
          onClick={() => navigate(`/labirinto/porta/${leitura.porta_id}`)}
        >
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
              {leitura.porta?.ai_generated_image_url || leitura.porta?.imagem_url ? (
                <img
                  src={leitura.porta?.ai_generated_image_url || leitura.porta?.imagem_url || ""}
                  alt=""
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <DoorOpen className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <div className="font-medium">{leitura.porta?.nome}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <span>Sessão</span>
                <span>•</span>
                <span>
                  {new Date(leitura.created_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
            {leitura.reflexoes && (
              <FileText className="w-4 h-4 text-gold" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function LabirintoCasosEspelho({ portas }: { portas: LabirintoPorta[] }) {
  const navigate = useNavigate();
  
  const portasComCaso = portas.filter(
    (p) => p.caso_espelho_titulo || p.caso_espelho_frase_chegada
  );

  if (portasComCaso.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Nenhum caso espelho configurado ainda.</p>
          <p className="text-sm mt-2">Esta seção é para facilitadoras.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {portasComCaso.map((porta) => (
        <Card
          key={porta.id}
          className="cursor-pointer hover:border-gold/30 transition-colors"
          onClick={() => navigate(`/labirinto/porta/${porta.id}?tab=caso`)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded bg-muted flex items-center justify-center font-display text-gold">
                {porta.numero}
              </div>
              <div className="flex-1">
                <div className="font-medium">{porta.nome}</div>
                {porta.caso_espelho_titulo && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {porta.caso_espelho_titulo}
                  </div>
                )}
                {porta.caso_espelho_frase_chegada && (
                  <div className="text-sm italic text-muted-foreground/70 mt-2">
                    "{porta.caso_espelho_frase_chegada}"
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function LabirintoManual() {
  return (
    <Card>
      <CardContent className="p-8 space-y-6">
        <div className="space-y-4">
          <h2 className="font-display text-xl text-gold">Manual da Facilitadora</h2>
          <p className="text-muted-foreground">
            O Labirinto das 39 Portas é um <strong>protocolo formativo</strong>, 
            não um sistema de diagnóstico, interpretação ou prescrição.
            Cada porta situa um campo psíquico — não oferece respostas.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Princípios Fundamentais</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-gold mt-1">•</span>
              <span>Não explique a porta. Sustente o campo.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold mt-1">•</span>
              <span>A cliente conduz a leitura — você testemunha.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold mt-1">•</span>
              <span>Silêncio é parte da técnica.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold mt-1">•</span>
              <span>Quando em dúvida, não faça nada.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold mt-1">•</span>
              <span>Cada porta tem seu tempo. Não apresse travessias.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Uso Correto</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-gold mt-1">•</span>
              <span>A Porta deve ser indicada pela formação ou escolhida conscientemente.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold mt-1">•</span>
              <span>Não use por "intuição" ou "sorteio" — isso quebra o protocolo.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold mt-1">•</span>
              <span>Siga as 5 camadas em ordem. Não pule etapas.</span>
            </li>
          </ul>
        </div>

        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground/60">
            Este é um material de uso profissional, destinado a facilitadoras
            que passaram pela formação completa da Casa Orácula.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
