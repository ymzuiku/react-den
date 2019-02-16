/** 用于本地存储的方法 */
const storage = {
  localName: 'defaultIOKey',
  save: (v, theKey = storage.localName) => {
    const theType = Object.prototype.toString.call(v);

    if (theType === '[object Object]') {
      localStorage.setItem(theKey, JSON.stringify(v));
    } else if (theType === '[object String]') {
      localStorage.setItem(theKey, v);
    } else {
      // eslint-disable-next-line
      console.warn('Warn: storage.save() param is no a Object');
    }
  },
  load: (theKey = storage.localName) => {
    try {
      const data = localStorage.getItem(theKey);

      if (data) {
        if (typeof data === 'string') {
          return JSON.parse(data);
        }
        return data;
      }
    } catch (err) {
      // eslint-disable-next-line
      console.warn('load last localSate error');
    }
  },
  clear: (theKey = storage.localName) => {
    localStorage.setItem(theKey, {});
  },
};

export default storage;
