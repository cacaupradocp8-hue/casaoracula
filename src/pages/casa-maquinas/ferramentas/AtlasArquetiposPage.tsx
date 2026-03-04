import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Flower, AlertTriangle, MessageCircle, Shield } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function AtlasArquetiposPage() {
  const [arquetipos, setArquetipos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase
      .from('atlas_arquetipos_femininos')
      .select('*')
      .eq('ativo', true)
      .order('ordem')
      .then(({ data }) => { setArquetipos(data || []); setLoading(false); });
  }, []);

  const filtered = arquetipos.filter(a =>
    a.nome.toLowerCase().includes(search.toLowerCase()) ||
    a.territorio.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <CasaMaquinasLayout title="Atlas de Arquétipos">
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" /></div>
      </CasaMaquinasLayout>
    );
  }

  return (
    <CasaMaquinasLayout title="Atlas de Arquétipos" subtitle="Mapa navegável dos arquétipos femininos">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F5F1E8]/30" />
          <Input
            placeholder="Buscar arquétipo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8] placeholder:text-[#F5F1E8]/30"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-[#F5F1E8]/30 py-10">
            {arquetipos.length === 0 ? 'Nenhum arquétipo cadastrado no banco' : 'Nenhum resultado'}
          </p>
        ) : (
          <Accordion type="single" collapsible className="space-y-2">
            {filtered.map(a => (
              <AccordionItem key={a.id} value={a.id} className="border-[#C9A24A]/10 rounded-xl overflow-hidden bg-[#0B1B2B]/60">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-[#C9A24A]/5">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: (a.cor_acento || '#C9A24A') + '20' }}>
                      <Flower className="w-4 h-4" style={{ color: a.cor_acento || '#C9A24A' }} />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-[#F5F1E8]">{a.nome}</span>
                      <Badge variant="outline" className="ml-2 text-[8px] border-[#556B57]/30 text-[#556B57]">{a.territorio}</Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 space-y-3">
                  {/* Descrição clínica */}
                  <p className="text-xs text-[#F5F1E8]/60">{a.descricao_clinica}</p>

                  {/* Manifestações */}
                  {a.manifestacoes_frequentes && a.manifestacoes_frequentes.length > 0 && (
                    <div>
                      <h4 className="text-[10px] uppercase tracking-wider text-[#C9A24A]/60 mb-1 flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />Manifestações
                      </h4>
                      <ul className="space-y-1">
                        {a.manifestacoes_frequentes.map((m: string, i: number) => (
                          <li key={i} className="text-[11px] text-[#F5F1E8]/50 pl-3 border-l border-[#C9A24A]/10">{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Perguntas para sessão */}
                  {a.perguntas_sessao && a.perguntas_sessao.length > 0 && (
                    <div>
                      <h4 className="text-[10px] uppercase tracking-wider text-[#C9A24A]/60 mb-1">Perguntas-chave</h4>
                      <ul className="space-y-1">
                        {a.perguntas_sessao.map((p: string, i: number) => (
                          <li key={i} className="text-[11px] text-[#F5F1E8]/50 pl-3 border-l border-[#556B57]/20">{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Riscos de projeção */}
                  {a.riscos_projecao && a.riscos_projecao.length > 0 && (
                    <div>
                      <h4 className="text-[10px] uppercase tracking-wider text-red-400/60 mb-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />Riscos de Projeção
                      </h4>
                      <ul className="space-y-1">
                        {a.riscos_projecao.map((r: string, i: number) => (
                          <li key={i} className="text-[11px] text-red-400/50 pl-3 border-l border-red-400/10">{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Como trabalhar a força */}
                  {a.trabalhar_forca_sem_reforcar_ferida && (
                    <div>
                      <h4 className="text-[10px] uppercase tracking-wider text-[#556B57]/80 mb-1 flex items-center gap-1">
                        <Shield className="w-3 h-3" />Como Trabalhar a Força
                      </h4>
                      <p className="text-[11px] text-[#F5F1E8]/50">{a.trabalhar_forca_sem_reforcar_ferida}</p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </CasaMaquinasLayout>
  );
}
