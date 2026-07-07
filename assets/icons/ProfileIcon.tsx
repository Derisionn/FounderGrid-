import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function ProfileIcon(props: any) {
  return (
    <Svg
      width={props.width || '22'}
      height={props.height || '22'}
      viewBox="0 0 22 22"
      fill="none"
    >
      <Path
        d="M16 19.6622V18.5C16 16.2909 14.2091 14.5 12 14.5H10C7.79086 14.5 6 16.2909 6 18.5V19.6622M16 19.6622C18.989 17.9331 21 14.7014 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 14.7014 3.01099 17.9331 6 19.6622M16 19.6622C14.5291 20.513 12.8214 21 11 21C9.17856 21 7.47087 20.513 6 19.6622M14 8C14 9.65685 12.6569 11 11 11C9.34315 11 8 9.65685 8 8C8 6.34315 9.34315 5 11 5C12.6569 5 14 6.34315 14 8Z"
        stroke={props.color || '#A0A0AB'}
        strokeWidth="2"
      />
    </Svg>
  );
}

export default ProfileIcon;
