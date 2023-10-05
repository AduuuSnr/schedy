import {MainBlue} from '@constants/colors';
import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function HiddenEye({size, color}) {
  return (
    <Svg
      width={size || 19}
      height={size || 16}
      viewBox="0 0 19 16"
      fill={'none'}
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M1.9.87L2.77 0 17.1 14.33l-.87.87L1.9.87zM9.632 5.07l2.398 2.397A2.536 2.536 0 009.632 5.07zM9.368 10.13L6.97 7.732a2.536 2.536 0 002.398 2.397z"
        fill={color || '#747688'}
      />
      <Path
        d="M9.5 11.4a3.8 3.8 0 01-3.665-4.803L3.1 3.862C1.984 4.885.92 6.22 0 7.6c1.046 1.741 2.476 3.532 3.966 4.559 1.71 1.177 3.568 1.774 5.524 1.774 1.07 0 2.131-.184 3.137-.546l-2.122-2.122c-.328.09-.666.135-1.005.135zM9.5 3.8a3.8 3.8 0 013.665 4.803l2.797 2.797c1.154-1.04 2.22-2.437 3.038-3.8-1.044-1.72-2.49-3.506-4.005-4.545-1.73-1.187-3.583-1.788-5.505-1.788a8.824 8.824 0 00-3.095.565l2.102 2.103c.327-.09.664-.135 1.003-.135z"
        fill={color || '#747688'}
      />
    </Svg>
  );
}

export default HiddenEye;