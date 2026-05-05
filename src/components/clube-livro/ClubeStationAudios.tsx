import { Play, Headphones, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const STATION_AUDIOS = [
  { id: 1, title: 'O Chamado da Mulher Selvagem', duration: '12:45' },
  { id: 2, title: 'A Perda do Instinto', duration: '15:20' },
  { id: 3, title: 'A Domesticação', duration: '18:10' },
  { id: 4, title: 'A Descida', duration: '22:30' },
  { id: 5, title: 'O Corpo como Oráculo', duration: '14:55' },
];

export function ClubeStationAudios() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-6 pt-4"
    >
      <div className="flex items-center gap-3 px-2">
        <Headphones className="w-4 h-4 text-gold/60" />
        <h3 className="text-[10px] font-display uppercase tracking-[0.4em] text-gold/60">Áudios da Estação</h3>
      </div>

      <div className="space-y-3">
        {STATION_AUDIOS.map((audio) => (
          <Card key={audio.id} className="border-gold/10 bg-midnight/20 hover:bg-midnight/40 transition-all group overflow-hidden">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/5 flex items-center justify-center border border-gold/10 text-gold/40 group-hover:text-gold transition-colors">
                  <span className="text-xs font-mono">{audio.id}</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground/90">Áudio {audio.id} — {audio.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-muted-foreground/40" />
                    <span className="text-[10px] text-muted-foreground/60 tabular-nums">{audio.duration}</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full text-gold/60 hover:text-gold hover:bg-gold/10"
              >
                <Play className="w-4 h-4 fill-current" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
