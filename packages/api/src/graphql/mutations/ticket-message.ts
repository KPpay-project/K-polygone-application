import { gql } from '@apollo/client';

export const CREATE_TICKET_MESSAGE = gql`
  mutation CreateTicketMessage($input: CreateTicketMessageInput!) {
    createTicketMessage(input: $input) {
      message
      success
      errors {
        field
        message
      }
    }
  }
`;
