import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { TramasTab } from '@/components/casa-tecelas/TramasTab';
import { CasosEspelhoTab } from '@/components/casa-tecelas/CasosEspelhoTab';
import { IntervencoesTab } from '@/components/casa-tecelas/IntervencoesTab';
import { SupervisoesTab } from '@/components/casa-tecelas/SupervisoesTab';
import { CodigoTecelaTab } from '@/components/casa-tecelas/CodigoTecelaTab';
import { motion } from 'framer-motion';

export default function CasaTecelasPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('tramas');

  const isAdmin = user?.portal === 'admin';
  const canCreate = isAdmin || user?.portal === 'oracula';

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display text-gold">Casa das Tecelãs</h1>
          <p className="text-muted-foreground mt-1">Comunidade profissional — tramas, supervisões e trocas simbólicas</p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full flex overflow-x-auto bg-card/50 border border-border/50">
            <TabsTrigger value="tramas" className="flex-1 min-w-[100px]">Tramas</TabsTrigger>
            <TabsTrigger value="casos" className="flex-1 min-w-[100px]">Casos-Espelho</TabsTrigger>
            <TabsTrigger value="intervencoes" className="flex-1 min-w-[100px]">Intervenções</TabsTrigger>
            <TabsTrigger value="supervisoes" className="flex-1 min-w-[100px]">Supervisões</TabsTrigger>
            <TabsTrigger value="codigo" className="flex-1 min-w-[100px]">Código Tecelã</TabsTrigger>
          </TabsList>

          <TabsContent value="tramas">
            <TramasTab canCreate={canCreate} isAdmin={isAdmin} />
          </TabsContent>
          <TabsContent value="casos">
            <CasosEspelhoTab canCreate={canCreate} isAdmin={isAdmin} />
          </TabsContent>
          <TabsContent value="intervencoes">
            <IntervencoesTab canCreate={canCreate} isAdmin={isAdmin} />
          </TabsContent>
          <TabsContent value="supervisoes">
            <SupervisoesTab isAdmin={isAdmin} />
          </TabsContent>
          <TabsContent value="codigo">
            <CodigoTecelaTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
