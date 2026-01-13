<template>
  <div
    class="transition-all duration-300"
    :class="[
      selected ? 'z-10 -translate-y-10 transform' : `z-${zIndex}`,
      disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:shadow-lg'
    ]"
    @click="handleClick">
    <div
      class="card-inner flex h-56 w-36 items-center justify-center rounded-lg shadow-md"
      :class="[selected ? 'border-2 border-indigo-500 bg-indigo-100' : 'bg-purple-900']">
      <transition name="fade-flip" mode="out-in">
        <div v-if="selected" key="front" class="card-front text-center">
          <h3 class="text-lg font-bold text-indigo-800">{{ card.name }}</h3>
          <div class="mt-2">
            <component :is="card.image" class="mx-auto h-24 w-24 object-contain" />
          </div>
        </div>
        <div v-else key="back" class="card-back">
          <div class="flex h-full items-center justify-center">
            <StarIcon class="h-10 w-10 text-yellow-400" />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Star as StarIcon } from 'lucide-vue-next';
import type { TaroCard } from '@/utils/const';

const props = defineProps<{
  card: TaroCard;
  zIndex: number;
  selected: boolean;
  disabled: boolean;
}>();

const emit = defineEmits<{
  select: [card: TaroCard];
}>();
const handleClick = () => {
  if (!props.disabled) {
    emit('select', props.card);
  }
};
</script>

<style scoped>
/* 定义 fade-flip 动画效果 */
.fade-flip-enter-active,
.fade-flip-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}
.fade-flip-enter-from,
.fade-flip-leave-to {
  opacity: 0;
  transform: rotateY(90deg);
}
.fade-flip-leave-from,
.fade-flip-enter-to {
  opacity: 1;
  transform: rotateY(0deg);
}
</style>
