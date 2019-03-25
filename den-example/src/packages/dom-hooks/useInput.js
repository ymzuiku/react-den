import React from 'react';

export default (value = '') => {
  const [inputValue, setInputValue] = React.useState(value);

  function handleSetInputValue(e) {
    if (typeof e === 'string') {
      setInputValue(e);
    } else if (e !== void 0 && e.target) {
      setInputValue(e.target.value);
    }
  }
  return [inputValue, handleSetInputValue];
};
