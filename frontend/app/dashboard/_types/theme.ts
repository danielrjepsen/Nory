export interface Theme {
    id?: string;
    name: string;
    displayName: string;
    description?: string;
    icon?: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    primaryFont?: string;
    secondaryFont?: string;
    backgroundColor1?: string;
    backgroundColor2?: string;
    backgroundColor3?: string;
    textPrimary?: string;
    textSecondary?: string;
    textAccent?: string;
    themeConfig?: string;
    darkBackgroundGradient?: string;
    darkParticleColors?: string;
    isSystemTheme?: boolean;
    sortOrder?: number;
}

export interface ThemePreset extends Theme {
    id: string;
}