<template>
  <div class="mt-16 flex flex-col items-center px-4">
    <div class="flex flex-col gap-y-4 text-center">
      <h1 class="flex flex-col font-bold tracking-tight">
        <span class="text-3xl text-gray-800 sm:text-4xl md:text-5xl">免费在线</span>
        <div class="mt-2 space-x-0 text-4xl sm:text-5xl md:text-6xl">
          <span class="animate-gradient bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
            AI塔罗牌
          </span>
          <span class="text-gray-900 sm:text-5xl md:text-6xl">占卜</span>
        </div>
      </h1>
    </div>
  </div>
</template>

<style scoped>
.animate-gradient {
  background-size: 200%;
  animation: gradient 8s linear infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
