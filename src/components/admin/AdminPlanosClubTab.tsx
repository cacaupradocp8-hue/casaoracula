import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VideoUpload } from '@/components/admin/VideoUpload';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

const SETTINGS_KEYS = [
  'planos_clube_vsl_url',
  'planos_clube_checkout_mensal_url',
  'planos_clube_checkout_anual_url',
  'planos_clube_preco_mensal',
  'planos_clube_preco_anual',
  'planos_clube_portal_atual_route',
  'planos_clube_assinatura_route',
];

const DEFAULTS: Record<string, string> = {
  planos_clube_vsl_url: '',
  planos_clube_checkout_mensal_url: '#',
  planos_clube_checkout_anual_url: '#',
  planos_clube_preco_mensal: 'R$ 97/mês',
  planos_clube_preco_anual: 'R$ 897/ano',
  planos_clube_portal_atual_route: '/clube-livro',
  planos_clube_assinatura_route: '/minha-conta',
};

export function AdminPlanosClubTab() {
  const [values, setValues] = useState<Record<string, string>>({ ...DEFAULTS });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('key, value')
        .in('key', SETTINGS_KEYS);
      if (data) {
        const map = { ...DEFAULTS };
        data.forEach(r => { map[r.key] = r.value; });
        setValues(map);
      }
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const key of SETTINGS_KEYS) {
        const val = values[key] ?? DEFAULTS[key];
        await supabase
          .from('app_settings')
          .upsert({ key, value: val, description: `Planos Clube: ${key}` }, { onConflict: 'key' });
      }
      toast.success('Configurações salvas!');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const set = (key: string, val: string) => setValues(p => ({ ...p, [key]: val }));

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-semibold">Página de Planos — Círculo de Leitura</h2>

      {/* VSL Video */}
      <Card>
        <CardHeader><CardTitle className="text-base">Vídeo de Vendas (VSL)</CardTitle></CardHeader>
        <CardContent>
          <VideoUpload
            value={values.planos_clube_vsl_url}
            onChange={v => set('planos_clube_vsl_url', v)}
            folder="planos-clube"
            label="URL ou upload do vídeo de vendas"
            maxSizeMB={100}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Você pode fazer upload de um vídeo ou colar uma URL (YouTube, Vimeo, etc).
          </p>
        </CardContent>
      </Card>

      {/* Preços */}
      <Card>
        <CardHeader><CardTitle className="text-base">Preços</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Preço Mensal (texto exibido)</Label>
            <Input value={values.planos_clube_preco_mensal} onChange={e => set('planos_clube_preco_mensal', e.target.value)} placeholder="R$ 67/mês" />
          </div>
          <div>
            <Label>Preço Anual (texto exibido)</Label>
            <Input value={values.planos_clube_preco_anual} onChange={e => set('planos_clube_preco_anual', e.target.value)} placeholder="R$ 497/ano" />
          </div>
        </CardContent>
      </Card>

      {/* URLs de Checkout */}
      <Card>
        <CardHeader><CardTitle className="text-base">Links de Checkout</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>URL Checkout Mensal</Label>
            <Input value={values.planos_clube_checkout_mensal_url} onChange={e => set('planos_clube_checkout_mensal_url', e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <Label>URL Checkout Anual</Label>
            <Input value={values.planos_clube_checkout_anual_url} onChange={e => set('planos_clube_checkout_anual_url', e.target.value)} placeholder="https://..." />
          </div>
        </CardContent>
      </Card>

      {/* Rotas */}
      <Card>
        <CardHeader><CardTitle className="text-base">Rotas Internas</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Rota do Portal Atual</Label>
            <Input value={values.planos_clube_portal_atual_route} onChange={e => set('planos_clube_portal_atual_route', e.target.value)} placeholder="/clube-livro" />
          </div>
          <div>
            <Label>Rota Gerenciar Assinatura</Label>
            <Input value={values.planos_clube_assinatura_route} onChange={e => set('planos_clube_assinatura_route', e.target.value)} placeholder="/minha-conta" />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
        Salvar Configurações
      </Button>
    </div>
  );
}
