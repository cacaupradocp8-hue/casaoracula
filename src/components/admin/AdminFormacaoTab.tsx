import { useState } from "react";
import { useFormacaoContent } from "@/hooks/useFormacaoContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Plus, Trash2, ExternalLink } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function AdminFormacaoTab() {
  const { sections, isLoading, updateSection } = useFormacaoContent();
  const [saving, setSaving] = useState<string | null>(null);

  const handleSave = async (sectionKey: string, content: Record<string, any>) => {
    setSaving(sectionKey);
    await updateSection(sectionKey, content);
    setSaving(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Página de Vendas ORÁCULA</h2>
          <p className="text-muted-foreground">Edite o conteúdo da página /formacao-oracula</p>
        </div>
        <a href="/formacao-oracula" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            Ver página
          </Button>
        </a>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-2">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="vsl">Vídeo (VSL)</TabsTrigger>
          <TabsTrigger value="o_que_e">O que é</TabsTrigger>
          <TabsTrigger value="app">App</TabsTrigger>
          <TabsTrigger value="para_quem">Para quem</TabsTrigger>
          <TabsTrigger value="o_que_recebe">O que recebe</TabsTrigger>
          <TabsTrigger value="planos">Planos</TabsTrigger>
          <TabsTrigger value="autoridade">Autoridade</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* Hero Tab */}
        <TabsContent value="hero">
          <HeroEditor 
            content={sections.hero || {}} 
            onSave={(content) => handleSave("hero", content)}
            saving={saving === "hero"}
          />
        </TabsContent>

        {/* VSL Tab */}
        <TabsContent value="vsl">
          <VSLEditor 
            content={sections.vsl || {}} 
            onSave={(content) => handleSave("vsl", content)}
            saving={saving === "vsl"}
          />
        </TabsContent>

        {/* O que é Tab */}
        <TabsContent value="o_que_e">
          <ListEditor 
            title="O que é a Formação"
            content={sections.o_que_e || { titulo: "", items: [] }} 
            onSave={(content) => handleSave("o_que_e", content)}
            saving={saving === "o_que_e"}
          />
        </TabsContent>

        {/* App Tab */}
        <TabsContent value="app">
          <AppEditor 
            content={sections.app_diferencial || { titulo: "", subtitulo: "", items: [] }} 
            onSave={(content) => handleSave("app_diferencial", content)}
            saving={saving === "app_diferencial"}
          />
        </TabsContent>

        {/* Para quem Tab */}
        <TabsContent value="para_quem">
          <ParaQuemEditor 
            content={sections.para_quem || { titulo: "", incluidos: [], excluidos: "" }} 
            onSave={(content) => handleSave("para_quem", content)}
            saving={saving === "para_quem"}
          />
        </TabsContent>

        {/* O que recebe Tab */}
        <TabsContent value="o_que_recebe">
          <ListEditor 
            title="O que você recebe"
            content={sections.o_que_recebe || { titulo: "", items: [] }} 
            onSave={(content) => handleSave("o_que_recebe", content)}
            saving={saving === "o_que_recebe"}
          />
        </TabsContent>

        {/* Planos Tab */}
        <TabsContent value="planos">
          <PlanosEditor 
            content={sections.planos || { titulo: "", planos: [] }} 
            onSave={(content) => handleSave("planos", content)}
            saving={saving === "planos"}
          />
        </TabsContent>

        {/* Autoridade Tab */}
        <TabsContent value="autoridade">
          <AutoridadeEditor 
            content={sections.autoridade || { texto: "" }} 
            onSave={(content) => handleSave("autoridade", content)}
            saving={saving === "autoridade"}
          />
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq">
          <FAQEditor 
            content={sections.faq || { titulo: "", items: [] }} 
            onSave={(content) => handleSave("faq", content)}
            saving={saving === "faq"}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Sub-components for each section editor

function HeroEditor({ content, onSave, saving }: { content: any; onSave: (c: any) => void; saving: boolean }) {
  const [local, setLocal] = useState(content);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Section</CardTitle>
        <CardDescription>Primeira seção da página com título principal</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Título (H1)</Label>
          <Textarea 
            value={local.titulo || ""} 
            onChange={(e) => setLocal({ ...local, titulo: e.target.value })}
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label>Subtítulo</Label>
          <Textarea 
            value={local.subtitulo || ""} 
            onChange={(e) => setLocal({ ...local, subtitulo: e.target.value })}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label>Texto do botão CTA</Label>
          <Input 
            value={local.cta_texto || ""} 
            onChange={(e) => setLocal({ ...local, cta_texto: e.target.value })}
          />
        </div>
        <Button onClick={() => onSave(local)} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Salvar
        </Button>
      </CardContent>
    </Card>
  );
}

