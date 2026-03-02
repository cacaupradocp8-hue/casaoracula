import { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';

interface Props {
  estrutura: any;
  nomeMentora: string;
  nomeGrupo: string;
  livroTitulo: string;
}

export default function EstudioPlaybookPreview({ estrutura, nomeMentora, nomeGrupo, livroTitulo }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!contentRef.current) return;
    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        backgroundColor: '#F4EFE6',
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `playbook-${livroTitulo.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  if (!estrutura) return null;

  return (
    <div className="space-y-4 mt-4">
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
          <Printer className="w-4 h-4" /> Imprimir
        </Button>
        <Button size="sm" onClick={handleDownload} className="gap-2">
          <Download className="w-4 h-4" /> Baixar PNG
        </Button>
      </div>

      <div
        ref={contentRef}
        className="mx-auto max-w-2xl print:max-w-none"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {/* Cover */}
        <div
          className="rounded-t-lg p-8 text-center space-y-4"
          style={{ backgroundColor: '#1F3D3A', color: '#F4EFE6', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        >
          <p className="text-xs tracking-[0.3em] uppercase" style={{ color: '#C6A75E' }}>
            Método de Leitura Oracular
          </p>
          <h1 className="text-2xl font-bold">{estrutura.titulo_pedagogico || livroTitulo}</h1>
          <p className="text-sm opacity-80">{livroTitulo}</p>
          <div className="pt-4 space-y-1">
            {nomeMentora && <p className="text-sm" style={{ color: '#C6A75E' }}>{nomeMentora}</p>}
            {nomeGrupo && <p className="text-xs opacity-70">{nomeGrupo}</p>}
          </div>
        </div>

        {/* Content */}
        <div className="rounded-b-lg border border-t-0 border-border" style={{ backgroundColor: '#F4EFE6' }}>
          {/* Essence */}
          <div className="p-6 border-b" style={{ borderColor: '#C6A75E33' }}>
            <h2 className="text-sm font-bold mb-2" style={{ color: '#1F3D3A' }}>✦ Essência 80/20</h2>
            <p className="text-xs leading-relaxed" style={{ color: '#1E2F3F' }}>{estrutura.essencia_8020}</p>
          </div>

          {/* Map */}
          {estrutura.mapa_simbolico && (
            <div className="p-6 border-b" style={{ borderColor: '#C6A75E33' }}>
              <h2 className="text-sm font-bold mb-2" style={{ color: '#1F3D3A' }}>✦ Mapa Simbólico</h2>
              <p className="text-xs leading-relaxed" style={{ color: '#1E2F3F' }}>{estrutura.mapa_simbolico}</p>
            </div>
          )}

          {/* Encounters */}
          {estrutura.encontros?.map((enc: any, i: number) => (
            <div key={i} className="p-6 border-b" style={{ borderColor: '#C6A75E33' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#C6A75E22', color: '#C6A75E' }}>
                  {enc.fase}
                </span>
                <h3 className="text-sm font-bold" style={{ color: '#1F3D3A' }}>
                  Encontro {enc.numero}: {enc.titulo}
                </h3>
              </div>
              <p className="text-xs mb-3" style={{ color: '#1E2F3F' }}>{enc.tema_central}</p>

              {enc.abertura_ritual && (
                <div className="mb-3 p-2 rounded" style={{ backgroundColor: '#1F3D3A11' }}>
                  <p className="text-xs" style={{ color: '#1E2F3F' }}>
                    <strong>Abertura:</strong> {enc.abertura_ritual}
                  </p>
                </div>
              )}

              <div className="mb-3">
                <p className="text-xs font-bold mb-1" style={{ color: '#1F3D3A' }}>Perguntas Guiadas:</p>
                {enc.perguntas_guiadas?.map((p: string, j: number) => (
                  <p key={j} className="text-xs pl-3 mb-1" style={{ color: '#1E2F3F', borderLeft: '2px solid #C6A75E' }}>
                    {p}
                  </p>
                ))}
              </div>

              {enc.aplicacao_profissional && (
                <div className="mb-3">
                  <p className="text-xs font-bold mb-1" style={{ color: '#1F3D3A' }}>Aplicação Profissional:</p>
                  <p className="text-xs" style={{ color: '#1E2F3F' }}>{enc.aplicacao_profissional}</p>
                </div>
              )}

              {/* Blank space for notes */}
              <div className="mt-3 p-3 rounded border border-dashed" style={{ borderColor: '#C6A75E44', minHeight: '60px' }}>
                <p className="text-xs italic" style={{ color: '#C6A75E88' }}>Espaço para anotações</p>
              </div>

              {enc.encerramento_ritual && (
                <div className="mt-3 p-2 rounded" style={{ backgroundColor: '#1F3D3A11' }}>
                  <p className="text-xs" style={{ color: '#1E2F3F' }}>
                    <strong>Encerramento:</strong> {enc.encerramento_ritual}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Footer */}
          <div className="p-4 text-center" style={{ backgroundColor: '#1F3D3A', color: '#C6A75E' }}>
            <p className="text-xs tracking-wide">Método de Leitura Oracular — Casa Orácula</p>
          </div>
        </div>
      </div>
    </div>
  );
}
