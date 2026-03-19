import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollText, MessageCircle, Archive, Compass, BookHeart, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { TecidosTab } from '@/components/casa-tecelas/TecidosTab';
import { ConselhoTecelasTab } from '@/components/casa-tecelas/ConselhoTecelasTab';
import { ArquivoVivoTab } from '@/components/casa-tecelas/ArquivoVivoTab';
import { BussolaTecelaTab } from '@/components/casa-tecelas/BussolaTecelaTab';
import { CodigoTecelaTab } from '@/components/casa-tecelas/CodigoTecelaTab';

const tabs = [
  { value: 'tecidos', label: 'Tecidos', icon: ScrollText },
  { value: 'conselho', label: 'Conselho', icon: MessageCircle },
  { value: 'arquivo', label: 'Arquivo', icon: Archive },
  { value: 'bussola', label: 'Bússola', icon: Compass },
  { value: 'codigo', label: 'Código', icon: BookHeart },
];

export default function CasaTecelaInterior() {
  const [activeTab, setActiveTab] = useState('tecidos');
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-10 pb-24 max-w-3xl">
        {/* Header — minimal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-10"
        >
          <p className="text-[10px] uppercase tracking-[0.5em] text-gold/40 font-medium">
            A Casa das Tecelãs
          </p>
          <button
            className="inline-flex items-center gap-1.5 text-gold/30 hover:text-gold/60 text-[10px] uppercase tracking-[0.3em] transition-colors"
            onClick={() => navigate('/circulo-oracular')}
          >
            <Flame className="w-3 h-3" />
            Círculo
          </button>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="w-full grid grid-cols-5 h-auto p-0.5 bg-transparent border border-border/15 rounded-lg">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex flex-col gap-1 py-2.5 data-[state=active]:bg-gold/8 data-[state=active]:text-gold/70 text-muted-foreground/30 rounded-md transition-all"
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-[9px] tracking-wider hidden md:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
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
