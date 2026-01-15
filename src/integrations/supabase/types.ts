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
      clientes: {
        Row: {
          created_at: string
          id: string
          nome: string
          objetivo_terapeutico: string | null
          status: Database["public"]["Enums"]["cliente_status"]
          terapeuta_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          objetivo_terapeutico?: string | null
          status?: Database["public"]["Enums"]["cliente_status"]
          terapeuta_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          objetivo_terapeutico?: string | null
          status?: Database["public"]["Enums"]["cliente_status"]
          terapeuta_id?: string
          updated_at?: string
        }
        Relationships: []
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
      content_blocks: {
        Row: {
          agente_id: string | null
          ativo: boolean
          block_type: Database["public"]["Enums"]["content_block_type"]
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
          id: string
          ordem: number
          portal_minimo: Database["public"]["Enums"]["portal_type"]
          publicado: boolean
          sala_id: string | null
          subtitulo: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          capa_url?: string | null
          created_at?: string
          descricao?: string
          id?: string
          ordem?: number
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          publicado?: boolean
          sala_id?: string | null
          subtitulo?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          capa_url?: string | null
          created_at?: string
          descricao?: string
          id?: string
          ordem?: number
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          publicado?: boolean
          sala_id?: string | null
          subtitulo?: string | null
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
          content_type: Database["public"]["Enums"]["content_type"]
          created_at: string
          descricao_curta: string | null
          duracao_minutos: number | null
          id: string
          is_preview: boolean
          materiais_url: string | null
          module_id: string
          ordem: number
          pdf_url: string | null
          publicado: boolean
          texto_aula: string | null
          titulo: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string
          descricao_curta?: string | null
          duracao_minutos?: number | null
          id?: string
          is_preview?: boolean
          materiais_url?: string | null
          module_id: string
          ordem?: number
          pdf_url?: string | null
          publicado?: boolean
          texto_aula?: string | null
          titulo: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string
          descricao_curta?: string | null
          duracao_minutos?: number | null
          id?: string
          is_preview?: boolean
          materiais_url?: string | null
          module_id?: string
          ordem?: number
          pdf_url?: string | null
          publicado?: boolean
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
      course_modules: {
        Row: {
          course_id: string
          created_at: string
          descricao: string | null
          dias_apos_matricula: number | null
          disponivel_em: string | null
          id: string
          ordem: number
          publicado: boolean
          titulo: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          descricao?: string | null
          dias_apos_matricula?: number | null
          disponivel_em?: string | null
          id?: string
          ordem?: number
          publicado?: boolean
          titulo: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          descricao?: string | null
          dias_apos_matricula?: number | null
          disponivel_em?: string | null
          id?: string
          ordem?: number
          publicado?: boolean
          titulo?: string
          updated_at?: string
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
          sala_id: string | null
          stripe_price_id: string | null
          stripe_product_id: string | null
          subtitulo: string | null
          tags: string[] | null
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
          sala_id?: string | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          subtitulo?: string | null
          tags?: string[] | null
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
          sala_id?: string | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          subtitulo?: string | null
          tags?: string[] | null
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
      labirinto_portas: {
        Row: {
          ai_generated_image_url: string | null
          ativa: boolean
          caso_espelho_como_sustentar: string | null
          caso_espelho_erro_comum: string | null
          caso_espelho_frase_chegada: string | null
          caso_espelho_titulo: string | null
          cena_narrativa: string | null
          chave_frase_ancora: string | null
          chave_o_que_nao_fazer: string | null
          chave_quando_parar: string | null
          chave_sinal_maturidade: string | null
          created_at: string
          eixo_psiquico: string | null
          id: string
          imagem_url: string | null
          nome: string
          numero: number
          ordem: number
          pergunta_chave: string | null
          portal_caso_espelho: Database["public"]["Enums"]["portal_type"]
          portal_chave_facilitadora: Database["public"]["Enums"]["portal_type"]
          portal_minimo: Database["public"]["Enums"]["portal_type"]
          risco_clinico: string | null
          subtitulo: string | null
          symbolic_focus: string | null
          updated_at: string
        }
        Insert: {
          ai_generated_image_url?: string | null
          ativa?: boolean
          caso_espelho_como_sustentar?: string | null
          caso_espelho_erro_comum?: string | null
          caso_espelho_frase_chegada?: string | null
          caso_espelho_titulo?: string | null
          cena_narrativa?: string | null
          chave_frase_ancora?: string | null
          chave_o_que_nao_fazer?: string | null
          chave_quando_parar?: string | null
          chave_sinal_maturidade?: string | null
          created_at?: string
          eixo_psiquico?: string | null
          id?: string
          imagem_url?: string | null
          nome: string
          numero: number
          ordem?: number
          pergunta_chave?: string | null
          portal_caso_espelho?: Database["public"]["Enums"]["portal_type"]
          portal_chave_facilitadora?: Database["public"]["Enums"]["portal_type"]
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          risco_clinico?: string | null
          subtitulo?: string | null
          symbolic_focus?: string | null
          updated_at?: string
        }
        Update: {
          ai_generated_image_url?: string | null
          ativa?: boolean
          caso_espelho_como_sustentar?: string | null
          caso_espelho_erro_comum?: string | null
          caso_espelho_frase_chegada?: string | null
          caso_espelho_titulo?: string | null
          cena_narrativa?: string | null
          chave_frase_ancora?: string | null
          chave_o_que_nao_fazer?: string | null
          chave_quando_parar?: string | null
          chave_sinal_maturidade?: string | null
          created_at?: string
          eixo_psiquico?: string | null
          id?: string
          imagem_url?: string | null
          nome?: string
          numero?: number
          ordem?: number
          pergunta_chave?: string | null
          portal_caso_espelho?: Database["public"]["Enums"]["portal_type"]
          portal_chave_facilitadora?: Database["public"]["Enums"]["portal_type"]
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          risco_clinico?: string | null
          subtitulo?: string | null
          symbolic_focus?: string | null
          updated_at?: string
        }
        Relationships: []
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
      library_items: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
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
      oracle_cards: {
        Row: {
          ai_generated_image_url: string | null
          care_notes: string | null
          category_id: string | null
          created_at: string
          deep_reading: string | null
          id: string
          image_variants_json: Json | null
          is_sensitive: boolean | null
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
          symbolic_focus: string | null
          title: string
          updated_at: string
        }
        Insert: {
          ai_generated_image_url?: string | null
          care_notes?: string | null
          category_id?: string | null
          created_at?: string
          deep_reading?: string | null
          id?: string
          image_variants_json?: Json | null
          is_sensitive?: boolean | null
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
          symbolic_focus?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          ai_generated_image_url?: string | null
          care_notes?: string | null
          category_id?: string | null
          created_at?: string
          deep_reading?: string | null
          id?: string
          image_variants_json?: Json | null
          is_sensitive?: boolean | null
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
      plan_limits: {
        Row: {
          created_at: string
          id: string
          max_clientes: number
          portal: Database["public"]["Enums"]["portal_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          max_clientes?: number
          portal: Database["public"]["Enums"]["portal_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          max_clientes?: number
          portal?: Database["public"]["Enums"]["portal_type"]
          updated_at?: string
        }
        Relationships: []
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
      profiles: {
        Row: {
          access_status: string
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          is_professional_verified: boolean
          nome: string | null
          role: string
          updated_at: string
        }
        Insert: {
          access_status?: string
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          is_professional_verified?: boolean
          nome?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          access_status?: string
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_professional_verified?: boolean
          nome?: string | null
          role?: string
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
          created_at: string
          descricao: string | null
          id: string
          portal_id: string | null
          sala_id: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          portal_id?: string | null
          sala_id?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          portal_id?: string | null
          sala_id?: string | null
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
      sala_ferramentas: {
        Row: {
          ativa: boolean
          created_at: string
          ferramenta_chave: string
          ferramenta_descricao: string | null
          ferramenta_nome: string
          has_blocks: boolean | null
          icone: string | null
          id: string
          ordem: number
          portal_minimo: Database["public"]["Enums"]["portal_type"] | null
          rota: string
          sala_id: string
          slug: string | null
          tipo: string | null
          updated_at: string
        }
        Insert: {
          ativa?: boolean
          created_at?: string
          ferramenta_chave: string
          ferramenta_descricao?: string | null
          ferramenta_nome: string
          has_blocks?: boolean | null
          icone?: string | null
          id?: string
          ordem?: number
          portal_minimo?: Database["public"]["Enums"]["portal_type"] | null
          rota: string
          sala_id: string
          slug?: string | null
          tipo?: string | null
          updated_at?: string
        }
        Update: {
          ativa?: boolean
          created_at?: string
          ferramenta_chave?: string
          ferramenta_descricao?: string | null
          ferramenta_nome?: string
          has_blocks?: boolean | null
          icone?: string | null
          id?: string
          ordem?: number
          portal_minimo?: Database["public"]["Enums"]["portal_type"] | null
          rota?: string
          sala_id?: string
          slug?: string | null
          tipo?: string | null
          updated_at?: string
        }
        Relationships: [
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
      terapeuta_clientes: {
        Row: {
          ativo: boolean
          cliente_id: string
          created_at: string
          id: string
          terapeuta_id: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cliente_id: string
          created_at?: string
          id?: string
          terapeuta_id: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cliente_id?: string
          created_at?: string
          id?: string
          terapeuta_id?: string
          updated_at?: string
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
      travessia_library_items: {
        Row: {
          capa_url: string | null
          categoria: string
          como_atravessar: string
          created_at: string
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
        Relationships: []
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
          closing_ritual: string
          created_at: string
          description: string
          id: string
          number: number
          subtitle: string
          title: string
          updated_at: string
        }
        Insert: {
          closing_ritual: string
          created_at?: string
          description: string
          id?: string
          number: number
          subtitle: string
          title: string
          updated_at?: string
        }
        Update: {
          closing_ritual?: string
          created_at?: string
          description?: string
          id?: string
          number?: number
          subtitle?: string
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
      [_ in never]: never
    }
    Functions: {
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
      can_create_caso: {
        Args: { _cliente_id: string; _terapeuta_id: string }
        Returns: boolean
      }
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
      is_lesson_available: {
        Args: { _lesson_id: string; _user_id: string }
        Returns: boolean
      }
      is_linked_therapist: {
        Args: { _cliente_id: string; _terapeuta_id: string }
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
      is_terapeuta_of_cliente: {
        Args: { _cliente_id: string; _terapeuta_id: string }
        Returns: boolean
      }
      registro_pertence_terapeuta: {
        Args: { _caso_id: string; _terapeuta_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      agente_status: "ativo" | "inativo"
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
      cliente_status: "ativo" | "pausado" | "encerrado"
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
      content_type: "text" | "video" | "audio" | "file" | "mixed"
      mentoria_tipo: "aviso" | "evento" | "supervisao"
      nivel_sala: "NIVEL_0" | "NIVEL_1" | "NIVEL_2" | "NIVEL_3"
      oracle_card_level: "beginner" | "intermediate" | "advanced"
      oracle_content_status: "draft" | "published" | "archived"
      oracle_spread_layout: "line" | "cross" | "circle" | "spiral" | "custom"
      portal_type: "visitante" | "pre_iniciada" | "iniciada" | "admin"
      post_status: "rascunho" | "publicado" | "arquivado"
      pricing_model: "free" | "one_time" | "subscription"
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
      ],
      cliente_status: ["ativo", "pausado", "encerrado"],
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
      ],
      content_type: ["text", "video", "audio", "file", "mixed"],
      mentoria_tipo: ["aviso", "evento", "supervisao"],
      nivel_sala: ["NIVEL_0", "NIVEL_1", "NIVEL_2", "NIVEL_3"],
      oracle_card_level: ["beginner", "intermediate", "advanced"],
      oracle_content_status: ["draft", "published", "archived"],
      oracle_spread_layout: ["line", "cross", "circle", "spiral", "custom"],
      portal_type: ["visitante", "pre_iniciada", "iniciada", "admin"],
      post_status: ["rascunho", "publicado", "arquivado"],
      pricing_model: ["free", "one_time", "subscription"],
    },
  },
} as const
