// constants.js
// 📋 Constantes globais do app Sorteio Já
// Centraliza valores fixos e configurações

/**
 * 🎯 Configurações do App
 */
export const APP_CONFIG = {
  NAME: 'Sorteio Já',
  VERSION: '1.0.0',
  BUILD: '1',
  BUNDLE_ID: 'com.sorteioja.app',
  
  // 🎨 Configurações de UI
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  MAX_LIST_NAME_LENGTH: 50,
  MAX_PARTICIPANT_NAME_LENGTH: 100,
  MAX_PARTICIPANTS_PER_LIST: 1000,
  
  // 🔐 Configurações de segurança
  MIN_HASH_LENGTH: 32,
  SALT_ROUNDS: 10,
  
  // 📱 Configurações de notificação
  NOTIFICATION_DELAY: 2000,
  MAX_NOTIFICATIONS: 5,
};

/**
 * 🎮 Configurações de Gamificação
 */
export const GAMIFICATION_CONFIG = {
  // 📊 Pontos
  POINTS_PER_DRAW: 10,
  POINTS_PER_SHARE: 5,
  POINTS_PER_VERIFICATION: 3,
  POINTS_PER_ACHIEVEMENT: 25,
  POINTS_PER_LEVEL_UP: 50,
  
  // 📈 Experiência
  XP_PER_DRAW: 15,
  XP_PER_SHARE: 8,
  XP_PER_VERIFICATION: 5,
  XP_PER_ACHIEVEMENT: 40,
  
  // 🎯 Níveis
  XP_PER_LEVEL: 100,
  MAX_LEVEL: 100,
  
  // 🔥 Streaks
  STREAK_BONUS_MULTIPLIER: 1.5,
  MAX_STREAK_BONUS: 3.0,
  STREAK_RESET_DAYS: 7,
  
  // 🏆 Conquistas
  ACHIEVEMENTS: {
    FIRST_DRAW: {
      id: 'first_draw',
      name: 'Primeiro Sorteio',
      description: 'Realize seu primeiro sorteio',
      points: 25,
      xp: 40,
    },
    DRAW_MASTER: {
      id: 'draw_master',
      name: 'Mestre dos Sorteios',
      description: 'Realize 100 sorteios',
      points: 100,
      xp: 150,
    },
    SHARING_KING: {
      id: 'sharing_king',
      name: 'Rei do Compartilhamento',
      description: 'Compartilhe 50 resultados',
      points: 75,
      xp: 100,
    },
    VERIFICATION_EXPERT: {
      id: 'verification_expert',
      name: 'Especialista em Verificação',
      description: 'Verifique 25 hashes',
      points: 50,
      xp: 75,
    },
    STREAK_CHAMPION: {
      id: 'streak_champion',
      name: 'Campeão da Sequência',
      description: 'Mantenha uma sequência de 30 dias',
      points: 150,
      xp: 200,
    },
  },
};

/**
 * 🎲 Configurações de Sorteio
 */
export const LOTTERY_CONFIG = {
  // 🔄 Algoritmos disponíveis
  ALGORITHMS: {
    RANDOM: 'random',
    WEIGHTED: 'weighted',
    SEQUENTIAL: 'sequential',
    SHUFFLE: 'shuffle',
  },
  
  // ⚡ Configurações de performance
  MAX_ITERATIONS: 10000,
  TIMEOUT_MS: 5000,
  
  // 🎯 Configurações de resultado
  MAX_RESULTS_PER_DRAW: 10,
  MIN_PARTICIPANTS: 1,
  
  // 🔐 Configurações de hash
  HASH_ALGORITHM: 'sha256',
  SALT_LENGTH: 16,
};

/**
 * 🗄️ Configurações do Banco de Dados
 */
export const DATABASE_CONFIG = {
  // 📱 SQLite
  DATABASE_NAME: 'sorteioja.db',
  DATABASE_VERSION: 1,
  
  // 🗂️ Tabelas
  TABLES: {
    LISTS: 'lists',
    PARTICIPANTS: 'participants',
    DRAWS: 'draws',
    HISTORY: 'history',
    GAMIFICATION: 'gamification',
    SETTINGS: 'settings',
  },
  
  // 📊 Limites
  MAX_BACKUP_SIZE: 10 * 1024 * 1024, // 10MB
  AUTO_CLEANUP_DAYS: 365,
  
  // 🔄 Backup
  BACKUP_INTERVAL_HOURS: 24,
  MAX_BACKUP_FILES: 5,
};

/**
 * 📺 Configurações de Anúncios
 */
