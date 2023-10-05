import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function ProfileLock({size, color}) {
  return (
    <Svg
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7zm4 10.723V20h-2v-2.277a1.994 1.994 0 011.454-3.672 2 2 0 011.277 2.945 1.99 1.99 0 01-.731.727z"
        fill={color || '#2F80ED'}
      />
    </Svg>
  );
}

export default ProfileLock;
