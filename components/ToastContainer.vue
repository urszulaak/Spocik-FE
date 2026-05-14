<template>
  <div class="toast-container">
    <TransitionGroup name="fade-slide">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="toast"
        :class="t.type === 'success' ? 'toast-success' : 'toast-error'"
      >
        {{ t.type === 'success' ? '✅' : '❌' }} {{ t.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
const { toasts } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
