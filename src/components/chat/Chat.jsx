import { useEffect, useMemo, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import TypingBubble from "./TypingBubble";
import ChatInput from "./ChatInput";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: "0",
      role: "user",
      content: "What is the latest paper about electromagnetic interference",
    },
    {
      id: "1",
      role: "assistant",
      content:
        "Here are the latest findings for electromagnetic interference shielding",
    },
    {
      id: "2",
      role: "assistant",
      type: "results",
      content: "",
      items: [
        {
          id: "3",
          title: "Mice in Bion-M1 Space Mission: Training and Selection",
          meta: "PLOS ONE • 2014 • doi:10.1371/journal.pone.0104830",
          url: "#",
        },
        {
          id: "4",
          title: "Mice in Bion-M1 Space Mission: Training and Selection",
          meta: "PLOS ONE • 2014 • doi:10.1371/journal.pone.0104830",
          url: "#",
        },
      ],
    },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (text) => {
    const user = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((m) => [...m, user]);
    setLoading(true);
  };

  const disabled = useMemo(() => loading, [loading]);

  return (
    <section className="rounded-2xl border border-[#2A3238] bg-[#1C2026] p-3 h-[72vh] flex flex-col">
      <ul className="flex-1 overflow-y-auto space-y-0.5 pr-1 flex flex-col justify-end">
        {messages.map((m) => (
          <MessageBubble key={m.id} msg={m} />
        ))}
        {loading && <TypingBubble />}
        <div ref={bottomRef} />
      </ul>
      <div className="pt-3">
        <ChatInput onSend={handleSend} disabled={disabled} />
      </div>
    </section>
  );
}
