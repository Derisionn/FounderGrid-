import React from 'react';
import {View} from 'react-native';
import {scale} from '../../../../helpers/scaler';

type ButtonType = {
  width: number;
};

const HSpacer: React.FC<ButtonType> = ({width}) => {
  return <View style={{width: scale(width)}} />;
};

export default HSpacer;
