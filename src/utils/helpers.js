// helpers.js
// 🛠️ Funções auxiliares e utilitários do app Sorteio Já
// Fornece métodos reutilizáveis para operações comuns

import { Platform } from 'react-native';
import { APP_CONFIG, GAMIFICATION_CONFIG } from './constants';

/**
 * 📱 Verificar se é iOS
 */
export const isIOS = () => Platform.OS === 'ios';

/**
 * 🤖 Verificar se é Android
 */
export const isAndroid = () => Platform.OS === 'android';

/**
 * 🌐 Verificar se é web
 */
export const isWeb = () => Platform.OS === 'web';

/**
 * 📏 Obter dimensões da tela
 */
export const getScreenDimensions = () => {
  const { width, height } = require('react-native').Dimensions.get('window');
  return { width, height };
};

/**
 * 📱 Verificar tamanho da tela
 */
export const getScreenSize = () => {
  const { width } = getScreenDimensions();
  
  if (width < 375) return 'small';
  if (width < 768) return 'medium';
  if (width < 1024) return 'large';
  return 'xlarge';
};

/**
 * 🔄 Debounce function
 */
export const debounce = (func, delay = APP_CONFIG.DEBOUNCE_DELAY) => {
  let timeoutId;
  
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * 🔄 Throttle function
 */
export const throttle = (func, limit = 16) => {
  let inThrottle;
  
  return (...args) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * 📅 Formatar data
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('pt-BR', defaultOptions);
  } catch (error) {
    console.error('❌ Erro ao formatar data:', error);
    return 'Data inválida';
  }
};

/**
 * ⏰ Formatar hora
 */
export const formatTime = (date, options = {}) => {
  const defaultOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  };
  
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleTimeString('pt-BR', defaultOptions);
  } catch (error) {
    console.error('❌ Erro ao formatar hora:', error);
    return 'Hora inválida';
  }
};

/**
 * 📅 Formatar data e hora
 */
export const formatDateTime = (date) => {
  try {
    const dateObj = new Date(date);
    const dateStr = formatDate(dateObj);
    const timeStr = formatTime(dateObj);
    return `${dateStr} às ${timeStr}`;
  } catch (error) {
    console.error('❌ Erro ao formatar data e hora:', error);
    return 'Data/hora inválida';
  }
};

/**
 * 📅 Formatar data relativa
 */
