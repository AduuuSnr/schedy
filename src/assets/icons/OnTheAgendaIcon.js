import * as React from 'react';
import Svg, {Circle} from 'react-native-svg';

function OnTheAgendaIcon({size}) {
  return (
    <Svg
      width={size || 18}
      height={size || 18}
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle cx={9} cy={9} r={5.625} fill="#FFB459" />
      <Circle cx={9} cy={9} r={8.5} stroke="#FFB459" />
    </Svg>
  );
}

export default OnTheAgendaIcon;
