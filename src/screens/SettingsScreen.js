// SettingsScreen.js
// ⚙️ Tela de configurações do app Sorteio Já
// Permite personalizar comportamento, notificações e preferências

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🎮 Hooks
import { useGamification } from '../hooks/useGamification';
import { useSound } from '../hooks/useSound';

// 🛠️ Serviços
import { database } from '../services/database';

// 🎨 Tema
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

// 🧩 Componentes
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

/**
 * ⚙️ Tela de configurações
 */
export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    soundEnabled: true,
    hapticEnabled: true,
    notificationsEnabled: true,
    autoSaveEnabled: true,
    darkModeEnabled: false,
    language: 'pt-BR',
  });

  const [stats, setStats] = useState({
    totalDraws: 0,
    totalLists: 0,
    totalParticipants: 0,
    appVersion: '1.0.0',
  });

  const { resetProgress, getStats } = useGamification();
  const { playSound } = useSound();

  // 🔄 Carregar configurações ao montar
  useEffect(() => {
    loadSettings();
    loadStats();
  }, []);

  /**
   * 📥 Carregar configurações salvas
   */
  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('@SorteioJa:settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('❌ Erro ao carregar configurações:', error);
    }
  };

  /**
   * 📊 Carregar estatísticas
   */
  const loadStats = async () => {
    try {
      const statsData = await getStats();
      setStats(statsData);
    } catch (error) {
      console.error('❌ Erro ao carregar estatísticas:', error);
    }
  };

  /**
   * 💾 Salvar configuração
   */
  const saveSetting = async (key, value) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      await AsyncStorage.setItem('@SorteioJa:settings', JSON.stringify(newSettings));
      
      // 🎵 Tocar som de feedback
      if (key === 'soundEnabled' && value) {
        playSound('click');
      }
    } catch (error) {
      console.error('❌ Erro ao salvar configuração:', error);
    }
  };

  /**
   * 🗑️ Limpar histórico
   */
  const clearHistory = () => {
    Alert.alert(
      'Limpar Histórico',
      'Tem certeza que deseja excluir todo o histórico de sorteios? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar Tudo',
          style: 'destructive',
          onPress: async () => {
            try {
              await database.clearHistory();
              await loadStats();
              Alert.alert('Sucesso', 'Histórico limpo com sucesso!');
            } catch (error) {
              console.error('❌ Erro ao limpar histórico:', error);
              Alert.alert('Erro', 'Não foi possível limpar o histórico');
            }
          },
        },
      ]
    );
  };

  /**
   * 🔄 Resetar progresso
   */
  const handleResetProgress = () => {
    Alert.alert(
      'Resetar Progresso',
      'Tem certeza que deseja resetar todo o progresso, níveis e pontos? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetar Tudo',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetProgress();
              await loadStats();
              Alert.alert('Sucesso', 'Progresso resetado com sucesso!');
            } catch (error) {
              console.error('❌ Erro ao resetar progresso:', error);
              Alert.alert('Erro', 'Não foi possível resetar o progresso');
            }
          },
        },
      ]
    );
  };

  /**
   * 📧 Abrir email de suporte
   */
  const openSupportEmail = () => {
    const subject = 'Suporte - Sorteio Já';
    const body = 'Olá! Preciso de ajuda com o app Sorteio Já.\n\n';
    const mailtoUrl = `mailto:suporte@sorteioja.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.canOpenURL(mailtoUrl).then(supported => {
      if (supported) {
        Linking.openURL(mailtoUrl);
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o app de email');
      }
    });
  };

  /**
   * 🌐 Abrir site
   */
  const openWebsite = () => {
    Linking.openURL('https://sorteioja.com');
  };

  /**
   * 🎨 Renderizar seção de configurações
   */
  const renderSettingsSection = (title, children) => (
    <Card style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </Card>
  );

  /**
   * 🎨 Renderizar item de configuração
   */
  const renderSettingItem = (icon, title, subtitle, rightComponent) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Icon name={icon} size={24} color={colors.primary.main} style={styles.settingIcon} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ⚙️ Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configurações</Text>
        <Text style={styles.headerSubtitle}>
          Personalize sua experiência no app
        </Text>
      </View>

      {/* 🔊 Preferências de Som */}
      {renderSettingsSection('🔊 Som e Vibração', (
        <>
          {renderSettingItem(
            'volume-high',
            'Som',
            'Ativar sons de feedback',
            <Switch
              value={settings.soundEnabled}
              onValueChange={(value) => saveSetting('soundEnabled', value)}
              trackColor={{ false: colors.border.light, true: colors.primary.light }}
              thumbColor={settings.soundEnabled ? colors.primary.main : colors.text.tertiary}
            />
          )}
          
          {renderSettingItem(
            'vibrate',
            'Vibração',
            'Ativar feedback tátil',
            <Switch
              value={settings.hapticEnabled}
              onValueChange={(value) => saveSetting('hapticEnabled', value)}
              trackColor={{ false: colors.border.light, true: colors.primary.light }}
              thumbColor={settings.hapticEnabled ? colors.primary.main : colors.text.tertiary}
            />
          )}
        </>
      ))}

      {/* 🔔 Notificações */}
      {renderSettingsSection('🔔 Notificações', (
        <>
          {renderSettingItem(
            'bell',
            'Notificações',
            'Receber lembretes e novidades',
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={(value) => saveSetting('notificationsEnabled', value)}
              trackColor={{ false: colors.border.light, true: colors.primary.light }}
              thumbColor={settings.notificationsEnabled ? colors.primary.main : colors.text.tertiary}
            />
          )}
        </>
      ))}

      {/* 💾 Dados */}
      {renderSettingsSection('💾 Dados e Armazenamento', (
        <>
          {renderSettingItem(
            'content-save',
            'Salvamento Automático',
            'Salvar listas automaticamente',
            <Switch
              value={settings.autoSaveEnabled}
              onValueChange={(value) => saveSetting('autoSaveEnabled', value)}
              trackColor={{ false: colors.border.light, true: colors.primary.light }}
              thumbColor={settings.autoSaveEnabled ? colors.primary.main : colors.text.tertiary}
            />
          )}
          
          {renderSettingItem(
            'palette',
            'Modo Escuro',
            'Usar tema escuro',
            <Switch
              value={settings.darkModeEnabled}
              onValueChange={(value) => saveSetting('darkModeEnabled', value)}
              trackColor={{ false: colors.border.light, true: colors.primary.light }}
              thumbColor={settings.darkModeEnabled ? colors.primary.main : colors.text.tertiary}
            />
          )}
        </>
      ))}

      {/* 📊 Estatísticas */}
      {renderSettingsSection('📊 Estatísticas', (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalDraws}</Text>
            <Text style={styles.statLabel}>Sorteios</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalLists}</Text>
            <Text style={styles.statLabel}>Listas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalParticipants}</Text>
            <Text style={styles.statLabel}>Participantes</Text>
          </View>
        </View>
      ))}

      {/* 🗑️ Ações Destrutivas */}
      {renderSettingsSection('⚠️ Ações Destrutivas', (
        <>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={clearHistory}
          >
            <Icon name="delete-sweep" size={20} color={colors.error.main} />
            <Text style={styles.dangerButtonText}>Limpar Histórico</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleResetProgress}
          >
            <Icon name="refresh" size={20} color={colors.error.main} />
            <Text style={styles.dangerButtonText}>Resetar Progresso</Text>
          </TouchableOpacity>
        </>
      ))}

      {/* 📱 Sobre */}
      {renderSettingsSection('📱 Sobre', (
        <>
          {renderSettingItem(
            'information',
            'Versão',
            `v${stats.appVersion}`,
            null
          )}
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={openWebsite}
          >
            <View style={styles.settingLeft}>
              <Icon name="web" size={24} color={colors.primary.main} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Site Oficial</Text>
                <Text style={styles.settingSubtitle}>Visitar sorteioja.com</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={openSupportEmail}
          >
            <View style={styles.settingLeft}>
              <Icon name="email" size={24} color={colors.primary.main} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Suporte</Text>
                <Text style={styles.settingSubtitle}>Enviar email</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
        </>
      ))}

      {/* 📏 Espaçamento final */}
      <View style={styles.finalSpacing} />
    </ScrollView>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.system.background,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  sectionCard: {
    margin: spacing.lg,
    marginTop: 0,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: spacing.md,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    ...typography.body1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  settingSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  settingRight: {
    marginLeft: spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...typography.h2,
    color: colors.primary.main,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  dangerButtonText: {
    ...typography.body1,
    color: colors.error.main,
    marginLeft: spacing.md,
  },
  finalSpacing: {
    height: spacing.xl,
  },
});
