import { GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";

export const providerFast = {
  google: {
    thinkingConfig: {
      thinkingBudget: 0,
    },
  } satisfies GoogleGenerativeAIProviderOptions,
};

export const providerMedium = {
  google: {
    thinkingConfig: {
      thinkingBudget: 512,
    },
  } satisfies GoogleGenerativeAIProviderOptions,
};
