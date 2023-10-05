import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

function SendButton({size}) {
  return (
    <Svg
      width={size || 40}
      height={size || 40}
      fill="none"
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx={20} cy={20} r={20} fill="#3D50DF" />
      <Path
        d="M14.707 11.98l15.05 7.198a.893.893 0 010 1.611l-15.05 7.199a.893.893 0 01-1.247-1.041l1.506-5.52a.357.357 0 01.296-.26l7.293-.99a.178.178 0 00.14-.107l.012-.045a.179.179 0 00-.112-.192l-.04-.01-7.285-.99a.358.358 0 01-.296-.26L13.46 13.02a.892.892 0 011.247-1.04z"
        fill="#fff"
      />
    </Svg>
  );
}

export default SendButton;
