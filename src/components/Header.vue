<template>
  <div class="mx-auto flex w-full items-center justify-between px-1">
    <!-- Logo Section -->
    <div class="flex items-center space-x-2">
      <img src="../assets/head.svg" alt="Logo" class="h-5 w-5" />
      <span class="animate-bounce bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 bg-clip-text text-lg font-bold text-transparent"
        >塔罗耳语</span
      >
    </div>

    <!-- Navigation Links -->
    <div class="flex items-center justify-center">
      <nav class="flex items-center space-x-8 rounded-full border bg-white/30 px-5 py-1 shadow-lg backdrop-blur-md backdrop-filter">
        <router-link
          v-for="(link, index) in links"
          :key="index"
          :to="link.path"
          class="px-2 text-sm font-bold text-gray-700 transition-all duration-300 hover:text-black">
          {{ link.name }}
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
const links = [
  { path: '/', name: '首页' },
  { path: '/ai-tarot', name: 'AI塔罗占卜' },
  { path: '/yes-no-tarot', name: '是否塔罗占卜' },
  { path: '/blog', name: '博客' },
  { path: '/feedback', name: '问题反馈' }
];
</script>
