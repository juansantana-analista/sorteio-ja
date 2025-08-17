// src/navigation/AppNavigator.js
// 🧭 Sistema de Navegação Principal - Sorteio Já
// Gerencia todas as rotas e transições do app

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, View, Text } from 'react-native';

// 🏠 Telas principais
import HomeScreen from '../screens/HomeScreen';
import ListEditorScreen from '../screens/ListEditorScreen';
import ResultScreen from '../screens/ResultScreen';
import HistoryScreen from '../screens/HistoryScreen';
import VerifyScreen from '../screens/VerifyScreen';
import SettingsScreen from '../screens/SettingsScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import AchievementsScreen from '../screens/AchievementsScreen';
import NumberLotteryScreen from '../screens/NumberLotteryScreen';
import BingoScreen from '../screens/BingoScreen';

// 🎨 Sistema de design
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

// 🎮 Hooks
import { useGamification } from '../hooks/useGamification';
import { database } from '../services/database';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * 🏠 Tab Navigator - Navegação inferior principal
 */
const TabNavigator = () => {
  const { stats } = useGamification();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconText = '';
          
          switch (route.name) {
            case 'Home':
              iconText = '🎲';
              break;
            case 'History':
              iconText = '📋';
              break;
            case 'Achievements':
              iconText = '🏆';
              break;
            case 'Settings':
              iconText = '⚙️';
              break;
            default:
              iconText = '📱';
          }
          
          return (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: spacing.xs,
            }}>
              <Text style={{
                fontSize: size,
                color: color,
              }}>
                {iconText}
              </Text>
            </View>
          );
        },
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.neutral[400],
        tabBarStyle: {
          backgroundColor: colors.system.background,
          borderTopColor: colors.system.outline,
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? spacing.lg : spacing.md,
          paddingTop: spacing.sm,
          height: Platform.OS === 'ios' ? 88 : 65,
        },
        tabBarLabelStyle: {
          ...typography.labelSmall,
          marginTop: spacing.xs,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Início',
        }}
      />
      
      <Tab.Screen 
        name="History" 
        component={HistoryScreen}
        options={{
          title: 'Histórico',
          tabBarBadge: stats?.totalDraws > 0 ? (stats.totalDraws > 99 ? '99+' : stats.totalDraws) : undefined,
        }}
      />
      
      <Tab.Screen 
        name="Achievements" 
        component={AchievementsScreen}
        options={{
          title: 'Conquistas',
          tabBarBadge: stats?.unlockedAchievements?.length > 0 ? stats.unlockedAchievements.length : undefined,
        }}
      />
      
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: 'Configurações',
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * 🧭 Main Navigator - Navegação principal com stack
 */
const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.system.background,
          borderBottomColor: colors.system.outline,
          borderBottomWidth: 1,
        },
        headerTintColor: colors.neutral[800],
        headerTitleStyle: {
          ...typography.titleLarge,
          fontWeight: '600',
        },
        headerBackTitle: '',
        animation: Platform.OS === 'ios' ? 'slide_from_right' : 'slide_from_bottom',
        gestureEnabled: true,
      }}
    >
      {/* 📱 Tela principal com tabs */}
      <Stack.Screen 
        name="MainTabs" 
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      
      {/* 📝 Editor de listas */}
      <Stack.Screen 
        name="ListEditor" 
        component={ListEditorScreen}
        options={({ route }) => ({
          title: route.params?.mode === 'edit' ? 'Editar Lista' : 'Nova Lista',
          headerStyle: {
            backgroundColor: colors.primary[50],
          },
        })}
      />
      
      {/* 🎊 Tela de resultado */}
      <Stack.Screen 
        name="Result" 
        component={ResultScreen}
        options={{
          title: 'Resultado',
          headerStyle: {
            backgroundColor: colors.success[50],
          },
          gestureEnabled: false, // Não permitir voltar por gesto na tela de resultado
        }}
      />
      
      {/* 🔍 Tela de verificação */}
      <Stack.Screen 
        name="Verify" 
        component={VerifyScreen}
        options={{
          title: 'Verificar Sorteio',
          headerStyle: {
            backgroundColor: colors.neutral[50],
          },
        }}
      />
      
      {/* 🔢 Sorteio de números */}
      <Stack.Screen 
        name="NumberLottery" 
        component={NumberLotteryScreen}
        options={{
          title: 'Sorteio de Números',
          headerStyle: {
            backgroundColor: colors.success[50],
          },
        }}
      />
      
      {/* 🎰 Bingo */}
      <Stack.Screen 
        name="BingoScreen" 
        component={BingoScreen}
        options={{
          title: 'Bingo',
          headerStyle: {
            backgroundColor: colors.special.gold + '20',
          },
        }}
      />
    </Stack.Navigator>
  );
};

