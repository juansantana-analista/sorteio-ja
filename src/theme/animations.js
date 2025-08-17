// src/theme/animations.js
// 🎬 Design System - Animações Sorteio Já
// Sistema completo de animações para microinterações e celebrações

import { Easing } from 'react-native';

// ⏱️ Durações padronizadas
export const durations = {
  instant: 0,      // Sem animação
  fast: 150,       // Micro interações (hover, press)
  normal: 250,     // Transições padrão (navegação, modais)
  slow: 400,       // Animações complexas (reveal, morph)
  verySlow: 600,   // Celebrações e momentos especiais
  ultraSlow: 1000, // Animações dramáticas (splash, onboarding)
};

// 🎯 Curvas de easing para diferentes tipos de movimento
export const easings = {
  // 🔄 Movimentos naturais
  easeOut: Easing.out(Easing.cubic),        // Saída suave (padrão)
  easeIn: Easing.in(Easing.cubic),          // Entrada suave
  easeInOut: Easing.inOut(Easing.cubic),    // Entrada e saída suaves
  
  // ⚡ Movimentos rápidos
  sharp: Easing.out(Easing.quad),           // Movimento preciso
  snappy: Easing.bezier(0.4, 0.0, 0.2, 1), // Material Design standard
  
  // 🌊 Movimentos suaves
  smooth: Easing.bezier(0.25, 0.1, 0.25, 1), // Transições fluidas
  gentle: Easing.bezier(0.4, 0.0, 0.6, 1),   // Movimento delicado
  
  // 🎾 Movimentos elásticos
  bounce: Easing.bounce,                    // Efeito saltitante
  elastic: Easing.elastic(1),               // Efeito elástico
  spring: Easing.bezier(0.68, -0.55, 0.265, 1.55), // Efeito mola
  
  // 🎮 Movimentos especiais para gamificação
  celebration: Easing.bezier(0.175, 0.885, 0.32, 1.275), // Para conquistas
  magic: Easing.bezier(0.68, -0.55, 0.265, 1.8),        // Para momentos mágicos
};

