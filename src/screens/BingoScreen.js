import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useGamification } from '../hooks/useGamification';
import { useSound } from '../hooks/useSound';
import { useAds } from '../hooks/useAds';
import { lottery } from '../services/lottery';
import { database } from '../services/database';
import { crypto } from '../utils/crypto';
import { helpers } from '../utils/helpers';

const { width, height } = Dimensions.get('window');

/**
 * 🎱 Tela de sorteio de Bingo
 * Permite sortear números de bingo com diferentes configurações
 */
export const BingoScreen = ({ navigation, route }) => {
  const { colors, typography, spacing, shadows } = useTheme();
  
  const [bingoType, setBingoType] = useState('75');
  const [customMax, setCustomMax] = useState(75);
  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawHistory, setDrawHistory] = useState([]);
  const [autoDraw, setAutoDraw] = useState(false);
  const [autoDrawSpeed, setAutoDrawSpeed] = useState(2000);
  const [showCalledNumbers, setShowCalledNumbers] = useState(true);

  const { addPoints, checkAchievements } = useGamification();
  const { playSound } = useSound();
  const { showInterstitialAd } = useAds();

  const drawAnimation = useRef(new Animated.Value(0)).current;
  const numberAnimation = useRef(new Animated.Value(0)).current;
  const autoDrawInterval = useRef(null);

  const bingoTypes = {
    '75': { name: 'Bingo 75', max: 75, description: 'Bingo tradicional americano' },
    '90': { name: 'Bingo 90', max: 90, description: 'Bingo europeu' },
    '80': { name: 'Bingo 80', max: 80, description: 'Bingo italiano' },
    'custom': { name: 'Personalizado', max: customMax, description: 'Configure seu próprio bingo' },
  };

  useEffect(() => {
    loadDrawHistory();
    return () => {
      if (autoDrawInterval.current) {
        clearInterval(autoDrawInterval.current);
      }
    };
  }, []);

  const loadDrawHistory = async () => {
    try {
      const history = await database.getDrawHistory('bingo');
      setDrawHistory(history.slice(0, 10)); // Últimos 10 sorteios
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  const handleBingoTypeSelect = (type) => {
    setBingoType(type);
    if (type !== 'custom') {
      setCustomMax(bingoTypes[type].max);
    }
    setDrawnNumbers([]);
  };

  const validateBingoConfig = () => {
    if (customMax < 1) {
      Alert.alert('Erro', 'O número máximo deve ser pelo menos 1');
      return false;
    }
    return true;
  };

  const drawNumber = async () => {
    if (!validateBingoConfig()) return;

    const maxNumber = bingoType === 'custom' ? customMax : bingoTypes[bingoType].max;
    
    if (drawnNumbers.length >= maxNumber) {
      Alert.alert('Bingo!', 'Todos os números foram sorteados!');
      return;
    }

    setIsDrawing(true);
    playSound('draw');

    // Animação de sorteio
    Animated.sequence([
      Animated.timing(drawAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(numberAnimation, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      // Simular tempo de sorteio
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Realizar sorteio
      const availableNumbers = [];
      for (let i = 1; i <= maxNumber; i++) {
        if (!drawnNumbers.includes(i)) {
          availableNumbers.push(i);
        }
      }

      const drawnNumber = lottery.drawNumbers({
        min: 1,
        max: availableNumbers.length,
        quantity: 1,
        allowRepeats: false,
        sort: false,
      })[0];

      const actualNumber = availableNumbers[drawnNumber - 1];
      const newDrawnNumbers = [...drawnNumbers, actualNumber];

      setDrawnNumbers(newDrawnNumbers);

      // Salvar no histórico se for o último número
      if (newDrawnNumbers.length === maxNumber) {
        const drawData = {
          id: helpers.generateId(),
          type: 'bingo',
          timestamp: Date.now(),
          config: { bingoType, customMax, maxNumber },
          results: newDrawnNumbers,
          hash: crypto.generateHash(JSON.stringify(newDrawnNumbers)),
        };

        await database.saveDrawResult(drawData);
        await loadDrawHistory();

        // Gamificação
        const points = Math.floor(maxNumber * 1.5);
        await addPoints(points, 'bingo_complete');
        await checkAchievements();

        // Mostrar anúncio
        showInterstitialAd();
      } else {
        // Pontos por número sorteado
        await addPoints(2, 'bingo_number');
      }

      // Reset animações
      setTimeout(() => {
        drawAnimation.setValue(0);
        numberAnimation.setValue(0);
      }, 1500);

    } catch (error) {
      console.error('Erro no sorteio:', error);
      Alert.alert('Erro', 'Falha ao realizar o sorteio');
    } finally {
      setIsDrawing(false);
    }
  };

  const startAutoDraw = () => {
    if (autoDrawInterval.current) {
      clearInterval(autoDrawInterval.current);
      setAutoDraw(false);
      return;
    }

    setAutoDraw(true);
    autoDrawInterval.current = setInterval(() => {
      if (drawnNumbers.length < (bingoType === 'custom' ? customMax : bingoTypes[bingoType].max)) {
        drawNumber();
      } else {
        stopAutoDraw();
      }
    }, autoDrawSpeed);
  };

  const stopAutoDraw = () => {
    if (autoDrawInterval.current) {
      clearInterval(autoDrawInterval.current);
      autoDrawInterval.current = null;
    }
    setAutoDraw(false);
  };

  const resetBingo = () => {
    setDrawnNumbers([]);
    stopAutoDraw();
  };

  const shareResults = () => {
    if (drawnNumbers.length === 0) return;

    const resultText = `🎱 Bingo realizado!\n\n` +
      `📊 Configuração:\n` +
      `• Tipo: ${bingoTypes[bingoType].name}\n` +
      `• Números máximos: ${bingoType === 'custom' ? customMax : bingoTypes[bingoType].max}\n` +
      `• Números sorteados: ${drawnNumbers.length}\n\n` +
      `🎯 Sequência: ${drawnNumbers.join(' - ')}\n\n` +
      `🔍 Hash de verificação: ${crypto.generateHash(JSON.stringify(drawnNumbers))}\n\n` +
      `📱 Sorteio Já - App de sorteios transparentes`;

    // Aqui você implementaria a lógica de compartilhamento
    console.log('Compartilhando:', resultText);
  };

  const getBingoCard = () => {
    const maxNumber = bingoType === 'custom' ? customMax : bingoTypes[bingoType].max;
    const card = [];
    
    for (let i = 1; i <= maxNumber; i++) {
      const isDrawn = drawnNumbers.includes(i);
      card.push({ number: i, drawn: isDrawn });
    }

    return card;
  };

  const getBingoTypeColor = (type) => {
    return bingoType === type ? colors.primary.main : colors.system.surface;
  };

  const getBingoProgress = () => {
    const maxNumber = bingoType === 'custom' ? customMax : bingoTypes[bingoType].max;
    return (drawnNumbers.length / maxNumber) * 100;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🎱 Bingo</Text>
          <Text style={styles.subtitle}>
            Sorteie números para seu jogo de bingo
          </Text>
        </View>

        {/* Tipos de Bingo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Tipos de Bingo</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.bingoTypesContainer}
          >
            {Object.entries(bingoTypes).map(([key, type]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.bingoTypeButton,
                  { backgroundColor: getBingoTypeColor(key) }
                ]}
                onPress={() => handleBingoTypeSelect(key)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.bingoTypeName,
                  { color: bingoType === key ? colors.common.white : colors.text.primary }
                ]}>
                  {type.name}
                </Text>
                <Text style={[
                  styles.bingoTypeDescription,
                  { color: bingoType === key ? colors.common.white : colors.text.secondary }
                ]}>
                  {type.description}
                </Text>
                <Text style={[
                  styles.bingoTypeMax,
                  { color: bingoType === key ? colors.common.white : colors.text.secondary }
                ]}>
                  Máx: {type.max}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Configuração personalizada */}
        {bingoType === 'custom' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚙️ Configuração Personalizada</Text>
            <View style={styles.customConfig}>
              <Text style={styles.configLabel}>Número Máximo</Text>
              <TextInput
                style={styles.configInput}
                value={customMax.toString()}
                onChangeText={(text) => setCustomMax(parseInt(text) || 75)}
                keyboardType="numeric"
                placeholder="75"
              />
            </View>
          </View>
        )}

        {/* Progresso */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Progresso do Bingo</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${getBingoProgress()}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {drawnNumbers.length} / {bingoType === 'custom' ? customMax : bingoTypes[bingoType].max} números
            </Text>
          </View>
        </View>

        {/* Controles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎮 Controles</Text>
          
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={[
                styles.drawButton,
                { backgroundColor: isDrawing ? colors.text.disabled : colors.primary.main }
              ]}
              onPress={drawNumber}
              disabled={isDrawing}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[
                  styles.drawButtonContent,
                  {
                    transform: [{ scale: drawAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.1],
                    }) }],
                  },
                ]}
              >
                <Text style={styles.drawButtonText}>
                  {isDrawing ? '🎲 Sorteando...' : '🎲 Sortear Número'}
                </Text>
              </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.autoDrawButton,
                { backgroundColor: autoDraw ? colors.warning.main : colors.info.main }
              ]}
              onPress={startAutoDraw}
              activeOpacity={0.8}
            >
              <Text style={styles.autoDrawButtonText}>
                {autoDraw ? '⏹️ Parar Auto' : '▶️ Auto Sorteio'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetBingo}
              activeOpacity={0.8}
            >
              <Text style={styles.resetButtonText}>🔄 Resetar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shareButton}
              onPress={shareResults}
              disabled={drawnNumbers.length === 0}
              activeOpacity={0.8}
            >
              <Text style={styles.shareButtonText}>📤 Compartilhar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Números Sorteados */}
        {drawnNumbers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Números Sorteados</Text>
            
            <Animated.View
              style={[
                styles.drawnNumbersContainer,
                {
                  opacity: numberAnimation,
                  transform: [{ scale: numberAnimation }],
                },
              ]}
            >
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.numbersScroll}
              >
                {drawnNumbers.map((number, index) => (
                  <View key={index} style={styles.drawnNumber}>
                    <Text style={styles.drawnNumberText}>{number}</Text>
                  </View>
                ))}
              </ScrollView>
            </Animated.View>
          </View>
        )}

        {/* Cartela de Bingo */}
        {showCalledNumbers && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Cartela de Bingo</Text>
            <View style={styles.bingoCard}>
              {getBingoCard().map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.bingoNumber,
                    { backgroundColor: item.drawn ? colors.success.main : colors.system.surface }
                  ]}
                  onPress={() => {
                    if (item.drawn) {
                      const newDrawn = drawnNumbers.filter(n => n !== item.number);
                      setDrawnNumbers(newDrawn);
                    } else {
                      setDrawnNumbers([...drawnNumbers, item.number]);
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.bingoNumberText,
                    { color: item.drawn ? colors.common.white : colors.text.primary }
                  ]}>
                    {item.number}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Histórico */}
        {drawHistory.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📚 Histórico Recente</Text>
            
            {drawHistory.map((draw, index) => (
              <TouchableOpacity
                key={draw.id}
                style={styles.historyItem}
                onPress={() => {
                  setDrawnNumbers(draw.results);
                  setBingoType(draw.config.bingoType);
                  if (draw.config.bingoType === 'custom') {
                    setCustomMax(draw.config.customMax);
                  }
                }}
                activeOpacity={0.8}
              >
                <View style={styles.historyHeader}>
                  <Text style={styles.historyDate}>
                    {helpers.formatDate(draw.timestamp)}
                  </Text>
                  <Text style={styles.historyType}>
                    Bingo {draw.config.bingoType === 'custom' ? draw.config.customMax : draw.config.maxNumber}
                  </Text>
                </View>
                
                <View style={styles.historyNumbers}>
                  <Text style={styles.historyCount}>
                    {draw.results.length} números sorteados
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.system.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.primary.main,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.common.white,
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.bold,
  },
  subtitle: {
    fontSize: 16,
    color: colors.common.white,
    opacity: 0.9,
    textAlign: 'center',
    fontFamily: typography.fontFamily.medium,
  },
  section: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily.semiBold,
  },
  bingoTypesContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  bingoTypeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    marginRight: spacing.sm,
    minWidth: 120,
    alignItems: 'center',
    ...shadows.small,
  },
  bingoTypeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.semiBold,
  },
  bingoTypeDescription: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.medium,
  },
  bingoTypeMax: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: typography.fontFamily.medium,
  },
  customConfig: {
    alignItems: 'center',
  },
  configLabel: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    fontFamily: typography.fontFamily.medium,
  },
  configInput: {
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    padding: spacing.sm,
    fontSize: 18,
    backgroundColor: colors.system.surface,
    color: colors.text.primary,
    textAlign: 'center',
    width: 100,
    fontFamily: typography.fontFamily.medium,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 20,
    backgroundColor: colors.system.surface,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success.main,
    borderRadius: 10,
  },
  progressText: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '600',
    fontFamily: typography.fontFamily.semiBold,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  drawButton: {
    flex: 2,
    paddingVertical: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: spacing.sm,
    ...shadows.medium,
  },
  autoDrawButton: {
    flex: 1,
    paddingVertical: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    ...shadows.medium,
  },
  drawButtonContent: {
    alignItems: 'center',
  },
  drawButtonText: {
    color: colors.common.white,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: typography.fontFamily.bold,
  },
  autoDrawButtonText: {
    color: colors.common.white,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: typography.fontFamily.semiBold,
  },
  resetButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.system.surface,
    marginRight: spacing.sm,
  },
  resetButtonText: {
    color: colors.text.secondary,
    fontSize: 16,
    fontFamily: typography.fontFamily.medium,
  },
  shareButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.success.main,
  },
  shareButtonText: {
    color: colors.common.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: typography.fontFamily.semiBold,
  },
  drawnNumbersContainer: {
    alignItems: 'center',
  },
  numbersScroll: {
    maxHeight: 80,
  },
  drawnNumber: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    margin: spacing.xs,
    ...shadows.small,
  },
  drawnNumberText: {
    color: colors.common.white,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: typography.fontFamily.bold,
  },
  bingoCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  bingoNumber: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  bingoNumberText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: typography.fontFamily.semiBold,
  },
  historyItem: {
    backgroundColor: colors.system.surface,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  historyDate: {
    fontSize: 14,
    color: colors.text.secondary,
    fontFamily: typography.fontFamily.medium,
  },
  historyType: {
    fontSize: 14,
    color: colors.primary.main,
    fontWeight: '600',
    fontFamily: typography.fontFamily.semiBold,
  },
  historyNumbers: {
    alignItems: 'center',
  },
  historyCount: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
    fontFamily: typography.fontFamily.medium,
  },
});

export default BingoScreen;
