import type { ImageSourcePropType } from 'react-native';

export const MOCK_AVATARS: ImageSourcePropType[] = [
  require('../../assets/images/Number=1.png'),
  require('../../assets/images/Number=6.png'),
  require('../../assets/images/Number=27.png'),
  require('../../assets/images/Number=88.png'),
  require('../../assets/images/Number=115.png'),
];

export const ME_AVATAR: ImageSourcePropType = MOCK_AVATARS[0];

export const avatarFor = (seed: string): ImageSourcePropType => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) % 2147483647;
  }
  return MOCK_AVATARS[h % MOCK_AVATARS.length];
};
