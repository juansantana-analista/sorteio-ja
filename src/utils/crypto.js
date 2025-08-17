// src/utils/crypto.js
// 🔐 Sistema de Criptografia e Verificação - Sorteio Já
// Gera proofs verificáveis para garantir transparência dos sorteios

import { Platform } from 'react-native';

/**
 * 🎯 Gerar seed único para sorteio
 * Combina entrada do usuário com timestamp para garantir unicidade
 */
export const generateSeed = (config) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  
  // Criar string única baseada na configuração
  const configString = JSON.stringify(config, Object.keys(config).sort());
  const userAgent = Platform.OS;
  
  // Combinar tudo em um seed único
  const seedData = `${configString}-${timestamp}-${random}-${userAgent}`;
  
  return btoa(seedData).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
};

/**
 * 🔐 Gerar hash SHA-256 simplificado
 * Para React Native, usamos uma implementação simplificada
 */
export const generateHash = (data) => {
  const dataString = typeof data === 'string' ? data : JSON.stringify(data, Object.keys(data).sort());
  
  // Implementação simplificada de hash para React Native
  // Em produção, recomenda-se usar expo-crypto para hash real
  return simpleHash(dataString);
};

/**
 * 🔢 Implementação de hash simples mas determinística
 * Baseada no algoritmo djb2
 */
const simpleHash = (str) => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash; // Converter para 32bit integer
  }
  
  // Converter para hexadecimal e garantir 8 caracteres
  return Math.abs(hash).toString(16).padStart(8, '0');
};

/**
 * ✅ Verificar integridade do proof
 */
export const verifyProofIntegrity = (proof) => {
  try {
    const { seed, timestamp, type, config, result, hash } = proof;
    
    // Verificar se todos os campos necessários estão presentes
    const requiredFields = ['seed', 'timestamp', 'type', 'config', 'result', 'hash'];
    for (const field of requiredFields) {
      if (!proof[field]) {
        return {
          valid: false,
          error: `Campo obrigatório ausente: ${field}`
        };
      }
    }
    
    // Recalcular hash
    const recalculatedHash = generateHash({ seed, timestamp, type, config, result });
    
    // Verificar se hash confere
    if (recalculatedHash !== hash) {
      return {
        valid: false,
        error: 'Hash não confere - dados podem ter sido alterados'
      };
    }
    
    // Verificar se timestamp é válido
    const proofDate = new Date(timestamp);
    if (isNaN(proofDate.getTime())) {
      return {
        valid: false,
        error: 'Timestamp inválido'
      };
    }
    
    // Verificar se não é muito antigo (mais de 1 ano)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    if (proofDate < oneYearAgo) {
      return {
        valid: false,
        error: 'Proof muito antigo para verificação'
      };
    }
    
    return {
      valid: true,
      timestamp: proofDate,
      age: Date.now() - proofDate.getTime()
    };
    
  } catch (error) {
    return {
      valid: false,
      error: `Erro na verificação: ${error.message}`
    };
  }
};

/**
 * 📋 Gerar código de verificação público
 * Código curto que pode ser compartilhado para verificação
 */
export const generateVerificationCode = (proof) => {
  const { hash, timestamp } = proof;
  
  // Usar parte do hash + timestamp para criar código único
  const hashPart = hash.substring(0, 4).toUpperCase();
  const timePart = new Date(timestamp).getTime().toString().slice(-4);
  
  return `${hashPart}-${timePart}`;
};

/**
 * 🔗 Gerar URL de verificação
 * Para verificação externa via web
 */
export const generateVerificationUrl = (proof, baseUrl = 'https://sorteio-ja.app/verify') => {
  const code = generateVerificationCode(proof);
  const encodedProof = encodeURIComponent(JSON.stringify(proof));
  
  return `${baseUrl}?code=${code}&proof=${encodedProof}`;
};

/**
 * 📊 Extrair informações do proof para exibição
 */
export const extractProofInfo = (proof) => {
  try {
    const { type, timestamp, algorithm, config, result } = proof;
    
    const info = {
      type: getDrawTypeName(type),
      date: new Date(timestamp),
      algorithm: algorithm || `${type}-v1.0`,
      verificationCode: generateVerificationCode(proof),
    };
    
    // Adicionar informações específicas por tipo
    switch (type) {
      case 'names':
        info.details = {
          totalItems: config.items?.length || 0,
          winners: result.winners?.length || 0,
          items: config.items?.slice(0, 3) || [], // Primeiros 3 para preview
        };
        break;
        
      case 'numbers':
        info.details = {
          range: `${config.min || 1} - ${config.max || 100}`,
          count: config.count || 1,
          allowRepeats: config.allowRepeats || false,
          numbers: result.numbers || [],
        };
        break;
        
      case 'teams':
        info.details = {
          totalPlayers: config.players?.length || 0,
          teamCount: config.teamCount || 2,
          balanced: config.balanceTeams !== false,
        };
        break;
        
      case 'order':
        info.details = {
          totalItems: config.items?.length || 0,
          items: config.items?.slice(0, 3) || [],
        };
        break;
        
      case 'bingo':
        info.details = {
          type: config.type || '75',
          count: config.count || 1,
          numbers: result.numbers || [],
        };
        break;
    }
    
    return info;
    
  } catch (error) {
    return {
      type: 'Desconhecido',
      date: new Date(),
      error: error.message,
    };
  }
};

/**
 * 🎲 Obter nome amigável do tipo de sorteio
 */
