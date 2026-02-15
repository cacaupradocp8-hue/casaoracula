// ============================================
// JORNADA — Vitrine de Membros (Netflix Style)
// ============================================

import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { VisitorHomePage } from '@/components/visitor/VisitorHomePage';
import { HeroBanner } from '@/components/membros/HeroBanner';
import { ContentRow } from '@/components/membros/ContentRow';
import { ContentCard } from '@/components/membros/ContentCard';
import { OracleCard } from '@/components/membros/OracleCard';
import { canAccessFeature } from '@/types/portal';
import {
  Compass,
  Eclipse,
  BookOpen,
  Feather,
  Wrench,
  FlaskConical,
  Brain,
  Flower2,
  ScrollText,
  Factory,
  Map,
  Users,
  CalendarHeart,
  Tent,
} from 'lucide-react';

export default function Jornada() {
  const { user } = useAuth();

  // Visitante → página específica
  if (!user || user.portal === 'visitante') {
    return <VisitorHomePage />;
  }

  const isCertificada = canAccessFeature(user.portal, 'oracula');

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Hero Banner */}
        <HeroBanner isCertificada={isCertificada} />

        {/* Caminhos de Travessia */}
        <ContentRow title="Caminhos de Travessia">
          <ContentCard
            title="Jornada da Heroína"
            subtitle="A travessia arquetípica de transformação"
            icon={Compass}
            route="/ferramenta/jornada-heroina"
            featured
          />
          <ContentCard
            title="Jornada da Sombra"
            subtitle="O encontro com o que foi esquecido"
            icon={Eclipse}
            route="/jornada-sombra"
            featured
          />
        </ContentRow>

        {/* Travessias em Palavra */}
        <ContentRow title="Travessias em Palavra">
          <ContentCard
            title="Clube do Livro"
            subtitle="Leitura simbólica coletiva"
            icon={BookOpen}
            route="/clube-do-livro"
            featured
          />
        </ContentRow>

        {/* O Tear da Narroterapia Oracular */}
        <ContentRow title="O Tear da Narroterapia Oracular">
          <ContentCard
            title="Narroterapia Oracular"
            subtitle="A arte de ler e tecer narrativas"
            icon={Feather}
            route="/narroterapia"
          />
          <ContentCard
            title="Ferramentas do Método"
            subtitle="Instrumentos para a prática"
            icon={Wrench}
            route="/ferramentas"
          />
          <ContentCard
            title="Laboratório 80/20"
            subtitle="Prática focada no essencial"
            icon={FlaskConical}
            route="/laboratorio"
          />
        </ContentRow>

        {/* Campos de Integração */}
        <ContentRow title="Campos de Integração">
          <ContentCard
            title="Jardim da Psique"
            subtitle="Seu diário simbólico pessoal"
            icon={Brain}
            route="/jardim-psique"
          />
          <ContentCard
            title="Jardim da Heroína"
            subtitle="Registros da jornada da cliente"
            icon={Flower2}
            route="/jardim-heroina"
          />
          <ContentCard
            title="Jardim do Ofício"
            subtitle="Reflexões sobre a prática"
            icon={ScrollText}
            route="/casa-das-maquinas/jardim-oficio"
          />
        </ContentRow>

        {/* O Ofício e a Prática — só certificadas */}
        {isCertificada && (
          <ContentRow title="O Ofício e a Prática">
            <ContentCard
              title="Casa das Máquinas"
              subtitle="Seu espaço profissional completo"
              icon={Factory}
              route="/casa-das-maquinas"
              featured
            />
            <ContentCard
              title="Mapa Vivo"
              subtitle="Visão longitudinal dos processos"
              icon={Map}
              route="/mapa-vivo"
              featured
            />
          </ContentRow>
        )}

        {/* A Casa Viva */}
        <ContentRow title="A Casa Viva">
          <ContentCard
            title="Casa das Tecelãs"
            subtitle="Comunidade e troca entre pares"
            icon={Users}
            route="/casa-das-tecelas"
          />
          <ContentCard
            title="Encontro Anual"
            subtitle="Ritual de encontro presencial"
            icon={CalendarHeart}
            route="/encontro-anual"
          />
          <ContentCard
            title="Retiros"
            subtitle="Imersões de transformação"
            icon={Tent}
            route="/retiros"
          />
        </ContentRow>

        {/* Card especial — Oráculo */}
        <OracleCard />
      </div>
    </AppLayout>
  );
}
