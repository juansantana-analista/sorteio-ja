// src/theme/spacing.js
// 📐 Design System - Espaçamento Sorteio Já
// Sistema baseado em múltiplos de 4px para consistência visual

// 🎯 Escala base de 4px - padrão da indústria
const BASE_UNIT = 4;

// 📏 Escala de espaçamento harmônica
export const spacing = {
  // Micro espaçamentos
  xs: BASE_UNIT,        // 4px  - separações mínimas
  sm: BASE_UNIT * 2,    // 8px  - espaçamentos pequenos
  md: BASE_UNIT * 3,    // 12px - espaçamentos médios
  lg: BASE_UNIT * 4,    // 16px - espaçamentos padrão
  xl: BASE_UNIT * 5,    // 20px - espaçamentos grandes
  '2xl': BASE_UNIT * 6, // 24px - seções
  '3xl': BASE_UNIT * 8, // 32px - blocos importantes
  '4xl': BASE_UNIT * 10, // 40px - separações principais
  '5xl': BASE_UNIT * 12, // 48px - seções grandes
  '6xl': BASE_UNIT * 16, // 64px - hero sections
  '7xl': BASE_UNIT * 20, // 80px - espaçamentos gigantes
};

// 📱 Espaçamentos específicos para mobile
export const mobileSpacing = {
  // 📦 Container paddings
  container: {
    horizontal: spacing.lg,    // 16px - padding lateral padrão
    vertical: spacing['2xl'], // 24px - padding vertical
    small: spacing.md,        // 12px - containers pequenos
    large: spacing['3xl'],    // 32px - containers grandes
  },
  
  // 🏠 Screen paddings
  screen: {
    horizontal: spacing.lg,   // 16px - margens da tela
    vertical: spacing.xl,     // 20px - padding vertical
    top: spacing['2xl'],      // 24px - padding do topo
    bottom: spacing['3xl'],   // 32px - padding do bottom (para tab bar)
  },
  
  // 🃏 Card spacings
  card: {
    padding: spacing.lg,      // 16px - padding interno do card
    margin: spacing.md,       // 12px - espaço entre cards
    radius: spacing.md,       // 12px - border radius padrão
    gap: spacing.sm,          // 8px - espaço entre elementos
  },
  
  // 🔘 Button spacings
  button: {
    paddingVertical: spacing.md,    // 12px - altura do botão
    paddingHorizontal: spacing.xl,  // 20px - largura do botão
    marginVertical: spacing.sm,     // 8px - espaço entre botões
    radius: spacing.sm,             // 8px - border radius
    iconGap: spacing.sm,            // 8px - espaço entre ícone e texto
  },
  
  // 📝 Input spacings
  input: {
    paddingVertical: spacing.md,    // 12px - altura do input
    paddingHorizontal: spacing.lg,  // 16px - padding interno
    marginVertical: spacing.sm,     // 8px - espaço entre inputs
    radius: spacing.sm,             // 8px - border radius
    labelGap: spacing.xs,           // 4px - espaço entre label e input
  },
  
  // 📊 List spacings
  list: {
    itemPadding: spacing.lg,        // 16px - padding do item
    itemGap: spacing.xs,            // 4px - espaço entre itens
    sectionGap: spacing['2xl'],     // 24px - espaço entre seções
    headerMargin: spacing.md,       // 12px - margem do header
  },
  
  // 🎮 Gamification spacings
  gamification: {
    badgePadding: spacing.sm,       // 8px - padding das badges
    pointsGap: spacing.xs,          // 4px - espaço entre pontos
    achievementGap: spacing.lg,     // 16px - espaço entre conquistas
    progressBarHeight: spacing.xs,  // 4px - altura da barra de progresso
    levelGap: spacing.md,           // 12px - espaço entre níveis
    streakGap: spacing.sm,          // 8px - espaço para streak counter
  },
  
  // 🎊 Celebration spacings
  celebration: {
    confettiGap: spacing.lg,        // 16px - espaço para animações
    resultPadding: spacing['3xl'], // 32px - padding da tela de resultado
    winnerGap: spacing['2xl'],     // 24px - espaço do nome vencedor
  },
  
  // 🔍 Modal spacings
  modal: {
    padding: spacing['2xl'],        // 24px - padding interno
    marginHorizontal: spacing.lg,   // 16px - margem lateral
    radius: spacing.lg,             // 16px - border radius
    backdropPadding: spacing['4xl'], // 40px - espaço do backdrop
  },
  
  // 📐 Tab bar spacings
  tabBar: {
    height: spacing['6xl'],         // 64px - altura da tab bar
    iconSize: spacing['2xl'],       // 24px - tamanho dos ícones
    labelGap: spacing.xs,           // 4px - espaço entre ícone e label
    paddingBottom: spacing.lg,      // 16px - padding bottom (safe area)
  },
};

