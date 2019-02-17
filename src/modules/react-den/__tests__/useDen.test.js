// import React from 'react';
// import { useDen } from '../index';
const { useDen } = require('../index');

it('App initAndUnmount', () => {
  const [user, updateUser] = useDen({
    path: ['user', 'xiaoming'],
    data: {
      name: 'xiaoming',
      age: 11,
    },
  });
  expect(user).toEqual({ name: 'xiaoming', age: 11 });
});

// it('App updateNoChange', () => {
//   const wrapper = shallow(<App />);
//   const firstDebug = wrapper.debug();
//   expect(firstDebug).toMatchSnapshot('firstDebug');
//   wrapper.update();
//   expect(wrapper.debug()).toEqual(firstDebug);
// });
//
// it('App onClick status snapshots', () => {
//   const wrapper = shallow(<App />);
//
//   expect(wrapper.debug()).toMatchSnapshot('init');
//
//   for (let i = 0; i < 10; i++) {
//     wrapper.find('#info').simulate('click');
//   }
//   expect(wrapper.debug()).toMatchSnapshot('add');
//   expect(wrapper.state()).toMatchSnapshot('add-state');
// });
