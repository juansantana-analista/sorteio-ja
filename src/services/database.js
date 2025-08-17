// src/services/database.js
// 💾 Sistema de Banco de Dados SQLite - Sorteio Já
// Gerencia listas, histórico, gamificação e configurações

import * as SQLite from 'expo-sqlite';

/**
 * 💾 Classe Database
 * Gerencia todas as operações de banco de dados do app
 */
class Database {
  constructor() {
    this.db = null;
    this.isInitialized = false;
  }

  /**
   * 🚀 Inicializar banco de dados
   */
  async init() {
    try {
      if (this.isInitialized) return;
      
      this.db = await SQLite.openDatabaseAsync('sorteio_ja.db');
      await this.createTables();
      this.isInitialized = true;
      
      console.log('📊 Database inicializado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao inicializar database:', error);
      throw error;
    }
  }

  /**
   * 🏗️ Criar tabelas do banco
   */
  async createTables() {
    try {
      // 📝 Tabela de listas de sorteio
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS lists (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          items TEXT NOT NULL,
          type TEXT NOT NULL DEFAULT 'names',
          is_favorite INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          used_count INTEGER DEFAULT 0
        );
      `);

      // 🎲 Tabela de histórico de sorteios
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS lottery_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          type TEXT NOT NULL,
          input_data TEXT NOT NULL,
          result TEXT NOT NULL,
          proof TEXT NOT NULL,
          points_earned INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          list_id INTEGER,
          FOREIGN KEY (list_id) REFERENCES lists (id)
        );
      `);

      // 🎮 Tabela de estatísticas de gamificação
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS game_stats (
          id INTEGER PRIMARY KEY DEFAULT 1,
          total_points INTEGER DEFAULT 0,
          total_draws INTEGER DEFAULT 0,
          current_streak INTEGER DEFAULT 0,
          longest_streak INTEGER DEFAULT 0,
          team_draws INTEGER DEFAULT 0,
          number_draws INTEGER DEFAULT 0,
          bingo_draws INTEGER DEFAULT 0,
          share_count INTEGER DEFAULT 0,
          lists_created INTEGER DEFAULT 0,
          favorite_lists INTEGER DEFAULT 0,
          weekend_draws INTEGER DEFAULT 0,
          night_draws INTEGER DEFAULT 0,
          morning_draws INTEGER DEFAULT 0,
          last_draw_date DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 🏆 Tabela de conquistas desbloqueadas
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS achievements (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          achievement_id TEXT NOT NULL UNIQUE,
          unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          points_earned INTEGER DEFAULT 0
        );
      `);

      // 📅 Tabela de desafios semanais
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS weekly_challenges (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          week_number INTEGER NOT NULL,
          challenge_id TEXT NOT NULL,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          target INTEGER NOT NULL,
          progress INTEGER DEFAULT 0,
          completed INTEGER DEFAULT 0,
          reward INTEGER NOT NULL,
          start_date DATETIME NOT NULL,
          end_date DATETIME NOT NULL,
          completed_date DATETIME,
          last_update_date DATETIME,
          used_types TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // ⚙️ Tabela de configurações
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 🎊 Inserir estatísticas padrão se não existir
      const stats = await this.db.getFirstAsync('SELECT * FROM game_stats WHERE id = 1');
      if (!stats) {
        await this.db.runAsync(`
          INSERT INTO game_stats (id) VALUES (1);
        `);
      }

      console.log('✅ Tabelas criadas com sucesso');
    } catch (error) {
      console.error('❌ Erro ao criar tabelas:', error);
      throw error;
    }
  }

  // ===============================================
  // 📝 OPERAÇÕES DE LISTAS
  // ===============================================

  /**
   * 📝 Criar nova lista
   */
  async createList(name, items, type = 'names') {
    try {
      const itemsJson = JSON.stringify(items);
      const result = await this.db.runAsync(
        'INSERT INTO lists (name, items, type) VALUES (?, ?, ?)',
        [name, itemsJson, type]
      );
      
      // Atualizar contador de listas criadas
      await this.updateGameStats({ listsCreated: 1 }, true);
      
      return result.lastInsertRowId;
    } catch (error) {
      console.error('❌ Erro ao criar lista:', error);
      throw error;
    }
  }

  /**
   * 📋 Obter todas as listas
   */
  async getLists(type = null) {
    try {
      let query = 'SELECT * FROM lists ORDER BY is_favorite DESC, updated_at DESC';
      let params = [];
      
      if (type) {
        query = 'SELECT * FROM lists WHERE type = ? ORDER BY is_favorite DESC, updated_at DESC';
        params = [type];
      }
      
      const lists = await this.db.getAllAsync(query, params);
      
      return lists.map(list => ({
        ...list,
        items: JSON.parse(list.items),
        is_favorite: Boolean(list.is_favorite),
        created_at: new Date(list.created_at),
        updated_at: new Date(list.updated_at),
      }));
    } catch (error) {
      console.error('❌ Erro ao obter listas:', error);
      return [];
    }
  }

  /**
   * 📋 Obter lista por ID
   */
  async getListById(id) {
    try {
      const list = await this.db.getFirstAsync(
        'SELECT * FROM lists WHERE id = ?',
        [id]
      );
      
      if (!list) return null;
      
      return {
        ...list,
        items: JSON.parse(list.items),
        is_favorite: Boolean(list.is_favorite),
        created_at: new Date(list.created_at),
        updated_at: new Date(list.updated_at),
      };
    } catch (error) {
      console.error('❌ Erro ao obter lista:', error);
      return null;
    }
  }

  /**
   * ✏️ Atualizar lista
   */
  async updateList(id, updates) {
    try {
      const setClause = [];
      const params = [];
      
      if (updates.name) {
        setClause.push('name = ?');
        params.push(updates.name);
      }
      
      if (updates.items) {
        setClause.push('items = ?');
        params.push(JSON.stringify(updates.items));
      }
      
      if (updates.type) {
        setClause.push('type = ?');
        params.push(updates.type);
      }
      
      if (updates.hasOwnProperty('is_favorite')) {
        setClause.push('is_favorite = ?');
        params.push(updates.is_favorite ? 1 : 0);
      }
      
      setClause.push('updated_at = CURRENT_TIMESTAMP');
      params.push(id);
      
      await this.db.runAsync(
        `UPDATE lists SET ${setClause.join(', ')} WHERE id = ?`,
        params
      );
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao atualizar lista:', error);
      return false;
    }
  }

  /**
   * 🗑️ Deletar lista
   */
  async deleteList(id) {
    try {
      await this.db.runAsync('DELETE FROM lists WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('❌ Erro ao deletar lista:', error);
      return false;
    }
  }

  /**
   * ⭐ Favoritar/desfavoritar lista
   */
  async toggleFavorite(id) {
    try {
      const list = await this.getListById(id);
      if (!list) return false;
      
      const newFavoriteStatus = !list.is_favorite;
      await this.updateList(id, { is_favorite: newFavoriteStatus });
      
      // Se favoritou, incrementar contador
      if (newFavoriteStatus) {
        await this.updateGameStats({ favoriteLists: 1 }, true);
      }
      
      return newFavoriteStatus;
    } catch (error) {
      console.error('❌ Erro ao favoritar lista:', error);
      return false;
    }
  }

  /**
   * 📊 Incrementar uso da lista
   */
  async incrementListUsage(id) {
    try {
      await this.db.runAsync(
        'UPDATE lists SET used_count = used_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );
    } catch (error) {
      console.error('❌ Erro ao incrementar uso da lista:', error);
    }
  }

  // ===============================================
  // 🎲 OPERAÇÕES DE HISTÓRICO
  // ===============================================

  /**
   * 📊 Salvar sorteio no histórico
   */
  async saveLotteryResult(type, inputData, result, proof, pointsEarned = 0, listId = null) {
    try {
      const resultId = await this.db.runAsync(
        'INSERT INTO lottery_history (type, input_data, result, proof, points_earned, list_id) VALUES (?, ?, ?, ?, ?, ?)',
        [
          type,
          JSON.stringify(inputData),
          JSON.stringify(result),
          JSON.stringify(proof),
          pointsEarned,
          listId
        ]
      );
      
      // Se usou uma lista, incrementar contador
      if (listId) {
        await this.incrementListUsage(listId);
      }
      
      return resultId.lastInsertRowId;
    } catch (error) {
      console.error('❌ Erro ao salvar resultado:', error);
      throw error;
    }
  }

  /**
   * 📋 Obter histórico de sorteios
   */
  async getLotteryHistory(limit = 50, offset = 0) {
    try {
      const history = await this.db.getAllAsync(
        `SELECT lh.*, l.name as list_name 
         FROM lottery_history lh 
         LEFT JOIN lists l ON lh.list_id = l.id 
         ORDER BY lh.created_at DESC 
         LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      
      return history.map(item => ({
        ...item,
        input_data: JSON.parse(item.input_data),
        result: JSON.parse(item.result),
        proof: JSON.parse(item.proof),
        created_at: new Date(item.created_at),
      }));
    } catch (error) {
      console.error('❌ Erro ao obter histórico:', error);
      return [];
    }
  }

