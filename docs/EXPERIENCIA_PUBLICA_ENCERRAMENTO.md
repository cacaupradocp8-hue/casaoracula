# Encerramento da Experiência Pública da Visitante

## 1. Status final

**`PUBLIC_VISITOR_EXPERIENCE_CLOSED`**

O fluxo público da visitante foi concluído e aprovado técnica, narrativa e estrategicamente. A Casa Orácula agora possui uma porta de entrada que equilibra a recepção contemplativa com o onboarding identitário.

## 2. Objetivo do ciclo

Este ciclo teve como objetivo evoluir a entrada gratuita da Casa Orácula, estabelecendo a **Primeira Leitura Orácula** como uma experiência de alto valor percebido e baixo atrito (frontend-only). O projeto foi executado de forma a preservar integralmente o Quiz da Voz, a Cidadela, o Clube e o Dashboard de Membros, garantindo que a nova funcionalidade não interferisse nas regras de negócio ou na persistência de dados existentes.

## 3. Arquitetura final da entrada pública

| Área | Papel final |
| :--- | :--- |
| **Sala de Visita** | Limiar público da Casa; espaço de acolhimento sensorial. |
| **Primeira Leitura Orácula** | Porta contemplativa gratuita; experiência de percepção inicial. |
| **Quiz da Voz** | Caminho identitário preservado; onboarding pedagógico da Escola. |
| **Explorar a Casa** | Guia público institucional; mapa de rotas e ferramentas. |
| **Clube / Rotas da Casa** | Experiência recorrente/premium; sustentação da jornada. |
| **Cidadela** | Cartografia profunda da habitante; espaço de revelação (exclusivo membros). |
| **Dashboard Membro** | Painel do Agora; centralizador da vida na Casa após autenticação. |

## 4. Rotas públicas consolidadas

| Rota | Função | Pública? | Observação |
| :--- | :--- | :--- | :--- |
| `/sala-da-visitante` | Entrada pública principal | Sim | Ponto de partida com convites para Leitura e Quiz. |
| `/sala-da-visitante/primeira-leitura` | Experiência simbólica gratuita | Sim | Implementação Frontend-only (sem DB). |
| `/quiz/descubra-seu-eixo` | Quiz da Voz | Sim | Onboarding identitário original preservado. |
| `/explorar-a-casa` | Guia público da Casa | Sim | Mapa informativo das ferramentas e caminhos. |
| `/clube` | Entrada para Rotas da Casa | Sim | Vitrine de travessias e planos de assinatura. |

## 5. Fluxo final da visitante

O percurso da nova habitante foi desenhado para ser fluido e imersivo:

```text
/sala-da-visitante
↓
Primeira Leitura Orácula (Convite Premium)
↓
Limiar (Intro Sensorial)
↓
Cena simbólica (A Bússola sem Ponteiro)
↓
Sondagem 1 (Impulso inicial)
↓
Sondagem 2 (Percepção sonora/sutil)
↓
Leitura do Símbolo (Espelho da tendência oracular)
↓
PathSelector (Escolha de Próximo Passo)
↓
Explorar a Casa / Clube / Voltar à Sala de Visita
```

## 6. Guardrails de segurança e privacidade

Para garantir a integridade do projeto e a segurança da visitante, foram aplicados os seguintes princípios:

- **Frontend-Only:** O processamento da Primeira Leitura ocorre 100% no navegador (React State).
- **Sem Persistência:** Nenhuma resposta ou resultado da Primeira Leitura é salvo no Supabase.
- **Isolamento de Dados:** Inexistência de tracking, analytics ou coleta de dados sensíveis nesta fase.
- **Linguagem Não-Clínica:** Remoção de termos como "veredito", "diagnóstico" ou "avaliação", priorizando "leitura", "espelho" e "símbolo".
- **Zero Impacto no Quiz:** A conexão na Sala de Visita foi feita via adição de novos componentes, sem alterar o código-fonte do Quiz da Voz.

## 7. Decisão técnica final

A implementação foi validada via verificação de tipos (`tsc`) e build de produção, não apresentando conflitos com as áreas restritas da Cidadela ou do Jardim da Heroína. O sistema está pronto para recepção de tráfego público no novo fluxo contemplativo.
