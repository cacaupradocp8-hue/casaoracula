import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Shield, 
  Star, 
  Moon, 
  Heart, 
  Waves, 
  Sparkles, 
  Flame,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  useCasosClinicosAll, 
  useTorrePortaRelacoesAll, 
  TORRE_METADATA,
  TorreId,
  TorreCasoClinico 
} from "@/hooks/useTorrePortaIntegracao";
import { useLabirintoPortas } from "@/hooks/useLabirinto";

// Ícones das Torres
const TORRE_ICONS: Record<TorreId, React.ElementType> = {
  controle: Shield,
  performance: Star,
  silencio: Moon,
  cuidado: Heart,
  adaptacao: Waves,
  espiritualizacao: Sparkles,
  forca: Flame,
};

const TORRE_IDS: TorreId[] = ['controle', 'performance', 'silencio', 'cuidado', 'adaptacao', 'espiritualizacao', 'forca'];

export function AdminTorreVivaTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display text-gold">Torre Viva™</h2>
        <p className="text-muted-foreground">Gestão de casos-clínicos e associações Porta ↔ Torre</p>
      </div>

      <Tabs defaultValue="casos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="casos">Casos-Clínicos</TabsTrigger>
          <TabsTrigger value="associacoes">Associações Porta ↔ Torre</TabsTrigger>
        </TabsList>

        <TabsContent value="casos">
          <CasosClinicosManager />
        </TabsContent>

        <TabsContent value="associacoes">
          <AssociacoesManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// CASOS CLÍNICOS MANAGER
