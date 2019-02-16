/* eslint-disable */
import React from 'react';
import { useDen } from 'modules/react-den';

export default () => {
  const [gql] = useDen({
    path: ['user', 'gql'],
    gql: `mutation AddBook($title: String){
      addBook(title: $title, author: "tester") {
        id
        title
        author
      }
    }`,
    variables: { title: 'dog' },
  });
  const [getUser] = useDen({
    path: ['user', 'get'],
    url: '/api/{parser}?name&age',
    variables: { parser: 'dog', name: 'dog', age: 125 },
  });
  const [getError] = useDen({
    path: ['user', 'get-error'],
    url: '/api/error',
    variables: { title: 'dog' },
  });
  const [postUser] = useDen({
    path: ['user', 'get'],
    url: '/api/dog',
    method: 'POST',
    body: { title: 'dog' },
  });
  const [postError] = useDen({
    path: ['user', 'get-error'],
    url: '/api/error',
    method: 'POST',
    body: { title: 'dog' },
  });

  return (
    <div>
      <header>head</header>
      <div>banner</div>
      <div>test:</div>
      <div>gql: {JSON.stringify(gql)}</div>
      <div>getUser: {JSON.stringify(getUser)}</div>
      <div>getError: {JSON.stringify(getError)}</div>
      <div>postUser: {JSON.stringify(postUser)}</div>
      <div>postError: {JSON.stringify(postError)}</div>
    </div>
  );
};
