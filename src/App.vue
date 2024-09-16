<script setup lang="ts">
import { ref } from 'vue';
import { NFlex, NGradientText, NConfigProvider, NGlobalStyle, darkTheme, NInput, NButton, NModal } from 'naive-ui';
import OpenAI from 'openai';
import Card from './components/card.vue';
import { GetTaroCardByid, TaroCard } from './util.ts'
const myinput = ref<string>();
const answer = ref<string>('');
const loading = ref<boolean>(false);

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-e81ac3b4aba54fdf87847476d5298752',
  dangerouslyAllowBrowser: true
});

const ShowCard = ref<boolean>(false);
const showModal = ref<boolean>(false);
const selectedCards = ref<TaroCard[]>([]);

const handleCardsSelected = (selected: number[]) => {
  selectedCards.value = GetTaroCardByid(selected);
  getAIResponse();
};

const getAIResponse = async () => {
  if (!myinput.value) {
    return;
  }
  ShowCard.value = true;

  loading.value = true;
  answer.value = '';

  showModal.value = true;
  const SystemPrompt: string = `你是一个顶级的塔罗牌预测大师,现在一个用户重金聘请你为他解答人生中的一个问题,于是你让他抽取了三张塔罗牌,请你根据这三张牌的寓意,给出一个能或者不能的预测,注意你的语气必须符合一名塔罗牌预测大师的口吻,且必须给出能或者不能的答案,不能模棱两可`;
  const FirstCardPrompt: string = `我抽到的第一张塔罗牌是${selectedCards.value[0].name},他的寓意是${selectedCards.value[0].mean};`;

  const SecondCardPrompt: string = `我抽到的第二张塔罗牌是${selectedCards.value[1].name},他的寓意是${selectedCards.value[1].mean};`;

  const ThirdCardPrompt: string = `我抽到的第三张塔罗牌是${selectedCards.value[2].name},他的寓意是${selectedCards.value[2].mean};`;
  const AllPrompt: string = `${FirstCardPrompt}${SecondCardPrompt}${ThirdCardPrompt}`;
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
    console.error('Error fetching response from DeepSeek:' + error);
  } finally {
    loading.value = false;
  }
}


</script>

<template>
  <n-config-provider :theme="darkTheme">
    <n-global-style />
    <n-flex vertical class="container">
      <n-gradient-text type="info" :size="32" style="font-weight: bolder;">
        是否塔罗牌
      </n-gradient-text>

      <n-input v-model:value="myinput" placeholder="请输入一个可以用 是 或者 不是 回答的问题" style="max-width: 60%;" />

      <n-button :loading="loading" type="primary" @click="() => { ShowCard = true; }">
        提交问题
      </n-button>

      <Card @cardsSelected="handleCardsSelected" v-show="ShowCard" />

      <n-modal v-model:show="showModal" preset="card" title="塔罗师说:" size="huge" style="max-width: 60%;"
        :on-after-leave="() => loading = false">
        <p class="taroAnswer" style="text-indent: 2em;font-weight:400; "> {{ answer }}</p>
        <template #header-extra>
          继续出发吧!
        </template>
      </n-modal>

    </n-flex>

  </n-config-provider>
</template>

<style scoped>
.container {
  margin: 1rem auto;
  max-width: 90%;
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