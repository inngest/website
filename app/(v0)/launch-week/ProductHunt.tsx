"use client";
const url =
  "https://www.producthunt.com/posts/workflow-kit-by-inngest?embed=true&utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-workflow&#0045;kit&#0045;by&#0045;inngest";

export default function ProductHunt() {
  return (
    <div
      className="cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        window.open(url, "_blank");
      }}
    >
      <img
        src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=490802&theme=dark&period=daily"
        alt="Workflow&#0032;Kit&#0032;by&#0032;Inngest - Open&#0032;source&#0032;SDK&#0032;to&#0032;add&#0032;Zapier&#0045;like&#0032;workflows&#0032;to&#0032;your&#0032;product | Product Hunt"
        style={{ width: "250px", height: "54px" }}
        width="250"
        height="54"
      />
    </div>
  );
}
