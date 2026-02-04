import { gql } from '@apollo/client';

export const CREATE_POLITICAL_EXPOSURE = gql`
  mutation CreatePoliticalExposure($input: PoliticalExposureInput!) {
    createPoliticalExposure(input: $input) {
      success
      message
      politicalExposure {
        isPep
        positionHeld
      }
      errors {
        field
        message
      }
    }
  }
`;
