/* eslint-disable */
import React from 'react';
import { useDen, initStateToImmutable, initMiddleware, middlewareAutoLocalStorage } from 'packages/react-den';

initStateToImmutable({
  user: {},
});

initMiddleware([middlewareAutoLocalStorage('react-den-example', ['user'])], true);

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

function HomeLocal() {
  const [localBooks, updateLocalBooks] = useDen({
    path: ['user', 'localBooks'],
  });

  return (
    <>
      <RenderBooks name="local" {...localBooks} />
      <form
        onSubmit={e => {
          e.preventDefault();
          const input = document.querySelector('#home-local');
          const inputValue = input.value;
          updateLocalBooks({ nextData: [...(localBooks.data || []), { id: inputValue, title: inputValue }] });
        }}
      >
        <input id="home-local" />
      </form>
    </>
  );
}

function HomeFetch() {
  const [gqlBooks, updateGqlBooks] = useDen({
    path: ['fetch-user', 'books'],
    dataGetter: data => {
      if (data && data.addBook) {
        return data.addBook;
      }
      return data;
    },
    gql: `mutation fn($title: String){ addBook(title: $title){id \n title}}`,

    // isSetState: false,
  });

  // 这个虽然是相同的 path, 但是不会更新, 因为设置了 isSetState:false
  // eslint-disable-next-line
  const [gqlBooks2, updateGqlBooks2] = useDen({
    path: ['fetch-user', 'books'],
    dataGetter: data => {
      if (data && data.addBook) {
        return data.addBook;
      }
      return data;
    },
    gql: `mutation fn($title: String){ addBook(title: $title){id \n title}}`,
    isSetState: false,
  });

  console.log('re-render');
  return (
    <>
      <RenderBooks name="gql" style={{ color: '#f00' }} {...gqlBooks} />
      <form
        onSubmit={e => {
          e.preventDefault();
          const input = document.querySelector('#home-fetch');
          const inputValue = input.value;
          updateGqlBooks({
            nextData: { title: inputValue },
            optimistic: [...(gqlBooks.data || []), { id: inputValue, title: inputValue }],
          });
        }}
      >
        <input id="home-fetch" />
      </form>
    </>
  );
}

function HomeGqlQuery() {
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

function HomeGqlMutation() {
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

  return (
    <>
      <RenderBooks name="gql" style={{ color: '#f00' }} {...gqlBooks} />
      <form
        onSubmit={e => {
          e.preventDefault();

          const inputValue = document.querySelector('#home-gql-mutation"').nodeValue;
          document.querySelector('#home-fetch').nodeValue = '';

          updateGqlBooks({
            nextData: { title: inputValue },
            optimistic: [...(gqlBooks.data || []), { id: inputValue, title: inputValue }],
          });
        }}
      >
        <input id="home-gql-mutation" />
      </form>
    </>
  );
}

function Home() {
  return (
    <>
      {/*<HomeLocal />*/}
      <HomeFetch />
      {/*<HomeGqlQuery />*/}
      {/*<HomeGqlMutation />*/}
    </>
  );
}

export default Home;
