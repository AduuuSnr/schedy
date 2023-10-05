/* eslint-disable react-hooks/exhaustive-deps */
import {useState, useEffect} from 'react';
import axios from 'axios';

export const useGet = (url, params = null) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(url, params ? {params} : {})
      .then(res => setData(res?.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return [loading, data, error];
};

export const usePost = (url, params = null) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .post(url, params ? params : {})
      .then(res => {
        setData(res?.data);
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return [loading, data, error];
};
