import { type ReactNode } from "react";
import { RiArrowDownSLine } from "@remixicon/react";
import PageShell from "@/components/v1/PageShell";
import LogoMarquee from "@/components/v1/sections/Home/LogoMarquee";

// Terms & Conditions — an 800px reading column centred on the page: a
// centred title, then the iubenda-generated T&C document. The document is
// a flat sequence of #7A7A7A hairlines (major section breaks) and
// heading+body groups. Three heading levels map exactly to the v1 type
// scale:
//   • Heading/Md 32/40 → major section titles (heading-card + native trim)
//   • Heading/Sm 26/31 → subsections          (text-v1-heading-sm)
//   • Heading/Xs 20/30 → sub-subsections       (text-v1-heading-xs)
// Body copy is 18/27 CircularXX (text-v1-body-lg-loose), left untrimmed so
// the natural 1.5 leading flows; blank lines between paragraphs are real
// empty lines (<Blank/>).

function Divider() {
  return <hr className="h-px w-full border-0 bg-v1-steel" />;
}

// Heading/Md 32/40 — major section title. heading-card carries the Whyte
// face + 32/40 metrics; v1-trim adds the native cap-trim and we add the
// -0.01em tracking the "Heading/Md" style specifies.
function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-v1-heading-card v1-trim break-words tracking-[-0.01em] text-white">
      {children}
    </h2>
  );
}

// Heading/Sm 26 — subsection.
function H3({ children }: { children: ReactNode }) {
  return <h3 className="text-v1-heading-sm break-words text-white">{children}</h3>;
}

// Heading/Xs 20 — sub-subsection.
function H4({ children }: { children: ReactNode }) {
  return <h4 className="text-v1-heading-xs break-words text-white">{children}</h4>;
}

// Heading + its body, 24px apart. Groups sit on the column's 44px rhythm,
// so a title-only group renders just its heading.
function Group({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-6">{children}</div>;
}

// Body block — inherits 18/27 CircularXX onto its <p>/<ul> children. <p>
// margins are reset so interior paragraph spacing comes only from <Blank/>
// lines and list flow (natural leading).
//
// Each block is cap-trimmed at its OUTER edges only. We do that by pulling
// the first child's top up by the cap-height leading and the last child's
// bottom up by the baseline leading — the same -0.396em/-0.395em metrics
// the body-lg token bakes into its own trim. Negative margins (not
// `text-box-trim`) so a single-element body gets both edges without the two
// longhands colliding, and it degrades cleanly everywhere including Firefox.
// A <ul> box hugs its items, so the same rule trims list-only blocks too.
const TRIM_EDGES = "[&>:first-child]:-mt-[0.396em] [&>:last-child]:-mb-[0.395em]";

function Body({ children }: { children: ReactNode }) {
  return (
    <div
      className={`text-v1-body-lg-loose break-words text-white [&_p]:m-0 ${TRIM_EDGES}`}
    >
      {children}
    </div>
  );
}

// One empty line (27px) between paragraphs — a blank-line spacer.
const Blank = () => (
  <p aria-hidden className="select-none">
    {"​"}
  </p>
);

// Disc list, text indented 27px; items flow at the body line height with
// no extra gap.
function Ul({ children }: { children: ReactNode }) {
  return <ul className="list-disc [&>li]:ms-[27px]">{children}</ul>;
}

// External links open in a new tab; in-page schemes (mailto:) don't.
function Link({ href, children }: { href: string; children: ReactNode }) {
  const external = /^https?:/.test(href);
  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noreferrer" })}
      className="underline underline-offset-2 motion-safe:transition-colors hover:text-v1-frost/70"
    >
      {children}
    </a>
  );
}

