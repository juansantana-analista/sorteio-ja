// src/screens/HomeScreen.js
// 🏠 Tela Principal do Sorteio Já
// Interface principal com tipos de sorteio e sistema de gamificação

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 🎨 Componentes UI
import Button from '../components/ui/Button';
import Card, { StatsCard, AlertCard } from '../components/ui/Card';

// 🎮 Componentes de gamificação
import PointsDisplay from '../components/gamification/PointsDisplay';
import LevelProgress from '../components/gamification/LevelProgress';
import StreakCounter from '../components/gamification/StreakCounter';
import WeeklyChallengeCard from '../components/gamification/WeeklyChallengeCard';
import AchievementBadge from '../components/gamification/AchievementBadge';

// 🎊 Componentes de celebração
import PointsGainAnimation from '../components/gamification/PointsGainAnimation';
import LevelUpModal from '../components/gamification/LevelUpModal';
import AchievementUnlockedModal from '../components/gamification/AchievementUnlockedModal';
import StreakBonusAnimation from '../components/gamification/StreakBonusAnimation';

// 🎯 Hooks e serviços
import { useGamification, useStreak, useWeeklyChallenge } from '../hooks/useGamification';

// 🎨 Sistema de design
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, layouts } from '../theme/spacing';
import { shadows } from '../theme/shadows';

// 📱 Dimensões da tela
const { width: screenWidth } = Dimensions.get('window');

/**
 * 🏠 Componente HomeScreen
 * 
 * Tela principal do app com:
 * - Tipos de sorteio disponíveis
 * - Sistema de gamificação visível
 * - Estatísticas do usuário
 * - Desafios e conquistas
 * - Animações de feedback
 */
