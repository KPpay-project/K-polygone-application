import { ApolloError } from '@apollo/client';

export interface GraphQLErrorInfo {
  message: string;
  type: 'network' | 'graphql' | 'unknown';
  details?: any;
}

export const handleGraphQLError = (error: ApolloError): GraphQLErrorInfo => {
  if (error.networkError) {
    return {
      message: 'Network error occurred. Please check your connection.',
      type: 'network',
      details: error.networkError,
    };
  }

  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    const firstError = error.graphQLErrors[0];
    return {
      message: firstError.message || 'GraphQL error occurred',
      type: 'graphql',
      details: firstError,
    };
  }

  return {
    message: error.message || 'An unknown error occurred',
    type: 'unknown',
    details: error,
  };
};

export const isAuthenticationError = (error: ApolloError): boolean => {
  return error.graphQLErrors.some(
    (err) =>
      err.extensions?.code === 'UNAUTHENTICATED' ||
      err.message.toLowerCase().includes('unauthorized'),
  );
};

export const isValidationError = (error: ApolloError): boolean => {
  return error.graphQLErrors.some(
    (err) =>
      err.extensions?.code === 'BAD_USER_INPUT' || err.extensions?.code === 'VALIDATION_ERROR',
  );
};
