// src/theme/colors.js
// 🎨 Design System - Paleta de Cores Sorteio Já
// Inspirado em apps modernos como Duolingo, Instagram e WhatsApp

export const colors = {
    // 🎯 Cores Primárias - Identidade da marca
    primary: {
      50: '#f0f9ff',   // Azul muito claro - backgrounds sutis
      100: '#e0f2fe',  // Azul claro - cards hover
      200: '#bae6fd',  // Azul suave - estados disabled
      300: '#7dd3fc',  // Azul médio - borders
      400: '#38bdf8',  // Azul vibrante - botões secundários
      500: '#0ea5e9',  // AZUL PRINCIPAL - botões primários, links
      600: '#0284c7',  // Azul escuro - hover states
      700: '#0369a1',  // Azul mais escuro - pressed states
      800: '#075985',  // Azul profundo - textos importantes
      900: '#0c4a6e',  // Azul muito escuro - headings
    },
  
    // 🎉 Cores de Sucesso - Gamificação e feedback positivo
    success: {
      50: '#f0fdf4',   // Verde clarinho - backgrounds de conquista
      100: '#dcfce7',  // Verde claro - notificações positivas
      200: '#bbf7d0',  // Verde suave - borders de sucesso
      300: '#86efac',  // Verde médio - ícones de check
      400: '#4ade80',  // Verde vibrante - botões de ação positiva
      500: '#22c55e',  // VERDE PRINCIPAL - confirmações, pontos
      600: '#16a34a',  // Verde escuro - hover em botões
      700: '#15803d',  // Verde mais escuro - pressed
      800: '#166534',  // Verde profundo - textos de sucesso
      900: '#14532d',  // Verde muito escuro
    },
  
    // ⚠️ Cores de Alerta - Estados de atenção
    warning: {
      50: '#fffbeb',   // Amarelo clarinho - backgrounds de aviso
      100: '#fef3c7',  // Amarelo claro - notificações de atenção
      200: '#fde68a',  // Amarelo suave - borders de warning
      300: '#fcd34d',  // Amarelo médio - ícones de atenção
      400: '#fbbf24',  // Amarelo vibrante - botões de alerta
      500: '#f59e0b',  // AMARELO PRINCIPAL - warnings importantes
      600: '#d97706',  // Amarelo escuro - hover
      700: '#b45309',  // Amarelo mais escuro - pressed
      800: '#92400e',  // Amarelo profundo - textos de alerta
      900: '#78350f',  // Amarelo muito escuro
    },
  
    // 🚨 Cores de Erro - Estados críticos
    error: {
      50: '#fef2f2',   // Vermelho clarinho - backgrounds de erro
      100: '#fee2e2',  // Vermelho claro - notificações de erro
      200: '#fecaca',  // Vermelho suave - borders de erro
      300: '#fca5a5',  // Vermelho médio - ícones de erro
      400: '#f87171',  // Vermelho vibrante - botões de ação crítica
      500: '#ef4444',  // VERMELHO PRINCIPAL - erros, exclusões
      600: '#dc2626',  // Vermelho escuro - hover em botões
      700: '#b91c1c',  // Vermelho mais escuro - pressed
      800: '#991b1b',  // Vermelho profundo - textos de erro
      900: '#7f1d1d',  // Vermelho muito escuro
    },
  
    // 🎨 Cores Neutras - Estrutura e tipografia
    neutral: {
      0: '#ffffff',    // Branco puro - backgrounds principais
      50: '#f9fafb',   // Cinza clarinho - backgrounds sutis
      100: '#f3f4f6',  // Cinza claro - separadores, cards
      200: '#e5e7eb',  // Cinza suave - borders, dividers
      300: '#d1d5db',  // Cinza médio - placeholders, disabled
      400: '#9ca3af',  // Cinza - textos secundários
      500: '#6b7280',  // CINZA PRINCIPAL - textos normais
      600: '#4b5563',  // Cinza escuro - textos importantes
      700: '#374151',  // Cinza mais escuro - subtítulos
      800: '#1f2937',  // Cinza profundo - títulos
      900: '#111827',  // Cinza muito escuro - headings principais
      950: '#030712',  // Quase preto - textos críticos
    },
  
    // ✨ Cores Especiais - Gamificação e momentos mágicos
    special: {
      gold: '#ffd700',      // Ouro - conquistas especiais, prêmios
      silver: '#c0c0c0',    // Prata - segundo lugar, medalhas
      bronze: '#cd7f32',    // Bronze - terceiro lugar
      diamond: '#b9f2ff',   // Diamante - conquistas raras
      rainbow: '#ff6b6b',   // Arco-íris - momentos especiais (gradiente)
      confetti: '#ff69b4',  // Confete - animações de celebração
    },
  
    // 🌈 Gradientes - Para momentos especiais
    gradients: {
      primary: ['#0ea5e9', '#0284c7'],           // Azul degradê
      success: ['#22c55e', '#16a34a'],           // Verde degradê
      celebration: ['#ff6b6b', '#ffd93d', '#6bcf7f'], // Arco-íris celebração
      night: ['#1f2937', '#111827'],             // Modo escuro (futuro)
      gold: ['#ffd700', '#ffed4e'],              // Dourado premium
    },
  
    // 📱 Cores do Sistema - Específicas para mobile
    system: {
      background: '#ffffff',      // Background principal do app
      surface: '#f9fafb',        // Surface de cards e containers
      surfaceVariant: '#f3f4f6', // Surface alternativa
      outline: '#e5e7eb',        // Bordas e separadores
      shadow: 'rgba(0, 0, 0, 0.1)', // Sombras padrão
      overlay: 'rgba(0, 0, 0, 0.5)', // Overlay para modais
      
      // Estados de interação
      pressed: 'rgba(14, 165, 233, 0.1)',  // Azul com 10% opacity
      hover: 'rgba(14, 165, 233, 0.05)',   // Azul com 5% opacity
      focus: 'rgba(14, 165, 233, 0.15)',   // Azul com 15% opacity
    },
  
    // 🎮 Cores da Gamificação
    gamification: {
      points: '#ffd700',        // Cor dos pontos
      streak: '#ff6b6b',        // Cor da sequência (streak)
      level: '#9333ea',         // Cor do nível/rank
      achievement: '#22c55e',   // Cor das conquistas
      challenge: '#f59e0b',     // Cor dos desafios
      bonus: '#ec4899',         // Cor dos bônus especiais
    },
  };
  
  // 🎯 Função helper para acessar cores facilmente
  export const getColor = (colorPath, opacity = 1) => {
    const keys = colorPath.split('.');
    let color = colors;
    
    for (const key of keys) {
      color = color[key];
      if (!color) {
        console.warn(`Cor não encontrada: ${colorPath}`);
        return colors.neutral[500]; // Fallback
      }
    }
    
    if (opacity < 1) {
      // Converte hex para rgba se necessário
      if (color.startsWith('#')) {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }
    }
    
    return color;
  };
  
  // 🌙 Modo escuro (preparado para futuro)
  export const darkColors = {
    ...colors,
    system: {
      background: '#111827',
      surface: '#1f2937',
      surfaceVariant: '#374151',
      outline: '#4b5563',
      shadow: 'rgba(0, 0, 0, 0.3)',
      overlay: 'rgba(0, 0, 0, 0.7)',
    },
  };
  
  export default colors;