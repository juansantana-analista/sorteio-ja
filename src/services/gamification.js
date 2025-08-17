// src/services/gamification.js
// 🎮 Sistema de Gamificação Sorteio Já
// Gerencia pontos, conquistas, desafios e engajamento do usuário

import { database } from './database';

/**
 * 🎯 Sistema de Pontuação
 * Diferentes ações geram diferentes quantidades de pontos
 */
export const POINTS_CONFIG = {
  // 🎲 Ações básicas de sorteio
  BASIC_DRAW: 10,           // Sorteio básico (nomes, números)
  TEAM_DRAW: 15,            // Sorteio de times/pares
  ORDER_DRAW: 12,           // Sorteio de ordem
  BINGO_DRAW: 20,           // Sorteio de bingo
  
  // 🏆 Bônus por engajamento
  FIRST_DAILY_DRAW: 25,     // Primeiro sorteio do dia
  STREAK_BONUS_BASE: 5,     // Bônus por dia consecutivo (5 * dias)
  WEEKEND_BONUS: 10,        // Bônus extra no fim de semana
  
  // 📝 Ações de organização
  CREATE_LIST: 5,           // Criar nova lista
  SAVE_FAVORITE: 3,         // Salvar lista como favorita
  SHARE_RESULT: 8,          // Compartilhar resultado
  
  // 🎯 Metas e desafios
  COMPLETE_CHALLENGE: 50,   // Completar desafio semanal
  UNLOCK_ACHIEVEMENT: 100,  // Desbloquear conquista
  
  // 🎁 Bônus especiais
  LUCKY_DRAW: 50,           // Sorteio em horário "da sorte"
  PERFECT_WEEK: 200,        // 7 dias consecutivos de sorteios
  MILESTONE_BONUS: 500,     // Marcos especiais (100º, 500º sorteio)
};

/**
 * 🏅 Sistema de Conquistas (Achievements)
 * Cada conquista tem ID, nome, descrição, critério e recompensa
 */
