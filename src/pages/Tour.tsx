import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/layout/AppLayout';
import { ModularPageRenderer } from '@/components/modular/ModularPageRenderer';
import { 
  HeroSection, 
  SalasSection, 
  FerramentasSection, 
  RecursosSection, 
  CTASection 
} from '@/components/tour';
import { Loader2 } from 'lucide-react';

interface TourSection {
  id: string;
  secao_key: string;
  titulo: string;
  subtitulo?: string | null;
  descricao?: string | null;
  imagem_url?: string | null;
  icone?: string | null;
  ordem: number;
}

interface Sala {
  id: string;
  nome: string;
  descricao: string;
  icone?: string | null;
  nivel_minimo: string;
  ordem: number;
}

interface Ferramenta {
  id: string;
  nome: string;
  descricao?: string | null;
  icone?: string | null;
  ordem: number;
}

export default function Tour() {
  // Fetch tour sections - use any for now due to type generation delay
  const { data: sections, isLoading: loadingSections } = useQuery({
    queryKey: ['tour-sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tour_sections' as any)
        .select('*')
        .eq('ativo', true)
        .order('ordem') as { data: TourSection[] | null; error: any };
      
      if (error) throw error;
      
      // Convert to map for easy access
      const sectionMap: Record<string, TourSection> = {};
      data?.forEach(s => {
        sectionMap[s.secao_key] = s;
      });
      return sectionMap;
    }
  });

  // Fetch salas - columns are nome_exibicao, texto_entrada
  const { data: salas = [], isLoading: loadingSalas } = useQuery({
    queryKey: ['tour-salas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salas')
        .select('id, nome_exibicao, texto_entrada, nivel_minimo, ordem')
        .eq('ativa', true)
        .order('ordem');
      
      if (error) throw error;
      
      // Map to expected interface
      return (data || []).map(s => ({
        id: s.id,
        nome: s.nome_exibicao,
        descricao: s.texto_entrada || '',
        icone: null,
        nivel_minimo: s.nivel_minimo,
        ordem: s.ordem
      })) as Sala[];
    }
  });

  // Fetch ferramentas - columns are ferramenta_nome, ferramenta_descricao, icone
  const { data: ferramentas = [], isLoading: loadingFerramentas } = useQuery({
    queryKey: ['tour-ferramentas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sala_ferramentas')
        .select('id, ferramenta_nome, ferramenta_descricao, icone, ordem')
        .eq('ativa', true)
        .order('ordem')
        .limit(8);
      
      if (error) throw error;
      
      // Map to expected interface
      return (data || []).map(f => ({
        id: f.id,
        nome: f.ferramenta_nome,
        descricao: f.ferramenta_descricao,
        icone: f.icone,
        ordem: f.ordem
      })) as Ferramenta[];
    }
  });

  const isLoading = loadingSections || loadingSalas || loadingFerramentas;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* Hero */}
        <HeroSection section={sections?.hero} />

        {/* Salas da Casa */}
        <SalasSection section={sections?.salas} salas={salas} />

        {/* Ferramentas Simbólicas */}
        <FerramentasSection section={sections?.ferramentas} ferramentas={ferramentas} />

        {/* Recursos Exclusivos */}
        <RecursosSection section={sections?.recursos} />

        {/* Blocos Modulares do Admin */}
        <div className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <ModularPageRenderer 
              contextType="landing" 
              contextId="tour-page"
              blockSpacing="lg"
            />
          </div>
        </div>

        {/* CTA Final */}
        <CTASection section={sections?.cta} />
      </div>
    </AppLayout>
  );
}
