import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "./ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Save, 
  Loader2, 
  Moon, 
  Star, 
  Image, 
  Type, 
  List, 
  Eye,
  Plus,
  Trash2,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";

interface FormacaoAreaConfig {
  id: string;
  mentoria_banner_url: string | null;
  mentoria_titulo: string;
  mentoria_subtitulo: string;
  mentoria_descricao: string;
  mentoria_icone: string;
  mentoria_cor: string;
  mentoria_itens: string[];
  mentoria_ativa: boolean;
  formacao_banner_url: string | null;
  formacao_titulo: string;
  formacao_subtitulo: string;
  formacao_descricao: string;
  formacao_icone: string;
  formacao_cor: string;
  formacao_itens: string[];
  formacao_ativa: boolean;
  mostrar_salas_estudo: boolean;
  titulo_salas_estudo: string;
}

const defaultConfig: FormacaoAreaConfig = {
  id: '',
  mentoria_banner_url: null,
  mentoria_titulo: 'Mentoria Orácula',
  mentoria_subtitulo: 'Jornada pessoal simbólica',
  mentoria_descricao: 'Sua jornada pessoal de autoconhecimento e transformação interior.',
  mentoria_icone: 'Moon',
  mentoria_cor: 'purple',
  mentoria_itens: ['Jornada pessoal de autodescoberta', 'Práticas simbólicas guiadas', 'Sem aplicação profissional'],
  mentoria_ativa: true,
  formacao_banner_url: null,
  formacao_titulo: 'Formação Orácula',
  formacao_subtitulo: 'Capacitação profissional',
  formacao_descricao: 'Formação completa para se tornar uma facilitadora do método ORÁCULA.',
  formacao_icone: 'Star',
  formacao_cor: 'gold',
  formacao_itens: ['Currículo estruturado', 'Ensino do método', 'Certificação profissional'],
  formacao_ativa: true,
  mostrar_salas_estudo: true,
  titulo_salas_estudo: 'Salas de Estudo',
};

