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

    const newMessage: Message = {
      role: 'user',
      content: input,
    };

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
      {
        role: 'assistant',
        content: `Thanks! I’ve received the file **${file.name}**. I’ll analyze it shortly.`,
      },
    ]);
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 font-sans text-sm text-zinc-900 dark:text-white">
      {/* Top Nav */}
      <div className="w-full border-b border-zinc-200 dark:border-zinc-800 px-6 py-3 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900 shadow-sm sticky top-0 z-10">
        <div className="text-lg font-semibold text-purple-600">TaxBot</div>
        <div className="flex-1 mx-4 max-w-lg">
          <input
            type="text"
            placeholder="Search chats"
            className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex gap-3">
          <button className="text-zinc-500 hover:text-purple-600 transition">🔗 Share</button>
          <button className="text-zinc-500 hover:text-purple-600 transition">👤 Profile</button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-4 rounded-lg max-w-[75%] whitespace-pre-wrap shadow-sm ${
              m.role === 'user'
                ? 'bg-gradient-to-br from-purple-600 to-purple-500 text-white self-end ml-auto'
                : 'bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white self-start'
            }`}
          >
            {m.content === 'SHOW_CHART' ? (
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
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
                    <Bar dataKey="amount" fill="#a78bfa" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : m.content.includes('<table') ? (
              <div dangerouslySetInnerHTML={{ __html: m.content }} />
            ) : (
              m.content
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 px-6 py-4 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800"
      >
        <input
          name="message"
          placeholder="Ask about taxes…"
          className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />

        <div className="mt-2 flex justify-between items-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm text-purple-600 hover:text-purple-800 dark:hover:text-purple-400 font-medium transition"
          >
            Upload a file
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.png,.jpg,.jpeg"
          />
        </div>
      </form>
    </div>
  );
}
