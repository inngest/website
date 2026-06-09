import PageShell from "@/components/v1/PageShell";
import Faq from "@/components/v1/sections/AI/Faq";
import GoDeeper from "@/components/v1/sections/AI/GoDeeper";
import Hero from "@/components/v1/sections/AI/Hero";
import Lifecycle from "@/components/v1/sections/AI/Lifecycle";
import Primitives from "@/components/v1/sections/AI/Primitives";
import Unbreakable from "@/components/v1/sections/AI/Unbreakable";
import UseCases from "@/components/v1/sections/AI/UseCases";
import Testimonials from "@/components/v1/sections/shared/Testimonials";
import { AI_TESTIMONIAL_SLIDES } from "@/components/v1/sections/shared/testimonialSlides";
import cubeDotsData from "@/public/assets/v1/ai-hero/cube-dots.json";

// Bundle the cube-dots manifest into the JS at build time so it ships
// inline with the SSR HTML on every request. Was previously a runtime
// `fs.readFileSync(public/...)` — works locally and at build time but
// fails on Vercel because /ai is rendered dynamically and `public/`
// isn't included in the serverless function bundle. Importing the
// JSON makes it part of the module graph so it's always present.
const CUBE_DOTS_JSON = JSON.stringify(cubeDotsData);

export default function AIPage() {
  return (
    <>
      <script
        id="cube-dots-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: CUBE_DOTS_JSON }}
      />
      <PageShell>
        <Hero />
        <Testimonials
          slides={AI_TESTIMONIAL_SLIDES}
          portraitClassName="mix-blend-luminosity"
        />
        <Unbreakable />
        <Lifecycle />
        <UseCases />
        <Primitives />
        <Faq />
        <GoDeeper />
      </PageShell>
    </>
  );
}
