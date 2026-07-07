import React from 'react';
import { Circle, Path, Rect, Svg } from 'react-native-svg';

function InstagramIcon(props: any) {
  const color = props.color || '#FFFFFF';
  return (
    <Svg
      width={props.width || '24'}
      height={props.height || '24'}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="5.5"
        stroke={color}
        strokeWidth="1.8"
        fill="none"
      />
      <Circle
        cx="12"
        cy="12"
        r="4.25"
        stroke={color}
        strokeWidth="1.8"
        fill="none"
      />
      <Path
        d="M17.75 6.75A1 1 0 1 1 17.75 6.75001"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default InstagramIcon;
