import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Calendar, Plus, Loader2, Home, ChevronRight, Cog, Map, User,
} from 'lucide-react';
...
                    <div className="flex flex-wrap items-center gap-2">
                      <Link to={`/casa-das-maquinas/clientes/${sessao.cliente_id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <User className="w-3 h-3" /> Perfil
                        </Button>
                      </Link>
                      <Link to={`/casa-das-maquinas/mapa-vivo/${sessao.cliente_id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Map className="w-3 h-3" /> Mapa Vivo
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {hasMore && (
              <div className="text-center pt-4">
                <Button variant="outline" onClick={() => loadSessoes(page + 1)} disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Carregar mais
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Mode Selector */}
        <SessionModeSelector
          open={modeSelectorOpen}
          onSelect={handleModeSelect}
          onClose={() => setModeSelectorOpen(false)}
        />

        {/* Quick Register Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Plus className="w-5 h-5" /> Registro Rápido</DialogTitle>
              <DialogDescription>Registre uma sessão simbólica sem condução guiada.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Cliente *</Label>
                <Select value={clienteId} onValueChange={setClienteId}>
                  <SelectTrigger><SelectValue placeholder="Selecione a cliente" /></SelectTrigger>
                  <SelectContent>
                    {clientes.map(c => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Data da Sessão</Label>
                <Input type="date" value={dataSessao} onChange={(e) => setDataSessao(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Movimento Percebido</Label>
                <Select value={movimento} onValueChange={(v) => setMovimento(v as MovimentoPercebido)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {MOVIMENTOS.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nota Breve (máx. 300 caracteres)</Label>
                <Textarea value={notaBreve} onChange={(e) => setNotaBreve(e.target.value.slice(0, 300))} placeholder="Observações breves da sessão..." maxLength={300} />
                <p className="text-xs text-muted-foreground text-right">{notaBreve.length}/300</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button variant="gold" onClick={handleCreate} disabled={creating || !clienteId}>
                {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {creating ? 'Salvando...' : 'Registrar Sessão'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
