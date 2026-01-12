import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, Library, Megaphone, Bot, FileText, Wrench, DoorOpen, GraduationCap, Link2, UserCheck, Cog, CreditCard, Sparkles, ClipboardList, BookOpen, TrendingUp } from 'lucide-react';
import { AdminUsersTab } from '@/components/admin/AdminUsersTab';
import { AdminBibliotecaTab } from '@/components/admin/AdminBibliotecaTab';
import { AdminMentoriaTab } from '@/components/admin/AdminMentoriaTab';
import { AdminAgentesTab } from '@/components/admin/AdminAgentesTab';
import { AdminModelosTab } from '@/components/admin/AdminModelosTab';
import { AdminFerramentasTab } from '@/components/admin/AdminFerramentasTab';
import { AdminSalasTab } from '@/components/admin/AdminSalasTab';
import { AdminConteudosTab } from '@/components/admin/AdminConteudosTab';
import { AdminVinculosTab } from '@/components/admin/AdminVinculosTab';
import { AdminMatriculasTab } from '@/components/admin/AdminMatriculasTab';
import { AdminSettingsTab } from '@/components/admin/AdminSettingsTab';
import { AdminAssinaturasTab } from '@/components/admin/AdminAssinaturasTab';
import { AdminLeiturasTab } from '@/components/admin/AdminLeiturasTab';
import { AdminQuizTab } from '@/components/admin/AdminQuizTab';
import { AdminLabCasosTab } from '@/components/admin/AdminLabCasosTab';
import { AdminPlanosTab } from '@/components/admin/AdminPlanosTab';
import { AdminProgressoTab } from '@/components/admin/AdminProgressoTab';

export default function Admin() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <SectionHeader
          title="Painel da Guardiã"
          subtitle="Gerencie usuárias, conteúdo e portais da Casa ORÁCULA"
          icon={<Settings className="w-5 h-5" />}
          className="mb-8"
        />

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-1">
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              Usuárias
            </TabsTrigger>
            <TabsTrigger value="matriculas" className="gap-2">
              <UserCheck className="w-4 h-4" />
              Matrículas
            </TabsTrigger>
            <TabsTrigger value="assinaturas" className="gap-2">
              <CreditCard className="w-4 h-4" />
              Assinaturas
            </TabsTrigger>
            <TabsTrigger value="leituras" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Leituras
            </TabsTrigger>
            <TabsTrigger value="conteudos" className="gap-2">
              <GraduationCap className="w-4 h-4" />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="biblioteca" className="gap-2">
              <Library className="w-4 h-4" />
              Biblioteca
            </TabsTrigger>
            <TabsTrigger value="mentoria" className="gap-2">
              <Megaphone className="w-4 h-4" />
              Mentoria
            </TabsTrigger>
            <TabsTrigger value="agentes" className="gap-2">
              <Bot className="w-4 h-4" />
              Agentes
            </TabsTrigger>
            <TabsTrigger value="modelos" className="gap-2">
              <FileText className="w-4 h-4" />
              Modelos
            </TabsTrigger>
            <TabsTrigger value="ferramentas" className="gap-2">
              <Wrench className="w-4 h-4" />
              Ferramentas
            </TabsTrigger>
            <TabsTrigger value="salas" className="gap-2">
              <DoorOpen className="w-4 h-4" />
              Salas
            </TabsTrigger>
            <TabsTrigger value="vinculos" className="gap-2">
              <Link2 className="w-4 h-4" />
              Vínculos
            </TabsTrigger>
            <TabsTrigger value="quiz" className="gap-2">
              <ClipboardList className="w-4 h-4" />
              Quiz
            </TabsTrigger>
            <TabsTrigger value="lab" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Laboratório
            </TabsTrigger>
            <TabsTrigger value="planos" className="gap-2">
              <CreditCard className="w-4 h-4" />
              Planos
            </TabsTrigger>
            <TabsTrigger value="progresso" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Evolução
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Cog className="w-4 h-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <AdminUsersTab />
          </TabsContent>

          <TabsContent value="matriculas">
            <AdminMatriculasTab />
          </TabsContent>

          <TabsContent value="assinaturas">
            <AdminAssinaturasTab />
          </TabsContent>

          <TabsContent value="leituras">
            <AdminLeiturasTab />
          </TabsContent>

          <TabsContent value="conteudos">
            <AdminConteudosTab />
          </TabsContent>

          <TabsContent value="biblioteca">
            <AdminBibliotecaTab />
          </TabsContent>

          <TabsContent value="mentoria">
            <AdminMentoriaTab />
          </TabsContent>

          <TabsContent value="agentes">
            <AdminAgentesTab />
          </TabsContent>

          <TabsContent value="modelos">
            <AdminModelosTab />
          </TabsContent>

          <TabsContent value="ferramentas">
            <AdminFerramentasTab />
          </TabsContent>

          <TabsContent value="salas">
            <AdminSalasTab />
          </TabsContent>

          <TabsContent value="vinculos">
            <AdminVinculosTab />
          </TabsContent>

          <TabsContent value="quiz">
            <AdminQuizTab />
          </TabsContent>

          <TabsContent value="lab">
            <AdminLabCasosTab />
          </TabsContent>

          <TabsContent value="planos">
            <AdminPlanosTab />
          </TabsContent>

          <TabsContent value="progresso">
            <AdminProgressoTab />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
