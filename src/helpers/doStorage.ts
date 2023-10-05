import {RNS3} from 'react-native-aws3';

export const doStorage = (
  uploadPath: string,
  uri: string,
  name: string,
  type: string,
  setState: (param: string) => void,
  image,
) => {
  const file = {
    uri,
    name,
    type: type,
  };

  const options = {
    keyPrefix: uploadPath,
    bucket: 'bagenda-space',
    region: 'fra1',
    accessKey: 'WXTF5AXT4ROOT2JP2MUD',
    secretKey: '9bVIQkHlq5rQP0SvlFslx6MZWtiX+nETjHcc+4w3Rp0',
    successActionStatus: 201,
    awsUrl: 'fra1.digitaloceanspaces.com',
  };

  RNS3.put(file, options).then(response => {
    // console.log(response);
    if (Array.isArray(image)) {
      setState(oldArray => [
        ...oldArray,
        'https://bagenda-space.fra1.cdn.digitaloceanspaces.com/' +
          uploadPath +
          name,
      ]);
    } else {
      setState(
        'https://bagenda-space.fra1.cdn.digitaloceanspaces.com/' +
          uploadPath +
          name,
      );
    }
  });
};

export const doStorageURL = async (
  uploadPath: string,
  uri: string,
  name: string,
  type: string,
) => {
  const file = {
    uri,
    name,
    type: type,
  };

  const options = {
    keyPrefix: uploadPath,
    bucket: 'bagenda-space',
    region: 'fra1',
    accessKey: 'WXTF5AXT4ROOT2JP2MUD',
    secretKey: '9bVIQkHlq5rQP0SvlFslx6MZWtiX+nETjHcc+4w3Rp0',
    successActionStatus: 201,
    awsUrl: 'fra1.digitaloceanspaces.com',
  };

  await RNS3.put(file, options);
  const url =
    'https://bagenda-space.fra1.cdn.digitaloceanspaces.com/' +
    uploadPath +
    name;

  return url;
};
