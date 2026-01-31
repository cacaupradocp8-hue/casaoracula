// ============================================
// JARDIM DA HEROÍNA - TAB COMPONENT
// ============================================
// Diário simbólico terapêutico integrado à Sala de Sessão

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Leaf,
  Plus,
  Moon,
  Sparkles,
  Heart,
  Eye,
  Quote,
  Calendar,
  Loader2,
  Trash2,
} from 'lucide-react';
import { useJardimHeroina } from '@/hooks/useJardimHeroina';
import { useMapaVivo } from '@/hooks/useMapaVivo';
import { useAuth } from '@/contexts/AuthContext';
import type { 
  TipoRegistroJardim, 
  NovoJardimRegistro 
} from '@/types/jardim-heroina';
import { TIPOS_REGISTRO_LABELS } from '@/types/jardim-heroina';
import type { MapaVivoHeroina } from '@/types/mapa-vivo';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface JardimHeroinaTabProps {
  sessionCaseId: string;
}

const EMPTY_FORM: Omit<NovoJardimRegistro, 'session_case_id' | 'therapist_id'> = {
  tipo_registro: 'sessao',
  aterramento_ficou_vivo: '',
  aterramento_imagem_central: '',
  aterramento_corpo_sentiu: '',
  ritual_vivendo: '',
  ritual_resistencia: '',
  ritual_movimento: '',
  sonhos_imagens: '',
  sinais_sincronicidades: '',
  memorias_emergentes: '',
  frase_semente: '',
  notas_privadas: '',
};