const HomeScreen = ({ navigation }) => {
  // 🎮 Estado da gamificação
  const gamification = useGamification();
  const streak = useStreak();
  const weeklyChallenge = useWeeklyChallenge();
  
  // 🔄 Estado de refresh
  const [refreshing, setRefreshing] = useState(false);
  
  // 🎯 Tipos de sorteio disponíveis
  const lotteryTypes = [
    {
      id: 'names',
      title: 'Sorteio de Nomes',
      subtitle: 'Escolha aleatória entre pessoas',
      icon: '👥',
      color: colors.primary[500],
      gradient: colors.gradients.primary,
      points: 10,
      route: 'ListEditor',
      params: { type: 'names' },
    },
    {
      id: 'numbers',
      title: 'Sorteio de Números',
      subtitle: 'Números aleatórios ou intervalos',
      icon: '🔢',
      color: colors.success[500],
      gradient: colors.gradients.success,
      points: 10,
      route: 'NumberLottery',
    },
    {
      id: 'teams',
      title: 'Formar Times',
      subtitle: 'Divida pessoas em grupos',
      icon: '⚽',
      color: colors.warning[500],
      gradient: ['#f59e0b', '#f97316'],
      points: 15,
      route: 'ListEditor',
      params: { type: 'teams' },
    },
    {
      id: 'order',
      title: 'Ordem Aleatória',
      subtitle: 'Embaralhe uma lista',
      icon: '🔀',
      color: colors.special.rainbow,
      gradient: colors.gradients.celebration,
      points: 12,
      route: 'ListEditor',
      params: { type: 'order' },
    },
    {
      id: 'bingo',
      title: 'Bingo',
      subtitle: 'Números para cartelas de bingo',
      icon: '🎰',
      color: colors.gamification.bonus,
      gradient: ['#ec4899', '#8b5cf6'],
      points: 20,
      route: 'BingoScreen',
    },
  ];

  // 🔄 Função de refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await gamification.loadStats();
    setRefreshing(false);
  };

  // 🎯 Navegar para tipo de sorteio
  const handleLotteryTypePress = (lotteryType) => {
    // Feedback háptico se disponível
    if (Platform.OS === 'ios') {
      // TODO: Implementar feedback háptico
    }
    
    navigation.navigate(lotteryType.route, lotteryType.params || {});
  };

  // 🎨 Renderizar card de tipo de sorteio
  const renderLotteryTypeCard = (lotteryType) => (
    <Card
      key={lotteryType.id}
      onPress={() => handleLotteryTypePress(lotteryType)}
      variant="elevated"
      padding="large"
      animated={true}
      style={[
        styles.lotteryCard,
        { backgroundColor: colors.neutral[0] }
      ]}
    >
      <View style={styles.lotteryCardContent}>
        {/* Ícone e pontos */}
        <View style={styles.lotteryCardHeader}>
          <View style={[
            styles.lotteryIconContainer,
            { backgroundColor: lotteryType.color + '15' }
          ]}>
            <Text style={styles.lotteryIcon}>{lotteryType.icon}</Text>
          </View>
          
          <View style={[
            styles.pointsBadge,
            { backgroundColor: colors.gamification.points + '20' }
          ]}>
            <Text style={styles.pointsText}>+{lotteryType.points}</Text>
          </View>
        </View>
        
        {/* Título e descrição */}
        <View style={styles.lotteryCardBody}>
          <Text style={[
            styles.lotteryTitle,
            { color: lotteryType.color }
          ]}>
            {lotteryType.title}
          </Text>
          <Text style={styles.lotterySubtitle}>
            {lotteryType.subtitle}
          </Text>
        </View>
        
        {/* Botão de ação */}
        <Button
          title="Começar"
          variant="primary"
          size="small"
          style={[
            styles.lotteryButton,
            { backgroundColor: lotteryType.color }
          ]}
          onPress={() => handleLotteryTypePress(lotteryType)}
        />
      </View>
    </Card>
  );

  // 🎨 Renderizar header com gamificação
  const renderGamificationHeader = () => (
    <View style={styles.gamificationHeader}>
      {/* Pontos e nível */}
      <View style={styles.statsRow}>
        <PointsDisplay
          points={gamification.stats?.totalPoints || 0}
          size="large"
          animated={true}
        />
        
        <LevelProgress
          level={gamification.currentLevel}
          progress={gamification.getNextLevelProgress}
          size="medium"
        />
      </View>
      
      {/* Streak e desafio semanal */}
      <View style={styles.challengesRow}>
        <StreakCounter
          streak={streak.currentStreak}
          isAtRisk={streak.isAtRisk}
          style={styles.streakCounter}
        />
        
        {weeklyChallenge.challenge && (
          <WeeklyChallengeCard
            challenge={weeklyChallenge.challenge}
            progress={weeklyChallenge.progressPercentage}
            timeLeft={weeklyChallenge.timeLeft}
            style={styles.weeklyChallenge}
          />
        )}
      </View>
    </View>
  );

  // 🎨 Renderizar seção de conquistas recentes
  const renderRecentAchievements = () => {
    const recentAchievements = gamification.stats?.unlockedAchievements?.slice(-3) || [];
    
    if (recentAchievements.length === 0) return null;
    
    return (
      <View style={styles.achievementsSection}>
        <Text style={styles.sectionTitle}>🏆 Conquistas Recentes</Text>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.achievementsScroll}
        >
          {recentAchievements.map((achievementId) => (
            <AchievementBadge
              key={achievementId}
              achievementId={achievementId}
              size="medium"
              style={styles.achievementBadge}
            />
          ))}
          
          {/* Botão para ver todas */}
          <Card
            onPress={() => navigation.navigate('Achievements')}
            variant="outlined"
            padding="medium"
            style={styles.viewAllCard}
          >
            <Text style={styles.viewAllText}>Ver todas</Text>
            <Text style={styles.viewAllIcon}>→</Text>
          </Card>
        </ScrollView>
      </View>
    );
  };

  // 🎨 Renderizar estatísticas rápidas
  const renderQuickStats = () => (
    <View style={styles.quickStatsSection}>
      <Text style={styles.sectionTitle}>📊 Suas Estatísticas</Text>
      
      <View style={styles.quickStatsGrid}>
        <StatsCard style={styles.quickStatCard}>
          <Text style={styles.statNumber}>
            {gamification.stats?.totalDraws || 0}
          </Text>
          <Text style={styles.statLabel}>Sorteios</Text>
        </StatsCard>
        
        <StatsCard style={styles.quickStatCard}>
          <Text style={styles.statNumber}>
            {streak.longestStreak}
          </Text>
          <Text style={styles.statLabel}>Melhor Sequência</Text>
        </StatsCard>
        
        <StatsCard style={styles.quickStatCard}>
          <Text style={styles.statNumber}>
            {gamification.unlockedCount}
          </Text>
          <Text style={styles.statLabel}>Conquistas</Text>
        </StatsCard>
        
        <StatsCard style={styles.quickStatCard}>
          <Text style={styles.statNumber}>
            {gamification.stats?.shareCount || 0}
          </Text>
          <Text style={styles.statLabel}>Compartilhamentos</Text>
        </StatsCard>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.system.background}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary[500]]}
            tintColor={colors.primary[500]}
          />
        }
      >
        {/* Header com saudação */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá! 👋</Text>
          <Text style={styles.subtitle}>
            Que tipo de sorteio vamos fazer hoje?
          </Text>
        </View>
        
        {/* Sistema de gamificação */}
        {renderGamificationHeader()}
        
        {/* Tipos de sorteio */}
        <View style={styles.lotteryTypesSection}>
          <Text style={styles.sectionTitle}>🎲 Tipos de Sorteio</Text>
          
          <View style={styles.lotteryGrid}>
            {lotteryTypes.map(renderLotteryTypeCard)}
          </View>
        </View>
        
        {/* Conquistas recentes */}
        {renderRecentAchievements()}
        
        {/* Estatísticas rápidas */}
        {renderQuickStats()}
        
        {/* Acesso rápido ao histórico */}
        <View style={styles.quickActionsSection}>
          <Button
            title="📋 Ver Histórico"
            variant="outline"
            size="large"
            fullWidth
            onPress={() => navigation.navigate('History')}
            style={styles.quickActionButton}
          />
          
          <Button
            title="⚙️ Configurações"
            variant="ghost"
            size="medium"
            fullWidth
            onPress={() => navigation.navigate('Settings')}
            style={styles.quickActionButton}
          />
        </View>
      </ScrollView>
      
      {/* Animações de feedback */}
      {gamification.recentPointsGain && (
        <PointsGainAnimation
          points={gamification.recentPointsGain.points}
          message={gamification.recentPointsGain.message}
          onComplete={() => {/* Animation complete */}}
        />
      )}
      
      {gamification.levelUp && (
        <LevelUpModal
          oldLevel={gamification.levelUp.oldLevel}
          newLevel={gamification.levelUp.newLevel}
          visible={true}
          onClose={() => {/* Modal closed */}}
        />
      )}
      
      {gamification.newAchievements.length > 0 && (
        <AchievementUnlockedModal
          achievements={gamification.newAchievements}
          visible={true}
          onClose={() => {/* Modal closed */}}
        />
      )}
      
      {streak.streakBonus && (
        <StreakBonusAnimation
          streakCount={streak.streakBonus.count}
          onComplete={() => {/* Animation complete */}}
        />
      )}
    </SafeAreaView>
  );
};

