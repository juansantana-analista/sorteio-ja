// src/services/lottery.js
// 🎲 Sistema de Algoritmos de Sorteio - Sorteio Já
// Algoritmos justos, transparentes e verificáveis

import { generateSeed, generateHash } from '../utils/crypto';

/**
 * 🎲 Classe LotteryEngine
 * Gerencia todos os tipos de sorteio do app
 */
class LotteryEngine {
  constructor() {
    this.algorithms = {
      names: this.drawNames.bind(this),
      numbers: this.drawNumbers.bind(this),
      teams: this.drawTeams.bind(this),
      order: this.drawOrder.bind(this),
      bingo: this.drawBingo.bind(this),
    };
  }

  /**
   * 🎯 Método principal de sorteio
   * @param {string} type - Tipo do sorteio
   * @param {Object} config - Configuração do sorteio
   * @returns {Object} Resultado com proof de verificação
   */
  async performLottery(type, config) {
    try {
      // Validar tipo
      if (!this.algorithms[type]) {
        throw new Error(`Tipo de sorteio inválido: ${type}`);
      }

      // Gerar seed único para este sorteio
      const seed = generateSeed(config);
      const timestamp = new Date().toISOString();

      // Executar algoritmo específico
      const algorithm = this.algorithms[type];
      const result = algorithm(config, seed);

      // Gerar proof de verificação
      const proof = {
        seed,
        timestamp,
        type,
        config: this.sanitizeConfig(config),
        result,
        hash: generateHash({ seed, timestamp, type, config, result }),
        algorithm: `${type}-v1.0`,
        version: '1.0.0',
      };

      return {
        success: true,
        result,
        proof,
        type,
        timestamp: new Date(timestamp),
      };

    } catch (error) {
      console.error('❌ Erro no sorteio:', error);
      return {
        success: false,
        error: error.message,
        type,
      };
    }
  }

  /**
   * 👥 Sorteio de nomes/itens
   * @param {Object} config - { items: string[], count: number }
   * @param {string} seed - Seed para reproduzibilidade
   */
  drawNames(config, seed) {
    const { items, count = 1 } = config;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('Lista de itens não pode estar vazia');
    }

    if (count > items.length) {
      throw new Error('Não é possível sortear mais itens que o disponível');
    }

    // Criar cópia para não modificar original
    const availableItems = [...items];
    const winners = [];
    
    // Usar seed para gerar números pseudo-aleatórios reproduzíveis
    let seedNum = this.seedToNumber(seed);

    for (let i = 0; i < count; i++) {
      if (availableItems.length === 0) break;
      
      // Gerar índice baseado no seed
      const randomIndex = this.seededRandom(seedNum + i) % availableItems.length;
      const winner = availableItems.splice(randomIndex, 1)[0];
      winners.push(winner);
    }

