import { gql } from '@apollo/client';

export const GET_ACTIVITY_LOGS = gql`
  query ActivityLogs(
    $page: Int
    $perPage: Int
    $sortBy: String
    $sortDirection: String
    $search: String
    $fromDate: Date
    $toDate: Date
    $filters: ActivityLogsFilters
  ) {
    getActivityLogs(
      page: $page
      perPage: $perPage
      sortBy: $sortBy
      sortDirection: $sortDirection
      search: $search
      fromDate: $fromDate
      toDate: $toDate
      filters: $filters
    ) {
      entries {
        id
        activity
        deviceInfo
        insertedAt
        ipAddress
        location
        status
        updatedAt
        userAccount {
          id
          role
          status
          signInCount
          signInIp
          currentSignInAt
          currentSignInIp
          lastSignInAt
          lastSignInIp
          insertedAt
          updatedAt
          walletCode
          admin {
            id
            firstName
            lastName
            email
            phone
            role
            status
            insertedAt
            updatedAt
            __typename
          }
          user {
            id
            firstName
            lastName
            email
            phone
            country
            insertedAt
            updatedAt
            __typename
          }
          merchant {
            id
            businessName
            businessType
            businessDescription
            businessWebsite
            email
            phone
            country
            logoUrl
            group
            status
            insertedAt
            updatedAt
            __typename
          }
          __typename
        }
        transaction {
          id
          amount
          description
          status
          transactionType
          reference
          externalReference
          exchangeRate
          feeAmount
          provider
          providerStatus
          providerMessage
          customerPhone
          insertedAt
          updatedAt
          currency {
            id
            code
            name
            symbol
            precision
            exchangeRateUsd
            countryCode
            countryNames
            isActive
            insertedAt
            updatedAt
            __typename
          }
          feeCurrency {
            id
            code
            name
            symbol
            precision
            exchangeRateUsd
            countryCode
            countryNames
            isActive
            insertedAt
            updatedAt
            __typename
          }
          wallet {
            id
            ownerId
            ownerType
            status
            dailyLimit
            monthlyLimit
            isFrozen
            freezeReason
            insertedAt
            updatedAt
            __typename
          }
          __typename
        }
        kycApplication {
          id
          status
          kycClientId
          kycClientType
          personalInfoStatus
          contactInfoStatus
          identityStatus
          financialInfoStatus
          bankInfoStatus
          message
          errors
          rejectionReason
          insertedAt
          updatedAt
          personalInfo {
            id
            firstName
            lastName
            maidenName
            dateOfBirth
            placeOfBirth
            nationality
            countryOrTaxResidence
            occupation
            currentEmployer
            employmentStatus
            taxIdentificationNumber
            verified
            insertedAt
            updatedAt
            __typename
          }
          contactDetail {
            id
            emailAddress
            primaryPhone
            secondaryPhone
            residentialStreet
            residentialCity
            residentialCountry
            residentialPostalCode
            mailingStreet
            mailingCity
            mailingCountry
            mailingPostalCode
            addressProofUrl
            insertedAt
            updatedAt
            __typename
          }
          identityDocument {
            id
            documentType
            documentNumber
            dateOfIssue
            expiryDate
            issuingAuthority
            verified
            insertedAt
            updatedAt
            __typename
          }
          financialInfo {
            id
            salary
            estimatedAnnualIncome
            estimatedNetWorth
            verified
            insertedAt
            updatedAt
            __typename
          }
          bankInfo {
            id
            primaryBank
            accountNumber
            countryAccountHeld
            insertedAt
            updatedAt
            __typename
          }
          politicalExposure {
            id
            isPep
            positionHeld
            countryOfPosition
            startDate
            endDate
            insertedAt
            updatedAt
            __typename
          }
          declarationsAndCommitments {
            id
            individualsFullName
            companyName
            informationIsAccurate
            hasAcknowledgeInformationCollectionAmlCft
            insertedAt
            updatedAt
            __typename
          }
          __typename
        }
        __typename
      }
      pageNumber
      pageSize
      totalEntries
      totalPages
    }
  }
`;

export default GET_ACTIVITY_LOGS;
