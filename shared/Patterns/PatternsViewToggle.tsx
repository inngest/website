import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import ViewToggle from "./ViewToggle";

export default function PatternsViewToggle() {
  const router = useRouter();
  const path = router.asPath.split("?")[0].split("#")[0];
  const agent = path.endsWith("/md");

  const setView = useCallback(
    (view: "human" | "agent") => {
      if (view === "agent" && !agent) {
        const next = (path.replace(/\/$/, "") || "/patterns") + "/md";
        router.push(next);
      } else if (view === "human" && agent) {
        const next = path.replace(/\/md$/, "") || "/patterns";
        router.push(next);
      }
    },
    [agent, path, router]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }
      if ((e.key === "h" || e.key === "H") && agent) setView("human");
      else if ((e.key === "m" || e.key === "M") && !agent) setView("agent");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [agent, setView]);

  return <ViewToggle agent={agent} onChange={setView} />;
}
