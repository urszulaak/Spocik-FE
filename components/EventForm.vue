<template>
  <form class="event-form" @submit.prevent="handleSubmit">
    <div class="form-group">
      <label class="form-label" for="event-name">Nazwa wydarzenia</label>
      <input
        id="event-name"
        v-model="form.name"
        class="form-input"
        type="text"
        placeholder="np. Festiwal Muzyczny"
        required
      />
    </div>

    <div class="form-group">
      <label class="form-label" for="event-type">Typ wydarzenia</label>
      <select id="event-type" v-model="form.type" class="form-select" required>
        <option value="" disabled>Wybierz typ...</option>
        <option value="Koncert">Koncert</option>
        <option value="Sport">Sport</option>
        <option value="Kultura">Kultura</option>
        <option value="Edukacja">Edukacja</option>
        <option value="Inne">Inne</option>
      </select>
    </div>

    <div class="form-group">
      <label class="form-label" for="event-date">Data wydarzenia</label>
      <input
        id="event-date"
        v-model="form.date"
        class="form-input"
        type="date"
        required
      />
    </div>

    <div class="form-group">
      <label class="form-label" for="event-desc">Opis wydarzenia</label>
      <textarea
        id="event-desc"
        v-model="form.description"
        class="form-textarea"
        placeholder="Opis wydarzenia (opcjonalny)..."
        rows="4"
      ></textarea>
    </div>

    <div class="form-actions">
      <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
        Anuluj
      </button>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        <span v-if="loading" class="spinner" style="width:16px;height:16px;border-width:2px;"></span>
        {{ isEdit ? 'Zapisz zmiany' : 'Dodaj wydarzenie' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { EventItem } from '~/types'

const props = defineProps<{
  editEvent?: EventItem | null
}>()

const emit = defineEmits<{
  submit: [data: { name: string; type: string; date: string; description?: string }]
  cancel: []
}>()

const isEdit = computed(() => !!props.editEvent)

const form = reactive({
  name: '',
  type: '',
  date: '',
  description: '',
})

const loading = ref(false)

// Populate form when editing
watch(
  () => props.editEvent,
  (event) => {
    if (event) {
      form.name = event.name
      form.type = event.type
      form.date = event.date
      form.description = event.description || ''
    } else {
      form.name = ''
      form.type = ''
      form.date = ''
      form.description = ''
    }
  },
  { immediate: true }
)

function handleSubmit() {
  const data: { name: string; type: string; date: string; description?: string } = {
    name: form.name,
    type: form.type,
    date: form.date,
  }
  if (form.description.trim()) {
    data.description = form.description.trim()
  }
  emit('submit', data)
}
</script>

<style scoped>
.event-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 8px;
}
</style>
