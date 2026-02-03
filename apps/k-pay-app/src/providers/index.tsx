import i18n from '../i18n';
import * as React from 'react';
import { ApolloProvider } from '@apollo/client';
import { I18nextProvider } from 'react-i18next';
import { apolloClient } from '../lib/apollo-client';
import { AuthProvider } from '../contexts/auth-context';
import { CurrencyProvider } from '../contexts/CurrencyContext';
import { LanguageProvider } from './LanguageProvider';

export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      <I18nextProvider i18n={i18n}>
        <LanguageProvider>
          <CurrencyProvider>
            <AuthProvider>{children}</AuthProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </I18nextProvider>
    </ApolloProvider>
  );
}
