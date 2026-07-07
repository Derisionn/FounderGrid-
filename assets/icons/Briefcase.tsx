import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { scale } from '../../app/helpers/scaler';

type BriefcaseProps = {
    width?: number;
    height?: number;
    color?: string;
    props?: any;
};

function Briefcase({
    width = scale(24),
    height = scale(24),
    color = '#fff',
    ...props
}: BriefcaseProps) {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            {...props}
        >
            <Rect
                x="2"
                y="7"
                width="20"
                height="14"
                rx="2"
                ry="2"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export default Briefcase;
