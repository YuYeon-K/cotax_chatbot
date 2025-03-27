import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1].content.toLowerCase();

  if (lastMessage.includes('chart')) {
    return NextResponse.json({
      role: 'assistant',
      content: 'SHOW_CHART',
    });
  }

  if (lastMessage.includes('tax breakdown')) {
    const table = `
      <table class="table-auto border border-collapse border-gray-300 dark:border-gray-600 w-full text-sm">
        <thead class="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th class="border px-2 py-1">Category</th>
            <th class="border px-2 py-1">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border px-2 py-1">Income</td>
            <td class="border px-2 py-1">$80,000</td>
          </tr>
          <tr>
            <td class="border px-2 py-1">Deductions</td>
            <td class="border px-2 py-1">$13,850</td>
          </tr>
          <tr>
            <td class="border px-2 py-1 font-bold">Taxable Income</td>
            <td class="border px-2 py-1 font-bold">$66,150</td>
          </tr>
        </tbody>
      </table>
    `;

    return NextResponse.json({ role: 'assistant', content: table });
  }
  if (lastMessage.includes('w-2')) {
    return NextResponse.json({
      role: 'assistant',
      content: 'A W-2 is a form employers give employees to report annual wages and the amount of tax withheld.',
    });
  }
  
  if (lastMessage.includes('standard deduction')) {
    return NextResponse.json({
      role: 'assistant',
      content: 'For the 2023 tax year, the standard deduction is $13,850 for single filers and $27,700 for married filing jointly.',
    });
  }
  
  if (lastMessage.includes('filing status')) {
    return NextResponse.json({
      role: 'assistant',
      content: 'Filing statuses include: Single, Married Filing Jointly, Married Filing Separately, Head of Household, and Qualifying Widow(er).',
    });
  }
  

  const fallback = "Try asking about 'W-2', 'standard deduction', or 'show tax chart'.";
  return NextResponse.json({ role: 'assistant', content: fallback });
}
