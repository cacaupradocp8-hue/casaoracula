import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { 
  ClipboardList, 
  ChevronDown, 
  CheckCircle2, 
  XCircle, 
  Trophy,
  Eye,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface GuardiaManualProfissionalProps {
  className?: string;
}

export function GuardiaManualProfissional({ className }: GuardiaManualProfissionalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={cn("w-full", className)}>
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between p-4 hover:bg-amber-500/10 transition-colors rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm text-amber-200">Manual para Facilitadoras</p>
                <p className="text-xs text-muted-foreground">
                  Orientações para uso com clientes
                </p>
              </div>
            </div>
            <ChevronDown 
              className={cn(
                "w-5 h-5 text-amber-500 transition-transform duration-200",
                isOpen && "rotate-180"
              )} 
            />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-6">
            {/* Ordem correta */}
            <section>
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">1</span>
                Ordem correta
              </h4>
              <div className="space-y-2 text-sm pl-8">
                <p className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Primeiro: Big Five Funcional
                </p>
                <p className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Depois (se houver campo): Big Five Oracular
                </p>
                <p className="text-muted-foreground mt-2">
                  Nunca o inverso.
                </p>
              </div>
            </section>

            {/* Como apresentar */}
            <section>
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">2</span>
                Como apresentar ao cliente
              </h4>
              <div className="space-y-3 text-sm pl-8">
                <div className="bg-muted/50 rounded-lg p-3 border-l-2 border-primary">
                  <p className="italic text-muted-foreground">
                    "Este primeiro mapa mostra como você tende a funcionar no dia a dia. 
                    Ele não explica sua história, só organiza padrões."
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Depois, se aplicar o Oracular:
                </p>
                <div className="bg-muted/50 rounded-lg p-3 border-l-2 border-gold">
                  <p className="italic text-muted-foreground">
                    "Este segundo mapa não fala de comportamento. 
                    Ele aponta um campo interno em movimento."
                  </p>
                </div>
              </div>
            </section>

            {/* Como devolver */}
            <section>
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">3</span>
                Como devolver o resultado
              </h4>
              <div className="space-y-2 text-sm pl-8">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <span>Escolher apenas um fator</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <span>Ler uma frase</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <span>Pausar</span>
                </div>
                <p className="text-muted-foreground mt-2 italic">
                  Silêncio é parte da devolutiva.
                </p>
              </div>
            </section>

            {/* O que observar */}
            <section>
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">4</span>
                O que observar (mais importante que falar)
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm pl-8">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span>tensão corporal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span>respiração</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span>defesa imediata</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span>alívio súbito</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span>necessidade de justificar</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 pl-8 italic">
                Nada disso é comentado na hora.
              </p>
            </section>

            {/* O que é proibido */}
            <section className="bg-destructive/10 rounded-lg p-4 -mx-2">
              <h4 className="font-medium text-sm mb-3 text-destructive flex items-center gap-2">
                ⚠️ O que é PROIBIDO em atendimento
              </h4>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-destructive/80">
                  <XCircle className="w-4 h-4" />
                  "Isso explica por que você é assim"
                </p>
                <p className="flex items-center gap-2 text-destructive/80">
                  <XCircle className="w-4 h-4" />
                  "Seu problema está aqui"
                </p>
                <p className="flex items-center gap-2 text-destructive/80">
                  <XCircle className="w-4 h-4" />
                  "Você precisa desenvolver esse fator"
                </p>
                <p className="flex items-center gap-2 text-destructive/80">
                  <XCircle className="w-4 h-4" />
                  Comparar cliente com padrões "ideais"
                </p>
              </div>
            </section>

            {/* Frases permitidas */}
            <section>
              <h4 className="font-medium text-sm mb-3 text-green-400">
                ✓ Frases Permitidas (Âncoras Éticas)
              </h4>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-green-400/80">
                  <CheckCircle2 className="w-4 h-4" />
                  "Isso descreve um funcionamento, não uma identidade."
                </p>
                <p className="flex items-center gap-2 text-green-400/80">
                  <CheckCircle2 className="w-4 h-4" />
                  "Esse mapa não pede ação imediata."
                </p>
                <p className="flex items-center gap-2 text-green-400/80">
                  <CheckCircle2 className="w-4 h-4" />
                  "Vamos apenas observar."
                </p>
              </div>
            </section>

            {/* Regra de ouro */}
            <section className="bg-gold/10 rounded-lg p-4 -mx-2 border border-gold/30">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-gold" />
                <h4 className="font-medium text-gold">Regra de Ouro Clínica</h4>
              </div>
              <div className="mt-3 text-sm space-y-1">
                <p className="text-muted-foreground">
                  Se o mapa virar <strong className="text-foreground">explicação</strong>, ele perdeu a função.
                </p>
                <p className="text-muted-foreground">
                  Se virar <strong className="text-foreground">espelho silencioso</strong>, cumpriu o papel.
                </p>
              </div>
            </section>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
