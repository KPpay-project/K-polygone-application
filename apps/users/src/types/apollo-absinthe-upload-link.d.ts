declare module 'apollo-absinthe-upload-link' {
  import { ApolloLink } from '@apollo/client';

  interface CreateLinkOptions {
    uri: string;
    headers?: Record<string, string>;
    fetch?: (uri: string, options: any) => Promise<Response>;
  }

  export function createLink(options: CreateLinkOptions): ApolloLink;

  export class ReactNativeFile {
    constructor(options: { uri: string; type: string; name: string });
    static list(files: Array<{ uri: string; type: string; name: string }>): ReactNativeFile[];
  }
}
