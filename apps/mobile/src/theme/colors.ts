export const colors = {
  // CtrlPass "Cinema Noir" — deep black canvas, layered charcoal surfaces,
  // champagne/gold as accent only, green reserved for confirmations/VALID.
  ink: '#050505', // Primary background — deep black
  textPrimary: '#F5F5F2', // Primary typography — warm white
  accent: '#D6B47A', // Primary CTA surface — champagne
  onAccent: '#0B0B0C', // Text/icons placed on accent
  go: '#D6B47A', // Active/positive accent (champagne)

  // Supporting neutrals
  white: '#FFFFFF',
  softBlack: '#000000',
  mutedText: '#A7A39B', // secondary text
  border: '#232326', // subtle border on dark surfaces
  disabled: '#77736C',

  // Semantic
  success: '#4ADE80',
  error: '#F87171',
  warning: '#E5B767',
  info: '#C9A86A', // link tone — muted champagne

  // Background aliases
  background: '#050505',
  surface: '#0B0B0C',
  surfaceLight: '#141416', // overlay layer for chips/badges/circles
  text: '#F5F5F2',
  textSecondary: '#A7A39B',

  // Cinema Noir palette
  champagne: '#D6B47A',
  gold: '#B88A45',
  cream: '#F4E8D0',
  textMuted: '#77736C',
  elevated: '#141416',
  glass: 'rgba(255,255,255,0.06)',
  glassStrong: 'rgba(255,255,255,0.10)',
  glassBorder: 'rgba(255,255,255,0.10)',
  goldSoft: 'rgba(214,180,122,0.16)', // champagne tint fill
  goldBorder: 'rgba(214,180,122,0.45)', // champagne border for selected states
  goldGlow: 'rgba(214,180,122,0.25)', // soft glow shadow under champagne
} as const;

export type ColorToken = keyof typeof colors;
