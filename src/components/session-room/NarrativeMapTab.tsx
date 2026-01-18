import { useRef } from 'react';
import { Map, Download, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import type { NarrativeMap } from '@/types/session-room';
import html2canvas from 'html2canvas';

interface NarrativeMapTabProps {
  narrativeMap: NarrativeMap | null;
  clientName?: string;
}

export function NarrativeMapTab({ narrativeMap, clientName }: NarrativeMapTabProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!mapRef.current) return;
    
    try {
      const canvas = await html2canvas(mapRef.current, {
        backgroundColor: '#0f0f0f',
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = `mapa-narrativo-${clientName || 'cliente'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const handleExportText = () => {
    if (!narrativeMap) return;
    
    const text = `
MAPA NARRATIVO
${clientName ? `Cliente: ${clientName}` : ''}
Data: ${new Date().toLocaleDateString('pt-BR')}

═══════════════════════════════════════

NÚCLEO (Fato + Emoção + Imagem)
${narrativeMap.summary_core || 'Não preenchido'}

───────────────────────────────────────

ARQUÉTIPO + SOMBRA
${narrativeMap.summary_archetype || 'Não preenchido'}

───────────────────────────────────────

PADRÃO DE REPETIÇÃO
${narrativeMap.summary_repetition || 'Não preenchido'}

───────────────────────────────────────

CONVITE DA ALMA
${narrativeMap.summary_invitation || 'Não preenchido'}

═══════════════════════════════════════

⚠️ AVISOS ÉTICOS:
• Leitura simbólica não é sentença.
• Nomear não é resolver.
• Símbolos pedem tempo.
    `.trim();

    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = `mapa-narrativo-${clientName || 'cliente'}.txt`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  if (!narrativeMap || !narrativeMap.summary_core) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <Map className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground">
            Complete as 7 camadas para gerar o mapa narrativo.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Export Actions */}
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={handleExportText}>
          <Download className="w-4 h-4 mr-2" />
          Exportar TXT
        </Button>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Exportar Imagem
        </Button>
      </div>

      {/* Narrative Map Display */}
      <div ref={mapRef} className="space-y-4 p-6 bg-background rounded-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-display text-gold">Mapa Narrativo</h2>
          {clientName && <p className="text-muted-foreground mt-1">{clientName}</p>}
        </div>

        <Card className="border-gold/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gold">Núcleo</CardTitle>
            <CardDescription className="text-xs">Fato + Emoção + Imagem</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{narrativeMap.summary_core}</p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-400">Arquétipo + Sombra</CardTitle>
            <CardDescription className="text-xs">O que protege e silencia</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{narrativeMap.summary_archetype}</p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-400">Repetição</CardTitle>
            <CardDescription className="text-xs">O padrão que se repete</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{narrativeMap.summary_repetition}</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-400">Convite da Alma</CardTitle>
            <CardDescription className="text-xs">O gesto possível</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{narrativeMap.summary_invitation}</p>
          </CardContent>
        </Card>

        <Separator className="my-6" />

        {/* Ethical Notice */}
        <Alert variant="default" className="bg-muted/50 border-gold/20">
          <AlertTriangle className="w-4 h-4 text-gold" />
          <AlertDescription className="text-sm space-y-1">
            <p><strong>Leitura simbólica não é sentença.</strong></p>
            <p><strong>Nomear não é resolver.</strong></p>
            <p><strong>Símbolos pedem tempo.</strong></p>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
