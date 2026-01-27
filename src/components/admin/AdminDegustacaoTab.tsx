import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Gift, 
  Check, 
  X, 
  Clock, 
  User,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  TimerOff,
  StopCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { useDegustacaoAdmin } from '@/hooks/useDegustacao';
import { cn } from '@/lib/utils';

const STATUS_CONFIG = {
  pendente: {
    label: 'Pendente',
    icon: Clock,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
  },
  aprovado: {
    label: 'Ativo',
    icon: CheckCircle,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
  },
  rejeitado: {
    label: 'Rejeitado',
    icon: XCircle,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
  },
  expirado: {
    label: 'Expirado',
    icon: TimerOff,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/10',
    borderColor: 'border-muted/30',
  },
};

type StatusType = keyof typeof STATUS_CONFIG;

// Helper to calculate time remaining
function getTimeRemaining(expiraEm: string | null): { text: string; isActive: boolean } {
  if (!expiraEm) return { text: '', isActive: false };
  
  const now = new Date();
  const expires = new Date(expiraEm);
  const diff = expires.getTime() - now.getTime();
  
  if (diff <= 0) return { text: 'Expirado', isActive: false };
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return { text: `${hours}h ${minutes}min restantes`, isActive: true };
  }
  return { text: `${minutes}min restantes`, isActive: true };
}

export function AdminDegustacaoTab() {
  const { 
    requests, 
    pendingCount,
    activeCount, 
    isLoading, 
    isProcessing,
    approveRequest, 
    rejectRequest,
    endRequest,
    refetch 
  } = useDegustacaoAdmin();
  
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'end' | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [filter, setFilter] = useState<StatusType | 'all'>('all');
  const [, setTick] = useState(0);

  // Update time remaining every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async () => {
    if (!selectedRequest || !actionType) return;

    let success = false;
    if (actionType === 'approve') {
      success = await approveRequest(selectedRequest, adminNotes);
    } else if (actionType === 'reject') {
      success = await rejectRequest(selectedRequest, adminNotes);
    } else if (actionType === 'end') {
      success = await endRequest(selectedRequest, adminNotes);
    }

    if (success) {
      setSelectedRequest(null);
      setActionType(null);
      setAdminNotes('');
    }
  };

  const openActionDialog = (requestId: string, action: 'approve' | 'reject' | 'end') => {
    setSelectedRequest(requestId);
    setActionType(action);
    setAdminNotes('');
  };

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(r => r.status === filter);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-display text-foreground flex items-center gap-2">
            <Gift className="w-5 h-5 text-gold" />
            Pedidos de Degustação
          </h2>
          <p className="text-sm text-muted-foreground">
            Gerencie solicitações de acesso temporário (24h)
          </p>
        </div>

        {pendingCount > 0 && (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            {pendingCount} pendente{pendingCount > 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'pendente', 'aprovado', 'rejeitado', 'expirado'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'gold' : 'outline'}
            size="sm"
            onClick={() => setFilter(status)}
            className="text-xs"
          >
            {status === 'all' ? 'Todos' : STATUS_CONFIG[status].label}
            {status === 'pendente' && pendingCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">
                {pendingCount}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Gift className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">
              {filter === 'all' 
                ? 'Nenhum pedido de degustação ainda.'
                : `Nenhum pedido ${STATUS_CONFIG[filter as StatusType]?.label.toLowerCase()}.`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((request) => {
            const status = request.status as StatusType;
            const config = STATUS_CONFIG[status];
            const StatusIcon = config.icon;
            const userName = request.profiles?.nome || request.profiles?.email || 'Usuário';
            const isPending = status === 'pendente';
            const isApproved = status === 'aprovado';
            const timeRemaining = getTimeRemaining(request.expira_em);

            return (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className={cn(
                  "transition-all",
                  isPending && "border-yellow-500/30 bg-yellow-500/5",
                  isApproved && timeRemaining.isActive && "border-emerald-500/30 bg-emerald-500/5"
                )}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* User Info */}
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">
                            {userName}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(request.created_at).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <Badge className={cn(
                        config.bgColor,
                        config.color,
                        config.borderColor,
                        "border"
                      )}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>

                      {/* Time Remaining for Active */}
                      {isApproved && timeRemaining.isActive && (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <Clock className="w-3 h-3 mr-1" />
                          {timeRemaining.text}
                        </Badge>
                      )}

                      {/* Actions for Pending */}
                      {isPending && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openActionDialog(request.id, 'reject')}
                            className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="gold"
                            size="sm"
                            onClick={() => openActionDialog(request.id, 'approve')}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Aprovar
                          </Button>
                        </div>
                      )}

                      {/* End button for Active */}
                      {isApproved && timeRemaining.isActive && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openActionDialog(request.id, 'end')}
                          className="text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                        >
                          <StopCircle className="w-4 h-4 mr-1" />
                          Encerrar
                        </Button>
                      )}
                    </div>

                    {/* Motivo */}
                    {request.motivo && (
                      <div className="mt-3 pt-3 border-t border-border/30">
                        <p className="text-xs text-muted-foreground">
                          <strong>Motivo:</strong> {request.motivo}
                        </p>
                      </div>
                    )}

                    {/* Admin Notes */}
                    {request.admin_notes && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">
                          <strong>Notas do admin:</strong> {request.admin_notes}
                        </p>
                      </div>
                    )}

                    {/* Expiration info for approved */}
                    {isApproved && request.expira_em && !timeRemaining.isActive && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">
                          Expirou em: {new Date(request.expira_em).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Action Dialog */}
      <Dialog 
        open={!!selectedRequest && !!actionType} 
        onOpenChange={() => {
          setSelectedRequest(null);
          setActionType(null);
          setAdminNotes('');
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionType === 'approve' ? (
                <>
                  <Check className="w-5 h-5 text-emerald-400" />
                  Aprovar Degustação
                </>
              ) : actionType === 'end' ? (
                <>
                  <StopCircle className="w-5 h-5 text-amber-400" />
                  Encerrar Degustação
                </>
              ) : (
                <>
                  <X className="w-5 h-5 text-red-400" />
                  Rejeitar Pedido
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? 'Ao aprovar, o usuário terá acesso de mentorada por 24 horas.'
                : actionType === 'end'
                ? 'O acesso será revogado imediatamente e o usuário será notificado.'
                : 'Ao rejeitar, o usuário será notificado e poderá solicitar novamente no futuro.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Notas (opcional)
            </label>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder={actionType === 'approve' 
                ? 'Mensagem de boas-vindas...'
                : actionType === 'end'
                ? 'Motivo do encerramento...'
                : 'Motivo da rejeição...'
              }
              className="min-h-[80px] resize-none"
            />
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedRequest(null);
                setActionType(null);
                setAdminNotes('');
              }}
            >
              Cancelar
            </Button>
            <Button
              variant={actionType === 'approve' ? 'gold' : actionType === 'end' ? 'outline' : 'destructive'}
              onClick={handleAction}
              disabled={isProcessing}
              className={cn("gap-2", actionType === 'end' && "text-amber-400 border-amber-500/30")}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processando...
                </>
              ) : actionType === 'approve' ? (
                <>
                  <Check className="w-4 h-4" />
                  Aprovar (24h)
                </>
              ) : actionType === 'end' ? (
                <>
                  <StopCircle className="w-4 h-4" />
                  Encerrar Agora
                </>
              ) : (
                <>
                  <X className="w-4 h-4" />
                  Rejeitar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
