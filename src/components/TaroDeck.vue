<template>
  <div class="flex flex-col items-center">
    <h1 class="mb-6 text-2xl font-bold text-indigo-800">选择五张塔罗牌</h1>
    <div class="relative mb-10 h-120 w-full max-w-4xl overflow-auto" ref="deckContainer">
      <Card
        v-for="(card, index) in taroCards"
        :key="card.id"
        :card="card"
        :z-index="index"
        :selected="selectedCards.some((c) => c.id === card.id)"
        :disabled="isSelectionComplete && !selectedCards.some((c) => c.id === card.id)"
        @select="selectCard"
        :style="{
          position: 'absolute',
          left: `${getRandomPosition(index, 'x')}px`,
          top: `${getRandomPosition(index, 'y')}px`,
          transform: `rotate(${getRandomRotation(index)}deg)`
        }" />
    </div>

    <div class="mt-10 mb-8 flex w-full gap-x-2 overflow-x-auto px-4 sm:justify-center sm:gap-x-4">
      <div
        v-for="i in 5"
        :key="i"
        class="flex h-56 min-w-36 items-center justify-center rounded-lg border-2 border-dashed border-indigo-300">
        <Transition name="fade-flip" mode="out-in">
          <div v-if="selectedCards[i - 1]">
            <Card
              :card="selectedCards[i - 1]"
              :z-index="1"
              :selected="true"
              :disabled="false"
              @select="selectCard"
              class="translate-y-0 transform" />
          </div>
          <span v-else class="text-indigo-300">牌 #{{ i }}</span>
        </Transition>
      </div>
    </div>

    <div>
      <button
        @click="resetSelection"
        class="cursor-pointer rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        :disabled="selectedCards.length === 0">
        <RefreshCw class="mr-1 inline-block h-4 w-4" />
        重新选择
      </button>
      <button
        @click="confirmSelection"
        class="ml-4 cursor-pointer rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        :disabled="!isSelectionComplete">
        <Check class="mr-1 inline-block h-4 w-4" />
        确认选择
      </button>
    </div>

    <Answer v-if="isShowAnswer" :selectedCards="selectedCards" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useTemplateRef } from 'vue';
import Card from '@/components/Card.vue';
import Answer from '@/components/Answer.vue';
import type { TaroCard } from '@/utils/const';
import { RefreshCw, Check } from 'lucide-vue-next';
import { taroCards } from '@/utils/const';
import { useElementSize } from '@vueuse/core';

const deckContainer = useTemplateRef('deckContainer');

const MaxSelection = 5;

const selectedCards = ref<TaroCard[]>([]);
const isSelectionComplete = computed(() => selectedCards.value.length === MaxSelection);
const isShowAnswer = ref(false);

const selectCard = (card: TaroCard) => {
  if (selectedCards.value.some((c) => c.id === card.id)) {
    // 取消选择
    selectedCards.value = selectedCards.value.filter((c) => c.id !== card.id);
  } else if (selectedCards.value.length < 5) {
    // 添加选择
    selectedCards.value.push(card);
  }
};

const { width, height } = useElementSize(deckContainer);
const getRandomPosition = (index: number, axis: 'x' | 'y') => {
  if (!width || !height) return 0;

  // 使用索引确保每次位置一致，同时添加一些随机性
  const seed = index * 1372 + (axis === 'x' ? 762 : 891);
  const random = Math.sin(seed) * 10000;

  // 根据容器大小动态调整范围
  const base = 50; // 边距
  const range = axis === 'x' ? width.value - base : height.value - base; // 减去边距

  return base + (random - Math.floor(random)) * range;
};

const getRandomRotation = (index: number) => {
  // 同样基于索引生成随机旋转角度
  const seed = index * 845;
  const random = Math.cos(seed) * 10000;
  return (random - Math.floor(random)) * 30 - 15;
};

const resetSelection = () => {
  selectedCards.value = [];
};

const confirmSelection = () => {
  if (isSelectionComplete.value) {
    isShowAnswer.value = true;
  }
};
</script>

<style scoped>
/* 定义 fade-slide 动画效果 */
.fade-flip-enter-active,
.fade-flip-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}
.fade-flip-enter-from,
.fade-flip-leave-to {
  opacity: 0;
  transform: translateY(20px); /* 从下方开始 */
}
.fade-flip-leave-from,
.fade-flip-enter-to {
  opacity: 1;
  transform: translateY(0); /* 到原始位置 */
}
</style>
