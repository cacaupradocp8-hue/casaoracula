# STRATEGIC AUDIT OF ORPHAN PAGES — CASA ORÁCULA 2.0

Este documento apresenta a classificação estratégica das páginas identificadas como órfãs (sem referência ativa em `App.tsx` ou nos arquivos de rotas principais) antes de qualquer decisão de arquivamento ou remoção.

## 1. Resumo Executivo

Foram auditadas **30 páginas órfãs** em `src/pages/`. O projeto possui um volume considerável de legado visual e funcional da V0.1 que não está mais acessível via navegação padrão. No entanto, o núcleo de **pagamentos, assinatura e conta** permanece protegido e funcional, devendo ser mantido (**KEEP**) para ciclos futuros. Outras páginas foram marcadas para arquivamento (**ARCHIVE**) ou remoção segura (**DELETE**).

O projeto está pronto para a **Fase de Arquivamento**, preservando o que tem valor histórico e limpando o que é puramente obsoleto.

## 2. Critérios de Classificação

*   **Domínio:** Área funcional do sistema à qual a página pertence.
*   **Risco:** Probabilidade de impacto negativo (técnico, funcional ou de negócio) ao remover o ficheiro.
*   **Valor Estratégico:** Potencial de uso futuro, inspiração de design ou necessidade histórica.
*   **Decisão:** Ação recomendada a ser executada em etapa posterior.

## 3. Tabela Principal de Auditoria

| Arquivo | Última Ref. | Domínio | Risco | Valor | Dependências | Decisão | Justificativa |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `Assinatura.tsx` | V0.1 | pagamento | Alto | manter | Supabase, Auth | **KEEP** | Núcleo de gestão de planos e limites. |
| `Billing.tsx` | V0.1 | pagamento | Alto | manter | Stripe (prep) | **KEEP** | Infraestrutura para ciclo de checkout. |
| `RelatorioJornadaPage.tsx` | V0.1 | casa-maquinas | Médio | reaproveitar | `journey_events` | **KEEP** | Dashboard clínico valioso, embora órfão de rota. |
| `ExperienciaGratuita.tsx` | V0.2 | visitante | Médio | transformar | Supabase | **KEEP** | Pode ser reativado como landing page interna. |
| `BussolaOniricaPage.tsx` | V0.1 | casa-maquinas | Baixo | arquivar | Supabase (sonhos) | **ARCHIVE** | Protótipo de leitura de sonhos com IA. |
| `RituaisMudraPage.tsx` | V0.1 | casa-maquinas | Baixo | arquivar | Supabase | **ARCHIVE** | Valor histórico de conteúdo somático. |
| `CirculoSagradoPage.tsx` | V0.1 | casa-maquinas | Baixo | arquivar | Supabase | **ARCHIVE** | Conteúdo sobre rituais coletivos. |
| `CursoDeusasPage.tsx` | V0.1 | formação | Médio | manter | Cursos, Módulos | **KEEP** | Exceção controlada: curso legado importante. |
| `BibliotecaDasTravessias.tsx` | V0.2 | clube | Baixo | remover | `travessia_familias`| **DELETE** | Substituída pela Biblioteca Unificada. |
| `Big5Oracular.tsx` | V0.2 | formação | Médio | reaproveitar | `big5_registros` | **KEEP** | Ferramenta de mapeamento psíquico ativa. |
| `FerramentasMetodo.tsx` | V0.1 | formação | Baixo | remover | UI apenas | **DELETE** | Obsoleta, substituída pelo Hub. |
| `FerramentasMetodoHub.tsx` | V0.2 | formação | Baixo | manter | Navegação | **KEEP** | Hub principal de ferramentas da V0.2. |
| `OraculaSalesPage.tsx` | V0.2 | formação | Médio | manter | Links externos | **KEEP** | Landing page de vendas ativa fora do App. |
| `PlanosClubeOracular.tsx` | V0.2 | clube | Médio | manter | Links externos | **KEEP** | Landing page de vendas ativa fora do App. |
| `Tour.tsx` | V0.1 | visitante | Baixo | remover | `tour_sections` | **DELETE** | Descontinuado em favor do Onboarding. |
| `admin/AdminBooks.tsx` | V0.1 | admin | Baixo | remover | Nenhuma | **DELETE** | Gestão de livros legada. |
| `admin/AdminVitrineCards.tsx`| V0.1 | admin | Baixo | remover | Nenhuma | **DELETE** | Configuração visual legada. |
| `clube/ClubeAcervo.tsx` | V0.1 | clube | Baixo | arquivar | Nenhuma | **ARCHIVE** | Inspiração para futura galeria de conteúdo. |
| `clube/ClubeCiclo.tsx` | V0.1 | clube | Baixo | arquivar | Nenhuma | **ARCHIVE** | Lógica de ciclos mensais simbólicos. |
| `salas/AgenteAnalista.tsx` | V0.1 | casa-maquinas | Baixo | arquivar | IA (prep) | **ARCHIVE** | Protótipo de agente de IA. |

## 4. Páginas de Alto Risco (PROTEGIDAS)

Estas páginas **NÃO** serão movidas ou alteradas. Devem permanecer em `src/pages/` apesar de órfãs de rota direta no momento:

*   **`Assinatura.tsx`**: Contém o controle de limites de clientes e status de plano.
*   **`Billing.tsx`**: Preparação para o portal de cobrança Stripe.
*   **`CursoDeusasPage.tsx`**: Embora não esteja no menu principal, é um conteúdo rico que pode ser linkado manualmente ou via Admin.

## 5. Páginas Candidatas a Arquivamento (`ARCHIVE`)

Serão movidas para `src/archive/` (nova pasta) para limpar `src/pages/` sem perder o código:

*   `BussolaOniricaPage.tsx`
*   `RituaisMudraPage.tsx`
*   `CirculoSagradoPage.tsx`
*   `clube/ClubeCiclo.tsx`
*   `salas/AgenteAnalista.tsx`, `AgenteCurador.tsx`, `AgenteSimbólico.tsx`

## 6. Páginas Candidatas a Remoção Futura (`DELETE`)

Ficheiros que não possuem dependências ou valor futuro identificado:

*   `Tour.tsx`
*   `FerramentasMetodo.tsx`
*   `BibliotecaDasTravessias.tsx`
*   `admin/AdminBooks.tsx`
*   `admin/AdminVitrineCards.tsx`

## 7. Recomendações para Próxima Etapa

**Etapa 113: Execução do Arquivamento Seletivo V0.2.**
1. Criar diretório `src/archive/`.
2. Mover apenas os ficheiros classificados como **ARCHIVE**.
3. Não remover os ficheiros **DELETE** nesta fase (para garantir segurança extra).
4. Executar build de produção para validar.

## 8. Decisão Final

`READY_FOR_ORPHAN_ARCHIVE_PHASE`

---
*Data: 24 de Maio de 2026*
*Auditores: Lovable AI*
