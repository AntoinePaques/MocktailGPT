import { globalMutatorFactory, OperationType } from "./globalMutatorFactory";
import OpenAI from "openai";

const client = new OpenAI({});

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
