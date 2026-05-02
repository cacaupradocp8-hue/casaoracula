import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableIcon, Loader2, Shield, Circle, Droplets, Flame, Sparkles, RotateCcw } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useLabirintoPortas } from "@/hooks/useLabirinto";
import { useAuth } from "@/contexts/AuthContext";
import { canAccessFeature } from "@/types/portal";
import { cn } from "@/lib/utils";
import { BackButton } from "@/components/navigation/BackButton";
import { PageBreadcrumb } from "@/components/navigation/PageBreadcrumb";

const TIPO_CAMPO_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  limiar: { label: "Limiar", icon: Sparkles, color: "text-purple-400" },
  retencao: { label: "Retenção", icon: Circle, color: "text-blue-400" },
  defesa: { label: "Defesa", icon: Shield, color: "text-red-400" },
  dissolucao: { label: "Dissolução", icon: Droplets, color: "text-muted-foreground" },
  emergencia: { label: "Emergência", icon: Flame, color: "text-green-400" },
  reintegracao: { label: "Reintegração", icon: RotateCcw, color: "text-gold" },
};

export default function LabirintoTabela() {
  const { user } = useAuth();
  const { data: portas, isLoading } = useLabirintoPortas();

  const userPortal = user?.portal || "visitante";
  const canAccess = canAccessFeature(userPortal, "oracula");

  // Bloqueia acesso para não-profissionais
  if (!canAccess) {
    return <Navigate to="/labirinto" replace />;
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8 min-w-0">
        <BackButton to="/labirinto" label="Voltar ao Labirinto" />

        <PageBreadcrumb
          items={[
            { label: "Ferramentas", href: "/ferramentas-metodo" },
            { label: "Labirinto", href: "/labirinto" },
            { label: "Tabela de Referência" },
          ]}
        />

        {/* Header */}
        <div className="text-center space-y-4">
          <TableIcon className="w-12 h-12 text-gold mx-auto" />
          <h1 className="font-display text-3xl text-gold">
            Tabela de Referência
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Porta × Campo × Postura da Facilitadora
          </p>
        </div>

        {/* Info Card */}
        <Card className="border-gold/30 bg-gold/5">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Esta tabela é material de uso profissional, destinada a facilitadoras
              que passaram pela formação completa.
            </p>
          </CardContent>
        </Card>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Porta</TableHead>
                      <TableHead className="w-[150px]">Tipo de Campo</TableHead>
                      <TableHead>O que o campo revela</TableHead>
                      <TableHead>Postura da Facilitadora</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {portas?.map((porta) => {
                      const config = porta.tipo_campo ? TIPO_CAMPO_CONFIG[porta.tipo_campo] : null;
                      const Icon = config?.icon || Circle;
                      const postura = porta.postura_facilitadora || "—";
                      
                      return (
                        <TableRow 
                          key={porta.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => navigate(`/labirinto/porta/${porta.id}`)}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <span className="text-gold font-display">{porta.numero}</span>
                              <span>{porta.nome}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {config ? (
                              <div className="flex items-center gap-2">
                                <Icon className={cn("w-4 h-4", config.color)} />
                                <span className={config.color}>{config.label}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {porta.forca_ativa || "—"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {postura}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground/60">
            As Portas não revelam respostas.
            Revelam campos que exigem maturidade para serem sustentados.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
