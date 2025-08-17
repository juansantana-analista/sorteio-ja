// src/components/ui/Card.js
// 🃏 Componente Card - Container versátil para conteúdo do Sorteio Já
// Suporte para diferentes variantes, estados interativos e animações

import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { shadows, getShadowForState } from '../../theme/shadows';
import { animations, durations, easings } from '../../theme/animations';

/**
 * 🃏 Componente Card Versátil
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - Conteúdo do card
 * @param {Function} props.onPress - Função executada no press (torna o card clicável)
 * @param {'default'|'elevated'|'outlined'|'filled'} props.variant - Variante visual
 * @param {'small'|'medium'|'large'} props.padding - Tamanho do padding interno
 * @param {boolean} props.selected - Se o card está selecionado
 * @param {boolean} props.disabled - Se o card está desabilitado
 * @param {string} props.testID - ID para testes
 * @param {Object} props.style - Estilos customizados
 * @param {boolean} props.animated - Se deve mostrar animação de entrada
 * @param {number} props.animationDelay - Delay da animação de entrada
 * @param {'celebration'|'success'|'warning'|'error'} props.specialState - Estados especiais
 * @param {boolean} props.pressable - Se deve ter feedback visual ao pressionar
 */
const Card = ({
  children,
  onPress,
  variant = 'default',
  padding = 'medium',
  selected = false,
  disabled = false,
  testID,
  style = {},
  animated = false,
  animationDelay = 0,
  specialState = null,
  pressable = true,
  ...rest
}) => {
  // 🎬 Refs para animações
  const scaleAnim = useRef(new Animated.Value(animated ? 0.9 : 1)).current;
  const opacityAnim = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const translateYAnim = useRef(new Animated.Value(animated ? 20 : 0)).current;
  const selectedAnim = useRef(new Animated.Value(selected ? 1 : 0)).current;

  // 🎨 Configurações visuais por variante
  const variantStyles = {
    default: {
      backgroundColor: colors.system.background,
      borderColor: colors.system.outline,
      borderWidth: 1,
    },
    elevated: {
      backgroundColor: colors.system.background,
      borderColor: 'transparent',
      borderWidth: 0,
    },
    outlined: {
      backgroundColor: 'transparent',
      borderColor: colors.system.outline,
      borderWidth: 1.5,
    },
    filled: {
      backgroundColor: colors.system.surface,
      borderColor: colors.system.outline,
      borderWidth: 1,
    },
  };

  // 🌈 Estilos para estados especiais
  const specialStateStyles = {
    celebration: {
      borderColor: colors.special.gold,
      backgroundColor: colors.special.gold + '10', // 10% opacity
    },
    success: {
      borderColor: colors.success[300],
      backgroundColor: colors.success[50],
    },
    warning: {
      borderColor: colors.warning[300],
      backgroundColor: colors.warning[50],
    },
    error: {
      borderColor: colors.error[300],
      backgroundColor: colors.error[50],
    },
  };

  // 📏 Configurações de padding
  const paddingStyles = {
    small: {
      padding: spacing.md,
    },
    medium: {
      padding: spacing.lg,
    },
    large: {
      padding: spacing.xl,
    },
  };

  // 🎬 Animação de entrada
  useEffect(() => {
    if (animated) {
      const timeout = setTimeout(() => {
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: animations.card.appear.duration,
            easing: easings.easeOut,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: animations.card.appear.duration,
            easing: easings.easeOut,
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: 0,
            duration: animations.card.appear.duration,
            easing: easings.easeOut,
            useNativeDriver: true,
          }),
        ]).start();
      }, animationDelay);

      return () => clearTimeout(timeout);
    }
  }, [animated, animationDelay]);

  // 🎯 Animação de seleção
  useEffect(() => {
    Animated.timing(selectedAnim, {
      toValue: selected ? 1 : 0,
      duration: durations.normal,
      easing: easings.easeInOut,
      useNativeDriver: false, // borderWidth não funciona com native driver
    }).start();
  }, [selected]);

  // 🎬 Animações de press
  const handlePressIn = () => {
    if (disabled || !onPress || !pressable) return;
    
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: animations.card.hover.scale,
        duration: durations.fast,
        easing: easings.easeOut,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: animations.card.hover.translateY,
        duration: durations.fast,
        easing: easings.easeOut,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled || !onPress || !pressable) return;
    
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: durations.fast,
        easing: easings.easeOut,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: durations.fast,
        easing: easings.easeOut,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 🎯 Handler do press principal
  const handlePress = () => {
    if (disabled) return;
    
    // Feedback háptico
    if (Platform.OS === 'ios') {
      // Implementar feedback háptico no futuro
    }
    
    onPress && onPress();
  };

  // 🎨 Montagem dos estilos finais
  const containerStyle = [
    styles.base,
    variantStyles[variant],
    paddingStyles[padding],
    specialState && specialStateStyles[specialState],
    disabled && styles.disabled,
    {
      // Animação de seleção
      borderWidth: selectedAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [variantStyles[variant].borderWidth, 3],
      }),
      borderColor: selectedAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [
          specialState ? specialStateStyles[specialState].borderColor : variantStyles[variant].borderColor,
          colors.primary[500],
        ],
      }),
    },
    // Sombra baseada no estado
    getShadowForState('card', selected ? 'selected' : disabled ? 'disabled' : 'default'),
    style,
  ];

  // 🎯 Renderização do componente
  const CardComponent = (
    <Animated.View
      style={[
        containerStyle,
        {
          transform: [
            { scale: scaleAnim },
            { translateY: translateYAnim },
          ],
          opacity: opacityAnim,
        },
      ]}
    >
      {children}
    </Animated.View>
  );

  // Se tem onPress, envolver em TouchableOpacity
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={pressable ? 0.9 : 1}
        testID={testID}
        accessibilityRole="button"
        accessibilityState={{ 
          disabled: disabled,
          selected: selected,
        }}
        {...rest}
      >
        {CardComponent}
      </TouchableOpacity>
    );
  }

  // Senão, retorna apenas a View
  return (
    <View testID={testID} {...rest}>
      {CardComponent}
    </View>
  );
};

