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
          created_at: string
          descricao: string
          icone: string | null
          id: string
          instrucoes_base: string
          nome: string
          portal_minimo: Database["public"]["Enums"]["portal_type"]
          status: Database["public"]["Enums"]["agente_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao: string
          icone?: string | null
          id?: string
          instrucoes_base?: string
          nome: string
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          status?: Database["public"]["Enums"]["agente_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string
          icone?: string | null
          id?: string
          instrucoes_base?: string
          nome?: string
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          status?: Database["public"]["Enums"]["agente_status"]
          updated_at?: string
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
          created_at: string
          descricao: string
          id: string
          ordem: number
          portal_minimo: Database["public"]["Enums"]["portal_type"]
          sala_id: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string
          id?: string
          ordem?: number
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          sala_id?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string
          id?: string
          ordem?: number
          portal_minimo?: Database["public"]["Enums"]["portal_type"]
          sala_id?: string | null
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
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          nome: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          nome?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nome?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sala_ferramentas: {
        Row: {
          ativa: boolean
          created_at: string
          ferramenta_chave: string
          ferramenta_descricao: string | null
          ferramenta_nome: string
          icone: string | null
          id: string
          ordem: number
          rota: string
          sala_id: string
          updated_at: string
        }
        Insert: {
          ativa?: boolean
          created_at?: string
          ferramenta_chave: string
          ferramenta_descricao?: string | null
          ferramenta_nome: string
          icone?: string | null
          id?: string
          ordem?: number
          rota: string
          sala_id: string
          updated_at?: string
        }
        Update: {
          ativa?: boolean
          created_at?: string
          ferramenta_chave?: string
          ferramenta_descricao?: string | null
          ferramenta_nome?: string
          icone?: string | null
          id?: string
          ordem?: number
          rota?: string
          sala_id?: string
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
          categoria: string
          chave: string
          conteudo: string
          created_at: string
          id: string
          titulo: string
          updated_at: string
        }
        Insert: {
          categoria?: string
          chave: string
          conteudo: string
          created_at?: string
          id?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          categoria?: string
          chave?: string
          conteudo?: string
          created_at?: string
          id?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
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
      get_user_nivel_sala: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["nivel_sala"]
      }
      get_user_portal: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["portal_type"]
      }
      has_portal_access: {
        Args: {
          _min_portal: Database["public"]["Enums"]["portal_type"]
          _user_id: string
        }
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
      mentoria_tipo: "aviso" | "evento" | "supervisao"
      nivel_sala: "NIVEL_0" | "NIVEL_1" | "NIVEL_2" | "NIVEL_3"
      portal_type: "visitante" | "pre_iniciada" | "iniciada" | "admin"
      post_status: "rascunho" | "publicado" | "arquivado"
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
      mentoria_tipo: ["aviso", "evento", "supervisao"],
      nivel_sala: ["NIVEL_0", "NIVEL_1", "NIVEL_2", "NIVEL_3"],
      portal_type: ["visitante", "pre_iniciada", "iniciada", "admin"],
      post_status: ["rascunho", "publicado", "arquivado"],
    },
  },
} as const
