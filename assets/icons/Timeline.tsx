import * as React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { scale } from '../../app/helpers/scaler';

type TimelineProps = {
    width?: number;
    height?: number;
    color?: string;
    props?: any;
};

function Timeline({
    width = scale(24),
    height = scale(24),
    color = '#fff',
    ...props
}: TimelineProps) {
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
                r="9"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M12 7v5l3 3"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export default Timeline;
