import NextLink from "next/link";

import Container from "./Container";
import Heading from "./Heading";
import {
  RiArrowRightSLine,
  RiLock2Line,
  RiLineChartFill,
  RiShieldKeyholeLine,
  RiIdCardLine,
  RiHealthBookLine, // replace with DNA in 4.3
} from "@remixicon/react";
import { Button } from "src/shared/Button";
import Link from "src/components/Link";

export default function Enterprise() {
  return (
    <Container>
      <Heading
        label="Enterprise ready"
        title="Security, scalability, and compliance"
        description={
          <>
            We take security and reliability seriously. Our platform complies
            with the security standards you need to run your business.
          </>
        }
        className="my-8"
      />
      <div className="max-w-5xl mx-6 sm:mx-auto my-16 grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-8 text-basis">
          <div className="flex flex-col gap-2 justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="font-bold">
                <NextLink
                  href={`/docs/learn/security?ref=homepage-enterprise`}
                  className="flex flex-row gap-3 items-center group hover:underline underline-offset-2 transition-all cursor-pointer"
                >
                  <RiLock2Line className="w-5 text-muted" />
                  SOC 2 Compliant{" "}
                  <RiArrowRightSLine className="group-hover:translate-x-1.5 relative top-px transition-transform duration-150 " />
                </NextLink>
              </h3>
              <p className="text-balance">
                Audited regularly for compliance with your B2B solution.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="flex flex-row gap-3 items-center font-bold">
                <RiLineChartFill className="w-5 text-muted" />
                Billions of functions per month
              </h3>
              <p className="text-balance">
                Our platform has been put to the test and designed to scale so
                your team can just focus on building a great product.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="flex flex-row gap-3 items-center font-bold">
                <RiShieldKeyholeLine className="w-5 text-muted" />
                End-to-end encryption
              </h3>
              <p className="text-balance">
                Data is encrypted in transit and at rest, so you can trust that
                your data is safe. Use our{" "}
                <Link href="/docs/features/middleware/encryption-middleware?ref=homepage-enterprise">
                  encryption middleware
                </Link>{" "}
                for additional control.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="flex flex-row gap-3 items-center font-bold">
                <RiIdCardLine className="w-5 text-muted" />
                SSO and SAML
              </h3>
              <p className="text-balance">
                Secure your account with single sign-on and SAML.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="flex flex-row gap-3 items-center font-bold">
                <RiHealthBookLine className="w-5 text-muted" />
                HIPAA BAA Available
              </h3>
              <p className="text-balance">
                Our system was built with healthcare in mind to handle sensitive
                data.
              </p>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <img
            src="/assets/homepage/gradient-graphics/enterprise.svg"
            alt="Enterprise ready"
          />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <Button href="/contact?ref=homepage-enterprise" arrow="right">
          Chat with a solutions engineer
        </Button>
      </div>
    </Container>
  );
}
