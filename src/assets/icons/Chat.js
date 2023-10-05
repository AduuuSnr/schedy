import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Chat({size, color}) {
  return (
    <Svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C6.486 2 2 5.589 2 10c0 2.908 1.898 5.515 5 6.934V22l5.34-4.005C17.697 17.852 22 14.32 22 10c0-4.411-4.486-8-10-8z"
        fill={color || '#2F80ED'}
      />
    </Svg>
  );
}

export default Chat;
