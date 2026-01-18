import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface ToolEthicalNoteProps {
  className?: string;
}

/**
 * Ethical note displayed on all Oracular Tools (Map/Oracle/Path)
 * Links to Casa das Tecelãs for professional sustentation
 */
export function ToolEthicalNote({ className }: ToolEthicalNoteProps) {
  const navigate = useNavigate();

  return (
    <Card className={`glass border-gold/20 ${className}`}>
      <CardContent className="py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-gold shrink-0" />
            <p className="text-sm text-foreground/80">
              O uso ético e maduro desta ferramenta é sustentado na{' '}
              <span className="text-gold font-medium">Casa das Tecelãs</span>.
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/casa-tecelas')}
          >
            Conhecer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
