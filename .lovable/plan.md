
# Reorganização Admin — Clube de Leitura Oracular

## Problema
O admin do Clube está fragmentado em múltiplos lugares (AdminBooks, AdminClubeLivroTab, AdminEstacoesTab, AdminGeradorSemanal), sem fluxo claro de criação e com funcionalidades faltando.

## Solução: Hub + Sub-páginas

### 1. Página Hub `/admin/clube-livro`
Uma página central com cards visuais que mostram o status de cada área e levam às sub-páginas:

| Card | Descrição | Rota |
|------|-----------|------|
| 📚 Livros & Acervo | CRUD de livros, metadados simbólicos, tours | `/admin/clube-livro/acervo` |
| 🔄 Ciclos & Fases | Gerenciar ciclos, semanas, fases, importar calendário | `/admin/clube-livro/ciclos` |
| 🌿 Estações | Gerenciar estações oraculares (temporadas) | `/admin/clube-livro/estacoes` |
| 🎧 Escutas & Aulas-Álbum | Aulas-álbum, escutas guiadas, blocos de aula | `/admin/clube-livro/escutas` |
| 📅 Encontros | Encontros ao vivo, replays, links | `/admin/clube-livro/encontros` |
| ⚡ Gerador Semanal | Gerar conteúdo da semana (podcast, carta, prática) | `/admin/clube-livro/gerador` |
| 🚪 Portais & Travessias | Portais vinculados a ciclos | `/admin/clube-livro/portais` |
| ⚙️ Configurações | Regras de progressão, níveis de acesso, Lab 80/20 | `/admin/clube-livro/config` |

### 2. Fluxo de criação guiado
Cada card no Hub terá um indicador de status (ex: "3 livros", "1 ciclo ativo", "Sem encontros") para que o admin saiba o que precisa ser feito.

### 3. O que muda tecnicamente
- Criar `src/pages/admin/clube/AdminClubeHub.tsx` — página hub
- Criar sub-páginas reutilizando componentes existentes (AdminClubeLivroTab, AdminEstacoesTab, etc.)
- Adicionar rotas em `adminRoutes.tsx`
- **NÃO** apagar páginas ou componentes existentes
- **NÃO** alterar lógica de negócio, hooks ou tabelas

### 4. Ordem de execução
1. Criar página Hub com cards
2. Criar sub-páginas empacotando componentes existentes
3. Registrar rotas
4. Verificar navegação

### 5. Fora de escopo (agora)
- Novos CRUDs (escutas, encontros já existem dentro do AdminClubeLivroTab)
- Alterações de banco de dados
- Mudanças na experiência da aluna
