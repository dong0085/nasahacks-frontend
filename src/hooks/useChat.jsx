import { useState, useRef } from "react";
import { getCompletion, getRankedArticles } from "../utils/api";

const prompts = {
  casual: {
    0: () =>
      "You are a NASA research helper in casual mode. Ask light, simple follow-up questions in plain language to clarify what the user wants. Summarize their intent back in an easy, approachable way. Avoid jargon.",
    1: () =>
      "You are in casual mode. Announce that you are retrieving articles in a clear, friendly, and brief way. Keep it simple and approachable.",
    2: (articles) => {
      const formatted = articles
        .map(
          (a, i) => `Article ${i + 1}:
Title: ${a.title}
Summary: ${a.tl_dr}
Reason for choosing: ${a.reason}`
        )
        .join("\n\n");

      return `You are in casual mode. Only answer based on these 5 articles. Keep responses straightforward and avoid overly technical phrasing.\n\n${formatted}`;
    },
    success: (count) =>
      `You are in casual mode. You have retrieved ${count} articles. Report this in a short, clear, and simple message, then note that the first was selected for the provided reason.`,
  },

  standard: {
    0: () =>
      "You are a research assistant for NASA scientists. Ask concise, professional follow-up questions to refine the user’s intent. Summarize their scope back precisely. Avoid speculation.",
    1: () =>
      "You are a NASA research assistant. You now have enough context and are retrieving the most relevant articles. State this in a confident, professional way.",
    2: (articles) => {
      const formatted = articles
        .map(
          (a, i) => `Article ${i + 1}:
Title: ${a.title}
Summary: ${a.tl_dr}
Reason for choosing: ${a.reason}
Quotes: ${
            Array.isArray(a.quotes)
              ? a.quotes.join("\n- ")
              : JSON.stringify(a.quotes)
          }`
        )
        .join("\n\n");

      return `You are a NASA research assistant. Answer questions strictly from the following 5 articles:\n\n${formatted}`;
    },
    success: (count) =>
      `You are a NASA research assistant. You have retrieved ${count} articles. Report this clearly and state that you selected the first one for the given reason.`,
  },

  advanced: {
    0: () =>
      "You are in advanced mode. Probe with minimal, precise follow-up questions. Summarize the research intent in technical terms only. No extra words.",
    1: () =>
      "You are in advanced mode. Indicate retrieval of relevant literature in a terse, authoritative tone.",
    2: (articles) => {
      const formatted = articles
        .map(
          (a, i) => `Article ${i + 1}:
${a.title}
Summary: ${a.tl_dr}
Reason: ${a.reason}`
        )
        .join("\n\n");

      return `You are in advanced mode. Respond only with content derived from these 5 articles. Keep answers concise and technical.\n\n${formatted}`;
    },
    success: (count) =>
      `You are in advanced mode. ${count} articles retrieved. Report count succinctly and note the first article was selected for the provided reason.`,
  },
};

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(false);
  const [mode, setMode] = useState("standard");
  const stageRef = useRef(0);

  const maybeAdvanceStage = (messages) => {
    if (messages > 2) {
      return true;
    }
    const roll = Math.random();
    if (messages > 2 && roll < 0.3) {
      return true;
    }
    return false;
  };

  const makePrompt = async (prompt) => {
    setLoadingChat(true);

    try {
      // If we’re in stage 0, check if we should advance
      setMessages((prev) => [...prev, { role: "user", content: prompt }]);
      if (stageRef.current === 0) {
        const userMessages = messages.filter((m) => m.role === "user");
        const shouldAdvance = maybeAdvanceStage(userMessages.length + 1);

        if (shouldAdvance) {
          stageRef.current = 1;

          // fire off the stage 1 announcement
          const announceMessages = [
            {
              role: "system",
              content: `Main Prompt: ${prompts[mode][1]()} STRICT RULES:
- You are NOT allowed to answer the user’s question. 
- You are NOT allowed to provide facts, lists, or background information. 
- You are ONLY allowed to do what the prompt above describes (ask follow-ups, reflect intent, announce retrieval, etc.).
- If the user asks for information, you must redirect by asking a clarifying question or restating their intent instead.
- Do not invent or add anything extra.`,
            },
            ...messages.filter((m) => m.role !== "system"),
            { role: "user", content: "Proceed with retrieval." },
          ];

          const announceCompletion = await getCompletion(announceMessages);

          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: announceCompletion },
          ]);

          // now kick off article fetch → will bump stage to 2
          await fetchArticles();
          return; // exit early so we don’t process this as a stage 0 turn
        }
      }

      // otherwise: normal flow for current stage
      const newMessages = [
        {
          role: "system",
          content: prompts[mode][stageRef.current](articles),
        },
        ...messages.filter((m) => m.role !== "system"),
        { role: "user", content: prompt },
      ];

      setMessages(newMessages);

      const completion = await getCompletion(newMessages);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: completion },
      ]);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoadingChat(false);
    }
  };

  const getSuccessMessage = async (articles) => {
    const count = articles.length;
    const top = articles[0];
    console.log(top);

    const newMessages = [
      { role: "system", content: prompts[mode].success(count) },
      {
        role: "user",
        content: `The reason provided for selecting the first article ${top.title}: ${top.reason}`,
      },
    ];

    return await getCompletion(newMessages);
  };

  const fetchArticles = async () => {
    setLoadingArticles(true);
    try {
      const results = await getRankedArticles(messages);
      console.log(results);
      setArticles(results);
      stageRef.current = 2;
      const successMessage = await getSuccessMessage(results);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: successMessage },
      ]);
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError(true);
    } finally {
      setLoadingArticles(false);
    }
  };

  const reset = () => {
    setMessages([]);
    stageRef.current = 0;
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
    mode,
    setMode,
  };
}