export const formatRelativeDate = (date) => {
  try {
    const now = new Date();
    const dateObj = new Date(date);
    const diffTime = Math.abs(now - dateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses atrás`;
    
    return `${Math.floor(diffDays / 365)} anos atrás`;
  } catch (error) {
    console.error('❌ Erro ao formatar data relativa:', error);
    return 'Data inválida';
  }
};

/**
 * 🔢 Formatar número
 */
export const formatNumber = (number, options = {}) => {
  try {
    const num = Number(number);
    if (isNaN(num)) return '0';
    
    return num.toLocaleString('pt-BR', options);
  } catch (error) {
    console.error('❌ Erro ao formatar número:', error);
    return '0';
  }
};

/**
 * 💰 Formatar moeda
 */
export const formatCurrency = (amount, currency = 'BRL') => {
  try {
    const num = Number(amount);
    if (isNaN(num)) return 'R$ 0,00';
    
    return num.toLocaleString('pt-BR', {
      style: 'currency',
      currency,
    });
  } catch (error) {
    console.error('❌ Erro ao formatar moeda:', error);
    return 'R$ 0,00';
  }
};

/**
 * 📊 Formatar porcentagem
 */
export const formatPercentage = (value, total, decimals = 1) => {
  try {
    if (total === 0) return '0%';
    
    const percentage = (value / total) * 100;
    return `${percentage.toFixed(decimals)}%`;
  } catch (error) {
    console.error('❌ Erro ao formatar porcentagem:', error);
    return '0%';
  }
};

/**
 * 🔤 Capitalizar primeira letra
 */
export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * 🔤 Capitalizar todas as palavras
 */
export const capitalizeWords = (str) => {
  if (!str || typeof str !== 'string') return '';
  
  return str.split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

/**
 * ✂️ Truncar texto
 */
export const truncateText = (text, maxLength = 50, suffix = '...') => {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * 🔍 Buscar texto
 */
export const searchText = (text, query) => {
  if (!text || !query) return false;
  
  const normalizedText = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  return normalizedText.includes(normalizedQuery);
};

/**
 * 🎲 Gerar número aleatório
 */
export const randomNumber = (min = 0, max = 1) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * 🔀 Embaralhar array
 */
export const shuffleArray = (array) => {
  if (!Array.isArray(array)) return [];
  
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

/**
 * 🎯 Selecionar item aleatório
 */
export const randomItem = (array) => {
  if (!Array.isArray(array) || array.length === 0) return null;
  
  const randomIndex = randomNumber(0, array.length - 1);
  return array[randomIndex];
};

/**
 * 🎯 Selecionar múltiplos itens aleatórios
 */
export const randomItems = (array, count) => {
  if (!Array.isArray(array) || array.length === 0) return [];
  
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, Math.min(count, array.length));
};

/**
 * 🔢 Calcular média
 */
export const calculateAverage = (numbers) => {
  if (!Array.isArray(numbers) || numbers.length === 0) return 0;
  
  const sum = numbers.reduce((acc, num) => acc + Number(num), 0);
  return sum / numbers.length;
};

/**
 * 📊 Calcular mediana
 */
export const calculateMedian = (numbers) => {
  if (!Array.isArray(numbers) || numbers.length === 0) return 0;
  
  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  
  return sorted[middle];
};

/**
 * 📈 Calcular moda
 */
export const calculateMode = (numbers) => {
  if (!Array.isArray(numbers) || numbers.length === 0) return null;
  
  const frequency = {};
  let maxFreq = 0;
  let mode = null;
  
  numbers.forEach(num => {
    frequency[num] = (frequency[num] || 0) + 1;
    if (frequency[num] > maxFreq) {
      maxFreq = frequency[num];
      mode = num;
    }
  });
  
  return mode;
};

/**
 * 📊 Calcular estatísticas básicas
 */
export const calculateStats = (numbers) => {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return {
      count: 0,
      sum: 0,
      average: 0,
      median: 0,
      mode: null,
      min: null,
      max: null,
    };
  }
  
  const validNumbers = numbers.filter(num => !isNaN(Number(num)));
  
  return {
    count: validNumbers.length,
    sum: validNumbers.reduce((acc, num) => acc + Number(num), 0),
    average: calculateAverage(validNumbers),
    median: calculateMedian(validNumbers),
    mode: calculateMode(validNumbers),
    min: Math.min(...validNumbers),
    max: Math.max(...validNumbers),
  };
};

/**
 * 🔐 Gerar ID único
 */
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * 📱 Verificar se dispositivo tem notch
 */
export const hasNotch = () => {
  if (isIOS()) {
    const { height, width } = getScreenDimensions();
    return height >= 812 || width >= 812;
  }
  
  if (isAndroid()) {
    const { height } = getScreenDimensions();
    return height >= 800;
  }
  
  return false;
};

/**
 * 📱 Verificar se dispositivo é tablet
 */
export const isTablet = () => {
  const { width, height } = getScreenDimensions();
  const aspectRatio = height / width;
  
  return aspectRatio <= 1.6;
};

/**
 * 📱 Verificar orientação da tela
 */
export const getOrientation = () => {
  const { width, height } = getScreenDimensions();
  return width > height ? 'landscape' : 'portrait';
};

/**
 * 🔄 Verificar se valor é válido
 */
export const isValid = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  if (typeof value === 'number' && isNaN(value)) return false;
  if (Array.isArray(value) && value.length === 0) return false;
  
  return true;
};

/**
 * 🧹 Limpar objeto de valores vazios
 */
export const cleanObject = (obj) => {
  if (!obj || typeof obj !== 'object') return {};
  
  const cleaned = {};
  
  Object.keys(obj).forEach(key => {
    if (isValid(obj[key])) {
      cleaned[key] = obj[key];
    }
  });
  
  return cleaned;
};

/**
 * 🔄 Clonar objeto profundamente
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const cloned = {};
    Object.keys(obj).forEach(key => {
      cloned[key] = deepClone(obj[key]);
    });
    return cloned;
  }
  
  return obj;
};

/**
 * 🔄 Mesclar objetos
 */
export const mergeObjects = (...objects) => {
  return objects.reduce((merged, obj) => {
    if (!obj || typeof obj !== 'object') return merged;
    
    Object.keys(obj).forEach(key => {
      if (obj[key] !== undefined) {
        merged[key] = obj[key];
      }
    });
    
    return merged;
  }, {});
};

/**
 * ⏱️ Aguardar tempo específico
 */
export const wait = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 🔄 Tentar operação múltiplas vezes
 */
export const retry = async (fn, maxAttempts = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxAttempts) {
        await wait(delay * attempt);
      }
    }
  }
  
  throw lastError;
};

/**
 * 📊 Calcular progresso
 */
export const calculateProgress = (current, total) => {
  if (total === 0) return 0;
  
  const progress = (current / total) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

/**
 * 🎯 Calcular nível baseado em XP
 */
export const calculateLevel = (xp) => {
  const xpPerLevel = GAMIFICATION_CONFIG.XP_PER_LEVEL;
  return Math.floor(xp / xpPerLevel) + 1;
};

/**
 * 📈 Calcular XP necessário para próximo nível
 */
export const calculateXpForNextLevel = (currentXp) => {
  const xpPerLevel = GAMIFICATION_CONFIG.XP_PER_LEVEL;
  const currentLevel = calculateLevel(currentXp);
  const xpForCurrentLevel = (currentLevel - 1) * xpPerLevel;
  const xpForNextLevel = currentLevel * xpPerLevel;
  
  return xpForNextLevel - currentXp;
};

/**
 * 🔥 Calcular multiplicador de streak
 */
export const calculateStreakMultiplier = (streak) => {
  const { STREAK_BONUS_MULTIPLIER, MAX_STREAK_BONUS } = GAMIFICATION_CONFIG;
  
  if (streak <= 1) return 1;
  
  const multiplier = 1 + (Math.log(streak) * STREAK_BONUS_MULTIPLIER);
  return Math.min(multiplier, MAX_STREAK_BONUS);
};

/**
 * 📱 Verificar permissões
 */
export const checkPermissions = async (permissions) => {
  // Implementar verificação de permissões específicas da plataforma
  return true;
};

/**
 * 📱 Abrir configurações do app
 */
export const openAppSettings = () => {
  // Implementar abertura das configurações do app
  console.log('📱 Abrindo configurações do app...');
};

/**
 * 📱 Verificar conectividade
 */
export const checkConnectivity = async () => {
  try {
    // Implementar verificação de conectividade
    return true;
  } catch (error) {
    console.error('❌ Erro ao verificar conectividade:', error);
    return false;
  }
};

/**
 * 📱 Verificar espaço disponível
 */
export const checkAvailableStorage = async () => {
  try {
    // Implementar verificação de espaço disponível
    return 1024 * 1024 * 1024; // 1GB
  } catch (error) {
    console.error('❌ Erro ao verificar espaço disponível:', error);
    return 0;
  }
};
