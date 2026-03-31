import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
import { SessionFlowWizard } from '@/components/casa-maquinas/SessionFlowWizard';
import { MiniMandalaCidadela } from '@/components/casa-maquinas/MiniMandalaCidadela';
import { ClienteJardimHeroinaTab } from '@/components/casa-maquinas/ClienteJardimHeroinaTab';
import { ClienteAtividadeJardim } from '@/components/casa-maquinas/ClienteAtividadeJardim';
import { Button } from '@/components/ui/button';
import { Loader2, Play } from 'lucide-react';

export default function ClienteDetailPage() {
  const { clienteId } = useParams<{ clienteId: string }>();
  const { user } = useAuth();
  const [cliente, setCliente] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sessionWizardOpen, setSessionWizardOpen] = useState(false);

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

  const tabClass = "data-[state=active]:bg-primary/15 data-[state=active]:text-primary text-muted-foreground text-xs";

  return (
    <CasaMaquinasLayout title={cliente.nome} subtitle="Jornada interior">
      <div className="flex justify-end mb-4">
        <Button
          variant="gold"
          onClick={() => setSessionWizardOpen(true)}
          className="gap-2"
        >
          <Play className="w-4 h-4" /> Iniciar Sessão
        </Button>
      </div>

      {/* Mini Mandala — visão rápida da CidaDELA */}
      <MiniMandalaCidadela clienteId={clienteId!} />

      {/* Atividade da cliente no Jardim */}
      <div className="mb-4">
        <ClienteAtividadeJardim clienteId={clienteId!} />
      </div>

      <SessionFlowWizard
        clienteId={clienteId!}
        clienteNome={cliente.nome}
        open={sessionWizardOpen}
        onClose={() => setSessionWizardOpen(false)}
      />

      <Tabs defaultValue="cidadela" className="w-full">
        <TabsList className="bg-card/80 border border-border/30 mb-6 flex-wrap h-auto gap-0.5 p-1">
          <TabsTrigger value="cidadela" className={tabClass}>CidaDELA</TabsTrigger>
          <TabsTrigger value="historico" className={tabClass}>Histórico</TabsTrigger>
          <TabsTrigger value="cartografia" className={tabClass}>Cartografia</TabsTrigger>
          <TabsTrigger value="sonhos" className={tabClass}>Sonhos</TabsTrigger>
          <TabsTrigger value="arquetipo" className={tabClass}>Arquétipo</TabsTrigger>
          <TabsTrigger value="estacoes" className={tabClass}>Estações</TabsTrigger>
          <TabsTrigger value="ariadne" className={tabClass}>Fio de Ariadne</TabsTrigger>
          <TabsTrigger value="sinais" className={tabClass}>Sinais</TabsTrigger>
          <TabsTrigger value="jardim-heroina" className={tabClass}>Jardim</TabsTrigger>
          <TabsTrigger value="39portas" className={tabClass}>39 Portas</TabsTrigger>
          <TabsTrigger value="atlas" className={tabClass}>Atlas</TabsTrigger>
          <TabsTrigger value="espelho" className={tabClass}>Espelho</TabsTrigger>
          <TabsTrigger value="complexos" className={tabClass}>Complexos</TabsTrigger>
          <TabsTrigger value="conselho" className={tabClass}>Conselho</TabsTrigger>
          <TabsTrigger value="ritual" className={tabClass}>Ritual</TabsTrigger>
          <TabsTrigger value="perfil" className={tabClass}>Perfil</TabsTrigger>
          <TabsTrigger value="mapa-psiquico" className={tabClass}>Mapa Psíquico</TabsTrigger>
          <TabsTrigger value="relatorio-jornada" className={tabClass}>Relatórios</TabsTrigger>
          <TabsTrigger value="bussola" className={tabClass}>Bússola</TabsTrigger>
        </TabsList>

        <TabsContent value="cidadela"><MapaVivoCidadela clienteId={clienteId!} /></TabsContent>
        <TabsContent value="historico"><ClienteHistorico clienteId={clienteId!} /></TabsContent>
        <TabsContent value="cartografia"><ClienteCartografias clienteId={clienteId!} /></TabsContent>
        <TabsContent value="sonhos"><ClienteSonhos clienteId={clienteId!} /></TabsContent>
        <TabsContent value="arquetipo"><ClientePerfilArquetipico clienteId={clienteId!} /></TabsContent>
        <TabsContent value="estacoes"><OraculoEstacoes clienteId={clienteId!} /></TabsContent>
        <TabsContent value="ariadne"><FioDeAriadne clienteId={clienteId!} /></TabsContent>
        <TabsContent value="sinais"><SinaisDaJornada clienteId={clienteId!} /></TabsContent>
        <TabsContent value="jardim-heroina"><ClienteJardimHeroinaTab clientId={clienteId!} clientName={cliente.nome} /></TabsContent>
        <TabsContent value="39portas"><Labirinto39Portas clienteId={clienteId!} /></TabsContent>
        <TabsContent value="atlas"><AtlasArquetipos clienteId={clienteId!} /></TabsContent>
        <TabsContent value="espelho"><RelacionamentosEspelho clienteId={clienteId!} /></TabsContent>
        <TabsContent value="complexos"><CartografiaComplexos clienteId={clienteId!} /></TabsContent>
        <TabsContent value="conselho"><ConselhoPartesInternas clienteId={clienteId!} /></TabsContent>
        <TabsContent value="ritual"><RitualIntegracao clienteId={clienteId!} /></TabsContent>
        <TabsContent value="perfil"><ClientePerfilTab cliente={cliente} onUpdate={loadCliente} /></TabsContent>
        <TabsContent value="mapa-psiquico"><CartografiaPsiquicaOracula clienteId={clienteId!} /></TabsContent>
        <TabsContent value="relatorio-jornada"><RelatorioJornadaPage clienteId={clienteId!} /></TabsContent>
        <TabsContent value="bussola"><BussolaCartografa clienteId={clienteId!} /></TabsContent>
      </Tabs>
    </CasaMaquinasLayout>
  );
}
