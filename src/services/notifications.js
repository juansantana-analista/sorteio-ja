import { Platform, Alert, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { constants } from '../utils/constants';
import * as helpers from '../utils/helpers';

/**
 * 🔔 Serviço de notificações
 * Gerencia notificações push e locais no app
 */
class NotificationsService {
  constructor() {
    this.isInitialized = false;
    this.hasPermission = false;
    this.notificationToken = null;
    this.notificationSettings = null;
    this.scheduledNotifications = [];
    this.notificationHistory = [];
  }

  /**
   * Inicializa o serviço de notificações
   */
  async init() {
    try {
      if (this.isInitialized) return;

      // Carregar configurações
      await this.loadNotificationSettings();
      
      // Verificar permissões
      await this.checkPermissions();
      
      // Configurar notificações
      await this.setupNotifications();
      
      // Carregar histórico
      await this.loadNotificationHistory();
      
      this.isInitialized = true;
      console.log('✅ Serviço de notificações inicializado');
      
    } catch (error) {
      console.error('❌ Erro ao inicializar serviço de notificações:', error);
    }
  }

  /**
   * Carrega configurações de notificações
   */
  async loadNotificationSettings() {
    try {
      const settings = await AsyncStorage.getItem('notification_settings');
      
      if (settings) {
        this.notificationSettings = JSON.parse(settings);
      } else {
        // Configurações padrão
        this.notificationSettings = {
          enabled: true,
          push: true,
          local: true,
          sound: true,
          vibration: true,
          dailyReminder: true,
          weeklyReport: true,
          achievementAlerts: true,
          levelUpAlerts: true,
          streakAlerts: true,
          quietHours: {
            enabled: false,
            start: '22:00',
            end: '08:00',
          },
        };
        
        await this.saveNotificationSettings();
      }
    } catch (error) {
      console.error('Erro ao carregar configurações de notificações:', error);
    }
  }

  /**
   * Salva configurações de notificações
   */
  async saveNotificationSettings() {
    try {
      await AsyncStorage.setItem('notification_settings', JSON.stringify(this.notificationSettings));
    } catch (error) {
      console.error('Erro ao salvar configurações de notificações:', error);
    }
  }

  /**
   * Verifica permissões de notificação
   */
  async checkPermissions() {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Permissão de Notificações',
            message: 'O app precisa de permissão para enviar notificações.',
            buttonNeutral: 'Perguntar depois',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          }
        );
        
        this.hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        // iOS - implementar verificação de permissão
        this.hasPermission = true; // Simulado por enquanto
      }
      
      console.log(`🔔 Permissão de notificações: ${this.hasPermission ? 'Concedida' : 'Negada'}`);
      
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      this.hasPermission = false;
    }
  }

  /**
   * Configura notificações
   */
  async setupNotifications() {
    try {
      if (!this.hasPermission) {
        console.log('🚫 Sem permissão para notificações');
        return;
      }

      // Configurar notificações locais
      await this.setupLocalNotifications();
      
      // Configurar notificações push (se disponível)
      await this.setupPushNotifications();
      
      // Configurar notificações agendadas
      await this.setupScheduledNotifications();
      
    } catch (error) {
      console.error('Erro ao configurar notificações:', error);
    }
  }

  /**
   * Configura notificações locais
   */
  async setupLocalNotifications() {
    try {
      // Aqui você implementaria a lógica real das notificações locais
      // Por enquanto, simulamos a configuração
      console.log('🔔 Configurando notificações locais...');
      
      // Configurar categorias de notificação
      const categories = [
        {
          id: 'draw_complete',
          title: 'Sorteio Concluído',
          actions: [
            { id: 'view', title: 'Ver Resultado' },
            { id: 'share', title: 'Compartilhar' },
          ],
        },
        {
          id: 'achievement',
          title: 'Conquista Desbloqueada',
          actions: [
            { id: 'view', title: 'Ver Conquista' },
            { id: 'share', title: 'Compartilhar' },
          ],
        },
        {
          id: 'level_up',
          title: 'Nível Aumentou',
          actions: [
            { id: 'view', title: 'Ver Progresso' },
            { id: 'share', title: 'Compartilhar' },
          ],
        },
      ];
      
      console.log('✅ Categorias de notificação configuradas');
      
    } catch (error) {
      console.error('Erro ao configurar notificações locais:', error);
    }
  }

  /**
   * Configura notificações push
   */
  async setupPushNotifications() {
    try {
      // Aqui você implementaria a lógica real das notificações push
      // Por enquanto, simulamos a configuração
      console.log('🔔 Configurando notificações push...');
      
      // Simular obtenção de token
      this.notificationToken = helpers.generateId();
      
      console.log('✅ Token de notificação obtido:', this.notificationToken);
      
    } catch (error) {
      console.error('Erro ao configurar notificações push:', error);
    }
  }

  /**
   * Configura notificações agendadas
   */
  async setupScheduledNotifications() {
    try {
      if (!this.notificationSettings.dailyReminder) return;
      
      // Configurar lembretes diários
      await this.scheduleDailyReminder();
      
      // Configurar relatórios semanais
      if (this.notificationSettings.weeklyReport) {
        await this.scheduleWeeklyReport();
      }
      
    } catch (error) {
      console.error('Erro ao configurar notificações agendadas:', error);
    }
  }

  /**
   * Agenda lembrete diário
   */
  async scheduleDailyReminder() {
    try {
      const reminderTime = '20:00'; // 8:00 PM
      const [hours, minutes] = reminderTime.split(':');
      
      const now = new Date();
      const reminderDate = new Date();
      reminderDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      // Se já passou do horário hoje, agendar para amanhã
      if (reminderDate <= now) {
        reminderDate.setDate(reminderDate.getDate() + 1);
      }
      
      const notification = {
        id: 'daily_reminder',
        title: '🎲 Hora do Sorteio!',
        body: 'Que tal fazer um sorteio hoje? Mantenha sua sequência!',
        data: { type: 'daily_reminder' },
        scheduledDate: reminderDate.getTime(),
        repeat: 'daily',
      };
      
      await this.scheduleNotification(notification);
      console.log('✅ Lembrete diário agendado para:', reminderDate.toLocaleString());
      
    } catch (error) {
      console.error('Erro ao agendar lembrete diário:', error);
    }
  }

  /**
   * Agenda relatório semanal
   */
  async scheduleWeeklyReport() {
    try {
      const reportTime = '18:00'; // 6:00 PM
      const [hours, minutes] = reportTime.split(':');
      
      const now = new Date();
      const reportDate = new Date();
      reportDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      // Próximo domingo
      const daysUntilSunday = (7 - reportDate.getDay()) % 7;
      reportDate.setDate(reportDate.getDate() + daysUntilSunday);
      
      // Se já passou do horário hoje, agendar para próxima semana
      if (reportDate <= now) {
        reportDate.setDate(reportDate.getDate() + 7);
      }
      
      const notification = {
        id: 'weekly_report',
        title: '📊 Seu Relatório Semanal',
        body: 'Veja como foi sua semana de sorteios!',
        data: { type: 'weekly_report' },
        scheduledDate: reportDate.getTime(),
        repeat: 'weekly',
      };
      
      await this.scheduleNotification(notification);
      console.log('✅ Relatório semanal agendado para:', reportDate.toLocaleString());
      
    } catch (error) {
      console.error('Erro ao agendar relatório semanal:', error);
    }
  }

  /**
   * Agenda uma notificação
   */
  async scheduleNotification(notification) {
    try {
      // Aqui você implementaria a lógica real de agendamento
      // Por enquanto, simulamos o agendamento
      
      this.scheduledNotifications.push(notification);
      
      // Salvar notificações agendadas
      await AsyncStorage.setItem('scheduled_notifications', JSON.stringify(this.scheduledNotifications));
      
      console.log('✅ Notificação agendada:', notification.title);
      
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
    }
  }

  /**
   * Envia notificação local
   */
  async sendLocalNotification(notification) {
    try {
      if (!this.hasPermission || !this.notificationSettings.local) {
        console.log('🚫 Notificações locais desabilitadas');
        return false;
      }

      // Verificar horário silencioso
      if (this.isInQuietHours()) {
        console.log('🌙 Horário silencioso - notificação não enviada');
        return false;
      }

      // Aqui você implementaria a lógica real de envio
      // Por enquanto, simulamos o envio
      console.log('🔔 Enviando notificação local:', notification.title);
      
      // Adicionar ao histórico
      await this.addToHistory(notification);
      
      // Simular delay de envio
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('✅ Notificação local enviada');
      return true;
      
    } catch (error) {
      console.error('Erro ao enviar notificação local:', error);
      return false;
    }
  }

  /**
   * Envia notificação push
   */
  async sendPushNotification(notification) {
    try {
      if (!this.hasPermission || !this.notificationSettings.push) {
        console.log('🚫 Notificações push desabilitadas');
        return false;
      }

      if (!this.notificationToken) {
        console.log('🚫 Token de notificação não disponível');
        return false;
      }

      // Aqui você implementaria a lógica real de envio
      // Por enquanto, simulamos o envio
      console.log('🔔 Enviando notificação push:', notification.title);
      
      // Simular envio para servidor
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('✅ Notificação push enviada');
      return true;
      
    } catch (error) {
      console.error('Erro ao enviar notificação push:', error);
      return false;
    }
  }

  /**
   * Verifica se está em horário silencioso
   */
  isInQuietHours() {
    if (!this.notificationSettings.quietHours.enabled) return false;
    
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const { start, end } = this.notificationSettings.quietHours;
    
    if (start <= end) {
      // Mesmo dia (ex: 08:00 - 22:00)
      return currentTime >= start && currentTime <= end;
    } else {
      // Diferentes dias (ex: 22:00 - 08:00)
      return currentTime >= start || currentTime <= end;
    }
  }

  /**
   * Adiciona notificação ao histórico
   */
  async addToHistory(notification) {
    try {
      const historyItem = {
        id: helpers.generateId(),
        timestamp: Date.now(),
        title: notification.title,
        body: notification.body,
        data: notification.data,
        type: 'local',
        read: false,
      };
      
      this.notificationHistory.unshift(historyItem);
      
      // Manter apenas as últimas 100 notificações
      if (this.notificationHistory.length > 100) {
        this.notificationHistory = this.notificationHistory.slice(0, 100);
      }
      
      // Salvar histórico
      await AsyncStorage.setItem('notification_history', JSON.stringify(this.notificationHistory));
      
    } catch (error) {
      console.error('Erro ao adicionar ao histórico:', error);
    }
  }

  /**
   * Carrega histórico de notificações
   */
  async loadNotificationHistory() {
    try {
      const history = await AsyncStorage.getItem('notification_history');
      if (history) {
        this.notificationHistory = JSON.parse(history);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico de notificações:', error);
    }
  }

  /**
   * Marca notificação como lida
   */
  async markAsRead(notificationId) {
    try {
      const notification = this.notificationHistory.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
        await AsyncStorage.setItem('notification_history', JSON.stringify(this.notificationHistory));
      }
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  }

  /**
   * Limpa histórico de notificações
   */
  async clearHistory() {
    try {
      this.notificationHistory = [];
      await AsyncStorage.removeItem('notification_history');
      console.log('✅ Histórico de notificações limpo');
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
    }
  }

  /**
   * Cancela notificação agendada
   */
  async cancelScheduledNotification(notificationId) {
    try {
      this.scheduledNotifications = this.scheduledNotifications.filter(n => n.id !== notificationId);
      await AsyncStorage.setItem('scheduled_notifications', JSON.stringify(this.scheduledNotifications));
      console.log('✅ Notificação agendada cancelada:', notificationId);
    } catch (error) {
      console.error('Erro ao cancelar notificação agendada:', error);
    }
  }

  /**
   * Cancela todas as notificações agendadas
   */
  async cancelAllScheduledNotifications() {
    try {
      this.scheduledNotifications = [];
      await AsyncStorage.removeItem('scheduled_notifications');
      console.log('✅ Todas as notificações agendadas canceladas');
    } catch (error) {
      console.error('Erro ao cancelar todas as notificações:', error);
    }
  }

  /**
   * Atualiza configurações de notificações
   */
  async updateSettings(newSettings) {
    try {
      this.notificationSettings = { ...this.notificationSettings, ...newSettings };
      await this.saveNotificationSettings();
      
      // Reconfigurar notificações se necessário
      if (newSettings.dailyReminder !== undefined) {
        if (newSettings.dailyReminder) {
          await this.scheduleDailyReminder();
        } else {
          await this.cancelScheduledNotification('daily_reminder');
        }
      }
      
      console.log('✅ Configurações de notificações atualizadas');
      
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
    }
  }

  /**
   * Obtém estatísticas de notificações
   */
  async getNotificationStats() {
    try {
      const totalSent = this.notificationHistory.length;
      const unread = this.notificationHistory.filter(n => !n.read).length;
      const scheduled = this.scheduledNotifications.length;
      
      return {
        totalSent,
        unread,
        scheduled,
        hasPermission: this.hasPermission,
        settings: this.notificationSettings,
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return {};
    }
  }

  /**
   * Obtém status do serviço
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      hasPermission: this.hasPermission,
      isEnabled: this.notificationSettings?.enabled || false,
      pushEnabled: this.notificationSettings?.push || false,
      localEnabled: this.notificationSettings?.local || false,
      notificationToken: this.notificationToken,
      scheduledCount: this.scheduledNotifications.length,
      historyCount: this.notificationHistory.length,
    };
  }
}

// Instância única do serviço
export const notifications = new NotificationsService();

export default notifications;
