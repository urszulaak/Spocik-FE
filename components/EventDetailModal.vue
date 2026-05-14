<template>
  <Teleport to="body">
    <div v-if="event" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ event.name }}</h2>
          <button class="btn btn-ghost btn-sm" @click="$emit('close')">✕</button>
        </div>

        <div class="modal-body">
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">Typ</span>
              <span class="badge" :class="typeBadgeClass">{{ event.type }}</span>
            </div>

            <div class="detail-item">
              <span class="detail-label">Data</span>
              <span class="detail-value">{{ formattedDate }}</span>
            </div>

            <div class="detail-item">
              <span class="detail-label">Tydzień</span>
              <span class="detail-value">{{ event.week }}</span>
            </div>

            <div class="detail-item">
              <span class="detail-label">Miesiąc</span>
              <span class="detail-value">{{ event.month }}</span>
            </div>

            <div class="detail-item">
              <span class="detail-label">Rok</span>
              <span class="detail-value">{{ event.year }}</span>
            </div>

            <div class="detail-item">
              <span class="detail-label">Autor</span>
              <span class="detail-value">👤 {{ event.author.username }}</span>
            </div>
          </div>

          <div v-if="event.description" class="detail-description">
            <span class="detail-label">Opis</span>
            <p>{{ event.description }}</p>
          </div>

          <!-- HATEOAS Links -->
          <div v-if="event._links" class="detail-links">
            <span class="detail-label">Linki HATEOAS</span>
            <div class="links-list">
              <div v-for="(link, key) in event._links" :key="key" class="link-item">
                <span class="badge badge-indigo" style="font-size:0.7rem;">{{ link.method }}</span>
                <code>{{ link.href }}</code>
              </div>
            </div>
          </div>
        </div>

        <div v-if="canEdit" class="modal-footer">
          <button class="btn btn-danger btn-sm" @click="$emit('delete', event)">
            🗑️ Usuń
          </button>
          <button class="btn btn-primary btn-sm" @click="$emit('edit', event)">
            ✏️ Edytuj
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { EventItem } from '~/types'

const props = defineProps<{
  event: EventItem | null
}>()

defineEmits<{
  close: []
  edit: [event: EventItem]
  delete: [event: EventItem]
}>()

const { user, isAdmin } = useAuth()

const canEdit = computed(() => {
  if (!user.value || !props.event) return false
  if (isAdmin.value) return true
  return user.value.id === props.event.author.id
})

const formattedDate = computed(() => {
  if (!props.event) return ''
  const d = new Date(props.event.date)
  return d.toLocaleDateString('pl-PL', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
})

const typeColors: Record<string, string> = {
  'Koncert': 'badge-violet',
  'Sport': 'badge-success',
  'Kultura': 'badge-indigo',
  'Edukacja': 'badge-warning',
}

const typeBadgeClass = computed(() => {
  if (!props.event) return 'badge-indigo'
  return typeColors[props.event.type] || 'badge-indigo'
})
</script>

<style scoped>
.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: 0.9375rem;
  color: var(--text-primary);
}

.detail-description {
  margin-bottom: 20px;
}

.detail-description p {
  margin-top: 6px;
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.detail-links {
  margin-top: 8px;
}

.links-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: var(--bg-card);
  border-radius: var(--radius-sm);
}

.link-item code {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  font-family: 'Courier New', monospace;
}
</style>
