import { gql } from '@apollo/client';

export const CREATE_TICKET = gql`
  mutation CreateTicket($input: CreateTicketInput!) {
    createTicket(input: $input) {
      errors {
        code
        field
        message
      }
      message
      success
    }
  }
`;

export const CREATE_MESSAGEING = gql`
  mutation CreateTicketMessage($input: CreateTicketMessageInput!) {
    createTicketMessage(input: $input) {
      success
      message
      ticketMessage {
        id
        content
        isFromAdmin
        insertedAt
      }
    }
  }
`;
