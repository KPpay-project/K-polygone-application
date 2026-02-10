import { toast } from 'sonner';

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
 * Handles GraphQL errors and displays appropriate error messages using toast
 * @param error - The error object from Apollo Client or GraphQL response
 * @param fallbackMessage - Default message to show if no specific error is found
 */
export function handleGraphQLError(
  error: ApolloError | GraphQLResponse | any,
  fallbackMessage: string = 'An error occurred',
): void {
  console.error('GraphQL Error:', error);

  if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
    error.errors.forEach((graphQLError: GraphQLError) => {
      toast.error(graphQLError.message);
    });
    return;
  }

  if (error.graphQLErrors && Array.isArray(error.graphQLErrors) && error.graphQLErrors.length > 0) {
    error.graphQLErrors.forEach((graphQLError: GraphQLError) => {
      toast.error(graphQLError.message);
    });
    return;
  }

  if (error.networkError) {
    toast.error('Network error: Please check your connection');
    return;
  }

  if (error.message) {
    toast.error(error.message);
    return;
  }

  toast.error(fallbackMessage);
}

/**
 * Extracts error messages from GraphQL errors
 * @param error - The error object
 * @returns Array of error messages
 */
export function extractErrorMessages(error: ApolloError | GraphQLResponse | any): string[] {
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

  if (error.message && !messages.length) {
    messages.push(error.message);
  }

  return messages;
}
