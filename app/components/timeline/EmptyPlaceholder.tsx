import React from 'react';
import { scale } from '../../helpers/scaler';
import { Text, View } from 'react-native';
import { colors } from '../../styles/colors';

type EmptyStateProps = {
  icon: string | React.ReactNode;
  title: string;
  subtitle: string;
};

const EmptyState = ({ icon, title, subtitle }: EmptyStateProps) => (
  <View style={{ alignItems: 'center', paddingVertical: scale(60) }}>
    <View style={{ marginBottom: scale(12) }}>
      {typeof icon === 'string' ? (
        <Text style={{ fontSize: scale(40) }}>{icon}</Text>
      ) : (
        icon
      )}
    </View>
    <Text style={{ fontSize: scale(15), fontWeight: '700', color: colors.Dark.textFainter, marginBottom: scale(6) }}>
      {title}
    </Text>
    <Text style={{ fontSize: scale(13), color: colors.Dark.textPlaceholderSofter, textAlign: 'center', lineHeight: scale(20) }}>
      {subtitle}
    </Text>
  </View>
);

export default EmptyState;
