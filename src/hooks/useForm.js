import {useState} from 'react';

export const useForm = initial => {
  const [inputs, setInputs] = useState(initial);

  const handler = val => {
    return text =>
      setInputs(prev => {
        const newData = {...prev};
        newData[val] = text;
        return newData;
      });
  };

  return {inputs, handler};
};
