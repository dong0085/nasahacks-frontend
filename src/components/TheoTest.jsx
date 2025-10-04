import React, { useState } from 'react';
import { useChat } from '../hooks/useChat';

export default function TheoTest() {
	const { messages, articles, loading, error, makePrompt, fetchArticles } = useChat();
	const [input, setInput] = useState('');

	const handleSend = async () => {
		if (!input.trim()) return;
		await makePrompt(input);
		setInput('');
	};

	return (
		<div>

			{error && <p style={{ color: 'red' }}>Something went wrong!</p>}
			{loading && <p>Loading...</p>}

			<div>
				<h3>Messages</h3>
				<ul>
					{messages.map((m, i) => (
						<li key={i}>
							<strong>{m.role}:</strong> {m.content}
						</li>
					))}
				</ul>
			</div>

			<input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." />
			<button onClick={handleSend}>Send</button>
			<button onClick={fetchArticles}>Get Articles</button>

			<div>
				<h3>Articles</h3>
				<ul>
					{articles.map((a, i) => (
						<li key={i}>{a.title || JSON.stringify(a)}</li>
					))}
				</ul>
			</div>
		</div>
	);
}