    return {
      winners,
      totalItems: items.length,
      selectedCount: winners.length,
    };
  }

  /**
   * 🔢 Sorteio de números
   * @param {Object} config - { min: number, max: number, count: number, allowRepeats: boolean }
   * @param {string} seed - Seed para reproduzibilidade
   */
  drawNumbers(config, seed) {
    const { 
      min = 1, 
      max = 100, 
      count = 1, 
      allowRepeats = false 
    } = config;

    if (min >= max) {
      throw new Error('Valor mínimo deve ser menor que o máximo');
    }

    if (!allowRepeats && count > (max - min + 1)) {
      throw new Error('Não é possível sortear números únicos suficientes no intervalo');
    }

    const numbers = [];
    const usedNumbers = new Set();
    let seedNum = this.seedToNumber(seed);

    for (let i = 0; i < count; i++) {
      let number;
      let attempts = 0;
      const maxAttempts = 1000; // Evitar loop infinito

      do {
        // Gerar número baseado no seed
        const randomValue = this.seededRandom(seedNum + i + attempts);
        number = min + Math.floor(randomValue * (max - min + 1));
        attempts++;
        
        if (attempts > maxAttempts) {
          throw new Error('Não foi possível gerar números únicos suficientes');
        }
      } while (!allowRepeats && usedNumbers.has(number));

      numbers.push(number);
      if (!allowRepeats) {
        usedNumbers.add(number);
      }
    }

    return {
      numbers: numbers.sort((a, b) => a - b),
      range: { min, max },
      count: numbers.length,
      allowRepeats,
    };
  }

  /**
   * ⚽ Sorteio de times/grupos
   * @param {Object} config - { players: string[], teamCount: number, balanceTeams: boolean }
   * @param {string} seed - Seed para reproduzibilidade
   */
  drawTeams(config, seed) {
    const { 
      players, 
      teamCount = 2, 
      balanceTeams = true 
    } = config;

    if (!players || !Array.isArray(players) || players.length === 0) {
      throw new Error('Lista de jogadores não pode estar vazia');
    }

    if (teamCount < 2) {
      throw new Error('É necessário pelo menos 2 times');
    }

    if (teamCount > players.length) {
      throw new Error('Número de times não pode ser maior que número de jogadores');
    }

    // Embaralhar jogadores baseado no seed
    const shuffledPlayers = this.shuffleArray([...players], seed);
    
    // Criar times
    const teams = Array.from({ length: teamCount }, (_, i) => ({
      name: `Time ${i + 1}`,
      players: [],
      number: i + 1,
    }));

    // Distribuir jogadores
    if (balanceTeams) {
      // Distribuição balanceada (round-robin)
      shuffledPlayers.forEach((player, index) => {
        const teamIndex = index % teamCount;
        teams[teamIndex].players.push(player);
      });
    } else {
      // Distribuição aleatória
      const playersPerTeam = Math.floor(players.length / teamCount);
      let playerIndex = 0;

      teams.forEach((team, teamIndex) => {
        const isLastTeam = teamIndex === teamCount - 1;
        const teamSize = isLastTeam ? 
          players.length - playerIndex : // Último time pega o resto
          playersPerTeam;

        for (let i = 0; i < teamSize && playerIndex < shuffledPlayers.length; i++) {
          team.players.push(shuffledPlayers[playerIndex]);
          playerIndex++;
        }
      });
    }

    return {
      teams,
      totalPlayers: players.length,
      teamCount,
      balanceTeams,
      averagePlayersPerTeam: Math.round(players.length / teamCount * 10) / 10,
    };
  }

  /**
   * 🔀 Sorteio de ordem aleatória
   * @param {Object} config - { items: string[] }
   * @param {string} seed - Seed para reproduzibilidade
   */
  drawOrder(config, seed) {
    const { items } = config;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('Lista de itens não pode estar vazia');
    }

    // Embaralhar completamente a lista
    const shuffledItems = this.shuffleArray([...items], seed);

    return {
      order: shuffledItems.map((item, index) => ({
        position: index + 1,
        item,
      })),
      totalItems: items.length,
    };
  }

  /**
   * 🎰 Sorteio de bingo
   * @param {Object} config - { type: '75'|'90', count: number }
   * @param {string} seed - Seed para reproduzibilidade
   */
  drawBingo(config, seed) {
    const { type = '75', count = 1 } = config;

    const ranges = {
      '75': { min: 1, max: 75, letters: ['B', 'I', 'N', 'G', 'O'] },
      '90': { min: 1, max: 90, letters: [] }
    };

    if (!ranges[type]) {
      throw new Error('Tipo de bingo inválido. Use "75" ou "90"');
    }

    const { min, max, letters } = ranges[type];
    
    if (count > (max - min + 1)) {
      throw new Error('Não é possível sortear mais números que o disponível');
    }

    const numbers = [];
    const usedNumbers = new Set();
    let seedNum = this.seedToNumber(seed);

    for (let i = 0; i < count; i++) {
      let number;
      let attempts = 0;

      do {
        const randomValue = this.seededRandom(seedNum + i + attempts);
        number = min + Math.floor(randomValue * (max - min + 1));
        attempts++;
      } while (usedNumbers.has(number) && attempts < 1000);

      numbers.push(number);
      usedNumbers.add(number);
    }

    // Para bingo 75, adicionar letras
    const results = numbers.map(num => {
      if (type === '75') {
        const letterIndex = Math.floor((num - 1) / 15);
        const letter = letters[Math.min(letterIndex, letters.length - 1)];
        return {
          number: num,
          letter,
          display: `${letter}${num}`,
        };
      }
      return {
        number: num,
        display: num.toString(),
      };
    });

    return {
      numbers: results.sort((a, b) => a.number - b.number),
      type,
      count: results.length,
      range: { min, max },
    };
  }

  // ===============================================
  // 🛠️ MÉTODOS UTILITÁRIOS
  // ===============================================

  /**
   * 🎲 Embaralhar array baseado em seed
   * Implementação do algoritmo Fisher-Yates com seed
   */
  shuffleArray(array, seed) {
    const shuffled = [...array];
    let seedNum = this.seedToNumber(seed);

    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomValue = this.seededRandom(seedNum + i);
      const j = Math.floor(randomValue * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  /**
   * 🔢 Converter seed string para número
   */
  seedToNumber(seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Converter para 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * 🎯 Gerador de números pseudo-aleatórios baseado em seed
   * Implementação do algoritmo Linear Congruential Generator
   */
  seededRandom(seed) {
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);
    
    seed = (a * seed + c) % m;
    return seed / m;
  }

  /**
   * 🧹 Sanitizar configuração para o proof
   * Remove dados sensíveis se houver
   */
  sanitizeConfig(config) {
    const sanitized = { ...config };
    
    // Remover dados que não devem ir para o proof público
    delete sanitized.privateData;
    delete sanitized.internalIds;
    
    return sanitized;
  }

  /**
   * ✅ Verificar prova de sorteio
   * @param {Object} proof - Proof do sorteio
   * @returns {boolean} Se o sorteio é válido
   */
  verifyProof(proof) {
    try {
      const { seed, timestamp, type, config, result, hash, algorithm } = proof;

      // Verificar se todos os campos estão presentes
      if (!seed || !timestamp || !type || !config || !result || !hash) {
        return { valid: false, error: 'Proof incompleto' };
      }

      // Verificar se o tipo é suportado
      if (!this.algorithms[type]) {
        return { valid: false, error: 'Tipo de sorteio não suportado' };
      }

      // Reexecutar o algoritmo com os mesmos parâmetros
      const recalculatedResult = this.algorithms[type](config, seed);

      // Verificar se o resultado bate
      const resultsMatch = JSON.stringify(recalculatedResult) === JSON.stringify(result);
      if (!resultsMatch) {
        return { valid: false, error: 'Resultado não confere com os parâmetros' };
      }

      // Verificar hash
      const recalculatedHash = generateHash({ seed, timestamp, type, config, result });
      const hashMatches = recalculatedHash === hash;
      if (!hashMatches) {
        return { valid: false, error: 'Hash não confere' };
      }

      return { 
        valid: true, 
        timestamp: new Date(timestamp),
        algorithm 
      };

    } catch (error) {
      return { 
        valid: false, 
        error: `Erro na verificação: ${error.message}` 
      };
    }
  }

  /**
   * 📊 Obter estatísticas do sorteio
   * @param {Object} proof - Proof do sorteio
   */
  getStatistics(proof) {
    const { type, result } = proof;

    switch (type) {
      case 'names':
        return {
          type: 'Sorteio de Nomes',
          winners: result.winners.length,
          totalOptions: result.totalItems,
          probability: `${((result.winners.length / result.totalItems) * 100).toFixed(2)}%`
        };

      case 'numbers':
        return {
          type: 'Sorteio de Números',
          numbers: result.numbers.length,
          range: `${result.range.min} - ${result.range.max}`,
          probability: result.allowRepeats ? 
            'N/A (com repetição)' : 
            `${((result.numbers.length / (result.range.max - result.range.min + 1)) * 100).toFixed(2)}%`
        };

      case 'teams':
        return {
          type: 'Divisão de Times',
          teams: result.teams.length,
          players: result.totalPlayers,
          balanced: result.balanceTeams ? 'Sim' : 'Não'
        };

      case 'order':
        return {
          type: 'Ordem Aleatória',
          items: result.totalItems,
          permutations: this.factorial(result.totalItems)
        };

      case 'bingo':
        return {
          type: `Bingo ${result.type}`,
          numbers: result.numbers.length,
          range: `${result.range.min} - ${result.range.max}`,
          probability: `${((result.numbers.length / (result.range.max - result.range.min + 1)) * 100).toFixed(2)}%`
        };

      default:
        return { type: 'Desconhecido' };
    }
  }

  /**
   * 🧮 Calcular fatorial (para estatísticas)
   */
  factorial(n) {
    if (n <= 1) return 1;
    if (n > 20) return 'Muito grande'; // Evitar overflow
    
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  /**
   * 🎲 Gerar sorteio rápido (para testes)
   */
  quickDraw(type, simpleConfig) {
    const configs = {
      names: {
        items: simpleConfig.items || ['Opção 1', 'Opção 2', 'Opção 3'],
        count: simpleConfig.count || 1
      },
      numbers: {
        min: simpleConfig.min || 1,
        max: simpleConfig.max || 10,
        count: simpleConfig.count || 1,
        allowRepeats: simpleConfig.allowRepeats || false
      },
      teams: {
        players: simpleConfig.players || ['Jogador 1', 'Jogador 2', 'Jogador 3', 'Jogador 4'],
        teamCount: simpleConfig.teamCount || 2,
        balanceTeams: simpleConfig.balanceTeams !== false
      },
      order: {
        items: simpleConfig.items || ['Item 1', 'Item 2', 'Item 3']
      },
      bingo: {
        type: simpleConfig.bingoType || '75',
        count: simpleConfig.count || 1
      }
    };

    return this.performLottery(type, configs[type]);
  }
}

// 🎲 Instância única do motor de sorteios
export const lotteryEngine = new LotteryEngine();

// 🎯 Exportar funções principais para facilitar o uso
export const performLottery = (type, config) => lotteryEngine.performLottery(type, config);
export const verifyProof = (proof) => lotteryEngine.verifyProof(proof);
export const getStatistics = (proof) => lotteryEngine.getStatistics(proof);
export const quickDraw = (type, config) => lotteryEngine.quickDraw(type, config);

export default lotteryEngine;