// App.js
// 📱 Entrada principal do app Sorteio Já
// Configuração do navegador e inicialização dos serviços

import React, { useEffect } from 'react';
import { StatusBar, LogBox, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// 🧭 Navegação
import AppNavigator from './src/navigation/AppNavigator';

// 🎮 Serviços
import { database } from './src/services/database';
import { ads } from './src/services/ads';
import { notifications } from './src/services/notifications';
import { sharing } from './src/services/sharing';

// 🎨 Sistema de design
import { colors } from './src/theme/colors';

// 🚫 Ignorar warnings específicos do desenvolvimento
if (__DEV__) {
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    'Require cycle:', // Warnings de ciclos de importação
    'Remote debugger', // Warnings do remote debugger
  ]);
}

/**
 * 📱 Componente principal do app
 */
export default function App() {
  // 🚀 Inicialização dos serviços
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('🚀 Inicializando Sorteio Já...');
      
      // Inicializar banco de dados
      await database.init();
      console.log('✅ Database inicializado');
      
      // Inicializar serviço de anúncios
      await ads.init();
      console.log('✅ Serviço de anúncios inicializado');
      
      // Inicializar serviço de notificações
      await notifications.init();
      console.log('✅ Serviço de notificações inicializado');
      
      // Inicializar serviço de compartilhamento
      console.log('✅ Serviço de compartilhamento inicializado');
      
      // Fazer limpeza automática se necessário
      await database.cleanup();
      console.log('🧹 Limpeza automática concluída');
      
      console.log('🎉 App inicializado com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro na inicialização:', error);
    }
  };

  return (
    <SafeAreaProvider>
      {/* 📱 Configuração da status bar */}
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'dark-content'}
        backgroundColor={colors.system.background}
        translucent={Platform.OS === 'android'}
      />
      
      {/* 🧭 Navegação principal */}
      <AppNavigator />
    </SafeAreaProvider>
  );
}