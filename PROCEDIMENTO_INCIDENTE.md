# PROCEDIMENTO_INCIDENTE

## 1. Detecção
- Alerta visual no Guardiã Rockty.
- Reclamação de usuária via suporte.
- Monitoramento de logs (Edge Functions).

## 2. Triagem (Somente Leitura)
1. Verificar `webhook_logs` pelo e-mail da usuária.
2. Checar `processing_error`.
3. Validar se a pendência existe em `matriculas_pendentes`.

## 3. Resposta Padrão
- **Acesso não liberado:** Confirmar se o e-mail do signup bate com o da compra.
- **Erro de HMAC:** Notificar equipe técnica imediatamente (possível expiração de chave).
- **Duplicidade:** Ignorar se o sistema já tratou (idempotência).

## 4. Registro
Toda ocorrência deve ser registrada no Log de Incidentes da Guardiã.
