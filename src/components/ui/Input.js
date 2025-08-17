// src/components/ui/Input.js
// 📝 Componente Input - Campo de entrada versátil do Sorteio Já
// Suporte para diferentes tipos, validação e estados visuais

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { animations, durations, easings } from '../../theme/animations';

/**
 * 📝 Componente Input Versátil
 * 
 * @param {Object} props
 * @param {string} props.label - Label do campo
 * @param {string} props.placeholder - Placeholder do campo
 * @param {string} props.value - Valor atual
 * @param {Function} props.onChangeText - Função executada na mudança
 * @param {'text'|'email'|'password'|'number'|'phone'} props.type - Tipo do input
 * @param {boolean} props.disabled - Se está desabilitado
 * @param {boolean} props.required - Se é obrigatório
 * @param {string} props.error - Mensagem de erro
 * @param {string} props.helper - Texto de ajuda
 * @param {ReactNode} props.leftIcon - Ícone à esquerda
 * @param {ReactNode} props.rightIcon - Ícone à direita
 * @param {Function} props.onRightIconPress - Ação do ícone direito
 * @param {'small'|'medium'|'large'} props.size - Tamanho do input
 * @param {boolean} props.multiline - Se permite múltiplas linhas
 * @param {number} props.maxLength - Número máximo de caracteres
 * @param {Function} props.onFocus - Callback de foco
 * @param {Function} props.onBlur - Callback de perda de foco
 * @param {Object} props.style - Estilos customizados
 * @param {string} props.testID - ID para testes
 */
const Input = ({
  label,
  placeholder,
  value = '',
  onChangeText,
  type = 'text',
  disabled = false,
  required = false,
  error = '',
  helper = '',
  leftIcon = null,
  rightIcon = null,
  onRightIconPress,
  size = 'medium',
  multiline = false,
  maxLength,
  onFocus,
  onBlur,
  style = {},
  testID,
  ...rest
}) => {
  // 🎬 Estados e animações
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const borderColorAnim = useRef(new Animated.Value(0)).current;
  const labelPositionAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // 🎯 Configurações por tipo
  const typeConfig = {
    text: {
      keyboardType: 'default',
      autoCapitalize: 'sentences',
      secureTextEntry: false,
    },
    email: {
      keyboardType: 'email-address',
      autoCapitalize: 'none',
      autoComplete: 'email',
      secureTextEntry: false,
    },
    password: {
      keyboardType: 'default',
      autoCapitalize: 'none',
      secureTextEntry: !isPasswordVisible,
      autoComplete: 'password',
    },
    number: {
      keyboardType: 'numeric',
      autoCapitalize: 'none',
      secureTextEntry: false,
    },
    phone: {
      keyboardType: 'phone-pad',
      autoCapitalize: 'none',
      secureTextEntry: false,
    },
  };

  // 📏 Configurações de tamanho
  const sizeStyles = {
    small: {
      height: 40,
      fontSize: typography.bodySmall.fontSize,
      paddingHorizontal: spacing.md,
    },
    medium: {
      height: 48,
      fontSize: typography.bodyMedium.fontSize,
      paddingHorizontal: spacing.lg,
    },
    large: {
      height: 56,
      fontSize: typography.bodyLarge.fontSize,
      paddingHorizontal: spacing.xl,
    },
  };

  // 🎨 Estados visuais
  const getStateColors = () => {
    if (error) {
      return {
        border: colors.error[500],
        background: colors.error[50],
        text: colors.error[700],
        label: colors.error[600],
      };
    }
    
    if (isFocused) {
      return {
        border: colors.primary[500],
        background: colors.primary[50],
        text: colors.neutral[900],
        label: colors.primary[600],
      };
    }
    
    if (disabled) {
      return {
        border: colors.neutral[200],
        background: colors.neutral[100],
        text: colors.neutral[400],
        label: colors.neutral[400],
      };
    }
    
    return {
      border: colors.neutral[300],
      background: colors.neutral[0],
      text: colors.neutral[800],
      label: colors.neutral[600],
    };
  };

  const stateColors = getStateColors();

  // 🎬 Animações de foco
  useEffect(() => {
    Animated.timing(borderColorAnim, {
      toValue: isFocused ? 1 : 0,
      duration: durations.fast,
      easing: easings.easeOut,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  // 🎬 Animação do label flutuante
  useEffect(() => {
    Animated.timing(labelPositionAnim, {
      toValue: (isFocused || value) ? 1 : 0,
      duration: durations.fast,
      easing: easings.easeOut,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  // 🎬 Animação de erro (shake)
  useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          easing: easings.sharp,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 50,
          easing: easings.sharp,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          easing: easings.sharp,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          easing: easings.sharp,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [error]);

  // 🎯 Handlers
  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus && onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur && onBlur(e);
  };

  const handlePasswordToggle = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // 📏 Estilos dinâmicos
  const containerStyle = [
    styles.container,
    style,
    {
      transform: [{ translateX: shakeAnim }],
    },
  ];

  const inputContainerStyle = [
    styles.inputContainer,
    sizeStyles[size],
    {
      borderColor: borderColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [stateColors.border, colors.primary[500]],
      }),
      backgroundColor: stateColors.background,
    },
    multiline && styles.multilineContainer,
  ];

  const labelStyle = [
    styles.label,
    {
      color: stateColors.label,
      transform: [
        {
          translateY: labelPositionAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -24],
          }),
        },
        {
          scale: labelPositionAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.85],
          }),
        },
      ],
    },
  ];

  const inputStyle = [
    styles.input,
    {
      color: stateColors.text,
      fontSize: sizeStyles[size].fontSize,
    },
    leftIcon && styles.inputWithLeftIcon,
    rightIcon && styles.inputWithRightIcon,
    multiline && styles.multilineInput,
  ];

  // 🔍 Renderização dos ícones
  const renderLeftIcon = () => {
    if (!leftIcon) return null;
    
    return (
      <View style={styles.leftIconContainer}>
        {React.cloneElement(leftIcon, {
          color: stateColors.text,
          size: size === 'small' ? 16 : size === 'large' ? 24 : 20,
        })}
      </View>
    );
  };

  const renderRightIcon = () => {
    // Ícone de toggle para senha
    if (type === 'password') {
      return (
        <TouchableOpacity
          style={styles.rightIconContainer}
          onPress={handlePasswordToggle}
          accessibilityLabel={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
        >
          {/* Aqui seria um ícone de olho - por enquanto apenas texto */}
          <Text style={{ color: stateColors.text }}>
            {isPasswordVisible ? '🙈' : '👁️'}
          </Text>
        </TouchableOpacity>
      );
    }
    
    if (!rightIcon) return null;
    
    return (
      <TouchableOpacity
        style={styles.rightIconContainer}
        onPress={onRightIconPress}
        disabled={!onRightIconPress}
      >
        {React.cloneElement(rightIcon, {
          color: stateColors.text,
          size: size === 'small' ? 16 : size === 'large' ? 24 : 20,
        })}
      </TouchableOpacity>
    );
  };

  // 📊 Contador de caracteres
  const renderCharacterCount = () => {
    if (!maxLength) return null;
    
    const count = value.length;
    const isNearLimit = count > maxLength * 0.8;
    const isOverLimit = count > maxLength;
    
    return (
      <Text style={[
        styles.characterCount,
        isNearLimit && styles.characterCountWarning,
        isOverLimit && styles.characterCountError,
      ]}>
        {count}/{maxLength}
      </Text>
    );
  };

  return (
    <Animated.View style={containerStyle}>
      {/* Label flutuante */}
      {label && (
        <Animated.Text style={labelStyle}>
          {label}{required && '*'}
        </Animated.Text>
      )}
      
      {/* Container do input */}
      <Animated.View style={inputContainerStyle}>
        {renderLeftIcon()}
        
        <TextInput
          style={inputStyle}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.neutral[400]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          multiline={multiline}
          maxLength={maxLength}
          testID={testID}
          accessibilityLabel={label}
          accessibilityHint={helper}
          {...typeConfig[type]}
          {...rest}
        />
        
        {renderRightIcon()}
      </Animated.View>
      
      {/* Mensagens de ajuda/erro e contador */}
      <View style={styles.bottomContainer}>
        <View style={styles.messagesContainer}>
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : helper ? (
            <Text style={styles.helperText}>{helper}</Text>
          ) : null}
        </View>
        
        {renderCharacterCount()}
      </View>
    </Animated.View>
  );
};

