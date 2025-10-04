export default function TypingBubble() {
  return (
    <li className="flex justify-start my-2">
      <div className="max-w-[70%] rounded-2xl px-4 py-3 text-sm bg-[#39444A] border border-[#57636A] text-[#E6E8EA]">
        <span className="inline-flex gap-1 align-middle">
          <span className="animate-pulse">●</span>
          <span className="animate-pulse [animation-delay:120ms]">●</span>
          <span className="animate-pulse [animation-delay:240ms]">●</span>
        </span>
      </div>
    </li>
  );
}
