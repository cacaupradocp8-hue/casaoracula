# Auditoria de Rastreamento de Tela Real: CidaDELA Interior

## 1. Identificação da Rota Real
A ferramenta está sendo acessada através da seguinte rota (configurada em `src/App.tsx`):
- **`/ferramenta/cartografia-psiquica-oracula`**
- Também responde por: `/ferramentas/cartografia-psiquica-oracula` (via redirect no App.tsx).

## 2. Cadeia de Componentes Ativos
O rastreamento completo da renderização é:
1. `src/App.tsx` (Definição da rota)
2. `src/pages/CartografiaPsiquicaPage.tsx` (Componente de página)
3. `src/components/cartografia/CartografiaEstruturalStepper.tsx` (Fluxo de perguntas e resultado)
4. `src/components/cartografia-unificada/SaidaSimbolica.tsx` (Resultado simbólico)
5. `src/components/cartografia-unificada/CamadaLeituraPsiquica.tsx` (Camada 1 do resultado)
6. `src/components/cartografia-unificada/CamadaCidadela.tsx` (Camada 2 do resultado)

## 3. Localização de Termos e Lógica (Auditada)

### Termos Visíveis
- **"Leitura Concluída"**: Encontrado em `CartografiaEstruturalStepper.tsx` (Linha 83). Foi alterado recentemente (anterior era "Cartografia Concluída").
- **"Mapa Vivo: CidaDELA Interior"**: Encontrado em `CartografiaEstruturalStepper.tsx` (Linha 84).
- **"Leitura Psíquica"**: Encontrado em `CamadaLeituraPsiquica.tsx` (Linha 35).
- **"Nível de Atenção e Segurança"**: Encontrado em `CartografiaEstruturalStepper.tsx` (Linha 111).

### Problemas Detectados (Causa Raiz)
- **"Não explorado" / "Torre em Construção" / "0/12"**: Estes termos não estão no componente `CartografiaEstruturalStepper`, mas sim em componentes de **suporte** e **versões antigas/paralelas** da mandala:
    - `src/components/cidadela/MandalaMobile.tsx`
    - `src/components/cidadela/MandalaCidadela.tsx`
    - `src/components/cidadela/DistrictDetailSheet.tsx`
- **Por que a usuária vê campos vazios?** 
    - A lógica de derivação em `src/lib/cartografia/derivacaoCidadela.ts` e `montarProfileJson.ts` pode estar retornando valores padrão ("Torre em Construção", "Clima em transição") se os dados de entrada (Big Five) não forem processados corretamente ou se as chaves do objeto de resposta não baterem com o que o frontend espera.
- **CTA quebrado ("Conhecer a Clínica")**: Encontrado no componente `SaidaClinica.tsx` (antiga Saída Clínica, agora Leitura Estruturada). A usuária relatou ver este botão, indicando que ela pode estar acessando uma aba ou modo "terapeuta/clínico" ou que o componente de saída está renderizando blocos legados.

## 4. Conclusão da Auditoria
A alteração de linguagem **chegou** ao código (`Leitura Concluída` já consta no arquivo), mas a usuária está vendo elementos de componentes que **não foram limpos ou atualizados**:
1. O componente de Mandala usado (`CidadelaMapSVG`) consome estados legados ("nao_explorado").
2. O componente `SaidaClinica.tsx` (que deveria ser restrito ou rebatizado) ainda contém referências a "Clínica".
3. Existe uma discrepância entre o que o motor de cálculo gera e o que o componente visual exibe quando não há dados (0/12 e aspas vazias).

## 5. Próximos Passos (Ações Corretivas Imediatas)
1. **Unificar Linguagem na Mandala**: Alterar "Não explorado" para "Aguardando travessia" ou ocultar.
2. **Corrigir Fallbacks do Motor**: Alterar "Torre em Construção" para algo mais orgânico.
3. **Limpar SaidaClinica**: Remover botão "Conhecer a Clínica" e apontar para `/clube`.
4. **Tratar Campos Vazios**: Implementar a regra de ocultar seções sem dados em `CartografiaEstruturalStepper`.
