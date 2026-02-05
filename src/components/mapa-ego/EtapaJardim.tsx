// ============================================
// ETAPA 5: REGISTRO NO JARDIM
// ============================================

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, Sparkles, CheckCircle2 } from 'lucide-react';
import { useJardimPsique, NovoRegistroJardim } from '@/hooks/useJardimPsique';
import { RespostaCamada, CAMADAS_EGO } from './types';
import { toast } from 'sonner';

interface EtapaJardimProps {
  respostas: Record<string, RespostaCamada>;
  sinteseNarrativa?: string;
  reflexaoFinal?: string;
  onReflexaoChange: (reflexao: string) => void;
  onSalvo: () => void;
}

export function EtapaJardim({
  respostas,
  sinteseNarrativa,
  reflexaoFinal,
  onReflexaoChange,
  onSalvo,
}: EtapaJardimProps) {
  const [reflexao, setReflexao] = useState(reflexaoFinal || '');
  const [emocao, setEmocao] = useState('');
  const [saving, setSaving] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const { salvarRegistro } = useJardimPsique();

  // Identificar camada dominante para o resultado simbólico
  const camadaDominante = CAMADAS_EGO.reduce((max, camada) => {
    const resp = respostas[camada.id];
    const totalChars = resp?.respostas.reduce((sum, r) => sum + r.trim().length, 0) || 0;
    const maxChars = respostas[max.id]?.respostas.reduce((sum, r) => sum + r.trim().length, 0) || 0;
    return totalChars > maxChars ? camada : max;
  }, CAMADAS_EGO[0]);

  const handleSalvar = async () => {
    setSaving(true);
    try {
      const novoRegistro: NovoRegistroJardim = {
        ferramenta_nome: 'Mapa do Ego Feminino',
        ferramenta_chave: 'mapa_ego_feminino',
        conteudo: {
          respostas,
          sinteseNarrativa,
        },
        resultado_simbolico: {
          camadaDominante: camadaDominante.nome,
          camadaCor: camadaDominante.cor,
          totalCamadasExploradas: Object.keys(respostas).length,
        },
        reflexao_pessoal: reflexao || undefined,
        tipo_registro: 'ferramenta',
        emocao_predominante: emocao || undefined,
      };

      const registroId = await salvarRegistro(novoRegistro);

      if (registroId) {
        setSalvo(true);
        onReflexaoChange(reflexao);
        toast.success('Travessia salva no Jardim da Psique');
        onSalvo();
      }
    } catch (error) {
      toast.error('Erro ao salvar no Jardim');
    } finally {
      setSaving(false);
    }
  };

  if (salvo) {
    return (
      <Card className="bg-gradient-to-br from-emerald-900/20 to-card/50 border-emerald-500/30">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-lg font-medium text-emerald-300">Travessia Registrada</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Sua exploração das camadas do ego foi salva no Jardim da Psique. 
            Você pode acessá-la a qualquer momento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-emerald-900/10 to-card/50 border-emerald-500/20">
        <CardContent className="pt-6 space-y-5">
          <div className="flex items-center gap-2 text-emerald-400">
            <Leaf className="w-5 h-5" />
            <span className="font-medium">Salvar no Jardim da Psique</span>
          </div>

          <p className="text-sm text-muted-foreground">
            Este é seu espaço privado de registros simbólicos. 
            Ninguém mais tem acesso a ele.
          </p>

          {/* Resumo do que será salvo */}
          <div className="rounded-lg bg-muted/20 p-4 space-y-2">
            <p className="text-sm">
              <span className="text-muted-foreground">Camada dominante:</span>{' '}
              <span className="font-medium" style={{ color: camadaDominante.cor }}>
                {camadaDominante.nome}
              </span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Camadas exploradas:</span>{' '}
              <span className="font-medium">{Object.keys(respostas).length} de 5</span>
            </p>
          </div>

          {/* Reflexão pessoal */}
          <div className="space-y-2">
            <Label htmlFor="reflexao" className="text-sm">
              Reflexões da Tecelã <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Textarea
              id="reflexao"
              placeholder="O que essa travessia despertou em você? Anote livremente..."
              value={reflexao}
              onChange={(e) => setReflexao(e.target.value)}
              className="min-h-[100px] resize-none bg-background/50"
            />
          </div>

          {/* Emoção predominante */}
          <div className="space-y-2">
            <Label htmlFor="emocao" className="text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Emoção predominante <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Input
              id="emocao"
              placeholder="Ex: clareza, inquietação, acolhimento..."
              value={emocao}
              onChange={(e) => setEmocao(e.target.value)}
              className="bg-background/50"
            />
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={handleSalvar}
              disabled={saving}
              className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              <Leaf className="w-4 h-4" />
              {saving ? 'Salvando...' : 'Salvar no Jardim'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        Você pode pular esta etapa, mas a travessia não será registrada.
      </p>
    </div>
  );
}
