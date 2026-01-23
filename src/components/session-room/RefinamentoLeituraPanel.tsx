import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DecodificacaoOnirica } from '@/components/decodificacao/DecodificacaoOnirica';
import { Sparkles, Shield, Flower2, Moon, ChevronRight } from 'lucide-react';

interface RefinamentoLeituraPanelProps {
  sessionCaseId?: string;
  clienteId?: string;
}

export function RefinamentoLeituraButton({ sessionCaseId, clienteId }: RefinamentoLeituraPanelProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [decodificacaoOpen, setDecodificacaoOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleNavigate = (path: string) => {
    setSheetOpen(false);
    navigate(path);
  };
  
  const handleOpenDecodificacao = () => {
    setSheetOpen(false);
    setDecodificacaoOpen(true);
  };
  
  const tools = [
    {
      id: 'torre-viva',
      title: 'Torre Viva™',
      description: 'Identificar estrutura de sobrevivência',
      icon: Shield,
      color: 'amber',
      action: () => handleNavigate('/torre-viva'),
    },
    {
      id: 'atlas',
      title: 'Atlas de Arquétipos',
      description: 'Consultar lâminas clínicas',
      icon: Flower2,
      color: 'gold',
      action: () => handleNavigate('/atlas-arquetipos'),
    },
    {
      id: 'decodificacao',
      title: 'Decodificação Onírica',
      description: 'Registrar e decodificar sonho',
      icon: Moon,
      color: 'purple',
      action: handleOpenDecodificacao,
    },
  ];
  
  return (
    <>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 border-gold/30 text-gold hover:bg-gold/10">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">🜂 Refinar Leitura</span>
            <span className="sm:hidden">🜂</span>
          </Button>
        </SheetTrigger>
        
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader className="mb-6">
            <Badge variant="outline" className="w-fit text-gold border-gold/30 mb-2">
              Apoio Clínico
            </Badge>
            <SheetTitle>Refinamento de Leitura Simbólica</SheetTitle>
            <SheetDescription>
              Ferramentas de apoio clínico em sessão
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-3">
            {tools.map((tool) => (
              <Card 
                key={tool.id}
                className={`cursor-pointer transition-all hover:bg-${tool.color}-500/5 hover:border-${tool.color}-500/30 group`}
                onClick={tool.action}
              >
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full bg-${tool.color}-500/20`}>
                        <tool.icon className={`w-5 h-5 text-${tool.color}-400`} />
                      </div>
                      <div>
                        <CardTitle className="text-base group-hover:text-foreground transition-colors">
                          {tool.title}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {tool.description}
                        </CardDescription>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
          
          <p className="text-xs text-muted-foreground/60 text-center mt-6">
            Uso exclusivo profissional. Não expõe resultados à cliente.
          </p>
        </SheetContent>
      </Sheet>
      
      {/* Dialog de Decodificação Onírica */}
      <Dialog open={decodificacaoOpen} onOpenChange={setDecodificacaoOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <Badge variant="outline" className="w-fit text-purple-400 border-purple-500/30 mb-2">
              Uso Profissional
            </Badge>
            <DialogTitle className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-purple-400" />
              Decodificação Onírica Aplicada
            </DialogTitle>
            <DialogDescription>
              Registro guiado para análise simbólica de sonhos
            </DialogDescription>
          </DialogHeader>
          
          <DecodificacaoOnirica
            clienteId={clienteId}
            sessionCaseId={sessionCaseId}
            onComplete={() => setDecodificacaoOpen(false)}
            onCancel={() => setDecodificacaoOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
