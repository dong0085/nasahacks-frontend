import { useEffect, useRef, useState } from "react";

export default function ChatInput({ onSend, disabled }) {
  const [val, setVal] = useState("");
  const taRef = useRef(null);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";
  }, [val]);

  const submit = () => {
    const text = val.trim();
    if (!text || disabled) return;
    onSend(text);
    setVal("");
  };

  return (
    <div className="rounded-2xl border border-[#57636A] bg-[#39444A] p-2 flex items-end gap-2">
      <textarea
        ref={taRef}
        rows={1}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder="Type a new message here"
        className="w-full resize-none bg-transparent outline-none text-sm text-[#E6E8EA] placeholder:text-[#9AA4AB] p-2"
      />
      <button
        onClick={submit}
        disabled={disabled}
        className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium bg-[#379DA6] text-black hover:brightness-110 disabled:opacity-50"
        aria-label="Send"
        title="Send"
      >
        {/* TODO: Add icon here */}1
      </button>
    </div>
  );
}
