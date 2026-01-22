// Oracle Module Types

export type OracleContentStatus = 'draft' | 'published' | 'archived';
export type OracleSpreadLayout = 'line' | 'cross' | 'circle' | 'spiral' | 'custom';
export type OracleCardLevel = 'beginner' | 'intermediate' | 'advanced';
export type PortalType = 'visitante' | 'pre_iniciada' | 'iniciada' | 'admin';

// Theme configuration for oracle deck
export interface OracleTheme {
  primaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  cardBackImage: string | null;
  cardFrameStyle: 'classic' | 'minimal' | 'ornate' | 'mystic';
}

// Voice/tone settings for oracle
export interface OracleVoiceSettings {
  tone: 'mystical' | 'nurturing' | 'direct' | 'poetic';
  openingText: string | null;
  closingText: string | null;
  revealPacing: number; // seconds
}

// Onboarding configuration
export interface OracleOnboarding {
  welcomeText: string | null;
  howToUse: string | null;
  safetyText: string | null;
}

// Spread position definition
export interface SpreadPosition {
  name: string;
  meaning: string;
  order: number;
}

// Spread rules
export interface SpreadRules {
  allowRepetition: boolean;
  requireShadowCard: boolean;
  revealMode: 'one_by_one' | 'all_at_once' | 'flip_to_reveal';
  imageFirstDefault: boolean;
}

// Drawn card record
export interface DrawnCard {
  cardId: string;
  positionName: string;
  positionIndex: number;
}

// Main Oracle Deck type
export interface OracleDeck {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  description: string | null;
  cover_image_url: string | null;
  theme_json: OracleTheme;
  voice_settings_json: OracleVoiceSettings;
  onboarding_json: OracleOnboarding;
  disclaimer_text: string | null;
  is_sensitive_mode_available: boolean;
  enable_journal: boolean;
  enable_professional_mode: boolean;
  minimum_portal: PortalType;
  show_locked_teaser: boolean;
  lock_message_title: string;
  lock_message_body: string;
  upgrade_cta_text: string;
  upgrade_cta_route: string;
  status: OracleContentStatus;
  ordem: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// Oracle Category
export interface OracleCategory {
  id: string;
  oracle_id: string;
  name: string;
  description: string | null;
  icon: string | null;
  ordem: number;
  created_at: string;
  updated_at: string;
}

// Oracle Card
export interface OracleCard {
  id: string;
  oracle_id: string;
  category_id: string | null;
  title: string;
  subtitle: string | null;
  main_image_url: string | null;
  back_image_url: string | null;
  image_variants_json: string[];
  keywords_json: string[];
  polarity_light_text: string | null;
  polarity_shadow_text: string | null;
  short_message: string | null;
  deep_reading: string | null;
  reflection_questions_json: string[];
  ritual_text: string | null;
  care_notes: string | null;
  level: OracleCardLevel;
  is_sensitive: boolean;
  status: OracleContentStatus;
  ordem: number;
  created_at: string;
  updated_at: string;
}

// Oracle Spread (Tiragem)
export interface OracleSpread {
  id: string;
  oracle_id: string;
  name: string;
  description: string | null;
  number_of_cards: number;
  layout_type: OracleSpreadLayout;
  positions_json: SpreadPosition[];
  rules_json: SpreadRules;
  opening_text: string | null;
  closing_text: string | null;
  status: OracleContentStatus;
  ordem: number;
  created_at: string;
  updated_at: string;
}

// Oracle Client (for professional mode)
export interface OracleClient {
  id: string;
  therapist_user_id: string;
  display_name: string;
  notes_private: string | null;
  created_at: string;
  updated_at: string;
}

// Oracle Draw (completed reading)
export interface OracleDraw {
  id: string;
  oracle_id: string;
  spread_id: string;
  user_id: string;
  drawn_cards_json: DrawnCard[];
  user_notes: string | null;
  is_professional_session: boolean;
  client_id: string | null;
  created_at: string;
  updated_at: string;
}

// Extended types with relations
export interface OracleDeckWithCards extends OracleDeck {
  cards: OracleCard[];
  spreads: OracleSpread[];
  categories: OracleCategory[];
}

export interface OracleDrawWithDetails extends OracleDraw {
  oracle: OracleDeck;
  spread: OracleSpread;
  cards: OracleCard[];
}
