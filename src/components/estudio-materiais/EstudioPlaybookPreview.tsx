import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
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
  const handleDownload = async () => {
    if (!contentRef.current) return;
    try {
      const canvas = await html2canvas(contentRef.current, { scale: 2, backgroundColor: '#000000', useCORS: true });
      const link = document.createElement('a');
      link.download = `playbook-${livroTitulo.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) { console.error('Download error:', err); }
  };

  if (!estrutura) return null;
  const jornada = estrutura.jornada_predominante || 'Individuação';

  // Shared inline styles for the self-contained printable document
  const gold = '#C6A75E';
  const goldDim = '#C6A75E66';
  const goldFaint = '#C6A75E22';
  const cream = '#F0E8D8';
  const creamDim = '#D4C9B899';
  const bg = '#000000';
  const cardBg = 'rgba(255,255,255,0.02)';
  const cardBorder = 'rgba(198,167,94,0.15)';
  const alertBg = 'rgba(180,60,60,0.08)';
  const alertBorder = 'rgba(180,60,60,0.25)';
  const ritualBg = 'rgba(198,167,94,0.06)';

  return (
    <div className="space-y-4 mt-4">
      <div className="flex gap-2 justify-end print:hidden">
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
        style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif", color: cream, background: bg }}
      >
        {/* ═══════════ CAPA ═══════════ */}
        <div
          style={{
            background: `radial-gradient(ellipse at 50% 30%, rgba(198,167,94,0.12) 0%, transparent 60%), ${bg}`,
            padding: '64px 40px',
            textAlign: 'center',
            borderBottom: `1px solid ${goldFaint}`,
            minHeight: '380px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px',
          }}
        >
          {/* Ambient mist glow */}
          <div style={{ position: 'relative' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.45em', textTransform: 'uppercase', color: goldDim, marginBottom: '8px' }}>
              Círculo de Leitura Simbólica
            </p>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: cream, lineHeight: 1.3, margin: '0 0 8px' }}>
              {estrutura.titulo_pedagogico || livroTitulo}
            </h1>
            <p style={{ fontSize: '14px', color: creamDim }}>{livroTitulo}</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '12px' }}>
            <span style={{ fontSize: '11px', padding: '4px 14px', borderRadius: '20px', border: `1px solid ${goldFaint}`, color: gold }}>
              Jornada: {jornada}
            </span>
            <span style={{ fontSize: '11px', padding: '4px 14px', borderRadius: '20px', border: `1px solid ${goldFaint}`, color: gold }}>
              {estrutura.encontros?.length || 4} Encontros
            </span>
          </div>

          {(nomeMentora || nomeGrupo) && (
            <div style={{ marginTop: '16px' }}>
              {nomeMentora && <p style={{ fontSize: '14px', color: gold }}>{nomeMentora}</p>}
              {nomeGrupo && <p style={{ fontSize: '12px', color: goldDim }}>{nomeGrupo}</p>}
            </div>
          )}
        </div>

        {/* ═══════════ ESSÊNCIA 80/20 ═══════════ */}
        <div style={{ padding: '40px 36px', borderBottom: `1px solid ${goldFaint}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ color: gold, fontSize: '20px' }}>✦</span>
            <h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: gold, margin: 0 }}>
              Essência 80/20
            </h2>
          </div>
          <p style={{ fontSize: '14px', lineHeight: 1.9, color: cream, margin: 0 }}>
            {estrutura.essencia_8020}
          </p>
        </div>

        {/* Paisagem Interior */}
        {estrutura.mapa_simbolico && (
          <div style={{ padding: '32px 36px', borderBottom: `1px solid ${goldFaint}`, background: cardBg }}>
            <h2 style={{ fontSize: '12px', fontWeight: 700, color: goldDim, marginBottom: '12px' }}>◈ Paisagem Interior</h2>
            <p style={{ fontSize: '13px', lineHeight: 1.85, color: creamDim, fontStyle: 'italic' }}>
              {estrutura.mapa_simbolico}
            </p>
          </div>
        )}

        {/* Tensões & Campos */}
        {(estrutura.tensoes_centrais?.length > 0 || estrutura.arquetipos_envolvidos?.length > 0) && (
          <div style={{ padding: '32px 36px', borderBottom: `1px solid ${goldFaint}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            {estrutura.tensoes_centrais?.length > 0 && (
              <div>
                <h3 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: gold, marginBottom: '12px' }}>
                  Tensões Centrais
                </h3>
                {estrutura.tensoes_centrais.map((t: string, i: number) => (
                  <p key={i} style={{ fontSize: '12px', color: creamDim, marginBottom: '8px', paddingLeft: '12px', borderLeft: `2px solid ${goldFaint}` }}>
                    {t}
                  </p>
                ))}
              </div>
            )}
            {estrutura.arquetipos_envolvidos?.length > 0 && (
              <div>
                <h3 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: goldDim, marginBottom: '12px' }}>
                  Campos Arquetípicos
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {estrutura.arquetipos_envolvidos.map((a: string, i: number) => (
                    <span key={i} style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '4px', background: cardBg, color: goldDim, border: `1px solid ${cardBorder}` }}>
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
          <div key={i} style={{ padding: '40px 36px', borderBottom: `1px solid ${goldFaint}` }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontSize: '22px' }}>{FASE_ICONS[enc.fase] || '◉'}</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: cream, margin: 0 }}>
                    Encontro {enc.numero}
                  </h3>
                  <span style={{ fontSize: '10px', padding: '2px 10px', borderRadius: '10px', background: goldFaint, color: gold }}>
                    {enc.fase}
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: gold, margin: '2px 0 0' }}>{enc.titulo}</p>
              </div>
            </div>

            {/* Tema */}
            <p style={{ fontSize: '13px', lineHeight: 1.8, color: creamDim, marginBottom: '20px' }}>{enc.tema_central}</p>

            {/* Abertura */}
            {enc.abertura_ritual && (
              <div style={{ marginBottom: '20px', padding: '16px', borderRadius: '8px', background: ritualBg, border: `1px solid ${goldFaint}` }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: gold, marginBottom: '4px' }}>🜂 Abertura do Campo</p>
                <p style={{ fontSize: '12px', color: creamDim, margin: 0 }}>{enc.abertura_ritual}</p>
              </div>
            )}

            {/* Perguntas */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: gold, marginBottom: '12px' }}>
                Perguntas de Travessia
              </p>
              {enc.perguntas_guiadas?.map((p: string, j: number) => (
                <p key={j} style={{ fontSize: '12px', paddingLeft: '14px', marginBottom: '10px', lineHeight: 1.7, color: cream, borderLeft: `2px solid ${goldDim}` }}>
                  {p}
                </p>
              ))}
            </div>

            {/* Aplicação */}
            {enc.aplicacao_profissional && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: goldDim, marginBottom: '6px' }}>◈ Aplicação em Sessão / Círculo</p>
                <p style={{ fontSize: '12px', lineHeight: 1.7, color: creamDim }}>{enc.aplicacao_profissional}</p>
              </div>
            )}

            {/* O que NÃO fazer */}
            {enc.o_que_nao_fazer && (
              <div style={{ marginBottom: '20px', padding: '14px', borderRadius: '8px', background: alertBg, border: `1px solid ${alertBorder}` }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#D4797A', marginBottom: '4px' }}>⚠ O que NÃO fazer</p>
                <p style={{ fontSize: '12px', color: creamDim, margin: 0 }}>{enc.o_que_nao_fazer}</p>
              </div>
            )}

            {/* Alerta Clínico */}
            {enc.alerta_clinico && (
              <div style={{ marginBottom: '20px', padding: '14px', borderRadius: '8px', background: 'rgba(198,167,94,0.05)', border: `1px solid ${goldFaint}` }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: gold, marginBottom: '4px' }}>⚕ Alerta Clínico</p>
                <p style={{ fontSize: '12px', color: creamDim, margin: 0 }}>{enc.alerta_clinico}</p>
              </div>
            )}

            {/* Anotações */}
            <div style={{ marginTop: '16px', padding: '16px', borderRadius: '8px', border: `1px dashed ${goldFaint}`, minHeight: '56px' }}>
              <p style={{ fontSize: '11px', fontStyle: 'italic', color: 'rgba(198,167,94,0.3)', margin: 0 }}>Espaço para anotações da mentora</p>
            </div>

            {/* Encerramento */}
            {enc.encerramento_ritual && (
              <div style={{ marginTop: '16px', padding: '16px', borderRadius: '8px', background: ritualBg, border: `1px solid ${goldFaint}` }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: gold, marginBottom: '4px' }}>🜃 Fechamento do Campo</p>
                <p style={{ fontSize: '12px', color: creamDim, margin: 0 }}>{enc.encerramento_ritual}</p>
              </div>
            )}
          </div>
        ))}

        {/* ═══════════ USOS INADEQUADOS ═══════════ */}
        {estrutura.usos_inadequados?.length > 0 && (
          <div style={{ padding: '32px 36px', borderBottom: `1px solid ${goldFaint}` }}>
            <h2 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#D4797A', marginBottom: '16px' }}>
              ⚠ Usos Inadequados deste Material
            </h2>
            {estrutura.usos_inadequados.map((u: string, i: number) => (
              <p key={i} style={{ fontSize: '12px', color: creamDim, marginBottom: '8px', paddingLeft: '12px', borderLeft: '2px solid rgba(212,121,122,0.3)' }}>
                {u}
              </p>
            ))}
          </div>
        )}

        {/* Observação Clínica */}
        {estrutura.observacao_clinica && (
          <div style={{ padding: '32px 36px', borderBottom: `1px solid ${goldFaint}`, background: cardBg }}>
            <h2 style={{ fontSize: '12px', fontWeight: 700, color: gold, marginBottom: '12px' }}>⚕ Observação Clínica</h2>
            <p style={{ fontSize: '13px', lineHeight: 1.8, color: creamDim }}>{estrutura.observacao_clinica}</p>
          </div>
        )}

        {/* ═══════════ JARDINS ═══════════ */}
        <div style={{ padding: '32px 36px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', borderBottom: `1px solid ${goldFaint}` }}>
          {estrutura.convites_jardim_psique?.length > 0 && (
            <div>
              <h3 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: goldDim, marginBottom: '14px' }}>
                🌿 Jardim da Psique
              </h3>
              {estrutura.convites_jardim_psique.map((c: string, i: number) => (
                <p key={i} style={{ fontSize: '12px', fontStyle: 'italic', lineHeight: 1.7, color: creamDim, marginBottom: '10px' }}>
                  "{c}"
                </p>
              ))}
            </div>
          )}
          {estrutura.convites_jardim_oficio?.length > 0 && (
            <div>
              <h3 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: gold, marginBottom: '14px' }}>
                ⚒ Jardim do Ofício
              </h3>
              {estrutura.convites_jardim_oficio.map((c: string, i: number) => (
                <p key={i} style={{ fontSize: '12px', fontStyle: 'italic', lineHeight: 1.7, color: creamDim, marginBottom: '10px' }}>
                  "{c}"
                </p>
              ))}
            </div>
          )}
        </div>

        {/* ═══════════ RODAPÉ ═══════════ */}
        <div style={{
          padding: '24px 36px',
          textAlign: 'center',
          background: `radial-gradient(ellipse at 50% 100%, rgba(198,167,94,0.08) 0%, transparent 70%), ${bg}`,
        }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: gold, margin: '0 0 4px' }}>
            Método de Leitura Oracular — Casa Orácula
          </p>
          <p style={{ fontSize: '10px', color: 'rgba(198,167,94,0.3)', margin: 0 }}>
            Círculo de Leitura Simbólica · Material de Uso Formativo
          </p>
        </div>
      </div>
    </div>
  );
}
