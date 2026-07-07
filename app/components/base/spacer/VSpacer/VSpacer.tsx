import React from 'react';
import {View} from 'react-native';
import {scale} from '../../../../helpers/scaler';

type ButtonType = {
  height: number;
};

const VSpacer: React.FC<ButtonType> = ({height}) => {
  return <View style={{height: scale(height)}} />;
};

export default VSpacer;
