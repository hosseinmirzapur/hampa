import { gql } from "@apollo/client";

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      phone
      name
      email
      avatarUrl
      bio
      hasSubscription
      subscriptionExpiryDate
    }
  }
`;

export const UPDATE_USER_PROFILE_MUTATION = gql`
  mutation UpdateUserProfile($updateUserProfileInput: UpdateUserProfileInput!) {
    updateUserProfile(updateUserProfileInput: $updateUserProfileInput) {
      id
      phone
      name
      email
      avatarUrl
      bio
      hasSubscription
      subscriptionExpiryDate
    }
  }
`;
