/**
 * Leitura Simbólica da Cartografia — visão da cliente no Jardim.
 * Exibe apenas a camada simbólica, sem dados técnicos.
 */
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import type { ProfileJsonFinal } from '@/lib/cartografia/montarProfileJson';

export function CartografiaSimbolica() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileJsonFinal | null>(null);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        // Client fetches their own profile
        const { data } = await supabase
          .from('co_cartografia_profile')
          .select('profile_json')
          .eq('client_user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data?.profile_json) {
          setProfile(data.profile_json as unknown as ProfileJsonFinal);
        }
      } catch (err) {
        console.error('Error loading symbolic reading:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-4 h-4 animate-spin text-primary/30" />
      </div>
    );
  }

  if (!profile?.leitura_simbolica) {
    return null;
  }

  const { leitura_simbolica, cidadela } = profile;

  return (
    <div className="space-y-5">
      {/* Frase-semente */}
      <div className="text-center py-4">
        <p className="text-sm text-foreground/60 italic leading-relaxed">
          "{leitura_simbolica.frase_semente}"
        </p>
      </div>

      {/* Blocos simbólicos */}
      <div className="space-y-3">
        <SymbolicBlock
          emoji="🌿"
          label="O que te sustenta"
          text={leitura_simbolica.forca_que_sustenta}
        />
        <SymbolicBlock
          emoji="🔥"
          label="O que pede escuta"
          text={leitura_simbolica.tensao_que_pede_escuta}
        />
        <SymbolicBlock
          emoji="🌊"
          label="O movimento necessário"
          text={leitura_simbolica.movimento_necessario}
        />
        <SymbolicBlock
          emoji="✨"
          label="Convite inicial"
          text={leitura_simbolica.convite_inicial}
        />
      </div>

      {/* CidaDELA simbólica — discreta */}
      {cidadela && (
        <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 text-center space-y-2">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary/40">
            Sua CidaDELA Interior
          </p>
          <p className="text-xs text-foreground/50 leading-relaxed">
            A porta por onde você entra é <span className="text-foreground/70">{cidadela.porta_inicial}</span>.
            {cidadela.distritos_acesos?.length > 0 && (
              <> Os distritos que pedem atenção: <span className="text-foreground/70">{cidadela.distritos_acesos.join(', ')}</span>.</>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

function SymbolicBlock({ emoji, label, text }: { emoji: string; label: string; text: string }) {
  return (
    <div className="rounded-lg bg-card/40 border border-border/10 p-3">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-sm">{emoji}</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50">{label}</span>
      </div>
      <p className="text-xs text-foreground/60 leading-relaxed">{text}</p>
    </div>
  );
}
