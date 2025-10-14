import Image from "next/image";
import { ComposableAbout } from "../_shared/ComposableAbout";
import { ComposableCaseStudy } from "../_shared/ComposableCaseStudy";
import { ComposableHeader } from "../_shared/ComposableHeader";
import { Pattern1, Pattern2 } from "../_shared/patterns";
import {
  PlaceholderImage,
  PlaceholderImage3,
} from "src/shared/Graphics/CaseStudies/BaerskinGraphics";

const pageData = {
  header: {
    title: "How BÆRSkin Tactical Supply Co. achieved ",
    highlightedText: "100% event deliverability",
    subtitle: " by switching from Kafka to Inngest.",
    backgroundColor: "#E2E2E2",
    backgroundPatterns: {
      left: <Pattern1 />,
      right: <Pattern2 />,
    },
    infoBlocks: [
      {
        header: "Case Study:",
        description: "BÆRSkin Tactical Supply Co.",
      },
      {
        header: "Use Cases:",
        description: "Analytics + Operational Data Processing",
      },
      {
        header: "Industry:",
        description: "E-Commerce",
      },
      {
        header: "Employees:",
        description: "20—100",
      },
    ],
    companyDetails: {
      website: {
        prefix: "[www]",
        url: "baerskintactical.com",
        link: "https://baerskintactical.com",
        isLinked: true,
      },
      logo: <BaerskinLogo />,
      description:
        "Data-driven e-commerce platform powering 17 brands operating in 19 countries across the world.",
    },
  },
  about: {
    testimonial: {
      quote:
        "We figured out we were losing roughly 6% of events going through Kafka with customers complaining they didn't get their order confirmation emails, it was super hard to tackle. Now that we switched to Inngest, we're super confident that everything is working as what I'll call tip-top shape.",
      author: "Gus Fune → CTO",
      title: "CTO",
      company: "[ BÆRSkin Tactical Supply Co. ]",
      image: "/assets/customers/baerskin/gusDither.png",
      imageAlt: "Gus Fune, CTO",
    },
    cta: {
      primaryText: "Interested in Inngest?",
      secondaryText: "Talk to an Inngest product expert today.",
      buttonText: "Get in touch [+]",
    },
  },
  content: {
    intro: {
      title:
        "Founded in 2019, BÆRSkin Tactical Supply Co. created notable military-grade outdoor gear for adventurers, gathering up to 30,000 reviews on Trustpilot. Starting with the viral BÆRSkin Tactical Hoodie, they expanded to modular, weather-resistant gear designed to work hard, last long, and be comfortable both on the trail and at home. Their products, from 10-pocket fleece hoodies to the BÆR-Kit system, are built for reliability—no fashion statements or disposable junk—just durable gear for wild comfort.",
      logo: <BaerskinLogo />,
    },
    sections: [
      {
        id: "first",
        title: "BUILDING AN IN-HOUSE E-COMMERCE PLATFORM",
        header:
          "BÆRSkin Tactical Supply Co. adopted a unique approach to e-commerce, taking data-driven decisions to target niche markets worldwide. This strategy is backed by the choice to build an in-house e-commerce platform, bringing them complete flexibility and control of the shopping experience compared to solutions like Shopify:",
        contentBlocks: [
          {
            id: "first-quote-1",
            type: "quote" as const,
            quote: {
              author: "Gus Fune → CTO",
              company: "[ BÆRSkin Tactical Supply Co. ]",
              quote:
                "We ended up developing our own e-commerce platform in-house. So we didn't use Shopify or anything like that because we want to keep control of a few elements that they don't allow us to control, like checkout",
            },
          },
          {
            id: "first-paragraph-1",
            type: "paragraph" as const,
            content:
              "BÆRSkin Tactical Supply Co. is built as a multi-cloud and multi-region event-driven system, composed of analytics systems used internally to make data-driven decisions, as well as operational data processing that powers core e-commerce features, such as order processing and logistics. \n\n In late 2024, Gus and his team started to face issues with their recent Kafka replatforming (migrating an existing application without major rewrites).",
          },
        ],
        image: (
          <Image
            src="/assets/customers/baerskin/contentImage.png"
            alt="BÆRSkin Tactical e-commerce platform"
            width={542}
            height={401}
            className="scale-90"
          />
        ),
      },
      {
        id: "second",
        title: "THE KAFKA REPLATFORMING FAILURE: 6% EVENT LOSS",
        header:
          "BÆRSkin Tactical Supply Co. adopted Kafka in late 2023 to power their analytics and order processing systems. As the replatforming progressed, they realized that some events were dropped, resulting in customers' complaints about missing orders.",
        contentBlocks: [
          {
            id: "second-paragraph-1",
            type: "paragraph" as const,
            content:
              "Events dropped by Kafka, combined with its lack of native production tooling, made it hard for the engineering team to identify the root cause and impact on customers. Facing this challenge, Gus started to research a new technology to replace Kafka, matching the following requirements:",
          },
          {
            id: "second-requirements-1",
            type: "requirements" as const,
            requirements: [
              {
                label: "Reliability:",
                description:
                  "Events should be delivered reliably and can be replayed in case of processing issues. Producing and consuming events should be scalable without requiring extra infrastructure work.",
              },
              {
                label: "Event-driven:",
                description:
                  "The researched solution needs to match BÆRSkin Tactical Supply Co.'s event-driven architecture",
              },
              {
                label: "Observability:",
                description:
                  "Events and their associated processing should be easily monitored with metrics and alerts.",
              },
              {
                label: "Monitoring & Recovery tooling:",
                description:
                  "Ideally, the chosen solution would provide production tools to mitigate any processing issues.",
              },
            ],
          },
          {
            id: "second-paragraph-2",
            type: "paragraph" as const,
            content:
              "Compared to other solutions like Temporal, Inngest stood out as a promising candidate with the added value of its great DX and Bun support, which is the primary runtime of BÆRSkin Tactical Supply Co.'s codebase.",
          },
        ],
        image: <PlaceholderImage />,
      },
      {
        id: "third",
        title:
          "CHOOSING INNGEST: A RELIABLE EVENT-DRIVEN WORKFLOW ENGINE, COMING WITH ESSENTIAL PRODUCTION TOOLS",
        header:
          "The Inngest migration followed a strategic phased approach, beginning with a proof of concept on several peripheral workflows. Gradually, as confidence in Inngest grew, the team expanded its implementation to more business-critical systems, including order processing and analytics pipelines. After completing the full migration, the system achieved zero event loss.",
        contentBlocks: [
          {
            id: "third-requirements-1",
            type: "requirements" as const,
            requirements: [
              {
                label: "Beyond reliability:",
                description:
                  "observability, monitoring, and recovery tools - Beyond solving the reliability issues faced with Kafka, replatforming to Inngest brought a set of new advantages in operating their operational data and analytics processing in production:",
              },
            ],
            defaultSymbol: "✓" as const,
          },
          {
            id: "third-quote-1",
            type: "quote" as const,
            quote: {
              author: "Gus Fune → CTO",
              company: "[ BÆRSkin Tactical Supply Co. ]",
              quote:
                "The reliable transportation of events and making sure the replayability, being able to monitor how things are going, and catch things before they become a problem. Those are super important for us",
            },
          },
          {
            id: "third-label-1",
            type: "label" as const,
            content:
              "Using Inngest, Gus's team got access to ready-to-use monitoring dashboards, production recovery tools such as Replays  [↙]",
            imagePath: "/assets/customers/baerskin/baerskinImage.png",
          },
        ],
        image: <PlaceholderImage3 />,
      },
      {
        id: "fourth",
        title:
          "ACHIEVING 10X PERFORMANCE IMPROVEMENTS ON THEIR LOGISTICS SYSTEM",
        header:
          "Once the initial reliability issue was resolved by replatforming to Inngest, Gus and his team began exploring ways to expand Inngest to address other challenges they faced with their logistics system.",
        contentBlocks: [
          {
            id: "fourth-paragraph-1",
            type: "paragraph" as const,
            content:
              "BÆRSkin Tactical Supply Co.'s logistics system faced a recurring challenge during Black Friday and Cyber Monday, a well-known challenge for most E-Commerce actors. The large number of orders concentrated during this short period was putting a lot of pressure on their database-based queuing system (utilizing Postgres's SKIP LOCKED design), which failed to process orders and initiate shipments in a reasonable timeframe. \n\n While short-term solutions such as drastically upscaling their infrastructure helped, Gus and his team started a PoC to evaluate the performance of their logistics system once powered by Inngest. Again, the results were there:",
          },
          {
            id: "fourth-quote-1",
            type: "quote" as const,
            quote: {
              author: "Gus Fune → CTO",
              company: "[ BÆRSkin Tactical Supply Co. ]",
              quote:
                "The preliminary results show that from 40 orders per minute we managed to increase to 500 orders per minute to process in the new system. So this is probably the biggest gain we've seen in the new system",
            },
          },
        ],
      },
      {
        id: "fifth",
        title: "INNGEST FOR E-COMMERCE",
        header:
          "For BÆRSkin Tactical Supply Co., what started as a replatforming effort to address Kafka reliability issues ultimately evolved into a modernization of their analytical and operational data processing, resulting in significant gains in processing performance (a 10x faster logistics system) and operational productivity (through production tools like Replay).",
        contentBlocks: [
          {
            id: "fifth-paragraph-1",
            type: "paragraph" as const,
            content:
              "Inngest's event-driven workflow engine bridges the gap between the two main components of E-Commerce solutions: operational data (e.g., order processing, 3rd-party integrations) and analytical data (BI) processing. Its combination of events, queuing, advanced flow control, and durable steps removes the need to combine multiple solutions to support critical E-Commerce use cases such as order processing, logistics, or BI. \n\n Finally, where alternatives like Kafka, AWS SQS, or Temporal require significant investment in infrastructure, monitoring, and production tools, Inngest comes with a fully managed and auto-scaled service that provides essential production monitoring and recovery tools.",
          },
          {
            id: "fifth-paragraph-2",
            type: "paragraph" as const,
            content:
              "If you're interested in learning how Inngest can help your team, reach out to us to chat with an expert.",
          },
          {
            id: "fifth-cta-1",
            type: "cta" as const,
            ctaText: "Read more [↗]",
            ctaDescription: "Check out other customer success stories",
          },
        ],
      },
    ],
    footer: {
      title: "Interested in Inngest?",
      subtitle: "Talk to an Inngest product expert today.",
      ctaText: "Get in touch [+]",
    },
  },
};

