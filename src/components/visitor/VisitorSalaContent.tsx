import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, MessageCircleQuestion, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCopy } from '@/hooks/useCopy';
import { useAppSettings } from '@/hooks/useAppSettings';
import { CloudflareStreamPlayer } from '@/components/video/CloudflareStreamPlayer';
import { useCloudflareVideo } from '@/hooks/useCloudflareVideo';

/**
 * VisitorSalaContent - Conteúdo da Sala de Visita (Plano Gratuito)
 * 
 * Blocos fixos (ordem obrigatória):
 * 1. Vídeo de Boas-Vindas (Cloudflare Stream - gerenciável via Admin)
 * 2. Texto curto de acolhimento (sem CTA comercial)
 * 3. Quiz da Voz (Oráculo das Perguntas)
 * 4. Ferramentas: Big Five Padrão
 * 5. Convite para a Travessia 00 (texto explicativo + botão)
 * 
 * Esta sala é o CENTRO DA EXPERIÊNCIA DA VISITANTE.
 */
export function VisitorSalaContent() {
  const navigate = useNavigate();
  const { getCopyByKey } = useCopy();
  const { getSetting } = useAppSettings();
  const { extractVideoId, isCloudflareVideoId } = useCloudflareVideo();

  // URL do vídeo configurada pelo Admin (pode ser ID ou URL do Cloudflare Stream)
  const videoUrl = getSetting('sala_visita_video_url', '');
  
  // Extract Cloudflare video ID
  const videoId = videoUrl ? (
    isCloudflareVideoId(videoUrl) ? videoUrl : extractVideoId(videoUrl)
  ) : null;

  const handleIniciarTravessia = () => {
    // Navega para a Travessia Zero (rota correta: singular)
    navigate('/travessia/travessia-zero-o-limiar-da-casa');
  };

  return (
    <div className="space-y-8">
      {/* Bloco 1: Vídeo de Boas-Vindas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden bg-card/50 border-gold/20">
          <CardContent className="p-0">
            {videoId ? (
              <CloudflareStreamPlayer
                videoId={videoId}
                title="Vídeo de Boas-Vindas"
                contextType="sala_visita"
                requiredPortal="visitante"
              />
            ) : (
              <div className="aspect-video bg-gradient-to-br from-gold/10 to-background flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-gold ml-1" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Vídeo de Boas-Vindas
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    (Configure o ID do Cloudflare Stream em Admin → Configurações)
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Bloco 2: Texto de Acolhimento */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center px-4"
      >
        <h2 className="font-display text-xl text-foreground mb-3">
          {getCopyByKey('sala_visita_titulo', 'Bem-vinda à Sala de Visita')}
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
          {getCopyByKey('sala_visita_texto', 
            'Este é o espaço onde você pode experimentar o método antes de atravessar. Sem pressa. Sem compromisso. Apenas presença.'
          )}
        </p>
      </motion.div>

      {/* Bloco 3: Oráculo de Perguntas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-purple-500/10 via-card to-card border-purple-500/30 hover:border-purple-500/50 transition-colors cursor-pointer group"
          onClick={() => navigate('/ferramentas/oraculo-perguntas')}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0 group-hover:bg-purple-500/30 transition-colors">
                <MessageCircleQuestion className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">
                  Primeiro Passo
                </span>
                <h3 className="font-display text-lg text-foreground mt-1 mb-2">
                  Oráculo de Perguntas
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Descubra qual é a pergunta que sua alma está fazendo neste momento. Um convite para ouvir antes de agir.
                </p>
                <Button
                  variant="outline"
                  className="gap-2 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                >
                  Iniciar
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bloco 4: Ferramenta - Big Five Funcional */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-blue-500/10 via-card to-card border-blue-500/30 hover:border-blue-500/50 transition-colors cursor-pointer group"
          onClick={() => navigate('/ferramenta/big5-funcional')}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0 group-hover:bg-blue-500/30 transition-colors">
                <Brain className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">
                  Ferramenta
                </span>
                <h3 className="font-display text-lg text-foreground mt-1 mb-2">
                  Big Five — Mapa dos Territórios
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Conheça seus cinco territórios internos e como eles influenciam sua forma de estar no mundo.
                </p>
                <Button
                  variant="outline"
                  className="gap-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                >
                  Acessar Ferramenta
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bloco 5: Convite para Travessia 00 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-gold/5 via-card to-card border-gold/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-gold" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-medium text-gold uppercase tracking-wider">
                  Travessia Zero
                </span>
                <h3 className="font-display text-lg text-foreground mt-1 mb-2">
                  {getCopyByKey('travessia_zero_titulo', 'Onde estou antes de tentar mudar?')}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {getCopyByKey('travessia_zero_descricao',
                    'Uma jornada de 7 dias para mapear seu ponto de partida. Sem fórmulas. Sem promessas. Apenas clareza sobre onde você está agora.'
                  )}
                </p>
                <Button
                  variant="gold"
                  onClick={handleIniciarTravessia}
                  className="gap-2"
                >
                  Iniciar Travessia 00
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
