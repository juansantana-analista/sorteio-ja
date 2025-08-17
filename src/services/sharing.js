import { Share, Alert, Platform } from 'react-native';
import { database } from './database';
import { crypto } from '../utils/crypto';
import { helpers } from '../utils/helpers';

/**
 * 📤 Serviço de compartilhamento
 * Gerencia o compartilhamento de resultados de sorteios
 */
class SharingService {
  /**
   * Compartilha um resultado de sorteio
   * @param {Object} drawResult - Resultado do sorteio
   * @param {string} platform - Plataforma de compartilhamento (opcional)
   */
  async shareDrawResult(drawResult, platform = null) {
    try {
      const shareContent = this.formatShareContent(drawResult);
      
      if (platform) {
        return await this.shareToSpecificPlatform(shareContent, platform);
      }

      return await this.shareGeneric(shareContent);
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      throw error;
    }
  }

  /**
   * Formata o conteúdo para compartilhamento
   * @param {Object} drawResult - Resultado do sorteio
   * @returns {string} Conteúdo formatado
   */
  formatShareContent(drawResult) {
    const { type, results, config, timestamp } = drawResult;
    
    let content = `🎲 Sorteio realizado com Sorteio Já!\n\n`;
    
    // Adicionar informações específicas do tipo
    switch (type) {
      case 'list':
        content += `📋 Sorteio de Lista\n`;
        content += `• Lista: ${config.listName}\n`;
        content += `• Participantes: ${config.participants.length}\n`;
        content += `• Vencedor: ${results.winner}\n`;
        break;
        
      case 'number':
        content += `🔢 Sorteio de Números\n`;
        content += `• Intervalo: ${config.minNumber} a ${config.maxNumber}\n`;
        content += `• Quantidade: ${config.quantity}\n`;
        content += `• Resultado: ${results.join(' - ')}\n`;
        break;
        
      case 'bingo':
        content += `🎱 Sorteio de Bingo\n`;
        content += `• Tipo: ${config.bingoType}\n`;
        content += `• Números: ${results.join(' - ')}\n`;
        break;
        
      default:
        content += `🎯 Sorteio Personalizado\n`;
        content += `• Resultado: ${JSON.stringify(results)}\n`;
    }
    
    // Adicionar informações gerais
    content += `\n📅 Data: ${helpers.formatDate(timestamp)}\n`;
    content += `🔍 Hash: ${drawResult.hash}\n`;
    content += `📱 App: Sorteio Já\n`;
    content += `🌐 Verificar: ${this.getVerificationUrl(drawResult.hash)}\n`;
    
    return content;
  }

  /**
   * Compartilhamento genérico usando Share API
   * @param {string} content - Conteúdo para compartilhar
   * @returns {Promise} Resultado do compartilhamento
   */
  async shareGeneric(content) {
    try {
      const result = await Share.share({
        message: content,
        title: 'Sorteio Já - Resultado',
        url: 'https://sorteioja.app', // URL do app
      });

      if (result.action === Share.sharedAction) {
        // Registrar compartilhamento bem-sucedido
        await this.recordShareAction('generic', result.activityType);
        return result;
      }

      return result;
    } catch (error) {
      console.error('Erro no compartilhamento genérico:', error);
      throw error;
    }
  }

  /**
   * Compartilhamento para plataforma específica
   * @param {string} content - Conteúdo para compartilhar
   * @param {string} platform - Plataforma de destino
   * @returns {Promise} Resultado do compartilhamento
   */
  async shareToSpecificPlatform(content, platform) {
    try {
      let shareOptions = {
        message: content,
        title: 'Sorteio Já - Resultado',
      };

      switch (platform.toLowerCase()) {
        case 'whatsapp':
          shareOptions.url = `whatsapp://send?text=${encodeURIComponent(content)}`;
          break;
          
        case 'telegram':
          shareOptions.url = `telegram://msg?text=${encodeURIComponent(content)}`;
          break;
          
        case 'email':
          shareOptions.subject = 'Resultado do Sorteio - Sorteio Já';
          shareOptions.message = content;
          break;
          
        case 'sms':
          shareOptions.message = content;
          break;
          
        default:
          return await this.shareGeneric(content);
      }

      const result = await Share.share(shareOptions);
      
      if (result.action === Share.sharedAction) {
        await this.recordShareAction(platform, result.activityType);
      }

      return result;
    } catch (error) {
      console.error(`Erro ao compartilhar para ${platform}:`, error);
      // Fallback para compartilhamento genérico
      return await this.shareGeneric(content);
    }
  }

  /**
   * Compartilha imagem do resultado
   * @param {Object} drawResult - Resultado do sorteio
   * @param {string} imagePath - Caminho da imagem
   * @returns {Promise} Resultado do compartilhamento
   */
  async shareImage(drawResult, imagePath) {
    try {
      const content = this.formatShareContent(drawResult);
      
      const result = await Share.share({
        message: content,
        title: 'Sorteio Já - Resultado',
        url: imagePath, // Para Android
        // Para iOS, você precisaria usar react-native-share ou similar
      });

      if (result.action === Share.sharedAction) {
        await this.recordShareAction('image', result.activityType);
      }

      return result;
    } catch (error) {
      console.error('Erro ao compartilhar imagem:', error);
      throw error;
    }
  }

