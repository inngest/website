"use client";

import { useState } from "react";
import { Fence } from "./CodeBlock";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./Card";
import { Button } from "../Button";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

// Languages that can be selected. Each entry holds an id, the syntax highlighter name, and an icon renderer.
const LANGUAGES = [
  {
    id: "typescript",
    syntax: "typescript",
    Icon: TypescriptSVG,
  },
  // {
  //   id: "python",
  //   syntax: "python",
  //   Icon: PythonSVG,
  // },
  // {
  //   id: "go",
  //   syntax: "go",
  //   Icon: GoSVG,
  // },
] as const;

const STEPS = ["step.run", "step.ai", "step.sleep"] as const;

type LanguageId = typeof LANGUAGES[number]["id"];

type StepId = typeof STEPS[number];

// Placeholder snippets for each language + step combination.
// In a real implementation these would be replaced with real code examples.
const SNIPPETS: Record<LanguageId, Record<StepId, string>> = {
  typescript: {
    "step.run": `
// step.run is a code-level transaction:  it retries automatically
  // on failure and only runs once on success.
  const transcript = await step.run('transcribe-video',
    async () => deepgram.transcribe(event.data.videoUrl)
  )

  // function state is automatically managed for fault tolerance
  // across steps.
  const summary = await step.run('summarize-transcript',
    async () => llm.createCompletion({
      model: "gpt-4o",
      prompt: createSummaryPrompt(transcript),
    })
  )
    
    `,
    "step.ai": `
// Use step.ai to proxy AI requests w/ automatic retries,
// caching and improved observability
const response = await step.ai.infer("call-openai", {
  model: step.ai.models.openai({ model: "gpt-4o" }),
  body: {
    messages: [
      {
        role: "assistant",
        content: 'You are an expert...',
      },
    ],
    tools: [/* ... */],
  },
});
`,
    "step.sleep": `
 await step.run('send-welcome-email', () => {
  // ...
});

// Pause execution, Inngest resumes execution automatically
await step.sleep('wait-a-week', '7d');

await step.run('send-follow-up-email', () => {
  // ...
});
//
//
//
//
    
    `,
  },
  //   python: {
  //     "step.run": `
  //     import inngest
  // inngest_client = inngest.Inngest(app_id="my_app")
  // # Call the "send_sync" method if you aren't using async/await
  // ids = inngest_client.send_sync(
  //     inngest.Event(name="my_event", data={"msg": "Hello!"})
  // )
  // # Can pass a list of events
  // ids = await inngest_client.send(
  //     [
  //         inngest.Event(name="my_event", data={"msg": "Hello!"}),
  //     ]
  // )
  //     `,
  //     "step.ai": `
  //     import inngest
  // inngest_client = inngest.Inngest(app_id="my_app")
  // # Call the "send_sync" method if you aren't using async/await
  // ids = inngest_client.send_sync(
  //     inngest.Event(name="my_event2", data={"msg": "Hello!"})
  // )
  // # Can pass a list of events
  // ids = await inngest_client.send(
  //     [
  //         inngest.Event(name="my_event2", data={"msg": "Hello!"}),
  //     ]
  // )
  //     `,
  //     "step.sleep": `
  //     import inngest
  // inngest_client = inngest.Inngest(app_id="my_app")
  // # Call the "send_sync" method if you aren't using async/await
  // ids = inngest_client.send_sync(
  //     inngest.Event(name="my_event3", data={"msg": "Hello!"})
  // )
  // # Can pass a list of events
  // ids = await inngest_client.send(
  //     [
  //         inngest.Event(name="my_event3", data={"msg": "Hello!"}),
  //     ]
  // )
  //     `,
  //   },
  //   go: {
  //     "step.run": `func main() {
  // 	client := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "core"})
  // 	fn := inngestgo.CreateFunction(
  // 		client,
  // 		inngestgo.FunctionOpts{ID: "account-created"},
  // 		inngestgo.EventTrigger("api/account.created", nil),
  // 		AccountCreated,
  // 	)
  // 	if err := fn.Serve(":8080"); err != nil {
  // 		log.Fatal(err)
  // 	}
  // }`,
  //     "step.ai": `func main() {
  // 	client := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "core"})
  // 	fn := inngestgo.CreateFunction(
  // 		client,
  // 		inngestgo.FunctionOpts{ID: "account-created"},
  // 		inngestgo.EventTrigger("api/account.created", nil),
  // 		AccountCreated,
  // 	)
  // 	if err := fn.Serve(":8080"); err != nil {
  // 		log.Fatal(err)
  // 	}
  // }`,
  //     step: `func main() {
  // 	client := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "core"})
  // 	fn := inngestgo.CreateFunction(
  // 		client,
  // 		inngestgo.FunctionOpts{ID: "account-created"},
  // 		inngestgo.EventTrigger("api/account.created", nil),
  // 		AccountCreated,
  // 	)
  // 	if err := fn.Serve(":8080"); err != nil {
  // 		log.Fatal(err)
  // 	}
  // }`,
  //   },
};

