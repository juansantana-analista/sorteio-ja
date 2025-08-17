// src/components/gamification/ProgressRing.js
// 📊 Componente Anel de Progresso
// Anel circular animado para mostrar progresso de conquistas

import React, { useRef, useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ProgressRing = ({ 
  progress = 0, // 0-100
  size = 100,
  strokeWidth = 8,
  color = colors.primary[500],
  backgroundColor = colors.neutral[200],
  showPercentage = true,
  duration = 1000,
  style = {},
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  // 📏 Cálculos do círculo
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // 🎬 Animar progresso
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: duration,
      useNativeDriver: false,
    }).start();
  }, [progress, duration]);

  // 📊 Calcular stroke dash offset
  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        {/* Círculo de fundo */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Círculo de progresso */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      
      {/* Texto de porcentagem */}
      {showPercentage && (
        <View style={styles.textContainer}>
          <Animated.Text 
            style={[
              styles.percentageText,
              { 
                color: color,
                fontSize: size * 0.2,
              }
            ]}
          >
            {progressAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', `${Math.round(progress)}%`],
            })}
          </Animated.Text>
        </View>
      )}
    </View>
  );
};

const styles = {
  textContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  percentageText: {
    fontWeight: '700',
    textAlign: 'center',
  },
};

export default ProgressRing;