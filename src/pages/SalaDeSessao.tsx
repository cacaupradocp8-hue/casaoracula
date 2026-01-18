import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

import { LayerScreen } from '@/components/session-room/LayerScreen';
import { NarrativeMapView } from '@/components/session-room/NarrativeMapView';
import { SessionScriptView } from '@/components/session-room/SessionScriptView';
import { PostSessionView } from '@/components/session-room/PostSessionView';
import { SessionData, SessionScript, LAYERS } from '@/components/session-room/types';

type SessionPhase = 'layers' | 'map' | 'script' | 'closing';

export default function SalaDeSessao() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [phase, setPhase] = useState<SessionPhase>('layers');
  const [currentLayer, setCurrentLayer] = useState(0);
  const [sessionData, setSessionData] = useState<Partial<SessionData>>({
    emotionIntensity: 5,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateSessionData = useCallback((updates: Partial<SessionData>) => {
    setSessionData(prev => ({ ...prev, ...updates }));
  }, []);

  const updateSessionScript = useCallback((script: SessionScript) => {
    setSessionData(prev => ({ ...prev, sessionScript: script }));
  }, []);

  const canProceedLayer = useCallback(() => {
    const layer = LAYERS[currentLayer];
    switch (layer.id) {
      case 'fact':
        return (sessionData.fact?.trim().length || 0) > 10;
      case 'emotion':
        return !!sessionData.emotion?.trim();
      case 'image':
        return !!sessionData.image?.trim();
      case 'archetype':
        return !!sessionData.primaryArchetype?.trim();
      case 'shadow':
        return !!sessionData.learnedProhibition?.trim();
      case 'repetition':
        return !!sessionData.repetitionPattern?.trim();
      case 'invitation':
        return !!sessionData.soulInvitation?.trim() && !!sessionData.smallGesture?.trim();
      default:
        return true;
    }
  }, [currentLayer, sessionData]);

  const handleNextLayer = () => {
    if (currentLayer < LAYERS.length - 1) {
      setCurrentLayer(prev => prev + 1);
    } else {
      setPhase('map');
    }
  };

  const handlePreviousLayer = () => {
    if (currentLayer > 0) {
      setCurrentLayer(prev => prev - 1);
    }
  };

  const handleSaveSession = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      // Get the ferramenta ID for session-room
      const { data: ferramenta } = await supabase
        .from('sala_ferramentas')
        .select('id')
        .eq('ferramenta_chave', 'sala-de-sessao')
        .single();

      if (!ferramenta) {
        // Create temporary ferramenta entry or use generic storage
        const dadosSessao = {
          version: '1.0',
          type: 'session-room',
          ...sessionData,
          completedAt: new Date().toISOString(),
        };

        // Store in a more generic way if ferramenta doesn't exist
        const { error } = await supabase
          .from('ferramenta_registros')
          .insert({
            user_id: user.id,
            ferramenta_id: '00000000-0000-0000-0000-000000000000', // Placeholder
            dados: dadosSessao as any,
            notas: `Sessão: ${sessionData.fact?.substring(0, 50)}...`,
          });

        if (error) throw error;
      } else {
        const dadosSessao = {
          version: '1.0',
          type: 'session-room',
          ...sessionData,
          completedAt: new Date().toISOString(),
        };

        const { error } = await supabase
          .from('ferramenta_registros')
          .insert({
            user_id: user.id,
            ferramenta_id: ferramenta.id,
            dados: dadosSessao as any,
            notas: `Sessão: ${sessionData.fact?.substring(0, 50)}...`,
          });

        if (error) throw error;
      }

      setSaved(true);
      toast.success('Sessão salva com sucesso');
      
      setTimeout(() => {
        navigate('/ferramentas');
      }, 1500);
    } catch (error) {
      console.error('Error saving session:', error);
      toast.error('Erro ao salvar sessão');
    } finally {
      setSaving(false);
    }
  };

  const renderPhase = () => {
    switch (phase) {
      case 'layers':
        return (
          <LayerScreen
            layerIndex={currentLayer}
            sessionData={sessionData}
            onUpdateData={updateSessionData}
            onNext={handleNextLayer}
            onPrevious={handlePreviousLayer}
            canProceed={canProceedLayer()}
          />
        );
      case 'map':
        return (
          <NarrativeMapView
            sessionData={sessionData}
            onContinue={() => setPhase('script')}
          />
        );
      case 'script':
        return (
          <SessionScriptView
            sessionData={sessionData}
            onUpdateScript={updateSessionScript}
            onContinue={() => setPhase('closing')}
          />
        );
      case 'closing':
        return (
          <PostSessionView
            sessionData={sessionData}
            onUpdateData={updateSessionData}
            onSave={handleSaveSession}
            onBack={() => setPhase('script')}
            saving={saving}
            saved={saved}
          />
        );
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container max-w-2xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/ferramentas')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Ferramentas
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Layers className="h-4 w-4" />
                <span className="hidden sm:inline">Sala de Sessão</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container max-w-2xl mx-auto px-4 py-8">
          {/* Phase Indicator */}
          <div className="flex justify-center gap-2 mb-8">
            {(['layers', 'map', 'script', 'closing'] as SessionPhase[]).map((p, i) => (
              <div
                key={p}
                className={`h-1 rounded-full transition-all ${
                  p === phase
                    ? 'w-8 bg-primary'
                    : i < ['layers', 'map', 'script', 'closing'].indexOf(phase)
                    ? 'w-4 bg-primary/50'
                    : 'w-4 bg-muted'
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={phase + currentLayer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderPhase()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}
