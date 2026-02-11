import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  User, Compass, BookOpen, FileText, 
  Save, Loader2, Moon, Sparkles, Feather, Flame,
  TrendingUp, AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import type { MapaHeroinaData } from "@/hooks/useMapaHeroina";

interface MapaProfissionalViewProps {
  mapa: MapaHeroinaData;
  onGeneratePDF: () => void;
}

interface ClinicalRecord {
  nomeCliente: string;
  portaAtivada: string;
  exercicioAplicado: string;
  ritualProposto: string;
  observacoesClinicas: string;
  evolucaoLongitudinal: string;
}

export function MapaProfissionalView({ mapa, onGeneratePDF }: MapaProfissionalViewProps) {
  const [record, setRecord] = useState<ClinicalRecord>({
    nomeCliente: "",
    portaAtivada: "",
    exercicioAplicado: "",
    ritualProposto: "",
    observacoesClinicas: "",
    evolucaoLongitudinal: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const updateField = (field: keyof ClinicalRecord, value: string) => {
    setRecord(prev => ({ ...prev, [field]: value }));
  };

  const formatData = (data: string | null | undefined) => {
    if (!data) return "—";
    try {
      return format(new Date(data), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return "—";
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulated save — future: persist to Supabase
    await new Promise(r => setTimeout(r, 800));
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Client Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-purple-500/20 bg-gradient-to-br from-purple-950/20 to-stone-900/50">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-purple-400">
              <User className="w-5 h-5" />
              <h3 className="font-display text-lg">Ficha da Cliente</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Nome da Cliente</label>
                <Input
                  value={record.nomeCliente}
                  onChange={(e) => updateField("nomeCliente", e.target.value)}
                  placeholder="Nome ou codinome simbólico"
                  className="bg-background/30 border-purple-500/20 focus:border-purple-500/40"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Porta Ativada</label>
                <Input
                  value={record.portaAtivada}
                  onChange={(e) => updateField("portaAtivada", e.target.value)}
                  placeholder="Ex: Porta 7 — A Máscara"
                  className="bg-background/30 border-purple-500/20 focus:border-purple-500/40"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Cards Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-gold/20 bg-gradient-to-br from-amber-950/10 to-stone-900/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-gold mb-4">
              <Compass className="w-5 h-5" />
              <h3 className="font-display text-lg">Cartas Ativadas na Sessão</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MiniCard
                icon={<Moon className="w-4 h-4" />}
                label="Fase"
                value={mapa.faseAtiva?.fase?.nome || "—"}
                emoji={mapa.faseAtiva?.fase?.icone || "🌙"}
                color="text-blue-300"
              />
              <MiniCard
                icon={<Sparkles className="w-4 h-4" />}
                label="Arquétipo"
                value={mapa.ultimoArquetipo?.arquetipo?.nome || "—"}
                emoji={mapa.ultimoArquetipo?.arquetipo?.icone || "✨"}
                color="text-purple-300"
              />
              <MiniCard
                icon={<Feather className="w-4 h-4" />}
                label="Metáfora"
                value={mapa.ultimoCenario?.metafora?.nome || "—"}
                emoji={mapa.ultimoCenario?.metafora?.icone || "🪶"}
                color="text-emerald-300"
              />
              <MiniCard
                icon={<Flame className="w-4 h-4" />}
                label="Ritual"
                value={mapa.ultimoRitual?.ritual?.nome || "—"}
                emoji={mapa.ultimoRitual?.ritual?.icone || "🔥"}
                color="text-amber-300"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Clinical Fields */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Card className="border-gold/20 bg-card/60">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gold" />
              <h4 className="text-sm font-medium text-gold">Exercício Aplicado</h4>
            </div>
            <Textarea
              value={record.exercicioAplicado}
              onChange={(e) => updateField("exercicioAplicado", e.target.value)}
              placeholder="Descreva o exercício utilizado com a cliente e o que emergiu..."
              className="min-h-[100px] bg-background/30 border-gold/20"
            />
          </CardContent>
        </Card>

        <Card className="border-gold/20 bg-card/60">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-medium text-amber-400">Ritual Proposto</h4>
            </div>
            <Textarea
              value={record.ritualProposto}
              onChange={(e) => updateField("ritualProposto", e.target.value)}
              placeholder="Ritual simbólico indicado para a cliente realizar entre sessões..."
              className="min-h-[100px] bg-background/30 border-gold/20"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Observações Clínicas */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-amber-500/20 bg-gradient-to-br from-amber-950/10 to-stone-900/30">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-medium text-amber-400">Observações Clínicas</h4>
            </div>
            <Textarea
              value={record.observacoesClinicas}
              onChange={(e) => updateField("observacoesClinicas", e.target.value)}
              placeholder="Padrões observados, hipóteses terapêuticas, pontos de atenção, transferências percebidas..."
              className="min-h-[120px] bg-background/30 border-amber-500/20"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Evolução Longitudinal */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-950/10 to-stone-900/30">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-medium text-emerald-400">Evolução Longitudinal</h4>
            </div>
            <p className="text-xs text-muted-foreground italic">
              Registre a evolução da cliente ao longo das sessões. Como os temas, portas e padrões se transformaram?
            </p>
            <Textarea
              value={record.evolucaoLongitudinal}
              onChange={(e) => updateField("evolucaoLongitudinal", e.target.value)}
              placeholder="Sessão 1: ... &#10;Sessão 2: ... &#10;Padrões recorrentes: ... &#10;Movimentos de integração: ..."
              className="min-h-[140px] bg-background/30 border-emerald-500/20"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
        <Button
          variant="outline"
          onClick={handleSave}
          disabled={isSaving}
          className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 gap-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Salvar Registro Clínico
        </Button>
        <Button
          onClick={onGeneratePDF}
          className="bg-gradient-to-r from-gold to-amber-600 hover:from-gold/90 hover:to-amber-600/90 text-amber-950 gap-2"
        >
          <FileText className="w-4 h-4" />
          Gerar Ficha Clínica (PDF)
        </Button>
      </div>
    </div>
  );
}

function MiniCard({ icon, label, value, emoji, color }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  emoji: string;
  color: string;
}) {
  return (
    <div className="bg-background/20 rounded-lg p-3 border border-gold/10 text-center">
      <span className="text-2xl block mb-1">{emoji}</span>
      <p className={`text-xs font-medium ${color}`}>{label}</p>
      <p className="text-sm text-foreground truncate">{value}</p>
    </div>
  );
}
