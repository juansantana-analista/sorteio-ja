import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  Animated, 
  StyleSheet, 
  Dimensions,
  TouchableOpacity,
  Image
} from 'react-native';
import { colors, typography, spacing, shadows } from '../../theme';

const { width, height } = Dimensions.get('window');

/**
 * 🏆 Modal de comemoração quando o usuário desbloqueia uma conquista
 * Mostra animações e detalhes da conquista desbloqueada
 */
export const AchievementUnlockedModal = ({ 
  isVisible, 
  onClose, 
  achievement,
  onRewardClaimed 
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      startEntranceAnimation();
    }
  }, [isVisible]);

  const startEntranceAnimation = () => {
    // Reset das animações
    scaleAnim.setValue(0);
    opacityAnim.setValue(0);
    glowAnim.setValue(0);
    contentAnim.setValue(0);
    sparkleAnim.setValue(0);

    // Sequência de animações
    Animated.sequence([
      // Aparecer com escala
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // Glow effect
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Conteúdo
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Sparkles
      Animated.timing(sparkleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleClaimReward = () => {
    onRewardClaimed?.(achievement);
    handleClose();
  };

  const getAchievementRarity = (rarity) => {
    const rarities = {
      common: { color: colors.text.secondary, label: 'Comum' },
      rare: { color: colors.info.main, label: 'Rara' },
      epic: { color: colors.warning.main, label: 'Épica' },
      legendary: { color: colors.success.main, label: 'Lendária' },
      mythical: { color: colors.primary.main, label: 'Mítica' }
    };
    return rarities[rarity] || rarities.common;
  };

  const getAchievementIcon = (type) => {
    const icons = {
      streak: '🔥',
      level: '⭐',
      points: '💎',
      special: '🎯',
      social: '🤝',
      challenge: '🏆',
      first: '🥇',
      milestone: '🎖️'
    };
    return icons[type] || '🏆';
  };

  if (!achievement) return null;

  const rarity = getAchievementRarity(achievement.rarity);
  const icon = getAchievementIcon(achievement.type);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Glow effect */}
          <Animated.View
            style={[
              styles.glowContainer,
              {
                opacity: glowAnim,
                transform: [{ scale: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1.2],
                }) }],
              },
            ]}
          >
            <View style={[styles.glow, { backgroundColor: rarity.color }]} />
          </Animated.View>

          {/* Header com sparkles */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: contentAnim,
                transform: [{ translateY: contentAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }) }],
              },
            ]}
          >
            <View style={styles.sparkleContainer}>
              {[...Array(6)].map((_, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.sparkle,
                    {
                      opacity: sparkleAnim,
                      transform: [{ 
                        rotate: sparkleAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '360deg'],
                        })
                      }],
                      left: `${15 + index * 15}%`,
                      animationDelay: `${index * 100}ms`,
                    },
                  ]}
                >
                  <Text style={styles.sparkleText}>✨</Text>
                </Animated.View>
              ))}
            </View>
            
            <Text style={styles.achievementUnlockedText}>
              🎉 Conquista Desbloqueada! 🎉
            </Text>
          </Animated.View>

          {/* Conteúdo principal */}
          <Animated.View
            style={[
              styles.content,
              {
                opacity: contentAnim,
                transform: [{ translateY: contentAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }) }],
              },
            ]}
          >
            {/* Badge da conquista */}
            <View style={styles.achievementBadge}>
              <View style={[styles.iconContainer, { backgroundColor: rarity.color }]}>
                <Text style={styles.achievementIcon}>{icon}</Text>
              </View>
              
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementName}>
                  {achievement.name}
                </Text>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
                
                <View style={[styles.rarityBadge, { backgroundColor: rarity.color }]}>
                  <Text style={styles.rarityText}>{rarity.label}</Text>
                </View>
              </View>
            </View>

            {/* Detalhes da conquista */}
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Tipo</Text>
                <Text style={styles.detailValue}>{achievement.type}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Raridade</Text>
                <Text style={[styles.detailValue, { color: rarity.color }]}>
                  {rarity.label}
                </Text>
              </View>
              
              {achievement.points && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Pontos</Text>
                  <Text style={styles.detailValue}>+{achievement.points}</Text>
                </View>
              )}
            </View>

            {/* Recompensas */}
            {achievement.rewards && achievement.rewards.length > 0 && (
              <View style={styles.rewardsContainer}>
                <Text style={styles.rewardsTitle}>
                  🎁 Recompensas:
                </Text>
                
                {achievement.rewards.map((reward, index) => (
                  <View key={index} style={styles.rewardItem}>
                    <Text style={styles.rewardIcon}>{reward.icon}</Text>
                    <Text style={styles.rewardText}>{reward.description}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Estatísticas */}
            {achievement.stats && (
              <View style={styles.statsContainer}>
                <Text style={styles.statsTitle}>
                  📊 Estatísticas:
                </Text>
                
                {Object.entries(achievement.stats).map(([key, value]) => (
                  <View key={key} style={styles.statItem}>
                    <Text style={styles.statLabel}>{key}</Text>
                    <Text style={styles.statValue}>{value}</Text>
                  </View>
                ))}
              </View>
            )}
          </Animated.View>

          {/* Botões */}
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                opacity: contentAnim,
                transform: [{ translateY: contentAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }) }],
              },
            ]}
          >
            {achievement.rewards && achievement.rewards.length > 0 ? (
              <TouchableOpacity
                style={[styles.button, styles.claimButton]}
                onPress={handleClaimReward}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>🎁 Coletar Recompensas</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.continueButton]}
                onPress={handleClose}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Continuar</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.system.background,
    borderRadius: 20,
    padding: spacing.lg,
    margin: spacing.lg,
    maxWidth: width * 0.9,
    maxHeight: height * 0.85,
    ...shadows.large,
    position: 'relative',
  },
  glowContainer: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    opacity: 0.1,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sparkleContainer: {
    position: 'absolute',
    top: -30,
    left: 0,
    right: 0,
    height: 60,
  },
  sparkle: {
    position: 'absolute',
    top: 0,
  },
  sparkleText: {
    fontSize: 20,
  },
  achievementUnlockedText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary.main,
    textAlign: 'center',
    fontFamily: typography.fontFamily.bold,
  },
  content: {
    alignItems: 'center',
  },
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.system.surface,
    padding: spacing.lg,
    borderRadius: 16,
    marginBottom: spacing.lg,
    width: '100%',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  achievementIcon: {
    fontSize: 32,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.bold,
  },
  achievementDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    fontFamily: typography.fontFamily.medium,
    lineHeight: 22,
  },
  rarityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  rarityText: {
    color: colors.common.white,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: typography.fontFamily.semiBold,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: spacing.lg,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.medium,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    fontFamily: typography.fontFamily.semiBold,
  },
  rewardsContainer: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  rewardsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
    fontFamily: typography.fontFamily.semiBold,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.system.surface,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  rewardIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  rewardText: {
    fontSize: 16,
    color: colors.text.primary,
    flex: 1,
    fontFamily: typography.fontFamily.medium,
  },
  statsContainer: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
    fontFamily: typography.fontFamily.semiBold,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.system.surface,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  statLabel: {
    fontSize: 16,
    color: colors.text.secondary,
    fontFamily: typography.fontFamily.medium,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    fontFamily: typography.fontFamily.semiBold,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimButton: {
    backgroundColor: colors.success.main,
  },
  continueButton: {
    backgroundColor: colors.primary.main,
  },
  buttonText: {
    color: colors.common.white,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: typography.fontFamily.semiBold,
  },
});

export default AchievementUnlockedModal;
