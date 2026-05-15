import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CidadelaMap } from '@/components/casa-maquinas/CidadelaMap';
import { MapaVivoCidadela } from '@/components/casa-maquinas/MapaVivoCidadela';
import { ClienteHistorico } from '@/components/casa-maquinas/ClienteHistorico';
import { ClientePerfil as ClientePerfilTab } from '@/components/casa-maquinas/ClientePerfilTab';
import { ClienteCartografias } from '@/components/casa-maquinas/ClienteCartografias';
import { ClienteSonhos } from '@/components/casa-maquinas/ClienteSonhos';
import { ClientePerfilArquetipico } from '@/components/casa-maquinas/ClientePerfilArquetipico';
import { SinaisDaJornada } from '@/components/casa-maquinas/SinaisDaJornada';
import { OraculoEstacoes } from '@/components/casa-maquinas/OraculoEstacoes';
import { FioDeAriadne } from '@/components/casa-maquinas/FioDeAriadne';
import { Labirinto39Portas } from '@/components/casa-maquinas/labirinto-39/Labirinto39Portas';
import { AtlasArquetipos } from '@/components/casa-maquinas/atlas-arquetipos/AtlasArquetipos';
import { RelacionamentosEspelho } from '@/components/casa-maquinas/relacionamentos-espelho/RelacionamentosEspelho';
import { CartografiaComplexos } from '@/components/casa-maquinas/cartografia-complexos/CartografiaComplexos';
import { ConselhoPartesInternas } from '@/components/casa-maquinas/conselho-partes/ConselhoPartesInternas';
import { RitualIntegracao } from '@/components/casa-maquinas/ritual-integracao/RitualIntegracao';
import { CartografiaPsiquicaOracula } from '@/components/casa-maquinas/cartografia-psiquica/CartografiaPsiquicaOracula';
import { RelatorioJornadaPage } from '@/components/casa-maquinas/relatorio-jornada/RelatorioJornadaPage';
import { BussolaCartografa } from '@/components/casa-maquinas/bussola-cartografa/BussolaCartografa';
import { CartografiaClinicaPanel } from '@/components/cabine/CartografiaClinicaPanel';

import { PerfilSimbolicoCliente } from '@/components/casa-maquinas/painel-conducao/PerfilSimbolicoCliente';
import { MiniMandalaCidadela } from '@/components/casa-maquinas/MiniMandalaCidadela';
import { ClienteJardimHeroinaTab } from '@/components/casa-maquinas/ClienteJardimHeroinaTab';
import { ClienteAtividadeJardim } from '@/components/casa-maquinas/ClienteAtividadeJardim';
import { ClienteJourneyHeader } from '@/components/casa-maquinas/ClienteJourneyHeader';
import { ClienteJourneyTimeline } from '@/components/casa-maquinas/ClienteJourneyTimeline';
import { Button } from '@/components/ui/button';
import { Loader2, LayoutDashboard, History, Map, Sparkles, Zap } from 'lucide-react';

export default function ClienteDetailPage() {
  const { clienteId } = useParams<{ clienteId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cliente, setCliente] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && clienteId) loadCliente();
  }, [user, clienteId]);

  const loadCliente = async () => {
    const { data } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', clienteId!)
      .single();
    setCliente(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <CasaMaquinasLayout title="Cliente">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </CasaMaquinasLayout>
    );
  }

  if (!cliente) {
    return (
      <CasaMaquinasLayout title="Cliente não encontrada">
        <p className="text-muted-foreground text-center py-20">Cliente não encontrada</p>
      </CasaMaquinasLayout>
    );
  }

  const tabClass = "data-[state=active]:bg-primary/15 data-[state=active]:text-primary text-muted-foreground text-xs transition-all duration-300";

  return (
    <CasaMaquinasLayout title={cliente.nome} subtitle="Jornada interior">
      <ClienteJourneyHeader cliente={cliente} clienteId={clienteId!} />

      <Tabs defaultValue="visao-geral" className="w-full">
        <TabsList className="bg-card/40 border border-border/20 mb-8 p-1 h-auto flex-wrap justify-start gap-1 backdrop-blur-md">
          <TabsTrigger value="visao-geral" className={tabClass}>
            <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" /> Visão Geral
          </TabsTrigger>
          <TabsTrigger value="cidadela" className={tabClass}>
            <Map className="w-3.5 h-3.5 mr-1.5" /> CidaDELA
          </TabsTrigger>
          <TabsTrigger value="historico" className={tabClass}>
            <History className="w-3.5 h-3.5 mr-1.5" /> Histórico
          </TabsTrigger>
          <TabsTrigger value="ferramentas" className={tabClass}>
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Ferramentas
          </TabsTrigger>
          <TabsTrigger value="perfil" className={tabClass}>Perfil</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h3 className="text-sm font-display font-semibold uppercase tracking-widest text-primary/70 mb-4 flex items-center">
                  <div className="w-1 h-4 bg-primary mr-2 rounded-full" />
                  Estado Atual da Jornada
                </h3>
                <MiniMandalaCidadela clienteId={clienteId!} />
              </section>

              <section>
                <h3 className="text-sm font-display font-semibold uppercase tracking-widest text-primary/70 mb-4 flex items-center">
                  <div className="w-1 h-4 bg-primary mr-2 rounded-full" />
                  Atividade no Jardim
                </h3>
                <ClienteAtividadeJardim clienteId={clienteId!} />
              </section>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-sm font-display font-semibold uppercase tracking-widest text-primary/70 mb-4 flex items-center">
                  <div className="w-1 h-4 bg-primary mr-2 rounded-full" />
                  Timeline Simbólica
                </h3>
                <ClienteJourneyTimeline clienteId={clienteId!} />
              </section>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cidadela" className="animate-in fade-in duration-500">
          <MapaVivoCidadela clienteId={clienteId!} />
        </TabsContent>

        <TabsContent value="historico" className="animate-in fade-in duration-500">
          <ClienteHistorico clienteId={clienteId!} />
        </TabsContent>

        <TabsContent value="ferramentas" className="animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Grouped tools triggers for better UX instead of a giant list of tabs */}
            <Tabs defaultValue="cartografia" className="w-full col-span-full">
              <TabsList className="bg-transparent mb-6 border-b border-border/30 w-full justify-start rounded-none h-auto p-0">
                <TabsTrigger value="cartografia" className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 py-2">Cartografias</TabsTrigger>
                <TabsTrigger value="simbolico" className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 py-2">Simbólico</TabsTrigger>
                <TabsTrigger value="avancado" className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 py-2">Avançado</TabsTrigger>
              </TabsList>
              
              <TabsContent value="cartografia" className="space-y-6">
                <ClienteCartografias clienteId={clienteId!} />
                <CartografiaClinicaPanel clienteId={clienteId!} />
              </TabsContent>
              
              <TabsContent value="simbolico" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PerfilSimbolicoCliente clienteId={clienteId!} />
                <ClienteSonhos clienteId={clienteId!} />
                <ClientePerfilArquetipico clienteId={clienteId!} />
                <AtlasArquetipos clienteId={clienteId!} />
              </TabsContent>
              
              <TabsContent value="avancado" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <OraculoEstacoes clienteId={clienteId!} />
                  <FioDeAriadne clienteId={clienteId!} />
                  <SinaisDaJornada clienteId={clienteId!} />
                  <Labirinto39Portas clienteId={clienteId!} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>

        <TabsContent value="perfil" className="animate-in fade-in duration-500">
          <ClientePerfilTab cliente={cliente} onUpdate={loadCliente} />
        </TabsContent>
      </Tabs>
    </CasaMaquinasLayout>
  );
}