export const ADS_CONFIG = {
  // 📱 AdMob
  ADMOB_APP_ID: 'ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy',
  
  // 🎯 IDs dos anúncios
  BANNER_AD_UNIT_ID: 'ca-app-pub-xxxxxxxxxxxxxxxx/zzzzzzzzzz',
  INTERSTITIAL_AD_UNIT_ID: 'ca-app-pub-xxxxxxxxxxxxxxxx/wwwwwwwwww',
  REWARDED_AD_UNIT_ID: 'ca-app-pub-xxxxxxxxxxxxxxxx/vvvvvvvvvv',
  
  // ⏱️ Configurações de frequência
  INTERSTITIAL_FREQUENCY: 0.3, // 30% de chance
  REWARDED_FREQUENCY: 0.1, // 10% de chance
  
  // 🎮 Anúncios contextuais
  CONTEXTUAL_ADS: {
    AFTER_DRAW: 0.3,
    ON_HISTORY_OPEN: 0.2,
    ON_SHARE: 0.15,
    ON_SETTINGS_OPEN: 0.1,
  },
  
  // 👑 Configurações premium
  PREMIUM_FEATURES: [
    'no_ads',
    'unlimited_lists',
    'advanced_algorithms',
    'priority_support',
    'custom_themes',
  ],
};

/**
 * 🔔 Configurações de Notificações
 */
export const NOTIFICATION_CONFIG = {
  // 📱 Push notifications
  PUSH_ENABLED: true,
  PUSH_TOKEN_KEY: '@SorteioJa:pushToken',
  
  // 🔔 Notificações locais
  LOCAL_NOTIFICATIONS: {
    DAILY_REMINDER: 'daily_reminder',
    ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
    LEVEL_UP: 'level_up',
    STREAK_MAINTENANCE: 'streak_maintenance',
  },
  
  // ⏰ Agendamento
  SCHEDULE: {
    DAILY_REMINDER_HOUR: 20, // 20:00
    STREAK_REMINDER_HOUR: 22, // 22:00
  },
  
  // 📊 Configurações de frequência
  MAX_DAILY_NOTIFICATIONS: 3,
  MIN_INTERVAL_BETWEEN_NOTIFICATIONS: 4 * 60 * 60 * 1000, // 4 horas
};

/**
 * 🌐 Configurações de API
 */
export const API_CONFIG = {
  // 🔗 URLs base
  BASE_URL: 'https://api.sorteioja.com',
  VERIFICATION_URL: 'https://verify.sorteioja.com',
  
  // ⏱️ Timeouts
  REQUEST_TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // 🔐 Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'User-Agent': 'SorteioJa/1.0.0',
  },
  
  // 📊 Rate limiting
  RATE_LIMIT: {
    REQUESTS_PER_MINUTE: 60,
    REQUESTS_PER_HOUR: 1000,
  },
};

/**
 * 🎨 Configurações de Tema
 */
export const THEME_CONFIG = {
  // 🌙 Modos disponíveis
  MODES: {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto',
  },
  
  // 🎨 Cores padrão
  DEFAULT_COLORS: {
    PRIMARY: '#007AFF',
    SECONDARY: '#5856D6',
    SUCCESS: '#34C759',
    WARNING: '#FF9500',
    ERROR: '#FF3B30',
    INFO: '#5AC8FA',
  },
  
  // 📱 Breakpoints
  BREAKPOINTS: {
    SMALL: 375,
    MEDIUM: 768,
    LARGE: 1024,
    XLARGE: 1200,
  },
  
  // 🔄 Animações
  ANIMATIONS: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
    BOUNCE: 600,
  },
};

/**
 * 📱 Configurações de Dispositivo
 */
export const DEVICE_CONFIG = {
  // 📱 Plataformas
  PLATFORMS: {
    IOS: 'ios',
    ANDROID: 'android',
    WEB: 'web',
  },
  
  // 📏 Tamanhos de tela
  SCREEN_SIZES: {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
    XLARGE: 'xlarge',
  },
  
  // 🔄 Orientação
  ORIENTATIONS: {
    PORTRAIT: 'portrait',
    LANDSCAPE: 'landscape',
  },
  
  // 📱 Recursos disponíveis
  CAPABILITIES: {
    HAPTIC_FEEDBACK: 'haptic_feedback',
    BIOMETRIC_AUTH: 'biometric_auth',
    CAMERA: 'camera',
    LOCATION: 'location',
    NOTIFICATIONS: 'notifications',
  },
};

/**
 * 🚀 Configurações de Performance
 */
