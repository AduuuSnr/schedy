import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function TasksIcon({color, size}) {
  return (
    <Svg
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M13.75 2h-3.5a2.25 2.25 0 00-2.236 2H6.25A2.25 2.25 0 004 6.25v13.5A2.25 2.25 0 006.25 22h11.5A2.249 2.249 0 0020 19.75V6.25A2.25 2.25 0 0017.75 4h-1.764a2.25 2.25 0 00-2.236-2zm-3.5 1.5h3.5a.75.75 0 110 1.5h-3.5a.75.75 0 010-1.5zm2.25 6.75a.75.75 0 01.75-.75h3.5a.75.75 0 110 1.5h-3.5a.75.75 0 01-.75-.75zm.75 4.75h3.5a.75.75 0 110 1.5h-3.5a.75.75 0 110-1.5zm-2.47-5.22l-2 2a.75.75 0 01-1.06 0l-1-1a.75.75 0 111.06-1.06l.47.47 1.47-1.47a.75.75 0 111.06 1.06zm0 4.44a.75.75 0 010 1.06l-2 2a.75.75 0 01-1.06 0l-1-1a.75.75 0 111.06-1.06l.47.47 1.47-1.47a.75.75 0 011.06 0z"
        fill={color || '#D5D7DC'}
      />
    </Svg>
  );
}

export default TasksIcon;
