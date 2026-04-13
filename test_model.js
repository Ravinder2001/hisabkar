require("dotenv").config({ path: ".env.dev" });
// fetch is globally available in Node 18+

async function testModel() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const baseUrl = "https://openrouter.ai/api/v1";

  const models = ["deepseek/deepseek-chat", "meta-llama/llama-3-70b-instruct", "mistralai/mixtral-8x7b-instruct"];

  if (!apiKey) {
    console.log("NO OPENROUTER_API_KEY FOUND IN .env.dev");
    return;
  }

  for (const model of models) {
    try {
      console.log(`Testing ${model}...`);
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: "user", content: "Hi" }],
          max_tokens: 10,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Success ${model}:`, data.choices[0].message.content);
      } else {
        const error = await response.json().catch(() => ({}));
        console.log(`Error ${model}:`, response.status, error);
      }
    } catch (err) {
      console.log(`Network error for ${model}:`, err.message);
    }
  }
}

testModel();
