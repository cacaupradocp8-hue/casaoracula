import { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, Download, Loader2, MapPin, Shield, Sparkles, Compass } from 'lucide-react';
import { type JourneyReportData, TERRITORY_LABELS } from '@/lib/journey-report';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Props {
  data: JourneyReportData;
  clienteId: string;
  onClose: () => void;
}

export function JourneyReportPreview({ data, clienteId, onClose }: Props) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setExporting(true);

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0B1B2B',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `relatorio-jornada-${data.cliente.nome.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      // Save report_url reference
      await supabase.from('clientes').update({
        observacao_segura: `Último relatório gerado em ${new Date().toLocaleDateString('pt-BR')}`,
      } as any).eq('id', clienteId);

      toast.success('PDF exportado com sucesso');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao gerar PDF');
    }
    setExporting(false);
  };

  const fmtDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex items-center justify-between sticky top-0 z-10 bg-[#0B1B2B] py-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#C9A24A]" />
          <span className="text-sm font-semibold text-[#F5F1E8]">Relatório de Jornada</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose}
            className="border-[#C9A24A]/10 text-[#F5F1E8]/50 h-8 text-xs">Fechar</Button>
          <Button size="sm" onClick={handleExportPDF} disabled={exporting}
            className="bg-[#C9A24A] hover:bg-[#C9A24A]/80 text-[#0B1B2B] h-8 text-xs gap-1">
            {exporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Report Content */}
      <div ref={reportRef} className="space-y-6 p-6 bg-[#0B1B2B] rounded-xl border border-[#C9A24A]/10">

        {/* 1. Abertura */}
        <div className="text-center space-y-2 pb-4">
          <h1 className="text-lg font-bold text-[#C9A24A] tracking-wide">RELATÓRIO DE JORNADA</h1>
          <h2 className="text-base text-[#F5F1E8] font-medium">CidaDELA Interior</h2>
          <Separator className="bg-[#C9A24A]/20 my-3" />
          <div className="grid grid-cols-2 gap-4 text-left max-w-sm mx-auto">
            <div>
              <span className="text-[9px] text-[#C9A24A]/50 uppercase">Cliente</span>
              <p className="text-sm text-[#F5F1E8]">{data.cliente.nome}</p>
            </div>
            <div>
              <span className="text-[9px] text-[#C9A24A]/50 uppercase">Facilitadora</span>
              <p className="text-sm text-[#F5F1E8]">{data.terapeuta.nome}</p>
            </div>
            <div>
              <span className="text-[9px] text-[#C9A24A]/50 uppercase">Início</span>
              <p className="text-sm text-[#F5F1E8]">{fmtDate(data.cliente.data_inicio)}</p>
            </div>
            <div>
              <span className="text-[9px] text-[#C9A24A]/50 uppercase">Gerado em</span>
              <p className="text-sm text-[#F5F1E8]">{fmtDate(data.dataGeracao)}</p>
            </div>
          </div>
          <p className="text-[10px] text-[#F5F1E8]/30 italic mt-3 max-w-md mx-auto leading-relaxed">
            Este relatório é uma síntese narrativa simbólica da jornada terapêutica.
            Não constitui diagnóstico clínico. O conteúdo aqui registrado pertence ao campo da escuta
            e da linguagem simbólica, respeitando os limites éticos do processo.
          </p>
        </div>

        {/* 2. Cartografia */}
        {data.cartografia && (
          <section>
            <SectionTitle icon={<Compass className="w-3.5 h-3.5" />} title="Cartografia Psíquica" />
            <div className="grid grid-cols-5 gap-2 mt-3">
              {Object.entries(data.cartografia.scores).map(([key, score]) => (
                <div key={key} className="text-center">
                  <div className="relative w-12 h-12 mx-auto mb-1">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <circle cx="18" cy="18" r="15.91" fill="transparent" stroke="rgba(245,241,232,0.05)" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.91" fill="transparent" stroke="#C9A24A" strokeWidth="3"
                        strokeDasharray={`${score} ${100 - score}`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#F5F1E8]">{score}</span>
                  </div>
                  <p className="text-[8px] text-[#F5F1E8]/40 leading-tight">{TERRITORY_LABELS[key] || key}</p>
                  <Badge variant="outline" className={`text-[7px] mt-0.5 ${
                    data.cartografia!.classification[key] === 'alto' ? 'border-[#556B57]/30 text-[#556B57]'
                    : data.cartografia!.classification[key] === 'baixo' ? 'border-red-400/30 text-red-400'
                    : 'border-[#C9A24A]/30 text-[#C9A24A]'
                  }`}>
                    {data.cartografia!.classification[key] || '—'}
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. Torres */}
        {data.torres.length > 0 && (
          <section>
            <SectionTitle icon={<Shield className="w-3.5 h-3.5" />} title="Torres Identificadas" />
            <div className="flex flex-wrap gap-2 mt-2">
              {data.torres.map((t, i) => (
                <Badge key={i} variant="outline" className="border-[#C9A24A]/20 text-[#F5F1E8]/60 text-xs py-1 px-3">
                  {t}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* 4. Mapa da Jornada */}
        <section>
          <SectionTitle icon={<MapPin className="w-3.5 h-3.5" />} title="Mapa da Jornada" />
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
            {data.distritos.map(d => (
              <Card key={d.nome} className={`border ${
                d.state === 'integrado' ? 'border-[#C9A24A]/30 bg-[#C9A24A]/5'
                : d.state === 'ativo' ? 'border-[#C9A24A]/15 bg-[#C9A24A]/[0.03]'
                : 'border-[#F5F1E8]/5 bg-transparent'
              }`}>
                <CardContent className="p-2 text-center">
                  <p className="text-[9px] text-[#F5F1E8]/60 font-medium">{d.nome}</p>
                  <Badge variant="outline" className={`text-[7px] mt-1 ${
                    d.state === 'integrado' ? 'border-[#556B57]/30 text-[#556B57]'
                    : d.state === 'ativo' ? 'border-[#C9A24A]/30 text-[#C9A24A]'
                    : 'border-[#F5F1E8]/10 text-[#F5F1E8]/20'
                  }`}>
                    {d.state} · {d.sessions_count}s
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-[10px] text-[#F5F1E8]/30 mt-2 text-center">
            Total: {data.totalSessoes} sessão(ões) registradas
          </p>
        </section>

        {/* 5. Arquétipos */}
        {data.arquetipos.length > 0 && (
          <section>
            <SectionTitle icon={<Sparkles className="w-3.5 h-3.5" />} title="Arquétipos Ativados" />
            <div className="space-y-2 mt-2">
              {data.arquetipos.map((a, i) => (
                <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-[#F5F1E8]/[0.02]">
                  <div className="w-8 h-8 rounded-full bg-[#C9A24A]/10 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-[#C9A24A]" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#F5F1E8]/70">{a.nome}</p>
                    <p className="text-[10px] text-[#F5F1E8]/30">{a.momento}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. Síntese */}
        <section>
          <SectionTitle icon={<FileText className="w-3.5 h-3.5" />} title="Síntese Narrativa" />
          <p className="text-xs text-[#F5F1E8]/55 leading-relaxed mt-2">{data.sintese}</p>
        </section>

        {/* 7. Chamado */}
        <section className="text-center py-4">
          <Separator className="bg-[#C9A24A]/15 mb-4" />
          <p className="text-[9px] text-[#C9A24A]/40 uppercase tracking-wider mb-2">Chamado para a próxima fase</p>
          <p className="text-sm text-[#C9A24A] italic font-medium">"{data.chamado}"</p>
          <Separator className="bg-[#C9A24A]/15 mt-4" />
          <p className="text-[8px] text-[#F5F1E8]/15 mt-3">Casa Orácula · CidaDELA Interior · {new Date().getFullYear()}</p>
        </section>
      </div>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[#C9A24A]">{icon}</span>
      <h3 className="text-xs uppercase tracking-wider text-[#C9A24A]/60 font-semibold">{title}</h3>
    </div>
  );
}
