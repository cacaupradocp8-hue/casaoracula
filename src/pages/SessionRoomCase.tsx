import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Layers, Map, FileText, Heart, Archive, MoreVertical, ClipboardList, Compass } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useSessionRoom } from '@/hooks/useSessionRoom';
import { supabase } from '@/integrations/supabase/client';
import type { SessionCase, NarrativeMap, SessionScript } from '@/types/session-room';

// Tab Components
import { OracleTab } from '@/components/session-room/OracleTab';
import { SevenLayersTab } from '@/components/session-room/SevenLayersTab';
import { NarrativeMapTab } from '@/components/session-room/NarrativeMapTab';
import { SessionScriptTab } from '@/components/session-room/SessionScriptTab';
import { PostSessionTab } from '@/components/session-room/PostSessionTab';
import { TemplatesTab } from '@/components/session-room/TemplatesTab';
import { ProtocoloOraculaTab } from '@/components/session-room/ProtocoloOraculaTab';

export default function SessionRoomCase() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { updateCaseStatus, fetchNarrativeMap } = useSessionRoom();
  
  const [caseData, setCaseData] = useState<SessionCase | null>(null);
  const [narrativeMap, setNarrativeMap] = useState<NarrativeMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('oracle');

  useEffect(() => {
    if (caseId) {
      loadCaseData();
    }
  }, [caseId]);

  const loadCaseData = async () => {
    if (!caseId) return;
    
    setLoading(true);
    try {
      // Fetch case with client info
      const { data: caseResult, error } = await supabase
        .from('session_cases')
        .select(`
          *,
          client:profiles!session_cases_client_id_fkey(id, nome, email)
        `)
        .eq('id', caseId)
        .single();

      if (error) throw error;
      setCaseData(caseResult as SessionCase);

      // Fetch narrative map
      const map = await fetchNarrativeMap(caseId);
      setNarrativeMap(map);
    } catch (error) {
      console.error('Error loading case:', error);
      navigate('/session-room');
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    if (!caseId || !caseData) return;
    
    const newStatus = caseData.status === 'archived' ? 'active' : 'archived';
    const success = await updateCaseStatus(caseId, newStatus);
    if (success) {
      setCaseData({ ...caseData, status: newStatus });
    }
  };

  const handleNarrativeMapUpdate = (map: NarrativeMap) => {
    setNarrativeMap(map);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-gold font-display text-xl">Carregando...</div>
        </div>
      </AppLayout>
    );
  }

  if (!caseData) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-muted-foreground">Caso não encontrado</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 pb-20 max-w-5xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/session-room')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-display text-foreground">{caseData.title}</h1>
                <Badge variant={caseData.status === 'active' ? 'default' : 'secondary'}>
                  {caseData.status === 'active' ? 'Ativo' : 'Arquivado'}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                Cliente: {caseData.client?.nome || 'Não identificada'}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleArchive}>
                <Archive className="w-4 h-4 mr-2" />
                {caseData.status === 'archived' ? 'Reativar Caso' : 'Arquivar Caso'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 h-auto">
            <TabsTrigger value="protocolo" className="flex flex-col gap-1 py-3">
              <Compass className="w-4 h-4 text-gold" />
              <span className="text-xs">Protocolo</span>
            </TabsTrigger>
            <TabsTrigger value="oracle" className="flex flex-col gap-1 py-3">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs">Oráculo</span>
            </TabsTrigger>
            <TabsTrigger value="layers" className="flex flex-col gap-1 py-3">
              <Layers className="w-4 h-4" />
              <span className="text-xs">7 Camadas</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex flex-col gap-1 py-3">
              <Map className="w-4 h-4" />
              <span className="text-xs">Mapa</span>
            </TabsTrigger>
            <TabsTrigger value="script" className="flex flex-col gap-1 py-3">
              <FileText className="w-4 h-4" />
              <span className="text-xs">Roteiro</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex flex-col gap-1 py-3">
              <ClipboardList className="w-4 h-4" />
              <span className="text-xs">Templates</span>
            </TabsTrigger>
            <TabsTrigger value="post" className="flex flex-col gap-1 py-3">
              <Heart className="w-4 h-4" />
              <span className="text-xs">Pós-Sessão</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="protocolo">
            <ProtocoloOraculaTab
              sessionCaseId={caseData.id}
              clienteId={caseData.client_id}
              clienteNome={caseData.client?.nome || 'Cliente'}
            />
          </TabsContent>

          <TabsContent value="oracle">
            <OracleTab caseId={caseData.id} clientId={caseData.client_id} />
          </TabsContent>

          <TabsContent value="layers">
            <SevenLayersTab
              caseId={caseData.id}
              clientId={caseData.client_id}
              narrativeMap={narrativeMap}
              onUpdate={handleNarrativeMapUpdate}
            />
          </TabsContent>

          <TabsContent value="map">
            <NarrativeMapTab narrativeMap={narrativeMap} clientName={caseData.client?.nome} />
          </TabsContent>

          <TabsContent value="script">
            <SessionScriptTab
              caseId={caseData.id}
              clientId={caseData.client_id}
              narrativeMap={narrativeMap}
            />
          </TabsContent>

          <TabsContent value="templates">
            <TemplatesTab
              caseId={caseData.id}
              clientId={caseData.client_id}
              clientName={caseData.client?.nome}
            />
          </TabsContent>

          <TabsContent value="post">
            <PostSessionTab caseId={caseData.id} clientId={caseData.client_id} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
