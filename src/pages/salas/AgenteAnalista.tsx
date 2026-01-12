import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Send, Loader2, Bot, AlertTriangle, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { EthicalNotice } from '@/components/shared/EthicalNotice';

export default function AgenteAnalista() {
  const [input, setInput] = useState('');
  const [resposta, setResposta] = useState('');
  const [loading, setLoading] = useState(false);
  const [historico, setHistorico] = useState<{input: string; resposta: string; data: Date}[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    // Simulação - integração futura com AI Gateway
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const novaResposta = `[Análise em desenvolvimento]\n\nO Agente Analista está sendo preparado para oferecer análises profundas de casos clínicos.\n\nSua entrada foi: "${input.substring(0, 100)}..."\n\nEm breve você terá acesso a:\n- Identificação de padrões recorrentes\n- Sugestões de hipóteses diagnósticas\n- Correlações entre ferramentas aplicadas\n- Insights para direcionamento terapêutico`;
    
    setResposta(novaResposta);
    setHistorico([...historico, { input, resposta: novaResposta, data: new Date() }]);
    setLoading(false);
  };

  const handleSaveInteraction = () => {
    toast({
      title: 'Interação salva!',
      description: 'Esta análise foi registrada no seu histórico.',
    });
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
          title="Agente Analista de Caso"
          subtitle="IA especializada em análise de casos clínicos"
          icon={<Bot className="w-5 h-5" />}
          className="mb-8"
        />

        <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-700 dark:text-amber-300">
            <strong>Aviso Ético:</strong> Este agente oferece sugestões baseadas em padrões. 
            A decisão clínica sempre deve ser do profissional responsável. 
            Não substitui supervisão ou formação adequada.
          </AlertDescription>
        </Alert>

        <EthicalNotice toolName="Agente Analista" className="mb-6" />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Descreva o Caso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Descreva o caso, incluindo informações relevantes como:&#10;- Contexto geral&#10;- Queixas principais&#10;- Padrões observados&#10;- Ferramentas já aplicadas&#10;- Dúvidas específicas..."
                rows={12}
              />
              <Button 
                onClick={handleSubmit} 
                disabled={loading || !input.trim()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Solicitar Análise
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Resposta do Agente
                {resposta && (
                  <Button variant="outline" size="sm" onClick={handleSaveInteraction}>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {resposta ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
                    {resposta}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Bot className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>A análise aparecerá aqui após o envio.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {historico.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Histórico desta Sessão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {historico.map((item, i) => (
                  <div key={i} className="border-l-2 border-primary/30 pl-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      {item.data.toLocaleTimeString()}
                    </p>
                    <p className="text-sm font-medium mb-2 line-clamp-2">{item.input}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
