import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBig5Comparativo } from '@/hooks/useBig5Comparativo';
import { GuardiaLeituraChat } from '@/components/big5/GuardiaLeituraChat';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Layers, Compass, Loader2 } from 'lucide-react';

export default function Big5Comparativo() {
  const navigate = useNavigate();
  const { getComparativo, loading, hasBoth } = useBig5Comparativo();

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
          <p className="text-muted-foreground animate-pulse">Sincronizando camadas...</p>
        </div>
      </AppLayout>
    );
  }

  if (!hasBoth) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-12 max-w-xl text-center space-y-6">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Layers className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-display">Integração Necessária</h1>
          <p className="text-muted-foreground">
            Para gerar o comparativo, você precisa concluir tanto a Leitura Funcional quanto a Leitura Oracular.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate('/ferramenta/big5-funcional')}>Ir para Leitura Funcional</Button>
            <Button variant="outline" onClick={() => navigate('/ferramenta/big5-simbolico')}>Ir para Leitura Oracular</Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const comparativo = getComparativo();

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-display font-light tracking-tight">Diálogo entre Camadas</h1>
          <p className="text-muted-foreground">Big Five • Integração Funcional & Oracular</p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="border-border/40 bg-muted/20 overflow-hidden relative">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-gold/40 to-primary/20" />
            <CardHeader className="text-center pb-2">
              <CardDescription className="text-lg italic text-foreground/80 font-display">
                “{comparativo?.textoAbertura}”
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center p-8 pt-4">
              <p className="text-muted-foreground leading-relaxed">
                Abaixo, revelamos o ponto de maior relevância entre seu funcionamento externo e seu campo interno.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/10 shadow-sm">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                <Compass className="w-6 h-6 text-primary/60" />
              </div>
              <div>
                <CardTitle className="text-xl font-display font-medium">
                  {comparativo?.isDivergence ? 'Divergência de Reconhecimento' : 'Convergência de Forças'}
                </CardTitle>
                <CardDescription>Território: {comparativo?.item.label}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-5 rounded-2xl bg-muted/30 border border-border/40">
                <p className="text-sm leading-relaxed text-foreground/90 italic">
                  {comparativo?.conclusao}
                </p>
              </div>

              <div className="flex items-center gap-4 p-4 border border-gold/20 bg-gold/5 rounded-2xl">
                 <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gold/80 font-semibold mb-1">Porta Simbólica Associada</p>
                    <p className="text-lg font-display text-foreground">{comparativo?.porta}</p>
                  </div>
              </div>
            </CardContent>
          </Card>

          <div className="pt-4">
            <GuardiaLeituraChat 
              contextPage="oracular_resultado"
              welcomeMessage="O diálogo entre o funcional e o oracular não busca correção. Busca consciência. Como você recebe este comparativo?"
              defaultOpen={true}
            />
          </div>

          <div className="flex justify-center pt-8">
            <Button variant="ghost" onClick={() => navigate('/ferramentas')} className="text-muted-foreground">
              Retornar às ferramentas
            </Button>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
