import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken: Scalars['String']['output'];
  user: UserProfileType;
};

export type CreateJointRunInput = {
  dateTime: Scalars['DateTime']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  title: Scalars['String']['input'];
};

export type CreateRunnerCardInput = {
  days: Array<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  isPhoneNumberPublic: Scalars['Boolean']['input'];
  location: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  time: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type JoinRunInput = {
  jointRunId: Scalars['String']['input'];
  runnerCardId?: InputMaybe<Scalars['String']['input']>;
  status?: Scalars['String']['input'];
};

export type JointRunParticipantType = {
  __typename?: 'JointRunParticipantType';
  id: Scalars['String']['output'];
  joinedAt: Scalars['DateTime']['output'];
  jointRun?: Maybe<JointRunType>;
  jointRunId: Scalars['String']['output'];
  runnerCard?: Maybe<RunnerCardType>;
  runnerCardId?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  user?: Maybe<UserProfileType>;
  userId: Scalars['String']['output'];
};

export type JointRunType = {
  __typename?: 'JointRunType';
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<UserProfileType>;
  createdById: Scalars['String']['output'];
  dateTime: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  latitude?: Maybe<Scalars['Float']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  participants?: Maybe<Array<JointRunParticipantType>>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type LoginInput = {
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createJointRun: JointRunType;
  createRunnerCard: RunnerCardType;
  deleteJointRun: JointRunType;
  deleteRunnerCard: RunnerCardType;
  joinRun: JointRunParticipantType;
  leaveRun: JointRunParticipantType;
  login: AuthPayload;
  markNotificationAsRead: NotificationType;
  requestOtp: Scalars['String']['output'];
  testProtectedRoute: Scalars['String']['output'];
  updateJointRun: JointRunType;
  updateRunnerCard: RunnerCardType;
  updateUserProfile: UserProfileType;
  verifyOtpAndRegisterUser: UserProfileType;
};


export type MutationCreateJointRunArgs = {
  createJointRunInput: CreateJointRunInput;
};


export type MutationCreateRunnerCardArgs = {
  createRunnerCardInput: CreateRunnerCardInput;
};


export type MutationDeleteJointRunArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteRunnerCardArgs = {
  id: Scalars['String']['input'];
};


export type MutationJoinRunArgs = {
  joinRunInput: JoinRunInput;
};


export type MutationLeaveRunArgs = {
  jointRunId: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  loginInput: LoginInput;
};


export type MutationMarkNotificationAsReadArgs = {
  notificationId: Scalars['String']['input'];
};


export type MutationRequestOtpArgs = {
  requestOtpInput: RequestOtpInput;
};


export type MutationUpdateJointRunArgs = {
  id: Scalars['String']['input'];
  updateJointRunInput: UpdateJointRunInput;
};


export type MutationUpdateRunnerCardArgs = {
  id: Scalars['String']['input'];
  updateRunnerCardInput: UpdateRunnerCardInput;
};


export type MutationUpdateUserProfileArgs = {
  updateUserProfileInput: UpdateUserProfileInput;
};


export type MutationVerifyOtpAndRegisterUserArgs = {
  verifyOtpAndRegisterUserInput: VerifyOtpAndRegisterUserInput;
};

export type NotificationType = {
  __typename?: 'NotificationType';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  isRead: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  relatedEntityId?: Maybe<Scalars['String']['output']>;
  relatedEntityType?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  allJointRuns: Array<JointRunType>;
  allRunnerCards: Array<RunnerCardType>;
  jointRun?: Maybe<JointRunType>;
  me: UserProfileType;
  myJoinedRuns: Array<JointRunParticipantType>;
  myNotifications: Array<NotificationType>;
  myOrganizedRuns: Array<JointRunType>;
  myRunnerCards: Array<RunnerCardType>;
  runnerCard?: Maybe<RunnerCardType>;
  user?: Maybe<UserProfileType>;
};


export type QueryJointRunArgs = {
  id: Scalars['String']['input'];
};


export type QueryRunnerCardArgs = {
  id: Scalars['String']['input'];
};


export type QueryUserArgs = {
  id: Scalars['String']['input'];
};

export type RequestOtpInput = {
  phone: Scalars['String']['input'];
};

export type RunnerCardType = {
  __typename?: 'RunnerCardType';
  createdAt: Scalars['DateTime']['output'];
  days: Array<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  isPhoneNumberPublic: Scalars['Boolean']['output'];
  location: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  time: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

export type UpdateJointRunInput = {
  dateTime?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateRunnerCardInput = {
  days?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  isPhoneNumberPublic?: InputMaybe<Scalars['Boolean']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  time?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserProfileInput = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  hasSubscription?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  subscriptionExpiryDate?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UserProfileType = {
  __typename?: 'UserProfileType';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email?: Maybe<Scalars['String']['output']>;
  hasSubscription: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  phone: Scalars['String']['output'];
  subscriptionExpiryDate?: Maybe<Scalars['DateTime']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type VerifyOtpAndRegisterUserInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  otp: Scalars['String']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
  phone: Scalars['String']['input'];
};

export type RunnerCardFieldsFragment = { __typename?: 'RunnerCardType', id: string, title: string, description?: string | null, imageUrl?: string | null, location: string, days: Array<string>, time: string, phoneNumber: string, isPhoneNumberPublic: boolean, userId: string, createdAt: any, updatedAt: any };

export type GetMyRunnerCardsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyRunnerCardsQuery = { __typename?: 'Query', myRunnerCards: Array<{ __typename?: 'RunnerCardType', id: string, title: string, description?: string | null, imageUrl?: string | null, location: string, days: Array<string>, time: string, phoneNumber: string, isPhoneNumberPublic: boolean, userId: string, createdAt: any, updatedAt: any }> };

export type GetAllCardsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCardsQuery = { __typename?: 'Query', allRunnerCards: Array<{ __typename?: 'RunnerCardType', id: string, title: string, description?: string | null, imageUrl?: string | null, location: string, days: Array<string>, time: string, phoneNumber: string, isPhoneNumberPublic: boolean, userId: string, createdAt: any, updatedAt: any }> };

export type GetCardByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetCardByIdQuery = { __typename?: 'Query', runnerCard?: { __typename?: 'RunnerCardType', id: string, title: string, description?: string | null, imageUrl?: string | null, location: string, days: Array<string>, time: string, phoneNumber: string, isPhoneNumberPublic: boolean, userId: string, createdAt: any, updatedAt: any } | null };

export type CreateRunnerCardMutationVariables = Exact<{
  createRunnerCardInput: CreateRunnerCardInput;
}>;


export type CreateRunnerCardMutation = { __typename?: 'Mutation', createRunnerCard: { __typename?: 'RunnerCardType', id: string, title: string, description?: string | null, imageUrl?: string | null, location: string, days: Array<string>, time: string, phoneNumber: string, isPhoneNumberPublic: boolean, userId: string, createdAt: any, updatedAt: any } };

export type DeleteRunnerCardMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteRunnerCardMutation = { __typename?: 'Mutation', deleteRunnerCard: { __typename?: 'RunnerCardType', id: string, title: string, description?: string | null, imageUrl?: string | null, location: string, days: Array<string>, time: string, phoneNumber: string, isPhoneNumberPublic: boolean, userId: string, createdAt: any, updatedAt: any } };

export type UpdateRunnerCardMutationVariables = Exact<{
  id: Scalars['String']['input'];
  updateRunnerCardInput: UpdateRunnerCardInput;
}>;


export type UpdateRunnerCardMutation = { __typename?: 'Mutation', updateRunnerCard: { __typename?: 'RunnerCardType', id: string, title: string, description?: string | null, imageUrl?: string | null, location: string, days: Array<string>, time: string, phoneNumber: string, isPhoneNumberPublic: boolean, userId: string, createdAt: any, updatedAt: any } };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', me: { __typename?: 'UserProfileType', id: string, phone: string, name?: string | null, email?: string | null, avatarUrl?: string | null, bio?: string | null, hasSubscription: boolean, subscriptionExpiryDate?: any | null } };

export type UpdateUserProfileMutationVariables = Exact<{
  updateUserProfileInput: UpdateUserProfileInput;
}>;


export type UpdateUserProfileMutation = { __typename?: 'Mutation', updateUserProfile: { __typename?: 'UserProfileType', id: string, phone: string, name?: string | null, email?: string | null, avatarUrl?: string | null, bio?: string | null, hasSubscription: boolean, subscriptionExpiryDate?: any | null } };

export const RunnerCardFieldsFragmentDoc = gql`
    fragment RunnerCardFields on RunnerCardType {
  id
  title
  description
  imageUrl
  location
  days
  time
  phoneNumber
  isPhoneNumberPublic
  userId
  createdAt
  updatedAt
}
    `;
export const GetMyRunnerCardsDocument = gql`
    query GetMyRunnerCards {
  myRunnerCards {
    ...RunnerCardFields
  }
}
    ${RunnerCardFieldsFragmentDoc}`;

/**
 * __useGetMyRunnerCardsQuery__
 *
 * To run a query within a React component, call `useGetMyRunnerCardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyRunnerCardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyRunnerCardsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyRunnerCardsQuery(baseOptions?: Apollo.QueryHookOptions<GetMyRunnerCardsQuery, GetMyRunnerCardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyRunnerCardsQuery, GetMyRunnerCardsQueryVariables>(GetMyRunnerCardsDocument, options);
      }
export function useGetMyRunnerCardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyRunnerCardsQuery, GetMyRunnerCardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyRunnerCardsQuery, GetMyRunnerCardsQueryVariables>(GetMyRunnerCardsDocument, options);
        }
export type GetMyRunnerCardsQueryHookResult = ReturnType<typeof useGetMyRunnerCardsQuery>;
export type GetMyRunnerCardsLazyQueryHookResult = ReturnType<typeof useGetMyRunnerCardsLazyQuery>;
export type GetMyRunnerCardsQueryResult = Apollo.QueryResult<GetMyRunnerCardsQuery, GetMyRunnerCardsQueryVariables>;
export const GetAllCardsDocument = gql`
    query GetAllCards {
  allRunnerCards {
    ...RunnerCardFields
  }
}
    ${RunnerCardFieldsFragmentDoc}`;

/**
 * __useGetAllCardsQuery__
 *
 * To run a query within a React component, call `useGetAllCardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllCardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllCardsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllCardsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllCardsQuery, GetAllCardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllCardsQuery, GetAllCardsQueryVariables>(GetAllCardsDocument, options);
      }
export function useGetAllCardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllCardsQuery, GetAllCardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllCardsQuery, GetAllCardsQueryVariables>(GetAllCardsDocument, options);
        }
export type GetAllCardsQueryHookResult = ReturnType<typeof useGetAllCardsQuery>;
export type GetAllCardsLazyQueryHookResult = ReturnType<typeof useGetAllCardsLazyQuery>;
export type GetAllCardsQueryResult = Apollo.QueryResult<GetAllCardsQuery, GetAllCardsQueryVariables>;
export const GetCardByIdDocument = gql`
    query GetCardById($id: String!) {
  runnerCard(id: $id) {
    ...RunnerCardFields
  }
}
    ${RunnerCardFieldsFragmentDoc}`;

/**
 * __useGetCardByIdQuery__
 *
 * To run a query within a React component, call `useGetCardByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCardByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCardByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCardByIdQuery(baseOptions: Apollo.QueryHookOptions<GetCardByIdQuery, GetCardByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCardByIdQuery, GetCardByIdQueryVariables>(GetCardByIdDocument, options);
      }
export function useGetCardByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCardByIdQuery, GetCardByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCardByIdQuery, GetCardByIdQueryVariables>(GetCardByIdDocument, options);
        }
export type GetCardByIdQueryHookResult = ReturnType<typeof useGetCardByIdQuery>;
export type GetCardByIdLazyQueryHookResult = ReturnType<typeof useGetCardByIdLazyQuery>;
export type GetCardByIdQueryResult = Apollo.QueryResult<GetCardByIdQuery, GetCardByIdQueryVariables>;
export const CreateRunnerCardDocument = gql`
    mutation CreateRunnerCard($createRunnerCardInput: CreateRunnerCardInput!) {
  createRunnerCard(createRunnerCardInput: $createRunnerCardInput) {
    ...RunnerCardFields
  }
}
    ${RunnerCardFieldsFragmentDoc}`;
export type CreateRunnerCardMutationFn = Apollo.MutationFunction<CreateRunnerCardMutation, CreateRunnerCardMutationVariables>;

/**
 * __useCreateRunnerCardMutation__
 *
 * To run a mutation, you first call `useCreateRunnerCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRunnerCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRunnerCardMutation, { data, loading, error }] = useCreateRunnerCardMutation({
 *   variables: {
 *      createRunnerCardInput: // value for 'createRunnerCardInput'
 *   },
 * });
 */
export function useCreateRunnerCardMutation(baseOptions?: Apollo.MutationHookOptions<CreateRunnerCardMutation, CreateRunnerCardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRunnerCardMutation, CreateRunnerCardMutationVariables>(CreateRunnerCardDocument, options);
      }
export type CreateRunnerCardMutationHookResult = ReturnType<typeof useCreateRunnerCardMutation>;
export type CreateRunnerCardMutationResult = Apollo.MutationResult<CreateRunnerCardMutation>;
export type CreateRunnerCardMutationOptions = Apollo.BaseMutationOptions<CreateRunnerCardMutation, CreateRunnerCardMutationVariables>;
export const DeleteRunnerCardDocument = gql`
    mutation DeleteRunnerCard($id: String!) {
  deleteRunnerCard(id: $id) {
    ...RunnerCardFields
  }
}
    ${RunnerCardFieldsFragmentDoc}`;
export type DeleteRunnerCardMutationFn = Apollo.MutationFunction<DeleteRunnerCardMutation, DeleteRunnerCardMutationVariables>;

/**
 * __useDeleteRunnerCardMutation__
 *
 * To run a mutation, you first call `useDeleteRunnerCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRunnerCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRunnerCardMutation, { data, loading, error }] = useDeleteRunnerCardMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteRunnerCardMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRunnerCardMutation, DeleteRunnerCardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteRunnerCardMutation, DeleteRunnerCardMutationVariables>(DeleteRunnerCardDocument, options);
      }
export type DeleteRunnerCardMutationHookResult = ReturnType<typeof useDeleteRunnerCardMutation>;
export type DeleteRunnerCardMutationResult = Apollo.MutationResult<DeleteRunnerCardMutation>;
export type DeleteRunnerCardMutationOptions = Apollo.BaseMutationOptions<DeleteRunnerCardMutation, DeleteRunnerCardMutationVariables>;
export const UpdateRunnerCardDocument = gql`
    mutation UpdateRunnerCard($id: String!, $updateRunnerCardInput: UpdateRunnerCardInput!) {
  updateRunnerCard(id: $id, updateRunnerCardInput: $updateRunnerCardInput) {
    ...RunnerCardFields
  }
}
    ${RunnerCardFieldsFragmentDoc}`;
export type UpdateRunnerCardMutationFn = Apollo.MutationFunction<UpdateRunnerCardMutation, UpdateRunnerCardMutationVariables>;

/**
 * __useUpdateRunnerCardMutation__
 *
 * To run a mutation, you first call `useUpdateRunnerCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRunnerCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRunnerCardMutation, { data, loading, error }] = useUpdateRunnerCardMutation({
 *   variables: {
 *      id: // value for 'id'
 *      updateRunnerCardInput: // value for 'updateRunnerCardInput'
 *   },
 * });
 */
export function useUpdateRunnerCardMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRunnerCardMutation, UpdateRunnerCardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRunnerCardMutation, UpdateRunnerCardMutationVariables>(UpdateRunnerCardDocument, options);
      }
export type UpdateRunnerCardMutationHookResult = ReturnType<typeof useUpdateRunnerCardMutation>;
export type UpdateRunnerCardMutationResult = Apollo.MutationResult<UpdateRunnerCardMutation>;
export type UpdateRunnerCardMutationOptions = Apollo.BaseMutationOptions<UpdateRunnerCardMutation, UpdateRunnerCardMutationVariables>;
export const GetCurrentUserDocument = gql`
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

/**
 * __useGetCurrentUserQuery__
 *
 * To run a query within a React component, call `useGetCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentUserQuery(baseOptions?: Apollo.QueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
      }
export function useGetCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
        }
export type GetCurrentUserQueryHookResult = ReturnType<typeof useGetCurrentUserQuery>;
export type GetCurrentUserLazyQueryHookResult = ReturnType<typeof useGetCurrentUserLazyQuery>;
export type GetCurrentUserQueryResult = Apollo.QueryResult<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const UpdateUserProfileDocument = gql`
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
export type UpdateUserProfileMutationFn = Apollo.MutationFunction<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;

/**
 * __useUpdateUserProfileMutation__
 *
 * To run a mutation, you first call `useUpdateUserProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserProfileMutation, { data, loading, error }] = useUpdateUserProfileMutation({
 *   variables: {
 *      updateUserProfileInput: // value for 'updateUserProfileInput'
 *   },
 * });
 */
export function useUpdateUserProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>(UpdateUserProfileDocument, options);
      }
export type UpdateUserProfileMutationHookResult = ReturnType<typeof useUpdateUserProfileMutation>;
export type UpdateUserProfileMutationResult = Apollo.MutationResult<UpdateUserProfileMutation>;
export type UpdateUserProfileMutationOptions = Apollo.BaseMutationOptions<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;