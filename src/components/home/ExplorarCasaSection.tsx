import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, Wrench, Users, Compass, Map } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const espacos = [
  { label: 'Clube de Leitura', icon: BookOpen, path: '/clube-livro', desc: 'Leitura simbólica e reflexão' },
  { label: 'Formação', icon: GraduationCap, path: '/oracula', desc: 'Estudo do Método Orácula' },
  { label: 'Sala de Treinamento', icon: Compass, path: '/sala-de-treinamento', desc: 'Prática e simulação' },
  { label: 'Casa das Máquinas', icon: Wrench, path: '/casa-maquinas', desc: 'SaaS profissional' },
  { label: 'Comunidade', icon: Users, path: '/comunidade', desc: 'Trocas e aprofundamento' },
  { label: 'Mapa da Casa', icon: Map, path: '/mapa-casa', desc: 'Navegue pelo ecossistema' },
];

export function ExplorarCasaSection() {
  const navigate = useNavigate();

  return (
    <section className="px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">
            Explorar a Casa
          </h2>
          <p className="text-muted-foreground text-sm">
            Os principais espaços do ecossistema Casa Orácula
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {espacos.map((e, i) => {
            const Icon = e.icon;
            return (
              <motion.div
                key={e.path}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                <Card
                  className="border-border/30 hover:border-primary/30 bg-card/50 backdrop-blur-sm cursor-pointer group transition-all duration-300 hover:shadow-lg"
                  onClick={() => navigate(e.path)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/25 transition-all">
                      <Icon className="w-5 h-5 text-primary opacity-70 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                      {e.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 hidden sm:block">{e.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
