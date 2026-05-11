# Planejamento da Sprint 03: Arquivamento Estratégico do Módulo de Radiestesia

## 1. Escopo e Objetivo
Arquivar o módulo de Radiestesia, removendo-o da navegação principal e classificando-o como laboratório/legado externo. O objetivo é focar o ecossistema no núcleo atual (Leitura Simbólica, Clube, Formação e Syntheia), preservando o histórico e o acesso administrativo.

## 2. Inventário de Radiestesia

### 2.1 Rotas Existentes (src/App.tsx)
- `/radiestesia`: Portal principal
- `/radiestesia/leitura`: Leitura 5 Camadas
- `/radiestesia/mesa`: Mesa Radionica
- `/radiestesia/graficos`: Catálogo de Gráficos
- `/radiestesia/graficos/:slug`: Detalhe do Gráfico
- `/radiestesia/pantaculos`: Pantáculos
- `/radiestesia/cristais`: Cristais e Campos
- `/radiestesia/escala`: Escala Narrativa
- `/radiestesia/diario`: Diário de Práticas

### 2.2 Componentes e Páginas
- `src/pages/radiestesia/RadiestesiaPortal.tsx`
- `src/pages/radiestesia/Leitura5Camadas.tsx`
- `src/pages/radiestesia/MesaRadionica.tsx`
- `src/pages/radiestesia/CatalogoGraficos.tsx`
- `src/pages/radiestesia/GraficoDetalhe.tsx`
- `src/pages/radiestesia/Pantaculos.tsx`
- `src/pages/radiestesia/CristaisCampos.tsx`
- `src/pages/radiestesia/EscalaNarrativa.tsx`
- `src/pages/radiestesia/DiarioPraticas.tsx`
- `src/components/admin/AdminRadiestesiaTab.tsx`: Aba de gestão administrativa.

### 2.3 Banco de Dados (Tabelas Encontradas)
- `public.radiestesia_graficos`: Armazena o catálogo de gráficos.
- `public.radiestesia_config`: Armazena textos introdutórios e toggles de seção.
- `public.radiestesia_cristais`: Armazena dados de cristais e campos.
- Registro na tabela `public.sala_ferramentas`: Onde a ferramenta é registrada para aparecer no Hub.

### 2.4 Edge Functions e Hooks
- **Edge Functions:** Nenhuma Edge Function específica de Radiestesia foi encontrada.
- **Hooks:** `src/hooks/useRadiestesiaConfig.ts`.

## 3. Pontos de Exposição Atual
- **Hub de Ferramentas (`/ferramentas`):** Aparece como "Radiestesia & Gráficos Vibracionais".
- **Painel Admin:** Aba dedicada para gestão de gráficos, cristais e configurações.
- **Navegação:** Não há links fixos no menu lateral principal (`Navigation.tsx`), o acesso é via Hub.

## 4. Plano de Ocultação e Preservação

### 4.1 Ocultação da Navegação Principal
- **Ação:** Atualizar o registro na tabela `sala_ferramentas` onde `ferramenta_chave = 'radiestesia'` para `ativa = false`.
- **Resultado:** O card desaparece do Hub de Ferramentas para todos os perfis (Visitante, Assinante, Aluna).

### 4.2 Preservação por URL/Admin
- **Acesso Direto:** As rotas no `App.tsx` permanecem ativas. Quem tiver a URL (ex: `/radiestesia`) ainda acessa.
- **Admin:** O Painel Admin manterá a aba de Radiestesia para que o administrador possa consultar ou editar dados históricos.
- **Proteção:** As rotas no `App.tsx` serão mantidas, mas documentadas internamente como legadas.

## 5. Plano de Auditoria para Exclusão Futura
Este módulo entra em "Estado de Observação" por 6 meses.
- **Critério de Exclusão:** Se após 6 meses não houver acessos administrativos ou necessidade de consulta, os arquivos e tabelas poderão ser deletados em uma sprint futura de limpeza (Housekeeping).
- **Dependências:** Verificar se há vínculos de Radiestesia em "Travessias" ou "Jardim da Psique" antes de qualquer deleção futura.

## 6. Regras de Integridade (O que NÃO será feito)
- **NÃO APAGAR:** Nenhum arquivo `.tsx`, `.ts` ou registro de banco será deletado agora.
- **NÃO ALTERAR RLS:** As políticas de segurança permanecem iguais.
- **NÃO ALTERAR EDGE FUNCTIONS:** Nenhuma alteração em infraestrutura.
- **NÃO MEXER EM AUTH/STRIPE:** Totalmente isolado.

## 7. Plano de Rollback
1. **Restaurar no Hub:** Executar `UPDATE sala_ferramentas SET ativa = true WHERE ferramenta_chave = 'radiestesia';`.
2. **Reverter Navegação:** Caso algum link fixo tenha sido removido, restaurar o componente de origem.

## 8. Critérios de Validação
- [ ] Visitante não vê "Radiestesia" no `/ferramentas`.
- [ ] Assinante comum não vê no `/ferramentas`.
- [ ] Aluna não vê no `/ferramentas`.
- [ ] Admin consegue acessar `/radiestesia` digitando na barra de endereços.
- [ ] Admin continua vendo a aba no Painel de Administração.
- [ ] Build (`npm run build`) concluído com sucesso.
- [ ] Console do navegador sem erros de rotas órfãs.
