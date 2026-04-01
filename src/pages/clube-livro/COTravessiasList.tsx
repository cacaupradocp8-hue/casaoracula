import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, Compass, Flame, Shield } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useCOTravessias, useProgressoTravessia, type COTravessia } from '@/hooks/useCOTravessias';

const nivelConfig = {
  iniciante: { label: 'Iniciante', icon: Compass, color: 'text-emerald-400' },
  intermediario: { label: 'Intermediário', icon: Flame, color: 'text-amber-400' },
  avancado: { label: 'Avançado', icon: Shield, color: 'text-rose-400' },
};

function TravessiaCard({ travessia }: { travessia: COTravessia }) {
  const navigate = useNavigate();
  const { total, completados } = useProgressoTravessia(travessia.id);
  const percent = Math.round((completados / total) * 100);
  const cfg = nivelConfig[travessia.nivel];
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        className="border-border/12 bg-card/40 backdrop-blur-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer group"
        onClick={() => navigate(`/clube-livro/travessia/${travessia.id}`)}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${cfg.color}`} />
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-border/20">
                {cfg.label}
              </Badge>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-foreground transition-colors" />
          </div>

          <h3 className="font-display text-lg text-foreground mb-1">{travessia.titulo}</h3>
          {travessia.livro_base && (
            <p className="text-[11px] text-muted-foreground/50 italic mb-2">
              <BookOpen className="w-3 h-3 inline mr-1" />
              {travessia.livro_base}
            </p>
          )}
          <p className="text-sm text-muted-foreground/70 leading-relaxed mb-4 line-clamp-2">
            {travessia.descricao}
          </p>

          <Progress value={percent} className="h-1.5 mb-2" />
          <div className="flex justify-between">
            <p className="text-[11px] text-muted-foreground/50">
              {completados} de {total} encontros
            </p>
            <p className="text-[11px] font-medium text-primary/70">{percent}%</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function COTravessiasList() {
  const { data: travessias = [], isLoading } = useCOTravessias();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground/60 mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Início</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/clube-livro" className="hover:text-foreground transition-colors">Círculos de Leitura</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground/80">Travessias</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-primary/50 text-[10px] uppercase tracking-[0.3em] mb-2">Jornadas Estruturadas</p>
          <h1 className="text-3xl md:text-4xl font-display text-foreground mb-3">Travessias do Clube</h1>
          <p className="text-muted-foreground max-w-xl mb-10">
            Cada travessia é um caminho de 4 encontros. Você avança no seu ritmo, com práticas e reflexões que aprofundam a leitura simbólica.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 rounded-lg bg-muted/20 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {travessias.map(t => (
              <TravessiaCard key={t.id} travessia={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