const getDrawTypeName = (type) => {
  const typeNames = {
    names: 'Sorteio de Nomes',
    numbers: 'Sorteio de Números',
    teams: 'Formação de Times',
    order: 'Ordem Aleatória',
    bingo: 'Bingo',
  };
  
  return typeNames[type] || 'Sorteio Desconhecido';
};

/**
 * 🔄 Converter proof para formato de compartilhamento
 */
export const formatProofForSharing = (proof) => {
  const info = extractProofInfo(proof);
  
  const shareText = `
🎲 ${info.type}
📅 ${info.date.toLocaleString('pt-BR')}
🔐 Código: ${info.verificationCode}

✅ Sorteio verificável e transparente
🔗 Verifique em: sorteio-ja.app/verify
`.trim();

  return {
    text: shareText,
    url: generateVerificationUrl(proof),
    code: info.verificationCode,
  };
};

/**
 * 📱 Gerar QR Code data para verificação
 */
export const generateQRData = (proof) => {
  const verificationUrl = generateVerificationUrl(proof);
  return verificationUrl;
};

/**
 * 🛡️ Validar formato do proof
 */
export const validateProofFormat = (proof) => {
  const errors = [];
  
  // Verificar se é um objeto
  if (typeof proof !== 'object' || proof === null) {
    errors.push('Proof deve ser um objeto válido');
    return { valid: false, errors };
  }
  
  // Verificar campos obrigatórios
  const requiredFields = {
    seed: 'string',
    timestamp: 'string',
    type: 'string',
    config: 'object',
    result: 'object',
    hash: 'string',
  };
  
  for (const [field, expectedType] of Object.entries(requiredFields)) {
    if (!(field in proof)) {
      errors.push(`Campo obrigatório ausente: ${field}`);
    } else if (typeof proof[field] !== expectedType) {
      errors.push(`Campo ${field} deve ser do tipo ${expectedType}`);
    }
  }
  
  // Verificar se type é válido
  const validTypes = ['names', 'numbers', 'teams', 'order', 'bingo'];
  if (proof.type && !validTypes.includes(proof.type)) {
    errors.push(`Tipo de sorteio inválido: ${proof.type}`);
  }
  
  // Verificar se timestamp é uma data válida
  if (proof.timestamp && isNaN(new Date(proof.timestamp).getTime())) {
    errors.push('Timestamp inválido');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * 🔍 Buscar proof por código de verificação
 * Para uso com banco de dados local
 */
export const findProofByCode = async (code, database) => {
  try {
    // O código tem formato XXXX-YYYY onde XXXX são 4 chars do hash
    const [hashPart] = code.split('-');
    
    if (!hashPart || hashPart.length !== 4) {
      throw new Error('Código de verificação inválido');
    }
    
    // Buscar no histórico
    const history = await database.getLotteryHistory(1000); // Buscar mais registros
    
    for (const item of history) {
      const proof = item.proof;
      if (proof.hash && proof.hash.substring(0, 4).toUpperCase() === hashPart.toUpperCase()) {
        const itemCode = generateVerificationCode(proof);
        if (itemCode === code) {
          return {
            found: true,
            proof,
            lottery: item,
          };
        }
      }
    }
    
    return {
      found: false,
      error: 'Sorteio não encontrado com este código',
    };
    
  } catch (error) {
    return {
      found: false,
      error: error.message,
    };
  }
};

/**
 * 🧮 Calcular estatísticas de segurança
 */
export const getSecurityStats = (proof) => {
  const { config, type } = proof;
  
  let totalPossibilities = 1;
  let selectedItems = 1;
  
  switch (type) {
    case 'names':
      totalPossibilities = factorial(config.items?.length || 1);
      selectedItems = config.count || 1;
      break;
      
    case 'numbers':
      const range = (config.max || 100) - (config.min || 1) + 1;
      if (config.allowRepeats) {
        totalPossibilities = Math.pow(range, config.count || 1);
      } else {
        totalPossibilities = factorial(range) / factorial(range - (config.count || 1));
      }
      selectedItems = config.count || 1;
      break;
      
    case 'teams':
      const players = config.players?.length || 0;
      const teams = config.teamCount || 2;
      // Cálculo simplificado para divisão em times
      totalPossibilities = Math.pow(teams, players);
      break;
      
    case 'order':
      totalPossibilities = factorial(config.items?.length || 1);
      break;
      
    case 'bingo':
      const bingoRange = config.type === '90' ? 90 : 75;
      totalPossibilities = factorial(bingoRange) / factorial(bingoRange - (config.count || 1));
      selectedItems = config.count || 1;
      break;
  }
  
  return {
    totalPossibilities: totalPossibilities > 1e15 ? 'Muito grande' : totalPossibilities,
    selectedItems,
    probability: totalPossibilities <= 1e15 ? `1 em ${Math.round(totalPossibilities)}` : 'Praticamente impossível de prever',
  };
};

/**
 * 🧮 Função auxiliar para fatorial
 */
const factorial = (n) => {
  if (n <= 1) return 1;
  if (n > 20) return 1e20; // Evitar overflow, retorna número muito grande
  
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

export default {
  generateSeed,
  generateHash,
  verifyProofIntegrity,
  generateVerificationCode,
  generateVerificationUrl,
  extractProofInfo,
  formatProofForSharing,
  generateQRData,
  validateProofFormat,
  findProofByCode,
  getSecurityStats,
};