  /**
   * 🎲 Obter sorteio por ID
   */
  async getLotteryById(id) {
    try {
      const lottery = await this.db.getFirstAsync(
        'SELECT * FROM lottery_history WHERE id = ?',
        [id]
      );
      
      if (!lottery) return null;
      
      return {
        ...lottery,
        input_data: JSON.parse(lottery.input_data),
        result: JSON.parse(lottery.result),
        proof: JSON.parse(lottery.proof),
        created_at: new Date(lottery.created_at),
      };
    } catch (error) {
      console.error('❌ Erro ao obter sorteio:', error);
      return null;
    }
  }

  /**
   * 🗑️ Limpar histórico antigo
   */
  async cleanOldHistory(daysToKeep = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
      await this.db.runAsync(
        'DELETE FROM lottery_history WHERE created_at < ?',
        [cutoffDate.toISOString()]
      );
    } catch (error) {
      console.error('❌ Erro ao limpar histórico:', error);
    }
  }

  // ===============================================
  // 🎮 OPERAÇÕES DE GAMIFICAÇÃO
  // ===============================================

  /**
   * 📊 Obter estatísticas de gamificação
   */
  async getGameStats() {
    try {
      const stats = await this.db.getFirstAsync('SELECT * FROM game_stats WHERE id = 1');
      
      if (!stats) {
        // Criar estatísticas padrão
        await this.db.runAsync('INSERT INTO game_stats (id) VALUES (1)');
        // Retornar estatísticas padrão em vez de chamar recursivamente
        return {
          id: 1,
          total_points: 0,
          total_draws: 0,
          current_streak: 0,
          longest_streak: 0,
          team_draws: 0,
          number_draws: 0,
          bingo_draws: 0,
          share_count: 0,
          lists_created: 0,
          favorite_lists: 0,
          weekend_draws: 0,
          night_draws: 0,
          morning_draws: 0,
          last_draw_date: null,
          created_at: new Date(),
          updated_at: new Date(),
        };
      }
      
      return {
        ...stats,
        last_draw_date: stats.last_draw_date ? new Date(stats.last_draw_date) : null,
        created_at: new Date(stats.created_at),
        updated_at: new Date(stats.updated_at),
      };
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas:', error);
      return {};
    }
  }

  /**
   * 📊 Atualizar estatísticas de gamificação
   */
  async updateGameStats(updates, increment = false) {
    try {
      // Verificar se o registro existe, se não, criar
      const stats = await this.db.getFirstAsync('SELECT * FROM game_stats WHERE id = 1');
      if (!stats) {
        await this.db.runAsync(`
          INSERT INTO game_stats (id) VALUES (1);
        `);
      }
      
      const setClause = [];
      const params = [];
      
      for (const [key, value] of Object.entries(updates)) {
        if (increment) {
          setClause.push(`${key} = ${key} + ?`);
        } else {
          setClause.push(`${key} = ?`);
        }
        params.push(value);
      }
      
      setClause.push('updated_at = CURRENT_TIMESTAMP');
      
      await this.db.runAsync(
        `UPDATE game_stats SET ${setClause.join(', ')} WHERE id = 1`,
        params
      );
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao atualizar estatísticas:', error);
      return false;
    }
  }

  /**
   * 💰 Adicionar pontos
   */
  async addPoints(points) {
    try {
      await this.updateGameStats({ total_points: points }, true);
      return true;
    } catch (error) {
      console.error('❌ Erro ao adicionar pontos:', error);
      return false;
    }
  }

  // ===============================================
  // 🏆 OPERAÇÕES DE CONQUISTAS
  // ===============================================

  /**
   * 🏆 Desbloquear conquista
   */
  async unlockAchievement(achievementId, pointsEarned = 0) {
    try {
      // Verificar se já foi desbloqueada
      const existing = await this.db.getFirstAsync(
        'SELECT * FROM achievements WHERE achievement_id = ?',
        [achievementId]
      );
      
      if (existing) return false; // Já desbloqueada
      
      await this.db.runAsync(
        'INSERT INTO achievements (achievement_id, points_earned) VALUES (?, ?)',
        [achievementId, pointsEarned]
      );
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao desbloquear conquista:', error);
      return false;
    }
  }

  /**
   * 📋 Obter conquistas desbloqueadas
   */
  async getUnlockedAchievements() {
    try {
      const achievements = await this.db.getAllAsync(
        'SELECT achievement_id FROM achievements ORDER BY unlocked_at DESC'
      );
      
      return achievements.map(a => a.achievement_id);
    } catch (error) {
      console.error('❌ Erro ao obter conquistas:', error);
      return [];
    }
  }

  // ===============================================
  // 📅 OPERAÇÕES DE DESAFIOS SEMANAIS
  // ===============================================

  /**
   * 📅 Salvar desafio semanal
   */
  async saveWeeklyChallenge(challenge) {
    try {
      await this.db.runAsync(
        `INSERT INTO weekly_challenges 
         (week_number, challenge_id, name, description, target, reward, start_date, end_date, used_types)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          challenge.week,
          challenge.id,
          challenge.name,
          challenge.description,
          challenge.target,
          challenge.reward,
          challenge.startDate,
          challenge.endDate,
          JSON.stringify(challenge.usedTypes || [])
        ]
      );
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao salvar desafio semanal:', error);
      return false;
    }
  }

  /**
   * 📅 Obter desafio semanal
   */
  async getWeeklyChallenge(weekNumber) {
    try {
      const challenge = await this.db.getFirstAsync(
        'SELECT * FROM weekly_challenges WHERE week_number = ? ORDER BY created_at DESC LIMIT 1',
        [weekNumber]
      );
      
      if (!challenge) return null;
      
      return {
        ...challenge,
        completed: Boolean(challenge.completed),
        usedTypes: JSON.parse(challenge.used_types || '[]'),
        start_date: new Date(challenge.start_date),
        end_date: new Date(challenge.end_date),
        completed_date: challenge.completed_date ? new Date(challenge.completed_date) : null,
        last_update_date: challenge.last_update_date ? new Date(challenge.last_update_date) : null,
      };
    } catch (error) {
      console.error('❌ Erro ao obter desafio semanal:', error);
      return null;
    }
  }

  /**
   * 📅 Atualizar desafio semanal
   */
  async updateWeeklyChallenge(challenge) {
    try {
      await this.db.runAsync(
        `UPDATE weekly_challenges 
         SET progress = ?, completed = ?, completed_date = ?, last_update_date = ?, used_types = ?
         WHERE week_number = ? AND challenge_id = ?`,
        [
          challenge.progress,
          challenge.completed ? 1 : 0,
          challenge.completedDate || null,
          challenge.lastUpdateDate || null,
          JSON.stringify(challenge.usedTypes || []),
          challenge.week,
          challenge.id
        ]
      );
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao atualizar desafio semanal:', error);
      return false;
    }
  }

  // ===============================================
  // ⚙️ OPERAÇÕES DE CONFIGURAÇÕES
  // ===============================================

  /**
   * ⚙️ Salvar configuração
   */
  async setSetting(key, value) {
    try {
      await this.db.runAsync(
        'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
        [key, JSON.stringify(value)]
      );
      return true;
    } catch (error) {
      console.error('❌ Erro ao salvar configuração:', error);
      return false;
    }
  }

  /**
   * ⚙️ Obter configuração
   */
  async getSetting(key, defaultValue = null) {
    try {
      const setting = await this.db.getFirstAsync(
        'SELECT value FROM settings WHERE key = ?',
        [key]
      );
      
      if (!setting) return defaultValue;
      
      return JSON.parse(setting.value);
    } catch (error) {
      console.error('❌ Erro ao obter configuração:', error);
      return defaultValue;
    }
  }

  /**
   * ⚙️ Obter todas as configurações
   */
  async getAllSettings() {
    try {
      const settings = await this.db.getAllAsync('SELECT * FROM settings');
      
      const result = {};
      settings.forEach(setting => {
        result[setting.key] = JSON.parse(setting.value);
      });
      
      return result;
    } catch (error) {
      console.error('❌ Erro ao obter configurações:', error);
      return {};
    }
  }

  // ===============================================
  // 🧹 OPERAÇÕES DE MANUTENÇÃO
  // ===============================================

  /**
   * 🧹 Limpar dados antigos
   */
  async cleanup() {
    try {
      // Limpar histórico antigo (mais de 90 dias)
      await this.cleanOldHistory(90);
      
      // Limpar desafios semanais antigos (mais de 8 semanas)
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 56); // 8 semanas
      
      await this.db.runAsync(
        'DELETE FROM weekly_challenges WHERE created_at < ?',
        [cutoffDate.toISOString()]
      );
      
      console.log('🧹 Limpeza do banco concluída');
    } catch (error) {
      console.error('❌ Erro na limpeza:', error);
    }
  }

  /**
   * 📊 Obter estatísticas do banco
   */
  async getDatabaseStats() {
    try {
      const stats = {};
      
      // Contar registros em cada tabela
      const tables = ['lists', 'lottery_history', 'achievements', 'weekly_challenges', 'settings'];
      
      for (const table of tables) {
        const result = await this.db.getFirstAsync(`SELECT COUNT(*) as count FROM ${table}`);
        stats[table] = result.count;
      }
      
      return stats;
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas do banco:', error);
      return {};
    }
  }

  /**
   * 🔄 Reset completo (apenas para desenvolvimento)
   */
  async resetDatabase() {
    try {
      const tables = ['lists', 'lottery_history', 'game_stats', 'achievements', 'weekly_challenges', 'settings'];
      
      for (const table of tables) {
        await this.db.execAsync(`DELETE FROM ${table}`);
      }
      
      // Reinserir estatísticas padrão
      await this.db.runAsync('INSERT INTO game_stats (id) VALUES (1)');
      
      console.log('🔄 Database resetado');
      return true;
    } catch (error) {
      console.error('❌ Erro ao resetar database:', error);
      return false;
    }
  }
}

// 💾 Instância única do banco
export const database = new Database();

// 🚀 Inicializar automaticamente
database.init().catch(console.error);

export default database;