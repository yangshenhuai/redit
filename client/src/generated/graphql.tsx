import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: Posts;
  deletePost: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
  resetPassword: UserResponse;
  updatePost: Posts;
  upvote: Scalars['Boolean'];
};


export type MutationCreatePostArgs = {
  input: PostInput;
};


export type MutationDeletePostArgs = {
  id: Scalars['Float'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationResetPasswordArgs = {
  password: Scalars['String'];
  userid: Scalars['String'];
};


export type MutationUpdatePostArgs = {
  id: Scalars['Float'];
  title?: Maybe<Scalars['String']>;
};


export type MutationUpvoteArgs = {
  postId: Scalars['Int'];
};

export type PostInput = {
  text: Scalars['String'];
  title: Scalars['String'];
};

export type Posts = {
  __typename?: 'Posts';
  createAt: Scalars['String'];
  id: Scalars['Int'];
  point: Scalars['Float'];
  text: Scalars['String'];
  textSnippet: Scalars['String'];
  title: Scalars['String'];
  upateAt: Scalars['String'];
  user: User;
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  me?: Maybe<User>;
  post?: Maybe<Posts>;
  posts: Array<Posts>;
  validateResetPasswordToken: ValidateResponse;
};


export type QueryPostArgs = {
  id: Scalars['Int'];
};


export type QueryPostsArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type QueryValidateResetPasswordTokenArgs = {
  token: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  createAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['Int'];
  upateAt: Scalars['String'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UsernamePasswordInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type ValidateResponse = {
  __typename?: 'ValidateResponse';
  errors?: Maybe<Array<FieldError>>;
  userid?: Maybe<Scalars['String']>;
};

export type SmallUserFragment = { __typename?: 'User', id: number, username: string };

export type CreatePostMutationVariables = Exact<{
  createPostInput: PostInput;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'Posts', id: number, title: string, text: string, point: number, createAt: string, upateAt: string } };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', id: number, username: string } | null | undefined } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', id: number, username: string } | null | undefined } };

export type ResetPasswordMutationMutationVariables = Exact<{
  password: Scalars['String'];
  userid: Scalars['String'];
}>;


export type ResetPasswordMutationMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', id: number, username: string } | null | undefined } };

export type UpvoteMutationVariables = Exact<{
  upvotePostId: Scalars['Int'];
}>;


export type UpvoteMutation = { __typename?: 'Mutation', upvote: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, username: string } | null | undefined };

export type PostsQueryVariables = Exact<{
  offset: Scalars['Int'];
  limit: Scalars['Int'];
}>;


export type PostsQuery = { __typename?: 'Query', posts: Array<{ __typename?: 'Posts', id: number, title: string, textSnippet: string, point: number, createAt: string, upateAt: string, user: { __typename?: 'User', id: number, username: string } }> };

export type ValidateResetPasswordTokenQueryVariables = Exact<{
  token: Scalars['String'];
}>;


export type ValidateResetPasswordTokenQuery = { __typename?: 'Query', validateResetPasswordToken: { __typename?: 'ValidateResponse', userid?: string | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined } };

export const SmallUserFragmentDoc = gql`
    fragment SmallUser on User {
  id
  username
}
    `;
export const CreatePostDocument = gql`
    mutation CreatePost($createPostInput: PostInput!) {
  createPost(input: $createPostInput) {
    id
    title
    text
    point
    createAt
    upateAt
  }
}
    `;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    errors {
      field
      message
    }
    user {
      ...SmallUser
    }
  }
}
    ${SmallUserFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($options: UsernamePasswordInput!) {
  register(options: $options) {
    errors {
      field
      message
    }
    user {
      ...SmallUser
    }
  }
}
    ${SmallUserFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const ResetPasswordMutationDocument = gql`
    mutation ResetPasswordMutation($password: String!, $userid: String!) {
  resetPassword(password: $password, userid: $userid) {
    errors {
      field
      message
    }
    user {
      id
      username
    }
  }
}
    `;

export function useResetPasswordMutationMutation() {
  return Urql.useMutation<ResetPasswordMutationMutation, ResetPasswordMutationMutationVariables>(ResetPasswordMutationDocument);
};
export const UpvoteDocument = gql`
    mutation Upvote($upvotePostId: Int!) {
  upvote(postId: $upvotePostId)
}
    `;

export function useUpvoteMutation() {
  return Urql.useMutation<UpvoteMutation, UpvoteMutationVariables>(UpvoteDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    ...SmallUser
  }
}
    ${SmallUserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const PostsDocument = gql`
    query Posts($offset: Int!, $limit: Int!) {
  posts(offset: $offset, limit: $limit) {
    id
    title
    textSnippet
    point
    createAt
    upateAt
    user {
      id
      username
    }
  }
}
    `;

export function usePostsQuery(options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
};
export const ValidateResetPasswordTokenDocument = gql`
    query ValidateResetPasswordToken($token: String!) {
  validateResetPasswordToken(token: $token) {
    errors {
      field
      message
    }
    userid
  }
}
    `;

export function useValidateResetPasswordTokenQuery(options: Omit<Urql.UseQueryArgs<ValidateResetPasswordTokenQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ValidateResetPasswordTokenQuery>({ query: ValidateResetPasswordTokenDocument, ...options });
};