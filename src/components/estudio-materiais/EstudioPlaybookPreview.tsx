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
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        backgroundColor: '#0A0A0A',
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

  const jornada = estrutura.jornada_predominante || 'Individuação';

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
        style={{ fontFamily: "'Georgia', 'Garamond', serif", color: '#E8E0D4' }}
      >
        {/* ═══ CAPA ═══ */}
        <div
          className="rounded-t-lg p-10 text-center space-y-5"
          style={{
            background: 'linear-gradient(180deg, #0A0F0A 0%, #1A2A1F 50%, #0A0F0A 100%)',
            minHeight: '340px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderBottom: '2px solid #C6A75E',
          }}
        >
          <p className="text-xs tracking-[0.4em] uppercase" style={{ color: '#C6A75E' }}>
            Círculo de Leitura Simbólica
          </p>
          <h1 className="text-2xl font-bold leading-tight" style={{ color: '#F4EFE6' }}>
            {estrutura.titulo_pedagogico || livroTitulo}
          </h1>
          <p className="text-sm opacity-70">{livroTitulo}</p>
          <div className="flex justify-center gap-6 pt-2">
            <span className="text-xs px-3 py-1 rounded-full" style={{ border: '1px solid #C6A75E44', color: '#C6A75E' }}>
              Jornada: {jornada}
            </span>
            <span className="text-xs px-3 py-1 rounded-full" style={{ border: '1px solid #C6A75E44', color: '#C6A75E' }}>
              {estrutura.encontros?.length || 4} Encontros
            </span>
          </div>
          <div className="pt-3 space-y-1">
            {nomeMentora && <p className="text-sm" style={{ color: '#C6A75E' }}>{nomeMentora}</p>}
            {nomeGrupo && <p className="text-xs opacity-60">{nomeGrupo}</p>}
          </div>
        </div>

        {/* ═══ CORPO ═══ */}
        <div className="rounded-b-lg" style={{ backgroundColor: '#0F1410' }}>

          {/* Essência 80/20 */}
          <div className="p-8" style={{ borderBottom: '1px solid #C6A75E22' }}>
            <div className="flex items-center gap-2 mb-4">
              <span style={{ color: '#C6A75E', fontSize: '18px' }}>✦</span>
              <h2 className="text-sm font-bold tracking-wide uppercase" style={{ color: '#C6A75E' }}>
                Essência 80/20
              </h2>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#D4C9B8', lineHeight: '1.8' }}>
              {estrutura.essencia_8020}
            </p>
          </div>

          {/* Mapa Simbólico */}
          {estrutura.mapa_simbolico && (
            <div className="px-8 py-6" style={{ borderBottom: '1px solid #C6A75E22' }}>
              <h2 className="text-sm font-bold mb-3" style={{ color: '#8B9E82' }}>
                ◈ Paisagem Interior
              </h2>
              <p className="text-xs leading-relaxed italic" style={{ color: '#A89B88', lineHeight: '1.8' }}>
                {estrutura.mapa_simbolico}
              </p>
            </div>
          )}

          {/* Tensões & Campos */}
          <div className="px-8 py-6 grid grid-cols-2 gap-6" style={{ borderBottom: '1px solid #C6A75E22' }}>
            {estrutura.tensoes_centrais?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold mb-3 uppercase tracking-wide" style={{ color: '#C6A75E' }}>
                  Tensões Centrais
                </h3>
                {estrutura.tensoes_centrais.map((t: string, i: number) => (
                  <p key={i} className="text-xs mb-2 pl-3" style={{ color: '#B8A998', borderLeft: '2px solid #C6A75E44' }}>
                    {t}
                  </p>
                ))}
              </div>
            )}
            {estrutura.arquetipos_envolvidos?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold mb-3 uppercase tracking-wide" style={{ color: '#8B9E82' }}>
                  Campos Arquetípicos
                </h3>
                <div className="flex flex-wrap gap-2">
                  {estrutura.arquetipos_envolvidos.map((a: string, i: number) => (
                    <span key={i} className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#1A2A1F', color: '#8B9E82', border: '1px solid #8B9E8244' }}>
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ═══ ENCONTROS ═══ */}
          {estrutura.encontros?.map((enc: any, i: number) => (
            <div key={i} className="px-8 py-8" style={{ borderBottom: '1px solid #C6A75E22' }}>
              {/* Header do encontro */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-lg">{FASE_ICONS[enc.fase] || '◉'}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold" style={{ color: '#F4EFE6' }}>
                      Encontro {enc.numero}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#C6A75E22', color: '#C6A75E' }}>
                      {enc.fase}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: '#C6A75E' }}>{enc.titulo}</p>
                </div>
              </div>

              {/* Tema */}
              <p className="text-xs mb-5 leading-relaxed" style={{ color: '#B8A998', lineHeight: '1.7' }}>
                {enc.tema_central}
              </p>

              {/* Abertura */}
              {enc.abertura_ritual && (
                <div className="mb-5 p-4 rounded-lg" style={{ backgroundColor: '#1A2A1F', border: '1px solid #8B9E8233' }}>
                  <p className="text-xs font-bold mb-1" style={{ color: '#8B9E82' }}>
                    🜂 Abertura do Campo
                  </p>
                  <p className="text-xs" style={{ color: '#A89B88' }}>{enc.abertura_ritual}</p>
                </div>
              )}

              {/* Perguntas */}
              <div className="mb-5">
                <p className="text-xs font-bold mb-3 uppercase tracking-wide" style={{ color: '#C6A75E' }}>
                  Perguntas de Travessia
                </p>
                {enc.perguntas_guiadas?.map((p: string, j: number) => (
                  <p key={j} className="text-xs pl-4 mb-2 leading-relaxed" style={{ color: '#D4C9B8', borderLeft: '2px solid #C6A75E55', lineHeight: '1.6' }}>
                    {p}
                  </p>
                ))}
              </div>

              {/* Aplicação */}
              {enc.aplicacao_profissional && (
                <div className="mb-5">
                  <p className="text-xs font-bold mb-2" style={{ color: '#8B9E82' }}>
                    ◈ Aplicação em Sessão / Círculo
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: '#A89B88', lineHeight: '1.6' }}>
                    {enc.aplicacao_profissional}
                  </p>
                </div>
              )}

              {/* O que NÃO fazer */}
              {enc.o_que_nao_fazer && (
                <div className="mb-5 p-3 rounded-lg" style={{ backgroundColor: '#1A0A0A', border: '1px solid #8B3A3A33' }}>
                  <p className="text-xs font-bold mb-1" style={{ color: '#C47A7A' }}>
                    ⚠ O que NÃO fazer
                  </p>
                  <p className="text-xs" style={{ color: '#B8A998' }}>{enc.o_que_nao_fazer}</p>
                </div>
              )}

              {/* Alerta */}
              {enc.alerta_clinico && (
                <div className="mb-5 p-3 rounded-lg" style={{ backgroundColor: '#1A1008', border: '1px solid #C6A75E33' }}>
                  <p className="text-xs font-bold mb-1" style={{ color: '#C6A75E' }}>
                    ⚕ Alerta Clínico
                  </p>
                  <p className="text-xs" style={{ color: '#B8A998' }}>{enc.alerta_clinico}</p>
                </div>
              )}

              {/* Espaço para anotações */}
              <div className="mt-4 p-4 rounded-lg" style={{ border: '1px dashed #C6A75E33', minHeight: '60px' }}>
                <p className="text-xs italic" style={{ color: '#C6A75E44' }}>Espaço para anotações da mentora</p>
              </div>

              {/* Encerramento */}
              {enc.encerramento_ritual && (
                <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: '#1A2A1F', border: '1px solid #8B9E8233' }}>
                  <p className="text-xs font-bold mb-1" style={{ color: '#8B9E82' }}>
                    🜃 Fechamento do Campo
                  </p>
                  <p className="text-xs" style={{ color: '#A89B88' }}>{enc.encerramento_ritual}</p>
                </div>
              )}
            </div>
          ))}

          {/* ═══ USOS INADEQUADOS ═══ */}
          {estrutura.usos_inadequados?.length > 0 && (
            <div className="px-8 py-6" style={{ borderBottom: '1px solid #C6A75E22' }}>
              <h2 className="text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: '#C47A7A' }}>
                ⚠ Usos Inadequados deste Material
              </h2>
              {estrutura.usos_inadequados.map((u: string, i: number) => (
                <p key={i} className="text-xs mb-2 pl-3" style={{ color: '#B8A998', borderLeft: '2px solid #C47A7A44' }}>
                  {u}
                </p>
              ))}
            </div>
          )}

          {/* Observação Clínica */}
          {estrutura.observacao_clinica && (
            <div className="px-8 py-6" style={{ borderBottom: '1px solid #C6A75E22' }}>
              <h2 className="text-sm font-bold mb-3" style={{ color: '#C6A75E' }}>
                ⚕ Observação Clínica
              </h2>
              <p className="text-xs leading-relaxed" style={{ color: '#B8A998', lineHeight: '1.7' }}>
                {estrutura.observacao_clinica}
              </p>
            </div>
          )}

          {/* ═══ JARDINS ═══ */}
          <div className="px-8 py-6 grid grid-cols-2 gap-8" style={{ borderBottom: '1px solid #C6A75E22' }}>
            {estrutura.convites_jardim_psique?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold mb-3 uppercase tracking-wide" style={{ color: '#8B9E82' }}>
                  🌿 Jardim da Psique
                </h3>
                {estrutura.convites_jardim_psique.map((c: string, i: number) => (
                  <p key={i} className="text-xs mb-3 italic leading-relaxed" style={{ color: '#A89B88', lineHeight: '1.6' }}>
                    "{c}"
                  </p>
                ))}
              </div>
            )}
            {estrutura.convites_jardim_oficio?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold mb-3 uppercase tracking-wide" style={{ color: '#C6A75E' }}>
                  ⚒ Jardim do Ofício
                </h3>
                {estrutura.convites_jardim_oficio.map((c: string, i: number) => (
                  <p key={i} className="text-xs mb-3 italic leading-relaxed" style={{ color: '#A89B88', lineHeight: '1.6' }}>
                    "{c}"
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* ═══ RODAPÉ ═══ */}
          <div className="p-5 text-center" style={{ background: 'linear-gradient(180deg, #0F1410 0%, #0A0A0A 100%)' }}>
            <p className="text-xs tracking-[0.3em] uppercase" style={{ color: '#C6A75E' }}>
              Método de Leitura Oracular — Casa Orácula
            </p>
            <p className="text-xs mt-1" style={{ color: '#C6A75E44' }}>
              Círculo de Leitura Simbólica · Material de Uso Formativo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
