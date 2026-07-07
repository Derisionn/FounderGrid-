import * as React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { scale } from '../../app/helpers/scaler';

type MenuProps = {
    width?: number;
    height?: number;
    color?: string;
    props?: any;
};

function Menu({
    width = scale(24),
    height = scale(24),
    color = '#fff',
    ...props
}: MenuProps) {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            {...props}
        >
            <Circle cx="12" cy="5" r="1.5" fill={color} />
            <Circle cx="12" cy="12" r="1.5" fill={color} />
            <Circle cx="12" cy="19" r="1.5" fill={color} />
        </Svg>
    );
}

export default Menu;
