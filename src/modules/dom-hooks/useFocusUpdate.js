import React from 'react';

export default () => {
  const [updateValue, setUpdate] = React.useState(true);

  function focusUpdate() {
    setUpdate(!updateValue);
  }
  return focusUpdate;
};
