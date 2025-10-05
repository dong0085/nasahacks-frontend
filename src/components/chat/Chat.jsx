import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingBubble from './TypingBubble';
import ChatInput from './ChatInput';
import { useChat } from '../../hooks/useChat';
import { FiChevronRight, FiRefreshCw } from 'react-icons/fi';

export default function Chat({ initialQuery }) {
	const { messages, articles, makePrompt, fetchArticles, error, loading } = useChat();
	const bottomRef = useRef(null);
	const hasSentInitial = useRef(false);

	const hasArticles = articles.length > 0;

	const handleSend = async (prompt) => {
		await makePrompt(prompt);
		fetchArticles();
	};

	const renderArticles = () => {
		if (loading && !hasArticles) {
			return <p className="text-sm text-[#9AA4AB]">Searching NASA literature…</p>;
		}

		if (!hasArticles) {
			return <p className="text-sm text-[#9AA4AB]">Sources will populate once the assistant refines your query.</p>;
		}

		return (
			<ul className="space-y-2">
				{articles.map((a, idx) => {
					const href = a.url || (a.doi ? `https://doi.org/${a.doi}` : undefined);
					const meta = [a.year, a.journal].filter(Boolean).join(' • ');
					const summary = a.summary || a.abstract || a.snippet;
					const key = a.pmid ?? a.doi ?? `${a.title ?? 'article'}-${idx}`;

					const content = (
						<>
							<div className="flex-1 pr-2">
								<h3 className="text-sm font-semibold text-[#E6E8EA]">{a.title ?? 'Untitled source'}</h3>
								{meta && <p className="mt-1 text-xs text-[#9AA4AB]">{meta}</p>}
								{summary && <p className="mt-2 text-xs text-[#B5BDC4] line-clamp-3">{summary}</p>}
							</div>
							<FiChevronRight className="mt-1 text-lg text-[#379DA6] opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
						</>
					);

					return (
						<li key={key}>
							{href ? (
								<a href={href} target="_blank" rel="noopener noreferrer" className="group flex items-start justify-between rounded-xl border border-[#2A3238] bg-[#161B21] px-4 py-3 hover:border-[#379DA6] hover:bg-[#1E252C]">
									{content}
								</a>
							) : (
								<div className="group flex items-start justify-between rounded-xl border border-[#2A3238] bg-[#161B21] px-4 py-3">{content}</div>
							)}
						</li>
					);
				})}
			</ul>
		);
	};

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages, loading]);

	useEffect(() => {
		if (initialQuery && !hasSentInitial.current) {
			hasSentInitial.current = true;
			handleSend(initialQuery);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialQuery]);

	if (error) {
		return (
			<section className="grid gap-4 flex flex-1 min-h-0 lg:grid-cols-[minmax(0,1fr)_320px]">
				<div className="rounded-2xl border border-[#2A3238] bg-[#1C2026] p-6 flex items-center justify-center">
					<p className="text-sm text-red-400">Something went wrong. Try again.</p>
				</div>
			</section>
		);
	}

	return (
		<section className="h-[84vh] md:h-[86vh] flex flex-col gap-3 py-6 overflow-hidden md:flex-row">
			<div id="main-chat-box" className="h-2/3  md:h-full md:w-2/3 flex flex-col overflow-hidden rounded-2xl border border-[#2A3238] bg-[#1C2026] p-3">
				<header id="chat-header" className="mb-3 flex items-center justify-between gap-2 border-b border-[#2A3238] pb-3">
					<div>
						<p className="text-[11px] uppercase tracking-wide text-[#9AA4AB]">Conversation</p>
						<h2 className="text-sm font-semibold text-[#E6E8EA]">NASA Research Assistant</h2>
					</div>
					<span className="inline-flex items-center gap-2 rounded-full border border-[#2A3238] px-3 py-1 text-[11px] text-[#9AA4AB]">
						<span className={`h-2 w-2 rounded-full ${loading ? 'bg-[#379DA6] animate-pulse' : 'bg-[#38F8AC]'}`} />
						Live
					</span>
				</header>

				<ul id="messages-list" className="flex-1 overflow-y-auto overscroll-y-contain touch-pan-y pr-1 space-y-0.5 flex flex-col">
					{messages.map((m, i) => m.role !== 'system' && <MessageBubble key={i} msg={m} />)}
					{loading && <TypingBubble />}
					<div ref={bottomRef} />
				</ul>

				<div id="chat-input-container" className="pt-3">
					<ChatInput onSend={handleSend} disabled={loading} />
					<div className="mt-2 flex flex-wrap items-center justify-between text-[11px] text-[#9AA4AB]">
						<span>Enter to send • Shift+Enter for newline</span>
						<button
							type="button"
							onClick={fetchArticles}
							disabled={loading}
							className="inline-flex items-center gap-1 rounded-lg border border-[#2A3238] px-2.5 py-1 text-xs text-[#E6E8EA] hover:border-[#379DA6] hover:text-[#379DA6] disabled:opacity-40 lg:hidden"
						>
							<FiRefreshCw className={loading ? 'animate-spin' : ''} />
							Refresh sources
						</button>
					</div>
				</div>
			</div>

			<aside id="references-panel" className="h-1/3 md:h-full md:w-1/3 flex flex-col overflow-hidden rounded-2xl border border-[#2A3238] bg-[#161B21] p-4">
				<div id="references-header" className="flex items-center justify-between gap-2">
					<div>
						<p className="text-[11px] uppercase tracking-wide text-[#9AA4AB]">References</p>
						<h2 className="text-sm font-semibold text-[#E6E8EA]">Suggested papers</h2>
					</div>
					<button
						id="refresh-sources-button"
						type="button"
						onClick={fetchArticles}
						disabled={loading}
						className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#2A3238] text-[#E6E8EA] hover:border-[#379DA6] hover:text-[#379DA6] disabled:opacity-40"
						aria-label="Refresh sources"
					>
						<FiRefreshCw className={loading ? 'animate-spin' : ''} />
					</button>
				</div>
				<div id="references-list" className="mt-4 flex-1 overflow-y-auto pr-1">
					{renderArticles()}
				</div>
			</aside>
		</section>
	);
}
