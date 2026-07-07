import React, { useEffect, useRef } from 'react';
import {  Text, Animated } from 'react-native';
import { colors } from '../../styles/colors';
import { scale } from '../../helpers/scaler';
import Lucide from '@react-native-vector-icons/lucide';

export const StreakChip = ({
  streak,
  compact,
}: {
  streak: number;
  compact?: boolean;
}) => {
  const flame = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flame, {
          toValue: 1.1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(flame, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [flame]);
  return (
    <Animated.View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.Accent.streakGlow,
        borderRadius: scale(20),
        paddingVertical: compact ? scale(3) : scale(5),
        paddingHorizontal: compact ? scale(7) : scale(9),
        borderWidth: 1,
        borderColor: colors.Accent.streakBorder,
        transform: [{ scale: flame }],
      }}
    >
      <Lucide
        name="flame"
        size={compact ? scale(10) : scale(11)}
        color = {colors.Accent.streak}
        style={{ marginRight: scale(3) }}
      />
      <Text
        style={{
          fontSize: compact ? scale(10) : scale(11),
          fontWeight: '800',
          color: colors.Accent.streak,
          letterSpacing: 0.2,
        }}
      >
        {streak}
      </Text>
    </Animated.View>
  );
};
