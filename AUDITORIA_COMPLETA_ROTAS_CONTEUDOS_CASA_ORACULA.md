# Relatório de Auditoria: Casa Orácula
**Data:** 17 de Maio de 2026  
**Status:** Concluído

## 1. Resumo Executivo
A auditoria mapeou a arquitetura de rotas da aplicação Casa Orácula, identificando uma estrutura híbrida entre o "Clube" (B2C) e a "Casa das Máquinas" (B2B/Gestão). Foram detectadas rotas órfãs, redundâncias de navegação e pontos de melhoria na proteção de rotas dinâmicas.

---

## 2. Mapa Completo de Rotas

### Casa das Máquinas (Gestão)
| Rota | Componente | Permissão (Front) | Status |
| :--- | :--- | :--- | :--- |
| `/casa-maquinas` | `CasaMaquinasDashboard` | Autenticado | Ativa |
| `/casa-maquinas/clientes` | `ClientesPage` | Autenticado | Ativa |
| `/casa-maquinas/clientes/:id` | `ClienteDetalhePage` | Autenticado | Ativa |
| `/casa-maquinas/cabine` | `CabineTerapeutaPage` | Autenticado | Ativa |
| `/casa-maquinas/vendas` | `VendasPage` | Autenticado | Ativa |
| `/casa-maquinas/financeiro` | `FinanceiroPage` | Autenticado | Ativa |
| `/casa-maquinas/configuracoes` | `ConfiguracoesPage` | Autenticado | Ativa |

### Clube (Membros)
| Rota | Componente | Permissão (Front) | Status |
| :--- | :--- | :--- | :--- |
| `/` | `LandingPage` | Pública | Ativa |
| `/clube` | `ClubeDashboard` | Autenticado | Ativa |
| `/clube/biblioteca` | `BibliotecaConteudo` | Autenticado | Ativa |
| `/clube/jornada` | `JornadaMembro` | Autenticado | Ativa |

### Admin
| Rota | Componente | Permissão (Front) | Status |
| :--- | :--- | :--- | :--- |
| `/admin` | `AdminDashboard` | Role: Admin | Ativa |

---

## 3. Rotas e Conteúdos Especiais

### Rotas Escondidas / Debug
- `/debug/styles`: Página de guia de estilos (legada).
- `/test-connection`: Teste de Supabase.

### Rotas Duplicadas
- `/casa-maquinas/sessao` e `/casa-maquinas/cabine`: Ambas apontam para lógicas similares de atendimento, embora a `/cabine` tenha sido consolidada na Sprint 10C.

### Conteúdos Órfãos (Arquivos sem Rota)
- `src/components/old-dashboard/*`: Componentes da primeira versão não mais utilizados.
- `src/pages/Archive/*`: Páginas movidas para arquivo mas ainda no diretório.

---

## 4. Análise de Riscos

### Riscos de Segurança
- **Parâmetros de URL**: Rotas como `/casa-maquinas/clientes/:id` dependem exclusivamente do RLS do Supabase. Se o RLS falhar ou estiver em "Permissive", um usuário autenticado poderia tentar ID de terceiros.
- **Exposição de Menus**: Alguns links de Admin aparecem no DOM mesmo para usuários sem a role, embora o clique resulte em redirecionamento.

### Riscos de UX
- **Inconsistência de Navegação**: O menu lateral da Casa das Máquinas difere significativamente do Clube, o que pode confundir o administrador que também é usuário.
- **Deep Linking**: Falta de tratamento para "404 Not Found" em rotas dinâmicas de clientes inexistentes (fica em estado de Loading infinito).

---

## 5. Plano de Limpeza em 3 Fases

### Fase 1: Travar Riscos (Imediato)
- Implementar `ProtectedRoute` com validação de Role explícita para `/admin`.
- Adicionar tratamento de erro (ErrorBoundary) em rotas dinâmicas.
- Validar se todas as tabelas sensíveis têm RLS `FOR SELECT USING (auth.uid() = user_id)`.

### Fase 2: Organizar Navegação (Curto Prazo)
- Padronizar o componente de `Navbar` e `Sidebar` entre os módulos.
- Remover rotas duplicadas de "Sessão" em favor da "Cabine".
- Centralizar definições de rotas em um único arquivo de constantes.

### Fase 3: Consolidar Arquitetura (Médio Prazo)
- Deletar diretórios `old-dashboard` e `Archive`.
- Migrar componentes legados para o novo Design System da Casa Orácula.
- Implementar Lazy Loading em todas as rotas para melhorar performance.

---

**Relatório gerado por Lovable AI.**