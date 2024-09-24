import React from "react";

const ProductHuntAnnouncementBanner = () => (
  <div className="py-4 px-4 flex flex-col md:flex-row items-center justify-center border-b border-[#B0B0B0] gap-8 relative">
    <div className="text-sm text-basis max-w-[826px]">
      <span className="hidden md:inline">
        As part of launch week, we launched our new open source{" "}
        <strong>Workflow Kit</strong> today on <strong>Product Hunt</strong>.
        Check it out and give us an upvote!{" "}
      </span>
      <span className="md:hidden inline">
        We are launching <strong>Workflow Kit</strong> today on{" "}
        <a
          href="https://www.producthunt.com/posts/workflow-kit-by-inngest"
          className="underline"
        >
          Product Hunt
        </a>
        !
      </span>
      <br />
      <span className="hidden md:inline">
        Want to see more of Inngest's launch week?{" "}
        <a href="/launch-week" className="underline">
          Follow along with all of our updates
        </a>
      </span>
      <span className="md:hidden inline">
        Follow along with all with{" "}
        <a href="/launch-week" className="underline">
          Inngest's launch week updates.
        </a>
      </span>
    </div>
    <div className="hidden md:inline">
      <a
        href="https://www.producthunt.com/posts/workflow-kit-by-inngest?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-workflow&#0045;kit&#0045;by&#0045;inngest"
        target="_blank"
      >
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=490802&theme=neutral"
          alt="Workflow&#0032;Kit&#0032;by&#0032;Inngest - Open&#0032;source&#0032;SDK&#0032;to&#0032;add&#0032;Zapier&#0045;like&#0032;workflows&#0032;to&#0032;your&#0032;product | Product Hunt"
          style={{ width: "169px", height: "38px" }}
          width="169"
          height="38"
        />
      </a>
    </div>
  </div>
);

export default ProductHuntAnnouncementBanner;
