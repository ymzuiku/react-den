import React from 'react';
import { useDen, initStateToImmutable, initMiddleware, middlewareAutoLocalStorage } from 'packages/react-den';
import useInput from 'packages/dom-hooks/useInput';

initStateToImmutable({
  user: {},
});

initMiddleware([middlewareAutoLocalStorage(['user'])], true);

function RenderBooks({ style, loading, error, data }) {
  if (loading) {
    return <div>loading...</div>;
  }
  if (error) {
    return <div style={{ color: '#f00' }}>{error}</div>;
  }
  if (data) {
    return data.map(v => (
      <div style={style} key={v.id}>
        {v.title}
      </div>
    ));
  }
  return null;
}

function HomeHello() {
  const [hello] = useDen({
    path: ['user', 'hello'],
    gql: `query {hello}`,
  });

  const [dog] = useDen({
    path: ['dog', 'theURLdog'],
    method: 'GET',
    url: 'http://127.0.0.1:5002/api/dog',
  });

  return (
    <>
      <div>home: {JSON.stringify(hello)}</div>
      <div>dog: {JSON.stringify(dog)}</div>
    </>
  );
}

function HomeLocal() {
  const [localBooks, updateLocalBooks] = useDen({
    path: ['user', 'localBooks'],
  });
  const [inputLocalValue, setInputLocalValue] = useInput();

  return (
    <>
      <RenderBooks name="local" {...localBooks} />
      <form
        onSubmit={e => {
          e.preventDefault();
          updateLocalBooks({ data: [...(localBooks.data || []), { id: inputLocalValue, title: inputLocalValue }] });
          setInputLocalValue('');
        }}
      >
        <input value={inputLocalValue} onChange={setInputLocalValue} />
      </form>
    </>
  );
}

function HomeGql() {
  const [gqlBooks, updateGqlBooks] = useDen({
    path: ['gql-user', 'books'],
    dataGetter: data => {
      if (data && data.addBook) {
        return data.addBook;
      }
      return data;
    },
    gql: `mutation fn($title: String){ addBook(title: $title){id \n title}}`,
  });
  const [inputValue, setInputValue] = useInput();

  return (
    <>
      <RenderBooks name="gql" style={{ color: '#f00' }} {...gqlBooks} />
      <form
        onSubmit={e => {
          e.preventDefault();
          updateGqlBooks({
            data: { title: inputValue },
            optimistic: [...(gqlBooks.data || []), { id: inputValue, title: inputValue }],
          });
          setInputValue('');
        }}
      >
        <input value={inputValue} onChange={setInputValue} />
      </form>
    </>
  );
}

function Home() {
  return (
    <>
      <HomeHello />
      <HomeLocal />
      <HomeGql />
    </>
  );
}

export default Home;
