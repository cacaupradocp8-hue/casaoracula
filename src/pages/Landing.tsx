import { Link } from 'react-router-dom';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/button';
import { 
  Compass, 
  BookOpen, 
  Sparkles, 
  Users, 
  ArrowRight,
  Eye,
  Heart,
  Shield
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-hero-radial" />
        <div className="absolute inset-0 pattern-geometric opacity-50" />
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in mb-8">
              <Logo size="lg" className="justify-center" />
            </div>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-foreground mb-8 animate-slide-up leading-tight" style={{ animationDelay: '0.2s' }}>
              A mulher contemporânea carrega uma{' '}
              <span className="text-gold-gradient font-semibold">alma antiga</span>,{' '}
              mas vive num mundo sem símbolos.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-slide-up font-light" style={{ animationDelay: '0.4s' }}>
              A Casa ORÁCULA devolve a linguagem simbólica às terapeutas, 
              ensinando-as a decodificar narrativas internas, desarmar o ego 
              e conduzir travessias sustentáveis.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <Link to="/auth">
                <Button variant="gold" size="xl" className="gap-2">
                  Entrar na Casa
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#metodologia">
                <Button variant="hero" size="xl">
                  Conhecer a Metodologia
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 border-2 border-gold/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Tríade Metodológica */}
      <section id="metodologia" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-light text-foreground mb-4">
              A Tríade Metodológica
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Três eixos que sustentam toda travessia terapêutica consciente
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <TriadeCard
              icon={<Eye className="w-8 h-8" />}
              title="Ego escolhe"
              subtitle="Eixo"
              description="O ego é o navegador consciente. Ele precisa de orientação, não de destruição. Ensinar a terapeuta a mapear o eixo de sustentação da cliente."
            />
            <TriadeCard
              icon={<Heart className="w-8 h-8" />}
              title="Neuroplasticidade sustenta"
              subtitle="Trilha"
              description="Toda mudança exige repetição consciente. A trilha neuroplástica transforma insight em hábito, símbolo em prática diária."
            />
            <TriadeCard
              icon={<Sparkles className="w-8 h-8" />}
              title="Alma dá sentido"
              subtitle="Simbólico"
              description="Sem sentido, não há sustentação. A alma fala por símbolos, e a terapeuta aprende a escutar e traduzir essa linguagem."
            />
          </div>
        </div>
      </section>

      {/* Público */}
      <section className="py-24 bg-mystical relative">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-light text-foreground mb-8">
              Para quem é a Casa ORÁCULA?
            </h2>
            
            <div className="glass rounded-2xl p-8 mb-8">
              <p className="text-lg text-foreground/90 leading-relaxed mb-6">
                Este espaço é exclusivo para <strong className="text-gold">terapeutas, psicólogas e mentoras de mulheres</strong> que 
                desejam incorporar a linguagem simbólica em sua prática profissional.
              </p>
              
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Shield className="w-5 h-5 text-gold" />
                <p className="text-sm">
                  Não é destinado a pacientes finais. Conteúdo formativo e ético para profissionais.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Compass className="w-6 h-6" />}
                title="Método Estruturado"
                description="Ferramentas práticas para aplicação clínica imediata"
              />
              <FeatureCard
                icon={<BookOpen className="w-6 h-6" />}
                title="Formação em 4 Travessias"
                description="Jornada completa de iniciação simbólica"
              />
              <FeatureCard
                icon={<Users className="w-6 h-6" />}
                title="Comunidade de Guardiãs"
                description="Rede de profissionais com supervisão ética"
              />
            </div>
          </div>
        </div>
      </section>

      {/* As 4 Travessias */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-light text-foreground mb-4">
              As 4 Travessias
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Uma jornada de formação que transforma a terapeuta em guardiã de travessias alheias
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <TravessiaCard
              number={1}
              title="O Mundo sem Símbolos"
              description="Despertar para a ausência. Reconhecer o vazio simbólico que marca nossa época."
            />
            <TravessiaCard
              number={2}
              title="A Mulher de Alma Antiga"
              description="Recuperar o que nunca se perdeu. Reconectar com a sabedoria ancestral."
            />
            <TravessiaCard
              number={3}
              title="O Código das Narrativas"
              description="Ler o que está escrito nas entrelinhas. Decodificar as histórias que não são literais."
            />
            <TravessiaCard
              number={4}
              title="A Guardiã do Caminho"
              description="Tornar-se aquela que conduz. Não ter respostas, mas saber fazer as perguntas certas."
            />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-radial opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-light text-foreground mb-6">
              Pronta para cruzar o portal?
            </h2>
            <p className="text-muted-foreground mb-8">
              A Casa ORÁCULA aguarda terapeutas que sentem o chamado para trabalhar com o simbólico.
            </p>
            <Link to="/auth">
              <Button variant="gold" size="xl" className="gap-2">
                Iniciar Jornada
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} Casa ORÁCULA. Formação simbólica para profissionais.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>Conteúdo exclusivo para terapeutas</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TriadeCard({ icon, title, subtitle, description }: { 
  icon: React.ReactNode; 
  title: string; 
  subtitle: string; 
  description: string;
}) {
  return (
    <div className="glass rounded-2xl p-8 text-center hover:shadow-glow transition-all duration-500 group">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold/20 transition-colors">
        {icon}
      </div>
      <p className="text-xs uppercase tracking-widest text-gold mb-2">{subtitle}</p>
      <h3 className="font-display text-2xl font-semibold text-foreground mb-4">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-secondary/30 border border-border/50">
      <div className="w-12 h-12 mb-4 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function TravessiaCard({ number, title, description }: { 
  number: number; 
  title: string; 
  description: string;
}) {
  return (
    <div className="glass rounded-xl p-6 flex gap-6 hover:shadow-gold transition-shadow group">
      <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
        <span className="font-display text-2xl font-bold text-gold">{number}</span>
      </div>
      <div>
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