/**
 * 🚀 App Navigator Principal - Gerencia onboarding e navegação
 */
const AppNavigator = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🚀 Verificar se é o primeiro lançamento
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        await database.init();
        
        const hasSeenOnboarding = await database.getSetting('hasSeenOnboarding', false);
        setIsFirstLaunch(!hasSeenOnboarding);
        
      } catch (error) {
        console.error('Erro ao verificar primeiro lançamento:', error);
        setIsFirstLaunch(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkFirstLaunch();
  }, []);

  // 🔄 Função para completar onboarding
  const completeOnboarding = async () => {
    await database.setSetting('hasSeenOnboarding', true);
    setIsFirstLaunch(false);
  };

  // ⏳ Tela de loading
  if (isLoading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.system.background,
      }}>
        <Text style={{
          fontSize: 48,
          marginBottom: spacing.lg,
        }}>
          🎲
        </Text>
        <Text style={{
          ...typography.titleLarge,
          color: colors.neutral[600],
        }}>
          Carregando...
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: colors.primary[500],
          background: colors.system.background,
          card: colors.system.surface,
          text: colors.neutral[800],
          border: colors.system.outline,
          notification: colors.error[500],
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstLaunch ? (
          /* 🎯 Onboarding para novos usuários */
          <Stack.Screen name="Onboarding">
            {(props) => (
              <OnboardingScreen 
                {...props} 
                onComplete={completeOnboarding}
              />
            )}
          </Stack.Screen>
        ) : (
          /* 🏠 App principal */
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

/**
 * 🔗 Sistema de Deep Links
 * Para compartilhamento e verificação externa
 */
export const handleDeepLink = (url, navigation) => {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const params = Object.fromEntries(urlObj.searchParams);

    switch (path) {
      case '/verify':
        if (params.code || params.proof) {
          navigation.navigate('Verify', { 
            code: params.code,
            proof: params.proof ? JSON.parse(decodeURIComponent(params.proof)) : null
          });
        }
        break;
        
      case '/result':
        if (params.id) {
          navigation.navigate('Result', { lotteryId: params.id });
        }
        break;
        
      default:
        navigation.navigate('MainTabs');
    }
  } catch (error) {
    console.error('Erro ao processar deep link:', error);
    navigation.navigate('MainTabs');
  }
};

/**
 * 🎯 Hook para obter navegação atual
 */
export const useAppNavigation = () => {
  const navigation = useNavigation();
  
  return {
    // 🏠 Ir para home
    goHome: () => navigation.navigate('MainTabs', { screen: 'Home' }),
    
    // 📝 Criar nova lista
    createList: (type = 'names') => navigation.navigate('ListEditor', { type, mode: 'create' }),
    
    // ✏️ Editar lista
    editList: (listId) => navigation.navigate('ListEditor', { listId, mode: 'edit' }),
    
    // 🎊 Mostrar resultado
    showResult: (lotteryData) => navigation.navigate('Result', { lotteryData }),
    
    // 🔍 Verificar sorteio
    verifyLottery: (code, proof) => navigation.navigate('Verify', { code, proof }),
    
    // 📋 Ver histórico
    viewHistory: () => navigation.navigate('MainTabs', { screen: 'History' }),
    
    // 🏆 Ver conquistas
    viewAchievements: () => navigation.navigate('MainTabs', { screen: 'Achievements' }),
    
    // ⚙️ Abrir configurações
    openSettings: () => navigation.navigate('MainTabs', { screen: 'Settings' }),
    
    // 🔢 Sorteio de números
    numberLottery: () => navigation.navigate('NumberLottery'),
    
    // 🎰 Bingo
    bingo: () => navigation.navigate('BingoScreen'),
    
    // ⬅️ Voltar
    goBack: () => navigation.goBack(),
    
    // 🔄 Resetar para home
    resetToHome: () => navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    }),
  };
};

export default AppNavigator;