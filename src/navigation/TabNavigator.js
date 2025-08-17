// TabNavigator.js
// 🧭 Navegação por abas do app Sorteio Já
// Organiza as principais funcionalidades em abas acessíveis

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// 🖥️ Telas
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';

// 🎨 Tema
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

/**
 * 🧭 Navegador de abas principal
 */
export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // 🎨 Estilo das abas
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          backgroundColor: colors.system.background,
          borderTopColor: colors.border.light,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
          elevation: 8,
          shadowColor: colors.shadow.primary,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        // 🎯 Ícones das abas
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'History':
              iconName = focused ? 'history' : 'history';
              break;
            case 'Settings':
              iconName = focused ? 'cog' : 'cog-outline';
              break;
            default:
              iconName = 'help-circle-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        // 🎨 Cabeçalho das telas
        headerStyle: {
          backgroundColor: colors.system.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        // 🚫 Desabilitar gestos de swipe
        gestureEnabled: false,
      })}
    >
      {/* 🏠 Tela Principal */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Sorteio Já',
          headerShown: false,
        }}
      />

      {/* 📚 Histórico */}
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'Histórico',
          headerShown: true,
        }}
      />

      {/* ⚙️ Configurações */}
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Configurações',
          headerShown: true,
        }}
      />
    </Tab.Navigator>
  );
}
