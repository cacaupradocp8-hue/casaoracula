import React, { lazy, Suspense, useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { useAdminPreview } from '@/contexts/AdminPreviewContext';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'react-router-dom';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { PortalType } from '@/types/portal';
import { Loader2, Settings, Eye, EyeOff, AlertTriangle, Sparkles } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { BootSafeBoundary } from '@/components/shared/BootSafeBoundary';

// Lazy load all admin tabs
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
const AdminOfertasTab = lazy(() => import('@/components/admin/AdminOfertasTab').then(m => ({ default: m.AdminOfertasTab })));
const AdminProgressoTab = lazy(() => import('@/components/admin/AdminProgressoTab').then(m => ({ default: m.AdminProgressoTab })));
const AdminCopyTab = lazy(() => import('@/components/admin/AdminCopyTab'));
const AdminOraculosTab = lazy(() => import('@/components/admin/AdminOraculosTab').then(m => ({ default: m.AdminOraculosTab })));
const AdminBlocksTab = lazy(() => import('@/components/admin/AdminBlocksTab').then(m => ({ default: m.AdminBlocksTab })));
const AdminAISettingsTab = lazy(() => import('@/components/admin/AdminAISettingsTab').then(m => ({ default: m.AdminAISettingsTab })));
const AdminBibliotecaTravessiasTab = lazy(() => import('@/components/admin/AdminBibliotecaTravessiasTab').then(m => ({ default: m.AdminBibliotecaTravessiasTab })));
const AdminTravessiasTab = lazy(() => import('@/components/admin/AdminTravessiasTab').then(m => ({ default: m.AdminTravessiasTab })));
const AdminLabirintoTab = lazy(() => import('@/components/admin/AdminLabirintoTab').then(m => ({ default: m.AdminLabirintoTab })));
const AdminLabirintoHeroinaTab = lazy(() => import('@/components/admin/AdminLabirintoHeroinaTab').then(m => ({ default: m.AdminLabirintoHeroinaTab })));
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
const AdminDegustacaoTab = lazy(() => import('@/components/admin/AdminDegustacaoTab').then(m => ({ default: m.AdminDegustacaoTab })));
const AdminGaleriaTab = lazy(() => import('@/components/admin/AdminGaleriaTab').then(m => ({ default: m.AdminGaleriaTab })));
const AdminTorreVivaTab = lazy(() => import('@/components/admin/AdminTorreVivaTab').then(m => ({ default: m.AdminTorreVivaTab })));
const AdminBibliotecaCasosTab = lazy(() => import('@/components/admin/AdminBibliotecaCasosTab'));
const AdminAtlasFemininoTab = lazy(() => import('@/components/admin/AdminAtlasFemininoTab').then(m => ({ default: m.AdminAtlasFemininoTab })));
const AdminNarroterapiaTab = lazy(() => import('@/components/admin/AdminNarroterapiaTab').then(m => ({ default: m.AdminNarroterapiaTab })));
const AdminNarroterapiaAutorizacaoTab = lazy(() => import('@/components/admin/AdminNarroterapiaAutorizacaoTab'));
const AdminClubeHub = lazy(() => import('@/pages/admin/clube/AdminClubeHub'));
const AdminCentralJornadas = lazy(() => import('@/pages/admin/clube/AdminCentralJornadas'));
const AdminPortalCMS = lazy(() => import('@/pages/admin/clube/AdminPortalCMS'));
const AdminClubeTreinamento = lazy(() => import('@/pages/admin/clube/AdminClubeTreinamento'));
const AdminClubeChat = lazy(() => import('@/pages/admin/clube/AdminClubeChat'));
const AdminClubeAcervo = lazy(() => import('@/pages/admin/clube/AdminClubeAcervo'));
const AdminCentralEstacao = lazy(() => import('@/pages/admin/clube/AdminCentralEstacao'));
const AdminClubeLivroTab = lazy(() => import('@/components/admin/AdminClubeLivroTab').then(m => ({ default: m.AdminClubeLivroTab })));
const AdminGeradorSemanal = lazy(() => import('@/components/admin/AdminGeradorSemanal'));
const AdminPlanosClubTab = lazy(() => import('@/components/admin/AdminPlanosClubTab').then(m => ({ default: m.AdminPlanosClubTab })));
const AdminEstudioOracular = lazy(() => import('@/components/admin/AdminEstudioOracular'));
const AdminVitrineCards = lazy(() => import('@/pages/admin/AdminVitrineCards'));
const AdminPortalJunguianoTab = lazy(() => import('@/components/admin/AdminPortalJunguianoTab').then(m => ({ default: m.AdminPortalJunguianoTab })));
const AdminCertificacaoTab = lazy(() => import('@/components/admin/AdminCertificacaoTab').then(m => ({ default: m.AdminCertificacaoTab })));


const PREVIEW_PORTALS: { value: PortalType; label: string }[] = [
  { value: 'visitante', label: '👁 Visitante' },
  { value: 'aluna', label: '👁 Aluna' },
  { value: 'oracula', label: '👁 Orácula' },
  { value: 'assinante', label: '👁 Assinante' },
];

const TabLoader = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
  </div>
);

