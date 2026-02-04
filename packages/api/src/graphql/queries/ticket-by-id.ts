import { gql } from '@apollo/client';

export const GET_TICKET_BY_ID = gql`
  query GetTicketById($ticketId: ID!) {
    getTicketById(ticketId: $ticketId) {
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
      messages {
        id
        insertedAt
        message
        senderType
        updatedAt
        sender {
          currentSignInAt
          currentSignInIp
          id
          insertedAt
          role
          status
          updatedAt
          user {
            country
            email
            firstName
            id
            insertedAt
            lastName
            phone
            updatedAt
          }
          admin {
            email
            firstName
            id
            lastName
          }
        }
      }
    }
  }
`;
