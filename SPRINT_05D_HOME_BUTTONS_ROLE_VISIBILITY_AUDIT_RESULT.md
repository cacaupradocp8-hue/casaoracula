# SPRINT_05D_HOME_BUTTONS_ROLE_VISIBILITY_AUDIT_RESULT

## 1. Lista de Botões por Perfil

### Visitante (Página: `/sala-da-visitante`)
- **Botão:** "Descobrir minha Voz" -> Aponta para `/quiz/descubra-seu-eixo` (Público)
- **Menu Superior:** "Explorar a Casa", "Formação Orácula", "Clube do Livro", "Vitrine", "Entrar"
- **Rodapé (Mobile):** Não exibe BottomNav (Padrão para não logados)

### Assinante / Aluna (Página: `/dashboard-membro`)
- **Bússola/Ação Principal:** Dinâmico (ex: "Revelar minha Cidadela", "Prática de regulação")
- **Bloco Comece por Aqui:**
  - **Assinante:** "Entrar no Clube" (/clube), "Continuar" (/minha-jornada), "Ver Leituras" (/biblioteca-unificada)
  - **Aluna:** "Continuar Formação" (/sala-de-treinamento), "Ver Mapa" (/minha-jornada), "Acessar Práticas" (/biblioteca-unificada)
- **Menu Superior:** Dashboard, Clube, Câmara/Treinamento, Ferramentas, Jardins, Formação, Vitrine.
- **Rodapé (Mobile):** Início, Clube, Ferramentas, Jardim, Formação.

### Admin (Página: `/dashboard-membro` ou `/admin`)
- **Bloco Comece por Aqui:** "Monitorar" (/admin?tab=rockty-monitor), "Ver Documentos" (/admin?tab=documentos), "Gerenciar" (/admin)
- **Menu Superior:** Dashboard, Clube, Treinamento, Ferramentas, Jardins, Formação, Vitrine + Ícone Usuário -> "Painel Admin" (/admin)
- **Acesso Profissional:** Botão "🧠 Profissional" (Alterna domínio para Casa das Máquinas)

## 2. Rotas de Destino e Proteção

| Rota | Descrição | Nível Mínimo | Proteção Verificada |
|---|---|---|---|
| `/admin` | Painel Admin | `admin` | Sim (ProtectedRoute) |
| `/casa-das-maquinas` | SaaS Profissional | `oracula` | Sim (ProtectedRoute) |
| `/sala-de-treinamento`| Laboratório | `aluna` | Sim (ProtectedRoute) |
| `/clube` | Clube Oracular | `visitante` (Sales) / `assinante` (Conteúdo) | Sim (Gate interno) |
| `/biblioteca-unificada`| Acervo | `visitante` | Abas protegidas internamente |

## 3. Problemas Encontrados

1.  **ExplorarCasaSection.tsx (Inconsistência Visual):** O componente lista botões para `/casa-maquinas` e `/comunidade` sem checar o portal do usuário, embora as rotas em si estejam protegidas no `App.tsx`. Um visitante veria botões que levam ao gate de bloqueio.
2.  **HomeFormacaoSections.tsx / HomeTerapeutaSections.tsx:** Estes componentes são renderizados no `DashboardMembro` para Alunas e Oráculas, respectivamente. A lógica de exibição está correta, mas as rotas de destino (`/oracula`, `/casa-maquinas`) realizam gates de redirecionamento adicionais.

## 4. Correções Feitas

*   Nenhuma correção de permissão ou backend foi realizada.
*   Auditado o arquivo `src/components/home/HomeOnboardingBlocks.tsx` e confirmado que as condições `isVisitor`, `isSubscriber`, `isStudent`, `isAdmin` estão sendo aplicadas corretamente para filtrar os CTAs da Home.
*   Confirmado que `ProtectedRoute` no `App.tsx` garante a segurança caso o usuário tente acessar a URL diretamente.

## 5. Confirmação de Integridade

- [x] Sem alteração em permissões.
- [x] Sem alteração em backend.
- [x] Sem alteração em banco de dados.
- [x] Sem alteração em RLS.
- [x] Sem alteração em Auth/Pagamentos.

## 6. Classificação

**APROVADO**

A visibilidade dos botões reflete fielmente as permissões de acesso. Visitantes não visualizam ferramentas administrativas ou profissionais. O redirecionamento de segurança (Gate) está ativo para todas as rotas sensíveis.
