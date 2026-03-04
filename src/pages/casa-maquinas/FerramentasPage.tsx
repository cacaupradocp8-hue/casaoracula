import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ChevronRight } from 'lucide-react';

export default function FerramentasPage() {
  const navigate = useNavigate();
  const [tools, setTools] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [tRes, dRes] = await Promise.all([
      supabase.from('tools').select('*').eq('ativa', true).order('ordem'),
      supabase.from('districts').select('id, nome, cor'),
    ]);
    setTools(tRes.data || []);
    setDistricts(dRes.data || []);
    setLoading(false);
  };

  const getDistrictName = (id: string) => districts.find(d => d.id === id)?.nome || '';

  if (loading) {
    return (
      <CasaMaquinasLayout title="Ferramentas">
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" /></div>
      </CasaMaquinasLayout>
    );
  }

  return (
    <CasaMaquinasLayout title="Ferramentas" subtitle="Instrumentos clínicos do Método Orácula">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map(t => (
          <Card
            key={t.id}
            className="border-[#C9A24A]/10 bg-[#0B1B2B]/60 hover:border-[#C9A24A]/20 transition-all cursor-pointer group"
            onClick={() => navigate(t.rota)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-[#F5F1E8] group-hover:text-[#C9A24A] transition-colors">
                  {t.nome}
                </h3>
                {t.tipo === 'placeholder' ? (
                  <Badge variant="outline" className="text-[8px] border-[#F5F1E8]/10 text-[#F5F1E8]/30">em breve</Badge>
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#C9A24A]/40 group-hover:text-[#C9A24A] transition-colors" />
                )}
              </div>
              <p className="text-xs text-[#F5F1E8]/50 mb-3 line-clamp-2">{t.descricao}</p>
              <Badge variant="outline" className="text-[9px] border-[#556B57]/30 text-[#556B57]">
                {getDistrictName(t.district_id)}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </CasaMaquinasLayout>
  );
}
