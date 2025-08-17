// src/theme/shadows.js
// 🌫️ Design System - Sombras Sorteio Já
// Sistema de elevação consistente para depth e hierarquia visual

import { Platform } from 'react-native';

// 🎯 Elevações baseadas no Material Design
const elevations = {
  0: 0,   // Nenhuma sombra
  1: 1,   // Sombra sutil - cards em repouso
  2: 2,   // Sombra leve - botões
  3: 4,   // Sombra média - cards hover
  4: 8,   // Sombra forte - modais
  5: 16,  // Sombra dramática - celebration
};

// 🌫️ Sistema de sombras para iOS e Android
const createShadow = (elevation, color = '#000') => {
  if (Platform.OS === 'ios') {
    // iOS usa shadowOffset, shadowOpacity, shadowRadius
    const opacity = elevation * 0.02; // Aumenta opacidade com elevação
    const radius = elevation === 0 ? 0 : elevation + 2;
    const offset = elevation === 0 ? 0 : Math.ceil(elevation * 0.5);
    
    return {
      shadowColor: color,
      shadowOffset: {
        width: 0,
        height: offset,
      },
      shadowOpacity: Math.min(opacity, 0.25), // Máximo 25% de opacidade
      shadowRadius: radius,
    };
  } else {
    // Android usa elevation
    return {
      elevation: elevation,
      shadowColor: color, // Para compatibilidade
    };
  }
};

// 🎨 Sombras pré-definidas
export const shadows = {
  // 🚫 Sem sombra
  none: createShadow(0),
  
  // 📄 Sombras sutis - para cards e elementos em repouso
  subtle: createShadow(elevations[1]),
  
  // 🔘 Sombras leves - para botões e inputs
  light: createShadow(elevations[2]),
  
  // 📦 Sombras médias - para cards em hover/pressed
  medium: createShadow(elevations[3]),
  
  // 🎭 Sombras fortes - para modais e overlays
  strong: createShadow(elevations[4]),
  
  // ✨ Sombras dramáticas - para momentos especiais
  dramatic: createShadow(elevations[5]),
  
  // 🎨 Sombras coloridas para estados especiais
  success: createShadow(elevations[2], '#22c55e'),
  warning: createShadow(elevations[2], '#f59e0b'),
  error: createShadow(elevations[2], '#ef4444'),
  primary: createShadow(elevations[2], '#0ea5e9'),
  
  // 🏆 Sombras douradas para gamificação
  gold: createShadow(elevations[3], '#ffd700'),
  celebration: createShadow(elevations[4], '#ff6b6b'),
};

// 🎮 Sombras específicas para gamificação
export const gamificationShadows = {
  // 🏅 Badge de conquista
  badge: {
    ...createShadow(elevations[2]),
    // Glow effect sutil
    ...(Platform.OS === 'ios' && {
      shadowColor: '#ffd700',
      shadowOpacity: 0.3,
    }),
  },
  
  // 💎 Elementos premium
  premium: {
    ...createShadow(elevations[3]),
    ...(Platform.OS === 'ios' && {
      shadowColor: '#9333ea',
      shadowOpacity: 0.2,
    }),
  },
  
  // 🔥 Streak em alta
  streak: {
    ...createShadow(elevations[2]),
    ...(Platform.OS === 'ios' && {
      shadowColor: '#ff6b6b',
      shadowOpacity: 0.25,
    }),
  },
  
  // ⭐ Pontos brilhantes
  points: {
    ...createShadow(elevations[1]),
    ...(Platform.OS === 'ios' && {
      shadowColor: '#ffd700',
      shadowOpacity: 0.4,
    }),
  },
};

