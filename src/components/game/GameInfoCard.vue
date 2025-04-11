<template>
  <div class="bg-white rounded-xl shadow-sm p-5">
    <h3 class="font-semibold text-gray-900 mb-4 flex items-center">
      <Icon icon="mdi:information" class="mr-2 text-blue-900" />
      Інформація
    </h3>

    <ul class="space-y-3">
      <GameInfoItem icon="mdi:calendar" title="Дата та час">
        {{ formatDate(game.scheduledTime, true) }}
      </GameInfoItem>

      <GameInfoItem icon="mdi:account-multiple" title="Гравці">
        @{{ game.player1Username }} vs @{{ game.player2Username }}
      </GameInfoItem>

      <GameInfoItem icon="mdi:flag" title="Статус">
        {{ getStatusText(game.status) }}
      </GameInfoItem>

      <GameInfoItem v-if="isCompleted" icon="mdi:trophy" title="Переможець">
        {{
          game.winnerId === game.player1Id ? game.player1Username : game.player2Username
        }}
      </GameInfoItem>

      <GameInfoItem
        v-if="isCompleted && game.score"
        icon="mdi:scoreboard"
        title="Рахунок"
      >
        {{ game.score }}
      </GameInfoItem>

      <GameInfoItem icon="mdi:clock-time-four" title="Створено" :isLast="true">
        {{ formatDate(game.createdAt) }}
      </GameInfoItem>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed } from "vue";
import { GameStatus } from "@/services/api";
import GameInfoItem from "./GameInfoItem.vue";
import { getStatusText } from "@/utils/utils";

const props = defineProps<{
  game: {
    _id: string;
    player1Id: string;
    player2Id: string;
    player1Username: string;
    player2Username: string;
    scheduledTime: string;
    status: GameStatus;
    score?: string;
    winnerId?: string;
    createdAt: string;
  };
}>();

const isCompleted = computed(() => props.game.status === GameStatus.COMPLETED);

const formatDate = (dateString: string | undefined, includeWeekday = false) => {
  if (!dateString) return "—";

  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  if (includeWeekday) {
    options.weekday = "long";
  }

  return date.toLocaleDateString("uk-UA", options);
};
</script>
