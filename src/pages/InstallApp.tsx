import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Smartphone, Share, Plus, Check, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const InstallApp = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-gold/20 bg-card/50 backdrop-blur">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-gold">App Instalado!</CardTitle>
            <CardDescription className="text-foreground/70">
              Casa ORÁCULA já está no seu dispositivo.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate("/welcome")} variant="gold" className="w-full">
              Entrar no App
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-gold/20 bg-card/50 backdrop-blur">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mb-4">
            <Moon className="w-8 h-8 text-gold" />
          </div>
          <CardTitle className="text-2xl text-gold">Casa ORÁCULA</CardTitle>
          <CardDescription className="text-foreground/70">
            Instale o app para uma experiência completa
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {isIOS ? (
            <div className="space-y-4">
              <p className="text-sm text-foreground/70 text-center">
                Para instalar no iPhone/iPad:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                    <Share className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">1. Toque em Compartilhar</p>
                    <p className="text-xs text-foreground/60">Na barra do Safari</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                    <Plus className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">2. Adicionar à Tela de Início</p>
                    <p className="text-xs text-foreground/60">Role para encontrar a opção</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                    <Smartphone className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">3. Confirme a instalação</p>
                    <p className="text-xs text-foreground/60">O app aparecerá na sua tela inicial</p>
                  </div>
                </div>
              </div>
            </div>
          ) : deferredPrompt ? (
            <Button onClick={handleInstall} variant="gold" className="w-full" size="lg">
              <Download className="mr-2 h-5 w-5" />
              Instalar App
            </Button>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm text-foreground/70">
                Use o menu do navegador para instalar o app
              </p>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                  <Download className="w-4 h-4 text-gold" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">Menu → Instalar app</p>
                  <p className="text-xs text-foreground/60">Ou "Adicionar à tela inicial"</p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-border/50">
            <Button
              variant="ghost"
              className="w-full text-foreground/60"
              onClick={() => navigate("/welcome")}
            >
              Continuar no navegador
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstallApp;
