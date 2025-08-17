// src/screens/ResultScreen.js
// 🎊 Tela de Resultado do Sorteio - Sorteio Já
// Exibe resultados com animações, gamificação e opções de compartilhamento

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  Dimensions,
  Alert,
  Share,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 🎨 Componentes UI
import Button from '../components/ui/Button';
import { ResultCard, StatsCard } from '../components/ui/Card';

// 🎮 Hooks e serviços
import { useGamification } from '../hooks/useGamification';
import { database } from '../services/database';
import { formatProofForSharing, generateVerificationCode } from '../utils/crypto';

// 🎨 Sistema de design
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

// 📱 Dimensões da tela
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * 🎊 Componente ResultScreen
 * 
 * Funcionalidades:
 * - Exibir resultado com animações espetaculares
 * - Mostrar informações de verificação
 * - Compartilhamento social
 * - Feedback de gamificação
 * - Opções de novo sorteio
 */
const ResultScreen = ({ navigation, route }) => {
  // 🎯 Dados do sorteio
  const { lotteryData, lotteryId } = route.params || {};
  
  // 🎮 Estados
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  // 🎮 Gamificação
  const gamification = useGamification();

  // 🎬 Animações
  const confettiAnim = useRef(new Animated.Value(0)).current;
  const resultAnim = useRef(new Animated.Value(0)).current;
  const detailsAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // 🚀 Inicializar componente
  useEffect(() => {
    initializeResult();
  }, []);

  // 🚀 Carregar dados do resultado
  const initializeResult = async () => {
    try {
      let resultData = lotteryData;

      // Se foi passado ID, carregar do banco
      if (lotteryId && !lotteryData) {
        const lottery = await database.getLotteryById(lotteryId);
        if (lottery) {
          resultData = {
            type: lottery.type,
            result: lottery.result,
            proof: lottery.proof,
            timestamp: lottery.created_at,
            pointsEarned: lottery.points_earned,
          };
        }
      }

      if (!resultData) {
        Alert.alert('Erro', 'Resultado não encontrado');
        navigation.goBack();
        return;
      }

      setResult(resultData);
      startCelebrationAnimation();
      
    } catch (error) {
      console.error('Erro ao carregar resultado:', error);
      Alert.alert('Erro', 'Não foi possível carregar o resultado');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  // 🎊 Animação de celebração
  const startCelebrationAnimation = () => {
    // Sequência de animações
    Animated.sequence([
      // 1. Confete caindo
      Animated.timing(confettiAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // 2. Resultado aparecendo
      Animated.timing(resultAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulso contínuo no resultado
    const startPulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => startPulse());
    };

    setTimeout(startPulse, 1000);
  };

  // 👁️ Mostrar/ocultar detalhes
  const toggleDetails = () => {
    setShowDetails(!showDetails);
    
    Animated.timing(detailsAnim, {
      toValue: showDetails ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // 📤 Compartilhar resultado
  const shareResult = async () => {
    try {
      if (!result) return;

      const shareData = formatProofForSharing(result.proof);
      const winnerText = getWinnerText();
      
      const message = `🎉 Resultado do Sorteio!\n\n${winnerText}\n\n${shareData.text}`;

      if (Platform.OS === 'ios') {
        await Share.share({
          message: message,
          url: shareData.url,
        });
      } else {
        await Share.share({
          message: `${message}\n\n🔗 ${shareData.url}`,
        });
      }

      // Processar compartilhamento na gamificação
      await gamification.processShare();

    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      Alert.alert('Erro', 'Não foi possível compartilhar o resultado');
    }
  };

  // 🏆 Obter texto do vencedor
  const getWinnerText = () => {
    if (!result) return '';

    const { type, result: lotteryResult } = result;

    switch (type) {
      case 'names':
        const winners = lotteryResult.winners || [];
        if (winners.length === 1) {
          return `🏆 Vencedor: ${winners[0]}`;
        } else {
          return `🏆 Vencedores:\n${winners.map((w, i) => `${i + 1}. ${w}`).join('\n')}`;
        }

      case 'numbers':
        const numbers = lotteryResult.numbers || [];
        return `🔢 Números sorteados: ${numbers.join(', ')}`;

      case 'teams':
        const teams = lotteryResult.teams || [];
        return `⚽ Times formados:\n${teams.map(team => 
          `${team.name}: ${team.players.join(', ')}`
        ).join('\n')}`;

      case 'order':
        const order = lotteryResult.order || [];
        return `🔀 Ordem sorteada:\n${order.map(item => 
          `${item.position}. ${item.item}`
        ).slice(0, 5).join('\n')}${order.length > 5 ? '\n...' : ''}`;

      case 'bingo':
        const bingoNumbers = lotteryResult.numbers || [];
        return `🎰 Números do Bingo:\n${bingoNumbers.map(n => n.display).join(' - ')}`;

      default:
        return '🎉 Sorteio realizado!';
    }
  };

  // 🎯 Novo sorteio
  const newLottery = () => {
    navigation.popToTop();
  };

  // 🔍 Ver detalhes de verificação
  const viewVerification = () => {
    navigation.navigate('Verify', { proof: result.proof });
  };

  // 🎨 Renderizar confete animado
  const renderConfetti = () => {
    const confettiPieces = Array.from({ length: 50 }, (_, i) => (
      <Animated.View
        key={i}
        style={[
          styles.confettiPiece,
          {
            left: Math.random() * screenWidth,
            backgroundColor: colors.gradients.celebration[Math.floor(Math.random() * 3)],
            transform: [
              {
                translateY: confettiAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-100, screenHeight + 100],
                }),
              },
              {
                rotate: confettiAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '720deg'],
                }),
              },
            ],
            opacity: confettiAnim.interpolate({
              inputRange: [0, 0.8, 1],
              outputRange: [1, 1, 0],
            }),
          },
        ]}
      />
    ));

    return (
      <View style={styles.confettiContainer} pointerEvents="none">
        {confettiPieces}
      </View>
    );
  };

  // 🎨 Renderizar resultado principal
  const renderMainResult = () => {
    if (!result) return null;

    return (
      <Animated.View
        style={[
          styles.resultContainer,
          {
            opacity: resultAnim,
            transform: [
              {
                scale: Animated.multiply(resultAnim, pulseAnim),
              },
              {
                translateY: resultAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <ResultCard style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>
              {getResultTitle()}
            </Text>
            <Text style={styles.resultSubtitle}>
              {new Date(result.timestamp).toLocaleString('pt-BR')}
            </Text>
          </View>

          <View style={styles.resultContent}>
            <Text style={styles.winnerText}>
              {getWinnerText()}
            </Text>
          </View>

          {result.pointsEarned > 0 && (
            <View style={styles.pointsBadge}>
              <Text style={styles.pointsText}>
                +{result.pointsEarned} pontos! 🏆
              </Text>
            </View>
          )}
        </ResultCard>
      </Animated.View>
    );
  };

  // 📊 Renderizar estatísticas
  const renderStats = () => {
    if (!result) return null;

    const verificationCode = generateVerificationCode(result.proof);

    return (
      <Animated.View
        style={[
          styles.statsContainer,
          {
            opacity: resultAnim,
            transform: [
              {
                translateY: resultAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.statsGrid}>
          <StatsCard style={styles.statCard}>
            <Text style={styles.statTitle}>Tipo</Text>
            <Text style={styles.statValue}>{getResultTitle()}</Text>
          </StatsCard>

          <StatsCard style={styles.statCard}>
            <Text style={styles.statTitle}>Código</Text>
            <Text style={styles.statValue}>{verificationCode}</Text>
          </StatsCard>

          <StatsCard style={styles.statCard}>
            <Text style={styles.statTitle}>Algoritmo</Text>
            <Text style={styles.statValue}>v1.0</Text>
          </StatsCard>

          <StatsCard style={styles.statCard}>
            <Text style={styles.statTitle}>Status</Text>
            <Text style={[styles.statValue, { color: colors.success[600] }]}>
              ✅ Verificável
            </Text>
          </StatsCard>
        </View>
      </Animated.View>
    );
  };

  // 🎯 Obter título do resultado
  const getResultTitle = () => {
    const titles = {
      names: 'Sorteio de Nomes',
      numbers: 'Sorteio de Números',
      teams: 'Formação de Times',
      order: 'Ordem Aleatória',
      bingo: 'Bingo',
    };
    return titles[result.type] || 'Sorteio';
  };

  // ⏳ Tela de loading
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingEmoji}>🎲</Text>
          <Text style={styles.loadingText}>Carregando resultado...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 🎊 Confete animado */}
      {renderConfetti()}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 🏆 Resultado principal */}
        {renderMainResult()}

        {/* 📊 Estatísticas */}
        {renderStats()}

        {/* 🔍 Detalhes técnicos */}
        <Animated.View
          style={[
            styles.detailsSection,
            {
              opacity: resultAnim,
            },
          ]}
        >
          <Button
            title={showDetails ? "Ocultar Detalhes" : "Ver Detalhes Técnicos"}
            variant="ghost"
            onPress={toggleDetails}
            style={styles.detailsButton}
          />

          {showDetails && (
            <Animated.View
              style={[
                styles.detailsContent,
                {
                  opacity: detailsAnim,
                  transform: [
                    {
                      translateY: detailsAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.detailsText}>
                Este sorteio foi realizado usando algoritmos criptograficamente seguros 
                e pode ser verificado por qualquer pessoa usando o código de verificação.
              </Text>
              
              <Text style={styles.proofText}>
                📋 Proof: {JSON.stringify(result.proof, null, 2).substring(0, 200)}...
              </Text>
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>

      {/* 🎯 Botões de ação */}
      <Animated.View
        style={[
          styles.actionButtons,
          {
            opacity: resultAnim,
            transform: [
              {
                translateY: resultAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Button
          title="📤 Compartilhar"
          variant="outline"
          onPress={shareResult}
          style={styles.actionButton}
        />

        <Button
          title="🔍 Verificar"
          variant="secondary"
          onPress={viewVerification}
          style={styles.actionButton}
        />

        <Button
          title="🎲 Novo Sorteio"
          variant="primary"
          onPress={newLottery}
          style={styles.actionButton}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

// 🎨 Estilos do componente
const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.system.background,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingEmoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  
  loadingText: {
    ...typography.titleMedium,
    color: colors.neutral[600],
  },
  
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  
  confettiPiece: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  
  scrollView: {
    flex: 1,
    zIndex: 2,
  },
  
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing['6xl'],
  },
  
  resultContainer: {
    marginBottom: spacing['2xl'],
  },
  
  resultCard: {
    backgroundColor: colors.neutral[0],
  },
  
  resultHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  
  resultTitle: {
    ...typography.headlineMedium,
    color: colors.primary[700],
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  
  resultSubtitle: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
    textAlign: 'center',
  },
  
  resultContent: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  
  winnerText: {
    ...typography.celebration.winner,
    color: colors.neutral[900],
    textAlign: 'center',
    lineHeight: typography.celebration.winner.fontSize * 1.2,
  },
  
  pointsBadge: {
    backgroundColor: colors.gamification.points + '20',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: spacing.lg,
    alignSelf: 'center',
  },
  
  pointsText: {
    ...typography.titleSmall,
    color: colors.gamification.points,
    fontWeight: '600',
  },
  
  statsContainer: {
    marginBottom: spacing['2xl'],
  },
  
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  statCard: {
    width: (screenWidth - spacing.lg * 2 - spacing.md) / 2,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  
  statTitle: {
    ...typography.labelMedium,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
  },
  
  statValue: {
    ...typography.titleSmall,
    color: colors.neutral[800],
    textAlign: 'center',
  },
  
  detailsSection: {
    marginBottom: spacing.xl,
  },
  
  detailsButton: {
    alignSelf: 'center',
  },
  
  detailsContent: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.neutral[50],
    borderRadius: spacing.md,
  },
  
  detailsText: {
    ...typography.bodyMedium,
    color: colors.neutral[700],
    marginBottom: spacing.md,
    lineHeight: typography.bodyMedium.fontSize * 1.4,
  },
  
  proofText: {
    ...typography.bodySmall,
    color: colors.neutral[500],
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.system.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.system.outline,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 3,
  },
  
  actionButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
};

export default ResultScreen;