import * as React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { scale } from '../../app/helpers/scaler';

type ProfileProps = {
    width?: number;
    height?: number;
    color?: string;
    props?: any;
};

function Profile({
    width = scale(24),
    height = scale(24),
    color = '#fff',
    ...props
}: ProfileProps) {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            {...props}
        >
            <Circle
                cx="12"
                cy="8"
                r="4"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export default Profile;
