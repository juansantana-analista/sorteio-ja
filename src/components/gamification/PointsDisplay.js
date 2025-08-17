// src/components/gamification/PointsDisplay.js
// 💰 Componente de Exibição de Pontos
// Mostra pontos do usuário com animações e formatação especial

import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';

const PointsDisplay = ({ 
  points = 0, 
  size = 'medium', 
  animated = false,
  onPress = null,
  showLabel = true,
  style = {},
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // 🎬 Animação quando pontos mudam
  useEffect(() => {
    if (animated && points > 0) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Brilho contínuo
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [points, animated]);

  // 📏 Configurações por tamanho
  const sizeConfig = {
    small: {
      container: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
      points: typography.titleSmall,
      label: typography.labelSmall,
      icon: 16,
    },
    medium: {
      container: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
      points: typography.titleLarge,
      label: typography.labelMedium,
      icon: 20,
    },
    large: {
      container: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
      points: typography.headlineSmall,
      label: typography.titleSmall,
      icon: 24,
    },
  };

  const config = sizeConfig[size];

  // 💰 Formatar pontos
  const formatPoints = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString('pt-BR');
  };

  const containerStyle = [
    styles.container,
    config.container,
    shadows.gamificationShadows.points,
    style,
  ];

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component onPress={onPress} style={containerStyle}>
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.pointsRow}>
          <Text style={[styles.icon, { fontSize: config.icon }]}>💰</Text>
          <Text style={[config.points, styles.pointsText]}>
            {formatPoints(points)}
          </Text>
        </View>
        
        {showLabel && (
          <Text style={[config.label, styles.label]}>
            Pontos
          </Text>
        )}
      </Animated.View>

      {animated && (
        <Animated.View
          style={[
            styles.glow,
            {
              opacity: glowAnim,
            },
          ]}
        />
      )}
    </Component>
  );
};

const styles = {
  container: {
    backgroundColor: colors.gamification.points + '15',
    borderRadius: spacing.md,
    borderWidth: 1,
    borderColor: colors.gamification.points + '30',
  },
  
  content: {
    alignItems: 'center',
  },
  
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  icon: {
    marginRight: spacing.xs,
  },
  
  pointsText: {
    color: colors.gamification.points,
    fontWeight: '700',
  },
  
  label: {
    color: colors.neutral[600],
    marginTop: spacing.xs,
  },
  
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.gamification.points + '20',
    borderRadius: spacing.md,
  },
};

export default PointsDisplay;