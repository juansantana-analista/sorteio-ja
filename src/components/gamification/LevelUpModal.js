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
 * 🎉 Modal de comemoração quando o usuário sobe de nível
 * Mostra animações e recompensas do novo nível
 */
export const LevelUpModal = ({ 
  isVisible, 
  onClose, 
  oldLevel, 
  newLevel, 
  rewards = [],
  onRewardsClaimed 
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;
  const rewardsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      startEntranceAnimation();
    }
  }, [isVisible]);

  const startEntranceAnimation = () => {
    // Reset das animações
    scaleAnim.setValue(0);
    opacityAnim.setValue(0);
    confettiAnim.setValue(0);
    rewardsAnim.setValue(0);

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
      // Confetti
      Animated.timing(confettiAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Recompensas
      Animated.timing(rewardsAnim, {
        toValue: 1,
        duration: 400,
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

  const handleClaimRewards = () => {
    onRewardsClaimed?.(rewards);
    handleClose();
  };

  const getLevelTitle = (level) => {
    const titles = {
      1: 'Iniciante',
      5: 'Aprendiz',
      10: 'Intermediário',
      15: 'Avançado',
      20: 'Expert',
      25: 'Mestre',
      30: 'Lendário',
      50: 'Divino',
      100: 'Supremo'
    };

    for (let i = level; i >= 1; i--) {
      if (titles[i]) return titles[i];
    }
    return 'Nível ' + level;
  };

  const getLevelColor = (level) => {
    if (level >= 50) return colors.success.main;
    if (level >= 30) return colors.warning.main;
    if (level >= 20) return colors.info.main;
    if (level >= 10) return colors.primary.main;
    return colors.secondary.main;
  };

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
          {/* Header com confetti */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: confettiAnim,
                transform: [{ scale: confettiAnim }],
              },
            ]}
          >
            <View style={styles.confettiContainer}>
              {[...Array(8)].map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.confetti,
                    {
                      backgroundColor: [
                        colors.primary.main,
                        colors.secondary.main,
                        colors.success.main,
                        colors.warning.main,
                        colors.info.main,
                      ][index % 5],
                      left: `${20 + index * 10}%`,
                      animationDelay: `${index * 100}ms`,
                    },
                  ]}
                />
              ))}
            </View>
            
            <Text style={styles.congratulationsText}>
              🎉 Parabéns! 🎉
            </Text>
          </Animated.View>

          {/* Conteúdo principal */}
          <View style={styles.content}>
            <View style={styles.levelContainer}>
              <Text style={styles.levelUpText}>
                Você subiu para o
              </Text>
              
              <View style={[styles.newLevelBadge, { backgroundColor: getLevelColor(newLevel) }]}>
                <Text style={styles.newLevelNumber}>{newLevel}</Text>
                <Text style={styles.newLevelTitle}>
                  {getLevelTitle(newLevel)}
                </Text>
              </View>
            </View>

            {/* Recompensas */}
            {rewards.length > 0 && (
              <Animated.View
                style={[
                  styles.rewardsContainer,
                  {
                    opacity: rewardsAnim,
                    transform: [{ translateY: rewardsAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }) }],
                  },
                ]}
              >
                <Text style={styles.rewardsTitle}>
                  🎁 Recompensas Desbloqueadas:
                </Text>
                
                {rewards.map((reward, index) => (
                  <View key={index} style={styles.rewardItem}>
                    <Text style={styles.rewardIcon}>{reward.icon}</Text>
                    <Text style={styles.rewardText}>{reward.description}</Text>
                  </View>
                ))}
              </Animated.View>
            )}

            {/* Estatísticas do nível */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Nível Anterior</Text>
                <Text style={styles.statValue}>{oldLevel}</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Novo Nível</Text>
                <Text style={[styles.statValue, { color: getLevelColor(newLevel) }]}>
                  {newLevel}
                </Text>
              </View>
            </View>
          </View>

          {/* Botões */}
          <View style={styles.buttonContainer}>
            {rewards.length > 0 ? (
              <TouchableOpacity
                style={[styles.button, styles.claimButton]}
                onPress={handleClaimRewards}
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
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.system.background,
    borderRadius: 20,
    padding: spacing.lg,
    margin: spacing.lg,
    maxWidth: width * 0.9,
    maxHeight: height * 0.8,
    ...shadows.large,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  confettiContainer: {
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    height: 40,
  },
  confetti: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  congratulationsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary.main,
    textAlign: 'center',
    fontFamily: typography.fontFamily.bold,
  },
  content: {
    alignItems: 'center',
  },
  levelContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  levelUpText: {
    fontSize: 18,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily.medium,
  },
  newLevelBadge: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: 25,
    alignItems: 'center',
    minWidth: 120,
  },
  newLevelNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.common.white,
    fontFamily: typography.fontFamily.bold,
  },
  newLevelTitle: {
    fontSize: 16,
    color: colors.common.white,
    fontWeight: '600',
    marginTop: 4,
    fontFamily: typography.fontFamily.medium,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.medium,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    fontFamily: typography.fontFamily.bold,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border.light,
    marginHorizontal: spacing.lg,
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

export default LevelUpModal;
