import { SIGN_UP_URL } from "@/components/v1/nav-config";
import { appendRef } from "@/utils/v1/ref";

// Sign up first, then apply: approved startups need an account anyway,
// and anyone who signs up starts building on the Free plan while their
// application is reviewed.
export default function HowItWorks() {
  return (
    <ol className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:mt-[52px] lg:px-[70px]">
      <li className="flex flex-col gap-3 border-t border-v1-steel/20 pt-6">
        <span className="text-v1-caption text-v1-frost/60">Step 1</span>
        <h2 className="text-v1-heading-sm text-v1-frost">
          Create your account
        </h2>
        <p className="text-v1-body-sm-loose text-v1-frost/80">
          Sign up for Inngest. It&apos;s free, takes a couple of minutes, and
          you can start building right away.{" "}
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
      <li className="flex flex-col gap-3 border-t border-v1-steel/20 pt-6">
        <span className="text-v1-caption text-v1-frost/60">Step 2</span>
        <h2 className="text-v1-heading-sm text-v1-frost">Apply</h2>
        <p className="text-v1-body-sm-loose text-v1-frost/80">
          Fill out the form below with your Inngest account email and a few
          details about your company.
        </p>
      </li>
      <li className="flex flex-col gap-3 border-t border-v1-steel/20 pt-6">
        <span className="text-v1-caption text-v1-frost/60">Step 3</span>
        <h2 className="text-v1-heading-sm text-v1-frost">Upgrade at 50% off</h2>
        <p className="text-v1-body-sm-loose text-v1-frost/80">
          We&apos;ll email you next steps. Add a payment method and upgrade
          to Pro with your discount.
        </p>
      </li>
    </ol>
  );
}
