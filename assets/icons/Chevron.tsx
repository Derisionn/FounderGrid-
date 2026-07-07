import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { scale } from '../../app/helpers/scaler';

type ChevronProps = {
  width?: number;
  height?: number;
  color?: string;
  direction?: 'right' | 'left';
  props?: any;
};

function Chevron({
  width = scale(7),
  height = scale(12),
  color = '#fff',
  direction = 'right',
  ...props
}: ChevronProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 7 12"
      fill="none"
      style={direction === 'left' ? { transform: [{ scaleX: -1 }] } : undefined}
      {...props}
    >
      <Path
        d="M1.5 1l4.41 4.41a.833.833 0 010 1.18L1.5 11"
        stroke={color}
        strokeWidth={1.66667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default Chevron;
