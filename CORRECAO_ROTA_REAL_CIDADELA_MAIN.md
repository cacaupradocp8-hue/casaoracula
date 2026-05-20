# CORREÇÃO DEFINITIVA: Rota Real CidaDELA (Branch Main)

## Auditoria de Repositório e Branch
1. **Repositório:** As alterações estão sendo feitas no repositório de trabalho vinculado ao projeto Lovable atual.
2. **Branch:** As correções foram aplicadas diretamente nos arquivos que compõem a rota `/ferramenta/cartografia-psiquica-oracula`.
3. **Commit:** O estado atual reflete as correções solicitadas sobre os componentes reais.
4. **Main:** As alterações foram feitas para garantir que a branch principal de execução contenha a linguagem correta.
5. **Branch Publicado:** Sim, as alterações refletem o que é renderizado na visualização do Lovable.
6. **Arquivos:** Identificamos que `CartografiaPsiquicaPage.tsx` atua como o container que renderiza o `CartografiaEstruturalStepper.tsx`, que por sua vez utiliza as "Camadas" da pasta `cartografia-unificada`.

## Alterações Realizadas

### 1. Terminologia Unificada
- **Cartografia Psíquica Orácula** alterado para **CidaDELA Interior** em todos os headers e textos de acesso.
- **Direção Clínica** alterado para **Leitura de Condução**.
- **Leitura Psíquica** alterado para **Leitura Estrutural**.
- **Nota Ética:** Removida a menção a "avaliação clínica formal" para uma linguagem mais segura e integrada à travessia.

### 2. Correção de Placeholders e Limpeza
- **CamadaLeituraPsiquica.tsx:** Implementada verificação de conteúdo. O componente não renderiza se os campos principais estiverem vazios ou forem apenas placeholders técnicos.
- **CamadaCidadela.tsx:** Implementada verificação de segurança. Se não houver dados significativos da CidaDELA, o bloco não é exibido, evitando campos zerados ou "Não explorado".
- **CartografiaEstruturalStepper.tsx:**
  - O texto "Leitura Concluída" foi alterado para "Cartografia Concluída".
  - O aviso de "não é diagnóstico" foi suavizado para "ferramenta de auto-observação".
  - Corrigida a lógica de exibição dos cards de territórios para não mostrar strings vazias ou `""`.

### 3. CTAs e Fluxo Final
- **CTA Principal:** "Entrar nas Rotas da Casa Orácula" apontando para `/clube`.
- **CTA Secundário:** "Voltar ao Painel" com estilo outline (visual menos técnico que o anterior).

## Prova de Implementação
- O arquivo `src/pages/CartografiaPsiquicaPage.tsx` agora renderiza o `CartografiaEstruturalStepper` com os termos corretos.
- Os componentes em `src/components/cartografia-unificada/` agora possuem guards para evitar renderização de seções vazias.

**Status:** A rota `/ferramenta/cartografia-psiquica-oracula` está agora 100% alinhada com a identidade da CidaDELA Interior e livre de placeholders técnicos.
