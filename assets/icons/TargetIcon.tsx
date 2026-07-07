import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function TargetIcon(props: any) {
  return (
    <Svg
      width={props.width || '18'}
      height={props.height || '18'}
      viewBox="0 0 18 18"
      fill={'none'}
    >
      <Path
        d="M18.3327 9.99999H14.9993M4.99935 9.99999H1.66602M9.99935 4.99999V1.66666M9.99935 18.3333V15M16.666 9.99999C16.666 13.6819 13.6812 16.6667 9.99935 16.6667C6.31745 16.6667 3.33268 13.6819 3.33268 9.99999C3.33268 6.31809 6.31745 3.33332 9.99935 3.33332C13.6812 3.33332 16.666 6.31809 16.666 9.99999ZM12.4993 9.99999C12.4993 11.3807 11.3801 12.5 9.99935 12.5C8.61864 12.5 7.49935 11.3807 7.49935 9.99999C7.49935 8.61928 8.61864 7.49999 9.99935 7.49999C11.3801 7.49999 12.4993 8.61928 12.4993 9.99999Z"
        stroke={props.colors || '#70707B'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default TargetIcon;
