import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { MandalaCidadela, type MandalaDistrict, type MandalaDistrictState } from '@/components/cidadela/MandalaCidadela';
import { MandalaMobile } from '@/components/cidadela/MandalaMobile';
import { DistrictDetailSheet } from '@/components/cidadela/DistrictDetailSheet';
import { useIsMobile } from '@/hooks/use-mobile';
import type { DistritoResumo } from '@/hooks/useBussolaOracular';

interface Props {
  temCartografia: boolean;
  distritoDominante: DistritoResumo | null;
  distritosAtivos: DistritoResumo[];
  distritoTensao: DistritoResumo | null;
  corHex: string;
  distritosRaw: Record<string, any>;
}

const DISTRICT_NUMBER_BY_KEY: Record<string, number> = {
  portao_chegada: 1,
  torres: 2,
  portas: 3,
  jardim_arquetipos: 4,
  praca_abalo: 5,
  casa_sonhos: 6,
  espelho_vinculos: 7,
  forja: 8,
  conselho_interior: 9,
  labirinto: 10,
  praca_integracao: 11,
  portal_renascimento: 12,
};

const DISTRICT_NUMBER_BY_NAME: Record<string, number> = {
  'portão da chegada': 1,
  'portao da chegada': 1,
  torres: 2,
  portas: 3,
  'jardim dos arquétipos': 4,
  'jardim dos arquetipos': 4,
  'bosque dos arquétipos': 4,
  'bosque dos arquetipos': 4,
  'praça do abalo': 5,
  'praca do abalo': 5,
  'casa dos sonhos': 6,
  'espelho dos vínculos': 7,
  'espelho dos vinculos': 7,
  'espelho dos vínculos ': 7,
  forja: 8,
  'a forja': 8,
  'conselho interior': 9,
  labirinto: 10,
  'praça da integração': 11,
  'praca da integracao': 11,
  'coração da cidadela': 11,
  'coracao da cidadela': 11,
  'portal de renascimento': 12,
};

function resolveDistrictNumber(key: string, distrito: any) {
  return DISTRICT_NUMBER_BY_KEY[key] ?? DISTRICT_NUMBER_BY_NAME[(distrito?.nome || '').toLowerCase()] ?? null;
}

export function MiniMapaCidadela(props: Props) {
  const { temCartografia, distritosRaw } = props;
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedDistrict, setSelectedDistrict] = useState<MandalaDistrict | null>(null);

  const { data: districts = [], isLoading: loadingDistricts } = useQuery({
    queryKey: ['dashboard-mandala-cidadela'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('districts')
        .select('id, numero, nome, descricao, icone, cor')
        .order('numero');

      if (error) throw error;
      return (data || []) as MandalaDistrict[];
    },
    enabled: temCartografia,
    staleTime: 1000 * 60 * 10,
  });

  const districtStates = useMemo<MandalaDistrictState[]>(() => {
    if (!districts.length) return [];

    const statesByNumber = new Map<number, MandalaDistrictState['state']>();

    Object.entries(distritosRaw).forEach(([key, distrito]) => {
      const districtNumber = resolveDistrictNumber(key, distrito);
      if (!districtNumber) return;

      const state = distrito?.estado === 'integrado'
        ? 'integrado'
        : distrito?.estado === 'ativo' || distrito?.estado === 'central' || distrito?.estado === 'tensao'
          ? 'ativo'
          : 'inativo';

      statesByNumber.set(districtNumber, state);
    });

    return districts.map((district) => ({
      district_id: district.id,
      state: statesByNumber.get(district.numero) ?? 'inativo',
      sessions_count: 0,
      last_session_at: null,
    }));
  }, [districts, distritosRaw]);

  const selectedState = selectedDistrict
    ? districtStates.find((state) => state.district_id === selectedDistrict.id)
    : undefined;

  if (!temCartografia) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/[0.02] p-6 text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center">
            <Compass className="w-6 h-6 text-primary/30 animate-pulse" />
          </div>
          <p className="font-display text-base text-foreground/70 mb-1">
            Sua CidaDELA aguarda revelação
          </p>
          <p className="text-xs text-muted-foreground/50 mb-4 max-w-xs mx-auto">
            Um mapa simbólico da sua psique será gerado pela Cartografia Psíquica.
          </p>
          <Button
            variant="gold"
            className="gap-2"
            onClick={() => navigate('/ferramenta/cartografia-psiquica-oracula')}
          >
            Revelar meu mapa <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">
          Sua CidaDELA
        </p>
        <button
          onClick={() => navigate('/revelacao-cidadela')}
          className="text-[10px] text-primary/50 hover:text-primary/80 transition-colors flex items-center gap-1"
        >
          Ver mapa completo <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="rounded-2xl border border-border/10 bg-card/20 overflow-hidden p-2 md:p-4 transition-all hover:border-primary/20">
        {loadingDistricts ? (
          <div className="flex min-h-[320px] items-center justify-center text-xs text-muted-foreground/50">
            Preparando mandala...
          </div>
        ) : isMobile ? (
          <MandalaMobile
            districts={districts}
            districtStates={districtStates}
            mode="explorar"
            selectedId={selectedDistrict?.id ?? null}
            onDistrictClick={setSelectedDistrict}
          />
        ) : (
          <MandalaCidadela
            districts={districts}
            districtStates={districtStates}
            mode="explorar"
            selectedId={selectedDistrict?.id ?? null}
            onDistrictClick={setSelectedDistrict}
            className="w-full"
            showConnections
          />
        )}
      </div>

      <DistrictDetailSheet
        district={selectedDistrict}
        districtState={selectedState}
        open={!!selectedDistrict}
        onClose={() => setSelectedDistrict(null)}
      />
    </motion.section>
  );
}
