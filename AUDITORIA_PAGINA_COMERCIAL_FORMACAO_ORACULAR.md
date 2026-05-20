# Relatório de Auditoria: Página Comercial da Formação Oracular

## 1. Identificação Técnica
- **Rota Real:** `/oracula`
- **Arquivo Responsável:** `src/pages/OraculaSalesPage.tsx` (renderizado via `OraculaPage.tsx`)
- **Origem do Conteúdo:** 100% Código (Hardcoded). Não depende de tabelas `salas` ou `tools` para a copy principal.
- **Ambiente:** Público (Sales).

## 2. Ajustes de Nomenclatura & Posicionamento
O termo "Clube de Leitura Oracular" foi descontinuado em favor do novo ecossistema:
- **Antes:** "Clube de Leitura Oracular"
- **Depois:** "Rotas da Casa Orácula"
- **Contextos alterados:** Card de jornada, Seção "Importante" e Fechamento.

## 3. Governança Ética (Suavização de Termos)
Termos clínicos foram ajustados para manter o foco na linguagem simbólica e evitar claims diagnósticos ou médicos:
- **L563:** "Perguntas clínicas aplicáveis" -> "Perguntas aplicáveis em sessão"
- **L565:** "Processo terapêutico" -> "Processo de condução"
- **L815:** "Condução terapêutica" -> "Condução simbólica"
- **Nota:** O disclaimer ético no footer foi mantido por ser uma salvaguarda jurídica essencial.

## 4. Arquitetura de Conversão (CTAs)
A página continha 8 CTAs idênticos, gerando ruído e desvalorizando a oferta. Foi reduzida para **4 momentos principais**:
1. **Hero (Abertura):** "Entrar na Formação" (após o vídeo).
2. **Meio (Estrutura):** Transformado em âncora "Ver estrutura completa" para conduzir a leitura.
3. **Oferta (Preço):** "Entrar na Formação Orácula" (ponto focal de conversão).
4. **Fechamento:** "Entrar na Formação Orácula" (última chamada).
5. **Mobile:** Mantido o CTA flutuante para acessibilidade UX.

## 5. Nova Hierarquia: A Tríade do Método
Foi inserido um novo bloco visual antes da oferta de preço para reforçar o ecossistema:
- **Rotas:** Atravessar (Linguagem Simbólica)
- **Formação:** Conduzir (Método Simbólico)
- **Máquinas:** Aplicar (Operação Profissional)

## 6. Checklist de QA
- [x] **TS Check:** Build limpo sem erros de sintaxe.
- [x] **Nomenclatura:** Zero menções a "Clube de Leitura" na OraculaSalesPage.
- [x] **Tríade:** Bloco inserido e responsivo.
- [x] **CTAs:** Redução estratégica concluída.
- [x] **Mobile:** CTA flutuante operando normalmente.

---
**Veredito:** A página agora possui uma narrativa mais limpa, menos repetitiva e totalmente alinhada ao novo posicionamento de "Condução" vs "Atravessar".
