import { useState, useMemo } from 'react';
import { ContentBlock, LunarCalendarContent } from '@/types/modular';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LunarCalendarBlockProps {
  block: ContentBlock;
  onSave?: (data: { date: string; entries: DayEntry }) => void;
}

interface DayEntry {
  energy?: string;
  emotion?: string;
  intention?: string;
}

// Simple lunar phase calculation (approximate)
function getMoonPhase(date: Date): { phase: string; emoji: string; name: string } {
  const lp = 2551443; // Lunar period in seconds
  const new_moon = new Date(1970, 0, 7, 20, 35, 0); // Known new moon
  const phase = ((date.getTime() - new_moon.getTime()) / 1000) % lp;
  const phaseDay = Math.floor(phase / (24 * 3600)) % 30;
  
  if (phaseDay < 1) return { phase: 'new', emoji: '🌑', name: 'Lua Nova' };
  if (phaseDay < 7) return { phase: 'waxing_crescent', emoji: '🌒', name: 'Crescente' };
  if (phaseDay < 8) return { phase: 'first_quarter', emoji: '🌓', name: 'Quarto Crescente' };
  if (phaseDay < 14) return { phase: 'waxing_gibbous', emoji: '🌔', name: 'Gibosa Crescente' };
  if (phaseDay < 16) return { phase: 'full', emoji: '🌕', name: 'Lua Cheia' };
  if (phaseDay < 22) return { phase: 'waning_gibbous', emoji: '🌖', name: 'Gibosa Minguante' };
  if (phaseDay < 23) return { phase: 'last_quarter', emoji: '🌗', name: 'Quarto Minguante' };
  return { phase: 'waning_crescent', emoji: '🌘', name: 'Minguante' };
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export function LunarCalendarBlock({ block, onSave }: LunarCalendarBlockProps) {
  const content = block.content as LunarCalendarContent;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [entries, setEntries] = useState<Record<string, DayEntry>>({});
  const [currentEntry, setCurrentEntry] = useState<DayEntry>({});

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();
  const todayPhase = useMemo(() => getMoonPhase(today), []);

  const days = useMemo(() => {
    const result: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) result.push(null);
    for (let i = 1; i <= daysInMonth; i++) result.push(i);
    return result;
  }, [daysInMonth, firstDay]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const selectDay = (day: number) => {
    const date = new Date(year, month, day);
    setSelectedDate(date);
    const key = date.toISOString().split('T')[0];
    setCurrentEntry(entries[key] || {});
  };

  const updateEntry = (field: keyof DayEntry, value: string) => {
    setCurrentEntry(prev => ({ ...prev, [field]: value }));
  };

  const saveEntry = () => {
    if (!selectedDate) return;
    const key = selectedDate.toISOString().split('T')[0];
    setEntries(prev => ({ ...prev, [key]: currentEntry }));
    if (onSave) {
      onSave({ date: key, entries: currentEntry });
    }
  };

  const isToday = (day: number) => {
    return today.getDate() === day && 
           today.getMonth() === month && 
           today.getFullYear() === year;
  };

  const hasEntry = (day: number) => {
    const date = new Date(year, month, day);
    const key = date.toISOString().split('T')[0];
    return !!entries[key] && Object.values(entries[key]).some(v => v);
  };

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Moon className="w-5 h-5 text-gold" />
          {block.titulo || 'Calendário Lunar'}
        </CardTitle>
        {content.showPhases && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{todayPhase.emoji}</span>
            <span>Hoje: {todayPhase.name}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="font-medium">{MONTHS[month]} {year}</h3>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {WEEKDAYS.map(day => (
            <div key={day} className="text-center text-xs text-muted-foreground py-2">
              {day}
            </div>
          ))}
          {days.map((day, i) => (
            <div key={i} className="aspect-square">
              {day && (
                <button
                  onClick={() => selectDay(day)}
                  className={cn(
                    "w-full h-full rounded-lg flex flex-col items-center justify-center text-sm transition-all",
                    "hover:bg-gold/10",
                    isToday(day) && "bg-gold/20 font-bold",
                    selectedDate?.getDate() === day && 
                    selectedDate?.getMonth() === month && 
                    "ring-2 ring-gold",
                    hasEntry(day) && "bg-purple-500/10"
                  )}
                >
                  <span>{day}</span>
                  {content.showPhases && (
                    <span className="text-xs opacity-70">
                      {getMoonPhase(new Date(year, month, day)).emoji}
                    </span>
                  )}
                  {hasEntry(day) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-0.5" />
                  )}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Day Entry Form */}
        {selectedDate && (
          <div className="p-4 rounded-lg border border-border/30 bg-background/50 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">
                {selectedDate.toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </h4>
              <span className="text-lg">
                {getMoonPhase(selectedDate).emoji} {getMoonPhase(selectedDate).name}
              </span>
            </div>

            {content.showEnergyInput && (
              <div className="space-y-2">
                <Label className="text-sm">Energia do Dia</Label>
                <Input
                  placeholder="Como está sua energia hoje?"
                  value={currentEntry.energy || ''}
                  onChange={(e) => updateEntry('energy', e.target.value)}
                  className="bg-background/50"
                />
              </div>
            )}

            {content.showEmotionInput && (
              <div className="space-y-2">
                <Label className="text-sm">Emoção Principal</Label>
                <Input
                  placeholder="Qual emoção predomina?"
                  value={currentEntry.emotion || ''}
                  onChange={(e) => updateEntry('emotion', e.target.value)}
                  className="bg-background/50"
                />
              </div>
            )}

            {content.showIntentionInput && (
              <div className="space-y-2">
                <Label className="text-sm">Intenção</Label>
                <Textarea
                  placeholder="Qual sua intenção para hoje?"
                  value={currentEntry.intention || ''}
                  onChange={(e) => updateEntry('intention', e.target.value)}
                  className="bg-background/50 min-h-[80px]"
                />
              </div>
            )}

            {content.saveToRegistros && onSave && (
              <Button 
                onClick={saveEntry} 
                className="w-full bg-gold hover:bg-gold/90 text-background"
              >
                Salvar
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