export default function Terms() {
  return (
    <PageShell>
      <div className="overflow-x-clip">
        {/* 800px reading column: 44px section rhythm. max-w 864 + lg:px-8
            lands content at exactly 800 on desktop while keeping the v1
            px-6/sm:px-9/lg:px-8 gutter. Top padding clears the fixed header
            and scales down on mobile; flat 80px bottom before the closing
            lockup. Mirrors the Privacy page. */}
        <section className="mx-auto flex w-full max-w-[864px] flex-col gap-11 px-6 pb-20 pt-24 text-v1-frost sm:px-9 sm:pt-[120px] lg:px-8 lg:pt-[156px]">
          {/* Title — centred Display/Sm, cap-trimmed. */}
          <header className="flex justify-center">
            <h1 className="font-v1Display w-full text-center uppercase leading-[1.25] tracking-[-0.01em] text-white [text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [font-size:clamp(2.5rem,5.4vw,4rem)]">
              Terms and Conditions
            </h1>
          </header>

          <Divider />

          {/* Intro — shares the top divider, no second rule. */}
          <Group>
            <SectionTitle>Terms &amp; Conditions of inngest.com</SectionTitle>
            <Body>
              <p>These Terms govern:</p>
              <Ul>
                <li>the use of this Application, and,</li>
                <li>
                  any other related Agreement or legal relationship with the
                  Owner
                </li>
              </Ul>
              <p>
                in a legally binding way. Capitalized words are defined in the
                relevant dedicated section of this document.
              </p>
              <Blank />
              <p>The User must read this document carefully.</p>
            </Body>
          </Group>

          <Divider />

          {/* This Application is provided by. */}
          <Group>
            <H3>This Application is provided by:</H3>
            <Body>
              <p>
                Inngest Inc - 821 Howard St, San Francisco CA, 94103, USA
              </p>
              <Blank />
              <p>
                {"Owner contact email: "}
                <Link href="mailto:hello@inngest.com">hello@inngest.com</Link>
              </p>
              <Blank />
              <p>{`"This Application" refers to:`}</p>
              <Ul>
                <li>
                  This website, including its subdomains and any other website
                  through which the Owner makes its Service available;
                </li>
                <li>
                  Applications for mobile, tablet and other smart device
                  systems;
                </li>
                <li>The Application Program Interfaces (API);</li>
                <li>The Service;</li>
                <li>
                  Any applications, sample and content files, source code,
                  scripts, instruction sets or software included as part of the
                  Service, as well as any related documentation;
                </li>
              </Ul>
            </Body>
          </Group>

          {/* What the user should know at a glance. */}
          <Group>
            <H3>What the user should know at a glance</H3>
            <Body>
              <Ul>
                <li>
                  Please note that some provisions in these Terms may only apply
                  to certain categories of Users. In particular, certain
                  provisions may only apply to Consumers or to those Users that
                  do not qualify as Consumers. Such limitations are always
                  explicitly mentioned within each affected clause. In the
                  absence of any such mention, clauses apply to all Users.
                </li>
                <li>
                  The right of withdrawal only applies to European Consumers.
                </li>
              </Ul>
            </Body>
          </Group>

          <Divider />

          {/* ───── Terms of use ───── */}
          <Group>
            <SectionTitle>Terms of use</SectionTitle>
            <Body>
              <p>
                Unless otherwise specified, the terms of use detailed in this
                section apply generally when using this Application.
              </p>
              <Blank />
              <p>
                Single or additional conditions of use or access may apply in
                specific scenarios and in such cases are additionally indicated
                within this document.
              </p>
              <Blank />
              <p>
                By using this Application, Users confirm to meet the following
                requirements:
              </p>
              <Ul>
                <li>
                  There are no restrictions for Users in terms of being
                  Consumers or Business Users;
                </li>
              </Ul>
            </Body>
          </Group>

          <Group>
            <H3>Content on this Application</H3>
            <Body>
              <p>
                Unless where otherwise specified or clearly recognizable, all
                content available on this Application is owned or provided by the
                Owner or its licensors.
              </p>
              <Blank />
              <p>
                The Owner undertakes its utmost effort to ensure that the
                content provided on this Application infringes no applicable
                legal provisions or third-party rights. However, it may not
                always be possible to achieve such a result.
              </p>
              <p>
                In such cases, without prejudice to any legal prerogatives of
                Users to enforce their rights, Users are kindly asked to
                preferably report related complaints using the contact details
                provided in this document.
              </p>
            </Body>
          </Group>

          <Group>
            <H4>
              Rights regarding content on this Application - All rights reserved
            </H4>
            <Body>
              <p>
                The Owner holds and reserves all intellectual property rights
                for any such content.
              </p>
              <Blank />
              <p>
                Users may not therefore use such content in any way that is not
                necessary or implicit in the proper use of the Service.
              </p>
            </Body>
          </Group>

          <Group>
            <H4>Access to provided content</H4>
            <Body>
              <p>
                Content that Users provide to this Application is made available
                according to the criteria outlined within this section.
              </p>
            </Body>
          </Group>

          <Group>
            <H4>Publicly available content</H4>
            <Body>
              <p>
                Content meant for public availability shall be automatically
                made public on this Application upon upload or, at the sole
                discretion of the Owner, at a later stage.
              </p>
              <Blank />
              <p>
                Any personal data, identifier or any other information that
                Users upload in connection with such content (such as a User-ID,
                avatar or nickname etc.) shall also appear in connection with the
                published content.
              </p>
            </Body>
          </Group>

          <Group>
            <H4>Private content</H4>
            <Body>
              <p>
                Private content provided by Users shall stay private and will
                not be shared with any third parties or accessed by the Owner
                without the User&rsquo;s explicit consent.
              </p>
            </Body>
          </Group>

          <Group>
            <H4>Content for determined audiences</H4>
            <Body>
              <p>
                Content meant to be made available to specific audiences may
                only be shared with such third parties as determined by Users.
              </p>
              <Blank />
              <p>
                Any personal data, identifier or any other information Users
                upload in connection with such content (such as a User-ID,
                avatar or nickname etc.) shall also appear in connection with the
                content.
              </p>
              <Blank />
              <p>
                Users may (and are encouraged to) check on this Application to
                find details of who can access the content they provide.
              </p>
            </Body>
          </Group>

          <Group>
            <H3>Access to external resources</H3>
            <Body>
              <p>
                Through this Application Users may have access to external
                resources provided by third parties. Users acknowledge and
                accept that the Owner has no control over such resources and is
                therefore not responsible for their content and availability.
              </p>
              <Blank />
              <p>
                Conditions applicable to any resources provided by third
                parties, including those applicable to any possible grant of
                rights in content, result from each such third parties&rsquo;
                terms and conditions or, in the absence of those, applicable
                statutory law.
              </p>
            </Body>
          </Group>

          <Group>
            <H3>Acceptable use</H3>
            <Body>
              <p>
                This Application and the Service may only be used within the
                scope of what they are provided for, under these Terms and
                applicable law.
              </p>
              <Blank />
              <p>
                Users are solely responsible for making sure that their use of
                this Application and/or the Service violates no applicable law,
                regulations or third-party rights.
              </p>
              <Blank />
              <p>
                Therefore, the Owner reserves the right to take any appropriate
                measure to protect its legitimate interests including denying
                Users access to this Application or the Service, terminating
                contracts, reporting any misconduct performed through this
                Application or the Service to the competent authorities &ndash;
                such as judicial or administrative authorities - whenever Users
                are suspected to be in violation of any laws, regulations,
                third-party rights and/or these Terms, including, but not limited
                to, by engaging in any of the following activities:
              </p>
            </Body>
          </Group>

          <Group>
            <H4>Conduct restrictions</H4>
            <Body>
              <Ul>
                <li>
                  pretending to fulfill any possible condition or requirements
                  for accessing this Application and/or using the Services, such
                  as for instance being adult according to law or qualifying as a
                  Consumer;
                </li>
                <li>
                  {`concealing their identity or stealing someone else's identity or pretend to be or represent a third-party, if not allowed to do so by such third-party;`}
                </li>
                <li>
                  manipulating identifiers to disguise or otherwise conceal the
                  origin of their messages or of the content posted;
                </li>
                <li>
                  defaming, abusing, harassing, using threatening practices,
                  threatening or violating the legal rights of others in any
                  other way;
                </li>
                <li>
                  promoting activity that may endanger the User&rsquo;s life or
                  the life of any other User or lead to physical harm. This
                  includes but is not limited to suicide threats or instigations,
                  intentional physical trauma, the use of illegal drugs, or
                  excessive drinking. Under no circumstance is any User allowed to
                  post any content promoting and/or encouraging and/or showing any
                  self-destructive or violent behavior on this Application;
                </li>
                <li>
                  probing, scanning or testing the vulnerability of this
                  Application, including the services or any network connected to
                  the website, nor breaching the security or authentication
                  measures on this Application, including the services or any
                  network connected to this Application;
                </li>
                <li>
                  installing, embedding, uploading or otherwise incorporating any
                  malware into or via this Application;
                </li>
                <li>
                  using this Application or the technical infrastructure in an
                  abusive, excessive or otherwise inappropriate way (for example:
                  for spamming purposes);
                </li>
                <li>
                  attempting to disrupt or tamper with the technical
                  infrastructure in a manner that harms or places an undue burden
                  on this Application or the Service;
                </li>
              </Ul>
            </Body>
          </Group>

          <Group>
            <H4>Excessive use of the Service</H4>
            <Body>
              <Ul>
                <li>
                  using a resource of this Application excessively in relation to
                  other Users of this Application &ndash; in such cases, the
                  Owner, at its sole discretion, additionally reserves the right
                  to suspend the User&rsquo;s account or limit the related
                  activity until the User reduces the excessive consumption;
                </li>
              </Ul>
            </Body>
          </Group>

          <Group>
            <H4>Excessive use of the API</H4>
            <Body>
              <Ul>
                <li>
                  sending abusive or excessively frequent requests to the Service
                  via the API. The Owner will determine what constitutes abuse or
                  excessive usage of the API and additionally reserves the right
                  to temporarily or permanently suspend access to the API by the
                  User. In such cases, the Owner will make a reasonable attempt to
                  alert the User prior to suspension;
                </li>
              </Ul>
            </Body>
          </Group>

          <Group>
            <H4>Scraping</H4>
            <Body>
              <Ul>
                <li>
                  adopting any automated process to extract, harvest or scrape
                  information, data and/or content from this Application and all
                  the digital properties thereto related unless where explicitly
                  allowed to do so by the Owner;
                </li>
              </Ul>
            </Body>
          </Group>

          <Group>
            <H4>Content restrictions</H4>
            <Body>
              <Ul>
                <li>
                  disseminating or publishing content that is unlawful, obscene,
                  illegitimate, libelous or inappropriate;
                </li>
                <li>
                  publishing any content that promotes, either directly or
                  indirectly, hate, racism, discrimination, pornography, violence;
                </li>
                <li>
                  disseminating or publishing any content that is false or may
                  create unjustified alarm;
                </li>
                <li>
                  using this Application to publish, disseminate or otherwise
                  provide content protected by intellectual property laws,
                  including but not limited to patent, trademark or copyright law,
                  unlawfully and without the legitimate right-holder&rsquo;s
                  consent;
                </li>
                <li>
                  using this Application to publish, disseminate or otherwise make
                  available any other content which infringes on any third-party
                  rights, including but not limited to state, military, trade or
                  professional secrets and personal data;
                </li>
                <li>
                  {`publishing any content or carrying out any activity that disrupts, interrupts, harms, or otherwise violates the integrity of this Application or another User's experience or devices. Such activities include: spamming, distributing unauthorized advertisements, phishing, defrauding others, spreading malware or viruses etc.;`}
                </li>
              </Ul>
            </Body>
          </Group>

          <Group>
            <H4>User protection</H4>
            <Body>
              <Ul>
                <li>misappropriating any account in use by another User;</li>
                <li>
                  harvesting or collecting any personally identifying information
                  of other Users including but not limited to their email
                  addresses or contact information, by circumventing the privacy
                  setting of other Users&rsquo; accounts on this Application or by
                  any other means;
                </li>
                <li>
                  using any information relating to other Users, including
                  personal or contact data, for purposes other than those this
                  Application is intended for;
                </li>
              </Ul>
            </Body>
          </Group>

          <Group>
            <H4>Commercial use restrictions</H4>
            <Body>
              <Ul>
                <li>
                  registering or using this Application in order to promote, sell
                  or advertise products or services of any kind in any way;
                </li>
                <li>
                  {`indicating or trying to imply in any manner, that a User stands in a qualified relationship with this Application or that this Application has endorsed the User, the User's products or services or any third party's products and services for any purpose;`}
                </li>
              </Ul>
            </Body>
          </Group>

          <Group>
            <H3>{`"Tell-a-friend"`}</H3>
            <Body>
              <p>
                This Application gives Users the opportunity to receive
                advantages if, as a result of their recommendation, any new User
                purchases a Product offered on this Application.
              </p>
              <p>
                In order to take advantage of this offer, Users may invite others
                to purchase the Products on this Application by sending them a
                tell-a-friend code provided by the Owner. Such codes can only be
                redeemed once.
              </p>
              <p>
                If upon purchase of the Products on this Application any of the
                persons invited redeems a tell-a-friend code, the inviting User
                shall receive the advantage or benefit (such as: a price
                reduction, an additional service feature, an upgrade etc.)
                specified on this Application.
              </p>
              <p>
                Tell-a-friend codes may be limited to specific Products among
                those offered on this Application.
              </p>
              <Blank />
              <p>
                The Owner reserves the right to end the offer at any time at its
                own discretion.
              </p>
              <Blank />
              <p>
                While no general limitation applies to the number of persons that
                can be invited, the amount of advantage or benefit that each
                inviting User can receive, may be limited.
              </p>
            </Body>
          </Group>

          <Group>
            <H3>API usage terms</H3>
            <Body>
              <p>
                Users may access their data relating to this Application via the
                Application Program Interface (API). Any use of the API,
                including use of the API through a third-party product/service
                that accesses this Application, is bound by these Terms and, in
                addition, by the following specific terms:
              </p>
              <Blank />
              <p>
                the User expressly understands and agrees that the Owner bears no
                responsibility and shall not be held liable for any damages or
                losses resulting from the User&rsquo;s use of the API or their
                use of any third-party products/services that access data through
                the API.
              </p>
            </Body>
          </Group>

          <Divider />

          {/* ───── Terms and Conditions of Sale ───── */}
          <Group>
            <SectionTitle>Terms and Conditions of Sale</SectionTitle>
          </Group>

          <Group>
            <H3>Paid Products</H3>
            <Body>
              <p>
                Some of the Products provided on this Application, as part of the
                Service, are provided on the basis of payment.
              </p>
              <Blank />
              <p>
                The fees, duration and conditions applicable to the purchase of
                such Products are described below and in the dedicated sections of
                this Application.
              </p>
            </Body>
          </Group>

          <Group>
            <H3>Product description</H3>
            <Body>
              <p>
                Prices, descriptions or availability of Products are outlined in
                the respective sections of this Application and are subject to
                change without notice.
              </p>
              <Blank />
              <p>
                While Products on this Application are presented with the greatest
                accuracy technically possible, representation on this Application
                through any means (including, as the case may be, graphic
                material, images, colors, sounds) is for reference only and
                implies no warranty as to the characteristics of the purchased
                Product.
              </p>
              <Blank />
              <p>
                The characteristics of the chosen Product will be outlined during
                the purchasing process.
              </p>
            </Body>
          </Group>

          <Group>
            <H3>Purchasing process</H3>
            <Body>
              <p>
                Any steps taken from choosing a Product to order submission form
                part of the purchasing process.
              </p>
              <Blank />
              <p>The purchasing process includes these steps:</p>
              <Ul>
                <li>
                  Users must choose the desired Product and verify their purchase
                  selection.
                </li>
                <li>
                  After having reviewed the information displayed in the purchase
                  selection, Users may place the order by submitting it.
                </li>
              </Ul>
            </Body>
          </Group>

          <Group>
            <H3>Order submission</H3>
            <Body>
              <p>When the User submits an order, the following applies:</p>
              <Ul>
                <li>
                  The submission of an order determines contract conclusion and
                  therefore creates for the User the obligation to pay the price,
                  taxes and possible further fees and expenses, as specified on
                  the order page.
                </li>
                <li>
                  In case the purchased Product requires an action from the User,
                  such as the provision of personal information or data,
                  specifications or special wishes, the order submission creates
                  an obligation for the User to cooperate accordingly.
                </li>
                <li>
                  Upon submission of the order, Users will receive a receipt
                  confirming that the order has been received.
                </li>
              </Ul>
              <p>
                All notifications related to the described purchasing process
                shall be sent to the email address provided by the User for such
                purposes.
              </p>
            </Body>
          </Group>

          <Group>
            <H3>Prices</H3>
            <Body>
              <p>
                Users are informed during the purchasing process and before order
                submission, about any fees, taxes and costs (including, if any,
                delivery costs) that they will be charged.
              </p>
              <Blank />
              <p>Prices on this Application are displayed:</p>
              <Ul>
                <li>
                  either exclusive or inclusive of any applicable fees, taxes and
                  costs, depending on the section the User is browsing.
                </li>
              </Ul>
            </Body>
          </Group>

          <Group>
            <H3>Offers and discounts</H3>
            <Body>
              <p>
                The Owner may offer discounts or provide special offers for the
                purchase of Products. Any such offer or discount shall always be
                subject to the eligibility criteria and the terms and conditions
                set out in the corresponding section of this Application.
              </p>
              <Blank />
              <p>
                Offers and discounts are always granted at the Owner&rsquo;s sole
                discretion.
              </p>
              <Blank />
              <p>
                Repeated or recurring offers or discounts create no claim/title
                or right that Users may enforce in the future.
              </p>
              <Blank />
              <p>
                Depending on the case, discounts or offers shall be valid for a
                limited time only or while stocks last. If an offer or discount is
                limited by time, the time indications refer to the time zone of
                the Owner, as indicated in the Owner&rsquo;s location details in
                this document, unless otherwise specified.
              </p>
            </Body>
          </Group>

          <Group>
            <H3>Methods of payment</H3>
            <Body>
              <p>
                Information related to accepted payment methods are made available
                during the purchasing process.
              </p>
              <Blank />
              <p>
                Some payment methods may only be available subject to additional
                conditions or fees. In such cases related information can be found
                in the dedicated section of this Application.
              </p>
              <Blank />
              <p>
                All payments are independently processed through third-party
                services. Therefore, this Application does not collect any payment
                information &ndash; such as credit card details &ndash; but only
                receives a notification once the payment has been successfully
                completed.
              </p>
              <Blank />
              <p>
                If a payment through the available methods fails or is refused by
                the payment service provider, the Owner shall be under no
                obligation to fulfill the purchase order. If a payment fails or is
                refused, the Owner reserves the right to claim any related
                expenses or damages from the User.
              </p>
            </Body>
          </Group>

          <Group>
            <H3>Retention of usage rights</H3>
            <Body>
              <p>
                Users do not acquire any rights to use the purchased Product until
                the total purchase price is received by the Owner.
              </p>
            </Body>
          </Group>

          <Group>
            <H3>Delivery</H3>
            <H4>Performance of services</H4>
            <Body>
              <p>
                The purchased service shall be performed or made available within
                the timeframe specified on this Application or as communicated
                before the order submission.
              </p>
            </Body>
          </Group>

          <Group>
            <H3>Contract duration</H3>
          </Group>

          <Group>
            <H4>Trial period</H4>
            <Body>
              <p>
                Users have the option to test this Application or selected
                Products during a limited and non-renewable trial period, at no
                cost. Some features or functions of this Application may not be
                available to Users during the trial period.
              </p>
              <p>
                Further conditions applicable to the trial period, including its
                duration, will be specified on this Application.
              </p>
              <Blank />
              <p>
                The trial period shall automatically convert into the equivalent
                paid Product, unless the User cancels the purchase before the
                trial period expires.
              </p>
            </Body>
          </Group>

          <Group>
            <H4>Subscriptions</H4>
            <Body>
              <p>
                Subscriptions allow Users to receive a Product continuously or
                regularly over time. Details regarding the type of subscription
                and termination are outlined below.
              </p>
            </Body>
          </Group>

          <Group>
            <H4>Open-ended subscriptions</H4>
            <Body>
              <p>
                Paid subscriptions begin on the day the payment is received by the
                Owner.
              </p>
              <Blank />
              <p>
                In order to maintain subscriptions, Users must pay the required
                recurring fee in a timely manner. Failure to do so may cause
                service interruptions.
              </p>
            </Body>
          </Group>

          <Group>
            <H4>Termination of open-ended subscriptions</H4>
            <Body>
              <p>
                Open-ended subscriptions may be terminated at any time by sending
                a clear and unambiguous termination notice to the Owner using the
                contact details provided in this document, or &mdash; if
                applicable &mdash; by using the corresponding controls inside this
                Application.
              </p>
              <Blank />
              <p>
                Terminations shall take effect 30 days after the notice of
                termination has been received by the Owner.
              </p>
            </Body>
          </Group>

          <Divider />

          {/* ───── User rights ───── */}
          <Group>
            <SectionTitle>User rights</SectionTitle>
          </Group>

          <Group>
            <H3>Right of withdrawal</H3>
            <Body>
              <p>
                Unless exceptions apply, the User may be eligible to withdraw from
                the contract within the period specified below (generally 14
                days), for any reason and without justification. Users can learn
                more about the withdrawal conditions within this section.
              </p>
            </Body>
          </Group>

          <Group>
            <H4>Who the right of withdrawal applies to</H4>
            <Body>
              <p>
                Unless any applicable exception is mentioned below, Users who are
                European Consumers are granted a statutory cancellation right
                under EU rules, to withdraw from contracts entered into online
                (distance contracts) within the specified period applicable to
                their case, for any reason and without justification.
              </p>
              <Blank />
              <p>
                Users that do not fit this qualification, cannot benefit from the
                rights described in this section.
              </p>
            </Body>
          </Group>

          <Group>
            <H4>Exercising the right of withdrawal</H4>
            <Body>
              <p>
                To exercise their right of withdrawal, Users must send to the
                Owner an unequivocal statement of their intention to withdraw from
                the contract.
              </p>
              <Blank />
              <p>
                To this end, Users may use the model withdrawal form available
                from within the &ldquo;definitions&rdquo; section of this
                document. Users are, however, free to express their intention to
                withdraw from the contract by making an unequivocal statement in
                any other suitable way. In order to meet the deadline within which
                they can exercise such right, Users must send the withdrawal
                notice before the withdrawal period expires.
              </p>
              <Blank />
              <p>When does the withdrawal period expire?</p>
              <Ul>
                <li>
                  <strong>Regarding the purchase of a service</strong>, the
                  withdrawal period expires 14 days after the day that the
                  contract is entered into, unless the User has waived the
                  withdrawal right.
                </li>
              </Ul>
            </Body>
          </Group>

          <Group>
            <H4>Effects of withdrawal</H4>
            <Body>
              <p>
                Users who correctly withdraw from a contract will be reimbursed by
                the Owner for all payments made to the Owner, including, if any,
                those covering the costs of delivery.
              </p>
              <Blank />
              <p>
                However, any additional costs resulting from the choice of a
                particular delivery method other than the least expensive type of
                standard delivery offered by the Owner, will not be reimbursed.
              </p>
              <Blank />
              <p>
                Such reimbursement shall be made without undue delay and, in any
                event, no later than 14 days from the day on which the Owner is
                informed of the User&rsquo;s decision to withdraw from the
                contract. Unless otherwise agreed with the User, reimbursements
                will be made using the same means of payment as used to process
                the initial transaction. In any event, the User shall not incur
                any costs or fees as a result of such reimbursement.
              </p>
            </Body>
          </Group>

          <Group>
            <H4>&hellip;on the purchase of services</H4>
            <Body>
              <p>
                Where a User exercises the right of withdrawal after having
                requested that the service be performed before the withdrawal
                period expires, the User shall pay to the Owner an amount which is
                in proportion to the part of service provided.
              </p>
              <Blank />
              <p>
                Such payment shall be calculated based on the economic value of
                the service and be proportional to the part of service provided
                until the time the User withdraws compared to the full coverage of
                the contract.
              </p>
            </Body>
          </Group>

          <Divider />

          {/* ───── Liability and indemnification ───── */}
          <Group>
            <SectionTitle>Liability and indemnification</SectionTitle>
          </Group>

          <Group>
            <H3>Australian Users</H3>
          </Group>

          <Group>
            <H4>Limitation of liability</H4>
            <Body>
              <p>
                Nothing in these Terms excludes, restricts or modifies any
                guarantee, condition, warranty, right or remedy which the User may
                have under the Competition and Consumer Act 2010 (Cth) or any
                similar State and Territory legislation and which cannot be
                excluded, restricted or modified (non-excludable right). To the
                fullest extent permitted by law, our liability to the User,
                including liability for a breach of a non-excludable right and
                liability which is not otherwise excluded under these Terms of Use,
                is limited, at the Owner&rsquo;s sole discretion, to the
                re-performance of the services or the payment of the cost of
                having the services supplied again.
              </p>
            </Body>
          </Group>

          <Group>
            <H3>US Users</H3>
          </Group>

          <Group>
            <H4>Disclaimer of Warranties</H4>
            <Body>
              <p>
                This Application is provided strictly on an &ldquo;as is&rdquo;
                and &ldquo;as available&rdquo; basis. Use of the Service is at
                Users&rsquo; own risk. To the maximum extent permitted by
                applicable law, the Owner expressly disclaims all conditions,
                representations, and warranties &mdash; whether express, implied,
                statutory or otherwise, including, but not limited to, any implied
                warranty of merchantability, fitness for a particular purpose, or
                non-infringement of third-party rights. No advice or information,
                whether oral or written, obtained by user from owner or through
                the Service will create any warranty not expressly stated herein.
              </p>
              <Blank />
              <p>
                Without limiting the foregoing, the Owner, its subsidiaries,
                affiliates, licensors, officers, directors, agents, co-branders,
                partners, suppliers and employees do not warrant that the content
                is accurate, reliable or correct; that the Service will meet
                Users&rsquo; requirements; that the Service will be available at
                any particular time or location, uninterrupted or secure; that any
                defects or errors will be corrected; or that the Service is free
                of viruses or other harmful components. Any content downloaded or
                otherwise obtained through the use of the Service is downloaded at
                users own risk and users shall be solely responsible for any
                damage to Users&rsquo; computer system or mobile device or loss of
                data that results from such download or Users&rsquo; use of the
                Service.
              </p>
              <Blank />
              <p>
                The Owner does not warrant, endorse, guarantee, or assume
                responsibility for any product or service advertised or offered by
                a third party through the Service or any hyperlinked website or
                service, and the Owner shall not be a party to or in any way
                monitor any transaction between Users and third-party providers of
                products or services.
              </p>
              <Blank />
              <p>
                The Service may become inaccessible or it may not function
                properly with Users&rsquo; web browser, mobile device, and/or
                operating system. The owner cannot be held liable for any
                perceived or actual damages arising from Service content,
                operation, or use of this Service.
              </p>
              <Blank />
              <p>
                Federal law, some states, and other jurisdictions, do not allow
                the exclusion and limitations of certain implied warranties. The
                above exclusions may not apply to Users. This Agreement gives Users
                specific legal rights, and Users may also have other rights which
                vary from state to state. The disclaimers and exclusions under this
                agreement shall not apply to the extent prohibited by applicable
                law.
              </p>
            </Body>
          </Group>

          <Group>
            <H4>Limitations of liability</H4>
            <Body>
              <p>
                To the maximum extent permitted by applicable law, in no event
                shall the Owner, and its subsidiaries, affiliates, officers,
                directors, agents, co-branders, partners, suppliers and employees
                be liable for
              </p>
              <Ul>
                <li>
                  any indirect, punitive, incidental, special, consequential or
                  exemplary damages, including without limitation damages for loss
                  of profits, goodwill, use, data or other intangible losses,
                  arising out of or relating to the use of, or inability to use,
                  the Service; and
                </li>
                <li>
                  any damage, loss or injury resulting from hacking, tampering or
                  other unauthorized access or use of the Service or User account
                  or the information contained therein;
                </li>
                <li>any errors, mistakes, or inaccuracies of content;</li>
                <li>
                  personal injury or property damage, of any nature whatsoever,
                  resulting from User access to or use of the Service;
                </li>
                <li>
                  any unauthorized access to or use of the Owner&rsquo;s secure
                  servers and/or any and all personal information stored therein;
                </li>
                <li>
                  any interruption or cessation of transmission to or from the
                  Service;
                </li>
                <li>
                  any bugs, viruses, trojan horses, or the like that may be
                  transmitted to or through the Service;
                </li>
                <li>
                  any errors or omissions in any content or for any loss or damage
                  incurred as a result of the use of any content posted, emailed,
                  transmitted, or otherwise made available through the Service;
                  and/or
                </li>
                <li>
                  the defamatory, offensive, or illegal conduct of any User or
                  third party. In no event shall the Owner, and its subsidiaries,
                  affiliates, officers, directors, agents, co-branders, partners,
                  suppliers and employees be liable for any claims, proceedings,
                  liabilities, obligations, damages, losses or costs in an amount
                  exceeding the amount paid by User to the Owner hereunder in the
                  preceding 12 months, or the period of duration of this agreement
                  between the Owner and User, whichever is shorter.
                </li>
              </Ul>
              <Blank />
              <p>
                This limitation of liability section shall apply to the fullest
                extent permitted by law in the applicable jurisdiction whether the
                alleged liability is based on contract, tort, negligence, strict
                liability, or any other basis, even if company has been advised of
                the possibility of such damage.
              </p>
              <Blank />
              <p>
                Some jurisdictions do not allow the exclusion or limitation of
                incidental or consequential damages, therefore the above
                limitations or exclusions may not apply to User. The terms give
                User specific legal rights, and User may also have other rights
                which vary from jurisdiction to jurisdiction. The disclaimers,
                exclusions, and limitations of liability under the terms shall not
                apply to the extent prohibited by applicable law.
              </p>
            </Body>
          </Group>

          <Group>
            <H4>Indemnification</H4>
            <Body>
              <p>
                The User agrees to defend, indemnify and hold the Owner and its
                subsidiaries, affiliates, officers, directors, agents,
                co-branders, partners, suppliers and employees harmless from and
                against any and all claims or demands, damages, obligations,
                losses, liabilities, costs or debt, and expenses, including, but
                not limited to, legal fees and expenses, arising from
              </p>
              <Ul>
                <li>
                  User&rsquo;s use of and access to the Service, including any
                  data or content transmitted or received by User;
                </li>
                <li>
                  User&rsquo;s violation of these terms, including, but not
                  limited to, User&rsquo;s breach of any of the representations and
                  warranties set forth in these terms;
                </li>
                <li>
                  User&rsquo;s violation of any third-party rights, including, but
                  not limited to, any right of privacy or intellectual property
                  rights;
                </li>
                <li>
                  User&rsquo;s violation of any statutory law, rule, or
                  regulation;
                </li>
                <li>
                  any content that is submitted from User&rsquo;s account,
                  including third party access with User&rsquo;s unique username,
                  password or other security measure, if applicable, including, but
                  not limited to, misleading, false, or inaccurate information;
                </li>
                <li>User&rsquo;s wilful misconduct; or</li>
                <li>
                  statutory provision by User or its affiliates, officers,
                  directors, agents, co-branders, partners, suppliers and employees
                  to the extent allowed by applicable law.
                </li>
              </Ul>
            </Body>
          </Group>

          <Divider />

          {/* ───── Common provisions ───── */}
          <Group>
            <SectionTitle>Common provisions</SectionTitle>
          </Group>

          <Group>
            <H3>No Waiver</H3>
            <Body>
              <p>
                The Owner&rsquo;s failure to assert any right or provision under
                these Terms shall not constitute a waiver of any such right or
                provision. No waiver shall be considered a further or continuing
                waiver of such term or any other term.
              </p>
            </Body>
          </Group>

          <Group>
            <H3>Service interruption</H3>
            <Body>
              <p>
                To ensure the best possible service level, the Owner reserves the
                right to interrupt the Service for maintenance, system updates or
                any other changes, informing the Users appropriately.
              </p>
              <Blank />
              <p>
                {`Within the limits of law, the Owner may also decide to suspend or discontinue the Service altogether. If the Service is discontinued, the Owner will cooperate with Users to enable them to withdraw Personal Data or information and will respect Users' rights relating to continued product use and/or compensation, as provided for by applicable law.`}
              </p>
              <Blank />
              <p>
                Additionally, the Service might not be available due to reasons
                outside the Owner&rsquo;s reasonable control, such as &ldquo;force
                majeure&rdquo; events( infrastructural breakdowns or blackouts
                etc.).
              </p>
            </Body>
          </Group>

          <Group>
            <H3>Service reselling</H3>
            <Body>
              <p>
                Users may not reproduce, duplicate, copy, sell, resell or exploit
                any portion of this Application and of its Service without the
                Owner&rsquo;s express prior written permission, granted either
                directly or through a legitimate reselling programme.
              </p>
            </Body>
          </Group>

          <Group>
            <H3>Privacy policy</H3>
            <Body>
              <p>
                To learn more about the use of their Personal Data, Users may
                refer to the privacy policy of this Application.
              </p>
            </Body>
          </Group>

          <Group>
            <H3>Intellectual property rights</H3>
            <Body>
              <p>
                Without prejudice to any more specific provision of these Terms,
                any intellectual property rights, such as copyrights, trademark
                rights, patent rights and design rights related to this
                Application are the exclusive property of the Owner or its
                licensors and are subject to the protection granted by applicable
                laws or international treaties relating to intellectual property.
              </p>
              <Blank />
              <p>
                All trademarks &mdash; nominal or figurative &mdash; and all other
                marks, trade names, service marks, word marks, illustrations,
                images, or logos appearing in connection with this Application
                are, and remain, the exclusive property of the Owner or its
                licensors and are subject to the protection granted by applicable
                laws or international treaties related to intellectual property.
              </p>
            </Body>
          </Group>

          <Group>
            <H3>Changes to these Terms</H3>
            <Body>
              <p>
                The Owner reserves the right to amend or otherwise modify these
                Terms at any time. In such cases, the Owner will appropriately
                inform the User of these changes.
              </p>
              <Blank />
              <p>
                Such changes will only affect the relationship with the User from
                the date communicated to Users onwards.
              </p>
              <Blank />
              <p>
                The continued use of the Service will signify the User&rsquo;s
                acceptance of the revised Terms. If Users do not wish to be bound
                by the changes, they must stop using the Service and may terminate
                the Agreement.
              </p>
              <Blank />
              <p>
                {`The applicable previous version will govern the relationship prior to the User's acceptance. The User can obtain any previous version from the Owner.`}
              </p>
              <Blank />
              <p>
                If legally required, the Owner will notify Users in advance of when
                the modified Terms will take effect.
              </p>
            </Body>
          </Group>

          <Group>
            <H3>Assignment of contract</H3>
            <Body>
              <p>
                The Owner reserves the right to transfer, assign, dispose of by
                novation, or subcontract any or all rights or obligations under
                these Terms, taking the User&rsquo;s legitimate interests into
                account. Provisions regarding changes of these Terms will apply
                accordingly.
              </p>
              <Blank />
              <p>
                Users may not assign or transfer their rights or obligations under
                these Terms in any way, without the written permission of the
                Owner.
              </p>
            </Body>
          </Group>

          <Group>
            <H3>Contacts</H3>
            <Body>
              <p>
                All communications relating to the use of this Application must be
                sent using the contact information stated in this document.
              </p>
            </Body>
          </Group>

          <Group>
            <H3>Severability</H3>
            <Body>
              <p>
                Should any provision of these Terms be deemed or become invalid or
                unenforceable under applicable law, the invalidity or
                unenforceability of such provision shall not affect the validity
                of the remaining provisions, which shall remain in full force and
                effect.
              </p>
            </Body>
          </Group>

          <Group>
            <H4>US Users</H4>
            <Body>
              <p>
                Any such invalid or unenforceable provision will be interpreted,
                construed and reformed to the extent reasonably required to render
                it valid, enforceable and consistent with its original intent.
                These Terms constitute the entire Agreement between Users and the
                Owner with respect to the subject matter hereof, and supersede all
                other communications, including but not limited to all prior
                agreements, between the parties with respect to such subject
                matter. These Terms will be enforced to the fullest extent
                permitted by law.
              </p>
            </Body>
          </Group>

          <Group>
            <H4>EU Users</H4>
            <Body>
              <p>
                Should any provision of these Terms be or be deemed void, invalid
                or unenforceable, the parties shall do their best to find, in an
                amicable way, an agreement on valid and enforceable provisions
                thereby substituting the void, invalid or unenforceable parts.
              </p>
              <p>
                In case of failure to do so, the void, invalid or unenforceable
                provisions shall be replaced by the applicable statutory
                provisions, if so permitted or stated under the applicable law.
              </p>
              <Blank />
              <p>
                Without prejudice to the above, the nullity, invalidity or the
                impossibility to enforce a particular provision of these Terms
                shall not nullify the entire Agreement, unless the severed
                provisions are essential to the Agreement, or of such importance
                that the parties would not have entered into the contract if they
                had known that the provision would not be valid, or in cases where
                the remaining provisions would translate into an unacceptable
                hardship on any of the parties.
              </p>
            </Body>
          </Group>

          <Group>
            <H3>Governing law</H3>
            <Body>
              <p>
                These Terms are governed by the law of the place where the Owner
                is based, as disclosed in the relevant section of this document,
                without regard to conflict of laws principles.
              </p>
            </Body>
          </Group>

          <Group>
            <H4>Prevalence of national law</H4>
            <Body>
              <p>
                However, regardless of the above, if the law of the country that
                the User is located in provides for a higher applicable consumer
                protection standard, such higher standards shall prevail.
              </p>
            </Body>
          </Group>

          <Group>
            <H3>Venue of jurisdiction</H3>
            <Body>
              <p>
                The exclusive competence to decide on any controversy resulting
                from or connected to these Terms lies with the courts of the place
                where the Owner is based, as displayed in the relevant section of
                this document.
              </p>
            </Body>
          </Group>

          <Group>
            <H4>Exception for Consumers in Europe</H4>
            <Body>
              <p>
                The above does not apply to any Users that qualify as European
                Consumers, nor to Consumers based in the United Kingdom,
                Switzerland, Norway or Iceland.
              </p>
            </Body>
          </Group>

          <Divider />

          {/* ───── Dispute resolution ───── */}
          <Group>
            <SectionTitle>Dispute resolution</SectionTitle>
          </Group>

          <Group>
            <H3>Amicable dispute resolution</H3>
            <Body>
              <p>
                Users may bring any disputes to the Owner who will try to resolve
                them amicably.
              </p>
              <Blank />
              <p>
                {`While Users' right to take legal action shall always remain unaffected, in the event of any controversy regarding the use of this Application or the Service, Users are kindly asked to contact the Owner at the contact details provided in this document.`}
              </p>
              <Blank />
              <p>
                The User may submit the complaint including a brief description
                and if applicable, the details of the related order, purchase, or
                account, to the Owner&rsquo;s email address specified in this
                document.
              </p>
              <Blank />
              <p>
                The Owner will process the complaint without undue delay and
                within 21 days of receiving it.
              </p>
            </Body>
          </Group>

          <Group>
            <H3>Online dispute resolution for Consumers</H3>
            <Body>
              <p>
                The European Commission has established an online platform for
                alternative dispute resolutions that facilitates an out-of-court
                method for solving disputes related to and stemming from online
                sale and service contracts.
              </p>
              <Blank />
              <p>
                As a result, any European Consumer or Consumer based in Norway,
                Iceland, or Liechtenstein can use such platform for resolving
                disputes stemming from contracts which have been entered into
                online. The platform is{" "}
                <Link href="http://ec.europa.eu/consumers/odr/">
                  available at the following link
                </Link>
                .
              </p>
            </Body>
          </Group>

          <Divider />

          {/* Definitions and legal references — a collapsed disclosure
              row: grey chevron + Heading/Xs. It ships collapsed with no
              expanded body, so it renders as a static row. */}
          <div className="flex items-center gap-1.5">
            <RiArrowDownSLine
              aria-hidden
              className="h-6 w-6 shrink-0 text-v1-light"
            />
            <h3 className="text-v1-heading-xs break-words text-white">
              Definitions and legal references
            </h3>
          </div>

          <Divider />

          {/* Footer note — same iubenda block as the Privacy page. */}
          <Body>
            <p>Latest update: June 09, 2026</p>
            <Blank />
            <p>
              This document has been created with the iubenda{" "}
              <Link href="https://www.iubenda.com/en/privacy-and-cookie-policy-generator">
                Privacy and Cookie Policy Generator
              </Link>
              . See also the{" "}
              <Link href="https://www.iubenda.com/en/terms-and-conditions-generator">
                Terms and Conditions Generator
              </Link>
              .{" "}
              <Link href="https://www.iubenda.com/en/">iubenda</Link> hosts this
              content and only collects{" "}
              <Link href="https://www.iubenda.com/privacy-policy/65675001">
                the Personal Data strictly necessary
              </Link>{" "}
              for it to be provided.{" "}
              <Link href="https://www.iubenda.com/app/privacy-policy/26885259/legal">
                Show the complete Privacy Policy
              </Link>
              .
            </p>
          </Body>
        </section>
      </div>

      {/* Closing stippled "Inngest" lockup above the footer, shared with
          the Home/Events/Privacy pages. */}
      <LogoMarquee />
    </PageShell>
  );
}
