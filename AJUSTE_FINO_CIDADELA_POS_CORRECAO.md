# Relatório de Ajustes Finos — CidaDELA Interior

## 1. Termos Legados Removidos
Foram substituídos todos os termos técnicos e legados para garantir a experiência premium da **CidaDELA Interior**.

- **"Cartografia Psíquica"** e **"Cartografia Psíquica Orácula"** substituídos por **"CidaDELA Interior"**.
- **"Direção Clínica"** substituído por **"Leitura de Condução"**.
- **"Leitura Psíquica"** substituído por **"Leitura Estrutural"**.
- **"Avaliação clínica formal"** substituído por **"Leitura simbólica e reflexiva"**.
- **"Iniciar Cartografia"** substituído por **"Revelar minha CidaDELA"**.

## 2. Limpeza de Placeholders Técnicos
Implementação de filtros rigorosos para impedir a exibição de elementos sem contexto.

- **"Não explorado"** substituído por **"Aguardando travessia"** (nos detalhes dos distritos).
- **"0/12"** e campos zerados:
  - O índice de equilíbrio agora exibe "—" ou o valor com porcentagem (ex: "85%") para dar contexto.
  - Seções sem conteúdo (strings vazias `""`, `null` ou `undefined`) são ocultadas automaticamente através de guards nos componentes `CamadaLeituraPsiquica`, `CamadaCidadela` e `CamadaDirecaoClinica`.
- **Mensagens de erro:** "A leitura clínica não foi gerada" substituída por "A leitura de condução ainda não foi gerada".

## 3. Componentes Atualizados
- `CartografiaEstruturalStepper.tsx`: Título de conclusão alterado para **"Mapa Vivo revelado"**.
- `DistrictPanel.tsx`: Labels de estado atualizados para linguagem oficial.
- `MiniMapaCidadela.tsx`: Texto de convite e botões atualizados.
- `DashboardBussola.tsx`: Terminologia unificada.
- `ProximoPasso.tsx`: Sugestões de jornada agora usam "Leitura Estrutural".
- `DistrictDetailSheet.tsx`: Ferramentas recomendadas atualizadas.
- `SaidaSimbolica.tsx`: Limpeza visual e tratamento do índice de revelação.

## 4. Validação
A rota `/ferramenta/cartografia-psiquica-oracula` (CidaDELA Interior) agora apresenta uma interface 100% limpa de termos clínicos ou placeholders de desenvolvimento.

**Status:** Concluído.
