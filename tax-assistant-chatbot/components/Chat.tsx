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
    <div className="flex flex-col max-w-2xl mx-auto p-6 min-h-screen bg-white dark:bg-zinc-950 font-sans text-sm">
      <div className="flex-1 space-y-3 overflow-y-auto pb-40">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl max-w-[75%] whitespace-pre-wrap shadow-sm transition ${
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

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-700"
      >
        <input
          name="message"
          placeholder="Ask about taxes…"
          className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />

        <div className="mt-2 flex justify-between items-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm text-purple-600 hover:text-purple-700 dark:hover:text-purple-400 font-medium transition"
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
