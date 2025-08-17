// src/hooks/useGamification.js
// 🎮 Hook para gerenciar sistema de gamificação
// Fornece interface reactiva para pontos, conquistas e desafios

import { useState, useEffect, useCallback, useRef } from 'react';
import { gamificationSystem, ACHIEVEMENTS, LEVELS } from '../services/gamification';

/**
 * 🎮 Hook useGamification
 * 
 * Gerencia estado da gamificação e fornece métodos para:
 * - Obter estatísticas do usuário
 * - Processar ações que geram pontos
 * - Verificar conquistas desbloqueadas
 * - Gerenciar desafios semanais
 * - Animações de feedback
 * 
 * @returns {Object} Estado e métodos da gamificação
 */
export const useGamification = () => {
  // 📊 Estados principais
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 🎊 Estados para animações e feedback
  const [recentPointsGain, setRecentPointsGain] = useState(null);
  const [newAchievements, setNewAchievements] = useState([]);
  const [levelUp, setLevelUp] = useState(null);
  const [streakBonus, setStreakBonus] = useState(null);
  
  // 🎯 Estados do desafio semanal
  const [weeklyChallenge, setWeeklyChallenge] = useState(null);
  const [challengeProgress, setChallengeProgress] = useState(0);
  
  // 🔄 Refs para controle de animações
  const animationTimeouts = useRef([]);

  /**
   * 📊 Carregar estatísticas iniciais
   */
  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userStats = await gamificationSystem.getUserStats();
      setStats(userStats);
      
      // Carregar desafio semanal
      if (userStats.currentWeeklyChallenge) {
        setWeeklyChallenge(userStats.currentWeeklyChallenge);
        setChallengeProgress(userStats.currentWeeklyChallenge.progress || 0);
      }
      
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
      setError('Erro ao carregar dados da gamificação');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🎲 Processar sorteio e atualizar gamificação
   */
  const processDraw = useCallback(async (drawType, drawData) => {
    try {
      const result = await gamificationSystem.processDraw(drawType, drawData);
      
      if (result) {
        // Atualizar estatísticas
        await loadStats();
        
        // Mostrar feedback visual
        showPointsGain(result.pointsEarned, result.isFirstToday);
        
        // Verificar level up
        if (result.newLevel.level > result.oldLevel.level) {
          showLevelUp(result.oldLevel, result.newLevel);
        }
        
        // Mostrar conquistas desbloqueadas
        if (result.unlockedAchievements.length > 0) {
          showNewAchievements(result.unlockedAchievements);
        }
        
        // Mostrar bônus de streak
        if (result.newStreak > 1 && result.isFirstToday) {
          showStreakBonus(result.newStreak);
        }
        
        return result;
      }
      
      return null;
    } catch (err) {
      console.error('Erro ao processar sorteio:', err);
      return null;
    }
  }, [loadStats]);

  /**
   * 📤 Processar compartilhamento
   */
  const processShare = useCallback(async () => {
    try {
      const result = await gamificationSystem.processShare();
      
      if (result) {
        await loadStats();
        showPointsGain(result.pointsEarned, false, 'Compartilhamento! 📤');
        return result;
      }
      
      return null;
    } catch (err) {
      console.error('Erro ao processar compartilhamento:', err);
      return null;
    }
  }, [loadStats]);

  /**
   * 📝 Processar criação de lista
   */
  const processListCreation = useCallback(async () => {
    try {
      const result = await gamificationSystem.processListCreation();
      
      if (result) {
        await loadStats();
        showPointsGain(result.pointsEarned, false, 'Nova lista criada! 📝');
        return result;
      }
      
      return null;
    } catch (err) {
      console.error('Erro ao processar criação de lista:', err);
      return null;
    }
  }, [loadStats]);

  /**
   * ⭐ Processar favoritar lista
   */
  const processFavorite = useCallback(async () => {
    try {
      const result = await gamificationSystem.processFavorite();
      
      if (result) {
        await loadStats();
        showPointsGain(result.pointsEarned, false, 'Lista favoritada! ⭐');
        return result;
      }
      
      return null;
    } catch (err) {
      console.error('Erro ao processar favorito:', err);
      return null;
    }
  }, [loadStats]);

  // 🎊 Funções de feedback visual
  
  /**
   * 💰 Mostrar ganho de pontos
   */
  const showPointsGain = useCallback((points, isFirstToday = false, customMessage = null) => {
    const message = customMessage || (isFirstToday ? 'Primeiro do dia! 🌅' : null);
    
    setRecentPointsGain({
      points,
      message,
      timestamp: Date.now(),
    });
    
    // Limpar após animação
    const timeout = setTimeout(() => {
      setRecentPointsGain(null);
    }, 3000);
    
    animationTimeouts.current.push(timeout);
  }, []);

  /**
   * 🏆 Mostrar conquista desbloqueada
   */
  const showNewAchievements = useCallback((achievements) => {
    setNewAchievements(achievements);
    
    // Limpar após animação
    const timeout = setTimeout(() => {
      setNewAchievements([]);
    }, 5000);
    
    animationTimeouts.current.push(timeout);
  }, []);

  /**
   * ⬆️ Mostrar level up
   */
  const showLevelUp = useCallback((oldLevel, newLevel) => {
    setLevelUp({
      oldLevel,
      newLevel,
      timestamp: Date.now(),
    });
    
    // Limpar após animação
    const timeout = setTimeout(() => {
      setLevelUp(null);
    }, 4000);
    
    animationTimeouts.current.push(timeout);
  }, []);

  /**
   * 🔥 Mostrar bônus de streak
   */
  const showStreakBonus = useCallback((streakCount) => {
    setStreakBonus({
      count: streakCount,
      timestamp: Date.now(),
    });
    
    // Limpar após animação
    const timeout = setTimeout(() => {
      setStreakBonus(null);
    }, 2500);
    
    animationTimeouts.current.push(timeout);
  }, []);

  // 📊 Funções utilitárias e cálculos

  /**
   * 📈 Calcular progresso para próximo nível
   */
  const getNextLevelProgress = useCallback(() => {
    if (!stats) return { current: 0, total: 100, percentage: 0 };
    
    const currentLevel = stats.level;
    const nextLevelIndex = LEVELS.findIndex(l => l.level === currentLevel.level) + 1;
    
    if (nextLevelIndex >= LEVELS.length) {
      // Já está no nível máximo
      return { current: stats.totalPoints, total: stats.totalPoints, percentage: 100 };
    }
    
    const nextLevel = LEVELS[nextLevelIndex];
    const currentLevelPoints = currentLevel.minPoints;
    const nextLevelPoints = nextLevel.minPoints;
    const progressInLevel = stats.totalPoints - currentLevelPoints;
    const totalNeededForNext = nextLevelPoints - currentLevelPoints;
    
    return {
      current: progressInLevel,
      total: totalNeededForNext,
      percentage: Math.min(100, (progressInLevel / totalNeededForNext) * 100),
      nextLevel,
    };
  }, [stats]);

  /**
   * 🏅 Obter conquistas por categoria
   */
  const getAchievementsByCategory = useCallback(() => {
    const unlockedIds = stats?.unlockedAchievements || [];
    
    const categories = {
      basic: [],
      streak: [],
      types: [],
      engagement: [],
      special: [],
      legendary: [],
    };
    
    Object.values(ACHIEVEMENTS).forEach(achievement => {
      const isUnlocked = unlockedIds.includes(achievement.id);
      const achievementData = { ...achievement, unlocked: isUnlocked };
      
      // Categorizar por ID
      if (achievement.id.includes('draw') || achievement.id.includes('tenth') || achievement.id.includes('hundredth')) {
        categories.basic.push(achievementData);
      } else if (achievement.id.includes('streak')) {
        categories.streak.push(achievementData);
      } else if (achievement.id.includes('master') || achievement.id.includes('wizard') || achievement.id.includes('king')) {
        categories.types.push(achievementData);
      } else if (achievement.id.includes('sharer') || achievement.id.includes('organizer') || achievement.id.includes('collector')) {
        categories.engagement.push(achievementData);
      } else if (achievement.rarity === 'legendary') {
        categories.legendary.push(achievementData);
      } else {
        categories.special.push(achievementData);
      }
    });
    
    return categories;
  }, [stats]);

  /**
   * 📅 Verificar se desafio semanal expirou
   */
  const isWeeklyChallengeExpired = useCallback(() => {
    if (!weeklyChallenge) return false;
    
    const now = new Date();
    const endDate = new Date(weeklyChallenge.endDate);
    
    return now > endDate;
  }, [weeklyChallenge]);

  /**
   * ⏰ Obter tempo restante do desafio semanal
   */
  const getWeeklyChallengeTimeLeft = useCallback(() => {
    if (!weeklyChallenge) return null;
    
    const now = new Date();
    const endDate = new Date(weeklyChallenge.endDate);
    const timeLeft = endDate - now;
    
    if (timeLeft <= 0) return { expired: true };
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return { days, hours, expired: false };
  }, [weeklyChallenge]);

  // 🔄 Limpar timeouts ao desmontar
  useEffect(() => {
    return () => {
      animationTimeouts.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  // 📊 Carregar dados iniciais
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // 🎯 Retorno do hook
  return {
    // 📊 Dados principais
    stats,
    loading,
    error,
    
    // 🎊 Estados de animação/feedback
    recentPointsGain,
    newAchievements,
    levelUp,
    streakBonus,
    
    // 📅 Desafio semanal
    weeklyChallenge,
    challengeProgress,
    isWeeklyChallengeExpired: isWeeklyChallengeExpired(),
    weeklyTimeLeft: getWeeklyChallengeTimeLeft(),
    
    // 🎮 Ações principais
    processDraw,
    processShare,
    processListCreation,
    processFavorite,
    
    // 🔄 Funções de controle
    loadStats,
    
    // 📊 Funções utilitárias
    getNextLevelProgress: getNextLevelProgress(),
    getAchievementsByCategory: getAchievementsByCategory(),
    
    // 🎨 Funções de feedback manual
    showPointsGain,
    showNewAchievements,
    showLevelUp,
    showStreakBonus,
    
    // 🏆 Dados calculados
    currentLevel: stats?.level || LEVELS[0],
    totalAchievements: Object.keys(ACHIEVEMENTS).length,
    unlockedCount: stats?.unlockedAchievements?.length || 0,
    achievementProgress: stats ? Math.round((stats.unlockedAchievements.length / Object.keys(ACHIEVEMENTS).length) * 100) : 0,
  };
};

/**
 * 🎯 Hook simplificado para mostrar apenas pontos e nível
 * Útil para componentes que só precisam de informações básicas
 */
export const useGamificationSummary = () => {
  const { stats, loading, currentLevel, getNextLevelProgress } = useGamification();
  
  return {
    points: stats?.totalPoints || 0,
    level: currentLevel,
    levelProgress: getNextLevelProgress,
    loading,
  };
};

/**
 * 🏆 Hook para gerenciar apenas conquistas
 * Útil para tela de conquistas
 */
export const useAchievements = () => {
  const { 
    stats, 
    loading, 
    newAchievements, 
    getAchievementsByCategory,
    showNewAchievements 
  } = useGamification();
  
  const achievements = getAchievementsByCategory;
  const unlockedIds = stats?.unlockedAchievements || [];
  
  // 📊 Estatísticas das conquistas
  const achievementStats = {
    total: Object.keys(ACHIEVEMENTS).length,
    unlocked: unlockedIds.length,
    percentage: Math.round((unlockedIds.length / Object.keys(ACHIEVEMENTS).length) * 100),
    
    // Por raridade
    byRarity: {
      common: Object.values(ACHIEVEMENTS).filter(a => a.rarity === 'common').length,
      uncommon: Object.values(ACHIEVEMENTS).filter(a => a.rarity === 'uncommon').length,
      rare: Object.values(ACHIEVEMENTS).filter(a => a.rarity === 'rare').length,
      epic: Object.values(ACHIEVEMENTS).filter(a => a.rarity === 'epic').length,
      legendary: Object.values(ACHIEVEMENTS).filter(a => a.rarity === 'legendary').length,
    },
    
    // Desbloqueadas por raridade
    unlockedByRarity: {
      common: unlockedIds.filter(id => ACHIEVEMENTS[Object.keys(ACHIEVEMENTS).find(k => ACHIEVEMENTS[k].id === id)]?.rarity === 'common').length,
      uncommon: unlockedIds.filter(id => ACHIEVEMENTS[Object.keys(ACHIEVEMENTS).find(k => ACHIEVEMENTS[k].id === id)]?.rarity === 'uncommon').length,
      rare: unlockedIds.filter(id => ACHIEVEMENTS[Object.keys(ACHIEVEMENTS).find(k => ACHIEVEMENTS[k].id === id)]?.rarity === 'rare').length,
      epic: unlockedIds.filter(id => ACHIEVEMENTS[Object.keys(ACHIEVEMENTS).find(k => ACHIEVEMENTS[k].id === id)]?.rarity === 'epic').length,
      legendary: unlockedIds.filter(id => ACHIEVEMENTS[Object.keys(ACHIEVEMENTS).find(k => ACHIEVEMENTS[k].id === id)]?.rarity === 'legendary').length,
    },
  };
  
  return {
    achievements,
    achievementStats,
    newAchievements,
    loading,
    showNewAchievements,
  };
};

/**
 * 📅 Hook para gerenciar desafios semanais
 * Útil para componentes de desafios
 */
export const useWeeklyChallenge = () => {
  const {
    weeklyChallenge,
    challengeProgress,
    isWeeklyChallengeExpired,
    weeklyTimeLeft,
    loadStats,
  } = useGamification();
  
  // 📊 Calcular progresso em porcentagem
  const progressPercentage = weeklyChallenge 
    ? Math.min(100, Math.round((challengeProgress / weeklyChallenge.target) * 100))
    : 0;
  
  // 🎯 Verificar se está próximo de completar
  const isNearCompletion = progressPercentage >= 80;
  
  // ✅ Verificar se foi completado
  const isCompleted = weeklyChallenge?.completed || false;
  
  return {
    challenge: weeklyChallenge,
    progress: challengeProgress,
    progressPercentage,
    isNearCompletion,
    isCompleted,
    isExpired: isWeeklyChallengeExpired,
    timeLeft: weeklyTimeLeft,
    refreshChallenge: loadStats,
  };
};

/**
 * 🔥 Hook para gerenciar streak
 * Útil para componentes que mostram sequência
 */
export const useStreak = () => {
  const { stats, streakBonus, showStreakBonus } = useGamification();
  
  const currentStreak = stats?.currentStreak || 0;
  const longestStreak = stats?.longestStreak || 0;
  const lastDrawDate = stats?.lastDrawDate;
  
  // 📅 Verificar se o streak está em risco
  const isStreakAtRisk = () => {
    if (!lastDrawDate || currentStreak === 0) return false;
    
    const last = new Date(lastDrawDate);
    const now = new Date();
    const today = now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Se não fez sorteio hoje e ontem foi o último, está em risco
    return last.toDateString() === yesterday.toDateString() && 
           last.toDateString() !== today;
  };
  
  // 🎯 Calcular próximo marco de streak
  const getNextStreakMilestone = () => {
    const milestones = [3, 7, 14, 30, 50, 100];
    return milestones.find(m => m > currentStreak) || null;
  };
  
  return {
    currentStreak,
    longestStreak,
    streakBonus,
    isAtRisk: isStreakAtRisk(),
    nextMilestone: getNextStreakMilestone(),
    showStreakBonus,
  };
};

export default useGamification;