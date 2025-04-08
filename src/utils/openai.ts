import OpenAI from 'openai';

export const openai = new OpenAI({
  baseURL: 'https://api.siliconflow.cn/v1',
  apiKey: import.meta.env.VITE_API_SECRET,
  dangerouslyAllowBrowser: true
});
