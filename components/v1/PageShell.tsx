import "@/styles/v1.css";
import "@/styles/v1-animations.css";
import { type ReactNode } from "react";

import Footer from "@/components/v1/Footer";
import Header from "@/components/v1/Header";
import { MotionRoot } from "@/components/v1/MotionRoot";
import { ScrollToTop } from "@/components/v1/ScrollToTop";
import { ScrollResetOnLoad } from "@/components/v1/ScrollResetOnLoad";

/**
 * v1 page shell. Owns header/footer/grain backdrop + the MotionConfig.
 * The optional `backdrop` slot sits between grain and content (z-[1])
 * for page-wide decoration.
 */
export default function PageShell({
  children,
  backdrop,
}: {
  children: ReactNode;
  backdrop?: ReactNode;
}) {
  return (
    <div className="v1-page min-h-screen bg-v1-canvasBase text-v1-basis">
      <ScrollResetOnLoad />
      <ScrollToTop />
      <Header />
      <div className="relative">
        <div
          aria-hidden="true"
          className="v1-page-bg pointer-events-none absolute inset-0"
        />
        {backdrop}
        <MotionRoot>
          <div className="relative z-10">
            <main>{children}</main>
            <Footer />
          </div>
        </MotionRoot>
      </div>
    </div>
  );
}
