// VerifyScreen.js
// 🔍 Tela de verificação de sorteios
// Permite verificar a autenticidade através do hash de verificação

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// 🛠️ Serviços
import { database } from '../services/database';
import { crypto } from '../utils/crypto';

// 🎨 Tema
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

// 🧩 Componentes
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

/**
 * 🔍 Tela de verificação de sorteios
 */
export default function VerifyScreen({ navigation }) {
  const [hash, setHash] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  /**
   * 🔍 Verificar hash
   */
  const verifyHash = async () => {
    if (!hash.trim()) {
      Alert.alert('Erro', 'Por favor, insira um hash para verificar');
      return;
    }

    if (hash.length < 32) {
      Alert.alert('Erro', 'Hash inválido. Deve ter pelo menos 32 caracteres');
      return;
    }

    try {
      setIsVerifying(true);
      
      // Buscar no banco de dados
      const result = await database.verifyHash(hash.trim());
      
      if (result) {
        setVerificationResult({
          isValid: true,
          data: result,
          message: '✅ Sorteio verificado com sucesso!'
        });
      } else {
        setVerificationResult({
          isValid: false,
          data: null,
          message: '❌ Hash não encontrado no banco de dados'
        });
      }
    } catch (error) {
      console.error('❌ Erro na verificação:', error);
      setVerificationResult({
        isValid: false,
        data: null,
        message: '❌ Erro durante a verificação'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * 🔄 Limpar campos
   */
  const clearFields = () => {
    setHash('');
    setVerificationResult(null);
  };

  /**
   * 📤 Compartilhar resultado da verificação
   */
  const shareVerification = () => {
    if (!verificationResult?.data) return;

    const shareText = `🔍 Verificação de Sorteio\n` +
      `📝 Lista: ${verificationResult.data.listName}\n` +
      `🎯 Resultado: ${verificationResult.data.result}\n` +
      `📅 Data: ${new Date(verificationResult.data.date).toLocaleDateString('pt-BR')}\n` +
      `🔐 Hash: ${verificationResult.data.hash}\n` +
      `✅ Status: Verificado com sucesso\n` +
      `📱 App: Sorteio Já`;

    // Aqui você pode implementar o compartilhamento
    Alert.alert('Compartilhar', shareText);
  };

  /**
   * 🎨 Renderizar resultado da verificação
   */
  const renderVerificationResult = () => {
    if (!verificationResult) return null;

    const { isValid, data, message } = verificationResult;

    return (
      <Card style={[styles.resultCard, isValid ? styles.validResult : styles.invalidResult]}>
        <View style={styles.resultHeader}>
          <Icon 
            name={isValid ? 'check-circle' : 'close-circle'} 
            size={32} 
            color={isValid ? colors.success.main : colors.error.main} 
          />
          <Text style={[styles.resultMessage, { color: isValid ? colors.success.main : colors.error.main }]}>
            {message}
          </Text>
        </View>

        {isValid && data && (
          <View style={styles.resultDetails}>
            <View style={styles.detailRow}>
              <Icon name="format-list-bulleted" size={20} color={colors.text.secondary} />
              <Text style={styles.detailLabel}>Lista:</Text>
              <Text style={styles.detailValue}>{data.listName}</Text>
            </View>

            <View style={styles.detailRow}>
              <Icon name="target" size={20} color={colors.text.secondary} />
              <Text style={styles.detailLabel}>Resultado:</Text>
              <Text style={styles.detailValue}>{data.result}</Text>
            </View>

            <View style={styles.detailRow}>
              <Icon name="calendar" size={20} color={colors.text.secondary} />
              <Text style={styles.detailLabel}>Data:</Text>
              <Text style={styles.detailValue}>
                {new Date(data.date).toLocaleDateString('pt-BR')}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Icon name="clock" size={20} color={colors.text.secondary} />
              <Text style={styles.detailLabel}>Hora:</Text>
              <Text style={styles.detailValue}>
                {new Date(data.date).toLocaleTimeString('pt-BR')}
              </Text>
            </View>

            {data.participants && data.participants.length > 0 && (
              <View style={styles.detailRow}>
                <Icon name="account-group" size={20} color={colors.text.secondary} />
                <Text style={styles.detailLabel}>Participantes:</Text>
                <Text style={styles.detailValue}>{data.participants.length}</Text>
              </View>
            )}

            <View style={styles.hashContainer}>
              <Text style={styles.hashLabel}>Hash de Verificação:</Text>
              <Text style={styles.hashValue} selectable>
                {data.hash}
              </Text>
            </View>
          </View>
        )}

        {/* 🎛️ Botões de ação */}
        <View style={styles.resultActions}>
          {isValid && (
            <Button
              title="Compartilhar"
              onPress={shareVerification}
              style={styles.shareButton}
              icon="share-variant"
            />
          )}
          
          <Button
            title="Nova Verificação"
            onPress={clearFields}
            style={styles.newVerificationButton}
            icon="refresh"
          />
        </View>
      </Card>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 🔍 Cabeçalho */}
        <View style={styles.header}>
          <Icon name="shield-check" size={48} color={colors.primary.main} />
          <Text style={styles.headerTitle}>Verificar Sorteio</Text>
          <Text style={styles.headerSubtitle}>
            Digite o hash de verificação para confirmar a autenticidade
          </Text>
        </View>

        {/* 📝 Campo de entrada */}
        <Card style={styles.inputCard}>
          <Text style={styles.inputLabel}>Hash de Verificação</Text>
          <TextInput
            style={styles.hashInput}
            value={hash}
            onChangeText={setHash}
            placeholder="Cole ou digite o hash aqui..."
            placeholderTextColor={colors.text.tertiary}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
          />
          
          <View style={styles.inputActions}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearFields}
            >
              <Icon name="close" size={20} color={colors.text.secondary} />
              <Text style={styles.clearButtonText}>Limpar</Text>
            </TouchableOpacity>

            <Button
              title="Verificar"
              onPress={verifyHash}
              loading={isVerifying}
              disabled={!hash.trim() || isVerifying}
              style={styles.verifyButton}
              icon="magnify"
            />
          </View>
        </Card>

        {/* 📊 Resultado da verificação */}
        {renderVerificationResult()}

        {/* 💡 Dicas */}
        <Card style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Como usar:</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipNumber}>1</Text>
            <Text style={styles.tipText}>
              Cole o hash de verificação no campo acima
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipNumber}>2</Text>
            <Text style={styles.tipText}>
              Clique em "Verificar" para confirmar a autenticidade
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipNumber}>3</Text>
            <Text style={styles.tipText}>
              O resultado mostrará todos os detalhes do sorteio
            </Text>
          </View>
        </Card>

        {/* 📏 Espaçamento final */}
        <View style={styles.finalSpacing} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.system.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    padding: spacing.xl,
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  headerSubtitle: {
    ...typography.body2,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  inputCard: {
    margin: spacing.lg,
    marginTop: 0,
  },
  inputLabel: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  hashInput: {
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: spacing.sm,
    padding: spacing.md,
    fontSize: 16,
    fontFamily: 'monospace',
    color: colors.text.primary,
    backgroundColor: colors.system.surface,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
  },
  clearButtonText: {
    ...typography.body2,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  verifyButton: {
    minWidth: 120,
  },
  resultCard: {
    margin: spacing.lg,
    marginTop: 0,
  },
  validResult: {
    borderLeftWidth: 4,
    borderLeftColor: colors.success.main,
  },
  invalidResult: {
    borderLeftWidth: 4,
    borderLeftColor: colors.error.main,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  resultMessage: {
    ...typography.h3,
    marginLeft: spacing.md,
    flex: 1,
  },
  resultDetails: {
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  detailLabel: {
    ...typography.body2,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
    minWidth: 80,
  },
  detailValue: {
    ...typography.body1,
    color: colors.text.primary,
    flex: 1,
  },
  hashContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  hashLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  hashValue: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontFamily: 'monospace',
    backgroundColor: colors.system.surface,
    padding: spacing.sm,
    borderRadius: spacing.xs,
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  shareButton: {
    flex: 1,
    marginRight: spacing.sm,
  },
  newVerificationButton: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  tipsCard: {
    margin: spacing.lg,
    marginTop: 0,
  },
  tipsTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  tipNumber: {
    ...typography.h4,
    color: colors.primary.main,
    marginRight: spacing.sm,
    minWidth: 20,
  },
  tipText: {
    ...typography.body2,
    color: colors.text.secondary,
    flex: 1,
  },
  finalSpacing: {
    height: spacing.xl,
  },
});
