import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Notification({size, color}) {
  return (
    <Svg
      width={size || 23}
      height={size || 23}
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M19.769 15.332l-.22-.266c-.988-1.196-1.586-1.917-1.586-5.3 0-1.753-.42-3.19-1.245-4.268-.61-.797-1.433-1.401-2.518-1.848a.134.134 0 01-.037-.03c-.39-1.307-1.459-2.183-2.663-2.183-1.205 0-2.273.876-2.663 2.182a.14.14 0 01-.037.03C6.268 4.69 5.037 6.69 5.037 9.763c0 3.385-.597 4.107-1.586 5.3-.072.087-.146.175-.22.267a1.58 1.58 0 00-.209 1.69c.277.584.868.946 1.542.946H18.44c.671 0 1.258-.362 1.536-.943a1.58 1.58 0 00-.207-1.692zM11.5 21.563a3.596 3.596 0 003.165-1.893.179.179 0 00-.16-.264H8.497a.179.179 0 00-.18.175.18.18 0 00.02.089 3.597 3.597 0 003.164 1.892z"
        fill={color || '#2A2A2A'}
      />
    </Svg>
  );
}

export default Notification;