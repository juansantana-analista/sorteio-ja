// HistoryScreen.js
// 📚 Tela de histórico dos sorteios realizados
// Mostra lista cronológica com detalhes e opções de compartilhamento

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';

// 🎮 Hooks
import { useGamification } from '../hooks/useGamification';

// 🛠️ Serviços
import { database } from '../services/database';
import { sharing } from '../services/sharing';

// 🎨 Tema
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

// 🧩 Componentes
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

/**
 * 📚 Tela de histórico dos sorteios
 */
export default function HistoryScreen({ navigation }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const { addPoints, addExperience } = useGamification();

  // 🔄 Carregar histórico quando a tela receber foco
  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
    }, [])
  );

  /**
   * 📥 Carregar histórico do banco de dados
   */
  const loadHistory = async () => {
    try {
      setLoading(true);
      const results = await database.getHistory();
      setHistory(results);
    } catch (error) {
      console.error('❌ Erro ao carregar histórico:', error);
      Alert.alert('Erro', 'Não foi possível carregar o histórico');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔄 Atualizar histórico (pull to refresh)
   */
  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  /**
   * 🗑️ Excluir item do histórico
   */
  const deleteHistoryItem = async (id) => {
    Alert.alert(
      'Excluir Item',
      'Tem certeza que deseja excluir este sorteio do histórico?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await database.deleteHistoryItem(id);
              await loadHistory();
              addPoints(5); // Pontos por limpeza
              addExperience(10);
            } catch (error) {
              console.error('❌ Erro ao excluir:', error);
              Alert.alert('Erro', 'Não foi possível excluir o item');
            }
          },
        },
      ]
    );
  };

  /**
   * 📤 Compartilhar resultado
   */
  const shareResult = async (item) => {
    try {
      const shareText = `🎲 Sorteio realizado em ${item.date}\n` +
        `📝 Lista: ${item.listName}\n` +
        `🎯 Resultado: ${item.result}\n` +
        `🔐 Hash: ${item.hash}\n` +
        `📱 App: Sorteio Já`;
      
      await sharing.shareText(shareText, 'Resultado do Sorteio');
      addPoints(10); // Pontos por compartilhamento
    } catch (error) {
      console.error('❌ Erro ao compartilhar:', error);
    }
  };

  /**
   * 🔍 Ver detalhes do sorteio
   */
  const viewDetails = (item) => {
    navigation.navigate('Result', { 
      result: item.result,
      listName: item.listName,
      date: item.date,
      hash: item.hash,
      participants: item.participants,
      isFromHistory: true
    });
  };

  /**
   * 🎨 Renderizar item do histórico
   */
  const renderHistoryItem = ({ item, index }) => (
    <Card style={styles.historyCard}>
      <TouchableOpacity
        style={styles.historyItem}
        onPress={() => viewDetails(item)}
        activeOpacity={0.7}
      >
        {/* 📅 Data e hora */}
        <View style={styles.headerRow}>
          <View style={styles.dateContainer}>
            <Icon name="calendar" size={16} color={colors.text.secondary} />
            <Text style={styles.dateText}>
              {new Date(item.date).toLocaleDateString('pt-BR')}
            </Text>
          </View>
          <Text style={styles.timeText}>
            {new Date(item.date).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>

        {/* 📝 Nome da lista */}
        <Text style={styles.listName} numberOfLines={1}>
          {item.listName}
        </Text>

        {/* 🎯 Resultado */}
        <View style={styles.resultContainer}>
          <Icon name="target" size={16} color={colors.primary.main} />
          <Text style={styles.resultText} numberOfLines={2}>
            {item.result}
          </Text>
        </View>

        {/* 👥 Participantes */}
        {item.participants && item.participants.length > 0 && (
          <View style={styles.participantsContainer}>
            <Icon name="account-group" size={16} color={colors.text.secondary} />
            <Text style={styles.participantsText}>
              {item.participants.length} participante{item.participants.length > 1 ? 's' : ''}
            </Text>
          </View>
        )}

        {/* 🔐 Hash de verificação */}
        <Text style={styles.hashText} numberOfLines={1}>
          🔐 {item.hash.substring(0, 16)}...
        </Text>
      </TouchableOpacity>

      {/* 🎛️ Botões de ação */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.shareButton]}
          onPress={() => shareResult(item)}
        >
          <Icon name="share-variant" size={20} color={colors.primary.main} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deleteHistoryItem(item.id)}
        >
          <Icon name="delete-outline" size={20} color={colors.error.main} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  /**
   * 🎨 Renderizar lista vazia
   */
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Icon name="history" size={64} color={colors.text.secondary} />
      <Text style={styles.emptyTitle}>Nenhum sorteio ainda</Text>
      <Text style={styles.emptySubtitle}>
        Realize seu primeiro sorteio para ver o histórico aqui
      </Text>
      <Button
        title="Fazer Primeiro Sorteio"
        onPress={() => navigation.navigate('Home')}
        style={styles.emptyButton}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 📚 Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Histórico</Text>
        <Text style={styles.headerSubtitle}>
          {history.length} sorteio{history.length !== 1 ? 's' : ''} realizado{history.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* 📋 Lista do histórico */}
      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary.main]}
            tintColor={colors.primary.main}
          />
        }
        ListEmptyComponent={renderEmptyList}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.system.background,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  listContainer: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  historyCard: {
    marginBottom: spacing.md,
  },
  historyItem: {
    padding: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  timeText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  listName: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  resultText: {
    ...typography.body1,
    color: colors.text.primary,
    marginLeft: spacing.xs,
    flex: 1,
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  participantsText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  hashText: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontFamily: 'monospace',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  actionButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
    borderRadius: spacing.sm,
  },
  shareButton: {
    backgroundColor: colors.primary.light,
  },
  deleteButton: {
    backgroundColor: colors.error.light,
  },
  separator: {
    height: spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body2,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  emptyButton: {
    minWidth: 200,
  },
});