export const ACHIEVEMENTS = {
  // 🎯 Conquistas básicas
  FIRST_DRAW: {
    id: 'first_draw',
    name: 'Primeiro Sorteio',
    description: 'Realize seu primeiro sorteio',
    icon: '🎯',
    points: 50,
    rarity: 'common',
    condition: (stats) => stats.totalDraws >= 1,
  },
  
  TENTH_DRAW: {
    id: 'tenth_draw',
    name: 'Dezena Completa',
    description: 'Realize 10 sorteios',
    icon: '🔟',
    points: 100,
    rarity: 'common',
    condition: (stats) => stats.totalDraws >= 10,
  },
  
  HUNDREDTH_DRAW: {
    id: 'hundredth_draw',
    name: 'Centenário',
    description: 'Realize 100 sorteios',
    icon: '💯',
    points: 500,
    rarity: 'epic',
    condition: (stats) => stats.totalDraws >= 100,
  },

  // 🔥 Conquistas de streak
  STREAK_3_DAYS: {
    id: 'streak_3_days',
    name: 'Em Chamas',
    description: '3 dias consecutivos de sorteios',
    icon: '🔥',
    points: 150,
    rarity: 'uncommon',
    condition: (stats) => stats.currentStreak >= 3,
  },
  
  STREAK_7_DAYS: {
    id: 'streak_7_days',
    name: 'Semana Perfeita',
    description: '7 dias consecutivos de sorteios',
    icon: '🌟',
    points: 300,
    rarity: 'rare',
    condition: (stats) => stats.currentStreak >= 7,
  },
  
  STREAK_30_DAYS: {
    id: 'streak_30_days',
    name: 'Mestre da Sorte',
    description: '30 dias consecutivos de sorteios',
    icon: '👑',
    points: 1000,
    rarity: 'legendary',
    condition: (stats) => stats.currentStreak >= 30,
  },

  // 🎲 Conquistas por tipo de sorteio
  TEAM_MASTER: {
    id: 'team_master',
    name: 'Organizador de Times',
    description: 'Realize 25 sorteios de times',
    icon: '⚽',
    points: 200,
    rarity: 'uncommon',
    condition: (stats) => stats.teamDraws >= 25,
  },
  
  NUMBER_WIZARD: {
    id: 'number_wizard',
    name: 'Mago dos Números',
    description: 'Realize 50 sorteios de números',
    icon: '🔢',
    points: 250,
    rarity: 'rare',
    condition: (stats) => stats.numberDraws >= 50,
  },
  
  BINGO_KING: {
    id: 'bingo_king',
    name: 'Rei do Bingo',
    description: 'Realize 10 sorteios de bingo',
    icon: '🎰',
    points: 300,
    rarity: 'rare',
    condition: (stats) => stats.bingoDraws >= 10,
  },

  // 📱 Conquistas de engajamento
  SHARER: {
    id: 'sharer',
    name: 'Compartilhador',
    description: 'Compartilhe 10 resultados',
    icon: '📤',
    points: 150,
    rarity: 'uncommon',
    condition: (stats) => stats.shareCount >= 10,
  },
  
  ORGANIZER: {
    id: 'organizer',
    name: 'Organizador',
    description: 'Crie 20 listas diferentes',
    icon: '📋',
    points: 200,
    rarity: 'uncommon',
    condition: (stats) => stats.listsCreated >= 20,
  },
  
  COLLECTOR: {
    id: 'collector',
    name: 'Colecionador',
    description: 'Salve 15 listas como favoritas',
    icon: '⭐',
    points: 180,
    rarity: 'uncommon',
    condition: (stats) => stats.favoriteLists >= 15,
  },

  // 🎊 Conquistas especiais
  WEEKEND_WARRIOR: {
    id: 'weekend_warrior',
    name: 'Guerreiro do Fim de Semana',
    description: 'Realize sorteios em 10 fins de semana',
    icon: '🏖️',
    points: 250,
    rarity: 'rare',
    condition: (stats) => stats.weekendDraws >= 20, // 2 por fim de semana
  },
  
  NIGHT_OWL: {
    id: 'night_owl',
    name: 'Coruja Noturna',
    description: 'Realize 15 sorteios após 22h',
    icon: '🦉',
    points: 200,
    rarity: 'uncommon',
    condition: (stats) => stats.nightDraws >= 15,
  },
  
  EARLY_BIRD: {
    id: 'early_bird',
    name: 'Madrugador',
    description: 'Realize 15 sorteios antes das 8h',
    icon: '🐦',
    points: 200,
    rarity: 'uncommon',
    condition: (stats) => stats.morningDraws >= 15,
  },

  // 💎 Conquistas lendárias
  LOTTERY_LEGEND: {
    id: 'lottery_legend',
    name: 'Lenda dos Sorteios',
    description: 'Realize 1000 sorteios',
    icon: '💎',
    points: 2000,
    rarity: 'legendary',
    condition: (stats) => stats.totalDraws >= 1000,
  },
  
  POINT_MASTER: {
    id: 'point_master',
    name: 'Mestre dos Pontos',
    description: 'Acumule 10.000 pontos',
    icon: '🏆',
    points: 1000,
    rarity: 'legendary',
    condition: (stats) => stats.totalPoints >= 10000,
  },
};

/**
 * 🎯 Sistema de Desafios Semanais
 * Desafios rotativos para manter engajamento
 */
export const WEEKLY_CHALLENGES = {
  DAILY_DRAWER: {
    id: 'daily_drawer',
    name: 'Sorteador Diário',
    description: 'Realize um sorteio por 5 dias desta semana',
    target: 5,
    reward: 200,
    icon: '📅',
    type: 'daily_draws',
  },
  
  VARIETY_SEEKER: {
    id: 'variety_seeker',
    name: 'Buscador de Variedade',
    description: 'Use 3 tipos diferentes de sorteio esta semana',
    target: 3,
    reward: 150,
    icon: '🎭',
    type: 'draw_types',
  },
  
  SOCIAL_BUTTERFLY: {
    id: 'social_butterfly',
    name: 'Borboleta Social',
    description: 'Compartilhe 5 resultados esta semana',
    target: 5,
    reward: 180,
    icon: '🦋',
    type: 'shares',
  },
  
  POWER_USER: {
    id: 'power_user',
    name: 'Usuário Power',
    description: 'Realize 20 sorteios esta semana',
    target: 20,
    reward: 300,
    icon: '⚡',
    type: 'total_draws',
  },
  
  ORGANIZER_WEEK: {
    id: 'organizer_week',
    name: 'Semana do Organizador',
    description: 'Crie 3 novas listas esta semana',
    target: 3,
    reward: 120,
    icon: '📝',
    type: 'lists_created',
  },
};