function VSLEditor({ content, onSave, saving }: { content: any; onSave: (c: any) => void; saving: boolean }) {
  const [local, setLocal] = useState(content);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vídeo de Vendas (VSL)</CardTitle>
        <CardDescription>Cole a URL do YouTube ou Vimeo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>URL do Vídeo (YouTube ou Vimeo)</Label>
          <Input 
            value={local.video_url || ""} 
            onChange={(e) => setLocal({ ...local, video_url: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>
        <div className="space-y-2">
          <Label>Texto acima do vídeo</Label>
          <Textarea 
            value={local.texto_acima || ""} 
            onChange={(e) => setLocal({ ...local, texto_acima: e.target.value })}
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label>Texto abaixo do vídeo</Label>
          <Textarea 
            value={local.texto_abaixo || ""} 
            onChange={(e) => setLocal({ ...local, texto_abaixo: e.target.value })}
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label>Texto do botão CTA</Label>
          <Input 
            value={local.cta_texto || ""} 
            onChange={(e) => setLocal({ ...local, cta_texto: e.target.value })}
          />
        </div>
        <Button onClick={() => onSave(local)} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Salvar
        </Button>
      </CardContent>
    </Card>
  );
}

function ListEditor({ title, content, onSave, saving }: { title: string; content: any; onSave: (c: any) => void; saving: boolean }) {
  const [local, setLocal] = useState(content);

  const addItem = () => {
    setLocal({ ...local, items: [...(local.items || []), ""] });
  };

  const removeItem = (index: number) => {
    const newItems = [...local.items];
    newItems.splice(index, 1);
    setLocal({ ...local, items: newItems });
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...local.items];
    newItems[index] = value;
    setLocal({ ...local, items: newItems });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Título da seção</Label>
          <Input 
            value={local.titulo || ""} 
            onChange={(e) => setLocal({ ...local, titulo: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Itens</Label>
          {(local.items || []).map((item: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input 
                value={item} 
                onChange={(e) => updateItem(index, e.target.value)}
              />
              <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar item
          </Button>
        </div>

        <Button onClick={() => onSave(local)} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Salvar
        </Button>
      </CardContent>
    </Card>
  );
}

function AppEditor({ content, onSave, saving }: { content: any; onSave: (c: any) => void; saving: boolean }) {
  const [local, setLocal] = useState(content);

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...local.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setLocal({ ...local, items: newItems });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>APP Casa Orácula</CardTitle>
        <CardDescription>Diferenciais do aplicativo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Título</Label>
          <Input 
            value={local.titulo || ""} 
            onChange={(e) => setLocal({ ...local, titulo: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Subtítulo (destaque)</Label>
          <Input 
            value={local.subtitulo || ""} 
            onChange={(e) => setLocal({ ...local, subtitulo: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Itens</Label>
          {(local.items || []).map((item: any, index: number) => (
            <div key={index} className="flex gap-2 items-center">
              <Input 
                value={item.texto || ""} 
                onChange={(e) => updateItem(index, "texto", e.target.value)}
                className="flex-1"
              />
            </div>
          ))}
        </div>

        <Button onClick={() => onSave(local)} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Salvar
        </Button>
      </CardContent>
    </Card>
  );
}

function ParaQuemEditor({ content, onSave, saving }: { content: any; onSave: (c: any) => void; saving: boolean }) {
  const [local, setLocal] = useState(content);

  const addItem = () => {
    setLocal({ ...local, incluidos: [...(local.incluidos || []), ""] });
  };

  const removeItem = (index: number) => {
    const newItems = [...local.incluidos];
    newItems.splice(index, 1);
    setLocal({ ...local, incluidos: newItems });
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...local.incluidos];
    newItems[index] = value;
    setLocal({ ...local, incluidos: newItems });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Para quem é</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Título</Label>
          <Input 
            value={local.titulo || ""} 
            onChange={(e) => setLocal({ ...local, titulo: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Público incluído</Label>
          {(local.incluidos || []).map((item: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input 
                value={item} 
                onChange={(e) => updateItem(index, e.target.value)}
              />
              <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Público excluído (aviso)</Label>
          <Textarea 
            value={local.excluidos || ""} 
            onChange={(e) => setLocal({ ...local, excluidos: e.target.value })}
            rows={2}
          />
        </div>

        <Button onClick={() => onSave(local)} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Salvar
        </Button>
      </CardContent>
    </Card>
  );
}

function PlanosEditor({ content, onSave, saving }: { content: any; onSave: (c: any) => void; saving: boolean }) {
  const [local, setLocal] = useState(content);

  const updatePlano = (index: number, field: string, value: any) => {
    const newPlanos = [...local.planos];
    newPlanos[index] = { ...newPlanos[index], [field]: value };
    setLocal({ ...local, planos: newPlanos });
  };

  const updatePlanoItem = (planoIndex: number, itemIndex: number, value: string) => {
    const newPlanos = [...local.planos];
    const newItems = [...(newPlanos[planoIndex].items || [])];
    newItems[itemIndex] = value;
    newPlanos[planoIndex] = { ...newPlanos[planoIndex], items: newItems };
    setLocal({ ...local, planos: newPlanos });
  };

  const addPlanoItem = (planoIndex: number) => {
    const newPlanos = [...local.planos];
    newPlanos[planoIndex] = { 
      ...newPlanos[planoIndex], 
      items: [...(newPlanos[planoIndex].items || []), ""] 
    };
    setLocal({ ...local, planos: newPlanos });
  };

  const removePlanoItem = (planoIndex: number, itemIndex: number) => {
    const newPlanos = [...local.planos];
    const newItems = [...newPlanos[planoIndex].items];
    newItems.splice(itemIndex, 1);
    newPlanos[planoIndex] = { ...newPlanos[planoIndex], items: newItems };
    setLocal({ ...local, planos: newPlanos });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Planos e Preços</CardTitle>
        <CardDescription>Configure os planos e links de checkout</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Título da seção</Label>
          <Input 
            value={local.titulo || ""} 
            onChange={(e) => setLocal({ ...local, titulo: e.target.value })}
          />
        </div>
        
        {(local.planos || []).map((plano: any, index: number) => (
          <Card key={index} className={plano.destaque ? "border-gold" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{plano.nome}</CardTitle>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Destaque</Label>
                  <Switch 
                    checked={plano.destaque || false}
                    onCheckedChange={(checked) => updatePlano(index, "destaque", checked)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do plano</Label>
                  <Input 
                    value={plano.nome || ""} 
                    onChange={(e) => updatePlano(index, "nome", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preço</Label>
                  <Input 
                    value={plano.preco || ""} 
                    onChange={(e) => updatePlano(index, "preco", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Período</Label>
                <Input 
                  value={plano.periodo || ""} 
                  onChange={(e) => updatePlano(index, "periodo", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Link do Checkout (Rockty)</Label>
                <Input 
                  value={plano.checkout_url || ""} 
                  onChange={(e) => updatePlano(index, "checkout_url", e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label>Benefícios</Label>
                {(plano.items || []).map((item: string, itemIndex: number) => (
                  <div key={itemIndex} className="flex gap-2">
                    <Input 
                      value={item} 
                      onChange={(e) => updatePlanoItem(index, itemIndex, e.target.value)}
                    />
                    <Button variant="ghost" size="icon" onClick={() => removePlanoItem(index, itemIndex)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addPlanoItem(index)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar benefício
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button onClick={() => onSave(local)} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Salvar todos os planos
        </Button>
      </CardContent>
    </Card>
  );
}

function AutoridadeEditor({ content, onSave, saving }: { content: any; onSave: (c: any) => void; saving: boolean }) {
  const [local, setLocal] = useState(content);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bloco de Autoridade</CardTitle>
        <CardDescription>Frase de posicionamento/diferencial</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Texto</Label>
          <Textarea 
            value={local.texto || ""} 
            onChange={(e) => setLocal({ ...local, texto: e.target.value })}
            rows={4}
          />
        </div>
        <Button onClick={() => onSave(local)} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Salvar
        </Button>
      </CardContent>
    </Card>
  );
}

function FAQEditor({ content, onSave, saving }: { content: any; onSave: (c: any) => void; saving: boolean }) {
  const [local, setLocal] = useState(content);

  const addItem = () => {
    setLocal({ ...local, items: [...(local.items || []), { pergunta: "", resposta: "" }] });
  };

  const removeItem = (index: number) => {
    const newItems = [...local.items];
    newItems.splice(index, 1);
    setLocal({ ...local, items: newItems });
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...local.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setLocal({ ...local, items: newItems });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perguntas Frequentes (FAQ)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Título da seção</Label>
          <Input 
            value={local.titulo || ""} 
            onChange={(e) => setLocal({ ...local, titulo: e.target.value })}
          />
        </div>
        
        <div className="space-y-4">
          {(local.items || []).map((item: any, index: number) => (
            <Card key={index} className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <Label>Pergunta {index + 1}</Label>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input 
                  value={item.pergunta || ""} 
                  onChange={(e) => updateItem(index, "pergunta", e.target.value)}
                  placeholder="Pergunta..."
                />
                <Label>Resposta</Label>
                <Textarea 
                  value={item.resposta || ""} 
                  onChange={(e) => updateItem(index, "resposta", e.target.value)}
                  placeholder="Resposta..."
                  rows={3}
                />
              </div>
            </Card>
          ))}
          <Button variant="outline" onClick={addItem}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar pergunta
          </Button>
        </div>

        <Button onClick={() => onSave(local)} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Salvar
        </Button>
      </CardContent>
    </Card>
  );
}
