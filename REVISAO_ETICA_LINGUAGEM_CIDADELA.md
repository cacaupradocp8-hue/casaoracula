# Relatório de Revisão Ética de Linguagem: CidaDELA Interior

## Objetivo
Remover qualquer linguagem que sugira diagnóstico, avaliação clínica formal ou certeza psicológica, alinhando a comunicação aos princípios do Método Orácula™.

## Alterações Realizadas

### 1. Componentes de UI (Visual)
- **CartografiaEstruturalStepper.tsx**:
    - Substituído "Cartografia Concluída" por "Leitura Concluída".
    - Substituído "Cartografia Estrutural" por "Leitura Estrutural".
    - Substituído "Mapeamento de 6 territórios estruturais" por "Mapeamento reflexivo de 6 territórios".
    - Revisada nota informativa para enfatizar "espelhamento simbólico" em vez de apenas "espelho".
- **SaidaSimbolica.tsx**:
    - Alterado "Tensão que pede escuta" para "Sinais de cuidado".
    - Reforçada nota ética sobre a natureza simbólica e não clínica.
- **SaidaClinica.tsx**:
    - Alterado "Leitura Diagnóstica" para "Formulação Simbólico-Clínica".
    - Alterado "Saída Clínica" para "Leitura Estruturada".
    - Alterada nota de rodapé: removido "apoio à decisão clínica", inserido "mapeamento reflexivo de apoio à condução".

### 2. Motor de Lógica e Documentação
- **montarProfileJson.ts**:
    - Atualizada documentação interna de "Cartografia Psíquica" para "Leitura Estrutural".
    - Revisadas as mensagens de `OBSERVACAO_ETICA` para remover "exploração" (termo clínico/pesquisa) em favor de "auto-observação" e "travessia".
- **leituraComportamental.ts**:
    - Renomeada a camada interna de "Leitura Comportamental" para "Leitura Estrutural" em comentários e headers.

## Substituições de Termos (De acordo com diretriz)
- **Diagnóstico/Diagnóstica** → Leitura Estrutural / Formulação Simbólica.
- **Risco** → Nível de Atenção e Segurança.
- **Avaliação Clínica** → Mapeamento Reflexivo / Auto-observação Estruturada.
- **Tratamento/Cura** → Convite ao Aprofundamento / Sinais de Cuidado.

## Garantias Éticas
- A CidaDELA Interior agora se apresenta explicitamente como uma ferramenta de **auto-observação guiada**.
- Toda a saída técnica (anteriormente "Clínica") foi rebatizada para "Estruturada", focando na organização de padrões e recursos, sem promessas terapêuticas formais.
- Mantido o bloqueio para visitantes e a integridade do motor de cálculo Big Five.

**Status:** Concluído e Validado.
