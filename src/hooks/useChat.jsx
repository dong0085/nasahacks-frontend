import { useState } from "react";
import { getCompletion, getRankedArticles } from "../utils/api";

const prompts = {
  0: () =>
    "You are a research assistant for NASA scientists. At this stage, your role is to ask concise, professional follow-up questions that help narrow down the researcher’s intent, while also summarizing their focus back in precise terms. Avoid speculation or providing resources. Confirm scope so alignment is clear before retrieval.",

  1: () =>
    "You are a research assistant for NASA scientists. At this stage, you have enough context and now begin retrieving the most relevant articles. Respond in a professional, confident tone that you are initiating the search (e.g., “Retrieving the most relevant articles based on your request...”). Keep it short and authoritative.",

  2: (articles) => {
    const formatted = articles
      .map((a, i) => {
        return `Article ${i + 1}:
Title: ${a.title}
Summary: ${a.tl_dr}
Quotes: ${
          Array.isArray(a.quotes)
            ? a.quotes.join("\n- ")
            : JSON.stringify(a.quotes)
        }`;
      })
      .join("\n\n");

    return `You are a research assistant for NASA scientists. You will respond to questions about the following 5 articles to the best of your ability. Base your answers only on the provided content.

${formatted}`;
  },
};

export function useChat() {
  const [stage, setStage] = useState(0);
  const [messages, setMessages] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(false);

  const maybeAdvanceStage = (messages) => {
    if (messages > 1) return setStage(1);
    const roll = Math.random();
    if (stage === 0 && roll < 0.3) return setStage(1);
  };

  const makePrompt = async (prompt) => {
    const newMessages = [
      { role: "system", content: prompts[stage](articles) },
      ...messages.filter((m) => m.role !== "system"),
      { role: "user", content: `${prompt}` },
    ];
    setMessages(newMessages);
    setLoadingChat(true);

    try {
      const completion = await getCompletion(newMessages);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: completion },
      ]);

      // randomly advance stage, but if more than 3 user messages go get article
      if (stage === 0) {
        const userMessages = messages.filter((m) => m.role === "user");
        maybeAdvanceStage(userMessages.length + 1);
      }

      if (stage === 1) {
        await fetchArticles();
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoadingChat(false);
    }
  };

  const fetchArticles = async () => {
    setLoadingArticles(true);
    try {
      const results = await getRankedArticles(messages);
      setArticles(results);
      setStage(2);
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError(true);
    } finally {
      setLoadingArticles(false);
    }
  };

  const reset = () => {
    setMessages([]);
    setStage(0);
    setArticles([]);
  };

  return {
    messages,
    articles,
    loadingChat,
    loadingArticles,
    error,
    makePrompt,
    fetchArticles,
    reset,
  };
}
