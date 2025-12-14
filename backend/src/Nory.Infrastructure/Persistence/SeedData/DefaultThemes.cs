using Nory.Core.Domain.Entities;

namespace Nory.Infrastructure.Persistence.SeedData;

public static class DefaultThemes
{
    public static IReadOnlyList<Theme> GetAll() =>
    [
        Theme.CreateSystemTheme(
            name: "wedding",
            displayName: "Wedding",
            description: "Elegant and romantic for weddings and romantic celebrations",
            primaryColor: "#db2777",
            secondaryColor: "#9333ea",
            accentColor: "#a21caf",
            backgroundColor1: "#fdf2f8",
            backgroundColor2: "#f9fafb",
            backgroundColor3: "#831843",
            textPrimary: "#831843",
            textSecondary: "#a21caf",
            textAccent: "#db2777",
            primaryFont: "Playfair Display",
            secondaryFont: "Inter",
            darkBackgroundGradient: "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%), linear-gradient(135deg, #0f0f23 0%, #1a1625 100%)",
            darkParticleColors: """["radial-gradient(circle, rgba(255, 119, 198, 0.8) 0%, rgba(255, 119, 198, 0) 70%)", "radial-gradient(circle, rgba(120, 119, 198, 0.6) 0%, rgba(120, 119, 198, 0) 70%)", "radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%)", "radial-gradient(circle, rgba(255, 204, 119, 0.5) 0%, rgba(255, 204, 119, 0) 70%)"]""",
            sortOrder: 1
        ),

        Theme.CreateSystemTheme(
            name: "birthday",
            displayName: "Birthday",
            description: "Fun and vibrant for birthday parties and celebrations",
            primaryColor: "#ea580c",
            secondaryColor: "#f59e0b",
            accentColor: "#c2410c",
            backgroundColor1: "#fff7ed",
            backgroundColor2: "#fefce8",
            backgroundColor3: "#9a3412",
            textPrimary: "#9a3412",
            textSecondary: "#c2410c",
            textAccent: "#ea580c",
            primaryFont: "Inter",
            secondaryFont: "Inter",
            darkBackgroundGradient: "radial-gradient(circle at 30% 70%, rgba(255, 154, 0, 0.2) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255, 59, 48, 0.2) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(175, 82, 222, 0.15) 0%, transparent 50%), linear-gradient(135deg, #1a0d00 0%, #2d1b04 100%)",
            darkParticleColors: """["radial-gradient(circle, rgba(255, 59, 48, 0.8) 0%, rgba(255, 59, 48, 0) 70%)", "radial-gradient(circle, rgba(255, 154, 0, 0.7) 0%, rgba(255, 154, 0, 0) 70%)", "radial-gradient(circle, rgba(175, 82, 222, 0.6) 0%, rgba(175, 82, 222, 0) 70%)", "radial-gradient(circle, rgba(255, 214, 10, 0.5) 0%, rgba(255, 214, 10, 0) 70%)"]""",
            sortOrder: 2
        ),

        Theme.CreateSystemTheme(
            name: "corporate",
            displayName: "Corporate",
            description: "Professional and clean for business events and conferences",
            primaryColor: "#2563eb",
            secondaryColor: "#0891b2",
            accentColor: "#1d4ed8",
            backgroundColor1: "#f0f9ff",
            backgroundColor2: "#f8fafc",
            backgroundColor3: "#0f172a",
            textPrimary: "#0f172a",
            textSecondary: "#475569",
            textAccent: "#1d4ed8",
            primaryFont: "Inter",
            secondaryFont: "Inter",
            darkBackgroundGradient: "radial-gradient(circle at 25% 75%, rgba(0, 122, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 25%, rgba(50, 173, 230, 0.15) 0%, transparent 50%), linear-gradient(135deg, #000510 0%, #001122 100%)",
            darkParticleColors: """["radial-gradient(circle, rgba(0, 122, 255, 0.6) 0%, rgba(0, 122, 255, 0) 70%)", "radial-gradient(circle, rgba(50, 173, 230, 0.5) 0%, rgba(50, 173, 230, 0) 70%)", "radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%)", "radial-gradient(circle, rgba(100, 200, 255, 0.4) 0%, rgba(100, 200, 255, 0) 70%)"]""",
            sortOrder: 3
        ),

        Theme.CreateSystemTheme(
            name: "new-year",
            displayName: "New Year",
            description: "Festive and sparkling for New Year parties and celebrations",
            primaryColor: "#d97706",
            secondaryColor: "#db2777",
            accentColor: "#7c3aed",
            backgroundColor1: "#fffbeb",
            backgroundColor2: "#fef3c7",
            backgroundColor3: "#fce7f3",
            textPrimary: "#92400e",
            textSecondary: "#b45309",
            textAccent: "#d97706",
            primaryFont: "Inter",
            secondaryFont: "Inter",
            themeConfig: """{"hasAnimation": true, "gradientShift": true}""",
            darkBackgroundGradient: "radial-gradient(circle at 20% 20%, rgba(255, 204, 0, 0.2) 0%, transparent 30%), radial-gradient(circle at 80% 80%, rgba(255, 45, 85, 0.2) 0%, transparent 30%), radial-gradient(circle at 40% 80%, rgba(191, 90, 242, 0.15) 0%, transparent 30%), radial-gradient(circle at 60% 20%, rgba(30, 144, 255, 0.15) 0%, transparent 30%), linear-gradient(135deg, #0d0015 0%, #1a0033 100%)",
            darkParticleColors: """["radial-gradient(circle, rgba(255, 204, 0, 0.9) 0%, rgba(255, 204, 0, 0) 60%)", "radial-gradient(circle, rgba(255, 45, 85, 0.8) 0%, rgba(255, 45, 85, 0) 60%)", "radial-gradient(circle, rgba(191, 90, 242, 0.7) 0%, rgba(191, 90, 242, 0) 60%)", "radial-gradient(circle, rgba(30, 144, 255, 0.6) 0%, rgba(30, 144, 255, 0) 60%)"]""",
            sortOrder: 4
        ),

        Theme.CreateSystemTheme(
            name: "baby",
            displayName: "Baby Event",
            description: "Soft and gentle for baby showers and family events",
            primaryColor: "#ec4899",
            secondaryColor: "#8b5cf6",
            accentColor: "#a16207",
            backgroundColor1: "#fdf2f8",
            backgroundColor2: "#f0f9ff",
            backgroundColor3: "#7c2d12",
            textPrimary: "#7c2d12",
            textSecondary: "#a16207",
            textAccent: "#ec4899",
            primaryFont: "Inter",
            secondaryFont: "Inter",
            darkBackgroundGradient: "radial-gradient(circle at 30% 30%, rgba(255, 183, 197, 0.4) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(174, 198, 255, 0.4) 0%, transparent 50%), linear-gradient(135deg, #fdf2f8 0%, #f0f9ff 50%, #fef3f2 100%)",
            darkParticleColors: """["radial-gradient(circle, rgba(255, 183, 197, 0.6) 0%, rgba(255, 183, 197, 0) 70%)", "radial-gradient(circle, rgba(174, 198, 255, 0.5) 0%, rgba(174, 198, 255, 0) 70%)", "radial-gradient(circle, rgba(255, 223, 186, 0.4) 0%, rgba(255, 223, 186, 0) 70%)", "radial-gradient(circle, rgba(200, 255, 200, 0.3) 0%, rgba(200, 255, 200, 0) 70%)"]""",
            sortOrder: 5
        ),

        Theme.CreateSystemTheme(
            name: "custom",
            displayName: "Custom",
            description: "Fully customizable theme for any type of event",
            primaryColor: "#6366f1",
            secondaryColor: "#8b5cf6",
            accentColor: "#64748b",
            backgroundColor1: "#f1f5f9",
            backgroundColor2: "#f8fafc",
            backgroundColor3: "#334155",
            textPrimary: "#1e293b",
            textSecondary: "#64748b",
            textAccent: "#6366f1",
            primaryFont: "Inter",
            secondaryFont: "Inter",
            darkBackgroundGradient: "radial-gradient(circle at 20% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(0, 170, 255, 0.2) 0%, transparent 50%), linear-gradient(135deg, #0f0f23 0%, #1a1625 100%)",
            darkParticleColors: """["radial-gradient(circle, rgba(255, 119, 198, 0.8) 0%, rgba(255, 119, 198, 0) 70%)", "radial-gradient(circle, rgba(120, 119, 198, 0.6) 0%, rgba(120, 119, 198, 0) 70%)", "radial-gradient(circle, rgba(0, 170, 255, 0.5) 0%, rgba(0, 170, 255, 0) 70%)", "radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%)"]""",
            sortOrder: 6
        )
    ];
}
