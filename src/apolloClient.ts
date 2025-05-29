import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
  makeVar, // Import makeVar
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const GRAPHQL_ENDPOINT =
  import.meta.env.VITE_REACT_APP_GRAPHQL_ENDPOINT ||
  "http://localhost:3000/graphql";

// Create a reactive variable for the authentication token
export const authTokenVar = makeVar<string | null>(
  localStorage.getItem("hampa-auth-token") // Initialize from localStorage
);

const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
});

const authLink = setContext((_, { headers }) => {
  const token = authTokenVar(); // Get token from reactive variable
  const newHeaders = {
    ...headers,
    authorization: token ? `Bearer ${token}` : "",
  };
  return {
    headers: newHeaders,
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
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
  connectToDevTools: process.env.NODE_ENV === "development",
});

export default client;
