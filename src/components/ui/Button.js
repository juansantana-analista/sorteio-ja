// src/components/ui/Button.js
// 🔘 Componente Button - Sistema base de botões do Sorteio Já
// Suporte completo para diferentes variantes, estados e animações

import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  Animated,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { shadows, getShadowForState } from '../../theme/shadows';
import { animations, durations, easings } from '../../theme/animations';

/**
 * 🔘 Componente Button Versátil
 * 
 * @param {Object} props
 * @param {string} props.title - Texto do botão
 * @param {Function} props.onPress - Função executada no press
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'} props.variant - Variante visual
 * @param {'small'|'medium'|'large'} props.size - Tamanho do botão
 * @param {boolean} props.disabled - Se o botão está desabilitado
 * @param {boolean} props.loading - Se está mostrando loading
 * @param {ReactNode} props.icon - Ícone do botão (componente)
 * @param {'left'|'right'|'top'|'bottom'} props.iconPosition - Posição do ícone
 * @param {string} props.testID - ID para testes
 * @param {Object} props.style - Estilos customizados
 * @param {Object} props.textStyle - Estilos do texto customizados
 * @param {boolean} props.fullWidth - Se ocupa toda a largura
 * @param {boolean} props.celebration - Se ativa animação de celebração
 */
const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  testID,
  style = {},
  textStyle = {},
  fullWidth = false,
  celebration = false,
  ...rest
}) => {
  // 🎬 Refs para animações
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const celebrationAnim = useRef(new Animated.Value(1)).current;

  // 🎨 Configurações visuais por variante
  const variantStyles = {
    primary: {
      backgroundColor: disabled ? colors.neutral[300] : colors.primary[500],
      borderColor: disabled ? colors.neutral[300] : colors.primary[500],
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: disabled ? colors.neutral[100] : colors.primary[50],
      borderColor: disabled ? colors.neutral[200] : colors.primary[200],
      borderWidth: 1,
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: disabled ? colors.neutral[300] : colors.primary[500],
      borderWidth: 1.5,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderWidth: 0,
    },
    danger: {
      backgroundColor: disabled ? colors.neutral[300] : colors.error[500],
      borderColor: disabled ? colors.neutral[300] : colors.error[500],
      borderWidth: 0,
    },
    success: {
      backgroundColor: disabled ? colors.neutral[300] : colors.success[500],
      borderColor: disabled ? colors.neutral[300] : colors.success[500],
      borderWidth: 0,
    },
    warning: {
      backgroundColor: disabled ? colors.neutral[300] : colors.warning[500],
      borderColor: disabled ? colors.neutral[300] : colors.warning[500],
      borderWidth: 0,
    },
  };

  // ✍️ Estilos de texto por variante
  const textVariantStyles = {
    primary: {
      color: disabled ? colors.neutral[500] : colors.neutral[0],
    },
    secondary: {
      color: disabled ? colors.neutral[400] : colors.primary[600],
    },
    outline: {
      color: disabled ? colors.neutral[400] : colors.primary[600],
    },
    ghost: {
      color: disabled ? colors.neutral[400] : colors.primary[600],
    },
    danger: {
      color: disabled ? colors.neutral[500] : colors.neutral[0],
    },
    success: {
      color: disabled ? colors.neutral[500] : colors.neutral[0],
    },
    warning: {
      color: disabled ? colors.neutral[500] : colors.neutral[0],
    },
  };

  // 📏 Configurações de tamanho
  const sizeStyles = {
    small: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      borderRadius: spacing.sm,
      minHeight: 36,
    },
    medium: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: spacing.sm,
      minHeight: 44,
    },
    large: {
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing['2xl'],
      borderRadius: spacing.md,
      minHeight: 52,
    },
  };

  // ✍️ Tipografia por tamanho
  const textSizeStyles = {
    small: typography.labelSmall,
    medium: typography.labelLarge,
    large: typography.titleSmall,
  };

  // 🎬 Animações de press
  const handlePressIn = () => {
    if (disabled || loading) return;
    
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: animations.button.press.scale,
        duration: animations.button.press.duration,
        easing: easings.sharp,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: animations.button.press.opacity,
        duration: animations.button.press.duration,
        easing: easings.sharp,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: animations.button.release.duration,
        easing: easings.easeOut,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: animations.button.release.duration,
        easing: easings.easeOut,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 🎊 Animação de celebração
  const handleCelebrationAnimation = () => {
    if (!celebration) return;
    
    Animated.sequence([
      Animated.timing(celebrationAnim, {
        toValue: 1.1,
        duration: durations.fast,
        easing: easings.easeOut,
        useNativeDriver: true,
      }),
      Animated.timing(celebrationAnim, {
        toValue: 1,
        duration: durations.normal,
        easing: easings.bounce,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 🎯 Handler do press principal
  const handlePress = () => {
    if (disabled || loading) return;
    
    // Feedback háptico
    if (Platform.OS === 'ios') {
      // Implementar feedback háptico no futuro
    }
    
    // Animação de celebração se necessário
    if (celebration) {
      handleCelebrationAnimation();
    }
    
    // Executar função do press
    onPress && onPress();
  };

  // 🎨 Montagem dos estilos finais
  const containerStyle = [
    styles.base,
    sizeStyles[size],
    variantStyles[variant],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    getShadowForState('button', disabled ? 'disabled' : 'default'),
    style,
  ];

  const finalTextStyle = [
    styles.text,
    textSizeStyles[size],
    textVariantStyles[variant],
    textStyle,
  ];

  // 🔄 Renderização do conteúdo do botão
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size={size === 'small' ? 'small' : 'small'}
            color={textVariantStyles[variant].color}
            style={styles.loadingSpinner}
          />
          {title && (
            <Text style={[finalTextStyle, styles.loadingText]}>
              {title}
            </Text>
          )}
        </View>
      );
    }

    const content = [];
    
    // Ícone à esquerda ou em cima
    if (icon && (iconPosition === 'left' || iconPosition === 'top')) {
      content.push(
        React.cloneElement(icon, {
          key: 'icon',
          style: [
            styles.icon,
            iconPosition === 'top' ? styles.iconTop : styles.iconLeft,
            icon.props.style,
          ],
        })
      );
    }
    
    // Texto
    if (title) {
      content.push(
        <Text key="text" style={finalTextStyle}>
          {title}
        </Text>
      );
    }
    
    // Ícone à direita ou embaixo
    if (icon && (iconPosition === 'right' || iconPosition === 'bottom')) {
      content.push(
        React.cloneElement(icon, {
          key: 'icon',
          style: [
            styles.icon,
            iconPosition === 'bottom' ? styles.iconBottom : styles.iconRight,
            icon.props.style,
          ],
        })
      );
    }
    
    return (
      <View style={[
        styles.contentContainer,
        (iconPosition === 'top' || iconPosition === 'bottom') && styles.contentVertical
      ]}>
        {content}
      </View>
    );
  };

  return (
    <Animated.View
      style={{
        transform: [
          { scale: scaleAnim },
          { scale: celebrationAnim },
        ],
        opacity: opacityAnim,
      }}
    >
      <TouchableOpacity
        style={containerStyle}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
        testID={testID}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading }}
        accessibilityLabel={title}
        {...rest}
      >
        {renderContent()}
      </TouchableOpacity>
    </Animated.View>
  );
};

// 🎨 Estilos do componente
const styles = {
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  
  fullWidth: {
    width: '100%',
  },
  
  disabled: {
    opacity: 0.6,
  },
  
  text: {
    textAlign: 'center',
    fontWeight: '600',
  },
  
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  contentVertical: {
    flexDirection: 'column',
  },
  
  icon: {
    // Estilos base do ícone
  },
  
  iconLeft: {
    marginRight: spacing.sm,
  },
  
  iconRight: {
    marginLeft: spacing.sm,
  },
  
  iconTop: {
    marginBottom: spacing.xs,
  },
  
  iconBottom: {
    marginTop: spacing.xs,
  },
  
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  loadingSpinner: {
    marginRight: spacing.sm,
  },
  
  loadingText: {
    opacity: 0.8,
  },
};

export default Button;