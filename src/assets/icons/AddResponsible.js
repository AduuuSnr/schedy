import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function AddResponsible({size}) {
  return (
    <Svg
      width={size || 44}
      height={size || 44}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M30.667.333H13.333c-7.17 0-13 5.831-13 13V41.5A2.167 2.167 0 002.5 43.667h28.167c7.17 0 13-5.83 13-13V13.333c0-7.169-5.83-13-13-13zm2.166 23.834h-8.666v8.666h-4.334v-8.666h-8.666v-4.334h8.666v-8.666h4.334v8.667h8.666v4.333z"
        fill="#4A43EC"
      />
    </Svg>
  );
}

export default AddResponsible;
