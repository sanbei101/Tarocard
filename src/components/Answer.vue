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
        class="flex cursor-pointer items-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:bg-indigo-300"
        :disabled="isLoading">
        <RefreshCw class="mr-2 h-4 w-4" :class="{ 'animate-spin': isLoading }" />
        重新解读
      </button>
      <button
        @click="goBack"
        class="cursor-pointer rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
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
import { fallbackInterpretation, openai } from '@/utils/openai';

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

        请提供一段100字左右的解读,包括这张牌在当前问题情境中的含义以及给提问者的建议。
        请用<b></b>标签标记解读中的重点内容,以便更清晰地展示
        使用通俗易懂的语言,让人有启发性,并保持神秘感。
        只返回解读内容,不需要添加任何前缀或标题。将内容格式化为HTML段落。`;

        const response = await openai.chat.completions.create({
          model: 'Qwen/Qwen2.5-7B-Instruct',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7
        });

        return response.choices[0]?.message?.content || '无法生成解读';
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
    请用<b></b>标签标记解读中的重点内容,以便更清晰地展示
    使用通俗易懂的语言,让人感到温暖、有启发性,并保持神秘感。
    只返回解读内容,不需要添加任何前缀或标题。将内容格式化为HTML段落。`;

    const overallResponse = await openai.chat.completions.create({
      model: 'Qwen/Qwen2.5-7B-Instruct',
      messages: [{ role: 'user', content: overallPrompt }],
      temperature: 0.7
    });

    overallInterpretation.value = overallResponse.choices[0]?.message?.content || '无法生成综合解读';
  } catch (error) {
    console.error('生成解读失败:', error);
    const { interpretations, overall } = fallbackInterpretation(props.selectedCards);
    interpretation.value = interpretations;
    overallInterpretation.value = overall;
  } finally {
    isLoading.value = false;
  }
};
const goBack = () => {
  emit('back');
};
</script>
