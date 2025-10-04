import { useState } from 'react';
import { getCompletion, getRankedArticles } from '../utils/api';

export function useChat() {
	const [messages, setMessages] = useState([
		{
			role: 'system',
			content: `
You are a specialized research assistant for NASA scientists and researchers. 
Your sole purpose is to help the user narrow down the precise scope of their research inquiry so that it can be used as context for a vector search.

Guidelines:
- Be concise, professional, and highly precise in your responses. 
- Ask clarifying questions only when they help narrow the scope (e.g., timeframe, specific experiment, mission name, species, variables).
- Do not provide random information, speculation, or general knowledge unless explicitly asked.
- Never suggest unrelated resources (e.g., books, news, casual advice).
- Keep answers focused on clarifying or refining what the user is looking for.
- Prioritize short, well-spoken responses that advance the user toward a sharper, search-ready query.
`,
		},
	]);
	const [loading, setLoading] = useState(false);
	const [articles, setArticles] = useState([]);
	const [error, setError] = useState(false);

	const makePrompt = async (prompt) => {
		const newMessages = [...messages, { role: 'user', content: prompt }];
		setMessages(newMessages);
		setLoading(true);

		try {
			const completion = await getCompletion(newMessages);
			setMessages((prev) => [...prev, { role: 'assistant', content: completion }]);
		} catch (err) {
			console.error(err);
			setError(true);
		} finally {
			setLoading(false);
		}
	};

	const fetchArticles = async () => {
		setLoading(true);
		try {
			const results = await getRankedArticles(messages);
			setArticles(results);
		} catch (err) {
			console.error('Error fetching articles:', err);
			setError(true);
		} finally {
			setLoading(false);
		}
	};

	return {
		messages,
		articles,
		loading,
		error,
		makePrompt,
		fetchArticles,
	};
}
