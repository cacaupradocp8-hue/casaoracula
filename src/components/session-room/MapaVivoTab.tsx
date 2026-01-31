import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, History, ChevronDown, ChevronUp, Sparkles, Eye, Shield, Flame, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useMapaVivo } from '@/hooks/useMapaVivo';
import type { MapaVivoHeroina, FaseJornada, RitualTipo, MovimentoHeroina } from '@/types/mapa-vivo';
import { FASES_JORNADA, TIPOS_RITUAL, MOVIMENTOS } from '@/types/mapa-vivo';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MapaVivoTabProps {
  caseId: string;
  clientId: string;
  clientName?: string;
}

export function MapaVivoTab({ caseId, clientId, clientName }: MapaVivoTabProps) {
  const { loading, fetchMapa, saveMapa, registrarMudancaFase, fetchHistorico } = useMapaVivo();
  const [mapa, setMapa] = useState<MapaVivoHeroina | null>(null);
  const [historico, setHistorico] = useState<any[]>([]);
  const [showHistorico, setShowHistorico] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Form state
  const [form, setForm] = useState({
    fase_jornada: '' as FaseJornada | '',
    fase_descricao: '',
    arquetipo_predominante: '',
    arquetipo_tensao: '',
    arquetipo_emergente: '',
    dinamica_arquetipal: '',
    simbolo_recorrente: '',
    mito_pessoal: '',
    metafora_central: '',
    ritual_tipo: '' as RitualTipo | '',
    ritual_descricao: '',
    ritual_realizado: false,
    ritual_observacoes: '',
    movimento_heroina: '' as MovimentoHeroina | '',
    movimento_descricao: '',
    espelho_toca_minha: '',
    espelho_risco_projecao: '',
    espelho_supervisao: '',
  });

  useEffect(() => {
    loadMapa();
  }, [caseId]);

  const loadMapa = async () => {
    const data = await fetchMapa(caseId);
    if (data) {
      setMapa(data);
      setForm({
        fase_jornada: data.fase_jornada || '',
        fase_descricao: data.fase_descricao || '',
        arquetipo_predominante: data.arquetipo_predominante || '',
        arquetipo_tensao: data.arquetipo_tensao || '',
        arquetipo_emergente: data.arquetipo_emergente || '',
        dinamica_arquetipal: data.dinamica_arquetipal || '',
        simbolo_recorrente: data.simbolo_recorrente || '',
        mito_pessoal: data.mito_pessoal || '',
        metafora_central: data.metafora_central || '',
        ritual_tipo: data.ritual_tipo || '',
        ritual_descricao: data.ritual_descricao || '',
        ritual_realizado: data.ritual_realizado || false,
        ritual_observacoes: data.ritual_observacoes || '',
        movimento_heroina: data.movimento_heroina || '',
        movimento_descricao: data.movimento_descricao || '',
        espelho_toca_minha: data.espelho_toca_minha || '',
        espelho_risco_projecao: data.espelho_risco_projecao || '',
        espelho_supervisao: data.espelho_supervisao || '',
      });
      
      const hist = await fetchHistorico(data.id);
      setHistorico(hist);
    }
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    const faseAnterior = mapa?.fase_jornada;
    const faseNova = form.fase_jornada as FaseJornada;
    
    const result = await saveMapa(caseId, clientId, {
      ...form,
      fase_jornada: form.fase_jornada || null,
      ritual_tipo: form.ritual_tipo || null,
      movimento_heroina: form.movimento_heroina || null,
    } as Partial<MapaVivoHeroina>, mapa?.id);

    if (result) {
      setMapa(result);
      setHasChanges(false);

      // Register phase change if it changed
      if (faseNova && faseAnterior !== faseNova) {
        await registrarMudancaFase(
          result.id,
          caseId,
          faseAnterior || null,
          faseNova,
          form.movimento_heroina || null,
          form.movimento_descricao || undefined
        );
        const hist = await fetchHistorico(result.id);
        setHistorico(hist);
      }
    }
  };

  const currentFase = FASES_JORNADA.find(f => f.value === form.fase_jornada);

  return (
    <div className="space-y-6">
      {/* Header with Journey Visualization */}
      <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="w-5 h-5 text-gold" />
                Mapa Vivo da Heroína
              </CardTitle>
              <CardDescription>
                Acompanhamento simbólico longitudinal de {clientName || 'cliente'}
              </CardDescription>
            </div>
            <Button onClick={handleSave} disabled={loading || !hasChanges} className="gap-2">
              <Save className="w-4 h-4" />
              Salvar Mapa
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Journey Phase Visualization */}
          <div className="flex items-center gap-1 overflow-x-auto pb-4">
            {FASES_JORNADA.map((fase, idx) => (
              <motion.button
                key={fase.value}
                onClick={() => handleChange('fase_jornada', fase.value)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  form.fase_jornada === fase.value
                    ? `${fase.cor} text-white shadow-lg scale-105`
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {fase.label}
              </motion.button>
            ))}
          </div>
          
          {currentFase && (
            <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground">{currentFase.descricao}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content - Accordion Layers */}
      <Accordion type="multiple" defaultValue={['localizacao', 'arquetipos']} className="space-y-4">
        {/* Camada 1: Localização */}
        <AccordionItem value="localizacao" className="border rounded-lg bg-card">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-500/20 flex items-center justify-center">
                <span className="text-sm font-bold text-slate-500">1</span>
              </div>
              <div className="text-left">
                <p className="font-medium">Localização na Jornada</p>
                <p className="text-xs text-muted-foreground">Onde a heroína se encontra</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              <div>
                <Label>Descrição do momento atual</Label>
                <Textarea
                  value={form.fase_descricao}
                  onChange={(e) => handleChange('fase_descricao', e.target.value)}
                  placeholder="Descreva como a cliente está vivenciando esta fase..."
                  className="mt-2 min-h-24"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Camada 2: Arquétipos */}
        <AccordionItem value="arquetipos" className="border rounded-lg bg-card">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                <span className="text-sm font-bold text-purple-500">2</span>
              </div>
              <div className="text-left">
                <p className="font-medium">Arquétipos Ativos</p>
                <p className="text-xs text-muted-foreground">Forças simbólicas em movimento</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Arquétipo Predominante</Label>
                <Textarea
                  value={form.arquetipo_predominante}
                  onChange={(e) => handleChange('arquetipo_predominante', e.target.value)}
                  placeholder="Qual arquétipo está mais ativo?"
                  className="mt-2 min-h-20"
                />
              </div>
              <div>
                <Label>Arquétipo em Tensão</Label>
                <Textarea
                  value={form.arquetipo_tensao}
                  onChange={(e) => handleChange('arquetipo_tensao', e.target.value)}
                  placeholder="Qual está em conflito?"
                  className="mt-2 min-h-20"
                />
              </div>
              <div>
                <Label>Arquétipo Emergente</Label>
                <Textarea
                  value={form.arquetipo_emergente}
                  onChange={(e) => handleChange('arquetipo_emergente', e.target.value)}
                  placeholder="Qual está pedindo passagem?"
                  className="mt-2 min-h-20"
                />
              </div>
            </div>
            <div className="mt-4">
              <Label>Dinâmica Arquetipal</Label>
              <Textarea
                value={form.dinamica_arquetipal}
                onChange={(e) => handleChange('dinamica_arquetipal', e.target.value)}
                placeholder="Como esses arquétipos interagem entre si?"
                className="mt-2 min-h-24"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Camada 3: Narrativa Pessoal */}
        <AccordionItem value="narrativa" className="border rounded-lg bg-card">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <span className="text-sm font-bold text-indigo-500">3</span>
              </div>
              <div className="text-left">
                <p className="font-medium">Narrativa Pessoal</p>
                <p className="text-xs text-muted-foreground">Símbolos, mitos e metáforas</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Símbolo Recorrente</Label>
                <Textarea
                  value={form.simbolo_recorrente}
                  onChange={(e) => handleChange('simbolo_recorrente', e.target.value)}
                  placeholder="Qual imagem ou símbolo aparece repetidamente?"
                  className="mt-2 min-h-20"
                />
              </div>
              <div>
                <Label>Mito Pessoal</Label>
                <Textarea
                  value={form.mito_pessoal}
                  onChange={(e) => handleChange('mito_pessoal', e.target.value)}
                  placeholder="Qual narrativa ela conta sobre si?"
                  className="mt-2 min-h-20"
                />
              </div>
              <div>
                <Label>Metáfora Central</Label>
                <Textarea
                  value={form.metafora_central}
                  onChange={(e) => handleChange('metafora_central', e.target.value)}
                  placeholder="Qual metáfora guia o processo?"
                  className="mt-2 min-h-20"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Camada 4: Ritual */}
        <AccordionItem value="ritual" className="border rounded-lg bg-card">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Flame className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-left">
                <p className="font-medium">Ritual Sugerido</p>
                <p className="text-xs text-muted-foreground">Prescrição simbólica</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              <div>
                <Label>Tipo de Ritual</Label>
                <Select value={form.ritual_tipo} onValueChange={(v) => handleChange('ritual_tipo', v)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Selecione o tipo de ritual" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_RITUAL.map(tipo => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        <div>
                          <p>{tipo.label}</p>
                          <p className="text-xs text-muted-foreground">{tipo.descricao}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Descrição do Ritual</Label>
                <Textarea
                  value={form.ritual_descricao}
                  onChange={(e) => handleChange('ritual_descricao', e.target.value)}
                  placeholder="Descreva o ritual sugerido..."
                  className="mt-2 min-h-24"
                />
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="ritual_realizado"
                  checked={form.ritual_realizado}
                  onCheckedChange={(v) => handleChange('ritual_realizado', v)}
                />
                <Label htmlFor="ritual_realizado" className="cursor-pointer">
                  Ritual realizado pela cliente
                </Label>
              </div>
              {form.ritual_realizado && (
                <div>
                  <Label>Observações sobre o ritual</Label>
                  <Textarea
                    value={form.ritual_observacoes}
                    onChange={(e) => handleChange('ritual_observacoes', e.target.value)}
                    placeholder="Como foi a experiência do ritual?"
                    className="mt-2 min-h-20"
                  />
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Camada 5: Movimento */}
        <AccordionItem value="movimento" className="border rounded-lg bg-card">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="text-sm font-bold text-emerald-500">5</span>
              </div>
              <div className="text-left">
                <p className="font-medium">Movimento da Heroína</p>
                <p className="text-xs text-muted-foreground">Evolução do processo</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              <div className="flex gap-2">
                {MOVIMENTOS.map(mov => (
                  <Button
                    key={mov.value}
                    variant={form.movimento_heroina === mov.value ? 'default' : 'outline'}
                    onClick={() => handleChange('movimento_heroina', mov.value)}
                    className={form.movimento_heroina === mov.value ? mov.cor : ''}
                  >
                    {mov.label}
                  </Button>
                ))}
              </div>
              <div>
                <Label>Descrição do movimento</Label>
                <Textarea
                  value={form.movimento_descricao}
                  onChange={(e) => handleChange('movimento_descricao', e.target.value)}
                  placeholder="Descreva o que está acontecendo no processo..."
                  className="mt-2 min-h-24"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Camada 6: Espelho da Terapeuta */}
        <AccordionItem value="espelho" className="border rounded-lg bg-card border-rose-500/20">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                <Eye className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-left">
                <p className="font-medium">Espelho da Terapeuta</p>
                <p className="text-xs text-muted-foreground">Reflexão privada (não compartilhado)</p>
              </div>
              <Badge variant="outline" className="ml-2 text-rose-500 border-rose-500/50">
                <Shield className="w-3 h-3 mr-1" /> Privado
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              <div>
                <Label>O que isso toca em mim?</Label>
                <Textarea
                  value={form.espelho_toca_minha}
                  onChange={(e) => handleChange('espelho_toca_minha', e.target.value)}
                  placeholder="Que ressonâncias pessoais este caso desperta?"
                  className="mt-2 min-h-20"
                />
              </div>
              <div>
                <Label>Risco de projeção</Label>
                <Textarea
                  value={form.espelho_risco_projecao}
                  onChange={(e) => handleChange('espelho_risco_projecao', e.target.value)}
                  placeholder="Onde posso estar projetando meu próprio material?"
                  className="mt-2 min-h-20"
                />
              </div>
              <div>
                <Label>Levar para supervisão</Label>
                <Textarea
                  value={form.espelho_supervisao}
                  onChange={(e) => handleChange('espelho_supervisao', e.target.value)}
                  placeholder="O que preciso discutir em supervisão?"
                  className="mt-2 min-h-20"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* History Toggle */}
      {historico.length > 0 && (
        <Card>
          <CardHeader>
            <Button
              variant="ghost"
              onClick={() => setShowHistorico(!showHistorico)}
              className="w-full justify-between"
            >
              <div className="flex items-center gap-2">
                <History className="w-4 h-4" />
                <span>Histórico de Mudanças ({historico.length})</span>
              </div>
              {showHistorico ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CardHeader>
          {showHistorico && (
            <CardContent>
              <div className="space-y-3">
                {historico.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <Clock className="w-4 h-4 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm">
                        {item.fase_anterior && (
                          <Badge variant="outline" className="text-xs">{item.fase_anterior}</Badge>
                        )}
                        <span className="text-muted-foreground">→</span>
                        <Badge className="text-xs">{item.fase_nova}</Badge>
                        {item.movimento && (
                          <Badge variant="secondary" className="text-xs ml-2">{item.movimento}</Badge>
                        )}
                      </div>
                      {item.observacao && (
                        <p className="text-sm text-muted-foreground mt-1">{item.observacao}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(item.created_at), "d 'de' MMM, yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
