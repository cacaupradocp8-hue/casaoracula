# Relatório de Implementação: Sprint 03A — Ocultação Visual da Radiestesia

Este documento detalha os resultados da Sprint 03A, focada na ocultação visual e estratégica do módulo de Radiestesia, preservando o acesso legado para administradores e via URL direta.

## 1. Arquivos Alterados
- `src/pages/FerramentasHub.tsx`: Ocultação no Hub de Ferramentas.
- `src/pages/TravessiaDetalhe.tsx`: Ocultação nos recursos sugeridos dentro das Travessias (ex: Travessia 4 - Código das Narrativas).
- `src/components/jardim/JardimFirstExperience.tsx`: Ocultação nos portais sugeridos no Jardim da Psique para novas usuárias.

## 2. Filtros Adicionados
A lógica de ocultação foi aplicada de forma padronizada nos três arquivos:

- **Regra aplicada**: Filtro condicional na renderização das listas de itens.
- **Condição de privilégio**: Somente usuárias com portal diferente de `admin` são afetadas.
- **Identificação da Radiestesia**: 
  - Verificação se a propriedade `rota` ou `route` contém a string `/radiestesia`.
  - No Hub, também verifica se o nome da ferramenta contém "radiestesia" (case-insensitive).
- **Manutenção de Admin**: A variável `isAdmin` (derivada do context de Auth) é usada para ignorar os filtros de ocultação, garantindo que o ecossistema continue visível para a curadoria.

## 3. Onde Radiestesia deixou de aparecer
- **Hub de Ferramentas (`/ferramentas`)**: Não aparece mais nos cards para Visitantes, Alunas ou Assinantes.
- **Detalhe da Travessia (`/travessias/:slug`)**: Removido da seção "Recursos de Escuta" da Travessia 4.
- **Jardim da Psique (`/jardim`)**: Removido das sugestões de "Por onde começar" para perfis Profissionais e Terapeutas.

## 4. O que continua funcionando
- **Acesso por URL direta**: A rota `/radiestesia` e suas sub-rotas (ex: `/radiestesia/leitura-5-camadas`) continuam ativas para quem possui o link.
- **Painel Administrativo**: A aba `AdminRadiestesiaTab` permanece funcional e visível para administradores.
- **Dados e Estrutura**: Nenhum dado foi removido; todas as leituras e registros de radiestesia no banco de dados permanecem intactos.

## 5. Confirmações de Segurança (Não Alterados)
- **Banco de Dados**: Nenhuma alteração (`UPDATE`/`DELETE`) na tabela `sala_ferramentas`.
- **Segurança (RLS)**: Nenhuma alteração nas políticas de segurança do banco.
- **Infraestrutura**: Edge Functions, Auth e infraestrutura de e-mail não foram tocadas.
- **Permissões de Rota**: O `minPortal` das rotas no arquivo de definição de rotas não foi alterado.
- **Módulo Interno**: Nenhum arquivo dentro de `src/pages/radiestesia/` foi modificado.

## 6. Validação Técnica (Build & Typecheck)
- **Comando**: `bun x tsc --noEmit`
- **Resultado**: Sucesso (Exit code 0). O sistema permanece estável e sem erros de tipagem introduzidos pelos filtros.

## 7. Console e Erros
- **Console do Navegador**: Verificado e limpo. Não existem erros de "undefined" ou falhas de mapeamento decorrentes dos novos filtros.
- **Network**: Todas as requisições ao Supabase retornam os dados completos (o filtro é feito apenas na camada de apresentação).

## 8. Plano de Rollback
Como não houve alteração em banco de dados ou infraestrutura, o rollback é estritamente de código:
1. Reverter as alterações nos arquivos:
   - `src/pages/FerramentasHub.tsx`
   - `src/pages/TravessiaDetalhe.tsx`
   - `src/components/jardim/JardimFirstExperience.tsx`
2. Remover os blocos de lógica que utilizam a verificação `!isAdmin`.
3. Não é necessário executar nenhum SQL.

---
**Status da Sprint 03A**: Concluída com sucesso conforme os critérios de aceitação.
