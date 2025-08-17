import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing } from '../../theme';

const { width, height } = Dimensions.get('window');

/**
 * 🔥 Componente de animação para bônus de sequência
 * Mostra uma animação especial quando o usuário mantém uma sequência
 */
export const StreakBonusAnimation = ({ 
  streak, 
  isVisible, 
  onAnimationComplete,
  position = 'center', // 'center', 'top', 'bottom'
  type = 'daily' // 'daily', 'weekly', 'monthly'
}) => {
  const fireAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const particlesAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      startAnimation();
    }
  }, [isVisible]);

  const startAnimation = () => {
    // Reset das animações
    fireAnim.setValue(0);
    textAnim.setValue(0);
    glowAnim.setValue(0);
    particlesAnim.setValue(0);

    // Sequência de animações
    Animated.sequence([
      // Fogo aparece
      Animated.timing(fireAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Glow effect
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Texto aparece
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Partículas
      Animated.timing(particlesAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Aguardar
      Animated.delay(1500),
      // Desaparecer
      Animated.parallel([
        Animated.timing(fireAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(textAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(particlesAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onAnimationComplete?.();
    });
  };

  if (!isVisible) return null;

  const getPositionStyle = () => {
    switch (position) {
      case 'top':
        return { top: height * 0.15 };
      case 'bottom':
        return { bottom: height * 0.15 };
      default:
        return { top: height * 0.35 };
    }
  };

  const getStreakIcon = () => {
    if (streak >= 100) return '🔥💯🔥';
    if (streak >= 50) return '🔥🔥🔥';
    if (streak >= 30) return '🔥🔥';
    if (streak >= 10) return '🔥';
    return '🔥';
  };

  const getStreakMessage = () => {
    if (streak >= 100) return 'INCRÍVEL!';
    if (streak >= 50) return 'ESPETACULAR!';
    if (streak >= 30) return 'FANTÁSTICO!';
    if (streak >= 10) return 'IMPRESSIONANTE!';
    return 'BOM TRABALHO!';
  };

  const getTypeColor = () => {
    switch (type) {
      case 'weekly':
        return colors.info.main;
      case 'monthly':
        return colors.warning.main;
      default:
        return colors.primary.main;
    }
  };

  return (
    <View style={[styles.container, getPositionStyle()]} pointerEvents="none">
      {/* Glow background */}
      <Animated.View
        style={[
          styles.glowBackground,
          {
            opacity: glowAnim,
            transform: [{ scale: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1.5],
            }) }],
          },
        ]}
      >
        <View style={[styles.glow, { backgroundColor: getTypeColor() }]} />
      </Animated.View>

      {/* Fogo principal */}
      <Animated.View
        style={[
          styles.fireContainer,
          {
            opacity: fireAnim,
            transform: [{ scale: fireAnim }],
          },
        ]}
      >
        <Text style={styles.fireIcon}>{getStreakIcon()}</Text>
      </Animated.View>

      {/* Texto da sequência */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: textAnim,
            transform: [{ translateY: textAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }) }],
          },
        ]}
      >
        <Text style={styles.streakMessage}>
          {getStreakMessage()}
        </Text>
        
        <Text style={styles.streakCount}>
          {streak} dias seguidos!
        </Text>
        
        <Text style={styles.streakType}>
          {type === 'daily' ? 'Sequência Diária' : 
           type === 'weekly' ? 'Sequência Semanal' : 'Sequência Mensal'}
        </Text>
      </Animated.View>

      {/* Partículas flutuantes */}
      <Animated.View
        style={[
          styles.particlesContainer,
          {
            opacity: particlesAnim,
          },
        ]}
      >
        {[...Array(12)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                backgroundColor: [
                  colors.primary.main,
                  colors.secondary.main,
                  colors.success.main,
                  colors.warning.main,
                  colors.info.main,
                ][index % 5],
                left: `${10 + index * 7}%`,
                animationDelay: `${index * 50}ms`,
                transform: [{ 
                  translateY: particlesAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -100 - Math.random() * 50],
                  })
                }],
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Bônus de pontos */}
      <Animated.View
        style={[
          styles.bonusContainer,
          {
            opacity: textAnim,
            transform: [{ scale: textAnim }],
          },
        ]}
      >
        <View style={[styles.bonusBadge, { backgroundColor: getTypeColor() }]}>
          <Text style={styles.bonusText}>
            +{Math.floor(streak * 1.5)} pts
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  glowBackground: {
    position: 'absolute',
    top: -50,
    left: -50,
    right: -50,
    bottom: -50,
  },
  glow: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    opacity: 0.15,
  },
  fireContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  fireIcon: {
    fontSize: 48,
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  streakMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary.main,
    textAlign: 'center',
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.bold,
  },
  streakCount: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.semiBold,
  },
  streakType: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    fontFamily: typography.fontFamily.medium,
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.8,
  },
  bonusContainer: {
    alignItems: 'center',
  },
  bonusBadge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    shadowColor: colors.primary.main,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  bonusText: {
    color: colors.common.white,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: typography.fontFamily.bold,
  },
});

export default StreakBonusAnimation;
