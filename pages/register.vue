<template>
  <div class="auth-page">
    <div class="auth-card glass">
      <div class="auth-header">
        <h1 class="gradient-text">Rejestracja</h1>
        <p>Utwórz konto w Spocik</p>
      </div>

      <form class="auth-form" @submit.prevent="handleRegister">
        <div class="form-group">
          <label class="form-label" for="reg-username">Nazwa użytkownika</label>
          <input
            id="reg-username"
            v-model="username"
            class="form-input"
            type="text"
            placeholder="Wybierz nazwę..."
            autocomplete="username"
            required
            minlength="3"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="reg-password">Hasło</label>
          <input
            id="reg-password"
            v-model="password"
            class="form-input"
            type="password"
            placeholder="••••••••"
            autocomplete="new-password"
            required
            minlength="4"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="reg-password-confirm">Powtórz hasło</label>
          <input
            id="reg-password-confirm"
            v-model="passwordConfirm"
            class="form-input"
            type="password"
            placeholder="••••••••"
            autocomplete="new-password"
            required
          />
        </div>

        <p v-if="errorMsg" class="form-error">{{ errorMsg }}</p>

        <button type="submit" class="btn btn-primary btn-lg full-width" :disabled="loading">
          <span v-if="loading" class="spinner" style="width:16px;height:16px;border-width:2px;"></span>
          {{ loading ? 'Tworzenie konta...' : 'Zarejestruj się' }}
        </button>
      </form>

      <p class="auth-switch">
        Masz już konto?
        <NuxtLink to="/login">Zaloguj się</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { register } = useAuth()
const toast = useToast()

const username = ref('')
const password = ref('')
const passwordConfirm = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function handleRegister() {
  errorMsg.value = ''

  if (password.value !== passwordConfirm.value) {
    errorMsg.value = 'Hasła nie są identyczne'
    return
  }

  loading.value = true
  try {
    await register(username.value, password.value)
    toast.success('Konto utworzone! Zalogowano automatycznie.')
    navigateTo('/')
  } catch (err: any) {
    const detail = err?.data?.error || err?.message || 'Nie udało się utworzyć konta'
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
