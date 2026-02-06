import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Compass, User, Users, Loader2, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { canAccessFeature } from "@/types/portal";

export type LabirintoModo = "pessoal" | "profissional";

interface Cliente {
  id: string;
  nome: string;
}

interface SessionCase {
  id: string;
  title: string;
  client_id: string;
}

interface LabirintoModoSelectorProps {
  onModeSelected: (config: {
    modo: LabirintoModo;
    clienteId?: string;
    sessionCaseId?: string;
    terapeutaId?: string;
  }) => void;
}

export function LabirintoModoSelector({ onModeSelected }: LabirintoModoSelectorProps) {
  const { user } = useAuth();
  const [modo, setModo] = useState<LabirintoModo>("pessoal");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [sessionCases, setSessionCases] = useState<SessionCase[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<string>("");
  const [selectedCase, setSelectedCase] = useState<string>("");
  const [sourceType, setSourceType] = useState<"cliente" | "caso">("cliente");
  const [loading, setLoading] = useState(false);

  const userPortal = user?.portal || "visitante";
  const isProfessional = canAccessFeature(userPortal, "oracula");

  useEffect(() => {
    if (modo === "profissional" && user?.id) {
      loadProfessionalData();
    }
  }, [modo, user?.id]);

  const loadProfessionalData = async () => {
    if (!user?.id) return;
    setLoading(true);

    try {
      // Load clientes
      const { data: clientesData } = await supabase
        .from("clientes")
        .select("id, nome")
        .eq("terapeuta_id", user.id)
        .eq("status", "ativo")
        .order("nome");

      // Load session cases
      const { data: casesData } = await supabase
        .from("session_cases")
        .select("id, title, client_id")
        .eq("therapist_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      setClientes(clientesData || []);
      setSessionCases(casesData || []);
    } catch (error) {
      console.error("Error loading professional data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (modo === "pessoal") {
      onModeSelected({ modo: "pessoal" });
    } else {
      if (sourceType === "cliente" && !selectedCliente) {
        toast.error("Selecione uma cliente para continuar.");
        return;
      }
      if (sourceType === "caso" && !selectedCase) {
        toast.error("Selecione um caso para continuar.");
        return;
      }

      const selectedCaseData = sessionCases.find((c: SessionCase) => c.id === selectedCase);

      onModeSelected({
        modo: "profissional",
        clienteId: sourceType === "cliente" ? selectedCliente : selectedCaseData?.client_id,
        sessionCaseId: sourceType === "caso" ? selectedCase : undefined,
        terapeutaId: user?.id,
      });
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="max-w-lg w-full border-gold/30 bg-card/80">
        <CardHeader className="text-center">
          <Compass className="w-12 h-12 text-gold mx-auto mb-2" />
          <CardTitle className="font-display text-2xl text-gold">
            O Labirinto da Heroína Interna®
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Escolha como deseja navegar este ecossistema simbólico
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <RadioGroup
            value={modo}
            onValueChange={(v) => setModo(v as LabirintoModo)}
            className="space-y-3"
          >
            <Label
              htmlFor="pessoal"
              className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                modo === "pessoal"
                  ? "border-gold bg-gold/5"
                  : "border-border hover:border-gold/50"
              }`}
            >
              <RadioGroupItem value="pessoal" id="pessoal" className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-gold" />
                  <span className="font-medium">Minha Travessia Pessoal</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Explore o labirinto para seu próprio autoconhecimento e individuação.
                </p>
              </div>
            </Label>

            {isProfessional && (
              <Label
                htmlFor="profissional"
                className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  modo === "profissional"
                    ? "border-gold bg-gold/5"
                    : "border-border hover:border-gold/50"
                }`}
              >
                <RadioGroupItem value="profissional" id="profissional" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase className="w-4 h-4 text-gold" />
                    <span className="font-medium">Condução Profissional</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Aplique o labirinto com uma cliente em sessão terapêutica.
                  </p>
                </div>
              </Label>
            )}
          </RadioGroup>

          {modo === "profissional" && (
            <div className="space-y-4 pt-2 border-t border-border">
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-gold" />
                </div>
              ) : (
                <>
                  <RadioGroup
                    value={sourceType}
                    onValueChange={(v) => setSourceType(v as "cliente" | "caso")}
                    className="flex gap-4"
                  >
                    <Label
                      htmlFor="tipo-cliente"
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer ${
                        sourceType === "cliente" ? "border-gold bg-gold/10" : "border-border"
                      }`}
                    >
                      <RadioGroupItem value="cliente" id="tipo-cliente" />
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Por Cliente</span>
                    </Label>
                    <Label
                      htmlFor="tipo-caso"
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer ${
                        sourceType === "caso" ? "border-gold bg-gold/10" : "border-border"
                      }`}
                    >
                      <RadioGroupItem value="caso" id="tipo-caso" />
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm">Por Caso</span>
                    </Label>
                  </RadioGroup>

                  {sourceType === "cliente" && (
                    <div className="space-y-2">
                      <Label>Selecione a cliente</Label>
                      <Select value={selectedCliente} onValueChange={setSelectedCliente}>
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha uma cliente..." />
                        </SelectTrigger>
                        <SelectContent>
                          {clientes.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground text-sm">
                              Nenhuma cliente cadastrada
                            </div>
                          ) : (
                            clientes.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.nome}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {sourceType === "caso" && (
                    <div className="space-y-2">
                      <Label>Selecione o caso</Label>
                      <Select value={selectedCase} onValueChange={setSelectedCase}>
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha um caso..." />
                        </SelectTrigger>
                        <SelectContent>
                          {sessionCases.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground text-sm">
                              Nenhum caso ativo
                            </div>
                          ) : (
                            sessionCases.map((c: SessionCase) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.title || "Caso sem título"}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          <Button
            onClick={handleContinue}
            className="w-full bg-gold hover:bg-gold/90 text-gold-foreground gap-2"
            size="lg"
          >
            <Compass className="w-5 h-5" />
            {modo === "pessoal" ? "Iniciar Minha Travessia" : "Iniciar Condução"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
