# NASA Research Assistant – Space Apps Challenge 2025

A rapid prototype for the [Build a Space Biology Knowledge Engine](https://www.spaceappschallenge.org/2025/challenges/build-a-space-biology-knowledge-engine/?tab=details) challenge. The goal is to help NASA researchers narrow ambiguous questions, surface the most relevant literature, and explore paper details quickly.

## 🛰️ Project Vision
- Guide researchers through scoped follow-up questions.
- Retrieve and rank space biology papers.
- Provide concise summaries, key terms, and metadata in a friendly UI.
- Keep a responsive conversation loop that adapts as the user refines intent.

## 🧱 Architecture Overview
| Layer | Description |
| --- | --- |
| UI | React + TailwindCSS (via `@tailwindcss/vite`) |
| Routing | [`App`](src/App.jsx) sets up routes for Home, About, and fallback pages. |
| Hooks | [`useChat`](src/hooks/useChat.jsx) orchestrates conversation stages, completion calls, and article retrieval. |
| Components | Chat flow in [`Chat`](src/components/chat/Chat.jsx) with message bubbles, typing indicator, and references panel. |
| Services | [`api`](src/utils/api.js) wraps completion and ranked article endpoints (dummy-enabled). |

## 🚀 Getting Started
1. **Copy environment variables**
   ```sh
   cp .env.example .env
   ```
   - `VITE_API_URL` — backend endpoint for chat + search.
   - `VITE_OPENAI_API_KEY` — only needed if API gateway proxies OpenAI.

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Run in development**
   ```sh
   npm run dev
   ```
   Visit http://localhost:5173.

4. **Build for production**
   ```sh
   npm run build
   npm run preview
   ```

## 🔁 Chat Stages (in [`useChat`](src/hooks/useChat.jsx))
- **Stage 0:** assistant asks clarifying follow-ups.
- **Stage 1:** signals retrieval and triggers ranked article search.
- **Stage 2:** answers grounded in returned articles.

Stage transitions can auto-advance based on user message count or randomness to keep momentum.

## 📦 API Integration
The project ships with dummy responses for offline demos:
```js
// src/utils/api.js
const USE_DUMMY = true;
```
Set to `false` to hit real endpoints. Expected REST surface:
- `POST /chat` `{ messages }` → `{ reply }`
- `POST /search` `{ messages }` → `{ data: Article[] }`

## 💡 UX Highlights
- Responsive layout: chat + references on desktop, stacked on mobile.
- Article cards with TL;DR, key terms, and external DOI links.
- Autoresizing input with keyboard shortcuts (Enter send, Shift+Enter newline).
- “New inquiry” button resets conversation state.

## 🧪 Testing & Quality
- ESLint (flat config) with React Hooks + Fast Refresh rules.
- Prettier configured for consistent formatting.

## 🛤️ Roadmap Ideas
- Multi-document grounding citations per response.
- User tagging & bookmarking.
- Authenticated researcher profiles.
- Analytics on query types to prioritize content gaps.

## 👥 Team Notes
Document sprint progress, API keys, and deployment links here as the hackathon advances.
