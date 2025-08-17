// src/screens/AchievementsScreen.js
// 🏆 Tela de Conquistas - Sorteio Já
// Exibe todas as conquistas com progresso, categorias e animações

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Animated,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 🎨 Componentes UI
import { StatsCard, AchievementCard } from '../components/ui/Card';
import Button from '../components/ui/Button';

// 🎮 Componentes de gamificação
import AchievementBadge from '../components/gamification/AchievementBadge';
import ProgressRing from '../components/gamification/ProgressRing';

// 🎮 Hooks e serviços
import { useAchievements, useGamificationSummary } from '../hooks/useGamification';
import { ACHIEVEMENTS } from '../services/gamification';

// 🎨 Sistema de design
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { shadows } from '../theme/shadows';

// 📱 Dimensões da tela
const { width: screenWidth } = Dimensions.get('window');

/**
 * 🏆 Componente AchievementsScreen
 * 
 * Funcionalidades:
 * - Exibir todas as conquistas por categoria
 * - Mostrar progresso geral
 * - Animações de desbloqueio
 * - Filtros por raridade e status
 * - Estatísticas detalhadas
 */
const AchievementsScreen = ({ navigation }) => {
  // 🎮 Estados
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState(false);

  // 🎮 Hooks de gamificação
  const { 
    achievements, 
    achievementStats, 
    newAchievements, 
    loading 
  } = useAchievements();
  
  const { points, level } = useGamificationSummary();

  // 🎬 Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // 🚀 Inicializar componente
  useEffect(() => {
    startEntranceAnimation();
  }, []);

  // 🎬 Animação de entrada
  const startEntranceAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 🔄 Refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    // Simular delay de refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // 🏷️ Categorias de conquistas
  const categories = [
    { id: 'all', name: 'Todas', icon: '🏆', count: achievementStats.total },
    { id: 'basic', name: 'Básicas', icon: '🎯', count: achievements.basic?.length || 0 },
    { id: 'streak', name: 'Sequência', icon: '🔥', count: achievements.streak?.length || 0 },
    { id: 'types', name: 'Especialista', icon: '🎲', count: achievements.types?.length || 0 },
    { id: 'engagement', name: 'Social', icon: '📤', count: achievements.engagement?.length || 0 },
    { id: 'special', name: 'Especiais', icon: '⭐', count: achievements.special?.length || 0 },
    { id: 'legendary', name: 'Lendárias', icon: '💎', count: achievements.legendary?.length || 0 },
  ];

  // 🌈 Filtros de raridade
  const rarityFilters = [
    { id: 'all', name: 'Todas', color: colors.neutral[500] },
    { id: 'common', name: 'Comum', color: colors.neutral[600] },
    { id: 'uncommon', name: 'Incomum', color: colors.success[500] },
    { id: 'rare', name: 'Raro', color: colors.primary[500] },
    { id: 'epic', name: 'Épico', color: colors.warning[500] },
    { id: 'legendary', name: 'Lendário', color: colors.special.gold },
  ];

  // 📊 Obter conquistas filtradas
  const getFilteredAchievements = () => {
    let filtered = [];

    // Selecionar categoria
    if (selectedCategory === 'all') {
      filtered = Object.values(achievements).flat();
    } else {
      filtered = achievements[selectedCategory] || [];
    }

    // Filtrar por raridade
    if (selectedRarity !== 'all') {
      filtered = filtered.filter(achievement => 
        ACHIEVEMENTS[Object.keys(ACHIEVEMENTS).find(key => 
          ACHIEVEMENTS[key].id === achievement.id
        )]?.rarity === selectedRarity
      );
    }

    // Filtrar por status
    if (showOnlyUnlocked) {
      filtered = filtered.filter(achievement => achievement.unlocked);
    }

    return filtered;
  };

  // 🎨 Renderizar header com estatísticas
  const renderHeader = () => (
    <Animated.View
      style={[
        styles.header,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* 📊 Progresso geral */}
      <StatsCard style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Progresso Geral</Text>
          <Text style={styles.progressLevel}>Nível {level.level}</Text>
        </View>
        
        <View style={styles.progressContent}>
          <ProgressRing
            progress={achievementStats.percentage}
            size={80}
            strokeWidth={8}
            color={level.color}
          />
          
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {achievementStats.unlocked} de {achievementStats.total}
            </Text>
            <Text style={styles.progressSubtext}>
              conquistas desbloqueadas
            </Text>
            <Text style={styles.pointsText}>
              {points.toLocaleString('pt-BR')} pontos
            </Text>
          </View>
        </View>
      </StatsCard>

      {/* 📊 Estatísticas por raridade */}
      <View style={styles.rarityStats}>
        {Object.entries(achievementStats.byRarity).map(([rarity, total]) => {
          const unlocked = achievementStats.unlockedByRarity[rarity] || 0;
          const rarityData = rarityFilters.find(r => r.id === rarity);
          
          return (
            <StatsCard key={rarity} style={styles.rarityCard}>
              <Text style={[styles.rarityCount, { color: rarityData.color }]}>
                {unlocked}/{total}
              </Text>
              <Text style={styles.rarityLabel}>
                {rarityData.name}
              </Text>
            </StatsCard>
          );
        })}
      </View>
    </Animated.View>
  );

  // 🏷️ Renderizar filtros de categoria
  const renderCategoryFilters = () => (
    <Animated.View
      style={[
        styles.filtersSection,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <Text style={styles.filterTitle}>Categorias</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryFilters}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => setSelectedCategory(category.id)}
            style={[
              styles.categoryFilter,
              selectedCategory === category.id && styles.categoryFilterActive,
            ]}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={[
              styles.categoryName,
              selectedCategory === category.id && styles.categoryNameActive,
            ]}>
              {category.name}
            </Text>
            <Text style={[
              styles.categoryCount,
              selectedCategory === category.id && styles.categoryCountActive,
            ]}>
              {category.count}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );

  // 🌈 Renderizar filtros de raridade
  const renderRarityFilters = () => (
    <View style={styles.rarityFiltersContainer}>
      <Text style={styles.filterTitle}>Raridade</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.rarityFilters}
      >
        {rarityFilters.map((rarity) => (
          <TouchableOpacity
            key={rarity.id}
            onPress={() => setSelectedRarity(rarity.id)}
            style={[
              styles.rarityFilter,
              selectedRarity === rarity.id && [
                styles.rarityFilterActive,
                { borderColor: rarity.color }
              ],
            ]}
          >
            <Text style={[
              styles.rarityFilterText,
              selectedRarity === rarity.id && { color: rarity.color },
            ]}>
              {rarity.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // 🏆 Renderizar item de conquista
  const renderAchievementItem = ({ item, index }) => (
    <AchievementCard
      key={item.id}
      achievement={item}
      unlocked={item.unlocked}
      animated={true}
      animationDelay={index * 100}
      style={styles.achievementItem}
      onPress={() => {
        // Mostrar detalhes da conquista
        navigation.navigate('AchievementDetail', { achievement: item });
      }}
    />
  );

  // 🎨 Renderizar controles adicionais
  const renderControls = () => (
    <View style={styles.controls}>
      <TouchableOpacity
        onPress={() => setShowOnlyUnlocked(!showOnlyUnlocked)}
        style={[
          styles.toggleButton,
          showOnlyUnlocked && styles.toggleButtonActive,
        ]}
      >
        <Text style={[
          styles.toggleButtonText,
          showOnlyUnlocked && styles.toggleButtonTextActive,
        ]}>
          {showOnlyUnlocked ? '✅ Desbloqueadas' : '👁️ Mostrar todas'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const filteredAchievements = getFilteredAchievements();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary[500]]}
            tintColor={colors.primary[500]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* 📊 Header com progresso */}
        {renderHeader()}

        {/* 🏷️ Filtros de categoria */}
        {renderCategoryFilters()}

        {/* 🌈 Filtros de raridade */}
        {renderRarityFilters()}

        {/* 🎛️ Controles */}
        {renderControls()}

        {/* 🏆 Lista de conquistas */}
        <Animated.View
          style={[
            styles.achievementsList,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.achievementsTitle}>
            🏆 Conquistas ({filteredAchievements.length})
          </Text>
          
          {filteredAchievements.length > 0 ? (
            <FlatList
              data={filteredAchievements}
              renderItem={renderAchievementItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.achievementRow}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🔍</Text>
              <Text style={styles.emptyStateText}>
                Nenhuma conquista encontrada com os filtros selecionados
              </Text>
              <Button
                title="Limpar Filtros"
                variant="outline"
                onPress={() => {
                  setSelectedCategory('all');
                  setSelectedRarity('all');
                  setShowOnlyUnlocked(false);
                }}
                style={styles.clearFiltersButton}
              />
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* 🎊 Modal de nova conquista */}
      {newAchievements.length > 0 && (
        <View style={styles.newAchievementOverlay}>
          {/* Implementar modal de nova conquista */}
        </View>
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
    paddingBottom: spacing['4xl'],
  },
  
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  
  // 📊 Card de progresso
  progressCard: {
    marginBottom: spacing.lg,
  },
  
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  
  progressTitle: {
    ...typography.titleLarge,
    color: colors.neutral[800],
  },
  
  progressLevel: {
    ...typography.titleMedium,
    color: colors.primary[600],
    fontWeight: '600',
  },
  
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  progressInfo: {
    marginLeft: spacing.xl,
    flex: 1,
  },
  
  progressText: {
    ...typography.headlineSmall,
    color: colors.neutral[800],
    marginBottom: spacing.xs,
  },
  
  progressSubtext: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
    marginBottom: spacing.sm,
  },
  
  pointsText: {
    ...typography.titleMedium,
    color: colors.gamification.points,
    fontWeight: '600',
  },
  
  // 📊 Estatísticas de raridade
  rarityStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  rarityCard: {
    width: (screenWidth - spacing.lg * 2 - spacing.md * 2) / 3,
    marginBottom: spacing.sm,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  
  rarityCount: {
    ...typography.titleMedium,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  
  rarityLabel: {
    ...typography.labelSmall,
    color: colors.neutral[600],
  },
  
  // 🏷️ Filtros
  filtersSection: {
    marginBottom: spacing.lg,
  },
  
  filterTitle: {
    ...typography.titleMedium,
    color: colors.neutral[800],
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  
  categoryFilters: {
    paddingLeft: spacing.lg,
  },
  
  categoryFilter: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.md,
    borderRadius: spacing.sm,
    backgroundColor: colors.neutral[100],
    minWidth: 70,
  },
  
  categoryFilterActive: {
    backgroundColor: colors.primary[100],
    borderWidth: 1,
    borderColor: colors.primary[300],
  },
  
  categoryIcon: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  
  categoryName: {
    ...typography.labelSmall,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },
  
  categoryNameActive: {
    color: colors.primary[700],
    fontWeight: '600',
  },
  
  categoryCount: {
    ...typography.labelSmall,
    color: colors.neutral[500],
    fontSize: 10,
  },
  
  categoryCountActive: {
    color: colors.primary[600],
  },
  
  // 🌈 Filtros de raridade
  rarityFiltersContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  
  rarityFilters: {
    // Scroll horizontal
  },
  
  rarityFilter: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral[300],
    backgroundColor: colors.neutral[50],
  },
  
  rarityFilterActive: {
    backgroundColor: colors.neutral[0],
    borderWidth: 2,
  },
  
  rarityFilterText: {
    ...typography.labelMedium,
    color: colors.neutral[600],
  },
  
  // 🎛️ Controles
  controls: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  
  toggleButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    backgroundColor: colors.neutral[100],
    alignSelf: 'flex-start',
  },
  
  toggleButtonActive: {
    backgroundColor: colors.success[100],
  },
  
  toggleButtonText: {
    ...typography.labelMedium,
    color: colors.neutral[600],
  },
  
  toggleButtonTextActive: {
    color: colors.success[700],
    fontWeight: '600',
  },
  
  // 🏆 Lista de conquistas
  achievementsList: {
    paddingHorizontal: spacing.lg,
  },
  
  achievementsTitle: {
    ...typography.titleLarge,
    color: colors.neutral[800],
    marginBottom: spacing.lg,
  },
  
  achievementRow: {
    justifyContent: 'space-between',
  },
  
  achievementItem: {
    width: (screenWidth - spacing.lg * 2 - spacing.md) / 2,
  },
  
  // 🔍 Estado vazio
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['4xl'],
  },
  
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  
  emptyStateText: {
    ...typography.bodyLarge,
    color: colors.neutral[600],
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: typography.bodyLarge.fontSize * 1.4,
  },
  
  clearFiltersButton: {
    alignSelf: 'center',
  },
  
  // 🎊 Overlay de nova conquista
  newAchievementOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.system.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default AchievementsScreen;