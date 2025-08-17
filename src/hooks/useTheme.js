// src/hooks/useTheme.js
// 🎨 Hook personalizado para acessar o tema de forma segura
// Garante que todos os componentes de tema estejam disponíveis

import { useState, useEffect } from 'react';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { shadows } from '../theme/shadows';

// 🔤 Tipografia com fallback seguro
let safeTypography = null;

const getSafeTypography = () => {
  try {
    if (safeTypography) return safeTypography;
    
    // Tentar importar tipografia
    const { typography } = require('../theme/typography');
    
    if (typography && typography.fontFamily) {
      // Verificar se todas as propriedades necessárias existem
      const requiredProps = ['regular', 'medium', 'semibold', 'bold', 'light', 'thin'];
      const hasAllProps = requiredProps.every(prop => typography.fontFamily[prop]);
      
      if (hasAllProps) {
        safeTypography = typography;
        return safeTypography;
      }
    }
    
    // Fallback se tipografia não estiver disponível
    console.warn('⚠️ Typography não está disponível, usando fallback');
    safeTypography = {
      fontFamily: {
        regular: 'System',
        medium: 'System',
        semibold: 'System',
        bold: 'System',
        light: 'System',
        thin: 'System',
      },
      bodyMedium: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
      },
      labelSmall: {
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 16,
      },
      labelMedium: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 20,
      },
      labelLarge: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 24,
      },
      titleSmall: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 24,
      },
      titleMedium: {
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 28,
      },
      titleLarge: {
        fontSize: 20,
        fontWeight: '500',
        lineHeight: 28,
      },
      headlineSmall: {
        fontSize: 24,
        fontWeight: '500',
        lineHeight: 32,
      },
      headlineMedium: {
        fontSize: 30,
        fontWeight: '600',
        lineHeight: 38,
      },
      headlineLarge: {
        fontSize: 36,
        fontWeight: '600',
        lineHeight: 44,
      },
      displaySmall: {
        fontSize: 48,
        fontWeight: '600',
        lineHeight: 56,
      },
      displayMedium: {
        fontSize: 60,
        fontWeight: '700',
        lineHeight: 68,
      },
      displayLarge: {
        fontSize: 72,
        fontWeight: '700',
        lineHeight: 80,
      },
    };
    
    return safeTypography;
  } catch (error) {
    console.error('❌ Erro crítico ao carregar tipografia:', error);
    
    // Fallback de emergência
    safeTypography = {
      fontFamily: {
        regular: 'System',
        medium: 'System',
        semibold: 'System',
        bold: 'System',
        light: 'System',
        thin: 'System',
      },
      bodyMedium: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
      },
    };
    
    return safeTypography;
  }
};

/**
 * 🎨 Hook para acessar o tema de forma segura
 */
export function useTheme() {
  const [theme, setTheme] = useState({
    colors,
    typography: getSafeTypography(),
    spacing,
    shadows,
  });

  useEffect(() => {
    // Garantir que a tipografia seja carregada
    const loadTypography = () => {
      try {
        const typography = getSafeTypography();
        setTheme(prev => ({
          ...prev,
          typography,
        }));
      } catch (error) {
        console.error('❌ Erro ao carregar tipografia no hook:', error);
      }
    };

    loadTypography();
  }, []);

  return theme;
}
