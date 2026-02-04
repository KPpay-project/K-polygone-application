import { describe, it, expect } from 'vitest';
import { ApolloError } from '@apollo/client';
import { GraphQLError } from 'graphql';
import {
  ErrorCode,
  ErrorMessages,
  ValidationError,
  normalizeGraphQLError,
  normalizeApolloError,
} from '../../src/helpers/errors';

describe('Error Helpers', () => {
  describe('ErrorCode', () => {
    it('should have correct error codes', () => {
      expect(ErrorCode.AUTHENTICATION_REQUIRED).toBe('AUTHENTICATION_REQUIRED');
      expect(ErrorCode.UNKNOWN).toBe('UNKNOWN');
    });
  });

  describe('ErrorMessages', () => {
    it('should map error codes to messages', () => {
      expect(ErrorMessages[ErrorCode.AUTHENTICATION_REQUIRED]).toBe('Authentication required');
      expect(ErrorMessages[ErrorCode.UNKNOWN]).toBe('Something went wrong. Please try again');
    });
  });

  describe('ValidationError', () => {
    it('should create an instance with correct properties', () => {
      const error = new ValidationError('Test Error', {
        code: ErrorCode.BAD_USER_INPUT,
        details: { field: 'email' },
      });

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.message).toBe('Test Error');
      expect(error.code).toBe(ErrorCode.BAD_USER_INPUT);
      expect(error.details).toEqual({ field: 'email' });
    });

    it('should handle defaults', () => {
      const error = new ValidationError('Default Error');
      expect(error.code).toBeUndefined();
      expect(error.details).toBeUndefined();
    });
  });

  describe('normalizeGraphQLError', () => {
    it('should normalize a standard GraphQLError', () => {
      const gqlError = new GraphQLError('Test GQL Error', {
        extensions: { code: 'SOME_CODE' },
      });
      const normalized = normalizeGraphQLError(gqlError);

      expect(normalized.message).toBe('Test GQL Error');
      expect(normalized.code).toBe('SOME_CODE');
    });

    it('should handle missing extensions', () => {
      const gqlError = new GraphQLError('Simple Error');
      const normalized = normalizeGraphQLError(gqlError);

      expect(normalized.message).toBe('Simple Error');
      expect(normalized.code).toBeUndefined();
    });
  });

  describe('normalizeApolloError', () => {
    it('should normalize ApolloError with GraphQLErrors', () => {
      const gqlError = new GraphQLError('Unauthorized access', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
      const apolloError = new ApolloError({
        graphQLErrors: [gqlError],
      });

      const result = normalizeApolloError(apolloError);

      expect(result).toBeInstanceOf(ValidationError);
      expect(result.code).toBe(ErrorCode.AUTHENTICATION_REQUIRED);
      // The helper uses the normalized[0].message
      expect(result.message).toBe('Unauthorized access');
    });

    it('should detect FORBIDDEN code', () => {
        const gqlError = new GraphQLError('Forbidden access', {
          extensions: { code: 'FORBIDDEN' },
        });
        const apolloError = new ApolloError({
          graphQLErrors: [gqlError],
        });
  
        const result = normalizeApolloError(apolloError);
        expect(result.code).toBe(ErrorCode.FORBIDDEN);
      });

    it('should fallback to UNKNOWN for unmapped codes', () => {
      const gqlError = new GraphQLError('Weird Error', {
        extensions: { code: 'WEIRD_CODE' },
      });
      const apolloError = new ApolloError({
        graphQLErrors: [gqlError],
      });

      const result = normalizeApolloError(apolloError);
      expect(result.code).toBe(ErrorCode.UNKNOWN);
    });

    it('should handle network errors', () => {
      const networkError = new Error('Network fail');
      const apolloError = new ApolloError({
        networkError: networkError,
      });

      const result = normalizeApolloError(apolloError);
      expect(result.code).toBe(ErrorCode.NETWORK_ERROR);
      expect(result.details).toBe(networkError);
    });
  });
});
