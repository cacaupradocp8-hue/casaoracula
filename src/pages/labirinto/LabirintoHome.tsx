import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DoorOpen, BookOpen, History, FileText, Loader2, Compass, Map, Table, HelpCircle, ArrowLeft, Home, ChevronRight } from "lucide-react";
import { useLabirintoPortas, useCreateLeitura, useLabirintoLeituras, type LabirintoPorta } from "@/hooks/useLabirinto";
import { useAuth } from "@/contexts/AuthContext";
import { canAccessFeature } from "@/types/portal";
import { cn } from "@/lib/utils";
import { useCopy } from "@/hooks/useCopy";
import { motion } from "framer-motion";

const LABIRINTO_INTRO_KEY = "labirinto-intro-seen";

// Introductory screen component - PROTOCOLO (não oráculo)
function LabirintoIntro({ onEnter }: { onEnter: () => void }) {
  return (
    <AppLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 relative">
        {/* Background mandala pattern */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute w-[500px] h-[500px] opacity-[0.04] pointer-events-none"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full text-gold">
            <circle cx="100" cy="100" r="90" stroke="currentColor" fill="none" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="70" stroke="currentColor" fill="none" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="50" stroke="currentColor" fill="none" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="30" stroke="currentColor" fill="none" strokeWidth="0.5" />
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={i}
                x1="100" y1="10" x2="100" y2="190"
                stroke="currentColor" strokeWidth="0.3"
                transform={`rotate(${i * 30} 100 100)`}
              />
            ))}
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl text-center space-y-8 relative"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Compass className="w-16 h-16 text-gold mx-auto" />
          </motion.div>
          
          <h1 className="font-display text-3xl md:text-4xl text-gold">
            Labirinto das 39 Portas
          </h1>
          
          <Card className="border-gold/30 bg-card/50 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-10 h-10 border-t border-l border-gold/20 rounded-tl-lg" />
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b border-r border-gold/20 rounded-br-lg" />
            <CardContent className="p-8 space-y-4 text-left">
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
            className="bg-gold hover:bg-gold/90 text-gold-foreground gap-2 shadow-lg shadow-gold/20 hover:shadow-gold/30 transition-shadow"
          >
            <Compass className="w-5 h-5" />
            Iniciar Procedimento
          </Button>
        </motion.div>
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
      setShowIntro(false);
      localStorage.setItem(LABIRINTO_INTRO_KEY, "true");
    } else if (leituras !== undefined && !leiturasLoading) {
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
  const canAccessProfessional = canAccessFeature(userPortal, "oracula");

  if (showIntro === null || leiturasLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  if (showIntro) {
    return <LabirintoIntro onEnter={handleEnterLabirinto} />;
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/ferramentas-metodo')}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar às Ferramentas do Método
        </Button>

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/ferramentas-metodo" className="hover:text-foreground transition-colors">
            Ferramentas do Método
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gold">Labirinto das 39 Portas</span>
        </nav>

        {/* Grand Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-5"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/40" />
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <DoorOpen className="w-12 h-12 text-gold" />
            </motion.div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/40" />
          </div>
          <h1 className="font-display text-3xl md:text-5xl text-gold">
            Labirinto das 39 Portas
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Protocolo de leitura simbólica em 5 camadas.
            <br className="hidden sm:block" />
            Selecione a Porta indicada pela formação.
          </p>
        </motion.div>

        {/* Navigation Links - Legenda e Mapa */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/labirinto/como-usar")}
            className="gap-2 border-gold/20 hover:bg-gold/10 hover:border-gold/40 transition-all"
          >
            <HelpCircle className="w-4 h-4" />
            Como usar o Labirinto
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/labirinto/tipos-de-campo")}
            className="gap-2 border-gold/20 hover:bg-gold/10 hover:border-gold/40 transition-all"
          >
            <Map className="w-4 h-4" />
            Tipos de Campo
          </Button>
          {canAccessProfessional && (
            <Button
              variant="outline"
              onClick={() => navigate("/labirinto/tabela")}
              className="gap-2 border-gold/20 hover:bg-gold/10 hover:border-gold/40 transition-all"
            >
              <Table className="w-4 h-4" />
              Tabela de Referência
            </Button>
          )}
        </div>

        {/* Aviso do Protocolo */}
        <Card className="border-gold/20 bg-gradient-to-r from-card/60 via-gold/5 to-card/60 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-gold/20" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-gold/20" />
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              A Porta deve ser <strong className="text-foreground">escolhida conscientemente</strong> ou indicada pelo processo formativo.
              <br />
              Este módulo não funciona por consulta, sorteio ou intuição.
            </p>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="portas" className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-1 bg-card/50 border border-gold/10">
            <TabsTrigger value="portas" className="gap-2 data-[state=active]:bg-gold/10 data-[state=active]:text-gold">
              <DoorOpen className="w-4 h-4" />
              Portas
            </TabsTrigger>
            <TabsTrigger value="historico" className="gap-2 data-[state=active]:bg-gold/10 data-[state=active]:text-gold">
              <History className="w-4 h-4" />
              Histórico
            </TabsTrigger>
            {canAccessProfessional && (
              <>
                <TabsTrigger value="casos" className="gap-2 data-[state=active]:bg-gold/10 data-[state=active]:text-gold">
                  <BookOpen className="w-4 h-4" />
                  Casos Espelho
                </TabsTrigger>
                <TabsTrigger value="manual" className="gap-2 data-[state=active]:bg-gold/10 data-[state=active]:text-gold">
                  <FileText className="w-4 h-4" />
                  Manual
                </TabsTrigger>
              </>
            )}
          </TabsList>

          {/* Portas Grid — Cinematic Cards */}
          <TabsContent value="portas" className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
                {portas?.map((porta, index) => (
                  <motion.button
                    key={porta.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    onClick={() => handlePortaClick(porta.id)}
                    className={cn(
                      "group relative aspect-square rounded-lg overflow-hidden",
                      "border border-gold/10 hover:border-gold/40 transition-all duration-500",
                      "bg-card/30 hover:bg-card/50",
                      "hover:shadow-lg hover:shadow-gold/10"
                    )}
                  >
                    {(porta.ai_generated_image_url || porta.imagem_url) ? (
                      <img
                        src={porta.ai_generated_image_url || porta.imagem_url || ""}
                        alt={porta.nome}
                        className="w-full h-full object-cover opacity-50 group-hover:opacity-75 group-hover:scale-110 transition-all duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-card/80 to-muted/30">
                        <DoorOpen className="w-8 h-8 text-muted-foreground/20" />
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                      <span className="font-display text-2xl text-gold/70 group-hover:text-gold transition-colors duration-300 drop-shadow-lg">
                        {porta.numero}
                      </span>
                      <span className="text-[10px] text-center text-muted-foreground/60 line-clamp-2 group-hover:text-foreground/70 transition-colors duration-300">
                        {porta.nome.replace("Porta ", "").replace("da ", "").replace("do ", "")}
                      </span>
                    </div>
                    {/* Hover glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none border border-gold/20 rounded-lg" />
                  </motion.button>
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
      <Card className="border-dashed border-gold/10">
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
      {leituras.map((leitura, index) => (
        <motion.div
          key={leitura.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card
            className="cursor-pointer border-gold/10 hover:border-gold/30 bg-card/50 hover:bg-card/70 transition-all duration-300 hover:shadow-md hover:shadow-gold/5"
            onClick={() => navigate(`/labirinto/porta/${leitura.porta_id}`)}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center border border-gold/10">
                {leitura.porta?.ai_generated_image_url || leitura.porta?.imagem_url ? (
                  <img
                    src={leitura.porta?.ai_generated_image_url || leitura.porta?.imagem_url || ""}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <DoorOpen className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-foreground">{leitura.porta?.nome}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <span>Sessão</span>
                  <span className="text-gold/30">•</span>
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
        </motion.div>
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
      <Card className="border-dashed border-gold/10">
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
      {portasComCaso.map((porta, index) => (
        <motion.div
          key={porta.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card
            className="cursor-pointer border-gold/10 hover:border-gold/30 bg-card/50 hover:bg-card/70 transition-all duration-300"
            onClick={() => navigate(`/labirinto/porta/${porta.id}?tab=caso`)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded bg-gold/10 flex items-center justify-center font-display text-gold border border-gold/20">
                  {porta.numero}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground">{porta.nome}</div>
                  {porta.caso_espelho_titulo && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {porta.caso_espelho_titulo}
                    </div>
                  )}
                  {porta.caso_espelho_frase_chegada && (
                    <div className="text-sm italic text-gold/50 mt-2">
                      "{porta.caso_espelho_frase_chegada}"
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function LabirintoManual() {
  return (
    <Card className="border-gold/10 bg-card/50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-gold/15" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-gold/15" />
      <CardContent className="p-8 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-gold/20 to-transparent" />
            <h2 className="font-display text-xl text-gold">Manual da Facilitadora</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-gold/20 to-transparent" />
          </div>
          <p className="text-muted-foreground text-center max-w-xl mx-auto">
            O Labirinto das 39 Portas é um <strong className="text-foreground">protocolo formativo</strong>, 
            não um sistema de diagnóstico, interpretação ou prescrição.
            Cada porta situa um campo psíquico — não oferece respostas.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gold/80">Princípios Fundamentais</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {[
              "Não explique a porta. Sustente o campo.",
              "A cliente conduz a leitura — você testemunha.",
              "Silêncio é parte da técnica.",
              "Quando em dúvida, não faça nada.",
              "Cada porta tem seu tempo. Não apresse travessias.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-gold mt-0.5 text-lg">✧</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        <div className="space-y-4">
          <h3 className="font-medium text-gold/80">Uso Correto</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {[
              "A Porta deve ser indicada pela formação ou escolhida conscientemente.",
              "Não use por \"intuição\" ou \"sorteio\" — isso quebra o protocolo.",
              "Siga as 5 camadas em ordem. Não pule etapas.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-gold mt-0.5 text-lg">✧</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
