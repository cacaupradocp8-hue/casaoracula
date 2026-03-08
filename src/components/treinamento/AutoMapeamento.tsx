import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Save, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const DISTRITOS = [
  'Portão da Chegada', 'Torres', 'Portas', 'Jardim dos Arquétipos',
  'Praça do Abalo', 'Casa dos Sonhos', 'Espelho dos Vínculos',
  'Forja', 'Conselho Interior', 'Labirinto', 'Praça da Integração',
  'Portal de Renascimento',
];

type EstadoDistrito = 'inativo' | 'ativo' | 'integrado';

const ESTADO_STYLES: Record<EstadoDistrito, string> = {
  inativo: 'border-muted/30 bg-muted/5 text-muted-foreground/50',
  ativo: 'border-primary/50 bg-primary/10 text-primary',
  integrado: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
};

const ESTADO_LABELS: Record<EstadoDistrito, string> = {
  inativo: 'Inativo',
  ativo: 'Ativo',
  integrado: 'Integrado',
};

export function AutoMapeamento() {
  const { user } = useAuth();
  const [distritos, setDistritos] = useState<Record<string, EstadoDistrito>>({});
  const [anotacoes, setAnotacoes] = useState('');
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from('auto_mapeamento')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) {
        setDistritos((data.distritos_json as Record<string, EstadoDistrito>) || {});
        setAnotacoes(data.anotacoes || '');
      }
      setLoaded(true);
    };
    load();
  }, [user]);

  const cycleEstado = (d: string) => {
    const current = distritos[d] || 'inativo';
    const next: EstadoDistrito = current === 'inativo' ? 'ativo' : current === 'ativo' ? 'integrado' : 'inativo';
    setDistritos(prev => ({ ...prev, [d]: next }));
  };

  const salvar = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from('auto_mapeamento')
      .upsert({
        user_id: user.id,
        distritos_json: distritos,
        anotacoes,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    setSaving(false);
    if (error) toast.error('Erro ao salvar');
    else toast.success('Auto-mapeamento salvo!');
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Mapeie sua própria CidaDELA Interior. Clique nos distritos para alternar entre <strong>Inativo → Ativo → Integrado</strong>.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {DISTRITOS.map(d => {
          const estado = distritos[d] || 'inativo';
          return (
            <button
              key={d}
              onClick={() => cycleEstado(d)}
              className={`p-3 rounded-lg border text-left transition-all text-sm ${ESTADO_STYLES[estado]} hover:scale-[1.02]`}
            >
              <p className="font-medium text-xs leading-tight">{d}</p>
              <Badge variant="outline" className="mt-1.5 text-[10px]">
                {estado === 'integrado' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                {ESTADO_LABELS[estado]}
              </Badge>
            </button>
          );
        })}
      </div>

      <Card className="bg-[#0F2438] border-primary/15">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-foreground">Anotações Pessoais</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={anotacoes}
            onChange={e => setAnotacoes(e.target.value)}
            placeholder="Registre aqui suas percepções sobre seu próprio mapa interior..."
            className="min-h-[120px] bg-background border-primary/10 text-foreground placeholder:text-muted-foreground/40"
          />
        </CardContent>
      </Card>

      <Button onClick={salvar} disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/80">
        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Salvar Auto-Mapeamento
      </Button>
    </div>
  );
}
