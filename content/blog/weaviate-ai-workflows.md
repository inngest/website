---
focus: false
heading: "Building Agentic Workflows with Inngest"
subtitle: Combine Weaviate and Inngest step.ai API to build AI workflows
image: "/assets/blog/weaviate-ai-workflows/cover.png"
date: 2025-01-07
author: Charly Poly
canonical_url: https://weaviate.io/blog/inngest-ai-workflows
---

AI workflows are the backbone of all AI applications, whether you are building RAG pipelines, agentic workflows, or AI agents. Since 2023, most AI applications have relied on static AI workflows like RAG pipelines. In 2024, the concept of agentic workflows—_workflows with dynamic steps planned by LLMs_—surfaced to cope with the limitations of static workflows, such as hallucination, a lack of relevancy, or flexibility.

It has been announced that 2025 will be the race for AI Agents, and having the right tools to build flexible and robust AI workflows will be crucial. For this reason, we are happy to partner with Weaviate, a vector database already used by tens of thousands of developers.

This article will show you how to use Inngest and Weaviate to build an agentic RAG pipeline that generates the perfect dinner menu based on tastes, allergies, and the number of attendees.

The finished demo is [available on GitHub](https://github.com/inngest/weaviate-agentic-workflow) so that you can follow the steps locally.

## Step 1: Setup our Dinner Generator Agentic Workflow architecture

Our Dinner Generator workflow relies on three datasets available on Huggingface:

- `Thefoodprocessor/cuisine_type`: a dataset of pairs of recipes and cuisine types (ex: “Italian”)
- `Thefoodprocessor/ingredients_alternatives`: a dataset of recipe and matching ingredients alternatives for known allergies
- `Thefoodprocessor/wine_type`: a list of pairs of recipes and wine pairings

Once those datasets are loaded into our Weaviate cluster, our workflow is triggered with an [Inngest Event](/docs/features/events-triggers?utm_source=weaviate&utm_content=article&utm_campaign=workflow-dinner-generator) with the following properties:

```json
{
  "data": {
    "participantsCount": 4,
    "preferences": ["no nuts", "vegan"],
    "cuisine_type": "Italian"
  }
}
```

Triggered by the above event, our Inngest agentic workflow goes through the following steps:

![An Inngest Workflow](/assets/blog/weaviate-ai-workflows/image3-1376d9e2ce89d41eabab082d0e80b064.png)

1.  First, our workflow will retrieve some recipes from the `Thefoodprocessorcuisinetype` Weaviate collection.
2.  Then, using the OpenAI `gpt-4` model, it will try to see if the food preferences contain some allergies.  
    2.1 If some allergies are found, an extra step is dynamically performed to retrieve some ingredient alternatives from the `Thefoodprocessoringredientsalternatives` collection.
3.  Then, an OpenAI call is performed to generate a menu (with some ingredient alternatives, if any)
4.  Another weaviate collection query is performed against the `Thefoodprocessorwinetype` collection to find wines matching the generated menu.
5.  An additional OpenAI call is made to select the wine and update the dinner menu.
6.  Finally, a shopping list is generated from the final dinner menu.

_The agentic nature of our dinner generator workflow resides in its ability to fetch additional information when allergies are mentioned in the food preferences._

The following section shows how Inngest and Weaviate make building such agentic and data-intensive workflows easy.

## Step 2: Quick and easy embedding with Weaviate vectorizer[​](#step-2-quick-and-easy-embedding-with-weaviate-vectorizer "Direct link to Step 2: Quick and easy embedding with Weaviate vectorizer")

[Huggingface datasets are available as `.parquet` files](https://huggingface.co/Thefoodprocessor), primarily designed for Python scripts.  
For this reason, [our repository](https://github.com/inngest/weaviate-agentic-workflow) contains the translated`.json` files to facilitate processing in Node.js.  
The `npm run load` script leverages Weaviate [batching](https://weaviate.io/developers/weaviate/client-libraries/typescript/typescript-v3#batch-inserts) and [vectorizer](https://weaviate.io/blog/typescript-client-stable-release#vectorizer-configuration) APIs to create new collections with a few lines of code:

```typescript
async function processJsonFile(
  filePath: string,
  client: any,
  batchSize: number = 100
) {
  const jsonData = JSON.parse(await fs.readFile(filePath, "utf-8"));
  let count = 0;
  let records: any[] = [];

  // Create collection name from filename (without extension)
  const collectionName = path
    .basename(filePath, ".json")
    .replace(/[^a-zA-Z0-9]/g, "") // Remove special characters
    .replace(/^[0-9]/, "C$&"); // Prefix with 'C' if starts with number

  const properties = Object.keys(jsonData[0]);

  // Create collection for this file
  const collection = await client.collections.create({
    name: collectionName,
    properties: properties.map((property) => ({
      name: property,
      dataType: "text" as const,
    })),
    // Use Weaviate vectorize to create embeddings
    vectorizers: [
      weaviate.configure.vectorizer.text2VecOpenAI({
        name: "recipe_vector",
        sourceProperties: properties as any,
      }),
    ],
  });

  for (const record of jsonData) {
    const { id: _, ...cleanRecord } = record;
    records.push({
      class: collectionName,
      properties: cleanRecord,
    });
    count++;

    // we push new records in batches using Weaviate's insertMany()
    if (count % batchSize === 0) {
      console.log(
        `Processing batch from ${path.basename(filePath)}: ${
          records.length
        } records`
      );
      await collection.data.insertMany(records);
      records = [];
    }
  }

  // Process any remaining records
  if (records.length > 0) {
    console.log(
      `Processing final batch from ${path.basename(filePath)}: ${
        records.length
      } records`
    );
    await collection.data.insertMany(records);
  }

  return { count, collectionName };
}
```

When embedding thousands of records, Weaviate’s `vectorizer` and `insertMany()` APIs save us from handling rate limits with OpenAI’s embedding API.

With our Weaviate collections ready, let’s look at the agentic workflow implementation.

## Step 3: Combine Weaviate and Inngest DX to build our Agentic Workflow[​](#step-3-combine-weaviate-and-inngest-dx-to-build-our-agentic-workflow "Direct link to Step 3: Combine Weaviate and Inngest DX to build our Agentic Workflow")

Inngest enables us to create AI workflows with a simple TypeScript API while Weaviate enable us to quickly retrieve data from our vectorized collections:

```typescript
import { openai } from "inngest";
import { inngest } from "./inngest-client";
import { weaviate } from "./weaviate-client";

export const generateMeal = inngest.createFunction(
  { id: "generate-meal", concurrency: 10 },
  { event: "meal.generate" },
  async ({ event, step }) => {
    // retrieve the input parameters from our trigger event
    const { participantsCount, preferences, cuisine_type } = event.data;

    // Query relevant recipes based on cusine type preference
    let relevantRecipes = await step.run("query-recipes", async () => {
      const collection = weaviate.collections.get(
        "Thefoodprocessorcuisinetype"
      );
      const query = cuisine_type;
      const result = await collection.query.nearText(query, {
        limit: 10,
      });
      return result.objects.map((r) => r.properties.recipe).join(`\n`);
    });

    const allergiesAnalysis = await step.ai.infer("Allergies analysis", {
      model: openai({ model: "gpt-4" }),
      body: {
        messages: [
          {
            role: "system",
            content:
              'Given the following list meal requirements, return a list of allergies, if not allergies, return "not allergies"',
          },
          {
            role: "user",
            content: preferences.join(", "),
          },
        ],
        temperature: 0.7,
      },
    });
    // ...
  }
);
```

_Please refer to the [repository’s README for instructions on setting up Inngest](https://github.com/inngest/weaviate-agentic-workflow)._  
An AI Workflow built with Inngest is composed of steps defined with `step.run()` or `step.ai.infer()`. With these two APIs, each step of our AI workflow will benefit from automatic retries, concurrency, and throttling control.  
Our Weaviate query, wrapped in `step.run()` will benefit from the `concurrency` configured in the Inngest Function definition, preventing any overload on our cluster.

### Zooming on `step.ai.infer()`: a faster way to develop AI Workflows[​](#zooming-on-stepaiinfer-a-faster-way-to-develop-ai-workflows "Direct link to zooming-on-stepaiinfer-a-faster-way-to-develop-ai-workflows")

Using `step.ai.infer()` to perform LLM calls brings two significant improvements:

1.  The LLM requests get highlighted in the Inngest DevServer (_your local version of Inngest_), enabling you to **inspect the token usage, the input and output of the LLM**, and **re-run the given step with a new prompt**.

    _Here is our `”Allergies analysis”` LLM step displayed in the Inngest Dev Server:_  
    ![](/assets/blog/weaviate-ai-workflows/image2-33c22138d8de6d45247c68cdfd6db8bb.png)

2.  The LLM requests are **offloaded to Inngest’s infrastructure**, making it easier to deploy workflows on **serverless platforms such as Vercel**.

### Agentic workflow steps as simple conditional statements[​](#agentic-workflow-steps-as-simple-conditional-statements "Direct link to Agentic workflow steps as simple conditional statements")

Let’s come back to our workflow and add our dynamic query to the `Thefoodprocessoringredientsalternatives` Weaviate collection based on the result of our `”Allergies analysis”` LLM step.  
Achieving such agentic pattern with Inngest only takes simple conditional statements:

```typescript
import { openai } from "inngest";
import { inngest } from "./inngest-client";
import { weaviate } from "./weaviate-client";

export const generateMeal = inngest.createFunction(
  { id: "generate-meal", concurrency: 10 },
  { event: "meal.generate" },
  async ({ event, step }) => {
    // retrieve the input parameters from our trigger event
    const { participantsCount, preferences, cuisine_type } = event.data;

    // Query relevant recipes based on cusine type preference
    let relevantRecipes = await step.run("query-recipes", async () => {
      // ...
    });

    // Look for allergies in the food preferences
    const allergiesAnalysis = await step.ai.infer("Allergies analysis", {
      // ...
    });

    let ingredientsAlternatives: any[] = [];

    // run a conditional step based on `allergiesAnalysis` result
    if (allergiesAnalysis.choices[0].message.content !== "not allergies") {
      // Query relevant recipes based on cusine type preference
      ingredientsAlternatives = await step.run(
        "query-ingredients-alternatives",
        async () => {
          const collection = client.collections.get(
            "Thefoodprocessoringredientsalternatives"
          );
          const query = allergiesAnalysis.choices[0].message.content!;
          const result = await collection.query.nearText(query, {
            limit: 10,
          });
          return result.objects;
        }
      );
    }
    // ...
  }
);
```

Starting our dinner generator workflow with food preferences including `”no nuts”` triggers the `"query-ingredients-alternatives"` Weaviate query step based on the detection of the `"Allergies analysis"` LLM step.

![Architectural Diagram](/assets/blog/weaviate-ai-workflows/image1-c8622654bb9d0f2b994ed5bab8cc360a.png)

The following steps of our Dinner generator workflow leverage Weaviate’s `collection.query.nearText()` and Inngest’s `step.ai.infer()` APIs similarly generate the menu, get the relevant wine pairing, and generate the shopping list.  
Let’s now see our Dinner generator in action.

## Try it out: Generate a unique Dinner menu[​](#try-it-out-generate-a-unique-dinner-menu "Direct link to Try it out: Generate a unique Dinner menu")

The above code and setup instructions are available in our recipes repository and can be run locally using the Inngest Dev Server.  
You’ll be able to generate multiple menu variations by trying different food preferences or cuisine types:

![Weaviate Inngest Demo](/assets/blog/weaviate-ai-workflows/demo-fab1a2172c3762f025c4281879971446.gif)

This article covered how Weaviate’s rich embedding and query APIs make indexing and querying large vectorized datasets easy. It also demonstrated how Inngest’s composable API enables writing robust and dynamic workflows with simple APIs.

This demo only scratches the surface of how combining Weaviate and Inngest can enable. If you want to build Agentic workflows with more autonomy, such as AI Agents, you should look at [Weaviate Generative Search](https://weaviate.io/developers/weaviate/model-providers/openai#generative-ai-models-for-rag) and Inngest’s new [AgentKit library](https://agentkit.inngest.com/overview). Or, you can wait for our next article on AI Agents.
