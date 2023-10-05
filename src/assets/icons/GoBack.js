import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function GoBack({size, color}) {
  return (
    <Svg
      width={size || 11}
      height={size || 19}
      viewBox="0 0 11 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M9.175 19c-.235 0-.467-.044-.68-.131a1.56 1.56 0 01-.546-.371L.358 10.356A1.249 1.249 0 010 9.494c0-.314.126-.619.358-.862L8.216.49c.267-.277.65-.451 1.066-.484.415-.033.83.077 1.15.308.321.23.523.561.561.92.039.359-.09.716-.357.993L3.611 9.501l6.79 7.273c.192.2.314.442.352.7.037.257-.011.518-.14.752a1.447 1.447 0 01-.588.569c-.255.137-.55.208-.85.205z"
        fill={color || '#000'}
      />
    </Svg>
  );
}

export default GoBack;
