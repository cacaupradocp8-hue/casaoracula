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

const FASE_ICONS: Record<string, string> = {
  'Chamado': '🌑',
  'Ruptura': '🌒',
  'Reorganização': '🌓',
  'Integração': '🌕',
};

export default function EstudioPlaybookPreview({ estrutura, nomeMentora, nomeGrupo, livroTitulo }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = () => window.print();

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        backgroundColor: '#111111',
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
      pdf.save(`playbook-${livroTitulo.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    } catch (err) {
      console.error('PDF error:', err);
    }
  };

  if (!estrutura) return null;
  const jornada = estrutura.jornada_predominante || 'Individuação';

  // ── Premium palette with HIGH CONTRAST ──
  const gold = '#D4B06A';
  const goldSoft = '#C6A75E';
  const goldFaint = 'rgba(198,167,94,0.18)';
  const white = '#FFFFFF';
  const offWhite = '#F0ECE3';
  const textBody = '#E8E2D6';
  const textMuted = '#C8C0B0';
  const bg = '#111111';
  const bgCard = 'rgba(255,255,255,0.06)';
  const borderCard = 'rgba(198,167,94,0.3)';
  const alertBg = 'rgba(190,60,60,0.15)';
  const alertBorder = 'rgba(190,60,60,0.5)';
  const ritualBg = 'rgba(198,167,94,0.12)';

  const sectionStyle = (extra?: React.CSSProperties): React.CSSProperties => ({
    padding: '36px 40px',
    borderBottom: `1px solid ${goldFaint}`,
    ...extra,
  });

  const sectionTitle = (color = gold): React.CSSProperties => ({
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    color,
    marginBottom: '16px',
  });

  return (
    <div className="space-y-4 mt-4">
      {/* ── Action buttons ── */}
      <div className="flex gap-2 justify-end print:hidden">
        <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
          <Printer className="w-4 h-4" /> Imprimir
        </Button>
        <Button size="sm" onClick={handleDownloadPDF} className="gap-2 bg-[#D4B06A] text-black hover:bg-[#C6A75E]">
          <Download className="w-4 h-4" /> Baixar PDF
        </Button>
      </div>

      <div
        ref={contentRef}
        className="mx-auto max-w-2xl print:max-w-none rounded-xl overflow-hidden"
        style={{
          fontFamily: "'Cormorant Garamond', 'Georgia', serif",
          color: textBody,
          background: bg,
          border: `1px solid ${borderCard}`,
        }}
      >
        {/* ═══════════ CAPA ═══════════ */}
        <div
          style={{
            background: `radial-gradient(ellipse at 50% 20%, rgba(198,167,94,0.15) 0%, transparent 65%), ${bg}`,
            padding: '72px 48px 56px',
            textAlign: 'center',
            borderBottom: `1px solid ${goldFaint}`,
          }}
        >
          <p style={{ fontSize: '10px', letterSpacing: '0.5em', textTransform: 'uppercase', color: goldSoft, marginBottom: '20px' }}>
            ✦ Círculo de Leitura Simbólica ✦
          </p>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: white, lineHeight: 1.3, margin: '0 0 10px' }}>
            {estrutura.titulo_pedagogico || livroTitulo}
          </h1>
          <p style={{ fontSize: '15px', color: textMuted, marginBottom: '24px' }}>{livroTitulo}</p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', padding: '5px 16px', borderRadius: '20px', border: `1px solid ${borderCard}`, color: gold, background: bgCard }}>
              Jornada: {jornada}
            </span>
            <span style={{ fontSize: '11px', padding: '5px 16px', borderRadius: '20px', border: `1px solid ${borderCard}`, color: gold, background: bgCard }}>
              {estrutura.encontros?.length || 4} Encontros
            </span>
          </div>

          {(nomeMentora || nomeGrupo) && (
            <div style={{ marginTop: '24px' }}>
              {nomeMentora && <p style={{ fontSize: '15px', color: gold, fontWeight: 600 }}>{nomeMentora}</p>}
              {nomeGrupo && <p style={{ fontSize: '13px', color: textMuted, marginTop: '4px' }}>{nomeGrupo}</p>}
            </div>
          )}
        </div>

        {/* ═══════════ ESSÊNCIA 80/20 ═══════════ */}
        <div style={sectionStyle()}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ color: gold, fontSize: '18px' }}>◈</span>
            <h2 style={sectionTitle()}>Essência 80/20</h2>
          </div>
          <p style={{ fontSize: '15px', lineHeight: 2, color: white, margin: 0 }}>
            {estrutura.essencia_8020}
          </p>
        </div>

        {/* Paisagem Interior */}
        {estrutura.mapa_simbolico && (
          <div style={sectionStyle({ background: bgCard })}>
            <h2 style={sectionTitle(goldSoft)}>◈ Paisagem Interior</h2>
            <p style={{ fontSize: '14px', lineHeight: 1.9, color: offWhite, fontStyle: 'italic' }}>
              {estrutura.mapa_simbolico}
            </p>
          </div>
        )}

        {/* Tensões & Campos */}
        {(estrutura.tensoes_centrais?.length > 0 || estrutura.arquetipos_envolvidos?.length > 0) && (
          <div style={sectionStyle({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' })}>
            {estrutura.tensoes_centrais?.length > 0 && (
              <div>
                <h3 style={sectionTitle()}>Tensões Centrais</h3>
                {estrutura.tensoes_centrais.map((t: string, i: number) => (
                  <p key={i} style={{ fontSize: '13px', color: offWhite, marginBottom: '10px', paddingLeft: '14px', borderLeft: `3px solid ${gold}` }}>
                    {t}
                  </p>
                ))}
              </div>
            )}
            {estrutura.arquetipos_envolvidos?.length > 0 && (
              <div>
                <h3 style={sectionTitle(goldSoft)}>Campos Arquetípicos</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {estrutura.arquetipos_envolvidos.map((a: string, i: number) => (
                    <span key={i} style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '6px', background: bgCard, color: offWhite, border: `1px solid ${borderCard}` }}>
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════ ENCONTROS ═══════════ */}
        {estrutura.encontros?.map((enc: any, i: number) => (
          <div key={i} style={sectionStyle()}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
              <span style={{ fontSize: '28px', filter: 'drop-shadow(0 0 6px rgba(198,167,94,0.4))' }}>{FASE_ICONS[enc.fase] || '◉'}</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ fontSize: '19px', fontWeight: 700, color: white, margin: 0 }}>
                    Encontro {enc.numero}
                  </h3>
                  <span style={{ fontSize: '10px', padding: '3px 12px', borderRadius: '12px', background: 'rgba(198,167,94,0.2)', color: gold, fontWeight: 600 }}>
                    {enc.fase}
                  </span>
                </div>
                <p style={{ fontSize: '15px', color: gold, margin: '4px 0 0', fontWeight: 500 }}>{enc.titulo}</p>
              </div>
            </div>

            {/* Tema */}
            <p style={{ fontSize: '14px', lineHeight: 1.9, color: offWhite, marginBottom: '24px' }}>{enc.tema_central}</p>

            {/* Abertura */}
            {enc.abertura_ritual && (
              <div style={{ marginBottom: '20px', padding: '18px', borderRadius: '10px', background: ritualBg, border: `1px solid ${borderCard}` }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: gold, marginBottom: '6px', letterSpacing: '0.1em' }}>🜂 ABERTURA DO CAMPO</p>
                <p style={{ fontSize: '13px', color: offWhite, margin: 0, lineHeight: 1.8 }}>{enc.abertura_ritual}</p>
              </div>
            )}

            {/* Perguntas */}
            <div style={{ marginBottom: '24px' }}>
              <p style={sectionTitle()}>Perguntas de Travessia</p>
              {enc.perguntas_guiadas?.map((p: string, j: number) => (
                <p key={j} style={{ fontSize: '13px', paddingLeft: '16px', marginBottom: '12px', lineHeight: 1.8, color: white, borderLeft: `3px solid ${gold}` }}>
                  {p}
                </p>
              ))}
            </div>

            {/* Aplicação */}
            {enc.aplicacao_profissional && (
              <div style={{ marginBottom: '20px' }}>
                <p style={sectionTitle(goldSoft)}>◈ Aplicação em Sessão / Círculo</p>
                <p style={{ fontSize: '13px', lineHeight: 1.8, color: offWhite }}>{enc.aplicacao_profissional}</p>
              </div>
            )}

            {/* O que NÃO fazer */}
            {enc.o_que_nao_fazer && (
              <div style={{ marginBottom: '20px', padding: '16px', borderRadius: '10px', background: alertBg, border: `1px solid ${alertBorder}` }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#E87C7D', marginBottom: '6px', letterSpacing: '0.08em' }}>⚠ O QUE NÃO FAZER</p>
                <p style={{ fontSize: '13px', color: offWhite, margin: 0, lineHeight: 1.7 }}>{enc.o_que_nao_fazer}</p>
              </div>
            )}

            {/* Alerta Clínico */}
            {enc.alerta_clinico && (
              <div style={{ marginBottom: '20px', padding: '16px', borderRadius: '10px', background: bgCard, border: `1px solid ${borderCard}` }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: gold, marginBottom: '6px', letterSpacing: '0.08em' }}>⚕ ALERTA CLÍNICO</p>
                <p style={{ fontSize: '13px', color: offWhite, margin: 0, lineHeight: 1.7 }}>{enc.alerta_clinico}</p>
              </div>
            )}

            {/* Anotações */}
            <div style={{ marginTop: '20px', padding: '20px', borderRadius: '10px', border: `1px dashed ${borderCard}`, minHeight: '60px', background: 'rgba(255,255,255,0.02)' }}>
              <p style={{ fontSize: '11px', fontStyle: 'italic', color: textMuted, margin: 0 }}>Espaço para anotações da mentora</p>
            </div>

            {/* Encerramento */}
            {enc.encerramento_ritual && (
              <div style={{ marginTop: '20px', padding: '18px', borderRadius: '10px', background: ritualBg, border: `1px solid ${borderCard}` }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: gold, marginBottom: '6px', letterSpacing: '0.1em' }}>🜃 FECHAMENTO DO CAMPO</p>
                <p style={{ fontSize: '13px', color: offWhite, margin: 0, lineHeight: 1.8 }}>{enc.encerramento_ritual}</p>
              </div>
            )}
          </div>
        ))}

        {/* ═══════════ USOS INADEQUADOS ═══════════ */}
        {estrutura.usos_inadequados?.length > 0 && (
          <div style={sectionStyle()}>
            <h2 style={sectionTitle('#E87C7D')}>⚠ Usos Inadequados deste Material</h2>
            {estrutura.usos_inadequados.map((u: string, i: number) => (
              <p key={i} style={{ fontSize: '13px', color: offWhite, marginBottom: '10px', paddingLeft: '14px', borderLeft: '3px solid rgba(232,124,125,0.5)' }}>
                {u}
              </p>
            ))}
          </div>
        )}

        {/* Observação Clínica */}
        {estrutura.observacao_clinica && (
          <div style={sectionStyle({ background: bgCard })}>
            <h2 style={sectionTitle()}>⚕ Observação Clínica</h2>
            <p style={{ fontSize: '14px', lineHeight: 1.9, color: offWhite }}>{estrutura.observacao_clinica}</p>
          </div>
        )}

        {/* ═══════════ JARDINS ═══════════ */}
        <div style={sectionStyle({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' })}>
          {estrutura.convites_jardim_psique?.length > 0 && (
            <div>
              <h3 style={sectionTitle(goldSoft)}>🌿 Jardim da Psique</h3>
              {estrutura.convites_jardim_psique.map((c: string, i: number) => (
                <p key={i} style={{ fontSize: '13px', fontStyle: 'italic', lineHeight: 1.8, color: offWhite, marginBottom: '12px' }}>
                  "{c}"
                </p>
              ))}
            </div>
          )}
          {estrutura.convites_jardim_oficio?.length > 0 && (
            <div>
              <h3 style={sectionTitle(gold)}>⚒ Jardim do Ofício</h3>
              {estrutura.convites_jardim_oficio.map((c: string, i: number) => (
                <p key={i} style={{ fontSize: '13px', fontStyle: 'italic', lineHeight: 1.8, color: offWhite, marginBottom: '12px' }}>
                  "{c}"
                </p>
              ))}
            </div>
          )}
        </div>

        {/* ═══════════ RODAPÉ ═══════════ */}
        <div style={{
          padding: '28px 40px',
          textAlign: 'center',
          background: `radial-gradient(ellipse at 50% 100%, rgba(198,167,94,0.1) 0%, transparent 70%), ${bg}`,
        }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', color: gold, margin: '0 0 6px' }}>
            Método de Leitura Oracular — Casa Orácula
          </p>
          <p style={{ fontSize: '10px', color: textMuted, margin: 0 }}>
            Círculo de Leitura Simbólica · Material de Uso Formativo
          </p>
        </div>
      </div>
    </div>
  );
}
