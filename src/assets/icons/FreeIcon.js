import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent({size}) {
  return (
    <Svg
      width={size || 30}
      height={size || 30}
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M26.68 16.817L14.455 4.788c-.548-.549-1.268-.622-1.987-.622H4.069c-1.545 0-2.402.858-2.402 2.403v8.402c0 .717.074 1.436.621 1.983l12.129 12.227a2.739 2.739 0 003.906 0l8.383-8.407c1.092-1.093 1.067-2.865-.025-3.957zm-19.662-7.3a1.248 1.248 0 11-1.765-1.764 1.248 1.248 0 011.765 1.764z"
        fill="#FFD983"
      />
      <Path
        d="M8.293 6.477a3.05 3.05 0 00-5.21 2.158 3.053 3.053 0 105.21-2.158zM7.018 9.518a1.25 1.25 0 11-1.8-1.732 1.25 1.25 0 011.8 1.732z"
        fill="#D99E82"
      />
      <Path
        d="M7.09 8.75a.834.834 0 01-1.18-1.178l7.07-7.07a.833.833 0 111.18 1.178L7.09 8.75z"
        fill="#C1694F"
      />
    </Svg>
  );
}

export default SvgComponent;