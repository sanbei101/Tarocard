import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
  const userQuestion = ref<string>('');

  return {
    userQuestion
  };
});
