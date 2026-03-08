import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Loader2, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FacilitadoraProfile {
  id: string; user_id: string; voz_conducao: string | null;
  especializacoes: string[]; bio: string | null; cidade: string | null;
  nome?: string; avatar_url?: string;
}

export function FacilitadoraDirectory() {
  const [profiles, setProfiles] = useState<FacilitadoraProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('facilitadora_profiles')
        .select('*')
        .eq('perfil_publico', true);
      if (data) {
        const ids = data.map(p => p.user_id);
        const { data: profs } = await supabase.from('profiles').select('id, nome, avatar_url').in('id', ids);
        const map: Record<string, { nome: string; avatar_url: string | null }> = {};
        profs?.forEach(p => { map[p.id] = { nome: p.nome || 'Facilitadora', avatar_url: p.avatar_url }; });
        setProfiles(data.map(p => ({ ...p, nome: map[p.user_id]?.nome, avatar_url: map[p.user_id]?.avatar_url })));
      }
      setLoading(false);
    };
    load();
  }, []);

  const filtered = profiles.filter(p => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (p.nome?.toLowerCase().includes(s)) ||
      (p.voz_conducao?.toLowerCase().includes(s)) ||
      (p.especializacoes?.some(e => e.toLowerCase().includes(s))) ||
      (p.cidade?.toLowerCase().includes(s));
  });

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome, especialização ou cidade..."
          className="pl-9 bg-background border-primary/10" />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          {profiles.length === 0 ? 'Nenhuma facilitadora cadastrada ainda.' : 'Nenhum resultado encontrado.'}
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map(p => (
            <Card key={p.id} className="bg-[#0F2438] border-primary/10 hover:border-primary/20 transition-all">
              <CardContent className="py-4">
                <div className="flex gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/20 text-primary">{(p.nome || '?')[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <p className="text-sm font-medium text-foreground">{p.nome}</p>
                    {p.voz_conducao && <p className="text-xs text-primary">Voz: {p.voz_conducao}</p>}
                    {p.cidade && <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {p.cidade}</p>}
                    {p.bio && <p className="text-xs text-muted-foreground/70 line-clamp-2">{p.bio}</p>}
                    {p.especializacoes?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {p.especializacoes.map(e => (
                          <Badge key={e} variant="outline" className="text-[10px] border-primary/20 text-primary/70">{e}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
