import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingBubble from './TypingBubble';
import ChatInput from './ChatInput';
import { useChat } from '../../hooks/useChat';

export default function Chat() {
  const { messages, articles, makePrompt, fetchArticles, error, loading } =
    useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (error)
    return (
      <div>
        <p>Something Wrong</p>
      </div>
    );

  return (
    <section className="rounded-2xl border border-[#2A3238] bg-[#1C2026] p-3 h-[72vh] flex flex-col">
      <ul className="flex-1 overflow-y-auto space-y-0.5 pr-1 flex flex-col justify-end">
        {messages.map(
          (m, i) => m.role !== 'system' && <MessageBubble key={i} msg={m} />
        )}
        {loading && <TypingBubble />}
        <div ref={bottomRef} />
        {!!articles.length &&
          articles.map((a) => (
            <li>
              <a
                href={`https://doi.org/${a.doi}`}
                target="_blank"
                rel="noopener noreferrer">
                {a.title}
              </a>
            </li>
          ))}
      </ul>
      <div className="pt-3">
        <ChatInput onSend={makePrompt} disabled={loading} />
      </div>
      <button onClick={fetchArticles}>Get Articles Now!</button>
    </section>
  );
}
