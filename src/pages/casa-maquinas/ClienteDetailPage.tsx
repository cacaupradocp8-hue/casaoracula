import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CidadelaMap } from '@/components/casa-maquinas/CidadelaMap';
import { ClienteHistorico } from '@/components/casa-maquinas/ClienteHistorico';
import { ClientePerfil as ClientePerfilTab } from '@/components/casa-maquinas/ClientePerfilTab';
import { ClienteCartografias } from '@/components/casa-maquinas/ClienteCartografias';
import { ClienteSonhos } from '@/components/casa-maquinas/ClienteSonhos';
import { ClientePerfilArquetipico } from '@/components/casa-maquinas/ClientePerfilArquetipico';
import { Loader2 } from 'lucide-react';

export default function ClienteDetailPage() {
  const { clienteId } = useParams<{ clienteId: string }>();
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
          <Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" />
        </div>
      </CasaMaquinasLayout>
    );
  }

  if (!cliente) {
    return (
      <CasaMaquinasLayout title="Cliente não encontrada">
        <p className="text-[#F5F1E8]/40 text-center py-20">Cliente não encontrada</p>
      </CasaMaquinasLayout>
    );
  }

  const tabClass = "data-[state=active]:bg-[#C9A24A]/15 data-[state=active]:text-[#C9A24A] text-[#F5F1E8]/60";

  return (
    <CasaMaquinasLayout title={cliente.nome} subtitle="Jornada interior">
      <Tabs defaultValue="cidadela" className="w-full">
        <TabsList className="bg-[#0B1B2B]/80 border border-[#C9A24A]/10 mb-6 flex-wrap h-auto">
          <TabsTrigger value="cidadela" className={tabClass}>CidaDELA</TabsTrigger>
          <TabsTrigger value="historico" className={tabClass}>Histórico</TabsTrigger>
          <TabsTrigger value="cartografia" className={tabClass}>Cartografia</TabsTrigger>
          <TabsTrigger value="sonhos" className={tabClass}>Sonhos</TabsTrigger>
          <TabsTrigger value="arquetipo" className={tabClass}>Arquétipo</TabsTrigger>
          <TabsTrigger value="perfil" className={tabClass}>Perfil</TabsTrigger>
        </TabsList>

        <TabsContent value="cidadela"><CidadelaMap clienteId={clienteId!} /></TabsContent>
        <TabsContent value="historico"><ClienteHistorico clienteId={clienteId!} /></TabsContent>
        <TabsContent value="cartografia"><ClienteCartografias clienteId={clienteId!} /></TabsContent>
        <TabsContent value="sonhos"><ClienteSonhos clienteId={clienteId!} /></TabsContent>
        <TabsContent value="perfil"><ClientePerfilTab cliente={cliente} onUpdate={loadCliente} /></TabsContent>
      </Tabs>
    </CasaMaquinasLayout>
  );
}
