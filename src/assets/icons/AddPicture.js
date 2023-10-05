import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';

function AddPicture({size}) {
  return (
    <Svg
      width={size || 70}
      height={size || 70}
      viewBox="0 0 70 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Rect width={70} height={70} rx={7} fill="#4A43EC" />
      <Path d="M35 23v24M47 35H23" stroke="#fff" strokeWidth={4} />
    </Svg>
  );
}

export default AddPicture;
