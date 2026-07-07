import * as React from 'react';
import Svg, {Path} from 'react-native-svg';


function TabSearchIcon(props: any) {
  return (
    <Svg
      width={props.width || '17'}
      height={props.height || '22'}
      viewBox="0 0 24 24"
      fill={"none"}
    >
      <Path
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default TabSearchIcon;
