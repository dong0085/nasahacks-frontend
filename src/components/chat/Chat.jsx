import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import TypingBubble from "./TypingBubble";
import ChatInput from "./ChatInput";
import { useChat } from "../../hooks/useChat";
import { FiChevronRight, FiRefreshCw, FiChevronLeft } from "react-icons/fi";

export default function Chat({ initialQuery }) {
  const {
    messages,
    articles,
    makePrompt,
    error,
    loadingChat,
    loadingArticles,
    reset,
    mode,
    setMode
  } = useChat();
  const bottomRef = useRef(null);
  const hasSentInitial = useRef(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const hasArticles = articles.length > 0;

  const renderArticles = () => {
    if (loadingArticles && !hasArticles) {
      return (
        <p className="text-sm text-[#9AA4AB]">Searching NASA literature…</p>
      );
    }

    if (!hasArticles) {
      return (
        <p className="text-sm text-[#9AA4AB]">
          Sources will populate once the assistant refines your query.
        </p>
      );
    }

    return (
      <ul className="space-y-2">
        {articles.map((a, idx) => {
          const meta = [a.year, a.journal].filter(Boolean).join(" • ");
          const summary = a.summary || a.abstract || a.snippet;
          const key = a.pmid ?? a.doi ?? `${a.title ?? "article"}-${idx}`;

          const content = (
            <>
              <div className="flex-1 pr-2">
                <h3 className="text-sm font-semibold text-[#E6E8EA]">
                  {a.title ?? "Untitled source"}
                </h3>
                {meta && <p className="mt-1 text-xs text-[#9AA4AB]">{meta}</p>}
                {summary && (
                  <p className="mt-2 text-xs text-[#B5BDC4] line-clamp-3">
                    {summary}
                  </p>
                )}
              </div>
              <FiChevronRight className="mt-1 text-lg text-[#379DA6] opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
            </>
          );

          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => setSelectedArticle(a)}
                className="group flex w-full items-start justify-between rounded-xl border border-[#2A3238] bg-[#161B21] px-4 py-3 text-left hover:border-[#379DA6] hover:bg-[#1E252C]"
                aria-label={`Open details for ${a.title ?? "article"}`}
              >
                {content}
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingChat]);

  useEffect(() => {
    if (initialQuery && !hasSentInitial.current) {
      hasSentInitial.current = true;
      makePrompt(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  if (error) {
    return (
      <section className="grid gap-4 flex flex-1 min-h-0 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-2xl border border-[#2A3238] bg-[#1C2026] p-6 flex items-center justify-center">
          <p className="text-sm text-red-400">
            Something went wrong. Try again.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="h-[82vh] md:h-[82vh] w-full flex flex-col gap-3 overflow-hidden md:flex-row min-h-0">
      {!selectedArticle ? (
        <div
          id="main-chat-box"
          className="h-2/3 md:h-full md:w-2/3 flex flex-col overflow-hidden rounded-2xl border border-[#2A3238] bg-[#1C2026] p-3 min-h-0"
        >
          <header
            id="chat-header"
            className="mb-3 flex items-center justify-between gap-2 border-b border-[#2A3238] pb-3"
          >
            <div>
              <p className="text-[11px] uppercase tracking-wide text-[#9AA4AB]">
                Conversation
              </p>
              <h2 className="text-sm font-semibold text-[#E6E8EA]">
                NASA Research Assistant
              </h2>
            </div>
            <span className="flex gap-3 ">
              {['Casual', 'Standard', 'Advanced'].map((m, i )=> (
                <button onClick={() => {setMode(m.toLowerCase())}} key={i} disabled={m.toLowerCase() === mode} className={`disabled:opacity-100 disabled:pointer-events-none opacity-50 hover:opacity-75 text-[12px] align-bottom`}>{m}</button>
              ))}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#2A3238] px-3 py-1 text-[11px] text-[#9AA4AB]">
              <span
                className={`h-2 w-2 rounded-full ${
                  loadingChat ? "bg-[#379DA6] animate-pulse" : "bg-[#38F8AC]"
                }`}
              />
              Live
            </span>
          </header>

          <div
            id="messages-scroll-area"
            className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain touch-pan-y pr-1"
          >
            <ul className="flex flex-col justify-end space-y-0.5">
              {messages.map(
                (m, i) =>
                  m.role !== "system" && (
                    <MessageBubble
                      key={i}
                      msg={m}
                    />
                  )
              )}
              {loadingChat && <TypingBubble />}
              <div
                id="messages-scroll-area"
                className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain touch-pan-y pr-1"
              >
                <ul className="flex flex-col justify-end space-y-0.5">
                  {messages.map(
                    (m, i) =>
                      m.role !== "system" && (
                        <MessageBubble
                          key={i}
                          msg={m}
                        />
                      )
                  )}
                  {loadingChat && <TypingBubble />}
                  <div ref={bottomRef} />
                </ul>
              </div>
              <div ref={bottomRef} />
            </ul>
          </div>

          <div
            id="chat-input-container"
            className="pt-3"
          >
            <ChatInput
              onSend={makePrompt}
              disabled={loadingArticles || loadingChat}
            />
            <div className="mt-2 flex flex-wrap items-center justify-between text-[11px] text-[#9AA4AB]">
              <span>Enter to send • Shift+Enter for newline</span>
              <button
                type="button"
                onClick={reset}
                disabled={
                  loadingArticles || loadingChat || messages.length <= 1
                }
                className={`inline-flex items-center gap-1 rounded-lg border border-[#2A3238] px-2.5 py-1 text-xs text-[#E6E8EA] 
    hover:border-[#379DA6] hover:text-[#379DA6] 
    disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none`}
              >
                New inquiry
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          id="article-details"
          className="h-2/3 md:h-full md:w-2/3 flex flex-col min-h-0 overflow-hidden rounded-2xl border border-[#2A3238] bg-[#1C2026] p-3"
        >
          <div className="mb-3 grid grid-cols-[auto,1fr,auto] items-start gap-2 border-b border-[#2A3238] pb-1">
            <button
              type="button"
              onClick={() => setSelectedArticle(null)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#2A3238] text-[#E6E8EA] hover:border-[#379DA6] hover:text-[#379DA6]"
              aria-label="Back to chat"
              title="Back"
            >
              <FiChevronLeft />
            </button>
            <div className="flex flex-col items-center text-center gap-2">
              <h2 className="text-base font-bold text-[#E6E8EA] leading-snug break-words">
                {selectedArticle.title ?? "Untitled source"}
              </h2>
              <div className="flex flex-col items-baseline gap-1">
                {Array.isArray(selectedArticle.tags) &&
                selectedArticle.tags.length > 0 ? (
                  <ul className="flex flex-wrap justify-center gap-2">
                    {selectedArticle.tags.slice(0, 12).map((tag, idx) => (
                      <li
                        key={`${tag}-${idx}`}
                        className="inline-flex items-center gap-1 rounded-full border border-[#379DA6]/40 bg-[#19262E] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[#8BE0E8]"
                      >
                        <span className="text-[#379DA6]">#</span>
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[#5C6770]">
                    No tags yet—add a few to bookmark this topic.
                  </p>
                )}
              </div>
            </div>
            <span
              aria-hidden
              className="h-8 w-8"
            />
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wide text-[#9AA4AB]">
                  TL; DR
                </h3>
                <p className="text-sm text-[#C9C9C9]">
                  {selectedArticle.tl_dr ?? "—"}
                </p>

                <h4 className="text-xs uppercase tracking-wide text-[#9AA4AB]">
                  Key terms
                </h4>
                <p className="text-sm text-[#C9C9C9]">
                  {Array.isArray(selectedArticle.key_terms)
                    ? selectedArticle.key_terms.join(", ")
                    : selectedArticle.key_terms ?? "—"}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wide text-[#9AA4AB]">
                  Authors
                </h3>
                <p className="text-sm text-[#C9C9C9]">
                  {(() => {
                    const list = Array.isArray(selectedArticle.authors)
                      ? selectedArticle.authors.slice(0, 3)
                      : [];
                    if (list.length === 0) return "—";
                    return `${list.join(", ")}, et al.`;
                  })()}
                </p>

                <div>
                  <h4 className="text-xs uppercase tracking-wide text-[#9AA4AB]">
                    Year
                  </h4>
                  <p className="text-sm text-[#C9C9C9]">
                    {selectedArticle.year ?? "—"}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-wide text-[#9AA4AB]">
                    DOI
                  </h4>
                  <p className="text-sm text-[#379DA6]">
                    {selectedArticle.doi ? (
                      <a
                        href={`https://doi.org/${selectedArticle.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {selectedArticle.doi}
                      </a>
                    ) : (
                      <span className="text-[#C9C9C9]">—</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-xs uppercase tracking-wide text-[#9AA4AB]">
                Abstract
              </h3>
              <p className="mt-2 text-sm text-[#C9C9C9] whitespace-pre-wrap">
                {selectedArticle.abstract ?? "—"}
              </p>
            </div>
          </div>
        </div>
      )}

      <aside
        id="references-panel"
        className="h-1/3 md:h-full md:w-1/3 flex flex-col overflow-hidden rounded-2xl border border-[#2A3238] bg-[#161B21] p-4"
      >
        <div
          id="references-header"
          className="flex items-center justify-between gap-2"
        >
          <div>
            <p className="text-[11px] uppercase tracking-wide text-[#9AA4AB]">
              References
            </p>
            <h2 className="text-sm font-semibold text-[#E6E8EA]">
              Suggested papers
            </h2>
          </div>
          <span
            id="refresh-sources-button"
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg  text-[#E6E8EA] ${
              loadingArticles && "opacity-100"
            } opacity-0`}
            aria-label="Refresh sources"
          >
            <FiRefreshCw className={loadingArticles ? "animate-spin" : ""} />
          </span>
        </div>
        <div
          id="references-list"
          className="mt-4 flex-1 overflow-y-auto pr-1"
        >
          {renderArticles()}
        </div>
      </aside>
    </section>
  );
}
