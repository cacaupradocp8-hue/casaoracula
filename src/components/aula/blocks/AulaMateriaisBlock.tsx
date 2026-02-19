import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

interface AulaMateriaisBlockProps {
  pdfUrl: string | null;
  materiaisUrl: string | null;
}

export function AulaMateriaisBlock({ pdfUrl, materiaisUrl }: AulaMateriaisBlockProps) {
  if (!pdfUrl && !materiaisUrl) return null;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-4 h-4 text-gold" />
          Materiais
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        {pdfUrl && (
          <Button variant="outline" asChild>
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
              <Download className="w-4 h-4 mr-2" />
              PDF
            </a>
          </Button>
        )}
        {materiaisUrl && (
          <Button variant="outline" asChild>
            <a href={materiaisUrl} target="_blank" rel="noopener noreferrer">
              <Download className="w-4 h-4 mr-2" />
              Materiais Extras
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
