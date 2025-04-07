<template>
  <div class="flex flex-col items-center">
    <h1 class="mb-6 text-2xl font-bold text-indigo-800">选择五张塔罗牌</h1>

    <div class="relative mb-10 h-96 w-full max-w-4xl overflow-auto">
      <card
        v-for="(card, index) in tarotCards"
        :key="card.id"
        :card="card"
        :z-index="index"
        :selected="selectedCards.some((c) => c.id === card.id)"
        :disabled="isSelectionComplete && !selectedCards.some((c) => c.id === card.id)"
        :revealed="false"
        @select="selectCard"
        :style="{
          position: 'absolute',
          left: `${getRandomPosition(index, 'x')}px`,
          top: `${getRandomPosition(index, 'y')}px`,
          transform: `rotate(${getRandomRotation(index)}deg)`
        }" />
    </div>

    <div class="selected-cards mt-10 mb-8 flex gap-4">
      <div v-for="i in 5" :key="i" class="flex h-56 w-36 items-center justify-center rounded-lg border-2 border-dashed border-indigo-300">
        <Transition name="fade-flip" mode="out-in">
          <div v-if="selectedCards[i - 1]">
            <card
              :card="selectedCards[i - 1]"
              :z-index="1"
              :selected="true"
              :disabled="false"
              :revealed="true"
              @select="() => {}"
              class="translate-y-0 transform" />
          </div>
          <span v-else class="text-indigo-300">牌 #{{ i }}</span>
        </Transition>
      </div>
    </div>

    <div>
      <button
        @click="resetSelection"
        class="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        :disabled="selectedCards.length === 0">
        <RefreshCw class="mr-1 inline-block h-4 w-4" />
        重新选择
      </button>
      <button
        @click="confirmSelection"
        class="ml-4 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        :disabled="!isSelectionComplete">
        <Check class="mr-1 inline-block h-4 w-4" />
        确认选择
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Card from './Card.vue';
import { RefreshCw, Check } from 'lucide-vue-next';

const MaxSelection = 5;
interface TarotCard {
  id: number;
  name: string;
  image: string;
  meaning?: string;
}

// 模拟塔罗牌数据
const tarotCards = ref<TarotCard[]>([
  { id: 1, name: '愚者', image: '/images/fool.jpg' },
  { id: 2, name: '魔术师', image: '/images/magician.jpg' },
  { id: 3, name: '女祭司', image: '/images/priestess.jpg' },
  { id: 4, name: '女皇', image: '/images/empress.jpg' },
  { id: 5, name: '皇帝', image: '/images/emperor.jpg' },
  { id: 6, name: '教皇', image: '/images/hierophant.jpg' },
  { id: 7, name: '恋人', image: '/images/lovers.jpg' },
  { id: 8, name: '战车', image: '/images/chariot.jpg' },
  { id: 9, name: '力量', image: '/images/strength.jpg' },
  { id: 10, name: '隐士', image: '/images/hermit.jpg' },
  { id: 11, name: '命运之轮', image: '/images/wheel.jpg' },
  { id: 12, name: '正义', image: '/images/justice.jpg' },
  { id: 13, name: '吊人', image: '/images/hanged.jpg' },
  { id: 14, name: '死神', image: '/images/death.jpg' },
  { id: 15, name: '节制', image: '/images/temperance.jpg' },
  { id: 16, name: '恶魔', image: '/images/devil.jpg' },
  { id: 17, name: '塔', image: '/images/tower.jpg' },
  { id: 18, name: '星星', image: '/images/star.jpg' },
  { id: 19, name: '月亮', image: '/images/moon.jpg' },
  { id: 20, name: '太阳', image: '/images/sun.jpg' },
  { id: 21, name: '审判', image: '/images/judgement.jpg' },
  { id: 22, name: '世界', image: '/images/world.jpg' }
]);

const selectedCards = ref<TarotCard[]>([]);
const isSelectionComplete = computed(() => selectedCards.value.length === MaxSelection);

const selectCard = (card: TarotCard) => {
  if (selectedCards.value.some((c) => c.id === card.id)) {
    // 取消选择
    selectedCards.value = selectedCards.value.filter((c) => c.id !== card.id);
  } else if (selectedCards.value.length < 5) {
    // 添加选择
    selectedCards.value.push(card);
  }
};

const getRandomPosition = (index: number, axis: 'x' | 'y') => {
  // 使用索引确保每次位置一致，同时添加一些随机性
  const seed = index * 1372 + (axis === 'x' ? 762 : 891);
  const random = Math.sin(seed) * 10000;
  const range = axis === 'x' ? 300 : 150;
  const base = axis === 'x' ? 150 : 50;
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
    alert(`你选择的塔罗牌: ${selectedCards.value.map((c) => c.name).join(', ')}`);
    // 在实际应用中，这里可以发送选择结果到后端或进行其他操作
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
