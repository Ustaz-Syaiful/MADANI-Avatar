export type AppStep = 'welcome' | 'camera' | 'style' | 'generating' | 'design' | 'print';

export interface AvatarStyle {
  id: string;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  themeColor: string;
  iconName: string;
  previewGradient: string;
  features: string[];
}

export type CardTemplateId = 
  | 'madani_celebration'
  | 'my_3d_avatar'
  | 'little_malaysian_star'
  | 'kenangan_karnival'
  | 'future_ai';

export interface CardTemplate {
  id: CardTemplateId;
  name: string;
  description: string;
  headerStyle: string;
  badgeBg: string;
  cardBg: string;
  textColor: string;
  accentColor: string;
  borderStyle: string;
}

export type PrintFormat = 'a4' | 'a5' | '4r' | 'square';

export interface KioskConfig {
  programName: string;
  organizerName: string;
  districtName: string;
  programDate: string;
  programSlogan: string;
  customLogoUrl: string | null;
  sessionTimeoutSeconds: number;
  showStudentNameInput: boolean;
  inkSaverDefault: boolean;
  allowedFormats: PrintFormat[];
}

export interface GenerationState {
  isGenerating: boolean;
  progressPercent: number;
  statusMessage: string;
  currentStepIndex: number;
  error: string | null;
  errorDetails: string | null;
  generationTimeMs?: number;
}
