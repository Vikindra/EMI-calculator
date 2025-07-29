const { test } = require('@playwright/test');
const xlsx = require('xlsx');
const path = require('path');

// Import Page Objects
const { CarLoanPage } = require('../pages/CarLoanPage');
const { HomeLoanPage } = require('../pages/HomeLoanPage');
const { LoanCalculatorPage } = require('../pages/LoanCalculatorPage');

// Load input Excel
const inputWorkbook = xlsx.readFile(path.join(__dirname, '../data/input.xlsx'));
const outputWorkbook = xlsx.utils.book_new();

// Utility to write results to output Excel
function writeResults(sheetName, data) {
  const worksheet = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(outputWorkbook, worksheet, sheetName);
}


//  Test 2: Home Loan EMI Calculator
test('Home Loan EMI Calculator Test', async ({ page }) => {
  const input = xlsx.utils.sheet_to_json(inputWorkbook.Sheets['HomeLoan'])[0];
  const homeLoanPage = new HomeLoanPage(page);

  await homeLoanPage.navigate();
  await homeLoanPage.fillHomeLoanDetails(input);
  const results = await homeLoanPage.extractYearlyBreakup();
  writeResults('HomeLoan', results);
  console.log(results);
});



//  Save output after all tests
test.afterAll(() => {
  xlsx.writeFile(outputWorkbook, path.join(__dirname, '../data/output.xlsx'));
});
