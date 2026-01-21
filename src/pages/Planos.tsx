import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Product data - can be moved to database later
const PRODUCTS = [
  {
    id: 'mentoria',
    symbol: '🜁',
    title: 'Mentoria Orácula',
    subtitle: 'Travessia pessoal da terapeuta',
    description: `A Mentoria Orácula é um ciclo de 12 meses de acompanhamento íntimo para mulheres que atuam como terapeutas, facilitadoras ou cuidadoras — mas que ainda não se leram com profundidade.

Aqui você não aprende a conduzir.
Você se deixa ser atravessada.

São 24 encontros ao vivo (2x por mês), materiais de apoio simbólico, acesso ao app e à comunidade da Casa.

A Mentoria é indicada para quem:
• Quer entrar em contato com sua própria psique antes de tocar na psique de outras
• Busca supervisão simbólica contínua
• Deseja integrar camadas pessoais antes de profissionalizar o método`,
    price: 'R$ 2.000',
    buttonText: 'Entrar na Mentoria Orácula',
    checkoutUrl: null, // Will be linked to internal checkout
    gradient: 'from-purple-900/20 to-purple-600/5',
    borderColor: 'border-purple-500/30 hover:border-purple-400/50',
    accentColor: 'text-purple-400',
  },
  {
    id: 'especializacao',
    symbol: '🜄',
    title: 'Especialização Orácula',
    subtitle: 'Formação profissionalizante em leitura simbólica da psique feminina',
    description: `A Especialização é a formação completa do Método Orácula — para quem deseja aplicar profissionalmente as ferramentas de leitura simbólica com suas clientes.

Duração: 12 meses de imersão prática e teórica
Inclui: aulas gravadas, encontros ao vivo, supervisões clínicas, materiais de apoio e acesso vitalício ao conteúdo.

A Especialização é indicada para quem:
• Já atua como terapeuta, facilitadora ou acompanhante de processos
• Deseja dominar o Mapa dos Cinco Territórios, o Oráculo dos Nove Arquétipos e a Jornada da Heroína
• Quer estruturar uma prática simbólica sólida e ética`,
    price: 'R$ 2.500',
    buttonText: 'Entrar na Especialização Orácula',
    checkoutUrl: null,
    gradient: 'from-gold/10 to-amber-600/5',
    borderColor: 'border-gold/30 hover:border-gold/50',
    accentColor: 'text-gold',
  },
  {
    id: 'caminho-completo',
    symbol: '🜃',
    title: 'Caminho Completo Orácula',
    subtitle: 'Mentoria + Especialização + Ferramentas do Método',
    description: `O Caminho Completo é a integração de toda a jornada:
você se lê, se forma e aplica — sem fragmentação.

Inclui:
• Mentoria Orácula (12 meses de acompanhamento pessoal)
• Especialização Orácula (formação profissionalizante)
• Acesso vitalício ao app e às ferramentas do método
• Supervisão estendida e materiais exclusivos

Este é o caminho para quem sente o chamado integral.
Para quem quer atravessar todas as camadas — da própria travessia à condução de outras.`,
    price: 'R$ 3.500',
    buttonText: 'Atravessar o Caminho Completo',
    checkoutUrl: null,
    gradient: 'from-rose-900/15 via-purple-900/10 to-gold/10',
    borderColor: 'border-rose-500/30 hover:border-rose-400/50',
    accentColor: 'text-rose-400',
    featured: true,
  },
  {
    id: 'assinatura',
    symbol: '🜄',
    title: 'Ferramentas do Método Orácula',
    subtitle: 'Assinatura do App',
    description: `Acesso ao app CASA ORÁCULA e suas ferramentas de leitura simbólica:
Mapa dos Cinco Territórios, Oráculo dos Nove Arquétipos, Jornada da Heroína, Labirinto das Portas e mais.

Indicado para quem:
• Já passou pela formação ou mentoria
• Deseja manter acesso contínuo às ferramentas
• Quer aplicar o método com clientes de forma autônoma

A assinatura não inclui acompanhamento ou supervisão — apenas o uso das ferramentas digitais.`,
    price: null, // Multiple prices
    prices: [
      { label: 'Mensal', value: 'R$ 49', period: '/mês' },
      { label: 'Anual', value: 'R$ 490', period: '/ano' },
    ],
    buttonText: 'Assinar',
    checkoutUrl: null,
    gradient: 'from-slate-800/30 to-slate-700/10',
    borderColor: 'border-muted-foreground/20 hover:border-muted-foreground/40',
    accentColor: 'text-muted-foreground',
  },
];

