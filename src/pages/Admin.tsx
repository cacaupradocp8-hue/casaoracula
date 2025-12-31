import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, BookOpen, Library, Megaphone, Bot, FileText } from 'lucide-react';
import { AdminUsersTab } from '@/components/admin/AdminUsersTab';
import { AdminTravessiasTab } from '@/components/admin/AdminTravessiasTab';
import { AdminBibliotecaTab } from '@/components/admin/AdminBibliotecaTab';
import { AdminMentoriaTab } from '@/components/admin/AdminMentoriaTab';
import { AdminAgentesTab } from '@/components/admin/AdminAgentesTab';
import { AdminModelosTab } from '@/components/admin/AdminModelosTab';

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
            <TabsTrigger value="travessias" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Travessias
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
          </TabsList>

          <TabsContent value="users">
            <AdminUsersTab />
          </TabsContent>

          <TabsContent value="travessias">
            <AdminTravessiasTab />
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
        </Tabs>
      </div>
    </AppLayout>
  );
}
