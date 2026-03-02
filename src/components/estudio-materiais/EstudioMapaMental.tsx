import { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';

interface Props {
  estrutura: any;
}

export default function EstudioMapaMental({ estrutura }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!mapRef.current) return;
    try {
      const canvas = await html2canvas(mapRef.current, {
        scale: 2,
        backgroundColor: '#F4EFE6',
      });
      const link = document.createElement('a');
      link.download = 'mapa-mental.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  if (!estrutura) return null;

  const encontros = estrutura.encontros || [];
  const tensoes = estrutura.tensoes_centrais || [];
  const arquetipos = estrutura.arquetipos_envolvidos || [];

  // Calculate positions for radial layout
  const centerX = 400;
  const centerY = 300;
  const innerRadius = 120;
  const outerRadius = 220;

  const getPosition = (index: number, total: number, radius: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={handleDownload} className="gap-2">
          <Download className="w-4 h-4" /> Baixar PNG
        </Button>
      </div>

      <Card className="border-border overflow-hidden">
        <CardContent className="p-0">
          <div
            ref={mapRef}
            className="relative mx-auto"
            style={{
              width: '800px',
              height: '600px',
              backgroundColor: '#F4EFE6',
              overflow: 'hidden',
            }}
          >
            {/* SVG Lines */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
              {encontros.map((_: any, i: number) => {
                const pos = getPosition(i, encontros.length, innerRadius);
                return (
                  <line
                    key={`line-${i}`}
                    x1={centerX}
                    y1={centerY}
                    x2={pos.x}
                    y2={pos.y}
                    stroke="#C6A75E"
                    strokeWidth="2"
                    opacity="0.5"
                  />
                );
              })}
              {tensoes.map((_: string, i: number) => {
                const encounterIdx = Math.floor((i / tensoes.length) * encontros.length);
                const parentPos = getPosition(encounterIdx, encontros.length, innerRadius);
                const childPos = getPosition(i, tensoes.length, outerRadius);
                return (
                  <line
                    key={`outer-${i}`}
                    x1={parentPos.x}
                    y1={parentPos.y}
                    x2={childPos.x}
                    y2={childPos.y}
                    stroke="#1E2F3F"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                );
              })}
            </svg>

            {/* Center Node */}
            <div
              className="absolute flex items-center justify-center text-center rounded-full"
              style={{
                left: centerX - 70,
                top: centerY - 70,
                width: 140,
                height: 140,
                backgroundColor: '#C6A75E',
                color: '#1F3D3A',
                zIndex: 10,
                boxShadow: '0 4px 20px rgba(198,167,94,0.4)',
              }}
            >
              <div className="px-3">
                <p className="text-xs font-bold leading-tight">{estrutura.titulo_pedagogico}</p>
                <p className="text-[10px] mt-1 opacity-70">Núcleo 80/20</p>
              </div>
            </div>

            {/* Encounter Nodes */}
            {encontros.map((enc: any, i: number) => {
              const pos = getPosition(i, encontros.length, innerRadius);
              return (
                <div
                  key={`enc-${i}`}
                  className="absolute flex items-center justify-center text-center rounded-lg"
                  style={{
                    left: pos.x - 55,
                    top: pos.y - 30,
                    width: 110,
                    height: 60,
                    backgroundColor: '#1F3D3A',
                    color: '#F4EFE6',
                    zIndex: 10,
                    fontSize: '10px',
                    padding: '4px',
                  }}
                >
                  <div>
                    <p className="font-bold" style={{ color: '#C6A75E' }}>E{enc.numero}</p>
                    <p className="leading-tight">{enc.titulo?.substring(0, 40)}</p>
                  </div>
                </div>
              );
            })}

            {/* Tension Nodes */}
            {tensoes.map((t: string, i: number) => {
              const pos = getPosition(i, tensoes.length, outerRadius);
              return (
                <div
                  key={`t-${i}`}
                  className="absolute flex items-center justify-center text-center rounded"
                  style={{
                    left: pos.x - 50,
                    top: pos.y - 18,
                    width: 100,
                    height: 36,
                    backgroundColor: '#1E2F3F',
                    color: '#F4EFE6',
                    zIndex: 10,
                    fontSize: '9px',
                    padding: '2px',
                  }}
                >
                  <p className="leading-tight">{t.substring(0, 50)}</p>
                </div>
              );
            })}

            {/* Footer */}
            <div
              className="absolute bottom-0 left-0 right-0 text-center py-2"
              style={{ backgroundColor: '#1F3D3A', color: '#C6A75E', fontSize: '10px', zIndex: 10 }}
            >
              Método de Leitura Oracular — Casa Orácula
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
