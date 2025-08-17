// src/components/gamification/AchievementBadge.js
// 🏅 Componente Badge de Conquista
// Exibe conquistas com diferentes raridades e estados

import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import { ACHIEVEMENTS } from '../../services/gamification';

const AchievementBadge = ({ 
  achievementId,
  achievement = null,
  size = 'medium',
  unlocked = false,
  showProgress = false,
  progress = 0,
  onPress = null,
  style = {},
  animated = false,
  animationDelay = 0,
}) => {
  // 🎬 Animações
  const scaleAnim = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const shineAnim = useRef(new Animated.Value(0)).current;

  // 🏆 Obter dados da conquista
  const achievementData = achievement || 
    Object.values(ACHIEVEMENTS).find(a => a.id === achievementId) ||
    ACHIEVEMENTS.FIRST_DRAW;

  // 🎬 Animação de entrada
  useEffect(() => {
    if (animated) {
      const timeout = setTimeout(() => {
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
      }, animationDelay);

      return () => clearTimeout(timeout);
    }
  }, [animated, animationDelay]);

  // 🎬 Animação de brilho para desbloqueadas
  useEffect(() => {
    if (unlocked) {
      const startGlow = () => {
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]).start(() => startGlow());
      };

      const startShine = () => {
        Animated.timing(shineAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }).start(() => {
          shineAnim.setValue(0);
          setTimeout(startShine, 3000);
        });
      };

      startGlow();
      startShine();
    }
  }, [unlocked]);

  // 🌈 Obter cor por raridade
  const getRarityColor = (rarity) => {
    const rarityColors = {
      common: colors.neutral[500],
      uncommon: colors.success[500],
      rare: colors.primary[500],
      epic: colors.warning[500],
      legendary: colors.special.gold,
    };
    return rarityColors[rarity] || colors.neutral[500];
  };

  // 📏 Configurações por tamanho
  const sizeConfig = {
    small: {
      container: 60,
      icon: 24,
      title: typography.labelSmall,
      description: typography.labelSmall,
      padding: spacing.sm,
    },
    medium: {
      container: 80,
      icon: 32,
      title: typography.labelMedium,
      description: typography.labelSmall,
      padding: spacing.md,
    },
    large: {
      container: 100,
      icon: 40,
      title: typography.titleSmall,
      description: typography.labelMedium,
      padding: spacing.lg,
    },
  };

  const config = sizeConfig[size];
  const rarityColor = getRarityColor(achievementData.rarity);

  // 🎨 Estilos dinâmicos
  const containerStyle = [
    styles.container,
    {
      width: config.container,
      height: config.container,
      padding: config.padding,
      borderColor: unlocked ? rarityColor : colors.neutral[300],
      backgroundColor: unlocked ? rarityColor + '10' : colors.neutral[100],
    },
    unlocked && shadows.gamificationShadows.badge,
    !unlocked && styles.lockedContainer,
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
        {/* 🎭 Ícone da conquista */}
        <View style={styles.iconContainer}>
          <Text style={[
            styles.icon,
            { 
              fontSize: config.icon,
              opacity: unlocked ? 1 : 0.3,
            }
          ]}>
            {achievementData.icon}
          </Text>
          
          {/* 🔒 Indicador de bloqueado */}
          {!unlocked && (
            <View style={styles.lockOverlay}>
              <Text style={styles.lockIcon}>🔒</Text>
            </View>
          )}
        </View>

        {/* 📝 Informações (apenas para tamanhos maiores) */}
        {size !== 'small' && (
          <View style={styles.info}>
            <Text 
              style={[
                config.title,
                styles.title,
                { color: unlocked ? rarityColor : colors.neutral[500] }
              ]}
              numberOfLines={2}
            >
              {achievementData.name}
            </Text>
            
            {size === 'large' && (
              <Text 
                style={[
                  config.description,
                  styles.description,
                  { color: unlocked ? colors.neutral[600] : colors.neutral[400] }
                ]}
                numberOfLines={2}
              >
                {achievementData.description}
              </Text>
            )}
          </View>
        )}

        {/* 📊 Barra de progresso (se aplicável) */}
        {showProgress && progress > 0 && progress < 100 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${progress}%`,
                    backgroundColor: rarityColor,
                  }
                ]}
              />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
        )}

        {/* 💰 Pontos da conquista */}
        {unlocked && achievementData.points > 0 && (
          <View style={[styles.pointsBadge, { backgroundColor: rarityColor }]}>
            <Text style={styles.pointsText}>+{achievementData.points}</Text>
          </View>
        )}
      </Animated.View>

      {/* ✨ Efeito de brilho para desbloqueadas */}
      {unlocked && (
        <>
          <Animated.View
            style={[
              styles.glow,
              {
                opacity: glowAnim,
                borderColor: rarityColor,
              },
            ]}
          />
          
          <Animated.View
            style={[
              styles.shine,
              {
                opacity: shineAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 1, 0],
                }),
                transform: [
                  {
                    translateX: shineAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-config.container, config.container],
                    }),
                  },
                ],
              },
            ]}
          />
        </>
      )}
    </Component>
  );
};

const styles = {
  container: {
    borderRadius: spacing.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  
  lockedContainer: {
    opacity: 0.6,
  },
  
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
  },
  
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  
  icon: {
    textAlign: 'center',
  },
  
  lockOverlay: {
    position: 'absolute',
    top: 0,
    right: -5,
    backgroundColor: colors.neutral[800],
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  lockIcon: {
    fontSize: 10,
    color: colors.neutral[0],
  },
  
  info: {
    alignItems: 'center',
    flex: 1,
  },
  
  title: {
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  
  description: {
    textAlign: 'center',
    lineHeight: typography.labelSmall.fontSize * 1.2,
  },
  
  progressContainer: {
    width: '100%',
    marginTop: spacing.xs,
  },
  
  progressBar: {
    height: 3,
    backgroundColor: colors.neutral[200],
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  
  progressText: {
    ...typography.labelSmall,
    color: colors.neutral[600],
    textAlign: 'center',
    fontSize: 10,
  },
  
  pointsBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: spacing.sm,
    minWidth: 24,
    alignItems: 'center',
  },
  
  pointsText: {
    ...typography.labelSmall,
    color: colors.neutral[0],
    fontSize: 10,
    fontWeight: '600',
  },
  
  glow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: spacing.md + 2,
    borderWidth: 2,
  },
  
  shine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 20,
    backgroundColor: colors.neutral[0],
  },
};

export default AchievementBadge;