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
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { shadows } from '../theme/shadows';
import { useGamification } from '../hooks/useGamification';
import { useSound } from '../hooks/useSound';
import { useAds } from '../hooks/useAds';
import { lottery } from '../services/lottery';
import { database } from '../services/database';
import { crypto } from '../utils/crypto';
import { helpers } from '../utils/helpers';

const { width, height } = Dimensions.get('window');

/**
 * 🎲 Tela de sorteio de números
 * Permite sortear números aleatórios com diferentes configurações
 */
export const NumberLotteryScreen = ({ navigation, route }) => {
  const [minNumber, setMinNumber] = useState(1);
  const [maxNumber, setMaxNumber] = useState(100);
  const [quantity, setQuantity] = useState(6);
  const [allowRepeats, setAllowRepeats] = useState(false);
  const [sortNumbers, setSortNumbers] = useState(true);
  const [customRange, setCustomRange] = useState(false);
  const [results, setResults] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawHistory, setDrawHistory] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState('custom');

  const { addPoints, checkAchievements } = useGamification();
  const { playSound } = useSound();
  const { showInterstitialAd } = useAds();

  const drawAnimation = useRef(new Animated.Value(0)).current;
  const numberAnimation = useRef(new Animated.Value(0)).current;

  const presets = {
    custom: { name: 'Personalizado', min: 1, max: 100, qty: 6 },
    mega: { name: 'Mega-Sena', min: 1, max: 60, qty: 6 },
    loto: { name: 'Lotofácil', min: 1, max: 25, qty: 15 },
    quina: { name: 'Quina', min: 1, max: 80, qty: 5 },
    lotomania: { name: 'Lotomania', min: 0, max: 99, qty: 20 },
    dupla: { name: 'Dupla Sena', min: 1, max: 50, qty: 6 },
    timemania: { name: 'Timemania', min: 1, max: 80, qty: 10 },
    federal: { name: 'Loteria Federal', min: 1, max: 99999, qty: 5 },
  };

  useEffect(() => {
    loadDrawHistory();
  }, []);

  const loadDrawHistory = async () => {
    try {
      const history = await database.getDrawHistory('number');
      setDrawHistory(history.slice(0, 10)); // Últimos 10 sorteios
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  const handlePresetSelect = (presetKey) => {
    const preset = presets[presetKey];
    setSelectedPreset(presetKey);
    setMinNumber(preset.min);
    setMaxNumber(preset.max);
    setQuantity(preset.qty);
    setCustomRange(presetKey === 'custom');
  };

  const validateInputs = () => {
    if (minNumber >= maxNumber) {
      Alert.alert('Erro', 'O número mínimo deve ser menor que o máximo');
      return false;
    }

    if (quantity < 1) {
      Alert.alert('Erro', 'A quantidade deve ser pelo menos 1');
      return false;
    }

    if (!allowRepeats && quantity > (maxNumber - minNumber + 1)) {
      Alert.alert('Erro', 'Quantidade muito alta para o intervalo sem repetições');
      return false;
    }

    return true;
  };

  const performDraw = async () => {
    if (!validateInputs()) return;

    setIsDrawing(true);
    playSound('draw');

    // Animação de sorteio
    Animated.sequence([
      Animated.timing(drawAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(numberAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      // Simular tempo de sorteio
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Realizar sorteio
      const drawnNumbers = lottery.drawNumbers({
        min: minNumber,
        max: maxNumber,
        quantity,
        allowRepeats,
        sort: sortNumbers,
      });

      setResults(drawnNumbers);

      // Salvar no histórico
      const drawData = {
        id: helpers.generateId(),
        type: 'number',
        timestamp: Date.now(),
        config: { minNumber, maxNumber, quantity, allowRepeats, sortNumbers },
        results: drawnNumbers,
        hash: crypto.generateHash(JSON.stringify(drawnNumbers)),
      };

      await database.saveDrawResult(drawData);
      await loadDrawHistory();

      // Gamificação
      const points = Math.floor(quantity * 2);
      await addPoints(points, 'number_draw');
      await checkAchievements();

      // Mostrar anúncio
      showInterstitialAd();

      // Reset animações
      setTimeout(() => {
        drawAnimation.setValue(0);
        numberAnimation.setValue(0);
      }, 2000);

    } catch (error) {
      console.error('Erro no sorteio:', error);
      Alert.alert('Erro', 'Falha ao realizar o sorteio');
    } finally {
      setIsDrawing(false);
    }
  };

  const resetForm = () => {
    setMinNumber(1);
    setMaxNumber(100);
    setQuantity(6);
    setAllowRepeats(false);
    setSortNumbers(true);
    setCustomRange(false);
    setSelectedPreset('custom');
    setResults([]);
  };

  const shareResults = () => {
    if (results.length === 0) return;

    const resultText = `🎲 Sorteio realizado!\n\n` +
      `📊 Configuração:\n` +
      `• Intervalo: ${minNumber} a ${maxNumber}\n` +
      `• Quantidade: ${quantity} números\n` +
      `• Repetições: ${allowRepeats ? 'Sim' : 'Não'}\n` +
      `• Ordenado: ${sortNumbers ? 'Sim' : 'Não'}\n\n` +
      `🎯 Resultado: ${results.join(' - ')}\n\n` +
      `🔍 Hash de verificação: ${crypto.generateHash(JSON.stringify(results))}\n\n` +
      `📱 Sorteio Já - App de sorteios transparentes`;

    // Aqui você implementaria a lógica de compartilhamento
    console.log('Compartilhando:', resultText);
  };

  const getPresetColor = (presetKey) => {
    return selectedPreset === presetKey ? colors.primary.main : colors.system.surface;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🎲 Sorteio de Números</Text>
          <Text style={styles.subtitle}>
            Configure e realize sorteios personalizados
          </Text>
        </View>

        {/* Presets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Presets Populares</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.presetsContainer}
          >
            {Object.entries(presets).map(([key, preset]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.presetButton,
                  { backgroundColor: getPresetColor(key) }
                ]}
                onPress={() => handlePresetSelect(key)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.presetName,
                  { color: selectedPreset === key ? colors.common.white : colors.text.primary }
                ]}>
                  {preset.name}
                </Text>
                <Text style={[
                  styles.presetDetails,
                  { color: selectedPreset === key ? colors.common.white : colors.text.secondary }
                ]}>
                  {preset.min}-{preset.max} ({preset.qty})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Configurações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Configurações</Text>
          
          <View style={styles.configRow}>
            <View style={styles.configItem}>
              <Text style={styles.configLabel}>Número Mínimo</Text>
              <TextInput
                style={styles.configInput}
                value={minNumber.toString()}
                onChangeText={(text) => setMinNumber(parseInt(text) || 1)}
                keyboardType="numeric"
                editable={customRange}
              />
            </View>
            
            <View style={styles.configItem}>
              <Text style={styles.configLabel}>Número Máximo</Text>
              <TextInput
                style={styles.configInput}
                value={maxNumber.toString()}
                onChangeText={(text) => setMaxNumber(parseInt(text) || 100)}
                keyboardType="numeric"
                editable={customRange}
              />
            </View>
          </View>

          <View style={styles.configRow}>
            <View style={styles.configItem}>
              <Text style={styles.configLabel}>Quantidade</Text>
              <TextInput
                style={styles.configInput}
                value={quantity.toString()}
                onChangeText={(text) => setQuantity(parseInt(text) || 1)}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.configItem}>
              <Text style={styles.configLabel}>Intervalo</Text>
              <Text style={styles.rangeText}>
                {maxNumber - minNumber + 1} números
              </Text>
            </View>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                { backgroundColor: allowRepeats ? colors.primary.main : colors.system.surface }
              ]}
              onPress={() => setAllowRepeats(!allowRepeats)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.optionText,
                { color: allowRepeats ? colors.common.white : colors.text.primary }
              ]}>
                🔄 Permitir Repetições
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                { backgroundColor: sortNumbers ? colors.primary.main : colors.system.surface }
              ]}
              onPress={() => setSortNumbers(!sortNumbers)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.optionText,
                { color: sortNumbers ? colors.common.white : colors.text.primary }
              ]}>
                📊 Ordenar Números
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Botão de Sorteio */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.drawButton,
              { backgroundColor: isDrawing ? colors.text.disabled : colors.primary.main }
            ]}
            onPress={performDraw}
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
                {isDrawing ? '🎲 Sorteando...' : '🎲 Realizar Sorteio'}
              </Text>
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetForm}
            activeOpacity={0.8}
          >
            <Text style={styles.resetButtonText}>🔄 Resetar</Text>
          </TouchableOpacity>
        </View>

        {/* Resultados */}
        {results.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Resultado do Sorteio</Text>
            
            <Animated.View
              style={[
                styles.resultsContainer,
                {
                  opacity: numberAnimation,
                  transform: [{ scale: numberAnimation }],
                },
              ]}
            >
              <View style={styles.resultsGrid}>
                {results.map((number, index) => (
                  <View key={index} style={styles.numberBall}>
                    <Text style={styles.numberText}>{number}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.resultsInfo}>
                <Text style={styles.resultsText}>
                  {results.join(' - ')}
                </Text>
                <Text style={styles.hashText}>
                  Hash: {crypto.generateHash(JSON.stringify(results))}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.shareButton}
                onPress={shareResults}
                activeOpacity={0.8}
              >
                <Text style={styles.shareButtonText}>📤 Compartilhar</Text>
              </TouchableOpacity>
            </Animated.View>
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
                  setResults(draw.results);
                  setMinNumber(draw.config.minNumber);
                  setMaxNumber(draw.config.maxNumber);
                  setQuantity(draw.config.quantity);
                  setAllowRepeats(draw.config.allowRepeats);
                  setSortNumbers(draw.config.sortNumbers);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.historyHeader}>
                  <Text style={styles.historyDate}>
                    {helpers.formatDate(draw.timestamp)}
                  </Text>
                  <Text style={styles.historyType}>Números</Text>
                </View>
                
                <View style={styles.historyNumbers}>
                  {draw.results.slice(0, 5).map((num, idx) => (
                    <View key={idx} style={styles.historyNumber}>
                      <Text style={styles.historyNumberText}>{num}</Text>
                    </View>
                  ))}
                  {draw.results.length > 5 && (
                    <Text style={styles.historyMore}>+{draw.results.length - 5}</Text>
                  )}
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
  presetsContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  presetButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    marginRight: spacing.sm,
    minWidth: 100,
    alignItems: 'center',
    ...shadows.small,
  },
  presetName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.semiBold,
  },
  presetDetails: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
  },
  configRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  configItem: {
    flex: 1,
    marginRight: spacing.md,
  },
  configLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.medium,
  },
  configInput: {
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    padding: spacing.sm,
    fontSize: 16,
    backgroundColor: colors.system.surface,
    color: colors.text.primary,
    fontFamily: typography.fontFamily.medium,
  },
  rangeText: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '600',
    textAlign: 'center',
    padding: spacing.sm,
    backgroundColor: colors.system.surface,
    borderRadius: 8,
    fontFamily: typography.fontFamily.semiBold,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  optionButton: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: typography.fontFamily.medium,
  },
  drawButton: {
    paddingVertical: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  drawButtonContent: {
    alignItems: 'center',
  },
  drawButtonText: {
    color: colors.common.white,
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: typography.fontFamily.bold,
  },
  resetButton: {
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.system.surface,
  },
  resetButtonText: {
    color: colors.text.secondary,
    fontSize: 16,
    fontFamily: typography.fontFamily.medium,
  },
  resultsContainer: {
    alignItems: 'center',
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  numberBall: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    margin: spacing.xs,
    ...shadows.small,
  },
  numberText: {
    color: colors.common.white,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: typography.fontFamily.bold,
  },
  resultsInfo: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  resultsText: {
    fontSize: 18,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.sm,
    fontFamily: typography.fontFamily.semiBold,
  },
  hashText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontFamily: typography.fontFamily.medium,
    textAlign: 'center',
  },
  shareButton: {
    backgroundColor: colors.success.main,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  shareButtonText: {
    color: colors.common.white,
    fontSize: 16,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
  historyNumberText: {
    color: colors.common.white,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: typography.fontFamily.bold,
  },
  historyMore: {
    fontSize: 12,
    color: colors.text.secondary,
    fontFamily: typography.fontFamily.medium,
  },
});

export default NumberLotteryScreen;
