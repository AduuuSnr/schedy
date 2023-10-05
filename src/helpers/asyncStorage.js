import AsyncStorage from '@react-native-async-storage/async-storage';

const setData = (key, value, callback) => {
  AsyncStorage.setItem(key, JSON.stringify(value), error => {
    callback(error ? error : true);
  });
};

const getData = (key, callback) => {
  AsyncStorage.getItem(key, (error, result) => {
    if (error) callback(error);
    else callback(JSON.parse(result));
  });
};

const delData = (key, callback) => {
  AsyncStorage.removeItem(key, error => {
    callback(error ? error : true);
  });
};

export {setData, getData, delData};
