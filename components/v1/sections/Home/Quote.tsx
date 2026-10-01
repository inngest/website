"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import InstallCommandButton from "@/components/v1/sections/Home/InstallCommandButton";
import HlsVideo from "@/shared/HlsVideo";

const DX_DEMO_SRC =
  "https://cdn.inngest.com/videos/homepage-product-demo/hls/master.m3u8";

export default function Quote() {
  return (
    <section
      aria-label="The DX in Durable Execution"
      className="relative z-10 flex w-full flex-col items-center justify-center gap-[46px]"
    >
      <h2 className="v1-trim w-full text-center font-whyte text-[clamp(2rem,6vw,72px)] font-light uppercase leading-[1.2] tracking-[-3px] text-white">
        The DX in Durable Execution
      </h2>
      <motion.p
        {...reveals.body}
        className="w-full text-center font-v1Body text-[20px] leading-[1.5] text-[#CDCDCD]"
      >
        However it&rsquo;s written, wherever it runs&mdash;Inngest makes it
        unbreakable. Start locally, scale instantly.
      </motion.p>

      <motion.div
        {...reveals.body}
        className="flex flex-row flex-wrap items-center justify-center gap-[14px]"
      >
        <InstallCommandButton label="Copy prompt to start locally" />
        <Link
          href="/pricing?ref=homepage-dx"
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-v1-accent-salmon px-4 font-v1Mono text-[12px] font-semibold uppercase leading-[1.3] tracking-[1.44px] text-white"
        >
          Start Free in Cloud
        </Link>
      </motion.div>

      <motion.div
        {...reveals.body}
        className="aspect-video w-full overflow-hidden"
      >
        <HlsVideo
          src={DX_DEMO_SRC}
          loop
          controls
          autoPlay
          className="block h-full w-full object-cover"
        />
      </motion.div>
    </section>
  );
}