export const PERFORMANCE_CONFIG = {
  // ⚡ Debounce
  DEBOUNCE: {
    SEARCH: 300,
    INPUT: 500,
    SCROLL: 100,
    RESIZE: 250,
  },
  
  // 🔄 Throttle
  THROTTLE: {
    SCROLL: 16, // 60fps
    RESIZE: 100,
    NETWORK: 1000,
  },
  
  // 📊 Cache
  CACHE: {
    LISTS_TTL: 5 * 60 * 1000, // 5 minutos
    HISTORY_TTL: 30 * 60 * 1000, // 30 minutos
    SETTINGS_TTL: 24 * 60 * 60 * 1000, // 24 horas
    MAX_CACHE_SIZE: 50 * 1024 * 1024, // 50MB
  },
  
  // 🧹 Limpeza automática
  CLEANUP: {
    INTERVAL: 24 * 60 * 60 * 1000, // 24 horas
    MAX_OLD_RECORDS: 1000,
    MAX_OLD_FILES: 100,
  },
};

/**
 * 🔒 Configurações de Privacidade
 */
export const PRIVACY_CONFIG = {
  // 📊 Dados coletados
  DATA_COLLECTION: {
    ANALYTICS: true,
    CRASH_REPORTS: true,
    USAGE_STATS: true,
    PERSONAL_INFO: false,
  },
  
  // 🗑️ Retenção de dados
  DATA_RETENTION: {
    HISTORY_DAYS: 365,
    LOGS_DAYS: 30,
    CACHE_DAYS: 7,
    BACKUP_DAYS: 90,
  },
  
  // 🔐 Criptografia
  ENCRYPTION: {
    ALGORITHM: 'AES-256-GCM',
    KEY_DERIVATION: 'PBKDF2',
    ITERATIONS: 100000,
  },
  
  // 🌐 Compartilhamento
  SHARING: {
    ALLOW_EXTERNAL: true,
    ALLOW_SOCIAL_MEDIA: true,
    ALLOW_EMAIL: true,
    ALLOW_SMS: false,
  },
};

/**
 * 📊 Configurações de Analytics
 */
export const ANALYTICS_CONFIG = {
  // 📈 Eventos rastreados
  EVENTS: {
    APP_OPEN: 'app_open',
    DRAW_COMPLETED: 'draw_completed',
    LIST_CREATED: 'list_created',
    SHARE_ACTION: 'share_action',
    VERIFICATION: 'verification',
    ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
    LEVEL_UP: 'level_up',
    PREMIUM_ACTIVATED: 'premium_activated',
  },
  
  // 🎯 Propriedades dos eventos
  EVENT_PROPERTIES: {
    DRAW_TYPE: 'draw_type',
    LIST_SIZE: 'list_size',
    SHARE_PLATFORM: 'share_platform',
    VERIFICATION_RESULT: 'verification_result',
    ACHIEVEMENT_ID: 'achievement_id',
    NEW_LEVEL: 'new_level',
    PREMIUM_PLAN: 'premium_plan',
  },
  
  // 📊 Métricas de performance
  PERFORMANCE_METRICS: {
    APP_LAUNCH_TIME: 'app_launch_time',
    DRAW_PROCESSING_TIME: 'draw_processing_time',
    DATABASE_QUERY_TIME: 'database_query_time',
    NETWORK_REQUEST_TIME: 'network_request_time',
  },
};

/**
 * 🧪 Configurações de Desenvolvimento
 */
export const DEV_CONFIG = {
  // 🚫 Logs ignorados
  IGNORED_LOGS: [
    'Non-serializable values were found in the navigation state',
    'Require cycle:',
    'Remote debugger',
    'AsyncStorage has been extracted',
  ],
  
  // 🔍 Debug
  DEBUG: {
    ENABLED: __DEV__,
    LOG_LEVEL: __DEV__ ? 'debug' : 'error',
    SHOW_PERFORMANCE: __DEV__,
    SHOW_NETWORK_LOGS: __DEV__,
  },
  
  // 🧪 Testes
  TESTING: {
    ENABLED: __DEV__,
    MOCK_DATA: __DEV__,
    SLOW_ANIMATIONS: __DEV__,
    SHOW_LAYOUT_BORDERS: __DEV__,
  },
};

/**
 * 📋 Objeto principal de constantes
 * Agrupa todas as configurações para fácil acesso
 */
export const constants = {
  app: APP_CONFIG,
  gamification: GAMIFICATION_CONFIG,
  lottery: LOTTERY_CONFIG,
  ads: ADS_CONFIG,
  notifications: NOTIFICATION_CONFIG,
  api: API_CONFIG,
  theme: THEME_CONFIG,
  privacy: PRIVACY_CONFIG,
  analytics: ANALYTICS_CONFIG,
  dev: DEV_CONFIG,
};

// 📤 Exportação padrão
export default constants;
