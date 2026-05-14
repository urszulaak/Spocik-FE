<template>
  <div class="app-layout">
    <AppHeader />
    <main class="app-main">
      <slot />
    </main>
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
const { restoreSession } = useAuth()

// Restore auth session from cookie on app startup
onMounted(async () => {
  await restoreSession()
})
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  padding-top: 32px;
  padding-bottom: 64px;
}
</style>
