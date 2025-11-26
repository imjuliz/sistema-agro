// translateController.js
export const translateText = async (req, res) => {
  try {
    const { text, to } = req.body;
    if (!text || !to)
      return res.status(400).json({ error: "text and to are required" });

    const endpoint = process.env.AZURE_TRANSLATOR_ENDPOINT;
    const key = process.env.AZURE_TRANSLATOR_KEY;
    const region = process.env.AZURE_TRANSLATOR_REGION; // opcional dependendo do recurso

    if (!endpoint || !key) {return res.status(500).json({ error: "Translator not configured" });}

    const url = `${endpoint.replace(
      /\/$/,
      ""
    )}/translate?api-version=3.0&to=${encodeURIComponent(to)}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        // incluir region se seu recurso exigir (multi-service/regional)
        ...(region ? { "Ocp-Apim-Subscription-Region": region } : {}),
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ text }]),
    });

    if (!response.ok) {
      const textErr = await response.text();
      console.error("Azure translate error:", response.status, textErr);
      return res
        .status(502)
        .json({ error: "Translation service error", details: textErr });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao traduzir:", err);
    return res.status(500).json({ error: "Erro ao traduzir texto" });
  }
};
