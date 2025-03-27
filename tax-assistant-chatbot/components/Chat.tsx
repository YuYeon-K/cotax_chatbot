'use client';

import { useEffect, useRef, useState } from 'react';
import { submitUserMessage } from '@/app/actions';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = new FormData(e.currentTarget).get('message') as string;
    if (!input.trim()) return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, newMessage]);
    e.currentTarget.reset();

    const response = await submitUserMessage(input);
    setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: `Uploaded file: ${file.name}` },
      { role: 'assistant', content: `Thanks! I've received **${file.name}**. I'll analyze it shortly.` },
    ]);
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col h-[90vh] w-full max-w-2xl bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Top Bar */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 flex justify-between items-center border-b border-gray-200 dark:border-gray-600">
          <div className="text-lg font-semibold text-purple-600">TaxBot</div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search"
              className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-sm focus:outline-none"
            />
            <button className="text-gray-500 hover:text-purple-600">🔗</button>
            <button className="text-gray-500 hover:text-purple-600">👤</button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl shadow-sm max-w-max ${
                m.role === 'user'
                  ? 'bg-purple-600 text-white self-end text-right'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100 self-start text-left'
              }`}
            >
              {m.content === 'SHOW_CHART' ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={[
                      { name: 'Income', amount: 80000 },
                      { name: 'Deductions', amount: 13850 },
                      { name: 'Taxable', amount: 66150 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : m.content.includes('<table') ? (
                <div dangerouslySetInnerHTML={{ __html: m.content }} />
              ) : (
                m.content
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-600">
          <input
            name="message"
            placeholder="Type your question here..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-700 focus:outline-none"
          />
          <div className="mt-2 flex justify-between">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-purple-600 hover:underline"
            >
              📎 Attach file
            </button>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
          </div>
        </form>
      </div>
    </div>
  );
}
