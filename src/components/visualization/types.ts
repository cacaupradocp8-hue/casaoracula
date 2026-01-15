// ============================================
// SYMBOLIC VISUALIZATION SYSTEM - TYPES
// ============================================

export type VisualizationType = 'mandala' | 'radial' | 'spiral';

export interface SymbolicElement {
  id: string;
  label: string;
  description?: string;
  color?: string;
  icon?: string;
  intensity?: 'low' | 'medium' | 'high' | 'dominant';
  metadata?: Record<string, unknown>;
}

export interface VisualizationConfig {
  type: VisualizationType;
  title?: string;
  subtitle?: string;
  centerLabel?: string;
  centerIcon?: string;
  showLabels?: boolean;
  showDescriptions?: boolean;
  animated?: boolean;
  interactive?: boolean;
  glowEffect?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  colorScheme?: 'gold' | 'purple' | 'mystical' | 'earth' | 'custom';
  customColors?: string[];
}

export interface SymbolicVisualizationProps {
  elements: SymbolicElement[];
  config: VisualizationConfig;
  selectedElement?: string | null;
  onElementSelect?: (element: SymbolicElement) => void;
  className?: string;
}

// Size mappings
export const SIZE_MAP = {
  sm: { container: 200, element: 32 },
  md: { container: 280, element: 40 },
  lg: { container: 360, element: 48 },
  xl: { container: 440, element: 56 },
};

// Color scheme mappings
export const COLOR_SCHEMES = {
  gold: ['#C9A45C', '#B8934D', '#A7823E', '#967130', '#856022'],
  purple: ['#9B87F5', '#8B77E5', '#7B67D5', '#6B57C5', '#5B47B5'],
  mystical: ['#6366F1', '#8B5CF6', '#A855F7', '#D946EF', '#EC4899'],
  earth: ['#92400E', '#B45309', '#D97706', '#F59E0B', '#FBBF24'],
  custom: [],
};

// Intensity to opacity mapping
export const INTENSITY_OPACITY = {
  low: 0.4,
  medium: 0.6,
  high: 0.8,
  dominant: 1,
};