export default function CodeBlockSwitcher() {
  const [activeLanguage, setActiveLanguage] =
    useState<LanguageId>("typescript");
  const [activeStep, setActiveStep] = useState<StepId>("step.run");

  const snippet = SNIPPETS[activeLanguage][activeStep];
  const syntax = LANGUAGES.find((l) => l.id === activeLanguage)!.syntax;

  return (
    <div
      id="code-block-switcher"
      className="code-block-switcher mx-auto mb-20 mt-8 flex max-w-7xl flex-col justify-center md:mb-40 xl:flex-row"
    >
      <div className="flex flex-col">
        <div className="flex flex-col items-stretch xl:flex-row">
          <div className="z-30 order-2 flex-col sm:order-1">
            {/* 2 ─ language icons */}
            <div className="z-30 flex items-center gap-2 pb-2">
              {LANGUAGES.map(({ id, Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveLanguage(id)}
                  className="transition-opacity hover:opacity-80"
                >
                  <Icon selected={activeLanguage === id} />
                </button>
              ))}
            </div>

            {/* 3 ─ row that should have equal heights */}
            {/* left: step-tabs + code */}
            <div className="code-block-anchor relative z-30 order-2 w-full overflow-x-auto border-2 border-stone-700 sm:order-1 md:w-[48rem] md:max-w-full">
              <div className="flex h-9 border-b-2 border-stone-700 bg-stone-900 px-[15px]">
                {STEPS.map((stepId) => (
                  <button
                    key={stepId}
                    onClick={() => setActiveStep(stepId)}
                    className={
                      activeStep === stepId
                        ? "border-b-2 border-white px-4 font-mono text-sm text-white"
                        : "border-b-2 border-transparent px-4 font-mono text-sm text-stone-400 hover:text-white"
                    }
                  >
                    {stepId}
                  </button>
                ))}
              </div>
              <Fence language={syntax} showLineNumbers>
                {snippet}
              </Fence>
            </div>
          </div>

          {/* right: card */}
          <Card className="code-card-anchor order-1 mt-8 flex h-full max-w-2xl flex-col justify-center rounded-none border-none bg-stone-950 sm:order-2 md:ml-8 md:mt-0">
            <CardHeader className="">
              <CardTitle className="text-balance font-whyte text-3xl font-light">
                Skip boilerplate code, and build with steps
              </CardTitle>
            </CardHeader>
            <CardContent className="max-w-2xl font-circular text-base font-normal text-stone-300">
              <p className="font-sans text-base font-normal leading-[26.24px] tracking-[-0.304px] text-stone-300">
                Our SDKs provide simple building blocks and integrations with
                your favorite tools to let you focus on what matters the most:
                your product.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <Link href="/docs?ref=homepage-sdk">
                  Read Documentation <ArrowRightIcon />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

function TypescriptSVG({ selected = false }: { selected?: boolean }) {
  const color = selected ? "#CBB26A" : "#FAFAF9";
  const border = selected ? "#CBB26A" : "#6C6660";
  return (
    <svg
      width="46"
      height="38"
      viewBox="0 0 46 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color }}
    >
      <path d="M44.9678 0.5V37.5H0.5V0.5H44.9678Z" fill="#1C1917" />
      <path d="M44.9678 0.5V37.5H0.5V0.5H44.9678Z" stroke={border} />
      <path
        d="M11.5329 7.2439C11.3844 7.24391 11.242 7.30292 11.1369 7.40793C11.0319 7.51295 10.9729 7.65538 10.9729 7.8039V30.2039C10.9729 30.3524 11.0319 30.4948 11.1369 30.5999C11.242 30.7049 11.3844 30.7639 11.5329 30.7639H33.9329C34.0814 30.7639 34.2238 30.7049 34.3289 30.5999C34.4339 30.4948 34.4929 30.3524 34.4929 30.2039V7.8039C34.4929 7.65538 34.4339 7.51295 34.3289 7.40793C34.2238 7.30292 34.0814 7.24391 33.9329 7.2439H11.5329ZM12.0929 8.3639H33.3729V29.6439H12.0929V8.3639ZM17.1329 17.8839V19.8133H19.9329V28.5239H22.1729V19.8133H24.9729V17.8839H17.1329ZM29.2801 17.8894C27.5359 17.8824 25.5427 18.411 25.5427 20.8655C25.5427 24.0743 29.8663 24.075 29.8663 25.5226C29.8663 25.6598 29.9245 26.6569 28.3985 26.6569C26.8725 26.6569 25.6007 25.6976 25.6007 25.6976V28.0262C25.6007 28.0262 32.254 30.1782 32.254 25.3258C32.2534 22.1758 27.8899 22.3333 27.8899 20.7681C27.8899 20.1616 28.3208 19.5945 29.5142 19.5945C30.7075 19.5945 31.764 20.2989 31.764 20.2989L31.8427 18.2241C31.8427 18.2241 30.6367 17.8948 29.2801 17.8894Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PythonSVG({ selected = false }: { selected?: boolean }) {
  const color = selected ? "#CBB26A" : "#FAFAF9";
  const border = selected ? "#CBB26A" : "#6C6660";
  return (
    <svg
      width="46"
      height="38"
      viewBox="0 0 46 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color }}
    >
      <rect x="0.967285" y="0.5" width="44.4674" height="37" fill="#1C1917" />
      <rect x="0.967285" y="0.5" width="44.4674" height="37" stroke={border} />
      <path
        d="M23.202 6.12109C20.9292 6.12109 19.387 6.66359 18.407 7.45109C17.427 8.23859 17.042 9.25141 17.042 10.0936V12.8411H22.642V13.4011H14.2945C13.2708 13.4011 12.2317 13.8452 11.4945 14.7836C10.7573 15.722 10.322 17.122 10.322 19.0011C10.322 20.8802 10.7573 22.2802 11.4945 23.2186C12.2317 24.157 13.2708 24.6011 14.2945 24.6011H17.042V27.9086C17.042 28.7508 17.427 29.7636 18.407 30.5511C19.387 31.3386 20.9292 31.8811 23.202 31.8811C25.4748 31.8811 27.017 31.3386 27.997 30.5511C28.977 29.7636 29.362 28.7508 29.362 27.9086V25.1611H23.762V24.6011H32.1095C33.1333 24.6011 34.1723 24.157 34.9095 23.2186C35.6467 22.2802 36.082 20.8802 36.082 19.0011C36.082 17.122 35.6467 15.722 34.9095 14.7836C34.1723 13.8452 33.1333 13.4011 32.1095 13.4011H29.362V10.0936C29.362 9.22953 28.9792 8.21453 27.997 7.43359C27.0148 6.65266 25.4726 6.12109 23.202 6.12109ZM23.202 7.24109C25.2998 7.24109 26.5708 7.73109 27.297 8.30859C28.0233 8.88609 28.242 9.55766 28.242 10.0936V16.7611C28.242 17.6886 27.4895 18.4411 26.562 18.4411H19.842C18.6892 18.4411 17.6961 19.152 17.2695 20.1561C17.1973 20.3223 17.1317 20.4995 17.0945 20.6811C17.0573 20.8627 17.042 21.0486 17.042 21.2411V23.4811H14.2945C13.5836 23.4811 12.9251 23.2033 12.387 22.5186C11.8489 21.8339 11.442 20.7052 11.442 19.0011C11.442 17.297 11.8489 16.1683 12.387 15.4836C12.9251 14.7989 13.5836 14.5211 14.2945 14.5211H23.762V11.7211H18.162V10.0936C18.162 9.59266 18.3786 8.91016 19.107 8.32609C19.8355 7.74203 21.1064 7.24109 23.202 7.24109ZM20.402 8.92109C19.7851 8.92109 19.282 9.42422 19.282 10.0411C19.282 10.658 19.7851 11.1611 20.402 11.1611C21.0189 11.1611 21.522 10.658 21.522 10.0411C21.522 9.42422 21.0189 8.92109 20.402 8.92109ZM29.362 14.5211H32.1095C32.8205 14.5211 33.4789 14.7989 34.017 15.4836C34.5551 16.1683 34.962 17.297 34.962 19.0011C34.962 20.7052 34.5551 21.8339 34.017 22.5186C33.4789 23.2033 32.8205 23.4811 32.1095 23.4811H22.642V26.2811H28.242V27.9086C28.242 28.4095 28.0255 29.092 27.297 29.6761C26.5686 30.2602 25.2976 30.7611 23.202 30.7611C21.1064 30.7611 19.8355 30.2602 19.107 29.6761C18.3786 29.092 18.162 28.4095 18.162 27.9086V21.2411C18.162 21.1252 18.1751 21.018 18.197 20.9086C18.3545 20.143 19.0305 19.5611 19.842 19.5611H26.562C28.0998 19.5611 29.362 18.2989 29.362 16.7611V14.5211ZM26.002 26.8411C25.3851 26.8411 24.882 27.3442 24.882 27.9611C24.882 28.578 25.3851 29.0811 26.002 29.0811C26.6189 29.0811 27.122 28.578 27.122 27.9611C27.122 27.3442 26.6189 26.8411 26.002 26.8411Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GoSVG({ selected = false }: { selected?: boolean }) {
  const color = selected ? "#CBB26A" : "#FAFAF9";
  const border = selected ? "#CBB26A" : "#6C6660";
  return (
    <svg
      width="50"
      height="38"
      viewBox="0 0 50 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color }}
    >
      <rect x="1.43481" y="0.5" width="47.4022" height="37" fill="#1C1917" />
      <rect x="1.43481" y="0.5" width="47.4022" height="37" stroke={border} />
      <path
        d="M12.6555 16.7823C12.5981 16.7823 12.5838 16.7531 12.6125 16.7092L12.9134 16.3145C12.9421 16.2707 13.0137 16.2415 13.071 16.2415H18.1869C18.2442 16.2415 18.2585 16.2853 18.2299 16.3292L17.9862 16.7092C17.9576 16.7531 17.8859 16.7969 17.8429 16.7969L12.6555 16.7823Z"
        fill="currentColor"
      />
      <path
        d="M10.4953 18.1075C10.438 18.1075 10.4237 18.0783 10.4523 18.0344L10.7532 17.6397C10.7819 17.5959 10.8536 17.5667 10.9109 17.5667H17.4454C17.5027 17.5667 17.5314 17.6105 17.517 17.6544L17.4024 18.0052C17.3881 18.0637 17.3307 18.0929 17.2734 18.0929L10.4953 18.1075Z"
        fill="currentColor"
      />
      <path
        d="M13.9641 19.5138C13.9067 19.5138 13.8924 19.4699 13.9211 19.4261L14.1217 19.0606C14.1503 19.0168 14.2077 18.9729 14.265 18.9729H17.131C17.1883 18.9729 17.217 19.0168 17.217 19.0752L17.1883 19.4261C17.1883 19.4845 17.131 19.5284 17.088 19.5284L13.9641 19.5138Z"
        fill="currentColor"
      />
      <path
        d="M28.8552 16.5296C27.9523 16.7635 27.336 16.9389 26.4475 17.1728C26.2325 17.2312 26.2182 17.2458 26.0318 17.0266C25.8169 16.7781 25.6592 16.6173 25.3582 16.4712C24.4553 16.0181 23.5811 16.1496 22.7642 16.6904C21.7896 17.3335 21.288 18.2836 21.3023 19.4675C21.3167 20.6368 22.1049 21.6015 23.2371 21.7623C24.2117 21.8938 25.0286 21.543 25.6735 20.7976C25.8025 20.6368 25.9172 20.4614 26.0605 20.2568C25.5446 20.2568 24.8996 20.2568 23.2945 20.2568C22.9935 20.2568 22.9218 20.0668 23.0222 19.8183C23.2085 19.3652 23.5524 18.6052 23.7531 18.2251C23.7961 18.1374 23.8964 17.9913 24.1114 17.9913C24.8423 17.9913 27.5367 17.9913 29.3282 17.9913C29.2995 18.3859 29.2995 18.7805 29.2422 19.1752C29.0845 20.2276 28.6976 21.1922 28.067 22.04C27.0351 23.4285 25.6879 24.2909 23.9824 24.5248C22.5779 24.7148 21.2737 24.4371 20.1271 23.5601C19.0666 22.7416 18.4646 21.66 18.307 20.3153C18.1207 18.7221 18.5793 17.2897 19.5252 16.0327C20.5427 14.6734 21.8899 13.811 23.5381 13.5041C24.8853 13.2556 26.1752 13.4164 27.336 14.2203C28.0956 14.7318 28.6402 15.4334 28.9985 16.2812C29.0845 16.4127 29.0272 16.4858 28.8552 16.5296Z"
        fill="currentColor"
      />
      <path
        d="M33.6058 24.6065C32.3016 24.5773 31.112 24.1972 30.1088 23.3203C29.2632 22.5748 28.7329 21.6248 28.5609 20.4993C28.303 18.8477 28.7473 17.386 29.7218 16.0852C30.7681 14.682 32.0293 13.9512 33.7347 13.6443C35.1966 13.3812 36.5725 13.5273 37.8193 14.3897C38.9515 15.179 39.6538 16.246 39.8401 17.6491C40.0838 19.6223 39.5248 21.2301 38.192 22.6041C37.2461 23.5834 36.0852 24.1972 34.7523 24.475C34.3653 24.548 33.9784 24.5627 33.6058 24.6065ZM37.0167 18.7015C37.0024 18.5115 37.0024 18.3653 36.9737 18.2192C36.7158 16.7722 35.4116 15.9536 34.05 16.2752C32.7172 16.5822 31.8573 17.4445 31.542 18.8184C31.284 19.9585 31.8286 21.1132 32.8605 21.5809C33.6488 21.9317 34.437 21.8879 35.1966 21.4932C36.3288 20.894 36.9451 19.9585 37.0167 18.7015Z"
        fill="currentColor"
      />
    </svg>
  );
}
