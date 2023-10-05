import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Responsibles({size}) {
  return (
    <Svg
      width={size || 18}
      height={size || 18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M1.5 18S0 18 0 16.5s1.5-6 9-6 9 4.5 9 6-1.5 1.5-1.5 1.5h-15zM9 9a4.5 4.5 0 100-9 4.5 4.5 0 000 9z"
        fill="#4A43EC"
      />
    </Svg>
  );
}

export default Responsibles;
