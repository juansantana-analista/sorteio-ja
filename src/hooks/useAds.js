// useAds.js
// 📺 Hook personalizado para gerenciar anúncios AdMob
// Fornece funcionalidades de monetização com anúncios

import { useState, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ads } from '../services/ads';

/**
 * 📺 Hook para gerenciar anúncios
 */
export function useAds() {
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔄 Carregar configurações ao montar
  useEffect(() => {
    loadSettings();
  }, []);

  /**
   * 📥 Carregar configurações de anúncios
   */
  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('@SorteioJa:settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setAdsEnabled(settings.adsEnabled ?? true);
        setIsPremium(settings.isPremium ?? false);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar configurações de anúncios:', error);
    }
  };

  /**
   * 📺 Mostrar anúncio banner
   */
  const showBannerAd = useCallback(async () => {
    if (!adsEnabled || isPremium) return;

    try {
      setLoading(true);
      setError(null);
      
      await ads.showBannerAd();
    } catch (err) {
      setError(err.message);
      console.error('❌ Erro ao mostrar banner:', err);
    } finally {
      setLoading(false);
    }
  }, [adsEnabled, isPremium]);

  /**
   * 📺 Mostrar anúncio intersticial
   */
  const showInterstitialAd = useCallback(async () => {
    if (!adsEnabled || isPremium) return;

    try {
      setLoading(true);
      setError(null);
      
      await ads.showInterstitialAd();
    } catch (err) {
      setError(err.message);
      console.error('❌ Erro ao mostrar intersticial:', err);
    } finally {
      setLoading(false);
    }
  }, [adsEnabled, isPremium]);

  /**
   * 🎥 Mostrar anúncio de vídeo recompensado
   */
  const showRewardedAd = useCallback(async () => {
    if (!adsEnabled || isPremium) return;

    try {
      setLoading(true);
      setError(null);
      
      const reward = await ads.showRewardedAd();
      return reward;
    } catch (err) {
      setError(err.message);
      console.error('❌ Erro ao mostrar vídeo recompensado:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [adsEnabled, isPremium]);

  /**
   * 📺 Mostrar anúncio após sorteio
   */
  const showAdAfterDraw = useCallback(async () => {
    if (!adsEnabled || isPremium) return;

    try {
      // 30% de chance de mostrar anúncio intersticial
      if (Math.random() < 0.3) {
        await showInterstitialAd();
      }
    } catch (error) {
      console.error('❌ Erro ao mostrar anúncio após sorteio:', error);
    }
  }, [adsEnabled, isPremium, showInterstitialAd]);

  /**
   * 📺 Mostrar anúncio ao abrir histórico
   */
  const showAdOnHistoryOpen = useCallback(async () => {
    if (!adsEnabled || isPremium) return;

    try {
      // 20% de chance de mostrar anúncio intersticial
      if (Math.random() < 0.2) {
        await showInterstitialAd();
      }
    } catch (error) {
      console.error('❌ Erro ao mostrar anúncio no histórico:', error);
    }
  }, [adsEnabled, isPremium, showInterstitialAd]);

  /**
   * 📺 Mostrar anúncio ao compartilhar
   */
  const showAdOnShare = useCallback(async () => {
    if (!adsEnabled || isPremium) return;

    try {
      // 15% de chance de mostrar anúncio intersticial
      if (Math.random() < 0.15) {
        await showInterstitialAd();
      }
    } catch (error) {
      console.error('❌ Erro ao mostrar anúncio no compartilhamento:', error);
    }
  }, [adsEnabled, isPremium, showInterstitialAd]);

  /**
   * 🎁 Mostrar anúncio recompensado para ganhar pontos extras
   */
  const showAdForExtraPoints = useCallback(async () => {
    if (!adsEnabled || isPremium) return;

    try {
      const reward = await showRewardedAd();
      if (reward && reward.type === 'points') {
        return reward.amount;
      }
      return 0;
    } catch (error) {
      console.error('❌ Erro ao mostrar anúncio para pontos extras:', error);
      return 0;
    }
  }, [adsEnabled, isPremium, showRewardedAd]);

  /**
   * 🎁 Mostrar anúncio recompensado para desbloquear funcionalidade
   */
  const showAdToUnlockFeature = useCallback(async (feature) => {
    if (!adsEnabled || isPremium) return false;

    try {
      const reward = await showRewardedAd();
      if (reward && reward.type === 'unlock') {
        // Salvar funcionalidade desbloqueada
        await AsyncStorage.setItem(`@SorteioJa:unlocked_${feature}`, 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erro ao mostrar anúncio para desbloquear:', error);
      return false;
    }
  }, [adsEnabled, isPremium, showRewardedAd]);

  /**
   * ⚙️ Atualizar configurações de anúncios
   */
  const updateAdSettings = useCallback(async (newAdsEnabled, newIsPremium) => {
    try {
      setAdsEnabled(newAdsEnabled);
      setIsPremium(newIsPremium);
      
      // Salvar nas configurações
      const savedSettings = await AsyncStorage.getItem('@SorteioJa:settings');
      const settings = savedSettings ? JSON.parse(savedSettings) : {};
      
      settings.adsEnabled = newAdsEnabled;
      settings.isPremium = newIsPremium;
      
      await AsyncStorage.setItem('@SorteioJa:settings', JSON.stringify(settings));
    } catch (error) {
      console.error('❌ Erro ao atualizar configurações de anúncios:', error);
    }
  }, []);

  /**
   * 📺 Alternar anúncios
   */
  const toggleAds = useCallback(async () => {
    await updateAdSettings(!adsEnabled, isPremium);
  }, [adsEnabled, isPremium, updateAdSettings]);

  /**
   * 👑 Ativar modo premium
   */
  const activatePremium = useCallback(async () => {
    await updateAdSettings(false, true);
  }, [updateAdSettings]);

  /**
   * 📺 Desativar modo premium
   */
  const deactivatePremium = useCallback(async () => {
    await updateAdSettings(true, false);
  }, [updateAdSettings]);

  /**
   * 📊 Verificar se funcionalidade está desbloqueada
   */
  const isFeatureUnlocked = useCallback(async (feature) => {
    if (isPremium) return true;
    
    try {
      const unlocked = await AsyncStorage.getItem(`@SorteioJa:unlocked_${feature}`);
      return unlocked === 'true';
    } catch (error) {
      console.error('❌ Erro ao verificar funcionalidade:', error);
      return false;
    }
  }, [isPremium]);

  /**
   * 🧹 Limpar erro
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // 📊 Estado
    adsEnabled,
    isPremium,
    loading,
    error,
    
    // 📺 Métodos de anúncio
    showBannerAd,
    showInterstitialAd,
    showRewardedAd,
    
    // 🎯 Anúncios contextuais
    showAdAfterDraw,
    showAdOnHistoryOpen,
    showAdOnShare,
    showAdForExtraPoints,
    showAdToUnlockFeature,
    
    // ⚙️ Configurações
    updateAdSettings,
    toggleAds,
    activatePremium,
    deactivatePremium,
    
    // 🔍 Verificações
    isFeatureUnlocked,
    
    // 🧹 Utilitários
    clearError,
  };
}
