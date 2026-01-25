import { useState } from 'react';
import { useNarroterapiaAutorizacaoAdmin } from '@/hooks/useNarroterapiaAutorizacao';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Loader2, 
  Shield, 
  ShieldOff, 
  ShieldCheck, 
  Search,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Profile {
  id: string;
  nome: string | null;
  email: string | null;
}

interface AutorizacaoWithProfile {
  id: string;
  user_id: string;
  autorizado: boolean;
  selo_ativo: boolean;
  suspenso: boolean;
  suspenso_em: string | null;
  motivo_suspensao: string | null;
  movimento_4_selado_em: string | null;
  created_at: string;
  profiles: Profile | null;
}

export default function AdminNarroterapiaAutorizacaoTab() {
  const { autorizacoes, isLoading, suspender, reativar, isSuspendendo, isReativando } = useNarroterapiaAutorizacaoAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [suspendDialog, setSuspendDialog] = useState<{ open: boolean; id: string; nome: string }>({ 
    open: false, 
    id: '', 
    nome: '' 
  });
  const [motivoSuspensao, setMotivoSuspensao] = useState('');

  const filteredAutorizacoes = (autorizacoes as AutorizacaoWithProfile[] | undefined)?.filter((auth) => {
    if (!searchTerm) return true;
    const nome = auth.profiles?.nome?.toLowerCase() || '';
    const email = auth.profiles?.email?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return nome.includes(search) || email.includes(search);
  });

  const handleSuspender = async () => {
    if (!suspendDialog.id || !motivoSuspensao.trim()) return;
    
    try {
      await suspender(suspendDialog.id, motivoSuspensao);
      setSuspendDialog({ open: false, id: '', nome: '' });
      setMotivoSuspensao('');
    } catch (error) {
      console.error('Erro ao suspender:', error);
    }
  };

  const handleReativar = async (id: string) => {
    try {
      await reativar(id);
    } catch (error) {
      console.error('Erro ao reativar:', error);
    }
  };

  const getStatusBadge = (auth: AutorizacaoWithProfile) => {
    if (auth.suspenso) {
      return (
        <Badge variant="destructive" className="gap-1">
          <ShieldOff className="w-3 h-3" />
          Suspenso
        </Badge>
      );
    }
    if (auth.autorizado && auth.selo_ativo) {
      return (
        <Badge className="gap-1 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          <ShieldCheck className="w-3 h-3" />
          Autorizada
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="gap-1">
        <Shield className="w-3 h-3" />
        Em andamento
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold" />
            Autorizações Narroterapia
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie as autorizações do Ritual de Narroterapia Oracular™
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {autorizacoes?.filter((a: AutorizacaoWithProfile) => a.autorizado && a.selo_ativo && !a.suspenso).length || 0}
                </p>
                <p className="text-xs text-muted-foreground">Autorizadas Ativas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <ShieldOff className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {autorizacoes?.filter((a: AutorizacaoWithProfile) => a.suspenso).length || 0}
                </p>
                <p className="text-xs text-muted-foreground">Suspensas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Shield className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {autorizacoes?.filter((a: AutorizacaoWithProfile) => !a.autorizado).length || 0}
                </p>
                <p className="text-xs text-muted-foreground">Em Andamento</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <Card className="bg-card/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuária</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Autorização</TableHead>
                <TableHead>Motivo Suspensão</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!filteredAutorizacoes?.length ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhuma autorização encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredAutorizacoes.map((auth) => (
                  <TableRow key={auth.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{auth.profiles?.nome || 'Sem nome'}</p>
                        <p className="text-xs text-muted-foreground">{auth.profiles?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(auth)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {auth.movimento_4_selado_em 
                        ? format(new Date(auth.movimento_4_selado_em), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                        : '—'
                      }
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {auth.motivo_suspensao || '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      {auth.autorizado && !auth.suspenso && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSuspendDialog({ 
                            open: true, 
                            id: auth.id, 
                            nome: auth.profiles?.nome || 'Usuária' 
                          })}
                          disabled={isSuspendendo}
                          className="text-destructive border-destructive/30 hover:bg-destructive/10"
                        >
                          <ShieldOff className="w-3 h-3 mr-1" />
                          Suspender
                        </Button>
                      )}
                      {auth.suspenso && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReativar(auth.id)}
                          disabled={isReativando}
                          className="text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
                        >
                          {isReativando ? (
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          ) : (
                            <ShieldCheck className="w-3 h-3 mr-1" />
                          )}
                          Reativar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Suspend Dialog */}
      <Dialog open={suspendDialog.open} onOpenChange={(open) => {
        if (!open) {
          setSuspendDialog({ open: false, id: '', nome: '' });
          setMotivoSuspensao('');
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Suspender Autorização
            </DialogTitle>
            <DialogDescription>
              Você está prestes a suspender a autorização de <strong>{suspendDialog.nome}</strong> para a Narroterapia Oracular™.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo da suspensão *</Label>
              <Textarea
                id="motivo"
                placeholder="Descreva o motivo da suspensão..."
                value={motivoSuspensao}
                onChange={(e) => setMotivoSuspensao(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSuspendDialog({ open: false, id: '', nome: '' })}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleSuspender}
              disabled={!motivoSuspensao.trim() || isSuspendendo}
            >
              {isSuspendendo ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ShieldOff className="w-4 h-4 mr-2" />
              )}
              Confirmar Suspensão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