// 🎨 Configurações de animação por tipo
export const animations = {
  // 🔘 Animações de botão
  button: {
    press: {
      duration: durations.fast,
      easing: easings.sharp,
      scale: 0.95,        // Diminui 5% quando pressionado
      opacity: 0.8,       // Fica 20% mais transparente
    },
    
    release: {
      duration: durations.fast,
      easing: easings.easeOut,
      scale: 1,           // Volta ao tamanho original
      opacity: 1,         // Volta à opacidade total
    },
    
    disabled: {
      duration: durations.normal,
      easing: easings.gentle,
      opacity: 0.4,       // 40% de opacidade quando disabled
    },
  },

  // 🃏 Animações de card
  card: {
    appear: {
      duration: durations.normal,
      easing: easings.easeOut,
      from: { opacity: 0, scale: 0.9, translateY: 20 },
      to: { opacity: 1, scale: 1, translateY: 0 },
    },
    
    disappear: {
      duration: durations.fast,
      easing: easings.easeIn,
      from: { opacity: 1, scale: 1, translateY: 0 },
      to: { opacity: 0, scale: 0.9, translateY: -20 },
    },
    
    hover: {
      duration: durations.fast,
      easing: easings.easeOut,
      scale: 1.02,        // Cresce 2% no hover
      translateY: -2,     // Sobe 2px
    },
    
    select: {
      duration: durations.normal,
      easing: easings.spring,
      scale: 1.05,        // Efeito de seleção mais dramático
      borderWidth: 2,     // Borda mais grossa
    },
  },

  // 🎭 Animações de modal
  modal: {
    slideUp: {
      duration: durations.normal,
      easing: easings.easeOut,
      from: { translateY: '100%', opacity: 0 },
      to: { translateY: 0, opacity: 1 },
    },
    
    slideDown: {
      duration: durations.fast,
      easing: easings.easeIn,
      from: { translateY: 0, opacity: 1 },
      to: { translateY: '100%', opacity: 0 },
    },
    
    fadeIn: {
      duration: durations.normal,
      easing: easings.easeOut,
      from: { opacity: 0, scale: 0.9 },
      to: { opacity: 1, scale: 1 },
    },
    
    fadeOut: {
      duration: durations.fast,
      easing: easings.easeIn,
      from: { opacity: 1, scale: 1 },
      to: { opacity: 0, scale: 0.9 },
    },
  },

  // 🚪 Animações de navegação
  navigation: {
    slideLeft: {
      duration: durations.normal,
      easing: easings.snappy,
      from: { translateX: '100%' },
      to: { translateX: 0 },
    },
    
    slideRight: {
      duration: durations.normal,
      easing: easings.snappy,
      from: { translateX: '-100%' },
      to: { translateX: 0 },
    },
    
    fadeTransition: {
      duration: durations.fast,
      easing: easings.easeInOut,
    },
  },

  // 🎮 Animações de gamificação
  gamification: {
    // 🏆 Conquista desbloqueada
    achievement: {
      duration: durations.verySlow,
      easing: easings.celebration,
      from: { 
        opacity: 0, 
        scale: 0, 
        rotate: '-180deg',
        translateY: -50 
      },
      to: { 
        opacity: 1, 
        scale: 1, 
        rotate: '0deg',
        translateY: 0 
      },
    },
    
    // 💰 Pontos ganhados
    pointsGain: {
      duration: durations.slow,
      easing: easings.spring,
      from: { 
        opacity: 0, 
        scale: 0.5, 
        translateY: 30 
      },
      to: { 
        opacity: 1, 
        scale: 1.2, 
        translateY: -10 
      },
      // Segunda fase da animação
      settle: {
        duration: durations.normal,
        easing: easings.easeOut,
        scale: 1,
        translateY: 0,
      },
    },
    
    // 🔥 Streak counter
    streak: {
      duration: durations.normal,
      easing: easings.bounce,
      from: { scale: 1 },
      to: { scale: 1.3 },
      settle: {
        duration: durations.fast,
        easing: easings.easeOut,
        scale: 1,
      },
    },
    
    // 📊 Barra de progresso
    progressBar: {
      duration: durations.slow,
      easing: easings.easeOut,
      // Será usado com width: 0% para width: X%
    },
    
    // 🎖️ Badge aparecendo
    badge: {
      duration: durations.normal,
      easing: easings.elastic,
      from: { scale: 0, rotate: '-90deg' },
      to: { scale: 1, rotate: '0deg' },
    },
  },

  // 🎊 Animações de celebração
  celebration: {
    // 🏆 Vencedor do sorteio
    winner: {
      duration: durations.ultraSlow,
      easing: easings.magic,
      from: { 
        opacity: 0, 
        scale: 0.3, 
        rotate: '-360deg',
        translateY: 100 
      },
      to: { 
        opacity: 1, 
        scale: 1, 
        rotate: '0deg',
        translateY: 0 
      },
    },
    
    // 🎉 Confete
    confetti: {
      duration: durations.verySlow,
      easing: easings.easeOut,
      // Múltiplas partículas com delays diferentes
      particles: 20,
      delayRange: [0, 200],
      from: { 
        opacity: 1, 
        scale: 1, 
        translateY: -100,
        rotate: '0deg' 
      },
      to: { 
        opacity: 0, 
        scale: 0.5, 
        translateY: 300,
        rotate: '720deg' 
      },
    },
    
    // ✨ Brilho/sparkle
    sparkle: {
      duration: durations.slow,
      easing: easings.easeInOut,
      from: { opacity: 0, scale: 0 },
      to: { opacity: 1, scale: 1 },
      loop: true,
      alternating: true,
    },
    
    // 🌟 Pulso de celebração
    pulse: {
      duration: durations.normal,
      easing: easings.easeInOut,
      from: { scale: 1, opacity: 1 },
      to: { scale: 1.1, opacity: 0.7 },
      loop: true,
      alternating: true,
    },
  },

  // 📝 Animações de input
  input: {
    focus: {
      duration: durations.fast,
      easing: easings.easeOut,
      borderColor: true,   // Anima mudança de cor da borda
      scale: 1.01,         // Cresce ligeiramente
    },
    
    blur: {
      duration: durations.fast,
      easing: easings.easeOut,
      scale: 1,            // Volta ao tamanho normal
    },
    
    error: {
      duration: durations.fast,
      easing: easings.sharp,
      // Shake animation
      translateX: [0, -5, 5, -5, 5, 0],
      borderColor: true,
    },
    
    success: {
      duration: durations.normal,
      easing: easings.easeOut,
      borderColor: true,
      // Check mark animation seria implementada separadamente
    },
  },

  // 📊 Animações de lista
  list: {
    itemAppear: {
      duration: durations.normal,
      easing: easings.easeOut,
      from: { opacity: 0, translateX: 50 },
      to: { opacity: 1, translateX: 0 },
      // Stagger delay: cada item aparece 50ms depois do anterior
      staggerDelay: 50,
    },
    
    itemRemove: {
      duration: durations.fast,
      easing: easings.easeIn,
      from: { opacity: 1, scale: 1, height: 'auto' },
      to: { opacity: 0, scale: 0.8, height: 0 },
    },
    
    swipeAction: {
      duration: durations.fast,
      easing: easings.snappy,
      translateX: [0, -100], // Swipe para revelar ações
    },
  },

  // 🎲 Animações específicas do sorteio
  lottery: {
    // 🎯 Sorteio de nomes - roleta
    nameWheel: {
      duration: durations.ultraSlow,
      easing: easings.easeOut,
      rotations: 5, // 5 voltas completas
      decelerationRate: 0.998,
    },
    
    // 🔢 Sorteio de números - slot machine
    numberSlot: {
      duration: durations.verySlow,
      easing: easings.easeOut,
      iterations: 20, // 20 números passam antes de parar
      finalSlowDown: durations.slow,
    },
    
    // 🎲 Dados rolando
    diceRoll: {
      duration: durations.slow,
      easing: easings.bounce,
      rotateX: '1440deg', // 4 voltas no eixo X
      rotateY: '1080deg', // 3 voltas no eixo Y
      bounceHeight: 50,
    },
    
    // 🎰 Embaralhar lista
    shuffle: {
      duration: durations.normal,
      easing: easings.easeInOut,
      // Cada item se move para posição aleatória e volta
      randomizePositions: true,
      iterations: 3,
    },
  },
};

