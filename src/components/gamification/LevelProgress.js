// src/components/gamification/LevelProgress.js
// 📈 Componente de Progresso de Nível
// Mostra nível atual e progresso para o próximo

import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';

const LevelProgress = ({ 
  level = { level: 1, name: 'Iniciante', icon: '🌱', color: '#22c55e' },
  progress = { current: 0, total: 100, percentage: 0, nextLevel: null },
  size = 'medium',
  onPress = null,
  style = {},
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // 🎬 Animar progresso
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress.percentage / 100,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress.percentage]);

  // 🎬 Animação de hover/press
  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  // 📏 Configurações por tamanho
  const sizeConfig = {
    small: {
      container: { minHeight: 60 },
      icon: 20,
      levelText: typography.titleSmall,
      nameText: typography.labelSmall,
      progressHeight: 4,
    },
    medium: {
      container: { minHeight: 80 },
      icon: 24,
      levelText: typography.titleMedium,
      nameText: typography.labelMedium,
      progressHeight: 6,
    },
    large: {
      container: { minHeight: 100 },
      icon: 32,
      levelText: typography.titleLarge,
      nameText: typography.titleSmall,
      progressHeight: 8,
    },
  };

  const config = sizeConfig[size];

  const containerStyle = [
    styles.container,
    config.container,
    { borderColor: level.color + '30' },
    style,
  ];

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component 
      onPress={onPress}
      onPressIn={onPress ? handlePressIn : undefined}
      onPressOut={onPress ? handlePressOut : undefined}
      style={containerStyle}
    >
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* 🏷️ Header com nível */}
        <View style={styles.header}>
          <View style={styles.levelInfo}>
            <Text style={[styles.icon, { fontSize: config.icon }]}>
              {level.icon}
            </Text>
            <View style={styles.levelText}>
              <Text style={[config.levelText, { color: level.color }]}>
                Nível {level.level}
              </Text>
              <Text style={[config.nameText, styles.levelName]}>
                {level.name}
              </Text>
            </View>
          </View>
          
          <Text style={[styles.percentage, { color: level.color }]}>
            {Math.round(progress.percentage)}%
          </Text>
        </View>

        {/* 📊 Barra de progresso */}
        <View style={styles.progressContainer}>
          <View style={[
            styles.progressBar,
            { height: config.progressHeight }
          ]}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: level.color,
                  height: config.progressHeight,
                },
              ]}
            />
          </View>
          
          {/* 📈 Info do progresso */}
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {progress.current.toLocaleString('pt-BR')} / {progress.total.toLocaleString('pt-BR')}
            </Text>
            
            {progress.nextLevel && (
              <Text style={styles.nextLevelText}>
                Próximo: {progress.nextLevel.name}
              </Text>
            )}
          </View>
        </View>
      </Animated.View>
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
  
  content: {
    // Layout já definido pelos filhos
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  icon: {
    marginRight: spacing.sm,
  },
  
  levelText: {
    flex: 1,
  },
  
  levelName: {
    color: colors.neutral[600],
    marginTop: spacing.xs,
  },
  
  percentage: {
    fontWeight: '600',
    fontSize: 16,
  },
  
  progressContainer: {
    // Layout já definido pelos filhos
  },
  
  progressBar: {
    backgroundColor: colors.neutral[200],
    borderRadius: spacing.xs,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  
  progressFill: {
    borderRadius: spacing.xs,
  },
  
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  progressText: {
    ...typography.labelSmall,
    color: colors.neutral[600],
  },
  
  nextLevelText: {
    ...typography.labelSmall,
    color: colors.primary[600],
    fontWeight: '500',
  },
};

export default LevelProgress;