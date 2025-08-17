import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { constants } from '../utils/constants';

/**
 * 📱 Serviço de anúncios AdMob
 * Gerencia a exibição de anúncios no app
 */
class AdsService {
  constructor() {
    this.isInitialized = false;
    this.isPremiumUser = false;
    this.adMobConfig = null;
    this.bannerAdUnitId = null;
    this.interstitialAdUnitId = null;
    this.rewardedAdUnitId = null;
    this.interstitialAd = null;
    this.rewardedAd = null;
    this.bannerAd = null;
    this.adLoadAttempts = 0;
    this.maxAdLoadAttempts = 3;
    this.lastAdShowTime = 0;
    this.minAdInterval = 30000; // 30 segundos entre anúncios
  }

  /**
   * Inicializa o serviço de anúncios
   */
  async init() {
    try {
      if (this.isInitialized) return;

      // Verificar se é usuário premium
      this.isPremiumUser = await this.checkPremiumStatus();
      
      if (this.isPremiumUser) {
        console.log('🚫 Usuário premium - anúncios desabilitados');
        return;
      }

      // Carregar configuração de anúncios
      await this.loadAdMobConfig();
      
      // Configurar IDs dos anúncios
      this.setupAdUnitIds();
      
      // Pré-carregar anúncios
      await this.preloadAds();
      
      this.isInitialized = true;
      console.log('✅ Serviço de anúncios inicializado');
      
    } catch (error) {
      console.error('❌ Erro ao inicializar serviço de anúncios:', error);
    }
  }

  /**
   * Verifica se o usuário é premium
   */
  async checkPremiumStatus() {
    try {
      const premiumStatus = await AsyncStorage.getItem('premium_status');
      return premiumStatus === 'true';
    } catch (error) {
      console.error('Erro ao verificar status premium:', error);
      return false;
    }
  }

  /**
   * Carrega configuração do AdMob
   */
  async loadAdMobConfig() {
    try {
      // Em produção, isso viria de uma API ou configuração
      this.adMobConfig = {
        appId: constants.ads.ADMOB_APP_ID,
        testMode: __DEV__,
        enableAds: true,
        adFrequency: 'medium', // low, medium, high
        interstitialFrequency: constants.ads.INTERSTITIAL_FREQUENCY,
        rewardedFrequency: constants.ads.REWARDED_FREQUENCY,
      };
    } catch (error) {
      console.error('Erro ao carregar configuração AdMob:', error);
      throw error;
    }
  }

  /**
   * Configura IDs dos anúncios
   */
  setupAdUnitIds() {
    if (__DEV__) {
      // IDs de teste (usar IDs de produção em desenvolvimento para testes)
      this.bannerAdUnitId = constants.ads.BANNER_AD_UNIT_ID;
      this.interstitialAdUnitId = constants.ads.INTERSTITIAL_AD_UNIT_ID;
      this.rewardedAdUnitId = constants.ads.REWARDED_AD_UNIT_ID;
    } else {
      // IDs de produção
      this.bannerAdUnitId = constants.ads.BANNER_AD_UNIT_ID;
      this.interstitialAdUnitId = constants.ads.INTERSTITIAL_AD_UNIT_ID;
      this.rewardedAdUnitId = constants.ads.REWARDED_AD_UNIT_ID;
    }
  }

  /**
   * Pré-carrega anúncios
   */
  async preloadAds() {
    try {
      if (!this.adMobConfig?.enableAds) return;

      // Pré-carregar anúncio intersticial
      await this.loadInterstitialAd();
      
      // Pré-carregar anúncio recompensado
      await this.loadRewardedAd();
      
    } catch (error) {
      console.error('Erro ao pré-carregar anúncios:', error);
    }
  }

  /**
   * Carrega anúncio intersticial
   */
  async loadInterstitialAd() {
    try {
      if (!this.interstitialAdUnitId) return;

      // Aqui você implementaria a lógica real do AdMob
      // Por enquanto, simulamos o carregamento
      console.log('📱 Carregando anúncio intersticial...');
      
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.interstitialAd = {
        isLoaded: true,
        show: () => this.showInterstitialAd(),
      };
      
      console.log('✅ Anúncio intersticial carregado');
      
    } catch (error) {
      console.error('Erro ao carregar anúncio intersticial:', error);
      this.handleAdLoadError('interstitial');
    }
  }

