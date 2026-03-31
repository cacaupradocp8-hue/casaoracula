import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { useCidadelaMap } from '@/hooks/useCidadelaMap';
import { useClientProfile } from '@/hooks/useClientProfile';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save, Leaf, Compass, Feather, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { ClienteProfileHeader } from './ClienteProfileHeader';
import { PerfilSimbolicoCliente } from './PerfilSimbolicoCliente';
import { LeituraClienteAgora } from './LeituraClienteAgora';
import { MapaConducaoDistritos } from './MapaConducaoDistritos';
import { ConducaoSessaoPanel } from './ConducaoSessaoPanel';
import { EnviarOrientacaoDialog } from '../EnviarOrientacaoDialog';
import { useOrientacoesTerapeuta } from '@/hooks/useOrientacoes';

interface Props {
  clienteId: string;
  clienteNome: string;
  open: boolean;
  onClose: () => void;
}

interface SessionInsight {
  text: string;
  timestamp: string;
}

type Phase = 'mode' | 'conducao';

export function PainelConducaoSessao({ clienteId, clienteNome, open, onClose }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { updateFromSession } = useCidadelaMap();
  const orientacoes = useOrientacoesTerapeuta(clienteId);

  const [phase, setPhase] = useState<Phase>('mode');
  const [sessionMode, setSessionMode] = useState<'oracula' | 'livre' | null>(null);
  const [saving, setSaving] = useState(false);
  const [orientacaoOpen, setOrientacaoOpen] = useState(false);

  // Leitura editável
  const [distritoEmergente, setDistritoEmergente] = useState('');
  const [sensacaoCentral, setSensacaoCentral] = useState('');
  const [posturaSugerida, setPosturaSugerida] = useState('');

  // Condução
  const [usedTools, setUsedTools] = useState<{ id: string; nome: string }[]>([]);
  const [insights, setInsights] = useState<SessionInsight[]>([]);
  const [sessionNotes, setSessionNotes] = useState('');
  const [hipoteseSimbolica, setHipoteseSimbolica] = useState('');
  const [proximoPasso, setProximoPasso] = useState('');

  // Distrito estrutural (from DB)
  const { data: cityState } = useQuery({
    queryKey: ['client-city-state', clienteId],
    queryFn: async () => {
      const { data } = await supabase
        .from('client_city_state')
        .select('distrito_ativo')
        .eq('client_id', clienteId)
        .maybeSingle();
      return data;
    },
    enabled: open,
  });

  const handleSelectMode = (mode: 'oracula' | 'livre') => {
    setSessionMode(mode);
    setPhase('conducao');
  };

  const handleSelectTool = (tool: { id: string; nome: string; rota: string | null }) => {
    setUsedTools(prev => {
      if (prev.find(t => t.id === tool.id)) return prev;
      return [...prev, { id: tool.id, nome: tool.nome }];
    });
    if (tool.rota) {
      navigate(tool.rota);
    }
  };

  const handleAddInsight = (text: string) => {
    setInsights(prev => [...prev, { text, timestamp: new Date().toISOString() }]);
  };

  const handleRemoveInsight = (index: number) => {
    setInsights(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('sessions').insert({
        client_id: clienteId,
        user_id: user.id,
        date: new Date().toISOString().split('T')[0],
        insight: hipoteseSimbolica || insights.map(i => i.text).join(' | ') || null,
        task: proximoPasso || null,
        notes: sessionNotes || null,
        checkin_notes: sensacaoCentral || null,
        voz_utilizada: sessionMode || null,
      } as any);

      if (error) throw error;

      // Update CidaDELA map
      await updateFromSession(clienteId, {
        distrito: distritoEmergente || undefined,
        ferramenta: usedTools.map(t => t.nome).join(', ') || undefined,
        insight: hipoteseSimbolica || insights.map(i => i.text).join(' | ') || undefined,
      });

      // Sync dynamic profile layer
      await updateDinamicoFromSession({
        distrito_atual: distritoEmergente || undefined,
        sensacao_central: sensacaoCentral || undefined,
        movimento_atual: posturaSugerida || undefined,
      });

      toast.success('Sessão salva com sucesso');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao salvar sessão');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={onClose} className="gap-1 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Button>
          {sessionMode && (
            <Badge variant="outline" className="text-[10px] gap-1">
              {sessionMode === 'oracula' ? (
                <><Compass className="w-3 h-3" /> Modo Orácula</>
              ) : (
                <><Feather className="w-3 h-3" /> Modo Livre</>
              )}
            </Badge>
          )}
        </div>

        <AnimatePresence mode="wait">
          {/* ===== MODE SELECTION ===== */}
          {phase === 'mode' && (
            <motion.div
              key="mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="font-display text-lg font-semibold text-foreground">Iniciar Sessão</h2>
                <p className="text-sm text-muted-foreground">{clienteNome} — Como deseja conduzir?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleSelectMode('oracula')}
                  className="p-5 rounded-xl border-2 border-border/30 hover:border-primary hover:bg-primary/5 text-left transition-all"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                      <Compass className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground text-sm">Modo Orácula</h3>
                      <Badge variant="secondary" className="text-[9px]">Guiado</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Sugestões de distritos e ferramentas, fluxo contínuo e atualização do mapa.
                  </p>
                </button>
                <button
                  onClick={() => handleSelectMode('livre')}
                  className="p-5 rounded-xl border-2 border-border/30 hover:border-accent hover:bg-accent/5 text-left transition-all"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
                      <Feather className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground text-sm">Modo Livre</h3>
                      <Badge variant="outline" className="text-[9px]">Não guiado</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Acesso livre às ferramentas, registro manual e total autonomia.
                  </p>
                </button>
              </div>
            </motion.div>
          )}

          {/* ===== PAINEL DE CONDUÇÃO ===== */}
          {phase === 'conducao' && (
            <motion.div
              key="conducao"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* BLOCO 1 — Perfil da cliente */}
              <ClienteProfileHeader clienteId={clienteId} clienteNome={clienteNome} />

              {/* Perfil Simbólico em 3 Camadas */}
              <PerfilSimbolicoCliente
                clienteId={clienteId}
                compact
                onDinamicoChange={(d) => {
                  if (d.distrito_atual) setDistritoEmergente(d.distrito_atual);
                  if (d.sensacao_central) setSensacaoCentral(d.sensacao_central);
                }}
              />

              {/* BLOCO 5 — Leitura da cliente agora (editável) */}
              <LeituraClienteAgora
                distritoEstrutural={cityState?.distrito_ativo || null}
                distritoEmergente={distritoEmergente}
                onDistritoEmergenteChange={setDistritoEmergente}
                sensacaoCentral={sensacaoCentral}
                onSensacaoCentralChange={setSensacaoCentral}
                posturaSugerida={posturaSugerida}
                onPosturaSugeridaChange={setPosturaSugerida}
              />

              <Separator className="border-border/15" />

              {/* BLOCO 2 + 3 — Mapa de condução com ferramentas por distrito */}
              <MapaConducaoDistritos
                distritoEmergente={distritoEmergente}
                onSelectDistritoEmergente={setDistritoEmergente}
                onSelectTool={handleSelectTool}
              />

              <Separator className="border-border/15" />

              {/* BLOCO 4 — Condução da sessão */}
              <ConducaoSessaoPanel
                usedTools={usedTools}
                insights={insights}
                onAddInsight={handleAddInsight}
                onRemoveInsight={handleRemoveInsight}
                sessionNotes={sessionNotes}
                onSessionNotesChange={setSessionNotes}
                hipoteseSimbolica={hipoteseSimbolica}
                onHipoteseSimbolica={setHipoteseSimbolica}
                proximoPasso={proximoPasso}
                onProximoPassoChange={setProximoPasso}
              />

              {/* Jardim da Heroína */}
              <div className="p-3 rounded-lg bg-emerald-950/15 border border-emerald-500/15 space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-emerald-500/50 font-medium">
                  🌿 Jardim da Heroína
                </p>
                <p className="text-xs text-muted-foreground">
                  Envie uma orientação para a cliente continuar no Jardim entre sessões.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 gap-1.5"
                  onClick={() => setOrientacaoOpen(true)}
                >
                  <Leaf className="w-3 h-3" />
                  Enviar Orientação ao Jardim
                </Button>
              </div>

              {/* Ações finais */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 border-border/30 text-muted-foreground"
                  onClick={() => setPhase('mode')}
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Salvar Sessão
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Orientação Dialog */}
      <EnviarOrientacaoDialog
        open={orientacaoOpen}
        onOpenChange={setOrientacaoOpen}
        onSubmit={async (data) => orientacoes.criar(data)}
        saving={orientacoes.saving}
      />
    </div>
  );
}
