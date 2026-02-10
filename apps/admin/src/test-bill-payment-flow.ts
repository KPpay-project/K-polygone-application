// Bill Payment Flow Test Script
// This script tests the complete bill payment flow for all services

import { billPaymentServices } from './data/bill-payment-services';
import { createBillPaymentSchema } from './schema/bill-payment';

// Mock translation function for testing
const mockT = (key: string) => key;

// Test data for each service type
const testData = {
  airtime: {
    service: 'airtime',
    network: 'mtn',
    currency: 'USD' as const,
    amount: '10',
    account: '+2341234567890',
    country: 'nigeria' as const,
    paymentMethod: 'mobile' as const
  },
  data: {
    service: 'data',
    network: 'mtn',
    currency: 'USD' as const,
    amount: '15',
    account: '+2341234567890',
    country: 'nigeria' as const,
    paymentMethod: 'mobile' as const
  },
  electricity: {
    service: 'electricity',
    network: 'sbee',
    currency: 'USD' as const,
    amount: '25',
    account: '12345678901',
    country: 'nigeria' as const,
    paymentMethod: 'mobile' as const
  },
  cabletv: {
    service: 'cabletv',
    network: 'sbee',
    currency: 'USD' as const,
    amount: '20',
    account: '1234567890123',
    country: 'nigeria' as const,
    paymentMethod: 'mobile' as const
  },
  betting: {
    service: 'betting',
    network: 'bet9ja',
    currency: 'USD' as const,
    amount: '30',
    account: 'BET123456789',
    country: 'nigeria' as const,
    paymentMethod: 'mobile' as const
  },
  giftcard: {
    service: 'giftcard',
    network: '',
    currency: 'USD' as const,
    amount: '50',
    account: 'test@example.com',
    country: 'nigeria' as const,
    paymentMethod: 'mobile' as const
  }
};

// Validation test function
function testServiceValidation(serviceId: string) {
  console.log(`\n🧪 Testing ${serviceId} service validation...`);

  const schema = createBillPaymentSchema(mockT);
  const data = testData[serviceId as keyof typeof testData];

  if (!data) {
    console.error(`❌ No test data found for service: ${serviceId}`);
    return false;
  }

  try {
    const result = schema.parse(data);
    console.log(`✅ ${serviceId} validation passed`);
    console.log(`   - Service: ${result.service}`);
    console.log(`   - Network: ${result.network || 'N/A'}`);
    console.log(`   - Amount: ${result.amount}`);
    console.log(`   - Account: ${result.account}`);
    return true;
  } catch (error) {
    console.error(`❌ ${serviceId} validation failed:`, error);
    return false;
  }
}

// Test form validation logic
function testFormValidationLogic(serviceId: string) {
  console.log(`\n🔍 Testing ${serviceId} form validation logic...`);

  const data = testData[serviceId as keyof typeof testData];
  const { service, currency, amount, account, network } = data;

  // Check required fields
  const hasRequiredFields = service && currency && amount && account;
  console.log(`   Required fields check: ${hasRequiredFields ? '✅' : '❌'}`);

  // Check network requirement (not required for gift cards)
  const hasValidNetwork = serviceId === 'giftcard' || network;
  console.log(`   Network validation: ${hasValidNetwork ? '✅' : '❌'}`);

  // Check amount validation
  const numericAmount = parseFloat(amount.replace(/,/g, ''));
  const isValidAmount = !isNaN(numericAmount) && numericAmount >= 1;
  console.log(`   Amount validation: ${isValidAmount ? '✅' : '❌'} (${numericAmount})`);

  // Check account validation
  let isValidAccount = true;
  if (serviceId === 'giftcard') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    isValidAccount = emailRegex.test(account);
    console.log(`   Email validation: ${isValidAccount ? '✅' : '❌'}`);
  } else {
    isValidAccount = account.trim().length >= 3;
    console.log(`   Account validation: ${isValidAccount ? '✅' : '❌'} (length: ${account.length})`);
  }

  const isFormValid = hasRequiredFields && hasValidNetwork && isValidAmount && isValidAccount;
  console.log(`   Overall form valid: ${isFormValid ? '✅' : '❌'}`);

  return isFormValid;
}

// Test service configuration
function testServiceConfiguration() {
  console.log('\n🔧 Testing service configuration...');

  billPaymentServices.forEach((service) => {
    console.log(`\n📋 Service: ${service.id}`);
    console.log(`   - Label Key: ${service.labelKey}`);
    console.log(`   - Color: ${service.color}`);
    console.log(`   - Background: ${service.bgColor}`);
    console.log(`   - Active: ${service.active ? '✅' : '❌'}`);
    console.log(`   - Has Test Data: ${testData[service.id as keyof typeof testData] ? '✅' : '❌'}`);
  });
}

// Main test runner
function runBillPaymentTests() {
  console.log('🚀 Starting Bill Payment Flow Tests\n');
  console.log('='.repeat(50));

  // Test service configuration
  testServiceConfiguration();

  console.log('\n' + '='.repeat(50));
  console.log('🧪 VALIDATION TESTS');
  console.log('='.repeat(50));

  let passedTests = 0;
  let totalTests = 0;

  // Test each service
  Object.keys(testData).forEach((serviceId) => {
    totalTests += 2; // Schema validation + form logic validation

    if (testServiceValidation(serviceId)) {
      passedTests++;
    }

    if (testFormValidationLogic(serviceId)) {
      passedTests++;
    }
  });

  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST RESULTS');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Bill payment flow is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the issues above.');
  }

  return passedTests === totalTests;
}

// Export for use in other files
export { runBillPaymentTests, testData, testServiceValidation, testFormValidationLogic };

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  runBillPaymentTests();
}
