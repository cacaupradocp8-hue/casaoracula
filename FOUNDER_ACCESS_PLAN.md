# Plano de Acesso para Fundadoras - Projeto Casa Oráculo

## Objetivo
Estabelecer um processo estruturado para conceder e gerenciar o acesso de fundadoras (Founder Experience) ao ecossistema da Casa Oráculo, visando validação e coleta de feedback estratégico.

## 1. Critérios de Elegibilidade
As "Fundadoras" são usuárias selecionadas estrategicamente para vivenciar a experiência beta.
*   **Identificação Técnica**: Perfil com o atributo `founder_beta = true`.
*   **Perfil**: Parceiras estratégicas, investidoras, alunas avançadas ou convidadas VIP.

## 2. Mapeamento da Experiência (Jornada da Fundadora)
As fundadoras seguem um fluxo otimizado e guiado:
1.  **Login**: Identificação automática do status de fundadora.
2.  **Boas-vindas**: Redirecionamento para o Dashboard de Membro.
3.  **Primeira Cartografia (Express)**: Experiência rápida de mapeamento simbólico.
4.  **Travessia 00**: Iniciação à jornada.
5.  **Cidadela**: Acesso aos resultados e desvelamento da cartografia completa.
6.  **Feedback**: Canal direto para envio de percepções críticas (`/clube/founder-feedback`).

## 3. Gestão de Acesso (Processo Admin)
O acesso é gerenciado pela Guardiã da Casa (Admin) através da Central da Casa:
*   **Concessão**: No menu de Usuárias, localizar a convidada e ativar a chave "Experiência Fundadora".
*   **Notificação**: Ao ser ativado, o sistema libera automaticamente as rotas protegidas (gate de assinatura).
*   **Revogação**: O status pode ser removido a qualquer momento para retornar ao fluxo padrão.

## 4. Requisitos Técnicos Implementados
*   **Atributo de Perfil**: Campo `founder_beta` na tabela `profiles`.
*   **Segurança de Rotas**: `ProtectedRoute` e `jornadaRoutes` configurados para validar o status.
*   **UI Dinâmica**: Ocultação de menus legados e exibição de banners de iniciação exclusivos.
*   **Admin Panel**: Interface para toggle manual do status de fundadora.

## 5. Cronograma e Acompanhamento
*   **Semana 1-2**: Convite e ativação do primeiro grupo de 10 fundadoras.
*   **Semana 3**: Monitoramento de logs de navegação e análise de feedback.
*   **Semana 4**: Ajustes de UX com base na experiência relatada.

---
*Este documento serve como guia oficial para a operação da Founder Experience na Casa Oráculo.*
