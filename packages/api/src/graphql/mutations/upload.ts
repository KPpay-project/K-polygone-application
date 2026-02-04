import { gql } from '@apollo/client';

export const UPLOAD_FILE = gql`
  mutation UploadFile($file: Upload!, $folder: String) {
    uploadFile(file: $file, folder: $folder) {
      success
      message
      url
      filename
    }
  }
`;
