import { ShieldAlert, Star, ArrowRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export function SalaBloqueada() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <Card className="max-w-xl w-full bg-[#0A0A0B] border-primary/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <ShieldAlert className="w-40 h-40 text-primary" />
        </div>
        
        <CardContent className="p-10 space-y-8 relative z-10 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-serif text-white">Sala de Treinamento Clínico</h2>
            <p className="text-muted-foreground leading-relaxed">
              Este espaço é exclusivo para alunas da <span className="text-primary font-medium">Formação ORÁCULA</span>. 
              Aqui realizamos o treinamento técnico avançado, com camadas profundas de leitura e supervisão clínica.
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 text-left space-y-4 border border-white/5">
            <p className="text-xs font-bold uppercase tracking-widest text-primary/60">O que você encontrará aqui:</p>
            <ul className="space-y-3">
              {[
                'Simulador de casos complexos em tempo real',
                'Avaliação de transferência e contratransferência',
                'Feedback técnico detalhado por camadas',
                'Certificação de proficiência clínica'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                  <Star className="w-3 h-3 text-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <Button 
              onClick={() => navigate('/formacao')}
              className="w-full rounded-full py-7 text-lg bg-primary hover:bg-primary/90 text-black font-bold gap-2"
            >
              Conhecer a Formação <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/clube')}
              className="text-white/40 hover:text-white"
            >
              Voltar ao Clube
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}