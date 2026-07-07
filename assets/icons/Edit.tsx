import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { scale } from '../../app/helpers/scaler';

type EditProps = {
    width?: number;
    height?: number;
    color?: string;
    props?: any;
};

function Edit({
    width = scale(24),
    height = scale(24),
    color = '#fff',
    ...props
}: EditProps) {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            {...props}
        >
            <Path
                d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export default Edit;
