import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { scale } from '../../app/helpers/scaler';

type BellProps = {
  width?: number;
  height?: number;
  color?: string;
  props?: any;
};

function Bell({
  width = scale(24),
  height = scale(24),
  color = '#fff',
  ...props
}: BellProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Path
        d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.73 21a2 2 0 01-3.46 0"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default Bell;
