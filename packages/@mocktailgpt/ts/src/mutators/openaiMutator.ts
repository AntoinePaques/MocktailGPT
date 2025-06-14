import { globalMutatorFactory, OperationType } from "./globalMutatorFactory";
import OpenAI from "openai";
import "dotenv/config";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
  baseURL: process.env.OPENAI_API_BASE_URL,
});

const dispatcher = async (
  type: OperationType,
  params: Record<string, unknown>,
) => {
  switch (type) {
    case "chat":
      return client.chat.completions.create(params as any);
    case "embedding":
      return client.embeddings.create(params as any);
    default:
      throw new Error(`Unknown operation type: ${type}`);
  }
};

export const openaiMutator = globalMutatorFactory(dispatcher);
