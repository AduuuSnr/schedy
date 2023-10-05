import {launchImageLibrary} from 'react-native-image-picker';

export const ImagePicker = (cb, isMulti) => {
  launchImageLibrary(
    {mediaType: 'photo', selectionLimit: isMulti ? 0 : 1},
    res => {
      if (!res.didCancel) {
        // console.log(res);
        cb(res.assets);
      }
    },
  );
};
