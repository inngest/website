const url = "https://api.ashbyhq.com/jobPosting.list";
const apiKey = process.env.ASHBY_API_KEY;

export default async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // API key as username, no password
    const auth = Buffer.from(`${apiKey}:`).toString("base64");
    console.log(auth);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        authorization: `Basic ${auth}`,
        accept: "application/json",
      },
    })
      .then((res) => res.json())
      .catch((err) => {
        throw err;
      });
    return res.status(200).json({
      roles: response.results ?? [],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch jobs", roles: [] });
  }
};
