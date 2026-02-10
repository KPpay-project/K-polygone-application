# Bill Payment Testing Guide

This document outlines the testing requirements for each bill payment service to ensure complete functionality from selection to proceed button click.

## Services to Test

### 1. Airtime

- **Required Fields**: Service, Network, Currency, Amount, Phone Number
- **Network Options**: MTN, Airtel, Glo, 9mobile
- **Account Field**: Phone number with country selector
- **Validation**: Phone number format, minimum amount $1

### 2. Data

- **Required Fields**: Service, Network, Currency, Amount, Phone Number
- **Network Options**: MTN, Airtel, Glo, 9mobile
- **Account Field**: Phone number with country selector
- **Validation**: Phone number format, minimum amount $1

### 3. Electricity

- **Required Fields**: Service, Network, Currency, Amount, Meter Number
- **Network Options**: SBEE, EKEDC, IKEDC
- **Account Field**: Meter number (text input)
- **Validation**: Meter number format, minimum amount $1

### 4. Cable TV

- **Required Fields**: Service, Network, Currency, Amount, Smart Card Number
- **Network Options**: SBEE, EKEDC, IKEDC
- **Account Field**: Smart card number (text input)
- **Validation**: Smart card format, minimum amount $1

### 5. Betting

- **Required Fields**: Service, Network, Currency, Amount, Betting Account ID
- **Network Options**: Bet9ja
- **Account Field**: Betting account ID (text input)
- **Validation**: Account ID format, minimum amount $1

### 6. Gift Card

- **Required Fields**: Service, Currency, Amount, Recipient Email
- **Network Options**: None (network field hidden)
- **Account Field**: Email address (text input)
- **Validation**: Valid email format, minimum amount $1

## Test Cases for Each Service

### Test Flow:

1. Select service from grid
2. Verify form fields update correctly
3. Fill required fields with valid data
4. Verify proceed button becomes enabled
5. Click proceed button
6. Verify confirmation modal opens
7. Verify all data is correctly displayed in modal

### Sample Test Data:

**Airtime/Data:**

- Network: MTN
- Currency: USD
- Amount: 10
- Phone: +234 123 456 7890

**Electricity:**

- Network: SBEE
- Currency: USD
- Amount: 25
- Meter Number: 12345678901

**Cable TV:**

- Network: SBEE
- Currency: USD
- Amount: 15
- Smart Card: 1234567890123

**Betting:**

- Network: Bet9ja
- Currency: USD
- Amount: 20
- Account ID: BET123456789

**Gift Card:**

- Currency: USD
- Amount: 50
- Email: test@example.com

## Expected Behaviors:

1. **Service Selection**: Form should reset and populate with service-specific defaults
2. **Field Visibility**: Network field should be hidden for gift cards
3. **Validation**: Proceed button should only enable when all required fields are valid
4. **Modal**: Confirmation modal should display correct service details
5. **Error Handling**: Invalid inputs should show appropriate error messages
6. **Loading States**: Submit button should show loading spinner during processing

## Manual Testing Checklist:

- [ ] Airtime service complete flow
- [ ] Data service complete flow
- [ ] Electricity service complete flow
- [ ] Cable TV service complete flow
- [ ] Betting service complete flow
- [ ] Gift Card service complete flow
- [ ] Service switching validation reset
- [ ] Form validation error messages
- [ ] Proceed button enable/disable states
- [ ] Confirmation modal data accuracy
- [ ] Loading states during submission
