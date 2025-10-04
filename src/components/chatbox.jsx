export default function ChatBox({value, onChange}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full ">
      <div className="w-full max-w-xl">
        <div className="flex items-center rounded-xl bg-gray-800 px-6 py-6 shadow-md">
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full p-2 border rounded"
          />
          {/* Example icons: replace with desired icon components */}
          <span className="mx-3 text-gray-400">
            <svg width="20" height="20" fill="none">
              <circle cx="10" cy="10" r="10" fill="#4B5563" />
            </svg>
          </span>
          <span className="mr-3 text-gray-400">
            <svg width="20" height="20" fill="none">
              <rect width="20" height="20" rx="5" fill="#4B5563" />
            </svg>
          </span>
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-md p-2 transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 10h10M10 5l5 5-5 5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
