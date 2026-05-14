<template>
  <div class="auth-page">
    <div class="auth-card glass">
      <div class="auth-header">
        <h1 class="gradient-text">Zaloguj się</h1>
        <p>Witaj z powrotem w Spocik</p>
      </div>

      <form class="auth-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label" for="login-username">Nazwa użytkownika</label>
          <input
            id="login-username"
            v-model="username"
            class="form-input"
            type="text"
            placeholder="Twoja nazwa..."
            autocomplete="username"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="login-password">Hasło</label>
          <input
            id="login-password"
            v-model="password"
            class="form-input"
            type="password"
            placeholder="••••••••"
            autocomplete="current-password"
            required
          />
        </div>

        <p v-if="errorMsg" class="form-error">{{ errorMsg }}</p>

        <button type="submit" class="btn btn-primary btn-lg full-width" :disabled="loading">
          <span v-if="loading" class="spinner" style="width:16px;height:16px;border-width:2px;"></span>
          {{ loading ? 'Logowanie...' : 'Zaloguj się' }}
        </button>
      </form>

      <p class="auth-switch">
        Nie masz konta?
        <NuxtLink to="/register">Zarejestruj się</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { login } = useAuth()
const toast = useToast()

const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  errorMsg.value = ''
  loading.value = true
  try {
    await login(username.value, password.value)
    toast.success('Zalogowano pomyślnie!')
    navigateTo('/')
  } catch (err: any) {
    const detail = err?.data?.error || err?.message || 'Nieprawidłowy login lub hasło'
    errorMsg.value = detail
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 96px);
  padding: 24px;
}

.auth-card {
  width: 100%;
  max-width: 440px;
  padding: 40px;
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-header h1 {
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 8px;
}

.auth-header p {
  font-size: 0.9375rem;
  color: var(--text-secondary);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.full-width {
  width: 100%;
}

.auth-switch {
  text-align: center;
  margin-top: 24px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.auth-switch a {
  font-weight: 600;
}
</style>
