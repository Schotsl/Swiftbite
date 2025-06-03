import { GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";

export const providerFast = {
  google: {
    thinkingConfig: {
      thinkingBudget: 0,
    },
  } satisfies GoogleGenerativeAIProviderOptions,
};