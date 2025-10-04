import { useState } from "react";
import Chat from "../components/chat/Chat";

function Home() {
  const [showChat, setShowChat] = useState(false);
  const [initialQuery, setInitialQuery] = useState("");
  const [val, setVal] = useState("");

  const submit = (e) => {
    e?.preventDefault();
    const q = val.trim();
    if (!q) return;
    setInitialQuery(q);
    setVal("");
    setShowChat(true);
  };

  return (
    <div className="flex-1">
      {!showChat ? (
        <div className="flex items-center justify-center min-h-[72vh]">
          <form
            /* onSubmit={submit} */
            className="w-full max-w-xl bg-[#1C2026] p-6 rounded-2xl border border-[#2A3238] shadow"
          >
            <label className="block text-sm text-[#C9C9C9] mb-2">
              Enter your research query
            </label>
            <input
              value={val}
              onChange={(e) => setVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit(e);
              }}
              placeholder="e.g. 'atmospheric effects on Mars rover instrumentation 2015-2020'"
              className="w-full rounded-lg px-4 py-3 bg-[#2D3337] border border-[#7D7D7D] text-[#E6E8EA] mb-3"
            />
            <div className="flex justify-center">
              <button
                type="submit"
                className="rounded-xl px-4 py-2 bg-[#379DA6] text-black font-medium"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      ) : (
        // Pass the initialQuery to Chat so it can seed the conversation
        <Chat initialQuery={initialQuery} />
      )}
    </div>
  );
}
export default Home;
