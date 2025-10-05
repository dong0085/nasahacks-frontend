import { useState } from "react";
import { getCompletion, getRankedArticles } from "../utils/api";

const prompts = {
  0: "You are a research assistant for NASA scientists. At this stage, your role is to ask concise, professional follow-up questions that help narrow down the researcher’s intent, while also summarizing their focus back in precise terms. Avoid speculation or providing resources. Confirm scope so alignment is clear before retrieval.",
  1: "You are a research assistant for NASA scientists. At this stage, you have enough context and now begin retrieving the most relevant articles. Respond in a professional, confident tone that you are initiating the search (e.g., “Retrieving the most relevant articles based on your request...”). Keep it short and authoritative.",
};

export function useChat() {
  const [stage, setStage] = useState(0);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(false);

  const maybeAdvanceStage = (messages) => {
    if (messages >= 3) return setStage(1)
    const roll = Math.random();
    if (stage === 0 && roll < 0.3) return setStage(1);
  };

  const makePrompt = async (prompt) => {
    const newMessages = [
      { role: "system", content: prompts[stage] },
      ...messages.filter((m) => m.role !== "system"),
      { role: "user", content: `${prompt} ${stage}` },
    ];
    setMessages(newMessages);
    setLoading(true);

    try {
      const completion = await getCompletion(newMessages);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: completion },
      ]);

      // randomly advance stage, but if more than 3 user messages go get article
      const userMessages = messages.filter(m => m.role === 'user');
      maybeAdvanceStage(userMessages);

			if (stage === 1) {
				await fetchArticles();
			}
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
      console.error("Error fetching articles:", err);
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
