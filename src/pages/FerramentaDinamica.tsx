import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useFerramentaDinamica } from "@/hooks/useFerramentaDinamica";
import { ContentPageLayout } from "@/components/shared/ContentPageLayout";
import { ModularPageRenderer } from "@/components/modular/ModularPageRenderer";
import { LockedContent, LOCKED_MESSAGES } from "@/components/shared/LockedContent";
import { Loader2 } from "lucide-react";

export default function FerramentaDinamica() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { ferramenta, isLoading, error, hasAccess } = useFerramentaDinamica(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (error || !ferramenta) {
    return <Navigate to="/ferramentas" replace />;
  }

  const handleBack = () => navigate("/ferramentas");

  if (!hasAccess) {
    return (
      <ContentPageLayout
        title={ferramenta.ferramenta_nome}
        subtitle="Conteúdo bloqueado"
        onBack={handleBack}
        backLabel="Voltar para Ferramentas"
      >
        <LockedContent message={LOCKED_MESSAGES.ferramenta} />
      </ContentPageLayout>
    );
  }

  // Ferramenta com blocos modulares
  if (ferramenta.has_blocks) {
    return (
      <ContentPageLayout
        title={ferramenta.ferramenta_nome}
        subtitle={ferramenta.ferramenta_descricao}
        onBack={handleBack}
        backLabel="Voltar para Ferramentas"
      >
        <ModularPageRenderer
          contextType="tool"
          contextId={ferramenta.id}
          fallback={
            <div className="text-center py-12 text-muted-foreground">
              <p>Esta ferramenta ainda não possui conteúdo configurado.</p>
              <p className="text-sm mt-2">
                Adicione blocos no painel de administração.
              </p>
            </div>
          }
        />
      </ContentPageLayout>
    );
  }

  // Ferramenta sem blocos - placeholder
  return (
    <ContentPageLayout
      title={ferramenta.ferramenta_nome}
      subtitle={ferramenta.ferramenta_descricao}
      onBack={handleBack}
      backLabel="Voltar para Ferramentas"
    >
      <div className="text-center py-12 text-muted-foreground">
        <p>Esta ferramenta está em construção.</p>
        <p className="text-sm mt-2">
          Ative o modo de blocos no painel de administração para adicionar conteúdo.
        </p>
      </div>
    </ContentPageLayout>
  );
}
