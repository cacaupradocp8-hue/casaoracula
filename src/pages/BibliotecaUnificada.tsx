import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Library, Shield, Compass, Lock } from 'lucide-react';

// Lazy-loaded tab content components
import BibliotecaSimbolica from '@/components/biblioteca/BibliotecaSimbolica';
import BibliotecaPessoal from '@/components/biblioteca/BibliotecaPessoal';
import BibliotecaCasosTab from '@/components/biblioteca/BibliotecaCasosTab';
import BibliotecaTravessiasTab from '@/components/biblioteca/BibliotecaTravessiasTab';

const TABS = [
  { key: 'simbolica', label: 'Simbólica', icon: BookOpen },
  { key: 'pessoal', label: 'Pessoal', icon: Lock },
  { key: 'casos', label: 'Casos Clínicos', icon: Shield },
  { key: 'travessias', label: 'Travessias', icon: Compass },
] as const;

type TabKey = typeof TABS[number]['key'];

export default function BibliotecaUnificada() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('aba') as TabKey) || 'simbolica';
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ aba: value }, { replace: true });
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
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
            Biblioteca da Casa Orácula
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Acervo simbólico, registros pessoais, casos clínicos e travessias — tudo em um só lugar.
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            {TABS.map((tab) => {
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
        </Tabs>
      </div>
    </AppLayout>
  );
}
