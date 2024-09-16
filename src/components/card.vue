<script setup lang="ts">
import { ref, computed } from 'vue';

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
            {{ i }}
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
    align-items: center;
    overflow: hidden;
}

.card {
    position: absolute;
    width: 240px;
    height: 320px;
    background: plum;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(0, 0, 0, 0.2);
    font-size: 8em;
    font-weight: 700;
    cursor: pointer;
    transition: 0.5s;
    transform-origin: 50% 100%;
}

.card-container:hover .card:not(.selected),
.card-container:focus-within .card:not(.selected) {
    transform: rotate(calc(var(--i)*5deg)) translate(calc(var(--i)*120px));
    color: rgba(0, 0, 0, 0.25);
}

.card.selected {
    transform: translateY(-50px) rotate(calc(var(--i)*5deg)) translate(calc(var(--i)*120px));
    z-index: 100;
    color: rgba(0, 0, 0, 0.8);
}
</style>