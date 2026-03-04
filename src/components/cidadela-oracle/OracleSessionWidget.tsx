import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Search, Users, Zap } from 'lucide-react';
import { useCidadelaOracle, FAMILY_ICONS, type CidadelaCard } from '@/hooks/useCidadelaOracle';
import { OracleCardVisual } from './OracleCardVisual';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  clientId?: string;
  districtId?: string;
  checkinState?: string;
  onUseCard: (card: CidadelaCard) => void;
}

export function OracleSessionWidget({ clientId, districtId, checkinState, onUseCard }: Props) {
  const { cards, isLoading, drawRandom, drawThree, suggestContextual } = useCidadelaOracle();
  const [mode, setMode] = useState('sorteio');
  const [drawnCard, setDrawnCard] = useState<CidadelaCard | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [threeCards, setThreeCards] = useState<CidadelaCard[]>([]);
  const [suggestion, setSuggestion] = useState<{ card: CidadelaCard; reason: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [familyFilter, setFamilyFilter] = useState('all');

  // Sorteio
  const handleDraw = () => {
    setIsRevealing(true);
    setTimeout(() => {
      const card = drawRandom(districtId);
      setDrawnCard(card);
      setIsRevealing(false);
    }, 600);
  };

  // Ressonância
  const handleDrawThree = () => {
    setThreeCards(drawThree(districtId));
  };

  // Sugestão
  const handleSuggest = () => {
    const s = suggestContextual({ districtId, checkinState });
    setSuggestion(s);
  };

  // Filtered cards for conscious choice
  const filteredCards = cards.filter(c => {
    if (familyFilter !== 'all' && c.family !== familyFilter) return false;
    if (searchTerm && !c.name.toLowerCase().includes(searchTerm.toLowerCase()) && !c.keyword?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  if (isLoading) return null;

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-[#C9A24A]" />
        <h3 className="text-sm font-semibold text-[#F5F1E8]/80">Oráculo da Sessão</h3>
        <span className="text-[10px] text-[#F5F1E8]/30">72 cartas</span>
      </div>

      <Tabs value={mode} onValueChange={setMode}>
        <TabsList className="w-full bg-[#0B1B2B]/60 border border-[#C9A24A]/10">
          <TabsTrigger value="sorteio" className="flex-1 text-xs">Sorteio</TabsTrigger>
          <TabsTrigger value="escolha" className="flex-1 text-xs">Escolha</TabsTrigger>
          <TabsTrigger value="ressonancia" className="flex-1 text-xs">Ressonância</TabsTrigger>
          <TabsTrigger value="sugestao" className="flex-1 text-xs">Sugestão</TabsTrigger>
        </TabsList>

        {/* (1) Sorteio Oracular */}
        <TabsContent value="sorteio" className="mt-4">
          <div className="flex flex-col items-center gap-4">
            {drawnCard ? (
              <>
                <OracleCardVisual card={drawnCard} isRevealing={isRevealing} />
                {drawnCard.suggested_tool && (
                  <p className="text-[10px] text-[#C9A24A]/50 mt-1">Ferramenta sugerida: {drawnCard.suggested_tool}</p>
                )}
                <div className="flex gap-2">
                  <Button variant="gold" size="sm" onClick={() => onUseCard(drawnCard)}>
                    Usar esta carta
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDraw} className="border-[#C9A24A]/20 text-[#F5F1E8]/60">
                    Sortear outra
                  </Button>
                </div>
              </>
            ) : (
              <Button variant="gold" onClick={handleDraw} className="px-8">
                <Sparkles className="h-4 w-4 mr-2" /> Sortear Carta
              </Button>
            )}
          </div>
        </TabsContent>

        {/* (2) Escolha Consciente */}
        <TabsContent value="escolha" className="mt-4 space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Buscar carta..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8] text-sm flex-1"
            />
            <Select value={familyFilter} onValueChange={setFamilyFilter}>
              <SelectTrigger className="w-40 bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {Object.entries(FAMILY_ICONS).map(([f, icon]) => (
                  <SelectItem key={f} value={f}>{icon} {f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
            {filteredCards.map(card => (
              <OracleCardVisual
                key={card.id}
                card={card}
                compact
                onClick={() => onUseCard(card)}
              />
            ))}
          </div>
        </TabsContent>

        {/* (3) Ressonância da Cliente */}
        <TabsContent value="ressonancia" className="mt-4">
          <div className="flex flex-col items-center gap-4">
            {threeCards.length > 0 ? (
              <>
                <div className="flex gap-3 justify-center flex-wrap">
                  {threeCards.map(card => (
                    <OracleCardVisual
                      key={card.id}
                      card={card}
                      compact
                      onClick={() => onUseCard(card)}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-[#F5F1E8]/40">Clique na carta que a cliente escolheu</p>
                <Button variant="outline" size="sm" onClick={handleDrawThree} className="border-[#C9A24A]/20 text-[#F5F1E8]/60">
                  Gerar novas 3
                </Button>
              </>
            ) : (
              <Button variant="gold" onClick={handleDrawThree}>
                <Users className="h-4 w-4 mr-2" /> Revelar 3 cartas
              </Button>
            )}
          </div>
        </TabsContent>

        {/* (4) Sugestão do Sistema */}
        <TabsContent value="sugestao" className="mt-4">
          <div className="flex flex-col items-center gap-4">
            {suggestion ? (
              <>
                <OracleCardVisual card={suggestion.card} />
                <p className="text-[10px] text-[#C9A24A]/60 italic">{suggestion.reason}</p>
                <div className="flex gap-2">
                  <Button variant="gold" size="sm" onClick={() => onUseCard(suggestion.card)}>
                    Usar esta carta
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSuggest} className="border-[#C9A24A]/20 text-[#F5F1E8]/60">
                    Trocar sugestão
                  </Button>
                </div>
              </>
            ) : (
              <Button variant="gold" onClick={handleSuggest}>
                <Zap className="h-4 w-4 mr-2" /> Receber sugestão
              </Button>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