export function JardimHeroinaTab({ sessionCaseId }: JardimHeroinaTabProps) {
  const { user } = useAuth();
  const { registros, loading, saving, criarRegistro, excluirRegistro } = useJardimHeroina({
    sessionCaseId,
  });
  const { fetchMapa } = useMapaVivo();
  const [mapaVivo, setMapaVivo] = useState<MapaVivoHeroina | null>(null);
  
  const [activeTab, setActiveTab] = useState<'novo' | 'historico'>('novo');
  const [form, setForm] = useState(EMPTY_FORM);

  // Fetch mapa vivo on mount
  useEffect(() => {
    if (sessionCaseId) {
      fetchMapa(sessionCaseId).then(setMapaVivo);
    }
  }, [sessionCaseId, fetchMapa]);

  const handleChange = (field: keyof typeof EMPTY_FORM, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSalvar = async () => {
    if (!user) return;

    const novoRegistro: NovoJardimRegistro = {
      session_case_id: sessionCaseId,
      therapist_id: user.id,
      tipo_registro: form.tipo_registro as TipoRegistroJardim,
      // Snapshot do Mapa Vivo atual
      fase_jornada_snapshot: mapaVivo?.fase_jornada || undefined,
      arquetipo_snapshot: mapaVivo?.arquetipo_predominante || undefined,
      mapa_vivo_id: mapaVivo?.id,
      // Campos do formulário
      aterramento_ficou_vivo: form.aterramento_ficou_vivo || undefined,
      aterramento_imagem_central: form.aterramento_imagem_central || undefined,
      aterramento_corpo_sentiu: form.aterramento_corpo_sentiu || undefined,
      ritual_vivendo: form.ritual_vivendo || undefined,
      ritual_resistencia: form.ritual_resistencia || undefined,
      ritual_movimento: form.ritual_movimento || undefined,
      sonhos_imagens: form.sonhos_imagens || undefined,
      sinais_sincronicidades: form.sinais_sincronicidades || undefined,
      memorias_emergentes: form.memorias_emergentes || undefined,
      frase_semente: form.frase_semente || undefined,
      notas_privadas: form.notas_privadas || undefined,
    };

    const id = await criarRegistro(novoRegistro);
    if (id) {
      setForm(EMPTY_FORM);
      setActiveTab('historico');
    }
  };

  const handleExcluir = async (registroId: string) => {
    if (confirm('Deseja excluir este registro?')) {
      await excluirRegistro(registroId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-500" />
          <h2 className="text-lg font-semibold">Jardim da Heroína</h2>
        </div>
        {mapaVivo?.fase_jornada && (
          <Badge variant="outline" className="text-xs">
            Fase atual: {mapaVivo.fase_jornada.replace(/_/g, ' ')}
          </Badge>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'novo' | 'historico')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="novo" className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Registro
          </TabsTrigger>
          <TabsTrigger value="historico" className="gap-2">
            <Calendar className="w-4 h-4" />
            Histórico ({registros.length})
          </TabsTrigger>
        </TabsList>

        {/* Novo Registro */}
        <TabsContent value="novo" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Novo Registro</CardTitle>
                <Select
                  value={form.tipo_registro}
                  onValueChange={(v) => handleChange('tipo_registro', v)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sessao">Registro de Sessão</SelectItem>
                    <SelectItem value="entre_sessoes">Entre Sessões</SelectItem>
                    <SelectItem value="reflexao">Reflexão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CardDescription>
                Registre os movimentos simbólicos da jornada terapêutica.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <Accordion type="multiple" defaultValue={['aterramento', 'frase']} className="space-y-2">
                  {/* 1. Aterramento da Sessão */}
                  <AccordionItem value="aterramento" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span className="font-medium">Aterramento da Sessão</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">
                          O que ficou vivo? O que ressoou?
                        </Label>
                        <Textarea
                          placeholder="O que permaneceu vibrando após a sessão..."
                          value={form.aterramento_ficou_vivo}
                          onChange={(e) => handleChange('aterramento_ficou_vivo', e.target.value)}
                          className="min-h-[80px] resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">
                          Imagem central / Metáfora
                        </Label>
                        <Textarea
                          placeholder="Uma imagem, símbolo ou metáfora que surgiu..."
                          value={form.aterramento_imagem_central}
                          onChange={(e) => handleChange('aterramento_imagem_central', e.target.value)}
                          className="min-h-[60px] resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">
                          O que o corpo sentiu?
                        </Label>
                        <Textarea
                          placeholder="Sensações corporais, tensões, aberturas..."
                          value={form.aterramento_corpo_sentiu}
                          onChange={(e) => handleChange('aterramento_corpo_sentiu', e.target.value)}
                          className="min-h-[60px] resize-none"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* 2. Ritual em Vivência */}
                  <AccordionItem value="ritual" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="font-medium">Ritual em Vivência</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">
                          Que ritual está vivendo?
                        </Label>
                        <Textarea
                          placeholder="Ritual atual, prática simbólica..."
                          value={form.ritual_vivendo}
                          onChange={(e) => handleChange('ritual_vivendo', e.target.value)}
                          className="min-h-[60px] resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">
                          Resistências notadas
                        </Label>
                        <Textarea
                          placeholder="O que está difícil, onde há travamento..."
                          value={form.ritual_resistencia}
                          onChange={(e) => handleChange('ritual_resistencia', e.target.value)}
                          className="min-h-[60px] resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">
                          Movimentos percebidos
                        </Label>
                        <Textarea
                          placeholder="Pequenas mudanças, aberturas, insights..."
                          value={form.ritual_movimento}
                          onChange={(e) => handleChange('ritual_movimento', e.target.value)}
                          className="min-h-[60px] resize-none"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* 3. Sonhos, Imagens e Sinais */}
                  <AccordionItem value="sonhos" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-indigo-500" />
                        <span className="font-medium">Sonhos, Imagens e Sinais</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">
                          Sonhos e imagens oníricas
                        </Label>
                        <Textarea
                          placeholder="Sonhos relatados, imagens que surgiram..."
                          value={form.sonhos_imagens}
                          onChange={(e) => handleChange('sonhos_imagens', e.target.value)}
                          className="min-h-[80px] resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">
                          Sinais e sincronicidades
                        </Label>
                        <Textarea
                          placeholder="Coincidências significativas, sinais percebidos..."
                          value={form.sinais_sincronicidades}
                          onChange={(e) => handleChange('sinais_sincronicidades', e.target.value)}
                          className="min-h-[60px] resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">
                          Memórias emergentes
                        </Label>
                        <Textarea
                          placeholder="Memórias que surgiram, lembranças significativas..."
                          value={form.memorias_emergentes}
                          onChange={(e) => handleChange('memorias_emergentes', e.target.value)}
                          className="min-h-[60px] resize-none"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* 4. Frase-Semente */}
                  <AccordionItem value="frase" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Quote className="w-4 h-4 text-emerald-500" />
                        <span className="font-medium">Frase-Semente</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">
                          Uma frase para este momento da jornada
                        </Label>
                        <Textarea
                          placeholder="A frase central, o insight condensado..."
                          value={form.frase_semente}
                          onChange={(e) => handleChange('frase_semente', e.target.value)}
                          className="min-h-[60px] resize-none"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* 5. Notas Privadas */}
                  <AccordionItem value="notas" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Notas Privadas</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">
                          Anotações só para você (não compartilhadas)
                        </Label>
                        <Textarea
                          placeholder="Observações clínicas, intuições, alertas..."
                          value={form.notas_privadas}
                          onChange={(e) => handleChange('notas_privadas', e.target.value)}
                          className="min-h-[80px] resize-none"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </ScrollArea>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSalvar}
                  disabled={saving}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Leaf className="w-4 h-4" />
                  )}
                  Salvar no Jardim
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Histórico */}
        <TabsContent value="historico" className="mt-4">
          <ScrollArea className="h-[600px]">
            {registros.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Leaf className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">
                    Nenhum registro ainda. O jardim espera suas sementes.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {registros.map((registro) => (
                  <Card key={registro.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {TIPOS_REGISTRO_LABELS[registro.tipo_registro]}
                          </Badge>
                          {registro.fase_jornada_snapshot && (
                            <Badge variant="outline" className="text-xs">
                              {registro.fase_jornada_snapshot.replace(/_/g, ' ')}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(registro.data_registro), "d 'de' MMMM", { locale: ptBR })}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => handleExcluir(registro.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      {registro.frase_semente && (
                        <div className="bg-muted/30 rounded-lg p-3 italic text-center">
                          "{registro.frase_semente}"
                        </div>
                      )}

                      {registro.aterramento_ficou_vivo && (
                        <div>
                          <span className="text-muted-foreground text-xs">O que ficou vivo:</span>
                          <p className="mt-1">{registro.aterramento_ficou_vivo}</p>
                        </div>
                      )}

                      {registro.sonhos_imagens && (
                        <div>
                          <span className="text-muted-foreground text-xs">Sonhos/Imagens:</span>
                          <p className="mt-1">{registro.sonhos_imagens}</p>
                        </div>
                      )}

                      {(registro.aterramento_imagem_central || 
                        registro.aterramento_corpo_sentiu ||
                        registro.ritual_vivendo ||
                        registro.sinais_sincronicidades) && (
                        <Separator />
                      )}

                      {registro.notas_privadas && (
                        <div className="bg-muted/20 rounded-lg p-2 text-xs">
                          <Eye className="w-3 h-3 inline-block mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground">Notas: </span>
                          {registro.notas_privadas}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
