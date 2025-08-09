// 模拟AI回复的预设响应
export const AI_RESPONSES = [
  "这是一个很有趣的问题！让我为您详细分析一下...",
  "根据我的理解，这个问题可以从多个角度来看待。",
  "非常好的想法！我建议您可以考虑以下几个方面：",
  "让我帮您整理一下思路，并提供一些建议。",
  "这确实是一个值得深入探讨的话题。基于当前的信息，我认为...",
  "我理解您的关切。让我为您提供一个全面的解答。",
  "很高兴能够帮助您！这个问题涉及到几个关键要点...",
  "根据最新的研究和实践经验，我可以为您分享以下见解：",
  "这是一个很棒的问题！让我用简单易懂的方式为您解释...",
  "我完全理解您的需求。基于您提供的信息，我建议..."
];

export const getRandomAIResponse = (): string => {
  const randomIndex = Math.floor(Math.random() * AI_RESPONSES.length);
  return AI_RESPONSES[randomIndex];
};

// 模拟AI思考延迟
export const simulateAIDelay = (): Promise<void> => {
  const delay = Math.random() * 2000 + 1000; // 1-3秒随机延迟
  return new Promise(resolve => setTimeout(resolve, delay));
};

