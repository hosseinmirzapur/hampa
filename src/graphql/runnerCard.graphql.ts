import { gql } from '@apollo/client';

// Define the structure of a RunnerCard as expected from the backend
export const RUNNER_CARD_FRAGMENT = gql`
  fragment RunnerCardFields on RunnerCard {
    id
    name
    location
    days
    time
    phoneNumber
    isPhoneNumberPublic
    # Add other fields as they become available in the backend User type
    owner {
      id
      phoneNumber
      # You might want to add other user fields here if needed on the frontend
      # e.g., name, profilePicture
    }
  }
`;

// Queries
export const GET_USER_CARDS = gql`
  query GetUserCards {
    # Assuming the backend has a query to get cards for the authenticated user
    # Based on the backend analysis, there isn't a dedicated 'userRunnerCards' query yet.
    # We will use 'runnerCards' and potentially filter on the frontend for now,
    # or ideally, add a dedicated query to the backend later for efficiency.
    # For this diff, we'll define the query assuming a future backend 'userRunnerCards' query
    # or use the existing 'runnerCards' query if filtering on the frontend is intended.
    # Let's assume we will add a dedicated user query in the backend:
    userRunnerCards {
      ...RunnerCardFields
    }
  }
  ${RUNNER_CARD_FRAGMENT}
`;

export const GET_ALL_CARDS = gql`
  query GetAllCards {
    runnerCards {
      ...RunnerCardFields
    }
  }
  ${RUNNER_CARD_FRAGMENT}
`;

export const GET_CARD_BY_ID = gql`
  query GetCardById($cardId: ID!) {
    runnerCard(id: $cardId) {
      ...RunnerCardFields
    }
  }
  ${RUNNER_CARD_FRAGMENT}
`;

// Mutations
export const CREATE_RUNNER_CARD_MUTATION = gql`
  mutation CreateRunnerCard($input: CreateRunnerCardInput!) {
    createRunnerCard(input: $input) {
      ...RunnerCardFields
    }
  }
  ${RUNNER_CARD_FRAGMENT}
`;

// Note: Mutations for delete, update visibility, and express interest can return
// a subset of fields or just the ID/success status depending on frontend needs.
// Returning the full object allows the cache to be updated more easily.

export const DELETE_RUNNER_CARD_MUTATION = gql`
  mutation DeleteRunnerCard($cardId: ID!) {
    deleteCard(id: $cardId) {
      # Return ID to easily update the cache
      id
    }
  }
`;

export const UPDATE_CARD_VISIBILITY_MUTATION = gql`
  mutation UpdateCardVisibility($input: UpdateCardVisibilityInput!) {
    updateCardVisibility(input: $input) {
      # Return ID and the updated field to update the cache
      id
      isPhoneNumberPublic
    }
  }
`;

export const EXPRESS_INTEREST_MUTATION = gql`
  mutation ExpressInterest($input: ExpressInterestInput!) {
    expressInterest(input: $input) {
      # Return ID and potentially the updated list of interested users
      # if that field is added to the RunnerCard type in the backend
      id
      # interestedUsers { id } // Uncomment if interestedUsers is added to the RunnerCard type
      # Assuming the backend returns the updated RunnerCard object after expressing interest:
      ...RunnerCardFields
    }
  }
  ${RUNNER_CARD_FRAGMENT}
`;
import { gql } from '@apollo/client';

// Define the structure of a RunnerCard as expected from the backend
export const RUNNER_CARD_FRAGMENT = gql`
  fragment RunnerCardFields on RunnerCard {
    id
    name
    location
    days
    time
    phoneNumber
    isPhoneNumberPublic
    # Add other fields as they become available in the backend User type
    owner {
      id
      phoneNumber
    }
  }
`;

// Queries
export const GET_USER_CARDS = gql`
  query GetUserCards {
    # Assuming the backend has a query to get cards for the authenticated user
    # If not, we'll need to create one or filter on the frontend from getAllCards
    # For now, let's assume a dedicated query for user cards
    userRunnerCards {
      ...RunnerCardFields
    }
  }
  ${RUNNER_CARD_FRAGMENT}
`;

export const GET_ALL_CARDS = gql`
  query GetAllCards {
    runnerCards {
      ...RunnerCardFields
    }
  }
  ${RUNNER_CARD_FRAGMENT}
`;

export const GET_CARD_BY_ID = gql`
  query GetCardById($cardId: ID!) {
    runnerCard(id: $cardId) {
      ...RunnerCardFields
    }
  }
  ${RUNNER_CARD_FRAGMENT}
`;

// Mutations
export const CREATE_RUNNER_CARD_MUTATION = gql`
  mutation CreateRunnerCard($input: CreateRunnerCardInput!) {
    createRunnerCard(input: $input) {
      ...RunnerCardFields
    }
  }
  ${RUNNER_CARD_FRAGMENT}
`;

export const DELETE_RUNNER_CARD_MUTATION = gql`
  mutation DeleteRunnerCard($cardId: ID!) {
    deleteCard(id: $cardId) {
      id
    }
  }
`;

export const UPDATE_CARD_VISIBILITY_MUTATION = gql`
  mutation UpdateCardVisibility($input: UpdateCardVisibilityInput!) {
    updateCardVisibility(input: $input) {
      id
      isPhoneNumberPublic
    }
  }
`;

export const EXPRESS_INTEREST_MUTATION = gql`
  mutation ExpressInterest($input: ExpressInterestInput!) {
    expressInterest(input: $input) {
      # Return relevant fields after expressing interest,
      # possibly the updated list of interested users or just success confirmation
      id
      # interestedUsers // Uncomment if interestedUsers is added to the RunnerCard type
    }
  }
`;