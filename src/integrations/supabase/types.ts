export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      academy_progress: {
        Row: {
          badges_json: Json
          created_at: string
          id: string
          level: number
          points: number
          specialties: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          badges_json?: Json
          created_at?: string
          id?: string
          level?: number
          points?: number
          specialties?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          badges_json?: Json
          created_at?: string
          id?: string
          level?: number
          points?: number
          specialties?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      access_expiration_logs: {
        Row: {
          expired_at: string
          id: string
          previous_portal: string | null
          reason: string | null
          user_id: string | null
        }
        Insert: {
          expired_at?: string
          id?: string
          previous_portal?: string | null
          reason?: string | null
          user_id?: string | null
        }
        Update: {
          expired_at?: string
          id?: string
          previous_portal?: string | null
          reason?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "access_expiration_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_expiration_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_formation_progress"
            referencedColumns: ["user_id"]
          },
        ]
      }
      agente_conversas: {
        Row: {
          agente_id: string
          created_at: string
          id: string
          titulo: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          agente_id: string
          created_at?: string
          id?: string
          titulo?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          agente_id?: string
          created_at?: string
          id?: string
          titulo?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agente_conversas_agente_id_fkey"
            columns: ["agente_id"]
            isOneToOne: false
            referencedRelation: "agentes"
            referencedColumns: ["id"]
          },
        ]
      }
      agente_mensagens: {
        Row: {
          content: string
          conversa_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversa_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversa_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "agente_mensagens_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "agente_conversas"
            referencedColumns: ["id"]
          },
        ]
      }
      agentes: {
        Row: {
          contextos_permitidos:
            | Database["public"]["Enums"]["block_context_type"][]
            | null
          created_at: string
          descricao: string
          icone: string | null
          id: string
          instrucoes_base: string
          max_tokens: number | null
          modelo_preferido: string | null
          nome: string
          portal_minimo: Database["public"]["Enums"]["portal_type"]
          prompt_personalidade: string | null
          status: Database["public"]["Enums"]["agente_status"]
          temperatura: number | null
          updated_at: string
        }
        Insert: {
          contextos_permitidos?:
            | Database["public"]["Enums"]["block_context_type"][]
            | null
          created_at?: string
          descricao: string
          icone?: string | null
          id?: string
          instrucoes_base?: string
          max_tokens?: number | null
          modelo_preferido?: string | null
          nome: string
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          prompt_personalidade?: string | null
          status?: Database["public"]["Enums"]["agente_status"]
          temperatura?: number | null
          updated_at?: string
        }
        Update: {
          contextos_permitidos?:
            | Database["public"]["Enums"]["block_context_type"][]
            | null
          created_at?: string
          descricao?: string
          icone?: string | null
          id?: string
          instrucoes_base?: string
          max_tokens?: number | null
          modelo_preferido?: string | null
          nome?: string
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          prompt_personalidade?: string | null
          status?: Database["public"]["Enums"]["agente_status"]
          temperatura?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      ai_global_settings: {
        Row: {
          ativo: boolean
          chave: string
          created_at: string
          descricao: string | null
          id: string
          updated_at: string
          valor: string
        }
        Insert: {
          ativo?: boolean
          chave: string
          created_at?: string
          descricao?: string | null
          id?: string
          updated_at?: string
          valor: string
        }
        Update: {
          ativo?: boolean
          chave?: string
          created_at?: string
          descricao?: string | null
          id?: string
          updated_at?: string
          valor?: string
        }
        Relationships: []
      }
      ai_interaction_logs: {
        Row: {
          agente_id: string | null
          context_id: string | null
          context_type: Database["public"]["Enums"]["block_context_type"] | null
          created_at: string
          error_message: string | null
          id: string
          input_text: string
          latency_ms: number | null
          modelo_usado: string | null
          output_text: string | null
          success: boolean | null
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          agente_id?: string | null
          context_id?: string | null
          context_type?:
            | Database["public"]["Enums"]["block_context_type"]
            | null
          created_at?: string
          error_message?: string | null
          id?: string
          input_text: string
          latency_ms?: number | null
          modelo_usado?: string | null
          output_text?: string | null
          success?: boolean | null
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          agente_id?: string | null
          context_id?: string | null
          context_type?:
            | Database["public"]["Enums"]["block_context_type"]
            | null
          created_at?: string
          error_message?: string | null
          id?: string
          input_text?: string
          latency_ms?: number | null
          modelo_usado?: string | null
          output_text?: string | null
          success?: boolean | null
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_interaction_logs_agente_id_fkey"
            columns: ["agente_id"]
            isOneToOne: false
            referencedRelation: "agentes"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      archetypal_profile_snapshots: {
        Row: {
          client_id: string
          clinical_question: string | null
          dominant_archetype: string | null
          evolution_call: string | null
          generated_at: string
          id: string
          psychic_movement: string | null
          shadow_archetype: string | null
          source_data_json: Json | null
        }
        Insert: {
          client_id: string
          clinical_question?: string | null
          dominant_archetype?: string | null
          evolution_call?: string | null
          generated_at?: string
          id?: string
          psychic_movement?: string | null
          shadow_archetype?: string | null
          source_data_json?: Json | null
        }
        Update: {
          client_id?: string
          clinical_question?: string | null
          dominant_archetype?: string | null
          evolution_call?: string | null
          generated_at?: string
          id?: string
          psychic_movement?: string | null
          shadow_archetype?: string | null
          source_data_json?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "archetypal_profile_snapshots_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      atelie_conteudos: {
        Row: {
          conteudo_gerado: Json | null
          created_at: string | null
          created_by: string | null
          duracao: string | null
          id: string
          ideias_chave: string
          jornada: string
          objetivo: string
          portal: string
          status: string | null
          template_id: string | null
          tom: string
          updated_at: string | null
        }
        Insert: {
          conteudo_gerado?: Json | null
          created_at?: string | null
          created_by?: string | null
          duracao?: string | null
          id?: string
          ideias_chave: string
          jornada: string
          objetivo: string
          portal: string
          status?: string | null
          template_id?: string | null
          tom: string
          updated_at?: string | null
        }
        Update: {
          conteudo_gerado?: Json | null
          created_at?: string | null
          created_by?: string | null
          duracao?: string | null
          id?: string
          ideias_chave?: string
          jornada?: string
          objetivo?: string
          portal?: string
          status?: string | null
          template_id?: string | null
          tom?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "atelie_conteudos_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "atelie_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      atelie_templates: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao: string | null
          id: string
          is_default: boolean | null
          nome: string
          template_content: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          is_default?: boolean | null
          nome: string
          template_content: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          is_default?: boolean | null
          nome?: string
          template_content?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      atlas_arquetipos_femininos: {
        Row: {
          ativo: boolean | null
          chave: string
          cor_acento: string | null
          created_at: string | null
          descricao_clinica: string
          icone: string | null
          id: string
          manifestacoes_frequentes: string[] | null
          nome: string
          ordem: number | null
          perguntas_sessao: string[] | null
          posicao_x: number | null
          posicao_y: number | null
          riscos_projecao: string[] | null
          territorio: string
          trabalhar_forca_sem_reforcar_ferida: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          chave: string
          cor_acento?: string | null
          created_at?: string | null
          descricao_clinica: string
          icone?: string | null
          id?: string
          manifestacoes_frequentes?: string[] | null
          nome: string
          ordem?: number | null
          perguntas_sessao?: string[] | null
          posicao_x?: number | null
          posicao_y?: number | null
          riscos_projecao?: string[] | null
          territorio: string
          trabalhar_forca_sem_reforcar_ferida?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          chave?: string
          cor_acento?: string | null
          created_at?: string | null
          descricao_clinica?: string
          icone?: string | null
          id?: string
          manifestacoes_frequentes?: string[] | null
          nome?: string
          ordem?: number | null
          perguntas_sessao?: string[] | null
          posicao_x?: number | null
          posicao_y?: number | null
          riscos_projecao?: string[] | null
          territorio?: string
          trabalhar_forca_sem_reforcar_ferida?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      atlas_arquetipos_registros: {
        Row: {
          arquetipo_dominante: string | null
          arquetipo_dormindo: string | null
          arquetipos_atividade: Json
          arquetipos_descricao: Json
          arquetipos_selecionados: string[]
          arquetipos_situacoes: Json
          atividade_media: number | null
          client_id: string
          conflitos_arquetipos: string | null
          created_at: string
          dinamica_geral: string | null
          harmonias_arquetipos: string | null
          id: string
          o_que_poderia_trazer: string | null
          reflexao_dominante: string | null
          therapist_id: string
          updated_at: string
        }
        Insert: {
          arquetipo_dominante?: string | null
          arquetipo_dormindo?: string | null
          arquetipos_atividade?: Json
          arquetipos_descricao?: Json
          arquetipos_selecionados?: string[]
          arquetipos_situacoes?: Json
          atividade_media?: number | null
          client_id: string
          conflitos_arquetipos?: string | null
          created_at?: string
          dinamica_geral?: string | null
          harmonias_arquetipos?: string | null
          id?: string
          o_que_poderia_trazer?: string | null
          reflexao_dominante?: string | null
          therapist_id: string
          updated_at?: string
        }
        Update: {
          arquetipo_dominante?: string | null
          arquetipo_dormindo?: string | null
          arquetipos_atividade?: Json
          arquetipos_descricao?: Json
          arquetipos_selecionados?: string[]
          arquetipos_situacoes?: Json
          atividade_media?: number | null
          client_id?: string
          conflitos_arquetipos?: string | null
          created_at?: string
          dinamica_geral?: string | null
          harmonias_arquetipos?: string | null
          id?: string
          o_que_poderia_trazer?: string | null
          reflexao_dominante?: string | null
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "atlas_arquetipos_registros_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      audio_assets: {
        Row: {
          capa_url: string | null
          categoria: string | null
          created_at: string | null
          descricao: string | null
          duracao_segundos: number | null
          file_path: string
          id: string
          ordem: number | null
          porta_psiquica: string | null
          portal_minimo: Database["public"]["Enums"]["portal_type"] | null
          publicado: boolean | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          capa_url?: string | null
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          duracao_segundos?: number | null
          file_path: string
          id?: string
          ordem?: number | null
          porta_psiquica?: string | null
          portal_minimo?: Database["public"]["Enums"]["portal_type"] | null
          publicado?: boolean | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          capa_url?: string | null
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          duracao_segundos?: number | null
          file_path?: string
          id?: string
          ordem?: number | null
          porta_psiquica?: string | null
          portal_minimo?: Database["public"]["Enums"]["portal_type"] | null
          publicado?: boolean | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      aulas: {
        Row: {
          conteudo_gerado: Json | null
          conteudo_raw: string | null
          created_at: string
          created_by: string | null
          duracao: string | null
          id: string
          motor_geracao: string | null
          nivel_conteudo: string | null
          ordem: number
          portal_id: string
          status: string
          subtitulo: string | null
          titulo: string
          tom: string | null
          updated_at: string
        }
        Insert: {
          conteudo_gerado?: Json | null
          conteudo_raw?: string | null
          created_at?: string
          created_by?: string | null
          duracao?: string | null
          id?: string
          motor_geracao?: string | null
          nivel_conteudo?: string | null
          ordem?: number
          portal_id: string
          status?: string
          subtitulo?: string | null
          titulo: string
          tom?: string | null
          updated_at?: string
        }
        Update: {
          conteudo_gerado?: Json | null
          conteudo_raw?: string | null
          created_at?: string
          created_by?: string | null
          duracao?: string | null
          id?: string
          motor_geracao?: string | null
          nivel_conteudo?: string | null
          ordem?: number
          portal_id?: string
          status?: string
          subtitulo?: string | null
          titulo?: string
          tom?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "aulas_portal_id_fkey"
            columns: ["portal_id"]
            isOneToOne: false
            referencedRelation: "portais"
            referencedColumns: ["id"]
          },
        ]
      }
      auto_mapeamento: {
        Row: {
          anotacoes: string | null
          created_at: string | null
          distritos_json: Json | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          anotacoes?: string | null
          created_at?: string | null
          distritos_json?: Json | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          anotacoes?: string | null
          created_at?: string | null
          distritos_json?: Json | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      automation_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      biblioteca_casos: {
        Row: {
          ativa: boolean | null
          autor_id: string | null
          cena: string
          created_at: string | null
          erro_comum: string
          fonte: string | null
          id: string
          leitura_oracula: string
          ordem: number | null
          porta_id: string | null
          porta_nome: string | null
          resultado: string
          risco_tipo: string | null
          tags: string[] | null
          titulo: string | null
          torre_id: string
          updated_at: string | null
        }
        Insert: {
          ativa?: boolean | null
          autor_id?: string | null
          cena: string
          created_at?: string | null
          erro_comum: string
          fonte?: string | null
          id?: string
          leitura_oracula: string
          ordem?: number | null
          porta_id?: string | null
          porta_nome?: string | null
          resultado: string
          risco_tipo?: string | null
          tags?: string[] | null
          titulo?: string | null
          torre_id: string
          updated_at?: string | null
        }
        Update: {
          ativa?: boolean | null
          autor_id?: string | null
          cena?: string
          created_at?: string | null
          erro_comum?: string
          fonte?: string | null
          id?: string
          leitura_oracula?: string
          ordem?: number | null
          porta_id?: string | null
          porta_nome?: string | null
          resultado?: string
          risco_tipo?: string | null
          tags?: string[] | null
          titulo?: string | null
          torre_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "biblioteca_casos_porta_id_fkey"
            columns: ["porta_id"]
            isOneToOne: false
            referencedRelation: "labirinto_portas"
            referencedColumns: ["id"]
          },
        ]
      }
      big5_dimensoes: {
        Row: {
          ativo: boolean
          chave: string
          created_at: string
          descricao: string
          id: string
          nome: string
          ordem: number
          perguntas_reflexao: string[] | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          chave: string
          created_at?: string
          descricao: string
          id?: string
          nome: string
          ordem?: number
          perguntas_reflexao?: string[] | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          chave?: string
          created_at?: string
          descricao?: string
          id?: string
          nome?: string
          ordem?: number
          perguntas_reflexao?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      big5_funcional_dimensoes: {
        Row: {
          ativo: boolean
          chave: string
          cor: string
          created_at: string
          descricao: string
          id: string
          interpretacao_alto: string | null
          interpretacao_baixo: string | null
          nome: string
          nome_ingles: string
          ordem: number
          ponto_atencao_alto: string | null
          ponto_atencao_baixo: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          chave: string
          cor: string
          created_at?: string
          descricao: string
          id?: string
          interpretacao_alto?: string | null
          interpretacao_baixo?: string | null
          nome: string
          nome_ingles: string
          ordem?: number
          ponto_atencao_alto?: string | null
          ponto_atencao_baixo?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          chave?: string
          cor?: string
          created_at?: string
          descricao?: string
          id?: string
          interpretacao_alto?: string | null
          interpretacao_baixo?: string | null
          nome?: string
          nome_ingles?: string
          ordem?: number
          ponto_atencao_alto?: string | null
          ponto_atencao_baixo?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      big5_funcional_perguntas: {
        Row: {
          ativo: boolean
          created_at: string
          dimensao_id: string
          id: string
          ordem: number
          texto_pergunta: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          dimensao_id: string
          id?: string
          ordem?: number
          texto_pergunta: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          dimensao_id?: string
          id?: string
          ordem?: number
          texto_pergunta?: string
        }
        Relationships: [
          {
            foreignKeyName: "big5_funcional_perguntas_dimensao_id_fkey"
            columns: ["dimensao_id"]
            isOneToOne: false
            referencedRelation: "big5_funcional_dimensoes"
            referencedColumns: ["id"]
          },
        ]
      }
      big5_funcional_registros: {
        Row: {
          created_at: string
          dimensao_alta: string | null
          dimensao_baixa: string | null
          id: string
          medias_json: Json
          respostas_json: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          dimensao_alta?: string | null
          dimensao_baixa?: string | null
          id?: string
          medias_json?: Json
          respostas_json?: Json
          user_id: string
        }
        Update: {
          created_at?: string
          dimensao_alta?: string | null
          dimensao_baixa?: string | null
          id?: string
          medias_json?: Json
          respostas_json?: Json
          user_id?: string
        }
        Relationships: []
      }
      big5_oracular_fatores: {
        Row: {
          ativo: boolean | null
          chave: string
          cor_primaria: string | null
          created_at: string | null
          descricao_simbolica: string | null
          id: string
          narrativa_elevada: string | null
          narrativa_fragil: string | null
          nome: string
          nome_ocean: string
          ordem: number
          simbolo: string | null
        }
        Insert: {
          ativo?: boolean | null
          chave: string
          cor_primaria?: string | null
          created_at?: string | null
          descricao_simbolica?: string | null
          id?: string
          narrativa_elevada?: string | null
          narrativa_fragil?: string | null
          nome: string
          nome_ocean: string
          ordem: number
          simbolo?: string | null
        }
        Update: {
          ativo?: boolean | null
          chave?: string
          cor_primaria?: string | null
          created_at?: string | null
          descricao_simbolica?: string | null
          id?: string
          narrativa_elevada?: string | null
          narrativa_fragil?: string | null
          nome?: string
          nome_ocean?: string
          ordem?: number
          simbolo?: string | null
        }
        Relationships: []
      }
      big5_oracular_perguntas: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          fator_id: string
          id: string
          ordem: number
          texto_pergunta: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          fator_id: string
          id?: string
          ordem: number
          texto_pergunta: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          fator_id?: string
          id?: string
          ordem?: number
          texto_pergunta?: string
        }
        Relationships: [
          {
            foreignKeyName: "big5_oracular_perguntas_fator_id_fkey"
            columns: ["fator_id"]
            isOneToOne: false
            referencedRelation: "big5_oracular_fatores"
            referencedColumns: ["id"]
          },
        ]
      }
      big5_oracular_registros: {
        Row: {
          created_at: string | null
          fator_fragilizado: string | null
          fator_predominante: string | null
          id: string
          medias_json: Json
          reflexao_pessoal: string | null
          respostas_json: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          fator_fragilizado?: string | null
          fator_predominante?: string | null
          id?: string
          medias_json?: Json
          reflexao_pessoal?: string | null
          respostas_json?: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          fator_fragilizado?: string | null
          fator_predominante?: string | null
          id?: string
          medias_json?: Json
          reflexao_pessoal?: string | null
          respostas_json?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      big5_porta_mapeamento: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao_combinacao: string | null
          fator_alto: string
          fator_baixo: string
          id: string
          narrativa_curta: string | null
          ordem: number | null
          porta_associada: string
          porta_tipo_campo: string | null
          ritual_id: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao_combinacao?: string | null
          fator_alto: string
          fator_baixo: string
          id?: string
          narrativa_curta?: string | null
          ordem?: number | null
          porta_associada: string
          porta_tipo_campo?: string | null
          ritual_id?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao_combinacao?: string | null
          fator_alto?: string
          fator_baixo?: string
          id?: string
          narrativa_curta?: string | null
          ordem?: number | null
          porta_associada?: string
          porta_tipo_campo?: string | null
          ritual_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "big5_porta_mapeamento_ritual_id_fkey"
            columns: ["ritual_id"]
            isOneToOne: false
            referencedRelation: "rituais_simbolicos"
            referencedColumns: ["id"]
          },
        ]
      }
      big5_questionario: {
        Row: {
          ativo: boolean
          created_at: string
          dimensao: Database["public"]["Enums"]["big5_dimensao"]
          id: string
          ordem: number
          texto_pergunta: string
          tipo: Database["public"]["Enums"]["big5_tipo_pergunta"]
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          dimensao: Database["public"]["Enums"]["big5_dimensao"]
          id?: string
          ordem?: number
          texto_pergunta: string
          tipo?: Database["public"]["Enums"]["big5_tipo_pergunta"]
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          dimensao?: Database["public"]["Enums"]["big5_dimensao"]
          id?: string
          ordem?: number
          texto_pergunta?: string
          tipo?: Database["public"]["Enums"]["big5_tipo_pergunta"]
          updated_at?: string
        }
        Relationships: []
      }
      big5_registros: {
        Row: {
          abertura: number
          amabilidade: number
          caso_id: string | null
          cliente_id: string | null
          conscienciosidade: number
          created_at: string
          extroversao: number
          id: string
          impacto_clinico: string | null
          neuroticismo: number
          notas: string | null
          terapeuta_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          abertura: number
          amabilidade: number
          caso_id?: string | null
          cliente_id?: string | null
          conscienciosidade: number
          created_at?: string
          extroversao: number
          id?: string
          impacto_clinico?: string | null
          neuroticismo: number
          notas?: string | null
          terapeuta_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          abertura?: number
          amabilidade?: number
          caso_id?: string | null
          cliente_id?: string | null
          conscienciosidade?: number
          created_at?: string
          extroversao?: number
          id?: string
          impacto_clinico?: string | null
          neuroticismo?: number
          notas?: string | null
          terapeuta_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_big5_caso"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos"
            referencedColumns: ["id"]
          },
        ]
      }
      big5_ritual_registros: {
        Row: {
          acessou_narroterapia: boolean | null
          big5_registro_id: string | null
          completado_em: string | null
          created_at: string | null
          id: string
          porta_acessada: string | null
          ritual_id: string | null
          user_id: string
        }
        Insert: {
          acessou_narroterapia?: boolean | null
          big5_registro_id?: string | null
          completado_em?: string | null
          created_at?: string | null
          id?: string
          porta_acessada?: string | null
          ritual_id?: string | null
          user_id: string
        }
        Update: {
          acessou_narroterapia?: boolean | null
          big5_registro_id?: string | null
          completado_em?: string | null
          created_at?: string | null
          id?: string
          porta_acessada?: string | null
          ritual_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "big5_ritual_registros_big5_registro_id_fkey"
            columns: ["big5_registro_id"]
            isOneToOne: false
            referencedRelation: "big5_oracular_registros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "big5_ritual_registros_ritual_id_fkey"
            columns: ["ritual_id"]
            isOneToOne: false
            referencedRelation: "rituais_simbolicos"
            referencedColumns: ["id"]
          },
        ]
      }
      big5_symbolic_afirmacoes: {
        Row: {
          ativo: boolean
          created_at: string
          force_id: string
          id: string
          ordem: number
          peso: number
          texto_afirmacao: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          force_id: string
          id?: string
          ordem?: number
          peso?: number
          texto_afirmacao: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          force_id?: string
          id?: string
          ordem?: number
          peso?: number
          texto_afirmacao?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "big5_symbolic_afirmacoes_force_id_fkey"
            columns: ["force_id"]
            isOneToOne: false
            referencedRelation: "big5_symbolic_forces"
            referencedColumns: ["id"]
          },
        ]
      }
      big5_symbolic_forces: {
        Row: {
          ativo: boolean
          chave: string
          conflito_recorrente: string | null
          cor_primaria: string | null
          created_at: string
          descricao_simbolica: string
          icone: string | null
          id: string
          microcopy_reflexao: string | null
          narrativa_elevada: string | null
          narrativa_fragil: string | null
          nome: string
          nome_en: string | null
          ordem: number
          padrao_emocional: string | null
          potencial_inexplorado: string | null
          pratica_sugerida: string | null
          repeticao_comportamental: string | null
          risco_clinico: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          chave: string
          conflito_recorrente?: string | null
          cor_primaria?: string | null
          created_at?: string
          descricao_simbolica: string
          icone?: string | null
          id?: string
          microcopy_reflexao?: string | null
          narrativa_elevada?: string | null
          narrativa_fragil?: string | null
          nome: string
          nome_en?: string | null
          ordem?: number
          padrao_emocional?: string | null
          potencial_inexplorado?: string | null
          pratica_sugerida?: string | null
          repeticao_comportamental?: string | null
          risco_clinico?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          chave?: string
          conflito_recorrente?: string | null
          cor_primaria?: string | null
          created_at?: string
          descricao_simbolica?: string
          icone?: string | null
          id?: string
          microcopy_reflexao?: string | null
          narrativa_elevada?: string | null
          narrativa_fragil?: string | null
          nome?: string
          nome_en?: string | null
          ordem?: number
          padrao_emocional?: string | null
          potencial_inexplorado?: string | null
          pratica_sugerida?: string | null
          repeticao_comportamental?: string | null
          risco_clinico?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      big5_symbolic_registros: {
        Row: {
          abertura_intensidade: string | null
          cliente_id: string | null
          created_at: string
          expressao_intensidade: string | null
          id: string
          narrativa_editada: boolean | null
          narrativa_localizacao: string | null
          nome_simbolico: string | null
          notas: string | null
          notas_terapeuta: string | null
          reflexao_final: string | null
          relacional_intensidade: string | null
          respostas_json: Json | null
          sensibilidade_intensidade: string | null
          session_case_id: string | null
          suporte_intensidade: string | null
          terapeuta_id: string | null
          territorio_predominante: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          abertura_intensidade?: string | null
          cliente_id?: string | null
          created_at?: string
          expressao_intensidade?: string | null
          id?: string
          narrativa_editada?: boolean | null
          narrativa_localizacao?: string | null
          nome_simbolico?: string | null
          notas?: string | null
          notas_terapeuta?: string | null
          reflexao_final?: string | null
          relacional_intensidade?: string | null
          respostas_json?: Json | null
          sensibilidade_intensidade?: string | null
          session_case_id?: string | null
          suporte_intensidade?: string | null
          terapeuta_id?: string | null
          territorio_predominante?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          abertura_intensidade?: string | null
          cliente_id?: string | null
          created_at?: string
          expressao_intensidade?: string | null
          id?: string
          narrativa_editada?: boolean | null
          narrativa_localizacao?: string | null
          nome_simbolico?: string | null
          notas?: string | null
          notas_terapeuta?: string | null
          reflexao_final?: string | null
          relacional_intensidade?: string | null
          respostas_json?: Json | null
          sensibilidade_intensidade?: string | null
          session_case_id?: string | null
          suporte_intensidade?: string | null
          terapeuta_id?: string | null
          territorio_predominante?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "big5_symbolic_registros_session_case_id_fkey"
            columns: ["session_case_id"]
            isOneToOne: false
            referencedRelation: "session_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      book_links: {
        Row: {
          from_book_id: string
          id: string
          link_type: string
          note: string | null
          to_book_id: string
        }
        Insert: {
          from_book_id: string
          id?: string
          link_type: string
          note?: string | null
          to_book_id: string
        }
        Update: {
          from_book_id?: string
          id?: string
          link_type?: string
          note?: string | null
          to_book_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_links_from_book_id_fkey"
            columns: ["from_book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_links_to_book_id_fkey"
            columns: ["to_book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      book_media: {
        Row: {
          caption: string | null
          created_at: string
          credit: string | null
          file_kind: string
          file_url: string
          id: string
          order_index: number
          published: boolean
          source_url: string | null
          station_id: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          credit?: string | null
          file_kind?: string
          file_url: string
          id?: string
          order_index?: number
          published?: boolean
          source_url?: string | null
          station_id: string
          title?: string
          type: string
          updated_at?: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          credit?: string | null
          file_kind?: string
          file_url?: string
          id?: string
          order_index?: number
          published?: boolean
          source_url?: string | null
          station_id?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_media_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "clube_estacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      book_tours: {
        Row: {
          ativo: boolean
          book_id: string
          como_atravessar: string | null
          created_at: string
          habilidade_simbolica: string | null
          id: string
          jornada: string
          o_que_nao_fazer: string | null
          onde_entra_jornada: string | null
          quando_encerrar: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          book_id: string
          como_atravessar?: string | null
          created_at?: string
          habilidade_simbolica?: string | null
          id?: string
          jornada?: string
          o_que_nao_fazer?: string | null
          onde_entra_jornada?: string | null
          quando_encerrar?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          book_id?: string
          como_atravessar?: string | null
          created_at?: string
          habilidade_simbolica?: string | null
          id?: string
          jornada?: string
          o_que_nao_fazer?: string | null
          onde_entra_jornada?: string | null
          quando_encerrar?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_tours_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: true
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          author: string | null
          category: string
          cover_url: string | null
          created_at: string | null
          description_short: string | null
          how_to_read: string | null
          id: string
          is_multipolar: boolean | null
          manifesto_short: string | null
          title: string
          updated_at: string | null
          why_here: string | null
        }
        Insert: {
          author?: string | null
          category: string
          cover_url?: string | null
          created_at?: string | null
          description_short?: string | null
          how_to_read?: string | null
          id?: string
          is_multipolar?: boolean | null
          manifesto_short?: string | null
          title: string
          updated_at?: string | null
          why_here?: string | null
        }
        Update: {
          author?: string | null
          category?: string
          cover_url?: string | null
          created_at?: string | null
          description_short?: string | null
          how_to_read?: string | null
          id?: string
          is_multipolar?: boolean | null
          manifesto_short?: string | null
          title?: string
          updated_at?: string | null
          why_here?: string | null
        }
        Relationships: []
      }
      cartografia_complexos: {
        Row: {
          client_id: string
          complexo_dominante: string | null
          complexo_latente: string | null
          complexos_json: Json
          created_at: string
          gatilhos_gerais: string | null
          id: string
          padrao_central: string | null
          reflexao_final: string | null
          reflexao_origem: string | null
          therapist_id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          complexo_dominante?: string | null
          complexo_latente?: string | null
          complexos_json?: Json
          created_at?: string
          gatilhos_gerais?: string | null
          id?: string
          padrao_central?: string | null
          reflexao_final?: string | null
          reflexao_origem?: string | null
          therapist_id: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          complexo_dominante?: string | null
          complexo_latente?: string | null
          complexos_json?: Json
          created_at?: string
          gatilhos_gerais?: string | null
          id?: string
          padrao_central?: string | null
          reflexao_final?: string | null
          reflexao_origem?: string | null
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cartografia_complexos_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      cartografia_psiquica: {
        Row: {
          atmosfera: string[]
          client_id: string | null
          conflitos_tensoes: string | null
          cor_predominante: string
          created_at: string
          id: string
          indice_equilibrio: number | null
          metadata_json: Json | null
          ponto_partida: string | null
          por_que_simbolo: string | null
          recursos_internos: string | null
          resumo_narrativo: string | null
          simbolo_pessoal: string | null
          sugestao_proximo_passo: string | null
          territorios_principais: string[]
          therapist_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          atmosfera?: string[]
          client_id?: string | null
          conflitos_tensoes?: string | null
          cor_predominante: string
          created_at?: string
          id?: string
          indice_equilibrio?: number | null
          metadata_json?: Json | null
          ponto_partida?: string | null
          por_que_simbolo?: string | null
          recursos_internos?: string | null
          resumo_narrativo?: string | null
          simbolo_pessoal?: string | null
          sugestao_proximo_passo?: string | null
          territorios_principais?: string[]
          therapist_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          atmosfera?: string[]
          client_id?: string | null
          conflitos_tensoes?: string | null
          cor_predominante?: string
          created_at?: string
          id?: string
          indice_equilibrio?: number | null
          metadata_json?: Json | null
          ponto_partida?: string | null
          por_que_simbolo?: string | null
          recursos_internos?: string | null
          resumo_narrativo?: string | null
          simbolo_pessoal?: string | null
          sugestao_proximo_passo?: string | null
          territorios_principais?: string[]
          therapist_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cartografia_psiquica_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      cartographies: {
        Row: {
          classification_json: Json | null
          client_id: string
          created_at: string
          date: string
          id: string
          scores_json: Json
          session_id: string | null
        }
        Insert: {
          classification_json?: Json | null
          client_id: string
          created_at?: string
          date?: string
          id?: string
          scores_json?: Json
          session_id?: string | null
        }
        Update: {
          classification_json?: Json | null
          client_id?: string
          created_at?: string
          date?: string
          id?: string
          scores_json?: Json
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cartographies_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cartographies_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      casa_circulo_replies: {
        Row: {
          autor_id: string
          conteudo: string
          created_at: string
          id: string
          thread_id: string
          updated_at: string
        }
        Insert: {
          autor_id: string
          conteudo: string
          created_at?: string
          id?: string
          thread_id: string
          updated_at?: string
        }
        Update: {
          autor_id?: string
          conteudo?: string
          created_at?: string
          id?: string
          thread_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "casa_circulo_replies_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "casa_circulo_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      casa_circulo_threads: {
        Row: {
          autor_id: string
          conteudo: string
          created_at: string
          fixado: boolean | null
          id: string
          portal_minimo: Database["public"]["Enums"]["portal_type"] | null
          respostas_count: number | null
          status: string | null
          titulo: string
          ultima_atividade: string | null
          updated_at: string
        }
        Insert: {
          autor_id: string
          conteudo: string
          created_at?: string
          fixado?: boolean | null
          id?: string
          portal_minimo?: Database["public"]["Enums"]["portal_type"] | null
          respostas_count?: number | null
          status?: string | null
          titulo: string
          ultima_atividade?: string | null
          updated_at?: string
        }
        Update: {
          autor_id?: string
          conteudo?: string
          created_at?: string
          fixado?: boolean | null
          id?: string
          portal_minimo?: Database["public"]["Enums"]["portal_type"] | null
          respostas_count?: number | null
          status?: string | null
          titulo?: string
          ultima_atividade?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      casa_posts: {
        Row: {
          autor_id: string | null
          conteudo: string | null
          created_at: string
          descricao: string | null
          destaque: boolean | null
          duracao_segundos: number | null
          id: string
          media_type: Database["public"]["Enums"]["casa_media_type"] | null
          media_url: string | null
          ordem: number | null
          portal_minimo: Database["public"]["Enums"]["portal_type"] | null
          publicado: boolean | null
          room: Database["public"]["Enums"]["casa_room"]
          tags: string[] | null
          titulo: string
          updated_at: string
        }
        Insert: {
          autor_id?: string | null
          conteudo?: string | null
          created_at?: string
          descricao?: string | null
          destaque?: boolean | null
          duracao_segundos?: number | null
          id?: string
          media_type?: Database["public"]["Enums"]["casa_media_type"] | null
          media_url?: string | null
          ordem?: number | null
          portal_minimo?: Database["public"]["Enums"]["portal_type"] | null
          publicado?: boolean | null
          room: Database["public"]["Enums"]["casa_room"]
          tags?: string[] | null
          titulo: string
          updated_at?: string
        }
        Update: {
          autor_id?: string | null
          conteudo?: string | null
          created_at?: string
          descricao?: string | null
          destaque?: boolean | null
          duracao_segundos?: number | null
          id?: string
          media_type?: Database["public"]["Enums"]["casa_media_type"] | null
          media_url?: string | null
          ordem?: number | null
          portal_minimo?: Database["public"]["Enums"]["portal_type"] | null
          publicado?: boolean | null
          room?: Database["public"]["Enums"]["casa_room"]
          tags?: string[] | null
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      casos: {
        Row: {
          cliente_id: string
          codinome: string
          created_at: string
          historico_breve: string | null
          id: string
          tags: string[] | null
          tema_central: string
          terapeuta_id: string
          updated_at: string
        }
        Insert: {
          cliente_id: string
          codinome: string
          created_at?: string
          historico_breve?: string | null
          id?: string
          tags?: string[] | null
          tema_central: string
          terapeuta_id: string
          updated_at?: string
        }
        Update: {
          cliente_id?: string
          codinome?: string
          created_at?: string
          historico_breve?: string | null
          id?: string
          tags?: string[] | null
          tema_central?: string
          terapeuta_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          carga_horaria_total: number | null
          certificado_url: string | null
          ciclo_id: string | null
          created_at: string | null
          id: string
          issue_date: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          carga_horaria_total?: number | null
          certificado_url?: string | null
          ciclo_id?: string | null
          created_at?: string | null
          id?: string
          issue_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          carga_horaria_total?: number | null
          certificado_url?: string | null
          ciclo_id?: string | null
          created_at?: string | null
          id?: string
          issue_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_ciclo_id_fkey"
            columns: ["ciclo_id"]
            isOneToOne: false
            referencedRelation: "clube_livro_ciclos"
            referencedColumns: ["id"]
          },
        ]
      }
      cidadela_oracle_cards: {
        Row: {
          base_question: string | null
          color_hex: string | null
          created_at: string
          description: string | null
          district_id: string | null
          family: string
          id: string
          image_url: string | null
          is_active: boolean
          keyword: string | null
          name: string
          ordem: number
          suggested_intervention_id: string | null
          suggested_tool: string | null
          suggested_tool_id: string | null
          updated_at: string
        }
        Insert: {
          base_question?: string | null
          color_hex?: string | null
          created_at?: string
          description?: string | null
          district_id?: string | null
          family: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          keyword?: string | null
          name: string
          ordem?: number
          suggested_intervention_id?: string | null
          suggested_tool?: string | null
          suggested_tool_id?: string | null
          updated_at?: string
        }
        Update: {
          base_question?: string | null
          color_hex?: string | null
          created_at?: string
          description?: string | null
          district_id?: string | null
          family?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          keyword?: string | null
          name?: string
          ordem?: number
          suggested_intervention_id?: string | null
          suggested_tool?: string | null
          suggested_tool_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cidadela_oracle_cards_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cidadela_oracle_cards_suggested_tool_id_fkey"
            columns: ["suggested_tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      cidadela_oracle_usage: {
        Row: {
          card_id: string
          client_id: string
          count: number
          id: string
          last_used_at: string
        }
        Insert: {
          card_id: string
          client_id: string
          count?: number
          id?: string
          last_used_at?: string
        }
        Update: {
          card_id?: string
          client_id?: string
          count?: number
          id?: string
          last_used_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cidadela_oracle_usage_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cidadela_oracle_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cidadela_oracle_usage_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      circulos_sagrados: {
        Row: {
          created_at: string
          data_hora: string
          distritos_ativados: string[] | null
          facilitadora_id: string
          id: string
          local_link: string | null
          nome_circulo: string
          participantes_ids: string[] | null
          ritual_base: string
          status_circulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_hora: string
          distritos_ativados?: string[] | null
          facilitadora_id: string
          id?: string
          local_link?: string | null
          nome_circulo: string
          participantes_ids?: string[] | null
          ritual_base: string
          status_circulo?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_hora?: string
          distritos_ativados?: string[] | null
          facilitadora_id?: string
          id?: string
          local_link?: string | null
          nome_circulo?: string
          participantes_ids?: string[] | null
          ritual_base?: string
          status_circulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_labyrinths: {
        Row: {
          acoes_ruptura: string[] | null
          client_id: string
          created_at: string
          descricao: string | null
          gatilhos: string[] | null
          id: string
          nome_padrao: string
          notas: string | null
          sessoes_relacionadas: number | null
          severidade: string
          status: string
          therapist_id: string
          tipo: string
          ultima_ocorrencia: string | null
          updated_at: string
        }
        Insert: {
          acoes_ruptura?: string[] | null
          client_id: string
          created_at?: string
          descricao?: string | null
          gatilhos?: string[] | null
          id?: string
          nome_padrao: string
          notas?: string | null
          sessoes_relacionadas?: number | null
          severidade?: string
          status?: string
          therapist_id: string
          tipo?: string
          ultima_ocorrencia?: string | null
          updated_at?: string
        }
        Update: {
          acoes_ruptura?: string[] | null
          client_id?: string
          created_at?: string
          descricao?: string | null
          gatilhos?: string[] | null
          id?: string
          nome_padrao?: string
          notas?: string | null
          sessoes_relacionadas?: number | null
          severidade?: string
          status?: string
          therapist_id?: string
          tipo?: string
          ultima_ocorrencia?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_labyrinths_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      client_pattern_stats: {
        Row: {
          client_id: string
          created_at: string
          id: string
          last_seen_at: string
          occurrence_count: number
          pattern_name: string
          pattern_type: Database["public"]["Enums"]["pattern_stat_type"]
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          last_seen_at?: string
          occurrence_count?: number
          pattern_name: string
          pattern_type: Database["public"]["Enums"]["pattern_stat_type"]
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          last_seen_at?: string
          occurrence_count?: number
          pattern_name?: string
          pattern_type?: Database["public"]["Enums"]["pattern_stat_type"]
        }
        Relationships: [
          {
            foreignKeyName: "client_pattern_stats_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      client_seasons: {
        Row: {
          client_id: string
          created_at: string
          data_registro: string
          descricao: string | null
          energia_predominante: string | null
          estacao: string
          id: string
          intervencao_sugerida: string | null
          necessidade_central: string | null
          notas: string | null
          therapist_id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          data_registro?: string
          descricao?: string | null
          energia_predominante?: string | null
          estacao: string
          id?: string
          intervencao_sugerida?: string | null
          necessidade_central?: string | null
          notas?: string | null
          therapist_id: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          data_registro?: string
          descricao?: string | null
          energia_predominante?: string | null
          estacao?: string
          id?: string
          intervencao_sugerida?: string | null
          necessidade_central?: string | null
          notas?: string | null
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_seasons_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          archetypal_profile_history: Json | null
          archetypal_profile_json: Json | null
          codigo_interno: string | null
          created_at: string
          data_inicio: string | null
          id: string
          nome: string
          objetivo_terapeutico: string | null
          observacao_segura: string | null
          status: Database["public"]["Enums"]["cliente_status"]
          terapeuta_id: string
          updated_at: string
        }
        Insert: {
          archetypal_profile_history?: Json | null
          archetypal_profile_json?: Json | null
          codigo_interno?: string | null
          created_at?: string
          data_inicio?: string | null
          id?: string
          nome: string
          objetivo_terapeutico?: string | null
          observacao_segura?: string | null
          status?: Database["public"]["Enums"]["cliente_status"]
          terapeuta_id: string
          updated_at?: string
        }
        Update: {
          archetypal_profile_history?: Json | null
          archetypal_profile_json?: Json | null
          codigo_interno?: string | null
          created_at?: string
          data_inicio?: string | null
          id?: string
          nome?: string
          objetivo_terapeutico?: string | null
          observacao_segura?: string | null
          status?: Database["public"]["Enums"]["cliente_status"]
          terapeuta_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      clientes_piloto: {
        Row: {
          created_at: string | null
          id: string
          nome_cliente: string
          numero_sessao: number
          prontuario: string
          reflexoes: string | null
          status_supervisao: string
          supervisor_feedback: string | null
          supervisor_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome_cliente: string
          numero_sessao?: number
          prontuario?: string
          reflexoes?: string | null
          status_supervisao?: string
          supervisor_feedback?: string | null
          supervisor_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          nome_cliente?: string
          numero_sessao?: number
          prontuario?: string
          reflexoes?: string | null
          status_supervisao?: string
          supervisor_feedback?: string | null
          supervisor_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      clube_audio_albums: {
        Row: {
          capa_url: string | null
          created_at: string
          descricao: string | null
          estacao_id: string
          id: string
          ordem: number
          status: Database["public"]["Enums"]["album_status"]
          titulo: string
          updated_at: string
        }
        Insert: {
          capa_url?: string | null
          created_at?: string
          descricao?: string | null
          estacao_id: string
          id?: string
          ordem?: number
          status?: Database["public"]["Enums"]["album_status"]
          titulo: string
          updated_at?: string
        }
        Update: {
          capa_url?: string | null
          created_at?: string
          descricao?: string | null
          estacao_id?: string
          id?: string
          ordem?: number
          status?: Database["public"]["Enums"]["album_status"]
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clube_audio_albums_estacao_id_fkey"
            columns: ["estacao_id"]
            isOneToOne: false
            referencedRelation: "clube_estacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      clube_audio_progress: {
        Row: {
          concluido: boolean
          id: string
          posicao_segundos: number
          track_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          concluido?: boolean
          id?: string
          posicao_segundos?: number
          track_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          concluido?: boolean
          id?: string
          posicao_segundos?: number
          track_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clube_audio_progress_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "clube_audio_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      clube_audio_tracks: {
        Row: {
          album_id: string
          audio_url: string
          created_at: string
          duracao_segundos: number | null
          id: string
          ordem: number
          publicado: boolean
          tags: string[] | null
          tipo: Database["public"]["Enums"]["track_type"]
          titulo: string
          updated_at: string
        }
        Insert: {
          album_id: string
          audio_url: string
          created_at?: string
          duracao_segundos?: number | null
          id?: string
          ordem?: number
          publicado?: boolean
          tags?: string[] | null
          tipo?: Database["public"]["Enums"]["track_type"]
          titulo: string
          updated_at?: string
        }
        Update: {
          album_id?: string
          audio_url?: string
          created_at?: string
          duracao_segundos?: number | null
          id?: string
          ordem?: number
          publicado?: boolean
          tags?: string[] | null
          tipo?: Database["public"]["Enums"]["track_type"]
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clube_audio_tracks_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "clube_audio_albums"
            referencedColumns: ["id"]
          },
        ]
      }
      clube_audit_log: {
        Row: {
          acao: string
          campo_alterado: string | null
          created_at: string
          id: string
          registro_id: string
          tabela: string
          user_id: string
          valor_anterior: string | null
          valor_novo: string | null
        }
        Insert: {
          acao: string
          campo_alterado?: string | null
          created_at?: string
          id?: string
          registro_id: string
          tabela: string
          user_id: string
          valor_anterior?: string | null
          valor_novo?: string | null
        }
        Update: {
          acao?: string
          campo_alterado?: string | null
          created_at?: string
          id?: string
          registro_id?: string
          tabela?: string
          user_id?: string
          valor_anterior?: string | null
          valor_novo?: string | null
        }
        Relationships: []
      }
      clube_estacao_registros: {
        Row: {
          created_at: string
          estacao_id: string
          id: string
          texto: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          estacao_id: string
          id?: string
          texto?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          estacao_id?: string
          id?: string
          texto?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clube_estacao_registros_estacao_id_fkey"
            columns: ["estacao_id"]
            isOneToOne: false
            referencedRelation: "clube_estacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      clube_estacoes: {
        Row: {
          aplicacao_acao: string | null
          aplicacao_reflexao: string | null
          ativa: boolean | null
          created_at: string
          essencia_nucleo: string | null
          essencia_tensao: string | null
          essencia_transformacao: string | null
          fase_lunar: string | null
          id: string
          livro_autor: string | null
          livro_capa_url: string | null
          livro_titulo: string
          numero: number
          ordem: number
          publicada: boolean | null
          subtitulo: string
          titulo: string
          traducao_aula: string | null
          traducao_circulo: string | null
          traducao_sessao: string | null
          updated_at: string
        }
        Insert: {
          aplicacao_acao?: string | null
          aplicacao_reflexao?: string | null
          ativa?: boolean | null
          created_at?: string
          essencia_nucleo?: string | null
          essencia_tensao?: string | null
          essencia_transformacao?: string | null
          fase_lunar?: string | null
          id?: string
          livro_autor?: string | null
          livro_capa_url?: string | null
          livro_titulo: string
          numero: number
          ordem?: number
          publicada?: boolean | null
          subtitulo: string
          titulo: string
          traducao_aula?: string | null
          traducao_circulo?: string | null
          traducao_sessao?: string | null
          updated_at?: string
        }
        Update: {
          aplicacao_acao?: string | null
          aplicacao_reflexao?: string | null
          ativa?: boolean | null
          created_at?: string
          essencia_nucleo?: string | null
          essencia_tensao?: string | null
          essencia_transformacao?: string | null
          fase_lunar?: string | null
          id?: string
          livro_autor?: string | null
          livro_capa_url?: string | null
          livro_titulo?: string
          numero?: number
          ordem?: number
          publicada?: boolean | null
          subtitulo?: string
          titulo?: string
          traducao_aula?: string | null
          traducao_circulo?: string | null
          traducao_sessao?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      clube_jornadas: {
        Row: {
          ativa: boolean
          cor: string | null
          created_at: string
          descricao: string | null
          estacao_id: string
          icone: string | null
          id: string
          nome: string
          ordem: number
          slug: string
          subtitulo: string | null
          tipo: Database["public"]["Enums"]["clube_jornada_tipo"]
          updated_at: string
        }
        Insert: {
          ativa?: boolean
          cor?: string | null
          created_at?: string
          descricao?: string | null
          estacao_id: string
          icone?: string | null
          id?: string
          nome: string
          ordem?: number
          slug: string
          subtitulo?: string | null
          tipo?: Database["public"]["Enums"]["clube_jornada_tipo"]
          updated_at?: string
        }
        Update: {
          ativa?: boolean
          cor?: string | null
          created_at?: string
          descricao?: string | null
          estacao_id?: string
          icone?: string | null
          id?: string
          nome?: string
          ordem?: number
          slug?: string
          subtitulo?: string | null
          tipo?: Database["public"]["Enums"]["clube_jornada_tipo"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clube_jornadas_estacao_id_fkey"
            columns: ["estacao_id"]
            isOneToOne: false
            referencedRelation: "clube_estacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      clube_livro_aulas: {
        Row: {
          ativo: boolean | null
          ciclo_id: string
          conteudo: string | null
          created_at: string
          descricao: string | null
          duracao: string | null
          id: string
          media_type: string | null
          media_url: string | null
          ordem: number | null
          porta_id: string | null
          publicado: boolean | null
          subtitulo: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          ciclo_id: string
          conteudo?: string | null
          created_at?: string
          descricao?: string | null
          duracao?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          ordem?: number | null
          porta_id?: string | null
          publicado?: boolean | null
          subtitulo?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          ciclo_id?: string
          conteudo?: string | null
          created_at?: string
          descricao?: string | null
          duracao?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          ordem?: number | null
          porta_id?: string | null
          publicado?: boolean | null
          subtitulo?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clube_livro_aulas_ciclo_id_fkey"
            columns: ["ciclo_id"]
            isOneToOne: false
            referencedRelation: "clube_livro_ciclos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clube_livro_aulas_porta_id_fkey"
            columns: ["porta_id"]
            isOneToOne: false
            referencedRelation: "clube_livro_portas"
            referencedColumns: ["id"]
          },
        ]
      }
      clube_livro_ciclos: {
        Row: {
          ativo: boolean | null
          autor_livro: string | null
          campo_simbolico: string | null
          capa_url: string | null
          carga_horaria_ajuste: number
          carga_horaria_base: number
          como_ler: string | null
          como_ler_audio_url: string | null
          como_ler_slides: Json | null
          created_at: string
          data_encontro: string | null
          data_fim: string | null
          data_inicio: string | null
          id: string
          infografico_url: string | null
          is_multipolar: boolean | null
          link_encontro: string | null
          link_gravacao: string | null
          manifesto: string | null
          mensagem_campo_texto: string | null
          mensagem_campo_url: string | null
          ordem: number | null
          orientacao_clinica_contraindicado: string | null
          orientacao_clinica_evitar: string | null
          orientacao_clinica_indicado: string | null
          orientacao_clinica_riscos: string | null
          orientacao_clinica_uso: string | null
          por_que_audio_url: string | null
          por_que_este_livro: string | null
          por_que_slides: Json | null
          portal_minimo: Database["public"]["Enums"]["portal_type"] | null
          portal_minimo_clinico: string | null
          publicado: boolean | null
          ritual_aceite_obrigatorio: boolean | null
          subtitulo: string | null
          tema_simbolico: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          autor_livro?: string | null
          campo_simbolico?: string | null
          capa_url?: string | null
          carga_horaria_ajuste?: number
          carga_horaria_base?: number
          como_ler?: string | null
          como_ler_audio_url?: string | null
          como_ler_slides?: Json | null
          created_at?: string
          data_encontro?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          id?: string
          infografico_url?: string | null
          is_multipolar?: boolean | null
          link_encontro?: string | null
          link_gravacao?: string | null
          manifesto?: string | null
          mensagem_campo_texto?: string | null
          mensagem_campo_url?: string | null
          ordem?: number | null
          orientacao_clinica_contraindicado?: string | null
          orientacao_clinica_evitar?: string | null
          orientacao_clinica_indicado?: string | null
          orientacao_clinica_riscos?: string | null
          orientacao_clinica_uso?: string | null
          por_que_audio_url?: string | null
          por_que_este_livro?: string | null
          por_que_slides?: Json | null
          portal_minimo?: Database["public"]["Enums"]["portal_type"] | null
          portal_minimo_clinico?: string | null
          publicado?: boolean | null
          ritual_aceite_obrigatorio?: boolean | null
          subtitulo?: string | null
          tema_simbolico?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          autor_livro?: string | null
          campo_simbolico?: string | null
          capa_url?: string | null
          carga_horaria_ajuste?: number
          carga_horaria_base?: number
          como_ler?: string | null
          como_ler_audio_url?: string | null
          como_ler_slides?: Json | null
          created_at?: string
          data_encontro?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          id?: string
          infografico_url?: string | null
          is_multipolar?: boolean | null
          link_encontro?: string | null
          link_gravacao?: string | null
          manifesto?: string | null
          mensagem_campo_texto?: string | null
          mensagem_campo_url?: string | null
          ordem?: number | null
          orientacao_clinica_contraindicado?: string | null
          orientacao_clinica_evitar?: string | null
          orientacao_clinica_indicado?: string | null
          orientacao_clinica_riscos?: string | null
          orientacao_clinica_uso?: string | null
          por_que_audio_url?: string | null
          por_que_este_livro?: string | null
          por_que_slides?: Json | null
          portal_minimo?: Database["public"]["Enums"]["portal_type"] | null
          portal_minimo_clinico?: string | null
          publicado?: boolean | null
          ritual_aceite_obrigatorio?: boolean | null
          subtitulo?: string | null
          tema_simbolico?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      clube_livro_encontros: {
        Row: {
          ativo: boolean | null
          ciclo_id: string
          created_at: string
          data_encontro: string | null
          descricao: string | null
          id: string
          link_ao_vivo: string | null
          orientacao_encontro: string | null
          replay_url: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          ciclo_id: string
          created_at?: string
          data_encontro?: string | null
          descricao?: string | null
          id?: string
          link_ao_vivo?: string | null
          orientacao_encontro?: string | null
          replay_url?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          ciclo_id?: string
          created_at?: string
          data_encontro?: string | null
          descricao?: string | null
          id?: string
          link_ao_vivo?: string | null
          orientacao_encontro?: string | null
          replay_url?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clube_livro_encontros_ciclo_id_fkey"
            columns: ["ciclo_id"]
            isOneToOne: false
            referencedRelation: "clube_livro_ciclos"
            referencedColumns: ["id"]
          },
        ]
      }
      clube_livro_escuta_progress: {
        Row: {
          concluido: boolean
          escuta_id: string
          id: string
          posicao_segundos: number
          updated_at: string
          user_id: string
        }
        Insert: {
          concluido?: boolean
          escuta_id: string
          id?: string
          posicao_segundos?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          concluido?: boolean
          escuta_id?: string
          id?: string
          posicao_segundos?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clube_livro_escuta_progress_escuta_id_fkey"
            columns: ["escuta_id"]
            isOneToOne: false
            referencedRelation: "clube_livro_escutas"
            referencedColumns: ["id"]
          },
        ]
      }
      clube_livro_escutas: {
        Row: {
          ativo: boolean | null
          audio_url: string | null
          ciclo_id: string
          created_at: string
          descricao: string | null
          duracao_segundos: number | null
          fase_id: string | null
          id: string
          ordem: number | null
          porta_id: string | null
          texto_conteudo: string | null
          tipo: string
          titulo: string
        }
        Insert: {
          ativo?: boolean | null
          audio_url?: string | null
          ciclo_id: string
          created_at?: string
          descricao?: string | null
          duracao_segundos?: number | null
          fase_id?: string | null
          id?: string
          ordem?: number | null
          porta_id?: string | null
          texto_conteudo?: string | null
          tipo?: string
          titulo: string
        }
        Update: {
          ativo?: boolean | null
          audio_url?: string | null
          ciclo_id?: string
          created_at?: string
          descricao?: string | null
          duracao_segundos?: number | null
          fase_id?: string | null
          id?: string
          ordem?: number | null
          porta_id?: string | null
          texto_conteudo?: string | null
          tipo?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "clube_livro_escutas_ciclo_id_fkey"
            columns: ["ciclo_id"]
            isOneToOne: false
            referencedRelation: "clube_livro_ciclos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clube_livro_escutas_fase_id_fkey"
            columns: ["fase_id"]
            isOneToOne: false
            referencedRelation: "clube_livro_fases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clube_livro_escutas_porta_id_fkey"
            columns: ["porta_id"]
            isOneToOne: false
            referencedRelation: "clube_livro_portas"
            referencedColumns: ["id"]
          },
        ]
      }
      clube_livro_fases: {
        Row: {
          alerta_clinico: string | null
          ativo: boolean | null
          ciclo_id: string
          created_at: string
          descricao: string | null
          icone: string | null
          id: string
          leitura_orientada: string | null
          lista_uso_inadequado: string[] | null
          numero_semana: number | null
          observacao_clinica: string | null
          ordem: number | null
          orientacao_curta: string | null
          ponte_sala_id: string | null
          ponte_sala_texto: string | null
          porta_id: string | null
          texto_fechamento: string | null
          tipo_fase: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          alerta_clinico?: string | null
          ativo?: boolean | null
          ciclo_id: string
          created_at?: string
          descricao?: string | null
          icone?: string | null
          id?: string
          leitura_orientada?: string | null
          lista_uso_inadequado?: string[] | null
          numero_semana?: number | null
          observacao_clinica?: string | null
          ordem?: number | null
          orientacao_curta?: string | null
          ponte_sala_id?: string | null
          ponte_sala_texto?: string | null
          porta_id?: string | null
          texto_fechamento?: string | null
          tipo_fase?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          alerta_clinico?: string | null
          ativo?: boolean | null
          ciclo_id?: string
          created_at?: string
          descricao?: string | null
          icone?: string | null
          id?: string
          leitura_orientada?: string | null
          lista_uso_inadequado?: string[] | null
          numero_semana?: number | null
          observacao_clinica?: string | null
          ordem?: number | null
          orientacao_curta?: string | null
          ponte_sala_id?: string | null
          ponte_sala_texto?: string | null
          porta_id?: string | null
          texto_fechamento?: string | null
          tipo_fase?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clube_livro_fases_ciclo_id_fkey"
            columns: ["ciclo_id"]
            isOneToOne: false
            referencedRelation: "clube_livro_ciclos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clube_livro_fases_ponte_sala_id_fkey"
            columns: ["ponte_sala_id"]
            isOneToOne: false
            referencedRelation: "salas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clube_livro_fases_porta_id_fkey"
            columns: ["porta_id"]
            isOneToOne: false
            referencedRelation: "clube_livro_portas"
            referencedColumns: ["id"]
          },
        ]
      }
      clube_livro_integracao_8020: {
        Row: {
          aplicacao_pessoal_acao: string | null
          aplicacao_pessoal_comportamento: string | null
          aplicacao_pessoal_onde: string | null
          ciclo_id: string
          created_at: string
          id: string
          notas_profissionais: string | null
          registro_livre: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          aplicacao_pessoal_acao?: string | null
          aplicacao_pessoal_comportamento?: string | null
          aplicacao_pessoal_onde?: string | null
          ciclo_id: string
          created_at?: string
          id?: string
          notas_profissionais?: string | null
          registro_livre?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          aplicacao_pessoal_acao?: string | null
          aplicacao_pessoal_comportamento?: string | null
          aplicacao_pessoal_onde?: string | null
          ciclo_id?: string
          created_at?: string
          id?: string
          notas_profissionais?: string | null
          registro_livre?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clube_livro_integracao_8020_ciclo_id_fkey"
            columns: ["ciclo_id"]
            isOneToOne: false
            referencedRelation: "clube_livro_ciclos"
            referencedColumns: ["id"]
          },
        ]
      }
      clube_livro_integracao_8020_config: {
        Row: {
          aula_conceito: string | null
          aula_exemplo: string | null
          aula_exercicio: string | null
          ciclo_id: string
          comportamento_abandonar: string | null
          created_at: string
          essencia_texto: string | null
          id: string
          palestra_convite: string | null
          palestra_ideia: string | null
          palestra_narrativa: string | null
          sessao_escuta: string | null
          sessao_pergunta: string | null
          sessao_resistencia: string | null
          tensao_central: string | null
          transformacao_proposta: string | null
          updated_at: string
        }
        Insert: {
          aula_conceito?: string | null
          aula_exemplo?: string | null
          aula_exercicio?: string | null
          ciclo_id: string
          comportamento_abandonar?: string | null
          created_at?: string
          essencia_texto?: string | null
          id?: string
          palestra_convite?: string | null
          palestra_ideia?: string | null
          palestra_narrativa?: string | null
          sessao_escuta?: string | null
          sessao_pergunta?: string | null
          sessao_resistencia?: string | null
          tensao_central?: string | null
          transformacao_proposta?: string | null
          updated_at?: string
        }
        Update: {
          aula_conceito?: string | null
          aula_exemplo?: string | null
          aula_exercicio?: string | null
          ciclo_id?: string
          comportamento_abandonar?: string | null
          created_at?: string
          essencia_texto?: string | null
          id?: string
          palestra_convite?: string | null
          palestra_ideia?: string | null
          palestra_narrativa?: string | null
          sessao_escuta?: string | null
          sessao_pergunta?: string | null
          sessao_resistencia?: string | null
          tensao_central?: string | null
          transformacao_proposta?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clube_livro_integracao_8020_config_ciclo_id_fkey"
            columns: ["ciclo_id"]
            isOneToOne: true
            referencedRelation: "clube_livro_ciclos"
            referencedColumns: ["id"]
          },
        ]
      }
      clube_livro_integracao_config: {
        Row: {
          ciclo_id: string
          created_at: string
          id: string
          movimento_1: string | null
          movimento_2: string | null
          movimento_3: string | null
          pergunta_central: string | null
          ritual_instrucao: string | null
          texto_introdutorio: string | null
          updated_at: string
        }
        Insert: {
          ciclo_id: string
          created_at?: string
          id?: string
          movimento_1?: string | null
          movimento_2?: string | null
          movimento_3?: string | null
          pergunta_central?: string | null
          ritual_instrucao?: string | null
          texto_introdutorio?: string | null
          updated_at?: string
        }
        Update: {
          ciclo_id?: string
          created_at?: string
          id?: string
          movimento_1?: string | null
          movimento_2?: string | null
          movimento_3?: string | null
          pergunta_central?: string | null
          ritual_instrucao?: string | null
          texto_introdutorio?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clube_livro_integracao_config_ciclo_id_fkey"
            columns: ["ciclo_id"]
            isOneToOne: true
            referencedRelation: "clube_livro_ciclos"
            referencedColumns: ["id"]
          },
        ]
      }
      clube_livro_integracoes: {
        Row: {
          ciclo_id: string
          created_at: string
          id: string
          movimentos_concluidos: boolean[] | null
          registro_oracular: string | null
          ritual_concluido: boolean | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ciclo_id: string
          created_at?: string
          id?: string
          movimentos_concluidos?: boolean[] | null
          registro_oracular?: string | null
          ritual_concluido?: boolean | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ciclo_id?: string
          created_at?: string
          id?: string
          movimentos_concluidos?: boolean[] | null
          registro_oracular?: string | null
          ritual_concluido?: boolean | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clube_livro_integracoes_ciclo_id_fkey"
            columns: ["ciclo_id"]
            isOneToOne: false
            referencedRelation: "clube_livro_ciclos"
            referencedColumns: ["id"]
          },
        ]
      }
      clube_livro_perguntas: {
        Row: {
          ativo: boolean | null
          created_at: string
          fase_id: string
          id: string
          ordem: number | null
          texto_pergunta: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string
          fase_id: string
          id?: string
          ordem?: number | null
          texto_pergunta: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string
          fase_id?: string
          id?: string
          ordem?: number | null
          texto_pergunta?: string
        }
        Relationships: [
          {
            foreignKeyName: "clube_livro_perguntas_fase_id_fkey"
            columns: ["fase_id"]
            isOneToOne: false
            referencedRelation: "clube_livro_fases"
            referencedColumns: ["id"]
          },
        ]
      }
      clube_livro_portas: {
        Row: {
          ativo: boolean | null
          ciclo_id: string
          cor: string | null
          created_at: string | null
          descricao: string | null
          icone: string | null
          id: string
          jornada: string
          ordem: number | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          ciclo_id: string
          cor?: string | null
          created_at?: string | null
          descricao?: string | null
          icone?: string | null
          id?: string
          jornada: string
          ordem?: number | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          ciclo_id?: string
          cor?: string | null
          created_at?: string | null
          descricao?: string | null
          icone?: string | null
          id?: string
          jornada?: string
          ordem?: number | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clube_livro_portas_ciclo_id_fkey"
            columns: ["ciclo_id"]
            isOneToOne: false
            referencedRelation: "clube_livro_ciclos"
            referencedColumns: ["id"]
          },
        ]
      }
      clube_livro_respostas: {
        Row: {
          ciclo_id: string
          created_at: string
          fase_id: string
          id: string
          jardim_registro_id: string | null
          pergunta_id: string
          resposta: string | null
          salvo_jardim: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ciclo_id: string
          created_at?: string
          fase_id: string
          id?: string
          jardim_registro_id?: string | null
          pergunta_id: string
          resposta?: string | null
          salvo_jardim?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ciclo_id?: string
          created_at?: string
          fase_id?: string
          id?: string
          jardim_registro_id?: string | null
          pergunta_id?: string
          resposta?: string | null
          salvo_jardim?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clube_livro_respostas_ciclo_id_fkey"
            columns: ["ciclo_id"]
            isOneToOne: false
            referencedRelation: "clube_livro_ciclos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clube_livro_respostas_fase_id_fkey"
            columns: ["fase_id"]
            isOneToOne: false
            referencedRelation: "clube_livro_fases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clube_livro_respostas_pergunta_id_fkey"
            columns: ["pergunta_id"]
            isOneToOne: false
            referencedRelation: "clube_livro_perguntas"
            referencedColumns: ["id"]
          },
        ]
      }
      clube_livro_ritual_aceites: {
        Row: {
          aceito_em: string
          ciclo_id: string
          id: string
          user_id: string
        }
        Insert: {
          aceito_em?: string
          ciclo_id: string
          id?: string
          user_id: string
        }
        Update: {
          aceito_em?: string
          ciclo_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clube_livro_ritual_aceites_ciclo_id_fkey"
            columns: ["ciclo_id"]
            isOneToOne: false
            referencedRelation: "clube_livro_ciclos"
            referencedColumns: ["id"]
          },
        ]
      }
      clube_portais: {
        Row: {
          aplicacao_pessoal: string | null
          aplicacao_profissional: string | null
          ativo: boolean
          created_at: string
          essencia_8020: string | null
          icone: string | null
          id: string
          jardim_heroina: string | null
          jardim_psique: string | null
          jornada_id: string
          laboratorio_8020: string | null
          nome: string
          ordem: number
          raiz_psiquica: string | null
          slug: string
          subtitulo: string | null
          texto_simbolico: string | null
          updated_at: string
        }
        Insert: {
          aplicacao_pessoal?: string | null
          aplicacao_profissional?: string | null
          ativo?: boolean
          created_at?: string
          essencia_8020?: string | null
          icone?: string | null
          id?: string
          jardim_heroina?: string | null
          jardim_psique?: string | null
          jornada_id: string
          laboratorio_8020?: string | null
          nome: string
          ordem?: number
          raiz_psiquica?: string | null
          slug: string
          subtitulo?: string | null
          texto_simbolico?: string | null
          updated_at?: string
        }
        Update: {
          aplicacao_pessoal?: string | null
          aplicacao_profissional?: string | null
          ativo?: boolean
          created_at?: string
          essencia_8020?: string | null
          icone?: string | null
          id?: string
          jardim_heroina?: string | null
          jardim_psique?: string | null
          jornada_id?: string
          laboratorio_8020?: string | null
          nome?: string
          ordem?: number
          raiz_psiquica?: string | null
          slug?: string
          subtitulo?: string | null
          texto_simbolico?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clube_portais_jornada_id_fkey"
            columns: ["jornada_id"]
            isOneToOne: false
            referencedRelation: "clube_jornadas"
            referencedColumns: ["id"]
          },
        ]
      }
      collective_bed_entries: {
        Row: {
          aprovado_por_admin: boolean
          bed_id: string
          created_at: string | null
          exibicao_anonima: boolean
          id: string
          origem: string
          publicado_em: string | null
          rejeitado: boolean
          season_id: string
          texto: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          aprovado_por_admin?: boolean
          bed_id: string
          created_at?: string | null
          exibicao_anonima?: boolean
          id?: string
          origem?: string
          publicado_em?: string | null
          rejeitado?: boolean
          season_id: string
          texto: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          aprovado_por_admin?: boolean
          bed_id?: string
          created_at?: string | null
          exibicao_anonima?: boolean
          id?: string
          origem?: string
          publicado_em?: string | null
          rejeitado?: boolean
          season_id?: string
          texto?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collective_bed_entries_bed_id_fkey"
            columns: ["bed_id"]
            isOneToOne: false
            referencedRelation: "collective_beds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collective_bed_entries_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "oracular_seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      collective_beds: {
        Row: {
          aberto_em: string
          created_at: string | null
          encerrado_em: string | null
          id: string
          season_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          aberto_em?: string
          created_at?: string | null
          encerrado_em?: string | null
          id?: string
          season_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          aberto_em?: string
          created_at?: string | null
          encerrado_em?: string | null
          id?: string
          season_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collective_beds_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: true
            referencedRelation: "oracular_seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      community_comments: {
        Row: {
          autor_id: string
          conteudo: string
          created_at: string | null
          id: string
          post_id: string
        }
        Insert: {
          autor_id: string
          conteudo: string
          created_at?: string | null
          id?: string
          post_id: string
        }
        Update: {
          autor_id?: string
          conteudo?: string
          created_at?: string | null
          id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_event_participants: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "community_events"
            referencedColumns: ["id"]
          },
        ]
      }
      community_events: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          criador_id: string | null
          data_evento: string
          descricao: string | null
          id: string
          link: string | null
          nome: string
          participantes_count: number | null
          tipo: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          criador_id?: string | null
          data_evento: string
          descricao?: string | null
          id?: string
          link?: string | null
          nome: string
          participantes_count?: number | null
          tipo?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          criador_id?: string | null
          data_evento?: string
          descricao?: string | null
          id?: string
          link?: string | null
          nome?: string
          participantes_count?: number | null
          tipo?: string | null
        }
        Relationships: []
      }
      community_forums: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao: string | null
          icone: string | null
          id: string
          nome: string
          ordem: number | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          icone?: string | null
          id?: string
          nome: string
          ordem?: number | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          icone?: string | null
          id?: string
          nome?: string
          ordem?: number | null
        }
        Relationships: []
      }
      community_group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      community_groups: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          criador_id: string
          descricao: string | null
          id: string
          membros_count: number | null
          nome: string
          privado: boolean | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          criador_id: string
          descricao?: string | null
          id?: string
          membros_count?: number | null
          nome: string
          privado?: boolean | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          criador_id?: string
          descricao?: string | null
          id?: string
          membros_count?: number | null
          nome?: string
          privado?: boolean | null
        }
        Relationships: []
      }
      community_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          autor_id: string
          comentarios_count: number | null
          conteudo: string
          created_at: string | null
          curtidas_count: number | null
          id: string
          imagem_url: string | null
          publicado: boolean | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          autor_id: string
          comentarios_count?: number | null
          conteudo: string
          created_at?: string | null
          curtidas_count?: number | null
          id?: string
          imagem_url?: string | null
          publicado?: boolean | null
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          autor_id?: string
          comentarios_count?: number | null
          conteudo?: string
          created_at?: string | null
          curtidas_count?: number | null
          id?: string
          imagem_url?: string | null
          publicado?: boolean | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      community_topic_replies: {
        Row: {
          autor_id: string
          conteudo: string
          created_at: string | null
          id: string
          topic_id: string
        }
        Insert: {
          autor_id: string
          conteudo: string
          created_at?: string | null
          id?: string
          topic_id: string
        }
        Update: {
          autor_id?: string
          conteudo?: string
          created_at?: string | null
          id?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_topic_replies_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "community_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      community_topics: {
        Row: {
          autor_id: string
          conteudo: string
          created_at: string | null
          fixado: boolean | null
          forum_id: string
          id: string
          respostas_count: number | null
          titulo: string
          ultima_atividade: string | null
        }
        Insert: {
          autor_id: string
          conteudo: string
          created_at?: string | null
          fixado?: boolean | null
          forum_id: string
          id?: string
          respostas_count?: number | null
          titulo: string
          ultima_atividade?: string | null
        }
        Update: {
          autor_id?: string
          conteudo?: string
          created_at?: string | null
          fixado?: boolean | null
          forum_id?: string
          id?: string
          respostas_count?: number | null
          titulo?: string
          ultima_atividade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_topics_forum_id_fkey"
            columns: ["forum_id"]
            isOneToOne: false
            referencedRelation: "community_forums"
            referencedColumns: ["id"]
          },
        ]
      }
      confirmacao_profissional: {
        Row: {
          aceita_codigo_etico: boolean
          anos_experiencia: number | null
          area_formacao: string | null
          confirmado_em: string
          created_at: string
          id: string
          tipo_atuacao: string
          updated_at: string
          user_id: string
        }
        Insert: {
          aceita_codigo_etico?: boolean
          anos_experiencia?: number | null
          area_formacao?: string | null
          confirmado_em?: string
          created_at?: string
          id?: string
          tipo_atuacao: string
          updated_at?: string
          user_id: string
        }
        Update: {
          aceita_codigo_etico?: boolean
          anos_experiencia?: number | null
          area_formacao?: string | null
          confirmado_em?: string
          created_at?: string
          id?: string
          tipo_atuacao?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conselho_partes_internas: {
        Row: {
          client_id: string
          created_at: string
          decisao_conselho: string | null
          dialogos_json: Json
          id: string
          partes_json: Json
          reflexao_final: string | null
          sabedoria_integrada: string | null
          tema_conselho: string | null
          therapist_id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          decisao_conselho?: string | null
          dialogos_json?: Json
          id?: string
          partes_json?: Json
          reflexao_final?: string | null
          sabedoria_integrada?: string | null
          tema_conselho?: string | null
          therapist_id: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          decisao_conselho?: string | null
          dialogos_json?: Json
          id?: string
          partes_json?: Json
          reflexao_final?: string | null
          sabedoria_integrada?: string | null
          tema_conselho?: string | null
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conselho_partes_internas_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      content_blocks: {
        Row: {
          agente_id: string | null
          ativo: boolean
          block_type: Database["public"]["Enums"]["content_block_type"]
          cloudflare_video_id: string | null
          content: Json
          context_id: string
          context_type: Database["public"]["Enums"]["block_context_type"]
          created_at: string
          descricao: string | null
          id: string
          ordem: number
          portal_minimo: Database["public"]["Enums"]["portal_type"]
          titulo: string | null
          updated_at: string
        }
        Insert: {
          agente_id?: string | null
          ativo?: boolean
          block_type: Database["public"]["Enums"]["content_block_type"]
          cloudflare_video_id?: string | null
          content?: Json
          context_id: string
          context_type: Database["public"]["Enums"]["block_context_type"]
          created_at?: string
          descricao?: string | null
          id?: string
          ordem?: number
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          titulo?: string | null
          updated_at?: string
        }
        Update: {
          agente_id?: string | null
          ativo?: boolean
          block_type?: Database["public"]["Enums"]["content_block_type"]
          cloudflare_video_id?: string | null
          content?: Json
          context_id?: string
          context_type?: Database["public"]["Enums"]["block_context_type"]
          created_at?: string
          descricao?: string | null
          id?: string
          ordem?: number
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          titulo?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_blocks_agente_id_fkey"
            columns: ["agente_id"]
            isOneToOne: false
            referencedRelation: "agentes"
            referencedColumns: ["id"]
          },
        ]
      }
      conteudo_aulas: {
        Row: {
          audio_url: string | null
          created_at: string
          descricao_curta: string
          id: string
          materiais_url: string | null
          ordem: number
          pdf_url: string | null
          portal_minimo: Database["public"]["Enums"]["portal_type"]
          publicado: boolean
          texto_aula: string | null
          titulo: string
          travessia_id: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          descricao_curta?: string
          id?: string
          materiais_url?: string | null
          ordem?: number
          pdf_url?: string | null
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          publicado?: boolean
          texto_aula?: string | null
          titulo: string
          travessia_id: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          descricao_curta?: string
          id?: string
          materiais_url?: string | null
          ordem?: number
          pdf_url?: string | null
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          publicado?: boolean
          texto_aula?: string | null
          titulo?: string
          travessia_id?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conteudo_aulas_travessia_id_fkey"
            columns: ["travessia_id"]
            isOneToOne: false
            referencedRelation: "conteudo_travessias"
            referencedColumns: ["id"]
          },
        ]
      }
      conteudo_travessias: {
        Row: {
          capa_url: string | null
          created_at: string
          descricao: string
          descricao_pedagogica: string | null
          id: string
          ordem: number
          portal_minimo: Database["public"]["Enums"]["portal_type"]
          publicado: boolean
          sala_id: string | null
          subtitulo: string | null
          texto_introducao: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          capa_url?: string | null
          created_at?: string
          descricao?: string
          descricao_pedagogica?: string | null
          id?: string
          ordem?: number
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          publicado?: boolean
          sala_id?: string | null
          subtitulo?: string | null
          texto_introducao?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          capa_url?: string | null
          created_at?: string
          descricao?: string
          descricao_pedagogica?: string | null
          id?: string
          ordem?: number
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          publicado?: boolean
          sala_id?: string | null
          subtitulo?: string | null
          texto_introducao?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conteudo_travessias_sala_id_fkey"
            columns: ["sala_id"]
            isOneToOne: false
            referencedRelation: "salas"
            referencedColumns: ["id"]
          },
        ]
      }
      contos_clinicos: {
        Row: {
          ativo: boolean | null
          audio_padrao_disponivel: boolean | null
          audio_padrao_id: string | null
          aviso_etico: string | null
          created_at: string | null
          eixo_simbolico: string | null
          exige_cartografia: boolean | null
          exige_certificacao: boolean | null
          id: string
          nivel_risco: string | null
          o_que_observar: string
          ordem: number | null
          origem_cultural: string | null
          permite_crise_aguda: boolean | null
          permite_grupo: boolean | null
          porta_psiquica: string | null
          quando_usar: string
          restricoes_combinacao: string[] | null
          riscos_uso_inadequado: string
          slug: string
          texto_conto: string
          tipo_uso: string | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          audio_padrao_disponivel?: boolean | null
          audio_padrao_id?: string | null
          aviso_etico?: string | null
          created_at?: string | null
          eixo_simbolico?: string | null
          exige_cartografia?: boolean | null
          exige_certificacao?: boolean | null
          id?: string
          nivel_risco?: string | null
          o_que_observar: string
          ordem?: number | null
          origem_cultural?: string | null
          permite_crise_aguda?: boolean | null
          permite_grupo?: boolean | null
          porta_psiquica?: string | null
          quando_usar: string
          restricoes_combinacao?: string[] | null
          riscos_uso_inadequado: string
          slug: string
          texto_conto: string
          tipo_uso?: string | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          audio_padrao_disponivel?: boolean | null
          audio_padrao_id?: string | null
          aviso_etico?: string | null
          created_at?: string | null
          eixo_simbolico?: string | null
          exige_cartografia?: boolean | null
          exige_certificacao?: boolean | null
          id?: string
          nivel_risco?: string | null
          o_que_observar?: string
          ordem?: number | null
          origem_cultural?: string | null
          permite_crise_aguda?: boolean | null
          permite_grupo?: boolean | null
          porta_psiquica?: string | null
          quando_usar?: string
          restricoes_combinacao?: string[] | null
          riscos_uso_inadequado?: string
          slug?: string
          texto_conto?: string
          tipo_uso?: string | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contos_clinicos_audio_padrao_id_fkey"
            columns: ["audio_padrao_id"]
            isOneToOne: false
            referencedRelation: "audio_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      corpo_inconsciente: {
        Row: {
          cliente_id: string
          created_at: string
          diario_corpo_mente: Json | null
          id: string
          mapeamento_tensoes: Json | null
          therapist_id: string
          tipo: string
          updated_at: string
        }
        Insert: {
          cliente_id: string
          created_at?: string
          diario_corpo_mente?: Json | null
          id?: string
          mapeamento_tensoes?: Json | null
          therapist_id: string
          tipo?: string
          updated_at?: string
        }
        Update: {
          cliente_id?: string
          created_at?: string
          diario_corpo_mente?: Json | null
          id?: string
          mapeamento_tensoes?: Json | null
          therapist_id?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "corpo_inconsciente_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          ativo: boolean
          course_id: string
          created_at: string
          data_fim: string | null
          data_inicio: string
          id: string
          payment_id: string | null
          payment_provider: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ativo?: boolean
          course_id: string
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          id?: string
          payment_id?: string | null
          payment_provider?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ativo?: boolean
          course_id?: string
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          id?: string
          payment_id?: string | null
          payment_provider?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_exercise_responses: {
        Row: {
          created_at: string
          id: string
          lesson_id: string
          resposta: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lesson_id: string
          resposta: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lesson_id?: string
          resposta?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_exercise_responses_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      course_lesson_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          lesson_id: string
          progress_percent: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id: string
          progress_percent?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string
          progress_percent?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      course_lessons: {
        Row: {
          audio_url: string | null
          capa_url: string | null
          content_type: Database["public"]["Enums"]["content_type"]
          created_at: string
          descricao_curta: string | null
          duracao_minutos: number | null
          id: string
          is_preview: boolean
          jornada: string | null
          materiais_url: string | null
          module_id: string
          ordem: number
          pdf_url: string | null
          portal: string | null
          publicado: boolean
          ritual_slides: Json | null
          texto_aula: string | null
          titulo: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          capa_url?: string | null
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string
          descricao_curta?: string | null
          duracao_minutos?: number | null
          id?: string
          is_preview?: boolean
          jornada?: string | null
          materiais_url?: string | null
          module_id: string
          ordem?: number
          pdf_url?: string | null
          portal?: string | null
          publicado?: boolean
          ritual_slides?: Json | null
          texto_aula?: string | null
          titulo: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          capa_url?: string | null
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string
          descricao_curta?: string | null
          duracao_minutos?: number | null
          id?: string
          is_preview?: boolean
          jornada?: string | null
          materiais_url?: string | null
          module_id?: string
          ordem?: number
          pdf_url?: string | null
          portal?: string | null
          publicado?: boolean
          ritual_slides?: Json | null
          texto_aula?: string | null
          titulo?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      course_module_forum_posts: {
        Row: {
          conteudo: string
          created_at: string
          id: string
          is_instructor_reply: boolean | null
          module_id: string
          parent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          conteudo: string
          created_at?: string
          id?: string
          is_instructor_reply?: boolean | null
          module_id: string
          parent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          conteudo?: string
          created_at?: string
          id?: string
          is_instructor_reply?: boolean | null
          module_id?: string
          parent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_module_forum_posts_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_module_forum_posts_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "course_module_forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          cards_leitura: Json | null
          check_maturidade: Json | null
          course_id: string
          created_at: string
          descricao: string | null
          dias_apos_matricula: number | null
          disponivel_em: string | null
          estudos_caso: Json | null
          ferramenta_pratica: Json | null
          formato_pedagogico: boolean | null
          id: string
          metodo_formativo: Json | null
          ordem: number
          publicado: boolean
          roteiro_aula: string | null
          subtitulo: string | null
          titulo: string
          updated_at: string
          video_principal_duracao: number | null
          video_principal_titulo: string | null
          video_principal_url: string | null
        }
        Insert: {
          cards_leitura?: Json | null
          check_maturidade?: Json | null
          course_id: string
          created_at?: string
          descricao?: string | null
          dias_apos_matricula?: number | null
          disponivel_em?: string | null
          estudos_caso?: Json | null
          ferramenta_pratica?: Json | null
          formato_pedagogico?: boolean | null
          id?: string
          metodo_formativo?: Json | null
          ordem?: number
          publicado?: boolean
          roteiro_aula?: string | null
          subtitulo?: string | null
          titulo: string
          updated_at?: string
          video_principal_duracao?: number | null
          video_principal_titulo?: string | null
          video_principal_url?: string | null
        }
        Update: {
          cards_leitura?: Json | null
          check_maturidade?: Json | null
          course_id?: string
          created_at?: string
          descricao?: string | null
          dias_apos_matricula?: number | null
          disponivel_em?: string | null
          estudos_caso?: Json | null
          ferramenta_pratica?: Json | null
          formato_pedagogico?: boolean | null
          id?: string
          metodo_formativo?: Json | null
          ordem?: number
          publicado?: boolean
          roteiro_aula?: string | null
          subtitulo?: string | null
          titulo?: string
          updated_at?: string
          video_principal_duracao?: number | null
          video_principal_titulo?: string | null
          video_principal_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_work_submissions: {
        Row: {
          course_id: string
          created_at: string
          descricao: string | null
          feedback: string | null
          file_url: string | null
          id: string
          nota: number | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          descricao?: string | null
          feedback?: string | null
          file_url?: string | null
          id?: string
          nota?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          titulo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          descricao?: string | null
          feedback?: string | null
          file_url?: string | null
          id?: string
          nota?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_work_submissions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          capa_url: string | null
          created_at: string
          descricao: string
          descricao_publica: string | null
          destaque: boolean
          duracao_estimada: string | null
          id: string
          nivel: string | null
          ordem: number
          portal_minimo: Database["public"]["Enums"]["portal_type"]
          preco: number | null
          preco_promocional: number | null
          pricing_model: Database["public"]["Enums"]["pricing_model"]
          publicado: boolean
          requer_matricula: boolean
          requisitos: string | null
          sala_id: string | null
          stripe_price_id: string | null
          stripe_product_id: string | null
          subtitulo: string | null
          tags: string[] | null
          tipo_curso: string | null
          titulo: string
          updated_at: string
          video_preview_url: string | null
        }
        Insert: {
          capa_url?: string | null
          created_at?: string
          descricao?: string
          descricao_publica?: string | null
          destaque?: boolean
          duracao_estimada?: string | null
          id?: string
          nivel?: string | null
          ordem?: number
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          preco?: number | null
          preco_promocional?: number | null
          pricing_model?: Database["public"]["Enums"]["pricing_model"]
          publicado?: boolean
          requer_matricula?: boolean
          requisitos?: string | null
          sala_id?: string | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          subtitulo?: string | null
          tags?: string[] | null
          tipo_curso?: string | null
          titulo: string
          updated_at?: string
          video_preview_url?: string | null
        }
        Update: {
          capa_url?: string | null
          created_at?: string
          descricao?: string
          descricao_publica?: string | null
          destaque?: boolean
          duracao_estimada?: string | null
          id?: string
          nivel?: string | null
          ordem?: number
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          preco?: number | null
          preco_promocional?: number | null
          pricing_model?: Database["public"]["Enums"]["pricing_model"]
          publicado?: boolean
          requer_matricula?: boolean
          requisitos?: string | null
          sala_id?: string | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          subtitulo?: string | null
          tags?: string[] | null
          tipo_curso?: string | null
          titulo?: string
          updated_at?: string
          video_preview_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_sala_id_fkey"
            columns: ["sala_id"]
            isOneToOne: false
            referencedRelation: "salas"
            referencedColumns: ["id"]
          },
        ]
      }
      cycle_books: {
        Row: {
          book_id: string
          created_at: string | null
          cycle_id: string
          id: string
          is_core: boolean | null
          layer: string | null
          layer_order: number | null
          quadrant: string | null
          ring_index: number | null
        }
        Insert: {
          book_id: string
          created_at?: string | null
          cycle_id: string
          id?: string
          is_core?: boolean | null
          layer?: string | null
          layer_order?: number | null
          quadrant?: string | null
          ring_index?: number | null
        }
        Update: {
          book_id?: string
          created_at?: string | null
          cycle_id?: string
          id?: string
          is_core?: boolean | null
          layer?: string | null
          layer_order?: number | null
          quadrant?: string | null
          ring_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cycle_books_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cycle_books_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "cycles"
            referencedColumns: ["id"]
          },
        ]
      }
      cycles: {
        Row: {
          created_at: string | null
          id: string
          label: string
          status: string
          updated_at: string | null
          year: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
          status?: string
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
          status?: string
          updated_at?: string | null
          year?: number | null
        }
        Relationships: []
      }
      decodificacao_onirica: {
        Row: {
          arquetipos_sugeridos: string[] | null
          cliente_id: string | null
          created_at: string | null
          forca_psiquica: string | null
          id: string
          imagem_central: string | null
          mensagem_viva: string | null
          movimento_interrompido: string | null
          notas_terapeuta: string | null
          session_case_id: string | null
          sonho_bruto: string
          terapeuta_id: string
          updated_at: string | null
        }
        Insert: {
          arquetipos_sugeridos?: string[] | null
          cliente_id?: string | null
          created_at?: string | null
          forca_psiquica?: string | null
          id?: string
          imagem_central?: string | null
          mensagem_viva?: string | null
          movimento_interrompido?: string | null
          notas_terapeuta?: string | null
          session_case_id?: string | null
          sonho_bruto: string
          terapeuta_id: string
          updated_at?: string | null
        }
        Update: {
          arquetipos_sugeridos?: string[] | null
          cliente_id?: string | null
          created_at?: string | null
          forca_psiquica?: string | null
          id?: string
          imagem_central?: string | null
          mensagem_viva?: string | null
          movimento_interrompido?: string | null
          notas_terapeuta?: string | null
          session_case_id?: string | null
          sonho_bruto?: string
          terapeuta_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "decodificacao_onirica_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "decodificacao_onirica_session_case_id_fkey"
            columns: ["session_case_id"]
            isOneToOne: false
            referencedRelation: "session_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      degustacao_requests: {
        Row: {
          admin_notes: string | null
          aprovado_em: string | null
          aprovado_por: string | null
          created_at: string
          expira_em: string | null
          id: string
          motivo: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          aprovado_em?: string | null
          aprovado_por?: string | null
          created_at?: string
          expira_em?: string | null
          id?: string
          motivo?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          aprovado_em?: string | null
          aprovado_por?: string | null
          created_at?: string
          expira_em?: string | null
          id?: string
          motivo?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      diagnostico_ego: {
        Row: {
          cliente_id: string
          contagem_deflacao: number | null
          contagem_inflacao: number | null
          created_at: string
          id: string
          pergunta_integracao_resposta: string | null
          respostas_deflacao: boolean[] | null
          respostas_inflacao: boolean[] | null
          therapist_id: string
          updated_at: string
        }
        Insert: {
          cliente_id: string
          contagem_deflacao?: number | null
          contagem_inflacao?: number | null
          created_at?: string
          id?: string
          pergunta_integracao_resposta?: string | null
          respostas_deflacao?: boolean[] | null
          respostas_inflacao?: boolean[] | null
          therapist_id: string
          updated_at?: string
        }
        Update: {
          cliente_id?: string
          contagem_deflacao?: number | null
          contagem_inflacao?: number | null
          created_at?: string
          id?: string
          pergunta_integracao_resposta?: string | null
          respostas_deflacao?: boolean[] | null
          respostas_inflacao?: boolean[] | null
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnostico_ego_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      diario_bordo_aulas: {
        Row: {
          aula_id: string
          conteudo: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          aula_id: string
          conteudo?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          aula_id?: string
          conteudo?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      district_state_changes: {
        Row: {
          changed_by_user_id: string
          client_id: string
          created_at: string
          district_id: string
          from_state: string
          id: string
          reason: string
          to_state: string
        }
        Insert: {
          changed_by_user_id: string
          client_id: string
          created_at?: string
          district_id: string
          from_state: string
          id?: string
          reason: string
          to_state: string
        }
        Update: {
          changed_by_user_id?: string
          client_id?: string
          created_at?: string
          district_id?: string
          from_state?: string
          id?: string
          reason?: string
          to_state?: string
        }
        Relationships: [
          {
            foreignKeyName: "district_state_changes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "district_state_changes_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      districts: {
        Row: {
          cor: string | null
          created_at: string
          descricao: string | null
          icone: string | null
          id: string
          nome: string
          numero: number
          posicao_relogio: string | null
        }
        Insert: {
          cor?: string | null
          created_at?: string
          descricao?: string | null
          icone?: string | null
          id?: string
          nome: string
          numero: number
          posicao_relogio?: string | null
        }
        Update: {
          cor?: string | null
          created_at?: string
          descricao?: string | null
          icone?: string | null
          id?: string
          nome?: string
          numero?: number
          posicao_relogio?: string | null
        }
        Relationships: []
      }
      dreams: {
        Row: {
          central_image: string | null
          client_id: string
          created_at: string
          date: string
          dream_text: string | null
          id: string
          interrupted_movement: string | null
          psychic_force: string | null
          session_id: string | null
          symbolic_message: string | null
        }
        Insert: {
          central_image?: string | null
          client_id: string
          created_at?: string
          date?: string
          dream_text?: string | null
          id?: string
          interrupted_movement?: string | null
          psychic_force?: string | null
          session_id?: string | null
          symbolic_message?: string | null
        }
        Update: {
          central_image?: string | null
          client_id?: string
          created_at?: string
          date?: string
          dream_text?: string | null
          id?: string
          interrupted_movement?: string | null
          psychic_force?: string | null
          session_id?: string | null
          symbolic_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dreams_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dreams_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          data_envio: string
          error_message: string | null
          id: string
          success: boolean | null
          tipo_email: string
          user_id: string
        }
        Insert: {
          data_envio?: string
          error_message?: string | null
          id?: string
          success?: boolean | null
          tipo_email: string
          user_id: string
        }
        Update: {
          data_envio?: string
          error_message?: string | null
          id?: string
          success?: boolean | null
          tipo_email?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_formation_progress"
            referencedColumns: ["user_id"]
          },
        ]
      }
      eneagrama_feminino_afirmacoes: {
        Row: {
          arquetipo_id: string
          ativo: boolean
          created_at: string
          id: string
          ordem: number
          peso: number
          texto_afirmacao: string
          updated_at: string
        }
        Insert: {
          arquetipo_id: string
          ativo?: boolean
          created_at?: string
          id?: string
          ordem?: number
          peso?: number
          texto_afirmacao: string
          updated_at?: string
        }
        Update: {
          arquetipo_id?: string
          ativo?: boolean
          created_at?: string
          id?: string
          ordem?: number
          peso?: number
          texto_afirmacao?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "eneagrama_feminino_afirmacoes_arquetipo_id_fkey"
            columns: ["arquetipo_id"]
            isOneToOne: false
            referencedRelation: "eneagrama_feminino_arquetipos"
            referencedColumns: ["id"]
          },
        ]
      }
      eneagrama_feminino_arquetipos: {
        Row: {
          ativo: boolean
          caminho_expansao: string | null
          cautelas_eticas: string | null
          chave: string
          convites_integracao: string[] | null
          cor_primaria: string | null
          cor_secundaria: string | null
          created_at: string
          dinamica_relacional: string | null
          dom_central: string | null
          espelhos_simbolicos: string[] | null
          essencia_simbolica: string
          expressao_sombra: string | null
          ferida_central: string | null
          icone: string | null
          id: string
          linguagem_evitar: string | null
          linguagem_que_abre: string | null
          nome: string
          nome_en: string | null
          notas_leitura: string | null
          numero: number
          ordem: number
          pergunta_reflexiva: string | null
          perguntas_abertura: string[] | null
          pratica_simbolica: string | null
          prompts_reenquadramento: string[] | null
          resistencias_tipicas: string | null
          ritual_encerramento: string | null
          sugestoes_reenquadramento: string[] | null
          trabalho_sombra: string | null
          transferencias_comuns: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          caminho_expansao?: string | null
          cautelas_eticas?: string | null
          chave: string
          convites_integracao?: string[] | null
          cor_primaria?: string | null
          cor_secundaria?: string | null
          created_at?: string
          dinamica_relacional?: string | null
          dom_central?: string | null
          espelhos_simbolicos?: string[] | null
          essencia_simbolica: string
          expressao_sombra?: string | null
          ferida_central?: string | null
          icone?: string | null
          id?: string
          linguagem_evitar?: string | null
          linguagem_que_abre?: string | null
          nome: string
          nome_en?: string | null
          notas_leitura?: string | null
          numero: number
          ordem?: number
          pergunta_reflexiva?: string | null
          perguntas_abertura?: string[] | null
          pratica_simbolica?: string | null
          prompts_reenquadramento?: string[] | null
          resistencias_tipicas?: string | null
          ritual_encerramento?: string | null
          sugestoes_reenquadramento?: string[] | null
          trabalho_sombra?: string | null
          transferencias_comuns?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          caminho_expansao?: string | null
          cautelas_eticas?: string | null
          chave?: string
          convites_integracao?: string[] | null
          cor_primaria?: string | null
          cor_secundaria?: string | null
          created_at?: string
          dinamica_relacional?: string | null
          dom_central?: string | null
          espelhos_simbolicos?: string[] | null
          essencia_simbolica?: string
          expressao_sombra?: string | null
          ferida_central?: string | null
          icone?: string | null
          id?: string
          linguagem_evitar?: string | null
          linguagem_que_abre?: string | null
          nome?: string
          nome_en?: string | null
          notas_leitura?: string | null
          numero?: number
          ordem?: number
          pergunta_reflexiva?: string | null
          perguntas_abertura?: string[] | null
          pratica_simbolica?: string | null
          prompts_reenquadramento?: string[] | null
          resistencias_tipicas?: string | null
          ritual_encerramento?: string | null
          sugestoes_reenquadramento?: string[] | null
          trabalho_sombra?: string | null
          transferencias_comuns?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      eneagrama_feminino_orientacoes: {
        Row: {
          arquetipo_id: string | null
          ativo: boolean
          created_at: string
          id: string
          ordem: number | null
          texto: string
          tipo: string
          titulo: string | null
          updated_at: string
        }
        Insert: {
          arquetipo_id?: string | null
          ativo?: boolean
          created_at?: string
          id?: string
          ordem?: number | null
          texto: string
          tipo: string
          titulo?: string | null
          updated_at?: string
        }
        Update: {
          arquetipo_id?: string | null
          ativo?: boolean
          created_at?: string
          id?: string
          ordem?: number | null
          texto?: string
          tipo?: string
          titulo?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "eneagrama_feminino_orientacoes_arquetipo_id_fkey"
            columns: ["arquetipo_id"]
            isOneToOne: false
            referencedRelation: "eneagrama_feminino_arquetipos"
            referencedColumns: ["id"]
          },
        ]
      }
      eneagrama_feminino_registros: {
        Row: {
          arquetipo_exilado: number | null
          arquetipo_primario: number
          arquetipo_secundario: number | null
          arquetipo_sombra: number | null
          campo_reflexao_cliente: string | null
          campo_tensao: string | null
          cliente_id: string | null
          created_at: string
          id: string
          modo_aplicacao: string | null
          narrativa_editada: boolean | null
          narrativa_interpretacao: string | null
          nome_simbolico: string | null
          notas: string | null
          notas_profissionais: string | null
          reflexao_final: string | null
          respostas_json: Json | null
          session_case_id: string | null
          terapeuta_id: string | null
          updated_at: string
          user_id: string
          vetor_integracao: string | null
        }
        Insert: {
          arquetipo_exilado?: number | null
          arquetipo_primario: number
          arquetipo_secundario?: number | null
          arquetipo_sombra?: number | null
          campo_reflexao_cliente?: string | null
          campo_tensao?: string | null
          cliente_id?: string | null
          created_at?: string
          id?: string
          modo_aplicacao?: string | null
          narrativa_editada?: boolean | null
          narrativa_interpretacao?: string | null
          nome_simbolico?: string | null
          notas?: string | null
          notas_profissionais?: string | null
          reflexao_final?: string | null
          respostas_json?: Json | null
          session_case_id?: string | null
          terapeuta_id?: string | null
          updated_at?: string
          user_id: string
          vetor_integracao?: string | null
        }
        Update: {
          arquetipo_exilado?: number | null
          arquetipo_primario?: number
          arquetipo_secundario?: number | null
          arquetipo_sombra?: number | null
          campo_reflexao_cliente?: string | null
          campo_tensao?: string | null
          cliente_id?: string | null
          created_at?: string
          id?: string
          modo_aplicacao?: string | null
          narrativa_editada?: boolean | null
          narrativa_interpretacao?: string | null
          nome_simbolico?: string | null
          notas?: string | null
          notas_profissionais?: string | null
          reflexao_final?: string | null
          respostas_json?: Json | null
          session_case_id?: string | null
          terapeuta_id?: string | null
          updated_at?: string
          user_id?: string
          vetor_integracao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eneagrama_feminino_registros_session_case_id_fkey"
            columns: ["session_case_id"]
            isOneToOne: false
            referencedRelation: "session_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      eneagrama_instintos: {
        Row: {
          ativo: boolean
          chave: string
          created_at: string
          descricao: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          chave: string
          created_at?: string
          descricao: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          chave?: string
          created_at?: string
          descricao?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      eneagrama_registros: {
        Row: {
          armadilhas: string | null
          asa: number | null
          caso_id: string | null
          cliente_id: string | null
          created_at: string
          defesas: string | null
          id: string
          instinto: string | null
          pratica_sugerida: string | null
          terapeuta_id: string | null
          tipo_principal: number
          updated_at: string
          user_id: string
          virtude: string | null
        }
        Insert: {
          armadilhas?: string | null
          asa?: number | null
          caso_id?: string | null
          cliente_id?: string | null
          created_at?: string
          defesas?: string | null
          id?: string
          instinto?: string | null
          pratica_sugerida?: string | null
          terapeuta_id?: string | null
          tipo_principal: number
          updated_at?: string
          user_id: string
          virtude?: string | null
        }
        Update: {
          armadilhas?: string | null
          asa?: number | null
          caso_id?: string | null
          cliente_id?: string | null
          created_at?: string
          defesas?: string | null
          id?: string
          instinto?: string | null
          pratica_sugerida?: string | null
          terapeuta_id?: string | null
          tipo_principal?: number
          updated_at?: string
          user_id?: string
          virtude?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_eneagrama_caso"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos"
            referencedColumns: ["id"]
          },
        ]
      }
      eneagrama_tipos: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string
          fixacao: string | null
          id: string
          nome: string
          numero: number
          palavras_chave: string[] | null
          updated_at: string
          virtude: string | null
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao: string
          fixacao?: string | null
          id?: string
          nome: string
          numero: number
          palavras_chave?: string[] | null
          updated_at?: string
          virtude?: string | null
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string
          fixacao?: string | null
          id?: string
          nome?: string
          numero?: number
          palavras_chave?: string[] | null
          updated_at?: string
          virtude?: string | null
        }
        Relationships: []
      }
      escrita_nao_censurada: {
        Row: {
          cliente_id: string
          conteudo_escrita: string | null
          created_at: string
          id: string
          prompt_utilizado: string | null
          therapist_id: string
          updated_at: string
        }
        Insert: {
          cliente_id: string
          conteudo_escrita?: string | null
          created_at?: string
          id?: string
          prompt_utilizado?: string | null
          therapist_id: string
          updated_at?: string
        }
        Update: {
          cliente_id?: string
          conteudo_escrita?: string | null
          created_at?: string
          id?: string
          prompt_utilizado?: string | null
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "escrita_nao_censurada_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      estudio_projetos: {
        Row: {
          book_id: string | null
          created_at: string
          estacao_simbolica: string | null
          estrutura_gerada: Json | null
          id: string
          infografico_url: string | null
          jornada: string | null
          livro_externo_autor: string | null
          livro_externo_nome: string | null
          livro_externo_texto: string | null
          logo_aluna_url: string | null
          mapa_mental_url: string | null
          modo: string
          nome_grupo: string | null
          nome_mentora: string | null
          num_encontros: number | null
          owner_id: string
          paleta_secundaria: string | null
          playbook_url: string | null
          publico_alvo: string | null
          status: string
          titulo: string
          updated_at: string
        }
        Insert: {
          book_id?: string | null
          created_at?: string
          estacao_simbolica?: string | null
          estrutura_gerada?: Json | null
          id?: string
          infografico_url?: string | null
          jornada?: string | null
          livro_externo_autor?: string | null
          livro_externo_nome?: string | null
          livro_externo_texto?: string | null
          logo_aluna_url?: string | null
          mapa_mental_url?: string | null
          modo?: string
          nome_grupo?: string | null
          nome_mentora?: string | null
          num_encontros?: number | null
          owner_id: string
          paleta_secundaria?: string | null
          playbook_url?: string | null
          publico_alvo?: string | null
          status?: string
          titulo?: string
          updated_at?: string
        }
        Update: {
          book_id?: string | null
          created_at?: string
          estacao_simbolica?: string | null
          estrutura_gerada?: Json | null
          id?: string
          infografico_url?: string | null
          jornada?: string | null
          livro_externo_autor?: string | null
          livro_externo_nome?: string | null
          livro_externo_texto?: string | null
          logo_aluna_url?: string | null
          mapa_mental_url?: string | null
          modo?: string
          nome_grupo?: string | null
          nome_mentora?: string | null
          num_encontros?: number | null
          owner_id?: string
          paleta_secundaria?: string | null
          playbook_url?: string | null
          publico_alvo?: string | null
          status?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "estudio_projetos_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      estudos_caso: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          feedback_especialista: string
          id: string
          mapa_cidadela_json: Json | null
          nivel: string
          ordem: number | null
          perguntas_analise: string[] | null
          prontuario_ficticio: string
          titulo: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          feedback_especialista: string
          id?: string
          mapa_cidadela_json?: Json | null
          nivel?: string
          ordem?: number | null
          perguntas_analise?: string[] | null
          prontuario_ficticio: string
          titulo: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          feedback_especialista?: string
          id?: string
          mapa_cidadela_json?: Json | null
          nivel?: string
          ordem?: number | null
          perguntas_analise?: string[] | null
          prontuario_ficticio?: string
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      estudos_caso_respostas: {
        Row: {
          created_at: string | null
          estudo_caso_id: string
          id: string
          resposta: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          estudo_caso_id: string
          id?: string
          resposta: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          estudo_caso_id?: string
          id?: string
          resposta?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "estudos_caso_respostas_estudo_caso_id_fkey"
            columns: ["estudo_caso_id"]
            isOneToOne: false
            referencedRelation: "estudos_caso"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_responses: {
        Row: {
          created_at: string
          exercise_id: string
          id: string
          response: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          exercise_id: string
          id?: string
          response: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          exercise_id?: string
          id?: string
          response?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_responses_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          created_at: string
          id: string
          lesson_id: string
          order_number: number
          question: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          lesson_id: string
          order_number?: number
          question: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          lesson_id?: string
          order_number?: number
          question?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercises_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      facilitadora_profiles: {
        Row: {
          bio: string | null
          cidade: string | null
          created_at: string | null
          especializacoes: string[] | null
          id: string
          perfil_publico: boolean | null
          updated_at: string | null
          user_id: string
          voz_conducao: string | null
        }
        Insert: {
          bio?: string | null
          cidade?: string | null
          created_at?: string | null
          especializacoes?: string[] | null
          id?: string
          perfil_publico?: boolean | null
          updated_at?: string | null
          user_id: string
          voz_conducao?: string | null
        }
        Update: {
          bio?: string | null
          cidade?: string | null
          created_at?: string | null
          especializacoes?: string[] | null
          id?: string
          perfil_publico?: boolean | null
          updated_at?: string | null
          user_id?: string
          voz_conducao?: string | null
        }
        Relationships: []
      }
      ferramenta_registros: {
        Row: {
          cliente_id: string | null
          created_at: string
          dados: Json
          data_registro: string
          ferramenta_id: string
          id: string
          notas: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          dados?: Json
          data_registro?: string
          ferramenta_id: string
          id?: string
          notas?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          dados?: Json
          data_registro?: string
          ferramenta_id?: string
          id?: string
          notas?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ferramenta_registros_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ferramenta_registros_ferramenta_id_fkey"
            columns: ["ferramenta_id"]
            isOneToOne: false
            referencedRelation: "sala_ferramentas"
            referencedColumns: ["id"]
          },
        ]
      }
      formacao_area_config: {
        Row: {
          created_at: string
          formacao_ativa: boolean | null
          formacao_banner_url: string | null
          formacao_cor: string | null
          formacao_descricao: string | null
          formacao_icone: string | null
          formacao_itens: string[] | null
          formacao_subtitulo: string | null
          formacao_titulo: string | null
          id: string
          mentoria_ativa: boolean | null
          mentoria_banner_url: string | null
          mentoria_cor: string | null
          mentoria_descricao: string | null
          mentoria_icone: string | null
          mentoria_itens: string[] | null
          mentoria_subtitulo: string | null
          mentoria_titulo: string | null
          mostrar_salas_estudo: boolean | null
          titulo_salas_estudo: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          formacao_ativa?: boolean | null
          formacao_banner_url?: string | null
          formacao_cor?: string | null
          formacao_descricao?: string | null
          formacao_icone?: string | null
          formacao_itens?: string[] | null
          formacao_subtitulo?: string | null
          formacao_titulo?: string | null
          id?: string
          mentoria_ativa?: boolean | null
          mentoria_banner_url?: string | null
          mentoria_cor?: string | null
          mentoria_descricao?: string | null
          mentoria_icone?: string | null
          mentoria_itens?: string[] | null
          mentoria_subtitulo?: string | null
          mentoria_titulo?: string | null
          mostrar_salas_estudo?: boolean | null
          titulo_salas_estudo?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          formacao_ativa?: boolean | null
          formacao_banner_url?: string | null
          formacao_cor?: string | null
          formacao_descricao?: string | null
          formacao_icone?: string | null
          formacao_itens?: string[] | null
          formacao_subtitulo?: string | null
          formacao_titulo?: string | null
          id?: string
          mentoria_ativa?: boolean | null
          mentoria_banner_url?: string | null
          mentoria_cor?: string | null
          mentoria_descricao?: string | null
          mentoria_icone?: string | null
          mentoria_itens?: string[] | null
          mentoria_subtitulo?: string | null
          mentoria_titulo?: string | null
          mostrar_salas_estudo?: boolean | null
          titulo_salas_estudo?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      formacao_modulos: {
        Row: {
          created_at: string
          descricao: string | null
          formacao_id: string
          id: string
          ordem: number
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          formacao_id: string
          id?: string
          ordem?: number
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          formacao_id?: string
          id?: string
          ordem?: number
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "formacao_modulos_formacao_id_fkey"
            columns: ["formacao_id"]
            isOneToOne: false
            referencedRelation: "formacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      formacao_oracula_content: {
        Row: {
          content: Json
          id: string
          section_key: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: Json
          id?: string
          section_key: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: Json
          id?: string
          section_key?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      formacoes: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          ordem: number
          status: string
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          ordem?: number
          status?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          ordem?: number
          status?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      formation_map_nodes: {
        Row: {
          ativo: boolean | null
          color: string | null
          created_at: string | null
          description_locked: string | null
          description_unlocked: string | null
          icon: string | null
          id: string
          label: string
          node_type: string
          ordem: number | null
          position_angle: number | null
          position_ring: number | null
          reference_id: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          color?: string | null
          created_at?: string | null
          description_locked?: string | null
          description_unlocked?: string | null
          icon?: string | null
          id?: string
          label: string
          node_type: string
          ordem?: number | null
          position_angle?: number | null
          position_ring?: number | null
          reference_id?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          color?: string | null
          created_at?: string | null
          description_locked?: string | null
          description_unlocked?: string | null
          icon?: string | null
          id?: string
          label?: string
          node_type?: string
          ordem?: number | null
          position_angle?: number | null
          position_ring?: number | null
          reference_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      gestos_integracao: {
        Row: {
          cliente_id: string
          created_at: string
          gesto_texto: string
          id: string
          jardim_registro_id: string | null
          owner_id: string
          sessao_id: string | null
          status: Database["public"]["Enums"]["gesto_status"]
          updated_at: string
        }
        Insert: {
          cliente_id: string
          created_at?: string
          gesto_texto: string
          id?: string
          jardim_registro_id?: string | null
          owner_id: string
          sessao_id?: string | null
          status?: Database["public"]["Enums"]["gesto_status"]
          updated_at?: string
        }
        Update: {
          cliente_id?: string
          created_at?: string
          gesto_texto?: string
          id?: string
          jardim_registro_id?: string | null
          owner_id?: string
          sessao_id?: string | null
          status?: Database["public"]["Enums"]["gesto_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gestos_integracao_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gestos_integracao_sessao_id_fkey"
            columns: ["sessao_id"]
            isOneToOne: false
            referencedRelation: "sessoes_casa_maquinas"
            referencedColumns: ["id"]
          },
        ]
      }
      group_encounters: {
        Row: {
          archetype_worked: string | null
          created_at: string
          date: string
          group_id: string
          id: string
          notes: string | null
          theme: string | null
        }
        Insert: {
          archetype_worked?: string | null
          created_at?: string
          date?: string
          group_id: string
          id?: string
          notes?: string | null
          theme?: string | null
        }
        Update: {
          archetype_worked?: string | null
          created_at?: string
          date?: string
          group_id?: string
          id?: string
          notes?: string | null
          theme?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_encounters_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "therapy_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          client_id: string
          group_id: string
          id: string
          joined_at: string
        }
        Insert: {
          client_id: string
          group_id: string
          id?: string
          joined_at?: string
        }
        Update: {
          client_id?: string
          group_id?: string
          id?: string
          joined_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "therapy_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_participants: {
        Row: {
          ativo: boolean
          cliente_id: string
          group_id: string
          id: string
          joined_at: string
        }
        Insert: {
          ativo?: boolean
          cliente_id: string
          group_id: string
          id?: string
          joined_at?: string
        }
        Update: {
          ativo?: boolean
          cliente_id?: string
          group_id?: string
          id?: string
          joined_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_participants_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_participants_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "therapeutic_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_sessions: {
        Row: {
          created_at: string
          group_id: string
          id: string
          notes: string | null
          status: string
          therapist_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          notes?: string | null
          status?: string
          therapist_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          notes?: string | null
          status?: string
          therapist_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_sessions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "therapeutic_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      heroina_arquetipo_registros: {
        Row: {
          arquetipo_id: string
          created_at: string
          id: string
          polaridade_percebida: string | null
          registrado_em: string
          user_id: string
        }
        Insert: {
          arquetipo_id: string
          created_at?: string
          id?: string
          polaridade_percebida?: string | null
          registrado_em?: string
          user_id: string
        }
        Update: {
          arquetipo_id?: string
          created_at?: string
          id?: string
          polaridade_percebida?: string | null
          registrado_em?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "heroina_arquetipo_registros_arquetipo_id_fkey"
            columns: ["arquetipo_id"]
            isOneToOne: false
            referencedRelation: "labirinto_arquetipos"
            referencedColumns: ["id"]
          },
        ]
      }
      heroina_cenario_registros: {
        Row: {
          anotacao_livre: string | null
          created_at: string
          id: string
          metafora_id: string
          registrado_em: string
          user_id: string
        }
        Insert: {
          anotacao_livre?: string | null
          created_at?: string
          id?: string
          metafora_id: string
          registrado_em?: string
          user_id: string
        }
        Update: {
          anotacao_livre?: string | null
          created_at?: string
          id?: string
          metafora_id?: string
          registrado_em?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "heroina_cenario_registros_metafora_id_fkey"
            columns: ["metafora_id"]
            isOneToOne: false
            referencedRelation: "labirinto_metaforas"
            referencedColumns: ["id"]
          },
        ]
      }
      heroina_fase_ativa: {
        Row: {
          ativa: boolean
          created_at: string
          fase_id: string
          id: string
          registrado_em: string
          user_id: string
        }
        Insert: {
          ativa?: boolean
          created_at?: string
          fase_id: string
          id?: string
          registrado_em?: string
          user_id: string
        }
        Update: {
          ativa?: boolean
          created_at?: string
          fase_id?: string
          id?: string
          registrado_em?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "heroina_fase_ativa_fase_id_fkey"
            columns: ["fase_id"]
            isOneToOne: false
            referencedRelation: "labirinto_fases"
            referencedColumns: ["id"]
          },
        ]
      }
      heroina_ritual_registros: {
        Row: {
          completado_em: string | null
          created_at: string | null
          id: string
          reflexao: string | null
          ritual_id: string
          user_id: string
        }
        Insert: {
          completado_em?: string | null
          created_at?: string | null
          id?: string
          reflexao?: string | null
          ritual_id: string
          user_id: string
        }
        Update: {
          completado_em?: string | null
          created_at?: string | null
          id?: string
          reflexao?: string | null
          ritual_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "heroina_ritual_registros_ritual_id_fkey"
            columns: ["ritual_id"]
            isOneToOne: false
            referencedRelation: "labirinto_rituais"
            referencedColumns: ["id"]
          },
        ]
      }
      image_assets: {
        Row: {
          alt_text: string | null
          altura: number | null
          categoria: string | null
          created_at: string | null
          descricao: string | null
          file_path: string
          id: string
          largura: number | null
          ordem: number | null
          portal_minimo: Database["public"]["Enums"]["portal_type"] | null
          publicado: boolean | null
          tags: string[] | null
          tamanho_bytes: number | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          alt_text?: string | null
          altura?: number | null
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          file_path: string
          id?: string
          largura?: number | null
          ordem?: number | null
          portal_minimo?: Database["public"]["Enums"]["portal_type"] | null
          publicado?: boolean | null
          tags?: string[] | null
          tamanho_bytes?: number | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          alt_text?: string | null
          altura?: number | null
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          file_path?: string
          id?: string
          largura?: number | null
          ordem?: number | null
          portal_minimo?: Database["public"]["Enums"]["portal_type"] | null
          publicado?: boolean | null
          tags?: string[] | null
          tamanho_bytes?: number | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      imaginacao_ativa: {
        Row: {
          cliente_id: string
          created_at: string
          descricao_figura: string | null
          dialogo_registros: Json | null
          id: string
          negociacao_registro: string | null
          ponto_partida_detalhes: string | null
          ponto_partida_tipo: string | null
          registro_pos_sessao: string | null
          therapist_id: string
          updated_at: string
        }
        Insert: {
          cliente_id: string
          created_at?: string
          descricao_figura?: string | null
          dialogo_registros?: Json | null
          id?: string
          negociacao_registro?: string | null
          ponto_partida_detalhes?: string | null
          ponto_partida_tipo?: string | null
          registro_pos_sessao?: string | null
          therapist_id: string
          updated_at?: string
        }
        Update: {
          cliente_id?: string
          created_at?: string
          descricao_figura?: string | null
          dialogo_registros?: Json | null
          id?: string
          negociacao_registro?: string | null
          ponto_partida_detalhes?: string | null
          ponto_partida_tipo?: string | null
          registro_pos_sessao?: string | null
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "imaginacao_ativa_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      intervention_favorites: {
        Row: {
          created_at: string
          id: string
          intervention_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          intervention_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          intervention_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "intervention_favorites_intervention_id_fkey"
            columns: ["intervention_id"]
            isOneToOne: false
            referencedRelation: "interventions"
            referencedColumns: ["id"]
          },
        ]
      }
      interventions: {
        Row: {
          archetype_key: string | null
          arquetipos_relacionados: string[] | null
          ativa: boolean
          content: string
          contraindications: string | null
          created_at: string
          descricao_breve: string | null
          district_id: string | null
          id: string
          level: Database["public"]["Enums"]["intervention_level"]
          materiais: string[] | null
          objetivo: string | null
          passo_a_passo: string | null
          perguntas_chave: string[] | null
          tags: string[] | null
          title: string
          tower_key: string | null
          type: Database["public"]["Enums"]["intervention_type"]
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          archetype_key?: string | null
          arquetipos_relacionados?: string[] | null
          ativa?: boolean
          content: string
          contraindications?: string | null
          created_at?: string
          descricao_breve?: string | null
          district_id?: string | null
          id?: string
          level?: Database["public"]["Enums"]["intervention_level"]
          materiais?: string[] | null
          objetivo?: string | null
          passo_a_passo?: string | null
          perguntas_chave?: string[] | null
          tags?: string[] | null
          title: string
          tower_key?: string | null
          type: Database["public"]["Enums"]["intervention_type"]
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          archetype_key?: string | null
          arquetipos_relacionados?: string[] | null
          ativa?: boolean
          content?: string
          contraindications?: string | null
          created_at?: string
          descricao_breve?: string | null
          district_id?: string | null
          id?: string
          level?: Database["public"]["Enums"]["intervention_level"]
          materiais?: string[] | null
          objetivo?: string | null
          passo_a_passo?: string | null
          perguntas_chave?: string[] | null
          tags?: string[] | null
          title?: string
          tower_key?: string | null
          type?: Database["public"]["Enums"]["intervention_type"]
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "interventions_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      inventario_personas: {
        Row: {
          analise_discrepancia: string | null
          cliente_id: string
          contextos_personas: Json
          created_at: string
          custo_energetico: string | null
          id: string
          pergunta_incomoda_resposta: string | null
          sombra_revelada: string | null
          therapist_id: string
          updated_at: string
        }
        Insert: {
          analise_discrepancia?: string | null
          cliente_id: string
          contextos_personas?: Json
          created_at?: string
          custo_energetico?: string | null
          id?: string
          pergunta_incomoda_resposta?: string | null
          sombra_revelada?: string | null
          therapist_id: string
          updated_at?: string
        }
        Update: {
          analise_discrepancia?: string | null
          cliente_id?: string
          contextos_personas?: Json
          created_at?: string
          custo_energetico?: string | null
          id?: string
          pergunta_incomoda_resposta?: string | null
          sombra_revelada?: string | null
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventario_personas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      jardim_do_oficio: {
        Row: {
          aprendizado_tecnico: string | null
          cliente_id: string | null
          contexto_origem: string | null
          created_at: string
          enviar_para_supervisao: boolean
          espelho_risco_projecao: string | null
          espelho_supervisao: string | null
          espelho_toca_minha: string | null
          id: string
          pergunta_supervisao: string | null
          reflexao_profissional: string
          sessao_id: string | null
          status_supervisao: Database["public"]["Enums"]["status_supervisao"]
          tensao_etica: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          aprendizado_tecnico?: string | null
          cliente_id?: string | null
          contexto_origem?: string | null
          created_at?: string
          enviar_para_supervisao?: boolean
          espelho_risco_projecao?: string | null
          espelho_supervisao?: string | null
          espelho_toca_minha?: string | null
          id?: string
          pergunta_supervisao?: string | null
          reflexao_profissional: string
          sessao_id?: string | null
          status_supervisao?: Database["public"]["Enums"]["status_supervisao"]
          tensao_etica?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          aprendizado_tecnico?: string | null
          cliente_id?: string | null
          contexto_origem?: string | null
          created_at?: string
          enviar_para_supervisao?: boolean
          espelho_risco_projecao?: string | null
          espelho_supervisao?: string | null
          espelho_toca_minha?: string | null
          id?: string
          pergunta_supervisao?: string | null
          reflexao_profissional?: string
          sessao_id?: string | null
          status_supervisao?: Database["public"]["Enums"]["status_supervisao"]
          tensao_etica?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jardim_do_oficio_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jardim_do_oficio_sessao_id_fkey"
            columns: ["sessao_id"]
            isOneToOne: false
            referencedRelation: "sessoes_casa_maquinas"
            referencedColumns: ["id"]
          },
        ]
      }
      jardim_grupo_registros: {
        Row: {
          campo_fechado: boolean | null
          clima_descricao: string | null
          clima_movimento: string | null
          created_at: string
          cuidado_proximo_encontro: string | null
          data_registro: string
          escuta_campo: string | null
          escuta_coletiva: string | null
          fase_jornada_grupo: string | null
          frase_semente_grupo: string | null
          group_id: string
          id: string
          imagens_emergentes: string | null
          movimentos_repetidos: string | null
          notas_privadas: string | null
          resistencias_grupais: string | null
          resposta_campo: string | null
          ritual_atual: string | null
          ritual_fechamento: string | null
          ritual_realizado: string | null
          session_id: string | null
          simbolos_coletivos: string | null
          tema_simbolico: string | null
          therapist_id: string
          updated_at: string
        }
        Insert: {
          campo_fechado?: boolean | null
          clima_descricao?: string | null
          clima_movimento?: string | null
          created_at?: string
          cuidado_proximo_encontro?: string | null
          data_registro?: string
          escuta_campo?: string | null
          escuta_coletiva?: string | null
          fase_jornada_grupo?: string | null
          frase_semente_grupo?: string | null
          group_id: string
          id?: string
          imagens_emergentes?: string | null
          movimentos_repetidos?: string | null
          notas_privadas?: string | null
          resistencias_grupais?: string | null
          resposta_campo?: string | null
          ritual_atual?: string | null
          ritual_fechamento?: string | null
          ritual_realizado?: string | null
          session_id?: string | null
          simbolos_coletivos?: string | null
          tema_simbolico?: string | null
          therapist_id: string
          updated_at?: string
        }
        Update: {
          campo_fechado?: boolean | null
          clima_descricao?: string | null
          clima_movimento?: string | null
          created_at?: string
          cuidado_proximo_encontro?: string | null
          data_registro?: string
          escuta_campo?: string | null
          escuta_coletiva?: string | null
          fase_jornada_grupo?: string | null
          frase_semente_grupo?: string | null
          group_id?: string
          id?: string
          imagens_emergentes?: string | null
          movimentos_repetidos?: string | null
          notas_privadas?: string | null
          resistencias_grupais?: string | null
          resposta_campo?: string | null
          ritual_atual?: string | null
          ritual_fechamento?: string | null
          ritual_realizado?: string | null
          session_id?: string | null
          simbolos_coletivos?: string | null
          tema_simbolico?: string | null
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jardim_grupo_registros_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "therapeutic_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jardim_grupo_registros_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "group_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      jardim_heroina: {
        Row: {
          ativado_em: string | null
          case_id: string
          chegada_corpo: string | null
          chegada_vivo: string | null
          client_id: string
          created_at: string
          fechado_em: string | null
          fechamento_deixo: string | null
          fechamento_levo: string | null
          gesto_descricao: string | null
          gesto_prazo: string | null
          gesto_prazo_texto: string | null
          gesto_tipo: Database["public"]["Enums"]["jardim_gesto_tipo"] | null
          id: string
          integracao_observar: string | null
          observacao_percebi: string | null
          observacao_sustentou: string | null
          status: Database["public"]["Enums"]["jardim_heroina_status"]
          therapist_id: string
          updated_at: string
        }
        Insert: {
          ativado_em?: string | null
          case_id: string
          chegada_corpo?: string | null
          chegada_vivo?: string | null
          client_id: string
          created_at?: string
          fechado_em?: string | null
          fechamento_deixo?: string | null
          fechamento_levo?: string | null
          gesto_descricao?: string | null
          gesto_prazo?: string | null
          gesto_prazo_texto?: string | null
          gesto_tipo?: Database["public"]["Enums"]["jardim_gesto_tipo"] | null
          id?: string
          integracao_observar?: string | null
          observacao_percebi?: string | null
          observacao_sustentou?: string | null
          status?: Database["public"]["Enums"]["jardim_heroina_status"]
          therapist_id: string
          updated_at?: string
        }
        Update: {
          ativado_em?: string | null
          case_id?: string
          chegada_corpo?: string | null
          chegada_vivo?: string | null
          client_id?: string
          created_at?: string
          fechado_em?: string | null
          fechamento_deixo?: string | null
          fechamento_levo?: string | null
          gesto_descricao?: string | null
          gesto_prazo?: string | null
          gesto_prazo_texto?: string | null
          gesto_tipo?: Database["public"]["Enums"]["jardim_gesto_tipo"] | null
          id?: string
          integracao_observar?: string | null
          observacao_percebi?: string | null
          observacao_sustentou?: string | null
          status?: Database["public"]["Enums"]["jardim_heroina_status"]
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jardim_heroina_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "session_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jardim_heroina_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      jardim_heroina_registros: {
        Row: {
          arquetipo_snapshot: string | null
          aterramento_corpo_sentiu: string | null
          aterramento_ficou_vivo: string | null
          aterramento_imagem_central: string | null
          created_at: string
          data_registro: string
          fase_jornada_snapshot: string | null
          frase_semente: string | null
          gesto_origem: string | null
          gesto_revisao_status: string | null
          id: string
          mapa_vivo_id: string | null
          mapa_vivo_origem_id: string | null
          memorias_emergentes: string | null
          notas_privadas: string | null
          ritual_movimento: string | null
          ritual_resistencia: string | null
          ritual_vivendo: string | null
          session_case_id: string
          sinais_sincronicidades: string | null
          sonhos_imagens: string | null
          therapist_id: string
          tipo_registro: string
          updated_at: string
        }
        Insert: {
          arquetipo_snapshot?: string | null
          aterramento_corpo_sentiu?: string | null
          aterramento_ficou_vivo?: string | null
          aterramento_imagem_central?: string | null
          created_at?: string
          data_registro?: string
          fase_jornada_snapshot?: string | null
          frase_semente?: string | null
          gesto_origem?: string | null
          gesto_revisao_status?: string | null
          id?: string
          mapa_vivo_id?: string | null
          mapa_vivo_origem_id?: string | null
          memorias_emergentes?: string | null
          notas_privadas?: string | null
          ritual_movimento?: string | null
          ritual_resistencia?: string | null
          ritual_vivendo?: string | null
          session_case_id: string
          sinais_sincronicidades?: string | null
          sonhos_imagens?: string | null
          therapist_id: string
          tipo_registro?: string
          updated_at?: string
        }
        Update: {
          arquetipo_snapshot?: string | null
          aterramento_corpo_sentiu?: string | null
          aterramento_ficou_vivo?: string | null
          aterramento_imagem_central?: string | null
          created_at?: string
          data_registro?: string
          fase_jornada_snapshot?: string | null
          frase_semente?: string | null
          gesto_origem?: string | null
          gesto_revisao_status?: string | null
          id?: string
          mapa_vivo_id?: string | null
          mapa_vivo_origem_id?: string | null
          memorias_emergentes?: string | null
          notas_privadas?: string | null
          ritual_movimento?: string | null
          ritual_resistencia?: string | null
          ritual_vivendo?: string | null
          session_case_id?: string
          sinais_sincronicidades?: string | null
          sonhos_imagens?: string | null
          therapist_id?: string
          tipo_registro?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jardim_heroina_registros_mapa_vivo_id_fkey"
            columns: ["mapa_vivo_id"]
            isOneToOne: false
            referencedRelation: "mapa_vivo_heroina"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jardim_heroina_registros_mapa_vivo_origem_id_fkey"
            columns: ["mapa_vivo_origem_id"]
            isOneToOne: false
            referencedRelation: "mapa_vivo_heroina"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jardim_heroina_registros_session_case_id_fkey"
            columns: ["session_case_id"]
            isOneToOne: false
            referencedRelation: "session_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      jardim_psique_registros: {
        Row: {
          arquivado: boolean
          conteudo: Json
          created_at: string
          data_aplicacao: string
          emocao_predominante: string | null
          ferramenta_chave: string
          ferramenta_nome: string
          fonte: string | null
          id: string
          integrado: boolean
          reflexao_pessoal: string | null
          resultado_simbolico: Json | null
          tags: string[] | null
          tipo_registro: string | null
          titulo: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          arquivado?: boolean
          conteudo?: Json
          created_at?: string
          data_aplicacao?: string
          emocao_predominante?: string | null
          ferramenta_chave: string
          ferramenta_nome: string
          fonte?: string | null
          id?: string
          integrado?: boolean
          reflexao_pessoal?: string | null
          resultado_simbolico?: Json | null
          tags?: string[] | null
          tipo_registro?: string | null
          titulo?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          arquivado?: boolean
          conteudo?: Json
          created_at?: string
          data_aplicacao?: string
          emocao_predominante?: string | null
          ferramenta_chave?: string
          ferramenta_nome?: string
          fonte?: string | null
          id?: string
          integrado?: boolean
          reflexao_pessoal?: string | null
          resultado_simbolico?: Json | null
          tags?: string[] | null
          tipo_registro?: string | null
          titulo?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      jornada_convites: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          id: string
          nivel: string
          ordem: number | null
          texto: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          nivel: string
          ordem?: number | null
          texto: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          nivel?: string
          ordem?: number | null
          texto?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      jornada_frases_selo: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          id: string
          ordem: number | null
          texto: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          ordem?: number | null
          texto: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          ordem?: number | null
          texto?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      jornada_habitante_eventos: {
        Row: {
          created_at: string
          evento: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          evento: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          evento?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      jornada_heroina_fases: {
        Row: {
          arquetipos_sugeridos: string[] | null
          ativo: boolean | null
          chave: string
          cor_primaria: string | null
          created_at: string | null
          descricao: string
          foco_terapeutico: string | null
          icone: string | null
          id: string
          linguagem_contencao: string | null
          microcopy: string | null
          nome: string
          nome_en: string | null
          numero: number
          ordem: number | null
          pergunta_central: string | null
          perguntas_reflexao: string[] | null
          praticas_simbolicas: string[] | null
          risco_especifico: string | null
          sinal_integracao: string | null
          subtitulo: string | null
          tarefa_simbolica: string | null
          updated_at: string | null
        }
        Insert: {
          arquetipos_sugeridos?: string[] | null
          ativo?: boolean | null
          chave: string
          cor_primaria?: string | null
          created_at?: string | null
          descricao: string
          foco_terapeutico?: string | null
          icone?: string | null
          id?: string
          linguagem_contencao?: string | null
          microcopy?: string | null
          nome: string
          nome_en?: string | null
          numero: number
          ordem?: number | null
          pergunta_central?: string | null
          perguntas_reflexao?: string[] | null
          praticas_simbolicas?: string[] | null
          risco_especifico?: string | null
          sinal_integracao?: string | null
          subtitulo?: string | null
          tarefa_simbolica?: string | null
          updated_at?: string | null
        }
        Update: {
          arquetipos_sugeridos?: string[] | null
          ativo?: boolean | null
          chave?: string
          cor_primaria?: string | null
          created_at?: string | null
          descricao?: string
          foco_terapeutico?: string | null
          icone?: string | null
          id?: string
          linguagem_contencao?: string | null
          microcopy?: string | null
          nome?: string
          nome_en?: string | null
          numero?: number
          ordem?: number | null
          pergunta_central?: string | null
          perguntas_reflexao?: string[] | null
          praticas_simbolicas?: string[] | null
          risco_especifico?: string | null
          sinal_integracao?: string | null
          subtitulo?: string | null
          tarefa_simbolica?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      jornada_heroina_notas_profissionais: {
        Row: {
          created_at: string | null
          fase_numero: number
          id: string
          intervencoes_sugeridas: string | null
          observacoes: string | null
          padroes_observados: string | null
          proximos_passos: string | null
          registro_id: string
          terapeuta_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          fase_numero: number
          id?: string
          intervencoes_sugeridas?: string | null
          observacoes?: string | null
          padroes_observados?: string | null
          proximos_passos?: string | null
          registro_id: string
          terapeuta_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          fase_numero?: number
          id?: string
          intervencoes_sugeridas?: string | null
          observacoes?: string | null
          padroes_observados?: string | null
          proximos_passos?: string | null
          registro_id?: string
          terapeuta_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jornada_heroina_notas_profissionais_registro_id_fkey"
            columns: ["registro_id"]
            isOneToOne: false
            referencedRelation: "jornada_heroina_registros"
            referencedColumns: ["id"]
          },
        ]
      }
      jornada_heroina_registros: {
        Row: {
          cliente_id: string | null
          created_at: string | null
          fase_atual: number | null
          id: string
          intencao_inicial: string | null
          modo: string
          nome_simbolico: string | null
          notas_progresso: Json | null
          reflexao_final: string | null
          session_case_id: string | null
          status: string | null
          terapeuta_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string | null
          fase_atual?: number | null
          id?: string
          intencao_inicial?: string | null
          modo?: string
          nome_simbolico?: string | null
          notas_progresso?: Json | null
          reflexao_final?: string | null
          session_case_id?: string | null
          status?: string | null
          terapeuta_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cliente_id?: string | null
          created_at?: string | null
          fase_atual?: number | null
          id?: string
          intencao_inicial?: string | null
          modo?: string
          nome_simbolico?: string | null
          notas_progresso?: Json | null
          reflexao_final?: string | null
          session_case_id?: string | null
          status?: string | null
          terapeuta_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jornada_heroina_registros_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jornada_heroina_registros_session_case_id_fkey"
            columns: ["session_case_id"]
            isOneToOne: false
            referencedRelation: "session_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      jornada_heroina_respostas: {
        Row: {
          arquetipo_escolhido: string | null
          created_at: string | null
          data_conclusao: string | null
          data_entrada: string | null
          fase_numero: number
          id: string
          notas_pessoais: string | null
          registro_id: string
          respostas_reflexao: Json | null
          simbolo_pessoal: string | null
          tom_emocional: string | null
          updated_at: string | null
        }
        Insert: {
          arquetipo_escolhido?: string | null
          created_at?: string | null
          data_conclusao?: string | null
          data_entrada?: string | null
          fase_numero: number
          id?: string
          notas_pessoais?: string | null
          registro_id: string
          respostas_reflexao?: Json | null
          simbolo_pessoal?: string | null
          tom_emocional?: string | null
          updated_at?: string | null
        }
        Update: {
          arquetipo_escolhido?: string | null
          created_at?: string | null
          data_conclusao?: string | null
          data_entrada?: string | null
          fase_numero?: number
          id?: string
          notas_pessoais?: string | null
          registro_id?: string
          respostas_reflexao?: Json | null
          simbolo_pessoal?: string | null
          tom_emocional?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jornada_heroina_respostas_registro_id_fkey"
            columns: ["registro_id"]
            isOneToOne: false
            referencedRelation: "jornada_heroina_registros"
            referencedColumns: ["id"]
          },
        ]
      }
      jornada_individuacao: {
        Row: {
          arquetipos_emergentes: string[] | null
          client_id: string
          created_at: string
          data_registro: string
          distritos_ativos: string[] | null
          etapa_jornada: string
          id: string
          reflexao_cliente: string
          therapist_id: string
          updated_at: string
        }
        Insert: {
          arquetipos_emergentes?: string[] | null
          client_id: string
          created_at?: string
          data_registro?: string
          distritos_ativos?: string[] | null
          etapa_jornada: string
          id?: string
          reflexao_cliente?: string
          therapist_id: string
          updated_at?: string
        }
        Update: {
          arquetipos_emergentes?: string[] | null
          client_id?: string
          created_at?: string
          data_registro?: string
          distritos_ativos?: string[] | null
          etapa_jornada?: string
          id?: string
          reflexao_cliente?: string
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jornada_individuacao_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      jornada_progressao: {
        Row: {
          created_at: string | null
          desbloqueio: string | null
          id: string
          metadata: Json | null
          tipo_evento: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          desbloqueio?: string | null
          id?: string
          metadata?: Json | null
          tipo_evento: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          desbloqueio?: string | null
          id?: string
          metadata?: Json | null
          tipo_evento?: string
          user_id?: string
        }
        Relationships: []
      }
      jornadas: {
        Row: {
          ativa: boolean
          cor_acento: string | null
          created_at: string
          descricao: string | null
          icone: string | null
          id: string
          nome: string
          ordem: number
          updated_at: string
        }
        Insert: {
          ativa?: boolean
          cor_acento?: string | null
          created_at?: string
          descricao?: string | null
          icone?: string | null
          id?: string
          nome: string
          ordem?: number
          updated_at?: string
        }
        Update: {
          ativa?: boolean
          cor_acento?: string | null
          created_at?: string
          descricao?: string | null
          icone?: string | null
          id?: string
          nome?: string
          ordem?: number
          updated_at?: string
        }
        Relationships: []
      }
      journey_districts: {
        Row: {
          district_id: string
          id: string
          journey_id: string
          last_session_at: string | null
          notes: string | null
          sessions_count: number | null
          state: string
        }
        Insert: {
          district_id: string
          id?: string
          journey_id: string
          last_session_at?: string | null
          notes?: string | null
          sessions_count?: number | null
          state?: string
        }
        Update: {
          district_id?: string
          id?: string
          journey_id?: string
          last_session_at?: string | null
          notes?: string | null
          sessions_count?: number | null
          state?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_districts_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_districts_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_events: {
        Row: {
          client_id: string
          created_at: string
          data_evento: string
          descricao: string | null
          id: string
          metadata_json: Json | null
          session_id: string | null
          therapist_id: string
          tipo: string
          titulo: string
        }
        Insert: {
          client_id: string
          created_at?: string
          data_evento?: string
          descricao?: string | null
          id?: string
          metadata_json?: Json | null
          session_id?: string | null
          therapist_id: string
          tipo: string
          titulo: string
        }
        Update: {
          client_id?: string
          created_at?: string
          data_evento?: string
          descricao?: string | null
          id?: string
          metadata_json?: Json | null
          session_id?: string | null
          therapist_id?: string
          tipo?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_events_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_media: {
        Row: {
          created_at: string
          gallery_items: Json | null
          header_image_url: string | null
          id: string
          infographic_kind: string | null
          infographic_url: string | null
          journey_id: string
          published: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          gallery_items?: Json | null
          header_image_url?: string | null
          id?: string
          infographic_kind?: string | null
          infographic_url?: string | null
          journey_id: string
          published?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          gallery_items?: Json | null
          header_image_url?: string | null
          id?: string
          infographic_kind?: string | null
          infographic_url?: string | null
          journey_id?: string
          published?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_media_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: true
            referencedRelation: "clube_jornadas"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_reflections: {
        Row: {
          client_id: string
          conteudo: string
          created_at: string
          id: string
          therapist_id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          conteudo?: string
          created_at?: string
          id?: string
          therapist_id: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          conteudo?: string
          created_at?: string
          id?: string
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_reflections_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      journeys: {
        Row: {
          client_id: string
          created_at: string
          current_district_id: string | null
          id: string
          process_state: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          current_district_id?: string | null
          id?: string
          process_state?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          current_district_id?: string | null
          id?: string
          process_state?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "journeys_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journeys_current_district_id_fkey"
            columns: ["current_district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_8020_progress: {
        Row: {
          aplicacao_comportamento: string | null
          aplicacao_gesto: string | null
          aplicacao_onde: string | null
          concluido: boolean
          concluido_em: string | null
          created_at: string
          id: string
          insight_livre: string | null
          notas_profissionais: string | null
          registro_reflexivo: string | null
          resposta_1: string | null
          resposta_2: string | null
          season_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          aplicacao_comportamento?: string | null
          aplicacao_gesto?: string | null
          aplicacao_onde?: string | null
          concluido?: boolean
          concluido_em?: string | null
          created_at?: string
          id?: string
          insight_livre?: string | null
          notas_profissionais?: string | null
          registro_reflexivo?: string | null
          resposta_1?: string | null
          resposta_2?: string | null
          season_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          aplicacao_comportamento?: string | null
          aplicacao_gesto?: string | null
          aplicacao_onde?: string | null
          concluido?: boolean
          concluido_em?: string | null
          created_at?: string
          id?: string
          insight_livre?: string | null
          notas_profissionais?: string | null
          registro_reflexivo?: string | null
          resposta_1?: string | null
          resposta_2?: string | null
          season_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_8020_progress_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "oracular_seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_casos: {
        Row: {
          contexto: string | null
          created_at: string
          ferramentas_sugeridas: Json | null
          hipoteses: string | null
          id: string
          nivel: string
          perguntas: Json | null
          status: string
          tema: string
          titulo: string
          updated_at: string
        }
        Insert: {
          contexto?: string | null
          created_at?: string
          ferramentas_sugeridas?: Json | null
          hipoteses?: string | null
          id?: string
          nivel?: string
          perguntas?: Json | null
          status?: string
          tema: string
          titulo: string
          updated_at?: string
        }
        Update: {
          contexto?: string | null
          created_at?: string
          ferramentas_sugeridas?: Json | null
          hipoteses?: string | null
          id?: string
          nivel?: string
          perguntas?: Json | null
          status?: string
          tema?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      labirinto_39_portas: {
        Row: {
          client_id: string
          created_at: string
          grupo_mais_acessivel: string | null
          grupo_menos_acessivel: string | null
          id: string
          portas_json: Json
          reflexao_abertas: string | null
          reflexao_fechadas: string | null
          reflexao_grupo_acessivel: string | null
          reflexao_grupo_inacessivel: string | null
          reflexao_trancadas: string | null
          therapist_id: string
          total_abertas: number
          total_fechadas: number
          total_trancadas: number
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          grupo_mais_acessivel?: string | null
          grupo_menos_acessivel?: string | null
          id?: string
          portas_json?: Json
          reflexao_abertas?: string | null
          reflexao_fechadas?: string | null
          reflexao_grupo_acessivel?: string | null
          reflexao_grupo_inacessivel?: string | null
          reflexao_trancadas?: string | null
          therapist_id: string
          total_abertas?: number
          total_fechadas?: number
          total_trancadas?: number
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          grupo_mais_acessivel?: string | null
          grupo_menos_acessivel?: string | null
          id?: string
          portas_json?: Json
          reflexao_abertas?: string | null
          reflexao_fechadas?: string | null
          reflexao_grupo_acessivel?: string | null
          reflexao_grupo_inacessivel?: string | null
          reflexao_trancadas?: string | null
          therapist_id?: string
          total_abertas?: number
          total_fechadas?: number
          total_trancadas?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "labirinto_39_portas_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      labirinto_anotacoes: {
        Row: {
          anotacao: string
          cliente_id: string | null
          created_at: string
          id: string
          porta_id: string
          tipo: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          anotacao: string
          cliente_id?: string | null
          created_at?: string
          id?: string
          porta_id: string
          tipo?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          anotacao?: string
          cliente_id?: string | null
          created_at?: string
          id?: string
          porta_id?: string
          tipo?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "labirinto_anotacoes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "labirinto_anotacoes_porta_id_fkey"
            columns: ["porta_id"]
            isOneToOne: false
            referencedRelation: "labirinto_portas"
            referencedColumns: ["id"]
          },
        ]
      }
      labirinto_arquetipos: {
        Row: {
          ativo: boolean
          cor_acento: string | null
          created_at: string
          descricao_luz: string
          descricao_sombra: string
          icone: string | null
          id: string
          imagem_url: string | null
          nome: string
          ordem: number
          territorio: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cor_acento?: string | null
          created_at?: string
          descricao_luz: string
          descricao_sombra: string
          icone?: string | null
          id?: string
          imagem_url?: string | null
          nome: string
          ordem?: number
          territorio?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cor_acento?: string | null
          created_at?: string
          descricao_luz?: string
          descricao_sombra?: string
          icone?: string | null
          id?: string
          imagem_url?: string | null
          nome?: string
          ordem?: number
          territorio?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      labirinto_fases: {
        Row: {
          ativo: boolean
          codigo_interno: string | null
          cor_acento: string | null
          created_at: string
          descricao: string
          exercicio_instrucao: string | null
          exercicio_titulo: string | null
          icone: string | null
          id: string
          imagem_url: string | null
          nome: string
          nucleo: string | null
          observacoes_admin: string | null
          ordem: number
          pergunta_chave: string | null
          ritual_texto: string | null
          subtitulo: string | null
          tema_central: string | null
          texto_simbolico: string | null
          updated_at: string
          versao_conteudo: string | null
        }
        Insert: {
          ativo?: boolean
          codigo_interno?: string | null
          cor_acento?: string | null
          created_at?: string
          descricao: string
          exercicio_instrucao?: string | null
          exercicio_titulo?: string | null
          icone?: string | null
          id?: string
          imagem_url?: string | null
          nome: string
          nucleo?: string | null
          observacoes_admin?: string | null
          ordem?: number
          pergunta_chave?: string | null
          ritual_texto?: string | null
          subtitulo?: string | null
          tema_central?: string | null
          texto_simbolico?: string | null
          updated_at?: string
          versao_conteudo?: string | null
        }
        Update: {
          ativo?: boolean
          codigo_interno?: string | null
          cor_acento?: string | null
          created_at?: string
          descricao?: string
          exercicio_instrucao?: string | null
          exercicio_titulo?: string | null
          icone?: string | null
          id?: string
          imagem_url?: string | null
          nome?: string
          nucleo?: string | null
          observacoes_admin?: string | null
          ordem?: number
          pergunta_chave?: string | null
          ritual_texto?: string | null
          subtitulo?: string | null
          tema_central?: string | null
          texto_simbolico?: string | null
          updated_at?: string
          versao_conteudo?: string | null
        }
        Relationships: []
      }
      labirinto_leituras: {
        Row: {
          cliente_id: string | null
          contexto: string | null
          created_at: string
          id: string
          metodo_ativacao: string
          porta_id: string
          reflexoes: string | null
          user_id: string
        }
        Insert: {
          cliente_id?: string | null
          contexto?: string | null
          created_at?: string
          id?: string
          metodo_ativacao?: string
          porta_id: string
          reflexoes?: string | null
          user_id: string
        }
        Update: {
          cliente_id?: string | null
          contexto?: string | null
          created_at?: string
          id?: string
          metodo_ativacao?: string
          porta_id?: string
          reflexoes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "labirinto_leituras_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "labirinto_leituras_porta_id_fkey"
            columns: ["porta_id"]
            isOneToOne: false
            referencedRelation: "labirinto_portas"
            referencedColumns: ["id"]
          },
        ]
      }
      labirinto_metaforas: {
        Row: {
          ativo: boolean
          cor_acento: string | null
          created_at: string
          icone: string | null
          id: string
          imagem_url: string | null
          nome: string
          ordem: number
          pergunta_reflexao: string | null
          texto_evocativo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cor_acento?: string | null
          created_at?: string
          icone?: string | null
          id?: string
          imagem_url?: string | null
          nome: string
          ordem?: number
          pergunta_reflexao?: string | null
          texto_evocativo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cor_acento?: string | null
          created_at?: string
          icone?: string | null
          id?: string
          imagem_url?: string | null
          nome?: string
          ordem?: number
          pergunta_reflexao?: string | null
          texto_evocativo?: string
          updated_at?: string
        }
        Relationships: []
      }
      labirinto_portas: {
        Row: {
          ai_generated_image_url: string | null
          ativa: boolean
          audio_titulo: string | null
          audio_url: string | null
          campo_pede: string | null
          caso_espelho_como_sustentar: string | null
          caso_espelho_erro_comum: string | null
          caso_espelho_erros_facilitadora: string | null
          caso_espelho_frase_chegada: string | null
          caso_espelho_postura_correta: string | null
          caso_espelho_situacao: string | null
          caso_espelho_titulo: string | null
          cena_narrativa: string | null
          chave_frase_ancora: string | null
          chave_o_que_nao_fazer: string | null
          chave_quando_parar: string | null
          chave_sinal_maturidade: string | null
          created_at: string
          eixo_psiquico: string | null
          forca_ativa: string | null
          id: string
          imagem_url: string | null
          nao_fazer_aqui: string | null
          nome: string
          numero: number
          ordem: number
          pergunta_chave: string | null
          portal_caso_espelho: Database["public"]["Enums"]["portal_type"]
          portal_chave_facilitadora: Database["public"]["Enums"]["portal_type"]
          portal_minimo: Database["public"]["Enums"]["portal_type"]
          postura_facilitadora: string | null
          risco_clinico: string | null
          subtitulo: string | null
          symbolic_focus: string | null
          tipo_campo: string | null
          updated_at: string
        }
        Insert: {
          ai_generated_image_url?: string | null
          ativa?: boolean
          audio_titulo?: string | null
          audio_url?: string | null
          campo_pede?: string | null
          caso_espelho_como_sustentar?: string | null
          caso_espelho_erro_comum?: string | null
          caso_espelho_erros_facilitadora?: string | null
          caso_espelho_frase_chegada?: string | null
          caso_espelho_postura_correta?: string | null
          caso_espelho_situacao?: string | null
          caso_espelho_titulo?: string | null
          cena_narrativa?: string | null
          chave_frase_ancora?: string | null
          chave_o_que_nao_fazer?: string | null
          chave_quando_parar?: string | null
          chave_sinal_maturidade?: string | null
          created_at?: string
          eixo_psiquico?: string | null
          forca_ativa?: string | null
          id?: string
          imagem_url?: string | null
          nao_fazer_aqui?: string | null
          nome: string
          numero: number
          ordem?: number
          pergunta_chave?: string | null
          portal_caso_espelho?: Database["public"]["Enums"]["portal_type"]
          portal_chave_facilitadora?: Database["public"]["Enums"]["portal_type"]
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          postura_facilitadora?: string | null
          risco_clinico?: string | null
          subtitulo?: string | null
          symbolic_focus?: string | null
          tipo_campo?: string | null
          updated_at?: string
        }
        Update: {
          ai_generated_image_url?: string | null
          ativa?: boolean
          audio_titulo?: string | null
          audio_url?: string | null
          campo_pede?: string | null
          caso_espelho_como_sustentar?: string | null
          caso_espelho_erro_comum?: string | null
          caso_espelho_erros_facilitadora?: string | null
          caso_espelho_frase_chegada?: string | null
          caso_espelho_postura_correta?: string | null
          caso_espelho_situacao?: string | null
          caso_espelho_titulo?: string | null
          cena_narrativa?: string | null
          chave_frase_ancora?: string | null
          chave_o_que_nao_fazer?: string | null
          chave_quando_parar?: string | null
          chave_sinal_maturidade?: string | null
          created_at?: string
          eixo_psiquico?: string | null
          forca_ativa?: string | null
          id?: string
          imagem_url?: string | null
          nao_fazer_aqui?: string | null
          nome?: string
          numero?: number
          ordem?: number
          pergunta_chave?: string | null
          portal_caso_espelho?: Database["public"]["Enums"]["portal_type"]
          portal_chave_facilitadora?: Database["public"]["Enums"]["portal_type"]
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          postura_facilitadora?: string | null
          risco_clinico?: string | null
          subtitulo?: string | null
          symbolic_focus?: string | null
          tipo_campo?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      labirinto_registros: {
        Row: {
          arquetipo_id: string | null
          concluido: boolean
          concluido_em: string | null
          created_at: string
          fase_id: string | null
          hipotese_terapeutica: string | null
          id: string
          metafora_id: string | null
          modo_uso: Database["public"]["Enums"]["labirinto_modo_uso"]
          nome_cliente: string | null
          notas_terapeuta: string | null
          observacoes_clinicas: string | null
          reflexao_arquetipo: string | null
          reflexao_fase: string | null
          reflexao_final: string | null
          reflexao_metafora: string | null
          reflexao_ritual: string | null
          ritual_id: string | null
          session_case_id: string | null
          terapeuta_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          arquetipo_id?: string | null
          concluido?: boolean
          concluido_em?: string | null
          created_at?: string
          fase_id?: string | null
          hipotese_terapeutica?: string | null
          id?: string
          metafora_id?: string | null
          modo_uso?: Database["public"]["Enums"]["labirinto_modo_uso"]
          nome_cliente?: string | null
          notas_terapeuta?: string | null
          observacoes_clinicas?: string | null
          reflexao_arquetipo?: string | null
          reflexao_fase?: string | null
          reflexao_final?: string | null
          reflexao_metafora?: string | null
          reflexao_ritual?: string | null
          ritual_id?: string | null
          session_case_id?: string | null
          terapeuta_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          arquetipo_id?: string | null
          concluido?: boolean
          concluido_em?: string | null
          created_at?: string
          fase_id?: string | null
          hipotese_terapeutica?: string | null
          id?: string
          metafora_id?: string | null
          modo_uso?: Database["public"]["Enums"]["labirinto_modo_uso"]
          nome_cliente?: string | null
          notas_terapeuta?: string | null
          observacoes_clinicas?: string | null
          reflexao_arquetipo?: string | null
          reflexao_fase?: string | null
          reflexao_final?: string | null
          reflexao_metafora?: string | null
          reflexao_ritual?: string | null
          ritual_id?: string | null
          session_case_id?: string | null
          terapeuta_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "labirinto_registros_arquetipo_id_fkey"
            columns: ["arquetipo_id"]
            isOneToOne: false
            referencedRelation: "labirinto_arquetipos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "labirinto_registros_fase_id_fkey"
            columns: ["fase_id"]
            isOneToOne: false
            referencedRelation: "labirinto_fases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "labirinto_registros_metafora_id_fkey"
            columns: ["metafora_id"]
            isOneToOne: false
            referencedRelation: "labirinto_metaforas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "labirinto_registros_ritual_id_fkey"
            columns: ["ritual_id"]
            isOneToOne: false
            referencedRelation: "labirinto_rituais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "labirinto_registros_session_case_id_fkey"
            columns: ["session_case_id"]
            isOneToOne: false
            referencedRelation: "session_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      labirinto_rituais: {
        Row: {
          ativo: boolean
          cor_acento: string | null
          created_at: string
          descricao: string
          duracao: string | null
          icone: string | null
          id: string
          instrucoes: string | null
          nome: string
          ordem: number
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cor_acento?: string | null
          created_at?: string
          descricao: string
          duracao?: string | null
          icone?: string | null
          id?: string
          instrucoes?: string | null
          nome: string
          ordem?: number
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cor_acento?: string | null
          created_at?: string
          descricao?: string
          duracao?: string | null
          icone?: string | null
          id?: string
          instrucoes?: string | null
          nome?: string
          ordem?: number
          updated_at?: string
        }
        Relationships: []
      }
      labirinto_roteiro_templates: {
        Row: {
          ativo: boolean
          camada_id: string
          created_at: string
          id: string
          ordem: number
          secao: string
          texto_base: string
          tipo_camada: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          camada_id: string
          created_at?: string
          id?: string
          ordem?: number
          secao: string
          texto_base: string
          tipo_camada: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          camada_id?: string
          created_at?: string
          id?: string
          ordem?: number
          secao?: string
          texto_base?: string
          tipo_camada?: string
          updated_at?: string
        }
        Relationships: []
      }
      labirinto_roteiros_gerados: {
        Row: {
          abertura: string | null
          arquetipo_id: string | null
          created_at: string
          editado: boolean
          exploracao: string | null
          fase_id: string | null
          fechamento: string | null
          gerado_por: string
          id: string
          intervencao: string | null
          metafora_id: string | null
          notas_terapeuta: string | null
          ritual_id: string | null
          session_case_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          abertura?: string | null
          arquetipo_id?: string | null
          created_at?: string
          editado?: boolean
          exploracao?: string | null
          fase_id?: string | null
          fechamento?: string | null
          gerado_por?: string
          id?: string
          intervencao?: string | null
          metafora_id?: string | null
          notas_terapeuta?: string | null
          ritual_id?: string | null
          session_case_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          abertura?: string | null
          arquetipo_id?: string | null
          created_at?: string
          editado?: boolean
          exploracao?: string | null
          fase_id?: string | null
          fechamento?: string | null
          gerado_por?: string
          id?: string
          intervencao?: string | null
          metafora_id?: string | null
          notas_terapeuta?: string | null
          ritual_id?: string | null
          session_case_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "labirinto_roteiros_gerados_arquetipo_id_fkey"
            columns: ["arquetipo_id"]
            isOneToOne: false
            referencedRelation: "labirinto_arquetipos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "labirinto_roteiros_gerados_fase_id_fkey"
            columns: ["fase_id"]
            isOneToOne: false
            referencedRelation: "labirinto_fases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "labirinto_roteiros_gerados_metafora_id_fkey"
            columns: ["metafora_id"]
            isOneToOne: false
            referencedRelation: "labirinto_metaforas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "labirinto_roteiros_gerados_ritual_id_fkey"
            columns: ["ritual_id"]
            isOneToOne: false
            referencedRelation: "labirinto_rituais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "labirinto_roteiros_gerados_session_case_id_fkey"
            columns: ["session_case_id"]
            isOneToOne: false
            referencedRelation: "session_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      labyrinth_records: {
        Row: {
          archetypal_image: string | null
          client_id: string
          created_at: string
          crossing: string | null
          emotional_field: string | null
          facilitator_support: string | null
          fact: string | null
          id: string
          session_id: string | null
        }
        Insert: {
          archetypal_image?: string | null
          client_id: string
          created_at?: string
          crossing?: string | null
          emotional_field?: string | null
          facilitator_support?: string | null
          fact?: string | null
          id?: string
          session_id?: string | null
        }
        Update: {
          archetypal_image?: string | null
          client_id?: string
          created_at?: string
          crossing?: string | null
          emotional_field?: string | null
          facilitator_support?: string | null
          fact?: string | null
          id?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "labyrinth_records_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "labyrinth_records_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string
          created_at: string
          description: string
          id: string
          order_number: number
          title: string
          travessia_id: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content: string
          created_at?: string
          description: string
          id?: string
          order_number: number
          title: string
          travessia_id: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          description?: string
          id?: string
          order_number?: number
          title?: string
          travessia_id?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_travessia_id_fkey"
            columns: ["travessia_id"]
            isOneToOne: false
            referencedRelation: "travessias"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons_album: {
        Row: {
          audio_script: string | null
          audio_url: string | null
          book_id: string
          clinical_alert: string | null
          clinical_notes: string | null
          closing_text: string | null
          created_at: string | null
          description: string | null
          guided_reading: string | null
          id: string
          misuse_list: string | null
          phase: string
          podcast_url: string | null
          questions: Json | null
          title: string
          updated_at: string | null
          week_number: number
        }
        Insert: {
          audio_script?: string | null
          audio_url?: string | null
          book_id: string
          clinical_alert?: string | null
          clinical_notes?: string | null
          closing_text?: string | null
          created_at?: string | null
          description?: string | null
          guided_reading?: string | null
          id?: string
          misuse_list?: string | null
          phase: string
          podcast_url?: string | null
          questions?: Json | null
          title: string
          updated_at?: string | null
          week_number: number
        }
        Update: {
          audio_script?: string | null
          audio_url?: string | null
          book_id?: string
          clinical_alert?: string | null
          clinical_notes?: string | null
          closing_text?: string | null
          created_at?: string | null
          description?: string | null
          guided_reading?: string | null
          id?: string
          misuse_list?: string | null
          phase?: string
          podcast_url?: string | null
          questions?: Json | null
          title?: string
          updated_at?: string | null
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "lessons_album_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      library_items: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
          observacoes_leitura: string | null
          origem_cultural: string | null
          portal_level_required: Database["public"]["Enums"]["portal_type"]
          tags: string[] | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          observacoes_leitura?: string | null
          origem_cultural?: string | null
          portal_level_required?: Database["public"]["Enums"]["portal_type"]
          tags?: string[] | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          observacoes_leitura?: string | null
          origem_cultural?: string | null
          portal_level_required?: Database["public"]["Enums"]["portal_type"]
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      lista_espera: {
        Row: {
          created_at: string
          email: string
          id: string
          interesse: string | null
          nome: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          interesse?: string | null
          nome?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          interesse?: string | null
          nome?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      mapa_heroina: {
        Row: {
          cliente_nome: string | null
          created_at: string
          data_registro: string
          evolucao_texto: string | null
          id: string
          porta_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cliente_nome?: string | null
          created_at?: string
          data_registro?: string
          evolucao_texto?: string | null
          id?: string
          porta_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cliente_nome?: string | null
          created_at?: string
          data_registro?: string
          evolucao_texto?: string | null
          id?: string
          porta_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mapa_heroina_porta_id_fkey"
            columns: ["porta_id"]
            isOneToOne: false
            referencedRelation: "labirinto_fases"
            referencedColumns: ["id"]
          },
        ]
      }
      mapa_sombra: {
        Row: {
          admiracoes: Json
          cliente_id: string
          created_at: string
          id: string
          irritacoes: Json
          sintese_sombra_dourada: string | null
          sintese_sombra_negativa: string | null
          therapist_id: string
          updated_at: string
        }
        Insert: {
          admiracoes?: Json
          cliente_id: string
          created_at?: string
          id?: string
          irritacoes?: Json
          sintese_sombra_dourada?: string | null
          sintese_sombra_negativa?: string | null
          therapist_id: string
          updated_at?: string
        }
        Update: {
          admiracoes?: Json
          cliente_id?: string
          created_at?: string
          id?: string
          irritacoes?: Json
          sintese_sombra_dourada?: string | null
          sintese_sombra_negativa?: string | null
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mapa_sombra_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      mapa_vivo_heroina: {
        Row: {
          arquetipo_emergente: string | null
          arquetipo_predominante: string | null
          arquetipo_tensao: string | null
          client_id: string
          created_at: string
          dinamica_arquetipal: string | null
          fase_descricao: string | null
          fase_jornada: string | null
          gesto_integracao: string | null
          gesto_jardim_registro_id: string | null
          gesto_justificativa: string | null
          gesto_sem_indicacao: boolean | null
          id: string
          metafora_central: string | null
          mito_pessoal: string | null
          movimento_descricao: string | null
          movimento_heroina: string | null
          ritual_descricao: string | null
          ritual_observacoes: string | null
          ritual_realizado: boolean | null
          ritual_tipo: string | null
          session_case_id: string
          simbolo_recorrente: string | null
          therapist_id: string
          updated_at: string
        }
        Insert: {
          arquetipo_emergente?: string | null
          arquetipo_predominante?: string | null
          arquetipo_tensao?: string | null
          client_id: string
          created_at?: string
          dinamica_arquetipal?: string | null
          fase_descricao?: string | null
          fase_jornada?: string | null
          gesto_integracao?: string | null
          gesto_jardim_registro_id?: string | null
          gesto_justificativa?: string | null
          gesto_sem_indicacao?: boolean | null
          id?: string
          metafora_central?: string | null
          mito_pessoal?: string | null
          movimento_descricao?: string | null
          movimento_heroina?: string | null
          ritual_descricao?: string | null
          ritual_observacoes?: string | null
          ritual_realizado?: boolean | null
          ritual_tipo?: string | null
          session_case_id: string
          simbolo_recorrente?: string | null
          therapist_id: string
          updated_at?: string
        }
        Update: {
          arquetipo_emergente?: string | null
          arquetipo_predominante?: string | null
          arquetipo_tensao?: string | null
          client_id?: string
          created_at?: string
          dinamica_arquetipal?: string | null
          fase_descricao?: string | null
          fase_jornada?: string | null
          gesto_integracao?: string | null
          gesto_jardim_registro_id?: string | null
          gesto_justificativa?: string | null
          gesto_sem_indicacao?: boolean | null
          id?: string
          metafora_central?: string | null
          mito_pessoal?: string | null
          movimento_descricao?: string | null
          movimento_heroina?: string | null
          ritual_descricao?: string | null
          ritual_observacoes?: string | null
          ritual_realizado?: boolean | null
          ritual_tipo?: string | null
          session_case_id?: string
          simbolo_recorrente?: string | null
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mapa_vivo_heroina_gesto_jardim_registro_id_fkey"
            columns: ["gesto_jardim_registro_id"]
            isOneToOne: false
            referencedRelation: "jardim_heroina_registros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mapa_vivo_heroina_session_case_id_fkey"
            columns: ["session_case_id"]
            isOneToOne: false
            referencedRelation: "session_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      mapa_vivo_historico: {
        Row: {
          created_at: string
          fase_anterior: string | null
          fase_nova: string | null
          id: string
          mapa_id: string
          movimento: string | null
          observacao: string | null
          session_case_id: string
          therapist_id: string
        }
        Insert: {
          created_at?: string
          fase_anterior?: string | null
          fase_nova?: string | null
          id?: string
          mapa_id: string
          movimento?: string | null
          observacao?: string | null
          session_case_id: string
          therapist_id: string
        }
        Update: {
          created_at?: string
          fase_anterior?: string | null
          fase_nova?: string | null
          id?: string
          mapa_id?: string
          movimento?: string | null
          observacao?: string | null
          session_case_id?: string
          therapist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mapa_vivo_historico_mapa_id_fkey"
            columns: ["mapa_id"]
            isOneToOne: false
            referencedRelation: "mapa_vivo_heroina"
            referencedColumns: ["id"]
          },
        ]
      }
      mapeamento_complexos: {
        Row: {
          cliente_id: string
          created_at: string
          id: string
          nome_complexo: string | null
          padroes_identificados: string | null
          personagem_ativado: string | null
          registros_gatilhos: Json
          therapist_id: string
          updated_at: string
        }
        Insert: {
          cliente_id: string
          created_at?: string
          id?: string
          nome_complexo?: string | null
          padroes_identificados?: string | null
          personagem_ativado?: string | null
          registros_gatilhos?: Json
          therapist_id: string
          updated_at?: string
        }
        Update: {
          cliente_id?: string
          created_at?: string
          id?: string
          nome_complexo?: string | null
          padroes_identificados?: string | null
          personagem_ativado?: string | null
          registros_gatilhos?: Json
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mapeamento_complexos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      matriculas: {
        Row: {
          ativa: boolean
          created_at: string
          curso_id: string
          data_fim: string | null
          data_inicio: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ativa?: boolean
          created_at?: string
          curso_id?: string
          data_fim?: string | null
          data_inicio?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ativa?: boolean
          created_at?: string
          curso_id?: string
          data_fim?: string | null
          data_inicio?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      matriculas_pendentes: {
        Row: {
          created_at: string
          curso_id: string
          email: string
          id: string
          portal_destino: Database["public"]["Enums"]["portal_type"]
          processado: boolean
          produto_rockty: string | null
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          curso_id?: string
          email: string
          id?: string
          portal_destino?: Database["public"]["Enums"]["portal_type"]
          processado?: boolean
          produto_rockty?: string | null
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          curso_id?: string
          email?: string
          id?: string
          portal_destino?: Database["public"]["Enums"]["portal_type"]
          processado?: boolean
          produto_rockty?: string | null
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      message_campaigns: {
        Row: {
          body: string
          channel: string
          created_at: string
          created_by: string | null
          cta_label: string | null
          cta_url: string | null
          id: string
          name: string
          segment_json: Json
          sent_at: string | null
          status: string
          subject: string | null
          title: string
          total_failed: number | null
          total_sent: number | null
        }
        Insert: {
          body: string
          channel: string
          created_at?: string
          created_by?: string | null
          cta_label?: string | null
          cta_url?: string | null
          id?: string
          name: string
          segment_json?: Json
          sent_at?: string | null
          status?: string
          subject?: string | null
          title: string
          total_failed?: number | null
          total_sent?: number | null
        }
        Update: {
          body?: string
          channel?: string
          created_at?: string
          created_by?: string | null
          cta_label?: string | null
          cta_url?: string | null
          id?: string
          name?: string
          segment_json?: Json
          sent_at?: string | null
          status?: string
          subject?: string | null
          title?: string
          total_failed?: number | null
          total_sent?: number | null
        }
        Relationships: []
      }
      message_logs: {
        Row: {
          campaign_id: string | null
          channel: string
          error_message: string | null
          id: string
          sent_at: string
          success: boolean
          template_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          campaign_id?: string | null
          channel: string
          error_message?: string | null
          id?: string
          sent_at?: string
          success?: boolean
          template_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          campaign_id?: string | null
          channel?: string
          error_message?: string | null
          id?: string
          sent_at?: string
          success?: boolean
          template_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_logs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "message_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_logs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "message_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      message_templates: {
        Row: {
          body: string
          channel: string
          cta_label: string | null
          cta_url: string | null
          id: string
          is_enabled: boolean
          subject: string | null
          title: string
          type: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          body: string
          channel: string
          cta_label?: string | null
          cta_url?: string | null
          id?: string
          is_enabled?: boolean
          subject?: string | null
          title: string
          type: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          body?: string
          channel?: string
          cta_label?: string | null
          cta_url?: string | null
          id?: string
          is_enabled?: boolean
          subject?: string | null
          title?: string
          type?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      mind_map_nodes: {
        Row: {
          color: string | null
          created_at: string
          id: string
          map_id: string
          notes: string | null
          order_index: number
          parent_id: string | null
          position_x: number
          position_y: number
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          map_id: string
          notes?: string | null
          order_index?: number
          parent_id?: string | null
          position_x?: number
          position_y?: number
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          map_id?: string
          notes?: string | null
          order_index?: number
          parent_id?: string | null
          position_x?: number
          position_y?: number
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mind_map_nodes_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "mind_maps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mind_map_nodes_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "mind_map_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      mind_maps: {
        Row: {
          created_at: string
          description: string | null
          id: string
          owner_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          owner_id: string
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          owner_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mind_maps_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mind_maps_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "v_formation_progress"
            referencedColumns: ["user_id"]
          },
        ]
      }
      missoes: {
        Row: {
          aula_id: string | null
          compartilhamento_opcional: boolean
          created_at: string
          created_by: string | null
          criterios_conclusao: string | null
          descricao: string | null
          id: string
          ordem: number
          portal_id: string | null
          status: string
          titulo: string
          updated_at: string
        }
        Insert: {
          aula_id?: string | null
          compartilhamento_opcional?: boolean
          created_at?: string
          created_by?: string | null
          criterios_conclusao?: string | null
          descricao?: string | null
          id?: string
          ordem?: number
          portal_id?: string | null
          status?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          aula_id?: string | null
          compartilhamento_opcional?: boolean
          created_at?: string
          created_by?: string | null
          criterios_conclusao?: string | null
          descricao?: string | null
          id?: string
          ordem?: number
          portal_id?: string | null
          status?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "missoes_aula_id_fkey"
            columns: ["aula_id"]
            isOneToOne: false
            referencedRelation: "aulas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "missoes_portal_id_fkey"
            columns: ["portal_id"]
            isOneToOne: false
            referencedRelation: "portais"
            referencedColumns: ["id"]
          },
        ]
      }
      modulos_formativos: {
        Row: {
          created_at: string
          descricao_curta: string | null
          destaque_vitrine: boolean
          id: string
          imagem_capa: string | null
          nivel_acesso: Database["public"]["Enums"]["nivel_acesso_modulo"]
          nome_modulo: string
          ordem_exibicao: number
          rota_destino: string | null
          status_publicacao: Database["public"]["Enums"]["status_publicacao"]
          tipo_modulo: Database["public"]["Enums"]["tipo_modulo"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao_curta?: string | null
          destaque_vitrine?: boolean
          id?: string
          imagem_capa?: string | null
          nivel_acesso?: Database["public"]["Enums"]["nivel_acesso_modulo"]
          nome_modulo: string
          ordem_exibicao?: number
          rota_destino?: string | null
          status_publicacao?: Database["public"]["Enums"]["status_publicacao"]
          tipo_modulo?: Database["public"]["Enums"]["tipo_modulo"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao_curta?: string | null
          destaque_vitrine?: boolean
          id?: string
          imagem_capa?: string | null
          nivel_acesso?: Database["public"]["Enums"]["nivel_acesso_modulo"]
          nome_modulo?: string
          ordem_exibicao?: number
          rota_destino?: string | null
          status_publicacao?: Database["public"]["Enums"]["status_publicacao"]
          tipo_modulo?: Database["public"]["Enums"]["tipo_modulo"]
          updated_at?: string
        }
        Relationships: []
      }
      narrative_maps: {
        Row: {
          case_id: string
          client_id: string
          created_at: string
          id: string
          layer1_context: string | null
          layer1_fact_event: string | null
          layer1_trigger: string | null
          layer2_emotion_main: string | null
          layer2_emotion_secondary: string | null
          layer2_intensity: number | null
          layer3_central_element: string | null
          layer3_climate: string | null
          layer3_scene: string | null
          layer4_archetype_conflict: string | null
          layer4_archetype_main: string | null
          layer4_protects: string | null
          layer5_cost: string | null
          layer5_prohibition: string | null
          layer5_strategy: string | null
          layer6_current_repeat: string | null
          layer6_first_memory: string | null
          layer6_pattern: string | null
          layer7_ego_resistance: string | null
          layer7_invitation: string | null
          layer7_small_gesture: string | null
          summary_archetype: string | null
          summary_core: string | null
          summary_invitation: string | null
          summary_repetition: string | null
          therapist_id: string
          updated_at: string
        }
        Insert: {
          case_id: string
          client_id: string
          created_at?: string
          id?: string
          layer1_context?: string | null
          layer1_fact_event?: string | null
          layer1_trigger?: string | null
          layer2_emotion_main?: string | null
          layer2_emotion_secondary?: string | null
          layer2_intensity?: number | null
          layer3_central_element?: string | null
          layer3_climate?: string | null
          layer3_scene?: string | null
          layer4_archetype_conflict?: string | null
          layer4_archetype_main?: string | null
          layer4_protects?: string | null
          layer5_cost?: string | null
          layer5_prohibition?: string | null
          layer5_strategy?: string | null
          layer6_current_repeat?: string | null
          layer6_first_memory?: string | null
          layer6_pattern?: string | null
          layer7_ego_resistance?: string | null
          layer7_invitation?: string | null
          layer7_small_gesture?: string | null
          summary_archetype?: string | null
          summary_core?: string | null
          summary_invitation?: string | null
          summary_repetition?: string | null
          therapist_id: string
          updated_at?: string
        }
        Update: {
          case_id?: string
          client_id?: string
          created_at?: string
          id?: string
          layer1_context?: string | null
          layer1_fact_event?: string | null
          layer1_trigger?: string | null
          layer2_emotion_main?: string | null
          layer2_emotion_secondary?: string | null
          layer2_intensity?: number | null
          layer3_central_element?: string | null
          layer3_climate?: string | null
          layer3_scene?: string | null
          layer4_archetype_conflict?: string | null
          layer4_archetype_main?: string | null
          layer4_protects?: string | null
          layer5_cost?: string | null
          layer5_prohibition?: string | null
          layer5_strategy?: string | null
          layer6_current_repeat?: string | null
          layer6_first_memory?: string | null
          layer6_pattern?: string | null
          layer7_ego_resistance?: string | null
          layer7_invitation?: string | null
          layer7_small_gesture?: string | null
          summary_archetype?: string | null
          summary_core?: string | null
          summary_invitation?: string | null
          summary_repetition?: string | null
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "narrative_maps_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "session_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "narrative_maps_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "narrative_maps_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "v_formation_progress"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "narrative_maps_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "narrative_maps_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "v_formation_progress"
            referencedColumns: ["user_id"]
          },
        ]
      }
      narroterapia_autorizacao: {
        Row: {
          autorizado: boolean
          created_at: string
          id: string
          motivo_suspensao: string | null
          movimento_1_completado_em: string | null
          movimento_2_aceite_em: string | null
          movimento_3_autorizado_em: string | null
          movimento_3_pausa_iniciada_em: string | null
          movimento_4_selado_em: string | null
          selo_ativo: boolean
          suspenso: boolean
          suspenso_em: string | null
          suspenso_por: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          autorizado?: boolean
          created_at?: string
          id?: string
          motivo_suspensao?: string | null
          movimento_1_completado_em?: string | null
          movimento_2_aceite_em?: string | null
          movimento_3_autorizado_em?: string | null
          movimento_3_pausa_iniciada_em?: string | null
          movimento_4_selado_em?: string | null
          selo_ativo?: boolean
          suspenso?: boolean
          suspenso_em?: string | null
          suspenso_por?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          autorizado?: boolean
          created_at?: string
          id?: string
          motivo_suspensao?: string | null
          movimento_1_completado_em?: string | null
          movimento_2_aceite_em?: string | null
          movimento_3_autorizado_em?: string | null
          movimento_3_pausa_iniciada_em?: string | null
          movimento_4_selado_em?: string | null
          selo_ativo?: boolean
          suspenso?: boolean
          suspenso_em?: string | null
          suspenso_por?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      narroterapia_estudos: {
        Row: {
          audio_id: string
          estudado_em: string | null
          id: string
          user_id: string
        }
        Insert: {
          audio_id: string
          estudado_em?: string | null
          id?: string
          user_id: string
        }
        Update: {
          audio_id?: string
          estudado_em?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "narroterapia_estudos_audio_id_fkey"
            columns: ["audio_id"]
            isOneToOne: false
            referencedRelation: "audio_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      narroterapia_reacoes_simbolicas: {
        Row: {
          audio_id: string | null
          conto_clinico_id: string | null
          created_at: string | null
          id: string
          observacoes: string | null
          tipo_uso: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          audio_id?: string | null
          conto_clinico_id?: string | null
          created_at?: string | null
          id?: string
          observacoes?: string | null
          tipo_uso?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          audio_id?: string | null
          conto_clinico_id?: string | null
          created_at?: string | null
          id?: string
          observacoes?: string | null
          tipo_uso?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "narroterapia_reacoes_simbolicas_audio_id_fkey"
            columns: ["audio_id"]
            isOneToOne: false
            referencedRelation: "audio_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "narroterapia_reacoes_simbolicas_conto_clinico_id_fkey"
            columns: ["conto_clinico_id"]
            isOneToOne: false
            referencedRelation: "contos_clinicos"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_logs: {
        Row: {
          id: string
          reference_date: string
          sent_at: string
          type: string
          user_id: string
        }
        Insert: {
          id?: string
          reference_date: string
          sent_at?: string
          type: string
          user_id: string
        }
        Update: {
          id?: string
          reference_date?: string
          sent_at?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          atividade_comunidade: boolean
          created_at: string
          email: boolean
          expiracao_assinatura: boolean
          id: string
          in_app: boolean
          mensagens_suporte: boolean
          novo_conteudo: boolean
          push: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          atividade_comunidade?: boolean
          created_at?: string
          email?: boolean
          expiracao_assinatura?: boolean
          id?: string
          in_app?: boolean
          mensagens_suporte?: boolean
          novo_conteudo?: boolean
          push?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          atividade_comunidade?: boolean
          created_at?: string
          email?: boolean
          expiracao_assinatura?: boolean
          id?: string
          in_app?: boolean
          mensagens_suporte?: boolean
          novo_conteudo?: boolean
          push?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          cta_label: string | null
          cta_url: string | null
          id: string
          is_read: boolean
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          id?: string
          is_read?: boolean
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          id?: string
          is_read?: boolean
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      ofertas: {
        Row: {
          ativo: boolean | null
          badge: string | null
          created_at: string
          destaque: boolean | null
          gratuito: boolean | null
          id: string
          inclusoes: string[] | null
          link_botao: string
          nome: string
          ordem: number | null
          preco: string | null
          simbolo: string | null
          subtitulo: string | null
          texto_botao: string
          tipo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          badge?: string | null
          created_at?: string
          destaque?: boolean | null
          gratuito?: boolean | null
          id?: string
          inclusoes?: string[] | null
          link_botao?: string
          nome: string
          ordem?: number | null
          preco?: string | null
          simbolo?: string | null
          subtitulo?: string | null
          texto_botao?: string
          tipo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          badge?: string | null
          created_at?: string
          destaque?: boolean | null
          gratuito?: boolean | null
          id?: string
          inclusoes?: string[] | null
          link_botao?: string
          nome?: string
          ordem?: number | null
          preco?: string | null
          simbolo?: string | null
          subtitulo?: string | null
          texto_botao?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      oracle_cards: {
        Row: {
          ai_generated_image_url: string | null
          back_image_url: string | null
          base_question: string | null
          care_notes: string | null
          category_id: string | null
          color_hex: string | null
          created_at: string
          deep_reading: string | null
          id: string
          image_variants_json: Json | null
          is_sensitive: boolean | null
          keyword: string | null
          keywords_json: Json | null
          level: Database["public"]["Enums"]["oracle_card_level"] | null
          main_image_url: string | null
          oracle_id: string
          ordem: number | null
          polarity_light_text: string | null
          polarity_shadow_text: string | null
          reflection_questions_json: Json | null
          ritual_text: string | null
          short_message: string | null
          status: Database["public"]["Enums"]["oracle_content_status"] | null
          subtitle: string | null
          suggested_intervention_id: string | null
          suggested_tool_id: string | null
          symbolic_focus: string | null
          title: string
          updated_at: string
        }
        Insert: {
          ai_generated_image_url?: string | null
          back_image_url?: string | null
          base_question?: string | null
          care_notes?: string | null
          category_id?: string | null
          color_hex?: string | null
          created_at?: string
          deep_reading?: string | null
          id?: string
          image_variants_json?: Json | null
          is_sensitive?: boolean | null
          keyword?: string | null
          keywords_json?: Json | null
          level?: Database["public"]["Enums"]["oracle_card_level"] | null
          main_image_url?: string | null
          oracle_id: string
          ordem?: number | null
          polarity_light_text?: string | null
          polarity_shadow_text?: string | null
          reflection_questions_json?: Json | null
          ritual_text?: string | null
          short_message?: string | null
          status?: Database["public"]["Enums"]["oracle_content_status"] | null
          subtitle?: string | null
          suggested_intervention_id?: string | null
          suggested_tool_id?: string | null
          symbolic_focus?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          ai_generated_image_url?: string | null
          back_image_url?: string | null
          base_question?: string | null
          care_notes?: string | null
          category_id?: string | null
          color_hex?: string | null
          created_at?: string
          deep_reading?: string | null
          id?: string
          image_variants_json?: Json | null
          is_sensitive?: boolean | null
          keyword?: string | null
          keywords_json?: Json | null
          level?: Database["public"]["Enums"]["oracle_card_level"] | null
          main_image_url?: string | null
          oracle_id?: string
          ordem?: number | null
          polarity_light_text?: string | null
          polarity_shadow_text?: string | null
          reflection_questions_json?: Json | null
          ritual_text?: string | null
          short_message?: string | null
          status?: Database["public"]["Enums"]["oracle_content_status"] | null
          subtitle?: string | null
          suggested_intervention_id?: string | null
          suggested_tool_id?: string | null
          symbolic_focus?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "oracle_cards_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "oracle_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oracle_cards_oracle_id_fkey"
            columns: ["oracle_id"]
            isOneToOne: false
            referencedRelation: "oracle_decks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oracle_cards_suggested_tool_id_fkey"
            columns: ["suggested_tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      oracle_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          oracle_id: string
          ordem: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          oracle_id: string
          ordem?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          oracle_id?: string
          ordem?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "oracle_categories_oracle_id_fkey"
            columns: ["oracle_id"]
            isOneToOne: false
            referencedRelation: "oracle_decks"
            referencedColumns: ["id"]
          },
        ]
      }
      oracle_clients: {
        Row: {
          created_at: string
          display_name: string
          id: string
          notes_private: string | null
          therapist_user_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name: string
          id?: string
          notes_private?: string | null
          therapist_user_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          notes_private?: string | null
          therapist_user_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      oracle_decks: {
        Row: {
          cover_image_url: string | null
          created_at: string
          created_by: string | null
          description: string | null
          disclaimer_text: string | null
          enable_journal: boolean | null
          enable_professional_mode: boolean | null
          id: string
          is_sensitive_mode_available: boolean | null
          lock_message_body: string | null
          lock_message_title: string | null
          minimum_portal: Database["public"]["Enums"]["portal_type"] | null
          name: string
          onboarding_json: Json | null
          ordem: number | null
          show_locked_teaser: boolean | null
          slug: string
          status: Database["public"]["Enums"]["oracle_content_status"] | null
          subtitle: string | null
          theme_json: Json | null
          updated_at: string
          upgrade_cta_route: string | null
          upgrade_cta_text: string | null
          voice_settings_json: Json | null
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          disclaimer_text?: string | null
          enable_journal?: boolean | null
          enable_professional_mode?: boolean | null
          id?: string
          is_sensitive_mode_available?: boolean | null
          lock_message_body?: string | null
          lock_message_title?: string | null
          minimum_portal?: Database["public"]["Enums"]["portal_type"] | null
          name: string
          onboarding_json?: Json | null
          ordem?: number | null
          show_locked_teaser?: boolean | null
          slug: string
          status?: Database["public"]["Enums"]["oracle_content_status"] | null
          subtitle?: string | null
          theme_json?: Json | null
          updated_at?: string
          upgrade_cta_route?: string | null
          upgrade_cta_text?: string | null
          voice_settings_json?: Json | null
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          disclaimer_text?: string | null
          enable_journal?: boolean | null
          enable_professional_mode?: boolean | null
          id?: string
          is_sensitive_mode_available?: boolean | null
          lock_message_body?: string | null
          lock_message_title?: string | null
          minimum_portal?: Database["public"]["Enums"]["portal_type"] | null
          name?: string
          onboarding_json?: Json | null
          ordem?: number | null
          show_locked_teaser?: boolean | null
          slug?: string
          status?: Database["public"]["Enums"]["oracle_content_status"] | null
          subtitle?: string | null
          theme_json?: Json | null
          updated_at?: string
          upgrade_cta_route?: string | null
          upgrade_cta_text?: string | null
          voice_settings_json?: Json | null
        }
        Relationships: []
      }
      oracle_draws: {
        Row: {
          client_id: string | null
          created_at: string
          drawn_cards_json: Json
          id: string
          is_professional_session: boolean | null
          oracle_id: string
          spread_id: string
          updated_at: string
          user_id: string
          user_notes: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          drawn_cards_json?: Json
          id?: string
          is_professional_session?: boolean | null
          oracle_id: string
          spread_id: string
          updated_at?: string
          user_id: string
          user_notes?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string
          drawn_cards_json?: Json
          id?: string
          is_professional_session?: boolean | null
          oracle_id?: string
          spread_id?: string
          updated_at?: string
          user_id?: string
          user_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "oracle_draws_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "oracle_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oracle_draws_oracle_id_fkey"
            columns: ["oracle_id"]
            isOneToOne: false
            referencedRelation: "oracle_decks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oracle_draws_spread_id_fkey"
            columns: ["spread_id"]
            isOneToOne: false
            referencedRelation: "oracle_spreads"
            referencedColumns: ["id"]
          },
        ]
      }
      oracle_spreads: {
        Row: {
          closing_text: string | null
          created_at: string
          description: string | null
          id: string
          layout_type:
            | Database["public"]["Enums"]["oracle_spread_layout"]
            | null
          name: string
          number_of_cards: number
          opening_text: string | null
          oracle_id: string
          ordem: number | null
          positions_json: Json | null
          rules_json: Json | null
          status: Database["public"]["Enums"]["oracle_content_status"] | null
          updated_at: string
        }
        Insert: {
          closing_text?: string | null
          created_at?: string
          description?: string | null
          id?: string
          layout_type?:
            | Database["public"]["Enums"]["oracle_spread_layout"]
            | null
          name: string
          number_of_cards?: number
          opening_text?: string | null
          oracle_id: string
          ordem?: number | null
          positions_json?: Json | null
          rules_json?: Json | null
          status?: Database["public"]["Enums"]["oracle_content_status"] | null
          updated_at?: string
        }
        Update: {
          closing_text?: string | null
          created_at?: string
          description?: string | null
          id?: string
          layout_type?:
            | Database["public"]["Enums"]["oracle_spread_layout"]
            | null
          name?: string
          number_of_cards?: number
          opening_text?: string | null
          oracle_id?: string
          ordem?: number | null
          positions_json?: Json | null
          rules_json?: Json | null
          status?: Database["public"]["Enums"]["oracle_content_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "oracle_spreads_oracle_id_fkey"
            columns: ["oracle_id"]
            isOneToOne: false
            referencedRelation: "oracle_decks"
            referencedColumns: ["id"]
          },
        ]
      }
      oracle_symbolic_focuses: {
        Row: {
          ativo: boolean | null
          created_at: string
          descricao: string | null
          id: string
          nome: string
          ordem: number | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          ordem?: number | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          ordem?: number | null
        }
        Relationships: []
      }
      oracle_usage_stats: {
        Row: {
          client_id: string
          count: number
          id: string
          last_used_at: string
          oracle_card_id: string
        }
        Insert: {
          client_id: string
          count?: number
          id?: string
          last_used_at?: string
          oracle_card_id: string
        }
        Update: {
          client_id?: string
          count?: number
          id?: string
          last_used_at?: string
          oracle_card_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "oracle_usage_stats_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oracle_usage_stats_oracle_card_id_fkey"
            columns: ["oracle_card_id"]
            isOneToOne: false
            referencedRelation: "oracle_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      oracular_readings: {
        Row: {
          admin_response: string | null
          axes_professional: string | null
          created_at: string
          id: string
          portal_readiness: string | null
          projection_shadow: string | null
          status: string
          symbolic_narrative: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_response?: string | null
          axes_professional?: string | null
          created_at?: string
          id?: string
          portal_readiness?: string | null
          projection_shadow?: string | null
          status?: string
          symbolic_narrative?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_response?: string | null
          axes_professional?: string | null
          created_at?: string
          id?: string
          portal_readiness?: string | null
          projection_shadow?: string | null
          status?: string
          symbolic_narrative?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      oracular_seasons: {
        Row: {
          aplicacao_profissional: string | null
          created_at: string
          foco_travessia: string | null
          id: string
          nome_estacao: string
          ordem: number
          periodo: string | null
          simbolo: string | null
          status: string | null
          updated_at: string
          visivel: boolean | null
        }
        Insert: {
          aplicacao_profissional?: string | null
          created_at?: string
          foco_travessia?: string | null
          id?: string
          nome_estacao: string
          ordem?: number
          periodo?: string | null
          simbolo?: string | null
          status?: string | null
          updated_at?: string
          visivel?: boolean | null
        }
        Update: {
          aplicacao_profissional?: string | null
          created_at?: string
          foco_travessia?: string | null
          id?: string
          nome_estacao?: string
          ordem?: number
          periodo?: string | null
          simbolo?: string | null
          status?: string | null
          updated_at?: string
          visivel?: boolean | null
        }
        Relationships: []
      }
      oraculo_aplicacoes: {
        Row: {
          caso_id: string | null
          contexto: string | null
          created_at: string
          devolutiva: string | null
          id: string
          pergunta_id: string
          resposta: string | null
          sessao_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          caso_id?: string | null
          contexto?: string | null
          created_at?: string
          devolutiva?: string | null
          id?: string
          pergunta_id: string
          resposta?: string | null
          sessao_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          caso_id?: string | null
          contexto?: string | null
          created_at?: string
          devolutiva?: string | null
          id?: string
          pergunta_id?: string
          resposta?: string | null
          sessao_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "oraculo_aplicacoes_pergunta_id_fkey"
            columns: ["pergunta_id"]
            isOneToOne: false
            referencedRelation: "oraculo_perguntas"
            referencedColumns: ["id"]
          },
        ]
      }
      oraculo_favoritos: {
        Row: {
          created_at: string
          id: string
          pergunta_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          pergunta_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          pergunta_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "oraculo_favoritos_pergunta_id_fkey"
            columns: ["pergunta_id"]
            isOneToOne: false
            referencedRelation: "oraculo_perguntas"
            referencedColumns: ["id"]
          },
        ]
      }
      oraculo_perguntas: {
        Row: {
          created_at: string
          id: string
          nivel_intensidade: number | null
          pergunta: string
          portal_minimo: Database["public"]["Enums"]["portal_type"]
          status: Database["public"]["Enums"]["agente_status"]
          tags: string[] | null
          tema: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          nivel_intensidade?: number | null
          pergunta: string
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          status?: Database["public"]["Enums"]["agente_status"]
          tags?: string[] | null
          tema: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nivel_intensidade?: number | null
          pergunta?: string
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          status?: Database["public"]["Enums"]["agente_status"]
          tags?: string[] | null
          tema?: string
          updated_at?: string
        }
        Relationships: []
      }
      pattern_flags: {
        Row: {
          created_at: string
          flag_type: Database["public"]["Enums"]["pattern_flag_type"]
          id: string
          last_seen_at: string
          message: string
          scope_id: string
          scope_type: Database["public"]["Enums"]["pattern_scope_type"]
          severity: Database["public"]["Enums"]["pattern_severity"]
          supporting_data_json: Json | null
          title: string
        }
        Insert: {
          created_at?: string
          flag_type: Database["public"]["Enums"]["pattern_flag_type"]
          id?: string
          last_seen_at?: string
          message: string
          scope_id: string
          scope_type?: Database["public"]["Enums"]["pattern_scope_type"]
          severity?: Database["public"]["Enums"]["pattern_severity"]
          supporting_data_json?: Json | null
          title: string
        }
        Update: {
          created_at?: string
          flag_type?: Database["public"]["Enums"]["pattern_flag_type"]
          id?: string
          last_seen_at?: string
          message?: string
          scope_id?: string
          scope_type?: Database["public"]["Enums"]["pattern_scope_type"]
          severity?: Database["public"]["Enums"]["pattern_severity"]
          supporting_data_json?: Json | null
          title?: string
        }
        Relationships: []
      }
      personal_symbolic_maps: {
        Row: {
          content: Json
          created_at: string
          description: string | null
          id: string
          published: boolean
          template_key: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: Json
          created_at?: string
          description?: string | null
          id?: string
          published?: boolean
          template_key: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          description?: string | null
          id?: string
          published?: boolean
          template_key?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      plan_limits: {
        Row: {
          created_at: string
          id: string
          max_cases: number
          max_clientes: number
          portal: Database["public"]["Enums"]["portal_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          max_cases?: number
          max_clientes?: number
          portal: Database["public"]["Enums"]["portal_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          max_cases?: number
          max_clientes?: number
          portal?: Database["public"]["Enums"]["portal_type"]
          updated_at?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao: string | null
          destaque: boolean | null
          duracao_meses: number | null
          features: Json | null
          id: string
          max_clientes: number
          nome: string
          ordem: number | null
          portal_resultante: Database["public"]["Enums"]["portal_type"]
          preco_mensal: number | null
          preco_unico: number | null
          tipo_cobranca: string | null
          updated_at: string | null
          url_checkout: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          destaque?: boolean | null
          duracao_meses?: number | null
          features?: Json | null
          id: string
          max_clientes?: number
          nome: string
          ordem?: number | null
          portal_resultante: Database["public"]["Enums"]["portal_type"]
          preco_mensal?: number | null
          preco_unico?: number | null
          tipo_cobranca?: string | null
          updated_at?: string | null
          url_checkout?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          destaque?: boolean | null
          duracao_meses?: number | null
          features?: Json | null
          id?: string
          max_clientes?: number
          nome?: string
          ordem?: number | null
          portal_resultante?: Database["public"]["Enums"]["portal_type"]
          preco_mensal?: number | null
          preco_unico?: number | null
          tipo_cobranca?: string | null
          updated_at?: string | null
          url_checkout?: string | null
        }
        Relationships: []
      }
      portais: {
        Row: {
          capa_url: string | null
          created_at: string
          created_by: string | null
          descricao: string | null
          id: string
          jornada_id: string
          modulo_id: string | null
          motor_geracao: string | null
          nivel_conteudo: string | null
          objetivo: string | null
          ordem: number
          portal_minimo: string | null
          status: string
          subtitulo: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          capa_url?: string | null
          created_at?: string
          created_by?: string | null
          descricao?: string | null
          id?: string
          jornada_id: string
          modulo_id?: string | null
          motor_geracao?: string | null
          nivel_conteudo?: string | null
          objetivo?: string | null
          ordem?: number
          portal_minimo?: string | null
          status?: string
          subtitulo?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          capa_url?: string | null
          created_at?: string
          created_by?: string | null
          descricao?: string | null
          id?: string
          jornada_id?: string
          modulo_id?: string | null
          motor_geracao?: string | null
          nivel_conteudo?: string | null
          objetivo?: string | null
          ordem?: number
          portal_minimo?: string | null
          status?: string
          subtitulo?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portais_jornada_id_fkey"
            columns: ["jornada_id"]
            isOneToOne: false
            referencedRelation: "jornadas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portais_modulo_id_fkey"
            columns: ["modulo_id"]
            isOneToOne: false
            referencedRelation: "modulos_formativos"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_junguiano_config: {
        Row: {
          aviso_etico: string | null
          created_at: string
          descricao: string | null
          id: string
          modo_clinica_ativo: boolean | null
          portal_minimo: Database["public"]["Enums"]["portal_type"]
          status: string
          subtitulo: string | null
          texto_encerramento: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          aviso_etico?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          modo_clinica_ativo?: boolean | null
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          status?: string
          subtitulo?: string | null
          texto_encerramento?: string | null
          titulo?: string
          updated_at?: string
        }
        Update: {
          aviso_etico?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          modo_clinica_ativo?: boolean | null
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          status?: string
          subtitulo?: string | null
          texto_encerramento?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      portal_junguiano_modulos: {
        Row: {
          ativo: boolean | null
          config_id: string | null
          created_at: string
          descricao: string | null
          id: string
          ordem: number
          portal_minimo: Database["public"]["Enums"]["portal_type"]
          subtitulo: string | null
          tipo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          config_id?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          ordem?: number
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          subtitulo?: string | null
          tipo?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          config_id?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          ordem?: number
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          subtitulo?: string | null
          tipo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_junguiano_modulos_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "portal_junguiano_config"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_junguiano_portais: {
        Row: {
          ativo: boolean | null
          audio_titulo: string | null
          audio_url: string | null
          created_at: string
          desbloqueio_tipo: string | null
          descricao: string | null
          frase_oraculo: string | null
          id: string
          missao_criterio_conclusao: string | null
          missao_descricao: string | null
          missao_titulo: string | null
          modulo_id: string | null
          numero_ordem: number
          portal_minimo: Database["public"]["Enums"]["portal_type"]
          subtitulo: string | null
          texto_aula_principal: string | null
          titulo: string
          updated_at: string
          vivencia_guiada: string | null
        }
        Insert: {
          ativo?: boolean | null
          audio_titulo?: string | null
          audio_url?: string | null
          created_at?: string
          desbloqueio_tipo?: string | null
          descricao?: string | null
          frase_oraculo?: string | null
          id?: string
          missao_criterio_conclusao?: string | null
          missao_descricao?: string | null
          missao_titulo?: string | null
          modulo_id?: string | null
          numero_ordem?: number
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          subtitulo?: string | null
          texto_aula_principal?: string | null
          titulo: string
          updated_at?: string
          vivencia_guiada?: string | null
        }
        Update: {
          ativo?: boolean | null
          audio_titulo?: string | null
          audio_url?: string | null
          created_at?: string
          desbloqueio_tipo?: string | null
          descricao?: string | null
          frase_oraculo?: string | null
          id?: string
          missao_criterio_conclusao?: string | null
          missao_descricao?: string | null
          missao_titulo?: string | null
          modulo_id?: string | null
          numero_ordem?: number
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          subtitulo?: string | null
          texto_aula_principal?: string | null
          titulo?: string
          updated_at?: string
          vivencia_guiada?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portal_junguiano_portais_modulo_id_fkey"
            columns: ["modulo_id"]
            isOneToOne: false
            referencedRelation: "portal_junguiano_modulos"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_junguiano_progresso: {
        Row: {
          concluido_em: string | null
          config_id: string | null
          created_at: string
          id: string
          iniciado_em: string | null
          modo_clinica: boolean | null
          portais_concluidos: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          concluido_em?: string | null
          config_id?: string | null
          created_at?: string
          id?: string
          iniciado_em?: string | null
          modo_clinica?: boolean | null
          portais_concluidos?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          concluido_em?: string | null
          config_id?: string | null
          created_at?: string
          id?: string
          iniciado_em?: string | null
          modo_clinica?: boolean | null
          portais_concluidos?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_junguiano_progresso_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "portal_junguiano_config"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_junguiano_registros: {
        Row: {
          created_at: string
          id: string
          missao_concluida: boolean | null
          missao_concluida_em: string | null
          portal_id: string | null
          reflexao: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          missao_concluida?: boolean | null
          missao_concluida_em?: string | null
          portal_id?: string | null
          reflexao?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          missao_concluida?: boolean | null
          missao_concluida_em?: string | null
          portal_id?: string | null
          reflexao?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_junguiano_registros_portal_id_fkey"
            columns: ["portal_id"]
            isOneToOne: false
            referencedRelation: "portal_junguiano_portais"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_progress: {
        Row: {
          created_at: string
          has_minimum_record: boolean
          id: string
          last_activity_at: string
          last_position: number | null
          portal_id: string
          state: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          has_minimum_record?: boolean
          id?: string
          last_activity_at?: string
          last_position?: number | null
          portal_id: string
          state?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          has_minimum_record?: boolean
          id?: string
          last_activity_at?: string
          last_position?: number | null
          portal_id?: string
          state?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_progress_portal_id_fkey"
            columns: ["portal_id"]
            isOneToOne: false
            referencedRelation: "clube_portais"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_salas: {
        Row: {
          created_at: string
          id: string
          portal_type: Database["public"]["Enums"]["portal_type"]
          sala_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          portal_type: Database["public"]["Enums"]["portal_type"]
          sala_id: string
        }
        Update: {
          created_at?: string
          id?: string
          portal_type?: Database["public"]["Enums"]["portal_type"]
          sala_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_salas_sala_id_fkey"
            columns: ["sala_id"]
            isOneToOne: false
            referencedRelation: "salas"
            referencedColumns: ["id"]
          },
        ]
      }
      post_session_closures: {
        Row: {
          case_id: string
          client_id: string
          created_at: string
          do_not_touch: string | null
          id: string
          left_open: string | null
          moved: string | null
          therapist_id: string
        }
        Insert: {
          case_id: string
          client_id: string
          created_at?: string
          do_not_touch?: string | null
          id?: string
          left_open?: string | null
          moved?: string | null
          therapist_id: string
        }
        Update: {
          case_id?: string
          client_id?: string
          created_at?: string
          do_not_touch?: string | null
          id?: string
          left_open?: string | null
          moved?: string | null
          therapist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_session_closures_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "session_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_session_closures_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_session_closures_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "v_formation_progress"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "post_session_closures_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_session_closures_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "v_formation_progress"
            referencedColumns: ["user_id"]
          },
        ]
      }
      posts_mentoria: {
        Row: {
          anexo_url: string | null
          caso_id: string | null
          created_at: string
          created_by: string | null
          data_evento: string | null
          id: string
          link_evento: string | null
          portal_minimo: Database["public"]["Enums"]["portal_type"]
          status: Database["public"]["Enums"]["post_status"]
          texto: string
          tipo: Database["public"]["Enums"]["mentoria_tipo"]
          titulo: string
          updated_at: string
        }
        Insert: {
          anexo_url?: string | null
          caso_id?: string | null
          created_at?: string
          created_by?: string | null
          data_evento?: string | null
          id?: string
          link_evento?: string | null
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          status?: Database["public"]["Enums"]["post_status"]
          texto: string
          tipo?: Database["public"]["Enums"]["mentoria_tipo"]
          titulo: string
          updated_at?: string
        }
        Update: {
          anexo_url?: string | null
          caso_id?: string | null
          created_at?: string
          created_by?: string | null
          data_evento?: string | null
          id?: string
          link_evento?: string | null
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          status?: Database["public"]["Enums"]["post_status"]
          texto?: string
          tipo?: Database["public"]["Enums"]["mentoria_tipo"]
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      praticas_mudra: {
        Row: {
          anotacoes_pratica: string | null
          client_id: string
          created_at: string
          data_pratica: string
          distrito_associado: string | null
          id: string
          mudra_nome: string
          therapist_id: string
        }
        Insert: {
          anotacoes_pratica?: string | null
          client_id: string
          created_at?: string
          data_pratica?: string
          distrito_associado?: string | null
          id?: string
          mudra_nome: string
          therapist_id: string
        }
        Update: {
          anotacoes_pratica?: string | null
          client_id?: string
          created_at?: string
          data_pratica?: string
          distrito_associado?: string | null
          id?: string
          mudra_nome?: string
          therapist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "praticas_mudra_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          access_expires_at: string | null
          access_status: string
          avatar_url: string | null
          created_at: string
          email: string | null
          entry_archetype: string | null
          entry_symbol: string | null
          formacao_oracula_concluida: boolean | null
          id: string
          is_professional_verified: boolean
          nome: string | null
          onboarding_completed: boolean
          portal: string | null
          role: string
          subscription_status: string | null
          supervisao_validada: boolean | null
          termo_etico_aceito: boolean | null
          updated_at: string
        }
        Insert: {
          access_expires_at?: string | null
          access_status?: string
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          entry_archetype?: string | null
          entry_symbol?: string | null
          formacao_oracula_concluida?: boolean | null
          id: string
          is_professional_verified?: boolean
          nome?: string | null
          onboarding_completed?: boolean
          portal?: string | null
          role?: string
          subscription_status?: string | null
          supervisao_validada?: boolean | null
          termo_etico_aceito?: boolean | null
          updated_at?: string
        }
        Update: {
          access_expires_at?: string | null
          access_status?: string
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          entry_archetype?: string | null
          entry_symbol?: string | null
          formacao_oracula_concluida?: boolean | null
          id?: string
          is_professional_verified?: boolean
          nome?: string | null
          onboarding_completed?: boolean
          portal?: string | null
          role?: string
          subscription_status?: string | null
          supervisao_validada?: boolean | null
          termo_etico_aceito?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      progresso_aluna: {
        Row: {
          completed_at: string | null
          created_at: string
          formacao_id: string
          id: string
          modulo_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          formacao_id: string
          id?: string
          modulo_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          formacao_id?: string
          id?: string
          modulo_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "progresso_aluna_formacao_id_fkey"
            columns: ["formacao_id"]
            isOneToOne: false
            referencedRelation: "formacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progresso_aluna_modulo_id_fkey"
            columns: ["modulo_id"]
            isOneToOne: false
            referencedRelation: "formacao_modulos"
            referencedColumns: ["id"]
          },
        ]
      }
      projetos_mestria: {
        Row: {
          arquivo_url: string | null
          avaliador_id: string | null
          course_id: string
          created_at: string | null
          descricao: string | null
          feedback: string | null
          id: string
          status: string
          titulo: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          arquivo_url?: string | null
          avaliador_id?: string | null
          course_id: string
          created_at?: string | null
          descricao?: string | null
          feedback?: string | null
          id?: string
          status?: string
          titulo: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          arquivo_url?: string | null
          avaliador_id?: string | null
          course_id?: string
          created_at?: string | null
          descricao?: string | null
          feedback?: string | null
          id?: string
          status?: string
          titulo?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projetos_mestria_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      protocolo_oracula: {
        Row: {
          caminho_registro_id: string | null
          cliente_id: string
          created_at: string
          id: string
          mapa_registro_id: string | null
          objetivo_terapeutico: string | null
          oraculo_registro_id: string | null
          proximos_passos: string | null
          session_case_id: string
          sintese_narrativa: string | null
          status: string
          terapeuta_id: string
          updated_at: string
        }
        Insert: {
          caminho_registro_id?: string | null
          cliente_id: string
          created_at?: string
          id?: string
          mapa_registro_id?: string | null
          objetivo_terapeutico?: string | null
          oraculo_registro_id?: string | null
          proximos_passos?: string | null
          session_case_id: string
          sintese_narrativa?: string | null
          status?: string
          terapeuta_id: string
          updated_at?: string
        }
        Update: {
          caminho_registro_id?: string | null
          cliente_id?: string
          created_at?: string
          id?: string
          mapa_registro_id?: string | null
          objetivo_terapeutico?: string | null
          oraculo_registro_id?: string | null
          proximos_passos?: string | null
          session_case_id?: string
          sintese_narrativa?: string | null
          status?: string
          terapeuta_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "protocolo_oracula_caminho_registro_id_fkey"
            columns: ["caminho_registro_id"]
            isOneToOne: false
            referencedRelation: "jornada_heroina_registros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "protocolo_oracula_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "protocolo_oracula_mapa_registro_id_fkey"
            columns: ["mapa_registro_id"]
            isOneToOne: false
            referencedRelation: "big5_symbolic_registros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "protocolo_oracula_oraculo_registro_id_fkey"
            columns: ["oraculo_registro_id"]
            isOneToOne: false
            referencedRelation: "eneagrama_feminino_registros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "protocolo_oracula_session_case_id_fkey"
            columns: ["session_case_id"]
            isOneToOne: false
            referencedRelation: "session_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          auth_key: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth_key: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth_key?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      quiz_opcoes: {
        Row: {
          categoria: string | null
          created_at: string
          id: string
          ordem: number
          pergunta_id: string
          texto: string
          valor_pontuacao: number
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          id?: string
          ordem?: number
          pergunta_id: string
          texto: string
          valor_pontuacao?: number
        }
        Update: {
          categoria?: string | null
          created_at?: string
          id?: string
          ordem?: number
          pergunta_id?: string
          texto?: string
          valor_pontuacao?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_opcoes_pergunta_id_fkey"
            columns: ["pergunta_id"]
            isOneToOne: false
            referencedRelation: "quiz_perguntas"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_perguntas: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          ordem: number
          quiz_id: string
          texto: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          ordem?: number
          quiz_id: string
          texto: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          ordem?: number
          quiz_id?: string
          texto?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_perguntas_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_respostas_usuario: {
        Row: {
          categoria_resultado: string | null
          completed_at: string
          created_at: string
          id: string
          pontuacao_total: number | null
          quiz_id: string
          respostas: Json | null
          resultado_id: string | null
          user_id: string
        }
        Insert: {
          categoria_resultado?: string | null
          completed_at?: string
          created_at?: string
          id?: string
          pontuacao_total?: number | null
          quiz_id: string
          respostas?: Json | null
          resultado_id?: string | null
          user_id: string
        }
        Update: {
          categoria_resultado?: string | null
          completed_at?: string
          created_at?: string
          id?: string
          pontuacao_total?: number | null
          quiz_id?: string
          respostas?: Json | null
          resultado_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_respostas_usuario_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_respostas_usuario_resultado_id_fkey"
            columns: ["resultado_id"]
            isOneToOne: false
            referencedRelation: "quiz_resultados"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_resultados: {
        Row: {
          agente_id: string | null
          audio_url: string | null
          categoria: string | null
          created_at: string
          cta_rota: string | null
          cta_texto: string | null
          id: string
          imagem_url: string | null
          ordem: number
          pontuacao_maxima: number | null
          pontuacao_minima: number | null
          quiz_id: string
          texto_interpretativo: string
          titulo_simbolico: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          agente_id?: string | null
          audio_url?: string | null
          categoria?: string | null
          created_at?: string
          cta_rota?: string | null
          cta_texto?: string | null
          id?: string
          imagem_url?: string | null
          ordem?: number
          pontuacao_maxima?: number | null
          pontuacao_minima?: number | null
          quiz_id: string
          texto_interpretativo: string
          titulo_simbolico: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          agente_id?: string | null
          audio_url?: string | null
          categoria?: string | null
          created_at?: string
          cta_rota?: string | null
          cta_texto?: string | null
          id?: string
          imagem_url?: string | null
          ordem?: number
          pontuacao_maxima?: number | null
          pontuacao_minima?: number | null
          quiz_id?: string
          texto_interpretativo?: string
          titulo_simbolico?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_resultados_agente_id_fkey"
            columns: ["agente_id"]
            isOneToOne: false
            referencedRelation: "agentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_resultados_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          ativo: boolean
          capa_url: string | null
          created_at: string
          descricao: string | null
          id: string
          portal_id: string | null
          sala_id: string | null
          slug: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          capa_url?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          portal_id?: string | null
          sala_id?: string | null
          slug?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          capa_url?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          portal_id?: string | null
          sala_id?: string | null
          slug?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_portal_id_fkey"
            columns: ["portal_id"]
            isOneToOne: false
            referencedRelation: "conteudo_travessias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_sala_id_fkey"
            columns: ["sala_id"]
            isOneToOne: false
            referencedRelation: "salas"
            referencedColumns: ["id"]
          },
        ]
      }
      radiestesia_config: {
        Row: {
          ativo: boolean | null
          chave: string
          id: string
          updated_at: string
          valor: Json | null
        }
        Insert: {
          ativo?: boolean | null
          chave: string
          id?: string
          updated_at?: string
          valor?: Json | null
        }
        Update: {
          ativo?: boolean | null
          chave?: string
          id?: string
          updated_at?: string
          valor?: Json | null
        }
        Relationships: []
      }
      radiestesia_cristais: {
        Row: {
          alerta_excesso: string | null
          ativo: boolean | null
          campos: string[] | null
          created_at: string
          estados: string[] | null
          explicacao_simbolica: string | null
          graficos_associados: string[] | null
          id: string
          imagem_url: string | null
          link_externo: string | null
          nome: string
          ordem: number | null
          quando_evitar: string | null
          quando_usar: string | null
          updated_at: string
        }
        Insert: {
          alerta_excesso?: string | null
          ativo?: boolean | null
          campos?: string[] | null
          created_at?: string
          estados?: string[] | null
          explicacao_simbolica?: string | null
          graficos_associados?: string[] | null
          id?: string
          imagem_url?: string | null
          link_externo?: string | null
          nome: string
          ordem?: number | null
          quando_evitar?: string | null
          quando_usar?: string | null
          updated_at?: string
        }
        Update: {
          alerta_excesso?: string | null
          ativo?: boolean | null
          campos?: string[] | null
          created_at?: string
          estados?: string[] | null
          explicacao_simbolica?: string | null
          graficos_associados?: string[] | null
          id?: string
          imagem_url?: string | null
          link_externo?: string | null
          nome?: string
          ordem?: number | null
          quando_evitar?: string | null
          quando_usar?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      radiestesia_graficos: {
        Row: {
          ativo: boolean | null
          autor: string | null
          categoria: string | null
          combinacoes: string[] | null
          como_usar: string | null
          created_at: string
          disponivel_loja: boolean | null
          erro_iniciante: string | null
          id: string
          imagem_fisica_url: string | null
          imagem_url: string | null
          link_loja: string | null
          nivel_intensidade: string | null
          nome: string
          observacao_etica: string | null
          observacoes_simbolicas: string | null
          ordem: number | null
          origem: string | null
          para_que_serve: string | null
          quando_nao_usar: string | null
          quando_usar: string | null
          slug: string | null
          tipo_acao: string | null
          tipo_leitura: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          autor?: string | null
          categoria?: string | null
          combinacoes?: string[] | null
          como_usar?: string | null
          created_at?: string
          disponivel_loja?: boolean | null
          erro_iniciante?: string | null
          id?: string
          imagem_fisica_url?: string | null
          imagem_url?: string | null
          link_loja?: string | null
          nivel_intensidade?: string | null
          nome: string
          observacao_etica?: string | null
          observacoes_simbolicas?: string | null
          ordem?: number | null
          origem?: string | null
          para_que_serve?: string | null
          quando_nao_usar?: string | null
          quando_usar?: string | null
          slug?: string | null
          tipo_acao?: string | null
          tipo_leitura?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          autor?: string | null
          categoria?: string | null
          combinacoes?: string[] | null
          como_usar?: string | null
          created_at?: string
          disponivel_loja?: boolean | null
          erro_iniciante?: string | null
          id?: string
          imagem_fisica_url?: string | null
          imagem_url?: string | null
          link_loja?: string | null
          nivel_intensidade?: string | null
          nome?: string
          observacao_etica?: string | null
          observacoes_simbolicas?: string | null
          ordem?: number | null
          origem?: string | null
          para_que_serve?: string | null
          quando_nao_usar?: string | null
          quando_usar?: string | null
          slug?: string | null
          tipo_acao?: string | null
          tipo_leitura?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reflexoes_jornada: {
        Row: {
          client_id: string
          created_at: string
          id: string
          texto: string
          therapist_id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          texto: string
          therapist_id: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          texto?: string
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reflexoes_jornada_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      relacionamentos_espelho: {
        Row: {
          client_id: string
          created_at: string
          id: string
          padrao_central: string | null
          padroes_recorrentes: string | null
          projecoes_json: Json
          qualidades_admiradas: Json
          qualidades_irritantes: Json
          reflexao_final: string | null
          relacionamentos_json: Json
          sintese_json: Json | null
          therapist_id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          padrao_central?: string | null
          padroes_recorrentes?: string | null
          projecoes_json?: Json
          qualidades_admiradas?: Json
          qualidades_irritantes?: Json
          reflexao_final?: string | null
          relacionamentos_json?: Json
          sintese_json?: Json | null
          therapist_id: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          padrao_central?: string | null
          padroes_recorrentes?: string | null
          projecoes_json?: Json
          qualidades_admiradas?: Json
          qualidades_irritantes?: Json
          reflexao_final?: string | null
          relacionamentos_json?: Json
          sintese_json?: Json | null
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "relacionamentos_espelho_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      respostas_exercicios: {
        Row: {
          campo_corporal: string | null
          created_at: string
          id: string
          pergunta_1: string | null
          pergunta_2: string | null
          pergunta_3: string | null
          sessao_id: string
        }
        Insert: {
          campo_corporal?: string | null
          created_at?: string
          id?: string
          pergunta_1?: string | null
          pergunta_2?: string | null
          pergunta_3?: string | null
          sessao_id: string
        }
        Update: {
          campo_corporal?: string | null
          created_at?: string
          id?: string
          pergunta_1?: string | null
          pergunta_2?: string | null
          pergunta_3?: string | null
          sessao_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "respostas_exercicios_sessao_id_fkey"
            columns: ["sessao_id"]
            isOneToOne: false
            referencedRelation: "sessoes_labirinto"
            referencedColumns: ["id"]
          },
        ]
      }
      rituais_integracao: {
        Row: {
          aprendizados_json: Json
          client_id: string
          compromisso: string | null
          created_at: string
          data_ritual: string | null
          elementos_ritual: Json
          id: string
          intencao: string | null
          o_que_deixo: string | null
          o_que_levo: string | null
          reflexao_final: string | null
          simbolo_transicao: string | null
          therapist_id: string
          updated_at: string
        }
        Insert: {
          aprendizados_json?: Json
          client_id: string
          compromisso?: string | null
          created_at?: string
          data_ritual?: string | null
          elementos_ritual?: Json
          id?: string
          intencao?: string | null
          o_que_deixo?: string | null
          o_que_levo?: string | null
          reflexao_final?: string | null
          simbolo_transicao?: string | null
          therapist_id: string
          updated_at?: string
        }
        Update: {
          aprendizados_json?: Json
          client_id?: string
          compromisso?: string | null
          created_at?: string
          data_ritual?: string | null
          elementos_ritual?: Json
          id?: string
          intencao?: string | null
          o_que_deixo?: string | null
          o_que_levo?: string | null
          reflexao_final?: string | null
          simbolo_transicao?: string | null
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rituais_integracao_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      rituais_simbolicos: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          duracao_segundos: number | null
          frase_unica: string | null
          id: string
          instrucao: string
          material: string | null
          nome: string
          observacoes_facilitadora: string | null
          ordem: number | null
          porta_associada: string | null
          silencio_obrigatorio: boolean | null
          slug: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          duracao_segundos?: number | null
          frase_unica?: string | null
          id?: string
          instrucao: string
          material?: string | null
          nome: string
          observacoes_facilitadora?: string | null
          ordem?: number | null
          porta_associada?: string | null
          silencio_obrigatorio?: boolean | null
          slug: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          duracao_segundos?: number | null
          frase_unica?: string | null
          id?: string
          instrucao?: string
          material?: string | null
          nome?: string
          observacoes_facilitadora?: string | null
          ordem?: number | null
          porta_associada?: string | null
          silencio_obrigatorio?: boolean | null
          slug?: string
        }
        Relationships: []
      }
      ritual_definitions: {
        Row: {
          ativo: boolean | null
          autoriza_acesso: boolean | null
          campos_reflexao: Json | null
          created_at: string
          descricao: string | null
          id: string
          microcopy: string | null
          nome: string
          ordem: number | null
          pergunta_compromisso: string | null
          texto_ritual: string
          tipo: Database["public"]["Enums"]["ritual_type"]
          trigger_context_id: string | null
          trigger_context_type: string | null
          trigger_event: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          autoriza_acesso?: boolean | null
          campos_reflexao?: Json | null
          created_at?: string
          descricao?: string | null
          id?: string
          microcopy?: string | null
          nome: string
          ordem?: number | null
          pergunta_compromisso?: string | null
          texto_ritual: string
          tipo: Database["public"]["Enums"]["ritual_type"]
          trigger_context_id?: string | null
          trigger_context_type?: string | null
          trigger_event: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          autoriza_acesso?: boolean | null
          campos_reflexao?: Json | null
          created_at?: string
          descricao?: string | null
          id?: string
          microcopy?: string | null
          nome?: string
          ordem?: number | null
          pergunta_compromisso?: string | null
          texto_ritual?: string
          tipo?: Database["public"]["Enums"]["ritual_type"]
          trigger_context_id?: string | null
          trigger_context_type?: string | null
          trigger_event?: string
          updated_at?: string
        }
        Relationships: []
      }
      ritual_passages: {
        Row: {
          admin_marked_by: string | null
          admin_note: string | null
          completed_at: string | null
          context_id: string | null
          context_type: string | null
          created_at: string
          id: string
          respostas: Json | null
          ritual_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["ritual_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_marked_by?: string | null
          admin_note?: string | null
          completed_at?: string | null
          context_id?: string | null
          context_type?: string | null
          created_at?: string
          id?: string
          respostas?: Json | null
          ritual_id: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["ritual_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_marked_by?: string | null
          admin_note?: string | null
          completed_at?: string | null
          context_id?: string | null
          context_type?: string | null
          created_at?: string
          id?: string
          respostas?: Json | null
          ritual_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["ritual_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ritual_passages_ritual_id_fkey"
            columns: ["ritual_id"]
            isOneToOne: false
            referencedRelation: "ritual_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      sala_ferramentas: {
        Row: {
          ativa: boolean
          bloco_interativo_requerido: boolean | null
          categoria_badge: string | null
          created_at: string
          familia_id: string | null
          familia_simbolica: string | null
          ferramenta_chave: string
          ferramenta_descricao: string | null
          ferramenta_nome: string
          finalidade_pratica: string | null
          has_blocks: boolean | null
          icone: string | null
          id: string
          modo_uso: string[] | null
          ordem: number
          origem_metodologica: string | null
          portal_id: string | null
          portal_minimo: Database["public"]["Enums"]["portal_type"] | null
          rota: string
          sala_id: string
          slug: string | null
          status_criacao: string | null
          texto_como_atravessar: string | null
          texto_o_que_sustenta: string | null
          texto_quando_usar: string | null
          tipo: string | null
          tipo_fechamento: string | null
          tipo_ferramenta: string | null
          updated_at: string
          vinculo_metodologico: string | null
        }
        Insert: {
          ativa?: boolean
          bloco_interativo_requerido?: boolean | null
          categoria_badge?: string | null
          created_at?: string
          familia_id?: string | null
          familia_simbolica?: string | null
          ferramenta_chave: string
          ferramenta_descricao?: string | null
          ferramenta_nome: string
          finalidade_pratica?: string | null
          has_blocks?: boolean | null
          icone?: string | null
          id?: string
          modo_uso?: string[] | null
          ordem?: number
          origem_metodologica?: string | null
          portal_id?: string | null
          portal_minimo?: Database["public"]["Enums"]["portal_type"] | null
          rota: string
          sala_id: string
          slug?: string | null
          status_criacao?: string | null
          texto_como_atravessar?: string | null
          texto_o_que_sustenta?: string | null
          texto_quando_usar?: string | null
          tipo?: string | null
          tipo_fechamento?: string | null
          tipo_ferramenta?: string | null
          updated_at?: string
          vinculo_metodologico?: string | null
        }
        Update: {
          ativa?: boolean
          bloco_interativo_requerido?: boolean | null
          categoria_badge?: string | null
          created_at?: string
          familia_id?: string | null
          familia_simbolica?: string | null
          ferramenta_chave?: string
          ferramenta_descricao?: string | null
          ferramenta_nome?: string
          finalidade_pratica?: string | null
          has_blocks?: boolean | null
          icone?: string | null
          id?: string
          modo_uso?: string[] | null
          ordem?: number
          origem_metodologica?: string | null
          portal_id?: string | null
          portal_minimo?: Database["public"]["Enums"]["portal_type"] | null
          rota?: string
          sala_id?: string
          slug?: string | null
          status_criacao?: string | null
          texto_como_atravessar?: string | null
          texto_o_que_sustenta?: string | null
          texto_quando_usar?: string | null
          tipo?: string | null
          tipo_fechamento?: string | null
          tipo_ferramenta?: string | null
          updated_at?: string
          vinculo_metodologico?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sala_ferramentas_familia_id_fkey"
            columns: ["familia_id"]
            isOneToOne: false
            referencedRelation: "travessia_familias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sala_ferramentas_portal_id_fkey"
            columns: ["portal_id"]
            isOneToOne: false
            referencedRelation: "conteudo_travessias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sala_ferramentas_sala_id_fkey"
            columns: ["sala_id"]
            isOneToOne: false
            referencedRelation: "salas"
            referencedColumns: ["id"]
          },
        ]
      }
      salas: {
        Row: {
          ativa: boolean
          created_at: string
          id: string
          nivel_minimo: Database["public"]["Enums"]["nivel_sala"]
          nome_exibicao: string
          ordem: number
          texto_bloqueio: string
          texto_entrada: string
          updated_at: string
        }
        Insert: {
          ativa?: boolean
          created_at?: string
          id?: string
          nivel_minimo?: Database["public"]["Enums"]["nivel_sala"]
          nome_exibicao: string
          ordem?: number
          texto_bloqueio?: string
          texto_entrada?: string
          updated_at?: string
        }
        Update: {
          ativa?: boolean
          created_at?: string
          id?: string
          nivel_minimo?: Database["public"]["Enums"]["nivel_sala"]
          nome_exibicao?: string
          ordem?: number
          texto_bloqueio?: string
          texto_entrada?: string
          updated_at?: string
        }
        Relationships: []
      }
      season_books: {
        Row: {
          book_id: string
          created_at: string
          id: string
          season_id: string
          tipo: string
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: string
          season_id: string
          tipo?: string
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: string
          season_id?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "season_books_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "clube_livro_ciclos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "season_books_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "oracular_seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      season_labs: {
        Row: {
          arquetipo_central: string | null
          aula_objetivo: string | null
          aula_pergunta_fechamento: string | null
          aula_vivencia: string | null
          ciclo_id: string | null
          created_at: string
          essencia_transformadora: string | null
          id: string
          imagem_organizadora: string | null
          nucleo_vivo: string | null
          palestra_chamada: string | null
          palestra_encerramento: string | null
          palestra_imagem: string | null
          palestra_narrativa: string | null
          pergunta_aplicacao_1: string | null
          pergunta_aplicacao_2: string | null
          season_id: string | null
          sessao_cuidado_etico: string | null
          sessao_pergunta_acesso: string | null
          sessao_resistencia: string | null
          sessao_tema: string | null
          tensao_central: string | null
          traducao_aula: string | null
          traducao_circulo: string | null
          traducao_sessao: string | null
          transformacao_exigida: string | null
          updated_at: string
        }
        Insert: {
          arquetipo_central?: string | null
          aula_objetivo?: string | null
          aula_pergunta_fechamento?: string | null
          aula_vivencia?: string | null
          ciclo_id?: string | null
          created_at?: string
          essencia_transformadora?: string | null
          id?: string
          imagem_organizadora?: string | null
          nucleo_vivo?: string | null
          palestra_chamada?: string | null
          palestra_encerramento?: string | null
          palestra_imagem?: string | null
          palestra_narrativa?: string | null
          pergunta_aplicacao_1?: string | null
          pergunta_aplicacao_2?: string | null
          season_id?: string | null
          sessao_cuidado_etico?: string | null
          sessao_pergunta_acesso?: string | null
          sessao_resistencia?: string | null
          sessao_tema?: string | null
          tensao_central?: string | null
          traducao_aula?: string | null
          traducao_circulo?: string | null
          traducao_sessao?: string | null
          transformacao_exigida?: string | null
          updated_at?: string
        }
        Update: {
          arquetipo_central?: string | null
          aula_objetivo?: string | null
          aula_pergunta_fechamento?: string | null
          aula_vivencia?: string | null
          ciclo_id?: string | null
          created_at?: string
          essencia_transformadora?: string | null
          id?: string
          imagem_organizadora?: string | null
          nucleo_vivo?: string | null
          palestra_chamada?: string | null
          palestra_encerramento?: string | null
          palestra_imagem?: string | null
          palestra_narrativa?: string | null
          pergunta_aplicacao_1?: string | null
          pergunta_aplicacao_2?: string | null
          season_id?: string | null
          sessao_cuidado_etico?: string | null
          sessao_pergunta_acesso?: string | null
          sessao_resistencia?: string | null
          sessao_tema?: string | null
          tensao_central?: string | null
          traducao_aula?: string | null
          traducao_circulo?: string | null
          traducao_sessao?: string | null
          transformacao_exigida?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "season_labs_ciclo_id_fkey"
            columns: ["ciclo_id"]
            isOneToOne: true
            referencedRelation: "clube_livro_ciclos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "season_labs_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: true
            referencedRelation: "oracular_seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      session_archetypes: {
        Row: {
          archetype_id: string
          client_id: string
          created_at: string
          id: string
          notes: string | null
          session_id: string
        }
        Insert: {
          archetype_id: string
          client_id: string
          created_at?: string
          id?: string
          notes?: string | null
          session_id: string
        }
        Update: {
          archetype_id?: string
          client_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_archetypes_archetype_id_fkey"
            columns: ["archetype_id"]
            isOneToOne: false
            referencedRelation: "atlas_arquetipos_femininos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_archetypes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_archetypes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_cases: {
        Row: {
          client_id: string
          created_at: string
          id: string
          status: string
          therapist_id: string
          title: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          status?: string
          therapist_id: string
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          status?: string
          therapist_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_cases_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_cases_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_cases_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "v_formation_progress"
            referencedColumns: ["user_id"]
          },
        ]
      }
      session_interventions: {
        Row: {
          created_at: string
          id: string
          intervention_id: string
          session_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          intervention_id: string
          session_id: string
        }
        Update: {
          created_at?: string
          id?: string
          intervention_id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_interventions_intervention_id_fkey"
            columns: ["intervention_id"]
            isOneToOne: false
            referencedRelation: "interventions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_interventions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_oracle_draws: {
        Row: {
          axis_archetype: string | null
          axis_movement: string | null
          axis_narrative: string | null
          case_id: string | null
          client_id: string | null
          created_at: string
          id: string
          mediator_symbol: string | null
          mode: string
          notes: string | null
          oracle_image: string | null
          suggested_rite: string | null
          therapist_id: string
        }
        Insert: {
          axis_archetype?: string | null
          axis_movement?: string | null
          axis_narrative?: string | null
          case_id?: string | null
          client_id?: string | null
          created_at?: string
          id?: string
          mediator_symbol?: string | null
          mode: string
          notes?: string | null
          oracle_image?: string | null
          suggested_rite?: string | null
          therapist_id: string
        }
        Update: {
          axis_archetype?: string | null
          axis_movement?: string | null
          axis_narrative?: string | null
          case_id?: string | null
          client_id?: string | null
          created_at?: string
          id?: string
          mediator_symbol?: string | null
          mode?: string
          notes?: string | null
          oracle_image?: string | null
          suggested_rite?: string | null
          therapist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_oracle_draws_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "session_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_oracle_draws_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_oracle_draws_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "v_formation_progress"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "session_oracle_draws_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_oracle_draws_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "v_formation_progress"
            referencedColumns: ["user_id"]
          },
        ]
      }
      session_scripts: {
        Row: {
          case_id: string
          client_id: string
          closing_leave_open: string | null
          closing_name: string | null
          closing_seal: string | null
          created_at: string
          exploration_questions: string | null
          id: string
          intervention_prompt: string | null
          intervention_type: string | null
          narrative_map_id: string | null
          opening_gesture: string | null
          opening_question: string | null
          therapist_id: string
          updated_at: string
        }
        Insert: {
          case_id: string
          client_id: string
          closing_leave_open?: string | null
          closing_name?: string | null
          closing_seal?: string | null
          created_at?: string
          exploration_questions?: string | null
          id?: string
          intervention_prompt?: string | null
          intervention_type?: string | null
          narrative_map_id?: string | null
          opening_gesture?: string | null
          opening_question?: string | null
          therapist_id: string
          updated_at?: string
        }
        Update: {
          case_id?: string
          client_id?: string
          closing_leave_open?: string | null
          closing_name?: string | null
          closing_seal?: string | null
          created_at?: string
          exploration_questions?: string | null
          id?: string
          intervention_prompt?: string | null
          intervention_type?: string | null
          narrative_map_id?: string | null
          opening_gesture?: string | null
          opening_question?: string | null
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_scripts_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "session_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_scripts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_scripts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "v_formation_progress"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "session_scripts_narrative_map_id_fkey"
            columns: ["narrative_map_id"]
            isOneToOne: false
            referencedRelation: "narrative_maps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_scripts_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_scripts_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "v_formation_progress"
            referencedColumns: ["user_id"]
          },
        ]
      }
      sessions: {
        Row: {
          checkin_notes: string | null
          checkin_state: string | null
          cidadela_card_id: string | null
          client_id: string
          created_at: string
          date: string
          district_id: string | null
          gps_suggestion_json: Json | null
          id: string
          insight: string | null
          notes: string | null
          oracle_card_id: string | null
          task: string | null
          tool_id: string | null
          updated_at: string
          used_intervention_ids: string[] | null
          user_id: string
        }
        Insert: {
          checkin_notes?: string | null
          checkin_state?: string | null
          cidadela_card_id?: string | null
          client_id: string
          created_at?: string
          date?: string
          district_id?: string | null
          gps_suggestion_json?: Json | null
          id?: string
          insight?: string | null
          notes?: string | null
          oracle_card_id?: string | null
          task?: string | null
          tool_id?: string | null
          updated_at?: string
          used_intervention_ids?: string[] | null
          user_id?: string
        }
        Update: {
          checkin_notes?: string | null
          checkin_state?: string | null
          cidadela_card_id?: string | null
          client_id?: string
          created_at?: string
          date?: string
          district_id?: string | null
          gps_suggestion_json?: Json | null
          id?: string
          insight?: string | null
          notes?: string | null
          oracle_card_id?: string | null
          task?: string | null
          tool_id?: string | null
          updated_at?: string
          used_intervention_ids?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_cidadela_card_id_fkey"
            columns: ["cidadela_card_id"]
            isOneToOne: false
            referencedRelation: "cidadela_oracle_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_oracle_card_id_fkey"
            columns: ["oracle_card_id"]
            isOneToOne: false
            referencedRelation: "oracle_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      sessoes_casa_maquinas: {
        Row: {
          cliente_id: string
          created_at: string
          data_sessao: string
          id: string
          movimento_percebido: Database["public"]["Enums"]["movimento_percebido"]
          nota_breve: string | null
          owner_id: string
          updated_at: string
        }
        Insert: {
          cliente_id: string
          created_at?: string
          data_sessao?: string
          id?: string
          movimento_percebido?: Database["public"]["Enums"]["movimento_percebido"]
          nota_breve?: string | null
          owner_id: string
          updated_at?: string
        }
        Update: {
          cliente_id?: string
          created_at?: string
          data_sessao?: string
          id?: string
          movimento_percebido?: Database["public"]["Enums"]["movimento_percebido"]
          nota_breve?: string | null
          owner_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessoes_casa_maquinas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      sessoes_labirinto: {
        Row: {
          cliente_nome: string | null
          concluida: boolean
          created_at: string
          data_sessao: string
          direcionamento_terapeutico: string | null
          emocao_dominante: string | null
          hipotese_terapeutica: string | null
          id: string
          micro_acao_definida: string | null
          modo: string
          observacoes_clinicas: string | null
          padrao_defensivo: string | null
          porta_id: string | null
          registro_acao: string | null
          registro_percepcao: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cliente_nome?: string | null
          concluida?: boolean
          created_at?: string
          data_sessao?: string
          direcionamento_terapeutico?: string | null
          emocao_dominante?: string | null
          hipotese_terapeutica?: string | null
          id?: string
          micro_acao_definida?: string | null
          modo?: string
          observacoes_clinicas?: string | null
          padrao_defensivo?: string | null
          porta_id?: string | null
          registro_acao?: string | null
          registro_percepcao?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cliente_nome?: string | null
          concluida?: boolean
          created_at?: string
          data_sessao?: string
          direcionamento_terapeutico?: string | null
          emocao_dominante?: string | null
          hipotese_terapeutica?: string | null
          id?: string
          micro_acao_definida?: string | null
          modo?: string
          observacoes_clinicas?: string | null
          padrao_defensivo?: string | null
          porta_id?: string | null
          registro_acao?: string | null
          registro_percepcao?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessoes_labirinto_porta_id_fkey"
            columns: ["porta_id"]
            isOneToOne: false
            referencedRelation: "labirinto_fases"
            referencedColumns: ["id"]
          },
        ]
      }
      simulador_cenarios: {
        Row: {
          ativo: boolean | null
          contexto: string
          created_at: string | null
          id: string
          nivel: string
          ordem: number | null
          passos_json: Json
          titulo: string
        }
        Insert: {
          ativo?: boolean | null
          contexto: string
          created_at?: string | null
          id?: string
          nivel?: string
          ordem?: number | null
          passos_json?: Json
          titulo: string
        }
        Update: {
          ativo?: boolean | null
          contexto?: string
          created_at?: string | null
          id?: string
          nivel?: string
          ordem?: number | null
          passos_json?: Json
          titulo?: string
        }
        Relationships: []
      }
      simulador_progresso: {
        Row: {
          cenario_id: string
          concluido: boolean | null
          created_at: string | null
          id: string
          pontuacao: number | null
          respostas_json: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cenario_id: string
          concluido?: boolean | null
          created_at?: string | null
          id?: string
          pontuacao?: number | null
          respostas_json?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cenario_id?: string
          concluido?: boolean | null
          created_at?: string | null
          id?: string
          pontuacao?: number | null
          respostas_json?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "simulador_progresso_cenario_id_fkey"
            columns: ["cenario_id"]
            isOneToOne: false
            referencedRelation: "simulador_cenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      sonho_estruturado: {
        Row: {
          amplificacao_arquetipica: Json | null
          amplificacao_pessoal: Json | null
          cliente_id: string
          created_at: string
          emocao_predominante: string | null
          id: string
          imagens_principais: string | null
          pergunta_compensar: string | null
          pergunta_conselho: string | null
          pergunta_perspectiva: string | null
          resposta_ao_sonho: string | null
          sensacao_corporal: string | null
          therapist_id: string
          updated_at: string
        }
        Insert: {
          amplificacao_arquetipica?: Json | null
          amplificacao_pessoal?: Json | null
          cliente_id: string
          created_at?: string
          emocao_predominante?: string | null
          id?: string
          imagens_principais?: string | null
          pergunta_compensar?: string | null
          pergunta_conselho?: string | null
          pergunta_perspectiva?: string | null
          resposta_ao_sonho?: string | null
          sensacao_corporal?: string | null
          therapist_id: string
          updated_at?: string
        }
        Update: {
          amplificacao_arquetipica?: Json | null
          amplificacao_pessoal?: Json | null
          cliente_id?: string
          created_at?: string
          emocao_predominante?: string | null
          id?: string
          imagens_principais?: string | null
          pergunta_compensar?: string | null
          pergunta_conselho?: string | null
          pergunta_perspectiva?: string | null
          resposta_ao_sonho?: string | null
          sensacao_corporal?: string | null
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sonho_estruturado_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      sonhos_cabalisticos: {
        Row: {
          client_id: string
          created_at: string
          data_registro: string
          descricao_sonho: string
          distritos_relacionados: string[] | null
          id: string
          interpretacao_ia: string | null
          labirintos_potenciais: string[] | null
          praticas_sugeridas: string[] | null
          simbolos_chave: string[]
          therapist_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          data_registro?: string
          descricao_sonho: string
          distritos_relacionados?: string[] | null
          id?: string
          interpretacao_ia?: string | null
          labirintos_potenciais?: string[] | null
          praticas_sugeridas?: string[] | null
          simbolos_chave?: string[]
          therapist_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          data_registro?: string
          descricao_sonho?: string
          distritos_relacionados?: string[] | null
          id?: string
          interpretacao_ia?: string | null
          labirintos_potenciais?: string[] | null
          praticas_sugeridas?: string[] | null
          simbolos_chave?: string[]
          therapist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sonhos_cabalisticos_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      station_progress: {
        Row: {
          created_at: string
          id: string
          last_activity_at: string
          station_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_activity_at?: string
          station_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_activity_at?: string
          station_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "station_progress_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "clube_estacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      studio_episodes: {
        Row: {
          audio_final_url: string | null
          audio_full_url: string | null
          audio_narradora_url: string | null
          audio_oracular_url: string | null
          audio_public_url: string | null
          capitulo: string
          ciclo_id: string | null
          created_at: string
          created_by: string | null
          descricao: string | null
          duracao_segundos: number | null
          eixo_id: string | null
          fade_in_seconds: number | null
          fade_out_seconds: number | null
          formato: string
          id: string
          imagem_capa_url: string | null
          intencao_terapeutica: string
          livro: string
          published_at: string | null
          roteiro_completo: string | null
          status: Database["public"]["Enums"]["studio_episode_status"]
          texto_base: string
          tipo_episodio: string
          titulo: string | null
          trilha_ativa: boolean | null
          trilha_fundo_url: string | null
          trilha_volume: number | null
          updated_at: string
          versao_resumida: string | null
          vinheta_abertura_url: string | null
          vinheta_encerramento_url: string | null
          visibility: Database["public"]["Enums"]["studio_episode_visibility"]
          voz_escolhida: string | null
        }
        Insert: {
          audio_final_url?: string | null
          audio_full_url?: string | null
          audio_narradora_url?: string | null
          audio_oracular_url?: string | null
          audio_public_url?: string | null
          capitulo?: string
          ciclo_id?: string | null
          created_at?: string
          created_by?: string | null
          descricao?: string | null
          duracao_segundos?: number | null
          eixo_id?: string | null
          fade_in_seconds?: number | null
          fade_out_seconds?: number | null
          formato?: string
          id?: string
          imagem_capa_url?: string | null
          intencao_terapeutica?: string
          livro: string
          published_at?: string | null
          roteiro_completo?: string | null
          status?: Database["public"]["Enums"]["studio_episode_status"]
          texto_base?: string
          tipo_episodio?: string
          titulo?: string | null
          trilha_ativa?: boolean | null
          trilha_fundo_url?: string | null
          trilha_volume?: number | null
          updated_at?: string
          versao_resumida?: string | null
          vinheta_abertura_url?: string | null
          vinheta_encerramento_url?: string | null
          visibility?: Database["public"]["Enums"]["studio_episode_visibility"]
          voz_escolhida?: string | null
        }
        Update: {
          audio_final_url?: string | null
          audio_full_url?: string | null
          audio_narradora_url?: string | null
          audio_oracular_url?: string | null
          audio_public_url?: string | null
          capitulo?: string
          ciclo_id?: string | null
          created_at?: string
          created_by?: string | null
          descricao?: string | null
          duracao_segundos?: number | null
          eixo_id?: string | null
          fade_in_seconds?: number | null
          fade_out_seconds?: number | null
          formato?: string
          id?: string
          imagem_capa_url?: string | null
          intencao_terapeutica?: string
          livro?: string
          published_at?: string | null
          roteiro_completo?: string | null
          status?: Database["public"]["Enums"]["studio_episode_status"]
          texto_base?: string
          tipo_episodio?: string
          titulo?: string | null
          trilha_ativa?: boolean | null
          trilha_fundo_url?: string | null
          trilha_volume?: number | null
          updated_at?: string
          versao_resumida?: string | null
          vinheta_abertura_url?: string | null
          vinheta_encerramento_url?: string | null
          visibility?: Database["public"]["Enums"]["studio_episode_visibility"]
          voz_escolhida?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "studio_episodes_ciclo_id_fkey"
            columns: ["ciclo_id"]
            isOneToOne: false
            referencedRelation: "clube_livro_ciclos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "studio_episodes_eixo_id_fkey"
            columns: ["eixo_id"]
            isOneToOne: false
            referencedRelation: "studio_method_axes"
            referencedColumns: ["id"]
          },
        ]
      }
      studio_method_axes: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string
          id: string
          instrucao_especifica: string
          nome: string
          ordem: number
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string
          id?: string
          instrucao_especifica?: string
          nome: string
          ordem?: number
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string
          id?: string
          instrucao_especifica?: string
          nome?: string
          ordem?: number
          updated_at?: string
        }
        Relationships: []
      }
      studio_method_blocks: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          instrucao: string
          nome: string
          ordem: number
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          instrucao?: string
          nome: string
          ordem?: number
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          instrucao?: string
          nome?: string
          ordem?: number
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          external_subscription_id: string | null
          id: string
          last_event_at: string | null
          next_billing_date: string | null
          plan_id: string | null
          provider: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          external_subscription_id?: string | null
          id?: string
          last_event_at?: string | null
          next_billing_date?: string | null
          plan_id?: string | null
          provider?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          external_subscription_id?: string | null
          id?: string
          last_event_at?: string | null
          next_billing_date?: string | null
          plan_id?: string | null
          provider?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      symbolic_insights: {
        Row: {
          created_at: string
          generated_for_range: string
          id: string
          insights_json: Json
          scope_id: string
          scope_type: Database["public"]["Enums"]["pattern_scope_type"]
        }
        Insert: {
          created_at?: string
          generated_for_range: string
          id?: string
          insights_json?: Json
          scope_id: string
          scope_type?: Database["public"]["Enums"]["pattern_scope_type"]
        }
        Update: {
          created_at?: string
          generated_for_range?: string
          id?: string
          insights_json?: Json
          scope_id?: string
          scope_type?: Database["public"]["Enums"]["pattern_scope_type"]
        }
        Relationships: []
      }
      symbolic_template_sessions: {
        Row: {
          case_id: string | null
          cliente_id: string | null
          created_at: string
          id: string
          notes: Json | null
          sections: Json
          template_type: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          case_id?: string | null
          cliente_id?: string | null
          created_at?: string
          id?: string
          notes?: Json | null
          sections?: Json
          template_type: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          case_id?: string | null
          cliente_id?: string | null
          created_at?: string
          id?: string
          notes?: Json | null
          sections?: Json
          template_type?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "symbolic_template_sessions_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "session_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "symbolic_template_sessions_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      syntheia_conversations: {
        Row: {
          context_data: Json | null
          created_at: string
          id: string
          mode_id: string | null
          title: string | null
          updated_at: string
          user_id: string
          voice_id: string | null
        }
        Insert: {
          context_data?: Json | null
          created_at?: string
          id?: string
          mode_id?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
          voice_id?: string | null
        }
        Update: {
          context_data?: Json | null
          created_at?: string
          id?: string
          mode_id?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
          voice_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "syntheia_conversations_mode_id_fkey"
            columns: ["mode_id"]
            isOneToOne: false
            referencedRelation: "syntheia_modes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "syntheia_conversations_voice_id_fkey"
            columns: ["voice_id"]
            isOneToOne: false
            referencedRelation: "syntheia_voices"
            referencedColumns: ["id"]
          },
        ]
      }
      syntheia_creations: {
        Row: {
          chave_simbolica: string | null
          created_at: string
          estrutura_pratica: string | null
          fechamento_integracao: string | null
          id: string
          intencao_terapeutica: string | null
          momento_jornada: string
          publico_alvo: string
          suporte_linguagem: string | null
          tags: string[] | null
          tema_principal: string
          tempo_disponivel: string
          tipo: string
          titulo: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          chave_simbolica?: string | null
          created_at?: string
          estrutura_pratica?: string | null
          fechamento_integracao?: string | null
          id?: string
          intencao_terapeutica?: string | null
          momento_jornada: string
          publico_alvo: string
          suporte_linguagem?: string | null
          tags?: string[] | null
          tema_principal: string
          tempo_disponivel: string
          tipo: string
          titulo?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          chave_simbolica?: string | null
          created_at?: string
          estrutura_pratica?: string | null
          fechamento_integracao?: string | null
          id?: string
          intencao_terapeutica?: string | null
          momento_jornada?: string
          publico_alvo?: string
          suporte_linguagem?: string | null
          tags?: string[] | null
          tema_principal?: string
          tempo_disponivel?: string
          tipo?: string
          titulo?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      syntheia_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
          tokens_used: number | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
          tokens_used?: number | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
          tokens_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "syntheia_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "syntheia_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      syntheia_modes: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          icon: string | null
          id: string
          ordem: number | null
          system_prompt: string
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          icon?: string | null
          id: string
          ordem?: number | null
          system_prompt: string
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          ordem?: number | null
          system_prompt?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      syntheia_voices: {
        Row: {
          active: boolean
          created_at: string
          id: string
          ordem: number | null
          title: string
          trigger_context: Json | null
          type: string
          updated_at: string
          voice_prompt: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          ordem?: number | null
          title: string
          trigger_context?: Json | null
          type: string
          updated_at?: string
          voice_prompt: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          ordem?: number | null
          title?: string
          trigger_context?: Json | null
          type?: string
          updated_at?: string
          voice_prompt?: string
        }
        Relationships: []
      }
      tecela_casos_espelho: {
        Row: {
          alerta_etico: string | null
          aprovado: boolean
          contexto_anonimizado: string
          created_at: string
          created_by: string
          demanda_simbolica: string
          district_id: string | null
          erro_evitar: string | null
          id: string
          leitura_oracula: string | null
          resultado: string | null
          tags: string[] | null
          titulo: string
          updated_at: string
        }
        Insert: {
          alerta_etico?: string | null
          aprovado?: boolean
          contexto_anonimizado: string
          created_at?: string
          created_by: string
          demanda_simbolica: string
          district_id?: string | null
          erro_evitar?: string | null
          id?: string
          leitura_oracula?: string | null
          resultado?: string | null
          tags?: string[] | null
          titulo: string
          updated_at?: string
        }
        Update: {
          alerta_etico?: string | null
          aprovado?: boolean
          contexto_anonimizado?: string
          created_at?: string
          created_by?: string
          demanda_simbolica?: string
          district_id?: string | null
          erro_evitar?: string | null
          id?: string
          leitura_oracula?: string | null
          resultado?: string | null
          tags?: string[] | null
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      tecela_comentarios: {
        Row: {
          autor_id: string
          conteudo: string
          created_at: string
          id: string
          ref_id: string
          ref_type: string
        }
        Insert: {
          autor_id: string
          conteudo: string
          created_at?: string
          id?: string
          ref_id: string
          ref_type: string
        }
        Update: {
          autor_id?: string
          conteudo?: string
          created_at?: string
          id?: string
          ref_id?: string
          ref_type?: string
        }
        Relationships: []
      }
      tecela_favoritos: {
        Row: {
          created_at: string
          id: string
          ref_id: string
          ref_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ref_id: string
          ref_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ref_id?: string
          ref_type?: string
          user_id?: string
        }
        Relationships: []
      }
      tecela_intervencoes: {
        Row: {
          aprovado: boolean
          conteudo: string
          contraindicacoes: string | null
          created_at: string
          created_by: string
          district_id: string | null
          id: string
          nivel: string
          tags: string[] | null
          tipo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          aprovado?: boolean
          conteudo: string
          contraindicacoes?: string | null
          created_at?: string
          created_by: string
          district_id?: string | null
          id?: string
          nivel?: string
          tags?: string[] | null
          tipo?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          aprovado?: boolean
          conteudo?: string
          contraindicacoes?: string | null
          created_at?: string
          created_by?: string
          district_id?: string | null
          id?: string
          nivel?: string
          tags?: string[] | null
          tipo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      tecela_supervisoes: {
        Row: {
          caso_id: string | null
          created_at: string
          created_by: string
          data_evento: string
          descricao: string | null
          id: string
          link_ao_vivo: string | null
          link_replay: string | null
          status: string
          tema: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          caso_id?: string | null
          created_at?: string
          created_by: string
          data_evento: string
          descricao?: string | null
          id?: string
          link_ao_vivo?: string | null
          link_replay?: string | null
          status?: string
          tema?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          caso_id?: string | null
          created_at?: string
          created_by?: string
          data_evento?: string
          descricao?: string | null
          id?: string
          link_ao_vivo?: string | null
          link_replay?: string | null
          status?: string
          tema?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tecela_supervisoes_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "tecela_casos_espelho"
            referencedColumns: ["id"]
          },
        ]
      }
      tecela_tramas: {
        Row: {
          created_at: string
          created_by: string
          district_id: string | null
          id: string
          month: string
          objective: string | null
          pinned: boolean
          prompt: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          district_id?: string | null
          id?: string
          month: string
          objective?: string | null
          pinned?: boolean
          prompt?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          district_id?: string | null
          id?: string
          month?: string
          objective?: string | null
          pinned?: boolean
          prompt?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      templates: {
        Row: {
          action_prompt: string
          ativo: boolean | null
          created_at: string | null
          id: string
          is_default: boolean | null
          name: string
          system_prompt: string
          updated_at: string | null
          version: string | null
        }
        Insert: {
          action_prompt: string
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          system_prompt: string
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          action_prompt?: string
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          system_prompt?: string
          updated_at?: string | null
          version?: string | null
        }
        Relationships: []
      }
      text_models: {
        Row: {
          ativo: boolean | null
          categoria: string
          chave: string
          conteudo: string
          created_at: string
          id: string
          scope: string | null
          scope_id: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          categoria?: string
          chave: string
          conteudo: string
          created_at?: string
          id?: string
          scope?: string | null
          scope_id?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          categoria?: string
          chave?: string
          conteudo?: string
          created_at?: string
          id?: string
          scope?: string | null
          scope_id?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      therapeutic_groups: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          nome: string
          status: string
          therapist_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          status?: string
          therapist_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          status?: string
          therapist_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      therapy_groups: {
        Row: {
          created_at: string
          id: string
          name: string
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tools: {
        Row: {
          ativa: boolean | null
          created_at: string
          descricao: string | null
          district_id: string | null
          icone: string | null
          id: string
          nome: string
          ordem: number | null
          rota: string | null
          tipo: string | null
        }
        Insert: {
          ativa?: boolean | null
          created_at?: string
          descricao?: string | null
          district_id?: string | null
          icone?: string | null
          id?: string
          nome: string
          ordem?: number | null
          rota?: string | null
          tipo?: string | null
        }
        Update: {
          ativa?: boolean | null
          created_at?: string
          descricao?: string | null
          district_id?: string | null
          icone?: string | null
          id?: string
          nome?: string
          ordem?: number | null
          rota?: string | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tools_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      torre_arquetipo_sugestao: {
        Row: {
          arquetipo_id: string | null
          frequencia: string | null
          id: string
          nota_clinica: string | null
          ordem: number | null
          torre_id: string
        }
        Insert: {
          arquetipo_id?: string | null
          frequencia?: string | null
          id?: string
          nota_clinica?: string | null
          ordem?: number | null
          torre_id: string
        }
        Update: {
          arquetipo_id?: string | null
          frequencia?: string | null
          id?: string
          nota_clinica?: string | null
          ordem?: number | null
          torre_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "torre_arquetipo_sugestao_arquetipo_id_fkey"
            columns: ["arquetipo_id"]
            isOneToOne: false
            referencedRelation: "atlas_arquetipos_femininos"
            referencedColumns: ["id"]
          },
        ]
      }
      torre_casos_clinicos: {
        Row: {
          ativa: boolean | null
          cena: string
          created_at: string | null
          id: string
          leitura_com_torre: string
          leitura_sem_torre: string
          porta_ativa_nome: string
          resultado: string
          torre_id: string
          updated_at: string | null
        }
        Insert: {
          ativa?: boolean | null
          cena: string
          created_at?: string | null
          id?: string
          leitura_com_torre: string
          leitura_sem_torre: string
          porta_ativa_nome: string
          resultado: string
          torre_id: string
          updated_at?: string | null
        }
        Update: {
          ativa?: boolean | null
          cena?: string
          created_at?: string | null
          id?: string
          leitura_com_torre?: string
          leitura_sem_torre?: string
          porta_ativa_nome?: string
          resultado?: string
          torre_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      torre_porta_relacao: {
        Row: {
          ajuste_com_torre: string | null
          created_at: string | null
          frequencia: string | null
          id: string
          natureza_porta: string | null
          ordem: number | null
          porta_id: string | null
          risco_conducao: string | null
          torre_id: string
          updated_at: string | null
        }
        Insert: {
          ajuste_com_torre?: string | null
          created_at?: string | null
          frequencia?: string | null
          id?: string
          natureza_porta?: string | null
          ordem?: number | null
          porta_id?: string | null
          risco_conducao?: string | null
          torre_id: string
          updated_at?: string | null
        }
        Update: {
          ajuste_com_torre?: string | null
          created_at?: string | null
          frequencia?: string | null
          id?: string
          natureza_porta?: string | null
          ordem?: number | null
          porta_id?: string | null
          risco_conducao?: string | null
          torre_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "torre_porta_relacao_porta_id_fkey"
            columns: ["porta_id"]
            isOneToOne: false
            referencedRelation: "labirinto_portas"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_sections: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao: string | null
          icone: string | null
          id: string
          imagem_url: string | null
          ordem: number | null
          secao_key: string
          subtitulo: string | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          icone?: string | null
          id?: string
          imagem_url?: string | null
          ordem?: number | null
          secao_key: string
          subtitulo?: string | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          icone?: string | null
          id?: string
          imagem_url?: string | null
          ordem?: number | null
          secao_key?: string
          subtitulo?: string | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      towers: {
        Row: {
          client_id: string
          clinical_posture: string | null
          created_at: string
          date: string
          id: string
          notes: string | null
          session_id: string | null
          tower_primary: string | null
          tower_secondary: string | null
        }
        Insert: {
          client_id: string
          clinical_posture?: string | null
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          session_id?: string | null
          tower_primary?: string | null
          tower_secondary?: string | null
        }
        Update: {
          client_id?: string
          clinical_posture?: string | null
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          session_id?: string | null
          tower_primary?: string | null
          tower_secondary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "towers_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "towers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      travessia_comentarios: {
        Row: {
          conteudo: string
          created_at: string
          id: string
          travessia_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          conteudo: string
          created_at?: string
          id?: string
          travessia_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          conteudo?: string
          created_at?: string
          id?: string
          travessia_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "travessia_comentarios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "travessia_comentarios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_formation_progress"
            referencedColumns: ["user_id"]
          },
        ]
      }
      travessia_day_unlocks: {
        Row: {
          aula_id: string
          created_at: string
          first_accessed_at: string
          id: string
          user_id: string
        }
        Insert: {
          aula_id: string
          created_at?: string
          first_accessed_at?: string
          id?: string
          user_id: string
        }
        Update: {
          aula_id?: string
          created_at?: string
          first_accessed_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "travessia_day_unlocks_aula_id_fkey"
            columns: ["aula_id"]
            isOneToOne: false
            referencedRelation: "conteudo_aulas"
            referencedColumns: ["id"]
          },
        ]
      }
      travessia_familias: {
        Row: {
          ativa: boolean | null
          created_at: string
          descricao: string | null
          icone: string | null
          id: string
          nome: string
          o_que_sustenta: string | null
          ordem: number | null
          quando_usar: string | null
          slug: string | null
          updated_at: string
        }
        Insert: {
          ativa?: boolean | null
          created_at?: string
          descricao?: string | null
          icone?: string | null
          id?: string
          nome: string
          o_que_sustenta?: string | null
          ordem?: number | null
          quando_usar?: string | null
          slug?: string | null
          updated_at?: string
        }
        Update: {
          ativa?: boolean | null
          created_at?: string
          descricao?: string | null
          icone?: string | null
          id?: string
          nome?: string
          o_que_sustenta?: string | null
          ordem?: number | null
          quando_usar?: string | null
          slug?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      travessia_library_items: {
        Row: {
          capa_url: string | null
          categoria: string
          como_atravessar: string
          created_at: string
          familia_id: string | null
          id: string
          o_que_sustenta: string
          ordem: number
          portal_minimo: Database["public"]["Enums"]["portal_type"]
          publicado: boolean
          quando_chamada: string
          slug: string
          subtitulo: string | null
          titulo_ritual: string
          updated_at: string
        }
        Insert: {
          capa_url?: string | null
          categoria?: string
          como_atravessar?: string
          created_at?: string
          familia_id?: string | null
          id?: string
          o_que_sustenta?: string
          ordem?: number
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          publicado?: boolean
          quando_chamada?: string
          slug: string
          subtitulo?: string | null
          titulo_ritual: string
          updated_at?: string
        }
        Update: {
          capa_url?: string | null
          categoria?: string
          como_atravessar?: string
          created_at?: string
          familia_id?: string | null
          id?: string
          o_que_sustenta?: string
          ordem?: number
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          publicado?: boolean
          quando_chamada?: string
          slug?: string
          subtitulo?: string | null
          titulo_ritual?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "travessia_library_items_familia_id_fkey"
            columns: ["familia_id"]
            isOneToOne: false
            referencedRelation: "travessia_familias"
            referencedColumns: ["id"]
          },
        ]
      }
      travessia_library_media: {
        Row: {
          created_at: string
          id: string
          item_id: string
          ordem: number
          tipo: string
          titulo: string | null
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          ordem?: number
          tipo: string
          titulo?: string | null
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          ordem?: number
          tipo?: string
          titulo?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "travessia_library_media_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "travessia_library_items"
            referencedColumns: ["id"]
          },
        ]
      }
      travessia_library_tags: {
        Row: {
          id: string
          item_id: string
          tag: string
        }
        Insert: {
          id?: string
          item_id: string
          tag: string
        }
        Update: {
          id?: string
          item_id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "travessia_library_tags_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "travessia_library_items"
            referencedColumns: ["id"]
          },
        ]
      }
      travessias: {
        Row: {
          ativa: boolean | null
          closing_ritual: string
          cor_acento: string | null
          created_at: string
          description: string
          icone: string | null
          id: string
          number: number
          ordem: number | null
          portal_minimo: Database["public"]["Enums"]["portal_type"] | null
          requer_profissional: boolean | null
          slug: string | null
          subtitle: string
          temas: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          ativa?: boolean | null
          closing_ritual: string
          cor_acento?: string | null
          created_at?: string
          description: string
          icone?: string | null
          id?: string
          number: number
          ordem?: number | null
          portal_minimo?: Database["public"]["Enums"]["portal_type"] | null
          requer_profissional?: boolean | null
          slug?: string | null
          subtitle: string
          temas?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          ativa?: boolean | null
          closing_ritual?: string
          cor_acento?: string | null
          created_at?: string
          description?: string
          icone?: string | null
          id?: string
          number?: number
          ordem?: number | null
          portal_minimo?: Database["public"]["Enums"]["portal_type"] | null
          requer_profissional?: boolean | null
          slug?: string | null
          subtitle?: string
          temas?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_aula_progress: {
        Row: {
          aula_id: string
          completed_at: string
          id: string
          user_id: string
        }
        Insert: {
          aula_id: string
          completed_at?: string
          id?: string
          user_id: string
        }
        Update: {
          aula_id?: string
          completed_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_aula_progress_aula_id_fkey"
            columns: ["aula_id"]
            isOneToOne: false
            referencedRelation: "conteudo_aulas"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          created_at: string
          id: string
          library_item_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          library_item_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          library_item_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_library_item_id_fkey"
            columns: ["library_item_id"]
            isOneToOne: false
            referencedRelation: "library_items"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed_at: string
          id: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          lesson_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          portal: Database["public"]["Enums"]["portal_type"]
          user_id: string
        }
        Insert: {
          id?: string
          portal?: Database["public"]["Enums"]["portal_type"]
          user_id: string
        }
        Update: {
          id?: string
          portal?: Database["public"]["Enums"]["portal_type"]
          user_id?: string
        }
        Relationships: []
      }
      video_playback_logs: {
        Row: {
          action: string
          context_id: string | null
          context_type: string
          created_at: string
          error_message: string | null
          id: string
          ip_address: string | null
          portal_level: string
          success: boolean
          token_used: string | null
          user_agent: string | null
          user_id: string | null
          video_id: string
        }
        Insert: {
          action?: string
          context_id?: string | null
          context_type: string
          created_at?: string
          error_message?: string | null
          id?: string
          ip_address?: string | null
          portal_level: string
          success?: boolean
          token_used?: string | null
          user_agent?: string | null
          user_id?: string | null
          video_id: string
        }
        Update: {
          action?: string
          context_id?: string | null
          context_type?: string
          created_at?: string
          error_message?: string | null
          id?: string
          ip_address?: string | null
          portal_level?: string
          success?: boolean
          token_used?: string | null
          user_agent?: string | null
          user_id?: string | null
          video_id?: string
        }
        Relationships: []
      }
      vitrine_cards: {
        Row: {
          ativo: boolean
          created_at: string
          descricao_curta: string | null
          estilo: string
          id: string
          imagem: string | null
          link_destino: string | null
          ordem: number
          subtitulo: string | null
          titulo: string
          updated_at: string
          video_url: string | null
          visibilidade_role: string[]
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao_curta?: string | null
          estilo?: string
          id?: string
          imagem?: string | null
          link_destino?: string | null
          ordem?: number
          subtitulo?: string | null
          titulo: string
          updated_at?: string
          video_url?: string | null
          visibilidade_role?: string[]
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao_curta?: string | null
          estilo?: string
          id?: string
          imagem?: string | null
          link_destino?: string | null
          ordem?: number
          subtitulo?: string | null
          titulo?: string
          updated_at?: string
          video_url?: string | null
          visibilidade_role?: string[]
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          created_at: string
          error: string | null
          event_type: string
          id: string
          payload: Json | null
          processed: boolean | null
          provider: string
        }
        Insert: {
          created_at?: string
          error?: string | null
          event_type: string
          id?: string
          payload?: Json | null
          processed?: boolean | null
          provider: string
        }
        Update: {
          created_at?: string
          error?: string | null
          event_type?: string
          id?: string
          payload?: Json | null
          processed?: boolean | null
          provider?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_formation_progress: {
        Row: {
          active_travessias: Json | null
          completed_rituals: Json | null
          completed_travessias: Json | null
          current_portal: string | null
          joined_at: string | null
          nome_exibicao: string | null
          role: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      activate_fundadora_plan: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      activate_mentoria_plan: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      activate_subscription: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      can_access_agent: {
        Args: { _agent_id: string; _user_id: string }
        Returns: boolean
      }
      can_access_sala: {
        Args: {
          _nivel_minimo: Database["public"]["Enums"]["nivel_sala"]
          _user_id: string
        }
        Returns: boolean
      }
      cancel_subscription: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      check_and_expire_access: { Args: never; Returns: number }
      check_case_limit: { Args: { _therapist_id: string }; Returns: boolean }
      client_has_active_jardim: {
        Args: { _client_id: string }
        Returns: boolean
      }
      close_expired_jardins: { Args: never; Returns: number }
      get_agent_with_context: {
        Args: {
          _agent_id: string
          _context_id?: string
          _context_type?: Database["public"]["Enums"]["block_context_type"]
        }
        Returns: {
          agent_descricao: string
          agent_id: string
          agent_nome: string
          global_system_prompt: string
          instrucoes_base: string
          max_tokens: number
          modelo_preferido: string
          prompt_personalidade: string
          temperatura: number
        }[]
      }
      get_case_quota: {
        Args: { _therapist_id: string }
        Returns: {
          can_create: boolean
          max_cases: number
          used_cases: number
        }[]
      }
      get_content_blocks: {
        Args: {
          _context_id: string
          _context_type: Database["public"]["Enums"]["block_context_type"]
          _user_id?: string
        }
        Returns: {
          agente_id: string | null
          ativo: boolean
          block_type: Database["public"]["Enums"]["content_block_type"]
          cloudflare_video_id: string | null
          content: Json
          context_id: string
          context_type: Database["public"]["Enums"]["block_context_type"]
          created_at: string
          descricao: string | null
          id: string
          ordem: number
          portal_minimo: Database["public"]["Enums"]["portal_type"]
          titulo: string | null
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "content_blocks"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_user_access_status: { Args: { _user_id: string }; Returns: string }
      get_user_nivel_sala: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["nivel_sala"]
      }
      get_user_portal: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["portal_type"]
      }
      has_course_access: {
        Args: { _course_id: string; _user_id: string }
        Returns: boolean
      }
      has_oracle_access: {
        Args: { _oracle_id: string; _user_id: string }
        Returns: boolean
      }
      has_portal_access: {
        Args: {
          _min_portal: Database["public"]["Enums"]["portal_type"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_lesson_available: {
        Args: { _lesson_id: string; _user_id: string }
        Returns: boolean
      }
      is_matriculada: {
        Args: { _curso_id?: string; _user_id: string }
        Returns: boolean
      }
      is_profissional_confirmada: {
        Args: { _user_id: string }
        Returns: boolean
      }
      upsert_pattern_stat: {
        Args: {
          _client_id: string
          _pattern_name: string
          _pattern_type: Database["public"]["Enums"]["pattern_stat_type"]
        }
        Returns: undefined
      }
      user_has_portal_access: {
        Args: { required_portal: Database["public"]["Enums"]["portal_type"] }
        Returns: boolean
      }
    }
    Enums: {
      agente_status: "ativo" | "inativo"
      album_status: "draft" | "published"
      big5_dimensao:
        | "abertura"
        | "conscienciosidade"
        | "extroversao"
        | "amabilidade"
        | "neuroticismo"
      big5_tipo_pergunta: "escala_1_5" | "texto"
      block_context_type:
        | "quiz_result"
        | "portal"
        | "ritual"
        | "formation"
        | "tool"
        | "sala"
        | "landing"
        | "course"
        | "lesson"
      casa_media_type: "audio" | "text" | "video" | "link" | "pdf"
      casa_room: "sustentacao" | "leitura" | "circulo"
      cliente_status: "ativo" | "pausado" | "encerrado"
      clube_jornada_tipo: "heroina" | "sombra" | "expressao_mundo"
      content_block_type:
        | "rich_text"
        | "image"
        | "video"
        | "audio"
        | "ai_chat"
        | "cta_button"
        | "chakra_wheel"
        | "energy_slider"
        | "pattern_diary"
        | "lunar_calendar"
        | "pendulum_map"
        | "ego_layers"
        | "archetype_card"
        | "reflection_prompt"
        | "plasticity_map"
        | "professional_intro"
        | "guided_writing"
        | "symbolic_practice"
        | "anchoring_input"
        | "archetypal_mapping"
        | "narrative_result"
        | "porta_familias"
      content_type: "text" | "video" | "audio" | "file" | "mixed" | "ritual"
      gesto_status: "ativo" | "em_pratica" | "integrado" | "em_revisao"
      intervention_level: "basico" | "intermediario" | "avancado"
      intervention_type:
        | "pergunta_clinica"
        | "micro_ritual"
        | "exercicio_narrativo"
        | "intervencao_simbolica"
      jardim_gesto_tipo:
        | "observacao"
        | "limite"
        | "cuidado"
        | "pausa"
        | "acao_simbolica"
      jardim_heroina_status: "inactive" | "active" | "closed"
      labirinto_modo_uso: "individual" | "grupo" | "constelacao" | "mentoria"
      mentoria_tipo: "aviso" | "evento" | "supervisao"
      movimento_percebido:
        | "avancou"
        | "tensao"
        | "ciclo_repetido"
        | "observacao"
      nivel_acesso_modulo: "aberta" | "iniciada" | "certificada" | "mentoria"
      nivel_sala: "NIVEL_0" | "NIVEL_1" | "NIVEL_2" | "NIVEL_3"
      oracle_card_level: "beginner" | "intermediate" | "advanced"
      oracle_content_status: "draft" | "published" | "archived"
      oracle_spread_layout: "line" | "cross" | "circle" | "spiral" | "custom"
      pattern_flag_type:
        | "district_recurrence"
        | "door_recurrence"
        | "tower_recurrence"
        | "loop_detected"
        | "abalo_persistente"
        | "integration_signal"
        | "conduction_risk"
      pattern_scope_type: "client" | "group"
      pattern_severity: "low" | "medium" | "high"
      pattern_stat_type:
        | "district"
        | "tower"
        | "oracle_card"
        | "intervention"
        | "archetype"
        | "tool"
      portal_type:
        | "visitante"
        | "mentorada"
        | "aluna_formacao"
        | "assinante"
        | "oracula"
        | "pre_iniciada"
        | "iniciada"
        | "admin"
        | "aluna"
      post_status: "rascunho" | "publicado" | "arquivado"
      pricing_model: "free" | "one_time" | "subscription"
      ritual_status: "pending" | "completed" | "skipped_by_admin"
      ritual_type: "abertura" | "transicao" | "consagracao"
      status_publicacao: "rascunho" | "publicado"
      status_supervisao: "privado" | "enviado" | "discutido"
      studio_episode_status: "draft" | "published"
      studio_episode_visibility: "exclusive" | "public" | "public_full"
      tipo_modulo: "jornada" | "curso" | "circulo" | "travessia" | "biblioteca"
      track_type: "audio" | "podcast"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agente_status: ["ativo", "inativo"],
      album_status: ["draft", "published"],
      big5_dimensao: [
        "abertura",
        "conscienciosidade",
        "extroversao",
        "amabilidade",
        "neuroticismo",
      ],
      big5_tipo_pergunta: ["escala_1_5", "texto"],
      block_context_type: [
        "quiz_result",
        "portal",
        "ritual",
        "formation",
        "tool",
        "sala",
        "landing",
        "course",
        "lesson",
      ],
      casa_media_type: ["audio", "text", "video", "link", "pdf"],
      casa_room: ["sustentacao", "leitura", "circulo"],
      cliente_status: ["ativo", "pausado", "encerrado"],
      clube_jornada_tipo: ["heroina", "sombra", "expressao_mundo"],
      content_block_type: [
        "rich_text",
        "image",
        "video",
        "audio",
        "ai_chat",
        "cta_button",
        "chakra_wheel",
        "energy_slider",
        "pattern_diary",
        "lunar_calendar",
        "pendulum_map",
        "ego_layers",
        "archetype_card",
        "reflection_prompt",
        "plasticity_map",
        "professional_intro",
        "guided_writing",
        "symbolic_practice",
        "anchoring_input",
        "archetypal_mapping",
        "narrative_result",
        "porta_familias",
      ],
      content_type: ["text", "video", "audio", "file", "mixed", "ritual"],
      gesto_status: ["ativo", "em_pratica", "integrado", "em_revisao"],
      intervention_level: ["basico", "intermediario", "avancado"],
      intervention_type: [
        "pergunta_clinica",
        "micro_ritual",
        "exercicio_narrativo",
        "intervencao_simbolica",
      ],
      jardim_gesto_tipo: [
        "observacao",
        "limite",
        "cuidado",
        "pausa",
        "acao_simbolica",
      ],
      jardim_heroina_status: ["inactive", "active", "closed"],
      labirinto_modo_uso: ["individual", "grupo", "constelacao", "mentoria"],
      mentoria_tipo: ["aviso", "evento", "supervisao"],
      movimento_percebido: [
        "avancou",
        "tensao",
        "ciclo_repetido",
        "observacao",
      ],
      nivel_acesso_modulo: ["aberta", "iniciada", "certificada", "mentoria"],
      nivel_sala: ["NIVEL_0", "NIVEL_1", "NIVEL_2", "NIVEL_3"],
      oracle_card_level: ["beginner", "intermediate", "advanced"],
      oracle_content_status: ["draft", "published", "archived"],
      oracle_spread_layout: ["line", "cross", "circle", "spiral", "custom"],
      pattern_flag_type: [
        "district_recurrence",
        "door_recurrence",
        "tower_recurrence",
        "loop_detected",
        "abalo_persistente",
        "integration_signal",
        "conduction_risk",
      ],
      pattern_scope_type: ["client", "group"],
      pattern_severity: ["low", "medium", "high"],
      pattern_stat_type: [
        "district",
        "tower",
        "oracle_card",
        "intervention",
        "archetype",
        "tool",
      ],
      portal_type: [
        "visitante",
        "mentorada",
        "aluna_formacao",
        "assinante",
        "oracula",
        "pre_iniciada",
        "iniciada",
        "admin",
        "aluna",
      ],
      post_status: ["rascunho", "publicado", "arquivado"],
      pricing_model: ["free", "one_time", "subscription"],
      ritual_status: ["pending", "completed", "skipped_by_admin"],
      ritual_type: ["abertura", "transicao", "consagracao"],
      status_publicacao: ["rascunho", "publicado"],
      status_supervisao: ["privado", "enviado", "discutido"],
      studio_episode_status: ["draft", "published"],
      studio_episode_visibility: ["exclusive", "public", "public_full"],
      tipo_modulo: ["jornada", "curso", "circulo", "travessia", "biblioteca"],
      track_type: ["audio", "podcast"],
    },
  },
} as const
