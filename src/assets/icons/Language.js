import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Language({size, color}) {
  return (
    <Svg
      width={size || 640}
      height={size || 640}
      viewBox="0 0 480 480"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M240 0C107.453 0 0 107.453 0 240s107.453 240 240 240 240-107.453 240-240C479.852 107.516 372.484.148 240 0zm207.566 324.078l-68.253 11.777A358.15 358.15 0 00391.87 248h71.93a222.515 222.515 0 01-16.235 76.078zM16.2 248h71.93a358.15 358.15 0 0012.559 87.855l-68.254-11.777A222.515 222.515 0 0116.199 248zm16.235-92.078l68.254-11.777A358.15 358.15 0 0088.128 232H16.2a222.515 222.515 0 0116.235-76.078zM248 128.449a550.348 550.348 0 0185.762 7.832L362 141.152A343.397 343.397 0 01375.879 232H248zm88.488-7.937A567.067 567.067 0 00248 112.449v-96c45.863 4.406 85.703 46.399 108.281 107.512zM232 112.449a566.967 566.967 0 00-88.48 8.063l-19.801 3.425C146.297 62.81 186.137 20.802 232 16.415zm-85.754 23.832A550.206 550.206 0 01232 128.45V232H104.121A343.397 343.397 0 01118 141.152zM104.121 248H232v103.55a550.348 550.348 0 01-85.762-7.831L118 338.848A343.397 343.397 0 01104.121 248zm39.39 111.488A568.972 568.972 0 00232 367.594v96c-45.863-4.41-85.703-46.403-108.281-107.516zM248 367.594a568.916 568.916 0 0088.48-8.106l19.801-3.425C333.703 417.19 293.863 459.199 248 463.586zm85.754-23.875A550.206 550.206 0 01248 351.55V248h127.879A343.397 343.397 0 01362 338.848zM391.87 232a358.15 358.15 0 00-12.558-87.855l68.253 11.777A222.515 222.515 0 01463.801 232zm47.602-93.71L374.047 127a220.604 220.604 0 00-63.649-99.602A225.063 225.063 0 01439.473 138.29zM169.602 27.397A220.604 220.604 0 00105.953 127l-65.426 11.29A225.063 225.063 0 01169.602 27.397zM40.527 341.711L105.953 353a220.604 220.604 0 0063.649 99.602A225.063 225.063 0 0140.527 341.71zM310.398 452.6A220.604 220.604 0 00374.047 353l65.426-11.29a225.063 225.063 0 01-129.075 110.892zm0 0"
        fill={color || '#2A2A2A'}
      />
    </Svg>
  );
}

export default Language;
