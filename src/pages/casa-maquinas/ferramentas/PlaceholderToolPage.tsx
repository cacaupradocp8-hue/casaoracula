import { useParams } from 'react-router-dom';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Construction } from 'lucide-react';

const TOOL_NAMES: Record<string, string> = {
  'escrita-simbolica': 'Escrita Simbólica',
  'espelho-relacional': 'Espelho Relacional',
  'ritual-simbolico': 'Ritual Simbólico',
  'dialogo-partes': 'Diálogo com Partes',
  'mapa-transformacao': 'Mapa de Transformação',
  'ritual-passagem': 'Ritual de Passagem',
  'atlas-arquetipos': 'Atlas de Arquétipos',
};

export default function PlaceholderToolPage() {
  const slug = window.location.pathname.split('/').pop() || '';
  const name = TOOL_NAMES[slug] || 'Ferramenta';

  return (
    <CasaMaquinasLayout title={name} subtitle="Em desenvolvimento">
      <div className="max-w-md mx-auto mt-12">
        <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
          <CardContent className="p-8 text-center">
            <Construction className="w-10 h-10 text-[#C9A24A]/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#F5F1E8]/70 mb-2">{name}</h3>
            <p className="text-sm text-[#F5F1E8]/40">
              Esta ferramenta está em desenvolvimento e será disponibilizada em breve.
            </p>
          </CardContent>
        </Card>
      </div>
    </CasaMaquinasLayout>
  );
}
