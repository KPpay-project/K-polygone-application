/*
 * Generates an Excel file under public/test-files/ with the following content:
 * recipient_email,reason,amount
 * alice@example.com,Monthly payment,$200
 * bob@example.com,Project bonus,N500
 * charlie@example.com,Team reimbursement,$10
 */

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const outDir = path.join(__dirname, '..', 'public', 'test-files');
const outFile = path.join(outDir, 'recipient-email-reason-amount.xlsx');

// Ensure output directory exists
fs.mkdirSync(outDir, { recursive: true });

// Define sheet data (Array of Arrays)
const wsData = [
  ['recipient_email', 'reason', 'amount'],
  ['alice@example.com', 'Monthly payment', '$200'],
  ['bob@example.com', 'Project bonus', 'N500'],
  ['charlie@example.com', 'Team reimbursement', '$10']
];

// Create workbook and worksheet
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(wsData);
XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

// Write to file
XLSX.writeFile(wb, outFile);

console.log(`Excel test file created: ${outFile}`);