// 🎊 Sombras para momentos de celebração
export const celebrationShadows = {
  // 🏆 Vencedor do sorteio
  winner: {
    ...createShadow(elevations[5]),
    ...(Platform.OS === 'ios' && {
      shadowColor: '#ff6b6b',
      shadowOpacity: 0.3,
      shadowRadius: 20,
    }),
  },
  
  // 🎉 Conquista desbloqueada
  achievement: {
    ...createShadow(elevations[4]),
    ...(Platform.OS === 'ios' && {
      shadowColor: '#22c55e',
      shadowOpacity: 0.25,
      shadowRadius: 15,
    }),
  },
  
  // ✨ Momento mágico
  magic: {
    ...createShadow(elevations[3]),
    ...(Platform.OS === 'ios' && {
      shadowColor: '#9333ea',
      shadowOpacity: 0.3,
      shadowRadius: 12,
    }),
  },
};

// 🔘 Sombras para estados de botão
export const buttonShadows = {
  // Estado normal
  default: shadows.light,
  
  // Estado hover/pressed
  pressed: shadows.subtle,
  
  // Estado disabled
  disabled: shadows.none,
  
  // Botão primário
  primary: shadows.medium,
  
  // Botão floating action
  fab: shadows.strong,
  
  // Botão de celebração
  celebration: celebrationShadows.magic,
};

// 📦 Sombras para cards
export const cardShadows = {
  // Card em repouso
  default: shadows.subtle,
  
  // Card em hover/pressed
  hover: shadows.medium,
  
  // Card selecionado
  selected: shadows.strong,
  
  // Card de resultado
  result: celebrationShadows.winner,
  
  // Card de conquista
  achievement: gamificationShadows.badge,
};

// 🎭 Sombras para modais e overlays
export const modalShadows = {
  // Modal padrão
  default: shadows.strong,
  
  // Modal de celebração
  celebration: shadows.dramatic,
  
  // Tooltip
  tooltip: shadows.medium,
  
  // Dropdown
  dropdown: shadows.strong,
  
  // Sheet modal
  sheet: {
    ...shadows.dramatic,
    ...(Platform.OS === 'ios' && {
      shadowOffset: {
        width: 0,
        height: -4, // Sombra para cima
      },
    }),
  },
};

// 🎨 Função helper para criar sombras customizadas
export const createCustomShadow = (elevation, color = '#000', opacity = null) => {
  const customOpacity = opacity || elevation * 0.02;
  
  if (Platform.OS === 'ios') {
    const radius = elevation === 0 ? 0 : elevation + 2;
    const offset = elevation === 0 ? 0 : Math.ceil(elevation * 0.5);
    
    return {
      shadowColor: color,
      shadowOffset: {
        width: 0,
        height: offset,
      },
      shadowOpacity: Math.min(customOpacity, 0.3),
      shadowRadius: radius,
    };
  } else {
    return {
      elevation: elevation,
      shadowColor: color,
    };
  }
};

// 🌈 Sombras animadas para transições
export const animatedShadows = {
  // Transição de card hover
  cardHover: {
    from: shadows.subtle,
    to: shadows.medium,
  },
  
  // Transição de botão press
  buttonPress: {
    from: shadows.light,
    to: shadows.subtle,
  },
  
  // Transição de modal appear
  modalAppear: {
    from: shadows.none,
    to: shadows.strong,
  },
  
  // Transição de celebração
  celebration: {
    from: shadows.medium,
    to: shadows.dramatic,
  },
};

// 🎯 Função para obter sombra baseada no estado
export const getShadowForState = (component, state = 'default') => {
  const shadowMap = {
    button: buttonShadows,
    card: cardShadows,
    modal: modalShadows,
    gamification: gamificationShadows,
    celebration: celebrationShadows,
  };
  
  const componentShadows = shadowMap[component];
  if (!componentShadows) {
    console.warn(`Componente de sombra não encontrado: ${component}`);
    return shadows.subtle;
  }
  
  const shadow = componentShadows[state];
  if (!shadow) {
    console.warn(`Estado de sombra não encontrado: ${component}.${state}`);
    return componentShadows.default || shadows.subtle;
  }
  
  return shadow;
};

export default shadows;