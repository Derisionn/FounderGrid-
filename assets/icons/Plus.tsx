import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { scale } from '../../app/helpers/scaler';

type PlusProps = {
  width?: number;
  height?: number;
  color?: string;
  props?: any;
};

function Plus({
  width = scale(24),
  height = scale(24),
  color = '#fff',
  ...props
}: PlusProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Path
        d="M12 5v14M5 12h14"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default Plus;
