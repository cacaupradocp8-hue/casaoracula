import DOMPurify from 'dompurify';
import { CollapsibleBlock } from '@/components/shared/MobilePageShell';

interface AulaTranscricaoBlockProps {
  textoAula: string;
}

export function AulaTranscricaoBlock({ textoAula }: AulaTranscricaoBlockProps) {
  return (
    <div className="mb-6">
      <CollapsibleBlock title="Transcrição / Conteúdo da Aula" defaultOpen={false}>
        <div
          className="prose prose-invert prose-sm max-w-none"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(textoAula.replace(/\n/g, '<br/>')),
          }}
        />
      </CollapsibleBlock>
    </div>
  );
}