/**
 * 🏆 Sistema de Níveis
 * Baseado no total de pontos acumulados
 */
export const LEVELS = [
  { level: 1, name: 'Iniciante', minPoints: 0, icon: '🌱', color: '#22c55e' },
  { level: 2, name: 'Aprendiz', minPoints: 100, icon: '📚', color: '#3b82f6' },
  { level: 3, name: 'Sorteirador', minPoints: 300, icon: '🎲', color: '#8b5cf6' },
  { level: 4, name: 'Organizador', minPoints: 600, icon: '📋', color: '#f59e0b' },
  { level: 5, name: 'Especialista', minPoints: 1000, icon: '🎯', color: '#ef4444' },
  { level: 6, name: 'Mestre', minPoints: 1500, icon: '🧙‍♂️', color: '#6366f1' },
  { level: 7, name: 'Guru', minPoints: 2500, icon: '🧘‍♂️', color: '#8b5cf6' },
  { level: 8, name: 'Lenda', minPoints: 4000, icon: '👑', color: '#fbbf24' },
  { level: 9, name: 'Mito', minPoints: 6000, icon: '⚡', color: '#f97316' },
  { level: 10, name: 'Divindade', minPoints: 10000, icon: '✨', color: '#ec4899' },
];

/**
 * 🎮 Classe principal do sistema de gamificação
 */
export class GamificationSystem {
  constructor() {
    this.db = database;
  }

  /**
   * 📊 Obter estatísticas do usuário
   */
  async getUserStats() {
    try {
      const stats = await this.db.getGameStats();
      return {
        totalPoints: stats.totalPoints || 0,
        totalDraws: stats.totalDraws || 0,
        currentStreak: stats.currentStreak || 0,
        longestStreak: stats.longestStreak || 0,
        teamDraws: stats.teamDraws || 0,
        numberDraws: stats.numberDraws || 0,
        bingoDraws: stats.bingoDraws || 0,
        shareCount: stats.shareCount || 0,
        listsCreated: stats.listsCreated || 0,
        favoriteLists: stats.favoriteLists || 0,
        weekendDraws: stats.weekendDraws || 0,
        nightDraws: stats.nightDraws || 0,
        morningDraws: stats.morningDraws || 0,
        lastDrawDate: stats.lastDrawDate || null,
        level: this.calculateLevel(stats.totalPoints || 0),
        unlockedAchievements: await this.db.getUnlockedAchievements(),
        currentWeeklyChallenge: await this.getCurrentWeeklyChallenge(),
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return this.getDefaultStats();
    }
  }

  /**
   * 🏆 Calcular nível baseado nos pontos
   */
  calculateLevel(points) {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (points >= LEVELS[i].minPoints) {
        return LEVELS[i];
      }
    }
    return LEVELS[0];
  }

  /**
   * 🎯 Calcular pontos por ação de sorteio
   */
  calculateDrawPoints(drawType, isFirstToday = false, currentStreak = 0) {
    let points = 0;
    
    // Pontos base por tipo
    switch (drawType) {
      case 'names':
        points += POINTS_CONFIG.BASIC_DRAW;
        break;
      case 'numbers':
        points += POINTS_CONFIG.BASIC_DRAW;
        break;
      case 'teams':
        points += POINTS_CONFIG.TEAM_DRAW;
        break;
      case 'order':
        points += POINTS_CONFIG.ORDER_DRAW;
        break;
      case 'bingo':
        points += POINTS_CONFIG.BINGO_DRAW;
        break;
      default:
        points += POINTS_CONFIG.BASIC_DRAW;
    }
    
    // Bônus primeiro do dia
    if (isFirstToday) {
      points += POINTS_CONFIG.FIRST_DAILY_DRAW;
    }
    
    // Bônus de streak
    if (currentStreak > 1) {
      points += POINTS_CONFIG.STREAK_BONUS_BASE * Math.min(currentStreak, 30);
    }
    
    // Bônus de fim de semana
    const now = new Date();
    if (now.getDay() === 0 || now.getDay() === 6) {
      points += POINTS_CONFIG.WEEKEND_BONUS;
    }
    
    // Bônus horário da sorte (entre 19h e 21h)
    const hour = now.getHours();
    if (hour >= 19 && hour <= 21) {
      points += POINTS_CONFIG.LUCKY_DRAW;
    }
    
    return points;
  }

