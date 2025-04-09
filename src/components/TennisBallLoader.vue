<template>
  <div
    class="tennis-ball-loader"
    :class="{ small: size === 'small', large: size === 'large' }"
  >
    <div class="tennis-ball">
      <div class="ball-lines"></div>
    </div>
    <div v-if="showText" class="loading-text">{{ text }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  size: {
    type: String,
    default: "medium", // 'small', 'medium', 'large'
    validator: (value: string) => ["small", "medium", "large"].includes(value),
  },
  showText: {
    type: Boolean,
    default: true,
  },
  text: {
    type: String,
    default: "Завантаження...",
  },
});
</script>

<style scoped>
.tennis-ball-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.tennis-ball {
  position: relative;
  width: 50px;
  height: 50px;
  background: linear-gradient(to bottom, #c3f21e 0%, #a2d804 100%);
  border-radius: 50%;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  animation: bounce 1s ease-in-out infinite alternate;
  margin-bottom: 1rem;
}

.ball-lines {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
}

.ball-lines::before,
.ball-lines::after {
  content: "";
  position: absolute;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
}

.ball-lines::before {
  width: 80%;
  height: 80%;
  top: -40%;
  left: -40%;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.ball-lines::after {
  width: 60%;
  height: 60%;
  bottom: -30%;
  right: -30%;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.loading-text {
  font-size: 0.9rem;
  color: #4a5568;
  font-weight: 500;
  margin-top: 0.5rem;
}

@keyframes bounce {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
  100% {
    transform: translateY(0) rotate(360deg);
  }
}

.small .tennis-ball {
  width: 30px;
  height: 30px;
  margin-bottom: 0.5rem;
}

.small .loading-text {
  font-size: 0.8rem;
}

.large .tennis-ball {
  width: 70px;
  height: 70px;
  margin-bottom: 1.5rem;
}

.large .loading-text {
  font-size: 1rem;
}
</style>
