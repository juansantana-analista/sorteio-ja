// useSound.js
// 🎵 Hook personalizado para gerenciar sons e feedback tátil
// Fornece feedback auditivo e tátil para melhorar a experiência do usuário

import { useState, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-audio';
import * as Haptics from 'expo-haptics';

/**
 * 🎵 Hook para gerenciar sons e feedback tátil
 */
export function useSound() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [sounds, setSounds] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔄 Carregar configurações ao montar
  useEffect(() => {
    loadSettings();
    loadSounds();
  }, []);

  /**
   * 📥 Carregar configurações de som e vibração
   */
  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('@SorteioJa:settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setSoundEnabled(settings.soundEnabled ?? true);
        setHapticEnabled(settings.hapticEnabled ?? true);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar configurações de som:', error);
    }
  };

  /**
   * 🎵 Carregar arquivos de som
   */
  const loadSounds = async () => {
    try {
      setLoading(true);
      
      // 🎲 Som de sorteio
      const drawSound = new Audio.Sound();
      await drawSound.loadAsync(require('../assets/sounds/draw.mp3'));
      
      // 🎉 Som de vitória
      const winSound = new Audio.Sound();
      await winSound.loadAsync(require('../assets/sounds/win.mp3'));
      
      // 📱 Som de clique
      const clickSound = new Audio.Sound();
      await clickSound.loadAsync(require('../assets/sounds/click.mp3'));
      
      // ⚠️ Som de erro
      const errorSound = new Audio.Sound();
      await errorSound.loadAsync(require('../assets/sounds/error.mp3'));
      
      // 🔔 Som de notificação
      const notificationSound = new Audio.Sound();
      await notificationSound.loadAsync(require('../assets/sounds/notification.mp3'));
      
      setSounds({
        draw: drawSound,
        win: winSound,
        click: clickSound,
        error: errorSound,
        notification: notificationSound,
      });
    } catch (error) {
      console.error('❌ Erro ao carregar sons:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🎵 Tocar som
   */
  const playSound = useCallback(async (soundType) => {
    if (!soundEnabled || !sounds[soundType]) return;

    try {
      const sound = sounds[soundType];
      await sound.replayAsync();
    } catch (error) {
      console.error('❌ Erro ao tocar som:', error);
    }
  }, [soundEnabled, sounds]);

  /**
   * 📳 Ativar feedback tátil
   */
  const triggerHaptic = useCallback(async (hapticType = 'light') => {
    if (!hapticEnabled || Platform.OS !== 'ios') return;

    try {
      switch (hapticType) {
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        default:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.error('❌ Erro ao ativar haptic:', error);
    }
  }, [hapticEnabled]);

  /**
   * 🎵 Tocar som com feedback tátil
   */
  const playSoundWithHaptic = useCallback(async (soundType, hapticType = 'light') => {
    await Promise.all([
      playSound(soundType),
      triggerHaptic(hapticType),
    ]);
  }, [playSound, triggerHaptic]);

  /**
   * 🎵 Tocar som de sorteio
   */
  const playDrawSound = useCallback(async () => {
    await playSoundWithHaptic('draw', 'medium');
  }, [playSoundWithHaptic]);

  /**
   * 🎉 Tocar som de vitória
   */
  const playWinSound = useCallback(async () => {
    await playSoundWithHaptic('win', 'success');
  }, [playSoundWithHaptic]);

  /**
   * 📱 Tocar som de clique
   */
  const playClickSound = useCallback(async () => {
    await playSoundWithHaptic('click', 'light');
  }, [playSoundWithHaptic]);

  /**
   * ⚠️ Tocar som de erro
   */
  const playErrorSound = useCallback(async () => {
    await playSoundWithHaptic('error', 'error');
  }, [playSoundWithHaptic]);

  /**
   * 🔔 Tocar som de notificação
   */
  const playNotificationSound = useCallback(async () => {
    await playSoundWithHaptic('notification', 'light');
  }, [playSoundWithHaptic]);

  /**
   * 🔄 Atualizar configurações
   */
  const updateSettings = useCallback(async (newSoundEnabled, newHapticEnabled) => {
    try {
      setSoundEnabled(newSoundEnabled);
      setHapticEnabled(newHapticEnabled);
      
      // Salvar nas configurações
      const savedSettings = await AsyncStorage.getItem('@SorteioJa:settings');
      const settings = savedSettings ? JSON.parse(savedSettings) : {};
      
      settings.soundEnabled = newSoundEnabled;
      settings.hapticEnabled = newHapticEnabled;
      
      await AsyncStorage.setItem('@SorteioJa:settings', JSON.stringify(settings));
    } catch (error) {
      console.error('❌ Erro ao atualizar configurações de som:', error);
    }
  }, []);

  /**
   * 🔇 Alternar som
   */
  const toggleSound = useCallback(async () => {
    await updateSettings(!soundEnabled, hapticEnabled);
  }, [soundEnabled, hapticEnabled, updateSettings]);

  /**
   * 📳 Alternar haptic
   */
  const toggleHaptic = useCallback(async () => {
    await updateSettings(soundEnabled, !hapticEnabled);
  }, [soundEnabled, hapticEnabled, updateSettings]);

  /**
   * 🧹 Limpar recursos de som
   */
  const cleanup = useCallback(async () => {
    try {
      Object.values(sounds).forEach(sound => {
        if (sound && sound.unloadAsync) {
          sound.unloadAsync();
        }
      });
      setSounds({});
    } catch (error) {
      console.error('❌ Erro ao limpar sons:', error);
    }
  }, [sounds]);

  // 🧹 Limpar recursos ao desmontar
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    // 📊 Estado
    soundEnabled,
    hapticEnabled,
    loading,
    
    // 🎵 Métodos de som
    playSound,
    playDrawSound,
    playWinSound,
    playClickSound,
    playErrorSound,
    playNotificationSound,
    
    // 📳 Métodos de haptic
    triggerHaptic,
    playSoundWithHaptic,
    
    // ⚙️ Configurações
    updateSettings,
    toggleSound,
    toggleHaptic,
    
    // 🧹 Utilitários
    cleanup,
  };
}