// ══════════════════════════════════════════════════════════════
function CasosClinicosManager() {
  const { data: casos, isLoading } = useCasosClinicosAll();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingCaso, setEditingCaso] = useState<TorreCasoClinico | null>(null);

  const updateMutation = useMutation({
    mutationFn: async (caso: Partial<TorreCasoClinico> & { id: string }) => {
      const { error } = await supabase
        .from("torre_casos_clinicos")
        .update({
          porta_ativa_nome: caso.porta_ativa_nome,
          cena: caso.cena,
          leitura_sem_torre: caso.leitura_sem_torre,
          leitura_com_torre: caso.leitura_com_torre,
          resultado: caso.resultado,
        })
        .eq("id", caso.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["torre-casos-clinicos-all"] });
      toast({ title: "Caso atualizado" });
      setEditingCaso(null);
    },
    onError: () => {
      toast({ title: "Erro ao atualizar", variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {TORRE_IDS.map((torreId) => {
          const caso = casos?.find((c) => c.torre_id === torreId);
          const meta = TORRE_METADATA[torreId];
          const Icon = TORRE_ICONS[torreId];

          return (
            <Card key={torreId} className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center",
                      meta.cor
                    )}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{meta.nome}</CardTitle>
                      {caso && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {caso.porta_ativa_nome}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Dialog open={editingCaso?.torre_id === torreId} onOpenChange={(open) => !open && setEditingCaso(null)}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => caso && setEditingCaso(caso)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Editar Caso - {meta.nome}</DialogTitle>
                      </DialogHeader>
                      {editingCaso && (
                        <CasoEditForm 
                          caso={editingCaso} 
                          onSave={(data) => updateMutation.mutate({ id: editingCaso.id, ...data })}
                          isLoading={updateMutation.isPending}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              
              {caso && (
                <CardContent className="text-sm text-muted-foreground">
                  <p className="line-clamp-2">{caso.cena}</p>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function CasoEditForm({ 
  caso, 
  onSave, 
  isLoading 
}: { 
  caso: TorreCasoClinico; 
  onSave: (data: Partial<TorreCasoClinico>) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    porta_ativa_nome: caso.porta_ativa_nome,
    cena: caso.cena,
    leitura_sem_torre: caso.leitura_sem_torre,
    leitura_com_torre: caso.leitura_com_torre,
    resultado: caso.resultado,
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Porta Ativa</Label>
        <Input 
          value={formData.porta_ativa_nome}
          onChange={(e) => setFormData({ ...formData, porta_ativa_nome: e.target.value })}
          placeholder="Ex: Porta da Incerteza"
        />
      </div>

      <div className="space-y-2">
        <Label>Cena</Label>
        <Textarea 
          value={formData.cena}
          onChange={(e) => setFormData({ ...formData, cena: e.target.value })}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Leitura SEM Torre (erro comum)</Label>
        <Textarea 
          value={formData.leitura_sem_torre}
          onChange={(e) => setFormData({ ...formData, leitura_sem_torre: e.target.value })}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>Leitura COM Torre Viva™ (postura correta)</Label>
        <Textarea 
          value={formData.leitura_com_torre}
          onChange={(e) => setFormData({ ...formData, leitura_com_torre: e.target.value })}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>Resultado</Label>
        <Textarea 
          value={formData.resultado}
          onChange={(e) => setFormData({ ...formData, resultado: e.target.value })}
          rows={2}
        />
      </div>

      <Button 
        onClick={() => onSave(formData)} 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
        Salvar
      </Button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ASSOCIAÇÕES PORTA ↔ TORRE MANAGER
// ══════════════════════════════════════════════════════════════
function AssociacoesManager() {
  const { data: relacoes, isLoading: loadingRelacoes } = useTorrePortaRelacoesAll();
  const { data: portas, isLoading: loadingPortas } = useLabirintoPortas();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPorta, setSelectedPorta] = useState<string>("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("torre_porta_relacao")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["torre-porta-relacoes-all"] });
      toast({ title: "Associação removida" });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: {
      porta_id: string;
      torre_id: TorreId;
      frequencia: string;
      risco_conducao?: string;
      ajuste_com_torre?: string;
    }) => {
      const { error } = await supabase
        .from("torre_porta_relacao")
        .insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["torre-porta-relacoes-all"] });
      toast({ title: "Associação criada" });
      setShowAddDialog(false);
    },
    onError: () => {
      toast({ title: "Erro ao criar", variant: "destructive" });
    },
  });

  if (loadingRelacoes || loadingPortas) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Agrupar por porta
  const relacoesPorPorta = relacoes?.reduce((acc, rel) => {
    if (!acc[rel.porta_id]) acc[rel.porta_id] = [];
    acc[rel.porta_id].push(rel);
    return acc;
  }, {} as Record<string, typeof relacoes>);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {relacoes?.length || 0} associações cadastradas
        </p>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Associação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Associação Porta ↔ Torre</DialogTitle>
            </DialogHeader>
            <AssociacaoForm 
              portas={portas || []}
              onSave={(data) => createMutation.mutate(data)}
              isLoading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Porta</TableHead>
            <TableHead>Torre</TableHead>
            <TableHead>Frequência</TableHead>
            <TableHead>Risco</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {relacoes?.map((rel) => {
            const porta = portas?.find((p) => p.id === rel.porta_id);
            const meta = TORRE_METADATA[rel.torre_id];
            const Icon = TORRE_ICONS[rel.torre_id];

            return (
              <TableRow key={rel.id}>
                <TableCell>
                  <span className="font-medium">{porta?.nome || "—"}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-6 h-6 rounded-full bg-gradient-to-br flex items-center justify-center",
                      meta.cor
                    )}>
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm">{meta.nome.replace("Torre ", "")}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs capitalize">
                    {rel.frequencia.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                  {rel.risco_conducao || "—"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(rel.id)}
                    className="text-destructive/60 hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function AssociacaoForm({ 
  portas, 
  onSave, 
  isLoading 
}: { 
  portas: Array<{ id: string; nome: string; numero: number }>;
  onSave: (data: { porta_id: string; torre_id: TorreId; frequencia: string; risco_conducao?: string; ajuste_com_torre?: string }) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    porta_id: "",
    torre_id: "" as TorreId,
    frequencia: "comum",
    risco_conducao: "",
    ajuste_com_torre: "",
  });

  const sortedPortas = [...portas].sort((a, b) => a.numero - b.numero);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Porta</Label>
        <Select value={formData.porta_id} onValueChange={(v) => setFormData({ ...formData, porta_id: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma Porta" />
          </SelectTrigger>
          <SelectContent>
            {sortedPortas.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.numero}. {p.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Torre</Label>
        <Select value={formData.torre_id} onValueChange={(v) => setFormData({ ...formData, torre_id: v as TorreId })}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma Torre" />
          </SelectTrigger>
          <SelectContent>
            {TORRE_IDS.map((id) => (
              <SelectItem key={id} value={id}>
                {TORRE_METADATA[id].nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Frequência</Label>
        <Select value={formData.frequencia} onValueChange={(v) => setFormData({ ...formData, frequencia: v })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="muito_frequente">Muito Frequente</SelectItem>
            <SelectItem value="comum">Comum</SelectItem>
            <SelectItem value="ocasional">Ocasional</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Risco de Condução</Label>
        <Textarea 
          value={formData.risco_conducao}
          onChange={(e) => setFormData({ ...formData, risco_conducao: e.target.value })}
          placeholder="Erro clássico se a Torre não for reconhecida..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>Ajuste com Torre Viva™</Label>
        <Textarea 
          value={formData.ajuste_com_torre}
          onChange={(e) => setFormData({ ...formData, ajuste_com_torre: e.target.value })}
          placeholder="Orientação específica para essa combinação..."
          rows={2}
        />
      </div>

      <Button 
        onClick={() => onSave(formData)} 
        disabled={isLoading || !formData.porta_id || !formData.torre_id}
        className="w-full"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
        Criar Associação
      </Button>
    </div>
  );
}
