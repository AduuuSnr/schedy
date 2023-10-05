import {useState} from 'react';

export const useInput = (initial = '') => {
  const [input, setInput] = useState(initial);
  const onChangeText = text => setInput(text);

  return [input, onChangeText];
};
