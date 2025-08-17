// src/theme/typography.js
// ✍️ Design System - Tipografia Sorteio Já
// Sistema escalável e acessível baseado em Material Design 3

import { Platform } from 'react-native';

// 📏 Escala tipográfica harmônica
const scale = {
  xs: 12,   // Legendas, labels pequenos
  sm: 14,   // Textos secundários, captions
  base: 16, // Texto padrão (tamanho base para acessibilidade)
  lg: 18,   // Texto enfatizado, subtítulos
  xl: 20,   // Títulos de seção
  '2xl': 24, // Títulos principais
  '3xl': 30, // Headings grandes
  '4xl': 36, // Display pequeno
  '5xl': 48, // Display médio
  '6xl': 60, // Display grande
  '7xl': 72, // Display extra grande (splash, comemorações)
};

// 📱 Ajustes por plataforma
const platformScale = Platform.select({
  ios: scale,
  android: {
    ...scale,
    // Android prefere textos ligeiramente maiores
    xs: 13,
    sm: 15,
    base: 17,
    lg: 19,
    xl: 21,
    '2xl': 25,
  },
});

// ⚖️ Pesos de fonte otimizados
const fontWeights = {
  thin: '100',
  light: '300',
  normal: '400',   // Peso padrão
  medium: '500',   // Enfase moderada
  semibold: '600', // Enfase forte
  bold: '700',     // Títulos importantes
  extrabold: '800', // Display, chamadas
  black: '900',    // Máxima enfase
};

// 📐 Alturas de linha para legibilidade
const lineHeights = {
  none: 1,      // Para displays grandes
  tight: 1.25,  // Para títulos
  snug: 1.375,  // Para subtítulos
  normal: 1.5,  // Para texto corrido (padrão)
  relaxed: 1.625, // Para textos longos
  loose: 2,     // Para textos espaçados
};

// 📝 Estilos de texto prontos para usar
export const typography = {
  // 🏆 Display - Para momentos especiais e splash
  displayLarge: {
    fontSize: platformScale['7xl'],
    fontWeight: fontWeights.bold,
    lineHeight: platformScale['7xl'] * lineHeights.none,
    letterSpacing: -0.25,
  },
  
  displayMedium: {
    fontSize: platformScale['6xl'],
    fontWeight: fontWeights.bold,
    lineHeight: platformScale['6xl'] * lineHeights.tight,
    letterSpacing: -0.25,
  },
  
  displaySmall: {
    fontSize: platformScale['5xl'],
    fontWeight: fontWeights.semibold,
    lineHeight: platformScale['5xl'] * lineHeights.tight,
    letterSpacing: 0,
  },

  // 📰 Headlines - Títulos principais
  headlineLarge: {
    fontSize: platformScale['4xl'],
    fontWeight: fontWeights.semibold,
    lineHeight: platformScale['4xl'] * lineHeights.tight,
    letterSpacing: 0,
  },
  
  headlineMedium: {
    fontSize: platformScale['3xl'],
    fontWeight: fontWeights.semibold,
    lineHeight: platformScale['3xl'] * lineHeights.tight,
    letterSpacing: 0,
  },
  
  headlineSmall: {
    fontSize: platformScale['2xl'],
    fontWeight: fontWeights.medium,
    lineHeight: platformScale['2xl'] * lineHeights.tight,
    letterSpacing: 0,
  },

  // 📑 Titles - Títulos de seção
  titleLarge: {
    fontSize: platformScale.xl,
    fontWeight: fontWeights.medium,
    lineHeight: platformScale.xl * lineHeights.snug,
    letterSpacing: 0,
  },
  
  titleMedium: {
    fontSize: platformScale.lg,
    fontWeight: fontWeights.medium,
    lineHeight: platformScale.lg * lineHeights.snug,
    letterSpacing: 0.15,
  },
  
  titleSmall: {
    fontSize: platformScale.base,
    fontWeight: fontWeights.medium,
    lineHeight: platformScale.base * lineHeights.snug,
    letterSpacing: 0.1,
  },

  // 📝 Body - Texto principal
  bodyLarge: {
    fontSize: platformScale.lg,
    fontWeight: fontWeights.normal,
    lineHeight: platformScale.lg * lineHeights.normal,
    letterSpacing: 0.15,
  },
  
  bodyMedium: {
    fontSize: platformScale.base,
    fontWeight: fontWeights.normal,
    lineHeight: platformScale.base * lineHeights.normal,
    letterSpacing: 0.25,
  },
  
  bodySmall: {
    fontSize: platformScale.sm,
    fontWeight: fontWeights.normal,
    lineHeight: platformScale.sm * lineHeights.normal,
    letterSpacing: 0.4,
  },

  // 🏷️ Labels - Rótulos e botões
  labelLarge: {
    fontSize: platformScale.base,
    fontWeight: fontWeights.medium,
    lineHeight: platformScale.base * lineHeights.snug,
    letterSpacing: 0.1,
  },
  
  labelMedium: {
    fontSize: platformScale.sm,
    fontWeight: fontWeights.medium,
    lineHeight: platformScale.sm * lineHeights.snug,
    letterSpacing: 0.5,
  },
  
  labelSmall: {
    fontSize: platformScale.xs,
    fontWeight: fontWeights.medium,
    lineHeight: platformScale.xs * lineHeights.snug,
    letterSpacing: 0.5,
  },

  // 🎮 Estilos especiais para Gamificação
  gamification: {
    // 🏆 Para pontos e conquistas
    points: {
      fontSize: platformScale['2xl'],
      fontWeight: fontWeights.bold,
      lineHeight: platformScale['2xl'] * lineHeights.tight,
      letterSpacing: -0.25,
    },
    
    // 🔥 Para streaks e sequências
    streak: {
      fontSize: platformScale.lg,
      fontWeight: fontWeights.extrabold,
      lineHeight: platformScale.lg * lineHeights.tight,
      letterSpacing: 0.25,
    },
    
    // 🎯 Para desafios
    challenge: {
      fontSize: platformScale.base,
      fontWeight: fontWeights.semibold,
      lineHeight: platformScale.base * lineHeights.snug,
      letterSpacing: 0.15,
    },
    
    // 🏅 Para conquistas desbloqueadas
    achievement: {
      fontSize: platformScale.lg,
      fontWeight: fontWeights.bold,
      lineHeight: platformScale.lg * lineHeights.tight,
      letterSpacing: 0.1,
    },
  },

  // 🎊 Estilos para momentos especiais
  celebration: {
    // 🎉 Resultado de sorteio
    winner: {
      fontSize: platformScale['4xl'],
      fontWeight: fontWeights.extrabold,
      lineHeight: platformScale['4xl'] * lineHeights.none,
      letterSpacing: -0.5,
      textAlign: 'center',
    },
    
    // ✨ Conquista desbloqueada
    unlocked: {
      fontSize: platformScale['3xl'],
      fontWeight: fontWeights.bold,
      lineHeight: platformScale['3xl'] * lineHeights.tight,
      letterSpacing: -0.25,
      textAlign: 'center',
    },
  },

  // 🔢 Números grandes (para sorteios)
  numbers: {
    large: {
      fontSize: platformScale['6xl'],
      fontWeight: fontWeights.black,
      lineHeight: platformScale['6xl'] * lineHeights.none,
      letterSpacing: -1,
      textAlign: 'center',
    },
    
    medium: {
      fontSize: platformScale['4xl'],
      fontWeight: fontWeights.bold,
      lineHeight: platformScale['4xl'] * lineHeights.tight,
      letterSpacing: -0.5,
      textAlign: 'center',
    },
  },
};

