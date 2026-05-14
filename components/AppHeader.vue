<template>
  <header class="app-header glass">
    <div class="header-inner container">
      <NuxtLink to="/" class="logo">
        <span class="logo-icon">📅</span>
        <span class="logo-text gradient-text">Spocik</span>
      </NuxtLink>

      <nav class="header-nav">
        <template v-if="isLoggedIn">
          <div class="user-info">
            <span class="user-name">{{ user?.username }}</span>
            <span v-if="isAdmin" class="badge badge-admin">Admin</span>
          </div>
          <button class="btn btn-ghost btn-sm" @click="logout">
            🚪 Wyloguj
          </button>
        </template>
        <template v-else>
          <NuxtLink to="/login" class="btn btn-ghost btn-sm">Zaloguj się</NuxtLink>
          <NuxtLink to="/register" class="btn btn-primary btn-sm">Rejestracja</NuxtLink>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const { user, isLoggedIn, isAdmin, logout } = useAuth()
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 50;
  border-radius: 0;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid var(--border-glass);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  font-size: 1.375rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}
</style>