// 🎨 Estilos do componente
const styles = {
  container: {
    marginVertical: spacing.sm,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: spacing.sm,
    backgroundColor: colors.neutral[0],
    marginTop: spacing.sm,
  },
  
  multilineContainer: {
    minHeight: 80,
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
  },
  
  label: {
    position: 'absolute',
    left: spacing.lg,
    top: spacing.lg,
    zIndex: 1,
    backgroundColor: colors.neutral[0],
    paddingHorizontal: spacing.xs,
    ...typography.labelMedium,
  },
  
  input: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.neutral[800],
    paddingVertical: 0, // Remove padding padrão para controlar altura
  },
  
  inputWithLeftIcon: {
    marginLeft: spacing.xs,
  },
  
  inputWithRightIcon: {
    marginRight: spacing.xs,
  },
  
  multilineInput: {
    minHeight: 40,
    textAlignVertical: 'top',
  },
  
  leftIconContainer: {
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
  },
  
  rightIconContainer: {
    paddingRight: spacing.md,
    paddingLeft: spacing.xs,
  },
  
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: spacing.xs,
    minHeight: 20,
  },
  
  messagesContainer: {
    flex: 1,
  },
  
  helperText: {
    ...typography.labelSmall,
    color: colors.neutral[500],
    marginLeft: spacing.xs,
  },
  
  errorText: {
    ...typography.labelSmall,
    color: colors.error[600],
    marginLeft: spacing.xs,
  },
  
  characterCount: {
    ...typography.labelSmall,
    color: colors.neutral[400],
    marginLeft: spacing.sm,
  },
  
  characterCountWarning: {
    color: colors.warning[600],
  },
  
  characterCountError: {
    color: colors.error[600],
  },
};

export default Input;