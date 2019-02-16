module.exports = {
  '/graphql': {
    target: 'http://127.0.0.1:5002',
  },
  '/api/*': {
    target: 'http://127.0.0.1:5002',
  },
};
