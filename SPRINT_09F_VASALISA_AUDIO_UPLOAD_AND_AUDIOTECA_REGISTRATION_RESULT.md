# Plano de Upload e Registro: SPRINT 09F - Passo 03 Estação I (Vasalisa)

## 1. Auditoria Técnica (Storage & Banco)
- **Bucket de Destino**: `audios`
- **Pasta de Upload**: `uploads/`
- **Formato Sugerido**: `.mp3`
- **Tabela de Registro**: `clube_audio_tracks`
- **Campos Obrigatórios**: `id`, `album_id`, `titulo`, `tipo`, `audio_url`, `ordem`, `publicado`.
- **Enum `tipo`**: Deve ser `audio` (valor suportado pelo DB).
- **Taxonomia (Tags)**: Deve usar os valores padronizados (`aula_principal`, `pratica_guiada`, `fechamento_campo`).

## 2. Instruções para Upload (Manual ou Admin)
Para cada áudio produzido, siga este procedimento no Painel Administrativo ou via Storage:
1. Fazer upload do arquivo para o bucket `audios` na pasta `uploads/`.
2. Obter a URL pública do arquivo (Ex: `https://[SUBDOMAIN].supabase.co/storage/v1/object/public/audios/uploads/[FILENAME].mp3`).
3. Cadastrar na Audioteca (`clube_audio_tracks`) preenchendo:
    - **Álbum**: ÁLBUM ESTAÇÃO I (`id: 2929a5be-c158-469c-9053-5e6f1c462995`).
    - **Título**: Conforme definido no roteiro.
    - **URL**: A URL pública obtida no passo 2.
    - **Taxonomia**: Marcar a categoria correta nos chips de tag.
    - **Status**: Manter **Rascunho** (Publicado = false).

## 3. Checklist de Cadastro por Faixa

### Faixa 01: Aula Principal
- **Título**: Aula Principal: A Psicologia Simbólica da Boneca Interna
- **Tags**: `aula_principal`, `instinto`, `psicologia`, `vasalisa`
- **Duração**: ~1080 segundos (18 min)
- **Status**: Rascunho

### Faixa 02: Prática Guiada
- **Título**: Prática Guiada: Diálogo com a Boneca Interna
- **Tags**: `pratica_guiada`, `meditacao`, `corpo`, `escuta`
- **Duração**: ~720 segundos (12 min)
- **Status**: Rascunho

### Faixa 03: Fechamento do Campo
- **Título**: Fechamento do Campo: A Luz que Não Pode Ser Terceirizada
- **Tags**: `fechamento_campo`, `ritual`, `finalizacao`
- **Duração**: ~360 segundos (6 min)
- **Status**: Rascunho

## 4. Fluxo de Vínculo Editorial
Após o cadastro das faixas:
1. Acessar **Painel Editorial** -> **Conteúdo Rota**.
2. Abrir edição do Passo 03: **O Resgate da Intuição**.
3. Na seção "Áudios da Rota", clicar em **Vincular Audioteca**.
4. Selecionar as 3 faixas correspondentes.
5. Salvar o Passo 03 (mantendo em **Rascunho**).
6. Validar no **Preview Editorial** se o player carrega as faixas corretamente.

## 5. Classificação
**AGUARDANDO ÁUDIOS REAIS**

O sistema está configurado e os endereços de storage mapeados. O cadastro será realizado assim que os arquivos forem entregues pela produção de áudio.
