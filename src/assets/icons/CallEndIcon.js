import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function CallEndIcon({size, color}) {
  return (
    <Svg
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M22.519 14.55l.207-1.131a3.399 3.399 0 00-1.065-3.095c-2.058-1.89-5.273-2.83-9.645-2.824-4.365.006-7.482.954-9.351 2.842-.792.8-1.08 1.986-.758 3.113l.324 1.131c.303 1.056 1.326 1.763 2.391 1.65l2.136-.224a2.025 2.025 0 001.8-1.687l.411-2.406a8.236 8.236 0 013.294-.774c1.18-.036 2.262.155 3.243.573l.663 2.571a2.294 2.294 0 001.973 1.71l2.148.216a2.03 2.03 0 002.227-1.665h.002z"
        fill={color || '#000'}
      />
    </Svg>
  );
}

export default CallEndIcon;
