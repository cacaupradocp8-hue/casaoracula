import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, FileText, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface Props {
  cicloId: string;
  livroTitulo?: string;
}

export function ClubeMateriaisTab({ cicloId, livroTitulo }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const { data: materiais, isLoading } = useQuery({
    queryKey: ['clube-materiais-aluna', cicloId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_escutas')
        .select('id, titulo, descricao, texto_conteudo, tipo')
        .eq('ciclo_id', cicloId)
        .eq('tipo', 'resumo')
        .eq('ativo', true);
      if (error) throw error;
      return data || [];
    },
  });

  const handleDownloadPDF = async (texto: string, titulo: string) => {
    if (!printRef.current) return;

    // Populate the hidden render area
    printRef.current.innerText = texto;
    printRef.current.style.display = 'block';

    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        backgroundColor: '#FFFFFF',
        useCORS: true,
        logging: false,
        width: 700,
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`${titulo.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    } catch (err) {
      console.error('PDF error:', err);
    } finally {
      printRef.current.style.display = 'none';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
      </div>
    );
  }

  if (!materiais?.length) {
    return (
      <div className="text-center py-8">
        <FileText className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Nenhum material disponível ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {materiais.map((m) => (
        <Card key={m.id} className="border-border/50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gold shrink-0" />
              <div>
                <p className="text-sm font-medium">{m.titulo}</p>
                {m.descricao && (
                  <p className="text-xs text-muted-foreground line-clamp-1">{m.descricao}</p>
                )}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="gap-2 shrink-0"
              onClick={() => handleDownloadPDF(m.texto_conteudo || '', m.titulo)}
            >
              <Download className="w-4 h-4" />
              PDF
            </Button>
          </CardContent>
        </Card>
      ))}

      {/* Hidden render area for PDF generation */}
      <div
        ref={printRef}
        style={{
          display: 'none',
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: '700px',
          padding: '40px',
          fontFamily: "'Georgia', serif",
          fontSize: '13px',
          lineHeight: '1.7',
          color: '#1a1a1a',
          background: '#FFFFFF',
          whiteSpace: 'pre-wrap',
        }}
      />
    </div>
  );
}
