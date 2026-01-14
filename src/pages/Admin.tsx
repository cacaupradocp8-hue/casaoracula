import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, Library, Megaphone, Bot, FileText, Wrench, DoorOpen, GraduationCap, Link2, UserCheck, Cog, CreditCard, Sparkles, ClipboardList, BookOpen, TrendingUp, PenLine, Video, Layers, LayoutGrid, Brain, Compass, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { AdminCursosTab } from '@/components/admin/AdminCursosTab';
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
import AdminCopyTab from '@/components/admin/AdminCopyTab';
import { AdminOraculosTab } from '@/components/admin/AdminOraculosTab';
import { AdminBlocksTab } from '@/components/admin/AdminBlocksTab';
import { AdminAISettingsTab } from '@/components/admin/AdminAISettingsTab';
import { AdminBibliotecaTravessiasTab } from '@/components/admin/AdminBibliotecaTravessiasTab';
import { useAdminPreview } from '@/contexts/AdminPreviewContext';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PortalType } from '@/types/portal';

const PREVIEW_PORTALS: { value: PortalType; label: string }[] = [
  { value: 'visitante', label: '👁 Visitante' },
  { value: 'pre_iniciada', label: '👁 Pré-Iniciada' },
  { value: 'iniciada', label: '👁 Iniciada ORÁCULA' },
];

export default function Admin() {
  const { isPreviewMode, previewPortal, enablePreviewMode, disablePreviewMode } = useAdminPreview();

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <SectionHeader
            title="Painel da Guardiã"
            subtitle="Gerencie usuárias, conteúdo e portais da Casa ORÁCULA"
            icon={<Settings className="w-5 h-5" />}
          />
          
          {/* Preview Mode Control */}
          <div className="flex items-center gap-2 shrink-0">
            {isPreviewMode ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/20 border border-amber-500/50">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-amber-200">
                  Preview: <strong>{previewPortal === 'visitante' ? 'Visitante' : previewPortal === 'pre_iniciada' ? 'Pré-Iniciada' : 'Iniciada'}</strong>
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-amber-200 hover:text-amber-100 hover:bg-amber-500/30"
                  onClick={disablePreviewMode}
                >
                  <EyeOff className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Select value="" onValueChange={(value) => enablePreviewMode(value as PortalType)}>
                <SelectTrigger className="w-48 h-9 text-sm bg-muted/50">
                  <Eye className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Simular visão de..." />
                </SelectTrigger>
                <SelectContent>
                  {PREVIEW_PORTALS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

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
            <TabsTrigger value="cursos" className="gap-2">
              <Video className="w-4 h-4" />
              Cursos
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
            <TabsTrigger value="copy" className="gap-2">
              <PenLine className="w-4 h-4" />
              Copy & Narrativas
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
            <TabsTrigger value="oraculos" className="gap-2">
              <Layers className="w-4 h-4" />
              Oráculos
            </TabsTrigger>
            <TabsTrigger value="blocos" className="gap-2">
              <LayoutGrid className="w-4 h-4" />
              Blocos
            </TabsTrigger>
            <TabsTrigger value="travessias" className="gap-2">
              <Compass className="w-4 h-4" />
              Travessias
            </TabsTrigger>
            <TabsTrigger value="ia-config" className="gap-2">
              <Brain className="w-4 h-4" />
              IA Config
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

          <TabsContent value="cursos">
            <AdminCursosTab />
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

          <TabsContent value="copy">
            <AdminCopyTab />
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

          <TabsContent value="oraculos">
            <AdminOraculosTab />
          </TabsContent>

          <TabsContent value="blocos">
            <AdminBlocksTab />
          </TabsContent>

          <TabsContent value="travessias">
            <AdminBibliotecaTravessiasTab />
          </TabsContent>

          <TabsContent value="ia-config">
            <AdminAISettingsTab />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
