import jsPDF from 'jspdf';

interface PdfExportData {
  clienteNome: string;
  periodoInicio: string | null;
  periodoFim: string | null;
  totalSessoes: number;
  distritosAtivos: number;
  distritosIntegrados: number;
  sections: { title: string; content: string }[];
  traversals: { date: string; label: string; detail: string }[];
  districts: { nome: string; state: string; sessions_count: number }[];
  patterns: { pattern_name: string; occurrence_count: number }[];
}

export function generateRelatorioPDF(data: PdfExportData) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxW = pageW - margin * 2;
  let y = margin;

  const checkPage = (needed: number) => {
    if (y + needed > pageH - 20) {
      doc.addPage();
      y = margin;
    }
  };

  // Header
  doc.setFillColor(11, 27, 43);
  doc.rect(0, 0, pageW, 40, 'F');
  doc.setTextColor(201, 162, 74);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Relatório Narrativo da Jornada', margin, 18);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 200);
  doc.text(`${data.clienteNome} · Casa Orácula`, margin, 27);

  const periodoText = data.periodoInicio && data.periodoFim
    ? `${formatDate(data.periodoInicio)} — ${formatDate(data.periodoFim)}`
    : 'Período não definido';
  doc.setFontSize(8);
  doc.text(periodoText, margin, 34);

  y = 50;

  // Stats
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  const stats = [
    `${data.totalSessoes} sessões`,
    `${data.distritosAtivos} distritos ativos`,
    `${data.distritosIntegrados} integrados`,
  ];
  doc.text(stats.join('  ·  '), margin, y);
  y += 10;

  // Separator
  doc.setDrawColor(201, 162, 74);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // Narrative sections
  for (const section of data.sections) {
    if (!section.content) continue;
    checkPage(20);

    doc.setTextColor(201, 162, 74);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(section.title, margin, y);
    y += 6;

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(section.content, maxW);
    for (const line of lines) {
      checkPage(5);
      doc.text(line, margin, y);
      y += 4.5;
    }
    y += 6;
  }

  // Districts table
  if (data.districts.length > 0) {
    checkPage(20);
    doc.setDrawColor(201, 162, 74);
    doc.line(margin, y, pageW - margin, y);
    y += 8;

    doc.setTextColor(201, 162, 74);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Territórios da Jornada', margin, y);
    y += 7;

    for (const d of data.districts.slice(0, 12)) {
      checkPage(6);
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      const stateLabel = d.state === 'integrado' ? '✓ integrado' : d.state === 'ativo' ? '● ativo' : '○ inativo';
      doc.text(`${d.nome}  —  ${stateLabel}  (${d.sessions_count} sessões)`, margin + 2, y);
      y += 5;
    }
    y += 4;
  }

  // Patterns
  if (data.patterns.length > 0) {
    checkPage(16);
    doc.setTextColor(201, 162, 74);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Padrões Recorrentes', margin, y);
    y += 7;

    for (const p of data.patterns.slice(0, 8)) {
      checkPage(5);
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`${p.pattern_name}  (${p.occurrence_count}×)`, margin + 2, y);
      y += 5;
    }
    y += 4;
  }

  // Footer on each page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(160, 160, 160);
    doc.setFont('helvetica', 'italic');
    doc.text(
      'Leitura simbólica da jornada. Não substitui julgamento clínico. A interpretação pertence à facilitadora.',
      margin,
      pageH - 10,
    );
    doc.text(`Página ${i} de ${totalPages}`, pageW - margin - 20, pageH - 10);
  }

  doc.save(`relatorio-jornada-${data.clienteNome.replace(/\s+/g, '-').toLowerCase()}.pdf`);
}

function formatDate(d: string): string {
  try {
    return new Date(d).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return d;
  }
}
