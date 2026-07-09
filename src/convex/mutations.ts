// Convex mutation functions
// These require `convex dev --once` to generate proper types

export const mutations = {
  createAnalysis: {
    description: 'Create a new analysis record',
    args: 'mode, inputValue?',
  },
  updateAnalysis: {
    description: 'Update analysis status and results',
    args: 'analysisId, status?, currentPhase?, results?',
  },
  addChannel: {
    description: 'Add a discovered channel to an analysis',
    args: 'analysisId, channelId, channelName, ...',
  },
  addNicheBend: {
    description: 'Add a niche bend proposal',
    args: 'analysisId, sourceChannelId, rank, ...',
  },
};