// 🎨 Estilos do componente
const styles = {
  base: {
    borderRadius: spacing.md,
    overflow: 'hidden',
  },
  
  disabled: {
    opacity: 0.6,
  },
};

// 🎯 Componentes especializados derivados do Card

/**
 * 🏆 Card para resultados de sorteio
 */
export const ResultCard = ({ winner, ...props }) => (
  <Card
    variant="elevated"
    padding="large"
    specialState="celebration"
    animated={true}
    {...props}
  >
    {props.children}
  </Card>
);

/**
 * 📊 Card para estatísticas/gamificação
 */
export const StatsCard = ({ value, label, ...props }) => (
  <Card
    variant="filled"
    padding="medium"
    {...props}
  >
    {props.children}
  </Card>
);

/**
 * 🎮 Card para conquistas
 */
export const AchievementCard = ({ unlocked = false, ...props }) => (
  <Card
    variant="elevated"
    padding="medium"
    specialState={unlocked ? "success" : null}
    disabled={!unlocked}
    animated={unlocked}
    {...props}
  >
    {props.children}
  </Card>
);

/**
 * 📝 Card para listas de sorteio
 */
export const ListCard = ({ selected = false, ...props }) => (
  <Card
    variant="default"
    padding="medium"
    selected={selected}
    animated={true}
    {...props}
  >
    {props.children}
  </Card>
);

/**
 * ⚠️ Card para alertas e avisos
 */
export const AlertCard = ({ type = "warning", ...props }) => (
  <Card
    variant="outlined"
    padding="medium"
    specialState={type}
    {...props}
  >
    {props.children}
  </Card>
);

export default Card;