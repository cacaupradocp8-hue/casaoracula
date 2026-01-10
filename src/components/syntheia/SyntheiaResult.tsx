import { Save, Plus, FileDown, Copy, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import DOMPurify from 'dompurify';
import type { SyntheiaGeneratedContent, SyntheiaFormData } from '@/types/syntheia';
import { TIPO_OPTIONS, PUBLICO_OPTIONS, MOMENTO_OPTIONS, TEMPO_OPTIONS } from '@/types/syntheia';

interface SyntheiaResultProps {
  content: SyntheiaGeneratedContent;
  formData: SyntheiaFormData;
  onSave: () => void;
  onNew: () => void;
  isSaving: boolean;
}

export function SyntheiaResult({ content, formData, onSave, onNew, isSaving }: SyntheiaResultProps) {
  const renderMarkdown = (text: string) => {
    // Simple markdown to HTML conversion
    const html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^\- /gm, '• ')
      .replace(/\n/g, '<br>');
    return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />;
  };

  const handleCopyToClipboard = () => {
    const text = `
# ${content.titulo}

## Chave Simbólica
${content.chave_simbolica}

## Intenção Terapêutica
${content.intencao_terapeutica}

## Estrutura Prática
${content.estrutura_pratica}

## Suporte de Linguagem
${content.suporte_linguagem}

## Fechamento & Integração
${content.fechamento_integracao}
    `.trim();

    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência');
  };

  const handleExportPDF = () => {
    // Simple print-based PDF export
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Não foi possível abrir a janela de impressão');
      return;
    }

    const tipoLabel = TIPO_OPTIONS.find(t => t.value === formData.tipo)?.label || formData.tipo;
    const publicoLabel = PUBLICO_OPTIONS.find(p => p.value === formData.publico_alvo)?.label || formData.publico_alvo;
    const momentoLabel = MOMENTO_OPTIONS.find(m => m.value === formData.momento_jornada)?.label || formData.momento_jornada;
    const tempoLabel = TEMPO_OPTIONS.find(t => t.value === formData.tempo_disponivel)?.label || formData.tempo_disponivel;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${content.titulo} - SYNTHEIA</title>
          <style>
            body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
            h1 { color: #1a1a1a; border-bottom: 2px solid #e5e5e5; padding-bottom: 10px; }
            h2 { color: #4a4a4a; margin-top: 30px; }
            .meta { color: #666; font-size: 14px; margin-bottom: 30px; }
            .section { margin-bottom: 25px; }
            .section-title { color: #2a2a2a; font-weight: bold; margin-bottom: 10px; }
            .section-content { color: #4a4a4a; }
            @media print { body { margin: 20px; } }
          </style>
        </head>
        <body>
          <h1>${content.titulo}</h1>
          <div class="meta">
            <strong>Tipo:</strong> ${tipoLabel} | 
            <strong>Público:</strong> ${publicoLabel} | 
            <strong>Momento:</strong> ${momentoLabel} | 
            <strong>Tempo:</strong> ${tempoLabel}<br>
            <strong>Tema:</strong> ${formData.tema_principal}
          </div>
          
          <div class="section">
            <div class="section-title">🔮 Chave Simbólica</div>
            <div class="section-content">${content.chave_simbolica}</div>
          </div>
          
          <div class="section">
            <div class="section-title">🎯 Intenção Terapêutica</div>
            <div class="section-content">${content.intencao_terapeutica}</div>
          </div>
          
          <div class="section">
            <div class="section-title">📋 Estrutura Prática</div>
            <div class="section-content">${content.estrutura_pratica.replace(/\n/g, '<br>')}</div>
          </div>
          
          <div class="section">
            <div class="section-title">💬 Suporte de Linguagem</div>
            <div class="section-content">${content.suporte_linguagem.replace(/\n/g, '<br>')}</div>
          </div>
          
          <div class="section">
            <div class="section-title">🌙 Fechamento & Integração</div>
            <div class="section-content">${content.fechamento_integracao}</div>
          </div>
          
          <div style="margin-top: 40px; color: #999; font-size: 12px; text-align: center;">
            Gerado por SYNTHEIA • ${new Date().toLocaleDateString('pt-BR')}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">{content.titulo}</h1>
        <p className="text-muted-foreground">Tema: {formData.tema_principal}</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Chave Simbólica */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span>🔮</span> Chave Simbólica
            </h3>
            <p className="text-muted-foreground pl-6">{content.chave_simbolica}</p>
          </div>

          {/* Intenção Terapêutica */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span>🎯</span> Intenção Terapêutica
            </h3>
            <p className="text-muted-foreground pl-6">{content.intencao_terapeutica}</p>
          </div>

          {/* Estrutura Prática */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span>📋</span> Estrutura Prática
            </h3>
            <div className="text-muted-foreground pl-6 prose prose-sm max-w-none">
              {renderMarkdown(content.estrutura_pratica)}
            </div>
          </div>

          {/* Suporte de Linguagem */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span>💬</span> Suporte de Linguagem
            </h3>
            <div className="text-muted-foreground pl-6 prose prose-sm max-w-none">
              {renderMarkdown(content.suporte_linguagem)}
            </div>
          </div>

          {/* Fechamento & Integração */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span>🌙</span> Fechamento & Integração
            </h3>
            <p className="text-muted-foreground pl-6">{content.fechamento_integracao}</p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={onSave} disabled={isSaving} className="gap-2">
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Salvar na Biblioteca
        </Button>
        <Button variant="outline" onClick={handleExportPDF} className="gap-2">
          <FileDown className="w-4 h-4" />
          Exportar PDF
        </Button>
        <Button variant="outline" onClick={handleCopyToClipboard} className="gap-2">
          <Copy className="w-4 h-4" />
          Copiar
        </Button>
        <Button variant="outline" onClick={onNew} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Criação
        </Button>
      </div>
    </div>
  );
}
