# Go-Live Checklist Casa Orácula 2.0

## 1. Status de lançamento

`CASA_ORACULA_2_0_GO_LIVE_READY`

A aplicação está tecnicamente validada e pronta para o lançamento oficial. O sucesso do Go-Live depende do cumprimento rigoroso deste checklist operacional.

## 2. Escopo incluído no Go-Live 2.0

- **Experiência Pública**: Sala da Visitante, Primeira Leitura Orácula e Quiz da Voz.
- **Identidade e Acesso**: Fluxos de Auth (Login/Cadastro/Recuperação) ajustados para mobile.
- **Experiência de Membro**: Dashboard essencial e Escola de Formação.
- **Conteúdo Pedagógico**: Gestão de Cursos, Portais e Travessias.
- **Segurança Operacional**: Sistema de Soft Delete funcional e proteção contra exclusão física no Admin.
- **Filtros Inteligentes**: Ocultação automática de conteúdos arquivados para alunas.
- **Mobile**: Experiência pública validada em breakpoints críticos.

## 3. Fora do Go-Live 2.0 (V2.1 ou posterior)

- Atlas operacional (funcionalidades de IA);
- Syntheia e assistentes inteligentes;
- Casa das Máquinas e Jardim da Heroína avançados;
- Logs complexos de auditoria e gestão de permissões granulares;
- Interface de restauração para registros arquivados;
- Refactors estruturais amplos e novas funcionalidades de gamificação.

## 4. Checklist pré-deploy

- [ ] Confirmar branch de produção e último commit estável.
- [ ] Validar integridade local (`git status`).
- [ ] Executar `npx tsc --noEmit` (sucesso obrigatório).
- [ ] Executar `npm run build` (sucesso obrigatório).
- [ ] Confirmar que todas as migrations foram aplicadas no ambiente de produção.
- [ ] Verificar conexão com Supabase e atualização de types.
- [ ] Validar configuração de variáveis de ambiente no serviço de hospedagem.
- [ ] Testar URLs de redirect de autenticação.
- [ ] Confirmar acessibilidade das rotas públicas sem login.
- [ ] Garantir que o Admin não possui botões de "Excluir" (apenas "Arquivar").

## 5. Variáveis de ambiente

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_DOMAIN` (domínio de produção)
- `VITE_AUTH_REDIRECT_URL`
- `SMTP_HOST` / `SMTP_PORT` (envio de e-mails)
- `EMAIL_FROM` (remetente oficial)
- `VITE_ANALYTICS_ID` (se aplicável)

## 6. Checklist de rotas públicas pós-deploy

| Rota | Esperado |
| :--- | :--- |
| `/` | Abre sem login (Welcome) |
| `/sala-da-visitante` | Abre sem login |
| `/primeira-leitura` | Abre sem login |
| `/quiz/voz-da-alma` | Abre sem login |
| `/auth` | Login/cadastro funcional |

## 7. Checklist de rotas protegidas pós-deploy

As rotas abaixo **devem** redirecionar para `/auth` se acessadas sem login:
- `/admin`
- `/dashboard-membro`
- `/cursos/*`
- `/travessias/*`
- `/cidadela`

## 8. Checklist de fluxos pós-deploy

### Visitante
- [ ] Abrir Sala da Visitante e clicar no CTA.
- [ ] Completar a Primeira Leitura e ver o resultado simbólico.
- [ ] Encontrar o CTA final para cadastro/login.

### Quiz da Voz
- [ ] Responder ao quiz e chegar à tela de resultado.

### Auth
- [ ] Criar uma nova conta de teste.
- [ ] Realizar logout e login subsequente.

### Aluna / Admin
- [ ] Confirmar que cursos arquivados não aparecem no catálogo da aluna.
- [ ] No Admin, arquivar um item e confirmar que ele permanece no banco (via Supabase Dashboard).

## 9. Checklist mobile pós-deploy

Testar em 320px, 360px, 390px, 430px e 768px:
- [ ] Sem barra de rolagem horizontal (overflow).
- [ ] Botões com área de toque mínima de 44px.
- [ ] Formulário de login sem teclado sobrepondo campos essenciais.
- [ ] Textos da Sala da Visitante legíveis.

## 10. Monitorização primeiras 24h

- Monitorar `Console Errors` (Sentry/LogRocket se houver).
- Acompanhar taxas de sucesso em `supabase.auth` (logs de cadastro).
- Verificar logs de submissão de Quiz.
- Checar feedback inicial de usuárias via suporte.

## 11. Plano de rollback

1. **Frontend**: Reverter para o commit anterior (tag estável).
2. **Dados**: Migrations de schema (DDL) não devem ser revertidas sem backup completo.
3. **Crítico**: Se houver erro de dados, desativar temporariamente o acesso ao Admin.

## 12. Riscos conhecidos aceites

- Avisos de `Security Definer View` no linter Supabase (prioridade V2.1).
- Ausência de interface para "desarquivar" itens no Admin (requer intervenção manual via DB).
- Atlas e IA em modo experimental/documental.

## 13. Não fazer durante Go-Live

- ❌ Não criar novas tabelas ou colunas.
- ❌ Não alterar Row Level Security (RLS).
- ❌ Não implementar novas animações ou copy.
- ❌ Não apagar registros "para limpar o banco".

## 14. Plano V2.1 sugerido

- Ativação operacional do Atlas.
- Interface de gestão de itens arquivados.
- Auditoria completa de permissões granulares.
- Implementação de logs de auditoria técnica.

## 15. Decisão final

`CASA_ORACULA_2_0_GO_LIVE_READY`