// 🎪 Sequências de animação pré-definidas
export const animationSequences = {
  // 🎉 Sequência completa de celebração de vitória
  victorySequence: [
    {
      name: 'winner',
      animation: animations.celebration.winner,
      delay: 0,
    },
    {
      name: 'confetti',
      animation: animations.celebration.confetti,
      delay: 500, // Começa 500ms depois do winner
    },
    {
      name: 'points',
      animation: animations.gamification.pointsGain,
      delay: 1000, // Pontos aparecem 1s depois
    },
    {
      name: 'achievement',
      animation: animations.gamification.achievement,
      delay: 1500, // Conquista aparece 1.5s depois (se houver)
    },
  ],
  
  // 🚀 Sequência de onboarding
  onboardingSequence: [
    {
      name: 'logo',
      animation: {
        duration: durations.ultraSlow,
        easing: easings.magic,
        from: { opacity: 0, scale: 0.5, rotate: '-180deg' },
        to: { opacity: 1, scale: 1, rotate: '0deg' },
      },
      delay: 0,
    },
    {
      name: 'title',
      animation: animations.card.appear,
      delay: 800,
    },
    {
      name: 'subtitle',
      animation: animations.card.appear,
      delay: 1200,
    },
    {
      name: 'button',
      animation: animations.card.appear,
      delay: 1600,
    },
  ],
  
  // 📱 Sequência de abertura do app
  appLaunchSequence: [
    {
      name: 'splash',
      animation: {
        duration: durations.ultraSlow,
        easing: easings.easeOut,
        from: { opacity: 0, scale: 1.2 },
        to: { opacity: 1, scale: 1 },
      },
      delay: 0,
    },
    {
      name: 'fadeToMain',
      animation: animations.navigation.fadeTransition,
      delay: 2000,
    },
  ],
};

