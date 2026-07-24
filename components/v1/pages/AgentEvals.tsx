import PageShell from "@/components/v1/PageShell";
import Hero from "@/components/v1/sections/AgentEvals/Hero";
import Problem from "@/components/v1/sections/AgentEvals/Problem";
import FeedbackLoop from "@/components/v1/sections/AgentEvals/FeedbackLoop";
import ScoreOutcomes from "@/components/v1/sections/AgentEvals/ScoreOutcomes";
import Features from "@/components/v1/sections/AgentEvals/Features";
import UseCases from "@/components/v1/sections/AgentEvals/UseCases";
import Faq from "@/components/v1/sections/AgentEvals/Faq";

/**
 * /platform/agent-evals — score agents on real production outcomes.
 * Composed from AgentEvals/ sections, reusing shared v1 primitives
 * (SplitHero, SectionHeader, BeforeAfterSlider, GradientFrame, Faq).
 */
export default function AgentEvals() {
  return (
    <PageShell>
      <div className="overflow-x-clip">
        <Hero />
        <Problem />
        <FeedbackLoop />
        <ScoreOutcomes />
        <Features />
        <UseCases />
        <Faq />
      </div>
    </PageShell>
  );
}
