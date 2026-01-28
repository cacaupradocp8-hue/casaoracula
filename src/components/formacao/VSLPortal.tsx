import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface VSLPortalProps {
  videoUrl?: string;
  onVideoEnd?: () => void;
}

export function VSLPortal({ videoUrl, onVideoEnd }: VSLPortalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
      setHasStarted(true);
    }
    setIsPlaying(!isPlaying);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setShowControls(true);
    onVideoEnd?.();
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Hide controls after 3 seconds of playing
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    } else {
      setShowControls(true);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying]);

  // Determine if it's an embed URL (YouTube/Vimeo) or direct video
  const isEmbedUrl = videoUrl?.includes('youtube') || 
                     videoUrl?.includes('youtu.be') || 
                     videoUrl?.includes('vimeo');

  const getEmbedUrl = (url: string): string => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=0&rel=0&modestbranding=1`;
    }
    // Vimeo
    const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=0`;
    }
    return url;
  };

  if (!videoUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="text-center px-6"
        >
          <div className="w-20 h-20 mx-auto mb-8 rounded-full border border-gold/30 flex items-center justify-center">
            <Play className="w-8 h-8 text-gold/50" />
          </div>
          <p className="text-muted-foreground text-lg font-body">
            O vídeo será disponibilizado em breve.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="w-full max-w-4xl"
      >
        <div 
          className="relative aspect-video rounded-lg overflow-hidden bg-black/40 shadow-2xl"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => isPlaying && setShowControls(false)}
        >
          {isEmbedUrl ? (
            <iframe
              src={getEmbedUrl(videoUrl)}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Vídeo da Formação ORÁCULA"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-cover"
                onEnded={handleVideoEnd}
                playsInline
              />
              
              {/* Play/Pause Overlay */}
              <AnimatePresence>
                {(!hasStarted || showControls) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/20"
                  >
                    <button
                      onClick={handlePlayPause}
                      className="w-20 h-20 rounded-full bg-gold/90 hover:bg-gold flex items-center justify-center transition-all transform hover:scale-105 shadow-lg"
                    >
                      {isPlaying ? (
                        <Pause className="w-8 h-8 text-background" />
                      ) : (
                        <Play className="w-8 h-8 text-background ml-1" />
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mute Button */}
              <AnimatePresence>
                {showControls && hasStarted && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={toggleMute}
                    className="absolute bottom-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 text-foreground" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-foreground" />
                    )}
                  </motion.button>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
