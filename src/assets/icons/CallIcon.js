import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function CallIcon({size, color}) {
  return (
    <Svg
      width={size || 25}
      height={size || 24}
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M8.663 2.48a2.4 2.4 0 012.792 1.134l.09.18.793 1.764a2.996 2.996 0 01-.53 3.262l-.159.158-1.252 1.168c-.226.213-.057 1.04.76 2.454.734 1.272 1.332 1.866 1.625 1.898h.052l.064-.012 2.46-.752a1.8 1.8 0 011.876.53l.11.137 1.628 2.256a2.4 2.4 0 01-.149 2.997l-.146.15-.652.618a4.2 4.2 0 01-4.458.845c-2.322-.936-4.431-3.074-6.348-6.393-1.92-3.328-2.718-6.228-2.361-8.712a4.2 4.2 0 012.714-3.347l.232-.077.859-.259z"
        fill={color || '#000'}
      />
    </Svg>
  );
}

export default CallIcon;
