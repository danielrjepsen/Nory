import { useState, useEffect } from 'react';
import { themeService } from '../_services/themes';
import { Theme } from '../_types/theme';

export function useThemes() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    try {
      setLoading(true);
      const fetchedThemes = await themeService.getThemePresets();
      setThemes(fetchedThemes);
      setError(null);
    } catch (err) {
      console.error('Error loading themes:', err);
      setError('Failed to load themes');
    } finally {
      setLoading(false);
    }
  };

  return { themes, loading, error, reload: loadThemes };
}
