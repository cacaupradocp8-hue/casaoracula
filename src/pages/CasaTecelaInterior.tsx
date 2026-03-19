import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, ScrollText, MessageCircle, Archive, Compass, BookHeart } from 'lucide-react';
import { motion } from 'framer-motion';
import { TecidosTab } from '@/components/casa-tecelas/TecidosTab';
import { ConselhoTecelasTab } from '@/components/casa-tecelas/ConselhoTecelasTab';
import { ArquivoVivoTab } from '@/components/casa-tecelas/ArquivoVivoTab';
import { BussolaTecelaTab } from '@/components/casa-tecelas/BussolaTecelaTab';
import { CodigoTecelaTab } from '@/components/casa-tecelas/CodigoTecelaTab';

const tabs = [
  { value: 'tecidos', label: 'Tecidos', icon: ScrollText },
  { value: 'conselho', label: 'Conselho', icon: MessageCircle },
  { value: 'arquivo', label: 'Arquivo Vivo', icon: Archive },
  { value: 'bussola', label: 'Bússola', icon: Compass },
  { value: 'codigo', label: 'Código', icon: BookHeart },
];

export default function CasaTecelaInterior() {
  const [activeTab, setActiveTab] = useState('tecidos');

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SectionHeader
            title="A Casa das Tecelãs"
            subtitle="Campo simbólico vivo — tecidos, conselho e caminhos percorridos"
            icon={<Sparkles className="w-5 h-5" />}
            className="mb-8"
          />
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full grid grid-cols-5 h-auto p-1 bg-card/50 border border-border/30">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex flex-col gap-1 py-3 data-[state=active]:bg-gold/10 data-[state=active]:text-gold text-muted-foreground"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium hidden md:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="tecidos"><TecidosTab /></TabsContent>
            <TabsContent value="conselho"><ConselhoTecelasTab /></TabsContent>
            <TabsContent value="arquivo"><ArquivoVivoTab /></TabsContent>
            <TabsContent value="bussola"><BussolaTecelaTab /></TabsContent>
            <TabsContent value="codigo"><CodigoTecelaTab /></TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </AppLayout>
  );
}
