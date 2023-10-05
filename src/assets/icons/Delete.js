import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Delete({size, color}) {
  return (
    <Svg
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M21.5 6a1 1 0 01-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0115.687 22H8.313a2.75 2.75 0 01-2.737-2.48L4.345 7H3.5a1 1 0 010-2h5a3.5 3.5 0 117 0h5a1 1 0 011 1zm-7.25 3.25a.75.75 0 00-.743.648L13.5 10v7l.007.102a.75.75 0 001.486 0L15 17v-7l-.007-.102a.75.75 0 00-.743-.648zm-4.5 0a.75.75 0 00-.743.648L9 10v7l.007.102a.75.75 0 001.486 0L10.5 17v-7l-.007-.102a.75.75 0 00-.743-.648zM12 3.5A1.5 1.5 0 0010.5 5h3A1.5 1.5 0 0012 3.5z"
        fill={color || '#000'}
      />
    </Svg>
  );
}

export default Delete;
