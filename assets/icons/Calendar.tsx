import * as React from 'react';
import Svg, { Path, Rect, Line } from 'react-native-svg';
import { scale } from '../../app/helpers/scaler';

type CalendarProps = {
  width?: number;
  height?: number;
  color?: string;
  props?: any;
};

function Calendar({
  width = scale(24),
  height = scale(24),
  color = '#fff',
  ...props
}: CalendarProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Rect
        x={3}
        y={4}
        width={18}
        height={18}
        rx={2}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line
        x1={16}
        y1={2}
        x2={16}
        y2={6}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Line
        x1={8}
        y1={2}
        x2={8}
        y2={6}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path d="M3 10h18" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export default Calendar;
