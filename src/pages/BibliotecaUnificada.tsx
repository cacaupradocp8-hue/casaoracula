import { useState, useMemo } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Library, Shield, Compass, Lock, Sparkles } from 'lucide-react';
import { useEffectivePortal } from '@/hooks/useEffectivePortal';

// Lazy-loaded tab content components
import BibliotecaSimbolica from '@/components/biblioteca/BibliotecaSimbolica';
import BibliotecaPessoal from '@/components/biblioteca/BibliotecaPessoal';
import BibliotecaCasosTab from '@/components/biblioteca/BibliotecaCasosTab';
import BibliotecaTravessiasTab from '@/components/biblioteca/BibliotecaTravessiasTab';
import BibliotecaRituaisTab from '@/components/biblioteca/BibliotecaRituaisTab';

const TABS = [
  { key: 'simbolica', label: 'Simbólica', icon: BookOpen },
  { key: 'pessoal', label: 'Meu Acervo', icon: Lock },
  { key: 'casos', label: 'Biblioteca de Casos Profissionais', icon: Shield, minPortal: 'oracula' },
  { key: 'travessias', label: 'Travessias da Casa', icon: Compass },
  { key: 'rituais', label: 'Rituais', icon: Sparkles },
] as const;

type TabKey = typeof TABS[number]['key'];

export default function BibliotecaUnificada() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { effectivePortal } = useEffectivePortal();
  
  const filteredTabs = useMemo(() => {
    return TABS.filter(tab => {
      // @ts-ignore - minPortal exists on some tabs
      if (tab.minPortal === 'oracula') {
        return effectivePortal === 'oracula' || effectivePortal === 'admin';
      }
      return true;
    });
  }, [effectivePortal]);

  const initialTab = (searchParams.get('aba') as TabKey) || 'simbolica';
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Se a aba inicial for 'casos' mas o usuário não tiver permissão, redirecionar
  if (initialTab === 'casos' && effectivePortal !== 'oracula' && effectivePortal !== 'admin') {
    return <Navigate to="/biblioteca?aba=simbolica" replace />;
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ aba: value }, { replace: true });
  };

  return (
    <AppLayout>
      <ResponsiveContainer size="default" className="py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Library className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-display text-foreground mb-2">
            Biblioteca Oracular
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Acervo simbólico, registros pessoais, casos clínicos e travessias — tudo em um só lugar.
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className={`grid w-full grid-cols-${filteredTabs.length}`}>
            {filteredTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.key} value={tab.key} className="gap-1.5 text-xs sm:text-sm">
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="simbolica">
            <BibliotecaSimbolica />
          </TabsContent>

          <TabsContent value="pessoal">
            <BibliotecaPessoal />
          </TabsContent>

          <TabsContent value="casos">
            <BibliotecaCasosTab />
          </TabsContent>

          <TabsContent value="travessias">
            <BibliotecaTravessiasTab />
          </TabsContent>

          <TabsContent value="rituais">
            <BibliotecaRituaisTab />
          </TabsContent>
        </Tabs>
      </ResponsiveContainer>
    </AppLayout>
  );
}