// Map tab keys to their lazy components
const TAB_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  'users': AdminUsersTab,
  'matriculas': AdminMatriculasTab,
  'degustacao': AdminDegustacaoTab,
  'assinaturas': AdminAssinaturasTab,
  'leituras': AdminLeiturasTab,
  'conteudos': AdminConteudosTab,
  'cursos': AdminCursosTab,
  'biblioteca': AdminBibliotecaTab,
  'mentoria': AdminMentoriaTab,
  'agentes': AdminAgentesTab,
  'modelos': AdminModelosTab,
  'ferramentas': AdminFerramentasTab,
  'salas': AdminSalasTab,
  'quiz': AdminQuizTab,
  'lab': AdminLabCasosTab,
  'planos': AdminPlanosTab,
  'ofertas': AdminOfertasTab,
  'progresso': AdminProgressoTab,
  'oraculos': AdminOraculosTab,
  'blocos': AdminBlocksTab,
  'travessias': AdminTravessiasTab,
  'travessias-conteudo': AdminBibliotecaTravessiasTab,
  'familias': AdminFamiliasTab,
  'labirinto': AdminLabirintoTab,
  'labirinto-heroina': AdminLabirintoHeroinaTab,
  'big5-simbolico': AdminBig5SymbolicTab,
  'eneagrama-feminino': AdminEneagramaFemininoTab,
  'jornada-heroina': AdminJornadaHeroinaTab,
  'radiestesia': AdminRadiestesiaTab,
  'ia-config': AdminAISettingsTab,
  'audios': AdminAudiosTab,
  'clube-jornadas': AdminCentralJornadas,
  'clube-portais': AdminPortalCMS,
  'clube-acervo': AdminClubeAcervo,
  'clube-treinamento': AdminClubeTreinamento,
  'clube-chat': AdminClubeChat,
  'comunicacao': AdminComunicacaoTab,
  'formacao': AdminFormacaoTab,
  'area-formacao': AdminAreaFormacaoTab,
  'casa-oracula': AdminCasaOraculaTab,
  'sessoes': AdminSessoesTab,
  'grupos': AdminGruposTab,
  'galeria': AdminGaleriaTab,
  'torre-viva': AdminTorreVivaTab,
  'biblioteca-casos': AdminBibliotecaCasosTab,
  'atlas-feminino': AdminAtlasFemininoTab,
  'narroterapia': AdminNarroterapiaTab,
  'narroterapia-autorizacao': AdminNarroterapiaAutorizacaoTab,
  'clube': AdminClubeHub,
  'clube-livro': AdminClubeHub,
  'gerador-semanal': AdminGeradorSemanal,
  'planos-clube': AdminPlanosClubTab,
  'estudio-oracular': AdminEstudioOracular,
  'portal-junguiano': AdminPortalJunguianoTab,
  'certificacao': AdminCertificacaoTab,
  'vitrine': AdminVitrineCards,
  'settings': AdminSettingsTab,
  'copy': AdminCopyTab,
  
};

export default function Admin() {
  const { isPreviewMode, previewPortal, enablePreviewMode, disablePreviewMode } = useAdminPreview();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'clube');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && TAB_COMPONENTS[tab]) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Expose setActiveTab globally for child components
  React.useEffect(() => {
    (window as any).Admin_SetActiveTab = setActiveTab;
    (window as any).Admin_ActiveTab = activeTab;
  }, [activeTab]);

  const ActiveComponent = TAB_COMPONENTS[activeTab] || 
    (activeTab.startsWith('central-estacao-') ? AdminCentralEstacao : null);

  return (
    <AppLayout>
      <div className="flex min-h-[calc(100vh-5rem)]">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1 min-w-0 overflow-auto">
          <div className="px-6 py-6 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
              {activeTab !== 'clube' && (
                <SectionHeader
                  title="Painel da Guardiã"
                  subtitle="Gerencie a Casa ORÁCULA com clareza e cuidado"
                  icon={<Settings className="w-5 h-5" />}
                />
              )}

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

            {/* Copy tab special header */}
            {activeTab === 'copy' && (
              <div className="mb-4 flex justify-end">
                <a href="/admin/atelie-conteudo" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gold bg-gold/10 hover:bg-gold/20 rounded-md transition-colors">
                  <Sparkles className="w-4 h-4" />
                  Ateliê de Conteúdo (IA)
                </a>
              </div>
            )}

            {/* Active tab content */}
            {ActiveComponent && (
              <BootSafeBoundary label={`AdminTab: ${activeTab}`}>
                <Suspense fallback={<TabLoader />}>
                  <ActiveComponent />
                </Suspense>
              </BootSafeBoundary>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
