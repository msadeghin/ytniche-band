// Convex query functions
// These require `convex dev --once` to generate proper types
// For now, they serve as API documentation

export const queries = {
  getAnalyses: {
    description: 'Get all analyses for the current user',
    args: 'userId?: string',
  },
  getAnalysis: {
    description: 'Get a specific analysis by ID',
    args: 'analysisId: string',
  },
  getChannels: {
    description: 'Get channels for an analysis',
    args: 'analysisId: string',
  },
  getNicheBends: {
    description: 'Get niche bends for an analysis',
    args: 'analysisId: string',
  },
};
