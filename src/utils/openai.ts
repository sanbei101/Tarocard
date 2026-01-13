import OpenAI from 'openai';
import type { TaroCard } from './const';

export const openai = new OpenAI({
  baseURL: 'https://api.siliconflow.cn/v1',
  apiKey: import.meta.env.VITE_API_SECRET,
  dangerouslyAllowBrowser: true
});

// 备用随机解读函数,当API调用失败时使用
export const fallbackInterpretation = (
  selectedCards: TaroCard[]
): {
  interpretations: string[];
  overall: string;
} => {
  const interpretations = selectedCards.map((card) => {
    return `<p>这张${card.name}在你当前的情境中代表着${getRandomElement(interpretationTemplates)}</p>
    <p>它提示你${getRandomElement(adviceTemplates)}</p>`;
  });

  const overall = `<p>从整体上看,这次占卜显示${getRandomElement(overallTemplates)}</p>
    <p>在未来的日子里,你可能需要${getRandomElement(futureTemplates)}</p>
    <p>最重要的是要记住：${getRandomElement(wisdomTemplates)}</p>`;

  return {
    interpretations,
    overall
  };
};

// 模板文本,实际应用中应该由AI生成
const interpretationTemplates = [
  '内在的力量与潜能,你需要相信自己的直觉和能力',
  '当前面临的挑战与障碍,这是一个需要耐心和毅力的时期',
  '转变与新机会,宇宙正在为你打开新的大门',
  '过去经历的影响,它提醒你从历史中汲取智慧',
  '内心深处的渴望与恐惧,需要你勇敢面对'
];

const adviceTemplates = [
  '保持开放的心态,接受变化并从中学习成长',
  '信任你的直觉,它正引导你走向正确的方向',
  '放下对结果的执着,专注于当下的过程',
  '重新评估你的优先事项,确保它们与你的真实价值观一致',
  '寻求平衡,不要让单一领域占据你全部的注意力'
];

const overallTemplates = [
  '你正处于重要的转折点,即将迎来显著的成长机会',
  '当前的挑战是为了锻炼你的韧性和适应能力',
  '你的直觉比想象中更加准确,值得更多信任',
  '过去的经验为你提供了宝贵的智慧,现在是应用它们的时候',
  '你正走在正确的道路上,尽管可能暂时看不到全局'
];

const futureTemplates = [
  '更加关注自我照顾和内在平静',
  '在关键决策前深度反思和冥想',
  '勇敢尝试新事物,扩展你的舒适区',
  '加强与重要人物的沟通与连接',
  '重新评估你的长期目标和生活方向'
];

const wisdomTemplates = [
  '真正的力量来自于自我接纳与内在平静',
  '每一个挑战都是宇宙赐予的一份礼物',
  '人生的旅程比目的地更重要',
  '倾听内心的声音,它知道什么对你是最好的',
  '改变始于接受现实,而不是抗拒它'
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)] as T;
}
