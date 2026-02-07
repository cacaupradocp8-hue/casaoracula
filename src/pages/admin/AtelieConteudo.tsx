import { useState } from "react";
import { Palette, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AtelieFormulario from "@/components/admin/atelie/AtelieFormulario";
import AtelieResultado from "@/components/admin/atelie/AtelieResultado";
import AtelieHistorico from "@/components/admin/atelie/AtelieHistorico";
import { GenerateContentInput } from "@/hooks/useAtelieConteudo";

interface GeneratedContent {
  raw_content: string;
  sections: Record<string, string>;
  input: GenerateContentInput;
}

export default function AtelieConteudo() {
  // Note: Admin access is already enforced by ProtectedRoute in App.tsx
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  const handleGenerated = (content: GeneratedContent) => {
    setGeneratedContent(content);
  };

  const handleSaved = () => {
    setGeneratedContent(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gold/10">
                <Palette className="h-6 w-6 text-gold" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Ateliê de Conteúdo</h1>
                <p className="text-sm text-muted-foreground">
                  Geração de Portais e Aulas com IA
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <AtelieFormulario onGenerated={handleGenerated} />
          </div>

          {/* Right Column - Result or History */}
          <div className="space-y-6">
            {generatedContent ? (
              <AtelieResultado
                rawContent={generatedContent.raw_content}
                sections={generatedContent.sections}
                input={generatedContent.input}
                onSaved={handleSaved}
              />
            ) : (
              <AtelieHistorico />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
