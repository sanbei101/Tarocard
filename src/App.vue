<script setup lang="ts">
import { ref } from 'vue';
import { NFlex, NGradientText, NConfigProvider, NGlobalStyle, darkTheme, NSelect, NInput, NButton, NP, } from 'naive-ui';
import OpenAI from 'openai';
import Card from './components/card.vue';
const options = [
  { label: '单张牌占卜', value: 1 },
  { label: '三张牌占卜', value: 3 }
];

const myoption = ref<number>();
const myinput = ref<string>();
const answer = ref<string>('');
const loading = ref<boolean>(false);

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-e81ac3b4aba54fdf87847476d5298752',

  //开发环境允许直接使用密钥
  dangerouslyAllowBrowser: true

});

const getAIResponse = async () => {
  if (!myinput.value) {
    return;
  }

  loading.value = true;
  answer.value = '';

  try {
    const stream = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: '你需要根据用户的输入,从塔罗牌中随即抽取一张牌,再给出能与不能的预测,注意你的语气必须符合一名塔罗牌预测大师的口吻,且必须给出能或者不能的答案,不能模棱两可' },
        { role: 'user', content: myinput.value }
      ],
      stream: true
    });

    for await (const chunk of stream) {
      if (chunk.choices[0]?.delta?.content) {
        answer.value += chunk.choices[0].delta.content;
      }
    }
  } catch (error) {
    console.error('Error fetching response from DeepSeek:' + error);
  } finally {
    loading.value = false;
  }
}

const selectedCards = ref<number[]>([]);

const handleCardsSelected = (selected: number[]) => {
  selectedCards.value = selected;
  console.log('选中的三张牌是', selected);
};

</script>

<template>
  <n-config-provider :theme="darkTheme">
    <n-global-style />
    <n-flex vertical class="container">
      <n-gradient-text type="info" :size="32" style="font-weight: bolder;">
        是否塔罗牌
      </n-gradient-text>

      <n-select v-model:value="myoption" placeholder="请选择" :options="options" />
      <n-input v-model:value="myinput" placeholder="请输入一个可以用 是 或者 不是 回答的问题" />

      <n-button :loading="loading" type="primary" @click="getAIResponse">
        提交问题
      </n-button>

      <Card @cardsSelected="handleCardsSelected" />

      <n-p v-if="answer" class="answer">
        {{ answer }}
      </n-p>
    </n-flex>

  </n-config-provider>
</template>

<style scoped>
.container {
  margin: 1rem auto;
  max-width: 96%;
  height: 100vh;
  align-items: center;
}

.answer {
  align-self: flex-start;
  margin-top: 1rem;
  text-align: left;
  text-indent: 2em;
}
</style>