<script setup lang="ts">
import { ref, computed } from "vue";
import { GetTaroNameByid } from "../util";
const SelectedCard = ref<number[]>([]);

const isCardSelected = (index: number) => SelectedCard.value.includes(index);

const canSelectMore = computed(() => SelectedCard.value.length < 3);

const toggleCard = (index: number) => {
  if (isCardSelected(index)) {
    SelectedCard.value = SelectedCard.value.filter((i) => i !== index);
  } else if (canSelectMore.value) {
    SelectedCard.value.push(index);
    if (SelectedCard.value.length === 3) {
      emit("cardsSelected", SelectedCard.value);
    }
  }
};
const emit = defineEmits(["cardsSelected"]);
</script>

<template>
  <div class="card-container" tabindex="0">
    <div
      v-for="i in 9"
      :key="i"
      class="card"
      :class="{ selected: isCardSelected(i) }"
      :style="{ '--i': i - 5 }"
      @click="toggleCard(i)"
      tabindex="0"
    >
      <div class="card-front">
        {{ i }}
      </div>
      <div class="card-back">
        {{ GetTaroNameByid(i) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.card:nth-child(1) .card-front,
.card:nth-child(1) .card-back {
  background-color: #ff6b6b;
}
.card:nth-child(2) .card-front,
.card:nth-child(2) .card-back {
  background-color: #4ecdc4;
}
.card:nth-child(3) .card-front,
.card:nth-child(3) .card-back {
  background-color: #45b7d1;
}
.card:nth-child(4) .card-front,
.card:nth-child(4) .card-back {
  background-color: #ffa07a;
}
.card:nth-child(5) .card-front,
.card:nth-child(5) .card-back {
  background-color: #98d8c8;
}
.card:nth-child(6) .card-front,
.card:nth-child(6) .card-back {
  background-color: #f7dc6f;
}
.card:nth-child(7) .card-front,
.card:nth-child(7) .card-back {
  background-color: #bb8fce;
}
.card:nth-child(8) .card-front,
.card:nth-child(8) .card-back {
  background-color: #82e0aa;
}
.card:nth-child(9) .card-front,
.card:nth-child(9) .card-back {
  background-color: #f1948a;
}

.card-container {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  padding-top: 4rem;
  overflow: hidden;
  perspective: 1000px;
}

.card {
  position: absolute;
  width: 240px;
  height: 320px;
  border-radius: 8px;
  cursor: pointer;
  transform-style: preserve-3d;
  /* 启用3D转换 */
  transition: transform 0.5s;
  transform-origin: center center;
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  /* 隐藏背面 */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 8em;
  font-weight: 700;
  border-radius: 8px;
}

.card-front {
  color: rgba(0, 0, 0, 0.2);
}

.card-back {
  color: rgba(0, 0, 0, 0.8);
  transform: rotateY(180deg);
}

.card-container:hover .card:not(.selected),
.card-container:focus-within .card:not(.selected) {
  transform: rotate(calc(var(--i) * 5deg)) translate(calc(var(--i) * 120px));
}

.card.selected {
  transform: translateY(-50px) rotate(calc(var(--i) * 5deg))
    translate(calc(var(--i) * 120px)) rotateY(180deg);
  z-index: 100;
}

@media (max-width: 768px) {
  .card-container {
    flex-direction: column;
    align-items: center;
    padding-top: 2rem;
    height: auto;
  }

  .card {
    position: relative;
    width: 70vw;
    height: 40vw;
    transition: transform 0.5s, margin-bottom 0.5s;
    margin-bottom: -80px;
  }

  .card-front,
  .card-back {
    font-size: 10vw;
  }

  .card-container:hover .card:not(.selected),
  .card-container:focus-within .card:not(.selected) {
    transform: none;
  }

  .card-container:hover .card,
  .card-container:focus-within .card {
    margin-bottom: -50px;
  }

  .card.selected {
    transform: translateY(-20px) rotateY(180deg);
    z-index: 100;
    margin-bottom: 0;
  }
}
</style>
