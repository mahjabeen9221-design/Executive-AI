
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  IMAGE_GEN = 'IMAGE_GEN',
  IMAGE_EDIT = 'IMAGE_EDIT',
  PRICING = 'PRICING',
  AUTH = 'AUTH',
  VOICE_ASSISTANT = 'VOICE_ASSISTANT',
  VIDEO_GEN = 'VIDEO_GEN'
}

export enum UserTier {
  FREE = 'FREE',
  PRO = 'PRO'
}

export enum ModelType {
  FLASH = 'gemini-3-flash-preview',
  PRO = 'gemini-3-pro-preview',
  NANO_BANANA = 'gemini-2.5-flash-image',
  NANO_BANANA_PRO = 'gemini-3-pro-image-preview',
  VEO = 'veo-3.1-fast-generate-preview'
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type: 'text' | 'image' | 'code';
  imageUrl?: string;
  timestamp: Date;
}

export interface IntelligenceBrief {
  summary: string;
  sources: { title: string; uri: string }[];
}
