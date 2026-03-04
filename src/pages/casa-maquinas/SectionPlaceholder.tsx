import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Construction } from 'lucide-react';

interface Props {
  title: string;
  description: string;
}

export default function SectionPlaceholder({ title, description }: Props) {
  return (
    <CasaMaquinasLayout title={title}>
      <div className="max-w-md mx-auto mt-12">
        <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
          <CardContent className="p-8 text-center">
            <Construction className="w-10 h-10 text-[#C9A24A]/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#F5F1E8]/70 mb-2">{title}</h3>
            <p className="text-sm text-[#F5F1E8]/40">{description}</p>
          </CardContent>
        </Card>
      </div>
    </CasaMaquinasLayout>
  );
}
