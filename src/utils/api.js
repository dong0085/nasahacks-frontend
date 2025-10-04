import OpenAI from 'openai';

const apiUrl = import.meta.env.VITE_API_URL;
const aiKey = import.meta.env.VITE_OPENAI_API_KEY;

const client = new OpenAI({
	apiKey: aiKey,
	dangerouslyAllowBrowser: true,
});

export const getCompletion = async (messages) => {
	const res = await client.chat.completions.create({
		model: 'gpt-4o-mini',
		messages,
	});

	return res.choices[0].message.content; // <-- just return the text
};

export const getRankedArticles = async (messages) => {
	try {
		const res = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(messages),
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