  /**
   * 🎮 Processar ação de sorteio
   */
  async processDraw(drawType, drawData) {
    try {
      const currentStats = await this.getUserStats();
      const now = new Date();
      const today = now.toDateString();
      const lastDrawDate = currentStats.lastDrawDate ? new Date(currentStats.lastDrawDate).toDateString() : null;
      
      // Verificar se é o primeiro sorteio do dia
      const isFirstToday = lastDrawDate !== today;
      
      // Calcular novo streak
      let newStreak = currentStats.currentStreak;
      if (isFirstToday) {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        
        if (lastDrawDate === yesterdayStr) {
          newStreak += 1; // Continua o streak
        } else if (lastDrawDate !== today) {
          newStreak = 1; // Inicia novo streak
        }
      }
      
      // Calcular pontos
      const points = this.calculateDrawPoints(drawType, isFirstToday, newStreak);
      
      // Atualizar estatísticas
      const updates = {
        totalPoints: currentStats.totalPoints + points,
        totalDraws: currentStats.totalDraws + 1,
        currentStreak: newStreak,
        longestStreak: Math.max(currentStats.longestStreak, newStreak),
        lastDrawDate: now.toISOString(),
      };
      
      // Atualizar contadores específicos
      switch (drawType) {
        case 'teams':
          updates.teamDraws = (currentStats.teamDraws || 0) + 1;
          break;
        case 'numbers':
          updates.numberDraws = (currentStats.numberDraws || 0) + 1;
          break;
        case 'bingo':
          updates.bingoDraws = (currentStats.bingoDraws || 0) + 1;
          break;
      }
      
      // Contadores por horário
      const hour = now.getHours();
      if (hour >= 22 || hour < 6) {
        updates.nightDraws = (currentStats.nightDraws || 0) + 1;
      } else if (hour >= 6 && hour < 8) {
        updates.morningDraws = (currentStats.morningDraws || 0) + 1;
      }
      
      // Contador de fim de semana
      if (now.getDay() === 0 || now.getDay() === 6) {
        updates.weekendDraws = (currentStats.weekendDraws || 0) + 1;
      }
      
      // Salvar no banco
      await this.db.updateGameStats(updates);
      
      // Verificar conquistas desbloqueadas
      const newAchievements = await this.checkAchievements({ ...currentStats, ...updates });
      
      // Atualizar desafio semanal
      await this.updateWeeklyChallenge(drawType);
      
      return {
        pointsEarned: points,
        newLevel: this.calculateLevel(updates.totalPoints),
        oldLevel: currentStats.level,
        newStreak: newStreak,
        isFirstToday,
        unlockedAchievements: newAchievements,
        totalPoints: updates.totalPoints,
      };
      
    } catch (error) {
      console.error('Erro ao processar sorteio:', error);
      return null;
    }
  }

