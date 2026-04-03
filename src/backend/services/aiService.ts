export class AiService {
  private readonly API_KEY = process.env.GEMINI_API_KEY;

  /**
   * Generates hardware recommendations using Gemini 2.0/1.5 models.
   * Leverages advanced LLM diagnostics to analyze workload parameters.
   */
  public async getHardwareRecommendation(userQuery: string, systemInstruction: string) {
    if (!this.API_KEY) throw new Error("GEMINI_API_KEY_MISSING");

    for (const modelName of ["gemini-2.0-flash", "gemini-1.5-flash"]) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${this.API_KEY}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] },
            generationConfig: { 
              maxOutputTokens: 500, 
              temperature: 0.1,
              responseMimeType: "application/json"
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (jsonText) {
            return JSON.parse(jsonText); // Expected: { message: string, productIds: string[] }
          }
        }
      } catch (err) {
        console.error(`AI Model Failure (${modelName}):`, err);
      }
    }
    
    throw new Error("AI_ORCHESTRATION_FAILURE");
  }
  public async auditSystemEfficiency(specs: string, softwareRequested: string) {
    const instruction = `ACT AS A SENIOR HARDWARE ARCHITECT. Audit the FOLLOWING specs against ${softwareRequested}. Return ONLY valid JSON: { "grade": "X", "bottleneck": "X", "recommendation": "X", "efficiency": 0-100 }`;
    return this.getHardwareRecommendation(`AUDIT REQ: ${specs}`, instruction);
  }
}

export const aiService = new AiService();
