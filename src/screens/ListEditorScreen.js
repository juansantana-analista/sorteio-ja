// src/screens/ListEditorScreen.js
// 📝 Tela de Criação e Edição de Listas - Sorteio Já
// Interface completa para criar, editar e gerenciar listas de sorteio

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Animated,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 🎨 Componentes UI
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

// 🎮 Hooks e serviços
import { useGamification } from '../hooks/useGamification';
import { database } from '../services/database';
import { performLottery } from '../services/lottery';

// 🎨 Sistema de design
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, layouts } from '../theme/spacing';
import { shadows } from '../theme/shadows';

/**
 * 📝 Componente ListEditorScreen
 * 
 * Funcionalidades:
 * - Criar listas de nomes/itens
 * - Editar listas existentes
 * - Adicionar/remover/reordenar itens
 * - Validação em tempo real
 * - Preview do sorteio
 * - Salvar como favorito
 */
const ListEditorScreen = ({ navigation, route }) => {
  // 🎯 Parâmetros da rota
  const { 
    type = 'names', 
    mode = 'create', 
    listId = null 
  } = route.params || {};

  // 🎮 Estados principais
  const [listName, setListName] = useState('');
  const [items, setItems] = useState(['']);
  const [newItem, setNewItem] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // 🎮 Gamificação
  const gamification = useGamification();

  // 🎬 Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // 🚀 Inicializar componente
  useEffect(() => {
    initializeScreen();
    startEntranceAnimation();
  }, []);

  // 🎬 Animação de entrada
  const startEntranceAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 🚀 Inicializar tela
  const initializeScreen = async () => {
    try {
      if (mode === 'edit' && listId) {
        // Carregar lista existente
        const list = await database.getListById(listId);
        if (list) {
          setListName(list.name);
          setItems([...list.items, '']); // Adicionar campo vazio no final
          setIsFavorite(list.is_favorite);
        } else {
          Alert.alert('Erro', 'Lista não encontrada');
          navigation.goBack();
        }
      } else {
        // Nova lista - configurar padrões por tipo
        const defaultNames = getDefaultItemsByType(type);
        setListName(getDefaultNameByType(type));
        setItems([...defaultNames, '']);
      }
    } catch (error) {
      console.error('Erro ao inicializar:', error);
      Alert.alert('Erro', 'Não foi possível carregar a lista');
    }
  };

  // 🎯 Obter itens padrão por tipo
  const getDefaultItemsByType = (drawType) => {
    switch (drawType) {
      case 'names':
        return [''];
      case 'teams':
        return ['Jogador 1', 'Jogador 2', 'Jogador 3', 'Jogador 4', ''];
      case 'order':
        return ['Item 1', 'Item 2', 'Item 3', ''];
      default:
        return [''];
    }
  };

  // 📝 Obter nome padrão por tipo
  const getDefaultNameByType = (drawType) => {
    switch (drawType) {
      case 'names':
        return 'Minha Lista';
      case 'teams':
        return 'Lista de Jogadores';
      case 'order':
        return 'Lista de Itens';
      default:
        return 'Nova Lista';
    }
  };

  // ➕ Adicionar item
  const addItem = () => {
    if (newItem.trim()) {
      const newItems = [...items];
      newItems[newItems.length - 1] = newItem.trim();
      newItems.push('');
      setItems(newItems);
      setNewItem('');
      validateItems(newItems);
    }
  };

  // ✏️ Editar item
  const updateItem = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
    
    // Se é o último item e não está vazio, adicionar novo campo
    if (index === items.length - 1 && value.trim()) {
      newItems.push('');
      setItems(newItems);
    }
    
    validateItems(newItems);
  };

  // 🗑️ Remover item
  const removeItem = (index) => {
    if (items.length > 2) { // Manter pelo menos 1 item + campo vazio
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      validateItems(newItems);
    }
  };

  // 🔄 Reordenar itens (futura implementação com drag & drop)
  const moveItem = (fromIndex, toIndex) => {
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setItems(newItems);
  };

  // ✅ Validar itens
  const validateItems = (itemsToValidate) => {
    const newErrors = {};
    const validItems = itemsToValidate.filter(item => item.trim() !== '');
    
    // Verificar mínimo de itens
    if (validItems.length < 2) {
      newErrors.items = 'É necessário pelo menos 2 itens para o sorteio';
    }
    
    // Verificar duplicatas
    const duplicates = validItems.filter((item, index) => 
      validItems.indexOf(item) !== index
    );
    if (duplicates.length > 0) {
      newErrors.duplicates = `Itens duplicados: ${duplicates.join(', ')}`;
    }
    
    // Verificar itens muito longos
    const longItems = validItems.filter(item => item.length > 50);
    if (longItems.length > 0) {
      newErrors.length = 'Alguns itens são muito longos (máx. 50 caracteres)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Validar nome da lista
  const validateListName = (name) => {
    if (!name || name.trim().length < 2) {
      return 'Nome da lista deve ter pelo menos 2 caracteres';
    }
    if (name.length > 100) {
      return 'Nome da lista é muito longo (máx. 100 caracteres)';
    }
    return null;
  };

  // 💾 Salvar lista
  const saveList = async () => {
    try {
      setIsLoading(true);
      
      // Validações
      const nameError = validateListName(listName);
      if (nameError) {
        Alert.alert('Erro', nameError);
        return;
      }
      
      const validItems = items.filter(item => item.trim() !== '');
      if (!validateItems(items)) {
        Alert.alert('Erro', 'Corrija os erros na lista antes de salvar');
        return;
      }
      
      // Salvar no banco
      if (mode === 'edit' && listId) {
        // Atualizar lista existente
        await database.updateList(listId, {
          name: listName.trim(),
          items: validItems,
          is_favorite: isFavorite,
        });
        
        Alert.alert('Sucesso', 'Lista atualizada com sucesso!');
      } else {
        // Criar nova lista
        const newListId = await database.createList(
          listName.trim(),
          validItems,
          type
        );
        
        if (isFavorite) {
          await database.toggleFavorite(newListId);
        }
        
        // Processar gamificação
        await gamification.processListCreation();
        
        Alert.alert('Sucesso', 'Lista criada com sucesso!');
      }
      
      navigation.goBack();
      
    } catch (error) {
      console.error('Erro ao salvar lista:', error);
      Alert.alert('Erro', 'Não foi possível salvar a lista');
    } finally {
      setIsLoading(false);
    }
  };

  // 🎲 Preview do sorteio
  const previewLottery = async () => {
    try {
      const validItems = items.filter(item => item.trim() !== '');
      
      if (!validateItems(items)) {
        Alert.alert('Erro', 'Corrija os erros na lista antes do preview');
        return;
      }
      
      // Executar sorteio de teste
      const result = await performLottery(type, {
        items: validItems,
        count: 1,
      });
      
      if (result.success) {
        const winner = result.result.winners?.[0] || validItems[0];
        Alert.alert(
          '🎉 Preview do Sorteio',
          `Vencedor: ${winner}\n\nEste é apenas um teste! O sorteio real será diferente.`,
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível fazer o preview');
    }
  };

  // 🎨 Renderizar item da lista
  const renderItem = ({ item, index }) => {
    const isLast = index === items.length - 1;
    const isEmpty = item.trim() === '';
    
    return (
      <Animated.View
        style={[
          styles.itemContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Card
          variant="default"
          padding="small"
          style={[
            styles.itemCard,
            isEmpty && isLast && styles.emptyItemCard,
          ]}
        >
          <View style={styles.itemRow}>
            <Text style={styles.itemNumber}>{index + 1}</Text>
            
            <Input
              value={item}
              onChangeText={(value) => updateItem(index, value)}
              placeholder={isLast ? "Adicionar novo item..." : `Item ${index + 1}`}
              style={styles.itemInput}
              size="small"
              maxLength={50}
            />
            
            {!isLast && (
              <TouchableOpacity
                onPress={() => removeItem(index)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>🗑️</Text>
              </TouchableOpacity>
            )}
          </View>
        </Card>
      </Animated.View>
    );
  };

  // 🎨 Renderizar estatísticas
  const renderStats = () => {
    const validItems = items.filter(item => item.trim() !== '');
    
    return (
      <Card variant="filled" padding="medium" style={styles.statsCard}>
        <Text style={styles.statsTitle}>📊 Estatísticas</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{validItems.length}</Text>
            <Text style={styles.statLabel}>Itens</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {validItems.length > 1 ? Math.round(100 / validItems.length) : 0}%
            </Text>
            <Text style={styles.statLabel}>Chance cada</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {type === 'teams' ? Math.floor(validItems.length / 2) : 1}
            </Text>
            <Text style={styles.statLabel}>
              {type === 'teams' ? 'Times' : 'Vencedor'}
            </Text>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 📝 Header com nome da lista */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Input
              label="Nome da Lista"
              value={listName}
              onChangeText={setListName}
              placeholder="Digite o nome da lista..."
              maxLength={100}
              required
              error={listName ? validateListName(listName) : ''}
            />
            
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => setIsFavorite(!isFavorite)}
            >
              <Text style={styles.favoriteIcon}>
                {isFavorite ? '⭐' : '☆'}
              </Text>
              <Text style={styles.favoriteText}>
                {isFavorite ? 'Favorita' : 'Favoritar'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* 📊 Estatísticas */}
          {renderStats()}

          {/* 📋 Lista de itens */}
          <Animated.View
            style={[
              styles.itemsSection,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <Text style={styles.sectionTitle}>
              📋 Itens da Lista
            </Text>
            
            <FlatList
              data={items}
              renderItem={renderItem}
              keyExtractor={(item, index) => `item-${index}`}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
            />
          </Animated.View>

          {/* ⚠️ Erros de validação */}
          {Object.keys(errors).length > 0 && (
            <Card variant="outlined" specialState="error" padding="medium">
              <Text style={styles.errorTitle}>⚠️ Corrija os seguintes erros:</Text>
              {Object.values(errors).map((error, index) => (
                <Text key={index} style={styles.errorText}>
                  • {error}
                </Text>
              ))}
            </Card>
          )}
        </ScrollView>

        {/* 🎯 Botões de ação */}
        <Animated.View
          style={[
            styles.actionButtons,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Button
            title="🎲 Preview"
            variant="outline"
            size="medium"
            onPress={previewLottery}
            disabled={Object.keys(errors).length > 0}
            style={styles.previewButton}
          />
          
          <Button
            title={mode === 'edit' ? 'Salvar Alterações' : 'Criar Lista'}
            variant="primary"
            size="large"
            onPress={saveList}
            loading={isLoading}
            disabled={Object.keys(errors).length > 0}
            style={styles.saveButton}
          />
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// 🎨 Estilos do componente
const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.system.background,
  },
  
  keyboardAvoid: {
    flex: 1,
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing['6xl'],
  },
  
  header: {
    marginBottom: spacing.xl,
  },
  
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    backgroundColor: colors.system.surface,
  },
  
  favoriteIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  
  favoriteText: {
    ...typography.labelMedium,
    color: colors.neutral[600],
  },
  
  statsCard: {
    marginBottom: spacing.xl,
  },
  
  statsTitle: {
    ...typography.titleMedium,
    color: colors.neutral[800],
    marginBottom: spacing.md,
  },
  
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  
  statItem: {
    alignItems: 'center',
  },
  
  statNumber: {
    ...typography.headlineSmall,
    color: colors.primary[600],
    marginBottom: spacing.xs,
  },
  
  statLabel: {
    ...typography.labelSmall,
    color: colors.neutral[600],
  },
  
  itemsSection: {
    marginBottom: spacing.xl,
  },
  
  sectionTitle: {
    ...typography.titleLarge,
    color: colors.neutral[800],
    marginBottom: spacing.lg,
  },
  
  itemContainer: {
    marginBottom: spacing.sm,
  },
  
  itemCard: {
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  
  emptyItemCard: {
    borderStyle: 'dashed',
    borderColor: colors.neutral[300],
    backgroundColor: colors.neutral[50],
  },
  
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  itemNumber: {
    ...typography.labelMedium,
    color: colors.neutral[500],
    width: 30,
    textAlign: 'center',
    marginRight: spacing.sm,
  },
  
  itemInput: {
    flex: 1,
    marginVertical: 0,
  },
  
  removeButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
  
  removeButtonText: {
    fontSize: 18,
  },
  
  errorTitle: {
    ...typography.titleSmall,
    color: colors.error[700],
    marginBottom: spacing.sm,
  },
  
  errorText: {
    ...typography.bodySmall,
    color: colors.error[600],
    marginBottom: spacing.xs,
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
    gap: spacing.md,
  },
  
  previewButton: {
    flex: 1,
  },
  
  saveButton: {
    flex: 2,
  },
};

export default ListEditorScreen;