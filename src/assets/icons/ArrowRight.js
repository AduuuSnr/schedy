import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

function ArrowRight({size, color}) {
  return (
    <Svg
      width={size || 30}
      height={size || 30}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx={15} cy={15} r={15} fill="#3D56F0" />
      <Path
        d="M8 14.5c0-.449.364-.813.813-.813h9.059l-3.961-3.96a.819.819 0 011.158-1.158l5.867 5.867a.091.091 0 010 .128L15.07 20.43a.806.806 0 01-1.143-1.137l3.945-3.98h-9.06A.813.813 0 018 14.5z"
        fill="#fff"
      />
    </Svg>
  );
}

export default ArrowRight;
