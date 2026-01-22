import { useState } from "react";
import { ContentPageLayout } from "@/components/shared/ContentPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Shield, 
  Star, 
  Moon, 
  Heart, 
  Waves, 
  Sparkles, 
  Flame,
  BookOpen,
  Filter,
  X,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBibliotecaCasos, BibliotecaCaso, BibliotecaFiltros } from "@/hooks/useBibliotecaCasos";
import { useCasosClinicosAll } from "@/hooks/useTorrePortaIntegracao";
import { TORRE_METADATA, TorreId } from "@/hooks/useTorrePortaIntegracao";
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

const RISCO_TIPOS = [
  { value: 'pressa', label: 'Pressa', color: 'text-orange-400' },
  { value: 'interpretacao', label: 'Interpretação', color: 'text-purple-400' },
  { value: 'confronto', label: 'Confronto', color: 'text-red-400' },
  { value: 'moralizacao', label: 'Moralização', color: 'text-amber-400' },
  { value: 'resiliencia', label: 'Estimular Resiliência', color: 'text-blue-400' },
  { value: 'explicacao', label: 'Explicar Demais', color: 'text-cyan-400' },
  { value: 'outro', label: 'Outro', color: 'text-muted-foreground' },
];

const TORRE_IDS: TorreId[] = ['controle', 'performance', 'silencio', 'cuidado', 'adaptacao', 'espiritualizacao', 'forca'];

export default function BibliotecaCasos() {
  const [filtros, setFiltros] = useState<BibliotecaFiltros>({});
  const [selectedCaso, setSelectedCaso] = useState<BibliotecaCaso | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: casosModelo, isLoading: loadingModelo } = useCasosClinicosAll();
  const { data: casosBiblioteca, isLoading: loadingBiblioteca } = useBibliotecaCasos(filtros);
  const { data: portas } = useLabirintoPortas();
  
  const isLoading = loadingModelo || loadingBiblioteca;
  
  // Combinar casos modelo + biblioteca
  const allCasos = [
    // Casos modelo (da tabela torre_casos_clinicos)
    ...(casosModelo || []).map(c => ({
      id: c.id,
      torre_id: c.torre_id,
      porta_id: null,
      porta_nome: c.porta_ativa_nome,
      titulo: null,
      cena: c.cena,
      erro_comum: c.leitura_sem_torre,
      leitura_oracula: c.leitura_com_torre,
      resultado: c.resultado,
      risco_tipo: null,
      tags: null,
      fonte: 'modelo',
      autor_id: null,
      ativa: c.ativa,
      ordem: 0,
      created_at: c.created_at,
      updated_at: c.updated_at,
    } as BibliotecaCaso)),
    // Casos adicionais da biblioteca
    ...(casosBiblioteca || []),
  ];
  
  // Filtrar por busca
  const filteredCasos = allCasos.filter(caso => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      caso.cena.toLowerCase().includes(term) ||
      caso.porta_nome?.toLowerCase().includes(term) ||
      caso.titulo?.toLowerCase().includes(term)
    );
  });
  
  // Aplicar filtro de torre (casos modelo)
  const finalCasos = filtros.torre_id 
    ? filteredCasos.filter(c => c.torre_id === filtros.torre_id)
    : filteredCasos;
  
  const clearFiltros = () => {
    setFiltros({});
    setSearchTerm("");
  };
  
  const hasFilters = filtros.torre_id || filtros.porta_id || filtros.risco_tipo || searchTerm;

  return (
    <ContentPageLayout
      title="Biblioteca de Casos"
      onBack={() => window.history.back()}
      backLabel="Voltar"
    >
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <Badge variant="outline" className="text-xs">Uso Profissional</Badge>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Vinhetas clínicas organizadas por Torre e Porta para treino de postura.
          </p>
        </div>

        {/* Filtros */}
        <Card className="bg-muted/30">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
              {hasFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFiltros}
                  className="h-6 px-2 text-xs"
                >
                  <X className="w-3 h-3 mr-1" />
                  Limpar
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              {/* Por Torre */}
              <Select 
                value={filtros.torre_id || "all"} 
                onValueChange={(v) => setFiltros({ ...filtros, torre_id: v === "all" ? undefined : v as TorreId })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por Torre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Torres</SelectItem>
                  {TORRE_IDS.map(id => (
                    <SelectItem key={id} value={id}>
                      {TORRE_METADATA[id].nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Por Porta */}
              <Select 
                value={filtros.porta_id || "all"} 
                onValueChange={(v) => setFiltros({ ...filtros, porta_id: v === "all" ? undefined : v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por Porta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Portas</SelectItem>
                  {(portas || []).sort((a, b) => a.numero - b.numero).map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.numero}. {p.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Por Risco */}
              <Select 
                value={filtros.risco_tipo || "all"} 
                onValueChange={(v) => setFiltros({ ...filtros, risco_tipo: v === "all" ? undefined : v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por Risco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Riscos</SelectItem>
                  {RISCO_TIPOS.map(r => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Casos */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : finalCasos.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">
                {hasFilters ? "Nenhum caso encontrado com esses filtros." : "Nenhum caso cadastrado."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {finalCasos.map((caso) => {
              const meta = TORRE_METADATA[caso.torre_id];
              const Icon = TORRE_ICONS[caso.torre_id];
              
              return (
                <Card 
                  key={caso.id}
                  className="cursor-pointer hover:border-primary/30 transition-colors"
                  onClick={() => setSelectedCaso(caso)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center shrink-0",
                          meta.cor
                        )}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-base line-clamp-1">
                            {caso.titulo || meta.nome}
                          </CardTitle>
                          <Badge variant="outline" className="text-xs mt-0.5">
                            {caso.porta_nome}
                          </Badge>
                        </div>
                      </div>
                      {caso.fonte === 'modelo' && (
                        <Badge className="bg-gold/20 text-gold border-gold/30 text-xs shrink-0">
                          Modelo
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {caso.cena}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Modal de Detalhe */}
        <Dialog open={!!selectedCaso} onOpenChange={() => setSelectedCaso(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedCaso && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center",
                      TORRE_METADATA[selectedCaso.torre_id].cor
                    )}>
                      {(() => {
                        const Icon = TORRE_ICONS[selectedCaso.torre_id];
                        return <Icon className="w-5 h-5 text-white" />;
                      })()}
                    </div>
                    <div>
                      <DialogTitle>
                        {selectedCaso.titulo || TORRE_METADATA[selectedCaso.torre_id].nome}
                      </DialogTitle>
                      <Badge variant="outline" className="mt-1">
                        {selectedCaso.porta_nome}
                      </Badge>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="space-y-4 pt-2">
                  {/* Cena */}
                  <Card className="bg-card/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-muted-foreground">Cena Clínica</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/90 leading-relaxed">{selectedCaso.cena}</p>
                    </CardContent>
                  </Card>

                  {/* Erro Comum */}
                  <Card className="border-destructive/30 bg-destructive/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-destructive/80 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Erro Comum
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{selectedCaso.erro_comum}</p>
                    </CardContent>
                  </Card>

                  {/* Leitura Orácula */}
                  <Card className="border-primary/30 bg-primary/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-primary flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Leitura Orácula
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/90">{selectedCaso.leitura_oracula}</p>
                    </CardContent>
                  </Card>

                  {/* Resultado */}
                  <Card className="border-gold/30 bg-gold/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-gold">Resultado Observado</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/90 font-medium">{selectedCaso.resultado}</p>
                    </CardContent>
                  </Card>
                  
                  {/* Tags */}
                  {selectedCaso.tags && selectedCaso.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedCaso.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ContentPageLayout>
  );
}
