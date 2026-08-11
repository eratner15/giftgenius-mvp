// Gift Agent — replaced by server-side Claude Haiku endpoint (/gifts/api/chat)
// This file is kept as a stub for any imports that reference it.

export const giftGeniusAgentWithMemory = {
  async run(message, userId) {
    throw new Error('giftAgent is deprecated — use /gifts/api/chat endpoint instead');
  }
};

export default giftGeniusAgentWithMemory;
