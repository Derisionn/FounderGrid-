import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { scale } from '../../app/helpers/scaler';

type HomeProps = {
    width?: number;
    height?: number;
    color?: string;
    props?: any;
};

function Home({
    width = scale(24),
    height = scale(24),
    color = '#fff',
    ...props
}: HomeProps) {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            {...props}
        >
            <Path
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M9 22V12h6v10"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export default Home;