export default function Planos() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedSubscription, setSelectedSubscription] = useState<'mensal' | 'anual'>('mensal');

  const handleSelectProduct = (product: typeof PRODUCTS[0], subscriptionType?: 'mensal' | 'anual') => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: '/planos', selectedProduct: product.id } });
      return;
    }

    // Navigate to internal checkout or product page
    if (product.checkoutUrl) {
      window.open(product.checkoutUrl, '_blank');
    } else {
      navigate('/assinatura', { state: { selectedProduct: product.id, subscriptionType } });
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-transparent" />
          
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                <span className="text-gold">🜂</span> CAMINHOS ORÁCULA
              </h1>
              <p className="text-xl text-muted-foreground">
                Escolha como deseja aprofundar dentro da Casa
              </p>
            </motion.div>
          </div>
        </section>

        {/* Context Text */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-2xl mx-auto text-center space-y-6"
            >
              <p className="text-lg text-foreground/90 leading-relaxed">
                Cada mulher chega até aqui em um tempo diferente.
              </p>
              <p className="text-lg text-foreground/90 leading-relaxed">
                Algumas precisam se ler antes de conduzir.<br />
                Outras já sentem o chamado para aprender o método e sustentar travessias.
              </p>
              <p className="text-lg text-foreground/90 leading-relaxed font-medium">
                Não há caminho melhor.<br />
                Há o caminho adequado para agora.
              </p>
              <p className="text-muted-foreground italic">
                Antes de escolher, permita-se compreender com calma.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Video Section */}
        <section className="py-12 sm:py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-center mb-8">
                🎥 Antes de decidir, me escuta
              </h2>
              
              {/* Video Placeholder */}
              <div className="aspect-video bg-muted/50 rounded-xl border border-border/50 flex items-center justify-center mb-6">
                <div className="text-center p-8">
                  <p className="text-muted-foreground">
                    Espaço reservado para vídeo de orientação
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-2">
                    (3-5 minutos)
                  </p>
                </div>
              </div>
              
              <p className="text-center text-muted-foreground italic leading-relaxed">
                "Se você chegou até esta sala, é porque algo em você quer aprofundar.<br />
                Mas aprofundar pode significar duas coisas diferentes…"
              </p>
            </motion.div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:gap-10 max-w-5xl mx-auto">
              {PRODUCTS.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card
                    className={cn(
                      "relative overflow-hidden transition-all duration-300",
                      `bg-gradient-to-br ${product.gradient}`,
                      `border ${product.borderColor}`,
                      product.featured && "ring-1 ring-gold/30"
                    )}
                  >
                    {product.featured && (
                      <div className="absolute top-4 right-4">
                        <span className="text-xs font-medium text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/30">
                          Jornada Integral
                        </span>
                      </div>
                    )}
                    
                    <CardContent className="p-6 sm:p-8 lg:p-10">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10">
                        {/* Product Info */}
                        <div className="flex-1 space-y-4">
                          <div>
                            <span className={cn("text-2xl", product.accentColor)}>
                              {product.symbol}
                            </span>
                            <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-2">
                              {product.title}
                            </h3>
                            <p className={cn("text-sm font-medium mt-1", product.accentColor)}>
                              {product.subtitle}
                            </p>
                          </div>
                          
                          <div className="prose prose-sm prose-invert max-w-none">
                            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                              {product.description}
                            </p>
                          </div>
                        </div>
                        
                        {/* Pricing & CTA */}
                        <div className="lg:w-64 shrink-0 space-y-4">
                          {product.prices ? (
                            <>
                              <div className="flex gap-2">
                                {product.prices.map((price) => (
                                  <button
                                    key={price.label}
                                    onClick={() => setSelectedSubscription(price.label.toLowerCase() as 'mensal' | 'anual')}
                                    className={cn(
                                      "flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors",
                                      selectedSubscription === price.label.toLowerCase()
                                        ? "bg-gold/20 border-gold/50 text-gold"
                                        : "bg-muted/30 border-border/50 text-muted-foreground hover:border-border"
                                    )}
                                  >
                                    {price.label}
                                  </button>
                                ))}
                              </div>
                              <div className="text-center">
                                <span className="text-3xl font-bold text-foreground">
                                  {product.prices.find(p => p.label.toLowerCase() === selectedSubscription)?.value}
                                </span>
                                <span className="text-muted-foreground">
                                  {product.prices.find(p => p.label.toLowerCase() === selectedSubscription)?.period}
                                </span>
                              </div>
                              <Button
                                className="w-full"
                                variant="outline"
                                onClick={() => handleSelectProduct(product, selectedSubscription)}
                              >
                                {product.buttonText} – {selectedSubscription === 'mensal' ? 'Mensal' : 'Anual'}
                              </Button>
                            </>
                          ) : (
                            <>
                              <div className="text-center lg:text-right">
                                <span className="text-3xl font-bold text-foreground">
                                  {product.price}
                                </span>
                              </div>
                              <Button
                                className={cn(
                                  "w-full",
                                  product.featured && "bg-gold text-black hover:bg-gold/90"
                                )}
                                variant={product.featured ? "default" : "outline"}
                                onClick={() => handleSelectProduct(product)}
                              >
                                {product.buttonText}
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-b from-transparent to-card/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto text-center space-y-6"
            >
              <p className="text-lg text-foreground/90 leading-relaxed">
                Você não precisa decidir agora.
              </p>
              <p className="text-lg text-foreground/90 leading-relaxed">
                A Casa continua aberta.<br />
                As Portas não se fecham por urgência.
              </p>
              <p className="text-lg text-foreground/90 leading-relaxed font-medium">
                Escolha quando o corpo estiver de acordo.<br />
                A travessia começa no ritmo certo.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Ethical Footer */}
        <section className="py-8 border-t border-border/30">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm text-muted-foreground">
              🔒 A Casa Orácula não substitui terapia, acompanhamento psicológico ou tratamento clínico quando necessário.
            </p>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
