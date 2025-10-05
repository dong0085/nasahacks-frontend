const apiUrl = import.meta.env.VITE_API_URL;

const USE_DUMMY = true;

export const getCompletion = async (messages) => {
  if (USE_DUMMY) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          "This is a dummy chat response, you need to set USE_DUMMY in /utils/api.js to false to get real completions"
        );
      }, 1 * 1000);
    });
  }

  const res = await fetch(`${apiUrl}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    throw new Error(`Chat request failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.reply;
};

const dummyArticle = {
  _id: "dummy-article-1",
  pmid: "98765432",
  doi: "10.1000/fake-doi.2025.001",
  title: "Exploring the Impact of Microgravity on Human Skeletal Muscle",
  abstract:
    "This study investigates how prolonged exposure to microgravity conditions during spaceflight affects skeletal muscle mass, function, and recovery post-mission. Results provide insight into countermeasures for astronaut health on long-duration missions.",
  journal: "International Journal of Space Biology",
  year: "2025",
  authors: ["Alice Smith", "Bob Johnson", "Carol Martinez", "David Lee"],
  tl_dr:
    "Astronaut muscle loss in microgravity is significant, but targeted exercise and nutrition show promise for mitigation.",
  tags: [
    "space biology",
    "microgravity",
    "skeletal muscle",
    "astronaut health",
  ],
  key_terms: [
    "atrophy",
    "resistance training",
    "nutritional countermeasures",
    "long-duration missions",
  ],
  quotes: [
    "“Muscle mass decreased by an average of 18% after 6 months in microgravity.”",
    "“Resistance exercise showed the strongest correlation with recovery of muscle strength.”",
  ],
  score: 0.873,
  rank: 1,
  reason:
    "Chosen for its direct relevance to spaceflight health risks and its exploration of interventions, which aligns with research priorities in astronaut well-being.",
};

export const getRankedArticles = async (messages) => {
  try {
    if (USE_DUMMY)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            dummyArticle,
            dummyArticle,
            dummyArticle,
            dummyArticle,
            dummyArticle,
          ]);
        }, 10000);
      });

    const res = await fetch(`${apiUrl}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!res.ok) {
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }

    const { data } = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching ranked articles:", err);
    return [];
  }
};
