import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { TerritorioMap } from '@/components/atlas/TerritorioMap';
import { LaminaClinica } from '@/components/atlas/LaminaClinica';
import { useAtlasArquetipos, AtlasArquetipo } from '@/hooks/useAtlasArquetipos';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Flower2, AlertTriangle, Sparkles } from 'lucide-react';

export default function AtlasArquetiposFemininos() {
  const { data: arquetipos, isLoading } = useAtlasArquetipos();
  const [selectedArquetipo, setSelectedArquetipo] = useState<AtlasArquetipo | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  
  const handleSelectArquetipo = (arq: AtlasArquetipo) => {
    setSelectedArquetipo(arq);
    setSheetOpen(true);
  };
  
  const activeArquetipos = arquetipos?.filter(a => a.ativo) || [];
  
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4 text-gold border-gold/30">
            <Sparkles className="w-3 h-3 mr-1" />
            Instrumento Clínico
          </Badge>
          
          <SectionHeader
            title="Atlas de Arquétipos Femininos"
            subtitle="Mapa navegável para leitura clínica simbólica"
            icon={<Flower2 className="w-6 h-6" />}
          />
        </div>
        
        {/* Alerta Ético */}
        <Alert className="mb-8 border-purple-500/30 bg-purple-500/5">
          <AlertTriangle className="w-4 h-4 text-purple-400" />
          <AlertDescription className="text-sm text-purple-200/80">
            <strong>Uso exclusivo profissional.</strong> Este atlas orienta a postura de condução. 
            Os arquétipos não devem ser nomeados à cliente nem usados como rótulos diagnósticos.
          </AlertDescription>
        </Alert>
        
        {/* Mapa de Territórios */}
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-[85%] mx-auto" />
            <Skeleton className="h-24 w-[70%] mx-auto" />
            <Skeleton className="h-24 w-[55%] mx-auto" />
          </div>
        ) : (
          <TerritorioMap
            arquetipos={activeArquetipos}
            onSelectArquetipo={handleSelectArquetipo}
            selectedId={selectedArquetipo?.id}
          />
        )}
        
        {/* Legenda */}
        <div className="mt-8 text-center text-xs text-muted-foreground/60">
          <p>Toque em um arquétipo para abrir sua lâmina clínica</p>
        </div>
        
        {/* Sheet da Lâmina Clínica */}
        <LaminaClinica
          arquetipo={selectedArquetipo}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
        />
      </div>
    </AppLayout>
  );
}
