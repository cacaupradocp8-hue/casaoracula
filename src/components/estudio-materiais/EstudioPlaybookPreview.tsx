import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface Props {
  estrutura: any;
  nomeMentora: string;
  nomeGrupo: string;
  livroTitulo: string;
}

export default function EstudioPlaybookPreview({ estrutura, nomeMentora, nomeGrupo, livroTitulo }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => window.print();

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        backgroundColor: '#FFFFFF',
        useCORS: true,
        logging: false,
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
      pdf.save(`resumo-${livroTitulo.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    } catch (err) {
      console.error('PDF error:', err);
    }
  };

  if (!estrutura) return null;

  const jornada = estrutura.jornada_predominante || 'Individuação';

  return (
    <div className="space-y-4 mt-4">
      {/* Action buttons */}
      <div className="flex gap-2 justify-end print:hidden">
        <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
          <Printer className="w-4 h-4" /> Imprimir
        </Button>
        <Button size="sm" onClick={handleDownloadPDF} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Download className="w-4 h-4" /> Baixar PDF
        </Button>
      </div>

      {/* Clean text document for print/PDF */}
      <div
        ref={contentRef}
        style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          color: '#1a1a1a',
          background: '#FFFFFF',
          padding: '48px 40px',
          maxWidth: '700px',
          margin: '0 auto',
          lineHeight: 1.7,
          borderRadius: '8px',
          border: '1px solid #e5e5e5',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px', paddingBottom: '24px', borderBottom: '2px solid #d4af37' }}>
          <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#8B7355', marginBottom: '12px' }}>
            ✦ Círculo de Leitura Simbólica ✦
          </p>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 6px' }}>
            {estrutura.titulo_pedagogico || livroTitulo}
          </h1>
          <p style={{ fontSize: '14px', color: '#666', margin: '0 0 8px' }}>{livroTitulo}</p>
          <p style={{ fontSize: '12px', color: '#8B7355' }}>Jornada: {jornada} · {estrutura.encontros?.length || 4} Encontros</p>
          {nomeMentora && <p style={{ fontSize: '13px', color: '#444', marginTop: '8px' }}>{nomeMentora}</p>}
          {nomeGrupo && <p style={{ fontSize: '12px', color: '#888' }}>{nomeGrupo}</p>}
        </div>

        {/* Essência 80/20 */}
        {estrutura.essencia_8020 && (
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#8B7355', marginBottom: '8px' }}>
              Essência 80/20
            </h2>
            <p style={{ fontSize: '14px', color: '#333' }}>{estrutura.essencia_8020}</p>
          </div>
        )}

        {/* Paisagem Interior */}
        {estrutura.mapa_simbolico && (
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#8B7355', marginBottom: '8px' }}>
              Paisagem Interior
            </h2>
            <p style={{ fontSize: '14px', color: '#333', fontStyle: 'italic' }}>{estrutura.mapa_simbolico}</p>
          </div>
        )}

        {/* Tensões */}
        {estrutura.tensoes_centrais?.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#8B7355', marginBottom: '8px' }}>
              Tensões Centrais
            </h2>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              {estrutura.tensoes_centrais.map((t: string, i: number) => (
                <li key={i} style={{ fontSize: '13px', color: '#333', marginBottom: '4px' }}>{t}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Encontros */}
        {estrutura.encontros?.map((enc: any, i: number) => (
          <div key={i} style={{ marginBottom: '28px', paddingTop: '16px', borderTop: '1px solid #e5e5e5' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>
              Encontro {enc.numero} — {enc.titulo}
            </h2>
            <p style={{ fontSize: '11px', color: '#8B7355', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Fase: {enc.fase}
            </p>

            {enc.tema_central && (
              <p style={{ fontSize: '14px', color: '#333', marginBottom: '12px' }}>{enc.tema_central}</p>
            )}

            {enc.abertura_ritual && (
              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#8B7355', marginBottom: '4px' }}>Abertura do Campo</p>
                <p style={{ fontSize: '13px', color: '#444' }}>{enc.abertura_ritual}</p>
              </div>
            )}

            {enc.perguntas_guiadas?.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#8B7355', marginBottom: '4px' }}>Perguntas de Travessia</p>
                <ol style={{ paddingLeft: '20px', margin: 0 }}>
                  {enc.perguntas_guiadas.map((p: string, j: number) => (
                    <li key={j} style={{ fontSize: '13px', color: '#333', marginBottom: '4px' }}>{p}</li>
                  ))}
                </ol>
              </div>
            )}

            {enc.aplicacao_profissional && (
              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#8B7355', marginBottom: '4px' }}>Aplicação Profissional</p>
                <p style={{ fontSize: '13px', color: '#444' }}>{enc.aplicacao_profissional}</p>
              </div>
            )}

            {enc.o_que_nao_fazer && (
              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#b91c1c', marginBottom: '4px' }}>⚠ O que não fazer</p>
                <p style={{ fontSize: '13px', color: '#444' }}>{enc.o_que_nao_fazer}</p>
              </div>
            )}

            {enc.alerta_clinico && (
              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#8B7355', marginBottom: '4px' }}>Alerta Clínico</p>
                <p style={{ fontSize: '13px', color: '#444' }}>{enc.alerta_clinico}</p>
              </div>
            )}

            {enc.encerramento_ritual && (
              <div style={{ marginBottom: '8px' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#8B7355', marginBottom: '4px' }}>Fechamento do Campo</p>
                <p style={{ fontSize: '13px', color: '#444' }}>{enc.encerramento_ritual}</p>
              </div>
            )}
          </div>
        ))}

        {/* Jardins */}
        {(estrutura.convites_jardim_psique?.length > 0 || estrutura.convites_jardim_oficio?.length > 0) && (
          <div style={{ marginBottom: '28px', paddingTop: '16px', borderTop: '1px solid #e5e5e5' }}>
            {estrutura.convites_jardim_psique?.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h2 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#8B7355', marginBottom: '8px' }}>
                  🌿 Jardim da Psique
                </h2>
                {estrutura.convites_jardim_psique.map((c: string, i: number) => (
                  <p key={i} style={{ fontSize: '13px', fontStyle: 'italic', color: '#333', marginBottom: '6px' }}>"{c}"</p>
                ))}
              </div>
            )}
            {estrutura.convites_jardim_oficio?.length > 0 && (
              <div>
                <h2 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#8B7355', marginBottom: '8px' }}>
                  ⚒ Jardim do Ofício
                </h2>
                {estrutura.convites_jardim_oficio.map((c: string, i: number) => (
                  <p key={i} style={{ fontSize: '13px', fontStyle: 'italic', color: '#333', marginBottom: '6px' }}>"{c}"</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Observação Clínica */}
        {estrutura.observacao_clinica && (
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#8B7355', marginBottom: '8px' }}>
              Observação Clínica
            </h2>
            <p style={{ fontSize: '13px', color: '#444' }}>{estrutura.observacao_clinica}</p>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', paddingTop: '20px', borderTop: '2px solid #d4af37', color: '#999', fontSize: '11px' }}>
          <p style={{ margin: '0 0 4px' }}>Método de Leitura Oracular — Casa Orácula</p>
          <p style={{ margin: 0 }}>Círculo de Leitura Simbólica · Material de Uso Formativo</p>
        </div>
      </div>
    </div>
  );
}