// 🎯 Função helper para acessar estilos de texto
export const getTextStyle = (styleName) => {
  const keys = styleName.split('.');
  let style = typography;
  
  for (const key of keys) {
    style = style[key];
    if (!style) {
      console.warn(`Estilo de texto não encontrado: ${styleName}`);
      return typography.bodyMedium; // Fallback
    }
  }
  
  return style;
};

// 📱 Estilos específicos por componente
export const componentStyles = {
  // 🔘 Botões
  button: {
    primary: typography.labelLarge,
    secondary: typography.labelMedium,
    small: typography.labelSmall,
  },
  
  // 📝 Inputs
  input: {
    label: typography.labelMedium,
    text: typography.bodyMedium,
    placeholder: {
      ...typography.bodyMedium,
      fontWeight: fontWeights.normal,
    },
    error: typography.labelSmall,
  },
  
  // 🏠 Navegação
  tab: {
    active: {
      ...typography.labelSmall,
      fontWeight: fontWeights.semibold,
    },
    inactive: typography.labelSmall,
  },
  
  // 🃏 Cards
  card: {
    title: typography.titleMedium,
    subtitle: typography.bodySmall,
    content: typography.bodyMedium,
  },
  
  // 📊 Listas
  list: {
    header: typography.labelLarge,
    item: typography.bodyMedium,
    subtitle: typography.bodySmall,
  },
};

// 📏 Utilitários de espaçamento de texto
export const textSpacing = {
  // Margins para diferentes tipos de texto
  margins: {
    title: { marginBottom: 8 },
    subtitle: { marginBottom: 4 },
    paragraph: { marginBottom: 16 },
    caption: { marginBottom: 4 },
  },
  
  // Paddings para containers de texto
  paddings: {
    small: { paddingHorizontal: 8, paddingVertical: 4 },
    medium: { paddingHorizontal: 12, paddingVertical: 8 },
    large: { paddingHorizontal: 16, paddingVertical: 12 },
  },
};

export default typography;