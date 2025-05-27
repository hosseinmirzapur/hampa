import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql';

const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
});

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from wherever it's stored (e.g., localStorage)
  const token = localStorage.getItem('hampa-auth-token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]), // Ensure authLink comes before httpLink
  cache: new InMemoryCache({
    // Optional: Configure type policies for cache normalization if needed
    // typePolicies: {
    //   User: {
    //     keyFields: ["id"],
    //   },
    //   RunnerCard: {
    //     keyFields: ["id"],
    //   },
    //   // ... other types
    // }
  }),
  connectToDevTools: process.env.NODE_ENV === 'development', // Enable Apollo DevTools in development
});

export default client;
