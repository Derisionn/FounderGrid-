import * as React from 'react';
import Svg, { Rect } from 'react-native-svg';
import { scale } from '../../app/helpers/scaler';

type GridProps = {
    width?: number;
    height?: number;
    color?: string;
    props?: any;
};

function Grid({
    width = scale(24),
    height = scale(24),
    color = '#fff',
    ...props
}: GridProps) {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            {...props}
        >
            <Rect
                x="3"
                y="3"
                width="7"
                height="7"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Rect
                x="14"
                y="3"
                width="7"
                height="7"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Rect
                x="3"
                y="14"
                width="7"
                height="7"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Rect
                x="14"
                y="14"
                width="7"
                height="7"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export default Grid;
