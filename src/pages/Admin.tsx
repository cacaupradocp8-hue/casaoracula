import React, { lazy, Suspense } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, Library, Megaphone, Bot, FileText, Wrench, DoorOpen, GraduationCap, UserCheck, Cog, CreditCard, Sparkles, ClipboardList, BookOpen, TrendingUp, PenLine, Video, Layers, LayoutGrid, Brain, Compass, Eye, EyeOff, AlertTriangle, FolderTree, Moon, Flower2, Headphones, MessageSquare, Target, Flame, FolderOpen, Link } from 'lucide-react';
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
import { Loader2 } from 'lucide-react';

// Lazy load all admin tabs for better performance
const AdminCursosTab = lazy(() => import('@/components/admin/AdminCursosTab').then(m => ({ default: m.AdminCursosTab })));
const AdminUsersTab = lazy(() => import('@/components/admin/AdminUsersTab').then(m => ({ default: m.AdminUsersTab })));
const AdminBibliotecaTab = lazy(() => import('@/components/admin/AdminBibliotecaTab').then(m => ({ default: m.AdminBibliotecaTab })));
const AdminMentoriaTab = lazy(() => import('@/components/admin/AdminMentoriaTab').then(m => ({ default: m.AdminMentoriaTab })));
const AdminAgentesTab = lazy(() => import('@/components/admin/AdminAgentesTab').then(m => ({ default: m.AdminAgentesTab })));
const AdminModelosTab = lazy(() => import('@/components/admin/AdminModelosTab').then(m => ({ default: m.AdminModelosTab })));
const AdminFerramentasTab = lazy(() => import('@/components/admin/AdminFerramentasTab').then(m => ({ default: m.AdminFerramentasTab })));
const AdminSalasTab = lazy(() => import('@/components/admin/AdminSalasTab').then(m => ({ default: m.AdminSalasTab })));
const AdminConteudosTab = lazy(() => import('@/components/admin/AdminConteudosTab').then(m => ({ default: m.AdminConteudosTab })));

const AdminMatriculasTab = lazy(() => import('@/components/admin/AdminMatriculasTab').then(m => ({ default: m.AdminMatriculasTab })));
const AdminSettingsTab = lazy(() => import('@/components/admin/AdminSettingsTab').then(m => ({ default: m.AdminSettingsTab })));
const AdminAssinaturasTab = lazy(() => import('@/components/admin/AdminAssinaturasTab').then(m => ({ default: m.AdminAssinaturasTab })));
const AdminLeiturasTab = lazy(() => import('@/components/admin/AdminLeiturasTab').then(m => ({ default: m.AdminLeiturasTab })));
const AdminQuizTab = lazy(() => import('@/components/admin/AdminQuizTab').then(m => ({ default: m.AdminQuizTab })));
const AdminLabCasosTab = lazy(() => import('@/components/admin/AdminLabCasosTab').then(m => ({ default: m.AdminLabCasosTab })));
const AdminPlanosTab = lazy(() => import('@/components/admin/AdminPlanosTab').then(m => ({ default: m.AdminPlanosTab })));
const AdminProgressoTab = lazy(() => import('@/components/admin/AdminProgressoTab').then(m => ({ default: m.AdminProgressoTab })));
const AdminCopyTab = lazy(() => import('@/components/admin/AdminCopyTab'));
const AdminOraculosTab = lazy(() => import('@/components/admin/AdminOraculosTab').then(m => ({ default: m.AdminOraculosTab })));
const AdminBlocksTab = lazy(() => import('@/components/admin/AdminBlocksTab').then(m => ({ default: m.AdminBlocksTab })));
const AdminAISettingsTab = lazy(() => import('@/components/admin/AdminAISettingsTab').then(m => ({ default: m.AdminAISettingsTab })));
const AdminBibliotecaTravessiasTab = lazy(() => import('@/components/admin/AdminBibliotecaTravessiasTab').then(m => ({ default: m.AdminBibliotecaTravessiasTab })));
const AdminLabirintoTab = lazy(() => import('@/components/admin/AdminLabirintoTab').then(m => ({ default: m.AdminLabirintoTab })));
const AdminFamiliasTab = lazy(() => import('@/components/admin/AdminFamiliasTab').then(m => ({ default: m.AdminFamiliasTab })));
const AdminBig5SymbolicTab = lazy(() => import('@/components/admin/AdminBig5SymbolicTab').then(m => ({ default: m.AdminBig5SymbolicTab })));
const AdminEneagramaFemininoTab = lazy(() => import('@/components/admin/AdminEneagramaFemininoTab'));
const AdminJornadaHeroinaTab = lazy(() => import('@/components/admin/AdminJornadaHeroinaTab').then(m => ({ default: m.AdminJornadaHeroinaTab })));
const AdminAudiosTab = lazy(() => import('@/components/admin/AdminAudiosTab').then(m => ({ default: m.AdminAudiosTab })));
const AdminComunicacaoTab = lazy(() => import('@/components/admin/AdminComunicacaoTab').then(m => ({ default: m.AdminComunicacaoTab })));
const AdminFormacaoTab = lazy(() => import('@/components/admin/AdminFormacaoTab'));
const AdminRadiestesiaTab = lazy(() => import('@/components/admin/AdminRadiestesiaTab').then(m => ({ default: m.AdminRadiestesiaTab })));
const AdminCasaOraculaTab = lazy(() => import('@/components/admin/AdminCasaOraculaTab'));
const AdminAreaFormacaoTab = lazy(() => import('@/components/admin/AdminAreaFormacaoTab').then(m => ({ default: m.AdminAreaFormacaoTab })));
const AdminSessoesTab = lazy(() => import('@/components/admin/AdminSessoesTab').then(m => ({ default: m.AdminSessoesTab })));
const AdminGruposTab = lazy(() => import('@/components/admin/AdminGruposTab').then(m => ({ default: m.AdminGruposTab })));

