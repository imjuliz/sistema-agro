import fetch from "node-fetch";

export const translateText = async (req, res) => {
  try {
    const { text, to } = req.body;

    const response = await fetch(
      `${process.env.AZURE_TRANSLATOR_ENDPOINT}/translate?api-version=3.0&to=${to}`,
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.AZURE_TRANSLATOR_KEY,
          "Ocp-Apim-Subscription-Region": process.env.AZURE_TRANSLATOR_REGION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{ text }]),
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao traduzir:", err);
    res.status(500).json({ error: "Erro ao traduzir texto" });
  }
};
