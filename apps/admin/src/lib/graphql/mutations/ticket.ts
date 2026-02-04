import { gql } from '@apollo/client';

const CREATE_TICKET_MESSAGE = gql`
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

export { CREATE_TICKET_MESSAGE };
