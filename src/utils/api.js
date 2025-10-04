import OpenAI from 'openai';

const apiUrl = import.meta.env.VITE_API_URL;

export const getCompletion = async (messages) => {
	const res = await fetch(`${apiUrl}/chat`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ messages }), 
	});

	if (!res.ok) {
		throw new Error(`Chat request failed: ${res.status} ${res.statusText}`);
	}

	const data = await res.json();
	return data.reply; 
};

export const getRankedArticles = async (messages) => {
	try {
		const res = await fetch(`${apiUrl}/search`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ messages }),
		});

		if (!res.ok) {
			throw new Error(`Request failed: ${res.status} ${res.statusText}`);
		}

		const { data } = await res.json();
		return data;
	} catch (err) {
		console.error('Error fetching ranked articles:', err);
		return [];
	}
};
