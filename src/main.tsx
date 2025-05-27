import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql', // Assuming backend GraphQL endpoint
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
 <ApolloProvider client={client}>
 <App />
 </ApolloProvider>
    </BrowserRouter>
  </StrictMode>
);