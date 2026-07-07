import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { scale } from '../../../helpers/scaler';
import shadowStyles from '../../../styles/shadow';
import { texts } from '../../../styles/texts';
import { colors } from '../../../styles/colors';
import HSpacer from '../spacer/HSpacer/HSpacer';

type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'text';
type ButtonSize = 'xsmall' | 'small' | 'medium' | 'large';

type CustomButtonProps = {
  type: ButtonType;
  size: ButtonSize;
  text?: string;
  width?: any;
  isLoading?: boolean;
  disableClick?: boolean;
  disabled?: boolean;
  onPress: (value: any | undefined) => void;
  marginVertical?: number;
  autoFocus?: boolean;
  icon?: any;
  borderRadius?: number;
};

interface ButtonStyleConfig {
  buttonStyle: any;
  customDisabledButtonStyle: any;
  pressedStyles: any;
  focusedStyles: any;
  loadingIndicatorColor: string;
  textColor: string;
  pressedTextColor: string;
  focusedTextColor: string;
  textDisabledColor: string;
}

interface SizeConfig {
  height: number;
  iconSize: number;
  textStyle: any;
}

const getButtonTypeStyles = (
  type: ButtonType,
  colors: any,
  borderRadius?: number,
): ButtonStyleConfig => {
  const baseConfig = {
    buttonStyle: {},
    customDisabledButtonStyle: {},
    pressedStyles: {},
    focusedStyles: {},
    loadingIndicatorColor: colors.Others.white,
    textColor: colors.Others.white,
    pressedTextColor: colors.Others.white,
    focusedTextColor: colors.Others.white,
    textDisabledColor: colors.Greyscale[300],
  };

  switch (type) {
    case 'primary':
      return {
        ...baseConfig,
        buttonStyle: [
          {
            backgroundColor: colors.primary[400],
            borderRadius: borderRadius ?? scale(8),
          },
          shadowStyles.Large,
        ],
        customDisabledButtonStyle: {
          backgroundColor: colors.primary[500],
          opacity: 0.3,
        },
        pressedStyles: {
          backgroundColor: colors.primary[500],
        },
        focusedStyles: {
          ...shadowStyles.Medium,
          borderWidth: scale(3),
          borderColor: colors.primary[500],
        },
      };

    case 'secondary':
      return {
        ...baseConfig,
        buttonStyle: {
          backgroundColor: colors.Greyscale[0],
          borderWidth: scale(1),
          borderRadius: borderRadius ?? scale(8),
          borderColor: colors.Greyscale[200],
          ...shadowStyles.Large,
        },
        customDisabledButtonStyle: {
          backgroundColor: colors.Greyscale[50],
          borderColor: colors.Greyscale[200],
        },
        pressedStyles: {
          backgroundColor: colors.Greyscale[0],
          borderColor: colors.Greyscale[200],
        },
        focusedStyles: {
          borderWidth: scale(1),
          borderColor: colors.Greyscale[200],
          ...shadowStyles.Small,
        },
        loadingIndicatorColor: colors.Greyscale[900],
        textColor: colors.Greyscale[800],
        textDisabledColor: colors.Greyscale[300],
        pressedTextColor: colors.Greyscale[900],
        focusedTextColor: colors.Greyscale[900],
      };

    case 'tertiary':
      return {
        ...baseConfig,
        buttonStyle: {
          backgroundColor: colors.Greyscale[0],
          borderWidth: scale(1),
          borderColor: colors.primary[400],
          borderRadius: borderRadius ?? scale(8),
        },
        customDisabledButtonStyle: {
          borderColor: colors.primary[500],
          opacity: 0.3,
        },
        pressedStyles: {
          borderColor: colors.primary[500],
        },
        focusedStyles: {
          borderWidth: scale(1),
          borderColor: colors.primary[500],
        },
        loadingIndicatorColor: colors.primary[400],
        textColor: colors.primary[400],
        pressedTextColor: colors.primary[500],
        focusedTextColor: colors.primary[500],
        textDisabledColor: colors.primary[500],
      };

    case 'text':
      return {
        ...baseConfig,
        buttonStyle: {
          backgroundColor: 'transparent',
          borderRadius: borderRadius ?? scale(8),
        },
        focusedStyles: {
          backgroundColor: colors.primary[50],
          borderWidth: scale(2),
          borderColor: colors.primary[200],
        },
        loadingIndicatorColor: colors.primary[400],
        textColor: colors.primary[400],
        pressedTextColor: colors.primary[500],
        focusedTextColor: colors.Greyscale[900],
        textDisabledColor: colors.Greyscale[300],
      };

    default:
      return baseConfig;
  }
};

const getSizeConfig = (size: ButtonSize): SizeConfig => {
  switch (size) {
    case 'xsmall':
      return {
        height: scale(32),
        iconSize: scale(12),
        textStyle: texts.body.extraSmall.medium,
      };
    case 'small':
      return {
        height: scale(40),
        iconSize: scale(14),
        textStyle: texts.body.small.medium,
      };
    case 'medium':
      return {
        height: scale(48),
        iconSize: scale(16),
        textStyle: texts.body.medium.medium,
      };
    case 'large':
      return {
        height: scale(52),
        iconSize: scale(18),
        textStyle: texts.body.medium.bold,
      };
    default:
      return {
        height: scale(44),
        iconSize: scale(16),
        textStyle: texts.body.medium.medium,
      };
  }
};

export const CustomButton: React.FC<CustomButtonProps> = ({
  type,
  size,
  text = '',
  width,
  isLoading = false,
  disableClick = false,
  disabled = false,
  onPress,
  marginVertical = 0,
  autoFocus = false,
  icon,
  borderRadius,
}) => {
  const [isFocused, setIsFocused] = useState(autoFocus);


  const styleConfig = getButtonTypeStyles(type, colors, borderRadius);
  const sizeConfig = getSizeConfig(size);

  const isDisabled = disabled || disableClick;

  const commonButtonStyle = {
    width: width ?? '100%',
    marginVertical,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: scale(100),
    height: sizeConfig.height,
  };

  const getTextColor = (pressed: boolean) => {
    if (isDisabled) return styleConfig.textDisabledColor;
    if (isFocused) return styleConfig.focusedTextColor;
    if (pressed) return styleConfig.pressedTextColor;
    return styleConfig.textColor;
  };

  const renderContent = (pressed: boolean) => {
    if (isLoading) {
      return <ActivityIndicator color={styleConfig.loadingIndicatorColor} />;
    }

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {icon && (
          <View
            style={{
              width: text ? 18 : 24,
              height: text ? 18 : 24,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </View>
        )}

        {icon && text && <HSpacer width={scale(8)} />}

        {text && (
          <Text
            style={[sizeConfig.textStyle, { color: getTextColor(pressed) }]}
          >
            {text}
          </Text>
        )}
      </View>
    );
  };

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={({ pressed }) => [
        commonButtonStyle,
        styleConfig.buttonStyle,
        isFocused && styleConfig.focusedStyles,
        pressed && styleConfig.pressedStyles,
        isDisabled && styleConfig.customDisabledButtonStyle,
      ]}
    >
      {({ pressed }) => renderContent(pressed)}
    </Pressable>
  );
};
