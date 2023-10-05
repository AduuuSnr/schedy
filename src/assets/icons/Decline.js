import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';

function Decline({size}) {
  return (
    <Svg
      width={size || 70}
      height={size || 70}
      viewBox="0 0 70 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Rect width={70} height={70} rx={35} fill="#EB5545" />
      <Path
        d="M21.427 46.508c-.559.559-.58 1.505 0 2.064.56.581 1.506.56 2.065 0L35 37.066l11.508 11.508c.559.559 1.505.58 2.064 0 .581-.56.56-1.506 0-2.065L37.066 35l11.508-11.53c.559-.558.58-1.483 0-2.043-.56-.58-1.506-.559-2.065 0L35 32.935 23.492 21.427c-.559-.559-1.505-.58-2.065 0-.58.56-.559 1.485 0 2.044L32.935 35 21.427 46.508z"
        fill="#fff"
      />
    </Svg>
  );
}

export default Decline;
