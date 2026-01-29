import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const CAMINHOS = [
  {
    id: "formacao",
    symbol: "🜂",
    nome: "FORMAÇÃO ORÁCULA",
    subtitulo: "12 meses de travessia estruturada",
    preco: "R$ 7.900",
    nota: "parcelamento disponível",
    cta: "Solicitar entrada no próximo círculo",
    destaque: true
  },
  {
    id: "assinatura",
    symbol: "🜄",
    nome: "ASSINATURA CASA ORÁCULA",
    subtitulo: "Continuidade para ex-alunas",
    preco: "R$ 97 a R$ 147",
    periodo: "/mês",
    cta: "Acessar planos",
    destaque: false
  },
  {
    id: "portal",
    symbol: "🌘",
    nome: "PORTAL ESSENCIAL",
    subtitulo: "Entrada qualificada. Sem iniciação profunda.",
    preco: null,
    nota: "Plano mensal | Plano anual",
    cta: "Ver opções",
    destaque: false
  }
];

export function SectionCaminhos() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleClick = (caminhoId: string) => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: '/formacao-oracula' } });
      return;
    }
    navigate('/planos', { state: { selectedProduct: caminhoId } });
  };

  return (
    <section className="py-32 md:py-48 px-6" id="caminhos">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <span className="text-gold/50 text-2xl">🜂</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mt-4 tracking-wide">
            Os Caminhos da Casa
          </h2>
        </motion.div>

        {/* Caminhos cards */}
        <div className="space-y-8">
          {CAMINHOS.map((caminho, index) => (
            <motion.div
              key={caminho.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`
                relative p-8 md:p-12 rounded-sm border transition-all duration-500
                ${caminho.destaque 
                  ? 'bg-card/40 border-gold/30 hover:border-gold/50' 
                  : 'bg-card/20 border-border/30 hover:border-border/50'
                }
              `}
            >
              {/* Top accent line for featured */}
              {caminho.destaque && (
                <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
              )}

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl text-gold/60">{caminho.symbol}</span>
                    <h3 className="font-display text-xl md:text-2xl text-foreground tracking-wide">
                      {caminho.nome}
                    </h3>
                  </div>
                  <p className="font-body text-muted-foreground">
                    {caminho.subtitulo}
                  </p>
                </div>

                <div className="flex flex-col md:items-end gap-4">
                  {caminho.preco && (
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-2xl md:text-3xl text-foreground">
                        {caminho.preco}
                      </span>
                      {caminho.periodo && (
                        <span className="text-muted-foreground text-sm">
                          {caminho.periodo}
                        </span>
                      )}
                    </div>
                  )}
                  {caminho.nota && (
                    <p className="text-sm text-muted-foreground/70">
                      {caminho.nota}
                    </p>
                  )}
                  <Button
                    variant={caminho.destaque ? "default" : "outline"}
                    className={`
                      rounded-full px-8 py-6 text-sm tracking-wide transition-all duration-300
                      ${caminho.destaque 
                        ? 'bg-gold/90 text-background hover:bg-gold border-0' 
                        : 'border-border/50 hover:border-gold/30 hover:bg-gold/5'
                      }
                    `}
                    onClick={() => handleClick(caminho.id)}
                  >
                    {caminho.cta}
                  </Button>
                </div>
              </div>

              {/* Bottom accent line for featured */}
              {caminho.destaque && (
                <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