// 🎮 Helpers para animações de gamificação
export const gamificationHelpers = {
  // 💰 Animar ganho de pontos
  animatePointsGain: (points) => ({
    ...animations.gamification.pointsGain,
    // Customiza duração baseada na quantidade de pontos
    duration: Math.min(durations.verySlow, durations.fast + (points * 10)),
  }),
  
  // 📊 Animar progresso da barra
  animateProgressBar: (fromPercent, toPercent) => ({
    ...animations.gamification.progressBar,
    // Duração baseada na diferença de progresso
    duration: Math.max(durations.fast, (toPercent - fromPercent) * 20),
  }),
  
  // 🔥 Animar streak
  animateStreak: (streakCount) => ({
    ...animations.gamification.streak,
    // Efeito mais dramático para streaks maiores
    to: { 
      scale: Math.min(1.5, 1.2 + (streakCount * 0.05)) 
    },
  }),
};

// 🎯 Presets de timing para diferentes contextos
export const timingPresets = {
  // ⚡ Micro interações - responsividade imediata
  microInteraction: {
    duration: durations.fast,
    easing: easings.sharp,
  },
  
  // 🔄 Transições padrão - navegação e modais
  standardTransition: {
    duration: durations.normal,
    easing: easings.snappy,
  },
  
  // 🎨 Animações expressivas - onboarding, celebração
  expressive: {
    duration: durations.slow,
    easing: easings.celebration,
  },
  
  // 🌟 Momentos mágicos - conquistas especiais
  magical: {
    duration: durations.verySlow,
    easing: easings.magic,
  },
};

// 🎪 Função para criar animação customizada
export const createCustomAnimation = (config) => {
  const defaults = {
    duration: durations.normal,
    easing: easings.easeOut,
    delay: 0,
  };
  
  return {
    ...defaults,
    ...config,
  };
};

// 🎬 Função para encadear animações
export const chainAnimations = (animationsArray) => {
  return animationsArray.map((anim, index) => ({
    ...anim,
    delay: (anim.delay || 0) + (index * 100), // Delay automatico entre animações
  }));
};

// 🎯 Função para obter animação por contexto
export const getAnimationForContext = (context, state = 'default') => {
  const animationMap = {
    button: animations.button,
    card: animations.card,
    modal: animations.modal,
    navigation: animations.navigation,
    gamification: animations.gamification,
    celebration: animations.celebration,
    input: animations.input,
    list: animations.list,
    lottery: animations.lottery,
  };
  
  const contextAnimations = animationMap[context];
  if (!contextAnimations) {
    console.warn(`Contexto de animação não encontrado: ${context}`);
    return timingPresets.standardTransition;
  }
  
  const animation = contextAnimations[state];
  if (!animation) {
    console.warn(`Estado de animação não encontrado: ${context}.${state}`);
    return contextAnimations.default || timingPresets.standardTransition;
  }
  
  return animation;
};

// 🌈 Configurações especiais para React Native Reanimated
export const reanimatedConfig = {
  // Configuração padrão para spring animations
  springConfig: {
    damping: 15,
    mass: 1,
    stiffness: 150,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
  },
  
  // Configuração para timing animations
  timingConfig: {
    duration: durations.normal,
    easing: easings.easeOut,
  },
  
  // Configuração para gesture-based animations
  gestureConfig: {
    velocity: 0.5,
    tension: 100,
    friction: 8,
  },
};

// 🎊 Configurações para animações de partículas
export const particleAnimations = {
  confetti: {
    particleCount: 50,
    spread: 45,
    startVelocity: 45,
    elementCount: 200,
    decay: 0.9,
    gravity: 0.6,
    drift: 0,
    ticks: 200,
    shapes: ['square', 'circle'],
    colors: ['#ff6b6b', '#ffd93d', '#6bcf7f', '#4ecdc4', '#45b7d1'],
  },
  
  sparkles: {
    particleCount: 20,
    spread: 30,
    startVelocity: 30,
    elementCount: 100,
    decay: 0.95,
    gravity: 0.2,
    drift: 0.1,
    ticks: 150,
    shapes: ['star'],
    colors: ['#ffd700', '#ffed4e', '#ffe135'],
  },
  
  hearts: {
    particleCount: 10,
    spread: 20,
    startVelocity: 25,
    elementCount: 50,
    decay: 0.98,
    gravity: 0.1,
    drift: 0.05,
    ticks: 100,
    shapes: ['heart'],
    colors: ['#ff6b6b', '#ff8e8e', '#ffb3b3'],
  },
};

export default animations;