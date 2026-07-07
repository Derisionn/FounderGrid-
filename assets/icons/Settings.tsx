import * as React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { scale } from '../../app/helpers/scaler';

type SettingsProps = {
    width?: number;
    height?: number;
    color?: string;
    props?: any;
};

function Settings({
    width = scale(24),
    height = scale(24),
    color = '#fff',
    ...props
}: SettingsProps) {
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
                cy="12"
                r="3"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M12 1v6m0 6v10M1 12h6m6 0h10"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export default Settings;