// 🎨 Estilos do componente
const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.system.background,
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    paddingBottom: spacing['6xl'],
  },
  
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  
  greeting: {
    ...typography.headlineMedium,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
  },
  
  subtitle: {
    ...typography.bodyLarge,
    color: colors.neutral[600],
  },
  
  sectionTitle: {
    ...typography.titleLarge,
    color: colors.neutral[800],
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  
  // 🎮 Gamificação
  gamificationHeader: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing['2xl'],
  },
  
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  
  challengesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  
  streakCounter: {
    flex: 1,
    marginRight: spacing.md,
  },
  
  weeklyChallenge: {
    flex: 2,
  },
  
  // 🎲 Tipos de sorteio
  lotteryTypesSection: {
    marginBottom: spacing['3xl'],
  },
  
  lotteryGrid: {
    paddingHorizontal: spacing.lg,
  },
  
  lotteryCard: {
    marginBottom: spacing.lg,
    borderRadius: spacing.lg,
  },
  
  lotteryCardContent: {
    // Layout já definido pelo Card
  },
  
  lotteryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  
  lotteryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  lotteryIcon: {
    fontSize: 24,
  },
  
  pointsBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.md,
  },
  
  pointsText: {
    ...typography.labelSmall,
    color: colors.gamification.points,
    fontWeight: '600',
  },
  
  lotteryCardBody: {
    marginBottom: spacing.lg,
  },
  
  lotteryTitle: {
    ...typography.titleMedium,
    marginBottom: spacing.xs,
  },
  
  lotterySubtitle: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
  },
  
  lotteryButton: {
    alignSelf: 'flex-start',
  },
  
  // 🏆 Conquistas
  achievementsSection: {
    marginBottom: spacing['3xl'],
  },
  
  achievementsScroll: {
    paddingLeft: spacing.lg,
  },
  
  achievementBadge: {
    marginRight: spacing.md,
  },
  
  viewAllCard: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  
  viewAllText: {
    ...typography.labelMedium,
    color: colors.primary[600],
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  
  viewAllIcon: {
    ...typography.titleMedium,
    color: colors.primary[500],
  },
  
  // 📊 Estatísticas
  quickStatsSection: {
    marginBottom: spacing['3xl'],
  },
  
  quickStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
  },
  
  quickStatCard: {
    width: (screenWidth - spacing.lg * 2 - spacing.md) / 2,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  
  statNumber: {
    ...typography.headlineSmall,
    color: colors.primary[600],
    marginBottom: spacing.xs,
  },
  
  statLabel: {
    ...typography.labelMedium,
    color: colors.neutral[600],
    textAlign: 'center',
  },
  
  // 🚀 Ações rápidas
  quickActionsSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  
  quickActionButton: {
    marginBottom: spacing.md,
  },
};

export default HomeScreen;