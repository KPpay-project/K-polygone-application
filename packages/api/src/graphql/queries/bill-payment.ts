import { gql } from '@apollo/client';

// export const GET_BILLERS = gql`
//   query GetBillersList(
//     $page: Int = 1
//     $perPage: Int = 15
//     $sortBy: String = "updatedAt"
//     $sortDirection: String = "desc"
//     $search: String
//     $filters: BillerFilters
//     $fromDate: Date
//     $toDate: Date
//   ) {
//     billers(
//       page: $page
//       perPage: $perPage
//       sortBy: $sortBy
//       sortDirection: $sortDirection
//       search: $search
//       filters: $filters
//       fromDate: $fromDate
//       toDate: $toDate
//     ) {
//       entries {
//         id
//         billerName
//         description
//         iconLogo
//         status
//         shortCode
//         providerCode
//         channel
//         insertedAt
//         updatedAt
//       }
//       pageNumber
//       pageSize
//       totalEntries
//       totalPages
//     }
//   }
// `;

// export const GET_BILLER_BY_ID = gql`
//   query GetBillerById($id: ID!) {
//     getBillerById(billerId: $id) {
//       id
//       billerName
//       description
//       iconLogo
//       status
//       shortCode
//       providerCode
//       channel
//       insertedAt
//       updatedAt
//     }
//   }
// `;

export const FLUTTERWAVE_BILL_CATEGORIES = gql`
  query FlutterwaveBillCategories($countryCode: String!) {
    flutterwaveBillCategories(countryCode: $countryCode) {
      code
      country
      id
      name
    }
  }
`;

export const FLUTTERWAVE_BILLERS = gql`
  query FlutterwaveBillers($category: String, $countryCode: String!) {
    flutterwaveBillers(category: $category, countryCode: $countryCode) {
      billerCode
      category
      country
      id
      isActive
      name
    }
  }
`;

export const FLUTTERWAVE_BILL_ITEMS = gql`
  query FlutterwaveBillItems($billerCode: String!, $countryCode: String!) {
    flutterwaveBillItems(billerCode: $billerCode, countryCode: $countryCode) {
      amount
      billerCode
      country
      currency
      id
      isAmountFixed
      itemCode
      name
    }
  }
`;

export const VALIDATE_FLUTTERWAVE_BILL_CUSTOMER = gql`
  query ValidateFlutterwaveBillCustomer($customerId: String!, $itemCode: String!) {
    validateFlutterwaveBillCustomer(customerId: $customerId, itemCode: $itemCode) {
      customerName
      message
      status
      valid
    }
  }
`;

export const FLUTTERWAVE_BILL_PAYMENT_STATUS = gql`
  query FlutterwaveBillPaymentStatus($reference: String!) {
    flutterwaveBillPaymentStatus(reference: $reference) {
      amount
      billPaymentId
      currency
      flutterwaveReference
      message
      providerStatus
      reference
      status
      success
    }
  }
`;


export const GET_FLUTTERWAVE_COUNTRIES = gql `
  query Countries($page: Int, $perPage: Int, $search: String, $sortBy: String, $sortDirection: String, $fromDate: Date, $toDate: Date) {
  countries(
    page: $page
    perPage: $perPage
    search: $search
    sortBy: $sortBy
    sortDirection: $sortDirection
    fromDate: $fromDate
    toDate: $toDate
  ) {
    entries {
      id
      code
      name
      countryFlag
      active
      insertedAt
      updatedAt
    }
    totalEntries
    pageNumber
    pageSize
    totalPages
  }
}
`
