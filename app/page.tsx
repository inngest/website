import { type Metadata } from "next";

import CodeBlock from "src/components/RedesignedLanding/FeatureNavigate/CodeBlock";
import CodeBlockSwitcher from "src/components/RedesignedLanding/FeatureNavigate/CodeBlockSwitcher";
import Terminal from "src/components/RedesignedLanding/FeatureNavigate/Terminal";
import DevServerSection from "src/components/RedesignedLanding/FeatureNavigate/DevServerSection";
import { generateMetadata } from "src/utils/social";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "src/components/RedesignedLanding/FeatureNavigate/Card";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Button } from "src/components/RedesignedLanding/Button";
import FeatureNavigate from "src/components/RedesignedLanding/FeatureNavigate/FeatureNavigate";

export const metadata: Metadata = generateMetadata({
  title: "AI and backend workflows, orchestrated at any scale",
  description:
    "Inngest's durable functions replace queues, state management, and scheduling to enable any developer to write reliable, multi-step code faster without touching infrastructure.",
  image: "/assets/homepage/open-graph.png",
});

export default function Page() {
  return <FeatureNavigate />;
}
