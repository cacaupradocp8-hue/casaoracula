import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Testimonial {
  nome: string;
  texto: string;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    nome: 'Marina',
    texto: 'Não mudou minha vida. Mas organizou algo que eu nunca tinha conseguido nomear.',
  },
  {
    nome: 'Carla',
    texto: 'Finalmente parei de correr atrás de respostas que não eram minhas.',
  },
  {
    nome: 'Renata',
    texto: 'Sete dias. Sem pressa. Foi o tempo certo.',
  },
];

export function TravessiaTestimonials() {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'travessia_zero_depoimentos')
          .single();

        if (!error && data?.value) {
          const parsed = JSON.parse(data.value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTestimonials(parsed);
          }
        }
      } catch {
        // Use defaults
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <div className="mt-12 pt-8 border-t border-border/50 space-y-8">
      {/* Vozes da Travessia */}
      <section>
        <h2 className="font-display text-lg font-semibold text-muted-foreground mb-6 text-center tracking-wide uppercase">
          Vozes da Travessia
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card/50 border-border/50">
              <CardContent className="p-5">
                <blockquote className="text-foreground/90 text-sm leading-relaxed italic mb-3">
                  "{testimonial.texto}"
                </blockquote>
                <p className="text-right text-muted-foreground text-sm">
                  — {testimonial.nome}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Conheça a Casa */}
      <section className="text-center py-8">
        <Button
          size="lg"
          variant="outline"
          className="border-gold/30 hover:border-gold/60 hover:bg-gold/5 text-foreground"
          onClick={() => navigate('/tour')}
        >
          <span className="mr-2">🜂</span>
          Conheça a Casa Orácula
        </Button>
        <p className="text-sm text-muted-foreground mt-3">
          Sem pressa. Apenas quando fizer sentido.
        </p>
      </section>
    </div>
  );
}
