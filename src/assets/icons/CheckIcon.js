import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function CheckIcon({size}) {
  return (
    <Svg
      width={size || 39}
      height={size || 33}
      viewBox="0 0 39 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M32.638.222L12.766 20.094 6.32 13.649 0 19.97l6.445 6.445 6.362 6.362 6.321-6.32L39 6.583 32.638.222z"
        fill="#4A43EC"
      />
    </Svg>
  );
}

export default CheckIcon;
