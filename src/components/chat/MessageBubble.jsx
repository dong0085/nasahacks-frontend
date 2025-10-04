export default function MessageBubble({ msg }) {

  return (
    <li className={`flex ${msg.role === 'user' ? "justify-end" : "justify-start"} my-2`}>
      <div className="max-w-[85%] md:max-w-[65%] rounded px-4 py-3 text-sm border bg-[#2D3337] border-[#7D7D7D] text-[#C9C9C9]">
        {msg.content}
        {msg.type === "results" && (
          <div className="mt-3 space-y-3">
            {msg.items?.map((it) => (
              <a
                key={it.id}
                href={it.url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl border border-[#7D7D7D] bg-[#1C2026] px-4 py-3 hover:border-[#379DA6] hover:shadow"
              >
                <p className="text-[#C9C9C9] font-medium">{it.title}</p>
                <p className="text-xs text-[#C9C9C9]">{it.meta}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}
