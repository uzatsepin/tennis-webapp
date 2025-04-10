<template>
  <div class="text-center mx-3 py-4 px-1">
    <div v-if="isCompleted && score" class="mb-2">
      <div class="text-4xl font-bold text-gray-900">
        {{ scoreData.player1 }} : {{ scoreData.player2 }}
      </div>
      <p class="text-xs text-gray-500 mt-1">Рахунок</p>
    </div>
    <div v-else class="text-gray-500 text-lg font-medium">vs</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { GameStatus } from "@/services/api";

const props = defineProps<{
  status: GameStatus;
  score?: string;
}>();

const isCompleted = computed(() => props.status === GameStatus.COMPLETED);

const scoreData = computed(() => {
  if (!props.score) {
    return { player1: "0", player2: "0" };
  }

  const [score1, score2] = props.score.split(":");
  return {
    player1: score1.trim(),
    player2: score2.trim(),
  };
});
</script>
