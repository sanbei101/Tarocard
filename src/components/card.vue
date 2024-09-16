<script setup lang="ts">
import { ref, computed } from 'vue';
import { GetTaroNameByid } from '../util';
const SelectedCard = ref<number[]>([]);

const isCardSelected = (index: number) => SelectedCard.value.includes(index);

const canSelectMore = computed(() => SelectedCard.value.length < 3);

const toggleCard = (index: number) => {
    if (isCardSelected(index)) {
        SelectedCard.value = SelectedCard.value.filter(i => i !== index);
    } else if (canSelectMore.value) {
        SelectedCard.value.push(index);
        if (SelectedCard.value.length === 3) {
            emit('cardsSelected', SelectedCard.value);
        }
    }
};
const emit = defineEmits(['cardsSelected']);
</script>

<template>
    <div class="card-container" tabindex="0">
        <div v-for="i in 9" :key="i" class="card" :class="{ 'selected': isCardSelected(i) }" :style="{ '--i': i - 5 }"
            @click="toggleCard(i)" tabindex="0">
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
    background: plum;
    color: rgba(0, 0, 0, 0.2);
}

.card-back {
    background: lightpink;
    color: rgba(0, 0, 0, 0.8);
    transform: rotateY(180deg);
}

.card-container:hover .card:not(.selected),
.card-container:focus-within .card:not(.selected) {
    transform: rotate(calc(var(--i)*5deg)) translate(calc(var(--i)*120px));
}

.card.selected {
    transform: translateY(-50px) rotate(calc(var(--i)*5deg)) translate(calc(var(--i)*120px)) rotateY(180deg);
    z-index: 100;
}
</style>
