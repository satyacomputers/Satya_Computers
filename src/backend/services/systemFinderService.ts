import { aiService } from './aiService';
import { productRepository } from '../repositories/productRepository';
import { z } from 'zod';

export const systemFinderSchema = z.object({
  profession: z.string().min(2),
  budget: z.number().positive(),
  mobility: z.string()
});

export class SystemFinderService {
  /**
   * Main diagnostic orchestrator for hardware recommendations.
   * Leverages Gemini-driven AI OR keyword-based heuristics.
   */
  public async getRecommendation(input: { profession: string; budget: number; mobility: string }) {
    // 1. Validate Input (Zod)
    const valid = systemFinderSchema.parse(input);
    const { profession, budget, mobility } = valid;

    try {
      // 2. Prepare Context
      const inventory = await productRepository.getInventoryContext();
      
      const systemInstruction = `You are the lead architect for Satya Computers. Recommend best 2-3 laptops from the INVENTORY based on user's workload.
      
      OUTPUT FORMAT: ONLY raw JSON: { "message": "Justification text", "productIds": ["id1", "id2"] }
      
      INVENTORY:
      ${inventory}`;

      const userQuery = `Profession: ${profession}. Budget: ₹${budget}. Mobility: ${mobility}`;

      // 3. AI Execution
      const aiResponse = await aiService.getHardwareRecommendation(userQuery, systemInstruction);
      const resolvedProducts = await productRepository.resolveProducts(aiResponse.productIds || []);

      // If resolved into zero valid products, fallback
      if (resolvedProducts.length === 0) throw new Error("ZERO_VALID_PRODUCTS");

      return {
        message: aiResponse.message || "Perfect hardware acquired.",
        products: resolvedProducts
      };

    } catch (error) {
      // 4. Robust Fallback Heuristics
      console.warn("[SYSTEM-FINDER] AI Failure. Falling back to heuristics:", error);
      const fallbackProducts = await productRepository.getKeywordFallback(profession, budget);
      
      return {
        message: `Based on your budget of ₹${budget.toLocaleString('en-IN')}, our engineers recommend these robust enterprise systems.`,
        products: fallbackProducts
      };
    }
  }
}

export const systemFinderService = new SystemFinderService();
