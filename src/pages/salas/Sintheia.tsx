import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Loader2, Sparkles, Copy, Download, Plus, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type TipoCriacao = 'sessao' | 'ritual' | 'grupo' | 'produto';

const MOMENTOS_JORNADA = [
  'Abertura / Primeiro contato',
  'Imersão / Processo ativo',
  'Travessia / Momento de crise',
  'Integração / Estabilização',
  'Encerramento / Fechamento de ciclo',
];

const PUBLICOS = [
  'Individual',
  'Casal',
  'Grupo pequeno (3-8 pessoas)',
  'Grupo grande (9+ pessoas)',
  'Online assíncrono',
];

const TEMPOS = [
  '15-30 minutos',
  '30-60 minutos',
  '1-2 horas',
  '2-4 horas',
  'Dia inteiro',
  'Múltiplos dias',
];

export default function Sintheia() {
  const [tipoCriacao, setTipoCriacao] = useState<TipoCriacao>('sessao');
  const [titulo, setTitulo] = useState('');
  const [temaPrincipal, setTemaPrincipal] = useState('');
  const [publicoAlvo, setPublicoAlvo] = useState('');
  const [momentoJornada, setMomentoJornada] = useState('');
  const [tempoDisponivel, setTempoDisponivel] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [novaTag, setNovaTag] = useState('');
  
  // Saída estruturada
  const [chaveSimbólica, setChaveSimbólica] = useState('');
  const [intencaoTerapeutica, setIntencaoTerapeutica] = useState('');
  const [estruturaPratica, setEstruturaPratica] = useState('');
  const [suporteLinguagem, setSuporteLinguagem] = useState('');
  const [fechamentoIntegracao, setFechamentoIntegracao] = useState('');
  
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const adicionarTag = () => {
    if (novaTag.trim() && !tags.includes(novaTag.trim())) {
      setTags([...tags, novaTag.trim()]);
      setNovaTag('');
    }
  };

  const removerTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase.from('syntheia_creations').insert({
      user_id: user.id,
      tipo: tipoCriacao,
      titulo,
      tema_principal: temaPrincipal,
      publico_alvo: publicoAlvo,
      momento_jornada: momentoJornada,
      tempo_disponivel: tempoDisponivel,
      tags,
      chave_simbolica: chaveSimbólica,
      intencao_terapeutica: intencaoTerapeutica,
      estrutura_pratica: estruturaPratica,
      suporte_linguagem: suporteLinguagem,
      fechamento_integracao: fechamentoIntegracao,
    });

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Criação salva!', description: 'Sua criação SYNTHEIA foi registrada.' });
    }
    setSaving(false);
  };

  const handleDuplicate = () => {
    toast({ title: 'Duplicado!', description: 'Use este formulário como base para uma nova criação.' });
  };

  const handleExport = () => {
    const content = `
# ${titulo || 'Criação SYNTHEIA'}
Tipo: ${tipoCriacao}
Tema: ${temaPrincipal}
Público: ${publicoAlvo}
Momento: ${momentoJornada}
Tempo: ${tempoDisponivel}

## Chave Simbólica
${chaveSimbólica}

## Intenção Terapêutica
${intencaoTerapeutica}

## Estrutura / Prática
${estruturaPratica}

## Suporte de Linguagem
${suporteLinguagem}

## Fechamento / Integração
${fechamentoIntegracao}

Tags: ${tags.join(', ')}
    `.trim();

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `syntheia-${tipoCriacao}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: 'Exportado!', description: 'Arquivo .md baixado.' });
  };

  const tipoLabels = {
    sessao: 'Sessão Individual',
    ritual: 'Ritual / Cerimônia',
    grupo: 'Experiência em Grupo',
    produto: 'Produto / Curso',
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="mb-6">
          <Link to="/ferramentas" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Voltar às Ferramentas
          </Link>
        </div>

        <SectionHeader
          title="SYNTHEIA – Orquestradora Terapêutica"
          subtitle="Criação guiada de sessões, rituais, grupos e produtos terapêuticos"
          icon={<Sparkles className="w-5 h-5" />}
          className="mb-8"
        />

        <EthicalNotice toolName="SYNTHEIA" className="mb-6" />

        <Tabs value={tipoCriacao} onValueChange={(v) => setTipoCriacao(v as TipoCriacao)} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sessao">Sessão</TabsTrigger>
            <TabsTrigger value="ritual">Ritual</TabsTrigger>
            <TabsTrigger value="grupo">Grupo</TabsTrigger>
            <TabsTrigger value="produto">Produto</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Coluna de Entrada */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contexto da Criação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Título (opcional)</Label>
                  <Input
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder={`Minha ${tipoLabels[tipoCriacao]}...`}
                  />
                </div>

                <div>
                  <Label>Tema Principal</Label>
                  <Input
                    value={temaPrincipal}
                    onChange={(e) => setTemaPrincipal(e.target.value)}
                    placeholder="Qual é o tema central desta criação?"
                  />
                </div>

                <div>
                  <Label>Público-alvo</Label>
                  <Select value={publicoAlvo} onValueChange={setPublicoAlvo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {PUBLICOS.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Momento da Jornada</Label>
                  <Select value={momentoJornada} onValueChange={setMomentoJornada}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {MOMENTOS_JORNADA.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tempo Disponível</Label>
                  <Select value={tempoDisponivel} onValueChange={setTempoDisponivel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {TEMPOS.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={novaTag}
                      onChange={(e) => setNovaTag(e.target.value)}
                      placeholder="Adicionar tag..."
                      onKeyDown={(e) => e.key === 'Enter' && adicionarTag()}
                    />
                    <Button onClick={adicionarTag} size="icon" variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                        <button onClick={() => removerTag(tag)} className="ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna de Saída */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estrutura da Criação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>✨ Chave Simbólica</Label>
                  <Textarea
                    value={chaveSimbólica}
                    onChange={(e) => setChaveSimbólica(e.target.value)}
                    placeholder="Qual símbolo, metáfora ou imagem ancora esta criação?"
                    rows={2}
                  />
                </div>

                <div>
                  <Label>🎯 Intenção Terapêutica</Label>
                  <Textarea
                    value={intencaoTerapeutica}
                    onChange={(e) => setIntencaoTerapeutica(e.target.value)}
                    placeholder="O que esta experiência pretende mobilizar?"
                    rows={2}
                  />
                </div>

                <div>
                  <Label>📋 Estrutura / Prática</Label>
                  <Textarea
                    value={estruturaPratica}
                    onChange={(e) => setEstruturaPratica(e.target.value)}
                    placeholder="Etapas, exercícios, dinâmicas..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label>💬 Suporte de Linguagem</Label>
                  <Textarea
                    value={suporteLinguagem}
                    onChange={(e) => setSuporteLinguagem(e.target.value)}
                    placeholder="Frases, perguntas, comandos úteis..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label>🌙 Fechamento / Integração</Label>
                  <Textarea
                    value={fechamentoIntegracao}
                    onChange={(e) => setFechamentoIntegracao(e.target.value)}
                    placeholder="Como encerrar e ancorar a experiência?"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2 mt-6">
          <Button variant="outline" onClick={handleDuplicate}>
            <Copy className="w-4 h-4 mr-2" />
            Duplicar
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Salvar Criação
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