export default function BaerskinTacticalPage() {
  return (
    <>
      <ComposableHeader {...pageData.header} />
      <ComposableAbout {...pageData.about} />
      <ComposableCaseStudy {...pageData.content} />
    </>
  );
}

function BaerskinLogo() {
  return (
    <svg
      width="275"
      height="39"
      viewBox="0 0 275 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_321_29244)">
        <path
          d="M79.3488 20.3621C82.6462 20.9868 84.061 23.005 84.061 26.9813V28.9634C84.061 33.6365 81.9329 35.7508 77.1389 35.7508H54.5954C53.9523 35.7508 53.6716 35.4144 53.6716 34.8378V6.17471C53.6716 5.59808 53.9523 5.26172 54.5954 5.26172H76.6595C81.4535 5.26172 83.6283 7.41205 83.6283 12.0491V13.791C83.6283 17.5991 82.2954 19.6173 79.3605 20.3261V20.3621H79.3488ZM60.5586 17.6351H73.6779C76.0982 17.6351 76.7764 16.9744 76.7764 14.8601V13.827C76.7764 11.6406 76.0865 11.052 73.6779 11.052H60.5586V17.6712V17.6351ZM60.5586 23.2092V30.0686H74.0871C76.5426 30.0686 77.1857 29.444 77.1857 27.2936V25.9722C77.1857 23.7858 76.5426 23.1972 74.0871 23.1972H60.5586V23.2092Z"
          fill="#292524"
        />
        <path
          d="M133.133 5.26172C133.776 5.26172 134.056 5.59808 134.056 6.17471V10.0669C134.056 10.6436 133.776 10.9799 133.133 10.9799H114.904V17.5991H129.835C130.443 17.5991 130.759 17.8874 130.759 18.5121V22.2722C130.759 22.8488 130.432 23.1852 129.835 23.1852H114.904V30.0446H133.133C133.776 30.0446 134.056 30.381 134.056 30.9576V34.8498C134.056 35.4265 133.776 35.7628 133.133 35.7628H109.022C108.379 35.7628 108.052 35.4265 108.052 34.8498V29.9245H97.1777L94.2779 35.006C93.9505 35.6307 93.5179 35.7508 92.828 35.7508H87.274C86.7478 35.7508 86.6309 35.2583 86.8764 34.8378L103.585 6.01854C103.913 5.44191 104.345 5.27373 105.035 5.27373H133.133V5.26172ZM108.052 24.3264V10.6796L100.288 24.3264H108.052Z"
          fill="#292524"
        />
        <path
          d="M170.2 12.0852V18.0797C170.2 22.7888 168.072 25.1914 163.231 25.1914H162.108L171.123 34.874C171.521 35.2103 171.287 35.7869 170.843 35.7869H164.447C163.64 35.7869 163.324 35.6188 162.88 35.0782L154.508 25.4798H146.943V34.8619C146.943 35.4386 146.545 35.7749 145.972 35.7749H141.026C140.383 35.7749 140.103 35.4386 140.103 34.8619V6.21084C140.103 5.63422 140.383 5.29785 141.026 5.29785H163.324C168.153 5.29785 170.293 7.44819 170.293 12.0852H170.211H170.2ZM146.896 19.7856H159.852C162.833 19.7856 163.313 19.245 163.313 16.7223V14.0313C163.313 11.5086 162.786 10.968 159.852 10.968H146.896V19.7736V19.7856Z"
          fill="#292524"
        />
        <path
          d="M180.665 26.7289C181.273 26.7289 181.636 27.0172 181.636 27.6419V28.0984C181.636 29.4679 182.197 30.0806 183.647 30.0806H195.889C198.146 30.0806 198.707 29.5039 198.707 27.678V25.5637C198.707 23.7497 198.146 23.161 195.889 23.161H182.279C177.485 23.161 175.357 21.0107 175.357 16.3737V12.073C175.357 7.39994 177.485 5.28564 182.279 5.28564H198.064C203.174 5.28564 204.986 7.06357 204.986 12.073V13.4425C204.986 14.0672 204.659 14.3555 204.062 14.3555H199.268C198.625 14.3555 198.344 14.0672 198.344 13.4425V12.986C198.344 11.6165 197.736 11.0039 196.251 11.0039H185.062C182.805 11.0039 182.244 11.5805 182.244 13.4065V15.1844C182.244 17.0464 182.805 17.623 185.062 17.623H198.625C203.454 17.623 205.594 19.7373 205.594 24.4104V28.9994C205.594 33.6725 203.466 35.7868 198.625 35.7868H181.916C176.807 35.7868 174.994 34.0088 174.994 28.9994V27.6299C174.994 27.0052 175.322 26.7169 175.918 26.7169H180.712H180.677L180.665 26.7289Z"
          fill="#292524"
        />
        <path
          d="M220.442 26.7289H217.297V34.9579C217.297 35.4984 217.052 35.7868 216.455 35.7868H211.942C211.334 35.7868 211.053 35.4984 211.053 34.9579V4.36064C211.053 3.82005 211.334 3.53174 211.942 3.53174H216.455C217.063 3.53174 217.297 3.82005 217.297 4.36064V21.8156H220.641L227.762 13.4665C228.16 13.01 228.452 12.8418 229.048 12.8418H234.404C234.848 12.8418 235.047 13.3344 234.684 13.6707L225.587 24.1701L234.883 34.9218C235.21 35.2582 235.047 35.7507 234.602 35.7507H228.931C228.323 35.7507 228.008 35.6306 227.598 35.126L220.431 26.6929V26.7289H220.442Z"
          fill="#292524"
        />
        <path
          d="M239.233 4.9373C239.233 4.36067 239.514 4.1084 240.122 4.1084H244.635C245.243 4.1084 245.477 4.36067 245.477 4.9373V8.49316C245.477 9.06978 245.232 9.32206 244.635 9.32206H240.122C239.514 9.32206 239.233 9.06978 239.233 8.49316V4.9373ZM239.233 13.7068C239.233 13.1662 239.514 12.8779 240.122 12.8779H244.635C245.243 12.8779 245.477 13.1662 245.477 13.7068V34.9699C245.477 35.5105 245.232 35.7988 244.635 35.7988H240.122C239.514 35.7988 239.233 35.5105 239.233 34.9699V13.7068Z"
          fill="#292524"
        />
        <path
          d="M268.536 20.7347C268.536 18.4642 268.092 18.0437 265.438 18.0437H262.257C259.439 18.0437 258.352 19.197 258.352 21.5996V34.9221C258.352 35.4626 258.106 35.751 257.51 35.751H252.997C252.389 35.751 252.108 35.4626 252.108 34.9221V13.659C252.108 13.1184 252.389 12.8301 252.997 12.8301H256.785C257.393 12.8301 257.674 13.1184 257.674 13.659V16.8064C258.399 14.1996 260.457 12.8421 263.836 12.8421H268.466C272.898 12.8421 274.792 14.7402 274.792 19.0889V34.9341C274.792 35.4747 274.511 35.763 273.95 35.763H269.436C268.875 35.763 268.548 35.4747 268.548 34.9341V20.7467L268.536 20.7347Z"
          fill="#292524"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M43.2755 3.94028C42.4687 2.49871 41.5099 1.18929 40.4108 0C37.932 0.852926 35.3362 1.40553 32.7053 1.64579C33.4537 2.07826 34.7399 2.93118 35.7805 3.62794C36.7042 4.2406 37.8384 3.84417 38.9726 3.47177C39.452 3.3156 39.9548 3.1354 40.4108 3.0393C40.4108 3.0393 40.3757 3.37566 40.3173 3.71203C40.2588 4.10846 40.2004 4.54093 40.2237 4.54093C40.2237 4.54093 43.4743 7.72438 43.6614 15.665C44.6202 12.8179 45.0294 9.85069 44.9125 6.85945C44.702 6.48704 44.0823 5.27372 43.2405 3.92826H43.2755V3.94028ZM1.69626 3.94028C1.09994 4.92535 0.562071 5.8984 0.0242062 6.88347C-0.0927209 9.87472 0.328217 12.8419 1.27533 15.689C1.45072 7.77244 4.71298 4.56495 4.71298 4.56495C4.71298 4.56495 4.6779 4.26463 4.61944 3.92826C4.56098 3.53183 4.50251 3.07534 4.5259 3.07534C5.0053 3.17144 5.4847 3.3156 5.98749 3.50781C7.12168 3.90424 8.29095 4.27664 9.1796 3.66398C10.2202 2.95521 11.5415 2.13832 12.2548 1.68183C9.62392 1.44156 7.06322 0.888965 4.54928 0.0360391C3.45017 1.22533 2.45629 2.57079 1.68457 3.97632L1.69626 3.94028ZM15.8094 35.6187L22.404 37.6729L29.0338 35.6187L22.4391 33.6966L15.8094 35.6187ZM19.668 23.9059L22.3573 26.1644L25.0466 23.9059L22.3573 24.1822L19.668 23.9059ZM34.8919 22.5965C36.8913 27.1254 36.5055 33.3842 33.2198 38.7421C48.2683 32.0147 42.8663 18.2238 42.8663 18.2238C39.2883 14.8361 36.3534 10.7997 34.2721 6.29483C30.7526 3.84417 26.0873 3.72404 22.4508 6.01853C20.0655 4.49288 17.2008 4.03638 14.453 4.67307C13.1083 4.9734 11.7988 5.526 10.6295 6.25879C8.5365 10.7517 5.61332 14.7881 2.03535 18.1877C1.38056 20.0498 1.07655 22.0079 1.11163 24.0021C1.11163 28.591 2.95908 34.8498 11.6818 38.7421V38.682L11.296 38.0693C8.48973 33.3962 8.01033 27.642 9.98639 22.5725C8.43126 24.9271 7.60108 27.7141 7.60108 30.5492C7.60108 31.0417 7.60108 31.5222 7.50754 32.0147C4.73637 27.3657 3.02923 23.5816 4.43236 20.278L6.73582 16.1215C9.98639 9.29809 13.6579 11.1361 17.6685 13.1303C18.2999 13.4306 18.9196 13.7429 19.551 14.0192C18.6273 15.0884 17.8205 16.2536 17.1306 17.479C15.9964 20.0738 15.4001 22.9209 15.365 25.768V25.828L13.2136 29.6482C13.541 31.0897 14.0788 32.4592 14.7921 33.7446C15.33 34.5375 21.8662 32.5553 21.8662 32.5553C21.8662 31.8225 21.3283 31.2099 20.6151 31.0897L18.8495 30.8134L18.7559 30.7173C17.6802 29.7443 16.8149 28.579 16.1835 27.2576L16.1251 27.0774L16.1835 26.8972C16.8968 25.0952 17.9725 23.4374 19.3523 22.068L19.5627 21.8878L20.8489 22.2602C21.8896 22.5605 23.0004 22.5605 24.041 22.2602L25.3272 21.8878L25.5377 22.068C26.9057 23.4495 27.9815 25.0952 28.7064 26.8972L28.7649 27.0774L28.7064 27.2576C28.075 28.567 27.2098 29.7323 26.134 30.7173L26.0405 30.8134L24.2749 31.0897C23.5616 31.2099 23.0238 31.8225 23.0238 32.5553C23.0238 32.5553 29.5951 34.5375 30.0978 33.7446C30.8111 32.4592 31.349 31.0897 31.6764 29.6482L29.56 25.828V25.768C29.5249 22.9209 28.9286 20.1098 27.771 17.479C27.0577 16.2296 26.2159 15.0644 25.2921 13.9592C26.2743 12.6738 26.7304 11.052 26.5433 9.43023C25.5611 8.24094 24.3918 7.19581 23.0822 6.37892C22.9653 6.28282 22.8484 6.22275 22.6964 6.13866C26.2743 4.55294 30.4252 4.82924 33.7694 6.84743C36.0144 13.3945 41.7672 19.0166 41.7672 19.0166C42.726 23.3533 42.4804 26.7771 41.4632 29.1316C40.633 31.0897 37.2889 35.979 37.3707 30.5732C37.3707 27.7261 36.5639 24.9511 34.9854 22.5965L34.8919 22.6326V22.5965ZM28.7415 16.602C28.7415 16.602 28.5895 17.6111 29.8406 17.6111C31.0917 17.6111 31.1502 15.9653 30.8228 15.7131L28.7298 16.602H28.7415ZM13.9035 15.7131C13.5761 15.9533 13.6696 17.6111 14.8856 17.6111C16.1017 17.6111 15.9848 16.602 15.9848 16.602L13.8918 15.7131H13.9035Z"
          fill="#292524"
        />
      </g>
      <defs>
        <clipPath id="clip0_321_29244">
          <rect width="274.779" height="38.73" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
