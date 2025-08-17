import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing } from '../../theme';

const { width, height } = Dimensions.get('window');

/**
 * 🎯 Componente de animação para ganho de pontos
 * Mostra uma animação flutuante quando o usuário ganha pontos
 */
export const PointsGainAnimation = ({ 
  points, 
  isVisible, 
  onAnimationComplete,
  position = 'center', // 'center', 'top', 'bottom'
  size = 'medium' // 'small', 'medium', 'large'
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isVisible) {
      startAnimation();
    }
  }, [isVisible]);

  const startAnimation = () => {
    // Reset das animações
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.3);
    translateYAnim.setValue(0);
    opacityAnim.setValue(1);

    // Sequência de animações
    Animated.sequence([
      // Aparecer com escala
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // Aguardar
      Animated.delay(800),
      // Subir e desaparecer
      Animated.parallel([
        Animated.timing(translateYAnim, {
          toValue: -100,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onAnimationComplete?.();
    });
  };

  if (!isVisible) return null;

  const getPositionStyle = () => {
    switch (position) {
      case 'top':
        return { top: height * 0.2 };
      case 'bottom':
        return { bottom: height * 0.2 };
      default:
        return { top: height * 0.4 };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { fontSize: 16, paddingHorizontal: 12, paddingVertical: 6 };
      case 'large':
        return { fontSize: 24, paddingHorizontal: 20, paddingVertical: 12 };
      default:
        return { fontSize: 20, paddingHorizontal: 16, paddingVertical: 8 };
    }
  };

  return (
    <View style={[styles.container, getPositionStyle()]} pointerEvents="none">
      <Animated.View
        style={[
          styles.animationContainer,
          {
            opacity: Animated.multiply(fadeAnim, opacityAnim),
            transform: [
              { scale: scaleAnim },
              { translateY: translateYAnim },
            ],
          },
        ]}
      >
        <View style={[styles.pointsContainer, { ...getSizeStyle() }]}>
          <Text style={[styles.plusSign, { fontSize: getSizeStyle().fontSize * 0.6 }]}>
            +
          </Text>
          <Text style={[styles.pointsText, { fontSize: getSizeStyle().fontSize }]}>
            {points}
          </Text>
        </View>
        
        <Text style={[styles.pointsLabel, { fontSize: getSizeStyle().fontSize * 0.5 }]}>
          pontos!
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.main,
    borderRadius: 25,
    shadowColor: colors.primary.main,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  plusSign: {
    color: colors.common.white,
    fontWeight: 'bold',
    marginRight: 2,
  },
  pointsText: {
    color: colors.common.white,
    fontWeight: 'bold',
    fontFamily: typography.fontFamily.bold,
  },
  pointsLabel: {
    color: colors.primary.main,
    fontWeight: '600',
    marginTop: 4,
    fontFamily: typography.fontFamily.medium,
  },
});

export default PointsGainAnimation;
