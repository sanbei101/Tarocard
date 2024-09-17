<script setup lang="ts">
import { ref } from 'vue';
import { NGradientText, NConfigProvider, NGlobalStyle, darkTheme, NInput, NButton, NModal } from 'naive-ui';
import OpenAI from 'openai';
import Card from './components/card.vue';
import { GetTaroCardByid, TaroCard, SystemPrompt } from './util.ts'
const apikey: string = import.meta.env.VITE_API_SECRET;
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: apikey,
  dangerouslyAllowBrowser: true
});

const MyInput = ref<string>('');
const answer = ref<string>('');
const loading = ref<boolean>(false);
const ShowCard = ref<boolean>(false);
const showModal = ref<boolean>(false);
const selectedCards = ref<TaroCard[]>([]);

const handleCardsSelected = (selected: number[]) => {
  selectedCards.value = GetTaroCardByid(selected);
  getAIResponse();
};

const getAIResponse = async () => {
  if (!MyInput.value) {
    return;
  }
  loading.value = true;
  answer.value = '';
  showModal.value = true;
  const FirstCardPrompt: string = `我抽到的第一张塔罗牌是${selectedCards.value[0].name},他的寓意是${selectedCards.value[0].mean};`;
  const SecondCardPrompt: string = `我抽到的第二张塔罗牌是${selectedCards.value[1].name},他的寓意是${selectedCards.value[1].mean};`;
  const ThirdCardPrompt: string = `我抽到的第三张塔罗牌是${selectedCards.value[2].name},他的寓意是${selectedCards.value[2].mean};`;
  const AllPrompt: string = `${FirstCardPrompt}${SecondCardPrompt}${ThirdCardPrompt},问题是:${MyInput.value}`;
  try {
    const stream = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SystemPrompt },
        { role: 'user', content: AllPrompt }
      ],
      stream: true
    });

    for await (const chunk of stream) {
      if (chunk.choices[0]?.delta?.content) {
        answer.value += chunk.choices[0].delta.content;
      }
    }
  } catch (error) {
    console.error('获取AI回答失败' + error);
  } finally {
    loading.value = false;
  }
}


</script>

<template>
  <n-config-provider :theme="darkTheme">
    <n-global-style />
    <div class="container">
      <n-gradient-text type="info" :size="32" style="font-weight: bolder;">
        CAU塔罗牌魔法屋
      </n-gradient-text>

      <n-input v-model:value="MyInput" placeholder="接受指引吧" style="max-width: 60%;" />

      <n-button :loading="loading" type="primary" @click="() => { ShowCard = true; }">
        提交问题
      </n-button>

      <Card @cardsSelected="handleCardsSelected" v-show="ShowCard" />
    </div>

    <n-modal v-model:show="showModal" preset="card" title="塔罗师说:" size="huge" style="max-width: 60%;"
      :on-after-leave="() => { loading = false; }">
      <p class="taroAnswer" style="text-indent: 2em;font-weight:400; "> {{ answer }}</p>
      <template #header-extra>
        继续出发吧!
      </template>
    </n-modal>

  </n-config-provider>
</template>

<style scoped>
.container {
  margin: 1rem auto;
  max-width: 90%;
  height: 100vh;
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>