// src/theme/index.js
// 🎨 Sistema de Design - Sorteio Já
// Ponto de entrada centralizado para todos os componentes de tema

// 🔤 Importar componentes de tema diretamente
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { shadows } from './shadows';

/**
 * 🛡️ Função de segurança para acessar tipografia
 */
const getSafeTypography = () => {
  try {
    if (!typography || !typography.fontFamily) {
      console.warn('⚠️ Typography não está disponível, usando fallback');
      return {
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
    }
    
    // Verificar se todas as propriedades necessárias existem
    const requiredProps = ['regular', 'medium', 'semibold', 'bold', 'light', 'thin'];
    requiredProps.forEach(prop => {
      if (!typography.fontFamily[prop]) {
        console.warn(`⚠️ Propriedade de fonte ${prop} não encontrada, usando fallback`);
        typography.fontFamily[prop] = 'System';
      }
    });
    
    return typography;
  } catch (error) {
    console.error('❌ Erro crítico ao acessar tipografia:', error);
    return {
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
  }
};

/**
 * 🎨 Sistema de tema completo
 */
const theme = {
  colors,
  typography: getSafeTypography(),
  spacing,
  shadows,
};

// 📤 Exportações individuais diretas
export { colors };
export { spacing };
export { shadows };
export { typography };

// 📤 Exportação do tema completo
export { theme };

// 📤 Exportação padrão
export default theme;