  /**
   * Compartilha múltiplos resultados
   * @param {Array} drawResults - Array de resultados
   * @returns {Promise} Resultado do compartilhamento
   */
  async shareMultipleResults(drawResults) {
    try {
      let content = `🎲 Múltiplos Sorteios - Sorteio Já!\n\n`;
      
      drawResults.forEach((result, index) => {
        content += `${index + 1}. ${this.formatShareContent(result)}\n\n`;
      });
      
      content += `📱 App: Sorteio Já\n`;
      content += `🌐 Mais informações: https://sorteioja.app`;
      
      return await this.shareGeneric(content);
    } catch (error) {
      console.error('Erro ao compartilhar múltiplos resultados:', error);
      throw error;
    }
  }

  /**
   * Compartilha estatísticas do usuário
   * @param {Object} userStats - Estatísticas do usuário
   * @returns {Promise} Resultado do compartilhamento
   */
  async shareUserStats(userStats) {
    try {
      const content = `🏆 Minhas Estatísticas - Sorteio Já!\n\n` +
        `📊 Total de Sorteios: ${userStats.totalDraws}\n` +
        `⭐ Nível: ${userStats.level}\n` +
        `💎 Pontos: ${userStats.points}\n` +
        `🔥 Sequência: ${userStats.streak} dias\n` +
        `🏅 Conquistas: ${userStats.achievements}\n\n` +
        `📱 App: Sorteio Já\n` +
        `🌐 Baixar: https://sorteioja.app`;
      
      return await this.shareGeneric(content);
    } catch (error) {
      console.error('Erro ao compartilhar estatísticas:', error);
      throw error;
    }
  }

  /**
   * Compartilha conquista desbloqueada
   * @param {Object} achievement - Conquista desbloqueada
   * @returns {Promise} Resultado do compartilhamento
   */
  async shareAchievement(achievement) {
    try {
      const content = `🏆 Conquista Desbloqueada!\n\n` +
        `🎯 ${achievement.name}\n` +
        `📝 ${achievement.description}\n` +
        `⭐ Raridade: ${achievement.rarity}\n` +
        `💎 Pontos: +${achievement.points}\n\n` +
        `📱 Sorteio Já - App de sorteios transparentes\n` +
        `🌐 Baixar: https://sorteioja.app`;
      
      return await this.shareGeneric(content);
    } catch (error) {
      console.error('Erro ao compartilhar conquista:', error);
      throw error;
    }
  }

  /**
   * Gera URL de verificação
   * @param {string} hash - Hash do resultado
   * @returns {string} URL de verificação
   */
  getVerificationUrl(hash) {
    return `https://sorteioja.app/verify/${hash}`;
  }

  /**
   * Registra ação de compartilhamento
   * @param {string} platform - Plataforma usada
   * @param {string} activityType - Tipo de atividade
   */
  async recordShareAction(platform, activityType) {
    try {
      const shareData = {
        id: helpers.generateId(),
        timestamp: Date.now(),
        platform,
        activityType,
        success: true,
      };

      await database.saveShareAction(shareData);
    } catch (error) {
      console.error('Erro ao registrar ação de compartilhamento:', error);
    }
  }

  /**
   * Verifica se a plataforma suporta compartilhamento
   * @param {string} platform - Plataforma para verificar
   * @returns {boolean} Se é suportada
   */
  isPlatformSupported(platform) {
    const supportedPlatforms = ['whatsapp', 'telegram', 'email', 'sms'];
    return supportedPlatforms.includes(platform.toLowerCase());
  }

  /**
   * Obtém plataformas disponíveis
   * @returns {Array} Array de plataformas disponíveis
   */
  getAvailablePlatforms() {
    const platforms = ['generic'];
    
    if (Platform.OS === 'android') {
      platforms.push('whatsapp', 'telegram', 'email', 'sms');
    } else if (Platform.OS === 'ios') {
      platforms.push('whatsapp', 'telegram', 'email', 'sms');
    }
    
    return platforms;
  }

  /**
   * Compartilha com preview personalizado
   * @param {Object} drawResult - Resultado do sorteio
   * @param {Object} previewOptions - Opções de preview
   * @returns {Promise} Resultado do compartilhamento
   */
  async shareWithPreview(drawResult, previewOptions = {}) {
    try {
      const { showImage = true, customMessage = '', includeStats = false } = previewOptions;
      
      let content = this.formatShareContent(drawResult);
      
      if (customMessage) {
        content = `${customMessage}\n\n${content}`;
      }
      
      if (includeStats) {
        const stats = await database.getUserStats();
        content += `\n\n📊 Estatísticas:\n` +
          `• Total de sorteios: ${stats.totalDraws}\n` +
          `• Nível atual: ${stats.level}\n` +
          `• Pontos: ${stats.points}`;
      }
      
      const shareOptions = {
        message: content,
        title: 'Sorteio Já - Resultado',
      };
      
      if (showImage && drawResult.imagePath) {
        shareOptions.url = drawResult.imagePath;
      }
      
      const result = await Share.share(shareOptions);
      
      if (result.action === Share.sharedAction) {
        await this.recordShareAction('preview', result.activityType);
      }
      
      return result;
    } catch (error) {
      console.error('Erro ao compartilhar com preview:', error);
      throw error;
    }
  }
}

// Instância única do serviço
export const sharing = new SharingService();

export default sharing;
