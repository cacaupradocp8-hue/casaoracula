# VALIDAÇÃO TÉCNICA — CARTOGRAFIA ESTRUTURAL (FASES 1-4)

## 1. Renomeação
A substituição de termos foi realizada com sucesso em componentes de UI e lógica, garantindo a distinção entre contextos.

**Contexto Assinante (CidaDELA Interior):**
- `src/pages/CartografiaPsiquicaPage.tsx`: Títulos e descrições atualizados.
- `src/components/cartografia-unificada/SaidaSimbolica.tsx`: Interface para o usuário final.
- `src/components/home-inteligente/HomeSeuMapa.tsx`: Referências no dashboard.

**Contexto Metodológico/Técnico (Cartografia Estrutural Orácula™):**
- `src/components/casa-maquinas/cartografia-psiquica/TelaAbertura.tsx`: Tela inicial do CM.
- `src/components/casa-maquinas/cartografia-psiquica/CartografiaPsiquicaOracula.tsx`: Componente principal do CM.
- `src/lib/cartografia/montarProfileJson.ts`: Comentários e documentação interna.

**Arquivos Alterados:**
- `src/pages/CartografiaPsiquicaPage.tsx`
- `src/components/casa-maquinas/cartografia-psiquica/CartografiaPsiquicaOracula.tsx`
- `src/components/casa-maquinas/cartografia-psiquica/TelaAbertura.tsx`
- `src/components/casa-maquinas/cartografia-psiquica/TelaVisualizacao.tsx`
- `src/components/cartografia-unificada/SaidaSimbolica.tsx`
- `src/pages/FerramentasMetodoHub.tsx`
- `src/pages/ExplorarACasa.tsx`
- `src/pages/Vitrine.tsx`
- `src/pages/ExperienciaGratuita.tsx`
- `src/components/home-inteligente/HomeSeuMapa.tsx`

---

## 2. Banco de Dados
- **Tabelas/Colunas:** Não houve alteração estrutural nas tabelas do Supabase (`cartografia_psiquica`, `co_cartografia_profile`).
- **JSON Persistido:** O objeto `profile_json` foi estendido para incluir a chave `territorios` dentro de `derivacao`.
- **Migrations:** Nenhuma migração foi necessária, pois a estrutura de JSONB permite a expansão realizada.
- **Functions:** As Edge Functions (`cartografia-leitura-profunda`) continuam compatíveis, pois os campos antigos foram mantidos como alias ou processados no motor.

---

## 3. Motor Central (`montarProfileJson.ts`)
- **Campos Adicionados:**
    - `atencao_seguranca` (substituindo logicamente `risco_conducao`).
    - `territorios` (objeto contendo as 6 áreas estruturais).
- **Representação dos 6 Territórios:**
    - Sintoma, História de Vida, Traços, Crenças, Recursos, Atenção e Segurança.
- **Compatibilidade:** Mantida via fallback (`Em análise.`) para cartografias antigas que não possuem dados qualitativos.
- **Tipagem:** Atualizada no `interface ProfileJsonDerivacao` para refletir os novos campos sem quebrar o contrato com a UI.

---

## 4. Atenção e Segurança
- **Remoção de "Risco":** O termo foi removido de todas as interfaces visíveis para o usuário e terapeuta.
- **Nova Terminologia:** "Nível de Atenção e Segurança" ou "Nível de Atenção" agora é o padrão.
- **Postura Ética:**
    - Não afirma diagnóstico clínico.
    - Sinaliza necessidade de "Contenção", "Validação" ou "Atenção elevada".
    - Mantém avisos éticos explícitos em todos os outputs.

---

## 5. Big Five
- **Integração:** O Big Five permanece como o motor matemático subjacente (30 perguntas), alimentando o **Território de Traços**.
- **Não Duplicação:** Não foi criada uma ferramenta paralela; a Cartografia Estrutural absorveu a leitura do Big Five.
- **Legado:** O hook `useBig5Oracular` continua funcional para ferramentas antigas que ainda o consultam.

---

## 6. Atlas
- **Papel:** O Atlas de Arquétipos (`AtlasArquetiposPage.tsx`) atua como camada de personificação.
- **Não Duplicação:** O Atlas permanece como uma ferramenta de consulta e aprofundamento, não gerando resultados automáticos conflitantes com o Mapa Vivo.

---

## 7. Acesso
- **Subscription Guard:** Validado via `useEffectivePortal`.
- **Regras:**
    - Visitante pública/logada gratuita: Redirecionada para `/planos` ou vê trava de assinatura.
    - Assinante ('aluna'): Acesso total à CidaDELA Interior.
    - Admin: Acesso total + preview de outros níveis.
    - CM: Requer `terapeuta_id` válido e cliente selecionado.

---

## 8. Output (Mapa Vivo)
O output final em `CartografiaPsiquicaOracula.tsx` e `CartografiaPsiquicaPage.tsx` mantém a estrutura do Mapa Vivo, agora enriquecida com:
- Síntese estrutural (via motor unificado).
- Territórios ativados (Distritos acesos).
- Nível de Atenção e Segurança (substituindo Risco).
- Próximos passos e Recomendações (extraídos da `leitura_clinica` e `leitura_simbolica`).

---

## 9. Compatibilidade e Testes (Checklist)
- [x] **Usuário Novo:** Stepper inicia corretamente (Fases 1-4 ok).
- [x] **Usuário Antigo:** Carregamento de cartografias anteriores via `metadata_json` com fallback para os novos campos de território.
- [x] **Assinante:** Acesso garantido via level 'aluna'.
- [x] **Visitante:** Bloqueio e redirecionamento para planos.
- [x] **Admin:** Visualização íntegra de todas as camadas.

---

**STATUS: VALIDAÇÃO CONCLUÍDA.**
Pronto para prosseguir com a **Fase 3 (Refatoração do Stepper Qualitativo)**.