export function AdminAreaFormacaoTab() {
  const [config, setConfig] = useState<FormacaoAreaConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('formacao_area_config')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setConfig({
          ...defaultConfig,
          ...data,
          mentoria_itens: data.mentoria_itens || defaultConfig.mentoria_itens,
          formacao_itens: data.formacao_itens || defaultConfig.formacao_itens,
        });
      }
    } catch (error) {
      console.error('Error fetching config:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('formacao_area_config')
        .update({
          mentoria_banner_url: config.mentoria_banner_url,
          mentoria_titulo: config.mentoria_titulo,
          mentoria_subtitulo: config.mentoria_subtitulo,
          mentoria_descricao: config.mentoria_descricao,
          mentoria_icone: config.mentoria_icone,
          mentoria_cor: config.mentoria_cor,
          mentoria_itens: config.mentoria_itens,
          mentoria_ativa: config.mentoria_ativa,
          formacao_banner_url: config.formacao_banner_url,
          formacao_titulo: config.formacao_titulo,
          formacao_subtitulo: config.formacao_subtitulo,
          formacao_descricao: config.formacao_descricao,
          formacao_icone: config.formacao_icone,
          formacao_cor: config.formacao_cor,
          formacao_itens: config.formacao_itens,
          formacao_ativa: config.formacao_ativa,
          mostrar_salas_estudo: config.mostrar_salas_estudo,
          titulo_salas_estudo: config.titulo_salas_estudo,
        })
        .eq('id', config.id);

      if (error) throw error;
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const updateMentoriaItem = (index: number, value: string) => {
    const newItems = [...config.mentoria_itens];
    newItems[index] = value;
    setConfig({ ...config, mentoria_itens: newItems });
  };

  const addMentoriaItem = () => {
    setConfig({ ...config, mentoria_itens: [...config.mentoria_itens, ''] });
  };

  const removeMentoriaItem = (index: number) => {
    const newItems = config.mentoria_itens.filter((_, i) => i !== index);
    setConfig({ ...config, mentoria_itens: newItems });
  };

  const updateFormacaoItem = (index: number, value: string) => {
    const newItems = [...config.formacao_itens];
    newItems[index] = value;
    setConfig({ ...config, formacao_itens: newItems });
  };

  const addFormacaoItem = () => {
    setConfig({ ...config, formacao_itens: [...config.formacao_itens, ''] });
  };

  const removeFormacaoItem = (index: number) => {
    const newItems = config.formacao_itens.filter((_, i) => i !== index);
    setConfig({ ...config, formacao_itens: newItems });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display">Área de Formação</h2>
          <p className="text-sm text-muted-foreground">
            Personalize os cards e banners exibidos na página /salas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/salas" target="_blank">
            <Button variant="outline" size="sm" className="gap-2">
              <Eye className="w-4 h-4" />
              Visualizar
              <ExternalLink className="w-3 h-3" />
            </Button>
          </Link>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar Alterações
          </Button>
        </div>
      </div>

      <Tabs defaultValue="mentoria" className="space-y-6">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="mentoria" className="gap-2">
            <Moon className="w-4 h-4" />
            Mentoria Orácula
          </TabsTrigger>
          <TabsTrigger value="formacao" className="gap-2">
            <Star className="w-4 h-4" />
            Formação Orácula
          </TabsTrigger>
          <TabsTrigger value="geral" className="gap-2">
            <List className="w-4 h-4" />
            Configurações Gerais
          </TabsTrigger>
        </TabsList>

        {/* Mentoria Tab */}
        <TabsContent value="mentoria" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Moon className="w-5 h-5 text-purple-400" />
                    Mentoria Orácula
                  </CardTitle>
                  <CardDescription>Configurações do card de Mentoria</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="mentoria-ativa">Ativa</Label>
                  <Switch
                    id="mentoria-ativa"
                    checked={config.mentoria_ativa}
                    onCheckedChange={(checked) => setConfig({ ...config, mentoria_ativa: checked })}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Banner */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Banner (opcional)
                </Label>
                <ImageUpload
                  value={config.mentoria_banner_url || ''}
                  onChange={(url) => setConfig({ ...config, mentoria_banner_url: url })}
                  folder="formacao-banners"
                  aspectRatio="banner"
                />
              </div>

              <Separator />

              {/* Textos */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Título
                  </Label>
                  <Input
                    value={config.mentoria_titulo}
                    onChange={(e) => setConfig({ ...config, mentoria_titulo: e.target.value })}
                    placeholder="Mentoria Orácula"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtítulo</Label>
                  <Input
                    value={config.mentoria_subtitulo}
                    onChange={(e) => setConfig({ ...config, mentoria_subtitulo: e.target.value })}
                    placeholder="Jornada pessoal simbólica"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={config.mentoria_descricao}
                  onChange={(e) => setConfig({ ...config, mentoria_descricao: e.target.value })}
                  placeholder="Descrição do card..."
                  rows={3}
                />
              </div>

              <Separator />

              {/* Itens da lista */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <List className="w-4 h-4" />
                    Itens do Card
                  </Label>
                  <Button variant="outline" size="sm" onClick={addMentoriaItem} className="gap-1">
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </Button>
                </div>
                
                {config.mentoria_itens.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={item}
                      onChange={(e) => updateMentoriaItem(index, e.target.value)}
                      placeholder={`Item ${index + 1}`}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMentoriaItem(index)}
                      className="shrink-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Formação Tab */}
        <TabsContent value="formacao" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-gold" />
                    Formação Orácula
                  </CardTitle>
                  <CardDescription>Configurações do card de Formação</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="formacao-ativa">Ativa</Label>
                  <Switch
                    id="formacao-ativa"
                    checked={config.formacao_ativa}
                    onCheckedChange={(checked) => setConfig({ ...config, formacao_ativa: checked })}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Banner */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Banner (opcional)
                </Label>
                <ImageUpload
                  value={config.formacao_banner_url || ''}
                  onChange={(url) => setConfig({ ...config, formacao_banner_url: url })}
                  folder="formacao-banners"
                  aspectRatio="banner"
                />
              </div>

              <Separator />

              {/* Textos */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Título
                  </Label>
                  <Input
                    value={config.formacao_titulo}
                    onChange={(e) => setConfig({ ...config, formacao_titulo: e.target.value })}
                    placeholder="Formação Orácula"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtítulo</Label>
                  <Input
                    value={config.formacao_subtitulo}
                    onChange={(e) => setConfig({ ...config, formacao_subtitulo: e.target.value })}
                    placeholder="Capacitação profissional"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={config.formacao_descricao}
                  onChange={(e) => setConfig({ ...config, formacao_descricao: e.target.value })}
                  placeholder="Descrição do card..."
                  rows={3}
                />
              </div>

              <Separator />

              {/* Itens da lista */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <List className="w-4 h-4" />
                    Itens do Card
                  </Label>
                  <Button variant="outline" size="sm" onClick={addFormacaoItem} className="gap-1">
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </Button>
                </div>
                
                {config.formacao_itens.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={item}
                      onChange={(e) => updateFormacaoItem(index, e.target.value)}
                      placeholder={`Item ${index + 1}`}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFormacaoItem(index)}
                      className="shrink-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações Gerais Tab */}
        <TabsContent value="geral" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Opções adicionais da página de formação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Mostrar Salas de Estudo</Label>
                  <p className="text-sm text-muted-foreground">
                    Exibir seção de salas abaixo dos cards principais
                  </p>
                </div>
                <Switch
                  checked={config.mostrar_salas_estudo}
                  onCheckedChange={(checked) => setConfig({ ...config, mostrar_salas_estudo: checked })}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Título da Seção de Salas</Label>
                <Input
                  value={config.titulo_salas_estudo}
                  onChange={(e) => setConfig({ ...config, titulo_salas_estudo: e.target.value })}
                  placeholder="Salas de Estudo"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
