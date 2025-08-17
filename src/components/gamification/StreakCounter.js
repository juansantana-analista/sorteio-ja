// src/components/gamification/StreakCounter.js
// 🔥 Componente de Contador de Sequência
// Mostra dias consecutivos de sorteios com avisos

import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';

const StreakCounter = ({ 
  streak = 0,
  isAtRisk = false,
  onPress = null,
  style = {},
}) => {
  const flameAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const warningAnim = useRef(new Animated.Value(0)).current;

  // 🎬 Animação da chama
  useEffect(() => {
    if (streak > 0) {
      const startFlameAnimation = () => {
        Animated.sequence([
          Animated.timing(flameAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(flameAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start(() => startFlameAnimation());
      };
      startFlameAnimation();
    }
  }, [streak]);

  // 🎬 Animação de aviso
  useEffect(() => {
    if (isAtRisk) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(warningAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(warningAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      warningAnim.setValue(0);
    }
  }, [isAtRisk]);

  // 🎨 Obter cor baseada no streak
  const getStreakColor = () => {
    if (isAtRisk) return colors.warning[500];
    if (streak === 0) return colors.neutral[400];
    if (streak < 3) return colors.gamification.streak;
    if (streak < 7) return colors.warning[500];
    if (streak < 30) return colors.success[500];
    return colors.special.gold;
  };

  // 🔥 Obter ícone baseado no streak
  const getStreakIcon = () => {
    if (streak === 0) return '🔥';
    if (streak < 3) return '🔥';
    if (streak < 7) return '🔥🔥';
    if (streak < 30) return '🔥🔥🔥';
    return '🔥🔥🔥🔥';
  };

  // 📝 Obter texto de status
  const getStatusText = () => {
    if (isAtRisk) return 'Em risco!';
    if (streak === 0) return 'Comece hoje!';
    if (streak === 1) return 'Primeiro dia!';
    return `${streak} dias seguidos!`;
  };

  const streakColor = getStreakColor();
  const containerStyle = [
    styles.container,
    { borderColor: streakColor + '30' },
    isAtRisk && styles.riskContainer,
    style,
  ];

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component onPress={onPress} style={containerStyle}>
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        {/* 🔥 Ícone da chama */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: flameAnim }],
            },
          ]}
        >
          <Text style={styles.icon}>
            {getStreakIcon()}
          </Text>
        </Animated.View>

        {/* 📊 Informações do streak */}
        <View style={styles.info}>
          <Text style={[styles.streakNumber, { color: streakColor }]}>
            {streak}
          </Text>
          <Text style={styles.streakLabel}>
            Sequência
          </Text>
          <Text style={[styles.statusText, { color: streakColor }]}>
            {getStatusText()}
          </Text>
        </View>

        {/* ⚠️ Indicador de risco */}
        {isAtRisk && (
          <Animated.View
            style={[
              styles.warningIndicator,
              {
                opacity: warningAnim,
              },
            ]}
          >
            <Text style={styles.warningIcon}>⚠️</Text>
          </Animated.View>
        )}
      </Animated.View>

      {/* 📈 Marcos de streak */}
      {streak > 0 && (
        <View style={styles.milestones}>
          {[3, 7, 14, 30].map((milestone) => (
            <View
              key={milestone}
              style={[
                styles.milestone,
                streak >= milestone && styles.milestoneActive,
              ]}
            >
              <Text style={[
                styles.milestoneText,
                streak >= milestone && styles.milestoneTextActive,
              ]}>
                {milestone}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Component>
  );
};

const styles = {
  container: {
    backgroundColor: colors.system.surface,
    borderRadius: spacing.md,
    borderWidth: 1,
    padding: spacing.md,
    ...shadows.subtle,
  },
  
  riskContainer: {
    backgroundColor: colors.warning[50],
  },
  
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  iconContainer: {
    marginRight: spacing.md,
  },
  
  icon: {
    fontSize: 28,
  },
  
  info: {
    flex: 1,
  },
  
  streakNumber: {
    ...typography.headlineSmall,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  
  streakLabel: {
    ...typography.labelMedium,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },
  
  statusText: {
    ...typography.labelSmall,
    fontWeight: '500',
  },
  
  warningIndicator: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  
  warningIcon: {
    fontSize: 16,
  },
  
  milestones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  
  milestone: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  milestoneActive: {
    backgroundColor: colors.gamification.streak,
  },
  
  milestoneText: {
    ...typography.labelSmall,
    color: colors.neutral[500],
    fontSize: 10,
    fontWeight: '600',
  },
  
  milestoneTextActive: {
    color: colors.neutral[0],
  },
};

export default StreakCounter;