  /**
   * 🏅 Verificar conquistas desbloqueadas
   */
  async checkAchievements(stats) {
    try {
      const unlockedIds = await this.db.getUnlockedAchievements();
      const newlyUnlocked = [];
      
      for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
        if (!unlockedIds.includes(achievement.id) && achievement.condition(stats)) {
          // Desbloquear conquista
          await this.db.unlockAchievement(achievement.id);
          
          // Adicionar pontos bônus
          await this.db.addPoints(achievement.points);
          
          newlyUnlocked.push(achievement);
        }
      }
      
      return newlyUnlocked;
    } catch (error) {
      console.error('Erro ao verificar conquistas:', error);
      return [];
    }
  }

  /**
   * 📅 Obter desafio semanal atual
   */
  async getCurrentWeeklyChallenge() {
    try {
      const weekNumber = this.getWeekNumber();
      const storedChallenge = await this.db.getWeeklyChallenge(weekNumber);
      
      if (storedChallenge) {
        return storedChallenge;
      }
      
      // Gerar novo desafio
      const challenges = Object.values(WEEKLY_CHALLENGES);
      const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
      
      const newChallenge = {
        ...randomChallenge,
        week: weekNumber,
        progress: 0,
        completed: false,
        startDate: this.getWeekStart().toISOString(),
        endDate: this.getWeekEnd().toISOString(),
      };
      
      await this.db.saveWeeklyChallenge(newChallenge);
      return newChallenge;
    } catch (error) {
      console.error('Erro ao obter desafio semanal:', error);
      return null;
    }
  }

  /**
   * 🎯 Atualizar progresso do desafio semanal
   */
  async updateWeeklyChallenge(action) {
    try {
      const challenge = await this.getCurrentWeeklyChallenge();
      if (!challenge || challenge.completed) return;
      
      let shouldUpdate = false;
      let newProgress = challenge.progress;
      
      switch (challenge.type) {
        case 'daily_draws':
          // Verificar se é primeiro sorteio do dia
          const today = new Date().toDateString();
          const lastUpdate = challenge.lastUpdateDate ? new Date(challenge.lastUpdateDate).toDateString() : null;
          if (lastUpdate !== today) {
            newProgress += 1;
            shouldUpdate = true;
          }
          break;
          
        case 'total_draws':
          newProgress += 1;
          shouldUpdate = true;
          break;
          
        case 'draw_types':
          if (!challenge.usedTypes) challenge.usedTypes = [];
          if (!challenge.usedTypes.includes(action)) {
            challenge.usedTypes.push(action);
            newProgress = challenge.usedTypes.length;
            shouldUpdate = true;
          }
          break;
      }
      
      if (shouldUpdate) {
        challenge.progress = newProgress;
        challenge.lastUpdateDate = new Date().toISOString();
        
        // Verificar se completou
        if (newProgress >= challenge.target && !challenge.completed) {
          challenge.completed = true;
          challenge.completedDate = new Date().toISOString();
          
          // Adicionar recompensa
          await this.db.addPoints(challenge.reward);
        }
        
        await this.db.updateWeeklyChallenge(challenge);
      }
      
      return challenge;
    } catch (error) {
      console.error('Erro ao atualizar desafio semanal:', error);
      return null;
    }
  }

  /**
   * 📤 Processar compartilhamento
   */
  async processShare() {
    try {
      const stats = await this.getUserStats();
      const points = POINTS_CONFIG.SHARE_RESULT;
      
      await this.db.updateGameStats({
        shareCount: stats.shareCount + 1,
        totalPoints: stats.totalPoints + points,
      });
      
      // Atualizar desafio semanal se necessário
      await this.updateWeeklyChallenge('shares');
      
      return { pointsEarned: points };
    } catch (error) {
      console.error('Erro ao processar compartilhamento:', error);
      return null;
    }
  }

  /**
   * 📝 Processar criação de lista
   */
  async processListCreation() {
    try {
      const stats = await this.getUserStats();
      const points = POINTS_CONFIG.CREATE_LIST;
      
      await this.db.updateGameStats({
        listsCreated: stats.listsCreated + 1,
        totalPoints: stats.totalPoints + points,
      });
      
      // Atualizar desafio semanal se necessário
      await this.updateWeeklyChallenge('lists_created');
      
      return { pointsEarned: points };
    } catch (error) {
      console.error('Erro ao processar criação de lista:', error);
      return null;
    }
  }

  /**
   * ⭐ Processar favoritar lista
   */
  async processFavorite() {
    try {
      const stats = await this.getUserStats();
      const points = POINTS_CONFIG.SAVE_FAVORITE;
      
      await this.db.updateGameStats({
        favoriteLists: stats.favoriteLists + 1,
        totalPoints: stats.totalPoints + points,
      });
      
      return { pointsEarned: points };
    } catch (error) {
      console.error('Erro ao processar favorito:', error);
      return null;
    }
  }

  // 🛠️ Funções utilitárias
  getWeekNumber() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now - start;
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.floor(diff / oneWeek);
  }

  getWeekStart() {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);
    return start;
  }

  getWeekEnd() {
    const start = this.getWeekStart();
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  }

  getDefaultStats() {
    return {
      totalPoints: 0,
      totalDraws: 0,
      currentStreak: 0,
      longestStreak: 0,
      teamDraws: 0,
      numberDraws: 0,
      bingoDraws: 0,
      shareCount: 0,
      listsCreated: 0,
      favoriteLists: 0,
      weekendDraws: 0,
      nightDraws: 0,
      morningDraws: 0,
      lastDrawDate: null,
      level: LEVELS[0],
      unlockedAchievements: [],
      currentWeeklyChallenge: null,
    };
  }
}

// 🎮 Instância única do sistema
export const gamificationSystem = new GamificationSystem();

export default gamificationSystem;