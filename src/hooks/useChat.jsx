import { useState } from 'react';
import { getCompletion, getRankedArticles } from '../utils/api';

export function useChat() {
	const [messages, setMessages] = useState([]);
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