  /**
   * Carrega anúncio recompensado
   */
  async loadRewardedAd() {
    try {
      if (!this.rewardedAdUnitId) return;

      console.log('📱 Carregando anúncio recompensado...');
      
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.rewardedAd = {
        isLoaded: true,
        show: () => this.showRewardedAd(),
      };
      
      console.log('✅ Anúncio recompensado carregado');
      
    } catch (error) {
      console.error('Erro ao carregar anúncio recompensado:', error);
      this.handleAdLoadError('rewarded');
    }
  }

  /**
   * Mostra anúncio intersticial
   */
  async showInterstitialAd() {
    try {
      if (this.isPremiumUser) return false;
      
      if (!this.canShowAd()) {
        console.log('⏰ Muito cedo para mostrar anúncio');
        return false;
      }

      if (!this.interstitialAd?.isLoaded) {
        console.log('📱 Anúncio intersticial não carregado');
        await this.loadInterstitialAd();
        return false;
      }

      console.log('📱 Mostrando anúncio intersticial...');
      
      // Simular exibição do anúncio
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Registrar tempo da exibição
      this.lastAdShowTime = Date.now();
      
      // Recarregar anúncio
      await this.loadInterstitialAd();
      
      console.log('✅ Anúncio intersticial exibido');
      return true;
      
    } catch (error) {
      console.error('Erro ao mostrar anúncio intersticial:', error);
      return false;
    }
  }

  /**
   * Mostra anúncio recompensado
   */
  async showRewardedAd() {
    try {
      if (this.isPremiumUser) return false;
      
      if (!this.canShowAd()) {
        console.log('⏰ Muito cedo para mostrar anúncio');
        return false;
      }

      if (!this.rewardedAd?.isLoaded) {
        console.log('📱 Anúncio recompensado não carregado');
        await this.loadRewardedAd();
        return false;
      }

      console.log('📱 Mostrando anúncio recompensado...');
      
      // Simular exibição do anúncio
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Registrar tempo da exibição
      this.lastAdShowTime = Date.now();
      
      // Recarregar anúncio
      await this.loadRewardedAd();
      
      console.log('✅ Anúncio recompensado exibido');
      return true;
      
    } catch (error) {
      console.error('Erro ao mostrar anúncio recompensado:', error);
      return false;
    }
  }

  /**
   * Mostra anúncio banner
   */
  async showBannerAd() {
    try {
      if (this.isPremiumUser) return null;
      
      if (!this.bannerAdUnitId) return null;

      console.log('📱 Mostrando anúncio banner...');
      
      // Simular banner
      const bannerAd = {
        id: 'banner_ad',
        type: 'banner',
        unitId: this.bannerAdUnitId,
      };
      
      return bannerAd;
      
    } catch (error) {
      console.error('Erro ao mostrar anúncio banner:', error);
      return null;
    }
  }

  /**
   * Verifica se pode mostrar anúncio
   */
  canShowAd() {
    const now = Date.now();
    const timeSinceLastAd = now - this.lastAdShowTime;
    
    return timeSinceLastAd >= this.minAdInterval;
  }

  /**
   * Mostra anúncio baseado na frequência configurada
   */
  async showAdByFrequency(adType = 'interstitial') {
    try {
      if (this.isPremiumUser) return false;
      
      const frequency = this.adMobConfig?.adFrequency || 'medium';
      const frequencyRates = {
        low: 0.1,
        medium: 0.3,
        high: 0.6,
      };
      
      const rate = frequencyRates[frequency] || 0.3;
      const shouldShow = Math.random() < rate;
      
      if (!shouldShow) {
        console.log(`📱 Anúncio ${adType} não exibido (frequência: ${frequency})`);
        return false;
      }
      
      switch (adType) {
        case 'interstitial':
          return await this.showInterstitialAd();
        case 'rewarded':
          return await this.showRewardedAd();
        default:
          return false;
      }
      
    } catch (error) {
      console.error(`Erro ao mostrar anúncio ${adType}:`, error);
      return false;
    }
  }

