import { gql } from "@apollo/client";

// Define the structure of a RunnerCard as expected from the backend
export const RUNNER_CARD_FRAGMENT = gql`
  fragment RunnerCardFields on RunnerCardType {
    id
    title
    description
    imageUrl
    userId
    createdAt
    updatedAt
  }
`;

// Queries
export const GET_USER_CARDS = gql`
  query GetMyRunnerCards {
    myRunnerCards {
      ...RunnerCardFields
    }
  }
  ${RUNNER_CARD_FRAGMENT}
`;

export const GET_ALL_CARDS = gql`
  query GetAllCards {
    allRunnerCards {
      ...RunnerCardFields
    }
  }
  ${RUNNER_CARD_FRAGMENT}
`;

export const GET_CARD_BY_ID = gql`
  query GetCardById($id: String!) {
    runnerCard(id: $id) {
      ...RunnerCardFields
    }
  }
  ${RUNNER_CARD_FRAGMENT}
`;

// Mutations
export const CREATE_RUNNER_CARD_MUTATION = gql`
  mutation CreateRunnerCard($createRunnerCardInput: CreateRunnerCardInput!) {
    createRunnerCard(createRunnerCardInput: $createRunnerCardInput) {
      ...RunnerCardFields
    }
  }
  ${RUNNER_CARD_FRAGMENT}
`;

export const DELETE_RUNNER_CARD_MUTATION = gql`
  mutation DeleteRunnerCard($id: String!) {
    deleteRunnerCard(id: $id) {
      ...RunnerCardFields
    }
  }
  ${RUNNER_CARD_FRAGMENT}
`;

export const UPDATE_RUNNER_CARD_MUTATION = gql`
  mutation UpdateRunnerCard(
    $id: String!
    $updateRunnerCardInput: UpdateRunnerCardInput!
  ) {
    updateRunnerCard(id: $id, updateRunnerCardInput: $updateRunnerCardInput) {
      ...RunnerCardFields
    }
  }
  ${RUNNER_CARD_FRAGMENT}
`;
