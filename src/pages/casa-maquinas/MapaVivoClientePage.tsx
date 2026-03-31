import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Map,
  Loader2,
  Home,
  ChevronRight,
  Cog,
  Save,
  Calendar,
  Brain,
  User,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FASES_JORNADA } from '@/types/mapa-vivo';
import { MapaVivoPanel } from '@/components/casa-maquinas/MapaVivoPanel';
import { MapaVivoCidadela } from '@/components/casa-maquinas/MapaVivoCidadela';
...
export default function MapaVivoClientePage() {
  const { clienteId } = useParams<{ clienteId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [clienteNome, setClienteNome] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
...
        <SectionHeader
          title={`Mapa Vivo — ${clienteNome}`}
          subtitle="Acompanhe a jornada simbólica da sua cliente"
          icon={<Map className="w-5 h-5" />}
          action={
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                onClick={() => clienteId && navigate(`/casa-das-maquinas/clientes/${clienteId}`)}
                className="gap-2"
              >
                <User className="w-4 h-4" />
                Abrir Perfil
              </Button>
              <Button variant="gold" onClick={handleSave} disabled={saving} className="gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Salvar
              </Button>
            </div>
          }
          className="mb-8"
        />

        <Tabs defaultValue="cidadela" className="w-full">
          <TabsList className="bg-[#0B1B2B]/80 border border-[#C9A24A]/10 mb-4">
            <TabsTrigger value="cidadela" className="data-[state=active]:bg-[#C9A24A]/15 data-[state=active]:text-[#C9A24A] text-[#F5F1E8]/60 text-xs">
              <Map className="w-3 h-3 mr-1" />
              Mapa da CidaDELA
            </TabsTrigger>
            <TabsTrigger value="inteligencia" className="data-[state=active]:bg-[#C9A24A]/15 data-[state=active]:text-[#C9A24A] text-[#F5F1E8]/60 text-xs">
              <Brain className="w-3 h-3 mr-1" />
              Inteligência Simbólica
            </TabsTrigger>
            <TabsTrigger value="manual" className="data-[state=active]:bg-[#C9A24A]/15 data-[state=active]:text-[#C9A24A] text-[#F5F1E8]/60 text-xs">
              <Map className="w-3 h-3 mr-1" />
              Mapa Manual
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cidadela">
            {clienteId && <MapaVivoCidadela clienteId={clienteId} />}
          </TabsContent>

          <TabsContent value="inteligencia">
            {clienteId && <MapaVivoPanel clientId={clienteId} />}
          </TabsContent>

          <TabsContent value="manual">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Mapa Vivo Form */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Fase da Jornada</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Fase Atual</Label>
                      <Select value={faseAtual} onValueChange={setFaseAtual}>
                        <SelectTrigger><SelectValue placeholder="Selecione a fase" /></SelectTrigger>
                        <SelectContent>
                          {FASES_JORNADA.map(f => (
                            <SelectItem key={f.value} value={f.value}>
                              {f.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Indicador da Fase (máx. 300)</Label>
                      <Textarea
                        value={indicadorFase}
                        onChange={(e) => setIndicadorFase(e.target.value.slice(0, 300))}
                        placeholder="Descreva o indicador desta fase..."
                        maxLength={300}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Arquétipos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Arquétipo Ativo</Label>
                      <Textarea value={arquetipoAtivo} onChange={(e) => setArquetipoAtivo(e.target.value)} placeholder="Arquétipo predominante..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Arquétipo Sombra</Label>
                      <Textarea value={arquetipoSombra} onChange={(e) => setArquetipoSombra(e.target.value)} placeholder="Aspecto sombrio ativo..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Arquétipo Emergente</Label>
                      <Textarea value={arquetipoEmergente} onChange={(e) => setArquetipoEmergente(e.target.value)} placeholder="Novo arquétipo emergindo..." />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Narrativa Pessoal</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Narrativa Recorrente (máx. 400)</Label>
                      <Textarea
                        value={narrativaRecorrente}
                        onChange={(e) => setNarrativaRecorrente(e.target.value.slice(0, 400))}
                        placeholder="Padrão narrativo que se repete..."
                        maxLength={400}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Imagem Simbólica (máx. 400)</Label>
                      <Textarea
                        value={imagemSimbolica}
                        onChange={(e) => setImagemSimbolica(e.target.value.slice(0, 400))}
                        placeholder="Imagem ou metáfora central..."
                        maxLength={400}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Papel na Narrativa (máx. 400)</Label>
                      <Textarea
                        value={papelNarrativa}
                        onChange={(e) => setPapelNarrativa(e.target.value.slice(0, 400))}
                        placeholder="Papel que a cliente assume na narrativa..."
                        maxLength={400}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Timeline de Sessões */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Linha do Tempo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {sessoes.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhuma sessão registrada para esta cliente.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {sessoes.map((s, i) => (
                          <div key={s.id} className="relative pl-6 pb-3 border-l border-border last:border-l-0">
                            <div className="absolute left-0 top-0 w-3 h-3 rounded-full bg-gold -translate-x-[7px]" />
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(s.data_sessao), "dd/MM/yyyy", { locale: ptBR })}
                            </p>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {MOVIMENTOS_LABEL[s.movimento_percebido] || s.movimento_percebido}
                            </Badge>
                            {s.nota_breve && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.nota_breve}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
