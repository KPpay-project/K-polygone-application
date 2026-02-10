import Toast from 'react-native-toast-message';

export interface GraphQLError {
  message: string;
  path?: (string | number)[];
  locations?: Array<{
    line: number;
    column: number;
  }>;
}

export interface ApolloError {
  graphQLErrors?: GraphQLError[];
  networkError?: any;
  message?: string;
}

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: GraphQLError[];
}

/**
 * Shows an error toast using react-native-toast-message
 */
function showErrorToast(message: string) {
  Toast.show({
    type: 'error',
    text1: message,
  });
}

/**
 * Handles GraphQL errors and displays appropriate error messages
 */
export function handleGraphQLError(
  error: ApolloError | GraphQLResponse | any,
  fallbackMessage: string = 'An error occurred'
): void {
  console.error('GraphQL Error:', error);

  if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
    error.errors.forEach((graphQLError: GraphQLError) => {
      showErrorToast(graphQLError.message);
    });
    return;
  }

  if (
    error.graphQLErrors &&
    Array.isArray(error.graphQLErrors) &&
    error.graphQLErrors.length > 0
  ) {
    error.graphQLErrors.forEach((graphQLError: GraphQLError) => {
      showErrorToast(graphQLError.message);
    });
    return;
  }

  if (error.networkError) {
    showErrorToast('Network error: Please check your connection');
    return;
  }

  if (error.message) {
    showErrorToast(error.message);
    return;
  }

  showErrorToast(fallbackMessage);
}

export function extractErrorMessages(
  error: ApolloError | GraphQLResponse | any
): string[] {
  const messages: string[] = [];

  if (error.errors && Array.isArray(error.errors)) {
    error.errors.forEach((graphQLError: GraphQLError) => {
      messages.push(graphQLError.message);
    });
  }

  if (error.graphQLErrors && Array.isArray(error.graphQLErrors)) {
    error.graphQLErrors.forEach((graphQLError: GraphQLError) => {
      messages.push(graphQLError.message);
    });
  }

  if (error.networkError) {
    messages.push('Network error: Please check your connection');
  }

  if (error.message && messages.length === 0) {
    messages.push(error.message);
  }

  return messages;
}

export function getGraphQLErrorMessage(
  response: GraphQLResponse | any,
  fallbackMessage: string = 'An error occurred'
): string {
  if (
    response?.errors &&
    Array.isArray(response.errors) &&
    response.errors.length > 0
  ) {
    return response.errors[0].message;
  }

  if (
    response?.graphQLErrors &&
    Array.isArray(response.graphQLErrors) &&
    response.graphQLErrors.length > 0
  ) {
    return response.graphQLErrors[0].message;
  }

  if (response?.networkError) {
    return 'Network error: Please check your connection';
  }

  if (response?.message) {
    return response.message;
  }

  return fallbackMessage;
}
