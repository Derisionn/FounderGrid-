import React from 'react';
import { Circle, Path, Svg } from 'react-native-svg';

function WebsiteIcon(props: any) {
  const color = props.color || '#FFFFFF';
  return (
    <Svg
      width={props.width || '24'}
      height={props.height || '24'}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Circle
        cx="12"
        cy="12"
        r="9.25"
        stroke={color}
        strokeWidth="1.8"
        fill="none"
      />
      <Path
        d="M3 12h18"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <Path
        d="M12 3c2.5 2.7 3.917 5.7 3.917 9s-1.417 6.3-3.917 9c-2.5-2.7-3.917-5.7-3.917-9S9.5 5.7 12 3Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export default WebsiteIcon;
