# Plano de Implementação: Sprint 03A — Ocultação Visual de Radiestesia

Este plano descreve as ações para ocultar estrategicamente o módulo de Radiestesia da navegação principal e dos hubs de ferramentas para usuárias comuns, preservando o acesso para administradores via URL direta ou Painel Admin.

---

## 1. Diagnóstico de Presença Visual
Radiestesia aparece atualmente nos seguintes locais:
1. **Hub de Ferramentas (`/ferramentas`):** Exibe cards de ferramentas como "Mesa Radiônica" e "Leitura de 5 Camadas" porque estão marcadas como `ativa=true` no banco de dados.
2. **Painel Admin:** Aba "Radiestesia" visível na barra lateral para administradores.
3. **Rotas diretas:** `/radiestesia`, `/radiestesia/mesa`, etc.

## 2. Estratégia de Ocultação (Frontend-only)
Conforme solicitado, **não haverá alterações no banco de dados** nesta fase. A ocultação será feita puramente na camada de apresentação (React).

### A. Hub de Ferramentas (`src/pages/FerramentasHub.tsx`)
- Aplicar um filtro adicional na lista de ferramentas retornada pelo Supabase.
- **Lógica:** Se a usuária não for `admin`, filtrar qualquer ferramenta cujo campo `rota` contenha a string `radiestesia`.
- **Resultado:** Visitantes, Assinantes e Alunas param de ver os cards de Radiestesia, mesmo que o banco diga que estão ativos.

### B. Navegação Principal (`src/components/layout/Navigation.tsx`)
- Verificação realizada: Radiestesia não está presente nos grupos de menu fixos (`visitanteMenuGroups`, `assinanteMenuGroups`, `alunaMenuGroups`). Nenhuma alteração necessária aqui.

### C. Admin Sidebar (`src/components/admin/AdminSidebar.tsx`)
- **Manter intacto.** O acesso deve continuar visível para administradores para que o módulo possa ser gerido/testado como "laboratório".

## 3. Preservação de Acesso
- **URL Direta:** As rotas em `src/App.tsx` não serão removidas. Qualquer pessoa com o link direto continuará acessando as páginas (protegidas por suas respectivas regras de RLS/Auth já existentes).
- **Admin Tab:** A aba `radiestesia` no Painel Admin continua funcionando normalmente.

## 4. Diagnóstico `sala_ferramentas` (Impacto de `ativa=false`)
Respondendo aos pontos de atenção solicitados:
1. **Onde é usada:** `FerramentasHub`, `AdminFerramentasTab`, `AdminModulosFormativos`, `useFerramentaDinamica`, entre outros.
2. **Impacto de `ativa=false` no Admin:** Atualmente, a maioria das queries de produção usa `.eq('ativa', true)`. Se alterássemos o banco, os administradores também parariam de ver no Hub, a menos que a query fosse ajustada para ignorar o filtro para admins.
3. **Impacto em outras ferramentas:** Nenhum. O filtro é por registro.
4. **Forma de ocultar por frontend:** Através do filtro no `filter()` do array de dados (proposta da Sprint 03A).

## 5. Plano de Rollback
Para reverter a ocultação visual:
1. Remover o filtro `.filter(t => isAdmin || !t.rota?.includes('radiestesia'))` no arquivo `src/pages/FerramentasHub.tsx`.
2. A visibilidade voltará a ser controlada exclusivamente pelo campo `ativa` do banco de dados.

## 6. Critérios de Validação
- [ ] Logado como **Visitante**: Acessar `/ferramentas` e confirmar que não há cards de Radiestesia.
- [ ] Logado como **Assinante**: Mesma validação acima.
- [ ] Logado como **Admin**: Acessar `/ferramentas` e confirmar que os cards **ainda aparecem**.
- [ ] Logado como **Admin**: Confirmar que a aba "Radiestesia" no Painel Admin está funcional.
- [ ] Acessar `/radiestesia` via URL direta e confirmar que a página carrega.
- [ ] Rodar `npm run build` para garantir que não há erros de tipagem.

---
**Confirmação:** Nenhum `UPDATE` ou alteração de esquema será realizado no banco de dados nesta fase 03A.
