# SPRINT 08E: Biblioteca de Áudios e Vínculo Avançado - Plano de Implementação

## Objetivo
Planejar a Biblioteca de Áudios do Clube Oracular e o sistema de vínculo avançado entre áudios, rotas, etapas e experiências da travessia, garantindo que o Admin possa gerenciar áudios centralizadamente.

## Escopo de Auditoria
1. **Estrutura Atual de Áudios**:
   - Tabela `clube_audio_tracks`: Contém `title`, `audio_url`, `duration`, `track_number`, `album_id`.
   - Tabela `clube_audio_albums`: Agrupa as faixas.
2. **Sistema de Vínculo**:
   - A tabela `clube_rota_itens` utiliza uma coluna `metadata` (JSONB) que armazena referências como `audio_url`.
   - Atualmente, o vínculo é feito via preenchimento manual de URL ou metadados, sem uma busca centralizada na biblioteca.

## Análise de Disponibilidade de Dados
- **Tabelas Existentes**: `clube_audio_tracks` e `clube_audio_albums` já possuem os dados necessários para uma biblioteca (URL do áudio, título, duração).
- **Consumo**: Os itens de rota (`clube_rota_itens`) podem ser alimentados por esses dados.
- **Relações**: Existe uma estrutura de álbuns que permite organizar os áudios por "Estações" ou "Temas" de forma independente das etapas da jornada.

## Plano de Implementação Visual (Sem Alteração de Schema)
1. **Nova Aba: "Audioteca"**:
   - Listagem de todos os áudios da tabela `clube_audio_tracks`.
   - Filtros por álbum e busca por título.
   - Player de preview integrado para conferência rápida.
2. **Vínculo Avançado no Painel Editorial**:
   - Ao editar um item de rota que requer áudio, substituir o campo de texto de URL por um seletor que busca na `clube_audio_tracks`.
   - Preenchimento automático de `duration` e `title` no metadata a partir da seleção.

## Restrições e Travas
- **Não criar novas tabelas**: Utilizaremos a estrutura de `clube_audio_tracks` e `clube_audio_albums`.
- **Não alterar RLS**: A leitura será feita via queries existentes ou novas respeitando o contexto de Admin.
- **Não alterar Backend**: Foco total na orquestração de dados no frontend.

## Classificação
**PRONTO PARA IMPLEMENTAÇÃO VISUAL**

A estrutura de banco de dados atual já suporta a criação de uma interface de biblioteca e a automação do vínculo de áudios nos itens de rota.
