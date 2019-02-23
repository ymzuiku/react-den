## Example

```js
/* eslint-disable */
import React from 'react';
import { initDevelopment, useDen } from 'react-den';

initDevelopment(true);

const Sub = () => {
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
  const [getUser, updateGetUser] = useDen({
    path: ['user', 'get'],
    url: '/api/{parser}?name&age',
    variables: { parser: 'dog', name: 'dog', age: 125 },
  });

  const [getOnce, updateOne] = useDen({
    path: ['user', 'getOnce'],
    url: '/api/{parser}?name&age',
    variables: { parser: 'dog', name: 'once', age: 125 },
    once: true,
  });
  const [getInterval, setInterval, clearInterval] = useDen({
    path: ['user', 'getInvalid'],
    url: '/api/{parser}?name&age',
    variables: { parser: 'dog', name: 'getInterval', age: 125 },
    // interval: 500,
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
      <div onClick={() => updateGetUser({})}>getUser: {JSON.stringify(getUser)}</div>
      <div onClick={() => updateOne({ once: false })}>getOnce: {JSON.stringify(getOnce)}</div>
      <div onClick={() => clearInterval({ variables: 0 })}>getInterval: {JSON.stringify(getInterval)}</div>
      <div>getError: {JSON.stringify(getError)}</div>
      <div>postUser: {JSON.stringify(postUser)}</div>
      <div>postError: {JSON.stringify(postError)}</div>
    </div>
  );
};

export default () => {
  return (
    <>
      <Sub />
      <Sub />
      <Sub />
    </>
  );
};

```