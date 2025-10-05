import {
  FiCompass,
  FiMessageCircle,
  FiBookOpen,
  FiRefreshCw,
} from "react-icons/fi";

const steps = [
  {
    icon: FiCompass,
    title: "State your mission",
    body: "Describe the topic, mission phase, organism, or timeframe you care about. The assistant immediately restates the scope so you know it is on the right trajectory.",
  },
  {
    icon: FiMessageCircle,
    title: "Clarify & iterate",
    body: "Answer the follow-up prompts. Behind the scenes the chat loop shifts through discovery, retrieval, and grounded synthesis modes to stay focused.",
  },
  {
    icon: FiBookOpen,
    title: "Review grounded insights",
    body: "Each answer cites the five most relevant papers. Open the right rail to skim TL;DRs, key terms, authors, and abstracts without leaving the conversation.",
  },
];

const features = [
  "Mode toggles tailor tone: Casual for ideation, Standard for concise research, Advanced for technical briefs.",
  "A retrieval pulse alerts you when literature searches are running, so you can watch results stream in real time.",
  "Article detail view highlights DOI links, key terms, and authors for quick citation checks.",
];

function AboutUs() {
  return (
    <section className="flex flex-1 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 text-[#C9C9C9]">
        <header className="space-y-4">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8BE0E8]">
            <FiRefreshCw className="animate-spin-slow text-[#379DA6]" />
            Space Apps Challenge 2025
          </p>
          <h1 className="text-3xl font-semibold text-[#E6E8EA] md:text-4xl">
            Nucleus helps NASA researchers narrow the unknowns—and surface the
            right papers faster.
          </h1>
          <p className="text-base md:text-lg">
            Built for the “Build a Space Biology Knowledge Engine” brief, our
            prototype blends conversational guidance with ranked NASA literature
            retrieval. Ask a question, refine intent with the assistant, and
            open the references drawer to explore sources without breaking your
            research flow.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="group flex flex-col gap-3 rounded-2xl border border-[#2A3238] bg-[#1C2026]/80 p-6 shadow-lg shadow-black/20 transition hover:border-[#379DA6] hover:bg-[#1E252C]"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#379DA6]/40 bg-[#19262E] text-[#379DA6] transition group-hover:border-[#379DA6]">
                <Icon />
              </span>
              <h2 className="text-lg font-semibold text-[#E6E8EA]">{title}</h2>
              <p className="text-sm leading-relaxed">{body}</p>
            </article>
          ))}
        </div>

        <section className="space-y-4 rounded-2xl border border-[#2A3238] bg-[#161B21] p-6 md:p-8">
          <h3 className="text-xl font-semibold text-[#E6E8EA]">
            Why it matters
          </h3>
          <p className="text-sm md:text-base">
            Space biology demands rapid synthesis of scattered findings. Nucleus
            stitches together expert prompting, staged retrieval, and rich paper
            metadata so teams can align on hypotheses before experiments ever
            launch.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3 rounded-2xl border border-[#2A3238] bg-[#1A2229] p-6 md:p-8">
          <h3 className="text-xl font-semibold text-[#E6E8EA]">
            On the horizon
          </h3>
          <p className="text-sm md:text-base">
            We are lining up focused upgrades to deepen trust in each answer and
            make dense terminology easier to parse mid-conversation.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
            <li>
              Inline scientific term highlighting with hover tooltips so domain
              jargon becomes instantly legible.
            </li>
            <li>
              Inline citation anchors that jump to the exact article passages
              grounding an assistant response.
            </li>
          </ul>
        </section>

        <footer className="rounded-2xl border border-[#2A3238] bg-[#1C2026] p-6 text-sm leading-relaxed text-[#9AA4AB]">
          Have feedback or ideas for deployment on mission programs? Let us
          know—this hackathon build is ready to evolve into a full research
          copilot for NASA life sciences teams.
        </footer>
      </div>
    </section>
  );
}

export default AboutUs;
