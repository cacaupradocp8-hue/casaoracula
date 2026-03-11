import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, BookOpen, GraduationCap, Users, Wrench, User } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.name?.split(" ")[0] || "Usuária";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-4xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard seguro</h1>
          <p className="mt-2 text-muted-foreground">
            Bem-vinda, {firstName}. Este é o ponto estável de entrada da área autenticada.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              Navegação principal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Button variant="outline" className="justify-start gap-2" onClick={() => navigate("/clube-livro")}>
                <BookOpen className="h-4 w-4" />
                Clube de Leitura
              </Button>
              <Button variant="outline" className="justify-start gap-2" onClick={() => navigate("/formacao-metodo")}>
                <GraduationCap className="h-4 w-4" />
                Formação no Método
              </Button>
              <Button variant="outline" className="justify-start gap-2" onClick={() => navigate("/comunidade")}>
                <Users className="h-4 w-4" />
                Comunidade
              </Button>
              <Button variant="outline" className="justify-start gap-2" onClick={() => navigate("/ferramentas")}>
                <Wrench className="h-4 w-4" />
                Ferramentas
              </Button>
              <Button variant="outline" className="justify-start gap-2" onClick={() => navigate("/minha-conta")}>
                <User className="h-4 w-4" />
                Perfil
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
