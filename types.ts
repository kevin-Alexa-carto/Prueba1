export interface BrandProject {
    id: string;
    name: string;
    createdAt: string;
    data: Partial<BrandData>;
}

export interface ColorInfo {
    hex: string;
    name: string;
    description: string;
}

export interface TypographyInfo {
    fontFamily: string;
    description: string;
}

export interface VisualIdentity {
    logoConcept: string;
    colorPalette: ColorInfo[];
    primaryTypography: TypographyInfo;
    secondaryTypography: TypographyInfo;
    photographyStyle: string;
}

export interface BrandData {
    // Section 1
    purpose: string;
    mission: string;
    vision: string;
    values: string;
    targetAudience: string;
    brandPromise: string;
    // Section 2
    competitorAnalysis: string;
    positioning: string;
    toneOfVoice: string;
    brandArchetype: string;
    // Section 3
    visualIdentity: VisualIdentity;
    // Section 4
    contentPillars: string;
    keyPlatforms: string;
    ctas: string;
    storytelling: string;
    // Section 5
    touchpoints: string;
    consistency: string;
    feedback: string;
    commitment: string;
}

export interface ContentIdea {
    id: string;
    day: number;
    contentType: 'Blog' | 'Social Media' | 'Video' | 'Email' | 'Podcast' | string;
    title: string;
    description: string;
    generatedContent?: string;
}

export interface CopywriterHistoryItem {
    id: string;
    timestamp: string;
    originalText: string;
    tone: string;
    context?: string;
    variations: string[];
}
