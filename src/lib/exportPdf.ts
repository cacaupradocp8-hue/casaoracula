// ============================================
// PDF EXPORT UTILITY
// ============================================
// Exports content as PDF using html2canvas
// Used primarily for Jardim da Psique records

import html2canvas from 'html2canvas';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ExportPdfOptions {
  title: string;
  subtitle?: string;
  filename?: string;
}

/**
 * Exports a DOM element as a PDF-like image download
 * Uses html2canvas to capture the content
 */
export async function exportElementAsImage(
  elementId: string,
  options: ExportPdfOptions
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found:', elementId);
    return false;
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#0f0f12',
      scale: 2,
      useCORS: true,
      logging: false,
    });

    // Create download link
    const link = document.createElement('a');
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm', { locale: ptBR });
    const filename = options.filename || `${options.title.replace(/\s+/g, '-')}_${timestamp}.png`;
    
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();

    return true;
  } catch (error) {
    console.error('Error exporting to image:', error);
    return false;
  }
}

/**
 * Generates a printable HTML version of the Jardim record
 * Opens in a new window for printing/saving as PDF
 */
export function exportJardimRegistroAsPdf(registro: {
  ferramenta_nome: string;
  data_aplicacao: string;
  conteudo: Record<string, unknown>;
  resultado_simbolico: Record<string, unknown> | null;
  reflexao_pessoal: string | null;
  integrado: boolean;
}): void {
  const dataFormatada = format(
    new Date(registro.data_aplicacao),
    "d 'de' MMMM 'de' yyyy, 'às' HH:mm",
    { locale: ptBR }
  );

  // Format content entries
  const formatEntries = (obj: Record<string, unknown>): string => {
    return Object.entries(obj)
      .map(([key, value]) => {
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        const formattedValue = typeof value === 'object' 
          ? JSON.stringify(value, null, 2)
          : String(value);
        return `
          <div style="margin-bottom: 12px;">
            <strong style="color: #d4af37; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
              ${label}
            </strong>
            <p style="margin: 4px 0 0 0; color: #e5e5e5; line-height: 1.5; white-space: pre-wrap;">
              ${formattedValue}
            </p>
          </div>
        `;
      })
      .join('');
  };

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${registro.ferramenta_nome} - Jardim da Psique</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Inter:wght@400;500&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          background: #0f0f12;
          color: #e5e5e5;
          padding: 40px;
          line-height: 1.6;
        }
        
        .container {
          max-width: 700px;
          margin: 0 auto;
          background: linear-gradient(135deg, rgba(20, 20, 25, 0.95), rgba(15, 15, 18, 0.98));
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 12px;
          padding: 40px;
        }
        
        .header {
          text-align: center;
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          padding-bottom: 24px;
          margin-bottom: 32px;
        }
        
        .logo {
          font-family: 'Cinzel', serif;
          font-size: 12px;
          color: #d4af37;
          letter-spacing: 3px;
          margin-bottom: 16px;
        }
        
        h1 {
          font-family: 'Cinzel', serif;
          font-size: 24px;
          color: #d4af37;
          margin-bottom: 8px;
        }
        
        .date {
          color: #888;
          font-size: 14px;
        }
        
        .section {
          margin-bottom: 32px;
        }
        
        .section-title {
          font-family: 'Cinzel', serif;
          font-size: 16px;
          color: #d4af37;
          border-bottom: 1px solid rgba(212, 175, 55, 0.15);
          padding-bottom: 8px;
          margin-bottom: 16px;
        }
        
        .symbolic-section {
          background: rgba(212, 175, 55, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 32px;
        }
        
        .reflection {
          background: rgba(16, 185, 129, 0.05);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 32px;
        }
        
        .reflection p {
          font-style: italic;
          color: #a3e6c3;
        }
        
        .badge {
          display: inline-block;
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          margin-top: 16px;
        }
        
        .footer {
          text-align: center;
          color: #666;
          font-size: 11px;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid rgba(212, 175, 55, 0.1);
        }
        
        @media print {
          body {
            background: white;
            color: #1a1a1a;
            padding: 20px;
          }
          
          .container {
            background: white;
            border: 1px solid #ddd;
            box-shadow: none;
          }
          
          h1, .section-title, .logo {
            color: #8B7355;
          }
          
          .symbolic-section {
            background: #fdf8f0;
            border-color: #d4af37;
          }
          
          .reflection {
            background: #f0fdf4;
            border-color: #10b981;
          }
          
          .reflection p {
            color: #065f46;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🌿 JARDIM DA PSIQUE</div>
          <h1>${registro.ferramenta_nome}</h1>
          <p class="date">${dataFormatada}</p>
          ${registro.integrado ? '<span class="badge">✓ Integrado</span>' : ''}
        </div>
        
        ${Object.keys(registro.conteudo).length > 0 ? `
          <div class="section">
            <h2 class="section-title">Respostas da Leitura</h2>
            ${formatEntries(registro.conteudo)}
          </div>
        ` : ''}
        
        ${registro.resultado_simbolico && Object.keys(registro.resultado_simbolico).length > 0 ? `
          <div class="symbolic-section">
            <h2 class="section-title">✨ Resultado Simbólico</h2>
            ${formatEntries(registro.resultado_simbolico)}
          </div>
        ` : ''}
        
        ${registro.reflexao_pessoal ? `
          <div class="reflection">
            <h2 class="section-title">Reflexões da Tecelã</h2>
            <p>${registro.reflexao_pessoal}</p>
          </div>
        ` : ''}
        
        <div class="footer">
          <p>Registro privado exportado do Jardim da Psique</p>
          <p>Casa Orácula • ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
        </div>
      </div>
      
      <script>
        // Auto-trigger print dialog
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  // Open in new window
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}
