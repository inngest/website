import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import ViewToggle from "./ViewToggle";

export default function PatternsViewToggle() {
  const router = useRouter();
  const agent = router.query.view === "agent";

  const setView = useCallback(
    (view: "human" | "agent") => {
      const { view: _v, ...rest } = router.query;
      if (view === "agent") {
        router.push({ query: { ...rest, view: "agent" } }, undefined, { shallow: true });
      } else {
        router.push({ query: rest }, undefined, { shallow: true });
      }
    },
    [router]
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