  /**
   * Mostra anúncio após ação específica
   */
  async showAdAfterAction(action) {
    try {
      if (this.isPremiumUser) return false;
      
      const actionAdRates = {
        'draw_complete': 0.4, // 40% após sorteio
        'level_up': 0.2,      // 20% após subir de nível
        'achievement': 0.3,   // 30% após conquista
        'share_result': 0.1,  // 10% após compartilhar
        'app_open': 0.05,     // 5% ao abrir app
      };
      
      const rate = actionAdRates[action] || 0.1;
      const shouldShow = Math.random() < rate;
      
      if (!shouldShow) {
        console.log(`📱 Anúncio não exibido após ação: ${action}`);
        return false;
      }
      
      return await this.showInterstitialAd();
      
    } catch (error) {
      console.error('Erro ao mostrar anúncio após ação:', error);
      return false;
    }
  }

  /**
   * Trata erro de carregamento de anúncio
   */
  handleAdLoadError(adType) {
    this.adLoadAttempts++;
    
    if (this.adLoadAttempts >= this.maxAdLoadAttempts) {
      console.log(`📱 Máximo de tentativas de carregamento atingido para ${adType}`);
      this.adLoadAttempts = 0;
      return;
    }
    
    // Tentar novamente após delay
    setTimeout(() => {
      if (adType === 'interstitial') {
        this.loadInterstitialAd();
      } else if (adType === 'rewarded') {
        this.loadRewardedAd();
      }
    }, 5000 * this.adLoadAttempts);
  }

  /**
   * Atualiza configuração de anúncios
   */
  async updateAdConfig(newConfig) {
    try {
      this.adMobConfig = { ...this.adMobConfig, ...newConfig };
      
      // Salvar configuração
      await AsyncStorage.setItem('ad_mob_config', JSON.stringify(this.adMobConfig));
      
      console.log('✅ Configuração de anúncios atualizada');
      
    } catch (error) {
      console.error('Erro ao atualizar configuração de anúncios:', error);
    }
  }

  /**
   * Obtém estatísticas de anúncios
   */
  async getAdStats() {
    try {
      const stats = await AsyncStorage.getItem('ad_stats');
      return stats ? JSON.parse(stats) : {
        totalShows: 0,
        interstitialShows: 0,
        rewardedShows: 0,
        bannerShows: 0,
        totalRevenue: 0,
        lastAdDate: null,
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas de anúncios:', error);
      return {};
    }
  }

  /**
   * Registra exibição de anúncio
   */
  async recordAdShow(adType) {
    try {
      const stats = await this.getAdStats();
      
      stats.totalShows++;
      stats.lastAdDate = new Date().toISOString();
      
      switch (adType) {
        case 'interstitial':
          stats.interstitialShows++;
          break;
        case 'rewarded':
          stats.rewardedShows++;
          break;
        case 'banner':
          stats.bannerShows++;
          break;
      }
      
      await AsyncStorage.setItem('ad_stats', JSON.stringify(stats));
      
    } catch (error) {
      console.error('Erro ao registrar exibição de anúncio:', error);
    }
  }

  /**
   * Desabilita anúncios para usuário premium
   */
  async disableAdsForPremium() {
    try {
      this.isPremiumUser = true;
      await AsyncStorage.setItem('premium_status', 'true');
      
      // Limpar anúncios carregados
      this.interstitialAd = null;
      this.rewardedAd = null;
      this.bannerAd = null;
      
      console.log('🚫 Anúncios desabilitados para usuário premium');
      
    } catch (error) {
      console.error('Erro ao desabilitar anúncios:', error);
    }
  }

  /**
   * Habilita anúncios novamente
   */
  async enableAds() {
    try {
      this.isPremiumUser = false;
      await AsyncStorage.setItem('premium_status', 'false');
      
      // Reinicializar serviço
      await this.init();
      
      console.log('✅ Anúncios habilitados novamente');
      
    } catch (error) {
      console.error('Erro ao habilitar anúncios:', error);
    }
  }

  /**
   * Obtém status do serviço
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      isPremiumUser: this.isPremiumUser,
      adsEnabled: this.adMobConfig?.enableAds || false,
      interstitialLoaded: this.interstitialAd?.isLoaded || false,
      rewardedLoaded: this.rewardedAd?.isLoaded || false,
      canShowAd: this.canShowAd(),
      timeUntilNextAd: Math.max(0, this.minAdInterval - (Date.now() - this.lastAdShowTime)),
    };
  }
}

// Instância única do serviço
export const ads = new AdsService();

export default ads;
