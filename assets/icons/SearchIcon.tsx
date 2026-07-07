import React from 'react';
import {  Path, Svg } from 'react-native-svg';

function SearchIcon(props: any) {
  return (
    <Svg
      width={props.width || '20'}
      height={props.height || '22'}
      viewBox="0 0 20 22"
      fill="none"
    >
      <Path
        d="M16.5 16.5L13.5834 13.5833M15.6667 8.58333C15.6667 12.4954 12.4954 15.6667 8.58333 15.6667C4.67132 15.6667 1.5 12.4954 1.5 8.58333C1.5 4.67132 4.67132 1.5 8.58333 1.5C12.4954 1.5 15.6667 4.67132 15.6667 8.58333Z"
        stroke={props.color || '#A0A0AB'}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}

export default SearchIcon;
