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
    checkoutUrl: null,
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
    price: null,
    prices: [
      { label: 'Mensal', value: 'R$ 49', period: '/mês' },
      { label: 'Anual', value: 'R$ 490', period: '/ano' },
    ],
    buttonText: 'Assinar',
    checkoutUrl: null,
  },
];

// Subtle divider component
const RitualDivider = () => (
  <div className="flex items-center justify-center py-8 sm:py-12">
    <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    <span className="mx-4 text-gold/40 text-lg">✦</span>
    <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
  </div>
);

export default function Planos() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedSubscription, setSelectedSubscription] = useState<'mensal' | 'anual'>('mensal');

  const handleSelectProduct = (product: typeof PRODUCTS[0], subscriptionType?: 'mensal' | 'anual') => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: '/planos', selectedProduct: product.id } });
      return;
    }

    if (product.checkoutUrl) {
      window.open(product.checkoutUrl, '_blank');
    } else {
      navigate('/assinatura', { state: { selectedProduct: product.id, subscriptionType } });
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Hero Section - Minimal and Ceremonial */}
        <section className="relative py-20 sm:py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent opacity-50" />
          
          <div className="container mx-auto px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center max-w-2xl mx-auto"
            >
              <span className="text-gold/60 text-2xl mb-6 block">🜂</span>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-wide mb-6">
                CAMINHOS ORÁCULA
              </h1>
              <p className="text-lg text-muted-foreground font-light tracking-wide">
                Escolha como deseja aprofundar dentro da Casa
              </p>
            </motion.div>
          </div>
        </section>

        <RitualDivider />

        {/* Context Text - Contemplative */}
        <section className="py-12 sm:py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-xl mx-auto text-center space-y-8"
            >
              <p className="text-lg sm:text-xl text-foreground/90 leading-relaxed font-light">
                Cada mulher chega até aqui em um tempo diferente.
              </p>
              <p className="text-lg sm:text-xl text-foreground/90 leading-relaxed font-light">
                Algumas precisam se ler antes de conduzir.<br />
                Outras já sentem o chamado para aprender o método e sustentar travessias.
              </p>
              <p className="text-lg sm:text-xl text-foreground font-normal leading-relaxed">
                Não há caminho melhor.<br />
                Há o caminho adequado para agora.
              </p>
              <p className="text-muted-foreground italic text-base pt-4">
                Antes de escolher, permita-se compreender com calma.
              </p>
            </motion.div>
          </div>
        </section>

        <RitualDivider />

        {/* Video Section - Centered and Framed */}
        <section className="py-12 sm:py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="font-display text-xl sm:text-2xl font-normal text-center text-foreground/90 mb-10">
                <span className="text-gold/60 mr-3">🎥</span>
                Antes de decidir, me escuta
              </h2>
              
              {/* Video Frame - Simple and Elegant */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-gold/10 via-transparent to-gold/5 rounded-xl blur-sm" />
                <div className="relative aspect-video bg-card/60 rounded-lg border border-border/30 flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center p-8">
                    <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center mx-auto mb-4">
                      <div className="w-0 h-0 border-l-[12px] border-l-gold/60 border-y-[8px] border-y-transparent ml-1" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Vídeo de orientação
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="text-center text-muted-foreground/80 italic text-sm sm:text-base leading-relaxed mt-8 max-w-lg mx-auto">
                "Se você chegou até esta sala, é porque algo em você quer aprofundar.<br />
                Mas aprofundar pode significar duas coisas diferentes…"
              </p>
            </motion.div>
          </div>
        </section>

        <RitualDivider />

        {/* Products Section - Clean Cards */}
        <section className="py-12 sm:py-24">
          <div className="container mx-auto px-6">
            <div className="space-y-8 sm:space-y-12 max-w-3xl mx-auto">
              {PRODUCTS.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card
                    className={cn(
                      "relative overflow-hidden transition-all duration-500",
                      "bg-card/40 backdrop-blur-sm",
                      "border border-border/40",
                      "hover:border-gold/20 hover:bg-card/60",
                      product.featured && "border-gold/30 bg-card/50"
                    )}
                  >
                    {product.featured && (
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                    )}
                    
                    <CardContent className="p-8 sm:p-10 lg:p-12">
                      {/* Symbol and Title */}
                      <div className="text-center mb-8">
                        <span className="text-2xl text-gold/70 block mb-4">
                          {product.symbol}
                        </span>
                        <h3 className="font-display text-2xl sm:text-3xl font-medium text-foreground tracking-wide">
                          {product.title}
                        </h3>
                        <p className="text-gold/70 text-sm sm:text-base mt-3 font-light tracking-wide">
                          {product.subtitle}
                        </p>
                        
                        {product.featured && (
                          <span className="inline-block mt-4 text-xs font-medium text-gold/60 bg-gold/5 px-4 py-1.5 rounded-full border border-gold/20">
                            Jornada Integral
                          </span>
                        )}
                      </div>
                      
                      {/* Description */}
                      <div className="mb-10">
                        <p className="text-muted-foreground whitespace-pre-line leading-relaxed text-sm sm:text-base font-light">
                          {product.description}
                        </p>
                      </div>
                      
                      {/* Pricing & CTA */}
                      <div className="border-t border-border/30 pt-8">
                        {product.prices ? (
                          <div className="space-y-6">
                            {/* Subscription Toggle */}
                            <div className="flex justify-center gap-3">
                              {product.prices.map((price) => (
                                <button
                                  key={price.label}
                                  onClick={() => setSelectedSubscription(price.label.toLowerCase() as 'mensal' | 'anual')}
                                  className={cn(
                                    "py-2.5 px-6 rounded-full text-sm font-medium transition-all duration-300",
                                    selectedSubscription === price.label.toLowerCase()
                                      ? "bg-gold/15 border border-gold/40 text-gold"
                                      : "bg-transparent border border-border/50 text-muted-foreground hover:border-gold/30 hover:text-foreground"
                                  )}
                                >
                                  {price.label}
                                </button>
                              ))}
                            </div>
                            
                            {/* Price Display */}
                            <div className="text-center">
                              <span className="text-3xl sm:text-4xl font-display font-medium text-foreground">
                                {product.prices.find(p => p.label.toLowerCase() === selectedSubscription)?.value}
                              </span>
                              <span className="text-muted-foreground text-base ml-1">
                                {product.prices.find(p => p.label.toLowerCase() === selectedSubscription)?.period}
                              </span>
                            </div>
                            
                            {/* Button */}
                            <div className="flex justify-center pt-2">
                              <Button
                                size="lg"
                                variant="outline"
                                className="px-10 py-6 text-base border-gold/30 text-foreground hover:bg-gold/10 hover:border-gold/50 hover:text-foreground transition-all duration-300 rounded-full"
                                onClick={() => handleSelectProduct(product, selectedSubscription)}
                              >
                                {product.buttonText}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {/* Price Display */}
                            <div className="text-center">
                              <span className="text-3xl sm:text-4xl font-display font-medium text-foreground">
                                {product.price}
                              </span>
                            </div>
                            
                            {/* Button */}
                            <div className="flex justify-center pt-2">
                              <Button
                                size="lg"
                                className={cn(
                                  "px-10 py-6 text-base transition-all duration-300 rounded-full",
                                  product.featured
                                    ? "bg-gold/90 text-background hover:bg-gold border-0"
                                    : "bg-transparent border border-gold/30 text-foreground hover:bg-gold/10 hover:border-gold/50"
                                )}
                                variant={product.featured ? "default" : "outline"}
                                onClick={() => handleSelectProduct(product)}
                              >
                                {product.buttonText}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    
                    {product.featured && (
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <RitualDivider />

        {/* Closing Section - Quiet and Contemplative */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-xl mx-auto text-center space-y-6"
            >
              <p className="text-lg sm:text-xl text-foreground/90 leading-relaxed font-light">
                Você não precisa decidir agora.
              </p>
              <p className="text-lg sm:text-xl text-foreground/90 leading-relaxed font-light">
                A Casa continua aberta.<br />
                As Portas não se fecham por urgência.
              </p>
              <p className="text-lg sm:text-xl text-foreground font-normal leading-relaxed pt-4">
                Escolha quando o corpo estiver de acordo.<br />
                A travessia começa no ritmo certo.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Ethical Footer - Subtle */}
        <section className="py-10 border-t border-border/20">
          <div className="container mx-auto px-6">
            <p className="text-center text-xs sm:text-sm text-muted-foreground/60 font-light">
              🔒 A Casa Orácula não substitui terapia, acompanhamento psicológico ou tratamento clínico quando necessário.
            </p>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
