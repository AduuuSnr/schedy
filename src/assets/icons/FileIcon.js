import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function FileIcon({size}) {
  return (
    <Svg
      width={size || 46}
      height={size || 46}
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M36.944 13.369L26.88 3.306c-.287-.287-.575-.431-1.006-.431H11.5A2.883 2.883 0 008.625 5.75v34.5a2.883 2.883 0 002.875 2.875h23a2.883 2.883 0 002.875-2.875V14.375c0-.431-.144-.719-.431-1.006zM25.875 6.325l8.05 8.05h-8.05v-8.05zM34.5 40.25h-23V5.75H23v8.625a2.883 2.883 0 002.875 2.875H34.5v23z"
        fill="#FFF"
      />
      <Path
        d="M14.375 31.625h17.25V34.5h-17.25v-2.875zM14.375 23h17.25v2.875h-17.25V23z"
        fill="#FFF"
      />
    </Svg>
  );
}

export default FileIcon;