const PREVIEW_PORTALS: { value: PortalType; label: string }[] = [
  { value: 'visitante', label: '👁 Visitante' },
  { value: 'mentorada', label: '👁 Mentorada' },
  { value: 'aluna_formacao', label: '👁 Aluna Formação' },
  { value: 'assinante', label: '👁 Assinante' },
  { value: 'oracula', label: '👁 Orácula' },
];

// Tab loading fallback
const TabLoader = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
  </div>
);

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
                  Preview: <strong>{PREVIEW_PORTALS.find(p => p.value === previewPortal)?.label?.replace('👁 ', '') || previewPortal}</strong>
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
            <TabsTrigger value="casa-oracula" className="gap-2">
              <Flame className="w-4 h-4" />
              Casa das Tecelãs
            </TabsTrigger>
            <TabsTrigger value="sessoes" className="gap-2">
              <FolderOpen className="w-4 h-4 text-purple-400" />
              Sessões
            </TabsTrigger>
            <TabsTrigger value="grupos" className="gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              Grupos
              <Users className="w-4 h-4 text-purple-400" />
              Grupos
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
            <TabsTrigger value="familias" className="gap-2">
              <FolderTree className="w-4 h-4" />
              Famílias
            </TabsTrigger>
            <TabsTrigger value="labirinto" className="gap-2">
              <DoorOpen className="w-4 h-4 text-gold" />
              🜂 Labirinto
            </TabsTrigger>
            <TabsTrigger value="big5-simbolico" className="gap-2">
              <Moon className="w-4 h-4" />
              Mapa 5 Territórios
            </TabsTrigger>
            <TabsTrigger value="eneagrama-feminino" className="gap-2">
              <Flower2 className="w-4 h-4" />
              Oráculo 9 Arquétipos
            </TabsTrigger>
            <TabsTrigger value="jornada-heroina" className="gap-2">
              <Compass className="w-4 h-4 text-purple-400" />
              Caminho da Mulher
            </TabsTrigger>
            <TabsTrigger value="radiestesia" className="gap-2">
              <Target className="w-4 h-4 text-purple-400" />
              Radiestesia
            </TabsTrigger>
            <TabsTrigger value="ia-config" className="gap-2">
              <Brain className="w-4 h-4" />
              IA Config
            </TabsTrigger>
            <TabsTrigger value="audios" className="gap-2">
              <Headphones className="w-4 h-4" />
              Áudios
            </TabsTrigger>
            <TabsTrigger value="comunicacao" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Comunicação
            </TabsTrigger>
            <TabsTrigger value="formacao" className="gap-2">
              <GraduationCap className="w-4 h-4 text-gold" />
              Pág. Vendas
            </TabsTrigger>
            <TabsTrigger value="area-formacao" className="gap-2">
              <DoorOpen className="w-4 h-4 text-purple-400" />
              Área Formação
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Cog className="w-4 h-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Suspense fallback={<TabLoader />}>
              <AdminUsersTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="matriculas">
            <Suspense fallback={<TabLoader />}>
              <AdminMatriculasTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="assinaturas">
            <Suspense fallback={<TabLoader />}>
              <AdminAssinaturasTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="leituras">
            <Suspense fallback={<TabLoader />}>
              <AdminLeiturasTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="conteudos">
            <Suspense fallback={<TabLoader />}>
              <AdminConteudosTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="cursos">
            <Suspense fallback={<TabLoader />}>
              <AdminCursosTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="biblioteca">
            <Suspense fallback={<TabLoader />}>
              <AdminBibliotecaTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="mentoria">
            <Suspense fallback={<TabLoader />}>
              <AdminMentoriaTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="agentes">
            <Suspense fallback={<TabLoader />}>
              <AdminAgentesTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="modelos">
            <Suspense fallback={<TabLoader />}>
              <AdminModelosTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="copy">
            <Suspense fallback={<TabLoader />}>
              <AdminCopyTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="ferramentas">
            <Suspense fallback={<TabLoader />}>
              <AdminFerramentasTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="salas">
            <Suspense fallback={<TabLoader />}>
              <AdminSalasTab />
            </Suspense>
          </TabsContent>


          <TabsContent value="quiz">
            <Suspense fallback={<TabLoader />}>
              <AdminQuizTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="lab">
            <Suspense fallback={<TabLoader />}>
              <AdminLabCasosTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="planos">
            <Suspense fallback={<TabLoader />}>
              <AdminPlanosTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="progresso">
            <Suspense fallback={<TabLoader />}>
              <AdminProgressoTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="oraculos">
            <Suspense fallback={<TabLoader />}>
              <AdminOraculosTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="blocos">
            <Suspense fallback={<TabLoader />}>
              <AdminBlocksTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="travessias">
            <Suspense fallback={<TabLoader />}>
              <AdminBibliotecaTravessiasTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="familias">
            <Suspense fallback={<TabLoader />}>
              <AdminFamiliasTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="labirinto">
            <Suspense fallback={<TabLoader />}>
              <AdminLabirintoTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="big5-simbolico">
            <Suspense fallback={<TabLoader />}>
              <AdminBig5SymbolicTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="eneagrama-feminino">
            <Suspense fallback={<TabLoader />}>
              <AdminEneagramaFemininoTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="jornada-heroina">
            <Suspense fallback={<TabLoader />}>
              <AdminJornadaHeroinaTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="radiestesia">
            <Suspense fallback={<TabLoader />}>
              <AdminRadiestesiaTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="ia-config">
            <Suspense fallback={<TabLoader />}>
              <AdminAISettingsTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="audios">
            <Suspense fallback={<TabLoader />}>
              <AdminAudiosTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="comunicacao">
            <Suspense fallback={<TabLoader />}>
              <AdminComunicacaoTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="formacao">
            <Suspense fallback={<TabLoader />}>
              <AdminFormacaoTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="area-formacao">
            <Suspense fallback={<TabLoader />}>
              <AdminAreaFormacaoTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="casa-oracula">
            <Suspense fallback={<TabLoader />}>
              <AdminCasaOraculaTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="sessoes">
            <Suspense fallback={<TabLoader />}>
              <AdminSessoesTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="vinculos">
            <Suspense fallback={<TabLoader />}>
              <AdminVinculosTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="grupos">
            <Suspense fallback={<TabLoader />}>
              <AdminGruposTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="settings">
            <Suspense fallback={<TabLoader />}>
              <AdminSettingsTab />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
