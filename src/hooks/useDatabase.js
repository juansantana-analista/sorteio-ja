// useDatabase.js
// 🗄️ Hook personalizado para operações do banco de dados
// Fornece métodos para gerenciar listas, sorteios e histórico

import { useState, useCallback } from 'react';
import { database } from '../services/database';

/**
 * 🗄️ Hook para operações do banco de dados
 */
export function useDatabase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * 📝 Criar nova lista
   */
  const createList = useCallback(async (listData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await database.createList(listData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 📋 Buscar todas as listas
   */
  const getLists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const lists = await database.getLists();
      return lists;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🔍 Buscar lista por ID
   */
  const getListById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const list = await database.getListById(id);
      return list;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * ✏️ Atualizar lista
   */
  const updateList = useCallback(async (id, listData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await database.updateList(id, listData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🗑️ Excluir lista
   */
  const deleteList = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await database.deleteList(id);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🎲 Salvar resultado de sorteio
   */
  const saveDrawResult = useCallback(async (drawData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await database.saveDrawResult(drawData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 📚 Buscar histórico de sorteios
   */
  const getHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const history = await database.getHistory();
      return history;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🔍 Verificar hash
   */
  const verifyHash = useCallback(async (hash) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await database.verifyHash(hash);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🧹 Limpar histórico
   */
  const clearHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await database.clearHistory();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 📊 Buscar estatísticas
   */
  const getStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const stats = await database.getStats();
      return stats;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🔄 Fazer backup dos dados
   */
  const backupData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const backup = await database.backupData();
      return backup;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 📥 Restaurar dados do backup
   */
  const restoreData = useCallback(async (backupData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await database.restoreData(backupData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🗑️ Limpar erro
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // 📊 Estado
    loading,
    error,
    
    // 📝 Operações de lista
    createList,
    getLists,
    getListById,
    updateList,
    deleteList,
    
    // 🎲 Operações de sorteio
    saveDrawResult,
    getHistory,
    verifyHash,
    
    // 🗄️ Operações de banco
    clearHistory,
    getStats,
    backupData,
    restoreData,
    
    // 🧹 Utilitários
    clearError,
  };
}
