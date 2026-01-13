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
              :card="selectedCards[i - 1]!"
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
        class="cursor-pointer rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-200"
        :disabled="selectedCards.length === 0">
        <RefreshCw class="mr-1 inline-block h-4 w-4" />
        重新选择
      </button>
      <button
        @click="confirmSelection"
        class="ml-4 cursor-pointer rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-200"
        :disabled="!isSelectionComplete || isShowAnswer">
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
// 使用网格布局算法来均匀分布卡牌
const getRandomPosition = (index: number, axis: 'x' | 'y') => {
  if (!width.value || !height.value) return 0;

  // 定义网格大小和边距
  const margin = 80; // 卡片边距
  const cardWidth = 144; // 卡片宽度近似值
  const cardHeight = 224; // 卡片高度近似值

  // 计算可用空间
  const availableWidth = width.value - margin * 2;
  const availableHeight = height.value - margin * 2;

  // 计算网格列数和行数 (动态计算基于容器尺寸)
  const cols = Math.max(3, Math.floor(availableWidth / cardWidth));
  const rows = Math.max(3, Math.floor(availableHeight / cardHeight));

  // 计算每个网格单元的大小
  const cellWidth = availableWidth / cols;
  const cellHeight = availableHeight / rows;

  // 将索引映射到网格位置
  const col = index % cols;
  const row = Math.floor(index / cols) % rows;

  // 计算基础位置 (网格中心)
  const baseX = margin + col * cellWidth + cellWidth / 2 - cardWidth / 2;
  const baseY = margin + row * cellHeight + cellHeight / 2 - cardHeight / 2;

  // 添加随机偏移量，但不要太大以避免重叠
  const seed = index * 1372 + (axis === 'x' ? 762 : 891);
  const random = Math.sin(seed) * 10000;
  const jitter = random - Math.floor(random);

  // 每个格子内的随机偏移量，但不超过单元格的1/3
  const offsetRange = axis === 'x' ? cellWidth / 3 : cellHeight / 3;
  const offset = jitter * offsetRange - offsetRange / 2;

  // 最终位置
  return axis === 'x' ? baseX + offset : baseY + offset;
};

const getRandomRotation = (index: number) => {
  // 同样基于索引生成随机旋转角度
  const seed = index * 845;
  const random = Math.cos(seed) * 10000;
  return (random - Math.floor(random)) * 30 - 15;
};

const resetSelection = () => {
  selectedCards.value = [];
  isShowAnswer.value = false;
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
