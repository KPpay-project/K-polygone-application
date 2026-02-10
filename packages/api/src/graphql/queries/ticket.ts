import { gql } from '@apollo/client';

export const GET_CUSTOMER_TICKETS = gql`
  query GetTicketByCustomerId {
    getUsersTickets {
      id
      insertedAt
      message
      priority
      resolvedAt
      status
      ticketNumber
      ticketSubject
      ticketType
      updatedAt
      attachmentUrl {
        original
        thumb
      }
      messages {
        id
        insertedAt
        message
        senderType
        updatedAt
      }
    }
  }
`;
