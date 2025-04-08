<template>
  <div class="container mx-auto max-w-4xl px-4 py-8">
    <!-- 顶部导航 -->
    <div class="mb-8 flex items-center justify-between">
      <button
        @click="goBack"
        class="hidden items-center text-indigo-600 hover:text-indigo-800 sm:flex">
        <ArrowLeft class="mr-1 h-5 w-5" />
        返回选择
      </button>
      <h1 class="text-center text-3xl font-bold text-indigo-800">塔罗占卜结果</h1>
    </div>

    <!-- 问题展示 -->
    <div class="mb-8 rounded-lg bg-indigo-50 p-4 shadow-sm">
      <h2 class="mb-2 text-lg font-semibold text-indigo-800">你的问题:</h2>
      <p class="text-gray-700">{{ appStore.userQuestion || '未提供具体问题' }}</p>
    </div>

    <!-- AI解读结果 -->
    <div class="mb-8 rounded-lg bg-white p-6 shadow-lg">
      <div class="mb-4 flex items-center">
        <Sparkles class="mr-2 h-6 w-6 text-yellow-500" />
        <h2 class="text-xl font-bold text-indigo-900">塔罗解读</h2>
      </div>

      <div v-if="isLoading" class="flex flex-col items-center py-8">
        <Loader2 class="mb-4 h-10 w-10 animate-spin text-indigo-600" />
        <p class="text-indigo-600">AI正在解读你的塔罗牌...</p>
      </div>

      <div v-else-if="interpretation">
        <div v-for="(card, index) in selectedCards" :key="card.id" class="mb-6">
          <h3 class="border-b border-indigo-200 pb-2 text-lg font-bold text-indigo-800">
            卡片 {{ index + 1 }}: {{ card.name }}
          </h3>
          <div class="mt-3 mb-4 flex gap-4">
            <div class="w-12 flex-shrink-0">
              <component :is="card.image" :alt="card.name" class="h-auto w-full rounded-sm" />
            </div>
            <div class="text-sm text-gray-600">
              <p class="mb-2"><span class="font-bold">正位含义:</span> {{ card.positive }}</p>
              <p><span class="font-bold">逆位含义:</span> {{ card.negative }}</p>
            </div>
          </div>
          <div class="text-gray-700" v-html="interpretation[index]"></div>
        </div>

        <div class="mt-8 border-t border-gray-200 pt-4">
          <h3 class="mb-3 text-lg font-bold text-indigo-800">综合解读</h3>
          <div class="text-gray-700" v-html="overallInterpretation"></div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex justify-center gap-4">
      <button
        @click="generateInterpretation"
        class="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:bg-indigo-300"
        :disabled="isLoading">
        <RefreshCw class="mr-2 h-4 w-4" :class="{ 'animate-spin': isLoading }" />
        重新解读
      </button>
      <button @click="goBack" class="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
        重新选牌
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ArrowLeft, Sparkles, RefreshCw, Loader2 } from 'lucide-vue-next';
import type { TaroCard } from '@/utils/const';
import { useAppStore } from '@/store';
import { openai } from '@/utils/openai';

const appStore = useAppStore();

const props = defineProps<{
  selectedCards: TaroCard[];
}>();

const emit = defineEmits(['back']);

const isLoading = ref(true);
const interpretation = ref<string[]>([]);
const overallInterpretation = ref('');

onMounted(() => {
  generateInterpretation();
});

const generateInterpretation = async () => {
  isLoading.value = true;

  try {
    const question = appStore.userQuestion || '未提供具体问题';

    // 为每张卡片单独生成解读
    const cardInterpretations = await Promise.all(
      props.selectedCards.map(async (card, index) => {
        const prompt = `你是一位专业的塔罗牌解读师。请为以下塔罗牌提供深入、富有洞察力的解读:
        
        问题: ${question}
        
        卡片信息:
        名称: ${card.name}
        正位含义: ${card.positive}
        逆位含义: ${card.negative}
        卡片位置: ${index + 1}
        
        请提供一段100字左右的解读,包括这张牌在当前问题情境中的含义以及给提问者的建议。使用通俗易懂的语言,让人有启发性,并保持神秘感。
        只返回解读内容,不需要添加任何前缀或标题。将内容格式化为HTML段落。`;

        const response = await openai.chat.completions.create({
          model: 'Qwen/Qwen2.5-7B-Instruct',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7
        });

        return response.choices[0].message.content || '无法生成解读';
      })
    );

    interpretation.value = cardInterpretations;

    // 生成综合解读
    const overallPrompt = `你是一位专业的塔罗牌解读师。请基于以下信息提供一个综合的塔罗占卜解读:
    
    问题: ${question}
    
    选择的牌:
    ${props.selectedCards
      .map(
        (card, i) =>
          `卡片${i + 1}: ${card.name}（正位含义: ${card.positive},逆位含义: ${card.negative})`
      )
      .join('\n')}
    
    请提供一个200-300字的综合解读,分析这些卡片如何相互关联,以及对提问者问题的整体启示。
    解读应该包括:
    1. 当前状况的总体分析
    2. 未来的可能发展
    3. 富有智慧的建议
    
    使用通俗易懂的语言,让人感到温暖、有启发性,并保持神秘感。
    只返回解读内容,不需要添加任何前缀或标题。将内容格式化为HTML段落。`;

    const overallResponse = await openai.chat.completions.create({
      model: 'Qwen/Qwen2.5-7B-Instruct',
      messages: [{ role: 'user', content: overallPrompt }],
      temperature: 0.7
    });

    overallInterpretation.value = overallResponse.choices[0].message.content || '无法生成综合解读';
  } catch (error) {
    console.error('生成解读失败:', error);
    // 如果API调用失败,使用备用的随机解读
    fallbackRandomInterpretation();
  } finally {
    isLoading.value = false;
  }
};

// 备用随机解读函数,当API调用失败时使用
const fallbackRandomInterpretation = () => {
  interpretation.value = props.selectedCards.map((card) => {
    return `<p>这张${card.name}在你当前的情境中代表着${getRandomElement(interpretationTemplates)}</p>
    <p>它提示你${getRandomElement(adviceTemplates)}</p>`;
  });

  overallInterpretation.value = `<p>从整体上看,这次占卜显示${getRandomElement(overallTemplates)}</p>
  <p>在未来的日子里,你可能需要${getRandomElement(futureTemplates)}</p>
  <p>最重要的是要记住：${getRandomElement(wisdomTemplates)}</p>`;
};
const goBack = () => {
  emit('back');
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
  return array[Math.floor(Math.random() * array.length)];
}
</script>
