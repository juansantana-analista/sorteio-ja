// src/components/gamification/WeeklyChallengeCard.js
// 📅 Componente Card de Desafio Semanal
// Mostra desafio atual com progresso e tempo restante

import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';

const WeeklyChallengeCard = ({ 
  challenge,
  progress = 0, // 0-100
  timeLeft = { days: 0, hours: 0, expired: false },
  onPress = null,
  style = {},
}) => {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // ⏰ Atualizar tempo a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000); // 1 minuto

    return () => clearInterval(interval);
  }, []);

  // 🎬 Animar progresso
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress / 100,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  // 🎬 Pulso para desafios próximos do fim
  useEffect(() => {
    if (timeLeft.days === 0 && timeLeft.hours < 24 && !timeLeft.expired) {
      const startPulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => startPulse());
      };
      startPulse();
    } else {
      pulseAnim.setValue(1);
    }
  }, [timeLeft]);

  if (!challenge) return null;

  // 🎨 Obter cor baseada no status
  const getStatusColor = () => {
    if (timeLeft.expired) return colors.neutral[400];
    if (challenge.completed) return colors.success[500];
    if (timeLeft.days === 0 && timeLeft.hours < 6) return colors.error[500];
    if (timeLeft.days === 0 && timeLeft.hours < 24) return colors.warning[500];
    return colors.gamification.challenge;
  };

  // 📝 Obter texto de status
  const getStatusText = () => {
    if (timeLeft.expired) return 'Expirado';
    if (challenge.completed) return 'Concluído! 🎉';
    if (timeLeft.days === 0 && timeLeft.hours < 1) return 'Última hora! ⏰';
    if (timeLeft.days === 0) return `${timeLeft.hours}h restantes`;
    if (timeLeft.days === 1) return '1 dia restante';
    return `${timeLeft.days} dias restantes`;
  };

  // 📊 Obter texto de progresso
  const getProgressText = () => {
    if (!challenge.target) return '';
    
    const current = Math.round((progress / 100) * challenge.target);
    return `${current} / ${challenge.target}`;
  };

  const statusColor = getStatusColor();
  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 24 && !timeLeft.expired;
  const isCompleted = challenge.completed;

  const containerStyle = [
    styles.container,
    { borderColor: statusColor + '30' },
    isUrgent && styles.urgentContainer,
    isCompleted && styles.completedContainer,
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
        {/* 📅 Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.icon}>{challenge.icon}</Text>
            <View style={styles.titleInfo}>
              <Text style={[styles.title, { color: statusColor }]}>
                {challenge.name}
              </Text>
              <Text style={styles.description} numberOfLines={2}>
                {challenge.description}
              </Text>
            </View>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {getStatusText()}
            </Text>
          </View>
        </View>

        {/* 📊 Progresso */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progresso</Text>
            <Text style={[styles.progressValue, { color: statusColor }]}>
              {getProgressText()}
            </Text>
          </View>
          
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: statusColor,
                },
              ]}
            />
          </View>
          
          <Text style={styles.progressPercentage}>
            {Math.round(progress)}% concluído
          </Text>
        </View>

        {/* 💰 Recompensa */}
        {challenge.reward > 0 && (
          <View style={styles.rewardSection}>
            <Text style={styles.rewardIcon}>🏆</Text>
            <Text style={styles.rewardText}>
              {challenge.reward} pontos
            </Text>
          </View>
        )}

        {/* ⚠️ Indicadores especiais */}
        {isUrgent && !isCompleted && (
          <View style={styles.urgentIndicator}>
            <Text style={styles.urgentText}>⏰ Urgente!</Text>
          </View>
        )}
        
        {isCompleted && (
          <View style={styles.completedIndicator}>
            <Text style={styles.completedText}>✅ Concluído</Text>
          </View>
        )}
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
  
  urgentContainer: {
    backgroundColor: colors.warning[50],
  },
  
  completedContainer: {
    backgroundColor: colors.success[50],
  },
  
  content: {
    // Layout definido pelos filhos
  },
  
  header: {
    marginBottom: spacing.md,
  },
  
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  
  icon: {
    fontSize: 24,
    marginRight: spacing.sm,
    marginTop: 2,
  },
  
  titleInfo: {
    flex: 1,
  },
  
  title: {
    ...typography.titleSmall,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  
  description: {
    ...typography.bodySmall,
    color: colors.neutral[600],
    lineHeight: typography.bodySmall.fontSize * 1.3,
  },
  
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
  },
  
  statusText: {
    ...typography.labelSmall,
    fontWeight: '600',
  },
  
  progressSection: {
    marginBottom: spacing.md,
  },
  
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  
  progressLabel: {
    ...typography.labelMedium,
    color: colors.neutral[600],
  },
  
  progressValue: {
    ...typography.labelMedium,
    fontWeight: '600',
  },
  
  progressBar: {
    height: 6,
    backgroundColor: colors.neutral[200],
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  
  progressPercentage: {
    ...typography.labelSmall,
    color: colors.neutral[500],
    textAlign: 'center',
  },
  
  rewardSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gamification.points + '15',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    marginBottom: spacing.sm,
  },
  
  rewardIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  
  rewardText: {
    ...typography.labelMedium,
    color: colors.gamification.points,
    fontWeight: '600',
  },
  
  urgentIndicator: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.warning[500],
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: spacing.xs,
  },
  
  urgentText: {
    ...typography.labelSmall,
    color: colors.neutral[0],
    fontSize: 10,
    fontWeight: '600',
  },
  
  completedIndicator: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.success[500],
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: spacing.xs,
  },
  
  completedText: {
    ...typography.labelSmall,
    color: colors.neutral[0],
    fontSize: 10,
    fontWeight: '600',
  },
};

export default WeeklyChallengeCard;