<script setup lang="ts">
import { ref } from 'vue';
import { Search, ChevronDown, Moon, Sun, User, Crown } from 'lucide-vue-next';
import { computed } from 'vue';
const questionInput = ref<string>('');
const charCount = computed(() => questionInput.value.length);
const maxChars = 300;
const sampleQuestions = [
  { icon: '🔍', text: '这段缘分是未完待续...还是终将散场?' },
  { icon: '✨', text: 'Ta心底是否藏着一个「秘密答案」？' },
  { icon: '💜', text: '谁会先打破沉默? 72小时内的转机' },
  { icon: '✨', text: '三个月内，我的事业将折点会出现在哪个方向?' }
];

const isDarkMode = ref(false);
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
};
</script>

<template>
  <div class="min-h-screen dark:bg-gray-900">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <header class="mb-12 flex items-center justify-between py-4">
        <div class="flex items-center">
          <button class="flex items-center text-lg font-bold"><span class="mr-1 text-xl">◉</span> CAU-Tarotap</button>
        </div>

        <nav class="hidden items-center space-x-4 rounded-full bg-gray-50 p-2 font-bold md:flex">
          <a href="#" class="flex items-center px-3 py-2 dark:bg-gray-800">
            <Crown class="mr-1 h-4 w-4 text-yellow-500" />
            <span class="text-sm">会员订阅</span>
          </a>
          <a href="#" class="px-3 py-2">AI塔罗占卜</a>
          <a href="#" class="px-3 py-2">塔古塔罗占卜</a>
          <div class="group relative">
            <button class="flex items-center px-3 py-2">
              塔罗运势
              <ChevronDown class="ml-1 h-4 w-4" />
            </button>
          </div>
          <div class="group relative">
            <button class="flex items-center px-3 py-2">
              学习
              <ChevronDown class="ml-1 h-4 w-4" />
            </button>
          </div>
          <a href="#" class="px-3 py-2">问题反馈</a>
          <a href="#" class="px-3 py-2">真人塔罗占卜</a>
        </nav>

        <div class="flex items-center space-x-4">
          <button @click="toggleDarkMode" class="cursor-pointer rounded-full p-2">
            <Moon v-if="!isDarkMode" class="h-5 w-5" />
            <Sun v-else class="h-5 w-5" />
          </button>
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-400 to-pink-500 text-white">
            <User class="h-5 w-5" />
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex flex-col items-center py-12">
        <div class="mx-auto mb-6 max-w-2xl text-center">
          <h1 class="mb-3 text-5xl font-bold">
            <span class="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"> 输入您的 </span>
            <div class="text-black dark:text-white">塔罗牌问题</div>
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-400">您想占卜什么问题？</p>
        </div>

        <!-- Question Input -->
        <div class="mx-auto mb-8 w-full max-w-4xl">
          <div class="relative">
            <textarea
              v-model="questionInput"
              placeholder="输入您想占卜的问题"
              class="h-32 w-full rounded-lg bg-gray-100 p-4 pr-10 transition-colors duration-500 outline-none hover:bg-gray-200"
              :maxlength="maxChars"></textarea>
            <button class="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-gray-600">
              <Search class="h-6 w-6" />
            </button>
            <div class="absolute bottom-4 left-4 text-sm text-gray-500">{{ charCount }}/{{ maxChars }}</div>
          </div>
        </div>

        <!-- Sample Questions -->
        <div class="mx-auto grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
          <div
            v-for="(question, index) in sampleQuestions"
            :key="index"
            @click="questionInput = question.text"
            class="cursor-pointer rounded-lg bg-gray-100 p-4 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
            <div class="flex items-center space-x-2">
              <span class="text-lg">{{ question.icon }}</span>
              <span class="text-sm text-gray-800 dark:text-gray-300">{{ question.text }}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.dark {
  color-scheme: dark;
}
</style>
