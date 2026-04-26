import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sun, Route } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminEstacoesTab } from '@/components/admin/AdminEstacoesTab';
import { EstacoesPassosManager } from '@/components/admin/clube/EstacoesPassosManager';

export default function AdminClubeEstacoes() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin/clube">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <SectionHeader
            title="Estações & Rotas"
            subtitle="Crie estações e organize os passos da jornada da aluna"
            icon={<Sun className="w-5 h-5" />}
          />
        </div>

        <Tabs defaultValue="passos" className="space-y-6">
          <TabsList>
            <TabsTrigger value="passos" className="gap-1.5">
              <Route className="w-3.5 h-3.5" /> Passos da Rota
            </TabsTrigger>
            <TabsTrigger value="estacoes" className="gap-1.5">
              <Sun className="w-3.5 h-3.5" /> Estações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="passos">
            <EstacoesPassosManager />
          </TabsContent>

          <TabsContent value="estacoes">
            <AdminEstacoesTab />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
