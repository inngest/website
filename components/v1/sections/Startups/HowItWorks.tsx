import { SIGN_UP_URL } from "@/components/v1/nav-config";
import { appendRef } from "@/utils/v1/ref";

// Sign up first, then apply: approved startups need an account anyway,
// and anyone who signs up starts building on the Free plan while their
// application is reviewed. Kept to one short line per card so the page
// scans quickly; the FAQ carries the detail.
const cardClassName =
  "flex flex-col gap-3 rounded-[4px] border border-v1-steel/20 bg-v1-surfaceElevated p-6";
const stepClassName = "text-v1-label-sm uppercase text-v1-accent-salmon";
const bodyClassName = "text-v1-body-sm-loose text-v1-frost/80";

export default function HowItWorks() {
  return (
    <ol className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:mt-[52px] lg:gap-6 lg:px-[70px]">
      <li className={cardClassName}>
        <span className={stepClassName}>Step 1</span>
        <h2 className="text-v1-heading-sm text-v1-frost">
          Create a free account
        </h2>
        <p className={bodyClassName}>
          Start building on the Free plan.{" "}
          <a
            href={appendRef(SIGN_UP_URL, "startups-apply")}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap text-v1-accent-salmon underline hover:text-v1-accent-salmon-light"
          >
            Sign up free &rarr;
          </a>
        </p>
      </li>
      <li className={cardClassName}>
        <span className={stepClassName}>Step 2</span>
        <h2 className="text-v1-heading-sm text-v1-frost">Apply</h2>
        <p className={bodyClassName}>
          Use your Inngest account email in the form below.
        </p>
      </li>
      <li className={cardClassName}>
        <span className={stepClassName}>Step 3</span>
        <h2 className="text-v1-heading-sm text-v1-frost">Upgrade at 50% off</h2>
        <p className={bodyClassName}>
          Once approved, add a card and upgrade to Pro.
        </p>
      </li>
    </ol>
  );
}
