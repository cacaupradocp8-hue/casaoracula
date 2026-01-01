import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DoorOpen, Lock, Unlock, Loader2 } from 'lucide-react';
import { icons } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

type NivelSala = 'NIVEL_0' | 'NIVEL_1' | 'NIVEL_2' | 'NIVEL_3';

interface Sala {
  id: string;
  nivel_minimo: NivelSala;
  nome_exibicao: string;
  texto_entrada: string;
  texto_bloqueio: string;
  ativa: boolean;
  ordem: number;
}

interface Ferramenta {
  id: string;
  sala_id: string;
  ferramenta_chave: string;
  ferramenta_nome: string;
  ferramenta_descricao: string;
  icone: string;
  rota: string;
  ordem: number;
  ativa: boolean;
}

const NIVEL_HIERARCHY: Record<NivelSala, number> = {
  NIVEL_0: 0,
  NIVEL_1: 1,
  NIVEL_2: 2,
  NIVEL_3: 3,
};

const PORTAL_TO_NIVEL: Record<string, NivelSala> = {
  visitante: 'NIVEL_0',
  pre_iniciada: 'NIVEL_1',
  iniciada: 'NIVEL_2',
  admin: 'NIVEL_3',
};

// Dynamic icon component
function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const iconName = name.charAt(0).toUpperCase() + name.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  const LucideIcon = icons[iconName as keyof typeof icons];
  
  if (!LucideIcon) {
    return <DoorOpen className={className} />;
  }
  
  return <LucideIcon className={className} />;
}

export default function Salas() {
  const { user } = useAuth();
  const [salas, setSalas] = useState<Sala[]>([]);
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSala, setSelectedSala] = useState<Sala | null>(null);
  const [showBlockedDialog, setShowBlockedDialog] = useState(false);

  const userNivel = user?.portal ? PORTAL_TO_NIVEL[user.portal] : 'NIVEL_0';
  const userNivelNum = NIVEL_HIERARCHY[userNivel];

  const canAccessSala = (sala: Sala): boolean => {
    const salaMinNivel = NIVEL_HIERARCHY[sala.nivel_minimo];
    return userNivelNum >= salaMinNivel;
  };

  useEffect(() => {
    const fetchData = async () => {
      const [salasRes, ferramentasRes] = await Promise.all([
        supabase.from('salas').select('*').eq('ativa', true).order('ordem'),
        supabase.from('sala_ferramentas').select('*').eq('ativa', true).order('ordem'),
      ]);

      if (salasRes.error) {
        toast.error('Erro ao carregar salas');
        console.error(salasRes.error);
      } else {
        setSalas(salasRes.data as Sala[]);
      }

      if (ferramentasRes.error) {
        console.error(ferramentasRes.error);
      } else {
        setFerramentas(ferramentasRes.data as Ferramenta[]);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSalaClick = (sala: Sala) => {
    if (canAccessSala(sala)) {
      setSelectedSala(sala);
    } else {
      setSelectedSala(sala);
      setShowBlockedDialog(true);
    }
  };

  // Get ferramentas for accessible salas
  const accessibleSalaIds = salas.filter(canAccessSala).map((s) => s.id);
  const availableFerramentas = ferramentas.filter((f) => accessibleSalaIds.includes(f.sala_id));

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <SectionHeader
          title="Salas da Casa ORÁCULA"
          subtitle="Explore as salas de acordo com seu nível na jornada"
          icon={<DoorOpen className="w-5 h-5" />}
          className="mb-8"
        />

        {/* Salas por nível */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {salas.map((sala) => {
            const isAccessible = canAccessSala(sala);
            return (
              <Card
                key={sala.id}
                className={`glass transition-all cursor-pointer ${
                  isAccessible
                    ? 'hover:border-gold/50 hover:shadow-gold/10 hover:shadow-lg'
                    : 'opacity-60 hover:opacity-80'
                }`}
                onClick={() => handleSalaClick(sala)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isAccessible
                          ? 'bg-gold/20 text-gold'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {isAccessible ? (
                        <Unlock className="w-6 h-6" />
                      ) : (
                        <Lock className="w-6 h-6" />
                      )}
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        isAccessible
                          ? 'bg-gold/20 text-gold'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {sala.nivel_minimo.replace('NIVEL_', 'Nível ')}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{sala.nome_exibicao}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {isAccessible ? sala.texto_entrada : 'Sala bloqueada'}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Ferramentas disponíveis baseadas nas salas acessíveis */}
        {availableFerramentas.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <DoorOpen className="w-5 h-5 text-gold" />
              Ferramentas Disponíveis
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {availableFerramentas.map((tool) => (
                <Card
                  key={tool.id}
                  className="glass hover:border-gold/50 transition-all bg-gradient-to-br from-gold/10 to-background"
                >
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl bg-gold/20 flex items-center justify-center mb-3">
                      <DynamicIcon name={tool.icone} className="w-7 h-7 text-gold" />
                    </div>
                    <CardTitle className="text-xl">{tool.ferramenta_nome}</CardTitle>
                    <CardDescription className="text-sm">{tool.ferramenta_descricao}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={tool.rota}>
                      <Button variant="gold" className="w-full">
                        Acessar Ferramenta
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {availableFerramentas.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <DoorOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma ferramenta disponível no momento.</p>
          </div>
        )}

        {/* Dialog para sala bloqueada */}
        <Dialog open={showBlockedDialog} onOpenChange={setShowBlockedDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-muted-foreground" />
                Sala Bloqueada
              </DialogTitle>
              <DialogDescription className="pt-4">
                {selectedSala?.texto_bloqueio}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={() => setShowBlockedDialog(false)}>
                Entendi
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog para sala desbloqueada */}
        <Dialog
          open={selectedSala !== null && !showBlockedDialog && canAccessSala(selectedSala!)}
          onOpenChange={(open) => !open && setSelectedSala(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Unlock className="w-5 h-5 text-gold" />
                {selectedSala?.nome_exibicao}
              </DialogTitle>
              <DialogDescription className="pt-4">
                {selectedSala?.texto_entrada}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end pt-4">
              <Button variant="gold" onClick={() => setSelectedSala(null)}>
                Explorar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
