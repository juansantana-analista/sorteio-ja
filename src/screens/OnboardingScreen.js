// OnboardingScreen.js
// 🎯 Tela de onboarding para novos usuários
// Apresenta as funcionalidades principais do app de forma interativa

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🎨 Tema
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

// 🧩 Componentes
import { Button } from '../components/ui/Button';

const { width, height } = Dimensions.get('window');

/**
 * 🎯 Tela de onboarding
 */
export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  // 📱 Dados das telas de onboarding
  const onboardingData = [
    {
      id: '1',
      icon: '🎲',
      title: 'Bem-vindo ao Sorteio Já!',
      subtitle: 'O app mais confiável para realizar sorteios justos e transparentes',
      description: 'Crie listas, adicione participantes e faça sorteios com total transparência e verificação.',
      color: colors.primary.main,
    },
    {
      id: '2',
      icon: '🔐',
      title: '100% Transparente',
      subtitle: 'Cada sorteio gera um hash único para verificação',
      description: 'Compartilhe o hash com os participantes para que possam verificar a autenticidade do resultado.',
      color: colors.success.main,
    },
    {
      id: '3',
      icon: '🎮',
      title: 'Gamificação Completa',
      subtitle: 'Ganhe pontos, suba de nível e desbloqueie conquistas',
      description: 'Mantenha-se motivado com nosso sistema de recompensas e acompanhe seu progresso.',
      color: colors.warning.main,
    },
    {
      id: '4',
      icon: '📱',
      title: 'Fácil de Usar',
      subtitle: 'Interface intuitiva e funcionalidades poderosas',
      description: 'Crie sorteios em segundos, compartilhe resultados e mantenha um histórico completo.',
      color: colors.info.main,
    },
  ];

  /**
   * 🔄 Avançar para próxima tela
   */
  const nextSlide = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }
  };

  /**
   * ⬅️ Voltar para tela anterior
   */
  const previousSlide = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current?.scrollToIndex({
        index: prevIndex,
        animated: true,
      });
    }
  };

  /**
   * 🚀 Finalizar onboarding
   */
  const finishOnboarding = async () => {
    try {
      await AsyncStorage.setItem('@SorteioJa:onboardingCompleted', 'true');
      navigation.replace('Main'); // Navegar para tela principal
    } catch (error) {
      console.error('❌ Erro ao salvar onboarding:', error);
      navigation.replace('Main');
    }
  };

  /**
   * 🎨 Renderizar item do onboarding
   */
  const renderOnboardingItem = ({ item, index }) => (
    <View style={[styles.slide, { width }]}>
      {/* 🎨 Ícone e título */}
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>

      {/* 📝 Conteúdo */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>

      {/* 🎯 Indicadores de progresso */}
      <View style={styles.indicatorsContainer}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentIndex === index && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
    </View>
  );

  /**
   * 🎨 Renderizar botões de navegação
   */
  const renderNavigationButtons = () => (
    <View style={styles.navigationContainer}>
      {/* ⬅️ Botão anterior */}
      {currentIndex > 0 && (
        <TouchableOpacity
          style={styles.navButton}
          onPress={previousSlide}
        >
          <Icon name="chevron-left" size={24} color={colors.text.secondary} />
          <Text style={styles.navButtonText}>Anterior</Text>
        </TouchableOpacity>
      )}

      {/* 🚀 Botão principal */}
      <View style={styles.mainButtonContainer}>
        {currentIndex === onboardingData.length - 1 ? (
          <Button
            title="Começar a Usar"
            onPress={finishOnboarding}
            style={styles.finishButton}
            icon="rocket-launch"
          />
        ) : (
          <Button
            title="Próximo"
            onPress={nextSlide}
            style={styles.nextButton}
            icon="chevron-right"
          />
        )}
      </View>

      {/* ➡️ Botão próximo (espaçador) */}
      {currentIndex === 0 && (
        <View style={styles.navButton} />
      )}
    </View>
  );

  /**
   * 🔄 Lidar com mudança de slide
   */
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.system.background} />
      
      {/* 📱 Lista de slides */}
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderOnboardingItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        scrollEnabled={false} // Desabilitar scroll manual
      />

      {/* 🧭 Botões de navegação */}
      {renderNavigationButtons()}

      {/* 🚪 Pular onboarding */}
      {currentIndex < onboardingData.length - 1 && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={finishOnboarding}
        >
          <Text style={styles.skipButtonText}>Pular</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.system.background,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  icon: {
    fontSize: 80,
    textAlign: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 32,
  },
  subtitle: {
    ...typography.h3,
    color: colors.primary.main,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  description: {
    ...typography.body1,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.md,
  },
  indicatorsContainer: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.border.light,
    marginHorizontal: spacing.xs,
  },
  activeIndicator: {
    backgroundColor: colors.primary.main,
    width: 24,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    minWidth: 80,
  },
  navButtonText: {
    ...typography.body2,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  mainButtonContainer: {
    flex: 1,
    alignItems: 'center',
  },
  nextButton: {
    minWidth: 140,
  },
  finishButton: {
    minWidth: 180,
    backgroundColor: colors.success.main,
  },
  skipButton: {
    position: 'absolute',
    top: spacing.xl * 2,
    right: spacing.xl,
    padding: spacing.sm,
  },
  skipButtonText: {
    ...typography.body2,
    color: colors.text.secondary,
    textDecorationLine: 'underline',
  },
});
