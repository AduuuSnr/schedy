import axios from 'axios';

const get = (url, params, callback = null) => {
  if (typeof callback === 'function') {
    axios
      .get(url, {params})
      .then(res => callback(res?.data))
      .catch(err => callback(err));
  } else {
    axios
      .get(url)
      .then(res => params(res?.data))
      .catch(err => params(err));
  }
};

const post = (url, data, callback = null) => {
  if (typeof callback === 'function') {
    axios
      .post(url, data)
      .then(res => callback(res?.data))
      .catch(err => callback(err));
  } else {
    axios
      .post(url)
      .then(res => data(res?.data))
      .catch(err => data(err));
  }
};

export {get, post};
