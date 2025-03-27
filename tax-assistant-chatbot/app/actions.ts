'use server';

export async function submitUserMessage(input: string) {
  const text = input.toLowerCase();

  if (text.includes('chart')) return 'SHOW_CHART';

  if (text.includes('tax breakdown')) {
    return `
      <table class="table-auto border border-collapse border-gray-300 dark:border-gray-600 w-full text-sm">
        <thead class="bg-gray-100 dark:bg-gray-800">
          <tr><th class="border px-2 py-1">Category</th><th class="border px-2 py-1">Amount</th></tr>
        </thead>
        <tbody>
          <tr><td class="border px-2 py-1">Income</td><td class="border px-2 py-1">$80,000</td></tr>
          <tr><td class="border px-2 py-1">Deductions</td><td class="border px-2 py-1">$13,850</td></tr>
          <tr><td class="border px-2 py-1 font-bold">Taxable Income</td><td class="border px-2 py-1 font-bold">$66,150</td></tr>
        </tbody>
      </table>`;
  }

  if (text.includes('w-2')) {
    return 'A W-2 is a form employers give employees to report wages and taxes withheld.';
  }

  if (text.includes('standard deduction')) {
    return 'The 2023 standard deduction is $13,850 for single filers and $27,700 for married couples filing jointly.';
  }

  if (text.includes('filing status')) {
    return 'Filing statuses: Single, Married Filing Jointly, Married Filing Separately, Head of Household, Qualifying Widow(er).';
  }

  return "Sorry, I didn’t understand that. Try asking about W-2s or standard deductions.";
}