// 🌊 Responsive breakpoints para diferentes tamanhos
export const breakpoints = {
  small: 0,      // Phones pequenos
  medium: 375,   // Phones normais
  large: 414,    // Phones grandes
  tablet: 768,   // Tablets
  desktop: 1024, // Desktop (se for web)
};

// 📏 Função para espaçamento responsivo
export const getResponsiveSpacing = (screenWidth, spacingKey) => {
  const baseSpacing = spacing[spacingKey];
  
  if (screenWidth >= breakpoints.tablet) {
    // Tablets e desktop: aumentar espaçamentos
    return Math.round(baseSpacing * 1.5);
  } else if (screenWidth <= breakpoints.small) {
    // Phones pequenos: diminuir espaçamentos
    return Math.round(baseSpacing * 0.8);
  }
  
  return baseSpacing;
};

// 🎯 Helpers para estilos comuns
export const spacingHelpers = {
  // Margem centralizada
  centerHorizontal: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  
  // Flex spacings comuns
  flexCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  flexBetween: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  flexStart: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  
  flexEnd: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  
  // Gaps para flex/grid
  gap: (size) => ({
    gap: spacing[size] || size,
  }),
  
  // Padding shortcuts
  p: (size) => ({
    padding: spacing[size] || size,
  }),
  
  px: (size) => ({
    paddingHorizontal: spacing[size] || size,
  }),
  
  py: (size) => ({
    paddingVertical: spacing[size] || size,
  }),
  
  pt: (size) => ({
    paddingTop: spacing[size] || size,
  }),
  
  pb: (size) => ({
    paddingBottom: spacing[size] || size,
  }),
  
  pl: (size) => ({
    paddingLeft: spacing[size] || size,
  }),
  
  pr: (size) => ({
    paddingRight: spacing[size] || size,
  }),
  
  // Margin shortcuts
  m: (size) => ({
    margin: spacing[size] || size,
  }),
  
  mx: (size) => ({
    marginHorizontal: spacing[size] || size,
  }),
  
  my: (size) => ({
    marginVertical: spacing[size] || size,
  }),
  
  mt: (size) => ({
    marginTop: spacing[size] || size,
  }),
  
  mb: (size) => ({
    marginBottom: spacing[size] || size,
  }),
  
  ml: (size) => ({
    marginLeft: spacing[size] || size,
  }),
  
  mr: (size) => ({
    marginRight: spacing[size] || size,
  }),
};

// 🎨 Espaçamentos para animações
export const animationSpacing = {
  // Duração das transições baseada em distância
  timing: {
    fast: 150,     // Micro interações
    normal: 250,   // Transições padrão
    slow: 400,     // Transições complexas
    verySlow: 600, // Animações de celebração
  },
  
  // Distâncias para gestos
  gesture: {
    swipeThreshold: spacing['4xl'],  // 40px - mínimo para swipe
    dragThreshold: spacing.lg,       // 16px - mínimo para drag
    longPressRadius: spacing.md,     // 12px - área de long press
  },
  
  // Offsets para parallax e scroll
  parallax: {
    small: spacing.sm,    // 8px - parallax sutil
    medium: spacing.lg,   // 16px - parallax normal
    large: spacing['3xl'], // 32px - parallax dramático
  },
};

// 🏗️ Layout containers pré-definidos
export const layouts = {
  // Container principal da tela
  screen: {
    flex: 1,
    paddingHorizontal: mobileSpacing.screen.horizontal,
    paddingTop: mobileSpacing.screen.top,
    paddingBottom: mobileSpacing.screen.bottom,
  },
  
  // Container de conteúdo
  content: {
    flex: 1,
    paddingHorizontal: mobileSpacing.container.horizontal,
  },
  
  // Container centralizado
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: mobileSpacing.container.horizontal,
  },
  
  // Container de formulário
  form: {
    paddingHorizontal: mobileSpacing.container.horizontal,
    paddingVertical: mobileSpacing.container.vertical,
  },
  
  // Container de lista
  list: {
    flex: 1,
    paddingHorizontal: mobileSpacing.screen.horizontal,
  },
  
  // Container de modal
  modal: {
    margin: mobileSpacing.modal.marginHorizontal,
    padding: mobileSpacing.modal.padding,
    borderRadius: mobileSpacing.modal.radius,
  },
};

export default spacing;