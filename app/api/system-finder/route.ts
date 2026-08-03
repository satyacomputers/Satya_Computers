import { systemFinderController } from "@/src/backend/controllers/systemFinderController";

export async function POST(req: Request) {
  return systemFinderController.getRecommendation(req);
}
